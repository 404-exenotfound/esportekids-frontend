import {
  TEMPO_POR_UNIDADE_DE_VELOCIDADE,
  VELOCIDADE_INICIAL,
  VELOCIDADE_MAXIMA,
} from "../utils/constantes";

export function velocidadeDoMomento(elapsed) {
  return Math.min(VELOCIDADE_INICIAL + elapsed / TEMPO_POR_UNIDADE_DE_VELOCIDADE, VELOCIDADE_MAXIMA);
}