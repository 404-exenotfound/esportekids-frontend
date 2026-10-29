import { TOTAL_RODADAS } from "../utils/constantes";
import useNarracao from "../../../hooks/useNarracao";
import audioFutebol from "../../../assets/futebol.mp3";

// Tela de abertura: fica por cima do palco (canvas), no mesmo padrão do Basquete.
export const TelaIntro = ({ onJogar }) => {
  const { tocando, alternar: alternarAudio, parar } = useNarracao(
    `Vamos bater pênalti? Toque em um dos 5 alvos dentro do gol, os 4 cantos ou o centro, e chute! O goleiro vai pular para tentar adivinhar o canto, e ele fica mais esperto a cada rodada. Você tem ${TOTAL_RODADAS} chutes. Quantos gols você faz?`,
    audioFutebol
  );

  const jogar = () => {
    parar();
    onJogar();
  };

  return (
    <div className="pc-overlay">
      <div className="pc-emoji-grande">🥅⚽</div>

      <p className="pc-overlay-titulo">VAMOS BATER PÊNALTI?</p>

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
