// Confetes em CSS puro: posições fixas para não recalcular nada a cada render.

import { CORES_CONFETE } from "../utils/constantes";

const POSICOES = [
  [5, 0.1, 1.8], [12, 0.4, 2.2], [19, 0.2, 1.6], [27, 0.5, 2.4],
  [34, 0.3, 1.9], [41, 0.6, 2.1], [48, 0.15, 2.5], [55, 0.45, 1.7],
  [62, 0.25, 2.3], [69, 0.55, 1.8], [76, 0.35, 2.2], [83, 0.05, 2.5],
  [90, 0.65, 1.9], [9, 0.75, 2.1], [24, 0.85, 1.7], [38, 0.7, 2.4],
  [57, 0.9, 2], [72, 0.8, 2.3], [87, 0.95, 1.6], [96, 0.72, 2.2],
];

export const Confete = () => (
  <div className="bol-confetes">
    {POSICOES.map(([left, delay, dur], i) => (
      <span
        key={i}
        className="bol-confete"
        style={{
          left: `${left}%`,
          background: CORES_CONFETE[i % CORES_CONFETE.length],
          animationDelay: `${delay}s`,
          animationDuration: `${dur}s`,
        }}
      />
    ))}
  </div>
);
