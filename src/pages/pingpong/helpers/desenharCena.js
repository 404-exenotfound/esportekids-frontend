// ============================================================================
// desenharCena — desenha a cena completa do jogo a cada quadro
// ----------------------------------------------------------------------------
// A ordem de desenho importa: primeiro o fundo (ginásio + mesa), depois o
// rastro da bola, os dois personagens e por fim a bola por cima. No final, se
// estiver servindo (ou no flash "VAI!"), desenha o indicador de saque por
// cima de tudo.
// ============================================================================

import { FASES, IA_X, PLAYER_X } from "../utils/constantes";
import { CORES_INIMIGO, CORES_JOGADOR } from "../utils/personagem";
import { desenharBola } from "./desenharBola";
import { desenharGinasio } from "./desenharGinasio";
import { desenharMesa } from "./desenharMesa";
import { desenharPersonagem } from "./desenharPersonagem";
import { desenharRastroBola } from "./desenharRastroBola";
import { desenharSaque } from "./desenharSaque";

export function desenharCena(ctx, d) {
  ctx.imageSmoothingEnabled = false; // mantém o visual pixelado (sem suavizar)

  desenharGinasio(ctx); // fundo: arquibancada, parede e piso
  desenharMesa(ctx); // quadra azul + rede central

  desenharRastroBola(ctx, d.rastro); // cauda da bola (atrás dos personagens)

  desenharPersonagem(ctx, {
    cx: PLAYER_X,
    cy: d.playerY,
    cores: CORES_JOGADOR,
  });

  desenharPersonagem(ctx, {
    cx: IA_X,
    cy: d.aiY,
    cores: CORES_INIMIGO,
    espelhado: true,
  });

  desenharBola(ctx, d.ball.x, d.ball.y);

  // Indicador de saque (contagem 3-2-1) ou flash "VAI!"
  if (d.fase === FASES.SERVINDO || (d.flashRestante || 0) > 0) {
    desenharSaque(ctx, d);
  }
}