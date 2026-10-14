import { useEffect, useRef, useState } from "react";
import { TOTAL_RODADAS } from "../utils/constantes";
import audioFutebol from "../../../assets/futebol.mp3";

// Tela de abertura: fica por cima do palco (canvas), no mesmo padrão do Basquete.
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
      setTocando(false);
      console.error("Não foi possível reproduzir futebol.mp3:", erro);
    }
  };

  const jogar = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setTocando(false);
    onJogar();
  };

  return (
    <div className="pc-overlay">
      <div className="pc-emoji-grande">🥅⚽</div>

      <p className="pc-overlay-titulo">VAMOS BATER PÊNALTI?</p>

      <audio
        ref={audioRef}
        src={audioFutebol}
        preload="none"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onEnded={() => setTocando(false)}
        onError={() => {
          setTocando(false);
          console.error("Erro ao carregar futebol.mp3.");
        }}
      />

      <p className="pc-overlay-sub">
        Toque em um dos 5 alvos dentro do gol — os 4 cantos ou o centro — e chute! O goleiro
        vai pular para tentar adivinhar o canto, e ele fica mais esperto a cada rodada. Você tem
        {" "}
        {TOTAL_RODADAS} chutes. Quantos gols você faz?
      </p>

      <button
        type="button"
        className="pc-btn-audio"
        onClick={alternarAudio}
        aria-label={tocando ? "Pausar instruções" : "Ouvir instruções"}
      >
        <span aria-hidden="true">{tocando ? "⏸" : "🔊"}</span>
        {tocando ? "PAUSAR ÁUDIO" : "OUVIR INSTRUÇÕES"}
      </button>

      <button type="button" className="pc-btn" onClick={jogar}>
        JOGAR
      </button>
    </div>
  );
};
