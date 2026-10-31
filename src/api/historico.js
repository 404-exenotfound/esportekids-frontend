import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { api } from "./client";

// GET /historico -> últimas 20 partidas do jogador logado
export const useHistorico = () => {
  const id = useSelector((s) => s.user.id);

  return useQuery({
    queryKey: ["historico", id],
    queryFn: () => api("/historico"),
  });
};
