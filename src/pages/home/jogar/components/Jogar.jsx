import { useState } from "react";
import { ItemJogo } from "./ItemJogo";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ESPORTES } from "../../../../educacional/data/esportes";
import { MINIMO_PARA_LIBERAR, ORDEM_JOGOS, jogoAnterior } from "../../../../educacional/fases/dicasFases";

export const Jogar = ({ setShow, setStep }) => {
  const navigate = useNavigate();
  const [jogo, setJogo] = useState("basquete");
  const liberados = useSelector((state) => state.progresso.jogosLiberados);

  const itemDe = (nomeJogo) => {
    const id = nomeJogo.toLowerCase();
    const bloqueado = !liberados.includes(id);
    const anterior = jogoAnterior(id);
    return {
      nomeJogo,
      jogo,
      setJogo,
      bloqueado,
      dica: anterior ? `Passe no quiz do ${ESPORTES[anterior].nome} para liberar` : "",
    };
  };

  const onSubmit = () => {
    setShow(false);
    // As rotas são geradas a partir das pastas em ./pages (ver App.jsx),
    // sempre em minúsculo — então "futebol" leva direto para /futebol.
    if (!ORDEM_JOGOS.includes(jogo.toLowerCase()) || !liberados.includes(jogo.toLowerCase())) return;
    navigate(`/${jogo.toLowerCase()}`);
  };

  return (
    <div className="opcao personagem-opcao">
      <h3>SELECIONE O JOGO</h3>

      <div className="personagens-container jogos-container">
        <ItemJogo {...itemDe("basquete")} />
        <ItemJogo {...itemDe("futebol")} />
        <ItemJogo {...itemDe("atletismo")} />
        <ItemJogo {...itemDe("pingPong")} />
        <ItemJogo {...itemDe("boliche")} />
      </div>
      <p style={{ fontSize: "9px", lineHeight: 1.6, marginTop: "14px" }}>
        🔒 Jogue, leia as dicas e acerte {MINIMO_PARA_LIBERAR} de 5 no quiz para liberar o próximo jogo!
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px'
        }}
      >
        <Button className="btn-pixel" onClick={() => setStep(0)}>Voltar</Button>
        <Button className="btn-pixel" onClick={onSubmit}>Jogar</Button>
      </div>

    </div>
  )
}
