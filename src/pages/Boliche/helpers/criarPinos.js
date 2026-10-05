// ============================================================================
// criarPinos — monta o triângulo de 10 pinos no fundo da pista
// ----------------------------------------------------------------------------
// Como a pista é vista de cima e deitada, o triângulo cresce para a direita:
// 1 pino na primeira coluna, 2 na segunda, 3 na terceira e 4 na quarta.
// ============================================================================

import {
  PINO_COLUNA_X,
  PINO_ESPACO_X,
  PINO_ESPACO_Y,
  PISTA_BASE,
  PISTA_TOPO,
} from "../utils/constantes";

export function criarPinos() {
  const centroY = (PISTA_TOPO + PISTA_BASE) / 2;
  const pinos = [];
  let id = 0;

  for (let coluna = 0; coluna < 4; coluna++) {
    const quantidade = coluna + 1;
    const x = PINO_COLUNA_X + coluna * PINO_ESPACO_X;

    for (let i = 0; i < quantidade; i++) {
      // Espalha os pinos da coluna simetricamente em torno do centro da pista
      const deslocamento = (i - (quantidade - 1) / 2) * PINO_ESPACO_Y;
      pinos.push({
        id: id++,
        x,
        y: centroY + deslocamento,
        vx: 0,
        vy: 0,
        caido: false,
        caidoAntes: false, // já estava caído quando esta bola foi lançada
        angulo: 0,
      });
    }
  }

  return pinos;
}
