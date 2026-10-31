import { Modal } from "react-bootstrap";
import { Jogar } from "./components/Jogar";

export const ModalJogar = ({ show, setShow }) => {
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
        <Jogar setShow={setShow} />
      </Modal.Body>
    </Modal>
  );
};
