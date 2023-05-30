import { createSlice, current } from "@reduxjs/toolkit";
import _ from "lodash";

const generateCodeEditor = (top, left) => ({
  canvasName: "canvas_0",
  top,
  left,
  width: 800,
  height: 500,
  isHidden: false,
  comments: [],
  filePath: "",
  isShown: false,
  shownColor: null,
  editorPerson: null,
  fileType: "",
});

const initialState = [];
// yLocs.set("codeEditors", initialState);

const codeEditorSlice = createSlice({
  name: "codeEditor",
  initialState,
  reducers: {
    // 작성중인 코드에디터 불러오기
    loadCodeEditor: (_, { payload }) => {
      return payload;
    },
    // 코드에디터 삭제
    deleteCodeEditor: (state, { payload: codeEditorIndex }) => {
      state.splice(codeEditorIndex, 1);
    },
    // 코드에디터 추가
    addCodeEditor: (
      state,
      { payload: { top, left, canvasName, fileType } }
    ) => {
      const newCodeEditor = {
        ...generateCodeEditor(top, left),
        // canvasName: `canvas_${state.length}`,
        canvasName: canvasName,
        fileType: fileType,
      };
      state.push(newCodeEditor);
    },
    // 코드에디터 이름 바꾸기
    changeCodeEditorName: (state, { payload: { name, codeEditorIndex } }) => {
      state[codeEditorIndex].canvasName = name;
    },
    // 코드에디터 위치 수정
    modifyCodeEditor: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      delete payload.codeEditorIndex;
      state[codeEditorIndex] = {
        ...state[codeEditorIndex],
        ...payload,
      };
    },
    // 코드에디터 크기 수정
    resizeNorth: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].top =
        current(state[codeEditorIndex]).top + payload.change;
      state[codeEditorIndex].height =
        current(state[codeEditorIndex]).height - payload.change;
    },
    resizeEast: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].width =
        current(state[codeEditorIndex]).width + payload.change;
    },
    resizeSouth: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].height =
        current(state[codeEditorIndex]).height + payload.change;
    },
    resizeWest: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].left =
        current(state[codeEditorIndex]).left + payload.change;
      state[codeEditorIndex].width =
        current(state[codeEditorIndex]).width - payload.change;
    },
    resizeNorthEast: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].top =
        current(state[codeEditorIndex]).top - payload.verChange;
      state[codeEditorIndex].height =
        current(state[codeEditorIndex]).height - payload.verChange;
      state[codeEditorIndex].width =
        current(state[codeEditorIndex]).width - payload.verChange;
    },
    resizeSouthEast: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].height =
        current(state[codeEditorIndex]).height + payload.verChange;
      state[codeEditorIndex].width =
        current(state[codeEditorIndex]).width + payload.horChange;
    },
    resizeNorthWest: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].top =
        current(state[codeEditorIndex]).top + payload.verChange;
      state[codeEditorIndex].height =
        current(state[codeEditorIndex]).height - payload.verChange;
      state[codeEditorIndex].left =
        current(state[codeEditorIndex]).left + payload.horChange;
      state[codeEditorIndex].width =
        current(state[codeEditorIndex]).width - payload.horChange;
    },
    resizeSouthWest: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].height =
        current(state[codeEditorIndex]).height + payload.verChange;
      state[codeEditorIndex].left =
        current(state[codeEditorIndex]).left + payload.horChange;
      state[codeEditorIndex].width =
        current(state[codeEditorIndex]).width - payload.horChange;
    },
    // 코드에디터 숨기기
    hideCodeEditor: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].isHidden = true;
    },
    // 코드에디터 보이기
    showCodeEditor: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].isHidden = false;
    },
    addComment: (state, { payload }) => {
      const { codeEditorIndex, comment, userId } = payload;
      const newComment = { comment, userId, timestamp: new Date().getTime() };
      state[codeEditorIndex].comments.push(newComment);
    },
    deleteComment: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      const comment = payload.comment;
      // comment timestamp의 key로 index 찾기
      const commendIndex = _.findIndex(
        state[codeEditorIndex].comments,
        comment.timestamp
      );
      state[commendIndex].comments.splice(codeEditorIndex, 1);
    },
    setStartIsShown: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].isShown = true;
    },
    setFinishIsShown: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      state[codeEditorIndex].isShown = false;
    },
    changeShownColor: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      const color = payload.color;
      state[codeEditorIndex].shownColor = color;
    },
    setEditorPerson: (state, { payload }) => {
      const codeEditorIndex = payload.codeEditorIndex;
      const name = payload.name;
      state[codeEditorIndex].editorPerson = name;
    },
  },
});

export const selectAllCodeEditor = (state) => state.workbench.codeEditor;
// 코드 에디터들 사이즈 구하기
export const selectCodeEditorLength = (state) =>
  state.workbench.codeEditor.length;
export const {
  loadCodeEditor,
  hideCodeEditor,
  addCodeEditor,
  changeCodeEditorName,
  modifyCodeEditor,
  resizeEast,
  resizeNorth,
  resizeSouth,
  resizeWest,
  resizeNorthEast,
  resizeSouthEast,
  resizeNorthWest,
  resizeSouthWest,
  showCodeEditor,
  deleteCodeEditor,
  addComment,
  deleteComment,
  setStartIsShown,
  setFinishIsShown,
  changeShownColor,
  setEditorPerson,
} = codeEditorSlice.actions;

export default codeEditorSlice.reducer;
