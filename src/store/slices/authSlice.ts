import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

type AuthPayload = {
  user: any;
  token?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: object | null;
  token: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginSuccess(state, action: PayloadAction<AuthPayload>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
    },
    loginFailed(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    updateProfile(state, action: PayloadAction<AuthPayload>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token ?? state.token;
    },
  },
});

export const { loginSuccess, loginFailed, logout, updateProfile } =
  authSlice.actions;

export default authSlice.reducer;

export const CheckLoginStatus = () => async (dispatch: any) => {
  try {
    const res = await axios.get("/auth/user/isauthenticated");

    if (res.data.success) {
      const { token, ...userWithoutToken } = res.data.data;

      dispatch(
        loginSuccess({
          user: userWithoutToken,
          token: token,
        })
      );
    } else {
      dispatch(loginFailed());
    }
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const SingUp = (formData: any) => async (dispatch: any) => {
  try {
    const res = await axios.post("/auth/users/signup", formData);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const Login = (formData: any) => async (dispatch: any) => {
  try {
    const res = await axios.post("/auth/users/signin", formData);

    if (res.data.success) {
      const { token, ...userWithoutToken } = res.data.data;

      dispatch(
        loginSuccess({
          user: userWithoutToken,
          token: token,
        })
      );
      return res.data;
    } else {
      dispatch(loginFailed());
      return null;
    }
  } catch (error) {
    dispatch(loginFailed());
    return null;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const res = await axios.post("/auth/users/signout");

    console.log(res);
    if (res.data.success) {
      dispatch(logout());
    }
    return res.data;
  } catch (error) {
    return null;
  }
};
