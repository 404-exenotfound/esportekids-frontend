<<<<<<< HEAD
=======
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

>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
import { TOTAL_TENTATIVAS } from "../utils/constantes";

export const Placar = ({
  tentativaExibida,
  pontos,
  nivel,
  bolinhas,
  somLigado,
  onAlternarSom,
<<<<<<< HEAD
}) => {
  // A primeira rodada começa visualmente em 1/5,
  // assim como no minijogo Futebol.
  const rodadaAtual = Math.min(
    tentativaExibida + 1,
    TOTAL_TENTATIVAS
  );

  return (
    <div className="pp-painel">

      {/* ================================================================
          INFORMAÇÕES PRINCIPAIS
      ================================================================= */}

      <div className="pp-hud">

        {/* RODADA */}
        <div className="pp-hud-item">
          <span className="pp-hud-label">
            RODADA
          </span>

          <span className="pp-hud-num">
            {rodadaAtual}/{TOTAL_TENTATIVAS}
          </span>
        </div>


        {/* GOLS */}
        <div className="pp-hud-item">
          <span className="pp-hud-label">
            PONTOS
          </span>

          <span className="pp-hud-num">
            {pontos}
          </span>
        </div>


        {/* NÍVEL */}
        <div className="pp-hud-item">
          <span className="pp-hud-label">
            NÍVEL
          </span>

          <span className="pp-hud-dificuldade">
            {nivel?.rotulo ?? "FÁCIL"}
          </span>
        </div>


        {/* SOM */}
        <button
          type="button"
          className="pp-mudo-btn"
          onClick={onAlternarSom}
          title={
            somLigado
              ? "Desligar som"
              : "Ligar som"
          }
          aria-label={
            somLigado
              ? "Desligar som"
              : "Ligar som"
          }
        >
          {somLigado ? "🔊" : "🔇"}
        </button>

      </div>


      {/* ================================================================
          INDICADORES DAS 5 RODADAS
      ================================================================= */}

      <div className="pp-bolinhas">

        {Array.from(
          {
            length: TOTAL_TENTATIVAS,
          },
          (_, index) => {

            const resultado =
              bolinhas?.[index];

            return (
              <span
                key={index}
                className={`pp-bolinha ${
                  resultado
                    ? `jogada-${resultado}`
                    : ""
                }`}
              />
            );
          }
        )}

      </div>

    </div>
  );
};
=======
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
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
