// ============================================================================
// desenharPista — cenário fixo: canaletas, tábuas, setas de mira e fundo
// ============================================================================

import { rect } from "./rect";
import {
  CANALETA,
  CORES,
  FUNDO_X,
  GAME_HEIGHT,
  GAME_WIDTH,
  LINHA_LANCAMENTO,
  PISTA_BASE,
  PISTA_TOPO,
} from "../utils/constantes";

export function desenharPista(ctx) {
  const altura = PISTA_BASE - PISTA_TOPO;

  // Fundo geral (área fora da pista)
  rect(ctx, 0, 0, GAME_WIDTH, GAME_HEIGHT, CORES.fundo);

  // Parede do fundo, atrás dos pinos
  rect(ctx, FUNDO_X, 0, GAME_WIDTH - FUNDO_X, GAME_HEIGHT, CORES.parede);
  rect(ctx, FUNDO_X, 0, 6, GAME_HEIGHT, CORES.canaletaBorda);

  // Canaletas (uma em cima, outra embaixo)
  rect(ctx, 0, PISTA_TOPO - CANALETA, FUNDO_X, CANALETA, CORES.canaleta);
  rect(ctx, 0, PISTA_BASE, FUNDO_X, CANALETA, CORES.canaleta);
  rect(ctx, 0, PISTA_TOPO - CANALETA, FUNDO_X, 4, CORES.canaletaBorda);
  rect(ctx, 0, PISTA_BASE + CANALETA - 4, FUNDO_X, 4, CORES.canaletaBorda);

  // Madeira da pista
  rect(ctx, 0, PISTA_TOPO, FUNDO_X, altura, CORES.madeira);

  // Tábuas: listras horizontais alternadas, como o piso de uma pista real
  for (let y = PISTA_TOPO; y < PISTA_BASE; y += 16) {
    rect(ctx, 0, y, FUNDO_X, 2, CORES.madeiraEscura);
    rect(ctx, 0, y + 8, FUNDO_X, 1, CORES.madeiraClara);
  }

  // Linha de lançamento (falta)
  rect(ctx, LINHA_LANCAMENTO + 26, PISTA_TOPO, 4, altura, CORES.madeiraEscura);

  // Setas de mira, como nas pistas de verdade
  const centroY = (PISTA_TOPO + PISTA_BASE) / 2;
  for (let i = -2; i <= 2; i++) {
    const y = centroY + i * 46;
    const x = 300 + Math.abs(i) * 34;
    // Cada seta é feita de fatias que afinam para a direita
    for (let k = 0; k < 5; k++) {
      rect(ctx, x + k * 6, y - (5 - k) * 2, 6, (5 - k) * 4, CORES.madeiraEscura);
    }
  }
}
