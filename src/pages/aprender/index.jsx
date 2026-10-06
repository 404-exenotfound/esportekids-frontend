import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ESPORTES, LISTA_ESPORTES, ESTRELAS_POR_ESPORTE } from "../../educacional/data/esportes";
import { estrelasDoEsporte } from "../../educacional/data/conquistas";
import { alternarTextoGrande } from "../../store/progressoSlice";
import { AprendaAntes } from "../../educacional/components/AprendaAntes";
import { CuriosidadeBanner } from "../../educacional/components/CuriosidadeBanner";
import { Quiz } from "../../educacional/components/Quiz";
import { SaudeValores } from "../../educacional/components/SaudeValores";
import { Estrelas } from "../../educacional/components/Estrelas";
import "../../educacional/styles/educacional.css";

const ABAS = [
  { id: "aprenda", rotulo: "📖 Aprenda" },
  { id: "curiosidade", rotulo: "💡 Curiosidades" },
  { id: "quiz", rotulo: "❓ Quiz" },
  { id: "matematica", rotulo: "🧮 Matemática" },
  { id: "saude", rotulo: "💚 Saúde e valores" },
];

const Aprender = () => {
  const [params, setParams] = useSearchParams();
  const [aba, setAba] = useState("aprenda");
  const progresso = useSelector((s) => s.progresso);
  const dispatch = useDispatch();

  // Dá para abrir direto num esporte: /aprender?esporte=futebol
  const pedido = params.get("esporte");
  const esporte = ESPORTES[pedido] ? pedido : "basquete";
  const dados = ESPORTES[esporte];

  return (
    <div className={`edu-pagina ${progresso.textoGrande ? "edu-grande" : ""}`}>
      <div className="edu-topo">
        <h1 className="edu-titulo-pagina">APRENDER</h1>
        <div className="edu-acoes" style={{ margin: 0 }}>
          <button type="button" className="edu-btn" onClick={() => dispatch(alternarTextoGrande())} aria-pressed={progresso.textoGrande}>
            {progresso.textoGrande ? "A− Texto normal" : "A+ Texto grande"}
          </button>
          <Link to="/album" className="edu-btn">📒 Meu álbum</Link>
          <Link to="/home" className="edu-btn">⬅ Início</Link>
        </div>
      </div>

      <div className="edu-esportes" role="tablist" aria-label="Escolha um esporte">
        {LISTA_ESPORTES.map((e) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={e.id === esporte}
            className={`edu-esporte ${e.id === esporte ? "ativo" : ""}`}
            style={{ "--cor": e.cor }}
            onClick={() => setParams({ esporte: e.id })}
          >
            {e.emoji} {e.nome}
          </button>
        ))}
      </div>

      <div className="edu-acoes edu-faixa" style={{ margin: "0 0 14px", alignItems: "center" }}>
        <strong>Suas estrelas em {dados.nome}:</strong>
        <Estrelas total={estrelasDoEsporte(progresso, esporte)} max={ESTRELAS_POR_ESPORTE(dados)} />
      </div>

      <div className="edu-abas">
        {ABAS.map((a) => (
          <button key={a.id} type="button" className={`edu-aba ${a.id === aba ? "ativa" : ""}`} onClick={() => setAba(a.id)}>
            {a.rotulo}
          </button>
        ))}
      </div>

      {aba === "aprenda" && <AprendaAntes esporte={esporte} />}
      {aba === "curiosidade" && <CuriosidadeBanner key={esporte} esporte={esporte} />}
      {aba === "quiz" && <Quiz key={`${esporte}-quiz`} esporte={esporte} tipo="quiz" />}
      {aba === "matematica" && <Quiz key={`${esporte}-mat`} esporte={esporte} tipo="matematica" />}
      {aba === "saude" && <SaudeValores esporte={esporte} />}
    </div>
  );
};

export default Aprender;
