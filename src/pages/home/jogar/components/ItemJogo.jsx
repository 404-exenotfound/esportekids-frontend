import atletismo from "../../../../assets/atletismo.jpeg";
import basquete from "../../../../assets/basquete.jpeg";
import boliche from "../../../../assets/boliche.jpeg";
import futebol from "../../../../assets/futebol.jpeg";

const imagensJogos = {
  atletismo,
  basquete,
  boliche,
  futebol,
};

export const ItemJogo = ({ jogo, setJogo, nomeJogo }) => {
  const imagem = imagensJogos[nomeJogo];

  return (
    <div
      className={`personagem ${jogo === nomeJogo ? "personagem-selecionado" : ""}`}
      onClick={() => setJogo(nomeJogo)}
    >
      <div className="personagem-imagem">
        {imagem && (
          <img
            src={imagem}
            alt={nomeJogo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      <span>{nomeJogo}</span>
    </div>
  )
}
