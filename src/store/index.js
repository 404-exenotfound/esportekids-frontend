import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gameReducer, { initialStateJogo } from "./gameSlice";
import progressoReducer, { initialStateProgresso } from "./progressoSlice";

// Slices que sobrevivem ao F5. O "user" continua em memória: é dado de
// sessão, e não faz sentido reaparecer sozinho num próximo acesso.
const PERSISTIDOS = {
  jogo: { chave: "jogo", inicial: initialStateJogo },
  progresso: { chave: "progresso", inicial: initialStateProgresso },
};

function carregarPersistidos() {
  const estado = {};
  for (const [slice, { chave, inicial }] of Object.entries(PERSISTIDOS)) {
    try {
      const salvo = localStorage.getItem(chave);
      if (!salvo) continue;
      // Mesclar com o estado inicial garante que um campo novo criado depois
      // não chegue como undefined para quem já tem algo salvo do formato antigo.
      estado[slice] = { ...inicial, ...JSON.parse(salvo) };
    } catch {
      // JSON corrompido ou localStorage bloqueado (aba anônima, por exemplo):
      // cai no padrão em vez de derrubar a aplicação.
    }
  }
  return estado;
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    jogo: gameReducer,
    progresso: progressoReducer,
  },
  preloadedState: carregarPersistidos(),
});

// Grava a cada mudança, mas só quando o slice realmente mudou — assim
// arrastar o slider ou dispatch de outros slices não escrevem à toa.
const ultimoSalvo = {};
for (const slice of Object.keys(PERSISTIDOS)) {
  ultimoSalvo[slice] = JSON.stringify(store.getState()[slice]);
}

store.subscribe(() => {
  for (const [slice, { chave }] of Object.entries(PERSISTIDOS)) {
    const atual = JSON.stringify(store.getState()[slice]);
    if (atual === ultimoSalvo[slice]) continue;

    ultimoSalvo[slice] = atual;
    try {
      localStorage.setItem(chave, atual);
    } catch {
      // Sem espaço ou storage indisponível: segue normal, só não persiste.
    }
  }
});
