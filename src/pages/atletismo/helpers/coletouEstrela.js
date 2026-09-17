// Distância entre o centro do atleta e a estrela é menor que o raio de coleta.
export function coletouEstrela(jogador, estrela) {
  const px = jogador.x + 6 + (jogador.w - 12) / 2;
  const py = jogador.y + 6 + (jogador.h - 10) / 2;
  const dx = px - estrela.x;
  const dy = py - estrela.y;
  return Math.sqrt(dx * dx + dy * dy) < 26;
}