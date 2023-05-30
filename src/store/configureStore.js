import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import defaultTextSlice from "./defaultTextSlice";
import codeEditorSlice from "./codeEditorSlice";
import toolSlice from "./toolSlice";
import textSlice from "./textSlice";
import treeData from "./treeData";

import { enhanceReducer } from "redux-yjs-bindings";
import defaultSettingSlice from "./defaultSettingSlice";
import runFileSlice from "./runFileSlice";
import yDocSlice from "./yDocSlice";
import termSlice from "./termSlice";
import apiSlice from "./apiSlice";
import fileWsSlice from "./fileWsSlice";
// import undoable from "redux-undo";

// const MAXIMUN_UNDO_COUNT = 100;

// if you want share state add the workbench
const workbench = combineReducers({
  defaultText: defaultTextSlice,
  codeEditor: codeEditorSlice,
  textEditor: textSlice,
});

// 뒤로가기
// export const undoableWorkBench = undoable(workbench, {
//   groupBy: ,
//   limit: MAXIMUN_UNDO_COUNT
// })

const store = configureStore({
  reducer: {
    workbench: enhanceReducer(workbench),
    tool: toolSlice,
    yDoc: yDocSlice,
    defaultSetting: defaultSettingSlice,
    runFile: runFileSlice,
    term: termSlice,
    fileWs: fileWsSlice,
    api: apiSlice,
    treeData,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

export const WORKBENCH_REDUCER_NAME = "workbench";
