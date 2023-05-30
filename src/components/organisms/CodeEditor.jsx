import { useDispatch, useSelector } from "react-redux";
import styles from "./CodeEditor.module.scss";
import {
  hideEditPointer,
  selectCurrentCodeEditorIndex,
  // selectEditPointerVisible,
  selectEditPointerVisible,
  selectIsDragScrolling,
  setCodeEditorIndex,
  setInputFieldBlurred,
  setInputFieldFocused,
  showEditPointer,
} from "../../store/toolSlice";
import useDragCodeEditor from "../../hooks/useDragCodeEditor";
import { useEffect, useRef, useState } from "react";
import EditPointer from "../atoms/EditPointer";
import computeSelectionBox from "../../tools/computeSelectionBox";
import Comment from "./Comment";
// import useGlobalKeyboardShortCut from "../../hooks/useGlobalKeyboardShortCut";

import {
  changeShownColor,
  deleteCodeEditor,
  hideCodeEditor,
  selectAllCodeEditor,
  selectCodeEditorLength,
  setEditorPerson,
  setFinishIsShown,
  setStartIsShown,
  showCodeEditor,
} from "../../store/codeEditorSlice";
import EditorOrganism from "./EditorOrganism";
import { detachFile, setFile } from "../../store/runFileSlice";

const directions = {
  N: "n",
  E: "e",
  S: "s",
  W: "w",
  NE: "ne",
  NW: "nw",
  SE: "se",
  SW: "sw",
};

// icons
import { FaComments } from "react-icons/fa";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { selectAwareness } from "../../store/yDocSlice";
const CodeEditor = ({ codeEditorIndex, artBoardRef, ...codeEditor }) => {
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const codeEditors = useSelector(selectAllCodeEditor);
  const awareness = useSelector(selectAwareness);

  // 클릭 -> 사이즈 조정
  const [isClicked, setIsClicked] = useState(false);

  const {
    top,
    left,
    width,
    height,
    isHidden,
    comments,
    isShown,
    shownColor,
    editorPerson,
  } = codeEditor;

  const isDragScrolling = useSelector(selectIsDragScrolling);

  // comment 우측
  const [hideComment, setHideComment] = useState(true);

  // 모나코 들어갈 곳
  useDragCodeEditor(codeEditorIndex, artBoardRef, canvasRef);

  // 단축키 추가
  // useGlobalKeyboardShortCut(isClicked);

  // div 포커스 해제되었을때 처리되는 핸들러
  const myColor = awareness.getLocalState().color;
  const myName = awareness.getLocalState().name;

  const handleBlurred = (event) => {
    setIsClicked(false);
    dispatch(hideEditPointer);
    if (editorPerson === null) {
      dispatch(
        changeShownColor({ color: null, codeEditorIndex: codeEditorIndex })
      );
    }
    if (editorPerson !== myName) return;
    dispatch(
      changeShownColor({ color: null, codeEditorIndex: codeEditorIndex })
    );
    handleFinishIsShown();
    dispatch(detachFile);
  };
  // editor 숨기기
  const handleHideClick = () => {
    dispatch(hideCodeEditor({ codeEditorIndex: codeEditorIndex }));
  };

  const handleShowClick = () => {
    dispatch(showCodeEditor({ codeEditorIndex: codeEditorIndex }));
  };
  // comment 보이기
  const handleCommentClick = () => {
    setHideComment(false);
  };
  // comment 숨기기
  const handleHideCommentClick = () => {
    setHideComment(true);
  };
  const handleStartIsShown = () => {
    if (isDragScrolling) return;
    if (isShown) return;
    dispatch(setStartIsShown({ codeEditorIndex: codeEditorIndex }));
    dispatch(
      changeShownColor({ color: myColor, codeEditorIndex: codeEditorIndex })
    );
    dispatch(
      setEditorPerson({ name: myName, codeEditorIndex: codeEditorIndex })
    );
    dispatch(setInputFieldFocused());
  };
  const changeColor = () => {
    if (editorPerson) return;
    dispatch(
      changeShownColor({ color: myColor, codeEditorIndex: codeEditorIndex })
    );
  };
  const handleFinishIsShown = () => {
    dispatch(setFinishIsShown({ codeEditorIndex: codeEditorIndex }));
    dispatch(setEditorPerson({ name: null, codeEditorIndex: codeEditorIndex }));
    dispatch(setInputFieldBlurred());
  };

  // header X버튼 눌렀을 때 , 에디터 삭제하기
  // TODO: 삭제처리맨
  const handleDeleteClick = () => {
    dispatch(deleteCodeEditor(codeEditorIndex));
  };
  // comment창 크기 설정
  const commentWidth = width / 2;
  // editor 숨김처리되었을때 isHidden store 값에 따른 css 설정
  const isHiddenStyle = {
    ...codeEditor,
    height: isHidden ? "50px" : height,
    border: shownColor ? `2px solid ${shownColor}` : "none",
  };

  return (
    <div
      className={styles["code-editor"]}
      onClick={(event) => {
        changeColor();
        event.preventDefault();
        dispatch(
          setFile({
            fileType: codeEditors[codeEditorIndex].fileType,
            filePath: codeEditors[codeEditorIndex].canvasName,
          })
        );
      }}
      onDoubleClick={() => {
        handleStartIsShown();
        if (isShown) {
          if (editorPerson === null || myName === editorPerson) {
            dispatch(setCodeEditorIndex(codeEditorIndex));
            setIsClicked(true);
            dispatch(showEditPointer());
          }
        }
      }}
      onBlur={() => {
        // TODO: 하이라이트 해제되었을 떄 수정 필요 (한나/윤진)
        // handleFinishIsShown();
        // handleInput();
        handleBlurred();
      }}
      ref={canvasRef}
      tabIndex={0}
      style={isHiddenStyle}
    >
      {/* CodeEditor Header */}
      <div
        className={styles.bar}
        style={{
          top,
          left,
          width,
        }}
      >
        <div
          style={{
            display: "flex",
            paddingLeft: "1em",
          }}
        >
          <button
            className={styles.closeButton}
            onClick={() => {
              //  삭제처리..
              handleDeleteClick();
            }}
          >
            <TiDelete />
          </button>
        </div>
        {/* CodeEditor File Name */}
        <div className={styles.editorHeaderName}>
          {codeEditors[codeEditorIndex].canvasName}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            paddingRight: "1em",
          }}
        >
          <button
            className={styles.showButton}
            onClick={() => {
              if (isHidden) {
                handleShowClick();
              } else {
                handleHideClick();
              }
            }}
          >
            {isHidden ? <VscTriangleDown /> : <VscTriangleUp />}
          </button>
          <button
            className={styles.commentButton}
            onClick={() => {
              if (hideComment) {
                handleCommentClick();
              } else {
                handleHideCommentClick();
              }
            }}
          >
            <FaComments />
          </button>
        </div>
      </div>
      {/* 댓글창 숨김처리 */}
      {!hideComment ? (
        <Comment
          comments={comments}
          codeEditorIndex={codeEditorIndex}
          left={width}
          height={height}
          width={commentWidth}
        />
      ) : null}
      {!isHidden ? (
        <div
          style={{
            top: 50,
            left: 0,
            width,
            height: height - 50,
            position: "absolute",
            backgroundColor: "white",
          }}
        >
          {isClicked
            ? // EditPointer atoms 들어갈 자리.
              // 편집점 활성화될때 삭제도 가능
              Object.values(directions).map((direction) => (
                <EditPointer
                  direction={direction}
                  key={direction}
                  {...computeSelectionBox(codeEditors, codeEditorIndex)}
                />
              ))
            : null}

          {/* monaco가 들어갈곳 */}
          <EditorOrganism
            editorPerson={editorPerson}
            className={styles["monaco-editor"]}
            file={codeEditors[codeEditorIndex].canvasName}
            fileType={codeEditors[codeEditorIndex].fileType}
            style={{ height: height - 50 }}
          />
          {/* comment 화면 처리 */}
        </div>
      ) : null}
    </div>
  );
};

export default CodeEditor;
