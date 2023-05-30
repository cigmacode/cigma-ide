import express from "express";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileWs } from "./server.js";
import * as chokidar from "chokidar";

const router = express.Router();
const __dirname = path.resolve();
const ROOT_FOLDER = "../../workspace/project";

const watcher = chokidar.watch(ROOT_FOLDER, {
  persistent: true,
  awaitWriteFinish: true,
});
watcher.on("all", () => {
  fileWs.clients.forEach((client) => {
    client.send("treeRefresh");
  });
});
//루트폴더가 없을경우 생성
function createRootFolderIfNotExists() {
  const currentDir = decodeURIComponent(
    path.dirname(new URL(import.meta.url).pathname)
  ); // 현재 파일이 있는 디렉토리 경로

  const isWindows = process.platform === "win32";
  const absoluteRootFolder = path.resolve(
    isWindows ? currentDir.slice(1) : currentDir,
    ROOT_FOLDER
  );

  if (!fs.existsSync(absoluteRootFolder)) {
    fs.mkdirSync(absoluteRootFolder, { recursive: true });
    console.log("Root folder created:", absoluteRootFolder);
  }
}

createRootFolderIfNotExists();

// 파일 목록 받기
router.get("/", (req, res) => {
  const result = [];

  function traverseDir(currentPath, parentFolder) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // 디렉토리인 경우 재귀적으로 탐색
        const folder = {
          id: result.length + 1,
          parent: parentFolder,
          droppable: true,
          text: file,
        };
        result.push(folder);
        traverseDir(fullPath, folder.id);
      } else {
        // 파일인 경우 현재 폴더에 추가
        const ext = path.extname(file);
        const data = {
          fileType: ext.slice(1),
          fileSize: `${(stats.size / 1024 / 1024).toFixed(1)}MB`,
        };
        const fileObj = {
          id: result.length + 1,
          parent: parentFolder,
          droppable: false,
          text: file,
          data: data,
        };
        result.push(fileObj);
      }
    }
  }

  traverseDir(ROOT_FOLDER, 0);

  res.json(result);
});

// 파일 데이터 받기
router.post("/file/data", (req, res) => {
  const { path: filePath } = req.body;

  const data = fs.readFileSync(
    path.join(__dirname, ROOT_FOLDER + filePath),
    "utf-8"
  );
  res.send(data.toString());
});

// 파일 수정 저장
router.put("/file/data", (req, res) => {
  const { path: filePath, data: fileData } = req.body;
  const fullPath = path.join(ROOT_FOLDER, filePath);

  fs.writeFile(fullPath, fileData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "File saved successfully" });
    }
  });
});

// 파일 생성
router.post("/file", (req, res) => {
  const { name, path: filePath } = req.body;
  const fullPath = path.join(ROOT_FOLDER, filePath, name);

  fs.writeFile(fullPath, "", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "File created successfully" });
    }
  });
});

// 폴더 생성
router.post("/folder", (req, res) => {
  const { name, path: folderPath } = req.body;
  const fullPath = path.join(ROOT_FOLDER, folderPath, name);

  fs.mkdir(fullPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "Folder created successfully" });
    }
  });
});

// 파일 삭제
router.delete("/", (req, res) => {
  const { name, path: filePath } = req.query;
  const fullPath = path.join(ROOT_FOLDER, filePath, name);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "File deleted successfully" });
    }
  });
});

// 폴더 삭제
router.delete("/rmdir", (req, res) => {
  const { name, path: filePath } = req.query;
  const fullPath = path.join(ROOT_FOLDER, filePath, name);

  function removeDir(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file) => {
        const curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          removeDir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }

  try {
    removeDir(fullPath);
    res.json({ message: "Folder deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// 파일/폴더 이름 변경
router.put("/", (req, res) => {
  const { oldName, newName, path: filePath } = req.body;
  const oldPath = path.join(ROOT_FOLDER, filePath, oldName);
  const newPath = path.join(ROOT_FOLDER, filePath, newName);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "File/Folder name changed successfully" });
    }
  });
});

// 파일/폴더 위치 이동
router.put("/move", (req, res) => {
  const { name, path: filePath, destination } = req.body;
  const sourcePath = path.join(ROOT_FOLDER, filePath, name);
  const destinationPath = path.join(ROOT_FOLDER, destination, name);

  fs.rename(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "File/Folder moved successfully" });
    }
  });
});

//업로드
router.post("/upload", (req, res) => {
  // 드롭존에서 전달된 파일 가져오기
  const file = req.files.file;
  // 디코딩된 파일명 얻기
  const decodedFilePath = decodeURIComponent(req.body.path);
  // 저장할 경로 설정
  const uploadPath = path.join(ROOT_FOLDER, decodedFilePath);

  //폴더경로가 전달되었을 경우, 해당 경로에 맞춰 폴더 생성
  const folderPath = path.dirname(uploadPath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // 파일 업로드
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("File upload failed");
    } else {
      res.json({ message: "File uploaded successfully" });
    }
  });
});

//압축 후 반환
router.get("/download", (req, res) => {
  // 압축 파일 생성
  const archive = archiver("zip", { zlib: { level: 9 } });

  // HTTP 응답 설정
  res.attachment("project.zip");
  archive.pipe(res);

  archive.on("error", (error) => {
    console.error("Error creating archive:", error);
    res.status(500).send("Error creating archive");
  });

  archive.directory(ROOT_FOLDER, false); // 폴더를 압축에 추가
  archive.finalize();
});

export default router;
