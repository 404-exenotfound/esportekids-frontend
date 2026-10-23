import { ARO } from "../utils/constantes";

// O clique vira acerto se a distância até o centro da cesta for menor que o
// raio de precisão (a "boca" visível da cesta, que encolhe com a dificuldade).
export function acertouAro(x, y, largura, altura, raioPrecisao, aro = ARO) {
  const aroX = (aro.x / 100) * largura;
  const aroY = (aro.y / 100) * altura;
  const dx = x - aroX;
  const dy = y - aroY;
  return Math.sqrt(dx * dx + dy * dy) <= raioPrecisao;
}