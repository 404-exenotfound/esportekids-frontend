
import { useEffect, useRef, useState } from "react";
import { TOTAL_RODADAS } from "../utils/constantes";
import { Overlay } from "./Overlay";
import audioBoliche from "../../../assets/boliche.mp3";

export const TelaIntro = ({ onJogar }) => {
  const audioRef = useRef(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const finalizarAudio = () => setTocando(false);
    audio.addEventListener("ended", finalizarAudio);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", finalizarAudio);
    };
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (tocando) {
      audio.pause();
      setTocando(false);
      return;
    }

    try {
      await audio.play();
      setTocando(true);
    } catch (erro) {
      console.error("Não foi possível reproduzir o áudio:", erro);
      setTocando(false);
    }
  };

  const iniciarJogo = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setTocando(false);
    onJogar();
  };

  return (
    <Overlay>
      <audio ref={audioRef} src={audioBoliche} preload="none" />

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
    </Overlay>
  );
};
