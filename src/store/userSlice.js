import { createSlice } from "@reduxjs/toolkit";

export const initialStateUser = {
  id: null,
  nome: "",
  email: "",
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
      state.email = usuario.email;
      state.token = token;
    },

    resetUser: () => initialStateUser,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
