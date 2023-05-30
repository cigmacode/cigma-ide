import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fileType: null,
  filePath: null,
};

const runFileSlice = createSlice({
  name: "runFile",
  initialState,
  reducers: {
    setFile: (state, { payload: { fileType, filePath } }) => {
      state.fileType = fileType;
      state.filePath = filePath;
    },
    detachFile: (state) => {
      state = {
        fileType: null,
        filePath: null,
      };
    },
  },
});

export const selectRunFile = (state) => state.runFile;

export const { setFile, detachFile } = runFileSlice.actions;

export default runFileSlice.reducer;
