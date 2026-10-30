import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistorico, useRanking } from "../../api/usePartidas";
import "../../educacional/styles/educacional.css";

const MEDALHAS = ["🥇", "🥈", "🥉"];

const formatarData = (iso) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

// Loading/erro/vazio iguais para as duas listas
const EstadoDaLista = ({ query, vazio, children }) => {
  if (query.isPending) return <p className="edu-texto">Carregando...</p>;
  if (query.isError) {
    return (
      <div className="edu-feedback edu-feedback-erro" role="status">
        😅 {query.error.message}{" "}
        <button type="button" className="edu-btn" onClick={() => query.refetch()}>Tentar de novo</button>
      </div>
    );
  }
  if (!query.data.length) return <p className="edu-texto">{vazio}</p>;
  return children;
};

const Ranking = () => {
  const usuario = useSelector((s) => s.user);
  const textoGrande = useSelector((s) => s.progresso.textoGrande);
  const ranking = useRanking();
  const historico = useHistorico();

  return (
    <div className={`edu-pagina ${textoGrande ? "edu-grande" : ""}`}>
      <div className="edu-topo">
        <h1 className="edu-titulo-pagina">RANKING</h1>
        <div className="edu-acoes" style={{ margin: 0 }}>
          <Link to="/home" className="edu-btn">⬅ Início</Link>
        </div>
      </div>

      {!usuario.token ? (
        <div className="edu-card edu-centro">
          <p className="edu-emoji-grande">🔒</p>
          <p className="edu-texto">Entre na sua conta (no menu inicial) para ver o ranking e suas partidas.</p>
        </div>
      ) : (
        <>
          <div className="edu-card">
            <p className="edu-titulo-pixel">🏆 TOP 10</p>
            <EstadoDaLista query={ranking} vazio="Ninguém jogou ainda. Seja o primeiro!">
              <ol className="list-unstyled edu-texto">
                {ranking.data?.map((r) => (
                  <li key={r.id} style={{ fontWeight: r.id === usuario.id ? "bold" : undefined }}>
                    {MEDALHAS[r.posicao - 1] ?? `${r.posicao}º`} {r.nome} — {r.pontuacao_total} pts ({r.partidas} partidas)
                  </li>
                ))}
              </ol>
            </EstadoDaLista>
          </div>

          <div className="edu-card">
            <p className="edu-titulo-pixel">📜 MINHAS PARTIDAS</p>
            <EstadoDaLista query={historico} vazio="Faça um quiz em Aprender para aparecer aqui!">
              <ul className="list-unstyled edu-texto">
                {historico.data?.map((p) => (
                  <li key={p.id}>
                    {formatarData(p.created_at)} · {p.materias.join(", ")} · {p.acertos}/{p.total_perguntas} acertos · {p.pontuacao} pts
                  </li>
                ))}
              </ul>
            </EstadoDaLista>
          </div>
        </>
      )}
    </div>
  );
};

export default Ranking;
