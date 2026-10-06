import { useRef } from "react";
import { CORES_BOLA, BOLA_MATRIZ } from "../utils/bola";
import { CORES_JOGADOR, JOGADOR_MATRIZ } from "../utils/jogador";
import { GradePixel } from "./GradePixel";
import { BannerResultado } from "./BannerResultado";
import { Confete } from "./Confete";

export const Quadra = ({
  aro,
  bolaTrajeto,
  confetes,
  mostrarAlvos,
  mostrarBanner,
  resultado,
  fraseResultado,
  fraseTorcida,
  raioPrecisao,
  onArremessar,
}) => {
  const stageRef = useRef(null);

  const arremessar = (e) => {
    if (!stageRef.current || !mostrarAlvos) return;
    const rect = stageRef.current.getBoundingClientRect();
    onArremessar(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
  };

  return (
    <div ref={stageRef} className="bq-stage" onClick={arremessar}>
      <div className="bq-sol" />
      <div className="bq-nuvem" style={{ width: 8, height: 8, top: "3%", left: "12%" }} />

      <div className="bq-quadra">
        <div className="bq-linha-quadra" />
        <div className="bq-circulo" />
      </div>

      {/* Tabela e aro */}
      <div
        className="bq-poste"
        style={{ left: `${aro.x}%`, top: `${aro.y}%` }}
      />
      <div
        className="bq-tabela"
        style={{ left: `${aro.x}%`, top: `${aro.y}%` }}
      >
        <div className="bq-caixa-tabela" />
      </div>
      <div className="bq-aro" style={{ left: `${aro.x}%`, top: `${aro.y}%` }} />
      <div className="bq-rede" style={{ left: `${aro.x}%`, top: `${aro.y}%` }} />

      {/* Alvo de mira: a "boca" da cesta que encolhe com a dificuldade */}
      {mostrarAlvos && (
        <div
          className="bq-mira"
          style={{
            left: `${aro.x}%`,
            top: `${aro.y}%`,
            width: `${raioPrecisao * 2}px`,
            height: `${raioPrecisao * 2}px`,
          }}
        />
      )}

      {mostrarAlvos ? (
        <div className="bq-jogador">
          <GradePixel matriz={JOGADOR_MATRIZ} cores={CORES_JOGADOR} tamanho={5} />
        </div>
      ) : (
        <div className="bq-jogador bq-jogador-desaparece" />
      )}

      <div
        className="bq-bola"
        style={{
          left: `${bolaTrajeto.x}%`,
          top: `${bolaTrajeto.y}%`,
          transform: `scale(${bolaTrajeto.escala})`,
        }}
      >
        <GradePixel matriz={BOLA_MATRIZ} cores={CORES_BOLA} tamanho={5} />
      </div>

      {mostrarBanner && (
        <BannerResultado
          resultado={resultado}
          frase={fraseResultado}
          fraseTorcida={fraseTorcida}
        />
      )}

      <Confete confetes={confetes} />
    </div>
  );
};