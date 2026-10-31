import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

// POST /partida/resultado { materia_id, acertos, total_perguntas }.
// O back calcula a pontuação (acertos * 10). Depois de salvar, o ranking
// e o histórico ficam desatualizados, então invalida os dois.
export const useSalvarResultado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ materia_id, acertos, total_perguntas }) =>
      api("/partida/resultado", { method: "POST", body: { materia_id, acertos, total_perguntas } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
      queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
  });
};
