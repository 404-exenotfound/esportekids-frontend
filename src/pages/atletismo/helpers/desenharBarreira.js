import { GROUND_Y, PIXEL } from "../utils/constantes";
import { rect } from "./rect";

export function desenharBarreira(ctx, x, y, w, h) {
  rect(ctx, x, y, w, h, "#E63946");
  rect(ctx, x - 4, y, w + 8, PIXEL, "#FFFFFF");
  rect(ctx, x + w / 2 - 3, y + PIXEL, 6, h - PIXEL, "#B22234");
  rect(ctx, x - 6, GROUND_Y - PIXEL, w + 12, PIXEL, "#4A4A4A");
}