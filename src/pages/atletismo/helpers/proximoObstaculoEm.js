import {
  INTERVALO_OBSTACULO_BASE,
  INTERVALO_OBSTACULO_EXTRA,
  INTERVALO_OBSTACULO_MINIMO,
} from "../utils/constantes";

// Intervalo sempre randomizado: minGap garante tempo de reação seguro mesmo
// com a pista mais rápida; randomExtra varia bastante para que a posição de
// cada barreira nunca se repita.
export function proximoObstaculoEm(velocidade) {
  const minGap = Math.max(INTERVALO_OBSTACULO_BASE - velocidade * 22, INTERVALO_OBSTACULO_MINIMO);
  return minGap + Math.random() * INTERVALO_OBSTACULO_EXTRA;
}