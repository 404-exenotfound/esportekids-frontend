import { GAME_WIDTH, PIXEL } from "../utils/constantes";

export function gerarObstaculo() {
  const h = 32 + Math.round(Math.random() * 4) * PIXEL;
  const w = 18 + Math.round(Math.random() * 2) * PIXEL;
  return { x: GAME_WIDTH + 20, w, h };
}