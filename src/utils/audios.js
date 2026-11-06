import { URL_PUBLICA } from "./imagens";

// Os áudios das dicas ficam no S3 em public/audios/{pasta}/{prefixo} {n}.mp3.
// O nome da pasta e o prefixo do arquivo nem sempre batem com o id do jogo
// (ex.: pasta "Ping-Pong", arquivos "Ping pong 1.mp3"), por isso o mapa.
const AUDIOS_DICAS = {
  atletismo: { pasta: "Atletismo", prefixo: "Atletismo" },
  basquete: { pasta: "Basquete", prefixo: "Basquete" },
  boliche: { pasta: "Boliche", prefixo: "Boliche" },
  futebol: { pasta: "Futebol", prefixo: "Futebol" },
  pingpong: { pasta: "Ping-Pong", prefixo: "Ping pong" },
};

export function audioDaDica(jogo, numero) {
  const cfg = AUDIOS_DICAS[jogo];
  if (!cfg || !numero) return null;
  const arquivo = encodeURIComponent(`${cfg.prefixo} ${numero}.mp3`);
  return `${URL_PUBLICA}/audios/${encodeURIComponent(cfg.pasta)}/${arquivo}`;
}
