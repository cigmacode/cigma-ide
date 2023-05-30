import { createSlice } from "@reduxjs/toolkit";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const initialState = {
  ydoc: null,
  provider: null,
  awareness: null,
};

const yDocSlice = createSlice({
  name: "yDoc",
  initialState,
  reducers: {
    createYDoc: (state, { payload: { roomName, port } }) => {
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(
        `ws://${window.location.hostname}:${port}`,
        roomName,
        ydoc
      );
      const awareness = provider.awareness;
      state.ydoc = ydoc;
      state.provider = provider;
      state.awareness = awareness;
    },
    changeYDoc: (state, { payload: { roomName, path, port } }) => {
      state.provider.disconnect();
      state.provider.destroy();
      state.ydoc.destroy();
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(
        `ws://${path}:${port}`,
        roomName,
        ydoc
      );
      const awareness = provider.awareness;
      state.ydoc = ydoc;
      state.provider = provider;
      state.awareness = awareness;
    },
  },
});

export const selectyDoc = (state) => state.yDoc.ydoc;

export const selectProvider = (state) => state.yDoc.provider;

export const selectAwareness = (state) => state.yDoc.awareness;

export const { createYDoc, changeYDoc } = yDocSlice.actions;

export default yDocSlice.reducer;
