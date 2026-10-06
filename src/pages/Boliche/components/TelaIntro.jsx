import { TOTAL_RODADAS } from "../utils/constantes";
import { Overlay } from "./Overlay";

export const TelaIntro = ({ onJogar }) => (
  <Overlay>
    <p className="bol-overlay-titulo">PRONTO PARA JOGAR?</p>
    <p className="bol-overlay-sub">
      São {TOTAL_RODADAS} rodadas com 2 bolas cada.
      <br />
      1) Aperte para travar a MIRA.
      <br />
      2) Aperte de novo para escolher a FORÇA.
      <br />
      <br />
      Use a tecla ESPAÇO ou toque na pista.
    </p>
    {/* O toque na pista já começa o jogo; aqui travamos a propagação para o
        botão não disparar o início duas vezes. */}
    <button
      className="bol-btn"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onJogar}
    >
      COMEÇAR
    </button>
  </Overlay>
);
