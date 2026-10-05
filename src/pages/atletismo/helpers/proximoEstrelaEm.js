import { INTERVALO_ESTRELA_BASE, INTERVALO_ESTRELA_EXTRA } from "../utils/constantes";

export function proximoEstrelaEm() {
  return INTERVALO_ESTRELA_BASE + Math.random() * INTERVALO_ESTRELA_EXTRA;
}