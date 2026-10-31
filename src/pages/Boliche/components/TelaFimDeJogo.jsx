import { Creditos } from "../../../components/Creditos";

export const TelaFimDeJogo = ({ pontos, estrelas, emojiFinal, onJogarNovamente, onVoltar }) => (
  <div className="bol-tela">
    <div className="bol-emoji-grande">{emojiFinal}</div>

    <p className="bol-texto-fim">
      FIM DE JOGO!
      <br />
      VOCÊ FEZ {pontos} PONTOS
    </p>

    <div className="bol-estrelas" aria-label={`${estrelas} de 3 estrelas`}>
      {"⭐".repeat(estrelas)}
      {"☆".repeat(3 - estrelas)}
    </div>

    <Creditos />

    <div className="bol-botoes-fim">
      <button className="bol-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
      <button className="bol-btn-principal" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
    </div>
  </div>
);
