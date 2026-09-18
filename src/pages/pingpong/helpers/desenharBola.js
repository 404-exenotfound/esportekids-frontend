// ============================================================================
// desenharBola — desenha a bolinha na posição (x, y)
// ----------------------------------------------------------------------------
// A bola tem 16x12 pixels visuais. O desenho é centralizado aproximadamente em
// (x, y), com a origem deslocada 8 px para a esquerda (X) e 6 px para cima (Y).
// ============================================================================

import { BOLA_MATRIZ, CORES_BOLA } from "../utils/bola";
import { desenharMatriz } from "./desenharMatriz";

export function desenharBola(ctx, x, y) {
  desenharMatriz(ctx, BOLA_MATRIZ, CORES_BOLA, x - 8, y - 6, 4);
}