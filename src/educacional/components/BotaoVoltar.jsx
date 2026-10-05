import { useNavigate } from "react-router-dom";
import "../styles/educacional.css";

// Botão fixo no canto da tela para a criança sair do minigame a qualquer momento.
// Fica fora do layout de cada jogo (position: fixed), então não altera nada nele.
export const BotaoVoltar = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="edu-voltar"
      onClick={() => navigate("/home")}
      // Evita que o botão "segure" o foco: no atletismo e no boliche a tecla
      // ESPAÇO é usada para jogar, e num botão focado ela o acionaria.
      onMouseDown={(e) => e.preventDefault()}
      aria-label="Voltar ao início"
    >
      ⬅ VOLTAR
    </button>
  );
};
