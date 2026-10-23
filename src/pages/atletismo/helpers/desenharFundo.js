import { GAME_WIDTH, GAME_HEIGHT } from "../utils/constantes";
import { rect } from "./rect";

// Paisagem PRÉ-RENDERIZADA no padrão do Basquete Campeão (criarFundo):
// céu em faixas com dithering, sol em discos, montanhas, prédios em
// 2 camadas com janelas acesas, árvores, arquibancada e mureta com placas.
// É desenhada 1 vez num canvas fora da tela e só copiada a cada frame.

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function disco(c, cx, cy, r, cor) {
  c.fillStyle = cor;
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y + 0.5));
    c.fillRect(cx - w, cy + y, w * 2 + 1, 1);
  }
}

let cache = null;

export function obterPaisagem() {
  if (cache) return cache;
  if (typeof document === "undefined") return null;

  const cv = document.createElement("canvas");
  cv.width = GAME_WIDTH;
  cv.height = GAME_HEIGHT;
  const a = cv.getContext("2d");
  a.imageSmoothingEnabled = false;

  const r = rng(11);
  const ri = (min, max) => Math.floor(min + r() * (max - min));

  // Céu em faixas com dithering (igual ao basquete)
  const ceu = ["#46aef7", "#5bbaf9", "#72c6fb", "#8ad2fc", "#a4def9", "#c2e9f7", "#e4f3ee"];
  const faixa = 30;
  ceu.forEach((cor, i) => rect(a, 0, i * faixa, GAME_WIDTH, faixa, cor));
  for (let i = 1; i < ceu.length; i++)
    for (let yy = 0; yy < 2; yy++)
      for (let x = 0; x < GAME_WIDTH; x++)
        if (((x + yy) & 1) === 0) rect(a, x, i * faixa + yy, 1, 1, ceu[i - 1]);

  // Sol em discos concêntricos
  disco(a, 700, 52, 26, "#fff4b8");
  disco(a, 700, 52, 20, "#ffe680");
  disco(a, 700, 52, 16, "#ffd23f");
  disco(a, 693, 45, 4, "#fff7cf");

  const HORIZONTE = 218;

  // Montanhas distantes (silhueta senoidal)
  let mx = -20;
  while (mx < GAME_WIDTH) {
    const mw = ri(90, 150);
    const mh = ri(30, 52);
    for (let i = 0; i < mw; i++) {
      const perfil = Math.round(mh * Math.sin((i / mw) * Math.PI));
      rect(a, mx + i, 196 - perfil, 1, perfil + (HORIZONTE - 196), "#7e97d4");
    }
    mx += mw - ri(14, 30);
  }
  for (let x = 0; x < GAME_WIDTH; x += 2) rect(a, x, 194, 2, 2, "#95acdf");

  // Prédios em 2 camadas (lado sombreado = volume, janelinhas acesas)
  const predios = (cor, janela, acesa, hmin, hmax, sombra) => {
    let x = -6;
    while (x < GAME_WIDTH) {
      const w = ri(26, 48);
      const h = ri(hmin, hmax);
      rect(a, x, HORIZONTE - h, w, h, cor);
      rect(a, x, HORIZONTE - h, w, 2, "rgba(255,255,255,.18)");
      for (let yy = HORIZONTE - h + 7; yy < HORIZONTE - 6; yy += 9)
        for (let xx = x + 4; xx < x + w - 4; xx += 7)
          rect(a, xx, yy, 3, 4, r() < acesa ? "#ffe7a1" : janela);
      rect(a, x + w - 4, HORIZONTE - h + 2, 4, h - 2, sombra);
      if (r() < 0.4) rect(a, x + (w >> 1), HORIZONTE - h - 9, 2, 9, cor);
      x += w + ri(0, 5);
    }
  };
  predios("#8fa8da", "#a8bde8", 0.06, 56, 108, "rgba(20,30,70,.16)");
  predios("#6f87c2", "#566ca5", 0.22, 30, 68, "rgba(20,30,70,.2)");

  // Árvores na frente dos prédios
  for (let x = 8; x < GAME_WIDTH; x += ri(44, 76)) {
    const h = ri(20, 32);
    rect(a, x + 7, HORIZONTE - (h >> 1), 5, (h >> 1) + 5, "#5b3a1e");
    disco(a, x + 9, HORIZONTE - h, 13, "#2b8a43");
    disco(a, x + 6, HORIZONTE - h - 3, 9, "#3fae5a");
    disco(a, x + 4, HORIZONTE - h - 6, 4, "#6fd07e");
  }

  // Arquibancada (estrutura; a torcida é desenhada por cima, animada)
  rect(a, 0, 212, GAME_WIDTH, 74, "#3b4670");
  for (let y = 212; y < 286; y += 9) {
    rect(a, 0, y, GAME_WIDTH, 1, "#566399");
    rect(a, 0, y + 8, GAME_WIDTH, 1, "#2b3558");
  }
  rect(a, 0, 212, GAME_WIDTH, 3, "#ffd34d");

  // Mureta com placas coloridas (igual ao basquete)
  rect(a, 0, 286, GAME_WIDTH, 14, "#1b2340");
  const placas = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866"];
  for (let i = 0; i * 64 < GAME_WIDTH; i++) {
    rect(a, i * 64 + 1, 289, 62, 8, placas[i % 4]);
    rect(a, i * 64 + 1, 289, 62, 1, "rgba(255,255,255,.4)");
    for (let k = 0; k < 6; k++) rect(a, i * 64 + 7 + k * 9, 292, 4, 3, "rgba(255,255,255,.7)");
  }

  // Faixa de grama entre a mureta e a pista
  rect(a, 0, 300, GAME_WIDTH, 12, "#2b8a43");
  rect(a, 0, 300, GAME_WIDTH, 3, "#3fae5a");
  for (let x = 4; x < GAME_WIDTH; x += 17) rect(a, x, 306, 3, 2, "#6fd07e");

  // Torcida: gente gerada 1 vez (posições fixas, só o pulinho anima)
  const roupas = ["#e8412c", "#ffd34d", "#2b50d8", "#2fa866", "#ffffff", "#9b59d0", "#ff8fb1"];
  const peles = ["#f4bf91", "#d99568", "#a86a3d", "#7a4a2a"];
  const cabelos = ["#3b2314", "#111111", "#c9a227", "#7a3b1a"];
  const gente = [];
  for (let fileira = 0; fileira < 5; fileira++) {
    const yy = 219 + fileira * 13;
    for (let x = -4; x < GAME_WIDTH; x += 13) {
      gente.push({
        x: x + ri(-1, 3), y: yy, f: r() * 6,
        cor: roupas[ri(0, roupas.length)],
        pele: peles[ri(0, peles.length)],
        cabelo: cabelos[ri(0, cabelos.length)],
      });
    }
  }

  cache = { fundo: cv, gente };
  return cache;
}
