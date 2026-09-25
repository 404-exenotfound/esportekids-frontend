// ============================================================================
// Constantes do BOLICHE
// ----------------------------------------------------------------------------
// Todas as medidas do canvas, da pista, dos pinos e as regras da partida ficam
// concentradas aqui. Nenhum número "solto" no resto do jogo.
// ============================================================================

// --- Canvas ------------------------------------------------------------------
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 420;
export const PIXEL = 4; // unidade base do pixel art

// --- Pista (vista de cima: a bola vai da esquerda para a direita) ------------
export const PISTA_TOPO = 74; // borda interna de cima
export const PISTA_BASE = 346; // borda interna de baixo
export const CANALETA = 26; // espessura de cada canaleta
export const LINHA_LANCAMENTO = 92; // x onde a bola nasce
export const FUNDO_X = 762; // parede do fundo (fim do deck de pinos)

// --- Bola e pinos ------------------------------------------------------------
export const BOLA_RAIO = 15;
export const PINO_RAIO = 9;
export const BOLA_MASSA = 6; // bem mais pesada que o pino
export const PINO_MASSA = 1;
export const RESTITUICAO = 0.92; // "elasticidade" das batidas

// Triângulo de 10 pinos, deitado na horizontal (1, 2, 3 e 4 pinos por coluna)
export const PINO_COLUNA_X = 598; // x do primeiro pino (o da frente)
export const PINO_ESPACO_X = 36; // distância entre colunas
export const PINO_ESPACO_Y = 34; // distância entre pinos da mesma coluna

// --- Física ------------------------------------------------------------------
export const ATRITO_BOLA = 0.997;
export const ATRITO_PINO = 0.93;
export const VELOCIDADE_MINIMA = 0.9; // acima disso o pino cai
export const PARADO = 0.35; // abaixo disso consideramos tudo parado
export const TEMPO_MAXIMO_ROLANDO = 6000; // ms de segurança para encerrar a bola

// --- Controles (mira e força) ------------------------------------------------
export const MIRA_VELOCIDADE = 2.6; // px por frame
export const MIRA_MARGEM = 14; // o quanto a mira passa da pista (dá pra errar!)
export const FORCA_VELOCIDADE = 0.021; // por frame
export const FORCA_MINIMA = 0.28;
export const VELOCIDADE_BASE = 7.5;
export const VELOCIDADE_EXTRA = 7.5; // força cheia = BASE + EXTRA

// --- Regras da partida -------------------------------------------------------
export const TOTAL_PINOS = 10;
export const TOTAL_RODADAS = 5; // partida curta, pensada para crianças
export const BOLAS_POR_RODADA = 2;
export const PONTOS_STRIKE = 20; // derrubou os 10 na primeira bola
export const PONTOS_SPARE = 15; // completou os 10 na segunda bola
export const TEMPO_BANNER = 1500; // ms que o resultado da jogada fica na tela

// --- Fases do jogo -----------------------------------------------------------
export const FASES = {
  START: "start",
  JOGANDO: "jogando",
  FIM: "fim",
};

// Etapas de uma jogada (dentro da fase JOGANDO)
export const ETAPAS = {
  MIRA: "mira",
  FORCA: "forca",
  ROLANDO: "rolando",
  RESULTADO: "resultado",
};

// --- Paleta (mesma linguagem visual dos outros minigames) --------------------
export const CORES = {
  madeira: "#c8873c",
  madeiraClara: "#e0a75c",
  madeiraEscura: "#a86a29",
  canaleta: "#2b2b3d",
  canaletaBorda: "#15151f",
  fundo: "#1b1b2a",
  parede: "#2e3ea8",
  bola: "#e63946",
  bolaEscura: "#8f1d2c",
  bolaBrilho: "#ff8f99",
  pino: "#ffffff",
  pinoSombra: "#c9c9c9",
  pinoFaixa: "#e63946",
  preto: "#1f1f1f",
  amarelo: "#ffd166",
  branco: "#ffffff",
};

export const CORES_CONFETE = ["#FFC93C", "#06D6A0", "#4CC9F0", "#EF476F", "#FFFFFF"];
