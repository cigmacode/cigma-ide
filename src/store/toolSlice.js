import { createSlice } from "@reduxjs/toolkit";

const tools = { SELECTOR: "selector", TEXT: "text", CodeEditor: "code-editor" };

const initialState = {
  isSelectorActivated: false,
  isInputFieldFocused: false,
  isDragScrolling: false,
  currentScale: 1,
  selectedShapeIndexes: [],
  currentTool: tools.SELECTOR,
  tools: [tools.SELECTOR, tools.TEXT, tools.CodeEditor],
  workingCodeEditorIndex: 0,
  workingTextEditorIndex: 0,
  isEditPointerVisible: false,
  isFileBarVisible: true,
  isTermVisible: true,
};

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {
    deactivateSelector: (state) => {
      state.isSelectorActivated = false;
    },
    activateSelector: (state) => {
      state.isSelectorActivated = true;
    },
    setInputFieldFocused: (state) => {
      state.isInputFieldFocused = true;
    },
    setInputFieldBlurred: (state) => {
      state.isInputFieldFocused = false;
    },
    // 스페이스 누를 때
    startDragScroll: (state) => {
      state.isDragScrolling = true;
    },
    // 스페이스 안눌렀을 때
    finishDragScroll: (state) => {
      state.isDragScrolling = false;
    },
    // 줌 관련 scale
    setCurrentScale: (state, { payload }) => {
      state.currentScale = payload;
    },
    // innerRef관련..
    emptySelectedShapeIndexes: (state) => {
      state.selectedShapeIndexes = [];
    },
    setCurrentTool: (state, { payload }) => {
      state.currentTool = payload;
      console.log(`currTool::${state.currentTool}`);
    },
    setCodeEditorIndex: (state, { payload }) => {
      state.workingCodeEditorIndex = payload;
    },
    setTextEditorIndex: (state, { payload }) => {
      state.workingTextEditorIndex = payload;
    },
    // 편집 포인터 관련
    showEditPointer: (state) => {
      state.isEditPointerVisible = true;
    },
    hideEditPointer: (state) => {
      state.isEditPointerVisible = false;
    },
    // 파일 바 표시 여부
    setFileBarVisible: (state) => {
      state.isFileBarVisible = !state.isFileBarVisible;
    },
    // 터미널 표시 여부
    setTermVisible: (state) => {
      state.isTermVisible = !state.isTermVisible;
    },
  },
});

export const selectIsInputFieldFocused = (state) =>
  state.tool.isInputFieldFocused;

export const selectCurrentScale = (state) => state.tool.currentScale;

export const selectCurrentTool = (state) => state.tool.currentTool;

export const selectIsDragScrolling = (state) => state.tool.isDragScrolling;

export const selectCurrentCodeEditorIndex = (state) =>
  state.tool.workingCodeEditorIndex;

export const selectCurrentTextEditorIndex = (state) =>
  state.tool.workingTextEditorIndex;

export const selectIsSelectorActivated = (state) =>
  state.tool.isSelectorActivated;
// 편집 포인터 숨김 여부 관련
export const selectEditPointerVisible = (state) =>
  state.tool.isEditPointerVisible;

export const selectFileBarVisible = (state) => state.tool.isFileBarVisible;

export const selectTermVisible = (state) => state.tool.isTermVisible;

export const {
  activateSelector,
  deactivateSelector,
  setInputFieldFocused,
  setInputFieldBlurred,
  startDragScroll,
  finishDragScroll,
  setCurrentScale,
  emptySelectedShapeIndexes,
  setCurrentTool,
  setCodeEditorIndex,
  setTextEditorIndex,
  showEditPointer,
  hideEditPointer,
  setFileBarVisible,
  setTermVisible,
} = toolSlice.actions;

export default toolSlice.reducer;
