import { Creditos } from "../../../components/Creditos";

// venceu = completou as 5 fases; senão acabaram as chances no meio do caminho.
export const TelaFimDeJogo = ({
  venceu,
  fasesCompletas = 0,
  totalFases = 5,
  melhor = 0,
  onJogarNovamente,
  onVoltar,
}) => (
  <div className="atl-tela">
    <div className="atl-emoji-grande">{venceu ? "🏆" : fasesCompletas > 0 ? "👏" : "💪"}</div>

    <p className="atl-texto-fim">
      {venceu ? (
        <>
          PARABÉNS, CAMPEÃO DO SALTO!
          <br />
          VOCÊ COMPLETOU AS {totalFases} FASES
        </>
      ) : (
        <>
          ACABARAM AS CHANCES!
          <br />
          VOCÊ COMPLETOU {fasesCompletas} DE {totalFases} FASES
        </>
      )}
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
