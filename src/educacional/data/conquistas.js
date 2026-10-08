import { LISTA_ESPORTES, TOTAL_ESTRELAS, ESTRELAS_POR_ESPORTE } from "./esportes";

// Estrelas de um esporte = melhor resultado no quiz + melhor em matemática
export const estrelasDoEsporte = (progresso, id) => {
  const e = progresso.estrelas[id];
  return e ? e.quiz + e.matematica : 0;
};

export const totalDeEstrelas = (progresso) =>
  LISTA_ESPORTES.reduce((s, e) => s + estrelasDoEsporte(progresso, e.id), 0);

export const CONQUISTAS = [
  { id: "curioso", emoji: "🔍", nome: "Curioso", descricao: "Leia 5 curiosidades",
    ok: (p) => p.curiosidadesLidas.length >= 5 },
  { id: "primeira-estrela", emoji: "⭐", nome: "Primeira estrela", descricao: "Ganhe sua primeira estrela",
    ok: (p) => totalDeEstrelas(p) >= 1 },
  { id: "craque-quiz", emoji: "🧠", nome: "Craque do quiz", descricao: "Acerte todo um quiz",
    ok: (p) => LISTA_ESPORTES.some((e) => p.estrelas[e.id]?.quiz === e.quiz.length) },
  { id: "mestre-matematica", emoji: "🧮", nome: "Mestre da matemática", descricao: "Acerte todos os problemas de um esporte",
    ok: (p) => LISTA_ESPORTES.some((e) => p.estrelas[e.id]?.matematica === e.matematica.length) },
  { id: "poliesportivo", emoji: "🌎", nome: "Poliesportivo", descricao: "Ganhe estrelas nos 5 esportes",
    ok: (p) => LISTA_ESPORTES.every((e) => estrelasDoEsporte(p, e.id) >= 1) },
  { id: "mestre-esporte", emoji: "🏅", nome: "Mestre de um esporte", descricao: "Complete todas as estrelas de um esporte",
    ok: (p) => LISTA_ESPORTES.some((e) => estrelasDoEsporte(p, e.id) === ESTRELAS_POR_ESPORTE(e)) },
  { id: "campeao", emoji: "🏆", nome: "Campeão EsporteKids", descricao: `Junte todas as ${TOTAL_ESTRELAS} estrelas`,
    ok: (p) => totalDeEstrelas(p) === TOTAL_ESTRELAS },
];
