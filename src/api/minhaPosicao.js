import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { api } from "./client";

// GET /ranking/eu -> posição do jogador logado (mesmo fora do top 10)
export const useMinhaPosicao = () => {
  const id = useSelector((s) => s.user.id);

  return useQuery({
    queryKey: ["ranking", "eu", id],
    queryFn: () => api("/ranking/eu"),
  });
};
