import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import themeSettingSlice from "./themeSettingSlice";
import sidebarSlice from "./sidebarSlice";
import authSlice from "./authSlice";

const store = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      themeSetting: themeSettingSlice,
      sidebarSlice: sidebarSlice,
    },
  });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export type AppDispatch = AppStore["dispatch"];

export default store();
