// ============================================================================
// CONSTANTES DO MINIGAME PING-PONG
// ----------------------------------------------------------------------------
// Aqui ficam todos os "números mágicos" do jogo: tamanho da tela, dimensões
// das raquetes e da bola, limites das paredes, velocidades e o texto exibido
// no rodapé. Ter tudo em um lugar só facilita ajustar a dificuldade e o
// visual sem precisar caçar valores espalhados pelo código.
// ============================================================================

// --- Tela e pixel art -------------------------------------------------------
export const GAME_WIDTH = 800; // largura do canvas em pixels
export const GAME_HEIGHT = 400; // altura do canvas em pixels
export const PIXEL = 4; // tamanho de cada "bloco" do desenho pixelado

// --- Regras da partida ------------------------------------------------------
export const TOTAL_TENTATIVAS = 11; // número de bolas (tentativas) por partida

// --- Fases (estados) do jogo ------------------------------------------------
export const FASES = {
  INTRO: "intro", // tela inicial com o botão COMEÇAR
  SERVINDO: "servindo", // contagem regressiva antes do saque
  JOGANDO: "jogando", // bola em movimento, jogador rebatendo
  PONTO: "ponto", // mostrando banner de ponto marcado
  ERRO: "erro", // mostrando banner de erro
  FIM_DE_JOGO: "fimDeJogo", // tela final com o placar
};

// --- Jogadores e raquetes ---------------------------------------------------
export const PLAYER_X = 48; // posição X do jogador (esquerda)
export const IA_X = GAME_WIDTH - 48; // posição X do adversário (direita)
export const RAQUETE_W = 30; // largura da raquete (colisão)
export const RAQUETE_H = 50; // altura da raquete (colisão)

// --- Bola -------------------------------------------------------------------
export const BOLA_TAMANHO = 12; // tamanho usado nas colisões da bola

// --- Limites da área de jogo ------------------------------------------------
export const PAREDE_TOPO = 30; // limite superior onde a bola quica
export const PAREDE_BAIXO = GAME_HEIGHT - 30; // limite inferior onde a bola quica
export const LIMITE_ESQUERDA = 6; // bola saiu pela esquerda (erro do jogador)
export const LIMITE_DIREITA = GAME_WIDTH - 6; // bola saiu pela direita (ponto)

// --- Tempos (em milissegundos) ----------------------------------------------
export const TEMPO_SAQUE = 1200; // duração da contagem regressiva do saque
export const TEMPO_RESULTADO = 1250; // duração do banner de ponto/erro

// --- Velocidades do jogador (teclado) ---------------------------------------
export const VELOCIDADE_JOGADOR_TECLADO = 300; // px/s ao usar setas ou W/S

// --- Velocidade da bola -----------------------------------------------------
export const VELOCIDADE_BOLA_BASE = 230; // velocidade inicial da bola
export const VELOCIDADE_BOLA_POR_PONTO = 16; // quanto ganha a cada ponto
export const VELOCIDADE_BOLA_MAXIMA = 370; // teto de velocidade da bola
export const VELOCIDADE_SAQUE = 260; // velocidade do saque do adversário

// --- Velocidade do inimigo (IA) ---------------------------------------------
export const VELOCIDADE_IA_BASE = 62; // velocidade inicial da IA
export const VELOCIDADE_IA_POR_PONTO = 12; // quanto ganha a cada ponto
export const VELOCIDADE_IA_MAXIMA = 85; // teto de velocidade da IA

// --- Erro de mira da IA -----------------------------------------------------
export const ERRO_IA_INICIAL = 62; // "tremor" inicial ao mirar a bola
export const ERRO_IA_POR_PONTO = 5; // a IA fica mais precisa a cada ponto
export const ERRO_IA_MINIMO = 26; // menor tremor possível (nunca mira perfeito)

// --- Limites de movimento das raquetes (eixo Y) -----------------------------
export const LIMITE_RAQUETE_TOPO = 40; // posição Y mínima da raquete
export const LIMITE_RAQUETE_BAIXO = GAME_HEIGHT - 40; // posição Y máxima

// --- Cores dos confetes -----------------------------------------------------
export const CORES_CONFETE = ["#e63946", "#ffd166", "#60a5fa", "#ffffff", "#06d6a0"];

// --- Mensagens do rodapé por fase -------------------------------------------
export const MENSAGENS_RODAPE = {
  [FASES.INTRO]: "PING-PONG CAMPEÃO",
  [FASES.SERVINDO]: "Se prepara que a bola vem...",
  [FASES.JOGANDO]: "Rebata com a raquete e faça a bola passar pelo adversário!",
  [FASES.PONTO]: "Muito bem, continua!",
  [FASES.ERRO]: "Não desanima, a próxima é sua!",
  [FASES.FIM_DE_JOGO]: " ",
};