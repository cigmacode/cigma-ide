import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentScale,
  selectIsInputFieldFocused,
  setCurrentScale,
} from "../store/toolSlice";
import { useEffect } from "react";
import { computeMockZoom } from "../tools/computeMockZoom";

const useMockZoom = (outerRef, innerRef) => {
  // 현재 줌 스케일
  const currentScale = useSelector(selectCurrentScale);
  const isInputFieldFocused = useSelector(selectIsInputFieldFocused);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!innerRef.current || !outerRef.current || isInputFieldFocused) return;

    const outerBoard = outerRef.current;
    const innerBoard = innerRef.current;
    let lastAnimationFrame;

    // 키보드로 줌
    const zoomWithKeyboard = (event) => {
      if (
        // mac os에서의 커맨드
        (event.ctrlKey || event.metaKey) &&
        (event.which === 61 || // +
          event.which === 107 || // =
          event.which === 173 || // -
          event.which === 109 || // -
          event.which === 187 || // +
          event.which === 189) // -
      ) {
        event.preventDefault();

        const { adjustedScroll, scale } = computeMockZoom(
          outerBoard,
          event,
          currentScale
        );
        // innerboard 설정
        innerBoard.style.transform = `scale(${scale}, ${scale})`;
        outerBoard.scrollTop = adjustedScroll.y;
        outerBoard.scrollLeft = adjustedScroll.x;
        // scale 변경
        dispatch(setCurrentScale(scale));
      }
    };

    // 휠로 줌
    const zoomWithWheel = function (event) {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();

        const { adjustedScroll, scale } = computeMockZoom(
          outerBoard,
          event,
          currentScale
        );

        if (lastAnimationFrame) cancelAnimationFrame(lastAnimationFrame);

        lastAnimationFrame = requestAnimationFrame(() => {
          renderNextAnimationFrame(adjustedScroll, scale)();
          lastAnimationFrame = null;
        });
      }
    };

    const renderNextAnimationFrame = (adjustedScroll, scale) => () => {
      innerBoard.style.transform = `scale(${scale}, ${scale})`;
      outerBoard.scrollTop = adjustedScroll.y;
      outerBoard.scrollLeft = adjustedScroll.x;

      dispatch(setCurrentScale(scale));
    };

    innerRef.current.style.transform = `scale(${currentScale}, ${currentScale})`;

    window.addEventListener("wheel", zoomWithWheel, { passive: false });
    window.addEventListener("keydown", zoomWithKeyboard, false);
    return () => {
      window.removeEventListener("keydown", zoomWithKeyboard);
      window.removeEventListener("wheel", zoomWithWheel);
    };
  }, [currentScale, dispatch, innerRef, isInputFieldFocused, outerRef]);
};
export default useMockZoom;
