import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { api } from "./client";
import { store } from "../store";
import { mesclarProgresso } from "../store/progressoSlice";

// GET /progresso -> { estrelas, curiosidades_lidas, jogos_liberados, conquistas }
// do jogador logado, ou null se ele ainda não salvou nada. Já mescla com o
// progresso do navegador ao chegar, então quando a query termina o Redux
// está atualizado (mesclar de novo num refetch não muda nada).
export const useCarregarProgresso = () => {
  const id = useSelector((s) => s.user.id);

  return useQuery({
    queryKey: ["progresso", id],
    queryFn: async () => {
      const salvo = await api("/progresso");
      if (salvo) store.dispatch(mesclarProgresso(salvo));
      return salvo;
    },
    staleTime: Infinity,
  });
};

// PUT /progresso -> substitui o progresso salvo pelo estado atual
export const useSalvarProgresso = () =>
  useMutation({
    mutationFn: (progresso) => api("/progresso", { method: "PUT", body: progresso }),
  });
