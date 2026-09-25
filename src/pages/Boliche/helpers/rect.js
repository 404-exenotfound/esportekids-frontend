// ============================================================================
// rect — retângulo sólido, primitiva de todo o pixel art da tela
// ============================================================================

export function rect(ctx, x, y, w, h, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
