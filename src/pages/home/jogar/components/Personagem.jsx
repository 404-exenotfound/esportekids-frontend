import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setPersonagem } from "../../../../store/gameSlice";

const PERSONAGENS = [
  { valor: "nirvana", rotulo: "NIRVANA" },
  { valor: "rodolfo", rotulo: "RODOLFO" },
];

export const Personagem = ({ setStep }) => {
  const personagem = useSelector((state) => state.jogo.personagem);
  const dispatch = useDispatch();

  return (
    <div className="opcao personagem-opcao">
      <h3>SELECIONE O PERSONAGEM</h3>

      <div className="personagens-container selecao-personagem-container">
        {PERSONAGENS.map(({ valor, rotulo }) => (
          <div
            key={valor}
            className={`personagem ${personagem === valor ? "personagem-selecionado" : ""}`}
            onClick={() => dispatch(setPersonagem(valor))}
          >
            <div className="personagem-imagem">
              {/* Imagem do personagem vai aqui */}
            </div>

            <span>{rotulo}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        <Button className="btn-pixel" onClick={() => setStep(1)}>Confirmar</Button>
      </div>

    </div>
  )
}
