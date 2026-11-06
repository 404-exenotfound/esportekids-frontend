import { useNavigate } from "react-router-dom";
import useDispositivo from "../hooks/useDispositivo";
import "../styles/jogo-dispositivo.css";

// Celular em pé: cobre a tela pedindo para girar (os minigames são deitados e
// em pé ficariam minúsculos). "ativo" = false no fim do jogo, para o quiz e o
// resultado (fora do palco) poderem ser lidos em pé. Tem o próprio VOLTAR
// porque cobre o botão fixo do canto.
export default function AvisoGirarCelular({ ativo }) {
  const { ehCelular, retrato } = useDispositivo();
  const navigate = useNavigate();
  if (!ativo || !ehCelular || !retrato) return null;

  return (
    <div className="jogo-aviso-girar" role="alert">
      <button
        type="button"
        className="jogo-aviso-voltar"
        onClick={() => navigate("/home")}
        aria-label="Voltar ao início"
      >
        ⬅ VOLTAR
      </button>
      <span className="jogo-aviso-icone" aria-hidden="true">📱</span>
      <p className="jogo-aviso-titulo">GIRE O CELULAR PARA JOGAR</p>
      <p className="jogo-aviso-sub">O jogo funciona deitado</p>
    </div>
  );
}
