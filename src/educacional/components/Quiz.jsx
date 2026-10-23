import { useState } from "react";
import { useDispatch } from "react-redux";
import { ESPORTES } from "../data/esportes";
import { registrarResultado } from "../../store/progressoSlice";
import { Estrelas } from "./Estrelas";
import { BotaoLeitura } from "./BotaoLeitura";

// Quiz reutilizável. tipo = "quiz" (perguntas do esporte) ou "matematica".
// Cada acerto vale 1 estrela; só o melhor resultado fica salvo.
// Pode ser usado no fim de um jogo:  <Quiz esporte="boliche" tipo="quiz" />
export const Quiz = ({ esporte, tipo = "quiz", onFinalizar }) => {
  const dados = ESPORTES[esporte];
  const perguntas = dados[tipo];
  const dispatch = useDispatch();

  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState(null);
  const [acertos, setAcertos] = useState(0);
  const [fim, setFim] = useState(false);

  const pergunta = perguntas[indice];
  const respondeu = escolha !== null;

  const responder = (i) => {
    if (respondeu) return;
    setEscolha(i);
    if (i === pergunta.correta) setAcertos((a) => a + 1);
  };

  const avancar = () => {
    if (indice + 1 < perguntas.length) {
      setIndice(indice + 1);
      setEscolha(null);
      return;
    }
    dispatch(registrarResultado({ esporte, tipo, acertos }));
    setFim(true);
    onFinalizar?.(acertos);
  };

  const refazer = () => {
    setIndice(0);
    setEscolha(null);
    setAcertos(0);
    setFim(false);
  };

  const titulo = tipo === "quiz" ? `❓ QUIZ DE ${dados.nome.toUpperCase()}` : `🧮 MATEMÁTICA DO ${dados.nome.toUpperCase()}`;

  if (fim) {
    const perfeito = acertos === perguntas.length;
    return (
      <div className="edu-card edu-centro">
        <p className="edu-titulo-pixel">{titulo}</p>
        <p className="edu-emoji-grande">{perfeito ? "🏆" : acertos > 0 ? "👏" : "💪"}</p>
        <p className="edu-texto">
          {perfeito
            ? "Perfeito! Você acertou tudo!"
            : acertos > 0
              ? `Muito bem! Você acertou ${acertos} de ${perguntas.length}.`
              : "Não foi dessa vez, mas aprender é assim mesmo. Tente de novo!"}
        </p>
        <Estrelas total={acertos} max={perguntas.length} />
        <div className="edu-acoes edu-centro">
          <button type="button" className="edu-btn edu-btn-ok" onClick={refazer}>
            🔄 Jogar de novo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edu-card">
      <p className="edu-titulo-pixel">{titulo}</p>
      <p className="edu-progresso">
        Pergunta {indice + 1} de {perguntas.length}
      </p>
      <p className="edu-pergunta">{pergunta.p}</p>

      <div className="edu-opcoes">
        {pergunta.opcoes.map((op, i) => {
          let estado = "";
          if (respondeu && i === pergunta.correta) estado = "edu-certa";
          else if (respondeu && i === escolha) estado = "edu-errada";
          return (
            <button
              key={op}
              type="button"
              className={`edu-opcao ${estado}`}
              onClick={() => responder(i)}
              disabled={respondeu}
            >
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
            {indice + 1 < perguntas.length ? "Próxima ▶" : "Ver resultado 🏁"}
          </button>
        )}
      </div>
    </div>
  );
};
