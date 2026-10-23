// Personagem no MESMO padrão visual do Basquete Campeão:
// paleta com 3 tons por material (sombra/base/brilho), boné amarelo,
// camisa vermelha com número branco, shorts azul, meia branca e tênis preto.
// O corpo (cabeça + tronco + shorts) é esta matriz 12x17; braços e pernas
// são desenhados por pose em desenharCorredor.js, como no basquete.
export const PALETA_ATLETA = {
  H: "#3b2314", G: "#5c3a21",
  c: "#e0a83a", C: "#ffd34d",
  S: "#f4bf91", s: "#d99568", E: "#1b1b2f",
  R: "#ff6b52", J: "#e8412c", j: "#b02a1b", W: "#fff7e0",
  P: "#2b50d8", p: "#1c36a0", L: "#f2f2f2", B: "#23232e", b: "#c9c9d6",
};

export const SPRITE_CORPO = [
  "...HHHHH....",
  "..GHHHHHHH..",
  "..cCCCCCCC..",
  "..HSSSSSSS..",
  "..HSSSSESS..",
  "..sSSSSSSS..",
  "...sSSSSSs..",
  ".....ss.....",
  "..RJJJJJJJ..",
  "..JJJWWWJJ..",
  "..JJJJJWJJ..",
  "..JJJJWJJj..",
  "..jJJJWJJj..",
  "..jJJJJJJj..",
  "..PPPPPPPP..",
  "..PPPPPPPP..",
  "..PPPppPPP..",
];

// Compatibilidade: paleta antiga (não usada pelo novo desenho)
export const CORES_CORREDOR = {
  contorno: "#241A33", cabelo: "#3b2314", cabeloClaro: "#5c3a21",
  pele: "#f4bf91", peleSombra: "#d99568", faixa: "#e8412c",
  regata: "#e8412c", regataClara: "#ff6b52", numero: "#fff7e0",
  calcao: "#2b50d8", calcaoEscuro: "#1c36a0", meia: "#f2f2f2",
  chuteira: "#23232e", cravo: "#c9c9d6", munhequeira: "#ffd34d",
};
