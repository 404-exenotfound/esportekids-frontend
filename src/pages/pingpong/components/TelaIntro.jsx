// ============================================================================
// TelaIntro — tela inicial do minigame
// ----------------------------------------------------------------------------
// Aparece por cima do canvas antes de a partida começar. Explica rapidamente
// como jogar (mouse ou setas/W-S) e quantas tentativas o jogador tem, com um
// botão grande "COMEÇAR" para início imediato.
// ============================================================================

import { TOTAL_TENTATIVAS } from "../utils/constantes";
import { Overlay } from "./Overlay";

export const TelaIntro = ({ onJogar }) => (
  <Overlay>
    <div className="pp-emoji-grande">🏓</div>
    <p className="pp-overlay-titulo">PRONTO PARA O PING-PONG?</p>
    <p className="pp-overlay-sub">
      Mova o mouse (ou use as setas ↑↓ e W/S) para rebater a bola com a raquete.
      <br />
      Você tem {TOTAL_TENTATIVAS} tentativas para pontuar — e a cada ponto o
      adversário fica um pouquinho mais esperto!
    </p>
    <button className="pp-btn" onClick={onJogar}>
      COMEÇAR
    </button>
  </Overlay>
);