// ============================================================================
// moverInimigo — inteligência artificial do adversário
// ----------------------------------------------------------------------------
// Tem 3 comportamentos diferentes conforme o nível:
//   FÁCIL   (pontos 0-3):  o adversário apenas PASSEIA subindo e descendo em
//                          posições aleatórias — não persegue a bola.
//   MÉDIO/DIFÍCIL:         ele caça a bola, mas com reação tardia (só depois
//                          da bola cruzar 62% da tela), hesitação ("tremor"
//                          senoidal) e velocidade limitada — assim dá para
//                          passar mirando nos cantos.
// ============================================================================

import { GAME_WIDTH, LIMITE_RAQUETE_BAIXO, LIMITE_RAQUETE_TOPO } from "../utils/constantes";

export const INIMIGO_ATIVO_DESDE_PONTOS = 4; // a partir de 4 pontos ele persegue
const VELOCIDADE_PASSEIO = 150; // velocidade do passeio no modo FÁCIL

export function moverInimigo(d, controle, dt) {
  // --- Comportamento FÁCIL: passeio aleatório (sem defender) ---------------
  if (d.pontos < INIMIGO_ATIVO_DESDE_PONTOS) {
    d.aiPasseioTempo -= dt;

    // Quando o timer zera, escolhe um novo alvo aleatório (de cima ou de baixo)
    if (d.aiPasseioTempo <= 0) {
      d.aiPasseioTempo = 1 + Math.random() * 1.5;
      d.aiPasseioAlvo =
        LIMITE_RAQUETE_TOPO + Math.random() * (LIMITE_RAQUETE_BAIXO - LIMITE_RAQUETE_TOPO);
    }

    // Move em direção ao alvo, limitado a VELOCIDADE_PASSEIO px/s
    const delta = d.aiPasseioAlvo - d.aiY;
    const maxPasso = VELOCIDADE_PASSEIO * dt;
    const movimento = Math.max(-maxPasso, Math.min(maxPasso, delta));
    d.aiY = Math.max(LIMITE_RAQUETE_TOPO, Math.min(LIMITE_RAQUETE_BAIXO, d.aiY + movimento));
    return;
  }

  // --- Comportamento MÉDIO/DIFÍCIL: caçar a bola com falhas humanas ---------
  const centro = (LIMITE_RAQUETE_TOPO + LIMITE_RAQUETE_BAIXO) / 2;

  d.aiWobbleT += dt; // relógio contínuo para a hesitação
  const hesitacao = Math.sin(d.aiWobbleT * 4.2) * controle.erroIa; // "tremor"
  const reagindo = d.vx > 0 && d.ball.x >= GAME_WIDTH * 0.62; // reação tardia
  const alvo = reagindo ? d.ball.y + hesitacao : centro;

  const delta = alvo - d.aiY;
  const rapidez = reagindo ? controle.ia : controle.ia * 0.4; // retorno ao centro é lento
  const maxPasso = rapidez * dt;
  const movimento = Math.max(-maxPasso, Math.min(maxPasso, delta));
  d.aiY = Math.max(LIMITE_RAQUETE_TOPO, Math.min(LIMITE_RAQUETE_BAIXO, d.aiY + movimento));
}