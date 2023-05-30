import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsInputFieldFocused,
  startDragScroll,
  finishDragScroll,
  selectIsDragScrolling,
} from "../store/toolSlice";

// 스크롤 이동
const useDragToScroll = (boardRef) => {
  // startDragScoll, finishDragScroll를 사용하기 위한 호출
  const dispatch = useDispatch();
  const isDragScrolling = useSelector(selectIsDragScrolling);
  const isInputFieldFocused = useSelector(selectIsInputFieldFocused);

  useEffect(() => {
    // isInputFieldFocused가 true면 탈출
    if (!boardRef.current || isInputFieldFocused) return;
    console.log("useDragToScroll");

    const board = boardRef.current;

    // 스페이스 후, 마우스 클릭
    const handleMouseDown = (event) => {
      const start = {
        // 수평 스크롤 값, 수직 스크롤 값
        left: board.scrollLeft,
        top: board.scrollTop,
        // 화면 상의 마우스 클릭 위치
        x: event.clientX,
        y: event.clientY,
      };

      // 이동 중일 때 스크롤 위치 조정
      const handleMouseMove = (event) => {
        // 이동된 값
        const curX = event.clientX - start.x;
        const curY = event.clientY - start.y;
        // 마우스 커서 형태 변경
        board.style.cursor = "grabbing";
        // 현재 scroll 값 갱신
        board.scrollLeft = start.left - curX;
        board.scrollTop = start.top - curY;
      };

      // 마우스 클릭 종료
      const handleMouseUp = () => {
        // 마우스 커서 형태 변경
        board.style.cursor = "grab";
        // 이벤트 제거
        board.removeEventListener("mousedown", handleMouseDown);
        board.removeEventListener("mousemove", handleMouseMove);
        board.removeEventListener("mouseup", handleMouseUp);
      };

      // 마우스 커서 형태 변경
      board.style.cursor = "grabbing";
      // 이벤트 등록
      board.addEventListener("mousemove", handleMouseMove);
      board.addEventListener("mouseup", handleMouseUp);
    };

    // 마우스 휠 클릭
    const handleWheelDown = (event) => {
      if (event.button !== 1) return null;

      const start = {
        // 수평 스크롤 값, 수직 스크롤 값
        left: board.scrollLeft,
        top: board.scrollTop,
        // 화면 상의 마우스 클릭 위치
        x: event.clientX,
        y: event.clientY,
      };

      // 이동 중일 때 스크롤 위치 조정
      const handleWheelMove = (event) => {
        console.log("working5");
        // dispatch(startDragScroll());
        // console.log(isDragScrolling);
        // 이동된 값
        const curX = event.clientX - start.x;
        const curY = event.clientY - start.y;
        // 마우스 커서 형태 변경
        board.style.cursor = "grabbing";
        // 현재 scroll 값 갱신
        board.scrollLeft = start.left - curX;
        board.scrollTop = start.top - curY;
      };

      // 마우스 클릭 종료
      const handleWheelUp = () => {
        // 마우스 커서 형태 변경
        board.style.cursor = "default";
        dispatch(finishDragScroll());
        console.log("working2");
        // 이벤트 제거
        board.removeEventListener("mousemove", handleWheelMove);
        window.removeEventListener("mouseup", handleWheelUp, { once: true });
      };

      event.preventDefault();
      dispatch(startDragScroll());
      console.log("working1");
      // 마우스 커서 형태 변경
      board.style.cursor = "grab";
      // 이벤트 등록
      board.addEventListener("mousemove", handleWheelMove);
      window.addEventListener("mouseup", handleWheelUp);
    };

    const handleSpaceKeyDown = (event) => {
      // 이벤트 발생 확인
      // console.log(`event? ${event.target}`);
      // console.log(`boardRef? ${boardRef.current}`);
      // // code editor 편집하려고 할때는 space 이벤트 방지해야한다.
      // if (event.target.tagName.toLowerCase() === "textarea") {
      //   return;
      // }
      // 스페이스바 눌렀을 때
      if (event.keyCode === 32) {
        // 스페이스 이벤트 취소
        event.preventDefault();
        // isDragScrolling 값 true
        dispatch(startDragScroll());
        board.style.cursor = "grab";
        // 마우스 클릭 이벤트 추가
        board.addEventListener("mousedown", handleMouseDown);
        // 스페이스 떼고 난 후의 이벤트 추가
        window.addEventListener("keyup", handleSpaceKeyUp);
      }
    };

    const handleSpaceKeyUp = (event) => {
      if (event.keyCode === 32) {
        event.preventDefault();
        // isDragScrolling 값 false
        dispatch(finishDragScroll());
        console.log("working4");
        board.style.cursor = "default";
        // 마우스 클릭 이벤트 제거
        board.removeEventListener("mousedown", handleMouseDown);
        // keyup 이벤트 제거
        window.removeEventListener("keyup", handleSpaceKeyUp);
      }
    };

    // keydown 이벤트 추가
    // window.addEventListener("mousedown", handleWheelDown);
    window.addEventListener("keydown", handleSpaceKeyDown);

    return () => {
      window.removeEventListener("keydown", handleSpaceKeyDown);
      // window.removeEventListener("mousedown", handleWheelDown);
    };
  }, [boardRef, dispatch, isInputFieldFocused]);
};
export default useDragToScroll;
