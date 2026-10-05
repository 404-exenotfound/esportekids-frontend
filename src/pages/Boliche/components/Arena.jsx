// Área de jogo: o canvas preenche todo o espaço e os overlays entram por cima.
// O clique/toque aqui vale como a barra de espaço (pensado para tablet).

import { GAME_HEIGHT, GAME_WIDTH } from "../utils/constantes";

export const Arena = ({ canvasRef, onAcao, children }) => (
  <div className="bol-stage">
    <div
      className="bol-stage-inner"
      onPointerDown={onAcao}
      role="presentation"
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="bol-canvas"
      />
      {children}
    </div>
  </div>
);
