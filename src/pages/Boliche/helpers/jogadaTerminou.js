// ============================================================================
// jogadaTerminou — a bola acabou? (chegou ao fundo e tudo parou de se mexer)
// ----------------------------------------------------------------------------
// O tempo máximo é uma trava de segurança: mesmo que algum pino fique girando
// em câmera lenta, a jogada encerra e a criança não fica esperando.
// ============================================================================

import { PARADO, TEMPO_MAXIMO_ROLANDO } from "../utils/constantes";

export function jogadaTerminou(d) {
  if (d.tempoRolando >= TEMPO_MAXIMO_ROLANDO) return true;
  if (d.bola.rolando) return false;

  return d.pinos.every((p) => Math.hypot(p.vx, p.vy) < PARADO);
}
