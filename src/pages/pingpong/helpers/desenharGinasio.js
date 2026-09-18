// ============================================================================
// desenharGinasio — fundo da cena (arquibancada + parede + piso)
// ----------------------------------------------------------------------------
// Divide a tela em três faixas horizontais bem claras para não confundir a
// criança, todas FORA da área de jogo (que vai de y=30 a y=370):
//   1) Topo (y 0..30): arquibancada roxa com fileira de torcida + bandeirinhas
//   2) Parede clara ao fundo + borda amarela marcando o topo da quadra
//   3) Base (y 370..400): piso azul-escuro com uma faixa de brilho na borda
// ============================================================================

import { GAME_HEIGHT, GAME_WIDTH } from "../utils/constantes";
import { rect } from "./rect";

// Cores da torcida (cabelos/camisetas bem coloridas)
const CORES_TORCIDA = ["#e63946", "#ffd166", "#60a5fa", "#ffffff", "#06d6a0"];

export function desenharGinasio(ctx) {
  // Parede clara do ginásio (base de toda a tela)
  rect(ctx, 0, 0, GAME_WIDTH, GAME_HEIGHT, "#f6ead2");

  // Arquibancada (faixa roxa no topo, fora da área de jogo)
  rect(ctx, 0, 0, GAME_WIDTH, 30, "#40306b");
  rect(ctx, 0, 4, GAME_WIDTH, 4, "#5b4aa0"); // degrau superior mais claro

  // Fileira de torcida: cabecinhas coloridas separadas a cada 20 px
  for (let i = 0; i < 40; i++) {
    const cor = CORES_TORCIDA[(i * 2) % CORES_TORCIDA.length];
    rect(ctx, 10 + i * 20, 12, 6, 6, cor);
  }

  // Cordão de bandeirinhas na parte de baixo da arquibancada
  for (let i = 0; i < 20; i++) {
    const cor = CORES_TORCIDA[(i * 3 + 1) % CORES_TORCIDA.length];
    rect(ctx, 8 + i * 40, 22, 20, 7, cor);
  }

  // Borda amarela: marca o topo da quadra (onde a bola quica)
  rect(ctx, 0, 30, GAME_WIDTH, 3, "#ffd166");

  // Piso/cola da mesa na base da tela
  rect(ctx, 0, 370, GAME_WIDTH, GAME_HEIGHT - 370, "#164a72");
  rect(ctx, 0, 370, GAME_WIDTH, 3, "#37b6e0"); // brilho na borda da mesa
}