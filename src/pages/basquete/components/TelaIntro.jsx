import { TOTAL_RODADAS } from "../utils/constantes";

// Tela de abertura: fica por cima do palco (canvas), no mesmo padrão dos outros jogos.
export const TelaIntro = ({ onJogar }) => (
  <div className="bq-overlay">
    <div className="bq-emoji-grande">🏀</div>
    <p className="bq-overlay-titulo">VAMOS JOGAR BASQUETE?</p>
    <p className="bq-overlay-sub">
      Puxe a bola para trás com o dedo ou o mouse, mire seguindo os pontinhos e solte para
      arremessar! Você tem {TOTAL_RODADAS} arremessos. Quanto mais você puxa, mais forte é o
      arremesso. A cada rodada a cesta muda de lugar e fica mais longe!
    </p>
    <button type="button" className="bq-btn" onClick={onJogar}>
      JOGAR
    </button>
  </div>
);