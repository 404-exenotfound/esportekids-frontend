import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

export const ModalJogar = ({ show, setShow }) => {
  const [personagem, setPersonagem] = useState("nirvana");
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      className="modal-pixel"
    >
      <Modal.Header closeButton>
        <Modal.Title>Jogar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="opcao personagem-opcao">
          <h3>SELECIONE O PERSONAGEM</h3>

          <div className="personagens-container">

            {/* NIRVANA */}
            <div
              className={`personagem ${
                personagem === "nirvana" ? "personagem-selecionado" : ""
              }`}
              onClick={() => setPersonagem("nirvana")}
            >
              <div className="personagem-imagem">
                {/* Imagem da Nirvana vai aqui */}
              </div>

              <span>NIRVANA</span>
            </div>

            {/* RODOLFO */}
            <div
              className={`personagem ${
                personagem === "rodolfo" ? "personagem-selecionado" : ""
              }`}
              onClick={() => setPersonagem("rodolfo")}
            >
              <div className="personagem-imagem">
                {/* Imagem do Rodolfo vai aqui */}
              </div>

              <span>RODOLFO</span>
            </div>


          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}
          >
            <Button className="btn-pixel">Confirmar</Button>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
};