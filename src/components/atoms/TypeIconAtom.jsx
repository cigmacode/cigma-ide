import React from "react";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import { FcGallery } from "react-icons/fc";
import { FcNeutralDecision } from "react-icons/fc";
import { BsFileTextFill } from "react-icons/bs";
import { BsFillCupHotFill } from "react-icons/bs";
import { AiFillHtml5 } from "react-icons/ai";
import { DiSass } from "react-icons/di";
import { SiJavascript, SiTypescript, SiPython } from "react-icons/si";
import { SiCss3 } from "react-icons/si";

export const TypeIcon = (props) => {
  if (props.droppable) {
    if (props.isOpen) {
      return <FcOpenedFolder />;
    } else {
      return <FcFolder />;
    }
  }

  // 입력된 data의 fileType에 따라 아이콘을 변경
  switch (props.fileType) {
    case "png":
    case "jpeg":
    case "jpg":
      return <FcGallery />;
    case "md":
    case "txt":
      return <BsFileTextFill color="rgb(70, 166, 255)" />;
    case "java":
      return <BsFillCupHotFill color="rgb(230, 122, 0)" />;
    case "js":
    case "jsx":
      return <SiJavascript color="rgb(255, 217, 0)" />;
    case "tsx":
      return <SiTypescript color="rgb(84, 116, 255)" />;
    case "html":
      return <AiFillHtml5 color="rgb(255, 174, 0)" />;
    case "css":
      return <SiCss3 color=" rgb(61, 139, 255)" />;
    case "scss":
    case "sass":
      return <DiSass color=" rgb(255, 30, 154)" />;
    case "json":
      return <FcNeutralDecision />;
    case "py":
      return <SiPython color="rgb(55, 118, 171)" />;

    default:
      return null;
  }
};
