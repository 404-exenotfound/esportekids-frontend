import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  volume: 70,
  personagem: "mario",
  dificuldade: "normal",
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setVolume: (state, action) => {
      state.volume = action.payload;
    },

    setPersonagem: (state, action) => {
      state.personagem = action.payload;
    },

    setDificuldade: (state, action) => {
      state.dificuldade = action.payload;
    },
  },
});

export const {
  setVolume,
  setPersonagem,
  setDificuldade,
} = gameSlice.actions;

export default gameSlice.reducer;