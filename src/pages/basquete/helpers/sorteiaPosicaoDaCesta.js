import { CESTA_MOVEL } from "../utils/constantes";

// Depois de cada cesta a cesta muda de lugar: ela "teleporta" para uma nova
// posição fixa dentro da área de jogo. Trocar de lugar é a recompensa da
// evolução — ela só anda de verdade na última rodada.
export function sorteiaPosicaoDaCesta() {
  const x =
    CESTA_MOVEL.MIN_X +
    Math.random() * (CESTA_MOVEL.MAX_X - CESTA_MOVEL.MIN_X);
  const y =
    CESTA_MOVEL.MIN_Y +
    Math.random() * (CESTA_MOVEL.MAX_Y - CESTA_MOVEL.MIN_Y);
  return { x, y };
}