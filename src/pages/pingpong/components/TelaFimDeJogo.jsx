// ============================================================================
// TelaFimDeJogo — tela final da partida
// ----------------------------------------------------------------------------
// Mostra o resultado: emoji de celebração, quantidade de pontos, estrelas
// ganhas (⭐) e os créditos do time que fez o jogo. Dois botões fecham a
// partida: jogar de novo ou voltar para a tela inicial.
// ============================================================================

import { TOTAL_TENTATIVAS } from "../utils/constantes";
import { Overlay } from "./Overlay";

// Nomes da equipe que desenvolveu o jogo
const CREDITOS = [
  "José Rodrigo — Scrum Master",
  "Matheus Caetano — Product Owner",
  "André Ribeiro — Quality Assurance",
  "João Feijon — Desenvolvedor",
  "Natan Sousa — Desenvolvedor",
  "Matheus Ferrarezi — Desenvolvedor",
  "Tiago Machado — Desenvolvedor",
];

export const TelaFimDeJogo = ({
  pontos,
  estrelas,
  emojiFinal,
  onJogarNovamente,
  onVoltar,
}) => (
  <Overlay>
    {/* Emoji grande conforme o desempenho */}
    <div className="pp-emoji-grande">{emojiFinal}</div>

    <p className="pp-overlay-titulo">
      FIM DE JOGO!
      <br />
      VOCÊ FEZ {pontos} DE {TOTAL_TENTATIVAS} PONTOS
    </p>

    {/* Estrelas: ⭐ cheias (ganhas) + ☆ vazias */}
    <div className="pp-estrelas" aria-label={`${estrelas} de 3 estrelas`}>
      {"⭐".repeat(estrelas)}
      {"☆".repeat(3 - estrelas)}
    </div>

    {/* Créditos da equipe */}
    <div className="pp-box-creditos">
      <p className="pp-box-creditos-titulo">CRÉDITOS</p>
      {CREDITOS.map((credito) => (
        <p key={credito} className="pp-box-creditos-linha">
          {credito}
        </p>
      ))}
    </div>

    {/* Ações: jogar de novo ou voltar ao início */}
    <div className="pp-botoes-fim">
      <button className="pp-btn" onClick={onJogarNovamente}>
        JOGAR NOVAMENTE
      </button>
      <button className="pp-btn-secundario" onClick={onVoltar}>
        VOLTAR AO INÍCIO
      </button>
    </div>
  </Overlay>
);