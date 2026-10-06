import { TOTAL_TENTATIVAS } from "../utils/constantes";
import { Creditos } from "../../../components/Creditos";

export const TelaFimDeJogo = ({
  pontos,
  estrelas,
  emojiFinal,
  onJogarNovamente,
  onVoltar,
}) => (
  <div className="pp-tela">
    <div className="pp-emoji-grande">{emojiFinal}</div>

    <p className="pp-texto-fim">
      FIM DE JOGO!
      <br />
      VOCÊ FEZ {pontos} DE {TOTAL_TENTATIVAS} PONTOS
    </p>

    <div className="pp-estrelas" aria-label={`${estrelas} de 3 estrelas`}>
      {"⭐".repeat(estrelas)}
      {"☆".repeat(3 - estrelas)}
    </div>

    <Creditos />

    <div className="pp-botoes-fim">
      <button className="pp-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
      <button className="pp-btn" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
    </div>
  </div>
);