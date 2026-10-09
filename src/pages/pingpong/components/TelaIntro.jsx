// ============================================================================
// TelaIntro — tela inicial do minigame
// ----------------------------------------------------------------------------
// Explica como jogar e permite ouvir as instruções antes de começar.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { TOTAL_TENTATIVAS } from "../utils/constantes";
import { Overlay } from "./Overlay";
import audioPingPong from "../../../assets/pingpong.mp3";

export const TelaIntro = ({ onJogar }) => {
  const audioRef = useRef(null);
  const [audioTocando, setAudioTocando] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const atualizarEstado = () => setAudioTocando(!audio.paused);
    audio.addEventListener("play", atualizarEstado);
    audio.addEventListener("pause", atualizarEstado);
    audio.addEventListener("ended", atualizarEstado);

    return () => {
      audio.pause();
      audio.removeEventListener("play", atualizarEstado);
      audio.removeEventListener("pause", atualizarEstado);
      audio.removeEventListener("ended", atualizarEstado);
    };
  }, []);

  const alternarAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (erro) {
        console.error("Não foi possível reproduzir o áudio das instruções:", erro);
      }
    } else {
      audio.pause();
    }
  };

  const jogar = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioTocando(false);
    onJogar();
  };

  return (
    <Overlay>
      <div className="pp-emoji-grande">🏓</div>
      <p className="pp-overlay-titulo">PRONTO PARA O PING-PONG?</p>
      <p className="pp-overlay-sub">
        Mova o mouse (ou use as setas ↑↓ e W/S) para rebater a bola com a raquete.
        <br />
        Você tem {TOTAL_TENTATIVAS} tentativas para pontuar — e a cada ponto o
        adversário fica um pouquinho mais esperto!
      </p>

      <audio ref={audioRef} src={audioPingPong} preload="auto" />

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
