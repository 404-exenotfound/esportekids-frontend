import { GAME_HEIGHT, GAME_WIDTH } from "../utils/constantes";

// Área do jogo — preenche 100% do espaço disponível (igual ao pc-stage do
// PenaltiCampeao). O canvas cresce junto e os overlays (intro/fim) entram
// como children sobre a arena.
export const Arena = ({ canvasRef, children }) => (
  <div className="atl-stage">
    <div className="atl-stage-inner">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="atl-canvas"
      />
      {children}
    </div>
  </div>
);