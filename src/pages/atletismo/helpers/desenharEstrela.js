import { PIXEL } from "../utils/constantes";
import { rect } from "./rect";

export function desenharEstrela(ctx, cx, cy) {
  const c = "#FFD166";
  const o = "#F4A100";
  const p = PIXEL;
  // formato de estrela em blocos (estilo 8-bit)
  rect(ctx, cx - p, cy - p * 2, p * 2, p, o);
  rect(ctx, cx - p * 3, cy - p, p * 6, p, c);
  rect(ctx, cx - p * 2, cy, p * 4, p, c);
  rect(ctx, cx - p * 3, cy + p, p * 2, p, c);
  rect(ctx, cx + p, cy + p, p * 2, p, c);
}