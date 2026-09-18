// ============================================================================
// desenharSaque — indicadores da hora do saque
// ----------------------------------------------------------------------------
// Desenha dois efeitos para deixar o saque claro e divertido:
//   1) Durante o SERVINDO: anel pulsando em volta da bola + placar com a
//      contagem regressiva 3-2-1 no centro da tela.
//   2) No momento do lançamento: flash gigante "VAI!" em amarelo com sombra.
// ============================================================================

import { GAME_WIDTH } from "../utils/constantes";
import { rect } from "./rect";

export function desenharSaque(ctx, d) {
  const cx = GAME_WIDTH / 2;

  // --- Flash "VAI!" logo após o lançamento --------------------------------
  if ((d.flashRestante || 0) > 0) {
    // Soma/some suavemente no final do flash
    const alpha = Math.max(0, Math.min(1, (d.flashRestante - 100) / 150));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '40px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText("VAI!", cx + 3, 193); // sombra preta deslocada
    ctx.fillStyle = "#ffd166";
    ctx.fillText("VAI!", cx, 190); // letreiro amarelo principal
    ctx.restore();
    return;
  }

  // --- Anel pulsando ao redor da bola (enquanto espera o saque) -----------
  const t = d.serveTempoTotal || 0;
  const raio = 16 + Math.sin(t * 5) * 5;
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(d.ball.x, d.ball.y, raio, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // --- Placar da contagem regressiva --------------------------------------
  rect(ctx, cx - 42, 92, 84, 58, "#ffd166"); // moldura amarela
  rect(ctx, cx - 38, 96, 76, 50, "#232742"); // interior escuro

  // Número atual: 1200ms de saque dividido em etapas de 400ms => 3, 2, 1
  const numero = Math.max(1, Math.ceil(d.serveRestante / 400));
  ctx.save();
  ctx.font = '34px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(String(numero), cx, 121);
  ctx.restore();
}