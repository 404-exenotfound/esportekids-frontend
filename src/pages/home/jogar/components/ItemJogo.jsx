export const ItemJogo = ({ jogo, setJogo, nomeJogo }) => {
  return (
    <div
      className={`personagem ${jogo === nomeJogo ? "personagem-selecionado" : ""}`}
      onClick={() => setJogo(nomeJogo)}
    >
      <div className="personagem-imagem">
        {/* Imagem da Nirvana vai aqui */}
      </div>

      <span>{nomeJogo}</span>
    </div>
  )
}