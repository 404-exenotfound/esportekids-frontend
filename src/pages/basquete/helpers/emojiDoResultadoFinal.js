export function emojiDoResultadoFinal(cestas) {
  if (cestas >= 8) return "🏆";
  if (cestas >= 5) return "🥳";
  if (cestas >= 2) return "🙌";
  return "👏";
}