import { createSlice } from "@reduxjs/toolkit";

export const initialStateJogo = {
  volume: 70,
  dificuldade: "media",
  personagem: "rodolfo",
};

const gameSlice = createSlice({
  name: "jogo",
  initialState: initialStateJogo,
  reducers: {
    setVolume: (state, action) => {
      state.volume = action.payload;
    },

    setDificuldade: (state, action) => {
      state.dificuldade = action.payload;
    },

    setPersonagem: (state, action) => {
      state.personagem = action.payload;
    },
  },
});

export const { setVolume, setDificuldade, setPersonagem } = gameSlice.actions;

export default gameSlice.reducer;
