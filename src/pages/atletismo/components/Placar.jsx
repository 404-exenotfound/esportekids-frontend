const fmt = (m) => m.toFixed(2).replace(".", ",") + "m";

// HUD dentro do palco, no mesmo formato das caixinhas azuis dos outros jogos.
export const Placar = ({
  fase,
  totalFases,
  meta,
  ultimo,
  melhor,
  vento,
  temVento,
  potencia,
  chances,
  totalChances,
}) => (
  <div className="atl-hud">
    <div className="atl-caixa">
      <span className="atl-rotulo">FASE</span>
      <b>
        {fase}/{totalFases}
      </b>
    </div>
    <div className="atl-caixa" aria-label={`${chances} de ${totalChances} chances`}>
      <span className="atl-rotulo">CHANCES</span>
      <b>
        {"❤️".repeat(Math.max(0, chances))}
        {"🖤".repeat(Math.max(0, totalChances - chances))}
      </b>
    </div>
    <div className="atl-caixa">
      <span className="atl-rotulo">🎯 META</span>
      <b>{fmt(meta)}</b>
    </div>
    <div className="atl-caixa">
      <span className="atl-rotulo">ÚLTIMO</span>
      <b>{ultimo > 0 ? fmt(ultimo) : "—"}</b>
    </div>
    <div className="atl-caixa">
      <span className="atl-rotulo">🏆 MELHOR</span>
      <b>{melhor > 0 ? fmt(melhor) : "—"}</b>
    </div>
    {temVento && (
      <div className="atl-caixa">
        <span className="atl-rotulo">VENTO</span>
        <b>
          {vento > 0 ? "+" : ""}
          {String(vento).replace(".", ",")}
        </b>
      </div>
    )}
    <div className="atl-caixa" aria-label={`Potência ${potencia}%`}>
      <span className="atl-rotulo">⚡ POTÊNCIA</span>
      <div className="atl-potencia-barra">
        <div
          className="atl-potencia-preenchimento"
          style={{
            width: `${potencia}%`,
            background:
              potencia < 40 ? "#EF476F" : potencia < 70 ? "#FFC93C" : "#06D6A0",
          }}
        />
      </div>
    </div>
  </div>
);
