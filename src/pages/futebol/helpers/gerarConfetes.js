import { CORES_CONFETE, QUANTIDADE_CONFETES } from "../utils/constantes";

// Sorteado uma única vez por gol e guardado em estado. Se o sorteio
// acontecesse durante o render, cada confete mudaria de posição a cada
// re-render da tela.
export function gerarConfetes() {
  return Array.from({ length: QUANTIDADE_CONFETES }, (_, i) => ({
    id: i,
    cor: CORES_CONFETE[i % CORES_CONFETE.length],
    left: Math.random() * 100,
    atraso: Math.random() * 0.3,
    duracao: 1.0 + Math.random() * 0.6,
  }));
}
