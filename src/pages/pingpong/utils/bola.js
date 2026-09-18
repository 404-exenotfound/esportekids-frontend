// ============================================================================
// BOLA — desenho pixel-art da bolinha
// ----------------------------------------------------------------------------
// Define as cores (CORES_BOLA) e a "matriz" (BOLA_MATRIZ) que formam o desenho
// da bola. Cada letra na matriz representa uma cor; o desenho é feito em uma
// grade de 4 linhas por 4 colunas de blocos.
// ============================================================================

// Paleta de cores usada no desenho da bola:
// H = branco puro (brilho principal) | W = branco suave (sombra do brilho)
// G = cinza claro (parte de baixo)   | O = laranja (centro da bolinha)
export const CORES_BOLA = {
  H: "#ffffff",
  W: "#f7f7f7",
  G: "#d0d6dd",
  O: "#ff9f1c",
};

// Matriz pixel-art da bola (3 linhas x 4 colunas).
// O "." representa espaço vazio (não desenhado).
export const BOLA_MATRIZ = [
  [".", "W", "W", "."],
  [".", "H", "W", "W"],
  [".", "O", "G", "W"],
];