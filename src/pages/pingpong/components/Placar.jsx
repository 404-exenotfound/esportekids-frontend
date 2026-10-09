import { TOTAL_TENTATIVAS } from "../utils/constantes";

export const Placar = ({
  tentativaExibida,
  pontos,
  nivel,
  bolinhas,
  somLigado,
  onAlternarSom,
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