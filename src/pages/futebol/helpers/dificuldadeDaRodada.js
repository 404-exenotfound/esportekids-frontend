// A dificuldade escolhida nas Opções desloca a curva: no FÁCIL o jogo demora
// mais para apertar, no DIFÍCIL já começa apertado.
const DESLOCAMENTO = { facil: -2, media: 0, dificil: 2 };

// Rótulo e classe CSS do nível caminham juntos: manter os dois aqui evita
// que a tela precise traduzir um no outro.
export function dificuldadeDaRodada(rodada, dificuldade = "media") {
  const nivel = rodada + (DESLOCAMENTO[dificuldade] ?? 0);

  if (nivel <= 2) return { rotulo: "FÁCIL", classe: "" };
  if (nivel <= 4) return { rotulo: "MÉDIO", classe: "media" };
  return { rotulo: "DIFÍCIL", classe: "dificil" };
}
