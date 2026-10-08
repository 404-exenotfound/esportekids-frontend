import { TOTAL_RODADAS } from "../utils/constantes";
import { Creditos } from "../../../components/Creditos";

export const TelaFimDeJogo = ({
  cestas,
<<<<<<< HEAD
  pontos,
=======
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
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
<<<<<<< HEAD
      <br />
      {pontos} PONTOS
    </p>

    <div className="bq-estrelas" aria-label={`${estrelas} de 3 estrelas`}>
      {"⭐".repeat(estrelas)}
      {"☆".repeat(3 - estrelas)}
=======
    </p>

    <div className="bq-estrelas" aria-label={`${estrelas} estrelas`}>
      {"⭐".repeat(estrelas)}
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
    </div>

    <Creditos />

    <div className="bq-botoes-fim">
<<<<<<< HEAD
      <button type="button" className="bq-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
      <button type="button" className="bq-btn-principal" onClick={onJogarNovamente}>
=======
      <button className="bq-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
      <button className="bq-btn-principal" onClick={onJogarNovamente}>
>>>>>>> 693f9deb210c15ce8c6ac503394e6397897eb0cb
        JOGAR NOVAMENTE
      </button>
    </div>
  </div>
);