import { ESPORTES, NIVEIS_CARTA, ESTRELAS_POR_ESPORTE } from "../data/esportes";
import { Estrelas } from "./Estrelas";

// Carta do álbum: cada parte é liberada conforme as estrelas ganhas no esporte.
export const CartaEsporte = ({ esporte, estrelas }) => {
  const e = ESPORTES[esporte];
  const max = ESTRELAS_POR_ESPORTE(e);
  const [nOrigem, nRegras, nSecreta, nMestre] = NIVEIS_CARTA.map((n) => estrelas >= n.minimo);
  // A curiosidade secreta é sempre a última da lista de cada esporte
  const secreta = e.curiosidades[e.curiosidades.length - 1];

  return (
    <article className={`edu-carta ${estrelas === 0 ? "edu-carta-bloqueada" : ""}`} style={{ "--cor-carta": e.cor }}>
      <header className="edu-carta-topo">
        <span className="edu-carta-emoji">{e.emoji}</span>
        <div>
          <h3 className="edu-carta-nome">{e.nome}</h3>
          <Estrelas total={estrelas} max={max} />
        </div>
        {nMestre && <span className="edu-selo" title="Mestre do esporte">🏅</span>}
      </header>

      <section className="edu-carta-parte">
        <h4>{NIVEIS_CARTA[0].emoji} {NIVEIS_CARTA[0].rotulo}</h4>
        {nOrigem ? <p>{e.origem}</p> : <p className="edu-trava">🔒 Ganhe {NIVEIS_CARTA[0].minimo} estrela para abrir</p>}
      </section>

      <section className="edu-carta-parte">
        <h4>{NIVEIS_CARTA[1].emoji} {NIVEIS_CARTA[1].rotulo}</h4>
        {nRegras ? (
          <>
            <ul>{e.regras.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="edu-equip">🎒 {e.equipamentos.join(" · ")}</p>
          </>
        ) : (
          <p className="edu-trava">🔒 Ganhe {NIVEIS_CARTA[1].minimo} estrelas para abrir</p>
        )}
      </section>

      <section className="edu-carta-parte">
        <h4>{NIVEIS_CARTA[2].emoji} {NIVEIS_CARTA[2].rotulo}</h4>
        {nSecreta ? <p>{secreta}</p> : <p className="edu-trava">🔒 Ganhe {NIVEIS_CARTA[2].minimo} estrelas para abrir</p>}
      </section>
    </article>
  );
};
