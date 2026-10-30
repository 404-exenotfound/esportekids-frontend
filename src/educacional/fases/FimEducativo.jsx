import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ESPORTES } from "../data/esportes";
import { desbloquearJogo } from "../../store/progressoSlice";
import { DICAS_FASES, MINIMO_PARA_LIBERAR, proximoJogo } from "./dicasFases";
import { QuizDasDicas } from "./QuizDasDicas";
import { BotaoLeitura } from "../components/BotaoLeitura";
import { useMaterias } from "../../api/materias";
import { useSalvarResultado } from "../../api/salvarResultado";
import "../styles/educacional.css";

// Fluxo do fim de cada jogo:
//   1) DESEMPENHO NO MINIGAME decide tudo: com MINIMO_PARA_LIBERAR pontos ou
//      mais a criança acessa o quiz e o próximo jogo é liberado; com menos,
//      o quiz fica bloqueado e ela precisa jogar o minigame de novo.
//   2) Quem passou vê: revisão das dicas -> quiz -> resultado -> tela de fim.
// A tela de fim de jogo ORIGINAL é recebida em "children" e continua
// funcionando como antes. Ao jogar de novo este componente sai da tela e, no
// próximo fim, começa do zero.
export const FimEducativo = ({ esporte, vistas, pontosDoJogo = 0, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liberados = useSelector((s) => s.progresso.jogosLiberados);

  const dicas = DICAS_FASES[esporte];
  const proximo = proximoJogo(esporte);
  const jaLiberado = proximo === null || liberados.includes(proximo);
  const passouNoJogo = pontosDoJogo >= MINIMO_PARA_LIBERAR;

  // Sem pontos suficientes no minigame, o quiz nem aparece (etapa "bloqueado")
  const [etapa, setEtapa] = useState(passouNoJogo ? "revisao" : "bloqueado"); // bloqueado | revisao | quiz | resultado | concluido
  const [tentativa, setTentativa] = useState(0); // muda a key para refazer o quiz do zero
  const [acertos, setAcertos] = useState(0);

  // Cada quiz terminado vira uma partida no ranking (acertos * 10 pontos).
  // O esporte é casado com a matéria do banco pelo nome.
  const { data: materias } = useMaterias();
  const salvarResultado = useSalvarResultado();
  const materia = materias?.find((m) => m.nome === ESPORTES[esporte].nome);

  // Bom desempenho no minigame libera o próximo jogo (o quiz não bloqueia mais)
  useEffect(() => {
    if (passouNoJogo && proximo) dispatch(desbloquearJogo(proximo));
  }, [passouNoJogo, proximo, dispatch]);

  const terminarQuiz = (n) => {
    setAcertos(n);
    setEtapa("resultado");
    if (materia) {
      salvarResultado.mutate({ materia_id: materia.id, acertos: n, total_perguntas: dicas.length });
    }
  };

  const refazer = () => {
    setTentativa((t) => t + 1);
    setEtapa("quiz");
  };

  // ---------- 4) Tela de fim de jogo original + aviso ----------
  if (etapa === "bloqueado") {
    return (
      <>
        <div className="edu-fase edu-aviso edu-aviso-bloqueado">
          <p>
            🔒 <strong>Quiz bloqueado!</strong> Você fez <strong>{pontosDoJogo}</strong>{" "}
            {pontosDoJogo === 1 ? "ponto" : "pontos"} no minigame.
          </p>
          <p>
            Faça pelo menos <strong>{MINIMO_PARA_LIBERAR} pontos</strong> para fazer o quiz
            {proximo ? ` e liberar o ${ESPORTES[proximo].nome}` : ""}. Clique em{" "}
            <strong>JOGAR NOVAMENTE</strong> e tente outra vez! 💪
          </p>
        </div>
        {children}
      </>
    );
  }

  if (etapa === "concluido") {
    const liberou = passouNoJogo || jaLiberado;
    return (
      <>
        <div className="edu-fase edu-aviso">
          {proximo === null && liberou && <p>🏆 <strong>Você completou todas as fases do EsporteKids!</strong></p>}
          {proximo !== null && liberou && (
            <>
              <p>🎉 <strong>{ESPORTES[proximo].nome} liberado!</strong> Você já pode jogar a próxima fase.</p>
              <button type="button" className="edu-btn edu-btn-ok" onClick={() => navigate(`/${proximo}`)}>
                Jogar {ESPORTES[proximo].nome} ▶
              </button>
            </>
          )}
          {proximo !== null && !liberou && (
            <p>🔒 Para liberar o <strong>{ESPORTES[proximo].nome}</strong>, jogue de novo e faça pelo menos {MINIMO_PARA_LIBERAR} pontos no minigame.</p>
          )}
        </div>
        {children}
      </>
    );
  }

  // ---------- 1) Revisão das dicas ----------
  if (etapa === "revisao") {
    return (
      <div className="edu-fase">
        <div className="edu-card">
          <p className="edu-titulo-pixel">📖 RELEMBRE AS DICAS</p>
          <p className="edu-texto">Leia com atenção: as perguntas do quiz vêm destas dicas!</p>
          <ol className="edu-lista">
            {dicas.map((d, i) => (
              <li key={d.dica}>
                {d.dica} {i >= vistas && <span className="edu-nova">NOVA</span>}
              </li>
            ))}
          </ol>
          <div className="edu-acoes">
            <BotaoLeitura texto={dicas.map((d, i) => `Dica ${i + 1}. ${d.dica}`).join(" ")} />
            <button type="button" className="edu-btn edu-btn-ok" onClick={() => setEtapa("quiz")}>
              Ir para o quiz ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- 2) Quiz ----------
  if (etapa === "quiz") {
    return (
      <div className="edu-fase">
        <QuizDasDicas key={tentativa} perguntas={dicas.map((d) => d.pergunta)} onTerminar={terminarQuiz} />
      </div>
    );
  }

  // ---------- 3) Resultado do quiz ----------
  // Só segue em frente com a nota mínima (MINIMO_PARA_LIBERAR acertos):
  // abaixo disso a criança revê as dicas e refaz o quiz para melhorar a nota.
  const passouNoQuiz = acertos >= MINIMO_PARA_LIBERAR;

  return (
    <div className="edu-fase">
      <div className="edu-card edu-centro">
        <p className="edu-titulo-pixel">{passouNoQuiz ? "🎉 QUIZ CONCLUÍDO!" : "📚 QUASE LÁ!"}</p>
        <p className="edu-emoji-grande">{passouNoQuiz ? "🏆" : "📚"}</p>
        <p className="edu-texto">
          Você acertou <strong>{acertos} de {dicas.length}</strong>.{" "}
          {acertos === dicas.length
            ? "Perfeito!"
            : passouNoQuiz
              ? "Quer rever as dicas e tentar de novo?"
              : `Acerte pelo menos ${MINIMO_PARA_LIBERAR} para continuar. Reveja as dicas e tente de novo!`}
        </p>
        {salvarResultado.isSuccess && (
          <p className="edu-texto">🏅 <strong>+{salvarResultado.data.pontuacao} pontos</strong> no ranking!</p>
        )}
        {salvarResultado.isError && (
          <p className="edu-texto">⚠️ Não deu para salvar seus pontos no ranking agora.</p>
        )}
        <div className="edu-acoes edu-centro">
          {acertos < dicas.length && (
            <>
              <button type="button" className="edu-btn" onClick={() => setEtapa("revisao")}>📖 Rever dicas</button>
              <button type="button" className="edu-btn" onClick={refazer}>🔄 Tentar o quiz de novo</button>
            </>
          )}
          {passouNoQuiz && (
            <button type="button" className="edu-btn edu-btn-ok" onClick={() => setEtapa("concluido")}>Continuar ▶</button>
          )}
        </div>
      </div>
    </div>
  );
};
