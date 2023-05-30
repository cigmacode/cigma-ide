import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  userImage: null,
  teamName: null,
  projectName: null,
  serverPath: null,
  serverPort: null,
};

const defaultSettingSlice = createSlice({
  name: "defaultSetting",
  initialState,
  reducers: {
    setDefaultSetting: (
      state,
      {
        payload: {
          userId,
          userImage,
          teamName,
          projectName,
          serverPath,
          serverPort,
        },
      }
    ) => {
      state.userId = userId;
      state.userImage = userImage;
      state.teamName = teamName;
      state.projectName = projectName;
      state.serverPath = serverPath;
      state.serverPort = serverPort;
    },
  },
});

export const selectAllDefaultSetting = (state) => state.defaultSetting;

export const selectTeamName = (state) => state.defaultSetting.teamName;

export const selectProjectName = (state) => state.defaultSetting.projectName;

export const selectUserId = (state) => state.defaultSetting.userId;

export const selectUserImageBase64 = (state) => state.defaultSetting.userImage;

export const selectWsServerUrl = (state) => {
  if (state.defaultSetting.serverPath == null) {
    return null;
  }
  return `ws://${state.defaultSetting.serverPath}:${state.defaultSetting.serverPort}`;
};

export const { setDefaultSetting } = defaultSettingSlice.actions;

export default defaultSettingSlice.reducer;
