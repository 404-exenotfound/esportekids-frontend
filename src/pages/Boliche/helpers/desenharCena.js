// ============================================================================
// desenharCena — desenha um quadro inteiro do jogo
// ----------------------------------------------------------------------------
// Ordem: pista → pinos caídos → pinos em pé → bola → auxiliares (mira/força).
// Desenhar os caídos antes evita que um pino tombado cubra um que está em pé.
// ============================================================================

import { desenharPista } from "./desenharPista";
import { desenharPino } from "./desenharPino";
import { desenharBola } from "./desenharBola";
import { desenharMira } from "./desenharMira";
import { desenharBarraForca } from "./desenharBarraForca";
import { ETAPAS } from "../utils/constantes";

export function desenharCena(ctx, d) {
  desenharPista(ctx);

  for (const pino of d.pinos) if (pino.caido) desenharPino(ctx, pino);
  for (const pino of d.pinos) if (!pino.caido) desenharPino(ctx, pino);

  desenharBola(ctx, d.bola);

  if (d.etapa === ETAPAS.MIRA) {
    desenharMira(ctx, d.miraY);
  }

  if (d.etapa === ETAPAS.MIRA || d.etapa === ETAPAS.FORCA) {
    desenharBarraForca(ctx, d.forca);
  }
}
