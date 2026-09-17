import { PIXEL } from "../utils/constantes";
import { rect } from "./rect";

export function desenharNuvem(ctx, x, y) {
  const c = "#FFFFFF";
  const p = PIXEL;
  rect(ctx, x, y, p * 6, p * 2, c);
  rect(ctx, x + p * 2, y - p, p * 6, p * 2, c);
  rect(ctx, x + p * 6, y, p * 4, p * 2, c);
}