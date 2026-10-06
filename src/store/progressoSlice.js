import { createSlice } from "@reduxjs/toolkit";
import { LISTA_ESPORTES } from "../educacional/data/esportes";
import { ORDEM_JOGOS } from "../educacional/fases/dicasFases";

// Progresso educativo da criança: estrelas de conhecimento por esporte,
// curiosidades lidas e preferência de leitura. Salvo no localStorage (ver index.js).
export const initialStateProgresso = {
  estrelas: Object.fromEntries(
    LISTA_ESPORTES.map((e) => [e.id, { quiz: 0, matematica: 0 }])
  ),
  curiosidadesLidas: [], // ex.: ["basquete-0", "futebol-2"]
  textoGrande: false,
  // Fases: só o primeiro jogo começa liberado; passar no quiz libera o próximo
  jogosLiberados: [ORDEM_JOGOS[0]],
};

const progressoSlice = createSlice({
  name: "progresso",
  initialState: initialStateProgresso,
  reducers: {
    // Guarda só o MELHOR resultado, então refazer o quiz nunca tira estrelas.
    registrarResultado: (state, { payload: { esporte, tipo, acertos } }) => {
      const atual = state.estrelas[esporte]?.[tipo] ?? 0;
      if (!state.estrelas[esporte]) state.estrelas[esporte] = { quiz: 0, matematica: 0 };
      if (acertos > atual) state.estrelas[esporte][tipo] = acertos;
    },
    marcarCuriosidade: (state, { payload }) => {
      if (!state.curiosidadesLidas.includes(payload)) state.curiosidadesLidas.push(payload);
    },
    desbloquearJogo: (state, { payload }) => {
      if (!state.jogosLiberados.includes(payload)) state.jogosLiberados.push(payload);
    },
    // Modo apresentação: libera todos os jogos de uma vez
    liberarTodosOsJogos: (state) => {
      state.jogosLiberados = [...ORDEM_JOGOS];
    },
    alternarTextoGrande: (state) => {
      state.textoGrande = !state.textoGrande;
    },
    resetarProgresso: (state) => ({ ...initialStateProgresso, textoGrande: state.textoGrande }),
  },
});

export const {
  registrarResultado,
  marcarCuriosidade,
  desbloquearJogo,
  liberarTodosOsJogos,
  alternarTextoGrande,
  resetarProgresso,
} =
  progressoSlice.actions;

export default progressoSlice.reducer;
