import React, { useState, useRef, useCallback, useEffect } from "react";
import { Tree, getDescendants } from "@minoru/react-dnd-treeview";
import { CustomNodeAtom } from "../atoms/CustomNodeAtom";
import { CustomDragPreviewAtom } from "../atoms/CustomDragPreviewAtom";
import styles from "../../styles/organisms/FileTreeOrganism.module.scss";
import {
  BsArrowDownSquare,
  BsArrowUpSquare,
  BsFileEarmarkPlus,
  BsFolderPlus,
  BsDownload,
} from "react-icons/bs";
import { Resizable } from "re-resizable";
// import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import { modifyTreeData } from "../../store/treeData";
// import { saveAs } from "file-saver";
import {
  selectFileBarVisible,
  setInputFieldBlurred,
  setInputFieldFocused,
} from "../../store/toolSlice";
import {
  deleteFile,
  deleteFolder,
  expressFile,
  expressFolder,
  fileMoveUpdate,
  fileTextUpdate,
  fileTreeUpdate,
  fileUpdate,
  projectDownload,
} from "../../api/fileTree";
import {
  changeCodeEditorName,
  deleteCodeEditor,
  selectAllCodeEditor,
} from "../../store/codeEditorSlice";
import _, { debounce } from "lodash";
import { selectPath } from "../../store/apiSlice";
import { initTreeData } from "../../store/treeData";
import { selectFileWs } from "../../store/fileWsSlice";

// 마지막 파일의 Id 값을 가져옴
const getLastId = (treeData) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }
    return 0;
  });

  if (reversedArray.length > 0) {
    return reversedArray[0].id;
  }
  return 0;
};

//id에 해당하는 노드를 찾기 위한 재귀 함수
const findNodeById = (id, nodes) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      return node;
    } else if (node.children) {
      const foundNode = findNodeById(id, node.children);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};

//id를 기반으로 파일 경로를 구성하는 함수
const getFilepathById = (id, nodes) => {
  const node = findNodeById(id, nodes);
  if (!node) {
    return "/";
  }
  const segments = [];
  let parent = findNodeById(node.parent, nodes);
  while (parent) {
    segments.unshift(parent.text);
    parent = findNodeById(parent.parent, nodes);
  }
  return segments.join("/");
};

function FileTreeOrganism({ widthLeft, setWidthLeft, defaultWidthLeft }) {
  // ============================ 트리용 데이터 리스트 생성=====================//
  const dispatch = useDispatch();
  const treeData = useSelector((state) => state.treeData);
  const handleFileBar = useSelector(selectFileBarVisible);
  const codeEditors = useSelector(selectAllCodeEditor);
  const myPath = useSelector(selectPath);
  const fileWs = useSelector(selectFileWs);

  useEffect(() => {
    // 최초 렌더링 시 파일 트리 업데이트
    const UpdateFile = async () => {
      dispatch(initTreeData());
      const { status, data } = await fileTreeUpdate(myPath);
      if (status) {
        dispatch(modifyTreeData(data));
      }
    };

    UpdateFile();

    // 서버 project 폴더 안의 수정사항 발생 시 호출
    const treeUpdateHandler = debounce(async (e) => {
      if (e.data === "treeRefresh") {
        const { status, data } = await fileTreeUpdate(myPath);
        if (status) {
          console.log("tree update complete!!!!!!");
          dispatch(modifyTreeData(data));
        }
      }
    }, 300);

    fileWs.addEventListener("message", treeUpdateHandler);

    return () => {
      fileWs.removeEventListener("message", treeUpdateHandler);
    };
  }, [myPath]);

  //=========================== 파일 이름 바꾸기=============================== //
  const handleTextChange = async (id, value, type) => {
    // 파일 경로 확보
    let filepath = getFilepathById(id, treeData);
    const node = findNodeById(id, treeData);
    const data = { oldName: node.text, newName: value, path: filepath };
    // 파일 이름 변경에 성공한 경우
    const newTree = treeData.map((node) => {
      // 유효한 파일 타입 확장자를 입력 받았을 때
      if (node.id === id && type != undefined) {
        return {
          ...node,
          text: value,
          data: {
            ...node.data,
            fileType: type,
          },
        };
      } else if (node.id === id) {
        // 파일명만 수정할 때
        return {
          ...node,
          text: value,
        };
      }
      return node;
    });
    dispatch(modifyTreeData(newTree));
    await fileTextUpdate(data, myPath);
    // codeEditor 이름 변경
    if (filepath.trim() !== "") {
      filepath = "/" + filepath;
    }
    const codeEditorIndex = _.findIndex(codeEditors, {
      canvasName: filepath + "/" + node.text,
    });
    if (codeEditorIndex === -1) return;
    dispatch(
      changeCodeEditorName({
        codeEditorIndex: codeEditorIndex,
        name: filepath + "/" + value,
      })
    );
  };

  // ===============================파일 삭제================================= //
  const handleDelete = async (id, name, dir, created = false) => {
    // 파일 경로
    let filepath = getFilepathById(id, treeData);
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ];
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id));
    if (created != true) {
      // 폴더일 경우
      if (dir) {
        const { status } = await deleteFolder(name, filepath, myPath);
        if (status) {
          dispatch(modifyTreeData(newTree));
        }
      } else {
        //파일일 경우
        const { status } = await deleteFile(name, filepath, myPath);
        if (status) {
          dispatch(modifyTreeData(newTree));
          if (filepath.trim() !== "") {
            filepath = "/" + filepath;
          }
          const codeEditorIndex = _.findIndex(codeEditors, {
            canvasName: filepath + "/" + name,
          });
          if (codeEditorIndex === -1) return;
          dispatch(deleteCodeEditor(codeEditorIndex));
        }
      }
    } else {
      dispatch(modifyTreeData(newTree));
    }
  };
  //========================= 새로운 파일/ 폴더 만들기=============================//
  const [lastCreated, setLastCreated] = useState(0);

  const handleCreate = (newNode) => {
    const lastId = getLastId(treeData) + 1;
    setLastCreated(lastId);
    dispatch(
      modifyTreeData([
        ...treeData,
        {
          ...newNode,
          id: lastId,
        },
      ])
    );
  };

  // 현재 위치에 새로운 폴더를 만드는 함수
  const CreateFolder = () => {
    const text = "";
    const droppable = true;
    // 선택중인 파일이 없을 때, 최상단에 생성
    if (selectedNode === null) {
      handleCreate({
        text,
        parent: 0,
        droppable,
      });
    } else if (selectedNode.droppable === false) {
      // 선택중인 파일이 폴더가 아닐 때.
      handleCreate({
        text,
        parent: selectedNode.parent,
        droppable,
      });
    } else {
      // 선택중인 파일이 폴더일 때.
      handleCreate({
        text,
        parent: selectedNode.id,
        droppable,
      });
    }
  };

  // 현재 위치에 새로운 파일을 만드는 함수
  const CreateFile = () => {
    const text = "";
    const fileType = "";
    const droppable = false;
    // 선택중인 파일이 없을 때, 최상단에 생성
    if (selectedNode === null) {
      handleCreate({
        text,
        parent: 0,
        droppable,
        data: { fileType },
      });
    } else if (selectedNode.droppable === false) {
      // 선택중인 파일이 폴더가 아닐 때.
      handleCreate({
        text,
        parent: selectedNode.parent,
        droppable,
        data: { fileType },
      });
    } else {
      // 선택중인 파일이 폴더일 때.
      handleCreate({
        text,
        parent: selectedNode.id,
        droppable,
        data: { fileType },
      });
    }
  };

  // 실제 Express 서버에 요청을 보내는 함수
  const createSignal = async (id, name, dir, type) => {
    const newTree = treeData.map((node) => {
      // 유효한 파일 타입 확장자를 입력 받았을 때
      if (node.id === id && type != undefined) {
        return {
          ...node,
          text: name,
          data: {
            ...node.data,
            fileType: type,
          },
        };
      } else if (node.id === id) {
        // 파일명만 수정할 때
        return {
          ...node,
          text: name,
        };
      }
      return node;
    });
    dispatch(modifyTreeData(newTree));
    const filepath = getFilepathById(id, treeData);
    console.log(filepath);
    if (dir) {
      await expressFolder(name, filepath, myPath);
    } else {
      await expressFile(name, filepath, myPath);
    }
  };

  //======================================================================//

  // 드래그 드롭을 실행하는 함수
  const handleDrop = async (
    newTree,
    { dragSourceId, dropTargetId, dragSource, dropTarget }
  ) => {
    // 현위치와 목표 위치를 정의
    let sourcePath = getFilepathById(dragSourceId, treeData);

    let destinationPath = getFilepathById(dropTargetId, treeData);
    // 최상단은 droptarget이 undefined로 입력되므로 조건문을 통해 경로를 추가
    if (destinationPath.trim()) {
      destinationPath = "/" + destinationPath;
    }
    if (dropTarget) {
      destinationPath += `/${dropTarget.text}`;
    }
    //axios 처리 후 Tree 수정
    const { status } = await fileMoveUpdate(
      dragSource.text,
      sourcePath,
      destinationPath,
      myPath
    );
    if (status) {
      dispatch(modifyTreeData(newTree));
      if (sourcePath.trim() !== "") {
        sourcePath = "/" + sourcePath;
      }
      const codeEditorIndex = _.findIndex(codeEditors, {
        canvasName: sourcePath + "/" + dragSource.text,
      });
      if (codeEditorIndex === -1) return;
      if (destinationPath === "//") {
        destinationPath = "";
      }
      console.log("destination", destinationPath + "/" + dragSource.text);
      dispatch(
        changeCodeEditorName({
          codeEditorIndex: codeEditorIndex,
          name: destinationPath + "/" + dragSource.text,
        })
      );
    }
  };

  // 선택된 노드를 표기하는 State
  const [selectedNode, setSelectedNode] = useState(null);
  const handleSelect = (node) => setSelectedNode(node);

  //모든 폴더를 접는 Ref
  const ref = useRef(null);
  const handleCloseAll = () => ref.current?.closeAll();
  const handleOpenAll = () => ref.current?.openAll();

  // 파일, 폴더 생성 이전에 선택 중인 폴더를 열기
  const handleOpen = (node) => {
    if (node != null) {
      ref.current.open(node.id);
    }
  };

  //==========파일을 드래그 앤 드롭하는 드롭 존 ===============//
  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    try {
      await Promise.all(
        acceptedFiles.map(async (file) => {
          const formData = new FormData();
          const encodedFilePath = encodeURIComponent(file.path);
          formData.append("file", file);
          formData.append("path", encodedFilePath);

          console.log(file.path);

          await fileUpdate(formData, myPath);
          console.log("File upload successful");
        })
      );
    } catch (error) {
      console.error("File upload failed", error);
    }

    const { status, data } = await fileTreeUpdate(myPath);
    if (status) {
      dispatch(modifyTreeData(data));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <Resizable
      size={{ width: widthLeft }}
      minWidth={handleFileBar ? 240 : 0}
      maxWidth={"30%"}
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleClasses={{ right: `${styles.handle}` }}
      onResizeStart={() => {
        defaultWidthLeft.current = widthLeft;
      }}
      onResize={(e, direction, ref, d) => {
        const nextWidth = defaultWidthLeft.current + d.width;
        setWidthLeft(nextWidth);
      }}
      // 배경색
      style={{ backgroundColor: "#24282e" }}
      className={handleFileBar ? "" : styles.hidden}
      onClick={() => {
        setSelectedNode(null);
      }}
    >
      <div {...getRootProps({ className: `${styles.dropzone}` })}>
        <input {...getInputProps()} />
        <div className={styles.app} style={{ width: widthLeft + "px" }}>
          <div
            className={styles.noBubble}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={styles.buttonWapper}>
              <div
                onClick={() => {
                  projectDownload(myPath);
                }}
              >
                <BsDownload />
              </div>
              <div onClick={handleOpenAll}>
                <BsArrowDownSquare />
              </div>
              <div onClick={handleCloseAll}>
                <BsArrowUpSquare />
              </div>
              <div
                onClick={() => {
                  handleOpen(selectedNode);
                  CreateFile();
                  dispatch(setInputFieldFocused());
                }}
                onBlur={() => {
                  dispatch(setInputFieldBlurred());
                }}
              >
                <BsFileEarmarkPlus />
              </div>
              <div
                onClick={() => {
                  handleOpen(selectedNode);
                  CreateFolder();
                  dispatch(setInputFieldFocused());
                }}
                onBlur={() => {
                  dispatch(setInputFieldBlurred());
                }}
              >
                <BsFolderPlus />
              </div>
            </div>
            <Tree
              ref={ref}
              tree={treeData}
              rootId={0}
              render={(node, { depth, isOpen, onToggle }) => (
                <CustomNodeAtom
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  isSelected={node.id === selectedNode?.id}
                  onToggle={onToggle}
                  onTextChange={handleTextChange}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                  lastCreated={lastCreated}
                  createSignal={createSignal}
                  getFilepathById={getFilepathById}
                />
              )}
              dragPreviewRender={(monitorProps) => (
                <CustomDragPreviewAtom monitorProps={monitorProps} />
              )}
              onDrop={handleDrop}
              classes={{
                root: styles.treeRoot,
                draggingSource: styles.draggingSource,
                dropTarget: styles.dropTarget,
              }}
            />
          </div>
          {isDragActive ? (
            <div className={styles.guideComment}>Upload</div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Resizable>
  );
}

export default FileTreeOrganism;
