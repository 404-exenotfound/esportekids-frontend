export const BannerResultado = ({ resultado, frase, fraseTorcida }) => (
  <div className={`pc-banner-resultado ${resultado}`}>
    {frase}
    <span className="pc-banner-sub">{fraseTorcida}</span>
  </div>
);
