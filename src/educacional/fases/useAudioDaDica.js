import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { audioDaDica } from "../../utils/audios";
import { TOTAL_DICAS } from "./dicasFases";

// Se o áudio travar (rede lenta, evento "ended" que nunca chega), a dica não
// pode ficar presa na tela: depois desse tempo ele é dado como terminado.
const TEMPO_MAXIMO_AUDIO = 30000; // ms

// Toca a narração da dica "numero" do jogo "esporte". "chave" muda a cada vez
// que uma dica aparece, então a mesma dica exibida de novo toca de novo.
// numero = 0 significa "nenhuma dica na tela": o áudio atual é interrompido.
// Devolve se o áudio da exibição atual já acabou (ou falhou), para o aviso
// da dica saber quando pode sumir.
export function useAudioDaDica(esporte, numero, chave) {
  const volume = useSelector((state) => state.jogo.volume);
  const volumeRef = useRef(volume);
  const audioRef = useRef(null);
  const preloadRef = useRef(null);
  const [chaveTerminada, setChaveTerminada] = useState(null);

  // Volume global (0–100) aplicado também ao áudio que já está tocando
  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const url = audioDaDica(esporte, numero);
    if (!url) return undefined;

    const audio = new Audio(url);
    audio.volume = volumeRef.current / 100;
    audioRef.current = audio;

    const terminar = () => setChaveTerminada(chave);
    audio.addEventListener("ended", terminar);
    audio.addEventListener("error", terminar);
    // O navegador pode bloquear o play (autoplay) — o jogo segue normalmente
    audio.play().catch(terminar);
    const limite = setTimeout(terminar, TEMPO_MAXIMO_AUDIO);

    // Já baixa a próxima dica para ela tocar sem atraso
    if (numero < TOTAL_DICAS) {
      const proxima = new Audio();
      proxima.preload = "auto";
      proxima.src = audioDaDica(esporte, numero + 1);
      preloadRef.current = proxima;
    }

    return () => {
      clearTimeout(limite);
      audio.removeEventListener("ended", terminar);
      audio.removeEventListener("error", terminar);
      audio.pause();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [esporte, numero, chave]);

  // Baixa a primeira dica assim que o jogo abre
  useEffect(() => {
    const url = audioDaDica(esporte, 1);
    if (!url) return;
    const primeira = new Audio();
    primeira.preload = "auto";
    primeira.src = url;
    preloadRef.current = primeira;
  }, [esporte]);

  // Sem áudio para essa dica: nada a esperar
  const semAudio = !audioDaDica(esporte, numero);
  return { terminou: semAudio || chaveTerminada === chave };
}
