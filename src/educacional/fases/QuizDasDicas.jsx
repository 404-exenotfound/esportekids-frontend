import { useState } from "react";
import { MINIMO_PARA_LIBERAR } from "./dicasFases";
import { BotaoLeitura } from "../components/BotaoLeitura";

// Quiz do fim do jogo: 1 pergunta por dica. Chama onTerminar(acertos) no final.
export const QuizDasDicas = ({ perguntas, onTerminar }) => {
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState(null);
  const [acertos, setAcertos] = useState(0);

  const pergunta = perguntas[indice];
  const respondeu = escolha !== null;
  const ultima = indice + 1 === perguntas.length;

  const responder = (i) => {
    if (respondeu) return;
    setEscolha(i);
    if (i === pergunta.correta) setAcertos((a) => a + 1);
  };

  const avancar = () => {
    if (ultima) {
      onTerminar(acertos);
      return;
    }
    setIndice(indice + 1);
    setEscolha(null);
  };

  return (
    <div className="edu-card">
      <p className="edu-titulo-pixel">❓ QUIZ DAS DICAS</p>
      <p className="edu-progresso">
        Pergunta {indice + 1} de {perguntas.length} · acerte {MINIMO_PARA_LIBERAR} para liberar o próximo jogo
      </p>
      <p className="edu-pergunta">{pergunta.p}</p>

      <div className="edu-opcoes">
        {pergunta.opcoes.map((op, i) => {
          let estado = "";
          if (respondeu && i === pergunta.correta) estado = "edu-certa";
          else if (respondeu && i === escolha) estado = "edu-errada";
          return (
            <button key={op} type="button" className={`edu-opcao ${estado}`} onClick={() => responder(i)} disabled={respondeu}>
              {op}
            </button>
          );
        })}
      </div>

      {respondeu && (
        <div className={`edu-feedback ${escolha === pergunta.correta ? "edu-feedback-ok" : "edu-feedback-erro"}`} role="status">
          <strong>{escolha === pergunta.correta ? "✅ Acertou!" : "😅 Quase!"}</strong> {pergunta.explicacao}
        </div>
      )}

      <div className="edu-acoes">
        <BotaoLeitura texto={pergunta.p} />
        {respondeu && (
          <button type="button" className="edu-btn edu-btn-ok" onClick={avancar}>
            {ultima ? "Ver resultado 🏁" : "Próxima ▶"}
          </button>
        )}
      </div>
    </div>
  );
};
