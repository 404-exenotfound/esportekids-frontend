// ============================================================================
// velocidadeDoMomento — velocidades atuais conforme a pontuação
// ----------------------------------------------------------------------------
// A cada ponto a partida fica mais rápida: a bola ganha velocidade, o
// adversário fica mais rápido e ao mesmo tempo erra menos a mira. Os valores
// são limitados pelos tetos definidos em constantes para o jogo continuar
// justo para crianças.
// ============================================================================

import {
  ERRO_IA_INICIAL,
  ERRO_IA_MINIMO,
  ERRO_IA_POR_PONTO,
  VELOCIDADE_BOLA_BASE,
  VELOCIDADE_BOLA_MAXIMA,
  VELOCIDADE_BOLA_POR_PONTO,
  VELOCIDADE_IA_BASE,
  VELOCIDADE_IA_MAXIMA,
  VELOCIDADE_IA_POR_PONTO,
} from "../utils/constantes";

export function velocidadeDoMomento(pontos) {
  return {
    bola: Math.min(
      VELOCIDADE_BOLA_BASE + pontos * VELOCIDADE_BOLA_POR_PONTO,
      VELOCIDADE_BOLA_MAXIMA
    ),
    ia: Math.min(
      VELOCIDADE_IA_BASE + pontos * VELOCIDADE_IA_POR_PONTO,
      VELOCIDADE_IA_MAXIMA
    ),
    erroIa: Math.max(ERRO_IA_INICIAL - pontos * ERRO_IA_POR_PONTO, ERRO_IA_MINIMO),
  };
}