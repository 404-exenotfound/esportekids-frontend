import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "./client";
import { setUser } from "../store/userSlice";

// POST /login { nome, senha } -> { token, usuario }
export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ nome, senha }) => api("/login", { method: "POST", body: { nome, senha } }),
    onSuccess: (dados) => dispatch(setUser(dados)),
  });
};
