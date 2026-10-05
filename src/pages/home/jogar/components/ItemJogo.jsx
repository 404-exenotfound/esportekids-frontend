import atletismo from "../../../../assets/atletismo2.jpeg";
import basquete from "../../../../assets/basquete2.jpeg";
import boliche from "../../../../assets/boliche2.jpeg";
import futebol from "../../../../assets/futebol2.jpeg";
import tenis from "../../../../assets/tenis.jpeg";

const imagensJogos = {
  atletismo,
  basquete,
  boliche,
  futebol,
  pingPong: tenis,
};

export const ItemJogo = ({ jogo, setJogo, nomeJogo, bloqueado = false, dica = "" }) => {
  const imagem = imagensJogos[nomeJogo];

  return (
    <div
      className={`personagem ${jogo === nomeJogo ? "personagem-selecionado" : ""}`}
      onClick={() => !bloqueado && setJogo(nomeJogo)}
      title={bloqueado ? dica : undefined}
      aria-disabled={bloqueado}
      style={{
        position: "relative",
        ...(bloqueado ? { cursor: "not-allowed", opacity: 0.55, filter: "grayscale(1)" } : {}),
      }}
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

      {bloqueado && (
        <div
          aria-hidden="true"
          style={{ position: "absolute", top: "22%", left: 0, right: 0, fontSize: "28px" }}
        >
          🔒
        </div>
      )}

      <span>{nomeJogo}</span>
    </div>
  )
}
