import { TOTAL_RODADAS } from "../utils/constantes";

<<<<<<< HEAD
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
=======
export const TelaIntro = ({ onJogar }) => (
  <div className="bq-tela">
    <div className="bq-emoji-grande">🏀</div>
    <p className="bq-texto-fim">VAMOS JOGAR BASQUETE?</p>
    <p className="bq-regra">
      Clique na bolinha amarela dentro da cesta para acertar um arremesso!
      Você tem {TOTAL_RODADAS} arremessos. Cada cesta vale 1 estrela e deixa a
      cesta cada vez menor — e ela muda de lugar a cada cesta que você fizer!
      Na última rodada a cesta anda, e você precisa acertar no momento certo!
    </p>
    <button className="bq-btn-principal" onClick={onJogar}>
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
      JOGAR
    </button>
  </div>
);