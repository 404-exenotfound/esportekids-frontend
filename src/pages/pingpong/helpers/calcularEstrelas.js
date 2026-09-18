// ============================================================================
// calcularEstrelas — quantidade de estrelas ganhas na partida
// ----------------------------------------------------------------------------
// De 0 a 3 estrelas de acordo com os pontos feitos. Usado na tela final para
// premiar a criança (⭐ repetidas). As "regras" são simples e generosas.
// ============================================================================

export function calcularEstrelas(pontos) {
  if (pontos >= 8) return 3; // quase perfeito → 3 estrelas
  if (pontos >= 5) return 2; // bom → 2 estrelas
  if (pontos >= 2) return 1; // participou → 1 estrela
  return 0; // ainda dá para melhorar
}