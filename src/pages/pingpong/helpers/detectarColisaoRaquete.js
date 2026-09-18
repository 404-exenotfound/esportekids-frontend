// ============================================================================
// detectarColisaoRaquete — colisão entre a bola e uma raquete
// ----------------------------------------------------------------------------
// Colisão do tipo AABB (retângulos): a bola é tratada como um quadrado de
// tamanho "bola.metade" e verifica se ela sobrepõe o retângulo da raquete.
// O pequeno "inset" (recuo) de 2px evita colisões repetidas na lateral.
// ============================================================================

export function detectarColisaoRaquete(bola, raquete) {
  const inset = 2;
  return (
    bola.x + bola.metade > raquete.x + inset &&
    bola.x - bola.metade < raquete.x + raquete.w - inset &&
    bola.y + bola.metade > raquete.y + inset &&
    bola.y - bola.metade < raquete.y + raquete.h - inset
  );
}