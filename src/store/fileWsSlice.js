import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

const fileWsSlice = createSlice({
  name: "fileWs",
  initialState,
  reducers: {
    createFileWs: (state, { payload: { port } }) => {
      const socket = new WebSocket(
        `ws://${window.location.hostname}:${port}/fileExplorer`
      );
      state.socket = socket;
    },
    changeFileWs: (state, { payload: { path, port } }) => {
      state.socket.close();
      const socket = new WebSocket(`ws://${path}:${port}/fileExplorer`);
      state.socket = socket;
    },
  },
});

export const selectFileWs = (state) => state.fileWs.socket;

export const { createFileWs, changeFileWs } = fileWsSlice.actions;

export default fileWsSlice.reducer;
