import { GROUND_Y, MAX_HEARTS, PLAYER_H, VELOCIDADE_INICIAL } from "../utils/constantes";

export function dadosIniciais() {
  return {
    playerY: GROUND_Y - PLAYER_H,
    velocityY: 0,
    isJumping: false,
    elapsed: 0,
    speed: VELOCIDADE_INICIAL,
    groundOffset: 0,
    obstacles: [],
    stars: [],
    nextObstacleIn: 900,
    nextStarIn: 1400,
    invincibleTimer: 0,
    runFrame: 0,
    runFrameTimer: 0,
    starsCollected: 0,
    heartsLeft: MAX_HEARTS,
  };
}