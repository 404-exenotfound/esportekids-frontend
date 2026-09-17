export const TOTAL_RODADAS = 10;

// Fases do jogo, na ordem em que acontecem
export const FASES = {
  INTRO: "intro",
  PRONTO: "pronto",
  ARREMESSANDO: "arremessando",
  RESULTADO: "resultado",
  FIM_DE_JOGO: "fimDeJogo",
};

// Centro da "boca" da cesta, em % da quadra — é para onde o jogador mira.
export const ARO = { x: 70, y: 24 };

// Posição de repouso da bola, próxima às mãos do atleta (em % da quadra).
export const BOLA_INICIAL = { x: 41, y: 84, escala: 1 };

// Precisão: raio (px) do alvo de mira. Começa grande (fácil para a criançada)
// e encolhe a cada cesta convertida.
export const RAIO_PRECISAO_INICIAL = 24;
export const RAIO_PRECISAO_MINIMO = 12;
export const REDUCAO_RAIO_POR_CESTA = 1.5;

// Tempo (ms) até revelar o resultado e até liberar o próximo arremesso
export const TEMPO_ATE_RESULTADO = 700;
export const TEMPO_ATE_PROXIMA_RODADA = 2300;

// A cada cesta convertida a cesta muda de lugar: ela "teleporta" para uma
// nova posição fixa (sem se mexer por conta própria). Só na última rodada
// ela de fato anda de um lado para o outro.
export const CESTA_MOVEL = {
  MIN_X: 18,
  MAX_X: 82,
  MIN_Y: 18,
  MAX_Y: 34,
};

// Na última rodada a cesta ganha vida: ela anda de um lado para o outro e o
// jogador precisa acertar no momento certo.
export const CESTA_ANDANTE = {
  MIN_X: 18,
  MAX_X: 82,
  VELOCIDADE: 10, // % da largura da quadra por segundo
};
export const MENSAGEM_CESTA_ANDANDO =
  "A cesta está andando! Clique nela no momento certo!";

export const QUANTIDADE_CONFETES = 24;
export const CORES_CONFETE = ["#e63946", "#ffd166", "#f5f5dc", "#ffffff", "#1f1f1f"];

export const MENSAGENS_RODAPE = {
  [FASES.PRONTO]: "Clique na bolinha amarela dentro da cesta para arremessar!",
  [FASES.ARREMESSANDO]: "Arremessandooo...",
  [FASES.RESULTADO]: " ",
};