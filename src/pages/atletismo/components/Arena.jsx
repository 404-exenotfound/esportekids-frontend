import { GAME_HEIGHT, GAME_WIDTH } from "../utils/constantes";
import EscalaProporcional from "../../../components/EscalaProporcional";

// Área do jogo — preenche 100% do espaço disponível (igual ao pc-stage do
// PenaltiCampeao). O canvas cresce junto e os overlays (intro/fim) entram
// como children sobre a arena.
export const Arena = ({ canvasRef, children }) => (
  <div className="atl-stage">
    <EscalaProporcional largura={GAME_WIDTH} altura={GAME_HEIGHT}>
      <div className="atl-stage-inner">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="atl-canvas"
        />
        {children}
      </div>
    </EscalaProporcional>
  </div>
);