// ============================================================================
// nivelDoMomento — nível de dificuldade atual
// ----------------------------------------------------------------------------
// Converte a quantidade de pontos em um nível com rótulo e classe CSS.
// A classe é usada no painel do placar para colorir o texto do nível.
// ============================================================================

export function nivelDoMomento(pontos) {
  if (pontos <= 3) return { rotulo: "FÁCIL", classe: "" };
  if (pontos <= 7) return { rotulo: "MÉDIO", classe: "media" };
  return { rotulo: "DIFÍCIL", classe: "dificil" };
}