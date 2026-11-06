import { URL_PUBLICA } from "./imagens";

// Os áudios das dicas ficam no S3 em public/audios/{pasta}/{prefixo} {n}.mp3.
// O nome da pasta e o prefixo do arquivo nem sempre batem com o id do jogo
// (ex.: pasta "Ping-Pong", arquivos "Ping pong 1.mp3"), por isso o mapa.
// "final" é o nome usado em public/audios/descricaoFinal/Audio {final}.mp3,
// a narração da revisão de todas as dicas no fim do jogo.
const AUDIOS_DICAS = {
  atletismo: { pasta: "Atletismo", prefixo: "Atletismo", final: "Atletismo" },
  basquete: { pasta: "Basquete", prefixo: "Basquete", final: "Basquete" },
  boliche: { pasta: "Boliche", prefixo: "Boliche", final: "Boliche" },
  futebol: { pasta: "Futebol", prefixo: "Futebol", final: "Futebol" },
  pingpong: { pasta: "Ping-Pong", prefixo: "Ping pong", final: "Ping Pong" },
};

export function audioDaDica(jogo, numero) {
  const cfg = AUDIOS_DICAS[jogo];
  if (!cfg || !numero) return null;
  const arquivo = encodeURIComponent(`${cfg.prefixo} ${numero}.mp3`);
  return `${URL_PUBLICA}/audios/${encodeURIComponent(cfg.pasta)}/${arquivo}`;
}

export function audioDescricaoFinal(jogo) {
  const cfg = AUDIOS_DICAS[jogo];
  if (!cfg) return null;
  return `${URL_PUBLICA}/audios/descricaoFinal/${encodeURIComponent(`Audio ${cfg.final}.mp3`)}`;
}
