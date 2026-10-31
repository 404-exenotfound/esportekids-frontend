import {
  GAME_WIDTH,
  GROUND_Y,
  LINHA_DE_FALTA_X,
  PIXEL,
  PLAYER_H,
  TABUA_INICIO_X,
  TOPO_PISTA,
  ZONA_DE_SALTO_PX,
} from "../utils/constantes";
import { rect } from "./rect";
import { desenharNuvem } from "./desenharNuvem";
import { obterPaisagem } from "./desenharFundo";
import { desenharTorcida } from "./desenharTorcida";
import { desenharCaixaDeAreia } from "./desenharCaixaDeAreia";
import { desenharJuiz } from "./desenharJuiz";
import { desenharCorredor } from "./desenharCorredor";

export function desenharCena(ctx, d) {
  ctx.imageSmoothingEnabled = false;
  const camX = d.cameraX;
  const sx = (wx) => wx - camX;
  const tempo = d.tempoTotal || 0;

  // Paisagem do basquete (pré-renderizada) + nuvens andando + torcida animada
  const paisagem = obterPaisagem();
  if (paisagem?.fundo) ctx.drawImage(paisagem.fundo, 0, 0);
  else rect(ctx, 0, 0, GAME_WIDTH, GROUND_Y, "#72c6fb");

  desenharNuvem(ctx, ((150 - tempo / 90) % (GAME_WIDTH + 140)) - 70, 30);
  desenharNuvem(ctx, ((520 - tempo / 140) % (GAME_WIDTH + 140)) - 70, 58);
  desenharTorcida(ctx, paisagem?.gente, tempo / 1000, d.torcida);

  // Pista de tartan em "tábuas" com perspectiva, como a quadra do basquete.
  // A pista começa em TOPO_PISTA, mas a linha dos pés (GROUND_Y) é a linha
  // pontilhada no MEIO da pista: personagem e tábua ficam sobre ela.
  let y = TOPO_PISTA;
  let h = 5;
  let i = 0;
  while (y < 400) {
    rect(ctx, 0, y, GAME_WIDTH, h, i % 2 ? "#c0533f" : "#cd6046");
    rect(ctx, 0, y, GAME_WIDTH, 1, "rgba(255,255,255,.14)");
    y += h;
    h++;
    i++;
  }
  rect(ctx, 0, TOPO_PISTA, GAME_WIDTH, 2, "#fff3d6");
  rect(ctx, 0, TOPO_PISTA + 2, GAME_WIDTH, 2, "rgba(0,0,0,.18)");

  // Linhas pontilhadas da raia (mundo, rolam com a câmera).
  // A primeira é a linha dos pés: é sobre ela que o atleta corre.
  for (let wx = -80; wx < 1700; wx += 32) {
    const x = sx(wx);
    if (x < -40 || x > GAME_WIDTH + 10) continue;
    rect(ctx, x, GROUND_Y - 1, PIXEL * 5, PIXEL, "#FFF3D6"); // pontilhada sob a sola do tênis
    rect(ctx, x, GROUND_Y + 36, PIXEL * 5, PIXEL, "rgba(255,243,214,0.55)");
  }

  // Tábua acende quando o atleta entra na zona de salto
  if (d.etapa === "corrida" && LINHA_DE_FALTA_X - d.atletaX < ZONA_DE_SALTO_PX + 90) {
    const pulso = 0.55 + Math.sin(tempo / 90) * 0.25;
    ctx.fillStyle = `rgba(255, 201, 60, ${Math.max(pulso, 0.3)})`;
    ctx.fillRect(Math.round(sx(TABUA_INICIO_X) - 4), GROUND_Y - 10, 96, 8);
  }

  // Tábua + caixa de areia (meta e marca do pouso)
  desenharCaixaDeAreia(ctx, camX, d.metaAtual ?? 0, d.marcaPousoX, d.etapa);

  // Linha de saída da corrida
  rect(ctx, sx(70), GROUND_Y - 8, 6, 44, "#FFFFFF");

  // Juiz ao lado da linha de falta
  const juizX = sx(LINHA_DE_FALTA_X + 26);
  if (juizX > -40 && juizX < GAME_WIDTH + 20) {
    desenharJuiz(ctx, juizX, GROUND_Y - 2, d.bandeiraJuiz, tempo);
  }

  // Sombra do atleta (encolhe conforme a altura do voo)
  const altura = Math.max(0, GROUND_Y - (d.atletaY + PLAYER_H));
  const sombraW = Math.max(12, 34 - altura / 6);
  ctx.globalAlpha = 0.25;
  rect(ctx, sx(d.atletaX) + 18 - sombraW / 2, GROUND_Y + 3, sombraW, 4, "#000000");
  ctx.globalAlpha = 1;

  // Atleta (padrão basquete)
  desenharCorredor(ctx, sx(d.atletaX), d.atletaY, d.pose, d.runFrame);

  // Avisos sobre o atleta
  ctx.textAlign = "center";
  if (d.etapa === "corrida" && LINHA_DE_FALTA_X - d.atletaX <= ZONA_DE_SALTO_PX) {
    ctx.font = "800 15px 'Baloo 2', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#1F1F1F";
    ctx.lineWidth = 4;
    const tx = Math.min(Math.max(sx(d.atletaX) + 18, 80), GAME_WIDTH - 80);
    ctx.strokeText("SALTE AGORA!", tx, d.atletaY - 14);
    ctx.fillText("SALTE AGORA!", tx, d.atletaY - 14);
  }
  if (d.etapa === "voo" && !d.esticouPernas) {
    ctx.font = "800 13px 'Baloo 2', sans-serif";
    ctx.fillStyle = "#FFC93C";
    ctx.strokeStyle = "#1F1F1F";
    ctx.lineWidth = 4;
    const tx = Math.min(Math.max(sx(d.atletaX) + 18, 90), GAME_WIDTH - 90);
    ctx.strokeText("ESTIQUE AS PERNAS!", tx, d.atletaY - 12);
    ctx.fillText("ESTIQUE AS PERNAS!", tx, d.atletaY - 12);
  }
}
