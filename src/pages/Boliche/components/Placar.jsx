import { TOTAL_RODADAS } from "../utils/constantes";

export const Placar = ({ rodada, bolaDaRodada, pontos, pinosEmPe, somLigado, onAlternarSom }) => (
  <div className="bol-painel-status">
    <div className="bol-status-item">
      <div className="bol-status-rotulo">RODADA</div>
      <div className="bol-status-valor">
        {rodada}/{TOTAL_RODADAS}
      </div>
    </div>

    <div className="bol-status-item">
      <div className="bol-status-rotulo">BOLA</div>
      <div className="bol-status-valor">{bolaDaRodada}ª</div>
    </div>

    <div className="bol-status-item">
      <div className="bol-status-rotulo">PINOS</div>
      <div className="bol-status-valor">🎳 {pinosEmPe}</div>
    </div>

    <div className="bol-status-item">
      <div className="bol-status-rotulo">PONTOS</div>
      <div className="bol-status-valor">{pontos}</div>
    </div>

    <button
      type="button"
      className="bol-btn-som"
      onClick={onAlternarSom}
      aria-label={somLigado ? "Desligar som" : "Ligar som"}
    >
      {somLigado ? "🔊" : "🔇"}
    </button>
  </div>
);
