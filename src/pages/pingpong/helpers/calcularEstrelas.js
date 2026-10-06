// ============================================================================
// calcularEstrelas — quantidade de estrelas ganhas na partida
// ----------------------------------------------------------------------------
// De 0 a 3 estrelas de acordo com os pontos feitos (partida de 5 tentativas).
// ============================================================================

export function calcularEstrelas(pontos) {
  if (pontos >= 4) return 3; // quase perfeito → 3 estrelas
  if (pontos >= 2) return 2; // bom → 2 estrelas
  if (pontos >= 1) return 1; // participou → 1 estrela
  return 0; // ainda dá para melhorar
}