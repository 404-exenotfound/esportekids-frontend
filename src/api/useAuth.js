import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiFetch } from "./client";
import { setUser, resetUser } from "../store/userSlice";

// Login e registro devolvem o mesmo formato ({ token, usuario }),
// então os dois só diferem na rota.
const useEntrar = (caminho) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados) => apiFetch(caminho, { method: "POST", body: dados }),
    onSuccess: (resposta) => {
      // Histórico/ranking em cache podem ser de outra pessoa
      queryClient.removeQueries();
      dispatch(setUser(resposta));
    },
  });
};

export const useLogin = () => useEntrar("/login");
export const useRegistro = () => useEntrar("/registro");

export const useSair = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries();
    dispatch(resetUser());
  };
};
