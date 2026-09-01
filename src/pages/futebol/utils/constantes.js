export const TOTAL_RODADAS = 5;

// Fases do jogo, na ordem em que acontecem
export const FASES = {
  INTRO: "intro",
  PRONTO: "pronto",
  CHUTANDO: "chutando",
  RESULTADO: "resultado",
  FIM_DE_JOGO: "fimDeJogo",
};

// Posição de repouso da bola, na marca do pênalti
export const BOLA_INICIAL = { x: 50, y: 90, escala: 1 };

// Tempo (ms) até revelar o resultado e até liberar a próxima rodada
export const TEMPO_ATE_RESULTADO = 680;
export const TEMPO_ATE_PROXIMA_RODADA = 2380;

export const QUANTIDADE_CONFETES = 24;
export const CORES_CONFETE = ["#e63946", "#ffd166", "#f5f5dc", "#ffffff", "#1f1f1f"];

export const MENSAGENS_RODAPE = {
  [FASES.PRONTO]: "Toque em uma bolinha dentro do gol para chutar!",
  [FASES.CHUTANDO]: "Chutandooo...",
  [FASES.RESULTADO]: " ",
};
