import { useCallback, useEffect, useState } from "react";
import { DICAS_FASES, TOTAL_DICAS } from "./dicasFases";

const TEMPO_DICA_NA_TELA = 7000; // ms

// Liga um jogo às dicas SEM mexer na lógica dele: basta passar o contador de
// acertos que o jogo já expõe (cestas, gols, estrelas, pontos...). Cada vez que
// ele SOBE, a próxima dica é liberada (até 5). Se ele cai (jogo reiniciado),
// as dicas recomeçam.
export function useDicasDoJogo(esporte, acertos) {
  const [estado, setEstado] = useState({ anterior: acertos, vistas: 0, visivel: false });

  // Ajuste de estado durante a renderização (padrão recomendado pelo React
  // para reagir à mudança de um valor sem usar useEffect).
  if (acertos !== estado.anterior) {
    if (acertos > estado.anterior) {
      setEstado({
        anterior: acertos,
        vistas: Math.min(estado.vistas + 1, TOTAL_DICAS),
        visivel: true,
      });
    } else {
      setEstado({ anterior: acertos, vistas: 0, visivel: false });
    }
  }

  // Some sozinha depois de alguns segundos
  useEffect(() => {
    if (!estado.visivel) return undefined;
    const t = setTimeout(() => setEstado((e) => ({ ...e, visivel: false })), TEMPO_DICA_NA_TELA);
    return () => clearTimeout(t);
  }, [estado.visivel, estado.vistas]);

  const reiniciar = useCallback(
    () => setEstado((e) => ({ ...e, vistas: 0, visivel: false })),
    []
  );

  const dicas = DICAS_FASES[esporte];
  const dicaVisivel =
    estado.visivel && estado.vistas > 0
      ? { numero: estado.vistas, total: TOTAL_DICAS, texto: dicas[estado.vistas - 1].dica }
      : null;

  return { vistas: estado.vistas, dicaVisivel, reiniciar };
}
