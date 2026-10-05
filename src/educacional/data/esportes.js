// ============================================================================
// ESPORTES — todo o conteúdo educativo do EsporteKids num lugar só
// ----------------------------------------------------------------------------
// Para adicionar um esporte novo (ou mudar um texto), é só mexer aqui.
//   origem / regras / equipamentos -> "Aprenda antes de jogar"
//   curiosidades                   -> banner de curiosidade
//   quiz                           -> perguntas sobre o esporte (1 estrela cada)
//   matematica                     -> problemas usando o esporte (1 estrela cada)
//   saude / valores                -> vida saudável e boa convivência
// "correta" é o índice (começando em 0) da opção certa.
// ============================================================================

export const ESPORTES = {
  basquete: {
    id: "basquete",
    nome: "Basquete",
    emoji: "🏀",
    cor: "#f4a261",
    origem:
      "O basquete foi inventado em 1891 por James Naismith, um professor de Educação Física dos Estados Unidos. Ele queria um jogo para os alunos se exercitarem dentro do ginásio durante o inverno.",
    regras: [
      "Cada time joga com 5 jogadores em quadra.",
      "Vale quicar a bola (driblar), mas não pode andar segurando a bola.",
      "Cesta normal vale 2 pontos, de longe vale 3 e o lance livre vale 1.",
    ],
    equipamentos: ["Bola laranja", "Aro a 3,05 m do chão", "Tabela e rede"],
    curiosidades: [
      "No começo, o basquete era jogado com cestas de pêssego! Depois de cada ponto, alguém precisava subir numa escada para pegar a bola.",
      "O aro fica a 3,05 metros de altura desde a primeira partida, há mais de 130 anos.",
      "O basquete é esporte olímpico desde 1936.",
      "A seleção brasileira feminina de basquete foi campeã mundial em 1994.",
      "Driblar é quicar a bola enquanto você se move. Se você segura a bola e anda, é violação!",
    ],
    quiz: [
      { p: "Quem inventou o basquete?", opcoes: ["James Naismith", "Michael Jordan", "Pelé", "Thomas Edison"], correta: 0, explicacao: "Foi o professor James Naismith, em 1891, nos Estados Unidos." },
      { p: "A que altura do chão fica o aro de basquete?", opcoes: ["2 metros", "2,5 metros", "3,05 metros", "4 metros"], correta: 2, explicacao: "O aro fica a 3,05 metros. É bem alto!" },
      { p: "Quantos jogadores de cada time ficam em quadra ao mesmo tempo?", opcoes: ["3", "5", "7", "11"], correta: 1, explicacao: "São 5 jogadores de cada time em quadra." },
      { p: "No começo, as cestas do basquete eram feitas de quê?", opcoes: ["Cestas de pêssego", "Canos de ferro", "Pneus", "Redes de pesca"], correta: 0, explicacao: "Eram cestas de pêssego, e elas tinham fundo fechado!" },
    ],
    matematica: [
      { p: "Maria fez 3 cestas de 2 pontos e 1 lance livre de 1 ponto. Quantos pontos ela fez?", opcoes: ["6", "7", "8", "9"], correta: 1, explicacao: "3 × 2 = 6, e 6 + 1 = 7 pontos." },
      { p: "Um time fez 12 pontos no 1º quarto e 15 no 2º. Quantos pontos tem no total?", opcoes: ["25", "26", "27", "28"], correta: 2, explicacao: "12 + 15 = 27 pontos." },
      { p: "Cada jogador de um time de 5 jogadores marcou 4 pontos. Quantos pontos o time fez?", opcoes: ["9", "16", "20", "24"], correta: 2, explicacao: "5 × 4 = 20 pontos." },
    ],
    saude: [
      "Beba água antes, durante e depois do jogo. Quem joga muito perde líquido suando.",
      "Alongue os braços e as pernas antes de arremessar e pular. Isso ajuda a evitar dores.",
    ],
    valores: [
      "Basquete é jogo de equipe: passar a bola para quem está livre ajuda o time todo.",
      "Cumprimente o time adversário no final, ganhando ou perdendo.",
    ],
  },

  futebol: {
    id: "futebol",
    nome: "Futebol",
    emoji: "⚽",
    cor: "#2a9d8f",
    origem:
      "Jogos com bola chutada existem há muito tempo em vários países. As regras do futebol moderno foram escritas na Inglaterra, em 1863. Hoje ele é praticado no mundo inteiro.",
    regras: [
      "Cada time joga com 11 jogadores, e um deles é o goleiro.",
      "Só o goleiro pode pegar a bola com as mãos, dentro da sua área.",
      "A partida tem dois tempos de 45 minutos, e ganha quem fizer mais gols.",
    ],
    equipamentos: ["Bola", "Trave (gol)", "Chuteira", "Caneleira"],
    curiosidades: [
      "O Brasil é o único país que jogou todas as Copas do Mundo.",
      "Pelé foi campeão do mundo três vezes: em 1958, 1962 e 1970.",
      "A Copa do Mundo acontece de 4 em 4 anos.",
      "A jogadora Marta foi eleita 6 vezes a melhor do mundo pela FIFA.",
      "O árbitro mostra cartão amarelo como aviso e cartão vermelho quando o jogador precisa sair do jogo.",
    ],
    quiz: [
      { p: "Quantos jogadores cada time coloca em campo?", opcoes: ["9", "10", "11", "12"], correta: 2, explicacao: "São 11 jogadores por time, contando o goleiro." },
      { p: "Quantas vezes o Brasil foi campeão mundial de futebol masculino?", opcoes: ["3", "4", "5", "6"], correta: 2, explicacao: "O Brasil é pentacampeão: 1958, 1962, 1970, 1994 e 2002." },
      { p: "Quanto tempo dura uma partida de futebol, sem contar os acréscimos?", opcoes: ["60 minutos", "90 minutos", "120 minutos", "45 minutos"], correta: 1, explicacao: "São dois tempos de 45 minutos, ou seja, 90 minutos." },
      { p: "De quantos em quantos anos acontece a Copa do Mundo?", opcoes: ["1 ano", "2 anos", "4 anos", "10 anos"], correta: 2, explicacao: "A Copa do Mundo acontece a cada 4 anos." },
    ],
    matematica: [
      { p: "O time do Pedro fez 2 gols no primeiro tempo e 3 no segundo. Quantos gols fez no jogo?", opcoes: ["4", "5", "6", "7"], correta: 1, explicacao: "2 + 3 = 5 gols." },
      { p: "Uma partida tem 2 tempos de 45 minutos. Quantos minutos tem ao todo?", opcoes: ["80", "85", "90", "100"], correta: 2, explicacao: "45 + 45 = 90 minutos." },
      { p: "Em campo jogam 11 jogadores de cada time. Quantos jogadores há nos dois times juntos?", opcoes: ["20", "21", "22", "24"], correta: 2, explicacao: "11 + 11 = 22 jogadores." },
    ],
    saude: [
      "Use caneleira e chuteira adequada. Elas protegem as suas pernas e os seus pés.",
      "Descanse quando sentir cansaço demais. Parar um pouco também faz parte do treino.",
    ],
    valores: [
      "Respeite o árbitro e os adversários. Jogar limpo se chama fair play.",
      "Se um colega cair, ajude a levantar. Todo mundo está ali para se divertir.",
    ],
  },

  atletismo: {
    id: "atletismo",
    nome: "Atletismo",
    emoji: "🏃",
    cor: "#e76f51",
    origem:
      "O atletismo é um dos esportes mais antigos do mundo. Os Jogos Olímpicos da Grécia Antiga já tinham corridas, e a primeira prova de que se tem registro foi em 776 a.C.",
    regras: [
      "O atletismo reúne provas de corrida, saltos, lançamentos e marcha.",
      "Nas corridas, quem cruza a linha de chegada primeiro vence.",
      "No revezamento, os atletas de um time passam um bastão uns para os outros.",
    ],
    equipamentos: ["Tênis de corrida", "Pista de 400 m por volta", "Bastão (revezamento)"],
    curiosidades: [
      "A primeira prova olímpica da história foi uma corrida de cerca de 190 metros, na Grécia, em 776 a.C.",
      "O jamaicano Usain Bolt corre os 100 metros em 9,58 segundos. É o recorde mundial!",
      "A maratona tem 42,195 km e foi inspirada numa lenda de um mensageiro grego.",
      "Cada volta numa pista de atletismo tem 400 metros.",
      "O atletismo é chamado de \"esporte-base\", porque correr, saltar e lançar fazem parte de muitos outros esportes.",
    ],
    quiz: [
      { p: "Em que país nasceram os Jogos Olímpicos da Antiguidade?", opcoes: ["Brasil", "Grécia", "Japão", "Estados Unidos"], correta: 1, explicacao: "Os Jogos Olímpicos antigos nasceram na Grécia." },
      { p: "Quantos quilômetros tem uma maratona?", opcoes: ["10 km", "21 km", "42 km", "100 km"], correta: 2, explicacao: "A maratona tem 42,195 km, quase 42 km." },
      { p: "O que os atletas passam uns para os outros no revezamento?", opcoes: ["Uma bola", "Um bastão", "Uma bandeira", "Uma corda"], correta: 1, explicacao: "Eles passam um bastão, sem deixar cair!" },
      { p: "Qual destas provas NÃO é uma corrida?", opcoes: ["100 metros rasos", "Salto em distância", "Maratona", "Revezamento 4x100"], correta: 1, explicacao: "O salto em distância é uma prova de salto." },
    ],
    matematica: [
      { p: "Ana correu 3 voltas numa pista de 400 metros. Quantos metros ela correu?", opcoes: ["800", "1.000", "1.200", "1.600"], correta: 2, explicacao: "3 × 400 = 1.200 metros." },
      { p: "No revezamento 4x100, cada um dos 4 atletas corre 100 metros. Quantos metros o time corre no total?", opcoes: ["100", "200", "400", "1.000"], correta: 2, explicacao: "4 × 100 = 400 metros." },
      { p: "Leo correu 5 km de manhã e 3 km à tarde. Quantos km correu no dia?", opcoes: ["7", "8", "9", "15"], correta: 1, explicacao: "5 + 3 = 8 km." },
    ],
    saude: [
      "Aqueça o corpo com uma caminhada leve antes de correr. Os músculos agradecem.",
      "Use protetor solar e boné quando treinar ao ar livre.",
    ],
    valores: [
      "No atletismo você compete principalmente contra você mesmo: superar o seu tempo já é vencer.",
      "No revezamento, a confiança no colega vale tanto quanto a velocidade.",
    ],
  },

  pingpong: {
    id: "pingpong",
    nome: "Ping Pong",
    emoji: "🏓",
    cor: "#457b9d",
    origem:
      "O tênis de mesa, conhecido como ping pong, nasceu na Inglaterra no século XIX. Contam que começou como um passatempo em mesas de jantar, depois das refeições.",
    regras: [
      "A bola precisa quicar uma vez em cada lado da mesa.",
      "Cada set normalmente vai até 11 pontos.",
      "No saque, a bola quica primeiro no seu lado da mesa.",
    ],
    equipamentos: ["Raquete", "Bolinha leve (cerca de 2,7 g)", "Mesa com rede"],
    curiosidades: [
      "O nome \"ping pong\" imita o som da bolinha batendo na raquete e na mesa.",
      "A bolinha de ping pong pesa só cerca de 2,7 gramas e tem 40 milímetros.",
      "O tênis de mesa é esporte olímpico desde 1988, nos Jogos de Seul.",
      "Jogadores profissionais fazem a bolinha passar de 100 km/h!",
      "Jogar ping pong ajuda a treinar reflexo e concentração.",
    ],
    quiz: [
      { p: "Em que país nasceu o tênis de mesa?", opcoes: ["Inglaterra", "Brasil", "Egito", "Canadá"], correta: 0, explicacao: "Ele nasceu na Inglaterra, no século XIX." },
      { p: "Até quantos pontos vai, normalmente, um set de ping pong?", opcoes: ["5", "11", "21", "50"], correta: 1, explicacao: "Os sets vão até 11 pontos." },
      { p: "Em que ano o tênis de mesa virou esporte olímpico?", opcoes: ["1896", "1952", "1988", "2020"], correta: 2, explicacao: "Foi em 1988, nos Jogos Olímpicos de Seul." },
      { p: "Qual outro nome do ping pong?", opcoes: ["Tênis de campo", "Tênis de mesa", "Peteca", "Badminton"], correta: 1, explicacao: "Ping pong e tênis de mesa são o mesmo esporte." },
    ],
    matematica: [
      { p: "O set vai até 11 pontos. Se a Bia tem 7, quantos pontos faltam para ela?", opcoes: ["3", "4", "5", "6"], correta: 1, explicacao: "11 − 7 = 4 pontos." },
      { p: "Num set, Léo fez 11 pontos e o colega fez 8. Qual foi a diferença?", opcoes: ["2", "3", "4", "19"], correta: 1, explicacao: "11 − 8 = 3 pontos de diferença." },
      { p: "Cada bolinha pesa cerca de 3 gramas. Quantas gramas pesam 10 bolinhas?", opcoes: ["13", "20", "30", "300"], correta: 2, explicacao: "10 × 3 = 30 gramas." },
    ],
    saude: [
      "Ping pong é ótimo para reflexos, mas faça pausas e descanse os olhos.",
      "Alongue os ombros e os punhos antes de jogar.",
    ],
    valores: [
      "Respeite a vez de cada um: quem espera também aprende ao assistir.",
      "Parabenize o ponto bonito do adversário. Isso mostra esportividade.",
    ],
  },

  boliche: {
    id: "boliche",
    nome: "Boliche",
    emoji: "🎳",
    cor: "#9b5de5",
    origem:
      "Jogos de derrubar pinos com uma bola são muito antigos, e existem registros de milhares de anos. O boliche de hoje, com pista de madeira e 10 pinos, ficou popular no mundo todo.",
    regras: [
      "O jogo tem 10 rodadas, e em cada uma você tem até 2 jogadas.",
      "O objetivo é derrubar os 10 pinos.",
      "Strike é derrubar todos os pinos na primeira jogada, e spare é derrubar todos em duas jogadas.",
    ],
    equipamentos: ["Bola com 3 furos", "10 pinos", "Pista de madeira"],
    curiosidades: [
      "Derrubar todos os pinos na primeira jogada se chama strike, e na tabela de pontos aparece como um X.",
      "O jogo perfeito vale 300 pontos e precisa de 12 strikes seguidos!",
      "Cada pino pesa cerca de 1,5 kg, e uma bola pode pesar até 7 kg.",
      "A pista tem mais de 18 metros da linha de arremesso até os pinos.",
      "No boliche você precisa de pontaria e controle da força, pois nem sempre mais força significa melhor jogada.",
    ],
    quiz: [
      { p: "Quantos pinos existem numa pista de boliche?", opcoes: ["6", "8", "10", "12"], correta: 2, explicacao: "São 10 pinos, organizados em forma de triângulo." },
      { p: "Como se chama derrubar todos os pinos na primeira jogada?", opcoes: ["Spare", "Strike", "Gol", "Cesta"], correta: 1, explicacao: "Isso se chama strike." },
      { p: "Qual é a pontuação máxima de um jogo de boliche?", opcoes: ["100", "200", "300", "1.000"], correta: 2, explicacao: "O jogo perfeito vale 300 pontos." },
      { p: "Quantas rodadas tem um jogo de boliche?", opcoes: ["5", "10", "15", "20"], correta: 1, explicacao: "São 10 rodadas." },
    ],
    matematica: [
      { p: "Um jogador derrubou 7 pinos na 1ª jogada e 3 na 2ª. Quantos pinos derrubou?", opcoes: ["9", "10", "11", "21"], correta: 1, explicacao: "7 + 3 = 10. Isso é um spare!" },
      { p: "Há 10 pinos na pista. Se você derrubou 6, quantos ficaram em pé?", opcoes: ["3", "4", "5", "6"], correta: 1, explicacao: "10 − 6 = 4 pinos." },
      { p: "Em 3 rodadas, você derrubou 8, 9 e 10 pinos. Quantos pinos derrubou no total?", opcoes: ["25", "26", "27", "28"], correta: 2, explicacao: "8 + 9 + 10 = 27 pinos." },
    ],
    saude: [
      "Segure a bola com cuidado e use o jeito certo, para não machucar a mão ou as costas.",
      "Use sapato adequado na pista para não escorregar.",
    ],
    valores: [
      "Aguarde a sua vez e não atrapalhe quem está jogando.",
      "Todo mundo erra, então torça também para os colegas.",
    ],
  },
};

export const LISTA_ESPORTES = Object.values(ESPORTES);

// Estrelas possíveis por esporte: quiz + matemática
export const ESTRELAS_POR_ESPORTE = (esporte) =>
  esporte.quiz.length + esporte.matematica.length;

export const TOTAL_ESTRELAS = LISTA_ESPORTES.reduce(
  (soma, e) => soma + ESTRELAS_POR_ESPORTE(e),
  0
);

// Níveis do álbum: estrelas necessárias num esporte para liberar cada parte da carta
export const NIVEIS_CARTA = [
  { minimo: 1, rotulo: "Origem", emoji: "📜" },
  { minimo: 3, rotulo: "Regras e equipamentos", emoji: "📏" },
  { minimo: 5, rotulo: "Curiosidade secreta", emoji: "🔓" },
  { minimo: 7, rotulo: "Mestre do esporte", emoji: "🏅" },
];
