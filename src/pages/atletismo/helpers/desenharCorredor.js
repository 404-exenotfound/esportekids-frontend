import { PALETA_ATLETA, SPRITES_ATLETA } from "../utils/corredor";
import { rect } from "./rect";

const ESCALA = 3; // grade 12x20 -> 36x60 px (altura original, pixel inteiro)

// Atleta igual ao do Basquete Campeão, em sprite completo por pose:
// parado | corrida (frame 0/1) | impulso | voo | pouso | comemoracao | triste
// Os pés ficam em originY + 60 (linha do chão), exceto nas poses de voo.
export function desenharCorredor(ctx, originX, originY, pose, frame) {
  const nome =
    pose === "corrida" ? (frame === 0 ? "corrida0" : "corrida1") : pose;
  const mapa = SPRITES_ATLETA[nome] || SPRITES_ATLETA.parado;

  mapa.forEach((linha, j) => {
    for (let i = 0; i < linha.length; i++) {
      const cor = PALETA_ATLETA[linha[i]];
      if (!cor) continue;
      rect(ctx, originX + i * ESCALA, originY + j * ESCALA, ESCALA, ESCALA, cor);
    }
  });
}
