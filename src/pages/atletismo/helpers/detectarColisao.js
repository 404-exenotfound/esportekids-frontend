// Caixa do atleta levemente afrouxada (hitbox generosa e justa com o desenho).
export function detectarColisao(jogador, obstaculo, chao) {
  const px = jogador.x + 6;
  const py = jogador.y + 6;
  const pw = jogador.w - 12;
  const ph = jogador.h - 10;

  const ox = obstaculo.x;
  const oy = chao - obstaculo.h;

  return px < ox + obstaculo.w && px + pw > ox && py < oy + obstaculo.h && py + ph > oy;
}