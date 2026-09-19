import { TOTAL_RODADAS } from "../utils/constantes";
import { Creditos } from "../../../components/Creditos";

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

    <Creditos />

    <div className="bq-botoes-fim">
      <button className="bq-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
      <button className="bq-btn-principal" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
    </div>
  </div>
);