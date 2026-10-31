// ============================================================================
// TelaIntro — tela inicial do minigame
// ----------------------------------------------------------------------------
// Explica como jogar e permite ouvir as instruções antes de começar.
// ============================================================================

import { TOTAL_TENTATIVAS } from "../utils/constantes";
import { Overlay } from "./Overlay";
import useNarracao from "../../../hooks/useNarracao";
import audioPingPong from "../../../assets/pingpong.mp3";

export const TelaIntro = ({ onJogar }) => {
  const { tocando: audioTocando, alternar: alternarAudio, parar } = useNarracao(
    `Pronto para o ping-pong? Mova o mouse, ou use as setas esquerda e direita, para rebater a bola com a raquete. Você tem ${TOTAL_TENTATIVAS} tentativas para pontuar, e a cada ponto o adversário fica um pouquinho mais esperto!`,
    audioPingPong
  );

  const jogar = () => {
    parar();
    onJogar();
  };

  return (
    <Overlay>
      <div className="pp-emoji-grande">🏓</div>
      <p className="pp-overlay-titulo">PRONTO PARA O PING-PONG?</p>
      <p className="pp-overlay-sub">
        Mova o mouse (ou use as setas ←→ e A/D) para rebater a bola com a raquete.
        <br />
        Você tem {TOTAL_TENTATIVAS} tentativas para pontuar — e a cada ponto o
        adversário fica um pouquinho mais esperto!
      </p>

      <button
        type="button"
        className="pp-btn-audio"
        onClick={alternarAudio}
        aria-pressed={audioTocando}
      >
        {audioTocando ? "⏸️ PAUSAR ÁUDIO" : "🔊 OUVIR INSTRUÇÕES"}
      </button>

      <button className="pp-btn" onClick={jogar}>
        COMEÇAR
      </button>
    </Overlay>
  );
};
