// ============================================================================
// Arena — o palco onde o jogo acontece
// ----------------------------------------------------------------------------
// É um contêiner relativo que contém o <canvas> (onde tudo é desenhado) e os
// overlays/banners que ficam posicionados por cima dele. O tamanho do canvas
// segue as constantes do jogo (800x400), mas o CSS estica ele para preencher
// a área na tela.
// ============================================================================

import { GAME_HEIGHT, GAME_WIDTH } from "../utils/constantes";

export const Arena = ({ canvasRef, children }) => (
  <div className="pp-stage">
    <div className="pp-stage-inner">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="pp-canvas"
      />
      {children}
    </div>
  </div>
);