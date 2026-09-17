import { TOTAL_RODADAS } from "../utils/constantes";

export const TelaFimDeJogo = ({
  cestas,
  estrelas,
  emojiFinal,
  onJogarNovamente,
  onVoltar,
}) => (
  <div className="bq-tela">
    <div className="bq-emoji-grande">{emojiFinal}</div>

    <p className="bq-texto-fim">
      FIM DE JOGO!
      <br />
      VOCÊ FEZ {cestas} DE {TOTAL_RODADAS} CESTAS
    </p>

    <div className="bq-estrelas" aria-label={`${estrelas} estrelas`}>
      {"⭐".repeat(estrelas)}
    </div>

    <div className="bq-botoes-fim">
      <button className="bq-btn-principal" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
      <button className="bq-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
    </div>
  </div>
);