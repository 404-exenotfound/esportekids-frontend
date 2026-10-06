// ============================================================================
// desenharRastroBola — cauda (rastro) da bolinha em movimento
// ----------------------------------------------------------------------------
// Guarda as últimas posições da bola e desenha quadradinhos brancos atrás
// dela, com transparência crescente: o mais antigo é quase invisível e o mais
// novo é mais forte. Isso dá a sensação de velocidade e torna a bola mais
// fácil de acompanhar com os olhos.
// ============================================================================

import { rect } from "./rect";

export function desenharRastroBola(ctx, rastro) {
  const total = rastro.length;
  for (let i = 0; i < total; i++) {
    const p = rastro[i];
    // Transparência: aumenta quanto mais "novo" for o ponto do rastro
    const alpha = total === 1 ? 0.15 : 0.06 + (i / (total - 1)) * 0.18;
    ctx.globalAlpha = alpha;
    rect(ctx, p.x - 5, p.y - 5, 10, 10, "#ffffff");
  }
  ctx.globalAlpha = 1; // restaura a opacidade para o resto da cena
}