// ============================================================================
// rect — desenha um retângulo de cor sólida (base de toda a pixel art)
// ----------------------------------------------------------------------------
// Arredonda as coordenadas para não "borrar" o pixel art e aproveita o
// fillRect nativo do canvas, que é a primitiva mais rápida disponível.
// ============================================================================

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}