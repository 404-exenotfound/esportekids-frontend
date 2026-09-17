import { PIXEL } from "../utils/constantes";
import { CORES_CORREDOR } from "../utils/corredor";
import { rect } from "./rect";

// Atleta desenhado em blocos (grade de 10 x 15 blocos de PIXEL px).
// Bem caracterizado: cabelo, faixa na testa, regata numerada, calção, meias
// e chuteiras de pico.
export function desenharCorredor(ctx, originX, originY, jumping, frame) {
  const b = (col, row, w, h, color) =>
    rect(ctx, originX + col * PIXEL, originY + row * PIXEL, w * PIXEL, h * PIXEL, color);

  const OUTLINE = CORES_CORREDOR.contorno;
  const HAIR = CORES_CORREDOR.cabelo;
  const HAIR_LIGHT = CORES_CORREDOR.cabeloClaro;
  const SKIN = CORES_CORREDOR.pele;
  const SKIN_SHADE = CORES_CORREDOR.peleSombra;
  const BAND = CORES_CORREDOR.faixa;
  const JERSEY = CORES_CORREDOR.regata;
  const JERSEY_LIGHT = CORES_CORREDOR.regataClara;
  const NUMBER = CORES_CORREDOR.numero;
  const SHORTS = CORES_CORREDOR.calcao;
  const SHORTS_DARK = CORES_CORREDOR.calcaoEscuro;
  const SOCK = CORES_CORREDOR.meia;
  const SHOE = CORES_CORREDOR.chuteira;
  const SPIKE = CORES_CORREDOR.cravo;
  const WRIST = CORES_CORREDOR.munhequeira;

  // Contorno geral (silhueta escura por trás, típico de sprite 8-bit bem definido)
  b(2, -1, 6, 1, OUTLINE);
  b(1, 4, 8, 1, OUTLINE);
  b(0, 10, 10, 1, OUTLINE);

  // Cabeça e cabelo (duas tonalidades pra dar volume)
  b(3, 0, 4, 1, HAIR);
  b(2, 1, 2, 1, HAIR_LIGHT);
  b(4, 1, 4, 1, HAIR);
  b(2, 2, 6, 1, BAND); // faixa na testa
  b(2, 3, 6, 2, SKIN); // rosto
  b(6, 3, 2, 1, SKIN_SHADE); // sombra lateral do rosto

  // Tronco / regata com sombreado e número duplo
  b(1, 5, 8, 1, JERSEY);
  b(1, 6, 8, 3, JERSEY);
  b(1, 6, 2, 3, JERSEY_LIGHT); // luz lateral na regata
  b(3, 7, 1, 1, NUMBER);
  b(4, 7, 1, 1, NUMBER); // número "10" no peito

  // Braços (mudam de posição conforme o frame de corrida / pulo) com munhequeira
  if (jumping) {
    b(0, 6, 1, 2, SKIN);
    b(0, 7, 1, 1, WRIST);
    b(9, 5, 1, 2, SKIN);
  } else if (frame === 0) {
    b(0, 5, 1, 2, SKIN);
    b(0, 6, 1, 1, WRIST);
    b(9, 7, 1, 2, SKIN);
  } else {
    b(0, 7, 1, 2, SKIN);
    b(0, 8, 1, 1, WRIST);
    b(9, 5, 1, 2, SKIN);
  }

  // Calção com listra lateral
  b(2, 9, 6, 2, SHORTS);
  b(2, 9, 1, 2, SHORTS_DARK);
  b(7, 9, 1, 2, SHORTS_DARK);

  // Pernas + meias com listra + chuteiras com detalhe de cravo
  if (jumping) {
    b(2, 11, 2, 2, SKIN);
    b(6, 11, 2, 2, SKIN);
    b(2, 13, 2, 1, SOCK);
    b(6, 13, 2, 1, SOCK);
    b(2, 14, 2, 1, SHOE);
    b(6, 14, 2, 1, SHOE);
    b(3, 14, 1, 1, SPIKE);
    b(7, 14, 1, 1, SPIKE);
  } else if (frame === 0) {
    b(1, 11, 2, 3, SKIN);
    b(6, 11, 2, 2, SKIN);
    b(1, 14, 2, 1, SHOE);
    b(6, 13, 2, 1, SOCK);
    b(6, 14, 2, 1, SHOE);
    b(1, 13, 2, 1, SOCK);
    b(2, 14, 1, 1, SPIKE);
    b(7, 14, 1, 1, SPIKE);
  } else {
    b(3, 11, 2, 2, SKIN);
    b(7, 11, 2, 3, SKIN);
    b(3, 13, 2, 1, SOCK);
    b(3, 14, 2, 1, SHOE);
    b(7, 14, 2, 1, SHOE);
    b(7, 13, 2, 1, SOCK);
    b(4, 14, 1, 1, SPIKE);
    b(8, 14, 1, 1, SPIKE);
  }
}