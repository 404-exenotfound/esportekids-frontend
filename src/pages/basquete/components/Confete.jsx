export const Confete = ({ confetes }) =>
  confetes.map((confete) => (
    <span
      key={confete.id}
      className="bq-confete"
      style={{
        backgroundColor: confete.cor,
        left: `${confete.left}%`,
        animationDuration: `${confete.duracao}s`,
        animationDelay: `${confete.atraso}s`,
      }}
    />
  ));