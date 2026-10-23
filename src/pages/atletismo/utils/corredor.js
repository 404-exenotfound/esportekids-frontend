// Personagem IGUAL ao do Basquete Campeão (boné amarelo, cabelo marrom
// com brilho, camisa vermelha com número branco, shorts azul, meia branca
// e tênis preto), desenhado em grade de 12 x 20 células.
// Com a escala inteira de 3 px, ele fica com 36 x 60 px — a altura
// original do personagem, sem deformar os pixels.
export const PALETA_ATLETA = {
  H: "#3b2314", G: "#5c3a21",
  c: "#e0a83a", C: "#ffd34d",
  S: "#f4bf91", s: "#d99568", E: "#1b1b2f",
  R: "#ff6b52", J: "#e8412c", j: "#b02a1b", W: "#fff7e0",
  P: "#2b50d8", p: "#1c36a0", L: "#f2f2f2", B: "#23232e", b: "#c9c9d6",
};

const CABECA = [
  "...HHHHH....",
  "..GHHHHHHH..",
  "..cCCCCCCC..",
  "..HSSSSSSS..",
  "..HSSSSESS..",
  "..sSSSSSSS..",
  "...sSSSs....",
];

const TRONCO = [
  ".jRJJJJJJRj.",
  ".SSJJWWJJSS.",
  ".SSJJWWJJSS.",
  ".SsJJJJJJSs.",
  "..SJJJJJJS..",
];

const SHORTS = [
  "..PPPPPPPP..",
  "..PPPPppPP..",
  "..PPP..PPP..",
];

const PERNAS_EM_PE = [
  "..SSS..SSS..",
  "..SSS..SSS..",
  "..LLL..LLL..",
  ".BBBB..BBBB.",
  ".bbbb..bbbb.",
];

export const SPRITES_ATLETA = {
  parado: [...CABECA, ...TRONCO, ...SHORTS, ...PERNAS_EM_PE],
  triste: [...CABECA, ...TRONCO, ...SHORTS, ...PERNAS_EM_PE],
  corrida0: [
    ...CABECA, ...TRONCO, ...SHORTS,
    "..SSS..SS...",
    "..SSS...SS..",
    "..LLL..BBBB.",
    ".BBBB.......",
    ".bbbb.......",
  ],
  corrida1: [
    ...CABECA, ...TRONCO, ...SHORTS,
    "..SS...SSS..",
    "...SS..SSS..",
    ".BBBB..LLL..",
    ".......BBBB.",
    ".......bbbb.",
  ],
  impulso: [
    ...CABECA, ...TRONCO, ...SHORTS,
    "..SS...SSS..",
    "..SS...SSS..",
    ".BBBB..LLL..",
    ".......BBBB.",
    ".......bbbb.",
  ],
  voo: [
    "S..HHHHH...S",
    "S.GHHHHHHH.S",
    "S.cCCCCCCC.S",
    "S.HSSSSSSS.S",
    "S.HSSSSESS.S",
    "S.sSSSSSSS.S",
    "S..sSSSs...S",
    "SSSRJJJJJSSS",
    ".SSJJWWJJSS.",
    ".SSJJWWJJSS.",
    ".SsJJJJJJSs.",
    "..SJJJJJJS..",
    "..PPPPPPPP..",
    "..PPPPppPP..",
    "..PPP..PPP..",
    "..SSS..SSS..",
    "...SS...SS..",
    "..LL....LL..",
    ".BBBB..BBBB.",
    "............",
  ],
  pouso: [
    ...CABECA, ...TRONCO, ...SHORTS,
    "..SSSSSSS...",
    "..SSSSSSS...",
    "........LLL.",
    ".........BBB",
    "............",
  ],
  comemoracao: [
    "S..HHHHH...S",
    "S.GHHHHHHH.S",
    "S.cCCCCCCC.S",
    "S.HSSSSSSS.S",
    "S.HSSSSESS.S",
    "S.sSSSSSSS.S",
    "S..sSSSs...S",
    ".jRJJJJJJRj.",
    ".SSJJWWJJSS.",
    ".SSJJWWJJSS.",
    ".SsJJJJJJSs.",
    "..SJJJJJJS..",
    "..PPPPPPPP..",
    "..PPPPppPP..",
    "..PPP..PPP..",
    ...PERNAS_EM_PE,
  ],
};

// Compatibilidade: paleta antiga do corredor (não usada pelo novo desenho)
export const CORES_CORREDOR = {
  contorno: "#241A33", cabelo: "#4A2C17", cabeloClaro: "#6B4426",
  pele: "#FFCDA0", peleSombra: "#F0B080", faixa: "#E63946",
  regata: "#1D3557", regataClara: "#2E4E82", numero: "#FFFFFF",
  calcao: "#E63946", calcaoEscuro: "#B22234", meia: "#FFFFFF",
  chuteira: "#111111", cravo: "#C0C0C0", munhequeira: "#FFC93C",
};
