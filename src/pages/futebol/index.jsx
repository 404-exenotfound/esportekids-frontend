import { useFutebol } from "./hooks/useFutebol";
import { Placar } from "./components/Placar";
import { Campo } from "./components/Campo";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import BotaoTelaCheia from "../../components/BotaoTelaCheia";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import useTelaCheia from "../../hooks/useTelaCheia";
import "./styles/index.css";

const Futebol = () => {
  const jogo = useFutebol();
  const edu = useDicasDoJogo("futebol", jogo.placar);
  const {
    emTelaCheia,
    suportaTelaCheia,
    ref: telaCheiaRef,
    alternarTelaCheia,
  } = useTelaCheia();

  return (
    <div className="pc-wrapper">
      <BotaoVoltar />
      <div className="pc-card">
        <h1 className="pc-titulo">
          PÊNALTI <span>CAMPEÃO</span>
        </h1>

        {!jogo.mostrarFimDeJogo && (
          <div className="pc-palco" ref={telaCheiaRef}>
            {jogo.mostrarIntro && (
              <div className="pc-intro-preview">
                <Campo
                  goleiro={jogo.goleiro}
                  bolaPos={jogo.bolaPos}
                  bolaPegou={jogo.bolaPegou}
                  redeEmChoque={jogo.redeEmChoque}
                  confetes={jogo.confetes}
                  mostrarJogador={jogo.mostrarJogador}
                  mostrarAlvos={false}
                  mostrarBanner={false}
                  resultado={jogo.resultado}
                  fraseResultado={jogo.fraseResultado}
                  fraseTorcida={jogo.fraseTorcida}
                  onChutar={jogo.chutar}
                />
                <TelaIntro onJogar={jogo.iniciarJogo} />
              </div>
            )}

            {jogo.mostrarPartida && (
              <>
                <Placar
                  rodadaExibida={jogo.rodadaExibida}
                  placar={jogo.placar}
                  dificuldade={jogo.dificuldade}
                  bolinhas={jogo.bolinhas}
                  somLigado={jogo.somLigado}
                  onAlternarSom={jogo.alternarSom}
                />

                <Campo
                  goleiro={jogo.goleiro}
                  bolaPos={jogo.bolaPos}
                  bolaPegou={jogo.bolaPegou}
                  redeEmChoque={jogo.redeEmChoque}
                  confetes={jogo.confetes}
                  mostrarJogador={jogo.mostrarJogador}
                  mostrarAlvos={jogo.mostrarAlvos}
                  mostrarBanner={jogo.mostrarBanner}
                  resultado={jogo.resultado}
                  fraseResultado={jogo.fraseResultado}
                  fraseTorcida={jogo.fraseTorcida}
                  onChutar={jogo.chutar}
                />
              </>
            )}

            {suportaTelaCheia && (
              <BotaoTelaCheia
                emTelaCheia={emTelaCheia}
                alternarTelaCheia={alternarTelaCheia}
                classe="pc-tela-cheia"
              />
            )}
          </div>
        )}

        {jogo.mostrarPartida && <p className="pc-rodape">{jogo.mensagemRodape}</p>}

        {!jogo.mostrarFimDeJogo && <DicaToast dica={edu.dicaVisivel} />}

        {jogo.mostrarFimDeJogo && (
          <FimEducativo esporte="futebol" vistas={edu.vistas}>
            <TelaFimDeJogo
              placar={jogo.placar}
              estrelas={jogo.estrelas}
              emojiFinal={jogo.emojiFinal}
              onJogarNovamente={jogo.iniciarJogo}
              onVoltar={jogo.voltarParaHome}
            />
          </FimEducativo>
        )}
      </div>
    </div>
  );
};

export default Futebol;
