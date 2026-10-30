import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { apiFetch } from "./client";
import { ESPORTES } from "../educacional/data/esportes";

export const chaves = {
  materias: ["materias"],
  historico: ["historico"],
  ranking: ["ranking"],
};

// No banco cada esporte é uma "matéria" com o mesmo nome (seed no setup.sql do back)
export const useMaterias = () =>
  useQuery({
    queryKey: chaves.materias,
    queryFn: () => apiFetch("/materias"),
    staleTime: Infinity,
  });

const useLogado = () => Boolean(useSelector((s) => s.user.token));

export const useHistorico = () =>
  useQuery({
    queryKey: chaves.historico,
    queryFn: () => apiFetch("/historico"),
    enabled: useLogado(),
  });

export const useRanking = () =>
  useQuery({
    queryKey: chaves.ranking,
    queryFn: () => apiFetch("/ranking"),
    enabled: useLogado(),
  });

// Envia o resultado de um quiz local. Sem login, ou se o esporte ainda não
// existe no banco, não faz nada: o progresso continua salvo no Redux.
export const useSalvarResultado = () => {
  const logado = useLogado();
  const { data: materias } = useMaterias();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dados) => apiFetch("/partida/resultado", { method: "POST", body: dados }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chaves.historico });
      queryClient.invalidateQueries({ queryKey: chaves.ranking });
    },
  });

  const salvar = ({ esporte, acertos, total }) => {
    const nome = ESPORTES[esporte]?.nome;
    const materia = materias?.find((m) => m.nome === nome);
    if (!logado || !materia) return;
    mutation.mutate({ materia_id: materia.id, acertos, total_perguntas: total });
  };

  return { ...mutation, salvar };
};
