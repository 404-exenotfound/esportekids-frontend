// ============================================================================
// desenharMira — seta que sobe e desce antes do lançamento
// ============================================================================

import { rect } from "./rect";
import { CORES, LINHA_LANCAMENTO } from "../utils/constantes";

export function desenharMira(ctx, y) {
  // Linha pontilhada mostrando o caminho que a bola vai seguir
  for (let x = LINHA_LANCAMENTO + 40; x < 580; x += 24) {
    rect(ctx, x, y - 1, 12, 3, CORES.amarelo);
  }

  // Ponta da seta
  for (let i = 0; i < 6; i++) {
    rect(ctx, 580 + i * 3, y - (6 - i), 3, (6 - i) * 2, CORES.amarelo);
  }
}
