import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Personagem } from "./components/Personagem";
import { Jogar } from "./components/Jogar";

export const ModalJogar = ({ show, setShow }) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    return () => { 
      setStep(0);
    }
  }, [show])

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
        {step === 0 && <Personagem setStep={setStep} />}
        {step === 1 && <Jogar setShow={setShow} setStep={setStep}  />}
      </Modal.Body>
    </Modal>
  );
};