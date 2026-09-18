// ============================================================================
// desenharPersonagem — desenha o jogador (ou adversário) completo
// ----------------------------------------------------------------------------
// "cx" e "cy" são o centro do personagem (posição do jogador na tela). A partir
// deles calcula a origem do sprite: o personagem é desenhado com a raquete na
// mão, então o centro vertical fica na linha 13 da matriz. Também desenha a
// sombra no chão para "pendurar" o personagem na cena.
// ============================================================================

import { PIXEL } from "../utils/constantes";
import { PERSONAGEM_MATRIZ } from "../utils/personagem";
import { desenharMatriz } from "./desenharMatriz";
import { rect } from "./rect";

const COL_CENTRO_RAQUETE = 10; // coluna da matriz onde começa a raquete
const LINHA_CENTRO_RAQUETE = 13; // linha da matriz usada como centro vertical

export function desenharPersonagem(ctx, { cx, cy, cores, espelhado = false }) {
  // Origem X: a raquete fica na coluna 10 do sprite; "espelhado" desenha para o lado oposto
  const offX = COL_CENTRO_RAQUETE * PIXEL + PIXEL / 2;
  const originX = espelhado ? cx + offX : cx - offX;
  // Origem Y: linha 13 do sprite = centro do personagem
  const originY = cy - LINHA_CENTRO_RAQUETE * PIXEL - PIXEL / 2;

  // Sombra no chão sob os pés do personagem
  rect(ctx, cx - 8, cy + 42, 16, 4, "rgba(31, 31, 31, 0.25)");
  // Sprite principal
  desenharMatriz(ctx, PERSONAGEM_MATRIZ, cores, originX, originY, PIXEL, espelhado);
}