import { TOTAL_RODADAS } from "../utils/constantes";
import useNarracao from "../../../hooks/useNarracao";
import audioBoliche from "../../../assets/boliche.mp3";

export const TelaIntro = ({ onJogar }) => {
  const { tocando, alternar: toggleAudio, parar } = useNarracao(
    `Pronto para jogar boliche? São ${TOTAL_RODADAS} rodadas com 2 bolas cada. Primeiro, aperte para travar a mira. Depois, aperte de novo para escolher a força. Use a tecla espaço ou toque na pista.`,
    audioBoliche
  );

  const iniciarJogo = () => {
    parar();
    onJogar();
  };

  return (
    <div className="bol-overlay">
      <div className="bol-emoji-grande">🎳</div>

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

      <button
        type="button"
        className="bol-btn-audio"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={toggleAudio}
      >
        🔊 {tocando ? "PAUSAR ÁUDIO" : "OUVIR INSTRUÇÕES"}
      </button>

      <button
        type="button"
        className="bol-btn"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={iniciarJogo}
      >
        COMEÇAR
      </button>
    </div>
  );
};
