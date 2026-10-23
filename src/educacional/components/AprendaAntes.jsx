import { ESPORTES } from "../data/esportes";
import { BotaoLeitura } from "./BotaoLeitura";

// "Aprenda antes de jogar" — origem, regras e equipamentos do esporte.
// Pode ser usado dentro de uma TelaIntro:  <AprendaAntes esporte="futebol" />
export const AprendaAntes = ({ esporte }) => {
  const e = ESPORTES[esporte];
  const textoCompleto = `${e.origem} Regras: ${e.regras.join(" ")} Você vai precisar de: ${e.equipamentos.join(", ")}.`;

  return (
    <div className="edu-card">
      <p className="edu-titulo-pixel">
        {e.emoji} APRENDA SOBRE {e.nome.toUpperCase()}
      </p>

      <h3 className="edu-subtitulo">📜 De onde veio?</h3>
      <p className="edu-texto">{e.origem}</p>

      <h3 className="edu-subtitulo">📏 Regras básicas</h3>
      <ul className="edu-lista">
        {e.regras.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h3 className="edu-subtitulo">🎒 O que se usa</h3>
      <div className="edu-chips">
        {e.equipamentos.map((q) => (
          <span key={q} className="edu-chip">{q}</span>
        ))}
      </div>

      <div className="edu-acoes">
        <BotaoLeitura texto={textoCompleto} />
      </div>
    </div>
  );
};
