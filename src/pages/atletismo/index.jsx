import { useAtletismo } from "./hooks/useAtletismo";
import { Arena } from "./components/Arena";
import { Placar } from "./components/Placar";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { BotaoAcao } from "./components/BotaoAcao";
import { ResultadoSalto } from "./components/ResultadoSalto";
import { FASES } from "./utils/constantes";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import useTelaCheia from "../../hooks/useTelaCheia";
import "./styles/index.css";

// Mesma estrutura dos outros minigames (Pênalti, Basquete, Ping-Pong, Boliche):
// wrapper > card > faixa de título > palco (canvas + HUD dentro) > rodapé.
const Atletismo = () => {
  const jogo = useAtletismo();
  // NÃO ALTERAR a chave "atletismo": é ela que liga este jogo às
  // informações, às dicas e ao quiz já cadastrados no sistema.
  // Cada fase completa avança o progresso = nova informação exibida (igual ao original).
  const edu = useDicasDoJogo("atletismo", jogo.progresso);
  const terminou = jogo.gameState === FASES.GAMEOVER || jogo.gameState === FASES.WIN;
  const {
    emTelaCheia,
    suportaTelaCheia,
    ref: telaCheiaRef,
    alternarTelaCheia,
  } = useTelaCheia(terminou);

  return (
    <div className="atl-wrapper">
      {/* Fixo no canto, à esquerda do TELA CHEIA; fica fora do palco para
          continuar visível também no relembrar dicas / quiz / fim de jogo */}
      <BotaoVoltar />
      <div className="atl-card">
        {/* Faixa de título (mesmo padrão dos outros jogos) */}
        <div className="atl-titulo-barra">
          <h1 className="atl-titulo">
            SALTO EM <span>DISTÂNCIA</span>
          </h1>
        </div>

        {terminou && (
          <FimEducativo esporte="atletismo" vistas={edu.vistas} pontosDoJogo={jogo.progresso}>
            <TelaFimDeJogo
              venceu={jogo.venceu}
              fasesCompletas={jogo.progresso}
              totalFases={jogo.totalFases}
              melhor={jogo.melhor}
              onJogarNovamente={jogo.startGame}
              onVoltar={jogo.voltarParaHome}
            />
          </FimEducativo>
        )}

        {/* O palco (canvas) fica sempre montado: só é escondido no fim do jogo,
            como nos outros minigames. É ele o elemento da tela cheia. */}
        <div
          ref={telaCheiaRef}
          className={`atl-stage${terminou ? " atl-oculto" : ""}`}
        >
          {/* Dentro do palco (= elemento da tela cheia) para a dica aparecer também em tela cheia */}
          <DicaToast dica={edu.dicaVisivel} />

          <Arena canvasRef={jogo.canvasRef}>
            {jogo.gameState !== FASES.START && (
              <Placar
                fase={jogo.fase}
                totalFases={jogo.totalFases}
                meta={jogo.meta}
                ultimo={jogo.ultimo}
                melhor={jogo.melhor}
                vento={jogo.vento}
                temVento={jogo.temVento}
                potencia={jogo.potencia}
                chances={jogo.chances}
                totalChances={jogo.totalChances}
              />
            )}
            {jogo.gameState === FASES.START && (
              <TelaIntro onJogar={jogo.startGame} />
            )}
            {jogo.gameState === FASES.PLAYING && jogo.etapa === "resultado" && (
              <ResultadoSalto resultado={jogo.resultado} />
            )}
            {jogo.gameState === FASES.PLAYING && (
              <BotaoAcao
                rotulo={jogo.rotuloBotao}
                etapa={jogo.etapa}
                emZonaDeSalto={jogo.emZonaDeSalto}
                onAcao={jogo.acaoPrincipal}
              />
            )}
          </Arena>

          {suportaTelaCheia && (
            <BotaoTelaCheia
              emTelaCheia={emTelaCheia}
              alternarTelaCheia={alternarTelaCheia}
              classe="atl-tela-cheia"
            />
          )}
        </div>

        {jogo.gameState === FASES.PLAYING && (
          <div className="atl-rodape">
            <p className="atl-rodape-texto">{jogo.instrucao}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atletismo;
