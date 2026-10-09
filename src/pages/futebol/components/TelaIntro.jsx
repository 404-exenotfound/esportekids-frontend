import { useEffect, useRef, useState } from "react";
import { TOTAL_RODADAS } from "../utils/constantes";
import audioFutebol from "../../../assets/futebol.mp3";

// Tela de abertura do futebol, seguindo o padrão visual do Basquete.
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
      console.error("Erro ao reproduzir o áudio do futebol:", erro);
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
    <div className="pc-tela pc-tela-intro">
      <div className="pc-emoji-grande">🥅⚽</div>
      <p className="pc-texto-fim pc-intro-titulo">VAMOS BATER PÊNALTI?</p>

      <p className="pc-regra pc-intro-regra">
        Escolha um dos 5 alvos dentro do gol — os 4 cantos ou o centro — e chute!
        O goleiro vai pular para tentar adivinhar, e ele fica mais esperto a cada
        rodada. Você tem {TOTAL_RODADAS} chutes. Quantos gols você faz?
      </p>

      <button
        type="button"
        className="pc-btn-audio"
        onClick={alternarAudio}
        aria-label={tocando ? "Pausar explicação do futebol" : "Ouvir explicação do futebol"}
      >
        <span aria-hidden="true">{tocando ? "⏸" : "🔊"}</span>
        {tocando ? "PAUSAR ÁUDIO" : "OUVIR INSTRUÇÕES"}
      </button>

      <audio
        ref={audioRef}
        src={audioFutebol}
        preload="none"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onEnded={() => setTocando(false)}
        onError={() => {
          setTocando(false);
          console.error("Não foi possível carregar futebol.mp3.");
        }}
      />

      <button type="button" className="pc-btn-principal" onClick={iniciarJogo}>
        JOGAR
      </button>
    </div>
  );
};
