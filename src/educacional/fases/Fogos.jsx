import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ============================================================================
// Fogos — comemoração em PIXEL ART para quem completou todas as fases
// ----------------------------------------------------------------------------
// Um canvas de baixa resolução (1 "pixel" do jogo = PIXEL pixels da tela),
// ampliado sem suavização, igual aos minigames. Foguetes sobem deixando um
// rastro de faíscas e explodem em formas variadas (círculo, anéis, estrela —
// como as bandeiras da arena —, coração e peônia com estalinhos). Confetes
// quadradinhos caem o tempo todo.
//
// O canvas é desenhado direto no <body> (portal), por cima da página mas SEM
// bloquear cliques, e usa mix-blend-mode: screen (ver .edu-fogos no CSS): sobre
// o fundo escuro ele brilha; sobre os cards claros (créditos, botões) some,
// então nunca atrapalha a leitura. Quem prefere menos movimento não vê a
// animação (só o banner). Ao desmontar, tudo é limpo.
// ============================================================================

const PIXEL = 4; // tamanho de cada "pixel" do canvas na tela
const MAX_PARTICULAS = 900;
const CORES = ["#e63946", "#ffd166", "#60a5fa", "#ffffff", "#06d6a0", "#9b59d0", "#ff8fab"];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (lista) => lista[Math.floor(Math.random() * lista.length)];

/* ---------- Formas das explosões: vetores unitários (x, y) ---------- */
const circulo = (n, raio = 1) =>
  Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n;
    return [Math.cos(a) * raio, Math.sin(a) * raio];
  });

const estrela = () => {
  const vertices = [];
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? 1 : 0.42;
    const a = -Math.PI / 2 + (Math.PI * i) / 5;
    vertices.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const pontos = [];
  for (let i = 0; i < 10; i += 1) {
    const [x1, y1] = vertices[i];
    const [x2, y2] = vertices[(i + 1) % 10];
    for (let k = 0; k < 4; k += 1) {
      const t = k / 4;
      pontos.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
  }
  return pontos;
};

const coracao = () =>
  Array.from({ length: 36 }, (_, i) => {
    const t = (Math.PI * 2 * i) / 36;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [x / 17, y / 17];
  });

const peonia = () =>
  Array.from({ length: 46 }, () => {
    const a = rand(0, Math.PI * 2);
    const r = Math.sqrt(Math.random());
    return [Math.cos(a) * r, Math.sin(a) * r];
  });

const FORMAS = [
  { nome: "circulo", gerar: () => circulo(30) },
  { nome: "aneis", gerar: () => [...circulo(14, 0.55), ...circulo(26, 1)] },
  { nome: "estrela", gerar: estrela },
  { nome: "coracao", gerar: coracao },
  { nome: "peonia", gerar: peonia, estalo: true },
];

/* ---------- Partículas ---------- */
function novaFaisca(ps, x, y, vx, vy, cor, opcoes = {}) {
  if (ps.length >= MAX_PARTICULAS) return;
  const vida = opcoes.vida ?? rand(1.1, 1.6);
  ps.push({
    x, y, vx, vy, cor,
    vida, max: vida,
    arrasto: opcoes.arrasto ?? 1.7,
    g: opcoes.g ?? 20,
    tam: opcoes.tam ?? 1,
    estalo: opcoes.estalo ?? false,
    brilha: opcoes.brilha ?? true,
  });
}

function explodir(ps, x, y, forma, cor, cor2, escala) {
  // velocidade inicial (pixels/s): define o tamanho; cresce junto com a tela
  const alcance = rand(64, 92) * escala;
  for (const [ux, uy] of forma.gerar()) {
    const c = cor2 && Math.random() < 0.35 ? cor2 : cor;
    novaFaisca(ps, x, y, ux * alcance, uy * alcance, c, {
      tam: forma.nome === "estrela" || forma.nome === "coracao" ? 2 : 1,
      estalo: !!forma.estalo && Math.random() < 0.45,
    });
  }
  // clarão branco no centro
  for (let i = 0; i < 6; i += 1) {
    const a = rand(0, Math.PI * 2);
    novaFaisca(ps, x, y, Math.cos(a) * 14, Math.sin(a) * 14, "#ffffff", { vida: 0.3, tam: 2, brilha: false });
  }
}

export const Fogos = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    let W = 0;
    let H = 0;
    const ajustar = () => {
      W = Math.ceil(window.innerWidth / PIXEL);
      H = Math.ceil(window.innerHeight / PIXEL);
      canvas.width = W;
      canvas.height = H;
      ctx.imageSmoothingEnabled = false;
    };
    ajustar();
    window.addEventListener("resize", ajustar);

    const foguetes = [];
    const ps = [];
    const confetes = Array.from({ length: 46 }, () => ({
      x: rand(0, 1), // fração da largura
      y: rand(0, 1),
      vy: rand(10, 26),
      fase: rand(0, Math.PI * 2),
      cor: pick(CORES),
    }));

    const lancar = (atraso = 0) => {
      const alvoY = rand(0.14, 0.5) * H;
      const duracao = rand(0.8, 1.05);
      foguetes.push({
        espera: atraso,
        x: rand(0.1, 0.9) * W,
        y: H + 2,
        vx: rand(-6, 6),
        vy: -(H - alvoY) / duracao,
        alvoY,
        forma: pick(FORMAS),
        cor: pick(CORES.filter((c) => c !== "#ffffff")),
        cor2: Math.random() < 0.6 ? pick(CORES) : null,
      });
    };

    // abertura: três foguetes em sequência
    lancar(0.1);
    lancar(0.45);
    lancar(0.8);

    let proximo = 1.4; // segundos até o próximo lançamento
    let proximoFinal = 6; // "tiro de gala": vários de uma vez
    let ultimo = 0;
    let raf = 0;

    const quadro = (agora) => {
      if (!ultimo) ultimo = agora;
      const dt = Math.min((agora - ultimo) / 1000, 0.05);
      ultimo = agora;

      // agenda
      proximo -= dt;
      proximoFinal -= dt;
      if (proximoFinal <= 0) {
        for (let i = 0; i < 5; i += 1) lancar(i * 0.18);
        proximoFinal = rand(6, 8);
        proximo = rand(1.2, 1.8);
      } else if (proximo <= 0) {
        lancar();
        if (Math.random() < 0.4) lancar(0.25);
        proximo = rand(0.3, 0.7);
      }

      // foguetes
      for (let i = foguetes.length - 1; i >= 0; i -= 1) {
        const f = foguetes[i];
        if (f.espera > 0) {
          f.espera -= dt;
          continue;
        }
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        // rastro de faíscas
        novaFaisca(ps, f.x, f.y + 2, rand(-5, 5), rand(10, 24), Math.random() < 0.5 ? "#ffd166" : "#ffffff", {
          vida: rand(0.25, 0.45), g: 8, brilha: false,
        });
        if (f.y <= f.alvoY) {
          explodir(ps, f.x, f.y, f.forma, f.cor, f.cor2, Math.min(1.5, Math.max(0.9, Math.min(W, H) / 150)));
          foguetes.splice(i, 1);
        }
      }

      // partículas
      for (let i = ps.length - 1; i >= 0; i -= 1) {
        const p = ps[i];
        p.vida -= dt;
        if (p.vida <= 0) {
          ps.splice(i, 1);
          continue;
        }
        const a = Math.exp(-p.arrasto * dt);
        p.vx *= a;
        p.vy = p.vy * a + p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // estalinhos: perto do fim, soltam faíscas brancas minúsculas
        if (p.estalo && p.vida < 0.28) {
          p.estalo = false;
          for (let k = 0; k < 3; k += 1) {
            novaFaisca(ps, p.x, p.y, rand(-22, 22), rand(-22, 22), "#ffffff", { vida: 0.22, g: 10, brilha: false });
          }
        }
      }

      // desenho
      ctx.clearRect(0, 0, W, H);

      for (const c of confetes) {
        c.y += (c.vy * dt) / H;
        if (c.y > 1.02) {
          c.y = -0.02;
          c.x = rand(0, 1);
        }
        const x = c.x * W + Math.sin(agora / 600 + c.fase) * 4;
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = c.cor;
        ctx.fillRect(Math.round(x), Math.round(c.y * H), 2, 2);
      }

      for (const f of foguetes) {
        if (f.espera > 0) continue;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 3);
      }

      for (const p of ps) {
        const t = p.vida / p.max;
        if (p.brilha && t < 0.5 && Math.random() < 0.3) continue; // cintilar
        ctx.globalAlpha = Math.min(1, t * 1.6);
        ctx.fillStyle = p.brilha && t > 0.9 ? "#ffffff" : p.cor;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.tam, p.tam);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", ajustar);
    };
  }, []);

  return createPortal(
    <canvas ref={canvasRef} className="edu-fogos" aria-hidden="true" />,
    document.body
  );
};
