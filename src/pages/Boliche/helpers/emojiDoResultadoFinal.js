// ============================================================================
// emojiDoResultadoFinal — carinha/troféu que aparece na tela de fim de jogo
// ============================================================================

export function emojiDoResultadoFinal(estrelas) {
  if (estrelas >= 3) return "🏆";
  if (estrelas === 2) return "🎳";
  if (estrelas === 1) return "🙂";
  return "😅";
}
