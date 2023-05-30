import React, { useState, useRef, useEffect } from "react";
import { useDragOver } from "@minoru/react-dnd-treeview";
import { TypeIcon } from "./TypeIconAtom";
import { BsTriangleFill } from "react-icons/bs";
import { BsFillPenFill } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
import styles from "../../styles/atoms/CustomNodeAtom.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addCodeEditor,
  selectAllCodeEditor,
} from "../../store/codeEditorSlice";
import _ from "lodash";
import { typeLang } from "../../constants/typeLang";
import {
  setInputFieldBlurred,
  setInputFieldFocused,
} from "../../store/toolSlice";

export const CustomNodeAtom = (props) => {
  const { droppable, data } = props.node;
  const { id, text } = props.node;
  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const [beforeCreate, setBeforeCreate] = useState(false);
  const [createText, setCreateText] = useState(text);
  const indent = props.depth * 24;
  const inputRef = useRef();
  const newRef = useRef();
  const treeData = useSelector((state) => state.treeData);
  const getFilepathById = props.getFilepathById;
  const dispatch = useDispatch();
  const codeEditors = useSelector(selectAllCodeEditor);

  const handleToggle = (e) => {
    props.onToggle(props.node.id);
  };

  // 입력란 표기를 위한 State
  const handleShowInput = () => {
    setVisibleInput(true);
  };

  // workspace에 생성 시키기
  const handleDoubleClick = () => {
    if (droppable) return;
    let filepath = getFilepathById(id, treeData);
    if (filepath) {
      filepath = "/" + filepath;
    }
    const fileType = typeLang(data?.fileType);
    filepath += `/${text}`;
    const codeEditor = _.find(codeEditors, { canvasName: filepath });
    if (codeEditor) return;
    dispatch(
      addCodeEditor({
        top: 1000 + 10 * id,
        left: 1000 + 10 * id,
        canvasName: filepath,
        fileType: fileType,
      })
    );
  };

  // 입력란 랜더링 후 focus
  useEffect(() => {
    if (visibleInput) {
      if (inputRef.current) {
        inputRef.current.selectionStart = 0; // 선택 시작 위치를 0으로 설정합니다.
        inputRef.current.selectionEnd = inputRef.current.value.indexOf("."); // '.' 이전 위치까지 선택합니다.
        inputRef.current.focus();
      }
    }
  }, [visibleInput]);

  // 입력 취소
  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleChangeText = (e) => {
    setLabelText(e.target.value);
  };

  //파일을 제출하는 코드
  const handleSubmit = () => {
    //입력값이 존재하지 않을 시, 수정을 취소
    if (labelText === "") {
      handleCancel();
    } else {
      // 값이 입력되어 있을 경우, 값을 발송.
      setVisibleInput(false);
      const fileType = labelText.split(".")[1];
      props.onTextChange(id, labelText, fileType);
    }
  };

  const handleSelect = () => {
    props.onSelect(props.node);
  };
  const TREE_X_OFFSET = 24;
  const depthList = Array.from({ length: props.depth }, () => 0);
  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  // 엔터 시 제출, esc 시 취소
  const pressKey = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  //======================파일 생성용 함수==============================//
  // input 모드 변경
  useEffect(() => {
    if (props.node.id === props.lastCreated && props.node.text === "") {
      setBeforeCreate(true);
    }
  }, [props.lastCreated]);

  // input에 focus
  useEffect(() => {
    if (newRef.current) {
      newRef.current.focus();
    }
  }, [beforeCreate]);

  // 파일 생성 시 이름 입력
  const handleCreateText = (e) => {
    setCreateText(e.target.value);
  };

  // 생성 취소 (실제 파일에 영향 無)
  const cancelCreate = () => {
    setCreateText(text);
    props.onDelete(id, props.node.text, props.node.droppable, true);
  };

  //파일을 제출하는 코드
  const handleCreateSubmit = () => {
    //입력값이 존재하지 않을 시, 수정을 취소
    if (createText === "") {
      cancelCreate();
    } else {
      // 값이 입력되어 있을 경우, 값을 발송.
      setBeforeCreate(false);
      const fileType = createText.split(".")[1];
      props.createSignal(id, createText, props.node.droppable, fileType);
    }
  };

  const pressCreateKey = (event) => {
    if (event.key === "Enter") {
      handleCreateSubmit();
    } else if (event.key === "Escape") {
      cancelCreate();
    }
  };
  //======================================================================//

  return (
    <div
      className={`tree-node ${styles.root} ${
        props.isSelected ? styles.isSelected : ""
      }`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onClick={() => {
        handleSelect();
        handleToggle();
      }}
      onDoubleClick={() => {
        handleDoubleClick();
      }}
    >
      {/* 파일의 타입에 따라 바뀌는 아이콘  */}
      <div className={styles.iconWrapper}>
        <TypeIcon
          droppable={droppable}
          fileType={data?.fileType}
          isOpen={props.isOpen}
        />
      </div>

      {/* 파일 구조를 표시해주는 막대들 */}
      <div
        className={styles.pipeX}
        style={{
          width: props.depth > 0 ? TREE_X_OFFSET - 12 : 0,
          left: indent - 18,
        }}
      />
      {depthList.map((dpth, index) => {
        return (
          <div
            key={"y" + index}
            className={styles.pipeY}
            style={{
              height: props.depth > 0 ? 32 : 0,
              left: index * 24 + 6,
            }}
          />
        );
      })}

      <div className={styles.labelGridItem}>
        {beforeCreate ? (
          // 막 생성됨
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={styles.editWrapper}
          >
            <input
              ref={newRef}
              className={`
                ${styles.textField}
                ${styles.nodeInput}
                `}
              value={createText}
              onChange={handleCreateText}
              onBlur={handleCreateSubmit}
              onKeyDown={pressCreateKey}
            />
          </div>
        ) : visibleInput ? (
          // 이름 변경 중
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={styles.editWrapper}
          >
            <input
              ref={inputRef}
              className={`
                ${styles.textField}
                ${styles.nodeInput}
                `}
              value={labelText}
              onChange={handleChangeText}
              onBlur={handleSubmit}
              onKeyDown={pressKey}
            />
          </div>
        ) : (
          // 평소 노출 상태
          <div className={styles.nameSpace}>
            <div>{props.node.text}</div>
            <div
              className={styles.inputWrapper}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className={styles.editButton}
                onClick={() => {
                  handleShowInput();
                  dispatch(setInputFieldFocused());
                }}
                onBlur={() => {
                  dispatch(setInputFieldBlurred());
                }}
              >
                <BsFillPenFill className={styles.editIcon} />
              </div>
              <div
                className={styles.editButton}
                onClick={() =>
                  props.onDelete(id, props.node.text, props.node.droppable)
                }
              >
                <BsFillTrashFill className={styles.editIcon} />
              </div>
            </div>
          </div>
        )}
      </div>
      {props.node.droppable && (
        // dropabble 한지, 즉 폴더인지에 따라 표시되는 오른쪽 삼각형
        <div
          className={`${styles.expandIconWrapper} ${
            props.isOpen ? styles.isOpen : ""
          }`}
        >
          <div>
            <BsTriangleFill />
          </div>
        </div>
      )}
    </div>
  );
};
