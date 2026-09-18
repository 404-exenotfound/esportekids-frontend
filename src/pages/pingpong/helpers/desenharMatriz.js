// ============================================================================
// desenharMatriz — desenha um sprite a partir de uma matriz de letras
// ----------------------------------------------------------------------------
// Percorre a matriz linha por linha (y) e coluna por coluna (x). Para cada
// letra que não seja ".", pinta um quadrado de "pixel x pixel" usando a cor
// correspondente na paleta. A opção "espelhado" inverte o desenho no eixo X
// (usado para o adversário na direita olhar para a esquerda).
// ============================================================================

import { rect } from "./rect";

export function desenharMatriz(ctx, matriz, cores, originX, originY, pixel, espelhado = false) {
  for (let y = 0; y < matriz.length; y++) {
    for (let x = 0; x < matriz[0].length; x++) {
      const codigo = matriz[y][x];
      if (codigo === ".") continue; // espaço vazio, não desenha
      // No espelhado, o X anda "para trás" a partir da origem
      const px = espelhado ? originX - (x + 1) * pixel : originX + x * pixel;
      rect(ctx, px, originY + y * pixel, pixel, pixel, cores[codigo]);
    }
  }
}