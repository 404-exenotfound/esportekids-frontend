export const Estrelas = ({ total, max }) => (
  <span className="edu-estrelas" aria-label={`${total} de ${max} estrelas`}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={i < total ? "edu-estrela-on" : "edu-estrela-off"}>
        ★
      </span>
    ))}
  </span>
);
