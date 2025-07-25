import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { AppDispatch } from "../slice";
import { SigninFormData, SignupFormData, UpdateFormData } from "@/utlis/types";

type AuthPayload = {
  user: any;
  token?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: object | null;
  token: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginSuccess(state, action: PayloadAction<AuthPayload>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.loading = false;
    },
    loginFailed(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    updateProfile(state, action: PayloadAction<AuthPayload>) {
      state.isAuthenticated = state.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token ?? state.token;
      state.loading = false;
    },
    updateProfileFailed(state) {
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
      state.token = state.token;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  loginSuccess,
  loginFailed,
  logout,
  updateProfile,
  updateProfileFailed,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;

export const CheckLoginStatus = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const res = await axios.get("/auth/user/isauthenticated");
    // console.log("CheckLoginStatus Response:", res);

    if (res.data.success) {
      const { token, ...userWithoutToken } = res.data.data;
      console.log(userWithoutToken);
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
  } finally {
    dispatch(setLoading(false));
  }
};

export const SingUp =
  (formData: SignupFormData) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post("/auth/users/signup", formData);
      return res.data;
    } catch (error) {
      // console.error("Error during signup:", error);
      return error.response?.data || null;
    }
  };

export const Login =
  (formData: SigninFormData) => async (dispatch: AppDispatch) => {
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
      // console.error("Error during login:", error.response?.data);
      dispatch(loginFailed());
      return error.response?.data || null;
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    const res = await axios.post("/auth/users/signout");

    console.log(res);
    if (res.data.success) {
      dispatch(logout());
    }
    return res.data;
  } catch (error) {
    return error.response?.data || null;
  }
};

export const switchAccont =
  (formData: any) => async (dispatch: AppDispatch) => {
    try {
      const res = await axios.post("/auth/users/switch-role", formData);
      console.log("Switch Account Response:", res);

      if (res.data.success) {
        const user = res.data.data;

        dispatch(
          updateProfile({
            user: user,
          })
        );
        return res.data;
      } else {
        dispatch(updateProfileFailed());
        return null;
      }
    } catch (error) {
      dispatch(updateProfileFailed());
      return error.response?.data || null;
    }
  };

export const UpdateUser =
  (formData: UpdateFormData) => async (dispatch: AppDispatch) => {
    try {
      console.log(formData.id);
      const res = await axios.put(
        `/auth/users/update/${formData.id}`,
        formData
      );
      // console.log("R", res);
      if (res.data.success) {
        const user = res.data.data;

        dispatch(
          updateProfile({
            user: user,
          })
        );
        return res.data;
      } else {
        dispatch(updateProfileFailed());
        return null;
      }
    } catch (error) {
      console.log("Error ->", error.response);
      dispatch(updateProfileFailed());
      return error.response?.data || null;
    }
  };
