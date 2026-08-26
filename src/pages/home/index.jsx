import { useState } from "react";
import { ButtonMario } from "./components/ButtonMario";
import { ModalOpcoes } from "./opcoes/ModalOpcoes";
import "./styles/index.css";
import { ModalJogar } from "./jogar/ModalJogar";

const Home = () => {
  const [modalOpcoes, setModalOpcoes] = useState(false);
  const [modalJogar, setModalJogar] = useState(false);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1
          style={{
            margin: "0 0 15px 0",
            color: "#fff",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "32px",
            textShadow: "4px 4px 0 #1f1f1f",
          }}
        >
          Escolha uma Opção
        </h1>
        <ButtonMario text="Jogar" onClick={() => setModalJogar(true)} />
        <ButtonMario text="Opções" onClick={() => setModalOpcoes(true)} />
        <ButtonMario text="Ranking" />
      </div>

      <ModalOpcoes show={modalOpcoes} setShow={setModalOpcoes} />
      <ModalJogar show={modalJogar} setShow={setModalJogar} />
    </>
  );
};

export default Home;