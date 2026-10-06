import { useFutebol } from "./hooks/useFutebol";
import { Placar } from "./components/Placar";
import { Campo } from "./components/Campo";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";
import "./styles/index.css";

const Futebol = () => {
  const jogo = useFutebol();
  const edu = useDicasDoJogo("futebol", jogo.placar);

  return (
    <div className="pc-wrapper">
      <BotaoVoltar />
      <div className="pc-card">
        <h1 className="pc-titulo">
          PÊNALTI <span>CAMPEÃO</span>
        </h1>

        {jogo.mostrarIntro && <TelaIntro onJogar={jogo.iniciarJogo} />}

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

            <p className="pc-rodape">{jogo.mensagemRodape}</p>
          </>
        )}

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
