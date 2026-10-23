import {
  CAIXA_FIM_X,
  CAIXA_INICIO_X,
  DISTANCIA_MAXIMA_METROS,
  GROUND_Y,
  LINHA_DE_FALTA_X,
  PIXEL,
  PIXEL_POR_METRO,
  TABUA_INICIO_X,
} from "../utils/constantes";
import { rect } from "./rect";

// Tábua de impulsão (branca) + linha de falta (vermelha) + caixa de areia
// marcada metro a metro até 10 m, com a bandeirinha da META da fase.
export function desenharCaixaDeAreia(ctx, camX, metaMetros, marcaPousoX, etapa) {
  const sx = (wx) => wx - camX;
  const chao = GROUND_Y;

  // Tábua de impulsão
  const tabuaX = sx(TABUA_INICIO_X);
  rect(ctx, tabuaX, chao - 4, LINHA_DE_FALTA_X - TABUA_INICIO_X, 6, "#FFFFFF");
  rect(ctx, tabuaX, chao - 4, LINHA_DE_FALTA_X - TABUA_INICIO_X, 2, "#DDE6F0");
  // Linha de falta (se pisar depois dela = FALTA)
  rect(ctx, sx(LINHA_DE_FALTA_X), chao - 6, 8, 8, "#E63946");

  // Caixa de areia
  const caixaX = sx(CAIXA_INICIO_X);
  const caixaW = CAIXA_FIM_X - CAIXA_INICIO_X;
  rect(ctx, caixaX - 4, chao - 2, caixaW + 8, 44, "#8B5A2B"); // borda de madeira
  rect(ctx, caixaX, chao, caixaW, 38, "#EBCB8B");
  rect(ctx, caixaX, chao, caixaW, 6, "#F6E3B4");

  // Texturinha da areia (pontinhos fixos)
  for (let i = 0; i < 46; i++) {
    const px = caixaX + ((i * 53) % Math.max(caixaW - 8, 1));
    const py = chao + 10 + ((i * 29) % 22);
    rect(ctx, px, py, 4, 2, "#D9B96F");
  }

  // Linhas e números de cada metro (0 a 10 m a partir da linha de falta)
  ctx.font = "800 11px 'Baloo 2', sans-serif";
  ctx.textAlign = "center";
  for (let m = 1; m <= DISTANCIA_MAXIMA_METROS; m++) {
    const mx = sx(LINHA_DE_FALTA_X + m * PIXEL_POR_METRO);
    if (mx < -20 || mx > 820) continue;
    rect(ctx, mx - 1, chao, 2, 38, m % 5 === 0 ? "#B22234" : "rgba(139,90,43,0.55)");
    ctx.fillStyle = "#7A4A12";
    ctx.fillText(`${m}m`, mx, chao + 52);
  }

  // Bandeirinha da META desta fase
  const metaX = sx(LINHA_DE_FALTA_X + metaMetros * PIXEL_POR_METRO);
  if (metaX > -30 && metaX < 830) {
    rect(ctx, metaX, chao - 30, 3, 30, "#FFFFFF");
    rect(ctx, metaX + 3, chao - 30, 20, 12, "#FFC93C");
    ctx.fillStyle = "#1F1F1F";
    ctx.font = "800 8px 'Baloo 2', sans-serif";
    ctx.fillText("META", metaX + 13, chao - 21);
  }

  // Marca do pouso + linha de medição oficial (da linha de falta até a marca)
  if (marcaPousoX != null && (etapa === "resultado" || etapa === "pouso")) {
    const marcaX = sx(marcaPousoX);
    // craterinha na areia
    rect(ctx, marcaX - 14, chao + 4, 28, 8, "#C9A353");
    rect(ctx, marcaX - 8, chao + 2, 16, 6, "#B98F3E");
    // Linha de medição
    rect(ctx, sx(LINHA_DE_FALTA_X), chao - 10, marcaX - sx(LINHA_DE_FALTA_X), 3, "#1D3557");
    rect(ctx, sx(LINHA_DE_FALTA_X), chao - 14, 3, 10, "#1D3557");
    rect(ctx, marcaX, chao - 14, 3, 10, "#1D3557");
    // Bandeirinha fincada na marca
    rect(ctx, marcaX, chao - 26, 3, 22, "#FFFFFF");
    rect(ctx, marcaX + 3, chao - 26, 17, 10, "#06D6A0");
  }

  // Cones que separam a pista da caixa
  rect(ctx, sx(CAIXA_INICIO_X - 16), chao - 10, 10, 10, "#F77F00");
  rect(ctx, sx(CAIXA_FIM_X + 6), chao - 10, 10, 10, "#F77F00");
  void PIXEL;
}
