// Rótulo e classe CSS do nível caminham juntos: manter os dois aqui evita
// que a tela precise traduzir um no outro.
export function dificuldadeDaRodada(rodada) {
  if (rodada <= 2) return { rotulo: "FÁCIL", classe: "" };
  if (rodada <= 4) return { rotulo: "MÉDIO", classe: "media" };
  return { rotulo: "DIFÍCIL", classe: "dificil" };
}
