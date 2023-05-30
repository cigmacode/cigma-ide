import { saveAs } from "file-saver";
import createApi from "./instance";

export const fileTreeUpdate = async (myPath) => {
  const api = createApi({ path: myPath });
  console.log("myPath", myPath);
  try {
    const response = await api.get("");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("fileTreeUpdate error", error);
  }
};

export const fileTextUpdate = async (data, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.put("", data);
  } catch (error) {
    console.error("fileTextUpdate error", error);
  }
};

export const deleteFolder = async (name, filepath, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.delete(`/rmdir?name=${name}&path=${filepath}`);
    return {
      status: response.status,
    };
  } catch (error) {
    console.error("deleteFolder error", error);
  }
};

export const deleteFile = async (name, filepath, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.delete(`?name=${name}&path=${filepath}`);
    return {
      status: response.status,
    };
  } catch (error) {
    console.error("deleteFile error", error);
  }
};

// 프로젝트 파일 다운로드
export const projectDownload = async (myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.get("/download", {
      responseType: "blob",
    });
    const blob = new Blob([response.data]); // Blob 객체 생성
    saveAs(blob, "project.zip"); // 압축 파일 다운로드
  } catch (error) {
    console.error("Error downloading archive", error);
  }
};

// 파일 업데이트
export const fileUpdate = async (formData, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.post("/upload", formData);
  } catch (error) {
    console.error("fileUpdate error", error);
  }
};

export const fileMoveUpdate = async (name, path, destination, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.put("/move", {
      name,
      path,
      destination,
    });
    return {
      status: response.status,
    };
  } catch (error) {
    console.error("fileMoveUpdate error", error);
  }
};

// express 관련
export const expressFolder = async (name, path, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.post("/folder", { name, path });
    console.log(response.data.message);
  } catch (error) {
    console.error("expressFolder error", error);
  }
};

export const expressFile = async (name, path, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.post("/file", { name, path });
    console.log(response.data.message);
  } catch (error) {
    console.error("expressFile error", error);
  }
};

// 모나코에 넣을 내용 불러오기
export const loadFileContent = async (path, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const ext = path.split(".").pop().toLowerCase();
    const response = await api.post("/file/data", { path });

    if (ext == "json") {
      return {
        data: JSON.stringify(response.data, null, "\t"),
      };
    }
    return {
      data: response.data,
    };
  } catch (error) {
    console.error("loadFileContent error", error);
  }
};

// 파일 내용 수정 저장
export const saveFileContent = async (path, data, myPath) => {
  const api = createApi({ path: myPath });
  try {
    const response = await api.put("/file/data", {
      path: path,
      data: data,
    });
    return {
      status: response.status,
    };
  } catch (error) {
    console.error("saveFileContent error", error);
  }
};
