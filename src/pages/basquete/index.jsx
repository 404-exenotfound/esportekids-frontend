import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { emojiDoResultadoFinal } from "./helpers/emojiDoResultadoFinal";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import "./styles/index.css";

/* ================= CONSTANTES (ajuste a dificuldade aqui) ================= */
const W = 480;
const H = 280;
const PISO_Y = 214; // topo da quadra
const CHAO = 262; // linha onde a bola quica
const RAIO = 8;
const GRAV = 520; // gravidade (px/s²)
const FORCA = 9.5; // velocidade = distância puxada * FORCA
const PUXAO_MAX = 68; // máximo que dá pra puxar
const ANG_MIN = (28 * Math.PI) / 180; // ângulo mínimo de saída (evita tiro rasteiro)
const ANG_MAX = (80 * Math.PI) / 180;
const ANCORA = { x: 80, y: 230 }; // posição da bola nas mãos
const ARO_L = 40; // largura do aro
const M = 40; // pixels por metro
const LINHA_3 = 6.75; // metros da linha de 3 pontos
const TOTAL_BOLAS = 5;
const PASSO = 1 / 240; // passo fixo da física
const KID_X = 48;
const KID_Y = 212;

/* ================= UTILITÁRIOS ================= */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rect = (c, x, y, w, h, cor) => {
  c.fillStyle = cor;
  c.fillRect(Math.round(x), Math.round(y), w, h);
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
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const DIG = [
  "111101101101111", "010110010010111", "111001111100111", "111001111001111",
  "101101111001001", "111100111001111", "111100111101111", "111001001001001",
  "111101111101111", "111101111001111",
];
function digito(c, n, x, y, s, cor) {
  c.fillStyle = cor;
  const p = DIG[n];
  for (let i = 0; i < 15; i++)
    if (p[i] === "1") c.fillRect(x + (i % 3) * s, y + Math.floor(i / 3) * s, s, s);
}

/* ================= SPRITE DO JOGADOR ================= */
const PAL = {
  H: "#3b2314", S: "#f4bf91", s: "#d99568", E: "#1b1b2f", J: "#e8412c", j: "#b02a1b",
  W: "#fff7e0", P: "#2b50d8", p: "#1c36a0", L: "#f2f2f2", B: "#23232e", b: "#c9c9d6", C: "#ffd34d",
};
const KID = [
  "...HHHHH....", "..HHHHHHHH..", "..CCCCCCCC..", "..HSSSSSSS..", "..HSSSSESS..",
  "..sSSSSSSS..", "...sSSSSSs..", ".....ss.....", "..JJJJJJJJ..", "..JJJWWWJJ..",
  "..JJJJJWJJ..", "..JJJJWJJj..", "..jJJJWJJj..", "..jJJJJJJj..", "..PPPPPPPP..",
  "..PPPPPPPP..", "..PPPppPPP..", "..PPP..PPP..", "..sSs..sSs..", "..sSs..sSs..",
  "..LLL..LLL..", "..LLL..LLL..", ".BBBB..BBBB.", ".bbbb..bbbb.",
];
function sprite(c, mapa, x, y, s) {
  mapa.forEach((linha, j) => {
    for (let i = 0; i < linha.length; i++) {
      const k = linha[i];
      if (k === ".") continue;
      c.fillStyle = PAL[k];
      c.fillRect(x + i * s, y + j * s, s, s);
    }
  });
}
function braco(c, x0, y0, x1, y1, pele, manga) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    rect(c, x - 1, y - 1, 3, 3, t < 0.3 ? manga : pele);
  }
}

/* ================= BOLA (pixel art com costuras que giram) ================= */
function desenharBola(c, cx, cy, ang) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  const ca = Math.cos(-ang);
  const sa = Math.sin(-ang);
  for (let y = -RAIO; y < RAIO; y++) {
    for (let x = -RAIO; x < RAIO; x++) {
      const fx = x + 0.5;
      const fy = y + 0.5;
      const d = Math.hypot(fx, fy);
      if (d > RAIO) continue;
      let cor;
      if (d > RAIO - 1.1) cor = "#2b1206";
      else {
        const lx = fx * ca - fy * sa;
        const ly = fx * sa + fy * ca;
        const costura =
          Math.abs(lx) < 0.8 ||
          Math.abs(ly) < 0.8 ||
          Math.abs(Math.hypot(lx - RAIO * 1.5, ly) - RAIO * 1.5) < 0.9 ||
          Math.abs(Math.hypot(lx + RAIO * 1.5, ly) - RAIO * 1.5) < 0.9;
        const luz = (fx + fy) / (2 * RAIO);
        cor = costura ? "#3a1707" : luz < -0.35 ? "#ff9d45" : luz > 0.4 ? "#c4551a" : "#ee7421";
      }
      c.fillStyle = cor;
      c.fillRect(cx + x, cy + y, 1, 1);
    }
  }
  rect(c, cx - 4, cy - 5, 2, 1, "#ffe2b8");
}

/* ================= CENÁRIO (pré-renderizado) ================= */
function criarNuvem() {
  const cv = document.createElement("canvas");
  cv.width = 64;
  cv.height = 20;
  const c = cv.getContext("2d");
  [[14, 0, 22, 4], [6, 4, 40, 4], [2, 8, 58, 6]].forEach(([x, y, w, h]) => rect(c, x, y, w, h, "#ffffff"));
  [[4, 12, 54, 2], [10, 14, 44, 2]].forEach(([x, y, w, h]) => rect(c, x, y, w, h, "#cfe3f5"));
  return cv;
}

function criarFundo() {
  const mk = () => {
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    return [cv, c];
  };
  const [A, a] = mk();
  const [B, b] = mk();
  const r = rng(11);
  const ri = (min, max) => Math.floor(min + r() * (max - min));

  // céu em faixas com dithering
  const ceu = ["#46aef7", "#5bbaf9", "#72c6fb", "#8ad2fc", "#a4def9", "#c2e9f7", "#e4f3ee"];
  const faixa = 28;
  ceu.forEach((cor, i) => rect(a, 0, i * faixa, W, faixa, cor));
  for (let i = 1; i < ceu.length; i++)
    for (let yy = 0; yy < 2; yy++)
      for (let x = 0; x < W; x++) if (((x + yy) & 1) === 0) rect(a, x, i * faixa + yy, 1, 1, ceu[i - 1]);

  // sol
  disco(a, 392, 48, 24, "#fff4b8");
  disco(a, 392, 48, 19, "#ffe680");
  disco(a, 392, 48, 15, "#ffd23f");
  disco(a, 386, 42, 4, "#fff7cf");

  // prédios (2 camadas)
  const predios = (base, cor, janela, acesa, hmin, hmax) => {
    let x = -6;
    while (x < W) {
      const w = ri(22, 42);
      const h = ri(hmin, hmax);
      rect(a, x, base - h, w, h, cor);
      rect(a, x, base - h, w, 2, "rgba(255,255,255,.18)");
      for (let yy = base - h + 6; yy < base - 6; yy += 8)
        for (let xx = x + 4; xx < x + w - 4; xx += 6)
          rect(a, xx, yy, 2, 3, r() < acesa ? "#ffe7a1" : janela);
      if (r() < 0.4) rect(a, x + (w >> 1), base - h - 8, 1, 8, cor);
      x += w + ri(0, 4);
    }
  };
  predios(186, "#8fa8da", "#a8bde8", 0.05, 50, 100);
  predios(186, "#6f87c2", "#566ca5", 0.22, 28, 64);

  // árvores
  for (let x = 10; x < W; x += ri(34, 60)) {
    const h = ri(18, 28);
    rect(a, x + 6, 186 - (h >> 1), 4, (h >> 1) + 4, "#5b3a1e");
    disco(a, x + 8, 186 - h, 12, "#2b8a43");
    disco(a, x + 5, 186 - h - 3, 8, "#3fae5a");
    disco(a, x + 3, 186 - h - 5, 3, "#6fd07e");
  }

  // arquibancada
  rect(a, 0, 184, W, 22, "#3b4670");
  for (let y = 184; y < 206; y += 7) {
    rect(a, 0, y, W, 1, "#566399");
    rect(a, 0, y + 6, W, 1, "#2b3558");
  }

  // mureta com placas
  rect(b, 0, 204, W, 10, "#1b2340");
  const pc = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866"];
  for (let i = 0; i * 48 < W; i++) {
    rect(b, i * 48 + 1, 206, 46, 6, pc[i % 4]);
    rect(b, i * 48 + 1, 206, 46, 1, "rgba(255,255,255,.4)");
    for (let k = 0; k < 5; k++) rect(b, i * 48 + 6 + k * 8, 208, 3, 2, "rgba(255,255,255,.7)");
  }

  // quadra de madeira (tábuas com perspectiva)
  let y = PISO_Y;
  let h = 5;
  let i = 0;
  while (y < H) {
    rect(b, 0, y, W, h, i % 2 ? "#d29a4c" : "#dca355");
    rect(b, 0, y, W, 1, "rgba(255,255,255,.12)");
    for (let x = ri(0, 50) - 40; x < W; x += ri(70, 130)) rect(b, x, y, 1, h, "#b98040");
    y += h;
    h++;
    i++;
  }
  rect(b, 0, PISO_Y, W, 2, "#fff3d6");
  rect(b, 0, PISO_Y + 2, W, 2, "rgba(0,0,0,.18)");

  // linha de 3 pontos + marcas de metro
  const x3 = Math.round(ANCORA.x + LINHA_3 * M);
  for (let yy = PISO_Y + 6; yy < H; yy += 10) rect(b, x3, yy, 2, 6, "rgba(255,255,255,.85)");
  for (let m = 0; m <= 8; m++) {
    const x = ANCORA.x + m * M;
    rect(b, x, PISO_Y + 4, 1, 5, "rgba(255,255,255,.55)");
    digito(b, m, x - 3, H - 13, 2, "rgba(255,255,255,.8)");
  }

  // torcida
  const gente = [];
  const roupas = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866", "#ffffff", "#9b59d0", "#ff8fb1"];
  const peles = ["#f4bf91", "#d99568", "#a86a3d", "#7a4a2a"];
  const cabelos = ["#3b2314", "#111111", "#c9a227", "#7a3b1a"];
  [188, 196].forEach((yy) => {
    for (let x = -4; x < W; x += 9)
      gente.push({
        x: x + ri(-1, 2), y: yy, f: r() * 6,
        cor: roupas[ri(0, roupas.length)], pele: peles[ri(0, peles.length)], cabelo: cabelos[ri(0, cabelos.length)],
      });
  });
  return { A, B, gente };
}

function desenharTorcida(c, gente, t, anim) {
  for (const g of gente) {
    const pulo = anim > 0 ? -Math.round(Math.abs(Math.sin(t * 12 + g.f)) * 4) : 0;
    const y = g.y + pulo;
    rect(c, g.x, y + 4, 7, 8, g.cor);
    rect(c, g.x + 1, y, 5, 5, g.pele);
    rect(c, g.x + 1, y, 5, 2, g.cabelo);
    if (anim > 0) {
      rect(c, g.x - 1, y + 1, 2, 5, g.pele);
      rect(c, g.x + 6, y + 1, 2, 5, g.pele);
    }
  }
}

/* ================= CESTA (poste, tabela, aro, rede) ================= */
function desenharAroTras(c, a) {
  const bx = Math.round(a.x + ARO_L + 2);
  const y = Math.round(a.y);
  const ax = Math.round(a.x);
  // poste
  const px = bx + 9;
  rect(c, px, y - 24, 5, CHAO - (y - 24) + 2, "#8a93a8");
  rect(c, px, y - 24, 1, CHAO - (y - 24) + 2, "#c3cad9");
  rect(c, px + 4, y - 24, 1, CHAO - (y - 24) + 2, "#5b6477");
  rect(c, px - 3, CHAO - 1, 11, 4, "#39446a");
  rect(c, bx + 4, y - 18, 7, 4, "#8a93a8");
  // sombra da base
  c.globalAlpha = 0.22;
  rect(c, px - 5, CHAO + 3, 16, 3, "#000");
  c.globalAlpha = 1;
  // tabela
  rect(c, bx, y - 46, 5, 52, "#1b2340");
  rect(c, bx + 1, y - 45, 3, 50, "#e9f2ff");
  rect(c, bx + 1, y - 45, 1, 50, "#ffffff");
  rect(c, bx, y - 6, 5, 4, "#e8412c");
  // aro
  rect(c, ax, y - 1, ARO_L + 3, 4, "#8d2a0c");
  rect(c, ax, y - 1, ARO_L + 3, 3, "#d9481a");
  rect(c, ax + 2, y - 1, ARO_L - 2, 1, "#ff9a55");
  disco(c, ax, y + 1, 4, "#8d2a0c");
  disco(c, ax, y + 1, 3, "#ff6a2a");
  rect(c, ax - 1, y, 1, 1, "#ffb27a");
}
function desenharRede(c, a, j) {
  const topo = Math.round(a.y) + 3;
  const len = 22;
  const amp = j.rede.amp;
  for (let r = 0; r <= len; r++) {
    const t = r / len;
    const sw = Math.sin(j.tempo * 18 - t * 3) * amp * t;
    const xl = Math.round(a.x + 3 + 7 * t + sw);
    const xr = Math.round(a.x + ARO_L - 3 - 7 * t + sw);
    for (let x = xl; x <= xr; x++) {
      if (x === xl || x === xr || (x + r) % 4 === 0 || (x - r + 400) % 4 === 0) rect(c, x, topo + r, 1, 1, "#fdfdff");
    }
  }
}

/* ================= SOM (Web Audio, sem arquivos) ================= */
function useSom() {
  const ref = useRef(null);
  return useCallback((tipo) => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ref.current) ref.current = new AC();
      const a = ref.current;
      if (a.state === "suspended") a.resume();
      const nota = (f, d, o = {}) => {
        const { tipo: tp = "square", v = 0.05, at = 0, f2 } = o;
        const t = a.currentTime + at;
        const osc = a.createOscillator();
        const g = a.createGain();
        osc.type = tp;
        osc.frequency.setValueAtTime(f, t);
        if (f2) osc.frequency.exponentialRampToValueAtTime(f2, t + d);
        g.gain.setValueAtTime(v, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        osc.connect(g);
        g.connect(a.destination);
        osc.start(t);
        osc.stop(t + d + 0.02);
      };
      if (tipo === "lancar") nota(180, 0.18, { tipo: "triangle", f2: 520, v: 0.08 });
      else if (tipo === "quicar") nota(140, 0.12, { tipo: "sine", f2: 60, v: 0.12 });
      else if (tipo === "aro") nota(880, 0.1, { f2: 620, v: 0.04 });
      else if (tipo === "tabela") nota(300, 0.1, { f2: 200, v: 0.05 });
      else if (tipo === "clique") nota(660, 0.08);
      else if (tipo === "cesta") [523, 659, 784, 1047].forEach((f, i) => nota(f, 0.14, { at: i * 0.07 }));
      else if (tipo === "swish") [659, 784, 988, 1319, 1568].forEach((f, i) => nota(f, 0.14, { at: i * 0.06 }));
      else if (tipo === "erro") nota(280, 0.3, { tipo: "sawtooth", f2: 110, v: 0.04 });
      else if (tipo === "fim") [784, 659, 523, 392].forEach((f, i) => nota(f, 0.2, { at: i * 0.12 }));
    } catch {
      /* áudio é opcional */
    }
  }, []);
}

/* ================= ESTADO E FÍSICA ================= */
function novoJogo() {
  const j = {
    bola: { x: ANCORA.x, y: ANCORA.y, vx: 0, vy: 0, ang: 0, w: 0, t: 0, tocou: false, pontuou: false, tP: 0, parada: 0 },
    estado: "pronta", // pronta | voando | espera | fim
    puxando: false,
    puxe: { x: 0, y: 0 }, // vetor de puxada (define força e ângulo)
    aro: { x: 0, y: 0, alvoX: 0, alvoY: 0 },
    rede: { amp: 0 },
    parts: [], rastro: [], rastroT: 0,
    tempo: 0, bolas: TOTAL_BOLAS, pontos: 0, acertos: 0, seq: 0, mAnt: 0,
    torcida: 0, espera: 0,
  };
  sortearAro(j, true);
  return j;
}

function sortearAro(j, inicio) {
  const idx = TOTAL_BOLAS - j.bolas;
  const lo = 3.6 + idx * 0.9;
  const hi = Math.min(8.5, lo + 1.8);
  let m = lo;
  for (let k = 0; k < 8; k++) {
    m = lo + Math.random() * (hi - lo);
    if (Math.abs(m - j.mAnt) > 0.7) break;
  }
  m = Math.round(m * 20) / 20;
  j.mAnt = m;
  const ymin = m > 7.5 ? 125 : 105;
  j.aro.alvoX = ANCORA.x + m * M;
  j.aro.alvoY = ymin + Math.random() * (155 - ymin);
  if (inicio) {
    j.aro.x = j.aro.alvoX;
    j.aro.y = j.aro.alvoY;
  }
}

function bate(b, px, py, r, rest) {
  const dx = b.x - px;
  const dy = b.y - py;
  const d = Math.hypot(dx, dy);
  const min = RAIO + r;
  if (d >= min) return 0;
  let nx = -1;
  let ny = 0;
  if (d > 0.001) {
    nx = dx / d;
    ny = dy / d;
  }
  b.x = px + nx * min;
  b.y = py + ny * min;
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return 0;
  b.vx -= (1 + rest) * vn * nx;
  b.vy -= (1 + rest) * vn * ny;
  b.vx *= 0.97;
  return -vn;
}

function particulas(j, x, y, n, cores, vel, g, vida, s = 2) {
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
const CONFETE = ["#ffd34d", "#e8412c", "#2b50d8", "#2fa866", "#ffffff", "#ff8fb1"];

// velocidade de saída: força = tamanho da puxada, ângulo = direção da puxada (com ângulo mínimo)
function velocidade(j) {
  const v = Math.hypot(j.puxe.x, j.puxe.y) * FORCA;
  const ang = clamp(Math.atan2(j.puxe.y, -j.puxe.x), ANG_MIN, ANG_MAX);
  return { vx: Math.cos(ang) * v, vy: -Math.sin(ang) * v };
}

function lancar(j, ev) {
  const b = j.bola;
  const { vx, vy } = velocidade(j);
  b.x = ANCORA.x; // a bola sai das mãos do jogador
  b.y = ANCORA.y;
  b.vx = vx;
  b.vy = vy;
  b.w = 7;
  b.t = 0;
  b.tocou = false;
  b.pontuou = false;
  b.parada = 0;
  j.estado = "voando";
  j.puxando = false;
  j.puxe = { x: 0, y: 0 };
  j.rastro = [];
  ev.som("lancar");
}

function marcar(j, ev) {
  const b = j.bola;
  const m = (j.aro.x - ANCORA.x) / M;
  const base = m >= LINHA_3 ? 3 : 2;
  const limpa = !b.tocou;
  j.seq++;
  const ganho = base + (limpa ? 1 : 0) + (j.seq >= 3 ? 1 : 0);
  j.pontos += ganho;
  j.acertos++;
  j.rede.amp = limpa ? 7 : 4;
  j.torcida = 1.8;
  particulas(j, j.aro.x + ARO_L / 2, j.aro.y, 40, CONFETE, 220, 320, 1.4, 3);
  ev.cesta({ ganho, limpa, tres: base === 3, seq: j.seq });
}

function terminar(j, ev) {
  const b = j.bola;
  j.bolas--;
  if (!b.pontuou) {
    j.seq = 0;
    ev.erro({ tocou: b.tocou });
  }
  ev.hud();
  j.estado = "espera";
  j.espera = b.pontuou ? 0.5 : 0.7;
}

function proximo(j, ev) {
  if (j.bolas <= 0) {
    j.estado = "fim";
    ev.fim(j);
    return;
  }
  sortearAro(j, false);
  const b = j.bola;
  b.x = ANCORA.x;
  b.y = ANCORA.y;
  b.vx = 0;
  b.vy = 0;
  b.ang = 0;
  b.w = 0;
  j.estado = "pronta";
  j.puxe = { x: 0, y: 0 };
  j.rastro = [];
  particulas(j, ANCORA.x, ANCORA.y, 10, ["#ffffff", "#ffe680"], 70, 0, 0.4, 2);
  ev.hud();
}

function voar(j, dt, ev) {
  const b = j.bola;
  const a = j.aro;
  const py = b.y;
  b.t += dt;
  b.vy += GRAV * dt;

  // dentro da rede: amortece e centraliza
  if (b.pontuou && b.y > a.y && b.y < a.y + 26) {
    b.vx += (a.x + ARO_L / 2 - b.x) * 10 * dt;
    b.vx *= 1 - 2.5 * dt;
    b.vy *= 1 - 1.3 * dt;
  }
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.ang += b.w * dt;

  // rastro
  j.rastroT += dt;
  if (j.rastroT > 0.025) {
    j.rastroT = 0;
    j.rastro.push({ x: b.x, y: b.y, v: 1 });
    if (j.rastro.length > 14) j.rastro.shift();
  }

  // colisões: aro (2 pontas) e tabela
  const bx = a.x + ARO_L + 2;
  const i1 = bate(b, a.x, a.y, 3, 0.5);
  const i2 = bate(b, a.x + ARO_L, a.y, 3, 0.5);
  const i3 = bate(b, clamp(b.x, bx, bx + 5), clamp(b.y, a.y - 46, a.y + 6), 0, 0.6);
  if (i1 > 50 || i2 > 50) {
    b.tocou = true;
    j.rede.amp = Math.max(j.rede.amp, 2.5);
    particulas(j, b.x, b.y, 5, ["#ffffff", "#ffe680"], 90, 200, 0.3, 2);
    ev.som("aro");
  }
  if (i3 > 50) {
    b.tocou = true;
    ev.som("tabela");
  }

  // pontuação: cruzou o aro de cima para baixo, entre as pontas
  if (!b.pontuou && py < a.y && b.y >= a.y && b.vy > 0 && b.x > a.x + 4 && b.x < a.x + ARO_L - 4) {
    b.pontuou = true;
    b.tP = b.t;
    marcar(j, ev);
  }

  // chão (só trata quando a bola está descendo, para nunca anular um lançamento)
  if (b.y > CHAO - RAIO && b.vy >= 0) {
    b.y = CHAO - RAIO;
    if (b.vy > 60) {
      b.vy = -b.vy * 0.58;
      b.vx *= 0.82;
      particulas(j, b.x, CHAO, 4, ["#e9c88d", "#c9a05a"], 60, 200, 0.35, 2);
      ev.som("quicar");
    } else {
      b.vy = 0;
      b.vx *= Math.pow(0.35, dt);
      b.w = b.vx / RAIO;
    }
  }
  const parado = b.y >= CHAO - RAIO - 0.5 && b.vy === 0 && Math.abs(b.vx) < 14;
  b.parada = parado ? b.parada + dt : 0;

  if ((b.pontuou && b.t - b.tP > 1.2) || b.parada > 0.35 || b.x > W + 40 || b.x < -40 || b.t > 8) terminar(j, ev);
}

function atualizar(j, dt, ev) {
  j.tempo += dt;
  const a = j.aro;
  const k = Math.min(1, dt * 7);
  a.x += (a.alvoX - a.x) * k;
  a.y += (a.alvoY - a.y) * k;
  j.rede.amp *= Math.pow(0.12, dt);
  j.torcida = Math.max(0, j.torcida - dt);
  for (const p of j.parts) {
    p.vy += p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vida -= dt;
  }
  j.parts = j.parts.filter((p) => p.vida > 0);
  for (const r of j.rastro) r.v -= dt * 3;
  j.rastro = j.rastro.filter((r) => r.v > 0);

  if (j.estado === "voando") voar(j, dt, ev);
  else if (j.estado === "espera") {
    j.espera -= dt;
    if (j.espera <= 0) proximo(j, ev);
  } else if (j.estado === "pronta" && !j.puxando) {
    j.bola.x = ANCORA.x;
    j.bola.y = ANCORA.y + Math.sin(j.tempo * 3) * 1.2;
  }
}

/* ================= DESENHO ================= */
function desenhar(c, j, rec) {
  c.drawImage(rec.fundo.A, 0, 0);
  [[0, 24, 10], [170, 56, 6], [310, 16, 8]].forEach(([o, y, v]) => {
    const x = (((o + j.tempo * v) % (W + 90)) | 0) - 70;
    c.drawImage(rec.nuvem, x, y);
  });
  desenharTorcida(c, rec.fundo.gente, j.tempo, j.torcida);
  c.drawImage(rec.fundo.B, 0, 0);

  const b = j.bola;
  const visivel = j.estado === "pronta" || j.estado === "voando";

  // sombras
  c.globalAlpha = 0.25;
  rect(c, KID_X - 2, CHAO - 2, 30, 4, "#000");
  if (visivel) {
    const alt = CHAO - b.y;
    const w = clamp(16 - alt / 18, 5, 16);
    rect(c, b.x - w / 2, CHAO + 2, w, 3, "#000");
  }
  c.globalAlpha = 1;

  desenharAroTras(c, j.aro);

  // jogador
  sprite(c, KID, KID_X, KID_Y, 2);

  // braços acompanham a bola
  const sx = 64;
  const sy = 231;
  const dx = b.x - sx;
  const dy = b.y - sy;
  const L = Math.hypot(dx, dy) || 1;
  const alc = visivel ? Math.min(L - 5, 22) : 10;
  const hx = sx + (dx / L) * alc;
  const hy = sy + (dy / L) * alc;
  if (j.estado === "pronta" || j.estado === "espera") {
    braco(c, sx - 2, sy + 3, hx - 1, hy + 3, "#d99568", "#b02a1b");
    braco(c, sx, sy, hx, hy, "#f4bf91", "#e8412c");
  } else {
    braco(c, sx, sy, sx + 12, sy - 14, "#f4bf91", "#e8412c"); // braço levantado após o arremesso
  }

  // indicador de onde pegar a bola
  if (j.estado === "pronta" && !j.puxando) {
    const pulso = 13 + Math.sin(j.tempo * 4) * 2;
    for (let i = 0; i < 12; i++) {
      const an = (i / 12) * Math.PI * 2 + j.tempo;
      rect(c, ANCORA.x + Math.cos(an) * pulso, ANCORA.y + Math.sin(an) * pulso, 2, 2, "rgba(255,255,255,.75)");
    }
  }

  // mira estilo Angry Birds
  if (j.puxando) {
    const pdx = b.x - ANCORA.x;
    const pdy = b.y - ANCORA.y;
    const dist = Math.hypot(pdx, pdy);
    const n = Math.floor(dist / 5);
    for (let i = 1; i < n; i++) rect(c, ANCORA.x + (pdx * i) / n - 1, ANCORA.y + (pdy * i) / n - 1, 2, 2, "#ffe680");
    const f = Math.hypot(j.puxe.x, j.puxe.y) / PUXAO_MAX;
    const { vx, vy } = velocidade(j);
    for (let i = 1; i <= 16; i++) {
      const t = i * 0.075;
      const x = ANCORA.x + vx * t;
      const y = ANCORA.y + vy * t + 0.5 * GRAV * t * t;
      if (y > CHAO - RAIO) break;
      const s = i < 6 ? 3 : 2;
      rect(c, x - s / 2 - 1, y - s / 2 - 1, s + 2, s + 2, "#1b2340");
      rect(c, x - s / 2, y - s / 2, s, s, "#ffffff");
    }
    // barra de força
    const bx = 30;
    const by = 182;
    rect(c, bx - 2, by - 2, 74, 12, "#1b2340");
    rect(c, bx, by, 70, 8, "#39446a");
    const cheios = Math.round(f * 14);
    for (let i = 0; i < cheios; i++) rect(c, bx + i * 5, by, 4, 8, i < 6 ? "#5be37d" : i < 10 ? "#ffd34d" : "#ff5a3c");
  }

  // rastro e bola
  for (const r of j.rastro) {
    c.globalAlpha = clamp(r.v, 0, 1) * 0.45;
    rect(c, r.x - 2, r.y - 2, 4, 4, "#ffb066");
  }
  c.globalAlpha = 1;
  if (visivel) desenharBola(c, b.x, b.y, b.ang);

  desenharRede(c, j.aro, j);

  // partículas
  for (const p of j.parts) {
    c.globalAlpha = clamp(p.vida / p.max, 0, 1);
    rect(c, p.x, p.y, p.s, p.s, p.cor);
  }
  c.globalAlpha = 1;
}

/* ================= COMPONENTE ================= */
export default function Basquete({ aoTerminar }) {
  const cvRef = useRef(null);
  const jogoRef = useRef(null);
  if (!jogoRef.current) jogoRef.current = novoJogo();

  const [fase, setFase] = useState("intro"); // intro | jogando | fim
  const [hud, setHud] = useState({ pontos: 0, acertos: 0, bolas: TOTAL_BOLAS, seq: 0, dist: 0 });
  const [aviso, setAviso] = useState(null);
  const [final, setFinal] = useState(null);
  const faseRef = useRef(fase);
  faseRef.current = fase;
  const idAviso = useRef(0);

  const som = useSom();
  const somRef = useRef(som);
  somRef.current = som;
  const fimRef = useRef(aoTerminar);
  fimRef.current = aoTerminar;

  const navigate = useNavigate();
  // Cada cesta (acerto) libera a próxima dica, igual aos outros jogos
  const edu = useDicasDoJogo("basquete", hud.acertos);

  const sync = useCallback(() => {
    const j = jogoRef.current;
    setHud({ pontos: j.pontos, acertos: j.acertos, bolas: j.bolas, seq: j.seq, dist: (j.aro.alvoX - ANCORA.x) / M });
  }, []);

  const avisar = useCallback((txt, tom) => setAviso({ id: ++idAviso.current, txt, tom }), []);

  const ev = useMemo(
    () => ({
      som: (t) => somRef.current(t),
      hud: sync,
      cesta: ({ ganho, limpa, tres }) => {
        somRef.current(limpa ? "swish" : "cesta");
        avisar(`${limpa ? "SWISH! " : tres ? "DE TRÊS! " : "CESTA! "}+${ganho}`, "bom");
        sync();
      },
      erro: ({ tocou }) => {
        somRef.current("erro");
        avisar(tocou ? "NA TRAVE!" : "ERROU!", "ruim");
      },
      fim: (j) => {
        const estrelas = j.acertos >= 4 ? 3 : j.acertos >= 2 ? 2 : j.acertos >= 1 ? 1 : 0;
        const r = { pontos: j.pontos, acertos: j.acertos, estrelas };
        setFinal(r);
        setFase("fim");
        somRef.current("fim");
        if (fimRef.current) fimRef.current(r);
      },
    }),
    [sync, avisar]
  );

  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(() => setAviso(null), 1400);
    return () => clearTimeout(t);
  }, [aviso]);

  // loop do jogo
  useEffect(() => {
    const cv = cvRef.current;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    const rec = { fundo: criarFundo(), nuvem: criarNuvem() };
    const j = jogoRef.current;
    let raf;
    let ult = performance.now();
    let acc = 0;
    const loop = (agora) => {
      const dt = Math.min(0.05, (agora - ult) / 1000);
      ult = agora;
      acc += dt;
      while (acc >= PASSO) {
        atualizar(j, PASSO, ev);
        acc -= PASSO;
      }
      desenhar(c, j, rec);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ev]);

  /* ---------- entrada (mouse e toque) ---------- */
  const pos = (e) => {
    const r = cvRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };
  const aoPressionar = (e) => {
    const j = jogoRef.current;
    if (faseRef.current !== "jogando" || j.estado !== "pronta") return;
    const p = pos(e);
    if (Math.hypot(p.x - j.bola.x, p.y - j.bola.y) < 46) {
      j.puxando = true;
      cvRef.current.setPointerCapture(e.pointerId);
    }
  };
  const aoMover = (e) => {
    const j = jogoRef.current;
    if (!j.puxando) return;
    const p = pos(e);
    let dx = Math.min(0, p.x - ANCORA.x);
    let dy = p.y - ANCORA.y;
    const len = Math.hypot(dx, dy);
    if (len > PUXAO_MAX) {
      dx *= PUXAO_MAX / len;
      dy *= PUXAO_MAX / len;
    }
    j.puxe = { x: dx, y: dy };
    j.bola.x = ANCORA.x + dx;
    j.bola.y = Math.min(ANCORA.y + dy, H - RAIO - 2); // só visual; a força usa j.puxe
  };
  const aoSoltar = () => {
    const j = jogoRef.current;
    if (!j.puxando) return;
    if (Math.hypot(j.puxe.x, j.puxe.y) < 10) {
      j.puxando = false; // puxou pouco: cancela
      j.puxe = { x: 0, y: 0 };
      j.bola.x = ANCORA.x;
      j.bola.y = ANCORA.y;
    } else lancar(j, ev);
  };

  const iniciar = () => {
    somRef.current("clique");
    Object.assign(jogoRef.current, novoJogo());
    setFinal(null);
    setAviso(null);
    sync();
    setFase("jogando");
  };

  const dist = hud.dist.toFixed(1).replace(".", ",");
  const mostrarFim = fase === "fim" && final;

  return (
    <div className="bq-wrapper">
      <BotaoVoltar />
      <div className="bq-card">
        {/* Cabeçalho do card (mesmo padrão dos outros jogos) */}
        <div className="bq-titulo-barra">
          <h1 className="bq-titulo">
            BASQUETE <span>CAMPEÃO</span>
          </h1>
        </div>

        {!mostrarFim && <DicaToast dica={edu.dicaVisivel} />}

        {mostrarFim && (
          <FimEducativo esporte="basquete" vistas={edu.vistas}>
            <TelaFimDeJogo
              cestas={final.acertos}
              pontos={final.pontos}
              estrelas={final.estrelas}
              emojiFinal={emojiDoResultadoFinal(final.acertos)}
              onJogarNovamente={iniciar}
              onVoltar={() => navigate("/home")}
            />
          </FimEducativo>
        )}

        {/* O palco (canvas) fica sempre montado: só é escondido no fim do jogo,
            para o loop de desenho continuar ligado ao mesmo canvas ao jogar de novo. */}
        <div className={`bq-stage${mostrarFim ? " bq-oculto" : ""}`}>
          <canvas
            ref={cvRef}
            className="bq-canvas"
            width={W}
            height={H}
            onPointerDown={aoPressionar}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerCancel={aoSoltar}
          />

          {fase !== "intro" && (
            <>
              <div className="bq-hud">
                <div className="bq-caixa">
                  <span className="bq-rotulo">PONTOS</span>
                  <b>{String(hud.pontos).padStart(3, "0")}</b>
                </div>
                <div className="bq-caixa">
                  <span className="bq-rotulo">BOLAS</span>
                  <span className="bq-bolas">
                    {Array.from({ length: TOTAL_BOLAS }, (_, i) => (
                      <i key={i} className={i < hud.bolas ? "cheia" : "vazia"} />
                    ))}
                  </span>
                </div>
                <div className="bq-caixa">
                  <span className="bq-rotulo">DISTÂNCIA</span>
                  <b>
                    {dist} m {hud.dist >= LINHA_3 && <small className="bq-tres">3 PTS</small>}
                  </b>
                </div>
              </div>
              {hud.seq >= 2 && <div className="bq-combo">🔥 x{hud.seq}</div>}
            </>
          )}

          {aviso && (
            <div key={aviso.id} className={`bq-aviso ${aviso.tom}`}>
              {aviso.txt}
            </div>
          )}

          {fase === "intro" && <TelaIntro onJogar={iniciar} />}
        </div>

        {fase === "jogando" && (
          <div className="bq-rodape">
            <p className="bq-rodape-texto">PUXE A BOLA PARA TRÁS, MIRE E SOLTE PARA ARREMESSAR!</p>
          </div>
        )}
      </div>
    </div>
  );
}
