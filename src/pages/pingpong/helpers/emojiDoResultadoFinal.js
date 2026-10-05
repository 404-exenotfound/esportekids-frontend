// ============================================================================
// emojiDoResultadoFinal — emoji grande da tela final
// ----------------------------------------------------------------------------
// Escolhe um emoji de celebração de acordo com o desempenho do jogador:
// troféu para ótimos, festa para bons e palminha para quem tentou.
// ============================================================================

export function emojiDoResultadoFinal(pontos) {
  if (pontos >= 8) return "🏆"; // ótimo desempenho
  if (pontos >= 5) return "🥳"; // bom desempenho
  return "👏"; // deu o melhor de si
}