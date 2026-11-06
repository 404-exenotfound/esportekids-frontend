import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CORES_CONFETE,
  FASES,
  GAME_HEIGHT,
  GAME_WIDTH,
  MENSAGENS_RODAPE,
  TEMPO_RESULTADO,
  TEMPO_SAQUE,
  TOTAL_TENTATIVAS,
} from "../utils/constantes";

import {
  FRASES_ERRO,
  FRASES_PONTO,
  FRASES_TORCIDA_ERRO,
  FRASES_TORCIDA_PONTO,
} from "../utils/frases";

import { calcularEstrelas } from "../helpers/calcularEstrelas";
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { nivelDoMomento } from "../helpers/nivelDoMomento";
import { sorteiaFrase } from "../helpers/sorteiaFrase";

import { useSons } from "./useSons";

/* ================= GEOMETRIA DA MESA (câmera em perspectiva — mantida) ================= */
// A mesa é um trapézio: o lado "far" (fundo, onde fica a IA) é mais estreito
// e mais alto na tela; o lado "near" (frente, jogador) é mais largo e mais
// baixo. z=0 é o fundo, z=1 é a frente. Essa é a câmera do jogo — não mexer.
const TABLE = {
  farLeft: 246,
  farRight: 554,
  nearLeft: 46,
  nearRight: 754,
  farY: 104,
  nearY: 346,
};

const AI_SIDE = 0.001;
const NET_SIDE = 0.3;
const PLAYER_SIDE = 0.99;

const PLAYER_PADDLE_W = 78;
const AI_PADDLE_W = 72;
const PLAYER_SPEED = 2.9;

const BASE_FLIGHT_TIME = 1.08;
const PLAYER_HIT_TOLERANCE = 0.19;
const AI_HIT_TOLERANCE = 0.27;

// Chance de a IA errar a próxima bola. Bola reta (rebatida no meio da
// raquete) é fácil; bola angulada (na ponta da raquete) passa mais.
// Fica um pouco mais difícil a cada ponto.
const CHANCE_ERRO_IA_BASE = 0.12;
const CHANCE_ERRO_IA_POR_ANGULO = 0.45;
const CHANCE_ERRO_IA_POR_PONTO = 0.03;
const CHANCE_ERRO_IA_MINIMA = 0.08;
// Quanto da devolução da IA vai para o lado oposto ao jogador
// (o resto cai em lugar aleatório). Ficar parado num canto não funciona.
const CHANCE_IA_JOGAR_LONGE = 0.75;

const TRAJETORIA = {
  INDO_PARA_AI: "indo_para_ai",
  INDO_PARA_JOGADOR: "indo_para_jogador",
  SERVE: "serve",
};

// ---- Janela de contato com a raquete -------------------------------------
// A bola voa de um lado ao outro (progress 0 → 1). A raquete só alcança a bola
// perto do fim do voo: entre JANELA_CONTATO_INICIO e JANELA_CONTATO_FIM. Se a
// bola não estiver ao alcance nessa janela, ela PASSA pela raquete e segue o
// caminho dela para fora da mesa (como na vida real), em vez de "voltar".
const JANELA_CONTATO_INICIO = 0.93;
const JANELA_CONTATO_FIM = 1.07;

// ---- Direção da rebatida (arrastar o mouse / setas) -----------------------
// A direção vem da velocidade lateral da raquete nos instantes antes do toque:
// arrastou para a direita → a bola vai para a direita; para a esquerda → esquerda.
const HISTORICO_RAQUETE_MS = 130; // janela usada para medir o arrasto
const ZONA_MORTA_DIRECAO = 0.35; // abaixo disso (tremida do mouse) a bola vai reta
const VELOCIDADE_DIRECAO_MAXIMA = 2.0; // arrasto que já vale a direção máxima
const ALCANCE_LATERAL_DIRECAO = 1.1; // quanto da mesa a bola cruza com direção máxima
const LIMITE_ALVO_DA_BOLA = 0.86; // a bola sempre cai dentro da mesa

// ---- Bola saindo da mesa depois de um erro --------------------------------
const GRAVIDADE_BOLA = 900; // px/s²
const ALTURA_BOLA_NA_RAQUETE = 26; // altura da bola na linha da raquete (px)
const ALTURA_CHAO = -50; // o chão fica abaixo do tampo da mesa (px)
const VELOCIDADE_SAIDA_JOGADOR = 0.95; // fração da velocidade do voo (vai p/ a câmera)
const VELOCIDADE_SAIDA_IA = 0.55; // (vai para o fundo da quadra)
const TEMPO_ATE_RESULTADO_SAIDA = 0.32; // s vendo a bola sair antes do banner
const TEMPO_MAXIMO_SAIDA = 1.2; // s até a bola sumir de vez

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;

const limitarVxPelaMesa = (x, vx, tempo) => {
  const limite = 0.9;
  const finalX = x + vx * tempo;
  if (finalX > limite) return (limite - x) / tempo;
  if (finalX < -limite) return (-limite - x) / tempo;
  return vx;
};

const tableWidthAt = (z) => lerp(TABLE.farRight - TABLE.farLeft, TABLE.nearRight - TABLE.nearLeft, z);
const tableCenterAt = (z) => lerp((TABLE.farLeft + TABLE.farRight) / 2, (TABLE.nearLeft + TABLE.nearRight) / 2, z);
const tableYAt = (z) => lerp(TABLE.farY, TABLE.nearY, z);
const screenX = (xNorm, z) => tableCenterAt(z) + xNorm * (tableWidthAt(z) / 2);
const screenY = (z) => tableYAt(z);

/* ================= PALETA 16-BITS ================= */
const PAL = {
  paredeEscura: "#10152b",
  parede: "#1b2440",
  paredeClara: "#303c63",
  parede2: "#263252",
  arquiEscura: "#1e2740",
  arqui: "#252e4a",
  arquiClara: "#3b496e",
  arqui2: "#33405f",
  pisoEscuro: "#0b0d17",
  piso: "#25263a",
  pisoLinha: "#2d3046",
  pisoRaio: "#292c40",
  mesaEscura: "#0a3f34",
  mesa: "#16745b",
  mesaClara: "#198a6b",
  mesaBrilho: "#2ea883",
  mesaBorda: "#f7fff9",
  redeEscura: "#080b12",
  redePoste: "#424a58",
  redeTopo: "#10131b",
  redeMalha: "#e9efed",
  redeLinha: "#26836c",
  bolaBrilho: "#ffffff",
  bolaSombra: "#d9dee2",
  bolaCentro: "#fff9c7",
  rastro: "#fff1a8",
  rastroSombra: "#f1d56c",
  jogadorEscura: "#c20d2b",
  jogador: "#ed183d",
  jogadorClara: "#ff5369",
  iaEscura: "#244ca9",
  ia: "#3268d9",
  iaClara: "#6795ff",
  madeiraEscura: "#8f3e08",
  madeira: "#c27616",
  madeiraClara: "#dfa03a",
  outline: "#11131b",
  impacto: "#ffe082",
  amarelo: "#ffd166",
  branco: "#ffffff",
};

/* ================= BOLA ================= */
const criarBola = () => ({
  x: 0,
  z: AI_SIDE,
  progress: 0,
  direction: 1,
  trajectory: TRAJETORIA.SERVE,
  flightTime: BASE_FLIGHT_TIME,
  vx: 0,
  spin: 0,
  bounceHeight: 0,
  trail: [],
  visible: true,
  canBeHit: false,
  bounceCount: 0,
  // Bola que passou da raquete e está saindo da mesa
  saindo: false,
  quemErrou: null,
  resolvido: false,
  saidaTempo: 0,
  saidaVz: 0,
  alt: ALTURA_BOLA_NA_RAQUETE,
  vAlt: 0,
});

/* ================= ESTADO INICIAL ================= */
const criarEstadoInicial = () => ({
  fase: FASES.INTRO,
  playerX: 0,
  aiX: 0,
  targetX: 0,
  historicoRaquete: [],
  tempoRaquete: 0,
  pointerActive: false,
  keys: { left: false, right: false },
  ball: criarBola(),
  pontos: 0,
  tentativa: 0,
  historico: [],
  serveRestante: 0,
  serveTempoTotal: 0,
  flashRestante: 0,
  resultadoRestante: 0,
  rally: 0,
  ultimoImpacto: 0,
  impactoX: 0,
  particulas: [],
  servidor: "jogador",
  lastHitTime: 0,
  lastHitSide: null,
});

/* ================= UTILITÁRIOS DE DESENHO ================= */
function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function disco(ctx, cx, cy, r, color) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y + 0.5));
    ctx.fillRect(cx - w, cy + y, w * 2 + 1, 1);
  }
}
function dither(ctx, x, y, w, h, corClara, corEscura) {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      rect(ctx, x + xx, y + yy, 1, 1, ((xx + yy) & 1) === 0 ? corClara : corEscura);
    }
  }
}
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function textPixel(ctx, text, x, y, size, color, align = "center") {
  ctx.save();
  ctx.font = `bold ${size}px "Press Start 2P", monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#11131f";
  ctx.fillText(text, x + 3, y + 3);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawPixelDiamond(ctx, cx, cy, size, color, shadow) {
  rect(ctx, cx - size * 0.28, cy - size * 0.48, size * 0.56, size * 0.18, shadow);
  rect(ctx, cx - size * 0.46, cy - size * 0.25, size * 0.92, size * 0.5, color);
  rect(ctx, cx - size * 0.28, cy + size * 0.25, size * 0.56, size * 0.18, shadow);
  rect(ctx, cx - size * 0.14, cy - size * 0.58, size * 0.22, size * 0.12, PAL.bolaBrilho);
}

/* ================= CENÁRIO (ginásio: arquibancada com torcida, placar, piso) ================= */
const PELES = ["#f4bf91", "#d99568", "#a86a3d", "#7a4a2a"];
const ROUPAS = ["#e63946", "#ffd166", "#60a5fa", "#ffffff", "#06d6a0", "#9b59d0"];

function drawBackground(ctx) {
  rect(ctx, 0, 0, GAME_WIDTH, GAME_HEIGHT, PAL.paredeEscura);
  rect(ctx, 0, 0, GAME_WIDTH, 18, PAL.parede);
  dither(ctx, 0, 16, GAME_WIDTH, 4, PAL.paredeClara, PAL.parede);
  rect(ctx, 0, 64, GAME_WIDTH, 4, PAL.parede2);

  // Arquibancada com gente sentada (cabeça + corpo), em vez de blocos lisos.
  const r = rng(5);
  const ri = (min, max) => Math.floor(min + r() * (max - min));
  for (let row = 0; row < 4; row += 1) {
    const y = 24 + row * 16;
    rect(ctx, 34 + row * 7, y, 732 - row * 14, 10, row % 2 ? PAL.arqui : PAL.arquiEscura);
    for (let x = 58 + row * 12; x < 748 - row * 12; x += 22) {
      rect(ctx, x, y + 4, 8, 6, ROUPAS[ri(0, ROUPAS.length)]);
      disco(ctx, x + 4, y + 3, 3, PELES[ri(0, PELES.length)]);
    }
  }

  // Faixas decorativas nas laterais da arquibancada.
  rect(ctx, 72, 78, 142, 5, "#5c6d9b");
  rect(ctx, 586, 78, 142, 5, "#5c6d9b");
  rect(ctx, 82, 76, 40, 2, PAL.amarelo);
  rect(ctx, 678, 76, 40, 2, PAL.amarelo);

  // Placar luminoso central, pendurado no alto do ginásio.
  rect(ctx, 338, 4, 124, 12, PAL.outline);
  rect(ctx, 340, 6, 120, 8, "#0d2f22");
  for (let i = 0; i < 9; i += 1) {
    disco(ctx, 350 + i * 12, 10, 2, i % 2 === 0 ? PAL.amarelo : "#2fe6a0");
  }

  // Piso com linhas de fuga convergindo para o centro da mesa (profundidade).
  rect(ctx, 0, 89, GAME_WIDTH, 311, PAL.piso);
  for (let y = 104; y < 400; y += 18) rect(ctx, 0, y, GAME_WIDTH, 2, PAL.pisoLinha);
  for (let x = -400; x < 1200; x += 55) {
    ctx.save();
    ctx.fillStyle = PAL.pisoRaio;
    ctx.beginPath();
    ctx.moveTo(400, 92);
    ctx.lineTo(x, 400);
    ctx.lineTo(x + 2, 400);
    ctx.lineTo(402, 92);
    ctx.fill();
    ctx.restore();
  }
  rect(ctx, 0, 394, GAME_WIDTH, 6, PAL.pisoEscuro);
}

/* ================= MESA + REDE (trapézio em perspectiva — geometria mantida) ================= */
function drawNet(ctx) {
  const left = screenX(-1, NET_SIDE);
  const right = screenX(1, NET_SIDE);
  const y = screenY(NET_SIDE);
  const netWidth = right - left;

  ctx.save();
  ctx.globalAlpha = 0.35;
  rect(ctx, left - 3, y + 4, netWidth + 6, 7, "#000000");
  ctx.restore();

  rect(ctx, left - 7, y - 30, 9, 62, PAL.redeEscura);
  rect(ctx, right - 2, y - 30, 9, 62, PAL.redeEscura);
  rect(ctx, left - 5, y - 26, 4, 54, PAL.redePoste);
  rect(ctx, right, y - 26, 4, 54, PAL.redePoste);

  rect(ctx, left, y - 24, netWidth, 6, PAL.redeTopo);
  rect(ctx, left + 3, y - 22, netWidth - 6, 3, PAL.branco);
  rect(ctx, left, y - 18, netWidth, 38, PAL.redeMalha);
  for (let x = left + 3; x < right - 2; x += 7) rect(ctx, x, y - 17, 2, 35, PAL.redeLinha);
  for (let yy = y - 15; yy < y + 18; yy += 6) rect(ctx, left + 1, yy, netWidth - 2, 2, PAL.redeLinha);
  rect(ctx, left - 2, y + 18, netWidth + 4, 6, PAL.redeEscura);
  rect(ctx, left + 2, y + 18, netWidth - 4, 3, PAL.branco);
}

function drawTable(ctx) {
  const fl = TABLE.farLeft;
  const fr = TABLE.farRight;
  const nl = TABLE.nearLeft;
  const nr = TABLE.nearRight;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.beginPath();
  ctx.moveTo(nl - 14, TABLE.nearY + 12);
  ctx.lineTo(nr + 14, TABLE.nearY + 12);
  ctx.lineTo(fr + 32, TABLE.farY + 22);
  ctx.lineTo(fl - 32, TABLE.farY + 22);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(fl, TABLE.farY);
  ctx.lineTo(fr, TABLE.farY);
  ctx.lineTo(nr, TABLE.nearY);
  ctx.lineTo(nl, TABLE.nearY);
  ctx.closePath();
  ctx.fillStyle = PAL.mesa;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(nl, TABLE.nearY);
  ctx.lineTo(nr, TABLE.nearY);
  ctx.lineTo(nr + 4, TABLE.nearY + 13);
  ctx.lineTo(nl - 4, TABLE.nearY + 13);
  ctx.closePath();
  ctx.fillStyle = PAL.mesaEscura;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(fl + 7, TABLE.farY + 5);
  ctx.lineTo(fr - 7, TABLE.farY + 5);
  ctx.lineTo(nr - 11, TABLE.nearY - 9);
  ctx.lineTo(nl + 11, TABLE.nearY - 9);
  ctx.closePath();
  ctx.fillStyle = PAL.mesaBrilho;
  ctx.globalAlpha = 0.38;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = PAL.mesaBorda;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(fl, TABLE.farY);
  ctx.lineTo(fr, TABLE.farY);
  ctx.lineTo(nr, TABLE.nearY);
  ctx.lineTo(nl, TABLE.nearY);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo((fl + fr) / 2, TABLE.farY);
  ctx.lineTo((fl + fr) / 2, screenY(NET_SIDE) - 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo((nl + nr) / 2, screenY(NET_SIDE) + 5);
  ctx.lineTo((nl + nr) / 2, TABLE.nearY);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(nl, TABLE.nearY);
  ctx.lineTo(nr, TABLE.nearY);
  ctx.stroke();

  rect(ctx, 112, 348, 12, 46, PAL.outline);
  rect(ctx, 676, 348, 12, 46, PAL.outline);
  rect(ctx, 82, 389, 74, 7, PAL.pisoEscuro);
  rect(ctx, 644, 389, 74, 7, PAL.pisoEscuro);
  rect(ctx, 118, 355, 7, 36, "#4b5261");
  rect(ctx, 681, 355, 7, 36, "#4b5261");
  rect(ctx, 91, 393, 14, 4, "#090b11");
  rect(ctx, 686, 393, 14, 4, "#090b11");

  drawNet(ctx);
}

/* ================= RAQUETE (geometria mantida, só retonada) ================= */
function drawPaddle(ctx, xNorm, z, width, isPlayer) {
  const cx = screenX(xNorm, z);
  const y = screenY(z);
  const scale = 0.74 + z * 0.42;
  const w = Math.max(50, width * scale);

  const headW = w;
  const headH = Math.max(38, 48 * scale);
  const border = Math.max(2, 3 * scale);
  const headTop = y - headH - 10;
  const handleW = Math.max(8, 11 * scale);
  const handleH = Math.max(25, 33 * scale);
  const handleX = cx - handleW / 2;
  const handleY = headTop + headH - 1;

  const outline = PAL.outline;
  const mainColor = isPlayer ? PAL.jogador : PAL.ia;
  const darkColor = isPlayer ? PAL.jogadorEscura : PAL.iaEscura;
  const lightColor = isPlayer ? PAL.jogadorClara : PAL.iaClara;
  const woodDark = PAL.madeiraEscura;
  const wood = PAL.madeira;
  const woodLight = PAL.madeiraClara;

  ctx.save();
  ctx.globalAlpha = 0.22;
  rect(ctx, cx - headW / 2 + 8, headTop + headH + 7, headW - 16, 5, "#000000");
  ctx.restore();

  rect(ctx, handleX - 2, handleY - 2, handleW + 4, handleH + 4, outline);
  rect(ctx, handleX, handleY, handleW, handleH, woodDark);
  rect(ctx, handleX + 2, handleY + 2, handleW - 4, handleH - 4, wood);
  rect(ctx, handleX + 3, handleY + 3, Math.max(2, handleW * 0.22), handleH - 7, woodLight);
  rect(ctx, handleX - 2, handleY + handleH - 3, handleW + 4, 4, outline);

  const left = cx - headW / 2;
  const top = headTop;
  const corner = Math.max(5, headW * 0.075);

  rect(ctx, left + 2, top + corner, headW - 4, headH - corner * 2, mainColor);
  rect(ctx, left + corner, top + 2, headW - corner * 2, corner, mainColor);
  rect(ctx, left + corner, top + headH - corner - 2, headW - corner * 2, corner, mainColor);

  rect(ctx, left + corner, top, headW - corner * 2, border, outline);
  rect(ctx, left + 3, top + 3, corner - 1, border, outline);
  rect(ctx, left + headW - corner - 2, top + 3, corner - 1, border, outline);
  rect(ctx, left, top + corner, border, headH - corner * 2, outline);
  rect(ctx, left + headW - border, top + corner, border, headH - corner * 2, outline);
  rect(ctx, left + 3, top + headH - 5, corner - 1, border, outline);
  rect(ctx, left + headW - corner - 2, top + headH - 5, corner - 1, border, outline);
  rect(ctx, left + corner, top + headH - border, headW - corner * 2, border, outline);

  rect(ctx, left + 3, top + corner + 2, 3, headH - corner * 2 - 4, darkColor);
  rect(ctx, left + headW - 6, top + corner + 2, 3, headH - corner * 2 - 4, darkColor);

  rect(ctx, left + corner + 4, top + 5, headW - corner * 2 - 8, 3, lightColor);
  rect(ctx, left + headW * 0.25, top + 8, headW * 0.22, 2, "#ffffff");

  rect(ctx, cx - headW * 0.19, top + headH * 0.43, headW * 0.38, 3, darkColor);
  rect(ctx, cx - headW * 0.12, top + headH * 0.54, headW * 0.24, 2, lightColor);
}

/* ================= BOLA (geometria mantida, só retonada) ================= */
function drawBall(ctx, d) {
  const b = d.ball;
  if (!b.visible) return;

  // Bola saindo da mesa: segue a reta do voo (z fora de 0..1) e cai até o chão
  const z = b.saindo ? b.z : clamp(b.z, 0, 1);
  const baseX = screenX(b.x, z);
  const baseY = screenY(z);
  const arc = b.saindo ? 0 : Math.sin(Math.PI * clamp(b.progress, 0, 1));
  const height = b.saindo ? b.alt : 26 + arc * 48;
  const x = baseX;
  const y = baseY - height;

  const naMesa = !b.saindo || (b.z >= 0 && b.z <= 1 && Math.abs(b.x) <= 1);
  const shadowW = 9 + arc * 10;
  const shadowH = 3 + arc * 3;
  ctx.save();
  ctx.globalAlpha = 0.24 + (1 - arc) * 0.25;
  ctx.fillStyle = "#06140f";
  // Fora da mesa a sombra fica no chão, mais abaixo
  ctx.fillRect(x - shadowW / 2, (naMesa ? baseY : baseY - ALTURA_CHAO) - shadowH / 2, shadowW, shadowH);
  ctx.restore();

  for (let i = 0; i < b.trail.length; i += 1) {
    const t = b.trail[i];
    ctx.save();
    ctx.globalAlpha = ((i + 1) / b.trail.length) * 0.18;
    drawPixelDiamond(ctx, t.x, t.y, 7, PAL.rastro, PAL.rastroSombra);
    ctx.restore();
  }

  drawPixelDiamond(ctx, x, y, 12, PAL.bolaBrilho, PAL.bolaSombra);
  rect(ctx, x - 2, y - 3, 3, 3, PAL.bolaCentro);
}

/* ================= IMPACTO ================= */
function drawImpact(ctx, d) {
  if (d.ultimoImpacto <= 0) return;

  const alpha = clamp(d.ultimoImpacto / 180, 0, 1);
  const cx = screenX(d.impactoX, PLAYER_SIDE);
  const cy = screenY(PLAYER_SIDE) - 5;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = PAL.impacto;
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i += 1) {
    const a = (Math.PI * 2 * i) / 8;
    const r1 = 13;
    const r2 = 20;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }
  ctx.restore();
}

/* ================= INDICADOR DE SAQUE ================= */
function drawServeIndicator(ctx, d) {
  const cx = GAME_WIDTH / 2;
  const cy = 55;

  if (d.flashRestante > 0) {
    const alpha = clamp(d.flashRestante / 260, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    textPixel(ctx, "JOGA!", cx, cy, 23, PAL.amarelo);
    ctx.restore();
    return;
  }

  const numero = Math.max(1, Math.ceil(d.serveRestante / 400));
  rect(ctx, cx - 57, cy - 25, 114, 46, "#10131f");
  rect(ctx, cx - 52, cy - 20, 104, 36, PAL.amarelo);
  textPixel(ctx, String(numero), cx, cy - 1, 22, PAL.jogador);
}

/* ================= PARTÍCULAS ================= */
function drawParticles(ctx, d) {
  for (const p of d.particulas) {
    if (p.life <= 0) continue;
    ctx.save();
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    rect(ctx, p.x, p.y, p.size, p.size, p.color);
    ctx.restore();
  }
}

function spawnImpactParticles(d, xNorm, colors = PAL.impacto, count = 8, offsetY = -18, viesX = 0) {
  const paleta = Array.isArray(colors) ? colors : [colors];
  const cx = screenX(xNorm, PLAYER_SIDE);
  const cy = screenY(PLAYER_SIDE) + offsetY;
  const forte = count > 8;

  for (let i = 0; i < count; i += 1) {
    d.particulas.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * (forte ? 170 : 90) + viesX * 110,
      vy: -30 - Math.random() * (forte ? 150 : 80),
      life: (forte ? 350 : 280) + Math.random() * (forte ? 400 : 160),
      maxLife: forte ? 700 : 440,
      size: 3 + Math.random() * 3,
      color: paleta[Math.floor(Math.random() * paleta.length)],
    });
  }
}

function updateParticles(d, dt) {
  for (const p of d.particulas) {
    p.life -= dt * 1000;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 150 * dt;
  }
  if (d.particulas.length > 120) d.particulas = d.particulas.slice(-120);
}

/* ================= CENA ================= */
function drawScene(ctx, d) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.imageSmoothingEnabled = false;

  drawBackground(ctx);
  drawTable(ctx);

  drawPaddle(ctx, d.aiX, AI_SIDE, AI_PADDLE_W, false);
  drawPaddle(ctx, d.playerX, PLAYER_SIDE, PLAYER_PADDLE_W, true);

  drawBall(ctx, d);
  drawImpact(ctx, d);
  drawParticles(ctx, d);

  if (d.fase === FASES.SERVINDO || d.flashRestante > 0) drawServeIndicator(ctx, d);

  if (d.fase === FASES.JOGANDO && d.ball.trajectory === TRAJETORIA.INDO_PARA_JOGADOR && !d.ball.saindo) {
    textPixel(ctx, "ALINHE A RAQUETE E ARRASTE PARA O LADO QUE QUER JOGAR", 400, 382, 7, PAL.branco);
  }
}

/* ================= DIREÇÃO DA REBATIDA ================= */
// Velocidade lateral da raquete (unidades da mesa por segundo) medida nos
// últimos HISTORICO_RAQUETE_MS: é o "arrasto" do jogador na hora do toque.
const velocidadeDaRaquete = (d) => {
  const h = d.historicoRaquete;
  if (h.length < 2) return 0;
  const primeiro = h[0];
  const ultimo = h[h.length - 1];
  const span = (ultimo.t - primeiro.t) / 1000;
  if (span < 0.03) return 0;
  return (ultimo.x - primeiro.x) / span;
};

// -1 (esquerda) … 0 (reta) … +1 (direita)
const intencaoDeDirecao = (d) => {
  const v = velocidadeDaRaquete(d);
  if (Math.abs(v) < ZONA_MORTA_DIRECAO) return 0;
  return clamp(
    (v - Math.sign(v) * ZONA_MORTA_DIRECAO) / (VELOCIDADE_DIRECAO_MAXIMA - ZONA_MORTA_DIRECAO),
    -1,
    1
  );
};

/* ================= BOLA SAINDO DA MESA ================= */
// A bola passou da raquete sem ser rebatida: continua no mesmo sentido (z segue
// além da ponta da mesa, x segue o desvio lateral), cai por gravidade, quica no
// chão e perde velocidade até sumir.
const iniciarSaida = (d, quem) => {
  const b = d.ball;
  const vzDoVoo = (PLAYER_SIDE - AI_SIDE) / Math.max(0.72, b.flightTime);
  b.saindo = true;
  b.quemErrou = quem;
  b.resolvido = false;
  b.saidaTempo = 0;
  b.saidaVz = vzDoVoo * (quem === "jogador" ? VELOCIDADE_SAIDA_JOGADOR : VELOCIDADE_SAIDA_IA);
  b.alt = ALTURA_BOLA_NA_RAQUETE;
  b.vAlt = 40;
  b.canBeHit = false;
};

const atualizarSaida = (d, dt) => {
  const b = d.ball;
  if (!b.saindo || !b.visible) return;

  b.saidaTempo += dt;
  // direction > 0 vai para o fundo (z diminui); direction < 0 vem para o jogador (z aumenta)
  b.z -= b.direction * b.saidaVz * dt;
  b.x += b.vx * dt;

  b.vAlt -= GRAVIDADE_BOLA * dt;
  b.alt += b.vAlt * dt;
  if (b.alt <= ALTURA_CHAO) {
    b.alt = ALTURA_CHAO;
    b.vAlt = Math.abs(b.vAlt) > 90 ? -b.vAlt * 0.5 : 0;
  }
  if (b.alt === ALTURA_CHAO) {
    const atrito = Math.max(0, 1 - 2.2 * dt);
    b.saidaVz *= atrito;
    b.vx *= atrito;
  }

  b.trail.push({ x: screenX(b.x, b.z), y: screenY(b.z) - b.alt });
  if (b.trail.length > 6) b.trail.shift();

  const y = screenY(b.z) - b.alt;
  if (b.saidaTempo > TEMPO_MAXIMO_SAIDA || y > GAME_HEIGHT + 20) b.visible = false;
};

/* ================= HOOK ================= */
export function usePingpong({ pausado = false } = {}) {
  const navigate = useNavigate();

  // Celular em pé (aviso de girar na tela): o loop só redesenha
  const pausadoRef = useRef(pausado);
  useEffect(() => {
    pausadoRef.current = pausado;
  }, [pausado]);

  const [fase, setFase] = useState(FASES.INTRO);
  const [pontos, setPontos] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [somLigado, setSomLigado] = useState(true);
  const [rally, setRally] = useState(0);
  const [fraseResultado, setFraseResultado] = useState("");
  const [fraseTorcida, setFraseTorcida] = useState("");

  const canvasRef = useRef(null);
  const dataRef = useRef(null);
  if (dataRef.current === null) {
    dataRef.current = criarEstadoInicial();
    dataRef.current.lastHitTime = 0;
    dataRef.current.lastHitSide = null;
  }

  const { garantirAudio, tocarToque, tocarPonto, tocarErro } = useSons(somLigado);

  const alternarSom = useCallback(() => setSomLigado((s) => !s), []);
  const voltarParaHome = useCallback(() => navigate("/home"), [navigate]);

  const iniciarJogo = useCallback(() => {
    garantirAudio();
    const d = criarEstadoInicial();
    d.servidor = "jogador";
    d.fase = FASES.SERVINDO;
    d.serveRestante = TEMPO_SAQUE;
    d.ball.trajectory = TRAJETORIA.SERVE;
    d.ball.z = PLAYER_SIDE;
    d.ball.x = d.playerX;
    dataRef.current = d;

    setPontos(0);
    setTentativa(0);
    setHistorico([]);
    setRally(0);
    setFraseResultado("");
    setFraseTorcida("");
    setFase(FASES.SERVINDO);
  }, [garantirAudio]);

  // ---------- controles (mouse/toque + teclado) ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const getTargetX = (clientX) => {
      const r = canvas.getBoundingClientRect();
      const normalized = ((clientX - r.left) / r.width) * 2 - 1;
      return clamp(normalized, -0.88, 0.88);
    };

    const onPointerMove = (event) => {
      const d = dataRef.current;
      d.pointerActive = true;
      d.targetX = getTargetX(event.clientX);
    };
    const onPointerDown = (event) => {
      const d = dataRef.current;
      d.pointerActive = true;
      d.targetX = getTargetX(event.clientX);
    };
    const onKeyDown = (event) => {
      const d = dataRef.current;
      if (["ArrowLeft", "KeyA", "ArrowRight", "KeyD"].includes(event.code)) {
        event.preventDefault();
        d.pointerActive = false;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") d.keys.left = true;
      if (event.code === "ArrowRight" || event.code === "KeyD") d.keys.right = true;
    };
    const onKeyUp = (event) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") dataRef.current.keys.left = false;
      if (event.code === "ArrowRight" || event.code === "KeyD") dataRef.current.keys.right = false;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // ---------- loop principal ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let rafId = 0;
    let last = 0;

    const moverJogador = (d, dt) => {
      if (d.pointerActive) {
        d.playerX += (d.targetX - d.playerX) * Math.min(1, dt * 13);
      } else {
        if (d.keys.left) d.playerX -= PLAYER_SPEED * dt;
        if (d.keys.right) d.playerX += PLAYER_SPEED * dt;
      }
      d.playerX = clamp(d.playerX, -0.88, 0.88);

      // Guarda o caminho recente da raquete para saber para onde ela "arrastou"
      d.tempoRaquete += dt * 1000;
      d.historicoRaquete.push({ t: d.tempoRaquete, x: d.playerX });
      while (
        d.historicoRaquete.length > 1 &&
        d.tempoRaquete - d.historicoRaquete[0].t > HISTORICO_RAQUETE_MS
      ) {
        d.historicoRaquete.shift();
      }
    };

    // Decide na hora da rebatida se a IA vai errar a bola que está indo
    const sortearErroIa = (d, angulo) => {
      const chance = Math.max(
        CHANCE_ERRO_IA_MINIMA,
        CHANCE_ERRO_IA_BASE + angulo * CHANCE_ERRO_IA_POR_ANGULO - d.pontos * CHANCE_ERRO_IA_POR_PONTO
      );
      d.iaVaiErrar = Math.random() < chance;
    };

    const moverIa = (d, dt) => {
      const indoParaIa = d.ball.trajectory === TRAJETORIA.INDO_PARA_AI;
      let alvo = indoParaIa ? d.ball.x : d.ball.x * 0.45;
      // Quando vai errar, a IA "lê" a bola errado e chega atrasada
      if (indoParaIa && d.iaVaiErrar) alvo = d.ball.x - Math.sign(d.ball.x || 1) * 0.6;
      const erro = 0.035 + (d.pontos >= 3 ? 0.025 : 0.055);
      alvo += Math.sin(d.rally * 1.7 + d.serveTempoTotal) * erro;
      const velocidade = 1.15 + d.pontos * 0.05;
      const maxMove = velocidade * dt;
      const delta = clamp(alvo - d.aiX, -maxMove, maxMove);
      d.aiX = clamp(d.aiX + delta, -0.88, 0.88);
    };

    const resolverResultado = (d, ganhou) => {
      d.tentativa += 1;
      setTentativa(d.tentativa);

      if (ganhou) {
        d.pontos += 1;
        setPontos(d.pontos);
        d.historico = [...d.historico, "ponto"];
        setHistorico(d.historico);
        setFraseResultado(sorteiaFrase(FRASES_PONTO));
        setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_PONTO));
        tocarPonto();
        spawnImpactParticles(d, d.ball.x, CORES_CONFETE, 36);
        d.servidor = "jogador";
      } else {
        d.historico = [...d.historico, "erro"];
        setHistorico(d.historico);
        setFraseResultado(sorteiaFrase(FRASES_ERRO));
        setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_ERRO));
        tocarErro();
        spawnImpactParticles(d, d.playerX, "#e63946");
        d.servidor = "ia";
      }

      d.fase = ganhou ? FASES.PONTO : FASES.ERRO;
      d.resultadoRestante = TEMPO_RESULTADO;
      // A bola que passou da raquete continua saindo da mesa durante o banner
      if (!d.ball.saindo) d.ball.visible = false;
      d.ball.canBeHit = false;
      setFase(d.fase);
    };

    const rebaterJogador = (d, now) => {
      const b = d.ball;

      // Onde a bola bateu na raquete + para que lado o jogador arrastou
      const offset = clamp((b.x - d.playerX) / PLAYER_HIT_TOLERANCE, -1, 1);
      const intencao = intencaoDeDirecao(d);
      const tempo = Math.max(0.76, b.flightTime * 0.94);

      // Ponto da mesa (lado da IA) para onde a bola vai: obedece o arrasto
      const saidaX = clamp(b.x, -0.9, 0.9);
      const alvoX = clamp(
        saidaX + intencao * ALCANCE_LATERAL_DIRECAO + offset * 0.25,
        -LIMITE_ALVO_DA_BOLA,
        LIMITE_ALVO_DA_BOLA
      );
      b.vx = limitarVxPelaMesa(saidaX, (alvoX - saidaX) / tempo, tempo);
      b.spin = clamp(b.spin * 0.35 + offset * 0.18, -0.34, 0.34);
      b.flightTime = tempo;
      d.ultimoImpacto = 180;
      d.impactoX = d.playerX;
      d.rally += 1;
      setRally(d.rally);
      tocarToque();
      spawnImpactParticles(d, d.playerX, "#ffe082", 8, -18, intencao);

      b.direction = 1;
      b.trajectory = TRAJETORIA.INDO_PARA_AI;
      b.canBeHit = false;
      b.progress = 0;
      b.z = PLAYER_SIDE;
      b.x = saidaX;
      b.trail = [];
      d.lastHitSide = "player";
      d.lastHitTime = now;
      // Quanto mais aberta a bola, mais difícil para a IA
      sortearErroIa(d, clamp(Math.abs(alvoX - saidaX) / ALCANCE_LATERAL_DIRECAO, 0, 1));
    };

    const rebaterIa = (d, now, tolerancia) => {
      const b = d.ball;
      const offset = clamp((b.x - d.aiX) / tolerancia, -1, 1);
      b.spin = clamp(b.spin * 0.3 + offset * 0.08, -0.2, 0.2);
      b.flightTime = Math.max(0.82, b.flightTime * 0.99);

      // Mira longe do jogador (na maioria das vezes), para ele ter que se
      // mexer. vx é calculado para a bola chegar perto desse ponto.
      const ladoDoJogador = Math.sign(d.playerX) || (Math.random() < 0.5 ? -1 : 1);
      const alvoX = Math.random() < CHANCE_IA_JOGAR_LONGE
        ? -ladoDoJogador * (0.25 + Math.random() * 0.5)
        : Math.random() * 1.2 - 0.6;
      const saidaX = clamp(b.x, -0.9, 0.9);
      b.vx = limitarVxPelaMesa(
        saidaX,
        clamp((alvoX - saidaX) / (b.flightTime + 0.12), -1.8, 1.8),
        b.flightTime
      );
      d.ultimoImpacto = 140;
      d.impactoX = d.aiX;
      d.rally += 1;
      setRally(d.rally);
      tocarToque();

      b.direction = -1;
      b.trajectory = TRAJETORIA.INDO_PARA_JOGADOR;
      b.canBeHit = false;
      b.progress = 0;
      b.z = AI_SIDE;
      b.x = saidaX;
      b.trail = [];
      d.lastHitSide = "ai";
      d.lastHitTime = now;
    };

    // A bola voa de um lado ao outro. O progresso passa de 1 na janela de
    // contato: se ninguém rebate, ela segue em frente (z fora da mesa).
    const atualizarBola = (d, dt) => {
      const b = d.ball;
      if (!b.visible) return;
      if (b.saindo) {
        atualizarSaida(d, dt);
        return;
      }

      const tempo = Math.max(0.72, b.flightTime);
      b.progress += dt / tempo;
      const p = b.progress;

      // lerp não limita: com p > 1 a bola continua além da raquete
      b.z = b.direction > 0 ? lerp(PLAYER_SIDE, AI_SIDE, p) : lerp(AI_SIDE, PLAYER_SIDE, p);

      b.x += b.vx * dt;
      b.x = clamp(b.x, -0.95, 0.95);

      const arc = Math.sin(Math.PI * clamp(p, 0, 1));
      b.trail.push({ x: screenX(b.x, b.z), y: screenY(b.z) - (25 + arc * 48) });
      if (b.trail.length > 6) b.trail.shift();
    };

    // Raquete alcançou a bola? Rebate. Passou da janela? A bola sai da mesa.
    const resolverContato = (d, now) => {
      const b = d.ball;
      if (b.saindo) {
        // Se a bola já saiu da tela (some antes do tempo), não espera mais: o
        // contador da saída para quando ela fica invisível e travaria o jogo.
        if (!b.resolvido && (b.saidaTempo >= TEMPO_ATE_RESULTADO_SAIDA || !b.visible)) {
          b.resolvido = true;
          resolverResultado(d, b.quemErrou === "ia");
        }
        return;
      }

      b.canBeHit = b.progress >= JANELA_CONTATO_INICIO;
      if (!b.canBeHit) return;

      if (b.trajectory === TRAJETORIA.INDO_PARA_JOGADOR) {
        if (Math.abs(b.x - d.playerX) <= PLAYER_HIT_TOLERANCE) rebaterJogador(d, now);
        else if (b.progress > JANELA_CONTATO_FIM) iniciarSaida(d, "jogador");
      } else if (b.trajectory === TRAJETORIA.INDO_PARA_AI) {
        const tolerancia = AI_HIT_TOLERANCE + Math.max(0, 0.035 - d.pontos * 0.004);
        if (!d.iaVaiErrar && Math.abs(b.x - d.aiX) <= tolerancia) rebaterIa(d, now, tolerancia);
        else if (b.progress > JANELA_CONTATO_FIM) iniciarSaida(d, "ia");
      }
    };

    const step = (timestamp) => {
      if (!last) last = timestamp;
      const dt = Math.min((timestamp - last) / 1000, 0.032);
      last = timestamp;

      if (pausadoRef.current) {
        drawScene(ctx, dataRef.current);
        rafId = requestAnimationFrame(step);
        return;
      }

      const d = dataRef.current;
      const now = timestamp;
      d.ultimoImpacto = Math.max(0, d.ultimoImpacto - dt * 1000);
      d.flashRestante = Math.max(0, d.flashRestante - dt * 1000);
      updateParticles(d, dt);

      if (d.fase === FASES.SERVINDO) {
        moverJogador(d, dt);
        moverIa(d, dt);
        d.serveTempoTotal += dt;
        d.serveRestante -= dt * 1000;
        if (d.servidor === "jogador") {
          d.ball.x = d.playerX;
          d.ball.progress = 0;
          d.ball.z = PLAYER_SIDE;
        } else {
          d.ball.progress = (Math.sin(d.serveTempoTotal * 5) + 1) / 2;
          d.ball.z = AI_SIDE + d.ball.progress * 0.04;
          d.ball.x = d.aiX;
        }
        d.ball.canBeHit = false;
        d.ball.trail = [];

        if (d.serveRestante <= 0) {
          d.flashRestante = 420;
          d.fase = FASES.JOGANDO;
          d.rally = 0;
          setRally(0);
          d.ball = criarBola();
          d.ball.trail = [];
          d.lastHitSide = null;
          d.lastHitTime = 0;
          d.iaVaiErrar = false;
          if (d.servidor === "jogador") {
            d.ball.direction = 1;
            d.ball.trajectory = TRAJETORIA.INDO_PARA_AI;
            d.ball.z = PLAYER_SIDE;
            d.ball.x = d.playerX;
            // Saque é bola reta: chance base de a IA errar
            sortearErroIa(d, 0);
          } else {
            d.ball.direction = -1;
            d.ball.trajectory = TRAJETORIA.INDO_PARA_JOGADOR;
            d.ball.z = AI_SIDE;
            d.ball.x = d.aiX;
          }
          d.ball.flightTime = 1.05;
          setFase(FASES.JOGANDO);
        }
      } else if (d.fase === FASES.JOGANDO) {
        moverJogador(d, dt);
        moverIa(d, dt);
        atualizarBola(d, dt);
        resolverContato(d, now);
      } else if (d.fase === FASES.PONTO || d.fase === FASES.ERRO) {
        d.resultadoRestante -= dt * 1000;
        atualizarSaida(d, dt);
        if (d.resultadoRestante <= 0) {
          if (d.tentativa >= TOTAL_TENTATIVAS) {
            d.fase = FASES.FIM_DE_JOGO;
            setFase(FASES.FIM_DE_JOGO);
          } else {
            d.fase = FASES.SERVINDO;
            d.serveRestante = TEMPO_SAQUE;
            d.serveTempoTotal = 0;
            d.flashRestante = 0;
            d.rally = 0;
            setRally(0);
            d.ball = criarBola();
            d.ball.trail = [];
            d.lastHitSide = null;
            d.lastHitTime = 0;
            if (d.servidor === "jogador") {
              d.ball.z = PLAYER_SIDE;
              d.ball.x = d.playerX;
            } else {
              d.ball.z = AI_SIDE;
              d.ball.x = d.aiX;
            }
            d.ball.trajectory = TRAJETORIA.SERVE;
            setFase(FASES.SERVINDO);
          }
        }
      }

      drawScene(ctx, d);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      last = 0;
    };
  }, [tocarToque, tocarPonto, tocarErro]);

  const nivel = nivelDoMomento(pontos);
  const emJogo = fase !== FASES.INTRO && fase !== FASES.FIM_DE_JOGO;

  return {
    canvasRef,
    emJogo,
    mostrarFimDeJogo: fase === FASES.FIM_DE_JOGO,
    mostrarBanner: fase === FASES.PONTO || fase === FASES.ERRO,
    bannerTipo: fase === FASES.PONTO ? "ponto" : "erro",
    tentativaExibida: Math.min(tentativa, TOTAL_TENTATIVAS),
    pontos,
    bolinhas: historico,
    nivel,
    rally,
    somLigado,
    alternarSom,
    fraseResultado,
    fraseTorcida,
    mensagemRodape: MENSAGENS_RODAPE[fase] ?? "",
    estrelas: calcularEstrelas(pontos),
    emojiFinal: emojiDoResultadoFinal(pontos),
    iniciarJogo,
    voltarParaHome,
  };
}