import { useFutebol } from "./hooks/useFutebol";
import { Placar } from "./components/Placar";
import { Campo } from "./components/Campo";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import "./styles/index.css";

const Futebol = () => {
  const jogo = useFutebol();

  return (
    <div className="pc-wrapper">
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

        {jogo.mostrarFimDeJogo && (
          <TelaFimDeJogo
            placar={jogo.placar}
            estrelas={jogo.estrelas}
            emojiFinal={jogo.emojiFinal}
            onJogarNovamente={jogo.iniciarJogo}
            onVoltar={jogo.voltarParaHome}
          />
        )}
      </div>
    </div>
  );
};

export default Futebol;
