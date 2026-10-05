import { VELOCIDADE_INICIAL } from "../utils/constantes";

// Converte a velocidade bruta em um multiplicador exibível (1 = bem no começo).
export function velocidadeExibida(velocidade) {
  return Math.round((velocidade / VELOCIDADE_INICIAL) * 10) / 10;
}