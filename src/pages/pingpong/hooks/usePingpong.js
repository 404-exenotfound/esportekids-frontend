// ============================================================================
// usePingpong — "cérebro" do minigame de ping-pong
// ----------------------------------------------------------------------------
// Controla todo o ciclo de vida da partida:
//   • estado React (fase, pontos, tentativas, frases...)
//   • dados mutáveis em dataRef (posições, velocidades, efeitos)
//   • inputs do jogador (mouse/toque + teclado)
//   • o loop principal com requestAnimationFrame (movimento, colisões, saques)
//   • desenho da cena no canvas a cada quadro
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FASES,
  GAME_HEIGHT,
  IA_X,
  LIMITE_DIREITA,
  LIMITE_ESQUERDA,
  LIMITE_RAQUETE_BAIXO,
  LIMITE_RAQUETE_TOPO,
  MENSAGENS_RODAPE,
  PAREDE_BAIXO,
  PAREDE_TOPO,
  PLAYER_X,
  RAQUETE_H,
  RAQUETE_W,
  TEMPO_RESULTADO,
  TEMPO_SAQUE,
  TOTAL_TENTATIVAS,
  VELOCIDADE_JOGADOR_TECLADO,
} from "../utils/constantes";
import {
  FRASES_ERRO,
  FRASES_PONTO,
  FRASES_TORCIDA_ERRO,
  FRASES_TORCIDA_PONTO,
} from "../utils/frases";

import { calcularEstrelas } from "../helpers/calcularEstrelas";
import { dadosIniciais } from "../helpers/dadosIniciais";
import { desenharCena } from "../helpers/desenharCena";
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { detectarColisaoRaquete } from "../helpers/detectarColisaoRaquete";
import { moverInimigo } from "../helpers/moverInimigo";
import { nivelDoMomento } from "../helpers/nivelDoMomento";
import { prepararSaque } from "../helpers/prepararSaque";
import { sorteiaFrase } from "../helpers/sorteiaFrase";
import { velocidadeDoMomento } from "../helpers/velocidadeDoMomento";

import { useSons } from "./useSons";

export function usePingpong() {
  const navigate = useNavigate(); // para voltar à tela inicial

  // --- Estado visível (usado para renderizar o HTML) ------------------------
  const [fase, setFase] = useState(FASES.INTRO);
  const [pontos, setPontos] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [somLigado, setSomLigado] = useState(true);
  const [fraseResultado, setFraseResultado] = useState("");
  const [fraseTorcida, setFraseTorcida] = useState("");

  // --- Referências estáveis --------------------------------------------------
  const canvasRef = useRef(null); // o <canvas> da Arena
  const dataRef = useRef(null); // dados mutáveis da partida (muda a cada quadro)
  if (dataRef.current === null) dataRef.current = dadosIniciais();

  const { garantirAudio, tocarToque, tocarPonto, tocarErro } = useSons(somLigado);

  // Liga/desliga o som (usado no botão 🔊/🔇 do placar)
  const alternarSom = useCallback(() => setSomLigado((s) => !s), []);

  // Volta para a tela inicial (rota /home)
  const voltarParaHome = useCallback(() => navigate("/home"), [navigate]);

  // --- Começar uma nova partida ---------------------------------------------
  const iniciarJogo = useCallback(() => {
    garantirAudio(); // libera o áudio (exige um clique do usuário)
    dataRef.current = dadosIniciais(); // reset completo dos dados
    const d = dataRef.current;
    prepararSaque(d); // posiciona a bola pronta para o saque
    d.fase = FASES.SERVINDO; // entra na contagem regressiva
    d.serveRestante = TEMPO_SAQUE;
    // Reinicia todos os estados visíveis
    setPontos(0);
    setTentativa(0);
    setHistorico([]);
    setFraseResultado("");
    setFraseTorcida("");
    setFase(FASES.SERVINDO);
  }, [garantirAudio]);

  // --- Entrada do jogador (mouse/toque + teclado) ----------------------------
  useEffect(() => {
    // Converte a posição do mouse (pixels da tela) para o Y do jogo (0-400)
    const acharY = (clientY) => {
      const r = canvasRef.current.getBoundingClientRect();
      return ((clientY - r.top) / r.height) * GAME_HEIGHT;
    };
    // Ao mover o mouse: salva como alvo e liga o controle por ponteiro
    const onPointerMove = (e) => {
      const d = dataRef.current;
      d.pointerActive = true;
      d.targetY = acharY(e.clientY);
    };
    // Ao tocar/clicar: mesmo comportamento (arrastar com o dedo)
    const onPointerDown = (e) => {
      const d = dataRef.current;
      d.pointerActive = true;
      d.targetY = acharY(e.clientY);
    };
    // Setas ↑↓ e teclas W/S movem a raquete (libera o controle por teclado)
    const onKeyDown = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        dataRef.current.keys.up = true;
        dataRef.current.pointerActive = false;
      }
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        dataRef.current.keys.down = true;
        dataRef.current.pointerActive = false;
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") dataRef.current.keys.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") dataRef.current.keys.down = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // --- Loop principal do jogo (render + física) ------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let rafId; // id do requestAnimationFrame (para cancelar)
    let last = 0; // timestamp do último quadro (para calcular dt)

    // Move a raquete do jogador conforme o controle ativo
    const moverJogador = (d, dt) => {
      if (d.pointerActive && d.targetY !== null) {
        // Com mouse/toque: interpola suavemente até o alvo
        d.playerY += (d.targetY - d.playerY) * Math.min(1, dt * 16);
      } else {
        // Com teclado: anda com velocidade constante
        if (d.keys.up) d.playerY -= VELOCIDADE_JOGADOR_TECLADO * dt;
        if (d.keys.down) d.playerY += VELOCIDADE_JOGADOR_TECLADO * dt;
      }
      // Mantém a raquete dentro dos limites da tela
      d.playerY = Math.max(LIMITE_RAQUETE_TOPO, Math.min(LIMITE_RAQUETE_BAIXO, d.playerY));
    };

    // Rebate a bola: o ângulo depende de onde ela acertou a raquete
    // (acertar no topo ou na base manda a bola para o lado, como num jogo real)
    const rebater = (d, raquete, dir) => {
      const velocidade = velocidadeDoMomento(d.pontos);
      const centro = raquete.y + raquete.h / 2;
      const meio = raquete.h / 2;
      const offset = Math.max(-1, Math.min(1, (d.ball.y - centro) / meio)); // -1..1
      const angulo = offset * 0.6; // até ~34°
      d.vx = dir * velocidade.bola * Math.cos(angulo);
      d.vy = velocidade.bola * Math.sin(angulo);
      // Garante um mínimo de componente vertical senão fica reto demais
      if (Math.abs(d.vy) < 24) d.vy = (d.vy < 0 ? -1 : 1) * velocidade.bola * 0.18;
      tocarToque(); // som de "toc"
    };

    // Finaliza a tentativa (ponto ou erro) e mostra o banner com as frases
    const resolverResultado = (d, ehPonto) => {
      d.tentativa += 1;
      setTentativa(d.tentativa);
      if (ehPonto) {
        d.pontos += 1;
        setPontos(d.pontos);
        d.historico = [...d.historico, "ponto"];
        setHistorico(d.historico);
        setFraseResultado(sorteiaFrase(FRASES_PONTO));
        setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_PONTO));
        tocarPonto();
      } else {
        d.historico = [...d.historico, "erro"];
        setHistorico(d.historico);
        setFraseResultado(sorteiaFrase(FRASES_ERRO));
        setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_ERRO));
        tocarErro();
      }
      d.fase = ehPonto ? FASES.PONTO : FASES.ERRO;
      d.resultadoRestante = TEMPO_RESULTADO; // tempo do banner
      setFase(d.fase);
    };

    // Uma "volta" do loop: chamado a cada quadro da animação
    const step = (t) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 1000, 0.04); // segundos; limita em 40ms
      last = t;

      const d = dataRef.current;

      // --- Fase SERVINDO: contagem regressiva + bola balançando --------------
      if (d.fase === FASES.SERVINDO) {
        moverJogador(d, dt);
        d.serveTempoTotal += dt;
        // Balança a bola em torno da posição base (visual só, sem física)
        d.ball.y = d.ball.baseY + Math.sin(d.serveTempoTotal * 5) * 6;
        d.serveRestante -= dt * 1000;
        if (d.serveRestante <= 0) {
          d.flashRestante = 500; // solta o flash "VAI!"
          d.fase = FASES.JOGANDO;
          setFase(FASES.JOGANDO);
        }
      }

      // --- Fase JOGANDO: física da bola + colisões ---------------------------
      else if (d.fase === FASES.JOGANDO) {
        moverJogador(d, dt);
        const velocidade = velocidadeDoMomento(d.pontos);
        moverInimigo(d, velocidade, dt); // IA do adversário

        // Movimento da bola
        d.ball.x += d.vx * dt;
        d.ball.y += d.vy * dt;

        // Efeitos de partida
        if (d.flashRestante > 0) d.flashRestante -= dt * 1000; // conta o "VAI!"
        d.rastro.push({ x: d.ball.x, y: d.ball.y }); // guarda posição p/ cauda
        if (d.rastro.length > 6) d.rastro.shift();

        // Quique nas paredes (topo e base) — inverte o Y e dá um impulso mínimo
        if (d.ball.y - d.ball.metade < PAREDE_TOPO) {
          d.ball.y = PAREDE_TOPO + d.ball.metade;
          d.vy = Math.abs(d.vy);
          if (Math.abs(d.vy) < 36) d.vy = 36;
          tocarToque();
        } else if (d.ball.y + d.ball.metade > PAREDE_BAIXO) {
          d.ball.y = PAREDE_BAIXO - d.ball.metade;
          d.vy = -Math.abs(d.vy);
          if (Math.abs(d.vy) < 36) d.vy = -36;
          tocarToque();
        }

        // Retângulos de colisão das duas raquetes
        const raqueteJogador = {
          x: PLAYER_X - RAQUETE_W / 2,
          y: d.playerY - RAQUETE_H / 2,
          w: RAQUETE_W,
          h: RAQUETE_H,
        };
        const raqueteIa = {
          x: IA_X - RAQUETE_W / 2,
          y: d.aiY - RAQUETE_H / 2,
          w: RAQUETE_W,
          h: RAQUETE_H,
        };

        // Rebate ao bater na raquete do jogador (bola indo para a esquerda)
        // ou na raquete da IA (bola indo para a direita)
        if (d.vx < 0 && detectarColisaoRaquete(d.ball, raqueteJogador)) {
          d.ball.x = raqueteJogador.x + raqueteJogador.w + d.ball.metade;
          rebater(d, raqueteJogador, 1);
        } else if (d.vx > 0 && detectarColisaoRaquete(d.ball, raqueteIa)) {
          d.ball.x = raqueteIa.x - d.ball.metade;
          rebater(d, raqueteIa, -1);
        }

        // Saiu pela esquerda = ERRO do jogador; pela direita = PONTO
        if (d.ball.x - d.ball.metade < LIMITE_ESQUERDA) {
          resolverResultado(d, false);
        } else if (d.ball.x + d.ball.metade > LIMITE_DIREITA) {
          resolverResultado(d, true);
        }
      }

      // --- Fase PONTO/ERRO: congela a bola e mostra o banner -----------------
      else if (d.fase === FASES.PONTO || d.fase === FASES.ERRO) {
        moverInimigo(d, velocidadeDoMomento(d.pontos), dt);
        d.resultadoRestante -= dt * 1000;
        if (d.resultadoRestante <= 0) {
          if (d.tentativa >= TOTAL_TENTATIVAS) {
            d.fase = FASES.FIM_DE_JOGO; // acabaram as bolas
          } else {
            prepararSaque(d); // prepara a bola para a próxima tentativa
            d.serveRestante = TEMPO_SAQUE;
            d.fase = FASES.SERVINDO;
          }
          setFase(d.fase);
        }
      }

      // Desenha a cena e agenda o próximo quadro
      desenharCena(ctx, d);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId); // para o loop ao desmontar
      last = 0;
    };
  }, [tocarToque, tocarPonto, tocarErro]);

  // --- Valores derivados usados pelo HTML ------------------------------------
  const nivel = nivelDoMomento(pontos);
  const emJogo = fase !== FASES.INTRO && fase !== FASES.FIM_DE_JOGO;

  return {
    canvasRef,
    emJogo, // true quando a partida está em andamento (esconde a tela intro)
    mostrarFimDeJogo: fase === FASES.FIM_DE_JOGO,
    mostrarBanner: fase === FASES.PONTO || fase === FASES.ERRO,
    bannerTipo: fase === FASES.PONTO ? "ponto" : "erro",
    tentativaExibida: Math.min(tentativa, TOTAL_TENTATIVAS),
    pontos,
    bolinhas: historico, // bolinhas pintadas no placar
    nivel,
    somLigado,
    alternarSom,
    fraseResultado,
    fraseTorcida,
    mensagemRodape: MENSAGENS_RODAPE[fase] ?? "",
    estrelas: calcularEstrelas(pontos),
    emojiFinal: emojiDoResultadoFinal(pontos),
    iniciarJogo,
    voltarParaHome,
  };
}