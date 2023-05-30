import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/atoms/CommentCreateBox.module.scss";
import { addComment } from "../../store/codeEditorSlice";
import { FiEdit } from "react-icons/fi";
// 저장된 사용자 정보 불러오기
import { selectUserId } from "../../store/defaultSettingSlice";
import {
  selectIsInputFieldFocused,
  setInputFieldBlurred,
  setInputFieldFocused,
} from "../../store/toolSlice";
const CommentCreateBox = ({ codeEditorIndex }) => {
  const dispatch = useDispatch();
  // 댓글내용
  const [inputValue, setInputValue] = useState("");
  const editorId = useSelector(selectUserId);
  // 댓글 추가하기
  const add = (event) => {
    event.preventDefault();
    if (inputValue.length > 0) {
      dispatch(
        addComment({
          codeEditorIndex: codeEditorIndex,
          comment: inputValue,
          userId: editorId,
        })
      );
      setInputValue("");
    } else {
      alert("댓글 내용을 입력해주세요.");
    }
  };

  return (
    <div
      className={styles.commentBox}
      onClick={() => {
        dispatch(setInputFieldFocused());
      }}
      onBlur={() => {
        console.log("blur");
        dispatch(setInputFieldBlurred());
      }}
    >
      <form className={styles.commentForm}>
        <input
          style={{ border: "none", backgroundColor: "inherit" }}
          type="text"
          onChange={(event) => setInputValue(event.target.value)}
          value={inputValue}
          placeholder="댓글 작성하기"
        />
        <button
          style={{ backgroundColor: "transparent", border: "none" }}
          type="submit"
          onClick={add}
        >
          <FiEdit />
        </button>
      </form>
    </div>
  );
};

export default CommentCreateBox;
