import { TOTAL_RODADAS } from "../utils/constantes";

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
      JOGAR
    </button>
  </div>
);