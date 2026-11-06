// Lado menor da TELA abaixo disso (com toque como ponteiro principal) = celular.
const LIMITE_CELULAR = 600;

// Classifica o aparelho a partir de medidas puras (sem tocar no navegador),
// para dar para testar. O lado menor da tela física decide celular/tablet
// (não muda ao girar); a janela decide se está em pé (retrato).
export function classificarDispositivo({ toque, larguraTela, alturaTela, larguraJanela, alturaJanela }) {
  const retrato = alturaJanela > larguraJanela;
  if (!toque) return { tipo: "desktop", retrato };
  const ladoMenor = Math.min(larguraTela, alturaTela);
  return { tipo: ladoMenor < LIMITE_CELULAR ? "celular" : "tablet", retrato };
}
