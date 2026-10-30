import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "./client";
import { setUser } from "../store/userSlice";

// POST /registro { nome: base da lista, senha } -> { token, usuario }.
// O back decide o nome final (Pedro, Pedro2...) e já devolve logado.
export const useRegistro = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nome, senha }) => api("/registro", { method: "POST", body: { nome, senha } }),
    onSuccess: (dados) => {
      dispatch(setUser(dados));
      // O próximo número daquele nome mudou
      queryClient.invalidateQueries({ queryKey: ["nomes"] });
    },
  });
};
