import React from "react";
import styles from "../../styles/atoms/CommentStoredBox.module.scss";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
/**
 * 댓글 리스트들 보여주는 컴포넌트
 * @returns
 */
const CommentStoredBox = ({ comment, userId, timestamp }) => {
  return (
    <div className={styles["comment-container"]}>
      <div className={styles["user-div"]}>{userId}</div>
      <div className={styles["text-div"]}>{comment}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          color: "gray",
        }}
      >
        <div className={styles["time-div"]}>{timestamp}</div>
        <MdOutlineAccessTimeFilled />
      </div>
    </div>
  );
};

export default CommentStoredBox;
