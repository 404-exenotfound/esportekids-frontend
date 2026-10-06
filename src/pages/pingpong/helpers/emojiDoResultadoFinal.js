// ============================================================================
// emojiDoResultadoFinal — emoji grande da tela final
// ----------------------------------------------------------------------------
// Troféu para ótimos, festa para bons e palminha para quem tentou.
// ============================================================================

export function emojiDoResultadoFinal(pontos) {
  if (pontos >= 4) return "🏆"; // ótimo desempenho
  if (pontos >= 2) return "🥳"; // bom desempenho
  return "👏"; // deu o melhor de si
}