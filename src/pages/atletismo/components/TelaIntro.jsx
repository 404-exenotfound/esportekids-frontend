import { useEffect, useRef, useState } from "react";
import { STARS_TO_WIN } from "../utils/constantes";
import { Overlay } from "./Overlay";
import audioAtletismo from "../../../assets/atletismo.mp3";

export const TelaIntro = ({ onJogar }) => {
  const audioRef = useRef(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const alternarAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch (erro) {
      console.error("Erro ao reproduzir o áudio do atletismo:", erro);
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
      <p className="atl-overlay-titulo">PRONTO PARA CORRER?</p>
      <p className="atl-overlay-sub">
        Pule as barreiras e junte {STARS_TO_WIN} estrelas para vencer a corrida.
        <br />
        <br />
        Aperte ESPAÇO para pular e para começar.
      </p>

      <button
        type="button"
        className="atl-btn-audio"
        onClick={alternarAudio}
        aria-label={tocando ? "Pausar explicação do atletismo" : "Ouvir explicação do atletismo"}
      >
        <span aria-hidden="true">{tocando ? "⏸" : "🔊"}</span>
        {tocando ? "PAUSAR ÁUDIO" : "OUVIR INSTRUÇÕES"}
      </button>

      <audio
        ref={audioRef}
        src={audioAtletismo}
        preload="none"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onEnded={() => setTocando(false)}
        onError={() => {
          setTocando(false);
          console.error("Não foi possível carregar atletismo.mp3.");
        }}
      />

      <button className="atl-btn" onClick={iniciarJogo}>
        COMEÇAR
      </button>
    </Overlay>
  );
};
