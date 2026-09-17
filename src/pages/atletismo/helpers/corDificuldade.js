export function corDificuldade(displaySpeed) {
  if (displaySpeed < 1.75) return "#06D6A0";
  if (displaySpeed < 2.5) return "#FFC93C";
  return "#EF476F";
}