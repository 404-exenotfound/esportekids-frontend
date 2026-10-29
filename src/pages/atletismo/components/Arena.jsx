import { GAME_HEIGHT, GAME_WIDTH } from "../utils/constantes";
import EscalaProporcional from "../../../components/EscalaProporcional";

// Conteúdo do palco: canvas escalado na proporção do jogo, com o HUD e os
// overlays (intro/resultado/botão) por cima. A moldura (.atl-stage) fica no
// index, igual aos outros minigames.
export const Arena = ({ canvasRef, children }) => (
  <EscalaProporcional largura={GAME_WIDTH} altura={GAME_HEIGHT}>
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="atl-canvas"
    />
    {children}
  </EscalaProporcional>
);
