// A dificuldade escolhida nas Opções define o ponto de partida e o teto do
// goleiro; as rodadas continuam apertando a partir daí.
const BASE = { facil: 0.05, media: 0.15, dificil: 0.28 };
const TETO = { facil: 0.5, media: 0.68, dificil: 0.82 };

export function chanceDoGoleiroAcertar(rodada, dificuldade = "media") {
  const base = BASE[dificuldade] ?? BASE.media;
  const teto = TETO[dificuldade] ?? TETO.media;
  return Math.min(base + (rodada - 1) * 0.13, teto);
}
