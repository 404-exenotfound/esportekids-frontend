import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Sem login não entra em nada: manda para /login lembrando de onde veio,
// para voltar direto para lá depois de entrar.
export const RotaPrivada = ({ children }) => {
  const token = useSelector((s) => s.user.token);
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  return children;
};

// O contrário: quem já está logado não precisa ver /login nem /registro.
export const RotaPublica = ({ children }) => {
  const token = useSelector((s) => s.user.token);
  return token ? <Navigate to="/home" replace /> : children;
};
