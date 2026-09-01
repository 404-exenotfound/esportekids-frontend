import { ZONAS } from "../utils/zonas";
import { CORES_GOLEIRO, GOLEIRO_MATRIZ } from "../utils/goleiro";
import { CORES_JOGADOR, JOGADOR_MATRIZ } from "../utils/jogador";
import { BOLA_MATRIZ, CORES_BOLA } from "../utils/bola";
import { GradePixel } from "./GradePixel";
import { BannerResultado } from "./BannerResultado";
import { Confete } from "./Confete";

export const Campo = ({
  goleiro,
  bolaPos,
  bolaPegou,
  redeEmChoque,
  confetes,
  mostrarJogador,
  mostrarAlvos,
  mostrarBanner,
  resultado,
  fraseResultado,
  fraseTorcida,
  onChutar,
}) => (
  <div className="pc-stage">
    <div className="pc-sol" />
    <div className="pc-nuvem" style={{ width: 8, height: 8, top: "3%", left: "12%" }} />

    <div className="pc-grama">
      <div className="pc-area" />
    </div>

    <div className="pc-trave" />
    <div className="pc-linha-gol" />

    {redeEmChoque !== null && (
      <div
        className="pc-rede-choque"
        style={{ left: `${ZONAS[redeEmChoque].x}%`, top: `${ZONAS[redeEmChoque].y}%` }}
      />
    )}

    <div className="pc-sombra-chao" style={{ left: `${goleiro.zona.x}%` }} />

    <div
      className={`pc-goleiro ${goleiro.direcao}`}
      style={{ left: `${goleiro.zona.x}%`, top: `${goleiro.zona.y}%` }}
    >
      <GradePixel matriz={GOLEIRO_MATRIZ} cores={CORES_GOLEIRO} tamanho={6.5} />
    </div>

    {mostrarJogador && (
      <div className="pc-jogador">
        <GradePixel matriz={JOGADOR_MATRIZ} cores={CORES_JOGADOR} tamanho={5.5} />
      </div>
    )}

    <div
      className={`pc-bola ${bolaPegou ? "pegou" : ""}`}
      style={{
        left: `${bolaPos.x}%`,
        top: `${bolaPos.y}%`,
        transform: `scale(${bolaPos.escala})`,
      }}
    >
      <GradePixel matriz={BOLA_MATRIZ} cores={CORES_BOLA} tamanho={4} />
    </div>

    {/* O goleiro sempre defende com a mão (luva), nunca com o pé — a luva
        aparece exatamente onde ele agarra a bola, seja no canto (com o
        mergulho) ou parado no meio do gol. */}
    {bolaPegou && (
      <div
        className="pc-luva"
        style={{ left: `${bolaPos.x}%`, top: `${bolaPos.y}%` }}
        aria-hidden="true"
      >
        🧤
      </div>
    )}

    {mostrarAlvos &&
      ZONAS.map((zona, i) => (
        <button
          key={i}
          className="pc-zona-btn"
          style={{ left: `${zona.x}%`, top: `${zona.y}%` }}
          onClick={() => onChutar(i)}
          aria-label={`Chutar para: ${zona.nome}`}
          title={zona.nome}
        >
          ⚽
        </button>
      ))}

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
