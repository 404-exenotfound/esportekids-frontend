import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

// GET /materias. Cada esporte é uma matéria no banco (casada pelo nome).
// Quase nunca muda, então fica em cache a sessão inteira.
export const useMaterias = () =>
  useQuery({
    queryKey: ["materias"],
    queryFn: () => api("/materias"),
    staleTime: Infinity,
  });
