import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Erro de cliente (401, 400...) não melhora tentando de novo
      retry: (falhas, erro) => !(erro?.status >= 400 && erro?.status < 500) && falhas < 2,
    },
  },
});
