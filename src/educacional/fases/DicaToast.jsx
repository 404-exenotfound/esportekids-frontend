import "../styles/educacional.css";

// Aviso da dica. Fica fixo na parte de baixo da janela e NÃO recebe cliques nem
// foco (pointer-events: none, sem botões), então não atrapalha o jogo: nem o
// clique na arena, nem a tecla ESPAÇO usada no atletismo e no boliche.
export const DicaToast = ({ dica }) => {
  if (!dica) return null;
  return (
    <div key={dica.numero} className="edu-toast" role="status" aria-live="polite">
      <strong>💡 DICA {dica.numero}/{dica.total}</strong>
      <span>{dica.texto}</span>
    </div>
  );
};
