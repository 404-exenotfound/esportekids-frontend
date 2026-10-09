import { useEffect, useRef, useState } from "react";
import { TOTAL_RODADAS } from "../utils/constantes";
import audioBasquete from "../../../assets/basquete.mp3";

// Tela de abertura: fica por cima do palco (canvas), no mesmo padrão dos outros jogos.
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
      console.error("Não foi possível reproduzir basquete.mp3:", erro);
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
    <div className="bq-overlay">
      <div className="bq-emoji-grande">🏀</div>

      <p className="bq-overlay-titulo">VAMOS JOGAR BASQUETE?</p>

      <audio
        ref={audioRef}
        src={audioBasquete}
        preload="none"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onEnded={() => setTocando(false)}
        onError={() => {
          setTocando(false);
          console.error("Erro ao carregar basquete.mp3.");
        }}
      />

      <p className="bq-overlay-sub">
        Puxe a bola para trás com o dedo ou o mouse, mire seguindo os pontinhos e solte para
        arremessar! Você tem {TOTAL_RODADAS} arremessos. Quanto mais você puxa, mais forte é o
        arremesso. A cada rodada a cesta muda de lugar e fica mais longe!
      </p>

      <button
        type="button"
        className="bq-btn-audio"
        onClick={alternarAudio}
        aria-label={tocando ? "Pausar instruções" : "Ouvir instruções"}
      >
        <span aria-hidden="true">{tocando ? "⏸" : "🔊"}</span>
        {tocando ? "PAUSAR ÁUDIO" : "OUVIR INSTRUÇÕES"}
      </button>

      <button type="button" className="bq-btn" onClick={jogar}>
        JOGAR
      </button>
    </div>
  );
};
