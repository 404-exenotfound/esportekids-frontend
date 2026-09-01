import { ZONAS } from "../utils/zonas";
import { chanceDoGoleiroAcertar } from "./chanceDoGoleiroAcertar";

export function escolherZonaGoleiro(rodada, zonaEscolhidaPeloJogador) {
  if (Math.random() < chanceDoGoleiroAcertar(rodada)) {
    return zonaEscolhidaPeloJogador;
  }
  const outras = ZONAS.map((_, i) => i).filter((i) => i !== zonaEscolhidaPeloJogador);
  return outras[Math.floor(Math.random() * outras.length)];
}
