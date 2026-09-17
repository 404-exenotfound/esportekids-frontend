export function rotuloDificuldade(displaySpeed) {
  if (displaySpeed < 1.75) return "FÁCIL";
  if (displaySpeed < 2.5) return "MÉDIO";
  return "DIFÍCIL";
}