import { createSlice } from "@reduxjs/toolkit";
import { LISTA_ESPORTES } from "../educacional/data/esportes";
import { ORDEM_JOGOS } from "../educacional/fases/dicasFases";
import { resetUser } from "./userSlice";

// Progresso educativo da criança: estrelas de conhecimento por esporte,
// curiosidades lidas e preferência de leitura. Salvo no localStorage (ver index.js)
// e no banco, por usuário (ver components/SincronizarProgresso.jsx).
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
    // Junta o progresso salvo no banco (GET /progresso) com o do navegador sem
    // perder nada: fica a maior nota de cada estrela e a união das listas.
    mesclarProgresso: (state, { payload }) => {
      for (const [esporte, notas] of Object.entries(payload.estrelas ?? {})) {
        const atual = state.estrelas[esporte] ?? { quiz: 0, matematica: 0 };
        state.estrelas[esporte] = {
          quiz: Math.max(atual.quiz, notas.quiz ?? 0),
          matematica: Math.max(atual.matematica, notas.matematica ?? 0),
        };
      }
      state.curiosidadesLidas = [...new Set([...state.curiosidadesLidas, ...(payload.curiosidades_lidas ?? [])])];
      const liberados = new Set([...state.jogosLiberados, ...(payload.jogos_liberados ?? [])]);
      state.jogosLiberados = ORDEM_JOGOS.filter((j) => liberados.has(j));
    },
  },
  // Ao sair (ou o token vencer), o progresso no navegador é limpo: ele já está
  // no banco, e a próxima criança a entrar neste aparelho não herda o dele.
  extraReducers: (builder) => {
    builder.addCase(resetUser, (state) => ({ ...initialStateProgresso, textoGrande: state.textoGrande }));
  },
});

export const {
  registrarResultado,
  marcarCuriosidade,
  desbloquearJogo,
  liberarTodosOsJogos,
  alternarTextoGrande,
  resetarProgresso,
  mesclarProgresso,
} =
  progressoSlice.actions;

export default progressoSlice.reducer;
