import { TOTAL_RODADAS } from "../utils/constantes";

export const TelaFimDeJogo = ({ placar, estrelas, emojiFinal, onJogarNovamente, onVoltar }) => (
  <div className="pc-tela">
    <div className="pc-emoji-grande">{emojiFinal}</div>

    <p className="pc-texto-fim">
      FIM DE JOGO!
      <br />
      VOCÊ FEZ {placar} DE {TOTAL_RODADAS} GOLS
    </p>

    <div className="pc-estrelas" aria-label={`${estrelas} de 3 estrelas`}>
      {"⭐".repeat(estrelas)}
      {"☆".repeat(3 - estrelas)}
    </div>

    <div className="pc-botoes-fim">
      <button className="pc-btn-principal" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
      <button className="pc-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
    </div>
  </div>
);
