import { useAtletismo } from "./hooks/useAtletismo";
import { Arena } from "./components/Arena";
import { Placar } from "./components/Placar";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { BotaoAcao } from "./components/BotaoAcao";
import { ResultadoSalto } from "./components/ResultadoSalto";
import { FASES } from "./utils/constantes";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import useTelaCheia from "../../hooks/useTelaCheia";
import "./styles/index.css";

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
  } = useTelaCheia();

  return (
    <div className="atl-wrapper">
      <BotaoVoltar />
      <div className="atl-card">
        {/* Barra de título */}
        <div className="atl-titulo-barra">
          <h1 className="atl-titulo">SALTO EM DISTÂNCIA</h1>
        </div>

        {!terminou && <DicaToast dica={edu.dicaVisivel} />}

        {terminou ? (
          <FimEducativo esporte="atletismo" vistas={edu.vistas}>
            <TelaFimDeJogo
              melhor={jogo.melhor}
              onJogarNovamente={jogo.startGame}
              onVoltar={jogo.voltarParaHome}
            />
          </FimEducativo>
        ) : (
          <>
            <div className="atl-palco" ref={telaCheiaRef}>
              {/* Barra de status (fase, meta, último e melhor salto, potência) */}
              <Placar
                fase={jogo.fase}
                totalFases={jogo.totalFases}
                nomeFase={jogo.nomeFase}
                meta={jogo.meta}
                ultimo={jogo.ultimo}
                melhor={jogo.melhor}
                vento={jogo.vento}
                temVento={jogo.temVento}
                potencia={jogo.potencia}
              />

              <Arena canvasRef={jogo.canvasRef}>
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

            {/* Rodapé de instrução (muda conforme o momento do salto) */}
            <div className="atl-rodape">
              <p className="atl-rodape-texto">{jogo.instrucao}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Atletismo;
