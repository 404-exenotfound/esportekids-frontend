// ============================================================================
// desenharBola — bola vermelha com os três furos girando junto
// ============================================================================

import { rect } from "./rect";
import { BOLA_RAIO, CORES } from "../utils/constantes";

export function desenharBola(ctx, bola) {
  const { x, y } = bola;

  // Corpo (quadrado arredondado por camadas, para manter o ar de pixel art)
  rect(ctx, x - BOLA_RAIO, y - BOLA_RAIO + 3, BOLA_RAIO * 2, BOLA_RAIO * 2, CORES.bolaEscura);
  rect(ctx, x - BOLA_RAIO, y - BOLA_RAIO, BOLA_RAIO * 2, BOLA_RAIO * 2 - 3, CORES.bola);
  rect(ctx, x - BOLA_RAIO + 3, y - BOLA_RAIO - 2, BOLA_RAIO * 2 - 6, 3, CORES.bola);
  rect(ctx, x - BOLA_RAIO + 3, y + BOLA_RAIO - 3, BOLA_RAIO * 2 - 6, 3, CORES.bolaEscura);

  // Brilho fixo (dá volume)
  rect(ctx, x - BOLA_RAIO + 3, y - BOLA_RAIO + 3, 5, 4, CORES.bolaBrilho);

  // Furos: giram conforme a bola avança
  for (let i = 0; i < 3; i++) {
    const angulo = bola.giro + (i * Math.PI * 2) / 3;
    const furoX = x + Math.cos(angulo) * 5;
    const furoY = y + Math.sin(angulo) * 5;
    rect(ctx, furoX - 2, furoY - 2, 4, 4, CORES.bolaEscura);
  }
}
