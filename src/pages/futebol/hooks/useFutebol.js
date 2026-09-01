import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ZONA_CENTRO } from "../utils/zonas";
import {
  FRASES_DEFESA,
  FRASES_GOL,
  FRASES_TORCIDA_DEFESA,
  FRASES_TORCIDA_GOL,
} from "../utils/frases";
import {
  BOLA_INICIAL,
  FASES,
  MENSAGENS_RODAPE,
  TEMPO_ATE_PROXIMA_RODADA,
  TEMPO_ATE_RESULTADO,
  TOTAL_RODADAS,
} from "../utils/constantes";

import { calcularEstrelas } from "../helpers/calcularEstrelas";
import { dificuldadeDaRodada } from "../helpers/dificuldadeDaRodada";
import { emojiDoResultadoFinal } from "../helpers/emojiDoResultadoFinal";
import { escolherZonaGoleiro } from "../helpers/escolherZonaGoleiro";
import { gerarConfetes } from "../helpers/gerarConfetes";
import { posicaoDoGoleiro } from "../helpers/posicaoDoGoleiro";
import { sorteiaFrase } from "../helpers/sorteiaFrase";
import { trajetoDaBola } from "../helpers/trajetoDaBola";

import { useTorcida } from "./useTorcida";

// Concentra todo o estado e todas as regras do Pênalti Campeão. A tela
// apenas consome o que sai daqui — ela não decide nada.
export function useFutebol() {
  const navigate = useNavigate();

  // Configuração escolhida nas Opções / na seleção de personagem.
  const { dificuldade, personagem } = useSelector((state) => state.jogo);

  const [fase, setFase] = useState(FASES.INTRO);
  const [rodada, setRodada] = useState(1);
  const [placar, setPlacar] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [somLigado, setSomLigado] = useState(true);

  const [bolaPos, setBolaPos] = useState(BOLA_INICIAL);
  const [goleiroZona, setGoleiroZona] = useState(ZONA_CENTRO);
  const [bolaPegou, setBolaPegou] = useState(false);
  const [redeEmChoque, setRedeEmChoque] = useState(null);

  const [resultado, setResultado] = useState(null);
  const [fraseResultado, setFraseResultado] = useState("");
  const [fraseTorcida, setFraseTorcida] = useState("");
  const [confetes, setConfetes] = useState([]);

  const timers = useRef([]);
  const { garantirAudio, tocarTorcida } = useTorcida(somLigado);

  const limparTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => limparTimers(), [limparTimers]);

  const alternarSom = useCallback(() => setSomLigado((s) => !s), []);

  const voltarParaHome = useCallback(() => navigate("/home"), [navigate]);

  const iniciarJogo = useCallback(() => {
    limparTimers();
    setRodada(1);
    setPlacar(0);
    setHistorico([]);
    setBolaPos(BOLA_INICIAL);
    setGoleiroZona(ZONA_CENTRO);
    setBolaPegou(false);
    setRedeEmChoque(null);
    setResultado(null);
    setConfetes([]);
    setFase(FASES.PRONTO);
  }, [limparTimers]);

  const chutar = useCallback(
    (indiceZona) => {
      if (fase !== FASES.PRONTO) return;

      // O clique no alvo é a interação que libera o áudio no navegador.
      garantirAudio();

      const zonaSorteada = escolherZonaGoleiro(rodada, indiceZona, dificuldade);
      const defendeu = zonaSorteada === indiceZona;

      setBolaPegou(false);
      setRedeEmChoque(null);
      setFase(FASES.CHUTANDO);
      setBolaPos(trajetoDaBola(indiceZona, defendeu));

      // O goleiro sai do chão e pula direto para o canto sorteado, num único
      // movimento contínuo — sem ficar "no meio do caminho".
      setGoleiroZona(zonaSorteada);

      // Quando a bola termina o trajeto, revelamos o resultado
      const revelarResultado = setTimeout(() => {
        if (defendeu) {
          setBolaPegou(true);
          setResultado("defesa");
          setFraseResultado(sorteiaFrase(FRASES_DEFESA));
          setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_DEFESA));
          setConfetes([]);
        } else {
          setRedeEmChoque(indiceZona);
          setPlacar((p) => p + 1);
          setResultado("gol");
          setFraseResultado(sorteiaFrase(FRASES_GOL));
          setFraseTorcida(sorteiaFrase(FRASES_TORCIDA_GOL));
          setConfetes(gerarConfetes());
        }

        tocarTorcida(defendeu ? "defesa" : "gol");
        setHistorico((h) => [...h, defendeu ? "defesa" : "gol"]);
        setFase(FASES.RESULTADO);
      }, TEMPO_ATE_RESULTADO);

      // Avança para a próxima rodada ou para o placar final
      const proximaRodada = setTimeout(() => {
        setConfetes([]);
        setBolaPegou(false);
        setRedeEmChoque(null);
        setResultado(null);
        setGoleiroZona(ZONA_CENTRO);
        setBolaPos(BOLA_INICIAL);

        setRodada((rAtual) => {
          if (rAtual >= TOTAL_RODADAS) {
            setFase(FASES.FIM_DE_JOGO);
            return rAtual;
          }
          setFase(FASES.PRONTO);
          return rAtual + 1;
        });
      }, TEMPO_ATE_PROXIMA_RODADA);

      timers.current.push(revelarResultado, proximaRodada);
    },
    [fase, rodada, dificuldade, garantirAudio, tocarTorcida]
  );

  const emAcao = fase === FASES.CHUTANDO || fase === FASES.RESULTADO;
  const goleiro = posicaoDoGoleiro(goleiroZona, emAcao);

  return {
    // Qual tela mostrar
    mostrarIntro: fase === FASES.INTRO,
    mostrarPartida: fase !== FASES.INTRO && fase !== FASES.FIM_DE_JOGO,
    mostrarFimDeJogo: fase === FASES.FIM_DE_JOGO,

    // Placar
    rodadaExibida: Math.min(rodada, TOTAL_RODADAS),
    placar,
    dificuldade: dificuldadeDaRodada(rodada, dificuldade),
    // Ainda não há arte por personagem no campo — fica exposto aqui para
    // quando o jogador do campo passar a mudar conforme a escolha.
    personagem,
    // Uma casinha por rodada; as ainda não jogadas ficam vazias.
    bolinhas: Array.from({ length: TOTAL_RODADAS }, (_, i) => historico[i] ?? null),
    somLigado,
    alternarSom,

    // Campo
    goleiro,
    bolaPos,
    bolaPegou,
    redeEmChoque,
    confetes,
    mostrarJogador: fase === FASES.PRONTO,
    mostrarAlvos: fase === FASES.PRONTO,
    mostrarBanner: fase === FASES.RESULTADO && Boolean(resultado),
    resultado,
    fraseResultado,
    fraseTorcida,
    mensagemRodape: MENSAGENS_RODAPE[fase] ?? "",

    // Fim de jogo
    estrelas: calcularEstrelas(placar),
    emojiFinal: emojiDoResultadoFinal(placar),

    // Ações
    chutar,
    iniciarJogo,
    voltarParaHome,
  };
}
