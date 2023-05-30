import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentScale,
  selectCurrentTextEditorIndex,
  selectCurrentTool,
  selectIsDragScrolling,
} from '../store/toolSlice';
import { useEffect } from 'react';
import { modifyText, selectAllTextEditor } from '../store/textSlice';
import {
  HOR_SNAP_LINE_STYLES,
  VER_SNAP_LINE_STYLES,
} from '../constants/styles';
import computeSnapPosition from '../tools/computeSnapPosition';

const GRAVITY = 5;

const useDragText = (textRef, artBoardRef, textIndex) => {
  const dispatch = useDispatch();

  const currentTool = useSelector(selectCurrentTool);
  const isDragScrolling = useSelector(selectIsDragScrolling);
  const textEditors = useSelector(selectAllTextEditor);
  const currentScale = useSelector(selectCurrentScale);
  const workingTextEditorIndex = useSelector(selectCurrentTextEditorIndex);

  useEffect(() => {
    if (!textRef.current || !artBoardRef.current || isDragScrolling) return;

    const text = textRef.current;
    const artBoard = artBoardRef.current;

    const handleMouseDown = (event) => {
      const verticalLine = document.createElement('div');
      const horizontalLine = document.createElement('div');

      // 현재 텍스트 index
      const currentTextIndex =
        Array.from(event.currentTarget.parentNode.childNodes).indexOf(
          event.currentTarget
        ) / 2;

      const originalElPositionTop = event.currentTarget.offsetTop;
      const originalElPositionLeft = event.currentTarget.offsetLeft;
      const originalElHeight = event.currentTarget.offsetHeight;
      const originalElWidth = event.currentTarget.offsetWidth;
      const originalMousePositionTop = event.clientY;
      const originalMousePositionLeft = event.clientX;

      const textList = textEditors.slice();

      const filteredXAxisSnapPoints = [];
      const filteredYAxisSnapPoints = [];

      textList.splice(currentTextIndex, 1);

      textList.forEach((text) => {
        filteredXAxisSnapPoints.push(text.left, text.left + text.width);
        filteredYAxisSnapPoints.push(text.top, text.top + text.height);
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
        movedTop = (event.clientY - originalMousePositionTop) / currentScale;
        movedLeft = (event.clientX - originalMousePositionLeft) / currentScale;

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
          text.style.left = nearestPossibleSnapAtX + 'px';
          isLeftAttached = true;
          isRightAttached = false;
        } else if (
          Math.abs(currentLeft + originalElWidth - nearestPossibleSnapAtX) <
          GRAVITY
        ) {
          text.style.left = nearestPossibleSnapAtX - originalElWidth + 'px';
          isRightAttached = true;
          isLeftAttached = false;
        } else {
          text.style.left = currentLeft + 'px';
          isLeftAttached = false;
          isRightAttached = false;
        }

        if (Math.abs(currentTop - nearestPossibleSnapAtY) < GRAVITY) {
          text.style.top = nearestPossibleSnapAtY + 'px';
          isTopAttached = true;
          isBottomAttached = false;
        } else if (
          Math.abs(currentTop + originalElHeight - nearestPossibleSnapAtY) <
          GRAVITY
        ) {
          text.style.top = nearestPossibleSnapAtY - originalElHeight + 'px';
          isBottomAttached = true;
          isTopAttached = false;
        } else {
          text.style.top = currentTop + 'px';
          isTopAttached = false;
          isBottomAttached = false;
        }

        if (isLeftAttached || isRightAttached) {
          verticalLine.style.visibility = VER_SNAP_LINE_STYLES.VISIBLE;
          verticalLine.style.left = nearestPossibleSnapAtX + 'px';
        }

        if (isTopAttached || isBottomAttached) {
          horizontalLine.style.visibility = VER_SNAP_LINE_STYLES.VISIBLE;
          horizontalLine.style.top = nearestPossibleSnapAtY + 'px';
        }
      };
      // dispatch();
      // modifyText({
      //   top: originalElPositionTop + movedTop,
      //   left: originalElPositionLeft + movedLeft,
      //   textIndex,
      // })

      const handleMouseUp = () => {
        const newShapeTop = originalElPositionTop + movedTop;
        const newShapeLeft = originalElPositionLeft + movedLeft;

        verticalLine.remove();
        horizontalLine.remove();

        if (movedTop || movedLeft) {
          if (isLeftAttached && isTopAttached) {
            dispatch(
              modifyText({
                top: nearestPossibleSnapAtY,
                left: nearestPossibleSnapAtX,
                textIndex,
              })
            );
          } else if (isLeftAttached && isBottomAttached) {
            dispatch(
              modifyText({
                top: nearestPossibleSnapAtY - originalElHeight,
                left: nearestPossibleSnapAtX,
                textIndex,
              })
            );
          } else if (isRightAttached && isTopAttached) {
            dispatch(
              modifyText({
                top: nearestPossibleSnapAtY,
                left: nearestPossibleSnapAtX - originalElWidth,
                textIndex,
              })
            );
          } else if (isRightAttached && isBottomAttached) {
            dispatch(
              modifyText({
                top: nearestPossibleSnapAtY - originalElHeight,
                left: nearestPossibleSnapAtX - originalElWidth,
                textIndex,
              })
            );
          } else if (isLeftAttached) {
            dispatch(
              modifyText({
                top: newShapeTop,
                left: nearestPossibleSnapAtX,
                textIndex,
              })
            );
          } else if (isRightAttached) {
            dispatch(
              modifyText({
                top: newShapeTop,
                left: nearestPossibleSnapAtX - originalElWidth,
                textIndex,
              })
            );
          } else if (isTopAttached) {
            dispatch(
              modifyText({
                top: nearestPossibleSnapAtY,
                left: newShapeLeft,
                textIndex,
              })
            );
          } else if (isBottomAttached) {
            dispatch(
              modifyText({
                top: nearestPossibleSnapAtY - originalElHeight,
                left: newShapeLeft,
                textIndex,
              })
            );
          } else {
            dispatch(
              modifyText({
                top: newShapeTop,
                left: newShapeLeft,
                textIndex,
              })
            );
          }
        }

        movedTop = 0;
        movedLeft = 0;

        window.removeEventListener('mousemove', handleMouseMove);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    };

    text.addEventListener('mousedown', handleMouseDown);

    return () => {
      text.removeEventListener('mousedown', handleMouseDown);
    };
  }, [
    artBoardRef,
    textEditors,
    currentScale,
    currentTool,
    dispatch,
    isDragScrolling,
    textIndex,
    textRef,
    workingTextEditorIndex,
  ]);
};

export default useDragText;
