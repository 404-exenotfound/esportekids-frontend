import { STARS_TO_WIN } from "../utils/constantes";
import { Creditos } from "../../../components/Creditos";

export const TelaFimDeJogo = ({ venceu, estrelas, onJogarNovamente, onVoltar }) => (
  <div className="atl-tela">
    <div className="atl-emoji-grande">{venceu ? "🏆" : "😅"}</div>

    <p className="atl-texto-fim">
      FIM DE JOGO!
      <br />
      VOCÊ FEZ {estrelas} DE {STARS_TO_WIN} ESTRELAS
    </p>

    <div className="atl-estrelas" aria-label={`${estrelas} de ${STARS_TO_WIN} estrelas`}>
      {"⭐".repeat(estrelas)}
      {"☆".repeat(STARS_TO_WIN - estrelas)}
    </div>

    <Creditos />

    <div className="atl-botoes-fim">
      <button className="atl-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
      <button className="atl-btn-principal" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
    </div>
  </div>
);