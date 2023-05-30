import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentScale,
  selectCurrentTool,
  selectIsDragScrolling,
  setCurrentTool,
} from "../store/toolSlice";
import { CANVAS_PREVIEW_STYLES } from "../constants/styles";
import computePreviewElement from "../tools/computePreviewElement";
import { addCodeEditor } from "../store/codeEditorSlice";

const useDrawCodeEditor = (elementRef) => {
  const dispatch = useDispatch();

  // 현재 줌 스케일
  const currentScale = useSelector(selectCurrentScale);
  // 현재 Tool
  const currentTool = useSelector(selectCurrentTool);
  // 드래그
  const isDragScrolling = useSelector(selectIsDragScrolling);

  useEffect(() => {
    if (!elementRef.current || currentTool !== "code-editor") return;

    const element = elementRef.current;

    // 마우스 클릭
    const handleMouseDownCanvas = (event) => {
      if (isDragScrolling) return;

      const canvasPreview = document.createElement("div");
      // 위치 값 불러오기
      const artboardNode = element.getBoundingClientRect();
      const artboardTop = artboardNode.top;
      const artboardLeft = artboardNode.left;
      // 시작 위치
      const startTop = (event.clientY - artboardTop) / currentScale;
      const startLeft = (event.clientX - artboardLeft) / currentScale;

      canvasPreview.style.top = startTop + "px";
      canvasPreview.style.left = startLeft + "px";
      canvasPreview.style.backgroundColor = CANVAS_PREVIEW_STYLES.BG_COLOR;
      canvasPreview.style.border = CANVAS_PREVIEW_STYLES.BORDER;
      canvasPreview.style.position = CANVAS_PREVIEW_STYLES.POSITION;
      canvasPreview.style.boxSizing = CANVAS_PREVIEW_STYLES.BOX_SIZING;

      element.appendChild(canvasPreview);

      let lastAnimationFrame;

      const handleMouseMove = (e) => {
        const { height, left, top, width } = computePreviewElement(
          { x: startLeft, y: startTop },
          {
            x: (e.clientX - artboardLeft) / currentScale,
            y: (e.clientY - artboardTop) / currentScale,
          }
        );

        if (lastAnimationFrame) cancelAnimationFrame(lastAnimationFrame);

        lastAnimationFrame = requestAnimationFrame(() => {
          renderNextAnimationFrame(height, left, top, width)();
          lastAnimationFrame = null;
        });
      };

      const renderNextAnimationFrame = (height, left, top, width) => () => {
        canvasPreview.style.height = height + "px";
        canvasPreview.style.width = width + "px";
        canvasPreview.style.top = top + "px";
        canvasPreview.style.left = left + "px";
      };

      const handleMouseUp = (event) => {
        if (event.button === 2) {
          console.log("right click executed?");
          canvasPreview.remove();
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseup", handleMouseUp);
          return;
        }

        const coordinates = {
          top: canvasPreview.offsetTop,
          left: canvasPreview.offsetLeft,
          canvasName: "",
        };

        // codeEditor 추가하기
        dispatch(addCodeEditor(coordinates));

        dispatch(setCurrentTool("selector"));

        canvasPreview.remove();
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseup", handleMouseUp);
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseup", handleMouseUp);
    };

    element.addEventListener("mousedown", handleMouseDownCanvas);

    return () =>
      element.removeEventListener("mousedown", handleMouseDownCanvas);
  }, [currentScale, currentTool, dispatch, elementRef, isDragScrolling]);
};

export default useDrawCodeEditor;
