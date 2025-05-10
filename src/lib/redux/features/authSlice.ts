import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, deleteCookie } from "cookies-next";

interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
}

export interface IAuth {
  user: IUser;
  isLogin: boolean;
}

const initialState: IAuth = {
  user: {
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    avatar: "",
  },
  isLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onLogin: (state: IAuth, action: PayloadAction<IAuth>) => {
      state.user.email = action.payload.user.email;
      state.user.first_name = action.payload.user.first_name;
      state.user.last_name = action.payload.user.last_name;
      state.user.role = action.payload.user.role;
      state.user.avatar = action.payload.user.avatar ?? "";
      state.isLogin = true;
    },
    onLogout: (state: IAuth) => {
      state.user = {
        email: "",
        first_name: "",
        last_name: "",
        role: "",
        avatar: "",
      };
      state.isLogin = false;
      deleteCookie("access_token"); // opsional, untuk jaga-jaga
    },
  },
});

export const { onLogin, onLogout } = authSlice.actions;

export default authSlice.reducer;
