import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { resetUser } from "../../store/userSlice";
import { ButtonMario } from "./components/ButtonMario";
import "./styles/index.css";
import { ModalJogar } from "./jogar/ModalJogar";

const Home = () => {
  const [modalJogar, setModalJogar] = useState(() => (
    new URLSearchParams(window.location.search).get("menu") === "jogar"
  ));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const nome = useSelector((state) => state.user.nome);

  const sair = () => {
    dispatch(resetUser());
    // Ranking/histórico em cache são do usuário que saiu
    queryClient.clear();
    navigate("/login", { replace: true });
  };

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
        <p
          style={{
            margin: 0,
            color: "#fff",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "14px",
            lineHeight: 1.6,
            textShadow: "3px 3px 0 #1f1f1f",
          }}
        >
          Olá, {nome}!
        </p>
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
        <ButtonMario text="Ranking" onClick={() => navigate("/ranking")} />
        <ButtonMario text="Sair" onClick={sair} />
      </div>

      <ModalJogar show={modalJogar} setShow={setModalJogar} />
    </>
  );
};

export default Home;