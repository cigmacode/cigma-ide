import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentScale,
  selectCurrentTool,
  selectIsDragScrolling,
  setCurrentTool,
  setInputFieldBlurred,
  setInputFieldFocused,
} from "../store/toolSlice";
import {
  selectDefaultColor,
  selectDefaultFontSize,
} from "../store/defaultTextSlice";
import { useEffect } from "react";
import { TEXT_PREVIEW_STYLES } from "../constants/styles";
import { createText } from "../store/textSlice";

const useDrawText = (elementRef) => {
  const dispatch = useDispatch();

  const currentScale = useSelector(selectCurrentScale);
  const defaultColor = useSelector(selectDefaultColor);
  const defaultFontSize = useSelector(selectDefaultFontSize);
  const currentTool = useSelector(selectCurrentTool);
  const isDragScrolling = useSelector(selectIsDragScrolling);

  useEffect(() => {
    if (!elementRef.current || currentTool !== "text") return;

    const element = elementRef.current;

    // 마우스 클릭
    const handleClickText = (event) => {
      if (isDragScrolling) return;

      console.log("handleClickText");
      event.stopPropagation();
      const form = document.createElement("form");
      const previewText = document.createElement("div");
      // 위치 값 불러오기
      const elementFigures = element.getBoundingClientRect();
      const elementTop = elementFigures.top;
      const elementLeft = elementFigures.left;
      // 시작 위치
      const startTop = (event.clientY - elementTop) / currentScale;
      const startLeft = (event.clientX - elementLeft) / currentScale;

      previewText.spellcheck = false;
      previewText.contentEditable = TEXT_PREVIEW_STYLES.CONTENT_EDITABLE;
      previewText.style.minWidth = TEXT_PREVIEW_STYLES.MIN_WIDTH;
      // 아래와 비교
      previewText.style.top = startTop + "px";
      previewText.style.left = startLeft + "px";
      previewText.style.position = TEXT_PREVIEW_STYLES.POSITION;
      previewText.style.fontSize = defaultFontSize + "px";
      previewText.style.color = defaultColor;
      previewText.style.caretColor = TEXT_PREVIEW_STYLES.CARET_COLOR;
      previewText.style.backgroundColor = TEXT_PREVIEW_STYLES.BG_COLOR;
      previewText.style.margin = TEXT_PREVIEW_STYLES.MARGIN;
      previewText.style.padding = TEXT_PREVIEW_STYLES.PADDING;
      previewText.style.border = TEXT_PREVIEW_STYLES.BORDER;
      previewText.style.borderBottom = TEXT_PREVIEW_STYLES.BORDER_BOTTOM;
      previewText.style.outline = TEXT_PREVIEW_STYLES.OUTLINE;

      form.appendChild(previewText);
      element.appendChild(form);

      // previewText.style.top = startTop - previewText.clientHeight + "px";

      dispatch(setInputFieldFocused());
      console.log("isinput 변경");
      dispatch(setCurrentTool("selector"));

      const handBlur = () => {
        if (!previewText.innerText) {
          dispatch(setInputFieldBlurred());
          console.log("blurred");
          previewText.remove();
          form.remove();
          return;
        }

        const coordinates = {
          top: previewText.offsetTop,
          left: previewText.offsetLeft,
          height: previewText.clientHeight,
          width: previewText.clientWidth + 2,
          text: previewText.innerText,
          color: defaultColor,
          fontSize: defaultFontSize,
        };

        dispatch(createText(coordinates));
        dispatch(setInputFieldBlurred());
        console.log("blurred 처리");
        previewText.remove();
        form.remove();
      };

      previewText.addEventListener("blur", handBlur, { once: true });

      // let lastAnimationFrame;

      // const handleMouseMove = (e) => {
      //   const { height, left, top, width } = computePreviewElement(
      //     { x: startLeft, y: startTop },
      //     {
      //       x: (e.clientX - elementLeft) / currentScale,
      //       y: (e.clientY - elementTop) / currentScale,
      //     }
      //   );

      //   if (lastAnimationFrame) cancelAnimationFrame(lastAnimationFrame);

      //   lastAnimationFrame = requestAnimationFrame(() => {
      //     renderNextAnimationFrame(height, left, top, width)();
      //     lastAnimationFrame = null;
      //   });
      // };

      // const renderNextAnimationFrame = (height, left, top, width) => () => {
      //   previewText.style.height = height + "px";
      //   previewText.style.width = width + "px";
      //   previewText.style.top = top + "px";
      //   previewText.style.left = left + "px";
      // };
    };

    element.addEventListener("mousedown", handleClickText);

    return () => element.removeEventListener("mousedown", handleClickText);
  }, [
    currentScale,
    currentTool,
    dispatch,
    elementRef,
    isDragScrolling,
    defaultColor,
    defaultFontSize,
  ]);
};

export default useDrawText;
