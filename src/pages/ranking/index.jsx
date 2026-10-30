import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRanking } from "../../api/ranking";
import { useMinhaPosicao } from "../../api/minhaPosicao";
import { useHistorico } from "../../api/historico";
import "../../educacional/styles/educacional.css";
import "./styles/index.css";

const MEDALHAS = { 1: "🥇", 2: "🥈", 3: "🥉" };

const aproveitamento = ({ acertos, total_perguntas }) =>
  total_perguntas ? `${Math.round((acertos / total_perguntas) * 100)}%` : "—";

const formatarData = (iso) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const MinhaPosicao = () => {
  const { data: eu, isPending, isError } = useMinhaPosicao();

  if (isPending) return <p className="edu-texto">Carregando...</p>;
  if (isError) return <p className="edu-texto">Não deu para carregar sua posição.</p>;

  if (!eu.posicao) {
    return <p className="edu-texto">Você ainda não tem pontos. Jogue e faça o quiz do fim do jogo para entrar no ranking! 🎮</p>;
  }

  return (
    <div className="ranking-resumo">
      <div className="ranking-destaque">
        <span>{MEDALHAS[eu.posicao] ?? "🏅"}</span>
        <strong>{eu.posicao}º</strong>
        <small>de {eu.total_jogadores}</small>
      </div>
      <div className="ranking-numeros">
        <div><strong>{eu.pontuacao_total}</strong><span>pontos</span></div>
        <div><strong>{eu.partidas}</strong><span>partidas</span></div>
        <div><strong>{eu.melhor_partida}</strong><span>melhor partida</span></div>
        <div><strong>{aproveitamento(eu)}</strong><span>de acertos</span></div>
      </div>
    </div>
  );
};

const TopDez = () => {
  const meuId = useSelector((s) => s.user.id);
  const { data: ranking, isPending, isError, refetch } = useRanking();

  if (isPending) return <p className="edu-texto">Carregando...</p>;
  if (isError) {
    return (
      <div className="edu-acoes">
        <p className="edu-texto" style={{ margin: 0 }}>Não deu para carregar o ranking.</p>
        <button type="button" className="edu-btn" onClick={() => refetch()}>🔄 Tentar de novo</button>
      </div>
    );
  }
  if (!ranking.length) return <p className="edu-texto">Ninguém jogou ainda. Seja o primeiro! 🚀</p>;

  return (
    <ol className="ranking-lista">
      {ranking.map((j) => (
        <li
          key={j.id}
          className={`ranking-item ${j.posicao <= 3 ? `ranking-top${j.posicao}` : ""} ${j.id === meuId ? "ranking-eu" : ""}`}
        >
          <span className="ranking-posicao">{MEDALHAS[j.posicao] ?? `${j.posicao}º`}</span>
          <div className="ranking-jogador">
            <strong>{j.nome}{j.id === meuId && " (você)"}</strong>
            <span>{j.partidas} {j.partidas === 1 ? "partida" : "partidas"} · {aproveitamento(j)} de acertos · melhor: {j.melhor_partida}</span>
          </div>
          <span className="ranking-pontos">{j.pontuacao_total}<small>pts</small></span>
        </li>
      ))}
    </ol>
  );
};

const UltimasPartidas = () => {
  const { data: partidas, isPending, isError } = useHistorico();

  if (isPending) return <p className="edu-texto">Carregando...</p>;
  if (isError) return <p className="edu-texto">Não deu para carregar suas partidas.</p>;
  if (!partidas.length) return <p className="edu-texto">Nenhuma partida ainda.</p>;

  return (
    <ul className="ranking-historico">
      {partidas.map((p) => (
        <li key={p.id}>
          <span>{p.materias.join(", ")}</span>
          <span>{p.acertos}/{p.total_perguntas} acertos</span>
          <strong>+{p.pontuacao}</strong>
          <small>{formatarData(p.created_at)}</small>
        </li>
      ))}
    </ul>
  );
};

const Ranking = () => {
  const textoGrande = useSelector((s) => s.progresso.textoGrande);

  return (
    <div className={`edu-pagina ${textoGrande ? "edu-grande" : ""}`}>
      <div className="edu-topo">
        <h1 className="edu-titulo-pagina">RANKING</h1>
        <div className="edu-acoes" style={{ margin: 0 }}>
          <Link to="/home" className="edu-btn">⬅ Início</Link>
        </div>
      </div>

      <div className="edu-card">
        <p className="edu-titulo-pixel">⭐ MINHA POSIÇÃO</p>
        <MinhaPosicao />
      </div>

      <div className="edu-card">
        <p className="edu-titulo-pixel">🏆 TOP 10</p>
        <p className="edu-texto">Cada acerto no quiz do fim do jogo vale 10 pontos.</p>
        <TopDez />
      </div>

      <div className="edu-card">
        <p className="edu-titulo-pixel">🕹️ MINHAS ÚLTIMAS PARTIDAS</p>
        <UltimasPartidas />
      </div>
    </div>
  );
};

export default Ranking;
