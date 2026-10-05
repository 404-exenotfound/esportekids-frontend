import { capaDoJogo } from "../../../../utils/imagens";

export const ItemJogo = ({ jogo, setJogo, nomeJogo }) => {
  const imagem = capaDoJogo(nomeJogo);

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
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      <span>{nomeJogo}</span>
    </div>
  )
}
