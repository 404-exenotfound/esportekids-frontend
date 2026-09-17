export const BannerResultado = ({ resultado, frase, fraseTorcida }) => (
  <div className={`bq-banner-resultado ${resultado}`}>
    {frase}
    <span className="bq-banner-sub">{fraseTorcida}</span>
  </div>
);