import "./styles/index.css";

import { useBasquete } from "./hooks/useBasquete";
import { Placar } from "./components/Placar";
import { Quadra } from "./components/Quadra";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { BotaoVoltar } from "../../educacional/components/BotaoVoltar";
import { useDicasDoJogo } from "../../educacional/fases/useDicasDoJogo";
import { DicaToast } from "../../educacional/fases/DicaToast";
import { FimEducativo } from "../../educacional/fases/FimEducativo";

export default function Basquete() {
  const jogo = useBasquete();
  const edu = useDicasDoJogo("basquete", jogo.cestas);

  return (
    <div className="bq-wrapper">
      <BotaoVoltar />
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

        {!jogo.mostrarFimDeJogo && <DicaToast dica={edu.dicaVisivel} />}

        {jogo.mostrarFimDeJogo && (
          <FimEducativo esporte="basquete" vistas={edu.vistas}>
            <TelaFimDeJogo
              cestas={jogo.cestas}
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
}