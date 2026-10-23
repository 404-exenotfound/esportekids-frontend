import { rect } from "./rect";

// Torcida no padrão do basquete: cabecinha + corpinho colorido.
// humor "festa" = todo mundo pulando com os bracinhos pra cima;
// "oh" = paradinhos (decepção da falta); "normal" = balancinho leve.
export function desenharTorcida(ctx, gente, tempoSegundos, humor) {
  if (!gente) return;
  const t = tempoSegundos || 0;
  for (const g of gente) {
    let pulo = 0;
    if (humor === "festa") pulo = -Math.round(Math.abs(Math.sin(t * 9 + g.f)) * 5);
    else if (humor === "normal") pulo = -Math.round(Math.abs(Math.sin(t * 3 + g.f)) * 1.5);
    const y = g.y + pulo;
    rect(ctx, g.x, y + 4, 8, 8, g.cor); // corpinho
    rect(ctx, g.x + 1, y, 6, 5, g.pele); // cabeça
    rect(ctx, g.x + 1, y, 6, 2, g.cabelo); // cabelo
    if (humor === "festa") {
      rect(ctx, g.x - 2, y + 1, 2, 5, g.pele);
      rect(ctx, g.x + 8, y + 1, 2, 5, g.pele);
    }
    if (humor === "oh" && ((g.x + g.y) % 4 === 0)) {
      rect(ctx, g.x, y - 2, 2, 4, g.pele); // mão na cabeça
      rect(ctx, g.x + 6, y - 2, 2, 4, g.pele);
    }
  }
}
