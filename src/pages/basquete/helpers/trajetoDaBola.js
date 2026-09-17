// A bola vai em parábola até o ponto clicado (convertido para % da quadra).
// Se acertou, ela termina mais funda na cesta, por isso a escala menor.
export function trajetoDaBola(xPx, yPx, largura, altura, acertou) {
  const x = Math.min(Math.max((xPx / largura) * 100, 4), 96);
  const y = Math.min(Math.max((yPx / altura) * 100, 16), 84);
  return { x, y, escala: acertou ? 0.72 : 1 };
}