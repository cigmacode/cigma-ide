import { createSlice } from "@reduxjs/toolkit";
import { FitAddon } from "xterm-addon-fit";

const initialState = {
  fitAddon: null,
  socket: null,
};

const termSlice = createSlice({
  name: "term",
  initialState,
  reducers: {
    createTerm: (state, { payload: { port } }) => {
      const fitAddon = new FitAddon();
      const socket = new WebSocket(
        `ws://${window.location.hostname}:${port}/terminal`
      );
      state.socket = socket;
      state.fitAddon = fitAddon;
    },
    changeTerm: (state, { payload: { path, port } }) => {
      state.socket.close();
      const socket = new WebSocket(`ws://${path}:${port}/terminal`);
      state.socket = socket;
    },
  },
});

export const selectFitAddon = (state) => state.term.fitAddon;

export const selectSocket = (state) => state.term.socket;

export const { createTerm, changeTerm } = termSlice.actions;

export default termSlice.reducer;
