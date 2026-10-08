import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LISTA_ESPORTES, TOTAL_ESTRELAS } from "../../educacional/data/esportes";
import { CONQUISTAS, estrelasDoEsporte, totalDeEstrelas } from "../../educacional/data/conquistas";
import { resetarProgresso, liberarTodosOsJogos } from "../../store/progressoSlice";
import { ESPORTES } from "../../educacional/data/esportes";
import { ORDEM_JOGOS } from "../../educacional/fases/dicasFases";
import { CartaEsporte } from "../../educacional/components/CartaEsporte";
import "../../educacional/styles/educacional.css";

const Album = () => {
  const progresso = useSelector((s) => s.progresso);
  const dispatch = useDispatch();
  const liberados = progresso.jogosLiberados;
  const total = totalDeEstrelas(progresso);
  const porcento = Math.round((total / TOTAL_ESTRELAS) * 100);

  const apagar = () => {
    if (window.confirm("Apagar todas as estrelas, conquistas e jogos liberados? Isso não pode ser desfeito.")) {
      dispatch(resetarProgresso());
    }
  };

  return (
    <div className={`edu-pagina ${progresso.textoGrande ? "edu-grande" : ""}`}>
      <div className="edu-topo">
        <h1 className="edu-titulo-pagina">ÁLBUM</h1>
        <div className="edu-acoes" style={{ margin: 0 }}>
          <Link to="/aprender" className="edu-btn edu-btn-ok">📖 Aprender mais</Link>
          <Link to="/home" className="edu-btn">⬅ Início</Link>
        </div>
      </div>

      <div className="edu-card">
        <p className="edu-titulo-pixel">⭐ MEU PROGRESSO</p>
        <div className="edu-resumo">
          <strong className="edu-texto" style={{ margin: 0 }}>{total} de {TOTAL_ESTRELAS} estrelas ({porcento}%)</strong>
          <div className="edu-barra" role="progressbar" aria-valuenow={porcento} aria-valuemin={0} aria-valuemax={100}>
            <div style={{ width: `${porcento}%` }} />
          </div>
        </div>
        <p className="edu-texto" style={{ marginTop: 12 }}>
          Ganhe estrelas respondendo ao quiz e à matemática de cada esporte para abrir as cartas!
        </p>
      </div>

      <div className="edu-card">
        <p className="edu-titulo-pixel">🎮 FASES</p>
        <div className="edu-conquistas">
          {ORDEM_JOGOS.map((id, i) => {
            const ok = liberados.includes(id);
            return (
              <div key={id} className={`edu-conquista ${ok ? "" : "bloqueada"}`}>
                <span className="edu-conquista-emoji">{ok ? ESPORTES[id].emoji : "🔒"}</span>
                <div>
                  <strong>{i + 1}. {ESPORTES[id].nome}</strong>
                  <span>{ok ? "Liberado" : "Passe no quiz da fase anterior"}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="edu-acoes">
          <Link to="/home" className="edu-btn edu-btn-ok">▶ Jogar</Link>
          <button type="button" className="edu-btn" onClick={() => dispatch(liberarTodosOsJogos())}>
            🔓 Liberar todos os jogos (modo apresentação)
          </button>
        </div>
      </div>

      <div className="edu-grade-cartas">
        {LISTA_ESPORTES.map((e) => (
          <CartaEsporte key={e.id} esporte={e.id} estrelas={estrelasDoEsporte(progresso, e.id)} />
        ))}
      </div>

      <div className="edu-card">
        <p className="edu-titulo-pixel">🏆 CONQUISTAS</p>
        <div className="edu-conquistas">
          {CONQUISTAS.map((c) => {
            const ok = c.ok(progresso);
            return (
              <div key={c.id} className={`edu-conquista ${ok ? "" : "bloqueada"}`}>
                <span className="edu-conquista-emoji">{ok ? c.emoji : "🔒"}</span>
                <div>
                  <strong>{c.nome}</strong>
                  <span>{c.descricao}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="edu-acoes">
          <button type="button" className="edu-btn edu-btn-perigo" onClick={apagar}>🗑 Apagar progresso</button>
        </div>
      </div>
    </div>
  );
};

export default Album;
