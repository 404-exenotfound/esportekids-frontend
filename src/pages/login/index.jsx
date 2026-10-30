import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLogin } from "../../api/login";
import "../home/styles/index.css";
import "./styles/index.css";

const Login = () => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const onSubmit = (e) => {
    e.preventDefault();
    login.mutate(
      { nome: nome.trim(), senha },
      // Volta para a tela que a criança tentou abrir antes do login
      { onSuccess: () => navigate(location.state?.de || "/home", { replace: true }) }
    );
  };

  return (
    <div className="auth-pagina">
      <h1 className="auth-titulo">EsporteKids</h1>

      <div className="auth-card">
        <div className="auth-card-topo">ENTRAR</div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-campo">
            <label htmlFor="nome">NOME</label>
            <input
              id="nome"
              type="text"
              autoComplete="username"
              placeholder="Ex.: Pedro2"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="auth-campo">
            <label htmlFor="senha">SENHA</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {login.isError && <p className="auth-erro" role="alert">{login.error.message}</p>}

          <Button type="submit" className="btn-pixel" disabled={login.isPending}>
            {login.isPending ? "Entrando..." : "Entrar"}
          </Button>

          <p className="auth-rodape">
            Ainda não tem conta? <Link to="/registro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
