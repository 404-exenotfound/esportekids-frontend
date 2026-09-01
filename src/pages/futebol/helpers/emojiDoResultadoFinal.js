export function emojiDoResultadoFinal(placar) {
  if (placar >= 4) return "🏆";
  if (placar >= 2) return "🥳";
  return "👏";
}
