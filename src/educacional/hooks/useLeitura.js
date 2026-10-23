import { useCallback, useEffect, useState } from "react";

// Leitura em voz alta com a Web Speech API (já vem no navegador, sem instalar nada).
export function useLeitura() {
  const suportado = typeof window !== "undefined" && "speechSynthesis" in window;
  const [lendo, setLendo] = useState(false);

  const parar = useCallback(() => {
    if (!suportado) return;
    window.speechSynthesis.cancel();
    setLendo(false);
  }, [suportado]);

  const ler = useCallback(
    (texto) => {
      if (!suportado || !texto) return;
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = "pt-BR";
      fala.rate = 0.9; // um pouco mais devagar, melhor para quem está aprendendo a ler
      fala.onend = () => setLendo(false);
      fala.onerror = () => setLendo(false);
      setLendo(true);
      window.speechSynthesis.speak(fala);
    },
    [suportado]
  );

  // Se sair da tela, para de falar
  useEffect(() => () => suportado && window.speechSynthesis.cancel(), [suportado]);

  return { suportado, lendo, ler, parar };
}
