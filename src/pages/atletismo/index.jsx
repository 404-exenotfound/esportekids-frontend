import { useAtletismo } from "./hooks/useAtletismo";
import { Arena } from "./components/Arena";
import { Placar } from "./components/Placar";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { FASES } from "./utils/constantes";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import "./styles/index.css";

const Atletismo = () => {
  const jogo = useAtletismo();
  const edu = useDicasDoJogo("atletismo", jogo.stars);
  const terminou = jogo.gameState === FASES.GAMEOVER || jogo.gameState === FASES.WIN;

  return (
    <div className="atl-wrapper">
      <BotaoVoltar />
      <div className="atl-card">
        {/* Barra de título */}
        <div className="atl-titulo-barra">
          <h1 className="atl-titulo">ATLETISMO</h1>
        </div>

        {!terminou && <DicaToast dica={edu.dicaVisivel} />}

        {terminou ? (
          <FimEducativo esporte="atletismo" vistas={edu.vistas}>
            <TelaFimDeJogo
              venceu={jogo.gameState === FASES.WIN}
              estrelas={jogo.stars}
              onJogarNovamente={jogo.startGame}
              onVoltar={jogo.voltarParaHome}
            />
          </FimEducativo>
        ) : (
          <>
            {/* Barra de status (estrelas, vidas, nível de velocidade) */}
            <Placar
              estrelas={jogo.stars}
              vidas={jogo.hearts}
              rotulo={jogo.rotulo}
              cor={jogo.cor}
            />

            <Arena canvasRef={jogo.canvasRef}>
              {jogo.gameState === FASES.START && (
                <TelaIntro onJogar={jogo.startGame} />
              )}
            </Arena>

            {/* Rodapé de instrução */}
            <div className="atl-rodape">
              <p className="atl-rodape-texto">PULE COM A TECLA ESPAÇO</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Atletismo;