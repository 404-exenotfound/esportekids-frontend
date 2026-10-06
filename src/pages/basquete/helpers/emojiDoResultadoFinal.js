export function emojiDoResultadoFinal(cestas) {
  if (cestas >= 4) return "🏆";
  if (cestas >= 2) return "🥳";
  if (cestas >= 1) return "🙌";
  return "👏";
}