import { createSlice } from "@reduxjs/toolkit";

// Sessão do jogador logado. O token vai no header Authorization de toda
// chamada protegida (ver src/api/client.js).
export const initialStateUser = {
  id: null,
  nome: "",
  cargo: "",
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialStateUser,
  reducers: {
    // payload = resposta de /login ou /registro: { token, usuario }
    setUser: (state, { payload: { token, usuario } }) => {
      state.id = usuario.id;
      state.nome = usuario.nome;
      state.cargo = usuario.cargo;
      state.token = token;
    },

    resetUser: () => initialStateUser,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
