import { ESPORTES } from "../data/esportes";
import { BotaoLeitura } from "./BotaoLeitura";

export const SaudeValores = ({ esporte }) => {
  const e = ESPORTES[esporte];
  const texto = `Saúde: ${e.saude.join(" ")} Valores: ${e.valores.join(" ")}`;

  return (
    <div className="edu-card">
      <p className="edu-titulo-pixel">💚 SAÚDE E VALORES</p>

      <h3 className="edu-subtitulo">🥤 Cuide do seu corpo</h3>
      <ul className="edu-lista">
        {e.saude.map((s) => <li key={s}>{s}</li>)}
      </ul>

      <h3 className="edu-subtitulo">🤝 Jogue com o coração</h3>
      <ul className="edu-lista">
        {e.valores.map((v) => <li key={v}>{v}</li>)}
      </ul>

      <div className="edu-acoes">
        <BotaoLeitura texto={texto} />
      </div>
    </div>
  );
};
