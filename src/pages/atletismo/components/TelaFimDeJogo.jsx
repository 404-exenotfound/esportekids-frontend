import { Creditos } from "../../../components/Creditos";

export const TelaFimDeJogo = ({ melhor = 0, onJogarNovamente, onVoltar }) => (
  <div className="atl-tela">
    <div className="atl-emoji-grande">🏆</div>

    <p className="atl-texto-fim">
      PARABÉNS, CAMPEÃO DO SALTO!
      <br />
      VOCÊ COMPLETOU AS 5 FASES
      {melhor > 0 && (
        <>
          <br />
          MELHOR SALTO: {melhor.toFixed(2).replace(".", ",")}m
        </>
      )}
    </p>

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
