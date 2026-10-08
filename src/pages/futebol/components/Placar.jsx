import { TOTAL_RODADAS } from "../utils/constantes";

export const Placar = ({
  rodadaExibida,
  placar,
  dificuldade,
  bolinhas,
  somLigado,
  onAlternarSom,
}) => (
  <div className="pc-painel">
    <div className="pc-hud">
      <div className="pc-hud-item">
        <span>RODADA</span>
        <span className="pc-hud-num">
          {rodadaExibida}/{TOTAL_RODADAS}
        </span>
      </div>

      <div className="pc-hud-item">
        <span>GOLS</span>
        <span className="pc-hud-num">{placar}</span>
      </div>

      <div className="pc-hud-item">
        <span>NÍVEL</span>
        <span className={`pc-hud-dificuldade ${dificuldade.classe}`}>
          {dificuldade.rotulo}
        </span>
      </div>

      <button
        className="pc-mudo-btn"
        onClick={onAlternarSom}
        title={somLigado ? "Desligar som" : "Ligar som"}
        aria-label={somLigado ? "Desligar som" : "Ligar som"}
      >
        {somLigado ? "🔊" : "🔇"}
      </button>
    </div>

    <div className="pc-bolinhas">
      {bolinhas.map((jogada, i) => (
        <span key={i} className={`pc-bolinha ${jogada ? `jogada-${jogada}` : ""}`} />
      ))}
    </div>
  </div>
);
