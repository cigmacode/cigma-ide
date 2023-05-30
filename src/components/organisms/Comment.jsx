import React from "react";
import styles from "../../styles/organisms/Comment.module.scss";
import CommentCreateBox from "../atoms/CommentCreateBox";
import CommentStoredBox from "../atoms/CommentStoredBox";
import { MdOutlineWarning } from "react-icons/md";
/**
 *
 * @param editor에서 사용되는 comment창
 */
const Comment = ({ comments, codeEditorIndex, left, height, width }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}월${day}일 | ${hours}시 ${minutes}분`;
  };
  return (
    <div
      style={{
        top: 0,
        left: left,
        height: height,
        width: width,
      }}
      className={styles.comment}
    >
      {/* comment 작성하는 form  */}
      <CommentCreateBox codeEditorIndex={codeEditorIndex} />
      {/* comment들 보여지는 컴포넌트 */}
      {comments.length > 0 ? (
        <div className={styles["comment-container"]}>
          {comments.map((item, index) => {
            const { comment, userId, timestamp } = item;
            return (
              <CommentStoredBox
                timestamp={formatTimestamp(timestamp)}
                userId={userId}
                comment={comment}
                key={index}
              />
            );
          })}
        </div>
      ) : (
        // comment 0개일때 처리
        <div className={styles["comment-empty"]}>
          <div className={styles["comment-empty-box"]}>
            <div className={styles.font}>
              <MdOutlineWarning />
            </div>
            <div style={{ fontWeight: "bold" }}>아직 작성된 댓글이 없어요!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
