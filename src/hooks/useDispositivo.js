import { useEffect, useState } from "react";
import { classificarDispositivo } from "./classificarDispositivo";

const medir = () =>
  classificarDispositivo({
    toque: window.matchMedia("(pointer: coarse)").matches,
    larguraTela: window.screen.width,
    alturaTela: window.screen.height,
    larguraJanela: window.innerWidth,
    alturaJanela: window.innerHeight,
  });

// Diz se o aparelho é celular, tablet ou desktop e se está em pé (retrato).
// Atualiza ao girar/redimensionar. "classes" vai no wrapper dos minigames
// (vazio no desktop, para nada mudar lá) e o CSS compartilhado faz o resto.
export default function useDispositivo() {
  const [disp, setDisp] = useState(medir);

  useEffect(() => {
    const atualizar = () => {
      const novo = medir();
      setDisp((prev) =>
        prev.tipo === novo.tipo && prev.retrato === novo.retrato ? prev : novo
      );
    };
    const mq = window.matchMedia("(pointer: coarse)");
    window.addEventListener("resize", atualizar);
    window.addEventListener("orientationchange", atualizar);
    mq.addEventListener("change", atualizar);
    return () => {
      window.removeEventListener("resize", atualizar);
      window.removeEventListener("orientationchange", atualizar);
      mq.removeEventListener("change", atualizar);
    };
  }, []);

  const { tipo, retrato } = disp;
  const classes =
    tipo === "desktop" ? "" : `is-${tipo} ${retrato ? "is-retrato" : "is-paisagem"}`;

  return {
    tipo,
    retrato,
    ehCelular: tipo === "celular",
    ehTablet: tipo === "tablet",
    classes,
  };
}
