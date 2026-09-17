import "./styles/index.css";

import { useBasquete } from "./hooks/useBasquete";
import { Placar } from "./components/Placar";
import { Quadra } from "./components/Quadra";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";

export default function Basquete() {
  const jogo = useBasquete();

  return (
    <div className="bq-wrapper">
      <div className="bq-card">
        <h1 className="bq-titulo">
          BASQUETE <span>CAMPEÃO</span>
        </h1>

        {jogo.mostrarIntro && <TelaIntro onJogar={jogo.iniciarJogo} />}

        {jogo.mostrarPartida && (
          <>
            <Placar
              rodadaExibida={jogo.rodadaExibida}
              cestas={jogo.cestas}
              dificuldade={jogo.dificuldade}
              bolinhas={jogo.bolinhas}
              somLigado={jogo.somLigado}
              onAlternarSom={jogo.alternarSom}
            />

            <Quadra
              aro={jogo.aro}
              bolaTrajeto={jogo.bolaTrajeto}
              confetes={jogo.confetes}
              mostrarAlvos={jogo.mostrarAlvos}
              mostrarBanner={jogo.mostrarBanner}
              resultado={jogo.resultado}
              fraseResultado={jogo.fraseResultado}
              fraseTorcida={jogo.fraseTorcida}
              raioPrecisao={jogo.dificuldade.raio}
              onArremessar={jogo.arremessar}
            />

            <div className="bq-rodape">{jogo.mensagemRodape}</div>
          </>
        )}

        {jogo.mostrarFimDeJogo && (
          <TelaFimDeJogo
            cestas={jogo.cestas}
            estrelas={jogo.estrelas}
            emojiFinal={jogo.emojiFinal}
            onJogarNovamente={jogo.iniciarJogo}
            onVoltar={jogo.voltarParaHome}
          />
        )}
      </div>
    </div>
  );
}