import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  nome: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.nome = action.payload.nome;
    },

    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
