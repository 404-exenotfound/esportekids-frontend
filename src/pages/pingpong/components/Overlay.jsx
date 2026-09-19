// ============================================================================
// Overlay — camada escura por cima do jogo
// ----------------------------------------------------------------------------
// Usado para a tela de início e a tela final: cobre a Arena com um fundo
// escuro no qual o conteúdo é centralizado. Aceita a prop "confetti" para
// soltar confetes junto com o conteúdo.
// ============================================================================

import { Confete } from "./Confete";

export const Overlay = ({ children, confetti, className }) => (
  <div className={`pp-overlay${className ? ` ${className}` : ""}`}>
    {confetti && <Confete />}
    {children}
  </div>
);