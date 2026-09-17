import { STARS_TO_WIN } from "../utils/constantes";
import { Overlay } from "./Overlay";

export const TelaIntro = ({ onJogar }) => (
  <Overlay>
    <p className="atl-overlay-titulo">PRONTO PARA CORRER?</p>
    <p className="atl-overlay-sub">
      Pule as barreiras e junte {STARS_TO_WIN} estrelas para vencer a corrida.
      <br />
      <br />
      Aperte ESPAÇO para pular e para começar.
    </p>
    <button className="atl-btn" onClick={onJogar}>
      COMEÇAR
    </button>
  </Overlay>
);