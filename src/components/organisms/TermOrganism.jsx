import React, { useState, useEffect, useRef } from "react";
import { XTerm } from "../../library/xterm-for-react";
import styles from "../../styles/organisms/TermOrganism.module.scss";
import { Resizable } from "re-resizable";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTermVisible,
  setInputFieldBlurred,
  setInputFieldFocused,
} from "../../store/toolSlice";
import useTermWs from "../../hooks/useTermWs";
import { selectFitAddon, selectSocket } from "../../store/termSlice";

const TermOrganism = ({ widthRight, setWidthRight, defaultWidthRight }) => {
  const socket = useSelector(selectSocket);
  const xtermRef = useRef(null);
  const handleTerm = useSelector(selectTermVisible);
  const onData = useTermWs(socket);
  const dispatch = useDispatch();
  const fitAddon = useSelector(selectFitAddon);

  useEffect(() => {
    xtermRef.current.terminal.cursorBlink = true;
    const { cols, rows } = fitAddon.proposeDimensions();
    xtermRef.current.terminal.resize(cols, rows);
    // socket.send(
    //   JSON.stringify({ type: "resize", data: fitAddon.proposeDimensions() })
    // );
    socket.onmessage = (e) => {
      xtermRef.current.terminal.write(e.data);
    };
  }, [socket]);
  return (
    <Resizable
      onClick={() => dispatch(setInputFieldFocused())}
      onBlur={() => dispatch(setInputFieldBlurred())}
      size={{ width: widthRight, height: "100%" }}
      minWidth={handleTerm ? 240 : 0}
      maxWidth={"35%"}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStart={() => {
        defaultWidthRight.current = widthRight;
      }}
      onResize={(e, direction, ref, d) => {
        const nextWidth = defaultWidthRight.current + d.width;
        const { cols, rows } = fitAddon.proposeDimensions();
        xtermRef.current.terminal.resize(cols, rows);
        socket.send(
          JSON.stringify({ type: "resize", data: fitAddon.proposeDimensions() })
        );
        setWidthRight(nextWidth);
      }}
      className={handleTerm ? "" : styles.hidden}
      style={{ marginLeft: 3, overflow: "hidden", height: "100%" }}
    >
      <XTerm
        ref={xtermRef}
        onData={onData}
        addons={[fitAddon]}
        className={styles.xterm}
      />
    </Resizable>
  );
};

export default TermOrganism;
