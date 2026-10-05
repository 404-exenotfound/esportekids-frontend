// ============================================================================
// PERSONAGEM — sprite pixel-art do "prodígio do ping-pong"
// ----------------------------------------------------------------------------
// Define as paletas de cores do jogador (vermelho) e do adversário (azul) e a
// matriz do desenho. As duas pencas de letras à direita da imagm representam a
// raquete que o personagem segura na mão.
// ============================================================================

// Paleta do JOGADOR (vermelho): cada letra vira uma cor no sprite.
export const CORES_JOGADOR = {
  O: "#1f1f1f", // contorno escuro
  H: "#3b2417", // cabelo castanho
  S: "#f8b878", // pele clara
  P: "#e0a15f", // pele sombreada
  J: "#e63946", // camiseta vermelha
  G: "#ff7d7d", // detalhe claro da camiseta
  W: "#ffffff", // branco
  Q: "#8f1d2c", // calça / sombra da camiseta
  F: "#2b2b2b", // tênis escuro
  R: "#d62828", // raquete vermelha
  Y: "#ffd166", // detalhe amarelo da raquete
  T: "#a5713a", // cabo de madeira da raquete
};

// Paleta do ADVERSÁRIO (azul): mesma estrutura, só troca as cores da roupa.
export const CORES_INIMIGO = {
  O: "#1f1f1f",
  H: "#2b3a5c", // cabelo azul-escuro
  S: "#f8b878", // pele clara
  P: "#e0a15f", // pele sombreada
  J: "#2563eb", // camiseta azul
  G: "#60a5fa", // detalhe claro da camiseta
  W: "#ffffff",
  Q: "#1e3a8a", // calça / sombra da camiseta
  F: "#2b2b2b", // tênis escuro
  R: "#0f7ac0", // raquete azul
  Y: "#a5e3ff", // detalhe claro da raquete
  T: "#a5713a", // cabo de madeira da raquete
};

// Matriz pixel-art do personagem (24 linhas x 13 colunas).
// Da linha 0 (topo da cabeça) até a linha 23 (tênis).
// As últimas colunas (índices 10 a 12) desenham a raquete na mão.
export const PERSONAGEM_MATRIZ = [
  [".", ".", "H", "H", "H", "H", "H", ".", ".", ".", ".", ".", "."],
  [".", "H", "H", "H", "H", "H", "H", "H", ".", ".", ".", ".", "."],
  [".", "H", "H", "H", "H", "H", "H", "H", ".", ".", ".", ".", "."],
  [".", "O", "S", "S", "S", "S", "S", "O", ".", ".", ".", ".", "."],
  [".", "O", "S", "S", "O", "S", "S", "O", ".", ".", ".", ".", "."],
  [".", "O", "S", "S", "P", "P", "S", "O", ".", ".", ".", ".", "."],
  [".", "O", "S", "S", "S", "S", "S", "O", ".", ".", ".", ".", "."],
  [".", ".", "O", "S", "S", "S", "O", ".", ".", ".", ".", ".", "."],
  [".", ".", "O", "J", "J", "J", "J", "O", ".", ".", ".", ".", "."],
  [".", ".", ".", "J", "J", "J", "J", "J", ".", ".", "O", "O", "."],
  [".", "J", "J", "J", "J", "J", "G", "O", "O", "O", "O", "O", "."],
  [".", "J", "J", "J", "J", "J", "G", "S", "O", "R", "R", "R", "O"],
  [".", "J", "W", "W", "J", "J", "J", "S", "O", "R", "Y", "R", "O"],
  [".", "J", "J", "J", "J", "J", "J", "S", "O", "R", "W", "R", "O"],
  [".", "J", "J", "J", "J", "J", "J", "S", "O", "R", "R", "R", "O"],
  [".", "J", "J", "J", "J", "J", "J", "S", "O", "R", "R", "R", "O"],
  [".", "Q", "Q", "Q", "Q", "Q", "Q", "Q", "O", "R", "R", "R", "O"],
  [".", "Q", "Q", "Q", "Q", "Q", "Q", "S", "S", "O", "R", "O", "O"],
  [".", "Q", "Q", "Q", "Q", "Q", "Q", "S", "S", "O", "O", "O", "."],
  [".", "Q", "Q", "Q", "Q", "Q", "Q", "S", "S", "O", "O", ".", "."],
  [".", ".", "S", "S", ".", "S", "S", ".", "S", "T", "T", ".", "."],
  [".", ".", "W", "W", ".", "W", "W", ".", ".", "T", "T", ".", "."],
  [".", "F", "F", "F", ".", "F", "F", "F", ".", ".", "T", ".", "."],
  [".", "F", "F", "F", ".", "F", "F", "F", ".", ".", ".", ".", "."],
];