import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FASES,
  GRAVITY,
  GROUND_Y,
  JUMP_VELOCITY,
  MAX_HEARTS,
  PIXEL,
  PLAYER_H,
  PLAYER_W,
  PLAYER_X,
  STARS_TO_WIN,
  TEMPO_INVENCIVEL,
  VELOCIDADE_INICIAL,
} from "../utils/constantes";

import { dadosIniciais } from "../helpers/dadosIniciais";
import { velocidadeDoMomento } from "../helpers/velocidadeDoMomento";
import { velocidadeExibida } from "../helpers/velocidadeExibida";
import { rotuloDificuldade } from "../helpers/rotuloDificuldade";
import { corDificuldade } from "../helpers/corDificuldade";
import { gerarObstaculo } from "../helpers/gerarObstaculo";
import { proximoObstaculoEm } from "../helpers/proximoObstaculoEm";
import { gerarEstrela } from "../helpers/gerarEstrela";
import { proximoEstrelaEm } from "../helpers/proximoEstrelaEm";
import { detectarColisao } from "../helpers/detectarColisao";
import { coletouEstrela } from "../helpers/coletouEstrela";
import { desenharCena } from "../helpers/desenharCena";

// Concentra todo o estado e todas as regras da corrida. A tela apenas consome
// o que sai daqui — ela não decide nada.
export function useAtletismo() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  const [gameState, setGameState] = useState(FASES.START);
  const [stars, setStars] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [displaySpeed, setDisplaySpeed] = useState(1);

  const dataRef = useRef(null);
  if (dataRef.current === null) dataRef.current = dadosIniciais();

  const resetGame = useCallback(() => {
    dataRef.current = dadosIniciais();
    setStars(0);
    setHearts(MAX_HEARTS);
    setDisplaySpeed(1);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState(FASES.PLAYING);
  }, [resetGame]);

  // Pulo: disparo IMEDIATO e direto na referência mutável, sem setTimeout,
  // sem debounce e sem esperar o próximo tick de React -> zero delay perceptível.
  const iniciarPulo = useCallback(() => {
    const d = dataRef.current;
    if (!d.isJumping) {
      d.velocityY = JUMP_VELOCITY;
      d.isJumping = true;
    }
  }, []);

  const voltarParaHome = useCallback(
    () => navigate("/home?menu=jogar"),
    [navigate]
  );

  // ÚNICO input do jogo: tecla ESPAÇO (nada de clique/toque para pular)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (e.repeat) return; // evita repetição de tecla segurada, não gera delay
      if (gameState === FASES.PLAYING) {
        iniciarPulo();
      } else {
        startGame();
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState, iniciarPulo, startGame]);

  // Loop principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(time - lastTimeRef.current, 40);
      lastTimeRef.current = time;

      const d = dataRef.current;

      if (gameState === FASES.PLAYING) {
        d.elapsed += dt;
        // Começa bem devagar e sobe aos poucos até um teto, atingindo o máximo
        // perto dos 26s — pensado para uma fase de ~20 a 30s.
        d.speed = velocidadeDoMomento(d.elapsed);
        setDisplaySpeed(velocidadeExibida(d.speed));

        // Física do pulo — aplicada a cada frame, sem atraso desde o keydown
        d.velocityY += GRAVITY;
        d.playerY += d.velocityY * (dt / 16.67);
        if (d.playerY >= GROUND_Y - PLAYER_H) {
          d.playerY = GROUND_Y - PLAYER_H;
          d.velocityY = 0;
          d.isJumping = false;
        }

        // Animação de corrida (frames trocados em passos, estilo 8-bit)
        if (!d.isJumping) {
          d.runFrameTimer += dt * (d.speed / VELOCIDADE_INICIAL);
          if (d.runFrameTimer > 90) {
            d.runFrameTimer = 0;
            d.runFrame = d.runFrame === 0 ? 1 : 0;
          }
        }

        d.groundOffset = (d.groundOffset + d.speed * (dt / 16.67)) % (PIXEL * 8);

        // Obstáculos — intervalo sempre randomizado (nunca uma sequência
        // fixa/previsível). minGap garante tempo de reação seguro mesmo com a
        // pista mais rápida; randomExtra varia bastante para que a posição de
        // cada barreira nunca se repita.
        d.nextObstacleIn -= dt;
        if (d.nextObstacleIn <= 0) {
          d.obstacles.push(gerarObstaculo());
          d.nextObstacleIn = proximoObstaculoEm(d.speed);
        }
        d.obstacles.forEach((o) => (o.x -= d.speed * (dt / 16.67)));
        d.obstacles = d.obstacles.filter((o) => o.x + o.w > -10);

        // Estrelas
        d.nextStarIn -= dt;
        if (d.nextStarIn <= 0) {
          d.stars.push(gerarEstrela());
          d.nextStarIn = proximoEstrelaEm();
        }
        d.stars.forEach((s) => (s.x -= d.speed * (dt / 16.67)));
        d.stars = d.stars.filter((s) => s.x > -20 && !s.collected);

        if (d.invincibleTimer > 0) d.invincibleTimer -= dt;

        // Colisão jogador x obstáculo
        const jogador = { x: PLAYER_X, y: d.playerY, w: PLAYER_W, h: PLAYER_H };

        if (d.invincibleTimer <= 0) {
          for (const o of d.obstacles) {
            if (detectarColisao(jogador, o, GROUND_Y)) {
              d.heartsLeft -= 1;
              d.invincibleTimer = TEMPO_INVENCIVEL;
              setHearts(d.heartsLeft);
              if (d.heartsLeft <= 0) setGameState(FASES.GAMEOVER);
              break;
            }
          }
        }

        // Coleta de estrelas
        d.stars.forEach((s) => {
          if (s.collected) return;
          if (coletouEstrela(jogador, s)) {
            s.collected = true;
            d.starsCollected += 1;
            setStars(d.starsCollected);
            if (d.starsCollected >= STARS_TO_WIN) setGameState(FASES.WIN);
          }
        });
      }

      desenharCena(ctx, d);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [gameState]);

  const rotulo = rotuloDificuldade(displaySpeed);
  const cor = corDificuldade(displaySpeed);

  return {
    canvasRef,
    gameState,
    stars,
    hearts,
    rotulo,
    cor,
    startGame,
    voltarParaHome,
  };
}