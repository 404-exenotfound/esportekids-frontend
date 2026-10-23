export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 400;
export const PIXEL = 4; // unidade base do pixel art
export const TOPO_PISTA = GAME_HEIGHT - 88; // topo da pista (onde ela começa)
export const GROUND_Y = GAME_HEIGHT - 56; // linha dos pés: linha pontilhada, centro da pista
export const PLAYER_W = 36; // sprite basquete: 12 células x 3px
export const PLAYER_H = 60; // 15 blocos x 4px (altura original)
export const TOTAL_FASES = 5;

// Fases do jogo (tela), na ordem em que acontecem — NÃO alterar:
// o sistema educacional (dicas/quiz/FimEducativo) depende destes estados.
export const FASES = {
  START: "start",
  PLAYING: "playing",
  GAMEOVER: "gameover",
  WIN: "win",
};

// ---------- SALTO EM DISTÂNCIA (mundo 2D, vista lateral) ----------
// A caixa de areia é medida de 0 a 10 metros, como no esporte de verdade.
export const DISTANCIA_MAXIMA_METROS = 10;
export const PIXEL_POR_METRO = 44;

export const ATLETA_INICIO_X = 90;
export const LINHA_DE_FALTA_X = 980; // borda final da tábua (linha de impulsão)
export const TABUA_LARGURA = 84; // tábua branca de impulsão
export const TABUA_INICIO_X = LINHA_DE_FALTA_X - TABUA_LARGURA;
export const CAIXA_INICIO_X = LINHA_DE_FALTA_X + 18;
export const CAIXA_FIM_X = CAIXA_INICIO_X + DISTANCIA_MAXIMA_METROS * PIXEL_POR_METRO + 24;
export const MUNDO_FIM_X = CAIXA_FIM_X + 120;

// A partir desta distância da linha, o próximo toque já é o SALTO
// (antes disso, tocar = correr mais rápido).
export const ZONA_DE_SALTO_PX = 132;

// Física do voo (px/s)
export const GRAVIDADE_VOO = 640;

// Corrida: tocar no ritmo enche a POTÊNCIA; ela cai devagar sozinha.
// Pensado para 7–10 anos: precisa de ritmo e atenção, mas perdoa erros.
export const POTENCIA_INICIAL = 28;
export const POTENCIA_POR_TOQUE = 8;
export const POTENCIA_QUEDA_POR_SEGUNDO = 9;

// As 5 fases: a meta sobe, a corrida acelera e a zona perfeita diminui.
// Na fase 4 e 5 entra o vento (mostrado antes de correr).
export const FASES_SALTO = [
  { fase: 1, meta: 3.0, zonaPerfeita: 56, velocidadeBase: 132, temVento: false, nome: "PRIMEIRO SALTO" },
  { fase: 2, meta: 4.0, zonaPerfeita: 50, velocidadeBase: 146, temVento: false, nome: "AQUECENDO" },
  { fase: 3, meta: 4.9, zonaPerfeita: 44, velocidadeBase: 160, temVento: false, nome: "VOANDO LONGE" },
  { fase: 4, meta: 5.7, zonaPerfeita: 38, velocidadeBase: 174, temVento: true, nome: "VENTO NO ESTÁDIO" },
  { fase: 5, meta: 6.6, zonaPerfeita: 32, velocidadeBase: 188, temVento: true, nome: "GRANDE FINAL" },
];

// Alturas fixas do cenário (céu termina onde a arquibancada começa)
export const SKY_HEIGHT = 118;

export const CORES_CONFETE = ["#FFC93C", "#06D6A0", "#4CC9F0", "#EF476F", "#FFFFFF"];

// Compatibilidade com helpers antigos de exibição
export const GRAVITY = 0.95;
export const PLAYER_X = ATLETA_INICIO_X;
