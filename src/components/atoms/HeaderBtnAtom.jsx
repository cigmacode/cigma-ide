import React, { useState } from "react";
import styles from "../../styles/atoms/HeaderBtnAtom.module.scss";

const HeaderBtnAtom = (props) => {
  return (
    <div
      className={`${styles.iconBtn} ${
        props.isOnOff ? styles.focus : styles.notFocus
      }`}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {props.children}
    </div>
  );
};

export default HeaderBtnAtom;
