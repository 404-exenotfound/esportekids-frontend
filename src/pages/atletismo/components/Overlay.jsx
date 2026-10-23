import { Confete } from "./Confete";

export const Overlay = ({ children, confetti }) => (
  <div className="atl-overlay">
    {confetti && <Confete />}
    {children}
  </div>
);