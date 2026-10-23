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

const TRAJETORIA = {
  INDO_PARA_AI: "indo_para_ai",
  QUICOU_AI: "quicou_ai",
  INDO_PARA_JOGADOR: "indo_para_jogador",
  QUICOU_JOGADOR: "quicou_jogador",
  SERVE: "serve",
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;

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
});

/* ================= ESTADO INICIAL ================= */
const criarEstadoInicial = () => ({
  fase: FASES.INTRO,
  playerX: 0,
  aiX: 0,
  targetX: 0,
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

  const z = clamp(b.z, 0, 1);
  const baseX = screenX(b.x, z);
  const baseY = screenY(z);
  const arc = Math.sin(Math.PI * clamp(b.progress, 0, 1));
  const height = 26 + arc * 48;
  const x = baseX;
  const y = baseY - height;

  const shadowW = 9 + arc * 10;
  const shadowH = 3 + arc * 3;
  ctx.save();
  ctx.globalAlpha = 0.24 + (1 - arc) * 0.25;
  ctx.fillStyle = "#06140f";
  ctx.fillRect(x - shadowW / 2, baseY - shadowH / 2, shadowW, shadowH);
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

function spawnImpactParticles(d, xNorm, colors = PAL.impacto, count = 8, offsetY = -18) {
  const paleta = Array.isArray(colors) ? colors : [colors];
  const cx = screenX(xNorm, PLAYER_SIDE);
  const cy = screenY(PLAYER_SIDE) + offsetY;
  const forte = count > 8;

  for (let i = 0; i < count; i += 1) {
    d.particulas.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * (forte ? 170 : 90),
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

  if (d.fase === FASES.JOGANDO && d.ball.canBeHit) {
    textPixel(ctx, "ALINHE A RAQUETE COM A BOLA", 400, 382, 7, PAL.branco);
  }
}

/* ================= HOOK ================= */
export function usePingpong() {
  const navigate = useNavigate();

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
    };

    const moverIa = (d, dt) => {
      let alvo = d.ball.direction < 0 ? d.ball.x : d.ball.x * 0.45;
      const erro = 0.035 + (d.pontos >= 3 ? 0.025 : 0.055);
      alvo += Math.sin(d.rally * 1.7 + d.serveTempoTotal) * erro;
      const velocidade = 1.15 + d.pontos * 0.05;
      const maxMove = velocidade * dt;
      const delta = clamp(alvo - d.aiX, -maxMove, maxMove);
      d.aiX = clamp(d.aiX + delta, -0.8, 0.8);
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
      d.ball.visible = false;
      d.ball.canBeHit = false;
      setFase(d.fase);
    };

    const quicarNoLadoAi = (d) => {
      d.ball.trajectory = TRAJETORIA.QUICOU_AI;
      d.ball.bounceCount += 1;
      d.ball.progress = 0;
      d.ball.flightTime = Math.max(0.74, d.ball.flightTime * 0.96);
      d.ball.x = clamp(d.ball.x + d.ball.vx * 0.12, -0.9, 0.9);
      d.ball.canBeHit = true;
      d.ball.direction = -1;
      d.ball.z = AI_SIDE;
      d.ball.progress = 0;
    };

    const quicarNoLadoJogador = (d) => {
      d.ball.trajectory = TRAJETORIA.QUICOU_JOGADOR;
      d.ball.bounceCount += 1;
      d.ball.progress = 0;
      d.ball.flightTime = Math.max(0.74, d.ball.flightTime * 0.96);
      d.ball.x = clamp(d.ball.x + d.ball.vx * 0.12, -0.9, 0.9);
      d.ball.canBeHit = true;
      d.ball.direction = 1;
      d.ball.z = PLAYER_SIDE;
      d.ball.progress = 0;
    };

    const rebaterJogador = (d, now) => {
      if (!d.ball.canBeHit || d.ball.trajectory !== TRAJETORIA.QUICOU_JOGADOR) return;
      if (d.lastHitSide === "player" && now - d.lastHitTime < 130) return;

      const distancia = Math.abs(d.ball.x - d.playerX);
      if (distancia > PLAYER_HIT_TOLERANCE) {
        resolverResultado(d, false);
        return;
      }

      const offset = clamp((d.ball.x - d.playerX) / PLAYER_HIT_TOLERANCE, -1, 1);
      const direcaoLateral = offset * 0.28;
      d.ball.vx = clamp(d.ball.vx * 0.45 + direcaoLateral, -0.34, 0.34);
      d.ball.spin = clamp(d.ball.spin * 0.35 + offset * 0.18, -0.34, 0.34);
      d.ball.flightTime = Math.max(0.76, d.ball.flightTime * 0.94);
      d.ultimoImpacto = 180;
      d.impactoX = d.playerX;
      d.rally += 1;
      setRally(d.rally);
      tocarToque();
      spawnImpactParticles(d, d.playerX, "#ffe082");

      d.ball.direction = 1;
      d.ball.trajectory = TRAJETORIA.INDO_PARA_AI;
      d.ball.canBeHit = false;
      d.ball.progress = 0;
      d.ball.z = PLAYER_SIDE + 0.01;
      d.ball.x = clamp(d.playerX + offset * 0.12 + d.ball.vx * 0.28, -0.9, 0.9);
      d.ball.trail = [];
      d.lastHitSide = "player";
      d.lastHitTime = now;
    };

    const rebaterIa = (d, now) => {
      if (!d.ball.canBeHit || d.ball.trajectory !== TRAJETORIA.QUICOU_AI) return;
      if (d.lastHitSide === "ai" && now - d.lastHitTime < 130) return;

      const distancia = Math.abs(d.ball.x - d.aiX);
      const tolerancia = AI_HIT_TOLERANCE + Math.max(0, 0.035 - d.pontos * 0.004);
      if (distancia > tolerancia) {
        resolverResultado(d, true);
        return;
      }

      const offset = clamp((d.ball.x - d.aiX) / tolerancia, -1, 1);
      const direcao = offset * 0.16;
      d.ball.vx = clamp(d.ball.vx * 0.35 + direcao, -0.24, 0.24);
      d.ball.spin = clamp(d.ball.spin * 0.3 + offset * 0.08, -0.2, 0.2);
      d.ball.flightTime = Math.max(0.82, d.ball.flightTime * 0.99);
      d.ultimoImpacto = 140;
      d.impactoX = d.aiX;
      d.rally += 1;
      setRally(d.rally);
      tocarToque();

      d.ball.direction = -1;
      d.ball.trajectory = TRAJETORIA.INDO_PARA_JOGADOR;
      d.ball.canBeHit = false;
      d.ball.progress = 0;
      d.ball.z = AI_SIDE - 0.01;
      d.ball.x = clamp(d.aiX + offset * 0.1 + d.ball.vx * 0.24, -0.9, 0.9);
      d.ball.trail = [];
      d.lastHitSide = "ai";
      d.lastHitTime = now;
    };

    const atualizarBola = (d, dt) => {
      const b = d.ball;
      if (!b.visible) return;

      const tempo = Math.max(0.72, b.flightTime);
      b.progress += dt / tempo;
      const p = clamp(b.progress, 0, 1);

      b.z = b.direction > 0 ? lerp(PLAYER_SIDE, AI_SIDE, p) : lerp(AI_SIDE, PLAYER_SIDE, p);

      b.x += b.vx * dt;
      b.x = clamp(b.x, -0.92, 0.92);

      const arc = Math.sin(Math.PI * p);
      b.trail.push({ x: screenX(b.x, b.z), y: screenY(b.z) - (25 + arc * 48) });
      if (b.trail.length > 6) b.trail.shift();

      if (b.progress < 1) return;

      if (b.direction > 0) {
        b.z = AI_SIDE;
        b.progress = 0;
        b.x = clamp(b.x, -0.9, 0.9);
        quicarNoLadoAi(d);
        return;
      }

      b.z = PLAYER_SIDE;
      b.progress = 0;
      b.x = clamp(b.x, -0.9, 0.9);
      quicarNoLadoJogador(d);
    };

    const step = (timestamp) => {
      if (!last) last = timestamp;
      const dt = Math.min((timestamp - last) / 1000, 0.032);
      last = timestamp;

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
          d.ball.x = d.aiX * 0.3;
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
          if (d.servidor === "jogador") {
            d.ball.direction = 1;
            d.ball.trajectory = TRAJETORIA.INDO_PARA_AI;
            d.ball.z = PLAYER_SIDE;
            d.ball.x = d.playerX;
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

        if (d.ball.canBeHit) {
          if (d.ball.trajectory === TRAJETORIA.QUICOU_JOGADOR) {
            const distancia = Math.abs(d.ball.x - d.playerX);
            if (distancia <= PLAYER_HIT_TOLERANCE) rebaterJogador(d, now);
            else if (d.ball.progress > 0.58) resolverResultado(d, false);
          } else if (d.ball.trajectory === TRAJETORIA.QUICOU_AI) {
            const distancia = Math.abs(d.ball.x - d.aiX);
            if (distancia <= AI_HIT_TOLERANCE + 0.055) rebaterIa(d, now);
            else if (d.ball.progress > 0.6) resolverResultado(d, true);
          }
        }
      } else if (d.fase === FASES.PONTO || d.fase === FASES.ERRO) {
        d.resultadoRestante -= dt * 1000;
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
