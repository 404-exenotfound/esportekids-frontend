import { useState } from "react";
import { Button } from "react-bootstrap";


export const Personagem = ({setStep}) => {
  const [personagem, setPersonagem] = useState("nirvana");
  return (
    <div className="opcao personagem-opcao">
      <h3>SELECIONE O PERSONAGEM</h3>

      <div className="personagens-container">

        <div
          className={`personagem ${personagem === "nirvana" ? "personagem-selecionado" : ""
            }`}
          onClick={() => setPersonagem("nirvana")}
        >
          <div className="personagem-imagem">
            {/* Imagem da Nirvana vai aqui */}
          </div>

          <span>NIRVANA</span>
        </div>

        <div
          className={`personagem ${personagem === "rodolfo" ? "personagem-selecionado" : ""
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
        <Button className="btn-pixel" onClick={() => setStep(1)}>Confirmar</Button>
      </div>

    </div>
  )
}