import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { ActionCreators } from "redux-undo";
// import { useDispatch } from "react-redux";
import {
  setCurrentTool,
  selectCurrentCodeEditorIndex,
  setCodeEditorIndex,
  selectIsInputFieldFocused,
  selectCurrentTool,
  setInputFieldBlurred,
} from "../store/toolSlice";
import {
  deleteCodeEditor,
  selectCodeEditorLength,
} from "../store/codeEditorSlice";
function useGlobalKeyboardShortCut() {
  // console.log(`isClicked props:::${isClicked}`);
  const dispatch = useDispatch();
  const editorCount = useSelector(selectCodeEditorLength);
  const workingEditorIndex = useSelector(selectCurrentCodeEditorIndex);
  const isInputFieldFocused = useSelector(selectIsInputFieldFocused);
  // const tools = { SELECTOR: "selector", TEXT: "text", CodeEditor: "code-editor" };

  // ctr + V
  // selector로 설정

  // ctrl + t
  // text로 변경
  useEffect(() => {
    const selectorResetShortCut = (event) => {
      if (event.code === "Escape") {
        event.preventDefault();
        dispatch(setCurrentTool("selector"));
        dispatch(setInputFieldBlurred());
      }
    };
    window.addEventListener("keydown", selectorResetShortCut);

    if (isInputFieldFocused) return;
    /**
     * backspace 누르면 삭제
     */
    const deleteCanvasShortCut = (event) => {
      // console.log(`del key event${event}`);
      if (event.key == "Backspace" && editorCount > 1) {
        event.preventDefault();
        // event.stopPropagation();
        dispatch(deleteCodeEditor(workingEditorIndex));
        // dispatch(setCodeEditorIndex(0));
      }
    };
    /**
     * shiftKey + N
     * 캔버스 새로 생성하기
     * Selector code-editor로 설정
     */

    const codeEditorShortCut = (event) => {
      console.log(`event code${event.code}`);
      // if ((e.ctrlKey && e.code === "KeyN") || (e.metaKey && e.code === "KeyN")) return;
      if (event.code === "KeyN") {
        event.preventDefault();
        dispatch(setCurrentTool("code-editor"));
      }
    };
    /**
     *
     * shiftKey + T
     * 텍스트 새로 생성하기
     * Selector text로 설정
     */
    const textToolShortCut = (event) => {
      // if ((e.ctrlKey && e.code === "KeyT") || (e.metaKey && e.code === "KeyT")) return;
      if (event.code === "KeyT") {
        console.log("text input");
        event.preventDefault();
        dispatch(setCurrentTool("text"));
      }
    };
    /**
     * shiftKey + V
     * 일반적인 selector로 설정
     */
    const selectorToolShortCut = (event) => {
      // if ((e.ctrlKey && e.code === "KeyV") || (e.metaKey && e.code === "KeyV")) return;
      if (event.code === "KeyV") {
        event.preventDefault();
        dispatch(setCurrentTool("selector"));
      }
    };

    console.log("useGlobalKeyboardShortCut");
    // window.addEventListener("keydown", deleteCanvasShortCut);
    // window.addEventListener("keydown", codeEditorShortCut);
    window.addEventListener("keydown", textToolShortCut);
    window.addEventListener("keydown", selectorToolShortCut);
    return () => {
      // window.removeEventListener("keydown", deleteCanvasShortCut);
      // window.removeEventListener("keydown", codeEditorShortCut);
      window.removeEventListener("keydown", textToolShortCut);
      window.removeEventListener("keydown", selectorToolShortCut);
      window.removeEventListener("keydown", selectorResetShortCut);
    };
  }, [dispatch, editorCount, workingEditorIndex, isInputFieldFocused]);

  // return <div>useGlobalKeyboardShortCut</div>;
}

export default useGlobalKeyboardShortCut;
