import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EscalaProporcional from "../../components/EscalaProporcional";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import useTelaCheia from "../../hooks/useTelaCheia";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { criarPinos } from "./helpers/criarPinos";
import { atualizarFisica } from "./helpers/atualizarFisica";
import { jogadaTerminou } from "./helpers/jogadaTerminou";
import { resultadoDaBola } from "./helpers/resultadoDaBola";
import { calcularEstrelas } from "./helpers/calcularEstrelas";
import { emojiDoResultadoFinal } from "./helpers/emojiDoResultadoFinal";
import { criarRuidoBuffer } from "./helpers/criarRuidoBuffer";
import {
  BOLAS_POR_RODADA,
  ETAPAS,
  FORCA_MINIMA,
  FORCA_VELOCIDADE,
  FUNDO_X,
  GAME_HEIGHT,
  GAME_WIDTH,
  LINHA_LANCAMENTO,
  MIRA_MARGEM,
  MIRA_VELOCIDADE,
  PINO_COLUNA_X,
  PISTA_BASE,
  PISTA_TOPO,
  TEMPO_BANNER,
  TOTAL_PINOS,
  TOTAL_RODADAS,
  VELOCIDADE_BASE,
  VELOCIDADE_EXTRA,
  CANALETA,
} from "./utils/constantes";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import "./styles/index.css";

/* ================= UTILITÁRIOS ================= */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rect = (c, x, y, w, h, cor) => {
  c.fillStyle = cor;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
function disco(c, cx, cy, r, cor) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  c.fillStyle = cor;
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y + 0.5));
    c.fillRect(cx - w, cy + y, w * 2 + 1, 1);
  }
}
function discoDitherizado(c, cx, cy, r, cor) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r) continue;
      if (((x + y) & 1) === 0) rect(c, cx + x, cy + y, 1, 1, cor);
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

/* ================= PALETA 16-BITS ================= */
const PAL = {
  fundo: "#14121d",
  // pista (madeira) — sombra/base/clara/brilho
  madeiraEscura: "#8a5a22",
  madeira: "#a86a29",
  madeiraClara: "#c8873c",
  madeiraBrilho: "#e0a75c",
  // pista vizinha (sliver no topo, mais fria/distante)
  vizinhaEscura: "#5a4a6a",
  vizinhaClara: "#6e5a80",
  // canaleta
  canaletaBorda: "#0f0f18",
  canaleta: "#2b2b3d",
  canaletaClara: "#3a3a52",
  // parede de fundo / máquina
  parede: "#2e3ea8",
  paredeEscura: "#1f2a78",
  paredeClara: "#4858c4",
  maquina: "#171b3a",
  maquinaClara: "#262c57",
  // mesinhas da área de espectadores
  mesa: "#6b4a2d",
  mesaClara: "#8a6540",
  // pino
  pinoSombra: "#9a9a9a",
  pinoBase: "#d9d9d4",
  pinoClaro: "#ffffff",
  pinoFaixa: "#e63946",
  pinoFaixaEscura: "#8f1d2c",
  // bola
  bolaBrilho: "#ff8f99",
  bolaClara: "#ff6b76",
  bolaBase: "#e63946",
  bolaMedia: "#c5283d",
  bolaEscura: "#8f1d2c",
  bolaContorno: "#4a0e14",
  bolaFuro: "#5a0f18",
  // luzes/HUD
  luz: "#ffe9a8",
  luzClara: "#fff4cf",
  mira: "#ffd166",
  preto: "#1f1f1f",
  amarelo: "#ffd166",
  verde: "#06d6a0",
  branco: "#ffffff",
};
const CONFETE = [PAL.amarelo, PAL.verde, "#4cc9f0", "#ef476f", PAL.branco];

// Pista vizinha decorativa, na margem de baixo (ver atualizarVizinha/desenhar).
const VIZINHA_LANE_Y0 = 378;
const VIZINHA_LANE_Y1 = 415;
const VIZINHA_Y = Math.round((VIZINHA_LANE_Y0 + VIZINHA_LANE_Y1) / 2);

/* ================= CENÁRIO (pré-renderizado, visto de cima) ================= */
function criarFundo() {
  const cv = document.createElement("canvas");
  cv.width = GAME_WIDTH;
  cv.height = GAME_HEIGHT;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  const r = rng(7);
  const ri = (min, max) => Math.floor(min + r() * (max - min));

  rect(c, 0, 0, GAME_WIDTH, GAME_HEIGHT, PAL.fundo);

  const gutterTopo0 = PISTA_TOPO - CANALETA;
  const gutterBase1 = PISTA_BASE + CANALETA;

  // ---------- topo: área de espectadores com mesinhas ----------
  rect(c, 0, 0, FUNDO_X, 8, "#0c0a14");
  for (let x = 0; x < FUNDO_X; x += 2) rect(c, x, 8, 1, 1, "#1a1726");
  rect(c, 0, 10, FUNDO_X, gutterTopo0 - 10 - 6, "#241f33");
  for (let yy = 10; yy < gutterTopo0 - 6; yy += 9) rect(c, 0, yy, FUNDO_X, 1, "rgba(0,0,0,.18)");
  rect(c, 0, gutterTopo0 - 6, FUNDO_X, 3, PAL.canaletaBorda);
  rect(c, 0, gutterTopo0 - 3, FUNDO_X, 3, PAL.canaleta);
  // luzinha de teto suave entre as mesas (glow pontilhado)
  for (let lx = 70; lx < FUNDO_X - 40; lx += 150) {
    discoDitherizado(c, lx, 7, 10, PAL.luzClara);
  }
  // mesinhas com gente sentada, vistas de cima
  const mesaY = Math.round(10 + (gutterTopo0 - 6 - 10) / 2) + 1;
  const peles = ["#f4bf91", "#d99568", "#a86a3d", "#7a4a2a"];
  const roupas = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866", "#9b59d0", "#ff8fb1"];
  const rp = rng(23);
  const rpi = (min, max) => Math.floor(min + rp() * (max - min));
  let mx = 96;
  while (mx < FUNDO_X - 70) {
    disco(c, mx, mesaY + 2, 13, "rgba(0,0,0,.28)");
    disco(c, mx, mesaY, 13, PAL.mesa);
    disco(c, mx, mesaY, 10, PAL.mesaClara);
    const n = rpi(2, 4);
    for (let p = 0; p < n; p++) {
      const ang = (p / n) * Math.PI * 2 + rpi(0, 100) / 100;
      const px = mx + Math.cos(ang) * 18;
      const py = clamp(mesaY + Math.sin(ang) * 7, 13, gutterTopo0 - 10);
      disco(c, px, py, 5, roupas[rpi(0, roupas.length)]);
      disco(c, px, py - 1, 3, peles[rpi(0, peles.length)]);
    }
    mx += rpi(150, 190);
  }

  // ---------- canaletas da pista principal ----------
  rect(c, 0, gutterTopo0, FUNDO_X, CANALETA, PAL.canaleta);
  rect(c, 0, gutterTopo0, FUNDO_X, 3, PAL.canaletaBorda);
  rect(c, 0, PISTA_TOPO - 3, FUNDO_X, 3, PAL.canaletaClara);
  for (let x = 0; x < FUNDO_X; x += 46) rect(c, x, gutterTopo0 + CANALETA / 2 - 1, 22, 2, "rgba(0,0,0,.25)");

  rect(c, 0, PISTA_BASE, FUNDO_X, CANALETA, PAL.canaleta);
  rect(c, 0, PISTA_BASE, FUNDO_X, 3, PAL.canaletaClara);
  rect(c, 0, gutterBase1 - 3, FUNDO_X, 3, PAL.canaletaBorda);
  for (let x = 0; x < FUNDO_X; x += 46) rect(c, x, PISTA_BASE + CANALETA / 2 - 1, 22, 2, "rgba(0,0,0,.25)");

  // ---------- pista de madeira: tábuas com veio + brilho central ----------
  let y = PISTA_TOPO;
  let i = 0;
  while (y < PISTA_BASE) {
    const h = Math.min(14, PISTA_BASE - y);
    rect(c, 0, y, FUNDO_X, h, i % 2 === 0 ? PAL.madeira : PAL.madeiraClara);
    rect(c, 0, y, FUNDO_X, 1, "rgba(255,255,255,.1)");
    rect(c, 0, y + h - 1, FUNDO_X, 1, PAL.madeiraEscura);
    y += h;
    i++;
  }
  const centroY = (PISTA_TOPO + PISTA_BASE) / 2;
  // veios longitudinais finos
  for (let k = 0; k < 40; k++) {
    const yy = ri(PISTA_TOPO + 2, PISTA_BASE - 2);
    const x0 = ri(0, FUNDO_X - 80);
    rect(c, x0, yy, ri(40, 90), 1, "rgba(0,0,0,.12)");
  }

  // pontos de mira da aproximação (triângulo clássico de pista de boliche)
  const pontosX = [LINHA_LANCAMENTO + 90, LINHA_LANCAMENTO + 110, LINHA_LANCAMENTO + 130];
  pontosX.forEach((px, idx) => {
    const n = idx + 2;
    for (let k = 0; k < n; k++) {
      const py = centroY + (k - (n - 1) / 2) * 16;
      disco(c, px, py, 2, PAL.madeiraEscura);
    }
  });

  // linha de falta
  rect(c, LINHA_LANCAMENTO + 26, PISTA_TOPO, 4, PISTA_BASE - PISTA_TOPO, PAL.madeiraEscura);
  rect(c, LINHA_LANCAMENTO + 26, PISTA_TOPO, 1, PISTA_BASE - PISTA_TOPO, "rgba(255,255,255,.3)");

  // ---------- pista vizinha de baixo (decorativa, bolas passam de vez em quando) ----------
  rect(c, 0, gutterBase1, FUNDO_X, 3, "rgba(0,0,0,.3)");
  rect(c, 0, VIZINHA_LANE_Y0 - 3, FUNDO_X, 3, PAL.canaletaBorda);
  rect(c, 0, VIZINHA_LANE_Y0, FUNDO_X, 3, PAL.canaleta);
  rect(c, 0, VIZINHA_LANE_Y1 - 3, FUNDO_X, 3, PAL.canaleta);
  rect(c, 0, VIZINHA_LANE_Y1, FUNDO_X, 3, PAL.canaletaBorda);
  rect(c, 0, VIZINHA_LANE_Y0 + 3, FUNDO_X, VIZINHA_LANE_Y1 - 3 - (VIZINHA_LANE_Y0 + 3), PAL.vizinhaClara);
  for (let yy = VIZINHA_LANE_Y0 + 3; yy < VIZINHA_LANE_Y1 - 3; yy += 7) rect(c, 0, yy, FUNDO_X, 1, PAL.vizinhaEscura);
  // pinos ao fundo daquela pista, só decoração (silhueta pequena e parada)
  const pxFundo = FUNDO_X - 36;
  [
    [0, -10], [0, 10], [-11, -17], [-11, -3], [-11, 11], [-11, 17],
  ].forEach(([dx, dy]) => disco(c, pxFundo + dx, VIZINHA_Y + dy, 3, "#e4e4e0"));

  // ---------- parede de fundo + máquina de pinos ----------
  rect(c, FUNDO_X, 0, GAME_WIDTH - FUNDO_X, GAME_HEIGHT, PAL.parede);
  rect(c, FUNDO_X, 0, 5, GAME_HEIGHT, PAL.canaletaBorda);
  rect(c, FUNDO_X + 5, 0, 4, GAME_HEIGHT, PAL.paredeClara);
  rect(c, FUNDO_X + 10, PISTA_TOPO - CANALETA, GAME_WIDTH - FUNDO_X - 14, PISTA_BASE - PISTA_TOPO + CANALETA * 2, PAL.maquina);
  for (let my = PISTA_TOPO - CANALETA + 6; my < PISTA_BASE + CANALETA - 6; my += 14) {
    rect(c, FUNDO_X + 14, my, GAME_WIDTH - FUNDO_X - 22, 3, PAL.maquinaClara);
  }
  // listra de alerta (amarelo/preto) na base da máquina
  for (let x = FUNDO_X; x < GAME_WIDTH; x += 10)
    rect(c, x, GAME_HEIGHT - 10, 10, 10, (Math.floor(x / 10) % 2 === 0) ? PAL.amarelo : PAL.preto);

  return cv;
}

/* ================= PINOS E BOLA ================= */
function desenharPino(c, pino, raio) {
  const { x, y } = pino;
  if (!pino.caido) {
    disco(c, x, y + 2, raio, PAL.pinoSombra);
    disco(c, x, y, raio, PAL.pinoBase);
    disco(c, x, y, raio - 3, PAL.pinoClaro);
    disco(c, x, y, 4, PAL.pinoFaixa);
    rect(c, x - 2, y - 2, 2, 2, "rgba(255,255,255,.8)");
    return;
  }
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.rotate(pino.angulo);
  rect(c, -14, -5, 28, 10, PAL.pinoSombra);
  rect(c, -14, -6, 26, 8, PAL.pinoBase);
  rect(c, -14, -6, 26, 2, PAL.pinoClaro);
  rect(c, -2, -6, 5, 8, PAL.pinoFaixa);
  rect(c, -2, -6, 5, 2, PAL.pinoFaixaEscura);
  rect(c, 9, -4, 4, 6, PAL.pinoSombra);
  c.restore();
}

function desenharBola(c, bola, raio) {
  const x = Math.round(bola.x);
  const y = Math.round(bola.y);
  disco(c, x, y + 3, raio, "rgba(0,0,0,.22)");
  for (let yy = -raio; yy < raio; yy++) {
    for (let xx = -raio; xx < raio; xx++) {
      const fx = xx + 0.5;
      const fy = yy + 0.5;
      const d = Math.hypot(fx, fy);
      if (d > raio) continue;
      let cor;
      if (d > raio - 1.4) cor = PAL.bolaContorno;
      else {
        const luz = (fx + fy) / (2 * raio);
        cor =
          luz < -0.5
            ? PAL.bolaBrilho
            : luz < -0.2
            ? PAL.bolaClara
            : luz > 0.5
            ? PAL.bolaEscura
            : luz > 0.2
            ? PAL.bolaMedia
            : PAL.bolaBase;
      }
      rect(c, x + xx, y + yy, 1, 1, cor);
    }
  }
  for (let i = 0; i < 3; i++) {
    const ang = bola.giro + (i * Math.PI * 2) / 3;
    disco(c, x + Math.cos(ang) * 5, y + Math.sin(ang) * 5, 2, PAL.bolaFuro);
  }
}

function desenharMira(c, miraY, tempo) {
  for (let x = LINHA_LANCAMENTO + 46; x < PINO_COLUNA_X - 24; x += 22) {
    c.globalAlpha = 0.45 + Math.sin(tempo * 0.006 + x * 0.05) * 0.25;
    rect(c, x - 5, miraY - 2, 10, 4, PAL.mira);
    c.globalAlpha = 1;
  }
  for (let k = 0; k < 7; k++) {
    rect(c, PINO_COLUNA_X - 24 + k * 4, miraY - (7 - k), 4, (7 - k) * 2, PAL.mira);
  }
}

function desenharBarraForca(c, forca) {
  const largura = 180;
  const altura = 18;
  const x = 24;
  const y = PISTA_BASE + CANALETA + 18;
  rect(c, x - 4, y - 4, largura + 8, altura + 8, PAL.preto);
  rect(c, x, y, largura, altura, PAL.canaletaClara);
  const preenchida = clamp(forca, 0, 1) * largura;
  const cor = forca > 0.75 ? "#ef476f" : forca > 0.4 ? PAL.amarelo : PAL.verde;
  rect(c, x, y, preenchida, altura, cor);
  for (let k = 1; k < 4; k++) rect(c, x + (largura / 4) * k, y, 2, altura, PAL.preto);
  c.fillStyle = PAL.branco;
  c.font = '10px "Press Start 2P", monospace';
  c.textAlign = "left";
  c.fillText("FORÇA", x, y - 8);
}

/* ================= SOM (chiptune, respeita som/volume) ================= */
function useSomBoliche(somLigado) {
  const volume = useSelector((state) => state.jogo.volume);
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const somLigadoRef = useRef(somLigado);
  const volumeRef = useRef(volume);

  useEffect(() => {
    somLigadoRef.current = somLigado;
  }, [somLigado]);
  useEffect(() => {
    volumeRef.current = volume;
    if (masterRef.current) masterRef.current.gain.value = volume / 100;
  }, [volume]);
  useEffect(
    () => () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state !== "closed") ctx.close();
      ctxRef.current = null;
      masterRef.current = null;
    },
    []
  );

  const garantir = useCallback(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AC();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = volumeRef.current / 100;
      masterRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tocar = useCallback(
    (tipo) => {
      if (!somLigadoRef.current || volumeRef.current <= 0) return;
      const ctx = garantir();
      if (!ctx) return;
      try {
        const agora = ctx.currentTime;
        if (tipo === "lancamento") {
          const fonte = ctx.createBufferSource();
          fonte.buffer = criarRuidoBuffer(ctx, 0.5);
          const filtro = ctx.createBiquadFilter();
          filtro.type = "lowpass";
          filtro.frequency.setValueAtTime(400, agora);
          filtro.frequency.exponentialRampToValueAtTime(140, agora + 0.5);
          const ganho = ctx.createGain();
          ganho.gain.setValueAtTime(0.0001, agora);
          ganho.gain.exponentialRampToValueAtTime(0.18, agora + 0.06);
          ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.5);
          fonte.connect(filtro);
          filtro.connect(ganho);
          ganho.connect(masterRef.current);
          fonte.start(agora);
          fonte.stop(agora + 0.55);
        } else if (tipo === "batida") {
          const osc = ctx.createOscillator();
          const ganho = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(420 + Math.random() * 380, agora);
          ganho.gain.setValueAtTime(0.0001, agora);
          ganho.gain.exponentialRampToValueAtTime(0.12, agora + 0.006);
          ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.09);
          osc.connect(ganho);
          ganho.connect(masterRef.current);
          osc.start(agora);
          osc.stop(agora + 0.1);
        } else if (tipo === "strike") {
          [523, 659, 784, 1046].forEach((nota, i) => {
            const osc = ctx.createOscillator();
            const ganho = ctx.createGain();
            const inicio = agora + i * 0.09;
            osc.type = "square";
            osc.frequency.setValueAtTime(nota, inicio);
            ganho.gain.setValueAtTime(0.0001, inicio);
            ganho.gain.exponentialRampToValueAtTime(0.14, inicio + 0.02);
            ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.18);
            osc.connect(ganho);
            ganho.connect(masterRef.current);
            osc.start(inicio);
            osc.stop(inicio + 0.2);
          });
        } else if (tipo === "erro") {
          const osc = ctx.createOscillator();
          const ganho = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(220, agora);
          osc.frequency.exponentialRampToValueAtTime(90, agora + 0.25);
          ganho.gain.setValueAtTime(0.0001, agora);
          ganho.gain.exponentialRampToValueAtTime(0.15, agora + 0.02);
          ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.28);
          osc.connect(ganho);
          ganho.connect(masterRef.current);
          osc.start(agora);
          osc.stop(agora + 0.3);
        } else if (tipo === "clique") {
          const osc = ctx.createOscillator();
          const ganho = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(660, agora);
          ganho.gain.setValueAtTime(0.05, agora);
          ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.08);
          osc.connect(ganho);
          ganho.connect(masterRef.current);
          osc.start(agora);
          osc.stop(agora + 0.1);
        }
      } catch {
        /* áudio é opcional */
      }
    },
    [garantir]
  );

  return tocar;
}

/* ================= ESTADO E JOGO ================= */
function novoJogo() {
  const centroY = (PISTA_TOPO + PISTA_BASE) / 2;
  return {
    etapa: ETAPAS.MIRA,
    miraY: centroY,
    miraVel: MIRA_VELOCIDADE,
    forca: 0,
    forcaVel: 0,
    bola: { x: LINHA_LANCAMENTO, y: centroY, vx: 0, vy: 0, rolando: false, naCanaleta: false, giro: 0 },
    pinos: criarPinos(),
    rodada: 1,
    bolaDaRodada: 1,
    pontos: 0,
    derrubadosNaRodada: 0,
    derrubadosNestaBola: 0,
    fecharRodada: false,
    tempoRolando: 0,
    tempoBanner: 0,
    tempo: 0,
    parts: [],
    vizinha: { bola: null, espera: 1200 + Math.random() * 2000 },
  };
}

// Ambiente da pista vizinha (margem de baixo): de vez em quando uma bola
// atravessa, pura decoração — roda sempre, mesmo na tela de intro.
function atualizarVizinha(d, dtMs) {
  const v = d.vizinha;
  if (v.bola) {
    v.bola.x += v.bola.vx * (dtMs / 16.67);
    if (v.bola.x > FUNDO_X - 30) {
      v.bola = null;
      v.espera = 2600 + Math.random() * 4500;
    }
  } else {
    v.espera -= dtMs;
    if (v.espera <= 0) v.bola = { x: -10, vx: 5.5 + Math.random() * 2.5 };
  }
}

function particulas(j, x, y, n, cores, vel, g, vida, s = 3) {
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2;
    const v = Math.random() * vel;
    j.parts.push({
      x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - vel * 0.3, g,
      vida: vida * (0.6 + Math.random() * 0.6), max: vida,
      cor: cores[Math.floor(Math.random() * cores.length)], s,
    });
  }
}

function prepararJogada(d) {
  const centroY = (PISTA_TOPO + PISTA_BASE) / 2;
  d.bola = { x: LINHA_LANCAMENTO, y: centroY, vx: 0, vy: 0, rolando: false, naCanaleta: false, giro: 0 };
  d.miraY = centroY;
  d.miraVel = MIRA_VELOCIDADE;
  d.forca = 0;
  d.forcaVel = 0;
  d.tempoRolando = 0;
  d.derrubadosNestaBola = 0;
  d.etapa = ETAPAS.MIRA;
}

function lancarBola(d, ev) {
  const forca = Math.max(FORCA_MINIMA, d.forca);
  d.pinos.forEach((p) => {
    p.caidoAntes = p.caido;
  });
  d.bola.x = LINHA_LANCAMENTO;
  d.bola.y = d.miraY;
  d.bola.vx = VELOCIDADE_BASE + forca * VELOCIDADE_EXTRA;
  d.bola.vy = (Math.random() * 2 - 1) * 0.35;
  d.bola.rolando = true;
  d.bola.naCanaleta = false;
  d.tempoRolando = 0;
  d.etapa = ETAPAS.ROLANDO;
  ev.som("lancamento");
}

function contabilizarJogada(d, ev) {
  const derrubadosNestaBola = d.pinos.filter((p) => p.caido && !p.caidoAntes).length;
  d.derrubadosNestaBola = derrubadosNestaBola;
  d.derrubadosNaRodada += derrubadosNestaBola;

  const resultado = resultadoDaBola({
    bolaDaRodada: d.bolaDaRodada,
    derrubadosNestaBola,
    derrubadosNaRodada: d.derrubadosNaRodada,
    naCanaleta: d.bola.naCanaleta,
  });

  d.pontos += resultado.pontos;
  d.fecharRodada = resultado.fecharRodada;

  if (resultado.tipo === "strike" || resultado.tipo === "spare") {
    ev.som("strike");
    particulas(d, PINO_COLUNA_X, (PISTA_TOPO + PISTA_BASE) / 2, 40, CONFETE, 240, 260, 1.3, 3);
  } else if (derrubadosNestaBola === 0) {
    ev.som("erro");
  }

  d.tempoBanner = TEMPO_BANNER;
  d.etapa = ETAPAS.RESULTADO;
  ev.resultado(resultado, derrubadosNestaBola);
}

function seguirParaProxima(d, ev) {
  if (d.fecharRodada) {
    if (d.rodada >= TOTAL_RODADAS) {
      ev.fim(d);
      return;
    }
    d.rodada += 1;
    d.bolaDaRodada = 1;
    d.derrubadosNaRodada = 0;
    d.pinos = criarPinos();
  } else {
    d.bolaDaRodada = Math.min(d.bolaDaRodada + 1, BOLAS_POR_RODADA);
    d.pinos = d.pinos.filter((p) => !p.caido);
  }
  prepararJogada(d);
  ev.hud();
}

function atualizar(d, dt, ev) {
  const fator = dt / 16.67;
  d.tempo += dt;

  if (d.etapa === ETAPAS.MIRA) {
    d.miraY += d.miraVel * fator;
    const limiteCima = PISTA_TOPO - MIRA_MARGEM;
    const limiteBaixo = PISTA_BASE + MIRA_MARGEM;
    if (d.miraY <= limiteCima) {
      d.miraY = limiteCima;
      d.miraVel = Math.abs(d.miraVel);
    }
    if (d.miraY >= limiteBaixo) {
      d.miraY = limiteBaixo;
      d.miraVel = -Math.abs(d.miraVel);
    }
    d.bola.y = d.miraY;
  }

  if (d.etapa === ETAPAS.FORCA) {
    d.forca += d.forcaVel * fator;
    if (d.forca >= 1) {
      d.forca = 1;
      d.forcaVel = -Math.abs(d.forcaVel);
    }
    if (d.forca <= 0) {
      d.forca = 0;
      d.forcaVel = Math.abs(d.forcaVel);
    }
  }

  if (d.etapa === ETAPAS.ROLANDO) {
    d.tempoRolando += dt;
    const eventos = atualizarFisica(d, fator);
    if (eventos.bateuPino) ev.somBatida();
    if (eventos.caiuNaCanaleta) ev.som("erro");
    if (jogadaTerminou(d)) contabilizarJogada(d, ev);
  }

  if (d.etapa === ETAPAS.RESULTADO) {
    d.tempoBanner -= dt;
    if (d.tempoBanner <= 0) seguirParaProxima(d, ev);
  }

  for (const p of d.parts) {
    p.vy += p.g * (dt / 1000);
    p.x += p.vx * (dt / 1000);
    p.y += p.vy * (dt / 1000);
    p.vida -= dt / 1000;
  }
  d.parts = d.parts.filter((p) => p.vida > 0);
}

/* ================= DESENHO ================= */
function desenhar(c, d, fundo) {
  c.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  c.drawImage(fundo, 0, 0);

  if (d.vizinha.bola) {
    const bx = d.vizinha.bola.x;
    disco(c, bx, VIZINHA_Y + 1, 6, "rgba(0,0,0,.25)");
    disco(c, bx, VIZINHA_Y, 6, PAL.bolaContorno);
    disco(c, bx, VIZINHA_Y, 5, PAL.bolaBase);
    rect(c, bx - 2, VIZINHA_Y - 2, 2, 2, PAL.bolaBrilho);
  }

  for (const pino of d.pinos) if (pino.caido) desenharPino(c, pino, 9);
  for (const pino of d.pinos) if (!pino.caido) desenharPino(c, pino, 9);

  desenharBola(c, d.bola, 15);

  if (d.etapa === ETAPAS.MIRA) desenharMira(c, d.miraY, d.tempo);
  if (d.etapa === ETAPAS.MIRA || d.etapa === ETAPAS.FORCA) desenharBarraForca(c, d.forca);

  for (const p of d.parts) {
    c.globalAlpha = clamp(p.vida / p.max, 0, 1);
    rect(c, p.x, p.y, p.s, p.s, p.cor);
  }
  c.globalAlpha = 1;
}

/* ================= COMPONENTE ================= */
const DICAS = {
  [ETAPAS.MIRA]: "APERTE ESPAÇO (OU TOQUE) PARA TRAVAR A MIRA",
  [ETAPAS.FORCA]: "APERTE DE NOVO PARA SOLTAR A BOLA",
  [ETAPAS.ROLANDO]: "LÁ VAI ELA...",
  [ETAPAS.RESULTADO]: "PREPARANDO A PRÓXIMA BOLA",
};

const Boliche = () => {
  const cvRef = useRef(null);
  const dRef = useRef(null);
  if (!dRef.current) dRef.current = novoJogo();

  const [fase, setFase] = useState("intro"); // intro | jogando | fim
  const [somLigado, setSomLigado] = useState(true);
  const [hud, setHud] = useState({
    rodada: 1, bolaDaRodada: 1, pontos: 0, pinosEmPe: TOTAL_PINOS, etapa: ETAPAS.MIRA,
  });
  const [aviso, setAviso] = useState(null);
  const [final, setFinal] = useState(null);
  const faseRef = useRef(fase);
  faseRef.current = fase;
  const idAviso = useRef(0);
  const ultimaBatidaRef = useRef(0);

  const tocar = useSomBoliche(somLigado);
  const somRef = useRef(tocar);
  somRef.current = tocar;

  const navigate = useNavigate();
  const edu = useDicasDoJogo("boliche", hud.pontos);
  const {
    emTelaCheia,
    suportaTelaCheia,
    ref: telaCheiaRef,
    alternarTelaCheia,
  } = useTelaCheia(fase === "fim");

  const sync = useCallback(() => {
    const d = dRef.current;
    setHud({
      rodada: d.rodada, bolaDaRodada: d.bolaDaRodada, pontos: d.pontos,
      pinosEmPe: d.pinos.filter((p) => !p.caido).length, etapa: d.etapa,
    });
  }, []);

  const avisar = useCallback((txt, tom, sub) => setAviso({ id: ++idAviso.current, txt, tom, sub }), []);

  const ev = useMemo(
    () => ({
      som: (t) => somRef.current(t),
      somBatida: () => {
        const d = dRef.current;
        if (d.tempo - ultimaBatidaRef.current > 55) {
          ultimaBatidaRef.current = d.tempo;
          somRef.current("batida");
        }
      },
      hud: sync,
      resultado: (resultado, derrubados) => {
        const sub =
          derrubados === 0
            ? "NENHUM PINO DESTA VEZ"
            : `${derrubados} ${derrubados === 1 ? "PINO" : "PINOS"} NESTA BOLA`;
        const tom = resultado.tipo === "erro" ? "ruim" : "bom";
        avisar(resultado.frase, tom, sub);
        sync();
      },
      fim: (d) => {
        const estrelas = calcularEstrelas(d.pontos);
        setFinal({ pontos: d.pontos, estrelas });
        setFase("fim");
        somRef.current("strike");
      },
    }),
    [sync, avisar]
  );

  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(() => setAviso(null), TEMPO_BANNER);
    return () => clearTimeout(t);
  }, [aviso]);

  // loop do jogo
  useEffect(() => {
    const cv = cvRef.current;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    const fundo = criarFundo();
    const d = dRef.current;
    let raf;
    let ultimo = 0;
    const loop = (tempo) => {
      if (!ultimo) ultimo = tempo;
      const dt = Math.min(tempo - ultimo, 40);
      ultimo = tempo;
      if (faseRef.current === "jogando") atualizar(d, dt, ev);
      atualizarVizinha(d, dt);
      desenhar(c, d, fundo);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ev]);

  const acao = useCallback(() => {
    if (faseRef.current !== "jogando") return;
    const d = dRef.current;
    if (d.etapa === ETAPAS.MIRA) {
      d.forca = 0;
      d.forcaVel = FORCA_VELOCIDADE;
      d.etapa = ETAPAS.FORCA;
    } else if (d.etapa === ETAPAS.FORCA) {
      lancarBola(d, ev);
    }
    sync();
  }, [ev, sync]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (e.repeat) return;
      acao();
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [acao]);

  const iniciar = () => {
    somRef.current("clique");
    Object.assign(dRef.current, novoJogo());
    setFinal(null);
    setAviso(null);
    sync();
    setFase("jogando");
  };

  const mostrarFim = fase === "fim" && final;

  return (
    <div className="bol-wrapper">
      {/* Fixo no canto, à esquerda do TELA CHEIA; fica fora do palco para
          continuar visível também no relembrar dicas / quiz / fim de jogo */}
      <BotaoVoltar />
      <div className="bol-card">
        <div className="bol-titulo-barra">
          <h1 className="bol-titulo">
            BOLICHE <span>CAMPEÃO</span>
          </h1>
        </div>

        {mostrarFim && (
          <FimEducativo esporte="boliche" vistas={edu.vistas} pontosDoJogo={final.pontos}>
            <TelaFimDeJogo
              pontos={final.pontos}
              estrelas={final.estrelas}
              emojiFinal={emojiDoResultadoFinal(final.estrelas)}
              onJogarNovamente={iniciar}
              onVoltar={() => navigate("/home?menu=jogar")}
            />
          </FimEducativo>
        )}

        <div ref={telaCheiaRef} className={`bol-stage${mostrarFim ? " bol-oculto" : ""}`}>
          {/* Dentro do palco (= elemento da tela cheia) para a dica aparecer também em tela cheia */}
          <DicaToast dica={edu.dicaVisivel} />

          <EscalaProporcional largura={GAME_WIDTH} altura={GAME_HEIGHT}>
            <canvas
              ref={cvRef}
              className="bol-canvas"
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              onPointerDown={acao}
            />

            {fase !== "intro" && (
              <div className="bol-hud">
                <div className="bol-caixa">
                  <span className="bol-rotulo">RODADA</span>
                  <b>
                    {hud.rodada}/{TOTAL_RODADAS}
                  </b>
                </div>
                <div className="bol-caixa">
                  <span className="bol-rotulo">BOLA</span>
                  <b>{hud.bolaDaRodada}ª</b>
                </div>
                <div className="bol-caixa">
                  <span className="bol-rotulo">PINOS</span>
                  <b>🎳 {hud.pinosEmPe}</b>
                </div>
                <div className="bol-caixa">
                  <span className="bol-rotulo">PONTOS</span>
                  <b>{hud.pontos}</b>
                </div>
                <button
                  type="button"
                  className="bol-mudo"
                  onClick={() => setSomLigado((s) => !s)}
                  aria-label={somLigado ? "Desligar som" : "Ligar som"}
                >
                  {somLigado ? "🔊" : "🔇"}
                </button>
              </div>
            )}

            {aviso && (
              <div key={aviso.id} className={`bol-aviso ${aviso.tom}`}>
                {aviso.txt}
                {aviso.sub && <small className="bol-aviso-sub">{aviso.sub}</small>}
              </div>
            )}

            {fase === "intro" && <TelaIntro onJogar={iniciar} />}
          </EscalaProporcional>

          {suportaTelaCheia && (
            <BotaoTelaCheia
              emTelaCheia={emTelaCheia}
              alternarTelaCheia={alternarTelaCheia}
              classe="bol-tela-cheia"
            />
          )}
        </div>

        {fase === "jogando" && (
          <div className="bol-rodape">
            <p className="bol-rodape-texto">{DICAS[hud.etapa] ?? ""}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Boliche;
