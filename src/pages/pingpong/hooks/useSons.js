// ============================================================================
// useSons — efeitos sonoros do ping-pong (Web Audio API)
// ----------------------------------------------------------------------------
// Cria e controla o contexto de áudio (AudioContext), o volume master e três
// efeitos sonoros:
//   tocarToque  — toque curto e "seco" quando a bola bate na raquete/parede
//   tocarPonto  — ruído filtrado + assovio (torcida comemorando)
//   tocarErro   — deslize descendente de tom baixo (bola perdida)
// O volume vem do estado global (Redux) e o som pode ser ligado/desligado.
// ============================================================================

import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { criarRuidoBuffer } from "../helpers/criarRuidoBuffer";

export function useSons(somLigado) {
  const volume = useSelector((state) => state.jogo.volume); // volume do jogo (Redux)

  const audioCtxRef = useRef(null); // instância do AudioContext (criada sob demanda)
  const masterGainRef = useRef(null); // nó de volume que controla TODOS os sons
  const somLigadoRef = useRef(somLigado); // espelho do estado "som ligado"
  const volumeRef = useRef(volume); // espelho do volume (para usar dentro do áudio)

  // Mantém o ref "somLigado" sincronizado com o estado React
  useEffect(() => {
    somLigadoRef.current = somLigado;
  }, [somLigado]);

  // Ajusta o volume master quando o slider de volume muda
  useEffect(() => {
    volumeRef.current = volume;
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Fecha o contexto de áudio ao desmontar o componente (evita vazamento)
  useEffect(
    () => () => {
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state !== "closed") ctx.close();
      audioCtxRef.current = null;
      masterGainRef.current = null;
    },
    []
  );

  // Cria/retoma o AudioContext (o navegador exige que seja após um clique)
  const garantirAudio = useCallback(() => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctx();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = volumeRef.current / 100;
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // --- Som de toque (bola bateu na raquete ou na parede) --------------------
  const tocarToque = useCallback(() => {
    if (!somLigadoRef.current || volumeRef.current <= 0) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = "square"; // onda quadrada = "toc" de ping-pong
    osc.frequency.setValueAtTime(900 + Math.random() * 300, agora);
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(0.14, agora + 0.008); // ataca rápido
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.07); // some rápido
    osc.connect(ganho);
    ganho.connect(masterGainRef.current);
    osc.start(agora);
    osc.stop(agora + 0.09);
  }, [garantirAudio]);

  // --- Som de ponto (comemoração: ruído filtrado + assobio) ------------------
  const tocarPonto = useCallback(() => {
    if (!somLigadoRef.current || volumeRef.current <= 0) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const duracao = 1.1 + Math.random() * 0.4;

    // Camada 1: "fantasia" — ruído branco passando por filtro passa-faixa
    const fonte = ctx.createBufferSource();
    fonte.buffer = criarRuidoBuffer(ctx, duracao);

    const filtro = ctx.createBiquadFilter();
    filtro.type = "bandpass";
    filtro.frequency.value = 900 + Math.random() * 400;
    filtro.Q.value = 0.7;

    const ganho = ctx.createGain();
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(0.2, agora + 0.12);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

    fonte.connect(filtro);
    filtro.connect(ganho);
    ganho.connect(masterGainRef.current);
    fonte.start(agora);
    fonte.stop(agora + duracao + 0.05);

    // Camada 2: assobio agudo (filtro passa-alta) por cima do ruído
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
  }, [garantirAudio]);

  // --- Som de erro (deslize de tom baixo) ------------------------------------
  const tocarErro = useCallback(() => {
    if (!somLigadoRef.current || volumeRef.current <= 0) return;
    const ctx = garantirAudio();
    if (!ctx) return;

    const agora = ctx.currentTime;
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = "triangle"; // onda suave para o "ooops"
    osc.frequency.setValueAtTime(200, agora);
    osc.frequency.exponentialRampToValueAtTime(80, agora + 0.2); // cai o tom
    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(0.16, agora + 0.02);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.22);
    osc.connect(ganho);
    ganho.connect(masterGainRef.current);
    osc.start(agora);
    osc.stop(agora + 0.24);
  }, [garantirAudio]);

  return { garantirAudio, tocarToque, tocarPonto, tocarErro };
}