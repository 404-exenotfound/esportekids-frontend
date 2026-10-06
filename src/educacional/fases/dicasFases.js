// ============================================================================
// DICAS DAS FASES — uma dica por acerto no jogo, e uma pergunta para cada dica
// ----------------------------------------------------------------------------
// A cada acerto (cesta, gol, estrela, ponto...) o jogo mostra a próxima dica.
// No fim, o quiz faz 1 pergunta sobre cada dica, NA MESMA ORDEM.
// Acertando MINIMO_PARA_LIBERAR perguntas, o próximo jogo é liberado.
// "correta" é o índice (começando em 0) da opção certa.
// ============================================================================

// Ordem das fases: cada jogo libera o seguinte
export const ORDEM_JOGOS = ["basquete", "futebol", "atletismo", "pingpong", "boliche"];

export const MINIMO_PARA_LIBERAR = 3;

export const proximoJogo = (id) => {
  const i = ORDEM_JOGOS.indexOf(id);
  return i >= 0 ? (ORDEM_JOGOS[i + 1] ?? null) : null;
};

export const jogoAnterior = (id) => {
  const i = ORDEM_JOGOS.indexOf(id);
  return i > 0 ? ORDEM_JOGOS[i - 1] : null;
};

export const DICAS_FASES = {
  basquete: [
    { dica: "O basquete foi inventado em 1891 pelo professor James Naismith, nos Estados Unidos.",
      pergunta: { p: "Quem inventou o basquete?", opcoes: ["James Naismith", "Pelé", "Usain Bolt", "Marta"], correta: 0, explicacao: "Foi o professor James Naismith, em 1891." } },
    { dica: "O aro de basquete fica a 3,05 metros de altura. É bem alto!",
      pergunta: { p: "A que altura fica o aro de basquete?", opcoes: ["1 metro", "3,05 metros", "5 metros", "10 metros"], correta: 1, explicacao: "O aro fica a 3,05 metros do chão." } },
    { dica: "Cada time joga com 5 jogadores em quadra.",
      pergunta: { p: "Quantos jogadores de cada time ficam em quadra?", opcoes: ["3", "5", "9", "11"], correta: 1, explicacao: "São 5 jogadores por time." } },
    { dica: "No começo, o basquete usava cestas de pêssego! Alguém tinha que subir numa escada para pegar a bola.",
      pergunta: { p: "Como eram as primeiras cestas do basquete?", opcoes: ["Cestas de pêssego", "Baldes de plástico", "Redes de pesca", "Panelas"], correta: 0, explicacao: "Eram cestas de pêssego, com o fundo fechado." } },
    { dica: "Uma cesta normal vale 2 pontos, uma de longe vale 3 e o lance livre vale 1 ponto.",
      pergunta: { p: "Quantos pontos vale uma cesta de longe?", opcoes: ["1", "2", "3", "10"], correta: 2, explicacao: "A cesta de longe vale 3 pontos." } },
  ],
  futebol: [
    { dica: "Cada time joga com 11 jogadores em campo, e um deles é o goleiro.",
      pergunta: { p: "Quantos jogadores cada time tem em campo?", opcoes: ["9", "10", "11", "12"], correta: 2, explicacao: "São 11 por time, contando o goleiro." } },
    { dica: "Só o goleiro pode pegar a bola com as mãos, dentro da sua área.",
      pergunta: { p: "Quem pode pegar a bola com as mãos?", opcoes: ["Todos os jogadores", "O goleiro", "O capitão", "O árbitro"], correta: 1, explicacao: "Só o goleiro, dentro da sua área." } },
    { dica: "Uma partida tem dois tempos de 45 minutos, ou seja, 90 minutos.",
      pergunta: { p: "Quantos minutos tem uma partida, sem os acréscimos?", opcoes: ["45", "60", "90", "120"], correta: 2, explicacao: "Dois tempos de 45 minutos dão 90 minutos." } },
    { dica: "A seleção brasileira masculina é pentacampeã mundial: ganhou a Copa do Mundo 5 vezes.",
      pergunta: { p: "Quantas Copas do Mundo o Brasil ganhou no futebol masculino?", opcoes: ["3", "4", "5", "6"], correta: 2, explicacao: "O Brasil é pentacampeão: 5 títulos." } },
    { dica: "O árbitro mostra cartão amarelo como aviso, e cartão vermelho quando o jogador precisa sair do jogo.",
      pergunta: { p: "O que significa o cartão vermelho?", opcoes: ["Um aviso", "O jogador sai do jogo", "Ponto extra", "Hora do intervalo"], correta: 1, explicacao: "Com o cartão vermelho, o jogador é expulso." } },
  ],
  atletismo: [
    { dica: "Os Jogos Olímpicos nasceram na Grécia Antiga, e a primeira prova foi uma corrida.",
      pergunta: { p: "Em que país nasceram os Jogos Olímpicos antigos?", opcoes: ["Brasil", "Grécia", "Japão", "Canadá"], correta: 1, explicacao: "Eles nasceram na Grécia Antiga." } },
    { dica: "Cada volta na pista de atletismo tem 400 metros.",
      pergunta: { p: "Quantos metros tem uma volta na pista de atletismo?", opcoes: ["100", "200", "400", "1.000"], correta: 2, explicacao: "Cada volta tem 400 metros." } },
    { dica: "No revezamento, os atletas passam um bastão uns para os outros.",
      pergunta: { p: "O que os atletas passam uns para os outros no revezamento?", opcoes: ["Uma bola", "Um bastão", "Uma bandeira", "Uma corda"], correta: 1, explicacao: "Eles passam um bastão." } },
    { dica: "A maratona é uma corrida bem longa: tem mais de 42 quilômetros!",
      pergunta: { p: "Qual destas provas tem mais de 42 km?", opcoes: ["100 metros rasos", "Revezamento 4x100", "Maratona", "Salto em distância"], correta: 2, explicacao: "A maratona tem 42,195 km." } },
    { dica: "Antes de correr, aqueça o corpo com uma caminhada leve. Os músculos agradecem!",
      pergunta: { p: "O que é bom fazer antes de correr?", opcoes: ["Dormir", "Aquecer o corpo", "Comer muito doce", "Nada"], correta: 1, explicacao: "Aquecer ajuda a evitar dores e lesões." } },
  ],
  pingpong: [
    { dica: "O ping pong também se chama tênis de mesa e nasceu na Inglaterra.",
      pergunta: { p: "Qual é o outro nome do ping pong?", opcoes: ["Tênis de mesa", "Tênis de campo", "Peteca", "Vôlei"], correta: 0, explicacao: "Ping pong e tênis de mesa são o mesmo esporte." } },
    { dica: "A bolinha de ping pong é muito leve: pesa só cerca de 2,7 gramas.",
      pergunta: { p: "Como é a bolinha de ping pong?", opcoes: ["Muito pesada", "Muito leve", "Feita de ferro", "Maior que uma bola de futebol"], correta: 1, explicacao: "Ela pesa só cerca de 2,7 gramas." } },
    { dica: "Cada set de ping pong normalmente vai até 11 pontos.",
      pergunta: { p: "Até quantos pontos vai normalmente um set?", opcoes: ["5", "11", "21", "50"], correta: 1, explicacao: "Os sets vão até 11 pontos." } },
    { dica: "O tênis de mesa é esporte olímpico desde 1988.",
      pergunta: { p: "Desde que ano o tênis de mesa é olímpico?", opcoes: ["1896", "1952", "1988", "2020"], correta: 2, explicacao: "Ele é olímpico desde 1988." } },
    { dica: "A bola precisa quicar uma vez em cada lado da mesa, passando por cima da rede.",
      pergunta: { p: "Onde a bola precisa quicar?", opcoes: ["Só no chão", "Em cada lado da mesa", "Na rede", "Na parede"], correta: 1, explicacao: "Ela quica uma vez em cada lado da mesa." } },
  ],
  boliche: [
    { dica: "O boliche tem 10 pinos, organizados em forma de triângulo.",
      pergunta: { p: "Quantos pinos tem o boliche?", opcoes: ["6", "8", "10", "12"], correta: 2, explicacao: "São 10 pinos." } },
    { dica: "Derrubar todos os pinos na primeira jogada se chama strike!",
      pergunta: { p: "Como se chama derrubar todos os pinos na 1ª jogada?", opcoes: ["Spare", "Strike", "Gol", "Cesta"], correta: 1, explicacao: "Isso é um strike." } },
    { dica: "Spare é derrubar todos os pinos usando as duas jogadas da rodada.",
      pergunta: { p: "O que é um spare?", opcoes: ["Derrubar todos os pinos em duas jogadas", "Errar todos os pinos", "Derrubar só 1 pino", "A bola cair na canaleta"], correta: 0, explicacao: "Spare é limpar os 10 pinos usando as duas bolas." } },
    { dica: "No boliche de verdade, o jogo perfeito vale 300 pontos, com 12 strikes seguidos.",
      pergunta: { p: "No boliche de verdade, quanto vale o jogo perfeito?", opcoes: ["100", "200", "300", "500"], correta: 2, explicacao: "O jogo perfeito vale 300 pontos." } },
    { dica: "A bola que cai na canaleta, o canal ao lado da pista, não derruba nenhum pino.",
      pergunta: { p: "O que acontece com a bola que cai na canaleta?", opcoes: ["Derruba todos os pinos", "Não derruba nenhum pino", "Vale pontos em dobro", "Volta sozinha"], correta: 1, explicacao: "Na canaleta a bola não derruba pinos." } },
  ],
};

export const TOTAL_DICAS = 5;
