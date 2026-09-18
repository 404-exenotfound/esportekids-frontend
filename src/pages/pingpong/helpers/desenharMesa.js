// ============================================================================
// desenharMesa — a quadra (mesa) azul e a rede central
// ----------------------------------------------------------------------------
// A quadra ocupa a área de jogo inteira (y=33 até y=370) para que a bola
// sempre quique "sobre a mesa". Ela tem linhas brancas nas bordas e uma rede
// central bem visível com tapes brancos e postes, para leitores infantis
// reconhecerem na hora um jogo de ping-pong.
// ============================================================================

import { GAME_WIDTH } from "../utils/constantes";
import { rect } from "./rect";

export function desenharMesa(ctx) {
  const nx = GAME_WIDTH / 2; // centro da tela = posição da rede

  // Corpo principal da quadra (mesa azul)
  rect(ctx, 0, 33, GAME_WIDTH, 337, "#1589c7");
  rect(ctx, 0, 33, GAME_WIDTH, 5, "#24a5e0"); // reflexo de luz no topo

  // Linhas brancas das bordas (superior e inferior)
  rect(ctx, 0, 33, GAME_WIDTH, 3, "#e9f7ff");
  rect(ctx, 0, 367, GAME_WIDTH, 3, "#0d6ca5"); // sombra interna na base

  // Laterais brancas estreitas (bordas esquerda e direita da mesa)
  rect(ctx, 4, 33, 2, 337, "#e9f7ff");
  rect(ctx, 794, 33, 2, 337, "#e9f7ff");

  // --- Rede central ----------------------------------------------------------
  rect(ctx, nx - 7, 35, 14, 4, "#ffffff"); // tape (fita) branca do topo
  rect(ctx, nx - 6, 36, 12, 330, "#bde3f7"); // malha clara da rede
  rect(ctx, nx - 4, 39, 8, 327, "#9cc9e8"); // detalhe interno da malha
  rect(ctx, nx - 2, 36, 4, 330, "#2f6f9c"); // poste vertical central
  rect(ctx, nx - 7, 366, 14, 4, "#ffffff"); // fita branca de baixo
  rect(ctx, nx - 4, 346, 4, 20, "#2f6f9c"); // poste até a base
  rect(ctx, nx - 5, 20, 10, 7, "#e63946"); // topo/pino vermelho da rede
  rect(ctx, nx - 4, 370, 8, 5, "#33415c"); // apoio da rede no piso

  // Apoios escuros da mesa no piso (sob as pernas dos jogadores)
  rect(ctx, 104, 370, 28, 4, "#12405f");
  rect(ctx, 668, 370, 28, 4, "#12405f");
}