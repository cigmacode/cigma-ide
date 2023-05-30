import HeaderBtnAtom from "../atoms/HeaderBtnAtom";
import {
  BsFillTerminalFill,
  BsFillPlayFill,
  BsFillFileEarmarkTextFill,
  BsFileFontFill,
} from "react-icons/bs";

import styles from "../../styles/organisms/HeaderOrganism.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentTool,
  setCurrentTool,
  setFileBarVisible,
  setTermVisible,
} from "../../store/toolSlice";
import {
  selectProjectName,
  selectTeamName,
} from "../../store/defaultSettingSlice";
import { selectRunFile } from "../../store/runFileSlice";
import { runLang } from "../../constants/typeLang";
import { selectTermVisible } from "../../store/toolSlice";
import { useUsers } from "y-presence";
import UserToken from "../atoms/UserToken";
import { selectAwareness } from "../../store/yDocSlice";
import { useEffect, useRef, useState } from "react";
import { selectSocket } from "../../store/termSlice";
/*
추가적인 기능을 plugin 방식으로 추가할 경우
해당 부분을 setting 관련 파일에서 plugin을 
개수와 아이콘을 불러와서 추가하는 방식으로 
하는 것 이 좋아보임
*/

const HeaderOrganism = () => {
  const awareness = useSelector(selectAwareness);
  const users = useUsers(awareness);
  const dispatch = useDispatch();
  const currentTool = useSelector(selectCurrentTool);
  const isTermVisible = useSelector(selectTermVisible);
  const teamName = useSelector(selectTeamName);
  const projectName = useSelector(selectProjectName);
  const runFile = useSelector(selectRunFile);
  const socket = useSelector(selectSocket);

  return (
    <>
      <div className={styles.headerLeftDiv}>
        {/* plugin 추가 */}
        <HeaderBtnAtom
          onClick={() => {
            dispatch(setFileBarVisible());
          }}
        >
          <BsFillFileEarmarkTextFill color="white" size={24} />
        </HeaderBtnAtom>
        <HeaderBtnAtom
          isOnOff={currentTool == "text" ? true : false}
          onClick={() => dispatch(setCurrentTool("text"))}
        >
          <BsFileFontFill color="white" size={24} />
        </HeaderBtnAtom>
        <HeaderBtnAtom
          isOnOff={isTermVisible}
          onClick={() => {
            dispatch(setTermVisible());
          }}
        >
          <BsFillTerminalFill color="white" size={24} />
        </HeaderBtnAtom>
      </div>
      <div className={styles.headerMiddleDiv}>
        {teamName ? teamName + "/" + projectName : "untitled"}
      </div>
      <div className={styles.headerRightDiv}>
        {users
          ? Array.from(users.entries()).map(([key, value], index) => {
              if (!value.color || value.isActive === undefined) {
                return null;
              }
              return (
                <UserToken
                  key={key}
                  name={value.name}
                  isActive={value.isActive}
                  color={value.color}
                  image={value.avatar.image}
                />
              );
            })
          : null}
        <div
          className={styles.runIconBtn}
          onClick={() => {
            console.log(runFile);
            if (runFile.filePath != null) {
              const runCom = runLang(runFile.fileType);
              const runString = `${runCom} .${runFile.filePath}\r`;
              socket.send(JSON.stringify({ type: "message", data: runString }));
              if (!isTermVisible) {
                dispatch(setTermVisible());
              }
            }
          }}
        >
          <BsFillPlayFill color="white" size={24} />
        </div>
      </div>
    </>
  );
};

export default HeaderOrganism;
