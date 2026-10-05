// ============================================================================
// dadosIniciais — estado inicial do jogo
// ----------------------------------------------------------------------------
// Cria um objeto com todos os dados mutáveis da partida (posições, velocidades,
// fases e efeitos). É chamado no carregamento e a cada vez que o jogador clica
// em "COMEÇAR", garantindo que uma nova partida comece do zero.
// ============================================================================

import { FASES, LIMITE_RAQUETE_BAIXO } from "../utils/constantes";

export function dadosIniciais() {
  return {
    fase: FASES.INTRO, // começa na tela inicial
    playerY: LIMITE_RAQUETE_BAIXO / 2, // jogador começa no meio (vertical)
    aiY: LIMITE_RAQUETE_BAIXO / 2, // adversário também começa no meio
    targetY: null, // posição Y alvo do toque/mouse
    pointerActive: false, // verdadeiro quando controla com mouse/toque
    keys: { up: false, down: false }, // estado das teclas ↑↓ / W S
    ball: { x: 540, y: 180, baseY: 180 }, // bola no ponto de saque (direita)
    vx: 0, // velocidade horizontal da bola
    vy: 0, // velocidade vertical da bola
    aiWobbleT: 0, // relógio usado no "tremor" de mira da IA
    aiPasseioAlvo: LIMITE_RAQUETE_BAIXO / 2, // alvo do passeio no modo FÁCIL
    aiPasseioTempo: 0, // timer para trocar o alvo do passeio
    pontos: 0, // placar de pontos da partida
    tentativa: 0, // quantas bolas já foram jogadas
    historico: [], // resultado de cada tentativa ("ponto" ou "erro")
    rastro: [], // últimas posições da bola (efeito de cauda)
    serveRestante: 0, // tempo restante da contagem do saque (ms)
    serveTempoTotal: 0, // tempo acumulado para animar o anel/balanço
    flashRestante: 0, // tempo restante do flash "VAI!"
    resultadoRestante: 0, // tempo restante do banner de ponto/erro
  };
}