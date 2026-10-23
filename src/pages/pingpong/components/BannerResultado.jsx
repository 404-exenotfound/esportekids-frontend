// ============================================================================
// BannerResultado — banner de ponto ou erro
// ----------------------------------------------------------------------------
// Aparece no meio da Arena logo após cada tentativa: mostra uma frase grande
// (do tipo "PONTAÇO! 🎉" ou "QUASE! 😅") com a "torcida" (frase menor) logo
// abaixo. A classe CSS "ponto"/"erro" muda a cor do painel.
// ============================================================================

export const BannerResultado = ({ tipo, frase, fraseTorcida }) => (
  <div className={`pp-aviso ${tipo === "ponto" ? "bom" : "ruim"}`}>
    {frase}
    {fraseTorcida && <small className="pp-aviso-sub">{fraseTorcida}</small>}
  </div>
);