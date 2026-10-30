import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNomes } from "../../api/nomes";
import { useRegistro } from "../../api/registro";
import "../home/styles/index.css";
import "../login/styles/index.css";

const Registro = () => {
  const [base, setBase] = useState(null);
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const navigate = useNavigate();
  const nomes = useNomes();
  const registro = useRegistro();

  // Nome que a criança vai receber (Pedro, Pedro2...) — o back confirma no cadastro
  const escolhido = nomes.data?.find((n) => n.base === base)?.proximo;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!base) {
      setErroLocal("Escolha um nome");
      return;
    }
    if (senha !== confirmacao) {
      setErroLocal("As senhas não são iguais");
      return;
    }
    setErroLocal("");
    // Cadastro já devolve o token, então entra direto no jogo
    registro.mutate(
      { nome: base, senha },
      { onSuccess: () => navigate("/home", { replace: true }) }
    );
  };

  const erro = erroLocal || (registro.isError && registro.error.message);

  return (
    <div className="auth-pagina">
      <h1 className="auth-titulo">EsporteKids</h1>

      <div className="auth-card">
        <div className="auth-card-topo">CRIAR CONTA</div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-campo">
            <label>ESCOLHA SEU NOME</label>

            {nomes.isPending && <p className="auth-rodape">Carregando...</p>}
            {nomes.isError && <p className="auth-erro">Não deu para carregar os nomes.</p>}

            <div className="auth-nomes">
              {nomes.data?.map((n) => (
                <Button
                  key={n.base}
                  className={`btn-dificuldade ${base === n.base ? "selecionado" : ""}`}
                  onClick={() => setBase(n.base)}
                >
                  {n.proximo}
                </Button>
              ))}
            </div>

            {escolhido && (
              <p className="auth-dica">
                Você vai entrar como <strong>{escolhido}</strong>. Guarde esse nome!
              </p>
            )}
          </div>

          <div className="auth-campo">
            <label htmlFor="senha">SENHA (MÍN. 6)</label>
            <input
              id="senha"
              type="password"
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="auth-campo">
            <label htmlFor="confirmacao">CONFIRMAR SENHA</label>
            <input
              id="confirmacao"
              type="password"
              autoComplete="new-password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {erro && <p className="auth-erro" role="alert">{erro}</p>}

          <Button type="submit" className="btn-pixel" disabled={registro.isPending}>
            {registro.isPending ? "Criando..." : "Criar conta"}
          </Button>

          <p className="auth-rodape">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registro;
