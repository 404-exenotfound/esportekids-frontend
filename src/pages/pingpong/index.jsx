import { usePingpong } from "./hooks/usePingpong";
import EscalaProporcional from "../../components/EscalaProporcional";
import { Placar } from "./components/Placar";
import { BannerResultado } from "./components/BannerResultado";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { GAME_HEIGHT, GAME_WIDTH } from "./utils/constantes";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import useTelaCheia from "../../hooks/useTelaCheia";
import useDispositivo from "../../hooks/useDispositivo";
import AvisoGirarCelular from "../../components/AvisoGirarCelular";
import "./styles/index.css";

const PingPong = () => {
  // Celular em pé: o aviso de girar cobre a tela e o jogo fica pausado
  const { classes: classesDispositivo, ehCelular, retrato } = useDispositivo();
  const { canvasRef, ...jogo } = usePingpong({ pausado: ehCelular && retrato });
  const edu = useDicasDoJogo("pingpong", jogo.pontos);
  const {
    emTelaCheia,
    suportaTelaCheia,
    ref: telaCheiaRef,
    alternarTelaCheia,
    entrarTelaCheiaNoCelular,
  } = useTelaCheia(jogo.mostrarFimDeJogo);

  // No celular, Jogar já entra em tela cheia deitada (precisa ser no clique)
  const jogar = () => {
    entrarTelaCheiaNoCelular();
    jogo.iniciarJogo();
  };

  return (
    <div className={`pp-wrapper jogo-wrapper ${classesDispositivo}`}>
      <AvisoGirarCelular ativo={!jogo.mostrarFimDeJogo} />
      {/* Fixo no canto, à esquerda do TELA CHEIA; fica fora do palco para
          continuar visível também no relembrar dicas / quiz / fim de jogo */}
      <BotaoVoltar />
      <div className="pp-card">
        <div className="pp-titulo-barra jogo-titulo-barra">
          <h1 className="pp-titulo">
            PING-<span>PONG</span>
          </h1>
        </div>

        {jogo.mostrarFimDeJogo && (
          <FimEducativo esporte="pingpong" vistas={edu.vistas} pontosDoJogo={jogo.pontos}>
            <TelaFimDeJogo
              pontos={jogo.pontos}
              estrelas={jogo.estrelas}
              emojiFinal={jogo.emojiFinal}
              onJogarNovamente={jogar}
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
          className={`pp-stage jogo-stage${jogo.mostrarFimDeJogo ? " pp-oculto" : ""}`}
        >
          <DicaToast dica={edu.dicaVisivel} />

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

            {!jogo.emJogo && <TelaIntro onJogar={jogar} />}

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

        {jogo.emJogo && <p className="pp-rodape jogo-rodape">{jogo.mensagemRodape}</p>}
      </div>
    </div>
  );
};

export default PingPong;
