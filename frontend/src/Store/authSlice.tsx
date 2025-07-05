import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ILoginResponse, IUserObj, IUserPermission } from "../services/types/auth";
import AppConfig from "../config/config";

interface IAuthSliceInitialState {
  isLoggedIn: boolean;
  triggerPostLogin: boolean;
  userObj: IUserObj | null;
  userPermissions: IUserPermission | null;
}

const initialState: IAuthSliceInitialState = {
  isLoggedIn: false,
  triggerPostLogin: false,
  userObj: null,
  userPermissions: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setTriggerPostLogin: (state, action: PayloadAction<boolean>) => {
      state.triggerPostLogin = action.payload;
    },
    setUserObj: (state, action: PayloadAction<IUserObj | null>) => {
      state.userObj = action.payload;
    },
    setUserPermissions: (state, action: PayloadAction<IUserPermission | null>) => {
      state.userPermissions = action.payload;
    },
    loggedInHandler: (state, action: PayloadAction<ILoginResponse>) => {
      // update local storage
  
      localStorage.setItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem(AppConfig.LOCAL_STORAGE_REFRESH_TOKEN_KEY, action.payload.refreshToken);

      state.isLoggedIn = true;
      state.userObj = action.payload.user;
      state.userPermissions = action.payload.permissions;
    },
    isLogout: (state) => {
      // Remove token from local storage

      localStorage.removeItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      localStorage.removeItem(AppConfig.LOCAL_STORAGE_REFRESH_TOKEN_KEY);

      //remove from local storage to free from overload
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      localStorage.removeItem("schoolId");
      localStorage.removeItem("userId");
localStorage.removeItem("studentId");
      //  localStorage.clear();
      // Reset state
      state.isLoggedIn = false;
      state.userObj = null;
      state.userPermissions = null;


    },

  },
});

export const { setIsLoggedIn, setTriggerPostLogin, setUserObj, setUserPermissions, loggedInHandler,isLogout } = authSlice.actions;

export default authSlice.reducer;
