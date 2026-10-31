import { useCallback, useEffect, useRef, useState } from "react";

// Narração das instruções de cada minigame, lida pelo próprio navegador
// (Web Speech API, voz em português do Brasil).
//
// Se "src" (um .mp3 gravado do próprio jogo) for informado, toca o arquivo;
// sem "src", lê o texto com a voz do navegador. Para usar uma gravação nova
// em outro jogo, basta importar o mp3 no TelaIntro dele e passar como 2º
// argumento: useNarracao(texto, audioDoJogo).
//
// Por que nem todos usam .mp3? Os arquivos basquete.mp3, futebol.mp3, atletismo.mp3,
// pingpong.mp3 e boliche.mp3 eram CÓPIAS IDÊNTICAS do áudio do basquete, então
// todo jogo explicava o basquete. Cada intro agora narra o texto do SEU jogo.
export default function useNarracao(texto, src) {
  const suporta = typeof window !== "undefined" && "speechSynthesis" in window;
  const [tocando, setTocando] = useState(false);
  const ativoRef = useRef(false);
  const audioRef = useRef(null);

  const parar = useCallback(() => {
    ativoRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (suporta) window.speechSynthesis.cancel();
    setTocando(false);
  }, [suporta]);

  const alternar = useCallback(() => {
    if (ativoRef.current) {
      parar();
      return;
    }
    // Gravação própria do jogo (.mp3)
    if (src) {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.onended = () => {
          ativoRef.current = false;
          setTocando(false);
        };
      }
      ativoRef.current = true;
      setTocando(true);
      audioRef.current.play().catch(() => {
        ativoRef.current = false;
        setTocando(false);
      });
      return;
    }
    if (!suporta) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    const voz =
      synth.getVoices().find((v) => v.lang === "pt-BR") ||
      synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("pt"));
    if (voz) fala.voice = voz;
    const terminar = () => {
      if (!ativoRef.current) return;
      ativoRef.current = false;
      setTocando(false);
    };
    fala.onend = terminar;
    fala.onerror = terminar;
    ativoRef.current = true;
    setTocando(true);
    synth.speak(fala);
  }, [suporta, texto, src, parar]);

  // Ao sair da tela de intro, a voz para
  useEffect(
    () => () => {
      if (audioRef.current) audioRef.current.pause();
      if (suporta) window.speechSynthesis.cancel();
    },
    [suporta]
  );

  return { tocando, alternar, parar, suporta };
}
