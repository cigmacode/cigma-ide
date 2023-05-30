import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const textSlice = createSlice({
  name: "textEditor",
  initialState,
  reducers: {
    // Text 가져오기
    loadText: (_, { payload }) => {
      return payload;
    },
    // 상태 초기화
    resetText: () => initialState,
    // 텍스트 삭제
    deleteText: (state, { payload }) => {
      const textIndex = payload.textIndex;
      state.splice(textIndex, 1);
    },
    // 텍스트 생성
    createText: (state, { payload }) => {
      // const newText = generateText(top, left, width, height, content);
      state.push(payload);
    },
    // Text 이동
    modifyText: (state, { payload }) => {
      const textIndex = payload.textIndex;
      delete payload.textIndex;
      state[textIndex] = {
        ...state[textIndex],
        ...payload,
      };
    },
    // content 변경
    changeText: (state, { payload }) => {
      const textIndex = payload.textIndex;
      state[textIndex].text = payload.text;
    },
  },
});

export const selectAllTextEditor = (state) => state.workbench.textEditor;

export const {
  loadText,
  resetText,
  deleteText,
  createText,
  modifyText,
  changeText,
} = textSlice.actions;

export default textSlice.reducer;
