import { ZONAS } from "../utils/zonas";
import { GOLEIRO_CHAO } from "../utils/goleiroChao";

// Fora da jogada o goleiro fica parado no chão; durante a jogada ele ocupa a
// zona sorteada, e o lado do mergulho sai da posição horizontal dessa zona.
export function posicaoDoGoleiro(indiceZona, emAcao) {
  const zona = emAcao ? ZONAS[indiceZona] : GOLEIRO_CHAO;
  const direcao =
    !emAcao || zona.x === 50 ? "centro" : zona.x < 50 ? "esq" : "dir";
  return { zona, direcao };
}
