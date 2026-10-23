// Botão grande de ação — mesma função da tecla ESPAÇO.
// Essencial para tablet/celular na escola: tocar = correr / saltar / esticar.
export const BotaoAcao = ({ rotulo, etapa, emZonaDeSalto, onAcao }) => {
  if (etapa === "resultado") return null;

  return (
    <div className="atl-acao-wrap">
      <button
        type="button"
        className={`atl-btn-acao${emZonaDeSalto ? " atl-btn-acao--salto" : ""}`}
        onPointerDown={(e) => {
          e.preventDefault();
          onAcao();
        }}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={rotulo}
      >
        {rotulo}
      </button>
      <span className="atl-acao-dica">ou aperte ESPAÇO</span>
    </div>
  );
};
