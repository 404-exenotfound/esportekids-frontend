import { useLeitura } from "../hooks/useLeitura";

// Botão 🔊 que lê um texto em voz alta. Some sozinho se o navegador não suportar.
export const BotaoLeitura = ({ texto }) => {
  const { suportado, lendo, ler, parar } = useLeitura();
  if (!suportado) return null;

  return (
    <button
      type="button"
      className="edu-btn edu-btn-leitura"
      onClick={() => (lendo ? parar() : ler(texto))}
      aria-label={lendo ? "Parar a leitura" : "Ouvir este texto"}
    >
      {lendo ? "⏹ Parar" : "🔊 Ouvir"}
    </button>
  );
};
