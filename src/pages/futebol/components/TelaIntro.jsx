import { TOTAL_RODADAS } from "../utils/constantes";

export const TelaIntro = ({ onJogar }) => (
  <div className="pc-tela">
    <div className="pc-emoji-grande">🥅⚽</div>
    <p className="pc-texto-fim">VAMOS BATER PÊNALTI?</p>
    <p className="pc-regra">
      Escolha um dos 5 alvos dentro do gol — os 4 cantos ou o centro — e chute!
      O goleiro vai pular para tentar adivinhar, e ele fica mais esperto a cada
      rodada. Você tem {TOTAL_RODADAS} chutes. Quantos gols você faz?
    </p>
    <button className="pc-btn-principal" onClick={onJogar}>
      JOGAR
    </button>
  </div>
);
