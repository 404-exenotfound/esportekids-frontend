import { MAX_HEARTS, STARS_TO_WIN } from "../utils/constantes";

export const Placar = ({ estrelas, vidas, rotulo, cor }) => (
  <div className="atl-painel-status">
    <div className="atl-status-item">
      <div className="atl-status-rotulo">ESTRELAS</div>
      <div className="atl-status-valor">
        {estrelas}/{STARS_TO_WIN}
      </div>
    </div>
    <div className="atl-status-item">
      <div className="atl-status-rotulo">VIDAS</div>
      <div>
        {Array.from({ length: MAX_HEARTS }).map((_, i) => (
          <span key={i} className="atl-heart">
            {i < vidas ? "❤️" : "🤍"}
          </span>
        ))}
      </div>
    </div>
    <div className="atl-status-item">
      <div className="atl-status-rotulo">VELOCIDADE</div>
      <div className="atl-status-valor" style={{ color: cor }}>{rotulo}</div>
    </div>
  </div>
);