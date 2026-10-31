import { Confete } from "./Confete";

// Placa do juiz depois de cada salto: bandeira, distância medida e meta.
export const ResultadoSalto = ({ resultado }) => {
  if (!resultado) return null;
  const { falta, distancia, meta, bateuMeta, perfeito, textoJuiz, chancesRestantes } = resultado;
  const fmt = (m) => m.toFixed(2).replace(".", ",");
  const avisoChances =
    chancesRestantes > 0
      ? ` • Tente de novo! ${chancesRestantes === 1 ? "Última chance!" : `Restam ${chancesRestantes} chances.`}`
      : " • Acabaram as chances!";

  return (
    <div
      className={`atl-resultado ${falta ? "atl-resultado--falta" : bateuMeta ? "atl-resultado--meta" : "atl-resultado--valido"}`}
      role="status"
      aria-live="polite"
    >
      {bateuMeta && <Confete />}
      <div className="atl-resultado-bandeira">{falta ? "🚩" : "🏳️"}</div>
      <p className="atl-resultado-titulo">
        {falta ? "FALTA!" : bateuMeta ? "META BATIDA!" : "SALTO VÁLIDO!"}
      </p>
      {!falta && (
        <p className="atl-resultado-distancia">
          {fmt(distancia)} <span>metros</span>
        </p>
      )}
      <p className="atl-resultado-juiz">Juiz: {textoJuiz}</p>
      {!falta && (
        <p className="atl-resultado-meta">
          Meta da fase: {fmt(meta)}m
          {perfeito ? " • Impulso perfeito! ✨" : ""}
          {bateuMeta ? " • Próxima fase liberada!" : avisoChances}
        </p>
      )}
      {falta && (
        <p className="atl-resultado-meta">
          Salto anulado! Cuidado com a linha vermelha!{avisoChances}
        </p>
      )}
    </div>
  );
};
