import { store } from "../store";
import { resetUser } from "../store/userSlice";

// As chamadas vão para /api no próprio site e são repassadas ao backend no
// EC2 (http://54.234.252.44): pela Vercel em produção (vercel.json) e pelo
// Vite no npm run dev (vite.config.js). Assim o site https não chama http
// direto, o que o navegador bloquearia, e não depende de CORS.
export const API_URL = "/api";

// fetch com o token do usuário logado. Erros viram exceção com a mensagem
// do back (error/message), para o React Query cair no estado de erro.
export const api = async (rota, { method = "GET", body } = {}) => {
  const { token } = store.getState().user;

  const resposta = await fetch(`${API_URL}${rota}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    // Token vencido/inválido numa rota protegida: limpa a sessão e o
    // RotaPrivada leva para /login. No /login o 401 é só senha errada.
    if (resposta.status === 401 && token) store.dispatch(resetUser());
    throw new Error(dados.error || dados.message || "Erro ao falar com o servidor");
  }

  return dados;
};
