const useTermWs = (socket) => {
  const terminalState = {
    input: "",
  };

  const setJson = (type, data) => {
    return JSON.stringify({
      type: type,
      data: data,
    });
  };

  const setTerminalState = (data) => {
    terminalState.input = data.input;
  };
  const onData = (data) => {
    const code = data.charCodeAt(0);

    // ctrl + c
    if (code === 3) {
      socket.send(setJson("message", "SIGINT"));
      return;
    }

    // ctrl + z
    if (code === 26) {
      socket.send(setJson("message", "SIGTSTP"));
      return;
    }

    // backspace
    if (code === 127) {
      socket.send(setJson("message", "\b"));
      return;
    }

    // esc key
    if (code === 27 && data.length === 1) {
      socket.send(setJson("message", "\x1B"));
      return;
    }

    // up key
    if (code === 27 && data.includes("[A")) {
      socket.send(setJson("message", "\x1b[A"));
      return;
    }

    // down key
    if (code === 27 && data.includes("[B")) {
      socket.send(setJson("message", "\x1b[B"));
      return;
    }

    // right key
    if (code === 27 && data.includes("[C")) {
      socket.send(setJson("message", "\x1b[C"));
      return;
    }

    // left key
    if (code === 27 && data.includes("[D")) {
      socket.send(setJson("message", "\x1b[D"));
      return;
    }

    // vi up key
    if (code === 27 && data.includes("OA")) {
      socket.send(setJson("message", "\x1bOA"));
      return;
    }

    // vi down key
    if (code === 27 && data.includes("OB")) {
      socket.send(setJson("message", "\x1bOB"));
      return;
    }

    // vi right key
    if (code === 27 && data.includes("OC")) {
      socket.send(setJson("message", "\x1bOC"));
      return;
    }

    // vi left key
    if (code === 27 && data.includes("OD")) {
      socket.send(setJson("message", "\x1bOD"));
      return;
    }

    // tab
    if (code === 9) {
      socket.send(setJson("message", "\t"));
      return;
    }

    // enter
    if (code === 13) {
      if (terminalState.input === "exit") {
        socket.close();
        window.location.pathname = "/";
        return;
      }
      socket.send(setJson("message", "\r"));

      setTerminalState({ input: "" });
    } else if (code < 32) {
      return;
    } else {
      socket.send(setJson("message", data));
    }
  };

  return onData;
};

export default useTermWs;
