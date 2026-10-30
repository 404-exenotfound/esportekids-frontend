import {
  ATLETA_INICIO_X,
  CHANCES_POR_JOGO,
  FASES_SALTO,
  GROUND_Y,
  PLAYER_H,
  POTENCIA_INICIAL,
} from "../utils/constantes";

export function ventoDaFase(faseIndex) {
  const cfg = FASES_SALTO[faseIndex];
  if (!cfg?.temVento) return 0;
  // -0,4 a +0,4 m/s, em passos de 0,1 — mostrado ao jogador antes de correr
  return Math.round((Math.random() * 0.8 - 0.4) * 10) / 10;
}

export function dadosIniciais() {
  return {
    // etapa interna do salto: pronto -> corrida -> voo -> resultado
    etapa: "pronto",
    etapaTimer: 0,
    tempoTotal: 0,

    faseIndex: 0,
    progresso: 0, // fases completas (alimenta dicas/informações e o quiz final)
    chances: CHANCES_POR_JOGO, // saltos que ainda podem falhar na partida
    ultimoSalto: 0,
    bateuMetaAtual: false,
    melhorDistancia: 0,
    vento: ventoDaFase(0),

    // atleta no mundo (a câmera acompanha ele)
    atletaX: ATLETA_INICIO_X,
    atletaY: GROUND_Y - PLAYER_H,
    velX: 0,
    velY: 0,
    cameraX: 0,
    groundOffset: 0,

    potencia: POTENCIA_INICIAL,
    runFrame: 0,
    runFrameTimer: 0,
    pose: "parado", // parado | corrida | impulso | voo | pouso | comemoracao | triste

    // salto atual
    decolagemX: null,
    qualidadeImpulso: null, // "perfeito" | "tabua" | "antes"
    esticouPernas: false,
    marcaPousoX: null,
    bandeiraJuiz: null, // null | "branca" | "vermelha"
    torcida: "normal", // normal | festa | oh
    resultado: null, // { falta, distancia, meta, bateuMeta, perfeito, textoJuiz }
  };
}

// Prepara um novo salto (mesma fase), mantendo progresso e melhor marca.
export function prepararTentativa(d) {
  d.etapa = "pronto";
  d.etapaTimer = 0;
  d.atletaX = ATLETA_INICIO_X;
  d.atletaY = GROUND_Y - PLAYER_H;
  d.velX = 0;
  d.velY = 0;
  d.cameraX = 0;
  d.potencia = POTENCIA_INICIAL;
  d.pose = "parado";
  d.decolagemX = null;
  d.qualidadeImpulso = null;
  d.esticouPernas = false;
  d.marcaPousoX = null;
  d.bandeiraJuiz = null;
  d.torcida = "normal";
  d.resultado = null;
  d.bateuMetaAtual = false;
  d.vento = ventoDaFase(d.faseIndex);
}
