import { PIXEL_FONT } from "../utils/letras";
import { rect } from "./rect";

export function desenharTextoPixel(ctx, text, centerX, y, scale, color) {
  const letterW = 5 * scale + scale; // 5 colunas + 1 de espaço
  const totalW = letterW * text.length - scale;
  let x = centerX - totalW / 2;
  for (const ch of text) {
    const glyph = PIXEL_FONT[ch];
    if (glyph) {
      for (let row = 0; row < glyph.length; row++) {
        for (let col = 0; col < glyph[row].length; col++) {
          if (glyph[row][col] === "#") {
            rect(ctx, x + col * scale, y + row * scale, scale, scale, color);
          }
        }
      }
    }
    x += letterW;
  }
}