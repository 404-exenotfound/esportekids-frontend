// Botão de alternar tela cheia nos minigames, no mesmo estilo pixel do VOLTAR.
// Fica fixo ao lado do VOLTAR fora da tela cheia (CSS por jogo) e flutuando
// dentro do container do jogo quando em tela cheia.
export default function BotaoTelaCheia({ emTelaCheia, alternarTelaCheia, classe }) {
  return (
    <button
      type="button"
      className={classe}
      onClick={alternarTelaCheia}
      // Evita que o botão segure o foco (teclas como ESPAÇO são usadas p/ jogar)
      onMouseDown={(e) => e.preventDefault()}
      aria-label={emTelaCheia ? "Sair da tela cheia" : "Entrar em tela cheia"}
    >
      {emTelaCheia ? "SAIR DA TELA CHEIA" : "TELA CHEIA"}
    </button>
  );
}