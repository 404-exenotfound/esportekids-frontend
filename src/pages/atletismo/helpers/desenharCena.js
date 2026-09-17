import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  PIXEL,
  PLAYER_X,
  SKY_HEIGHT,
} from "../utils/constantes";
import { rect } from "./rect";
import { desenharSol } from "./desenharSol";
import { desenharNuvem } from "./desenharNuvem";
import { desenharFundo } from "./desenharFundo";
import { desenharEstrela } from "./desenharEstrela";
import { desenharBarreira } from "./desenharBarreira";
import { desenharCorredor } from "./desenharCorredor";

export function desenharCena(ctx, d) {
  ctx.imageSmoothingEnabled = false;

  // Céu em faixas sólidas (estilo retro) — cobre até onde a parede começa
  rect(ctx, 0, 0, GAME_WIDTH, 90, "#5FB8E8");
  rect(ctx, 0, 90, GAME_WIDTH, SKY_HEIGHT - 90, "#8AD0F0");

  // Sol pixelado (bloco em formato de losango)
  desenharSol(ctx, 700, 50);

  // Nuvens pixeladas
  desenharNuvem(ctx, (140 - d.groundOffset * 0.2) % (GAME_WIDTH + 100), 40);
  desenharNuvem(ctx, (460 - d.groundOffset * 0.2) % (GAME_WIDTH + 100), 60);
  desenharNuvem(ctx, (680 - d.groundOffset * 0.2) % (GAME_WIDTH + 100), 30);

  // Parede limpa da arena (sem torcida)
  desenharFundo(ctx);

  // Pista de atletismo
  rect(ctx, 0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y, "#C97B3D");
  rect(ctx, 0, GROUND_Y, GAME_WIDTH, 6, "#E9A25C");

  // Linhas da pista (raias) em blocos
  const dashW = PIXEL * 5;
  const dashGap = PIXEL * 3;
  const totalDash = dashW + dashGap;
  for (let x = -totalDash; x < GAME_WIDTH + totalDash; x += totalDash) {
    rect(ctx, x - d.groundOffset, GROUND_Y + 22, dashW, PIXEL, "#FFF3D6");
    rect(ctx, x - d.groundOffset, GROUND_Y + 50, dashW, PIXEL, "#FFF3D6");
  }

  // Estrelas
  d.stars.forEach((s) => desenharEstrela(ctx, s.x, s.y));

  // Obstáculos (barreiras de atletismo)
  d.obstacles.forEach((o) => desenharBarreira(ctx, o.x, GROUND_Y - o.h, o.w, o.h));

  // Atleta
  const blink = d.invincibleTimer > 0 && Math.floor(d.invincibleTimer / 100) % 2 === 0;
  if (!blink) {
    desenharCorredor(ctx, PLAYER_X, d.playerY, d.isJumping, d.runFrame);
  }
}