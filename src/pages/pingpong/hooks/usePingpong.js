<<<<<<< HEAD
=======
// ============================================================================
// usePingpong — "cérebro" do minigame de ping-pong
// ----------------------------------------------------------------------------
// Controla todo o ciclo de vida da partida:
//   • estado React (fase, pontos, tentativas, frases...)
//   • dados mutáveis em dataRef (posições, velocidades, efeitos)
//   • inputs do jogador (mouse/toque + teclado)
//   • o loop principal com requestAnimationFrame (movimento, colisões, saques)
//   • desenho da cena no canvas a cada quadro
// ============================================================================

>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FASES,
  GAME_HEIGHT,
<<<<<<< HEAD
  GAME_WIDTH,
  MENSAGENS_RODAPE,
  TEMPO_RESULTADO,
  TEMPO_SAQUE,
  TOTAL_TENTATIVAS,
} from "../utils/constantes";

=======
  IA_X,
  LIMITE_DIREITA,
  LIMITE_ESQUERDA,
  LIMITE_RAQUETE_BAIXO,
  LIMITE_RAQUETE_TOPO,
  MENSAGENS_RODAPE,
  PAREDE_BAIXO,
  PAREDE_TOPO,
  PLAYER_X,
  RAQUETE_H,
  RAQUETE_W,
  TEMPO_RESULTADO,
  TEMPO_SAQUE,
  TOTAL_TENTATIVAS,
  VELOCIDADE_JOGADOR_TECLADO,
} from "../utils/constantes";
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
import {
  FRASES_ERRO,
  FRASES_PONTO,
  FRASES_TORCIDA_ERRO,
  FRASES_TORCIDA_PONTO,
} from "../utils/frases";

import { calcularEstrelas } from "../helpers/calcularEstrelas";
<<<<<<< HEAD
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { nivelDoMomento } from "../helpers/nivelDoMomento";
import { sorteiaFrase } from "../helpers/sorteiaFrase";

import { useSons } from "./useSons";

// ============================================================================
// CONFIGURAÇÕES GERAIS
// ============================================================================

const TOTAL_FASES = 5;
const FASES_DO_JOGO = TOTAL_FASES;

// ============================================================================
// GEOMETRIA DA MESA
// ============================================================================

const TABLE = {
  farLeft: 246,
  farRight: 554,

  nearLeft: 46,
  nearRight: 754,

  farY: 104,
  nearY: 346,

  netY: 226,
};

// ============================================================================
// POSIÇÕES DE PROFUNDIDADE
// ============================================================================
//
// 0 = fundo / bot
// 1 = frente / jogador
//
// A rede foi deslocada para 0.57 para ficar visualmente mais equilibrada.
// ============================================================================

const AI_SIDE = 0.001;
const NET_SIDE = 0.30;
const PLAYER_SIDE = 0.99;

// ============================================================================
// RAQUETES
// ============================================================================

const PLAYER_PADDLE_W = 78;
const AI_PADDLE_W = 72;

const PADDLE_H = 13;

const PLAYER_SPEED = 2.9;

// ============================================================================
// FÍSICA DA BOLA
// ============================================================================

const BASE_FLIGHT_TIME = 1.08;

const PLAYER_HIT_TOLERANCE = 0.19;

const AI_HIT_TOLERANCE = 0.27;

// ============================================================================
// TRAJETÓRIAS
// ============================================================================

const TRAJETORIA = {
  INDO_PARA_AI: "indo_para_ai",
  QUICOU_AI: "quicou_ai",

  INDO_PARA_JOGADOR: "indo_para_jogador",
  QUICOU_JOGADOR: "quicou_jogador",

  SERVE: "serve",
};

// ============================================================================
// MATEMÁTICA
// ============================================================================

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const lerp = (a, b, t) =>
  a + (b - a) * t;

const tableWidthAt = (z) =>
  lerp(
    TABLE.farRight - TABLE.farLeft,
    TABLE.nearRight - TABLE.nearLeft,
    z
  );

const tableCenterAt = (z) =>
  lerp(
    (TABLE.farLeft + TABLE.farRight) / 2,
    (TABLE.nearLeft + TABLE.nearRight) / 2,
    z
  );

const tableYAt = (z) =>
  lerp(
    TABLE.farY,
    TABLE.nearY,
    z
  );

const screenX = (xNorm, z) =>
  tableCenterAt(z) +
  xNorm * (tableWidthAt(z) / 2);

const screenY = (z) =>
  tableYAt(z);

const paddleWidthAt = (width, z) =>
  Math.max(
    42,
    width * (0.74 + z * 0.42)
  );

// ============================================================================
// BOLA
// ============================================================================

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

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const criarEstadoInicial = () => ({
  fase: FASES.INTRO,

  playerX: 0,

  aiX: 0,

  targetX: 0,

  pointerActive: false,

  keys: {
    left: false,
    right: false,
  },

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
});

// ============================================================================
// DESENHO PIXEL
// ============================================================================

function px(
  ctx,
  x,
  y,
  w,
  h,
  color
) {
  ctx.fillStyle = color;

  ctx.fillRect(
    Math.round(x),
    Math.round(y),
    Math.round(w),
    Math.round(h)
  );
}

// ============================================================================
// TEXTO PIXELADO
// ============================================================================

function textPixel(
  ctx,
  text,
  x,
  y,
  size,
  color,
  align = "center"
) {
  ctx.save();

  ctx.font =
    `bold ${size}px "Press Start 2P", monospace`;

  ctx.textAlign = align;

  ctx.textBaseline = "middle";

  ctx.fillStyle = "#11131f";

  ctx.fillText(
    text,
    x + 3,
    y + 3
  );

  ctx.fillStyle = color;

  ctx.fillText(
    text,
    x,
    y
  );

  ctx.restore();
}

// ============================================================================
// BOLA PIXELADA
// ============================================================================

function drawPixelDiamond(
  ctx,
  cx,
  cy,
  size,
  color,
  shadow = "#c8d0d5"
) {
  px(
    ctx,
    cx - size * 0.28,
    cy - size * 0.48,
    size * 0.56,
    size * 0.18,
    shadow
  );

  px(
    ctx,
    cx - size * 0.46,
    cy - size * 0.25,
    size * 0.92,
    size * 0.5,
    color
  );

  px(
    ctx,
    cx - size * 0.28,
    cy + size * 0.25,
    size * 0.56,
    size * 0.18,
    shadow
  );

  px(
    ctx,
    cx - size * 0.14,
    cy - size * 0.58,
    size * 0.22,
    size * 0.12,
    "#ffffff"
  );
}

// ============================================================================
// FUNDO
// ============================================================================

function drawBackground(ctx) {
  ctx.fillStyle = "#10152b";

  ctx.fillRect(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  px(
    ctx,
    0,
    0,
    800,
    18,
    "#1b2440"
  );

  px(
    ctx,
    0,
    18,
    800,
    3,
    "#303c63"
  );

  px(
    ctx,
    0,
    64,
    800,
    4,
    "#263252"
  );

  // Arquibancadas
  for (
    let row = 0;
    row < 4;
    row += 1
  ) {
    const y =
      24 + row * 16;

    px(
      ctx,
      34 + row * 7,
      y,
      732 - row * 14,
      10,
      row % 2
        ? "#252e4a"
        : "#1e2740"
    );

    for (
      let x = 58 + row * 12;
      x < 748 - row * 12;
      x += 34
    ) {
      px(
        ctx,
        x,
        y + 3,
        12,
        5,
        row % 3 === 0
          ? "#3b496e"
          : "#33405f"
      );
    }
  }

  px(
    ctx,
    72,
    78,
    142,
    5,
    "#5c6d9b"
  );

  px(
    ctx,
    586,
    78,
    142,
    5,
    "#5c6d9b"
  );

  px(
    ctx,
    82,
    76,
    40,
    2,
    "#ffd166"
  );

  px(
    ctx,
    678,
    76,
    40,
    2,
    "#ffd166"
  );

  // Piso
  px(
    ctx,
    0,
    89,
    800,
    311,
    "#25263a"
  );

  for (
    let y = 104;
    y < 400;
    y += 18
  ) {
    px(
      ctx,
      0,
      y,
      800,
      2,
      "#2d3046"
    );
  }

  for (
    let x = -400;
    x < 1200;
    x += 55
  ) {
    ctx.save();

    ctx.fillStyle = "#292c40";

    ctx.beginPath();

    ctx.moveTo(
      400,
      92
    );

    ctx.lineTo(
      x,
      400
    );

    ctx.lineTo(
      x + 2,
      400
    );

    ctx.lineTo(
      402,
      92
    );

    ctx.fill();

    ctx.restore();
  }

  px(
    ctx,
    0,
    394,
    800,
    6,
    "#0b0d17"
  );
}

// ============================================================================
// MESA
// ============================================================================

function drawTable(ctx) {
  const fl = TABLE.farLeft;
  const fr = TABLE.farRight;

  const nl = TABLE.nearLeft;
  const nr = TABLE.nearRight;

  // Sombra
  ctx.save();

  ctx.fillStyle =
    "rgba(0,0,0,0.38)";

  ctx.beginPath();

  ctx.moveTo(
    nl - 14,
    TABLE.nearY + 12
  );

  ctx.lineTo(
    nr + 14,
    TABLE.nearY + 12
  );

  ctx.lineTo(
    fr + 32,
    TABLE.farY + 22
  );

  ctx.lineTo(
    fl - 32,
    TABLE.farY + 22
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();

  // Tampo
  ctx.beginPath();

  ctx.moveTo(
    fl,
    TABLE.farY
  );

  ctx.lineTo(
    fr,
    TABLE.farY
  );

  ctx.lineTo(
    nr,
    TABLE.nearY
  );

  ctx.lineTo(
    nl,
    TABLE.nearY
  );

  ctx.closePath();

  ctx.fillStyle =
    "#16745b";

  ctx.fill();

  // Frente
  ctx.beginPath();

  ctx.moveTo(
    nl,
    TABLE.nearY
  );

  ctx.lineTo(
    nr,
    TABLE.nearY
  );

  ctx.lineTo(
    nr + 4,
    TABLE.nearY + 13
  );

  ctx.lineTo(
    nl - 4,
    TABLE.nearY + 13
  );

  ctx.closePath();

  ctx.fillStyle =
    "#0a3f34";

  ctx.fill();

  // Brilho
  ctx.beginPath();

  ctx.moveTo(
    fl + 7,
    TABLE.farY + 5
  );

  ctx.lineTo(
    fr - 7,
    TABLE.farY + 5
  );

  ctx.lineTo(
    nr - 11,
    TABLE.nearY - 9
  );

  ctx.lineTo(
    nl + 11,
    TABLE.nearY - 9
  );

  ctx.closePath();

  ctx.fillStyle =
    "#198a6b";

  ctx.globalAlpha =
    0.38;

  ctx.fill();

  ctx.globalAlpha = 1;

  // Borda externa
  ctx.strokeStyle =
    "#f7fff9";

  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.moveTo(
    fl,
    TABLE.farY
  );

  ctx.lineTo(
    fr,
    TABLE.farY
  );

  ctx.lineTo(
    nr,
    TABLE.nearY
  );

  ctx.lineTo(
    nl,
    TABLE.nearY
  );

  ctx.closePath();

  ctx.stroke();

  // Linha central
  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    (fl + fr) / 2,
    TABLE.farY
  );

  ctx.lineTo(
    (fl + fr) / 2,
    screenY(NET_SIDE) - 5
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    (nl + nr) / 2,
    screenY(NET_SIDE) + 5
  );

  ctx.lineTo(
    (nl + nr) / 2,
    TABLE.nearY
  );

  ctx.stroke();

  // Borda frontal
  ctx.lineWidth = 6;

  ctx.beginPath();

  ctx.moveTo(
    nl,
    TABLE.nearY
  );

  ctx.lineTo(
    nr,
    TABLE.nearY
  );

  ctx.stroke();

  // Pernas
  px(
    ctx,
    112,
    348,
    12,
    46,
    "#171a24"
  );

  px(
    ctx,
    676,
    348,
    12,
    46,
    "#171a24"
  );

  px(
    ctx,
    82,
    389,
    74,
    7,
    "#10121a"
  );

  px(
    ctx,
    644,
    389,
    74,
    7,
    "#10121a"
  );

  px(
    ctx,
    118,
    355,
    7,
    36,
    "#4b5261"
  );

  px(
    ctx,
    681,
    355,
    7,
    36,
    "#4b5261"
  );

  px(
    ctx,
    91,
    393,
    14,
    4,
    "#090b11"
  );

  px(
    ctx,
    686,
    393,
    14,
    4,
    "#090b11"
  );

  drawNet(ctx);
}

// ============================================================================
// REDE
// ============================================================================

function drawNet(ctx) {
  const left =
    screenX(
      -1,
      NET_SIDE
    );

  const right =
    screenX(
      1,
      NET_SIDE
    );

  const y =
    screenY(
      NET_SIDE
    );

  const netWidth =
    right - left;

  // Sombra
  ctx.save();

  ctx.globalAlpha =
    0.35;

  px(
    ctx,
    left - 3,
    y + 4,
    netWidth + 6,
    7,
    "#000000"
  );

  ctx.restore();

  // Poste esquerdo
  px(
    ctx,
    left - 7,
    y - 30,
    9,
    62,
    "#080b12"
  );

  // Poste direito
  px(
    ctx,
    right - 2,
    y - 30,
    9,
    62,
    "#080b12"
  );

  // Detalhes dos postes
  px(
    ctx,
    left - 5,
    y - 26,
    4,
    54,
    "#424a58"
  );

  px(
    ctx,
    right,
    y - 26,
    4,
    54,
    "#424a58"
  );

  // Borda superior
  px(
    ctx,
    left,
    y - 24,
    netWidth,
    6,
    "#10131b"
  );

  px(
    ctx,
    left + 3,
    y - 22,
    netWidth - 6,
    3,
    "#ffffff"
  );

  // Fundo da malha
  px(
    ctx,
    left,
    y - 18,
    netWidth,
    38,
    "#e9efed"
  );

  // Linhas verticais
  for (
    let x = left + 3;
    x < right - 2;
    x += 7
  ) {
    px(
      ctx,
      x,
      y - 17,
      2,
      35,
      "#26836c"
    );
  }

  // Linhas horizontais
  for (
    let yy = y - 15;
    yy < y + 18;
    yy += 6
  ) {
    px(
      ctx,
      left + 1,
      yy,
      netWidth - 2,
      2,
      "#26836c"
    );
  }

  // Borda inferior
  px(
    ctx,
    left - 2,
    y + 18,
    netWidth + 4,
    6,
    "#0e1119"
  );

  px(
    ctx,
    left + 2,
    y + 18,
    netWidth - 4,
    3,
    "#ffffff"
  );
}

// ============================================================================
// RAQUETE PIXELADA
// ============================================================================
//
// ALTERAÇÕES:
// - contorno preto bem mais fino;
// - menos área preta ao redor da borracha;
// - formato mais limpo;
// - mantém o estilo pixel art;
// - bot e jogador ficam na orientação normal;
// - cabo sempre apontado para baixo.
// ============================================================================

function drawPaddle(
  ctx,
  xNorm,
  z,
  width,
  isPlayer
) {
  const cx =
    screenX(
      xNorm,
      z
    );

  const y =
    screenY(z);

  const scale =
    0.74 + z * 0.42;

  const w =
    Math.max(
      50,
      width * scale
    );

  // --------------------------------------------------------------------------
  // DIMENSÕES
  // --------------------------------------------------------------------------

  const headW = w;

  const headH =
    Math.max(
      38,
      48 * scale
    );

  // NOVO: contorno fino
  const border =
    Math.max(
      2,
      3 * scale
    );

  const headTop =
    y - headH - 10;

  const handleW =
    Math.max(
      8,
      11 * scale
    );

  const handleH =
    Math.max(
      25,
      33 * scale
    );

  const handleX =
    cx - handleW / 2;

  const handleY =
    headTop + headH - 1;

  // --------------------------------------------------------------------------
  // CORES
  // --------------------------------------------------------------------------

  const outline =
    "#11131b";

  const mainColor =
    isPlayer
      ? "#ed183d"
      : "#3268d9";

  const darkColor =
    isPlayer
      ? "#c20d2b"
      : "#244ca9";

  const lightColor =
    isPlayer
      ? "#ff5369"
      : "#6795ff";

  const woodDark =
    "#8f3e08";

  const wood =
    "#c27616";

  const woodLight =
    "#dfa03a";

  // --------------------------------------------------------------------------
  // SOMBRA
  // --------------------------------------------------------------------------

  ctx.save();

  ctx.globalAlpha =
    0.22;

  px(
    ctx,
    cx - headW / 2 + 8,
    headTop + headH + 7,
    headW - 16,
    5,
    "#000000"
  );

  ctx.restore();

  // --------------------------------------------------------------------------
  // CABO
  // --------------------------------------------------------------------------

  // Contorno fino do cabo
  px(
    ctx,
    handleX - 2,
    handleY - 2,
    handleW + 4,
    handleH + 4,
    outline
  );

  // Madeira escura
  px(
    ctx,
    handleX,
    handleY,
    handleW,
    handleH,
    woodDark
  );

  // Madeira principal
  px(
    ctx,
    handleX + 2,
    handleY + 2,
    handleW - 4,
    handleH - 4,
    wood
  );

  // Reflexo
  px(
    ctx,
    handleX + 3,
    handleY + 3,
    Math.max(
      2,
      handleW * 0.22
    ),
    handleH - 7,
    woodLight
  );

  // Base do cabo
  px(
    ctx,
    handleX - 2,
    handleY + handleH - 3,
    handleW + 4,
    4,
    outline
  );

  // --------------------------------------------------------------------------
  // CABEÇA DA RAQUETE
  // --------------------------------------------------------------------------

  const left =
    cx - headW / 2;

  const top =
    headTop;

  const corner =
    Math.max(
      5,
      headW * 0.075
    );

  // --------------------------------------------------------------------------
  // CORPO COLORIDO PRINCIPAL
  // --------------------------------------------------------------------------
  //
  // Primeiro desenhamos a borracha. Depois colocamos apenas uma linha fina
  // escura ao redor, evitando a borda preta pesada da versão anterior.
  // --------------------------------------------------------------------------

  // Centro
  px(
    ctx,
    left + 2,
    top + corner,
    headW - 4,
    headH - corner * 2,
    mainColor
  );

  // Parte superior
  px(
    ctx,
    left + corner,
    top + 2,
    headW - corner * 2,
    corner,
    mainColor
  );

  // Parte inferior
  px(
    ctx,
    left + corner,
    top + headH - corner - 2,
    headW - corner * 2,
    corner,
    mainColor
  );

  // --------------------------------------------------------------------------
  // CONTORNO EXTERNO FINO
  // --------------------------------------------------------------------------

  // Topo
  px(
    ctx,
    left + corner,
    top,
    headW - corner * 2,
    border,
    outline
  );

  // Superior esquerdo
  px(
    ctx,
    left + 3,
    top + 3,
    corner - 1,
    border,
    outline
  );

  // Superior direito
  px(
    ctx,
    left + headW - corner - 2,
    top + 3,
    corner - 1,
    border,
    outline
  );

  // Lateral esquerda
  px(
    ctx,
    left,
    top + corner,
    border,
    headH - corner * 2,
    outline
  );

  // Lateral direita
  px(
    ctx,
    left + headW - border,
    top + corner,
    border,
    headH - corner * 2,
    outline
  );

  // Inferior esquerdo
  px(
    ctx,
    left + 3,
    top + headH - 5,
    corner - 1,
    border,
    outline
  );

  // Inferior direito
  px(
    ctx,
    left + headW - corner - 2,
    top + headH - 5,
    corner - 1,
    border,
    outline
  );

  // Base
  px(
    ctx,
    left + corner,
    top + headH - border,
    headW - corner * 2,
    border,
    outline
  );

  // --------------------------------------------------------------------------
  // SOMBRA INTERNA
  // --------------------------------------------------------------------------

  px(
    ctx,
    left + 3,
    top + corner + 2,
    3,
    headH - corner * 2 - 4,
    darkColor
  );

  px(
    ctx,
    left + headW - 6,
    top + corner + 2,
    3,
    headH - corner * 2 - 4,
    darkColor
  );

  // --------------------------------------------------------------------------
  // BRILHO SUPERIOR
  // --------------------------------------------------------------------------

  px(
    ctx,
    left + corner + 4,
    top + 5,
    headW - corner * 2 - 8,
    3,
    lightColor
  );

  // Pequeno reflexo branco
  px(
    ctx,
    left + headW * 0.25,
    top + 8,
    headW * 0.22,
    2,
    "#ffffff"
  );

  // --------------------------------------------------------------------------
  // DETALHES DA BORRACHA
  // --------------------------------------------------------------------------

  px(
    ctx,
    cx - headW * 0.19,
    top + headH * 0.43,
    headW * 0.38,
    3,
    darkColor
  );

  px(
    ctx,
    cx - headW * 0.12,
    top + headH * 0.54,
    headW * 0.24,
    2,
    lightColor
  );
}

// ============================================================================
// BOLA
// ============================================================================

function drawBall(
  ctx,
  d
) {
  const b =
    d.ball;

  if (!b.visible) {
    return;
  }

  const z =
    clamp(
      b.z,
      0,
      1
    );

  const baseX =
    screenX(
      b.x,
      z
    );

  const baseY =
    screenY(z);

  const arc =
    Math.sin(
      Math.PI *
        clamp(
          b.progress,
          0,
          1
        )
    );

  const height =
    26 + arc * 48;

  const x =
    baseX;

  const y =
    baseY - height;

  // Sombra
  const shadowW =
    9 + arc * 10;

  const shadowH =
    3 + arc * 3;

  ctx.save();

  ctx.globalAlpha =
    0.24 +
    (1 - arc) * 0.25;

  ctx.fillStyle =
    "#06140f";

  ctx.fillRect(
    x - shadowW / 2,
    baseY - shadowH / 2,
    shadowW,
    shadowH
  );

  ctx.restore();

  // Rastro
  for (
    let i = 0;
    i < b.trail.length;
    i += 1
  ) {
    const t =
      b.trail[i];

    ctx.save();

    ctx.globalAlpha =
      ((i + 1) / b.trail.length) *
      0.18;

    drawPixelDiamond(
      ctx,
      t.x,
      t.y,
      7,
      "#fff1a8",
      "#f1d56c"
    );

    ctx.restore();
  }

  drawPixelDiamond(
    ctx,
    x,
    y,
    12,
    "#ffffff",
    "#d9dee2"
  );

  px(
    ctx,
    x - 2,
    y - 3,
    3,
    3,
    "#fff9c7"
  );
}

// ============================================================================
// IMPACTO
// ============================================================================

function drawImpact(
  ctx,
  d
) {
  if (
    d.ultimoImpacto <= 0
  ) {
    return;
  }

  const alpha =
    clamp(
      d.ultimoImpacto / 180,
      0,
      1
    );

  const cx =
    screenX(
      d.impactoX,
      PLAYER_SIDE
    );

  const cy =
    screenY(
      PLAYER_SIDE
    ) - 5;

  ctx.save();

  ctx.globalAlpha =
    alpha;

  ctx.strokeStyle =
    "#ffe082";

  ctx.lineWidth = 3;

  for (
    let i = 0;
    i < 8;
    i += 1
  ) {
    const a =
      (Math.PI * 2 * i) / 8;

    const r1 = 13;
    const r2 = 20;

    ctx.beginPath();

    ctx.moveTo(
      cx + Math.cos(a) * r1,
      cy + Math.sin(a) * r1
    );

    ctx.lineTo(
      cx + Math.cos(a) * r2,
      cy + Math.sin(a) * r2
    );

    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================================
// INDICADOR DE SAQUE
// ============================================================================

function drawServeIndicator(
  ctx,
  d
) {
  const cx =
    GAME_WIDTH / 2;

  const cy = 55;

  if (
    d.flashRestante > 0
  ) {
    const alpha =
      clamp(
        d.flashRestante / 260,
        0,
        1
      );

    ctx.save();

    ctx.globalAlpha =
      alpha;

    textPixel(
      ctx,
      "JOGA!",
      cx,
      cy,
      23,
      "#ffd166"
    );

    ctx.restore();

    return;
  }

  const numero =
    Math.max(
      1,
      Math.ceil(
        d.serveRestante / 400
      )
    );

  px(
    ctx,
    cx - 57,
    cy - 25,
    114,
    46,
    "#10131f"
  );

  px(
    ctx,
    cx - 52,
    cy - 20,
    104,
    36,
    "#ffd166"
  );

  textPixel(
    ctx,
    String(numero),
    cx,
    cy - 1,
    22,
    "#e63946"
  );
}

// ============================================================================
// HUD
// ============================================================================

function drawHudInsideCanvas(
  ctx,
  d
) {
  // Jogador
  px(
    ctx,
    16,
    16,
    112,
    25,
    "#10131f"
  );

  px(
    ctx,
    20,
    20,
    104,
    17,
    "#e63946"
  );

  textPixel(
    ctx,
    "VOCÊ",
    72,
    28,
    8,
    "#ffffff"
  );

  // Adversário
  px(
    ctx,
    672,
    16,
    112,
    25,
    "#10131f"
  );

  px(
    ctx,
    676,
    20,
    104,
    17,
    "#3d73e8"
  );

  textPixel(
    ctx,
    "ADVERSÁRIO",
    728,
    28,
    6,
    "#ffffff"
  );

  // Fase atual
  textPixel(
    ctx,
    `FASE ${Math.min(
      d.tentativa + 1,
      FASES_DO_JOGO
    )}/${FASES_DO_JOGO}`,
    400,
    28,
    8,
    "#ffffff"
  );

  // Rally
  if (
    d.rally > 1
  ) {
    textPixel(
      ctx,
      `RALLY x${d.rally}`,
      400,
      84,
      8,
      "#ffe082"
    );
  }
}

// ============================================================================
// PARTÍCULAS
// ============================================================================

function drawParticles(
  ctx,
  d
) {
  for (
    const p of d.particulas
  ) {
    if (
      p.life <= 0
    ) {
      continue;
    }

    ctx.save();

    ctx.globalAlpha =
      clamp(
        p.life / p.maxLife,
        0,
        1
      );

    px(
      ctx,
      p.x,
      p.y,
      p.size,
      p.size,
      p.color
    );

    ctx.restore();
  }
}

function spawnImpactParticles(
  d,
  xNorm,
  color = "#ffd166"
) {
  const cx =
    screenX(
      xNorm,
      PLAYER_SIDE
    );

  const cy =
    screenY(
      PLAYER_SIDE
    ) - 18;

  for (
    let i = 0;
    i < 8;
    i += 1
  ) {
    d.particulas.push({
      x: cx,

      y: cy,

      vx:
        (Math.random() - 0.5) *
        90,

      vy:
        -30 -
        Math.random() * 80,

      life:
        280 +
        Math.random() * 160,

      maxLife: 440,

      size:
        3 +
        Math.random() * 3,

      color,
    });
  }
}

function updateParticles(
  d,
  dt
) {
  for (
    const p of d.particulas
  ) {
    p.life -=
      dt * 1000;

    p.x +=
      p.vx * dt;

    p.y +=
      p.vy * dt;

    p.vy +=
      150 * dt;
  }

  if (
    d.particulas.length > 80
  ) {
    d.particulas =
      d.particulas.slice(-80);
  }
}

// ============================================================================
// CENA
// ============================================================================

function drawScene(
  ctx,
  d
) {
  ctx.clearRect(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  ctx.imageSmoothingEnabled =
    false;

  drawBackground(ctx);

  drawTable(ctx);

  drawHudInsideCanvas(
    ctx,
    d
  );

  // Bot
  drawPaddle(
    ctx,
    d.aiX,
    AI_SIDE,
    AI_PADDLE_W,
    false
  );

  // Jogador
  drawPaddle(
    ctx,
    d.playerX,
    PLAYER_SIDE,
    PLAYER_PADDLE_W,
    true
  );

  drawBall(
    ctx,
    d
  );

  drawImpact(
    ctx,
    d
  );

  drawParticles(
    ctx,
    d
  );

  if (
    d.fase === FASES.SERVINDO ||
    d.flashRestante > 0
  ) {
    drawServeIndicator(
      ctx,
      d
    );
  }

  if (
    d.fase === FASES.JOGANDO &&
    d.ball.canBeHit
  ) {
    textPixel(
      ctx,
      "ALINHE A RAQUETE COM A BOLA",
      400,
      382,
      7,
      "#ffffff"
    );
  }
}

// ============================================================================
// CRIA NOVO VOO
// ============================================================================

function prepararVoo(
  d,
  direction,
  trajectory,
  x,
  flightTime,
  canBeHit
) {
  d.ball = {
    ...criarBola(),

    x: clamp(
      x,
      -0.88,
      0.88
    ),

    z:
      direction > 0
        ? AI_SIDE
        : PLAYER_SIDE,

    progress: 0,

    direction,

    trajectory,

    flightTime,

    vx:
      d.ball.vx || 0,

    spin:
      d.ball.spin || 0,

    canBeHit,

    bounceCount: 0,

    visible: true,
  };
}

// ============================================================================
// HOOK
// ============================================================================

export function usePingpong() {
  const navigate =
    useNavigate();

  // --------------------------------------------------------------------------
  // ESTADOS EXTERNOS
  // --------------------------------------------------------------------------

  const [fase, setFase] =
    useState(
      FASES.INTRO
    );

  const [pontos, setPontos] =
    useState(0);

  const [tentativa, setTentativa] =
    useState(0);

  const [historico, setHistorico] =
    useState([]);

  const [somLigado, setSomLigado] =
    useState(true);

  const [
    fraseResultado,
    setFraseResultado,
  ] =
    useState("");

  const [
    fraseTorcida,
    setFraseTorcida,
  ] =
    useState("");

  // --------------------------------------------------------------------------
  // REFERÊNCIA DA FÍSICA
  // --------------------------------------------------------------------------

  const canvasRef =
    useRef(null);

  const dataRef =
    useRef(null);

  if (
    dataRef.current === null
  ) {
    dataRef.current =
      criarEstadoInicial();
  }

  // --------------------------------------------------------------------------
  // SONS
  // --------------------------------------------------------------------------

  const {
    garantirAudio,
    tocarToque,
    tocarPonto,
    tocarErro,
  } =
    useSons(
      somLigado
    );

  // --------------------------------------------------------------------------
  // SOM
  // --------------------------------------------------------------------------

  const alternarSom =
    useCallback(
      () => {
        setSomLigado(
          (s) => !s
        );
      },
      []
    );

  // --------------------------------------------------------------------------
  // VOLTAR
  // --------------------------------------------------------------------------

  const voltarParaHome =
    useCallback(
      () => {
        navigate(
          "/home"
        );
      },
      [navigate]
    );

  // --------------------------------------------------------------------------
  // INICIAR
  // --------------------------------------------------------------------------

  const iniciarJogo =
    useCallback(
      () => {
        garantirAudio();

        const d =
          criarEstadoInicial();

        d.fase =
          FASES.SERVINDO;

        d.serveRestante =
          TEMPO_SAQUE;

        d.serveTempoTotal =
          0;

        d.playerX = 0;

        d.aiX = 0;

        d.targetX = 0;

        d.pontos = 0;

        d.tentativa = 0;

        d.historico = [];

        d.rally = 0;

        d.ball =
          criarBola();

        d.ball.trajectory =
          TRAJETORIA.SERVE;

        d.ball.z =
          AI_SIDE;

        d.ball.progress =
          0;

        d.ball.canBeHit =
          false;

        dataRef.current =
          d;

        setPontos(0);

        setTentativa(0);

        setHistorico([]);

        setFraseResultado(
          ""
        );

        setFraseTorcida(
          ""
        );

        setFase(
          FASES.SERVINDO
        );
      },
      [garantirAudio]
    );

  // ==========================================================================
  // CONTROLES
  // ==========================================================================

  useEffect(
    () => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return undefined;
      }

      const getTargetX =
        (clientX) => {
          const rect =
            canvas.getBoundingClientRect();

          const normalized =
            ((clientX - rect.left) /
              rect.width) *
              2 -
            1;

          return clamp(
            normalized,
            -0.88,
            0.88
          );
        };

      const onPointerMove =
        (event) => {
          const d =
            dataRef.current;

          d.pointerActive =
            true;

          d.targetX =
            getTargetX(
              event.clientX
            );
        };

      const onPointerDown =
        (event) => {
          const d =
            dataRef.current;

          d.pointerActive =
            true;

          d.targetX =
            getTargetX(
              event.clientX
            );
        };

      const onKeyDown =
        (event) => {
          const d =
            dataRef.current;

          if (
            [
              "ArrowLeft",
              "KeyA",
              "ArrowRight",
              "KeyD",
            ].includes(
              event.code
            )
          ) {
            event.preventDefault();

            d.pointerActive =
              false;
          }

          if (
            event.code === "ArrowLeft" ||
            event.code === "KeyA"
          ) {
            d.keys.left =
              true;
          }

          if (
            event.code === "ArrowRight" ||
            event.code === "KeyD"
          ) {
            d.keys.right =
              true;
          }
        };

      const onKeyUp =
        (event) => {
          if (
            event.code === "ArrowLeft" ||
            event.code === "KeyA"
          ) {
            dataRef.current.keys.left =
              false;
          }

          if (
            event.code === "ArrowRight" ||
            event.code === "KeyD"
          ) {
            dataRef.current.keys.right =
              false;
          }
        };

      canvas.addEventListener(
        "pointermove",
        onPointerMove
      );

      canvas.addEventListener(
        "pointerdown",
        onPointerDown
      );

      window.addEventListener(
        "keydown",
        onKeyDown,
        {
          passive: false,
        }
      );

      window.addEventListener(
        "keyup",
        onKeyUp
      );

      return () => {
        canvas.removeEventListener(
          "pointermove",
          onPointerMove
        );

        canvas.removeEventListener(
          "pointerdown",
          onPointerDown
        );

        window.removeEventListener(
          "keydown",
          onKeyDown
        );

        window.removeEventListener(
          "keyup",
          onKeyUp
        );
      };
    },
    []
  );

  // ==========================================================================
  // LOOP PRINCIPAL
  // ==========================================================================

  useEffect(
    () => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return undefined;
      }

      const ctx =
        canvas.getContext(
          "2d"
        );

      ctx.imageSmoothingEnabled =
        false;

      let rafId = 0;

      let last = 0;

      // ======================================================================
      // MOVIMENTO DO JOGADOR
      // ======================================================================

      const moverJogador =
        (
          d,
          dt
        ) => {
          if (
            d.pointerActive
          ) {
            d.playerX +=
              (d.targetX - d.playerX) *
              Math.min(
                1,
                dt * 13
              );
          } else {
            if (
              d.keys.left
            ) {
              d.playerX -=
                PLAYER_SPEED * dt;
            }

            if (
              d.keys.right
            ) {
              d.playerX +=
                PLAYER_SPEED * dt;
            }
          }

          d.playerX =
            clamp(
              d.playerX,
              -0.88,
              0.88
            );
        };

      // ======================================================================
      // MOVIMENTO DA IA
      // ======================================================================

      const moverIa =
        (
          d,
          dt
        ) => {
          let alvo =
            d.ball.x;

          if (
            d.ball.direction < 0
          ) {
            alvo =
              d.ball.x;
          } else {
            alvo =
              d.ball.x * 0.45;
          }

          const erro =
            0.035 +
            (
              d.pontos >= 3
                ? 0.025
                : 0.055
            );

          alvo +=
            Math.sin(
              d.rally * 1.7 +
                d.serveTempoTotal
            ) *
            erro;

          const velocidade =
            1.15 +
            d.pontos * 0.05;

          const maxMove =
            velocidade * dt;

          const delta =
            clamp(
              alvo - d.aiX,
              -maxMove,
              maxMove
            );

          d.aiX =
            clamp(
              d.aiX + delta,
              -0.80,
              0.80
            );
        };

      // ======================================================================
      // FINALIZA RALLY
      // ======================================================================

      const resolverResultado =
        (
          d,
          ganhou
        ) => {
          d.tentativa += 1;

          setTentativa(
            d.tentativa
          );

          if (
            ganhou
          ) {
            d.pontos += 1;

            setPontos(
              d.pontos
            );

            d.historico = [
              ...d.historico,
              "ponto",
            ];

            setHistorico(
              d.historico
            );

            setFraseResultado(
              sorteiaFrase(
                FRASES_PONTO
              )
            );

            setFraseTorcida(
              sorteiaFrase(
                FRASES_TORCIDA_PONTO
              )
            );

            tocarPonto();

            spawnImpactParticles(
              d,
              d.ball.x,
              "#ffd166"
            );
          } else {
            d.historico = [
              ...d.historico,
              "erro",
            ];

            setHistorico(
              d.historico
            );

            setFraseResultado(
              sorteiaFrase(
                FRASES_ERRO
              )
            );

            setFraseTorcida(
              sorteiaFrase(
                FRASES_TORCIDA_ERRO
              )
            );

            tocarErro();

            spawnImpactParticles(
              d,
              d.playerX,
              "#e63946"
            );
          }

          d.fase =
            ganhou
              ? FASES.PONTO
              : FASES.ERRO;

          d.resultadoRestante =
            TEMPO_RESULTADO;

          d.ball.visible =
            false;

          d.ball.canBeHit =
            false;

          setFase(
            d.fase
          );
        };

      // ======================================================================
      // QUICOU NO LADO DA IA
      // ======================================================================

      const quicarNoLadoAi =
        (d) => {
          d.ball.trajectory =
            TRAJETORIA.QUICOU_AI;

          d.ball.bounceCount += 1;

          d.ball.progress = 0;

          d.ball.flightTime =
            Math.max(
              0.74,
              d.ball.flightTime * 0.96
            );

          d.ball.x =
            clamp(
              d.ball.x +
                d.ball.vx * 0.12,
              -0.9,
              0.9
            );

          d.ball.canBeHit =
            true;

          d.ball.direction =
            -1;

          d.ball.z =
            AI_SIDE;

          d.ball.progress =
            0;
        };

      // ======================================================================
      // QUICOU NO LADO DO JOGADOR
      // ======================================================================

      const quicarNoLadoJogador =
        (d) => {
          d.ball.trajectory =
            TRAJETORIA.QUICOU_JOGADOR;

          d.ball.bounceCount += 1;

          d.ball.progress = 0;

          d.ball.flightTime =
            Math.max(
              0.74,
              d.ball.flightTime * 0.96
            );

          d.ball.x =
            clamp(
              d.ball.x +
                d.ball.vx * 0.12,
              -0.9,
              0.9
            );

          d.ball.canBeHit =
            true;

          d.ball.direction =
            1;

          d.ball.z =
            PLAYER_SIDE;

          d.ball.progress =
            0;
        };

      // ======================================================================
      // REBATE DO JOGADOR
      // ======================================================================

      const rebaterJogador =
        (d) => {
          if (
            !d.ball.canBeHit ||
            d.ball.trajectory !==
              TRAJETORIA.QUICOU_JOGADOR
          ) {
            return;
          }

          const distancia =
            Math.abs(
              d.ball.x -
                d.playerX
            );

          if (
            distancia >
            PLAYER_HIT_TOLERANCE
          ) {
            resolverResultado(
              d,
              false
            );

            return;
          }

          const offset =
            clamp(
              (d.ball.x - d.playerX) /
                PLAYER_HIT_TOLERANCE,
              -1,
              1
            );

          const direcaoLateral =
            offset * 0.28;

          d.ball.vx =
            clamp(
              d.ball.vx * 0.45 +
                direcaoLateral,
              -0.34,
              0.34
            );

          d.ball.spin =
            clamp(
              d.ball.spin * 0.35 +
                offset * 0.18,
              -0.34,
              0.34
            );

          d.ball.flightTime =
            Math.max(
              0.76,
              d.ball.flightTime * 0.94
            );

          d.ultimoImpacto =
            180;

          d.impactoX =
            d.playerX;

          d.rally += 1;

          tocarToque();

          spawnImpactParticles(
            d,
            d.playerX,
            "#ffe082"
          );

          d.ball.direction =
            1;

          d.ball.trajectory =
            TRAJETORIA.INDO_PARA_AI;

          d.ball.canBeHit =
            false;

          d.ball.progress =
            0;

          d.ball.z =
            PLAYER_SIDE;

          d.ball.x =
            clamp(
              d.playerX +
                d.ball.vx * 0.22,
              -0.9,
              0.9
            );
        };

      // ======================================================================
      // REBATE DA IA
      // ======================================================================

      const rebaterIa =
        (d) => {
          if (
            !d.ball.canBeHit ||
            d.ball.trajectory !==
              TRAJETORIA.QUICOU_AI
          ) {
            return;
          }

          const distancia =
            Math.abs(
              d.ball.x -
                d.aiX
            );

          const tolerancia =
            AI_HIT_TOLERANCE +
            Math.max(
              0,
              0.035 -
                d.pontos * 0.004
            );

          if (
            distancia >
            tolerancia
          ) {
            resolverResultado(
              d,
              true
            );

            return;
          }

          const offset =
            clamp(
              (d.ball.x - d.aiX) /
                tolerancia,
              -1,
              1
            );

          const direcao =
            offset * 0.16;

          d.ball.vx =
            clamp(
              d.ball.vx * 0.35 +
                direcao,
              -0.24,
              0.24
            );

          d.ball.spin =
            clamp(
              d.ball.spin * 0.3 +
                offset * 0.08,
              -0.2,
              0.2
            );

          d.ball.flightTime =
            Math.max(
              0.82,
              d.ball.flightTime * 0.99
            );

          d.ultimoImpacto =
            140;

          d.impactoX =
            d.aiX;

          d.rally += 1;

          tocarToque();

          d.ball.direction =
            -1;

          d.ball.trajectory =
            TRAJETORIA.INDO_PARA_JOGADOR;

          d.ball.canBeHit =
            false;

          d.ball.progress =
            0;

          d.ball.z =
            AI_SIDE;

          d.ball.x =
            clamp(
              d.aiX +
                d.ball.vx * 0.22,
              -0.9,
              0.9
            );
        };

      // ======================================================================
      // FÍSICA DA BOLA
      // ======================================================================

      const atualizarBola =
        (
          d,
          dt
        ) => {
          const b =
            d.ball;

          if (
            !b.visible
          ) {
            return;
          }

          const tempo =
            Math.max(
              0.72,
              b.flightTime
            );

          b.progress +=
            dt / tempo;

          const p =
            clamp(
              b.progress,
              0,
              1
            );

          // Profundidade
          if (
            b.direction > 0
          ) {
            b.z =
              lerp(
                PLAYER_SIDE,
                AI_SIDE,
                p
              );
          } else {
            b.z =
              lerp(
                AI_SIDE,
                PLAYER_SIDE,
                p
              );
          }

          // Movimento lateral
          b.x +=
            b.vx * dt;

          b.x =
            clamp(
              b.x,
              -0.92,
              0.92
            );

          // Rastro
          const arc =
            Math.sin(
              Math.PI * p
            );

          b.trail.push({
            x:
              screenX(
                b.x,
                b.z
              ),

            y:
              screenY(
                b.z
              ) -
              (
                25 +
                arc * 48
              ),
          });

          if (
            b.trail.length > 6
          ) {
            b.trail.shift();
          }

          if (
            b.progress < 1
          ) {
            return;
          }

          // Chegou ao lado do adversário
          if (
            b.direction > 0
          ) {
            b.z =
              AI_SIDE;

            b.progress =
              0;

            b.x =
              clamp(
                b.x,
                -0.9,
                0.9
              );

            quicarNoLadoAi(
              d
            );

            return;
          }

          // Chegou ao lado do jogador
          b.z =
            PLAYER_SIDE;

          b.progress =
            0;

          b.x =
            clamp(
              b.x,
              -0.9,
              0.9
            );

          quicarNoLadoJogador(
            d
          );
        };

      // ======================================================================
      // LOOP
      // ======================================================================

      const step =
        (timestamp) => {
          if (!last) {
            last =
              timestamp;
          }

          const dt =
            Math.min(
              (timestamp - last) / 1000,
              0.032
            );

          last =
            timestamp;

          const d =
            dataRef.current;

          d.ultimoImpacto =
            Math.max(
              0,
              d.ultimoImpacto -
                dt * 1000
            );

          d.flashRestante =
            Math.max(
              0,
              d.flashRestante -
                dt * 1000
            );

          updateParticles(
            d,
            dt
          );

          // ==================================================================
          // SAQUE
          // ==================================================================

          if (
            d.fase ===
            FASES.SERVINDO
          ) {
            moverJogador(
              d,
              dt
            );

            moverIa(
              d,
              dt
            );

            d.serveTempoTotal +=
              dt;

            d.serveRestante -=
              dt * 1000;

            d.ball.progress =
              (
                Math.sin(
                  d.serveTempoTotal * 5
                ) +
                1
              ) /
              2;

            d.ball.z =
              AI_SIDE +
              d.ball.progress * 0.04;

            d.ball.canBeHit =
              false;

            if (
              d.serveRestante <= 0
            ) {
              d.flashRestante =
                420;

              d.fase =
                FASES.JOGANDO;

              d.rally =
                0;

              d.ball =
                criarBola();

              d.ball.direction =
                -1;

              d.ball.trajectory =
                TRAJETORIA.INDO_PARA_JOGADOR;

              d.ball.z =
                AI_SIDE;

              d.ball.progress =
                0;

              d.ball.x =
                0;

              d.ball.vx =
                0;

              d.ball.spin =
                0;

              d.ball.flightTime =
                1.05;

              d.ball.canBeHit =
                false;

              setFase(
                FASES.JOGANDO
              );
            }
          }

          // ==================================================================
          // JOGANDO
          // ==================================================================

          else if (
            d.fase ===
            FASES.JOGANDO
          ) {
            moverJogador(
              d,
              dt
            );

            moverIa(
              d,
              dt
            );

            atualizarBola(
              d,
              dt
            );

            if (
              d.ball.canBeHit
            ) {
              if (
                d.ball.trajectory ===
                TRAJETORIA.QUICOU_JOGADOR
              ) {
                const distancia =
                  Math.abs(
                    d.ball.x -
                      d.playerX
                  );

                if (
                  distancia <=
                  PLAYER_HIT_TOLERANCE
                ) {
                  rebaterJogador(
                    d
                  );
                } else if (
                  d.ball.progress > 0.58
                ) {
                  resolverResultado(
                    d,
                    false
                  );
                }
              } else if (
                d.ball.trajectory ===
                TRAJETORIA.QUICOU_AI
              ) {
                const distancia =
                  Math.abs(
                    d.ball.x -
                      d.aiX
                  );

                if (
                  distancia <=
                  AI_HIT_TOLERANCE +
                    0.055
                ) {
                  rebaterIa(
                    d
                  );
                } else if (
                  d.ball.progress > 0.60
                ) {
                  resolverResultado(
                    d,
                    true
                  );
                }
              }
            }
          }

          // ==================================================================
          // RESULTADO
          // ==================================================================

          else if (
            d.fase === FASES.PONTO ||
            d.fase === FASES.ERRO
          ) {
            d.resultadoRestante -=
              dt * 1000;

            if (
              d.resultadoRestante <= 0
            ) {
              if (
                d.tentativa >=
                TOTAL_FASES
              ) {
                d.fase =
                  FASES.FIM_DE_JOGO;

                setFase(
                  FASES.FIM_DE_JOGO
                );
              } else {
                d.fase =
                  FASES.SERVINDO;

                d.serveRestante =
                  TEMPO_SAQUE;

                d.serveTempoTotal =
                  0;

                d.flashRestante =
                  0;

                d.rally =
                  0;

                d.ball =
                  criarBola();

                d.ball.z =
                  AI_SIDE;

                d.ball.progress =
                  0;

                d.ball.trajectory =
                  TRAJETORIA.SERVE;

                d.ball.canBeHit =
                  false;

                setFase(
                  FASES.SERVINDO
                );
              }
            }
          }

          drawScene(
            ctx,
            d
          );

          rafId =
            requestAnimationFrame(
              step
            );
        };

      rafId =
        requestAnimationFrame(
          step
        );

      return () => {
        cancelAnimationFrame(
          rafId
        );

        last = 0;
      };
    },
    [
      tocarToque,
      tocarPonto,
      tocarErro,
    ]
  );

  // ==========================================================================
  // RETORNO PARA A PÁGINA
  // ==========================================================================

  const nivel =
    nivelDoMomento(
      pontos
    );

  const emJogo =
    fase !== FASES.INTRO &&
    fase !== FASES.FIM_DE_JOGO;

  return {
    canvasRef,

    emJogo,

    mostrarFimDeJogo:
      fase ===
      FASES.FIM_DE_JOGO,

    mostrarBanner:
      fase === FASES.PONTO ||
      fase === FASES.ERRO,

    bannerTipo:
      fase === FASES.PONTO
        ? "ponto"
        : "erro",

    tentativaExibida:
      Math.min(
        tentativa,
        TOTAL_FASES
      ),

    pontos,

    bolinhas:
      historico,

    nivel,

    somLigado,

    alternarSom,

    fraseResultado,

    fraseTorcida,

    mensagemRodape:
      MENSAGENS_RODAPE[
        fase
      ] ?? "",

    estrelas:
      calcularEstrelas(
        pontos
      ),

    emojiFinal:
      emojiDoResultadoFinal(
        pontos
      ),

    iniciarJogo,

=======
import { dadosIniciais } from "../helpers/dadosIniciais";
import { desenharCena } from "../helpers/desenharCena";
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { detectarColisaoRaquete } from "../helpers/detectarColisaoRaquete";
import { moverInimigo } from "../helpers/moverInimigo";
import { nivelDoMomento } from "../helpers/nivelDoMomento";
import { prepararSaque } from "../helpers/prepararSaque";
import { sorteiaFrase } from "../helpers/sorteiaFrase";
import { velocidadeDoMomento } from "../helpers/velocidadeDoMomento";

import { useSons } from "./useSons";

export function usePingpong() {
  const navigate = useNavigate(); // para voltar à tela inicial

  // --- Estado visível (usado para renderizar o HTML) ------------------------
  const [fase, setFase] = useState(FASES.INTRO);
  const [pontos, setPontos] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [somLigado, setSomLigado] = useState(true);
  const [fraseResultado, setFraseResultado] = useState("");
  const [fraseTorcida, setFraseTorcida] = useState("");

  // --- Referências estáveis --------------------------------------------------
  const canvasRef = useRef(null); // o <canvas> da Arena
  const dataRef = useRef(null); // dados mutáveis da partida (muda a cada quadro)
  if (dataRef.current === null) dataRef.current = dadosIniciais();

  const { garantirAudio, tocarToque, tocarPonto, tocarErro } = useSons(somLigado);

  // Liga/desliga o som (usado no botão 🔊/🔇 do placar)
  const alternarSom = useCallback(() => setSomLigado((s) => !s), []);

  // Volta para a tela inicial (rota /home)
  const voltarParaHome = useCallback(() => navigate("/home"), [navigate]);

  // --- Começar uma nova partida ---------------------------------------------
  const iniciarJogo = useCallback(() => {
    garantirAudio(); // libera o áudio (exige um clique do usuário)
    dataRef.current = dadosIniciais(); // reset completo dos dados
    const d = dataRef.current;
    prepararSaque(d); // posiciona a bola pronta para o saque
    d.fase = FASES.SERVINDO; // entra na contagem regressiva
    d.serveRestante = TEMPO_SAQUE;
    // Reinicia todos os estados visíveis
    setPontos(0);
    setTentativa(0);
    setHistorico([]);
    setFraseResultado("");
    setFraseTorcida("");
    setFase(FASES.SERVINDO);
  }, [garantirAudio]);

  // --- Entrada do jogador (mouse/toque + teclado) ----------------------------
  useEffect(() => {
    // Converte a posição do mouse (pixels da tela) para o Y do jogo (0-400)
    const acharY = (clientY) => {
      const r = canvasRef.current.getBoundingClientRect();
      return ((clientY - r.top) / r.height) * GAME_HEIGHT;
    };
    // Ao mover o mouse: salva como alvo e liga o controle por ponteiro
    const onPointerMove = (e) => {
      const d = dataRef.current;
      d.pointerActive = true;
      d.targetY = acharY(e.clientY);
    };
    // Ao tocar/clicar: mesmo comportamento (arrastar com o dedo)
    const onPointerDown = (e) => {
      const d = dataRef.current;
      d.pointerActive = true;
      d.targetY = acharY(e.clientY);
    };
    // Setas ↑↓ e teclas W/S movem a raquete (libera o controle por teclado)
    const onKeyDown = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        dataRef.current.keys.up = true;
        dataRef.current.pointerActive = false;
      }
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        dataRef.current.keys.down = true;
        dataRef.current.pointerActive = false;
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") dataRef.current.keys.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") dataRef.current.keys.down = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // --- Loop principal do jogo (render + física) ------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let rafId; // id do requestAnimationFrame (para cancelar)
    let last = 0; // timestamp do último quadro (para calcular dt)

    // Move a raquete do jogador conforme o controle ativo
    const moverJogador = (d, dt) => {
      if (d.pointerActive && d.targetY !== null) {
        // Com mouse/toque: interpola suavemente até o alvo
        d.playerY += (d.targetY - d.playerY) * Math.min(1, dt * 16);
      } else {
        // Com teclado: anda com velocidade constante
        if (d.keys.up) d.playerY -= VELOCIDADE_JOGADOR_TECLADO * dt;
        if (d.keys.down) d.playerY += VELOCIDADE_JOGADOR_TECLADO * dt;
      }
      // Mantém a raquete dentro dos limites da tela
      d.playerY = Math.max(LIMITE_RAQUETE_TOPO, Math.min(LIMITE_RAQUETE_BAIXO, d.playerY));
    };

    // Rebate a bola: o ângulo depende de onde ela acertou a raquete
    // (acertar no topo ou na base manda a bola para o lado, como num jogo real)
    const rebater = (d, raquete, dir) => {
      const velocidade = velocidadeDoMomento(d.pontos);
      const centro = raquete.y + raquete.h / 2;
      const meio = raquete.h / 2;
      const offset = Math.max(-1, Math.min(1, (d.ball.y - centro) / meio)); // -1..1
      const angulo = offset * 0.6; // até ~34°
      d.vx = dir * velocidade.bola * Math.cos(angulo);
      d.vy = velocidade.bola * Math.sin(angulo);
      // Garante um mínimo de componente vertical senão fica reto demais
      if (Math.abs(d.vy) < 24) d.vy = (d.vy < 0 ? -1 : 1) * velocidade.bola * 0.18;
      tocarToque(); // som de "toc"
    };

    // Finaliza a tentativa (ponto ou erro) e mostra o banner com as frases
    const resolverResultado = (d, ehPonto) => {
      d.tentativa += 1;
      setTentativa(d.tentativa);
      if (ehPonto) {
        d.pontos += 1;
        setPontos(d.pontos);
        d.historico = [...d.historico, "ponto"];
        setHistorico(d.historico);
        setFraseResultado(sorteiaFrase(FRASES_PONTO));
        setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_PONTO));
        tocarPonto();
      } else {
        d.historico = [...d.historico, "erro"];
        setHistorico(d.historico);
        setFraseResultado(sorteiaFrase(FRASES_ERRO));
        setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_ERRO));
        tocarErro();
      }
      d.fase = ehPonto ? FASES.PONTO : FASES.ERRO;
      d.resultadoRestante = TEMPO_RESULTADO; // tempo do banner
      setFase(d.fase);
    };

    // Uma "volta" do loop: chamado a cada quadro da animação
    const step = (t) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 1000, 0.04); // segundos; limita em 40ms
      last = t;

      const d = dataRef.current;

      // --- Fase SERVINDO: contagem regressiva + bola balançando --------------
      if (d.fase === FASES.SERVINDO) {
        moverJogador(d, dt);
        d.serveTempoTotal += dt;
        // Balança a bola em torno da posição base (visual só, sem física)
        d.ball.y = d.ball.baseY + Math.sin(d.serveTempoTotal * 5) * 6;
        d.serveRestante -= dt * 1000;
        if (d.serveRestante <= 0) {
          d.flashRestante = 500; // solta o flash "VAI!"
          d.fase = FASES.JOGANDO;
          setFase(FASES.JOGANDO);
        }
      }

      // --- Fase JOGANDO: física da bola + colisões ---------------------------
      else if (d.fase === FASES.JOGANDO) {
        moverJogador(d, dt);
        const velocidade = velocidadeDoMomento(d.pontos);
        moverInimigo(d, velocidade, dt); // IA do adversário

        // Movimento da bola
        d.ball.x += d.vx * dt;
        d.ball.y += d.vy * dt;

        // Efeitos de partida
        if (d.flashRestante > 0) d.flashRestante -= dt * 1000; // conta o "VAI!"
        d.rastro.push({ x: d.ball.x, y: d.ball.y }); // guarda posição p/ cauda
        if (d.rastro.length > 6) d.rastro.shift();

        // Quique nas paredes (topo e base) — inverte o Y e dá um impulso mínimo
        if (d.ball.y - d.ball.metade < PAREDE_TOPO) {
          d.ball.y = PAREDE_TOPO + d.ball.metade;
          d.vy = Math.abs(d.vy);
          if (Math.abs(d.vy) < 36) d.vy = 36;
          tocarToque();
        } else if (d.ball.y + d.ball.metade > PAREDE_BAIXO) {
          d.ball.y = PAREDE_BAIXO - d.ball.metade;
          d.vy = -Math.abs(d.vy);
          if (Math.abs(d.vy) < 36) d.vy = -36;
          tocarToque();
        }

        // Retângulos de colisão das duas raquetes
        const raqueteJogador = {
          x: PLAYER_X - RAQUETE_W / 2,
          y: d.playerY - RAQUETE_H / 2,
          w: RAQUETE_W,
          h: RAQUETE_H,
        };
        const raqueteIa = {
          x: IA_X - RAQUETE_W / 2,
          y: d.aiY - RAQUETE_H / 2,
          w: RAQUETE_W,
          h: RAQUETE_H,
        };

        // Rebate ao bater na raquete do jogador (bola indo para a esquerda)
        // ou na raquete da IA (bola indo para a direita)
        if (d.vx < 0 && detectarColisaoRaquete(d.ball, raqueteJogador)) {
          d.ball.x = raqueteJogador.x + raqueteJogador.w + d.ball.metade;
          rebater(d, raqueteJogador, 1);
        } else if (d.vx > 0 && detectarColisaoRaquete(d.ball, raqueteIa)) {
          d.ball.x = raqueteIa.x - d.ball.metade;
          rebater(d, raqueteIa, -1);
        }

        // Saiu pela esquerda = ERRO do jogador; pela direita = PONTO
        if (d.ball.x - d.ball.metade < LIMITE_ESQUERDA) {
          resolverResultado(d, false);
        } else if (d.ball.x + d.ball.metade > LIMITE_DIREITA) {
          resolverResultado(d, true);
        }
      }

      // --- Fase PONTO/ERRO: congela a bola e mostra o banner -----------------
      else if (d.fase === FASES.PONTO || d.fase === FASES.ERRO) {
        moverInimigo(d, velocidadeDoMomento(d.pontos), dt);
        d.resultadoRestante -= dt * 1000;
        if (d.resultadoRestante <= 0) {
          if (d.tentativa >= TOTAL_TENTATIVAS) {
            d.fase = FASES.FIM_DE_JOGO; // acabaram as bolas
          } else {
            prepararSaque(d); // prepara a bola para a próxima tentativa
            d.serveRestante = TEMPO_SAQUE;
            d.fase = FASES.SERVINDO;
          }
          setFase(d.fase);
        }
      }

      // Desenha a cena e agenda o próximo quadro
      desenharCena(ctx, d);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId); // para o loop ao desmontar
      last = 0;
    };
  }, [tocarToque, tocarPonto, tocarErro]);

  // --- Valores derivados usados pelo HTML ------------------------------------
  const nivel = nivelDoMomento(pontos);
  const emJogo = fase !== FASES.INTRO && fase !== FASES.FIM_DE_JOGO;

  return {
    canvasRef,
    emJogo, // true quando a partida está em andamento (esconde a tela intro)
    mostrarFimDeJogo: fase === FASES.FIM_DE_JOGO,
    mostrarBanner: fase === FASES.PONTO || fase === FASES.ERRO,
    bannerTipo: fase === FASES.PONTO ? "ponto" : "erro",
    tentativaExibida: Math.min(tentativa, TOTAL_TENTATIVAS),
    pontos,
    bolinhas: historico, // bolinhas pintadas no placar
    nivel,
    somLigado,
    alternarSom,
    fraseResultado,
    fraseTorcida,
    mensagemRodape: MENSAGENS_RODAPE[fase] ?? "",
    estrelas: calcularEstrelas(pontos),
    emojiFinal: emojiDoResultadoFinal(pontos),
    iniciarJogo,
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
    voltarParaHome,
  };
}