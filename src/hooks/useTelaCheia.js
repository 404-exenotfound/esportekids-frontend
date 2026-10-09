import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Tela cheia via Fullscreen API com fallback webkit (Safari).
// Retorna o estado, se o navegador suporta, a ref do container do jogo e a
// função para alternar (o atalho de tecla "F" também funciona).
export default function useTelaCheia() {
  const [emTelaCheia, setEmTelaCheia] = useState(false);
  const ref = useRef(null);

  const suportaTelaCheia = useMemo(() => {
    const el = typeof document !== "undefined" ? document.documentElement : null;
    return Boolean(
      el &&
        (typeof el.requestFullscreen === "function" ||
          typeof el.webkitRequestFullscreen === "function")
    );
  }, []);

  const entrar = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.requestFullscreen === "function") {
      el.requestFullscreen();
    } else if (typeof el.webkitRequestFullscreen === "function") {
      el.webkitRequestFullscreen();
    }
  }, []);

  const sair = useCallback(() => {
    if (typeof document.exitFullscreen === "function") {
      document.exitFullscreen();
    } else if (typeof document.webkitExitFullscreen === "function") {
      document.webkitExitFullscreen();
    }
  }, []);

  const alternar = useCallback(() => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      sair();
    } else {
      entrar();
    }
  }, [entrar, sair]);

  // Mantém o estado sincronizado com a entrada/saída real (incl. tecla ESC)
  useEffect(() => {
    const atualizar = () => {
      setEmTelaCheia(
        Boolean(document.fullscreenElement || document.webkitFullscreenElement)
      );
    };
    document.addEventListener("fullscreenchange", atualizar);
    document.addEventListener("webkitfullscreenchange", atualizar);
    return () => {
      document.removeEventListener("fullscreenchange", atualizar);
      document.removeEventListener("webkitfullscreenchange", atualizar);
    };
  }, []);

  // Atalho: tecla F alterna a tela cheia
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.code !== "KeyF" || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      alternar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [alternar]);

  return { emTelaCheia, suportaTelaCheia, ref, alternarTelaCheia: alternar };
}