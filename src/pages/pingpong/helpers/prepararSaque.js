// ============================================================================
// prepararSaque — monta a bola pronta para o saque
// ----------------------------------------------------------------------------
// Cria a bola no ponto de saque (lado do adversário) e copia a velocidade do
// saque para d.vx/d.vy — é aí que a bola realmente ganha movimento. Também
// limpa o rastro (cauda) e o estado do flash "VAI!".
// ============================================================================

import { servirBola } from "./servirBola";

export function prepararSaque(d) {
  d.ball = servirBola(d.pontos);
  d.vx = d.ball.vx; // velocidade horizontal do saque
  d.vy = d.ball.vy; // velocidade vertical do saque
  d.rastro = []; // zera a cauda da bola para o novo saque
  d.flashRestante = 0; // reseta o flash "VAI!"
}