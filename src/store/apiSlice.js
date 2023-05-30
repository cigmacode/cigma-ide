import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  path: `${window.location.hostname}:5000`,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    changePath: (state, { payload: { path, port } }) => {
      state.path = `${path}:${port}`;
    },
  },
});

export const selectPath = (state) => state.api.path;

export const { changePath } = apiSlice.actions;

export default apiSlice.reducer;
