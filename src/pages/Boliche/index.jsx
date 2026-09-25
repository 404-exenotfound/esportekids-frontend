// Boliche — página principal do minigame
// A rota é gerada automaticamente pelo App.jsx a partir desta pasta: /boliche

import { useBoliche } from "./hooks/useBoliche";
import { Arena } from "./components/Arena";
import { Placar } from "./components/Placar";
import { TelaIntro } from "./components/TelaIntro";
import { TelaFimDeJogo } from "./components/TelaFimDeJogo";
import { BannerResultado } from "./components/BannerResultado";
import { Confete } from "./components/Confete";
import { ETAPAS } from "./utils/constantes";
import "./styles/index.css";

const DICAS = {
  [ETAPAS.MIRA]: "APERTE ESPAÇO (OU TOQUE) PARA TRAVAR A MIRA",
  [ETAPAS.FORCA]: "APERTE DE NOVO PARA SOLTAR A BOLA",
  [ETAPAS.ROLANDO]: "LÁ VAI ELA...",
  [ETAPAS.RESULTADO]: "PREPARANDO A PRÓXIMA BOLA",
};

const Boliche = () => {
  const jogo = useBoliche();

  return (
    <div className="bol-wrapper">
      <div className="bol-card">
        {/* Cabeçalho do card */}
        <div className="bol-titulo-barra">
          <h1 className="bol-titulo">
            BOLICHE <span>CAMPEÃO</span>
          </h1>
        </div>

        {jogo.mostrarFimDeJogo ? (
          <TelaFimDeJogo
            pontos={jogo.pontos}
            estrelas={jogo.estrelas}
            emojiFinal={jogo.emojiFinal}
            onJogarNovamente={jogo.iniciarJogo}
            onVoltar={jogo.voltarParaHome}
          />
        ) : (
          <>
            {jogo.emJogo && (
              <Placar
                rodada={jogo.rodada}
                bolaDaRodada={jogo.bolaDaRodada}
                pontos={jogo.pontos}
                pinosEmPe={jogo.pinosEmPe}
                somLigado={jogo.somLigado}
                onAlternarSom={jogo.alternarSom}
              />
            )}

            <Arena canvasRef={jogo.canvasRef} onAcao={jogo.acao}>
              {jogo.mostrarIntro && <TelaIntro onJogar={jogo.iniciarJogo} />}

              {jogo.banner && (
                <BannerResultado
                  tipo={jogo.banner.tipo}
                  frase={jogo.banner.frase}
                  derrubados={jogo.banner.derrubados}
                />
              )}

              {jogo.banner &&
                (jogo.banner.tipo === "strike" || jogo.banner.tipo === "spare") && (
                  <Confete />
                )}
            </Arena>

            {jogo.emJogo && (
              <div className="bol-rodape">
                <p className="bol-rodape-texto">{DICAS[jogo.etapa]}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Boliche;
