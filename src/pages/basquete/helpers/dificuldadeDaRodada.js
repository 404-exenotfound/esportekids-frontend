import {
  RAIO_PRECISAO_INICIAL,
  RAIO_PRECISAO_MINIMO,
  REDUCAO_RAIO_POR_CESTA,
} from "../utils/constantes";

// A dificuldade aumenta a cada cesta convertida: a "boca" da cesta (raio do
// alvo de mira) encolhe a cada arremesso certo, exigindo pontaria cada vez
// melhor — mas mantendo um valor mínimo pra nunca frustrar a criançada.
export function dificuldadeDaRodada(cestas) {
  const raio = Math.max(
    RAIO_PRECISAO_INICIAL - cestas * REDUCAO_RAIO_POR_CESTA,
    RAIO_PRECISAO_MINIMO
  );

  if (cestas <= 2) return { rotulo: "FÁCIL", classe: "", raio };
  if (cestas <= 6) return { rotulo: "MÉDIO", classe: "media", raio };
  return { rotulo: "DIFÍCIL", classe: "dificil", raio };
}