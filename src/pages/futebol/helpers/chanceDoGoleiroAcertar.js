export function chanceDoGoleiroAcertar(rodada) {
  return Math.min(0.15 + (rodada - 1) * 0.13, 0.68);
}
