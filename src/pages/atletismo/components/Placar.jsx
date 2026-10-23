const fmt = (m) => m.toFixed(2).replace(".", ",") + "m";

export const Placar = ({
  fase,
  totalFases,
  nomeFase,
  meta,
  ultimo,
  melhor,
  vento,
  temVento,
  potencia,
}) => (
  <div className="atl-painel-status">
    <div className="atl-status-item">
      <div className="atl-status-rotulo">FASE</div>
      <div className="atl-status-valor">
        {fase}/{totalFases}
      </div>
      <div className="atl-status-sub">{nomeFase}</div>
    </div>
    <div className="atl-status-item">
      <div className="atl-status-rotulo">🎯 META</div>
      <div className="atl-status-valor">{fmt(meta)}</div>
      <div className="atl-status-sub">caixa: 10m</div>
    </div>
    <div className="atl-status-item">
      <div className="atl-status-rotulo">📏 ÚLTIMO SALTO</div>
      <div className="atl-status-valor">{ultimo > 0 ? fmt(ultimo) : "—"}</div>
      <div className="atl-status-sub">medido pelo juiz</div>
    </div>
    <div className="atl-status-item">
      <div className="atl-status-rotulo">🏆 MELHOR SALTO</div>
      <div className="atl-status-valor">{melhor > 0 ? fmt(melhor) : "—"}</div>
      <div className="atl-status-sub">
        {temVento
          ? `vento ${vento > 0 ? "+" : ""}${String(vento).replace(".", ",")}`
          : "sem vento"}
      </div>
    </div>
    <div className="atl-status-item atl-status-potencia">
      <div className="atl-status-rotulo">⚡ POTÊNCIA</div>
      <div className="atl-potencia-barra" aria-label={`Potência ${potencia}%`}>
        <div
          className="atl-potencia-preenchimento"
          style={{
            width: `${potencia}%`,
            background:
              potencia < 40 ? "#EF476F" : potencia < 70 ? "#FFC93C" : "#06D6A0",
          }}
        />
      </div>
      <div className="atl-status-sub">{potencia}%</div>
    </div>
  </div>
);
