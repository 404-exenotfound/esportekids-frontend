import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDispositivo from "./useDispositivo";

// Tela cheia via Fullscreen API com fallback webkit (Safari).
// Retorna o estado, se o navegador suporta, a ref do container do jogo e a
// função para alternar (o atalho de tecla "F" também funciona).
// "terminou": quando vira true (fim do minigame) e a tela está cheia, sai da
// tela cheia sozinho. Sem isso, o quiz/fim de jogo (que ficam fora do palco)
// ficavam escondidos atrás da tela cheia e o jogo parecia travado.
// No celular, ao entrar também trava a tela deitada (Android/Chrome); onde o
// navegador não deixa (iPhone, Firefox...) o aviso "gire o celular" cobre.
export default function useTelaCheia(terminou = false) {
  const [emTelaCheia, setEmTelaCheia] = useState(false);
  const ref = useRef(null);
  const { ehCelular } = useDispositivo();

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
    let pedido;
    if (typeof el.requestFullscreen === "function") {
      pedido = el.requestFullscreen();
    } else if (typeof el.webkitRequestFullscreen === "function") {
      pedido = el.webkitRequestFullscreen(); // webkit não devolve promise
    } else {
      return;
    }
    // Recusas (sem suporte, sem gesto do usuário) são esperadas: só ignora
    Promise.resolve(pedido)
      .then(() => {
        if (ehCelular) return window.screen.orientation?.lock?.("landscape");
      })
      .catch(() => {});
  }, [ehCelular]);

  // Celular: o botão Jogar já entra em tela cheia (e trava deitado)
  const entrarNoCelular = useCallback(() => {
    if (ehCelular) entrar();
  }, [ehCelular, entrar]);

  const sair = useCallback(() => {
    if (typeof document.exitFullscreen === "function") {
      document.exitFullscreen().catch(() => {});
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
      const cheia = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setEmTelaCheia(cheia);
      if (!cheia) {
        try {
          window.screen.orientation?.unlock?.();
        } catch {
          // sem trava ativa / sem suporte
        }
      }
    };
    document.addEventListener("fullscreenchange", atualizar);
    document.addEventListener("webkitfullscreenchange", atualizar);
    return () => {
      document.removeEventListener("fullscreenchange", atualizar);
      document.removeEventListener("webkitfullscreenchange", atualizar);
    };
  }, []);

  // Fim do minigame: sai da tela cheia para mostrar dicas/quiz/resultado
  useEffect(() => {
    if (terminou && (document.fullscreenElement || document.webkitFullscreenElement)) {
      sair();
    }
  }, [terminou, sair]);

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

  return {
    emTelaCheia,
    suportaTelaCheia,
    ref,
    alternarTelaCheia: alternar,
    entrarTelaCheiaNoCelular: entrarNoCelular,
  };
}