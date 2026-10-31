import { PIXEL } from "../utils/constantes";
import { rect } from "./rect";

export function desenharSol(ctx, cx, cy) {
  const c = "#FFE066";
  const p = PIXEL * 2;
  rect(ctx, cx - p, cy - p * 2, p * 2, p * 4, c);
  rect(ctx, cx - p * 2, cy - p, p * 4, p * 2, c);
}