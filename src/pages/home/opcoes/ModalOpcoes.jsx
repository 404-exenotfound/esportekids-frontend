import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setVolume, setDificuldade } from "../../../store/gameSlice";

const DIFICULDADES = [
  { valor: "facil", rotulo: "FÁCIL" },
  { valor: "media", rotulo: "MÉDIO" },
  { valor: "dificil", rotulo: "DIFÍCIL" },
];

export const ModalOpcoes = ({ show, setShow }) => {
  const { volume, dificuldade } = useSelector((state) => state.jogo);
  const dispatch = useDispatch();

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
              value={volume}
              onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
              className="volume-range"
            />

            <span className="volume-value">{volume}%</span>
          </div>
        </div>

        {/* DIFICULDADE */}
        <div className="opcao">
          <h3>DIFICULDADE</h3>

          <div className="dificuldade-container">
            {DIFICULDADES.map(({ valor, rotulo }) => (
              <Button
                key={valor}
                className={`btn-dificuldade ${dificuldade === valor ? "selecionado" : ""}`}
                onClick={() => dispatch(setDificuldade(valor))}
              >
                {rotulo}
              </Button>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
