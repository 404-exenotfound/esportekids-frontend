import { store } from "../store";
import { resetUser } from "../store/userSlice";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(status, corpo) {
    super(corpo?.error ?? corpo?.message ?? `Erro ${status}`);
    this.status = status;
    this.corpo = corpo;
  }
}

// fetch com JSON e token. Qualquer status fora de 2xx vira ApiError,
// que é o que o React Query precisa para cair no estado de erro.
export const apiFetch = async (caminho, { method = "GET", body } = {}) => {
  const { token } = store.getState().user;

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // Token expirado ou inválido: desloga para a tela pedir login de novo.
    // Sem token, o 401 é de credencial errada no /login, e não há o que limpar.
    if (resposta.status === 401 && token) store.dispatch(resetUser());
    throw new ApiError(resposta.status, corpo);
  }

  return corpo;
};
