// Faixa que aparece logo depois de cada bola, contando o que aconteceu.

export const BannerResultado = ({ tipo, frase, derrubados }) => (
  <div className={`bol-banner bol-banner-${tipo}`}>
    <p className="bol-banner-titulo">{frase}</p>
    <p className="bol-banner-sub">
      {derrubados === 0
        ? "NENHUM PINO DESTA VEZ"
        : `${derrubados} ${derrubados === 1 ? "PINO" : "PINOS"} NESTA BOLA`}
    </p>
  </div>
);
