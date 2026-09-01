import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gameReducer, { initialStateJogo } from "./gameSlice";

const CHAVE = "jogo";

// Só o slice "jogo" sobrevive ao F5. O "user" continua em memória: é dado de
// sessão, e não faz sentido reaparecer sozinho num próximo acesso.
function carregarJogo() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (!salvo) return undefined;

    // Mesclar com o initialState garante que um campo novo criado depois não
    // chegue como undefined para quem já tem algo salvo do formato antigo.
    return { jogo: { ...initialStateJogo, ...JSON.parse(salvo) } };
  } catch {
    // JSON corrompido ou localStorage bloqueado (aba anônima, por exemplo):
    // cai no padrão em vez de derrubar a aplicação.
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    jogo: gameReducer,
  },
  preloadedState: carregarJogo(),
});

// Grava a cada mudança, mas só quando o "jogo" realmente mudou — assim
// arrastar o slider ou dispatch de outros slices não escrevem à toa.
let ultimoSalvo = JSON.stringify(store.getState().jogo);

store.subscribe(() => {
  const atual = JSON.stringify(store.getState().jogo);
  if (atual === ultimoSalvo) return;

  ultimoSalvo = atual;
  try {
    localStorage.setItem(CHAVE, atual);
  } catch {
    // Sem espaço ou storage indisponível: o jogo segue normal, só não persiste.
  }
});
