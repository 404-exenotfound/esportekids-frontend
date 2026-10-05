export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 400;
export const PIXEL = 4; // unidade base do pixel art
export const GROUND_Y = GAME_HEIGHT - 88;
export const PLAYER_X = 110;
export const PLAYER_W = 40; // 10 blocos
export const PLAYER_H = 60; // 15 blocos
export const GRAVITY = 0.95;
export const JUMP_VELOCITY = -16.5;
export const MAX_HEARTS = 3;
export const STARS_TO_WIN = 5;

// Fases do jogo, na ordem em que acontecem
export const FASES = {
  START: "start",
  PLAYING: "playing",
  GAMEOVER: "gameover",
  WIN: "win",
};

// Velocidade da corrida: começa devagar e sobe com o tempo.
// Ajustada para crianças de 7 a 10 anos: teto mais baixo e subida mais lenta.
export const VELOCIDADE_INICIAL = 3.5;
export const VELOCIDADE_MAXIMA = 9;
export const TEMPO_POR_UNIDADE_DE_VELOCIDADE = 4200; // ms até ganhar +1 de velocidade

// Tempo (ms) de invencibilidade após bater numa barreira
export const TEMPO_INVENCIVEL = 1200;

// Estratégia dos obstáculos
export const INTERVALO_OBSTACULO_BASE = 900;
export const INTERVALO_OBSTACULO_EXTRA = 1100;
export const INTERVALO_OBSTACULO_MINIMO = 480;

// Estratégia das estrelas
export const INTERVALO_ESTRELA_BASE = 1600;
export const INTERVALO_ESTRELA_EXTRA = 1200;

// Alturas fixas do cenário (céu termina onde a parede da arena começa)
export const SKY_HEIGHT = 130;

export const CORES_CONFETE = ["#FFC93C", "#06D6A0", "#4CC9F0", "#EF476F", "#FFFFFF"];