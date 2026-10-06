// ============================================================================
// calcularEstrelas — de 0 a 3 estrelas conforme os pontos da partida
// ----------------------------------------------------------------------------
// O máximo possível são 100 pontos (5 strikes). As faixas são generosas para
// que a criança quase sempre leve alguma estrela para casa.
// ============================================================================

export function calcularEstrelas(pontos) {
  if (pontos >= 70) return 3;
  if (pontos >= 45) return 2;
  if (pontos >= 20) return 1;
  return 0;
}
