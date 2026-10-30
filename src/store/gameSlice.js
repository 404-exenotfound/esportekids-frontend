import { createSlice } from "@reduxjs/toolkit";

export const initialStateJogo = {
  volume: 70,
  dificuldade: "media",
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
  },
});

export const { setVolume, setDificuldade } = gameSlice.actions;

export default gameSlice.reducer;
