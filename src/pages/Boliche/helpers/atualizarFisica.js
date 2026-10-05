// ============================================================================
// atualizarFisica — um passo da simulação enquanto a bola está rolando
// ----------------------------------------------------------------------------
// Move a bola e os pinos, trata canaleta, batidas (bola/pino e pino/pino) e
// marca como "caído" todo pino que recebeu empurrão forte o bastante.
// Devolve os eventos do passo para o hook decidir quais sons tocar.
// ============================================================================

import { resolverColisao } from "./resolverColisao";
import {
  ATRITO_BOLA,
  ATRITO_PINO,
  BOLA_MASSA,
  BOLA_RAIO,
  CANALETA,
  FUNDO_X,
  PINO_MASSA,
  PINO_RAIO,
  PISTA_BASE,
  PISTA_TOPO,
  VELOCIDADE_MINIMA,
} from "../utils/constantes";

export function atualizarFisica(d, fator) {
  const eventos = { bateuPino: false, caiuNaCanaleta: false };
  const bola = d.bola;

  // Dois sub-passos por quadro: com a bola rápida isso evita que ela
  // "atravesse" um pino entre um quadro e outro.
  const passos = 2;
  const f = fator / passos;

  for (let passo = 0; passo < passos; passo++) {
    // --- Bola ---------------------------------------------------------------
    if (bola.rolando) {
      bola.x += bola.vx * f;
      bola.y += bola.vy * f;
      bola.vx *= Math.pow(ATRITO_BOLA, f);
      bola.vy *= Math.pow(ATRITO_BOLA, f);
      bola.giro += bola.vx * f * 0.08;

      // Saiu da pista pelos lados? Caiu na canaleta e não derruba mais nada.
      if (!bola.naCanaleta) {
        const passouEmCima = bola.y < PISTA_TOPO + BOLA_RAIO * 0.4;
        const passouEmBaixo = bola.y > PISTA_BASE - BOLA_RAIO * 0.4;

        if (passouEmCima || passouEmBaixo) {
          bola.naCanaleta = true;
          bola.vy = 0;
          bola.vx *= 0.75; // a bola perde ritmo ao cair na calha
          bola.y = passouEmCima
            ? PISTA_TOPO - CANALETA / 2
            : PISTA_BASE + CANALETA / 2;
          eventos.caiuNaCanaleta = true;
        }
      } else {
        // Dentro da canaleta a bola só desliza reto até o fundo
        bola.vy = 0;
      }

      // Chegou ao fundo: encosta na parede e a jogada acaba
      if (bola.x > FUNDO_X - BOLA_RAIO) {
        bola.x = FUNDO_X - BOLA_RAIO;
        bola.vx = 0;
        bola.rolando = false;
      }
    }

    // --- Pinos --------------------------------------------------------------
    for (const pino of d.pinos) {
      pino.x += pino.vx * f;
      pino.y += pino.vy * f;
      pino.vx *= Math.pow(ATRITO_PINO, f);
      pino.vy *= Math.pow(ATRITO_PINO, f);

      const velocidade = Math.hypot(pino.vx, pino.vy);

      // Empurrão forte o bastante derruba o pino (e ele começa a girar)
      if (!pino.caido && velocidade > VELOCIDADE_MINIMA) {
        pino.caido = true;
        pino.angulo = Math.atan2(pino.vy, pino.vx);
      }

      if (velocidade < 0.05) {
        pino.vx = 0;
        pino.vy = 0;
      }

      // Paredes do deck: o pino quica de leve em vez de sumir da tela
      if (pino.x > FUNDO_X - PINO_RAIO) {
        pino.x = FUNDO_X - PINO_RAIO;
        pino.vx = -Math.abs(pino.vx) * 0.35;
      }
      const limiteCima = PISTA_TOPO - CANALETA + PINO_RAIO;
      const limiteBaixo = PISTA_BASE + CANALETA - PINO_RAIO;
      if (pino.y < limiteCima) {
        pino.y = limiteCima;
        pino.vy = Math.abs(pino.vy) * 0.35;
      }
      if (pino.y > limiteBaixo) {
        pino.y = limiteBaixo;
        pino.vy = -Math.abs(pino.vy) * 0.35;
      }
    }

    // --- Batidas da bola nos pinos -----------------------------------------
    if (bola.rolando && !bola.naCanaleta) {
      for (const pino of d.pinos) {
        if (resolverColisao(bola, pino, BOLA_RAIO, PINO_RAIO, BOLA_MASSA, PINO_MASSA)) {
          eventos.bateuPino = true;
        }
      }
    }

    // --- Batidas entre pinos (é daqui que vem o efeito dominó) --------------
    for (let i = 0; i < d.pinos.length; i++) {
      for (let j = i + 1; j < d.pinos.length; j++) {
        if (resolverColisao(d.pinos[i], d.pinos[j], PINO_RAIO, PINO_RAIO, PINO_MASSA, PINO_MASSA)) {
          eventos.bateuPino = true;
        }
      }
    }
  }

  return eventos;
}
