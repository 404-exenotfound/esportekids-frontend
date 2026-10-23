import { Button } from 'react-bootstrap';

export const ButtonMario = ({ text, onClick }) => {
  const styles = {
    padding: "14px 32px",
    background: "#e63946",
    color: "#fff",
    border: "4px solid #1f1f1f",
    borderRadius: "4px",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 6px 0 #8f1d2c, 0 10px 0 #1f1f1f",
    transition: "transform 0.08s ease, box-shadow 0.08s ease",
    minWidth: "200px",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 10px 0 #8f1d2c, 0 14px 0 #1f1f1f";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 6px 0 #8f1d2c, 0 10px 0 #1f1f1f";
  };

  const handleMouseDown = (e) => {
    e.currentTarget.style.transform = "translateY(6px)";
    e.currentTarget.style.boxShadow = "0 0 0 #8f1d2c, 0 2px 0 #1f1f1f";
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 10px 0 #8f1d2c, 0 14px 0 #1f1f1f";
  };

  return (
    <div>
      <Button
        style={styles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
      >
        {text}
      </Button>
    </div>
  );
};