import { ZONAS } from "../utils/zonas";

// Destino ÚNICO e final da bola — ela não para no meio do caminho: se for
// defesa, vai direto para onde o goleiro vai pular; se for gol, vai direto
// para dentro da rede (mais funda, por isso a escala menor).
export function trajetoDaBola(indiceZona, defendeu) {
  const alvo = ZONAS[indiceZona];
  return defendeu
    ? { x: alvo.x, y: alvo.y, escala: 0.55 }
    : { x: alvo.x, y: alvo.y - 6, escala: 0.32 };
}
