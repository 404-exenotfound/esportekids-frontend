// ============================================================================
// servirBola — cria o objeto "bola" do saque do adversário
// ----------------------------------------------------------------------------
// A bola nasce no LADO DIREITO (lado do adversário, x entre 520 e 560) com
// altura aleatória (baseY) e já com uma velocidade apontando para a ESQUERDA,
// ou seja, vindo em direção ao jogador. A dificuldade deixa o saque um pouco
// mais forte a cada ponto.
// ============================================================================

import { BOLA_TAMANHO, VELOCIDADE_SAQUE } from "../utils/constantes";

export function servirBola(pontos) {
  const fator = 0.92 + pontos * 0.02; // cada ponto acelera um pouco o saque
  const y = 150 + Math.random() * 60; // altura aleatória do saque
  return {
    x: 520 + Math.random() * 40, // nasce perto do adversário (direita)
    y,
    baseY: y, // usada para o balanço durante a contagem
    metade: BOLA_TAMANHO / 2, // metade do tamanho (usada nas colisões)
    vx: -VELOCIDADE_SAQUE * fator, // vai para a esquerda, em direção ao jogador
    vy: (Math.random() - 0.5) * 40, // leve variação vertical
  };
}