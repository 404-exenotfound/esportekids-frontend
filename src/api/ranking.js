import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

// GET /ranking -> top 10 por pontuação total
export const useRanking = () =>
  useQuery({
    queryKey: ["ranking", "top"],
    queryFn: () => api("/ranking"),
  });
