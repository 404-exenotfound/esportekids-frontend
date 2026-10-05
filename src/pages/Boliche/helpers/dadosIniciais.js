// ============================================================================
// dadosIniciais — estado mutável da partida (vive em um ref, fora do React)
// ----------------------------------------------------------------------------
// Tudo que muda a 60 quadros por segundo fica aqui: posição da bola, pinos,
// mira, força e o andamento da partida. A tela só lê o que o hook devolve.
// ============================================================================

import { criarPinos } from "./criarPinos";
import {
  ETAPAS,
  LINHA_LANCAMENTO,
  MIRA_VELOCIDADE,
  PISTA_BASE,
  PISTA_TOPO,
} from "../utils/constantes";

export function dadosIniciais() {
  return {
    etapa: ETAPAS.MIRA,

    // Controles
    miraY: (PISTA_TOPO + PISTA_BASE) / 2,
    miraVel: MIRA_VELOCIDADE,
    forca: 0,
    forcaVel: 0,

    // Bola
    bola: {
      x: LINHA_LANCAMENTO,
      y: (PISTA_TOPO + PISTA_BASE) / 2,
      vx: 0,
      vy: 0,
      rolando: false,
      naCanaleta: false,
      giro: 0,
    },

    // Pinos
    pinos: criarPinos(),

    // Andamento da partida
    rodada: 1,
    bolaDaRodada: 1,
    pontos: 0,
    derrubadosNaRodada: 0,
    derrubadosNestaBola: 0,
    fecharRodada: false,

    // Temporizadores
    tempoRolando: 0,
    tempoBanner: 0,
    tempo: 0,
  };
}
