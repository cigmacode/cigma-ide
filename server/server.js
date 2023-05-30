import express from "express";
import path from "path";
import { parse } from "url";
import { WebSocketServer } from "ws";
import http from "http";
import cors from "cors";
import router from "./fsRoute.js";
import fileUpload from "express-fileupload";
import { setupWSConnection } from "./socket/utils.js";
import { setupPty } from "./socket/simplePty.js";

const __dirname = path.resolve();

// file server

const app = express();
// SET CORS
app.use(cors());
const server = http.createServer(app);

//file upload
app.use(fileUpload());

// =====================================================
// webSocket server
const port = process.env.PORT || 5000;
// @ts-ignore
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", setupWSConnection);

// websocket server end ==================================

// term websocket server =================================
const termWs = new WebSocketServer({ noServer: true });

termWs.on("connection", setupPty);

// term websocket server end =============================

// file websocket server =================================
export const fileWs = new WebSocketServer({ noServer: true });
fileWs.on("connection", (conn) => {
  conn.on("disconnect", () => {
    console.log("fileWs stopped");
  });
});

server.on("upgrade", (request, socket, head) => {
  const { pathname } = parse(request.url);

  if (pathname === "/workspace") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else if (pathname === "/terminal") {
    termWs.handleUpgrade(request, socket, head, (ws) => {
      termWs.emit("connection", ws, request);
    });
  } else if (pathname === "/fileExplorer") {
    fileWs.handleUpgrade(request, socket, head, (ws) => {
      fileWs.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router
app.use("/api", router);

server.listen(port);
console.log("Signaling server running on localhost:", port);

//=======================================================================

// main ide page ==========================================

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
