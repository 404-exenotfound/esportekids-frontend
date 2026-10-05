// ============================================================================
// Placar — painel do HUD (tentativa, pontos, nível e som)
// ----------------------------------------------------------------------------
// Mostra acima da Arena:
//   • tentativa atual / total de tentativas
//   • pontos do jogador
//   • nível de dificuldade (FÁCIL / MÉDIO / DIFÍCIL, com cor específica)
//   • botão de ligar/desligar o som
// E embaixo, as "bolinhas" coloridas que representam o histórico dos
// resultados (amarelo = ponto, cinza = erro).
// ============================================================================

import { TOTAL_TENTATIVAS } from "../utils/constantes";

export const Placar = ({
  tentativaExibida,
  pontos,
  nivel,
  bolinhas,
  somLigado,
  onAlternarSom,
}) => (
  <div className="pp-painel">
    <div className="pp-hud">
      <div className="pp-hud-item">
        <span>TENTATIVA</span>
        <span className="pp-hud-num">
          {tentativaExibida}/{TOTAL_TENTATIVAS}
        </span>
      </div>

      <div className="pp-hud-item">
        <span>PONTOS</span>
        <span className="pp-hud-num">{pontos}</span>
      </div>

      <div className="pp-hud-item">
        <span>NÍVEL</span>
        <span className={`pp-hud-dificuldade ${nivel.classe}`}>{nivel.rotulo}</span>
      </div>

      <button
        className="pp-mudo-btn"
        onClick={onAlternarSom}
        title={somLigado ? "Desligar som" : "Ligar som"}
        aria-label={somLigado ? "Desligar som" : "Ligar som"}
      >
        {somLigado ? "🔊" : "🔇"}
      </button>
    </div>

    {/* Bolinhas do histórico: uma para cada tentativa jogada */}
    <div className="pp-bolinhas">
      {bolinhas.map((jogada, i) => (
        <span key={i} className={`pp-bolinha ${jogada ? `jogada-${jogada}` : ""}`} />
      ))}
    </div>
  </div>
);