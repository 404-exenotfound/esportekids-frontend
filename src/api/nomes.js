import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

// GET /nomes -> [{ base: "Pedro", proximo: "Pedro2" }]
// "proximo" é o nome que a criança vai receber se escolher essa base agora.
export const useNomes = () =>
  useQuery({
    queryKey: ["nomes"],
    queryFn: () => api("/nomes"),
  });
