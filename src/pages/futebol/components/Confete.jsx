export const Confete = ({ confetes }) =>
  confetes.map(({ id, cor, left, atraso, duracao }) => (
    <div
      key={id}
      className="pc-confete"
      style={{
        left: `${left}%`,
        background: cor,
        animationDelay: `${atraso}s`,
        animationDuration: `${duracao}s`,
      }}
    />
  ));
