import { GAME_WIDTH, GROUND_Y, PIXEL, SKY_HEIGHT } from "../utils/constantes";
import { rect } from "./rect";
import { desenharTextoPixel } from "./desenharTextoPixel";

// Parede limpa da arena — sem torcida, sem arquibancada cheia. Só uma parede
// de cor sólida, com o nome do jogo ao centro e duas faixas amarelas, bem no
// estilo clean do PenaltiCampeao.
export function desenharFundo(ctx) {
  const wallTop = SKY_HEIGHT;
  const wallBottom = GROUND_Y;
  const wallH = wallBottom - wallTop;

  // Parede principal (cor sólida, sem pessoas)
  rect(ctx, 0, wallTop, GAME_WIDTH, wallH, "#2E3EA8");

  // Faixa amarela no topo da parede
  rect(ctx, 0, wallTop, GAME_WIDTH, PIXEL * 2, "#FFC93C");

  // Faixa amarela rente à pista
  rect(ctx, 0, wallBottom - PIXEL * 3, GAME_WIDTH, PIXEL * 2, "#FFC93C");

  // Nome da arena ao centro da parede
  desenharTextoPixel(ctx, "ATLETISMO", GAME_WIDTH / 2, wallTop + wallH / 2 - 7, 2, "#FFC93C");
}