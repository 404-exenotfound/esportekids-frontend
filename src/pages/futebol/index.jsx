import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EscalaProporcional from "../../components/EscalaProporcional";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import useTelaCheia from "../../hooks/useTelaCheia";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { TOTAL_RODADAS } from "./utils/constantes";
import { escolherZonaGoleiro } from "./helpers/escolherZonaGoleiro";
import { dificuldadeDaRodada } from "./helpers/dificuldadeDaRodada";
import { calcularEstrelas } from "./helpers/calcularEstrelas";
import { emojiDoResultadoFinal } from "./helpers/emojiDoResultadoFinal";
import { sorteiaFrase } from "./helpers/sorteiaFrase";
import { criarRuidoBuffer } from "./helpers/criarRuidoBuffer";
import {
  FRASES_DEFESA,
  FRASES_GOL,
  FRASES_TORCIDA_DEFESA,
  FRASES_TORCIDA_GOL,
} from "./utils/frases";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import "./styles/index.css";

/* ================= CONSTANTES ================= */
// Câmera de frente para o gol (igual aos clássicos jogos de pênalti): o
// jogador bate de costas para a câmera, em primeiro plano, e o gol fica
// centralizado ao fundo — não é a câmera lateral do Basquete Campeão, que
// não fazia sentido para um pênalti (ver conversa com o usuário).
const W = 520;
const H = 308;
const RAIO_PERTO = 11; // raio da bola junto ao jogador (primeiro plano)
const RAIO_LONGE = 5; // raio da bola ao entrar no gol (fundo, mais longe)
const GRAV = 1500; // gravidade do chute (px/s²)
const TEMPO_VOO = 0.5; // s, duração do chute até a bola chegar no alvo
const PASSO = 1 / 240; // passo fixo da física

// Cenário de fundo (céu + prédios + arquibancada + mureta), compactado no
// topo da tela porque agora é só a moldura atrás do gol, não uma quadra
// inteira vista de lado.
const HORIZONTE = 56; // base dos prédios / topo da arquibancada
const ARQUIBANCADA_Y = 56;
const MURETA_Y = 76;
const GOL_TOPO = 88; // travessão
const GOL_BASE = 190; // linha de fundo do gol (pés do goleiro)

const GOL_X = 90; // poste esquerdo
const GOL_L = 340; // boca do gol
const GOL_ALT = GOL_BASE - GOL_TOPO; // 102
const GOLEIRO_CENTRO_X = GOL_X + GOL_L / 2; // 260

// 5 alvos dentro do gol, na mesma ordem das antigas ZONAS (0 cima-esq,
// 1 cima-dir, 2 centro, 3 baixo-esq, 4 baixo-dir).
const ALVOS = [
  { x: GOL_X + GOL_L * 0.16, y: GOL_TOPO + GOL_ALT * 0.2 },
  { x: GOL_X + GOL_L * 0.84, y: GOL_TOPO + GOL_ALT * 0.2 },
  { x: GOLEIRO_CENTRO_X, y: GOL_TOPO + GOL_ALT * 0.55 },
  { x: GOL_X + GOL_L * 0.16, y: GOL_TOPO + GOL_ALT * 0.85 },
  { x: GOL_X + GOL_L * 0.84, y: GOL_TOPO + GOL_ALT * 0.85 },
];
const GOLEIRO_CHAO = { x: GOLEIRO_CENTRO_X, y: GOL_BASE - 15 };

// Jogador em primeiro plano, de costas/frente para a câmera, bem maior que
// o goleiro ao fundo — é a diferença de profundidade que vende a câmera.
const KID_ESCALA = 3;
const ANCORA = { x: GOLEIRO_CENTRO_X, y: H - 20 }; // bola na marca do pênalti
const KID_X = ANCORA.x - 6 * KID_ESCALA;
const KID_Y = H - 24 * KID_ESCALA - 16;

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

/* ================= SPRITES (paleta única, matriz ASCII) ================= */
// Mesma convenção do Basquete: cada string é uma linha, cada caractere uma
// cor, "." é transparente. O jogador veste um uniforme azul (para se
// diferenciar do basquete) e o goleiro, o clássico amarelo de goleiro —
// os dois já são desenhados de frente, o que cai bem numa câmera frontal.
const PAL = {
  H: "#3b2314", G: "#5c3a21", S: "#f4bf91", s: "#d99568", E: "#1b1b2f",
  J: "#2b50d8", j: "#1c36a0", R: "#5e86ff",
  W: "#fff7e0", P: "#f2f2f2", p: "#d9d9d9", L: "#f2f2f2", B: "#23232e", b: "#c9c9d6",
  C: "#e8412c", c: "#b02a1b",
  F: "#f8b878", Y: "#ffd166", k: "#1f1f1f", w: "#ffffff",
};
const KID = [
  "...HHHHH....", "..GHHHHHHH..", "..cCCCCCCC..", "..HSSSSSSS..", "..HSSSSESS..",
  "..sSSSSSSS..", "...sSSSSSs..", ".....ss.....", "..RJJJJJJJ..", "..JJJWWWJJ..",
  "..JJJJJWJJ..", "..JJJJWJJj..", "..jJJJWJJj..", "..jJJJJJJj..", "..PPPPPPPP..",
  "..PPPPPPPP..", "..PPPppPPP..", "..PPP..PPP..", "..sSs..sSs..", "..sSs..sSs..",
  "..LLL..LLL..", "..LLL..LLL..", ".BBBB..BBBB.", ".bbbb..bbbb.",
];
const GOLEIRO = [
  "...kkkkkk...",
  "..kkkkkkkk..",
  ".kFFFFFFFFk.",
  ".kFFkFFkFFk.",
  ".kFFFFFFFFk.",
  "..kFFFFFFk..",
  ".wYYYYYYYYw.",
  "wwYYYYYYYYww",
  "..YYYYYYYY..",
  "..YYwwwwYY..",
  "..YYYYYYYY..",
  "..YwwwwwwY..",
  "..kkk..kkk..",
  "..kkk..kkk..",
  "..kkk..kkk..",
  "..kkk..kkk..",
  ".kkkk..kkkk.",
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
function braco(c, x0, y0, x1, y1, pele, manga, espessura = 3) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    const m = Math.ceil(espessura / 2);
    rect(c, x - m, y - m, espessura, espessura, t < 0.3 ? manga : pele);
  }
}
// Goleiro pré-renderizado uma vez (sprite 24x34) para poder "mergulhar" com
// rotação via drawImage sem perder a nitidez (imageSmoothingEnabled=false).
function criarSpriteGoleiro() {
  const cv = document.createElement("canvas");
  cv.width = 24;
  cv.height = 34;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  sprite(c, GOLEIRO, 0, 0, 2);
  return cv;
}
function desenharGoleiro(c, spr, g) {
  // De frente para a câmera, mergulhar é sobretudo deslizar de lado; uma
  // leve inclinação (bem menor que a rotação de perfil) basta para o "mergulho".
  const dx = g.x - GOLEIRO_CENTRO_X;
  const angulo = clamp(dx / 100, -1, 1) * 22;
  c.save();
  c.translate(Math.round(g.x), Math.round(g.y));
  if (Math.abs(angulo) > 1) c.rotate((angulo * Math.PI) / 180);
  c.imageSmoothingEnabled = false;
  c.drawImage(spr, -12, -32);
  c.restore();
}

/* ================= BOLA (pixel art com gomos que giram) ================= */
function desenharBola(c, cx, cy, ang, raio) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  const ca = Math.cos(-ang);
  const sa = Math.sin(-ang);
  const centros = [[0, 0]];
  for (let p = 0; p < 5; p++) {
    const a2 = (p / 5) * Math.PI * 2;
    centros.push([Math.cos(a2) * raio * 0.56, Math.sin(a2) * raio * 0.56]);
  }
  for (let y = -raio; y < raio; y++) {
    for (let x = -raio; x < raio; x++) {
      const fx = x + 0.5;
      const fy = y + 0.5;
      const d = Math.hypot(fx, fy);
      if (d > raio) continue;
      let cor;
      if (d > raio - 1.1) cor = "#2b2b33";
      else {
        const lx = fx * ca - fy * sa;
        const ly = fx * sa + fy * ca;
        const gomo = centros.some(([px, py]) => Math.hypot(lx - px, ly - py) < raio * 0.32);
        const luz = (fx + fy) / (2 * raio);
        const base = luz < -0.55
          ? "#ffffff"
          : luz < -0.35
          ? "#f1f2f4"
          : luz > 0.55
          ? "#9aa0ab"
          : luz > 0.4
          ? "#bcc1cb"
          : "#dde1e8";
        cor = gomo ? "#1f1f27" : base;
      }
      c.fillStyle = cor;
      c.fillRect(cx + x, cy + y, 1, 1);
    }
  }
  rect(c, cx - Math.round(raio * 0.5), cy - Math.round(raio * 0.6), 2, 1, "#ffffff");
  rect(c, cx + Math.round(raio * 0.4), cy + Math.round(raio * 0.5), 1, 1, "#6d7280");
}

/* ================= CENÁRIO (pré-renderizado) ================= */
function criarNuvem() {
  const cv = document.createElement("canvas");
  cv.width = 48;
  cv.height = 14;
  const c = cv.getContext("2d");
  [[10, 0, 16, 3], [4, 3, 30, 3], [1, 6, 44, 4]].forEach(([x, y, w, h]) => rect(c, x, y, w, h, "#ffffff"));
  [[3, 9, 40, 2]].forEach(([x, y, w, h]) => rect(c, x, y, w, h, "#cfe3f5"));
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

  // céu em faixas com dithering (igual ao Basquete: decoração genérica)
  const ceu = ["#46aef7", "#5bbaf9", "#72c6fb", "#8ad2fc", "#a4def9", "#c2e9f7", "#e4f3ee"];
  const faixa = Math.ceil(HORIZONTE / ceu.length);
  ceu.forEach((cor, i) => rect(a, 0, i * faixa, W, faixa, cor));
  for (let i = 1; i < ceu.length; i++)
    for (let yy = 0; yy < 2; yy++)
      for (let x = 0; x < W; x++) if (((x + yy) & 1) === 0) rect(a, x, i * faixa + yy, 1, 1, ceu[i - 1]);

  // sol
  disco(a, 450, 24, 13, "#fff4b8");
  disco(a, 450, 24, 10, "#ffe680");
  disco(a, 450, 24, 8, "#ffd23f");
  disco(a, 446, 20, 3, "#fff7cf");

  // prédios (2 camadas), base encostada na arquibancada
  const predios = (base, cor, janela, acesa, hmin, hmax, sombraLado) => {
    let x = -6;
    while (x < W) {
      const w = ri(26, 46);
      const h = ri(hmin, hmax);
      rect(a, x, base - h, w, h, cor);
      rect(a, x, base - h, w, 1, "rgba(255,255,255,.18)");
      for (let yy = base - h + 3; yy < base - 3; yy += 5)
        for (let xx = x + 4; xx < x + w - 4; xx += 6)
          rect(a, xx, yy, 2, 2, r() < acesa ? "#ffe7a1" : janela);
      rect(a, x + w - 2, base - h + 1, 2, h - 1, sombraLado);
      x += w + ri(0, 4);
    }
  };
  predios(HORIZONTE, "#8fa8da", "#a8bde8", 0.05, 18, 40, "rgba(20,30,70,.16)");
  predios(HORIZONTE, "#6f87c2", "#566ca5", 0.22, 10, 24, "rgba(20,30,70,.2)");

  // arquibancada (silhueta) + torcida
  rect(a, 0, ARQUIBANCADA_Y, W, MURETA_Y - ARQUIBANCADA_Y, "#3b4670");
  for (let y = ARQUIBANCADA_Y; y < MURETA_Y; y += 7) {
    rect(a, 0, y, W, 1, "#566399");
    rect(a, 0, y + 5, W, 1, "#2b3558");
  }
  const gente = [];
  const roupas = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866", "#ffffff", "#9b59d0", "#ff8fb1"];
  const peles = ["#f4bf91", "#d99568", "#a86a3d", "#7a4a2a"];
  const cabelos = ["#3b2314", "#111111", "#c9a227", "#7a3b1a"];
  for (let x = -4; x < W; x += 8)
    gente.push({
      x: x + ri(-1, 2), y: ARQUIBANCADA_Y + 3, f: r() * 6,
      cor: roupas[ri(0, roupas.length)], pele: peles[ri(0, peles.length)], cabelo: cabelos[ri(0, cabelos.length)],
    });

  // mureta com placas, logo atrás do travessão
  rect(b, 0, MURETA_Y, W, GOL_TOPO - MURETA_Y, "#1b2340");
  const pc = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866"];
  for (let i = 0; i * 44 < W; i++) {
    rect(b, i * 44 + 1, MURETA_Y + 1, 42, GOL_TOPO - MURETA_Y - 3, pc[i % 4]);
    rect(b, i * 44 + 1, MURETA_Y + 1, 42, 1, "rgba(255,255,255,.4)");
  }

  // gramado em perspectiva (trapézio convergindo para a linha do gol); uma
  // base sólida cobre toda a largura primeiro, pra não sobrar preto nas
  // laterais onde o trapézio ainda não alcança a borda da tela.
  rect(b, 0, GOL_TOPO, W, H - GOL_TOPO, "#3c8a1f");
  const faixaY = 4;
  for (let y = GOL_BASE; y < H; y += faixaY) {
    const prog = (y - GOL_BASE) / (H - GOL_BASE);
    const largura = GOL_L - 20 + (W + 60 - (GOL_L - 20)) * prog;
    const xEsq = W / 2 - largura / 2;
    const faixasCampo = 9;
    for (let f = 0; f < faixasCampo; f++) {
      const xA = xEsq + (largura * f) / faixasCampo;
      const xB = xEsq + (largura * (f + 1)) / faixasCampo;
      rect(b, xA, y, Math.ceil(xB - xA) + 1, faixaY, f % 2 === 0 ? "#4aa028" : "#3c8a1f");
    }
    rect(b, xEsq - 1, y, 2, faixaY, "rgba(255,255,255,.55)");
    rect(b, xEsq + largura - 1, y, 2, faixaY, "rgba(255,255,255,.55)");
  }
  rect(b, W / 2 - (GOL_L - 20) / 2, GOL_BASE, GOL_L - 20, 2, "#fff3d6");
  disco(b, ANCORA.x, H - 16, 2, "rgba(255,255,255,.85)");

  // trave (postes + travessão), fixa — mesma técnica de 3 faixas do Basquete
  const xE = GOL_X;
  const xD = GOL_X + GOL_L;
  b.globalAlpha = 0.22;
  rect(b, xE - 8, GOL_BASE + 1, GOL_L + 16, 3, "#000");
  b.globalAlpha = 1;
  [xE, xD].forEach((px) => {
    rect(b, px - 2, GOL_TOPO, 5, GOL_BASE - GOL_TOPO, "#c7ccd6");
    rect(b, px - 2, GOL_TOPO, 1, GOL_BASE - GOL_TOPO, "#ffffff");
    rect(b, px + 2, GOL_TOPO, 1, GOL_BASE - GOL_TOPO, "#818891");
  });
  rect(b, xE - 2, GOL_TOPO - 3, GOL_L + 4, 5, "#c7ccd6");
  rect(b, xE - 2, GOL_TOPO - 3, GOL_L + 4, 1, "#ffffff");
  rect(b, xE - 2, GOL_TOPO + 1, GOL_L + 4, 1, "#818891");

  return { A, B, gente };
}

function desenharTorcida(c, gente, t, anim) {
  for (const g of gente) {
    const pulo = anim > 0 ? -Math.round(Math.abs(Math.sin(t * 12 + g.f)) * 3) : 0;
    const y = g.y + pulo;
    rect(c, g.x, y + 3, 6, 6, g.cor);
    rect(c, g.x + 1, y, 4, 4, g.pele);
    rect(c, g.x + 1, y, 4, 2, g.cabelo);
    if (anim > 0) {
      rect(c, g.x - 1, y + 1, 2, 4, g.pele);
      rect(c, g.x + 5, y + 1, 2, 4, g.pele);
    }
  }
}

/* ================= REDE DO GOL ================= */
function desenharRede(c, j) {
  const amp = j.rede.amp;
  const impacto = j.rede.px ?? GOLEIRO_CENTRO_X;
  // Malha bem mais aberta que a do Basquete: aqui o gol ocupa quase a
  // largura toda da câmera, então o mesmo espaçamento de antes virava uma
  // teia fechada demais (quase estática de TV). Losangos maiores leem
  // como rede de verdade.
  const passo = 15;
  for (let yy = 0; yy <= GOL_ALT; yy++) {
    const ty = yy / GOL_ALT;
    for (let x = GOL_X + 2; x <= GOL_X + GOL_L - 2; x++) {
      const distImpacto = Math.abs(x - impacto);
      const falloff = Math.max(0, 1 - distImpacto / 90);
      const sw = Math.sin(j.tempo * 16 - ty * 3) * amp * falloff * (0.35 + 0.65 * ty);
      const xx = Math.round(x + sw);
      if ((xx + yy) % passo === 0 || (xx - yy + 800) % passo === 0)
        rect(c, xx, GOL_TOPO + yy, 1, 1, xx < GOLEIRO_CENTRO_X ? "#dfe6ff" : "#fdfdff");
    }
  }
}

/* ================= SOM (chiptune + torcida, respeita som/volume) ================= */
function useSomFutebol(somLigado) {
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
      if (!somLigadoRef.current) return;
      const a = garantir();
      if (!a) return;
      try {
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
          g.connect(masterRef.current);
          osc.start(t);
          osc.stop(t + d + 0.02);
        };
        if (tipo === "chute") nota(200, 0.12, { tipo: "triangle", f2: 480, v: 0.09 });
        else if (tipo === "defesa") nota(320, 0.14, { f2: 160, v: 0.06 });
        else if (tipo === "clique") nota(660, 0.08);
        else if (tipo === "gol") [523, 659, 784, 1047].forEach((f, i) => nota(f, 0.14, { at: i * 0.07 }));
        else if (tipo === "erro") nota(280, 0.3, { tipo: "sawtooth", f2: 110, v: 0.04 });
        else if (tipo === "fim") [784, 659, 523, 392].forEach((f, i) => nota(f, 0.2, { at: i * 0.12 }));
      } catch {
        /* áudio é opcional */
      }
    },
    [garantir]
  );

  const torcida = useCallback(
    (tipo) => {
      if (!somLigadoRef.current || volumeRef.current <= 0) return;
      const ctx = garantir();
      if (!ctx) return;
      const agora = ctx.currentTime;
      const ehGol = tipo === "gol";
      const duracao = ehGol ? 1.3 + Math.random() * 0.5 : 0.55 + Math.random() * 0.25;

      const fonte = ctx.createBufferSource();
      fonte.buffer = criarRuidoBuffer(ctx, duracao);
      const filtro = ctx.createBiquadFilter();
      filtro.type = "bandpass";
      filtro.frequency.value = ehGol ? 900 + Math.random() * 400 : 350 + Math.random() * 150;
      filtro.Q.value = 0.7;
      const ganho = ctx.createGain();
      ganho.gain.setValueAtTime(0.0001, agora);
      ganho.gain.exponentialRampToValueAtTime(ehGol ? 0.22 : 0.12, agora + 0.12);
      ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);
      fonte.connect(filtro);
      filtro.connect(ganho);
      ganho.connect(masterRef.current);
      fonte.start(agora);
      fonte.stop(agora + duracao + 0.05);

      if (ehGol) {
        const assobio = ctx.createBufferSource();
        assobio.buffer = criarRuidoBuffer(ctx, duracao * 0.75);
        const filtroAgudo = ctx.createBiquadFilter();
        filtroAgudo.type = "highpass";
        filtroAgudo.frequency.value = 2500;
        const ganhoAgudo = ctx.createGain();
        ganhoAgudo.gain.setValueAtTime(0.0001, agora);
        ganhoAgudo.gain.exponentialRampToValueAtTime(0.06, agora + 0.15);
        ganhoAgudo.gain.exponentialRampToValueAtTime(0.0001, agora + duracao * 0.75);
        assobio.connect(filtroAgudo);
        filtroAgudo.connect(ganhoAgudo);
        ganhoAgudo.connect(masterRef.current);
        assobio.start(agora);
        assobio.stop(agora + duracao * 0.75 + 0.05);
      }
    },
    [garantir]
  );

  return { tocar, torcida };
}

/* ================= ESTADO E FÍSICA ================= */
function novoJogo() {
  return {
    bola: { x: ANCORA.x, y: ANCORA.y, vx: 0, vy: 0, ang: 0, w: 0, t: 0, T: TEMPO_VOO, resolvida: false },
    estado: "pronta", // pronta | chutando | espera | fim
    defendeu: false,
    goleiro: { x: GOLEIRO_CHAO.x, y: GOLEIRO_CHAO.y, alvoX: GOLEIRO_CHAO.x, alvoY: GOLEIRO_CHAO.y },
    rede: { amp: 0, px: null },
    parts: [], rastro: [], rastroT: 0,
    tempo: 0, posT: 0,
    rodada: 1, placar: 0, seq: 0, historico: [],
    torcida: 0, espera: 0,
  };
}

const CONFETE = ["#ffd34d", "#e8412c", "#2b50d8", "#2fa866", "#ffffff", "#ff8fb1"];
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

// Raio "óptico" da bola no instante t do voo: grande perto do jogador,
// encolhendo conforme ela se afasta rumo ao gol — a mesma ideia das tábuas
// em perspectiva do Basquete, só que aplicada ao tamanho da bola.
function raioDaBola(progresso) {
  return RAIO_PERTO + (RAIO_LONGE - RAIO_PERTO) * clamp(progresso, 0, 1);
}

function chutar(j, indiceAlvo, dificuldade, ev) {
  if (j.estado !== "pronta") return;
  const zonaSorteada = escolherZonaGoleiro(j.rodada, indiceAlvo, dificuldade);
  const defendeu = zonaSorteada === indiceAlvo;
  j.defendeu = defendeu;

  const alvo = ALVOS[indiceAlvo];
  const dx = alvo.x - ANCORA.x;
  const dy = alvo.y - ANCORA.y;
  const T = TEMPO_VOO;
  const b = j.bola;
  b.x = ANCORA.x;
  b.y = ANCORA.y;
  b.vx = dx / T;
  b.vy = (dy - 0.5 * GRAV * T * T) / T;
  b.w = b.vx > 0 ? 11 : -11;
  b.t = 0;
  b.T = T;
  b.resolvida = false;
  b.ang = 0;

  const alvoGoleiro = ALVOS[zonaSorteada];
  j.goleiro.alvoX = alvoGoleiro.x;
  j.goleiro.alvoY = Math.min(alvoGoleiro.y, GOLEIRO_CHAO.y);

  j.estado = "chutando";
  j.rastro = [];
  j.rede.px = null;
  ev.som("chute");
}

function resolver(j, ev) {
  const b = j.bola;
  if (j.defendeu) {
    b.vx *= 0.12;
    b.vy = -70;
    j.seq = 0;
    j.historico.push("defesa");
    ev.defesa();
  } else {
    b.vx *= 0.2;
    b.vy = 40;
    j.placar++;
    j.seq++;
    j.rede.amp = 7;
    j.rede.px = b.x;
    j.torcida = 1.8;
    j.historico.push("gol");
    particulas(j, b.x, b.y, 40, CONFETE, 220, 320, 1.4, 3);
    ev.gol();
  }
}

function voar(j, dt, ev) {
  const b = j.bola;
  if (!b.resolvida) {
    b.t += dt;
    b.vy += GRAV * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.ang += b.w * dt;

    // Rastro bem mais curto que o do Basquete: aqui a bola atravessa quase
    // a tela toda em 0,5s, então o mesmo número de pontos/duração virava
    // uma linha tracejada longa (parecia um bug) em vez de um borrão colado
    // na bola.
    j.rastroT += dt;
    if (j.rastroT > 0.016) {
      j.rastroT = 0;
      j.rastro.push({ x: b.x, y: b.y, v: 1, s: raioDaBola(b.t / b.T) });
      if (j.rastro.length > 6) j.rastro.shift();
    }

    if (b.t >= b.T) {
      b.resolvida = true;
      j.posT = 0;
      resolver(j, ev);
    }
  } else {
    j.posT += dt;
    if (j.posT < 0.18) {
      b.vy += GRAV * 0.6 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.ang += b.w * dt;
    }
    if (j.posT >= 0.95) terminar(j, ev);
  }
}

function terminar(j, ev) {
  j.estado = "espera";
  j.espera = 0.6;
  ev.hud();
}

function proximaRodada(j, ev) {
  if (j.rodada >= TOTAL_RODADAS) {
    j.estado = "fim";
    ev.fim(j);
    return;
  }
  j.rodada++;
  const b = j.bola;
  b.x = ANCORA.x;
  b.y = ANCORA.y;
  b.vx = 0;
  b.vy = 0;
  b.ang = 0;
  b.w = 0;
  b.resolvida = false;
  j.goleiro.alvoX = GOLEIRO_CHAO.x;
  j.goleiro.alvoY = GOLEIRO_CHAO.y;
  j.estado = "pronta";
  j.rastro = [];
  particulas(j, ANCORA.x, ANCORA.y, 10, ["#ffffff", "#ffe680"], 70, 0, 0.4, 2);
  ev.hud();
}

function atualizar(j, dt, ev) {
  j.tempo += dt;
  const g = j.goleiro;
  const k = Math.min(1, dt * 9);
  g.x += (g.alvoX - g.x) * k;
  g.y += (g.alvoY - g.y) * k;
  j.rede.amp *= Math.pow(0.12, dt);
  j.torcida = Math.max(0, j.torcida - dt);
  for (const p of j.parts) {
    p.vy += p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vida -= dt;
  }
  j.parts = j.parts.filter((p) => p.vida > 0);
  for (const r of j.rastro) r.v -= dt * 7;
  j.rastro = j.rastro.filter((r) => r.v > 0);

  if (j.estado === "chutando") voar(j, dt, ev);
  else if (j.estado === "espera") {
    j.espera -= dt;
    if (j.espera <= 0) proximaRodada(j, ev);
  } else if (j.estado === "pronta") {
    j.bola.x = ANCORA.x;
    j.bola.y = ANCORA.y + Math.sin(j.tempo * 3) * 1.2;
  }
}

/* ================= DESENHO ================= */
function desenhar(c, j, rec) {
  // Limpa o quadro inteiro primeiro: nessa câmera de frente o miolo do gol
  // fica transparente nos fundos pré-renderizados (só a rede desenha ali,
  // em linhas esparsas), então sem isso o goleiro e a bola nunca eram
  // apagados de verdade ali dentro — cada quadro ficava "carimbado" em
  // cima do anterior.
  c.clearRect(0, 0, W, H);
  c.drawImage(rec.fundo.A, 0, 0);
  [[0, 6, 6], [170, 2, 4], [310, 9, 5]].forEach(([o, y, v]) => {
    const x = (((o + j.tempo * v) % (W + 70)) | 0) - 50;
    c.drawImage(rec.nuvem, x, y);
  });
  desenharTorcida(c, rec.fundo.gente, j.tempo, j.torcida);
  c.drawImage(rec.fundo.B, 0, 0);
  // a rede fica no fundo do gol, por trás do goleiro e do jogador — do
  // contrário eles pareciam presos atrás da malha em vez de na frente dela.
  desenharRede(c, j);

  const b = j.bola;
  const bolaVisivel = j.estado === "pronta" || j.estado === "chutando";
  const progresso = bolaVisivel ? clamp(b.t / b.T, 0, 1) : 1;
  const raioAtual = raioDaBola(progresso);

  // sombra do jogador
  c.globalAlpha = 0.25;
  rect(c, KID_X, H - 6, 24 * KID_ESCALA * 0.5, 4, "#000");
  c.globalAlpha = 1;

  // goleiro
  desenharGoleiro(c, rec.goleiroSprite, j.goleiro);

  // sombra da bola (sempre colada nos "pés" dela, encolhendo com o raio)
  if (bolaVisivel) {
    c.globalAlpha = 0.22;
    disco(c, b.x, b.y + raioAtual * 0.8, raioAtual * 0.7, "#000");
    c.globalAlpha = 1;
  }

  // jogador (primeiro plano, de frente para a câmera)
  sprite(c, KID, KID_X, KID_Y, KID_ESCALA);
  const sx = KID_X + 6 * KID_ESCALA;
  const sy = KID_Y + 8 * KID_ESCALA;
  if (j.estado === "pronta" || j.estado === "espera" || j.estado === "fim") {
    braco(c, sx - 7 * KID_ESCALA * 0.3, sy, sx - 7 * KID_ESCALA * 0.6, sy + 6 * KID_ESCALA * 0.6, "#d99568", "#1c36a0", 4);
    braco(c, sx + 7 * KID_ESCALA * 0.3, sy, sx + 7 * KID_ESCALA * 0.6, sy + 6 * KID_ESCALA * 0.6, "#f4bf91", "#2b50d8", 4);
  } else {
    braco(c, sx - 2, sy, sx - 9 * KID_ESCALA * 0.5, sy - 6 * KID_ESCALA * 0.5, "#d99568", "#1c36a0", 4);
    braco(c, sx + 2, sy, sx + 9 * KID_ESCALA * 0.5, sy - 6 * KID_ESCALA * 0.5, "#f4bf91", "#2b50d8", 4);
  }

  // alvos dentro do gol (clicáveis durante a mira)
  if (j.estado === "pronta") {
    ALVOS.forEach((al, i) => {
      const pulso = 8 + Math.sin(j.tempo * 4 + i) * 1.3;
      c.globalAlpha = 0.5;
      disco(c, al.x, al.y, Math.round(pulso), "#ffffff");
      c.globalAlpha = 1;
      disco(c, al.x, al.y, 3, "#1b2340");
    });
  }

  // rastro e bola
  for (const r of j.rastro) {
    c.globalAlpha = clamp(r.v, 0, 1) * 0.45;
    const s = Math.round(r.s * 0.7);
    rect(c, r.x - s / 2, r.y - s / 2, s, s, "#e9edf5");
  }
  c.globalAlpha = 1;
  if (bolaVisivel) desenharBola(c, b.x, b.y, b.ang, raioAtual);

  // partículas
  for (const p of j.parts) {
    c.globalAlpha = clamp(p.vida / p.max, 0, 1);
    rect(c, p.x, p.y, p.s, p.s, p.cor);
  }
  c.globalAlpha = 1;
}

/* ================= COMPONENTE ================= */
const Futebol = () => {
  const cvRef = useRef(null);
  const jogoRef = useRef(null);
  if (!jogoRef.current) jogoRef.current = novoJogo();

  const { dificuldade } = useSelector((state) => state.jogo);

  const [fase, setFase] = useState("intro"); // intro | jogando | fim
  const [somLigado, setSomLigado] = useState(true);
  const [hud, setHud] = useState({
    placar: 0, rodada: 1, historico: [], seq: 0,
    nivel: dificuldadeDaRodada(1, dificuldade),
  });
  const [aviso, setAviso] = useState(null);
  const [final, setFinal] = useState(null);
  const faseRef = useRef(fase);
  faseRef.current = fase;
  const idAviso = useRef(0);

  const { tocar, torcida } = useSomFutebol(somLigado);
  const somRef = useRef(tocar);
  somRef.current = tocar;
  const torcidaRef = useRef(torcida);
  torcidaRef.current = torcida;

  const navigate = useNavigate();
  const edu = useDicasDoJogo("futebol", hud.placar);

  const {
    emTelaCheia,
    suportaTelaCheia,
    ref: telaCheiaRef,
    alternarTelaCheia,
  } = useTelaCheia();

  const sync = useCallback(() => {
    const j = jogoRef.current;
    setHud({
      placar: j.placar, rodada: j.rodada, historico: j.historico.slice(), seq: j.seq,
      nivel: dificuldadeDaRodada(j.rodada, dificuldade),
    });
  }, [dificuldade]);

  const avisar = useCallback((txt, tom, sub) => setAviso({ id: ++idAviso.current, txt, tom, sub }), []);

  const ev = useMemo(
    () => ({
      som: (t) => somRef.current(t),
      hud: sync,
      gol: () => {
        somRef.current("gol");
        torcidaRef.current("gol");
        avisar(sorteiaFrase(FRASES_GOL), "bom", sorteiaFrase(FRASES_TORCIDA_GOL));
        sync();
      },
      defesa: () => {
        somRef.current("defesa");
        torcidaRef.current("defesa");
        avisar(sorteiaFrase(FRASES_DEFESA), "ruim", sorteiaFrase(FRASES_TORCIDA_DEFESA));
        sync();
      },
      fim: (j) => {
        const estrelas = calcularEstrelas(j.placar);
        setFinal({ placar: j.placar, estrelas });
        setFase("fim");
        somRef.current("fim");
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
    const rec = {
      fundo: criarFundo(),
      nuvem: criarNuvem(),
      goleiroSprite: criarSpriteGoleiro(),
    };
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

  /* ---------- entrada (mouse e toque): tocar em um alvo dentro do gol ---------- */
  const pos = (e) => {
    const r = cvRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };
  const aoClicar = (e) => {
    const j = jogoRef.current;
    if (faseRef.current !== "jogando" || j.estado !== "pronta") return;
    const p = pos(e);
    let melhor = -1;
    let menor = 9999;
    ALVOS.forEach((al, i) => {
      const d = Math.hypot(p.x - al.x, p.y - al.y);
      if (d < 24 && d < menor) {
        menor = d;
        melhor = i;
      }
    });
    if (melhor >= 0) chutar(j, melhor, dificuldade, ev);
  };

  const iniciar = () => {
    somRef.current("clique");
    Object.assign(jogoRef.current, novoJogo());
    setFinal(null);
    setAviso(null);
    sync();
    setFase("jogando");
  };

  const mostrarFim = fase === "fim" && final;

  return (
    <div className="pc-wrapper">
      <BotaoVoltar />
      <div className="pc-card">
        <div className="pc-titulo-barra">
          <h1 className="pc-titulo">
            PÊNALTI <span>CAMPEÃO</span>
          </h1>
        </div>

        {!mostrarFim && <DicaToast dica={edu.dicaVisivel} />}

        {mostrarFim && (
          <FimEducativo esporte="futebol" vistas={edu.vistas}>
            <TelaFimDeJogo
              placar={final.placar}
              estrelas={final.estrelas}
              emojiFinal={emojiDoResultadoFinal(final.placar)}
              onJogarNovamente={iniciar}
              onVoltar={() => navigate("/home")}
            />
          </FimEducativo>
        )}

        <div
          ref={telaCheiaRef}
          className={`pc-stage${mostrarFim ? " pc-oculto" : ""}`}
        >
          <EscalaProporcional largura={W} altura={H}>
            <canvas
              ref={cvRef}
              className="pc-canvas"
              width={W}
              height={H}
              onPointerDown={aoClicar}
            />

            {fase !== "intro" && (
              <>
                <div className="pc-hud">
                  <div className="pc-caixa">
                    <span className="pc-rotulo">GOLS</span>
                    <b>{String(hud.placar).padStart(2, "0")}</b>
                  </div>
                  <div className="pc-caixa">
                    <span className="pc-rotulo">RODADA</span>
                    <span className="pc-bolas">
                      {Array.from({ length: TOTAL_RODADAS }, (_, i) => (
                        <i
                          key={i}
                          className={
                            hud.historico[i] === "gol" ? "gol" : hud.historico[i] === "defesa" ? "defesa" : "vazia"
                          }
                        />
                      ))}
                    </span>
                  </div>
                  <div className="pc-caixa">
                    <span className="pc-rotulo">NÍVEL</span>
                    <b className={hud.nivel.classe}>{hud.nivel.rotulo}</b>
                  </div>
                  <button
                    type="button"
                    className="pc-mudo"
                    onClick={() => setSomLigado((s) => !s)}
                    aria-label={somLigado ? "Desligar som" : "Ligar som"}
                  >
                    {somLigado ? "🔊" : "🔇"}
                  </button>
                </div>
                {hud.seq >= 2 && <div className="pc-combo">🔥 x{hud.seq}</div>}
              </>
            )}

            {aviso && (
              <div key={aviso.id} className={`pc-aviso ${aviso.tom}`}>
                {aviso.txt}
                {aviso.sub && <small className="pc-aviso-sub">{aviso.sub}</small>}
              </div>
            )}

            {fase === "intro" && <TelaIntro onJogar={iniciar} />}
          </EscalaProporcional>

          {suportaTelaCheia && (
            <BotaoTelaCheia
              emTelaCheia={emTelaCheia}
              alternarTelaCheia={alternarTelaCheia}
              classe="pc-tela-cheia"
            />
          )}
        </div>

        {fase === "jogando" && (
          <div className="pc-rodape">
            <p className="pc-rodape-texto">TOQUE EM UM CANTO DO GOL PARA CHUTAR!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Futebol;
