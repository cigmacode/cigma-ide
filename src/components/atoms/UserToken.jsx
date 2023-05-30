import React, { useState } from "react";
import styles from "../../styles/atoms/UserToken.module.scss";

const UserToken = ({ name, isActive, color, image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          className={styles["circle-image"]}
          style={{
            backgroundColor: `${isActive ? color : "grey"}`,
            border: `3px solid ${isActive ? color : "grey"}`,
            marginRight: 5,
          }}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          <img
            src={image != null ? image : "./assets/img/default_avatar.png"}
            alt="이미지 설명"
            style={isActive ? null : { filter: "grayscale(60%)" }}
          />
        </div>
        {isHovered && <div className={styles["image-name"]}>{name}</div>}
      </div>
    </>
  );
};

export default UserToken;
