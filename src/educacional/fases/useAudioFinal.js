import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { audioDescricaoFinal } from "../../utils/audios";

// Narração da revisão das dicas no fim do jogo. Começa a tocar sozinha quando
// a tela abre e para ao sair dela. Se o navegador bloquear o autoplay, fica
// pausada e o botão "Ouvir" inicia. "falhou" avisa que o arquivo não carregou,
// para a tela cair na leitura do navegador.
export function useAudioFinal(esporte) {
  const volume = useSelector((state) => state.jogo.volume);
  const volumeRef = useRef(volume);
  const audioRef = useRef(null);
  const [tocando, setTocando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  // Volume global (0–100) aplicado também ao áudio que já está tocando
  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const url = audioDescricaoFinal(esporte);
    if (!url) return undefined;

    const audio = new Audio(url);
    audio.volume = volumeRef.current / 100;
    audioRef.current = audio;

    const aoTocar = () => setTocando(true);
    const aoParar = () => setTocando(false);
    const aoFalhar = () => {
      setTocando(false);
      setFalhou(true);
    };
    audio.addEventListener("play", aoTocar);
    audio.addEventListener("pause", aoParar);
    audio.addEventListener("ended", aoParar);
    audio.addEventListener("error", aoFalhar);
    audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("play", aoTocar);
      audio.removeEventListener("pause", aoParar);
      audio.removeEventListener("ended", aoParar);
      audio.removeEventListener("error", aoFalhar);
      audio.pause();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [esporte]);

  const alternar = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // Terminou: o "Ouvir" recomeça do início
      if (audio.ended) audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const disponivel = Boolean(audioDescricaoFinal(esporte)) && !falhou;
  return { disponivel, tocando, alternar };
}
