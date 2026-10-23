import { usePingpong } from "./hooks/usePingpong";
import EscalaProporcional from "../../components/EscalaProporcional";
import { Placar } from "./components/Placar";
import { BannerResultado } from "./components/BannerResultado";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { GAME_HEIGHT, GAME_WIDTH } from "./utils/constantes";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import useTelaCheia from "../../hooks/useTelaCheia";
import "./styles/index.css";

const PingPong = () => {
  const { canvasRef, ...jogo } = usePingpong();
  const edu = useDicasDoJogo("pingpong", jogo.pontos);
  const {
    emTelaCheia,
    suportaTelaCheia,
    ref: telaCheiaRef,
    alternarTelaCheia,
  } = useTelaCheia(jogo.mostrarFimDeJogo);

  return (
    <div className="pp-wrapper">
      <BotaoVoltar />
      <div className="pp-card">
        <div className="pp-titulo-barra">
          <h1 className="pp-titulo">
            PING-PONG <span>CAMPEÃO</span>
          </h1>
        </div>

        {jogo.mostrarFimDeJogo && (
          <FimEducativo esporte="pingpong" vistas={edu.vistas}>
            <TelaFimDeJogo
              pontos={jogo.pontos}
              estrelas={jogo.estrelas}
              emojiFinal={jogo.emojiFinal}
              onJogarNovamente={jogo.iniciarJogo}
              onVoltar={jogo.voltarParaHome}
            />
          </FimEducativo>
        )}

        {/* O palco (canvas) fica sempre montado: só é escondido no fim do
            jogo, para o loop de desenho continuar ligado ao mesmo canvas
            ao jogar de novo (antes, desmontar a Arena deixava o jogo
            desenhando num canvas "fantasma" e a tela ficava preta). */}
        <div
          ref={telaCheiaRef}
          className={`pp-stage${jogo.mostrarFimDeJogo ? " pp-oculto" : ""}`}
        >
          {!jogo.mostrarFimDeJogo && <DicaToast dica={edu.dicaVisivel} />}

          <EscalaProporcional largura={GAME_WIDTH} altura={GAME_HEIGHT}>
            <canvas
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              className="pp-canvas"
            />

            {jogo.emJogo && (
              <Placar
                tentativaExibida={jogo.tentativaExibida}
                pontos={jogo.pontos}
                nivel={jogo.nivel}
                bolinhas={jogo.bolinhas}
                somLigado={jogo.somLigado}
                onAlternarSom={jogo.alternarSom}
              />
            )}
            {jogo.emJogo && jogo.rally >= 2 && (
              <div className="pp-combo">🔥 x{jogo.rally}</div>
            )}

            {!jogo.emJogo && <TelaIntro onJogar={jogo.iniciarJogo} />}

            {jogo.mostrarBanner && (
              <BannerResultado
                tipo={jogo.bannerTipo}
                frase={jogo.fraseResultado}
                fraseTorcida={jogo.fraseTorcida}
              />
            )}
          </EscalaProporcional>

          {suportaTelaCheia && (
            <BotaoTelaCheia
              emTelaCheia={emTelaCheia}
              alternarTelaCheia={alternarTelaCheia}
              classe="pp-tela-cheia"
            />
          )}
        </div>

        {jogo.emJogo && <p className="pp-rodape">{jogo.mensagemRodape}</p>}
      </div>
    </div>
  );
};

export default PingPong;
