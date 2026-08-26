import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";

export const ModalOpcoes = ({ show, setShow }) => {
  const [volume, setVolume] = useState(70);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      className="modal-pixel"
    >
      <Modal.Header closeButton>
        <Modal.Title>OPÇÕES</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="opcao">
          <h3>VOLUME</h3>

          <div className="volume-container">

            <Form.Range
              min="0"
              max="100"
              defaultValue="70"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="volume-range"
            />

            <span className="volume-value">{volume}%</span>
          </div>
        </div>

        {/* DIFICULDADE */}
        <div className="opcao">
          <h3>DIFICULDADE</h3>

          <div className="dificuldade-container">
            <Button className="btn-dificuldade">
              FÁCIL
            </Button>

            <Button className="btn-dificuldade">
              MÉDIO
            </Button>

            <Button className="btn-dificuldade">
              DIFÍCIL
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};