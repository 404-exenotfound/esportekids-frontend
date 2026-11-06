export const Overlay = ({ children, className }) => (
  <div className={`pp-overlay jogo-overlay${className ? ` ${className}` : ""}`}>
    {children}
  </div>
);
