// ============================================================================
// resolverColisao — batida entre dois corpos redondos (bola/pino ou pino/pino)
// ----------------------------------------------------------------------------
// Faz duas coisas: separa os corpos que ficaram sobrepostos (senão eles
// "grudam") e troca velocidade na direção da batida, proporcional à massa.
// Devolve true quando houve batida — o hook usa isso para tocar o som.
// ============================================================================

import { RESTITUICAO } from "../utils/constantes";

export function resolverColisao(a, b, raioA, raioB, massaA, massaB) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distancia = Math.hypot(dx, dy);
  const soma = raioA + raioB;

  if (distancia === 0 || distancia >= soma) return false;

  // Vetor normal (direção da batida)
  const nx = dx / distancia;
  const ny = dy / distancia;

  // Separa na proporção inversa da massa: o leve é quem mais sai do lugar
  const sobreposicao = soma - distancia;
  const totalMassa = massaA + massaB;
  a.x -= nx * sobreposicao * (massaB / totalMassa);
  a.y -= ny * sobreposicao * (massaB / totalMassa);
  b.x += nx * sobreposicao * (massaA / totalMassa);
  b.y += ny * sobreposicao * (massaA / totalMassa);

  // Velocidade relativa na direção da batida
  const vrel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (vrel <= 0) return false; // já estão se afastando

  const impulso = ((1 + RESTITUICAO) * vrel) / (1 / massaA + 1 / massaB);

  a.vx -= (impulso / massaA) * nx;
  a.vy -= (impulso / massaA) * ny;
  b.vx += (impulso / massaB) * nx;
  b.vy += (impulso / massaB) * ny;

  return true;
}
