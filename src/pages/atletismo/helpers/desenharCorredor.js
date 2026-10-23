import { PALETA_ATLETA, SPRITE_CORPO } from "../utils/corredor";
import { rect } from "./rect";

const ESCALA = 3; // sprite 12x24 células -> atleta de 36x72 px

function sprite(ctx, x, y) {
  SPRITE_CORPO.forEach((linha, j) => {
    for (let i = 0; i < linha.length; i++) {
      const cor = PALETA_ATLETA[linha[i]];
      if (!cor) continue;
      rect(ctx, x + i * ESCALA, y + j * ESCALA, ESCALA, ESCALA, cor);
    }
  });
}

// Membro em segmentos (igual ao braço do basquete): manga/pele ou pele/meia/tênis
function membro(ctx, x0, y0, x1, y1, grossura, cor1, cor2) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    rect(ctx, x - grossura / 2, y - grossura / 2, grossura, grossura, t < 0.35 ? cor1 : cor2);
  }
}

function perna(ctx, quadrilX, quadrilY, peX, peY) {
  const joelhoX = (quadrilX + peX) / 2 + 3;
  const joelhoY = (quadrilY + peY) / 2;
  membro(ctx, quadrilX, quadrilY, joelhoX, joelhoY, 6, PALETA_ATLETA.s, PALETA_ATLETA.S);
  membro(ctx, joelhoX, joelhoY, peX, peY - 3, 5, PALETA_ATLETA.S, PALETA_ATLETA.L);
  rect(ctx, peX - 4, peY - 5, 10, 4, PALETA_ATLETA.B); // tênis
  rect(ctx, peX - 4, peY - 1, 10, 1, PALETA_ATLETA.b);
}

function braco(ctx, ombroX, ombroY, maoX, maoY) {
  membro(ctx, ombroX, ombroY, maoX, maoY, 4, PALETA_ATLETA.j, PALETA_ATLETA.S);
}

// Atleta no padrão do basquete. Poses do salto:
// parado | corrida | impulso | voo | pouso | comemoracao | triste
// (x, y) = canto superior esquerdo; os pés ficam em y + 72.
export function desenharCorredor(ctx, x, y, pose, frame) {
  const PELE = PALETA_ATLETA.S;
  void PELE;
  const quadrilY = y + 49;
  const qE = x + 11; // quadril esquerdo
  const qD = x + 25; // quadril direito
  const ombroY = y + 28;
  const oE = x + 4;
  const oD = x + 32;

  let pes, maos;
  switch (pose) {
    case "corrida":
      // y + 72 = linha do chão: em cada frame um pé está plantado nela
      if (frame === 0) { pes = [[x + 34, y + 72], [x + 2, y + 54]]; maos = [[x + 28, y + 36], [x + 8, y + 42]]; }
      else if (frame === 1) { pes = [[x + 10, y + 60], [x + 29, y + 68]]; maos = [[x + 18, y + 40], [x + 20, y + 40]]; }
      else { pes = [[x + 4, y + 54], [x + 32, y + 72]]; maos = [[x + 10, y + 38], [x + 30, y + 44]]; }
      break;
    case "impulso":
      pes = [[x + 30, y + 72], [x + 6, y + 52]];
      maos = [[x + 33, y + 20], [x + 5, y + 30]];
      break;
    case "voo":
      pes = [[x + 33, y + 57], [x + 5, y + 49]];
      maos = [[x + 1, y + 13], [x + 35, y + 13]];
      break;
    case "pouso":
      pes = [[x + 41, y + 59], [x + 39, y + 67]];
      maos = [[x + 3, y + 41], [x + 28, y + 45]];
      break;
    case "comemoracao":
      pes = [[x + 10, y + 72], [x + 26, y + 72]];
      maos = [[x + 3, y + 6], [x + 33, y + 6]];
      break;
    case "triste":
      pes = [[x + 10, y + 72], [x + 26, y + 72]];
      maos = [[x + 7, y + 27], [x + 29, y + 27]];
      break;
    default: // parado
      pes = [[x + 10, y + 72], [x + 26, y + 72]];
      maos = [[x + 2, y + 47], [x + 34, y + 47]];
  }

  // Pernas e braço de trás, depois o corpo, depois o braço da frente
  perna(ctx, qE, quadrilY, pes[1][0], pes[1][1]);
  perna(ctx, qD, quadrilY, pes[0][0], pes[0][1]);
  braco(ctx, oE, ombroY, maos[1][0], maos[1][1]);
  sprite(ctx, x, y);
  braco(ctx, oD, ombroY, maos[0][0], maos[0][1]);
}
