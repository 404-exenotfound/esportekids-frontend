// ============================================================================
// PingPong — página principal do minigame
// ----------------------------------------------------------------------------
// Monta a página completa: título, placar (durante o jogo), Arena com o canvas
// e os overlays/banners conforme o estado, e o rodapé com a mensagem da fase.
// Toda a lógica fica no hook usePingpong; aqui só fazemos a composição visual.
// ============================================================================

import { usePingpong } from "./hooks/usePingpong";
import { Arena } from "./components/Arena";
import { Placar } from "./components/Placar";
import { BannerResultado } from "./components/BannerResultado";
import { Confete } from "./components/Confete";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import "./styles/index.css";

const PingPong = () => {
  // Toda a lógica do jogo (estado, loop, sons) vive no hook
  const jogo = usePingpong();

  return (
    <div className="pp-wrapper">
      <div className="pp-card">
        {/* Cabeçalho do card */}
        <div className="pp-titulo-barra">
          <h1 className="pp-titulo">
            PING-PONG <span>CAMPEÃO</span>
          </h1>
        </div>

        {/* Tela final com o placar e os créditos (idêntica ao PenaltiCampeao) */}
        {jogo.mostrarFimDeJogo && (
          <TelaFimDeJogo
            pontos={jogo.pontos}
            estrelas={jogo.estrelas}
            emojiFinal={jogo.emojiFinal}
            onJogarNovamente={jogo.iniciarJogo}
            onVoltar={jogo.voltarParaHome}
          />
        )}

        {/* Placar e Arena ficam ocultos na tela final */}
        {!jogo.mostrarFimDeJogo && (
          <>
            {/* Placar visível apenas quando a partida começou */}
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

            {/* Arena = canvas do jogo + camadas por cima */}
            <Arena canvasRef={jogo.canvasRef}>
              {/* Tela inicial (antes de começar) */}
              {!jogo.emJogo && <TelaIntro onJogar={jogo.iniciarJogo} />}

              {/* Banner de ponto ou erro durante a partida */}
              {jogo.mostrarBanner && (
                <BannerResultado
                  tipo={jogo.bannerTipo}
                  frase={jogo.fraseResultado}
                  fraseTorcida={jogo.fraseTorcida}
                />
              )}

              {/* Confetes quando a tentativa terminou em PONTO */}
              {jogo.bannerTipo === "ponto" && jogo.mostrarBanner && <Confete />}
            </Arena>

            {/* Rodapé com a dica/mensagem da fase atual */}
            {jogo.emJogo && <p className="pp-rodape">{jogo.mensagemRodape}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PingPong;