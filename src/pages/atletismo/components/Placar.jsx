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
  <div className="atl-hud-wrap atl-hud-wrap--dentro">
    <div className="atl-hud">
      <div className="atl-caixa">
        <span className="atl-rotulo">FASE</span>
        <b>
          {fase}/{totalFases}
        </b>
        {nomeFase && <span className="atl-sub">{nomeFase}</span>}
      </div>
      <div className="atl-caixa">
        <span className="atl-rotulo">META</span>
        <b>{fmt(meta)}</b>
      </div>
      <div className="atl-caixa">
        <span className="atl-rotulo">ÚLTIMO SALTO</span>
        <b>{ultimo > 0 ? fmt(ultimo) : "—"}</b>
      </div>
      <div className="atl-caixa">
        <span className="atl-rotulo">MELHOR SALTO</span>
        <b>{melhor > 0 ? fmt(melhor) : "—"}</b>
        {temVento && (
          <span className="atl-sub">
            VENTO {vento > 0 ? "+" : ""}{String(vento).replace(".", ",")}
          </span>
        )}
      </div>
      <div className="atl-caixa atl-caixa--pot">
        <span className="atl-rotulo">POTÊNCIA</span>
        <div className="atl-pot-bar" aria-label={`Potência ${potencia}%`}>
          <div
            className="atl-pot-fill"
            style={{
              width: `${potencia}%`,
              background:
                potencia < 40 ? "#e63946" : potencia < 70 ? "#ffd166" : "#06d6a0",
            }}
          />
        </div>
        <b>{potencia}%</b>
      </div>
    </div>
  </div>
);
