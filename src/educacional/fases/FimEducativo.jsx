import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ESPORTES } from "../data/esportes";
import { desbloquearJogo } from "../../store/progressoSlice";
import { DICAS_FASES, MINIMO_PARA_LIBERAR, TOTAL_DICAS, proximoJogo } from "./dicasFases";
import { QuizDasDicas } from "./QuizDasDicas";
import { BotaoLeitura } from "../components/BotaoLeitura";
import "../styles/educacional.css";

// Fluxo do fim de cada jogo:  revisão das dicas -> quiz -> resultado.
// Quando termina, mostra o aviso de liberação e a tela de fim de jogo ORIGINAL
// (recebida em "children"), que continua funcionando exatamente como antes.
// Ao jogar de novo este componente sai da tela e, no próximo fim, começa do zero.
export const FimEducativo = ({ esporte, vistas, children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liberados = useSelector((s) => s.progresso.jogosLiberados);

  const dicas = DICAS_FASES[esporte];
  const proximo = proximoJogo(esporte);
  const jaLiberado = proximo === null || liberados.includes(proximo);

  const [etapa, setEtapa] = useState("revisao"); // revisao | quiz | resultado | concluido
  const [tentativa, setTentativa] = useState(0); // muda a key para refazer o quiz do zero
  const [acertos, setAcertos] = useState(0);
  const [passou, setPassou] = useState(false);

  const terminarQuiz = (n) => {
    const ok = n >= MINIMO_PARA_LIBERAR;
    setAcertos(n);
    setPassou(ok);
    if (ok && proximo) dispatch(desbloquearJogo(proximo));
    setEtapa("resultado");
  };

  const refazer = () => {
    setTentativa((t) => t + 1);
    setEtapa("quiz");
  };

  // ---------- 4) Tela de fim de jogo original + aviso ----------
  if (etapa === "concluido") {
    const liberou = passou || jaLiberado;
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
            <p>🔒 Para liberar o <strong>{ESPORTES[proximo].nome}</strong>, jogue de novo e acerte {MINIMO_PARA_LIBERAR} de {TOTAL_DICAS} no quiz.</p>
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
            {jaLiberado && (
              <button type="button" className="edu-btn" onClick={() => setEtapa("concluido")}>
                Pular
              </button>
            )}
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
  return (
    <div className="edu-fase">
      <div className="edu-card edu-centro">
        <p className="edu-titulo-pixel">{passou ? "🎉 PASSOU DE FASE!" : "💪 QUASE LÁ!"}</p>
        <p className="edu-emoji-grande">{passou ? "🏆" : "📚"}</p>
        <p className="edu-texto">
          Você acertou <strong>{acertos} de {dicas.length}</strong>.{" "}
          {passou
            ? proximo
              ? `${ESPORTES[proximo].nome} foi liberado!`
              : "Você terminou todas as fases!"
            : `Para liberar o próximo jogo, acerte pelo menos ${MINIMO_PARA_LIBERAR}. Releia as dicas e tente de novo!`}
        </p>
        <div className="edu-acoes edu-centro">
          {passou ? (
            <button type="button" className="edu-btn edu-btn-ok" onClick={() => setEtapa("concluido")}>Continuar ▶</button>
          ) : (
            <>
              <button type="button" className="edu-btn" onClick={() => setEtapa("revisao")}>📖 Rever dicas</button>
              <button type="button" className="edu-btn edu-btn-ok" onClick={refazer}>🔄 Tentar o quiz de novo</button>
              <button type="button" className="edu-btn" onClick={() => setEtapa("concluido")}>Continuar sem liberar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
