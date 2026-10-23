// As capas dos jogos e o fundo da aplicação ficam no S3, e não no bundle:
// trocar uma imagem vira um upload no bucket, sem precisar de build novo.
export const URL_PUBLICA =
  "https://esporteskids-149471050150-us-east-1-an.s3.us-east-1.amazonaws.com/public";

// No bucket os arquivos usam o nome do jogo em minúsculo. Jogo que ainda não
// tem capa enviada fica de fora do mapa — o card simplesmente não mostra imagem.
const CAPAS = {
  atletismo: "atletismo.jpeg",
  basquete: "basquete.jpeg",
  boliche: "boliche.jpeg",
  futebol: "futebol.jpeg",
};

export function capaDoJogo(nomeJogo) {
  const arquivo = CAPAS[nomeJogo];
  return arquivo ? `${URL_PUBLICA}/${arquivo}` : null;
}
