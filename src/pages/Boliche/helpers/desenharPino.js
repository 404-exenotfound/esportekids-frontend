// ============================================================================
// desenharPino — pino em pé (de cima) ou tombado na pista
// ============================================================================

import { rect } from "./rect";
import { CORES, PINO_RAIO } from "../utils/constantes";

export function desenharPino(ctx, pino) {
  const { x, y } = pino;

  if (!pino.caido) {
    // Em pé: visto de cima é um círculo claro com o "pescoço" vermelho
    rect(ctx, x - PINO_RAIO, y - PINO_RAIO + 2, PINO_RAIO * 2, PINO_RAIO * 2, CORES.pinoSombra);
    rect(ctx, x - PINO_RAIO, y - PINO_RAIO, PINO_RAIO * 2, PINO_RAIO * 2 - 2, CORES.pino);
    rect(ctx, x - 4, y - 4, 8, 8, CORES.pinoFaixa);
    rect(ctx, x - 2, y - 2, 4, 4, CORES.branco);
    return;
  }

  // Tombado: desenhado deitado, na direção em que foi empurrado
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(pino.angulo);
  rect(ctx, -14, -5, 28, 10, CORES.pinoSombra);
  rect(ctx, -14, -5, 26, 8, CORES.pino);
  rect(ctx, 0, -5, 5, 8, CORES.pinoFaixa);
  rect(ctx, 10, -3, 4, 5, CORES.pinoSombra);
  ctx.restore();
}
