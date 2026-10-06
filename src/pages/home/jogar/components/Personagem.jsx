import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setPersonagem } from "../../../../store/gameSlice";
import nirvana from "../../../../assets/nirvana.jpeg";
import rodolfo from "../../../../assets/rodolfo.jpeg";

const PERSONAGENS = [
  { valor: "nirvana", rotulo: "NIRVANA", imagem: nirvana },
  { valor: "rodolfo", rotulo: "RODOLFO", imagem: rodolfo },
];

export const Personagem = ({ setStep }) => {
  const personagem = useSelector((state) => state.jogo.personagem);
  const dispatch = useDispatch();

  return (
    <div className="opcao personagem-opcao">
      <h3>SELECIONE O PERSONAGEM</h3>

      <div className="personagens-container selecao-personagem-container">
        {PERSONAGENS.map(({ valor, rotulo, imagem }) => (
          <div
            key={valor}
            className={`personagem ${personagem === valor ? "personagem-selecionado" : ""}`}
            onClick={() => dispatch(setPersonagem(valor))}
          >
            <div className="personagem-imagem">
              <img
                src={imagem}
                alt={rotulo}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
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
