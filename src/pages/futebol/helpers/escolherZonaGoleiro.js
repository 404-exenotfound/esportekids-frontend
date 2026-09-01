import { ZONAS } from "../utils/zonas";
import { chanceDoGoleiroAcertar } from "./chanceDoGoleiroAcertar";

export function escolherZonaGoleiro(rodada, zonaEscolhidaPeloJogador, dificuldade) {
  if (Math.random() < chanceDoGoleiroAcertar(rodada, dificuldade)) {
    return zonaEscolhidaPeloJogador;
  }
  const outras = ZONAS.map((_, i) => i).filter((i) => i !== zonaEscolhidaPeloJogador);
  return outras[Math.floor(Math.random() * outras.length)];
}
