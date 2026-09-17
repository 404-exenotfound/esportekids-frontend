import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BOLA_INICIAL,
  CESTA_ANDANTE,
  FASES,
  MENSAGEM_CESTA_ANDANDO,
  MENSAGENS_RODAPE,
  TEMPO_ATE_PROXIMA_RODADA,
  TEMPO_ATE_RESULTADO,
  TOTAL_RODADAS,
} from "../utils/constantes";
import {
  FRASES_ACERTO,
  FRASES_ERRO,
  FRASES_TORCIDA_ACERTO,
  FRASES_TORCIDA_ERRO,
} from "../utils/frases";

import { acertouAro } from "../helpers/acertouAro";
import { calcularEstrelas } from "../helpers/calcularEstrelas";
import { dificuldadeDaRodada } from "../helpers/dificuldadeDaRodada";
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { gerarConfetes } from "../helpers/gerarConfetes";
import { posicaoDoAro } from "../helpers/posicaoDoAro";
import { sorteiaFrase } from "../helpers/sorteiaFrase";
import { sorteiaPosicaoDaCesta } from "../helpers/sorteiaPosicaoDaCesta";
import { trajetoDaBola } from "../helpers/trajetoDaBola";

import { useTorcida } from "./useTorcida";

// Concentra todo o estado e todas as regras do Cestinha Campeão. A tela
// apenas consome o que sai daqui — ela não decide nada.
export function useBasquete() {
  const navigate = useNavigate();

  // A dificuldade (boca da cesta menor) avança com as cestas convertidas.
  const { garantirAudio, tocarTorcida } = useTorcida(true);

  const [fase, setFase] = useState(FASES.INTRO);
  const [rodada, setRodada] = useState(1);
  const [cestas, setCestas] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [somLigado, setSomLigado] = useState(true);

  const [bolaTrajeto, setBolaTrajeto] = useState(BOLA_INICIAL);
  const [resultado, setResultado] = useState(null);
  const [fraseResultado, setFraseResultado] = useState("");
  const [fraseTorcida, setFraseTorcida] = useState("");
  const [confetes, setConfetes] = useState([]);

  // Posição da cesta. Fica fixa durante quase o jogo todo e só anda na última
  // rodada. É mantida em estado (para renderizar) e em ref (para a leitura
  // no instante exato do clique, sem depender de re-render).
  const aroPosicaoInicial = posicaoDoAro();
  const [aroPosAtual, setAroPosAtual] = useState(aroPosicaoInicial);
  const aroPosRef = useRef(aroPosicaoInicial);
  const direcaoAndadaRef = useRef(1);

  const timers = useRef([]);

  const limparTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => limparTimers(), [limparTimers]);

  // Na última rodada a cesta anda de um lado para o outro enquanto o jogador
  // mira. O clique (arremessar) muda a fase e o efeito é derrubado, o que
  // congela a cesta exatamente onde estava para a bola chegar nela.
  useEffect(() => {
    if (fase !== FASES.PRONTO || rodada !== TOTAL_RODADAS) return undefined;

    let raf;
    let anterior = performance.now();

    const passo = (agora) => {
      const dt = (agora - anterior) / 1000;
      anterior = agora;

      let x =
        aroPosRef.current.x +
        CESTA_ANDANTE.VELOCIDADE * direcaoAndadaRef.current * dt;
      if (x > CESTA_ANDANTE.MAX_X) {
        x = CESTA_ANDANTE.MAX_X;
        direcaoAndadaRef.current = -1;
      } else if (x < CESTA_ANDANTE.MIN_X) {
        x = CESTA_ANDANTE.MIN_X;
        direcaoAndadaRef.current = 1;
      }

      aroPosRef.current = { x, y: aroPosRef.current.y };
      setAroPosAtual(aroPosRef.current);
      raf = requestAnimationFrame(passo);
    };

    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [fase, rodada]);

  const alternarSom = useCallback(() => setSomLigado((s) => !s), []);

  const voltarParaHome = useCallback(() => navigate("/home"), [navigate]);

  const iniciarJogo = useCallback(() => {
    limparTimers();
    setRodada(1);
    setCestas(0);
    setHistorico([]);
    setBolaTrajeto(BOLA_INICIAL);
    setResultado(null);
    setConfetes([]);
    // Cesta volta para a posição fixa e para de andar
    aroPosRef.current = aroPosicaoInicial;
    setAroPosAtual(aroPosicaoInicial);
    direcaoAndadaRef.current = 1;
    setFase(FASES.PRONTO);
  }, [limparTimers, aroPosicaoInicial]);

  const arremessar = useCallback(
    (xPx, yPx, largura, altura) => {
      if (fase !== FASES.PRONTO) return;

      // O clique é a interação que libera o áudio no navegador.
      garantirAudio();

      const dificuldade = dificuldadeDaRodada(cestas);
      // A cesta pode estar andando: o acerto é medido na posição dela no
      // instante do clique (congelada pelo começo do arremesso).
      const acertou = acertouAro(
        xPx,
        yPx,
        largura,
        altura,
        dificuldade.raio,
        aroPosRef.current
      );

      setFase(FASES.ARREMESSANDO);
      setBolaTrajeto(trajetoDaBola(xPx, yPx, largura, altura, acertou));

      // Quando a bola chega na cesta, revelamos o resultado
      const revelarResultado = setTimeout(() => {
        if (acertou) {
          setCestas((c) => c + 1);
          setResultado("acerto");
          setFraseResultado(sorteiaFrase(FRASES_ACERTO));
          setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_ACERTO));
          setConfetes(gerarConfetes());
        } else {
          setResultado("erro");
          setFraseResultado(sorteiaFrase(FRASES_ERRO));
          setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_ERRO));
          setConfetes([]);
        }

        tocarTorcida(acertou ? "gol" : "defesa");
        setHistorico((h) => [...h, acertou ? "ponto" : "erro"]);
        setFase(FASES.RESULTADO);
      }, TEMPO_ATE_RESULTADO);

      // Avança para o próximo arremesso ou para o placar final
      const proximaRodada = setTimeout(() => {
        setConfetes([]);
        setResultado(null);
        setBolaTrajeto(BOLA_INICIAL);

        // Cada cesta convertida faz a cesta mudar de lugar (teleporta para
        // uma nova posição fixa). Ela não se move sozinha — só na última
        // rodada é que ela anda.
        if (acertou && rodada < TOTAL_RODADAS) {
          const novaPosicao = sorteiaPosicaoDaCesta();
          aroPosRef.current = novaPosicao;
          setAroPosAtual(novaPosicao);
        }

        if (rodada >= TOTAL_RODADAS) {
          setFase(FASES.FIM_DE_JOGO);
        } else {
          setRodada(rodada + 1);
          setFase(FASES.PRONTO);
        }
      }, TEMPO_ATE_PROXIMA_RODADA);

      timers.current.push(revelarResultado, proximaRodada);
    },
    [fase, cestas, rodada, garantirAudio, tocarTorcida]
  );

  const dificuldade = dificuldadeDaRodada(cestas);
  const aro = aroPosAtual;
  const estrelas = calcularEstrelas(cestas);

  return {
    // Qual tela mostrar
    mostrarIntro: fase === FASES.INTRO,
    mostrarPartida: fase !== FASES.INTRO && fase !== FASES.FIM_DE_JOGO,
    mostrarFimDeJogo: fase === FASES.FIM_DE_JOGO,

    // Placar
    rodadaExibida: Math.min(rodada, TOTAL_RODADAS),
    cestas,
    estrelas,
    dificuldade,
    aro,
    // Uma casinha por rodada; as ainda não jogadas ficam vazias.
    bolinhas: Array.from({ length: TOTAL_RODADAS }, (_, i) => historico[i] ?? null),
    somLigado,
    alternarSom,

    // Quadra
    bolaTrajeto,
    confetes,
    mostrarAlvos: fase === FASES.PRONTO,
    mostrarBanner: fase === FASES.RESULTADO && Boolean(resultado),
    resultado,
    fraseResultado,
    fraseTorcida,
    mensagemRodape:
      fase === FASES.PRONTO && rodada === TOTAL_RODADAS
        ? MENSAGEM_CESTA_ANDANDO
        : (MENSAGENS_RODAPE[fase] ?? ""),

    // Fim de jogo
    emojiFinal: emojiDoResultadoFinal(cestas),

    // Ações
    arremessar,
    iniciarJogo,
    voltarParaHome,
  };
}