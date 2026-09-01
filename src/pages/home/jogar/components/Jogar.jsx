import { useState } from "react";
import { ItemJogo } from "./ItemJogo";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export const Jogar = ({ setShow, setStep }) => {
  const navigate = useNavigate();
  const [jogo, setJogo] = useState("basquete");

  const onSubmit = () => {
    setShow(false);
    // As rotas são geradas a partir das pastas em ./pages (ver App.jsx),
    // sempre em minúsculo — então "futebol" leva direto para /futebol.
    navigate(`/${jogo.toLowerCase()}`);
  };

  return (
    <div className="opcao personagem-opcao">
      <h3>SELECIONE O JOGO</h3>

      <div className="personagens-container">
        <ItemJogo jogo={jogo} setJogo={setJogo} nomeJogo="basquete" />
        <ItemJogo jogo={jogo} setJogo={setJogo} nomeJogo="futebol" />
        <ItemJogo jogo={jogo} setJogo={setJogo} nomeJogo="pingPong" />
      </div>
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
