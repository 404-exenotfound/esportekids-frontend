import { TOTAL_RODADAS } from "../utils/constantes";

export const Placar = ({
  rodadaExibida,
  cestas,
  dificuldade,
  bolinhas,
  somLigado,
  onAlternarSom,
}) => (
  <div className="bq-painel">
    <div className="bq-hud">
      <div className="bq-hud-item">
        <span>RODADA</span>
        <span className="bq-hud-num">
          {rodadaExibida}/{TOTAL_RODADAS}
        </span>
      </div>

      <div className="bq-hud-item">
        <span>ESTRELAS</span>
        <span className="bq-hud-num">{cestas}</span>
      </div>

      <div className="bq-hud-item">
        <span>NÍVEL</span>
        <span className={`bq-hud-dificuldade ${dificuldade.classe}`}>
          {dificuldade.rotulo}
        </span>
      </div>

      <button
        className="bq-mudo-btn"
        onClick={onAlternarSom}
        title={somLigado ? "Desligar som" : "Ligar som"}
        aria-label={somLigado ? "Desligar som" : "Ligar som"}
      >
        {somLigado ? "🔊" : "🔇"}
      </button>
    </div>

    <div className="bq-bolinhas">
      {bolinhas.map((jogada, i) => (
        <span key={i} className={`bq-bolinha ${jogada ? `jogada-${jogada}` : ""}`} />
      ))}
    </div>
  </div>
);