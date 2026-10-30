import { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useLogin, useRegistro } from "../../../api/useAuth";

const MODOS = [
  { valor: "login", rotulo: "ENTRAR" },
  { valor: "registro", rotulo: "CRIAR CONTA" },
];

export const ModalLogin = ({ show, setShow }) => {
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const login = useLogin();
  const registro = useRegistro();
  const mutation = modo === "login" ? login : registro;

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const fechar = () => {
    setShow(false);
    login.reset();
    registro.reset();
  };

  const enviar = (e) => {
    e.preventDefault();
    const { nome, email, senha } = form;
    const dados = modo === "login" ? { email, senha } : { nome, email, senha };
    mutation.mutate(dados, { onSuccess: fechar });
  };

  return (
    <Modal show={show} onHide={fechar} centered className="modal-pixel">
      <Modal.Header closeButton>
        <Modal.Title>{modo === "login" ? "ENTRAR" : "CRIAR CONTA"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="dificuldade-container mb-4">
          {MODOS.map(({ valor, rotulo }) => (
            <Button
              key={valor}
              className={`btn-dificuldade ${modo === valor ? "selecionado" : ""}`}
              onClick={() => setModo(valor)}
            >
              {rotulo}
            </Button>
          ))}
        </div>

        <Form onSubmit={enviar}>
          {modo === "registro" && (
            <Form.Group className="mb-3" controlId="login-nome">
              <Form.Label>NOME</Form.Label>
              <Form.Control value={form.nome} onChange={mudar("nome")} required />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="login-email">
            <Form.Label>EMAIL</Form.Label>
            <Form.Control type="email" value={form.email} onChange={mudar("email")} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="login-senha">
            <Form.Label>SENHA</Form.Label>
            <Form.Control type="password" minLength={6} value={form.senha} onChange={mudar("senha")} required />
          </Form.Group>

          {mutation.isError && (
            <Alert variant="danger" className="rounded-0">
              {mutation.error.message}
            </Alert>
          )}

          <Button type="submit" className="btn-dificuldade selecionado w-100" disabled={mutation.isPending}>
            {mutation.isPending ? "AGUARDE..." : "CONFIRMAR"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
