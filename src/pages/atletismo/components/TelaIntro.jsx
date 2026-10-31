import { FASES_SALTO } from "../utils/constantes";
import { Overlay } from "./Overlay";
import useNarracao from "../../../hooks/useNarracao";
import audioAtletismo from "../../../assets/atletismo.mp3";

export const TelaIntro = ({ onJogar }) => {
  const { tocando, alternar: alternarAudio, parar } = useNarracao(
    `Pronto para saltar? Toque espaço sem parar para correr bem rápido. Na tábua, toque para saltar, sem pisar depois da linha vermelha, senão é falta! No ar, toque para esticar as pernas e cair longe na areia. Passe da bandeirinha meta nas ${FASES_SALTO.length} fases para vencer. A caixa de areia tem 10 metros!`,
    audioAtletismo
  );

  const iniciarJogo = () => {
    parar();
    onJogar();
  };

  return (
    <Overlay>
      <p className="atl-overlay-titulo">PRONTO PARA SALTAR?</p>
      <p className="atl-overlay-sub">
        🏃 Toque ESPAÇO sem parar para correr bem rápido.
        <br />
        👟 Na tábua, toque para SALTAR — sem pisar depois da linha vermelha, senão é FALTA!
        <br />
        🦵 No ar, toque para esticar as pernas e cair longe na areia.
        <br />
        <br />
        Passe da bandeirinha META nas {FASES_SALTO.length} fases para vencer. A caixa de areia tem 10 metros!
      </p>

      <button
        type="button"
        className="atl-btn-audio"
        onClick={alternarAudio}
        aria-label={tocando ? "Pausar explicação do atletismo" : "Ouvir explicação do atletismo"}
      >
        <span aria-hidden="true">{tocando ? "⏸" : "🔊"}</span>
        {tocando ? "PAUSAR ÁUDIO" : "OUVIR INSTRUÇÕES"}
      </button>

      <button className="atl-btn" onClick={iniciarJogo}>
        COMEÇAR
      </button>
    </Overlay>
  );
};
