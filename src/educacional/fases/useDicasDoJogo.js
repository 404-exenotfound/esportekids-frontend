import { useCallback, useEffect, useState } from "react";
import { DICAS_FASES, TOTAL_DICAS } from "./dicasFases";
import { useAudioDaDica } from "./useAudioDaDica";

// Tempo MÍNIMO da dica na tela. Se a narração for mais longa, a dica só some
// quando o áudio terminar.
const TEMPO_DICA_NA_TELA = 7000; // ms

// Liga um jogo às dicas SEM mexer na lógica dele: basta passar o contador de
// acertos que o jogo já expõe (cestas, gols, estrelas, pontos...). Cada vez que
// ele SOBE, a próxima dica é liberada (até 5) e a narração dela toca. Se ele
// cai (jogo reiniciado), as dicas recomeçam.
export function useDicasDoJogo(esporte, acertos) {
  // "exibicao" conta cada vez que o aviso aparece: identifica a exibição atual
  // para o timer e para o áudio.
  const [estado, setEstado] = useState({ anterior: acertos, vistas: 0, visivel: false, exibicao: 0 });
  const [minimoCumprido, setMinimoCumprido] = useState(0); // exibição que já cumpriu o tempo mínimo

  // Ajuste de estado durante a renderização (padrão recomendado pelo React
  // para reagir à mudança de um valor sem usar useEffect).
  if (acertos !== estado.anterior) {
    if (acertos > estado.anterior) {
      setEstado({
        anterior: acertos,
        vistas: Math.min(estado.vistas + 1, TOTAL_DICAS),
        visivel: true,
        exibicao: estado.exibicao + 1,
      });
    } else {
      setEstado({ ...estado, anterior: acertos, vistas: 0, visivel: false });
    }
  }

  useEffect(() => {
    if (!estado.visivel) return undefined;
    const t = setTimeout(() => setMinimoCumprido(estado.exibicao), TEMPO_DICA_NA_TELA);
    return () => clearTimeout(t);
  }, [estado.visivel, estado.exibicao]);

  const audio = useAudioDaDica(esporte, estado.visivel ? estado.vistas : 0, estado.exibicao);
  const terminou = minimoCumprido === estado.exibicao && audio.terminou;
  const naTela = estado.visivel && estado.vistas > 0 && !terminou;

  const reiniciar = useCallback(
    () => setEstado((e) => ({ ...e, vistas: 0, visivel: false })),
    []
  );

  const dicas = DICAS_FASES[esporte];
  const dicaVisivel = naTela
    ? { numero: estado.vistas, total: TOTAL_DICAS, texto: dicas[estado.vistas - 1].dica }
    : null;

  return { vistas: estado.vistas, dicaVisivel, reiniciar };
}
