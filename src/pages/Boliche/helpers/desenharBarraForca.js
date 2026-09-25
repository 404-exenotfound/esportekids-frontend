// ============================================================================
// desenharBarraForca — barrinha de força que enche e esvazia na largada
// ============================================================================

import { rect } from "./rect";
import { CORES, PISTA_BASE } from "../utils/constantes";

const LARGURA = 180;
const ALTURA = 18;
const X = 24;

export function desenharBarraForca(ctx, forca) {
  const y = PISTA_BASE + 42;

  rect(ctx, X - 4, y - 4, LARGURA + 8, ALTURA + 8, CORES.preto);
  rect(ctx, X, y, LARGURA, ALTURA, "#3a3a52");

  const preenchida = Math.max(0, Math.min(1, forca)) * LARGURA;
  const cor = forca > 0.75 ? "#EF476F" : forca > 0.4 ? CORES.amarelo : "#06D6A0";
  rect(ctx, X, y, preenchida, ALTURA, cor);

  // Marcações da barra
  for (let i = 1; i < 4; i++) {
    rect(ctx, X + (LARGURA / 4) * i, y, 2, ALTURA, CORES.preto);
  }

  ctx.fillStyle = CORES.branco;
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.textAlign = "left";
  ctx.fillText("FORÇA", X, y - 10);
}
