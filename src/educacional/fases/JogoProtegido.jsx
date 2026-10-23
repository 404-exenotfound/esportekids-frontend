import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Só deixa abrir o jogo se ele já foi liberado; senão volta para o início.
// Isso também vale para quem digita /futebol direto na barra de endereço.
export const JogoProtegido = ({ jogo, children }) => {
  const liberados = useSelector((s) => s.progresso.jogosLiberados);
  return liberados.includes(jogo) ? children : <Navigate to="/home" replace />;
};
