import { GAME_WIDTH, GROUND_Y, PIXEL } from "../utils/constantes";

export function gerarEstrela() {
  return {
    x: GAME_WIDTH + 40,
    y: GROUND_Y - 90 - Math.round(Math.random() * 14) * PIXEL,
    collected: false,
  };
}