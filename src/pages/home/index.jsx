import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ButtonMario } from "./components/ButtonMario";
import { ModalOpcoes } from "./opcoes/ModalOpcoes";
import "./styles/index.css";
import { ModalJogar } from "./jogar/ModalJogar";
import { ModalLogin } from "./login/ModalLogin";
import { useSair } from "../../api/useAuth";

const Home = () => {
  const [modalOpcoes, setModalOpcoes] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const usuario = useSelector((s) => s.user);
  const sair = useSair();
  const [modalJogar, setModalJogar] = useState(() => (
    new URLSearchParams(window.location.search).get("menu") === "jogar"
  ));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("menu") !== "jogar") return;

    navigate("/home", { replace: true });
  }, [location.search, navigate]);

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
        <ButtonMario text="Aprender" onClick={() => navigate("/aprender")} />
        <ButtonMario text="Álbum" onClick={() => navigate("/album")} />
        <ButtonMario text="Opções" onClick={() => setModalOpcoes(true)} />
        <ButtonMario text="Ranking" onClick={() => navigate("/ranking")} />
        {usuario.token ? (
          <ButtonMario text={`Sair (${usuario.nome})`} onClick={sair} />
        ) : (
          <ButtonMario text="Entrar" onClick={() => setModalLogin(true)} />
        )}
      </div>

      <ModalOpcoes show={modalOpcoes} setShow={setModalOpcoes} />
      <ModalJogar show={modalJogar} setShow={setModalJogar} />
      <ModalLogin show={modalLogin} setShow={setModalLogin} />
    </>
  );
};

export default Home;