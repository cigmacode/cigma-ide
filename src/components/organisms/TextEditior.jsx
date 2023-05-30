import { useDispatch, useSelector } from "react-redux";
import {
  selectDefaultColor,
  selectDefaultFontSize,
} from "../../store/defaultTextSlice";
import { useEffect, useRef, useState } from "react";
import {
  deactivateSelector,
  setInputFieldBlurred,
  setInputFieldFocused,
  setTextEditorIndex,
} from "../../store/toolSlice";
import { modifyText, deleteText } from "../../store/textSlice";
import { activateSelector } from "../../store/toolSlice";
import style from "../../styles/organisms/TextEditor.module.scss";
// import { SHAPE_TEXT_STYLES } from "../../constants/styles";
import useDragText from "../../hooks/useDragText";

const TextEditior = ({ textIndex, artBoardRef, ...textEditor }) => {
  const dispatch = useDispatch();

  const defaultColor = useSelector(selectDefaultColor);
  const defaultFontSize = useSelector(selectDefaultFontSize);
  const textRef = useRef();
  const inputRef = useRef();

  useDragText(textRef, artBoardRef, textIndex);

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const handleBlur = (event) => {
    if (
      event.target.textContent.trim() != null &&
      event.target.textContent.trim() != ""
    ) {
      const newText = {
        // 택스트 내용
        text: event.target.textContent,
        // 색상
        color: defaultColor,
        // 폰트사이즈
        fontSize: defaultFontSize,
        // 높이
        height: event.target.clientHeight,
        // 가로
        width: event.target.clientWidth,
        // Text index
        textIndex: textIndex,
      };
      dispatch(modifyText(newText));
    } else {
      // text 없을 때 삭제
      dispatch(deleteText({ textIndex: textIndex }));
    }
    setIsDoubleClicked(false);
    dispatch(activateSelector());
    dispatch(setInputFieldBlurred());
  };

  const handleMouseEnter = () => {
    // deactivate 처리
    dispatch(deactivateSelector());
  };

  const handleMouseLeave = () => {
    dispatch(activateSelector());
    console.log("out");
  };

  useEffect(() => {
    if (!textRef.current) return;
    if (textEditor.height !== textRef.current.clientHeight) {
      dispatch(
        modifyText({
          textIndex: textIndex,
          height: textRef.current.clientHeight,
          width: textRef.current.clientWidth,
        })
      );
    }
  }, [textEditor, textIndex, dispatch]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, [inputRef, isDoubleClicked]);
  // 더블클릭
  if (isDoubleClicked)
    return (
      <form>
        <div
          ref={inputRef}
          className={style.input}
          style={{
            top: textEditor.top,
            left: textEditor.left,
            fontSize: defaultFontSize,
            color: defaultColor,
          }}
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          // 맞춤법 검사 여부
          spellCheck={false}
          // 포커스 시 이벤트
          onFocus={() => dispatch(setInputFieldFocused())}
          // 포커스 해제 시 이벤트
          onBlur={handleBlur}
        >
          {textEditor.text}
        </div>
      </form>
    );
  // 아닐때
  return (
    <>
      <div
        ref={textRef}
        className={style.idle}
        style={{
          top: textEditor.top,
          left: textEditor.left,
          fontSize: textEditor.fontSize,
          color: textEditor.color,
        }}
        onClick={() => dispatch(setTextEditorIndex(textIndex))}
        // 더블 클릭시
        onDoubleClick={() => {
          setIsDoubleClicked(true);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {textEditor.text}
      </div>
    </>
  );
};

export default TextEditior;
