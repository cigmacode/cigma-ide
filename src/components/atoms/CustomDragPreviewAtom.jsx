import React from "react";
import { TypeIcon } from "./TypeIconAtom";
import styles from "../../styles/atoms/CustomDragPreviewAtom.module.scss";

export const CustomDragPreviewAtom = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <TypeIcon droppable={item.droppable} fileType={item?.data?.fileType} />
      </div>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};
