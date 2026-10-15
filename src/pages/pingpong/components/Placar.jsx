import { TOTAL_TENTATIVAS } from "../utils/constantes";

export const Placar = ({ tentativaExibida, pontos, nivel, bolinhas, somLigado, onAlternarSom }) => {
  const rodadaAtual = Math.min(tentativaExibida + 1, TOTAL_TENTATIVAS);

  return (
    <div className="pp-hud">
      <div className="pp-caixa">
        <span className="pp-rotulo">RODADA</span>
        <span className="pp-bolas">
          {Array.from({ length: TOTAL_TENTATIVAS }, (_, i) => (
            <i key={i} className={bolinhas?.[i] ? `jogada-${bolinhas[i]}` : "vazia"} />
          ))}
        </span>
        <b className="pp-numero-pequeno">
          {rodadaAtual}/{TOTAL_TENTATIVAS}
        </b>
      </div>

      <div className="pp-caixa">
        <span className="pp-rotulo">PONTOS</span>
        <b>{pontos}</b>
      </div>

      <div className="pp-caixa">
        <span className="pp-rotulo">NÍVEL</span>
        <b className={nivel?.classe}>{nivel?.rotulo ?? "FÁCIL"}</b>
      </div>

      <button
        type="button"
        className="pp-mudo"
        onClick={onAlternarSom}
        aria-label={somLigado ? "Desligar som" : "Ligar som"}
      >
        {somLigado ? "🔊" : "🔇"}
      </button>
    </div>
  );
};
