export const Overlay = ({ children, className }) => (
  <div className={`pp-overlay${className ? ` ${className}` : ""}`}>
    {children}
  </div>
);
