import { useEffect, useRef, useState } from "react";

// Preenche todo o palco (posicionamento absoluto) e centraliza o filho na
// maior área que preserva a proporção (largura/altura) informada — sem
// esticar/distorcer. Sobram barras quando a janela tem proporção diferente.
export default function EscalaProporcional({ largura, altura, children }) {
  const ref = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const proporcao = largura / altura;
    let raf = 0;
    let desmontado = false;

    const medir = () => {
      raf = 0;
      if (desmontado) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      let w = r.width;
      let h = w / proporcao;
      if (h > r.height) {
        h = r.height;
        w = h * proporcao;
      }
      setBox((prev) =>
        Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5
          ? prev
          : { w, h }
      );
    };

    const agendar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(medir);
    };

    // Retenta algumas vezes no início, enquanto o layout ainda assenta.
    let retries = 0;
    const retry = () => {
      if (retries > 120) return;
      retries += 1;
      raf = requestAnimationFrame(() => {
        medir();
        retry();
      });
    };

    medir();
    retry();

    const ro = new ResizeObserver(agendar);
    ro.observe(el);
    window.addEventListener("resize", agendar);

    return () => {
      desmontado = true;
      ro.disconnect();
      window.removeEventListener("resize", agendar);
      cancelAnimationFrame(raf);
    };
  }, [largura, altura]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: box.w, height: box.h }}>
        {children}
      </div>
    </div>
  );
}