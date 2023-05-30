import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  HOR_SNAP_LINE_STYLES,
  VER_SNAP_LINE_STYLES,
} from "../constants/styles";
import {
  modifyCodeEditor,
  selectAllCodeEditor,
} from "../store/codeEditorSlice";
import {
  selectCurrentScale,
  selectCurrentCodeEditorIndex,
  selectIsDragScrolling,
} from "../store/toolSlice";
import computeSnapPosition from "../tools/computeSnapPosition";

const GRAVITY = 5;

function useDragCodeEditor(codeEditorIndex, artBoardRef, canvasRef) {
  const dispatch = useDispatch();

  const currentScale = useSelector(selectCurrentScale);
  const codeEditors = useSelector(selectAllCodeEditor);
  const workingCanvasIndex = useSelector(selectCurrentCodeEditorIndex);
  const isDragScrolling = useSelector(selectIsDragScrolling);

  useEffect(() => {
    if (!canvasRef.current || !artBoardRef.current || isDragScrolling) return;
    // 코드 에디터를 누군가 선택시 이동 불가
    if (codeEditors[codeEditorIndex].editorPerson !== null) return;

    const artBoard = artBoardRef.current;
    const canvas = canvasRef.current;

    const handleMouseDown = (event) => {
      const verticalLine = document.createElement("div");
      const horizontalLine = document.createElement("div");

      // 현재 CanvasIndex
      const currentCanvasIndex =
        Array.from(event.currentTarget.parentNode.childNodes).indexOf(
          event.currentTarget
        ) / 2;

      // Canvas의 위치, 정보
      const originalElPositionTop = event.currentTarget.offsetTop;
      const originalElPositionLeft = event.currentTarget.offsetLeft;
      const originalElHeight = event.currentTarget.offsetHeight;
      const originalElWidth = event.currentTarget.offsetWidth;

      // 마우스의 위치
      const originalMousePositionTop = event.clientY;
      const originalMousePositionLeft = event.clientX;

      // 새로운 canvasList
      const canvasList = codeEditors.slice();

      const filteredXAxisSnapPoints = [];
      const filteredYAxisSnapPoints = [];

      canvasList.splice(currentCanvasIndex, 1);

      // 수평 수직 스냅 계산을 위한 배열
      canvasList.forEach((canvas) => {
        filteredXAxisSnapPoints.push(canvas.left, canvas.left + canvas.width);
        filteredYAxisSnapPoints.push(canvas.top, canvas.top + canvas.height);
      });

      let movedTop;
      let movedLeft;
      let isLeftAttached = false;
      let isRightAttached = false;
      let isTopAttached = false;
      let isBottomAttached = false;
      let nearestPossibleSnapAtX;
      let nearestPossibleSnapAtY;

      artBoard.appendChild(verticalLine);
      artBoard.appendChild(horizontalLine);

      const handleMouseMove = (event) => {
        // 이동한 값
        movedTop = (event.clientY - originalMousePositionTop) / currentScale;
        movedLeft = (event.clientX - originalMousePositionLeft) / currentScale;

        // 현재 위치
        const currentLeft = originalElPositionLeft + movedLeft;
        const currentTop = originalElPositionTop + movedTop;

        verticalLine.style.visibility = VER_SNAP_LINE_STYLES.HIDDEN;
        verticalLine.style.position = VER_SNAP_LINE_STYLES.POSITION;
        verticalLine.style.width = VER_SNAP_LINE_STYLES.WIDTH;
        verticalLine.style.height = VER_SNAP_LINE_STYLES.HEIGHT;
        verticalLine.style.backgroundColor = VER_SNAP_LINE_STYLES.BG_COLOR;

        horizontalLine.style.visibility = HOR_SNAP_LINE_STYLES.HIDDEN;
        horizontalLine.style.position = HOR_SNAP_LINE_STYLES.POSITION;
        horizontalLine.style.width = HOR_SNAP_LINE_STYLES.WIDTH;
        horizontalLine.style.height = HOR_SNAP_LINE_STYLES.HEIGHT;
        horizontalLine.style.backgroundColor = HOR_SNAP_LINE_STYLES.BG_COLOR;

        // 수평, 수직 스냅 위치 계산
        nearestPossibleSnapAtX = computeSnapPosition(
          filteredXAxisSnapPoints,
          currentLeft,
          currentLeft + originalElWidth,
          currentLeft + originalElWidth / 2
        );
        nearestPossibleSnapAtY = computeSnapPosition(
          filteredYAxisSnapPoints,
          currentTop,
          currentTop + originalElHeight,
          currentTop + originalElHeight / 2
        );

        if (Math.abs(currentLeft - nearestPossibleSnapAtX) < GRAVITY) {
          canvas.style.left = nearestPossibleSnapAtX + "px";
          isLeftAttached = true;
          isRightAttached = false;
        } else if (
          Math.abs(currentLeft + originalElWidth - nearestPossibleSnapAtX) <
          GRAVITY
        ) {
          canvas.style.left = nearestPossibleSnapAtX - originalElWidth + "px";
          isRightAttached = true;
          isLeftAttached = false;
        } else {
          canvas.style.left = currentLeft + "px";
          isLeftAttached = false;
          isRightAttached = false;
        }

        if (Math.abs(currentTop - nearestPossibleSnapAtY) < GRAVITY) {
          canvas.style.top = nearestPossibleSnapAtY + "px";
          isTopAttached = true;
          isBottomAttached = false;
        } else if (
          Math.abs(currentTop + originalElHeight - nearestPossibleSnapAtY) <
          GRAVITY
        ) {
          canvas.style.top = nearestPossibleSnapAtY - originalElHeight + "px";
          isBottomAttached = true;
          isTopAttached = false;
        } else {
          canvas.style.top = currentTop + "px";
          isTopAttached = false;
          isBottomAttached = false;
        }

        if (isLeftAttached || isRightAttached) {
          verticalLine.style.visibility = VER_SNAP_LINE_STYLES.VISIBLE;
          verticalLine.style.left = nearestPossibleSnapAtX + "px";
        }

        if (isTopAttached || isBottomAttached) {
          horizontalLine.style.visibility = VER_SNAP_LINE_STYLES.VISIBLE;
          horizontalLine.style.top = nearestPossibleSnapAtY + "px";
        }

        dispatch(
          modifyCodeEditor({
            top: originalElPositionTop + movedTop,
            left: originalElPositionLeft + movedLeft,
            codeEditorIndex,
          })
        );
      };

      const handleMouseUp = () => {
        const newShapeTop = originalElPositionTop + movedTop;
        const newShapeLeft = originalElPositionLeft + movedLeft;

        verticalLine.remove();
        horizontalLine.remove();

        if (movedTop || movedLeft) {
          if (isLeftAttached && isTopAttached) {
            dispatch(
              modifyCodeEditor({
                top: nearestPossibleSnapAtY,
                left: nearestPossibleSnapAtX,
                codeEditorIndex,
              })
            );
          } else if (isLeftAttached && isBottomAttached) {
            dispatch(
              modifyCodeEditor({
                top: nearestPossibleSnapAtY - originalElHeight,
                left: nearestPossibleSnapAtX,
                codeEditorIndex,
              })
            );
          } else if (isRightAttached && isTopAttached) {
            dispatch(
              modifyCodeEditor({
                top: nearestPossibleSnapAtY,
                left: nearestPossibleSnapAtX - originalElWidth,
                codeEditorIndex,
              })
            );
          } else if (isRightAttached && isBottomAttached) {
            dispatch(
              modifyCodeEditor({
                top: nearestPossibleSnapAtY - originalElHeight,
                left: nearestPossibleSnapAtX - originalElWidth,
                codeEditorIndex,
              })
            );
          } else if (isLeftAttached) {
            dispatch(
              modifyCodeEditor({
                top: newShapeTop,
                left: nearestPossibleSnapAtX,
                codeEditorIndex,
              })
            );
          } else if (isRightAttached) {
            dispatch(
              modifyCodeEditor({
                top: newShapeTop,
                left: nearestPossibleSnapAtX - originalElWidth,
                codeEditorIndex,
              })
            );
          } else if (isTopAttached) {
            dispatch(
              modifyCodeEditor({
                top: nearestPossibleSnapAtY,
                left: newShapeLeft,
                codeEditorIndex,
              })
            );
          } else if (isBottomAttached) {
            dispatch(
              modifyCodeEditor({
                top: nearestPossibleSnapAtY - originalElHeight,
                left: newShapeLeft,
                codeEditorIndex,
              })
            );
          } else {
            dispatch(
              modifyCodeEditor({
                top: newShapeTop,
                left: newShapeLeft,
                codeEditorIndex,
              })
            );
          }
        }

        movedTop = 0;
        movedLeft = 0;

        window.removeEventListener("mousemove", handleMouseMove);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    canvas.addEventListener("mousedown", handleMouseDown);

    return () => canvas.removeEventListener("mousedown", handleMouseDown);
  }, [
    currentScale,
    dispatch,
    codeEditorIndex,
    canvasRef,
    artBoardRef,
    codeEditors,
    workingCanvasIndex,
    isDragScrolling,
  ]);
}

export default useDragCodeEditor;
