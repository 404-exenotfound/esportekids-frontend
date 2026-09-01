import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { criarRuidoBuffer } from "../helpers/criarRuidoBuffer";

// Torcida sintetizada via Web Audio API — sem arquivo de áudio.
export function useTorcida(somLigado) {
  // Volume global, definido nas Opções (0 a 100).
  const volume = useSelector((state) => state.jogo.volume);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const somLigadoRef = useRef(somLigado);
  const volumeRef = useRef(volume);

  // O som dispara de dentro de um setTimeout. Ler de uma ref garante que
  // vale o estado do botão no instante do disparo, e não o de quando o
  // chute começou.
  useEffect(() => {
    somLigadoRef.current = somLigado;
  }, [somLigado]);

  // Mexer no slider durante a partida muda o volume na hora — sem precisar
  // recriar o contexto de áudio.
  useEffect(() => {
    volumeRef.current = volume;
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  useEffect(
    () => () => {
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state !== "closed") ctx.close();
      // Zerar a ref é o que permite recriar o contexto se o componente
      // remontar (o StrictMode monta, desmonta e monta de novo em dev).
      audioCtxRef.current = null;
      masterGainRef.current = null;
    },
    []
  );

  const garantirAudio = useCallback(() => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctx();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = volumeRef.current / 100;
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    // Navegadores só liberam áudio após uma interação do usuário.
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const tocarTorcida = useCallback(
    (tipo) => {
      if (!somLigadoRef.current || volumeRef.current <= 0) return;
      const ctx = garantirAudio();
      if (!ctx) return;

      const agora = ctx.currentTime;
      const ehGol = tipo === "gol";
      const duracao = ehGol
        ? 1.3 + Math.random() * 0.5
        : 0.55 + Math.random() * 0.25;

      const fonte = ctx.createBufferSource();
      fonte.buffer = criarRuidoBuffer(ctx, duracao);

      const filtro = ctx.createBiquadFilter();
      filtro.type = "bandpass";
      filtro.frequency.value = ehGol
        ? 900 + Math.random() * 400
        : 350 + Math.random() * 150;
      filtro.Q.value = 0.7;

      const ganho = ctx.createGain();
      ganho.gain.setValueAtTime(0.0001, agora);
      ganho.gain.exponentialRampToValueAtTime(ehGol ? 0.22 : 0.12, agora + 0.12);
      ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

      fonte.connect(filtro);
      filtro.connect(ganho);
      ganho.connect(masterGainRef.current);
      fonte.start(agora);
      fonte.stop(agora + duracao + 0.05);

      // No gol, uma segunda camada aguda por cima: os assobios da torcida.
      if (ehGol) {
        const assobio = ctx.createBufferSource();
        assobio.buffer = criarRuidoBuffer(ctx, duracao * 0.75);

        const filtroAgudo = ctx.createBiquadFilter();
        filtroAgudo.type = "highpass";
        filtroAgudo.frequency.value = 2500;

        const ganhoAgudo = ctx.createGain();
        ganhoAgudo.gain.setValueAtTime(0.0001, agora);
        ganhoAgudo.gain.exponentialRampToValueAtTime(0.06, agora + 0.15);
        ganhoAgudo.gain.exponentialRampToValueAtTime(0.0001, agora + duracao * 0.75);

        assobio.connect(filtroAgudo);
        filtroAgudo.connect(ganhoAgudo);
        ganhoAgudo.connect(masterGainRef.current);
        assobio.start(agora);
        assobio.stop(agora + duracao * 0.75 + 0.05);
      }
    },
    [garantirAudio]
  );

  return { garantirAudio, tocarTorcida };
}
