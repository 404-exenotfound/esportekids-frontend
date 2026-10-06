// ============================================================================
// resultadoDaBola — traduz a jogada em tipo, frase e pontos
// ----------------------------------------------------------------------------
// Regras simplificadas (partida curta para crianças):
//   STRIKE (10 pinos na 1ª bola) = 20 pontos
//   SPARE  (10 pinos nas 2 bolas) = 15 pontos
//   Caso contrário, vale o número de pinos derrubados na rodada.
// ============================================================================

import { sorteiaFrase } from "./sorteiaFrase";
import {
  FRASES_BOM,
  FRASES_CANALETA,
  FRASES_FRACO,
  FRASES_SPARE,
  FRASES_STRIKE,
} from "../utils/frases";
import { PONTOS_SPARE, PONTOS_STRIKE, TOTAL_PINOS } from "../utils/constantes";

export function resultadoDaBola({ bolaDaRodada, derrubadosNestaBola, derrubadosNaRodada, naCanaleta }) {
  // Primeira bola derrubando tudo: STRIKE, a rodada acaba aqui
  if (bolaDaRodada === 1 && derrubadosNestaBola === TOTAL_PINOS) {
    return {
      tipo: "strike",
      frase: sorteiaFrase(FRASES_STRIKE),
      pontos: PONTOS_STRIKE,
      fecharRodada: true,
    };
  }

  // Ainda tem a segunda bola: nada é somado agora
  if (bolaDaRodada === 1) {
    return {
      tipo: derrubadosNestaBola > 0 ? "bom" : "erro",
      frase: naCanaleta
        ? sorteiaFrase(FRASES_CANALETA)
        : derrubadosNestaBola >= 5
          ? sorteiaFrase(FRASES_BOM)
          : sorteiaFrase(FRASES_FRACO),
      pontos: 0,
      fecharRodada: false,
    };
  }

  // Segunda bola: fecha a rodada somando o que caiu nas duas
  const completou = derrubadosNaRodada === TOTAL_PINOS;

  return {
    tipo: completou ? "spare" : derrubadosNaRodada >= 5 ? "bom" : "erro",
    frase: completou
      ? sorteiaFrase(FRASES_SPARE)
      : naCanaleta && derrubadosNestaBola === 0
        ? sorteiaFrase(FRASES_CANALETA)
        : derrubadosNaRodada >= 5
          ? sorteiaFrase(FRASES_BOM)
          : sorteiaFrase(FRASES_FRACO),
    pontos: completou ? PONTOS_SPARE : derrubadosNaRodada,
    fecharRodada: true,
  };
}
