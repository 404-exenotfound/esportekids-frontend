import { Confete } from "./Confete";

// Placa do juiz depois de cada salto: bandeira, distância medida e meta.
export const ResultadoSalto = ({ resultado }) => {
  if (!resultado) return null;
  const { falta, distancia, meta, bateuMeta, perfeito, textoJuiz } = resultado;
  const fmt = (m) => m.toFixed(2).replace(".", ",");

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
          {bateuMeta ? " • Próxima fase liberada!" : " • Tente de novo!"}
        </p>
      )}
      {falta && (
        <p className="atl-resultado-meta">
          Salto anulado! Não valeu a distância. Cuidado com a linha vermelha!
        </p>
      )}
    </div>
  );
};
