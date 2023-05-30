import React from "react";
import styles from "../../styles/atoms/ButtonAtom.module.scss";

/**
 *
 * @returns onClick(클릭시함수), buttonName(버튼에 들어갈 이름)
 */
const ButtonAtom = ({ onClick, buttonName, style }) => {
  return (
    <button style={style} className={styles["login-button"]} onClick={onClick}>
      {buttonName}
    </button>
  );
};
export default ButtonAtom;
