export function calcularEstrelas(placar) {
  if (placar >= 4) return 3;
  if (placar >= 2) return 2;
  if (placar >= 1) return 1;
  return 0;
}
