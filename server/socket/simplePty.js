import pty from "node-pty";
import path from "path";
import os from "os";

const __dirname = path.resolve();

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export const setupPty = (conn, req) => {
  const term = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 24,
    rows: 30,
    cwd: "../../workspace/project",
  });

  term.onData((data) => {
    conn.send(data);
  });

  conn.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    const data = msg.data;
    switch (msg.type) {
      case "message":
        if (data == "SIGINT") {
          term.write("\x03");
        } else if (data == "SIGTSTP") {
          term.write("\x1a");
        } else {
          term.write(data);
        }
        break;
      case "resize":
        term.resize(data.cols, data.rows);
    }
  };

  conn.on("disconnect", () => {
    term.kill();
    console.log("term is killed!!");
  });
};
