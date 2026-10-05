// ============================================================================
// useSons — efeitos sonoros do boliche (Web Audio API)
// ----------------------------------------------------------------------------
// tocarLancamento — "swoosh" grave da bola saindo da mão
// tocarBatida     — estalo seco da bola/pino batendo
// tocarStrike     — comemoração (ruído filtrado + notinhas subindo)
// tocarErro       — tom caindo, quando a bola vai para a canaleta
// O volume vem do Redux (state.jogo.volume), igual aos outros minigames.
// ============================================================================

import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { criarRuidoBuffer } from "../helpers/criarRuidoBuffer";

export function useSons(somLigado) {
  const volume = useSelector((state) => state.jogo.volume);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const somLigadoRef = useRef(somLigado);
  const volumeRef = useRef(volume);

  useEffect(() => {
    somLigadoRef.current = somLigado;
  }, [somLigado]);

  useEffect(() => {
    volumeRef.current = volume;
    if (masterGainRef.current) masterGainRef.current.gain.value = volume / 100;
  }, [volume]);

  // Fecha o contexto ao sair da página (evita vazar áudio)
  useEffect(
    () => () => {
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state !== "closed") ctx.close();
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
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  // Só toca se o som estiver ligado e o volume do Redux for maior que zero
  const podeTocar = useCallback(
    () => somLigadoRef.current && volumeRef.current > 0,
    []
  );

  // --- Bola saindo da mão ----------------------------------------------------
  const tocarLancamento = useCallback(() => {
    if (!podeTocar()) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const fonte = ctx.createBufferSource();
    fonte.buffer = criarRuidoBuffer(ctx, 0.5);

    const filtro = ctx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.setValueAtTime(400, agora);
    filtro.frequency.exponentialRampToValueAtTime(140, agora + 0.5);

    const ganho = ctx.createGain();
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(0.18, agora + 0.06);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.5);

    fonte.connect(filtro);
    filtro.connect(ganho);
    ganho.connect(masterGainRef.current);
    fonte.start(agora);
    fonte.stop(agora + 0.55);
  }, [garantirAudio, podeTocar]);

  // --- Estalo de pino --------------------------------------------------------
  const tocarBatida = useCallback(() => {
    if (!podeTocar()) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(420 + Math.random() * 380, agora);
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(0.12, agora + 0.006);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.09);
    osc.connect(ganho);
    ganho.connect(masterGainRef.current);
    osc.start(agora);
    osc.stop(agora + 0.1);
  }, [garantirAudio, podeTocar]);

  // --- Comemoração (strike/spare) -------------------------------------------
  const tocarStrike = useCallback(() => {
    if (!podeTocar()) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const notas = [523, 659, 784, 1046]; // dó, mi, sol, dó — escadinha alegre

    notas.forEach((nota, i) => {
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();
      const inicio = agora + i * 0.09;
      osc.type = "square";
      osc.frequency.setValueAtTime(nota, inicio);
      ganho.gain.setValueAtTime(0.0001, inicio);
      ganho.gain.exponentialRampToValueAtTime(0.14, inicio + 0.02);
      ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.18);
      osc.connect(ganho);
      ganho.connect(masterGainRef.current);
      osc.start(inicio);
      osc.stop(inicio + 0.2);
    });
  }, [garantirAudio, podeTocar]);

  // --- Canaleta / jogada fraca ----------------------------------------------
  const tocarErro = useCallback(() => {
    if (!podeTocar()) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, agora);
    osc.frequency.exponentialRampToValueAtTime(90, agora + 0.25);
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(0.15, agora + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.28);
    osc.connect(ganho);
    ganho.connect(masterGainRef.current);
    osc.start(agora);
    osc.stop(agora + 0.3);
  }, [garantirAudio, podeTocar]);

  return { garantirAudio, tocarLancamento, tocarBatida, tocarStrike, tocarErro };
}
