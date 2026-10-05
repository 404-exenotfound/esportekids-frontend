import { Confete } from "./Confete";

export const Overlay = ({ children, confetti }) => (
  <div className="bol-overlay">
    {confetti && <Confete />}
    {children}
  </div>
);
