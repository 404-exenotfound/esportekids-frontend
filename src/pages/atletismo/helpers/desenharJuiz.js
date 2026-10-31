import { PIXEL } from "../utils/constantes";
import { rect } from "./rect";

// Juiz ao lado da tábua: levanta a bandeira BRANCA (salto válido)
// ou VERMELHA (falta) depois do pouso. Sem bandeira = observando.
export function desenharJuiz(ctx, x, chaoY, bandeira, tempo) {
  const b = (col, row, w, h, color) =>
    rect(ctx, x + col * PIXEL, chaoY + row * PIXEL, w * PIXEL, h * PIXEL, color);

  // Pernas / sapato
  b(1, -3, 2, 3, "#1F1F1F");
  b(4, -3, 2, 3, "#1F1F1F");
  b(0, 0, 3, 1, "#111111");
  b(4, 0, 3, 1, "#111111");
  // Camisa listrada de juiz + apito
  b(1, -8, 5, 5, "#FFFFFF");
  b(2, -8, 1, 5, "#1F1F1F");
  b(4, -8, 1, 5, "#1F1F1F");
  b(3, -5, 1, 1, "#FFC93C");
  // Cabeça + boné
  b(2, -11, 3, 3, "#FFCDA0");
  b(1, -12, 5, 1, "#E63946");
  b(1, -11, 5, 1, "#E63946");

  // Braço + bandeira
  if (bandeira) {
    const onda = Math.sin(tempo / 120) * 2;
    b(6, -9, 1, 3, "#FFCDA0"); // braço levantado
    rect(ctx, x + 7 * PIXEL, chaoY - 14 * PIXEL + onda, 3, 26, "#8B5A2B"); // mastro
    rect(
      ctx,
      x + 7 * PIXEL + 3,
      chaoY - 14 * PIXEL + onda,
      22,
      15,
      bandeira === "vermelha" ? "#E63946" : "#FFFFFF"
    );
    if (bandeira === "branca") {
      rect(ctx, x + 7 * PIXEL + 3, chaoY - 14 * PIXEL + onda, 22, 3, "#06D6A0");
    }
  } else {
    b(6, -7, 1, 3, "#FFCDA0"); // braço abaixado, segurando as bandeiras
    rect(ctx, x + 7 * PIXEL, chaoY - 5 * PIXEL, 10, 7, "#E63946");
    rect(ctx, x + 7 * PIXEL, chaoY - 3 * PIXEL, 10, 6, "#FFFFFF");
  }
}
