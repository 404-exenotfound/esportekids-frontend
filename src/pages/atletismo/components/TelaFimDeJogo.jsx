import { STARS_TO_WIN } from "../utils/constantes";
import { Overlay } from "./Overlay";

const CREDITOS = [
  "José Rodrigo — Scrum Master",
  "Matheus Caetano — Product Owner",
  "André Ribeiro — Quality Assurance",
  "João Feijon — Desenvolvedor",
  "Natan Sousa — Desenvolvedor",
  "Matheus Ferrarezi — Desenvolvedor",
  "Tiago Machado — Desenvolvedor",
];

export const TelaFimDeJogo = ({ venceu, estrelas, onJogarNovamente, onProximoJogo }) => {
  if (venceu) {
    return (
      <Overlay confetti>
        <p className="atl-overlay-titulo">VOCÊ VENCEU A CORRIDA!</p>
        <p className="atl-overlay-sub">
          {"⭐".repeat(STARS_TO_WIN)} Parabéns, campeão!
        </p>
        <div className="atl-box-creditos">
          <p className="atl-box-creditos-titulo">CRÉDITOS</p>
          {CREDITOS.map((credito) => (
            <p key={credito} className="atl-box-creditos-linha">
              {credito}
            </p>
          ))}
        </div>
        <button className="atl-btn" onClick={onProximoJogo}>
          PRÓXIMO JOGO
        </button>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <p className="atl-overlay-titulo">VOCÊ TROPEÇOU!</p>
      <p className="atl-overlay-sub">Estrelas coletadas: {estrelas}</p>
      <button className="atl-btn" onClick={onJogarNovamente}>
        TENTAR DE NOVO
      </button>
    </Overlay>
  );
};