import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  resizeEast,
  resizeNorth,
  resizeNorthEast,
  resizeNorthWest,
  resizeSouth,
  resizeSouthEast,
  resizeSouthWest,
  resizeWest,
} from "../store/codeEditorSlice";
import { selectCurrentScale, selectCurrentCodeEditorIndex } from "../store/toolSlice";
import { batchGroupBy } from "../tools/batchActions";

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

function useDragToResize(pointerRef, direction) {
  const dispatch = useDispatch();

  const currentScale = useSelector(selectCurrentScale);
  const workingCanvasIndex = useSelector(selectCurrentCodeEditorIndex);
  // const selectedShapeIndexes = useSelector(selectSelectedShapeIndexes);

  useEffect(() => {
    if (!pointerRef.current) return;

    const pointer = pointerRef.current;

    const handleMouseDown = (e) => {
      e.stopPropagation();

      const randomID = Math.floor(Math.random() * 100000);
      const originalMousePositionTop = e.clientY;
      const originalMousePositionLeft = e.clientX;

      let movedTop;
      let movedLeft;
      let prevMovedTop = 0;
      let prevMovedLeft = 0;
      let lastAnimationFrame;

      batchGroupBy.start(randomID);

      const handleMouseMove = (e) => {
        movedTop = (e.clientY - originalMousePositionTop) / currentScale;
        movedLeft = (e.clientX - originalMousePositionLeft) / currentScale;

        if (lastAnimationFrame) cancelAnimationFrame(lastAnimationFrame);

        lastAnimationFrame = requestAnimationFrame(() => {
          renderNextAnimationFrame();
          lastAnimationFrame = null;
          prevMovedTop = movedTop;
          prevMovedLeft = movedLeft;
        });
      };

      const renderNextAnimationFrame = () => {
        if (direction === directions.N) {
          dispatch(
            resizeNorth({
              codeEditorIndex: workingCanvasIndex,
              change: movedTop - prevMovedTop,
            })
          );
        } else if (direction === directions.E) {
          dispatch(
            resizeEast({
              codeEditorIndex: workingCanvasIndex,
              change: movedLeft - prevMovedLeft,
            })
          );
        } else if (direction === directions.S) {
          dispatch(
            resizeSouth({
              codeEditorIndex: workingCanvasIndex,
              change: movedTop - prevMovedTop,
            })
          );
        } else if (direction === directions.W) {
          dispatch(
            resizeWest({
              codeEditorIndex: workingCanvasIndex,
              change: movedLeft - prevMovedLeft,
            })
          );
        } else if (direction === directions.NE) {
          dispatch(
            resizeNorthEast({
              codeEditorIndex: workingCanvasIndex,
              verChange: movedTop - prevMovedTop,
              horChange: movedLeft - prevMovedLeft,
            })
          );
        } else if (direction === directions.SE) {
          dispatch(
            resizeSouthEast({
              codeEditorIndex: workingCanvasIndex,
              verChange: movedTop - prevMovedTop,
              horChange: movedLeft - prevMovedLeft,
            })
          );
        } else if (direction === directions.NW) {
          dispatch(
            resizeNorthWest({
              codeEditorIndex: workingCanvasIndex,
              verChange: movedTop - prevMovedTop,
              horChange: movedLeft - prevMovedLeft,
            })
          );
        } else if (direction === directions.SW) {
          dispatch(
            resizeSouthWest({
              codeEditorIndex: workingCanvasIndex,
              verChange: movedTop - prevMovedTop,
              horChange: movedLeft - prevMovedLeft,
            })
          );
        }
      };

      const handleMouseUp = () => {
        batchGroupBy.end();
        window.removeEventListener("mousemove", handleMouseMove);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    pointer.addEventListener("mousedown", handleMouseDown);

    return () => pointer.removeEventListener("mousedown", handleMouseDown);
  }, [currentScale, direction, dispatch, pointerRef, workingCanvasIndex]);
}

export default useDragToResize;
