// ============================================================================
// useBoliche — todo o estado e todas as regras do minigame de boliche
// ----------------------------------------------------------------------------
// A jogada tem 3 momentos, sempre com o MESMO botão (ESPAÇO ou toque na tela):
//   1) MIRA  — uma seta sobe e desce; aperte para travar a direção
//   2) FORÇA — a barrinha enche e esvazia; aperte para soltar a bola
//   3) ROLANDO — a física assume, os pinos caem e o resultado aparece
// A tela (index.jsx) só consome o que este hook devolve; ela não decide nada.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BOLAS_POR_RODADA,
  ETAPAS,
  FASES,
  FORCA_MINIMA,
  FORCA_VELOCIDADE,
  LINHA_LANCAMENTO,
  MIRA_MARGEM,
  MIRA_VELOCIDADE,
  PISTA_BASE,
  PISTA_TOPO,
  TEMPO_BANNER,
  TOTAL_PINOS,
  TOTAL_RODADAS,
  VELOCIDADE_BASE,
  VELOCIDADE_EXTRA,
} from "../utils/constantes";

import { dadosIniciais } from "../helpers/dadosIniciais";
import { criarPinos } from "../helpers/criarPinos";
import { atualizarFisica } from "../helpers/atualizarFisica";
import { jogadaTerminou } from "../helpers/jogadaTerminou";
import { resultadoDaBola } from "../helpers/resultadoDaBola";
import { desenharCena } from "../helpers/desenharCena";
import { calcularEstrelas } from "../helpers/calcularEstrelas";
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { useSons } from "./useSons";

export function useBoliche() {
  const navigate = useNavigate();

  // canvasRef precisa "avisar" quando o <canvas> troca de verdade: a tela de
  // fim de jogo desmonta a Arena (e o canvas junto) e "Jogar Novamente" monta
  // um <canvas> NOVO. Um useRef comum não é reativo, então o loop abaixo não
  // percebia a troca e continuava desenhando no canvas antigo (já fora da
  // tela) — por isso a tela ficava preta depois de reiniciar. Com um callback
  // ref + estado, o useEffect do loop principal é refeito sempre que o canvas
  // realmente muda.
  const [canvasEl, setCanvasEl] = useState(null);
  const canvasRef = useCallback((node) => {
    setCanvasEl(node);
  }, []);
  const rafRef = useRef(null);
  const ultimoTempoRef = useRef(0);
  const ultimaBatidaRef = useRef(0); // evita uma saraivada de sons no mesmo instante

  // --- Estado que a tela enxerga --------------------------------------------
  const [estado, setEstado] = useState(FASES.START);
  const [etapa, setEtapa] = useState(ETAPAS.MIRA);
  const [rodada, setRodada] = useState(1);
  const [bolaDaRodada, setBolaDaRodada] = useState(1);
  const [pontos, setPontos] = useState(0);
  const [pinosEmPe, setPinosEmPe] = useState(TOTAL_PINOS);
  const [banner, setBanner] = useState(null); // { tipo, frase, derrubados }
  const [somLigado, setSomLigado] = useState(true);

  const { garantirAudio, tocarLancamento, tocarBatida, tocarStrike, tocarErro } =
    useSons(somLigado);

  // --- Estado mutável da simulação (fora do React, para rodar a 60fps) ------
  const dRef = useRef(null);
  if (dRef.current === null) dRef.current = dadosIniciais();

  // Espelho do estado da partida, para o loop consultar sem virar dependência
  const estadoRef = useRef(estado);
  useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  const irParaEtapa = useCallback((novaEtapa) => {
    dRef.current.etapa = novaEtapa;
    setEtapa(novaEtapa);
  }, []);

  // --- Preparar a próxima bola ----------------------------------------------
  const prepararJogada = useCallback(() => {
    const d = dRef.current;
    const centroY = (PISTA_TOPO + PISTA_BASE) / 2;

    d.bola = {
      x: LINHA_LANCAMENTO,
      y: centroY,
      vx: 0,
      vy: 0,
      rolando: false,
      naCanaleta: false,
      giro: 0,
    };
    d.miraY = centroY;
    d.miraVel = MIRA_VELOCIDADE;
    d.forca = 0;
    d.forcaVel = 0;
    d.tempoRolando = 0;
    d.derrubadosNestaBola = 0;

    irParaEtapa(ETAPAS.MIRA);
  }, [irParaEtapa]);

  // --- Começar / reiniciar a partida ----------------------------------------
  const iniciarJogo = useCallback(() => {
    garantirAudio(); // o navegador só libera áudio depois de um clique/tecla

    dRef.current = dadosIniciais();
    setRodada(1);
    setBolaDaRodada(1);
    setPontos(0);
    setPinosEmPe(TOTAL_PINOS);
    setBanner(null);
    prepararJogada();
    setEstado(FASES.JOGANDO);
  }, [garantirAudio, prepararJogada]);

  const voltarParaHome = useCallback(
    () => navigate("/home?menu=jogar"),
    [navigate]
  );

  const alternarSom = useCallback(() => setSomLigado((s) => !s), []);

  // --- Soltar a bola ---------------------------------------------------------
  const lancarBola = useCallback(() => {
    const d = dRef.current;
    const forca = Math.max(FORCA_MINIMA, d.forca);

    // Marca quais pinos JÁ estavam caídos, para contar só os desta bola
    d.pinos.forEach((p) => {
      p.caidoAntes = p.caido;
    });

    d.bola.x = LINHA_LANCAMENTO;
    d.bola.y = d.miraY;
    d.bola.vx = VELOCIDADE_BASE + forca * VELOCIDADE_EXTRA;
    // Um desviozinho de nada: duas bolas iguais nunca caem exatamente no mesmo
    // lugar, o que deixa a partida menos robótica sem tirar o controle da criança.
    d.bola.vy = (Math.random() * 2 - 1) * 0.35;
    d.bola.rolando = true;
    d.bola.naCanaleta = false;
    d.tempoRolando = 0;

    tocarLancamento();
    irParaEtapa(ETAPAS.ROLANDO);
  }, [irParaEtapa, tocarLancamento]);

  // --- Fim da bola: conta pinos, pontua e prepara o que vem depois ----------
  const contabilizarJogada = useCallback(() => {
    const d = dRef.current;

    const derrubadosNestaBola = d.pinos.filter((p) => p.caido && !p.caidoAntes).length;
    d.derrubadosNestaBola = derrubadosNestaBola;
    d.derrubadosNaRodada += derrubadosNestaBola;

    const resultado = resultadoDaBola({
      bolaDaRodada: d.bolaDaRodada,
      derrubadosNestaBola,
      derrubadosNaRodada: d.derrubadosNaRodada,
      naCanaleta: d.bola.naCanaleta,
    });

    d.pontos += resultado.pontos;
    d.fecharRodada = resultado.fecharRodada;

    setPontos(d.pontos);
    setPinosEmPe(d.pinos.filter((p) => !p.caido).length);
    setBanner({
      tipo: resultado.tipo,
      frase: resultado.frase,
      derrubados: derrubadosNestaBola,
    });

    if (resultado.tipo === "strike" || resultado.tipo === "spare") tocarStrike();
    else if (derrubadosNestaBola === 0) tocarErro();

    d.tempoBanner = TEMPO_BANNER;
    irParaEtapa(ETAPAS.RESULTADO);
  }, [irParaEtapa, tocarErro, tocarStrike]);

  // --- Depois do banner: próxima bola, próxima rodada ou fim da partida -----
  const seguirParaProxima = useCallback(() => {
    const d = dRef.current;
    setBanner(null);

    if (d.fecharRodada) {
      if (d.rodada >= TOTAL_RODADAS) {
        setEstado(FASES.FIM);
        return;
      }
      d.rodada += 1;
      d.bolaDaRodada = 1;
      d.derrubadosNaRodada = 0;
      d.pinos = criarPinos(); // pista nova, 10 pinos de novo
      setRodada(d.rodada);
      setBolaDaRodada(1);
      setPinosEmPe(TOTAL_PINOS);
    } else {
      d.bolaDaRodada = Math.min(d.bolaDaRodada + 1, BOLAS_POR_RODADA);
      d.pinos = d.pinos.filter((p) => !p.caido); // pinos derrubados saem da pista
      setBolaDaRodada(d.bolaDaRodada);
      setPinosEmPe(d.pinos.length);
    }

    prepararJogada();
  }, [prepararJogada]);

  // --- Ação do jogador: ESPAÇO, clique ou toque -----------------------------
  const acao = useCallback(() => {
    if (estadoRef.current === FASES.START) {
      iniciarJogo();
      return;
    }
    if (estadoRef.current !== FASES.JOGANDO) return;

    const d = dRef.current;

    if (d.etapa === ETAPAS.MIRA) {
      d.forca = 0;
      d.forcaVel = FORCA_VELOCIDADE;
      irParaEtapa(ETAPAS.FORCA);
      return;
    }

    if (d.etapa === ETAPAS.FORCA) {
      lancarBola();
    }
    // Durante ROLANDO e RESULTADO o botão não faz nada (é a vez do jogo)
  }, [iniciarJogo, irParaEtapa, lancarBola]);

  // Teclado: só a barra de espaço, igual aos outros minigames
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (e.repeat) return;
      acao();
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [acao]);

  // --- Loop principal --------------------------------------------------------
  useEffect(() => {
    const canvas = canvasEl;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const passo = (tempo) => {
      if (!ultimoTempoRef.current) ultimoTempoRef.current = tempo;
      const dt = Math.min(tempo - ultimoTempoRef.current, 40);
      ultimoTempoRef.current = tempo;
      const fator = dt / 16.67; // normaliza a física para 60fps

      const d = dRef.current;
      d.tempo += dt;

      if (estadoRef.current === FASES.JOGANDO) {
        if (d.etapa === ETAPAS.MIRA) {
          // A seta vai e volta, passando um pouco da pista: dá para errar feio
          d.miraY += d.miraVel * fator;
          const limiteCima = PISTA_TOPO - MIRA_MARGEM;
          const limiteBaixo = PISTA_BASE + MIRA_MARGEM;
          if (d.miraY <= limiteCima) {
            d.miraY = limiteCima;
            d.miraVel = Math.abs(d.miraVel);
          }
          if (d.miraY >= limiteBaixo) {
            d.miraY = limiteBaixo;
            d.miraVel = -Math.abs(d.miraVel);
          }
          d.bola.y = d.miraY; // a bola acompanha a mira
        }

        if (d.etapa === ETAPAS.FORCA) {
          d.forca += d.forcaVel * fator;
          if (d.forca >= 1) {
            d.forca = 1;
            d.forcaVel = -Math.abs(d.forcaVel);
          }
          if (d.forca <= 0) {
            d.forca = 0;
            d.forcaVel = Math.abs(d.forcaVel);
          }
        }

        if (d.etapa === ETAPAS.ROLANDO) {
          d.tempoRolando += dt;
          const eventos = atualizarFisica(d, fator);

          if (eventos.bateuPino && d.tempo - ultimaBatidaRef.current > 55) {
            ultimaBatidaRef.current = d.tempo;
            tocarBatida();
          }
          if (eventos.caiuNaCanaleta) tocarErro();

          if (jogadaTerminou(d)) contabilizarJogada();
        }

        if (d.etapa === ETAPAS.RESULTADO) {
          // Cena congelada: o que está na tela é exatamente o que foi contado
          d.tempoBanner -= dt;
          if (d.tempoBanner <= 0) seguirParaProxima();
        }
      }

      desenharCena(ctx, d);
      rafRef.current = requestAnimationFrame(passo);
    };

    rafRef.current = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ultimoTempoRef.current = 0;
    };
  }, [canvasEl, contabilizarJogada, seguirParaProxima, tocarBatida, tocarErro]);

  const estrelas = calcularEstrelas(pontos);

  return {
    canvasRef,

    // Situação da partida
    emJogo: estado === FASES.JOGANDO,
    mostrarIntro: estado === FASES.START,
    mostrarFimDeJogo: estado === FASES.FIM,

    // Placar
    rodada,
    bolaDaRodada,
    pontos,
    pinosEmPe,
    estrelas,
    emojiFinal: emojiDoResultadoFinal(estrelas),

    // Jogada atual
    etapa,
    banner,

    // Ações
    acao,
    iniciarJogo,
    voltarParaHome,
    somLigado,
    alternarSom,
  };
}
