import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

type ChidrenPayload = {
  childrens: any[];
};

type ParentState = {
  childrens: any[];
  loading: boolean;
};

const initialState: ParentState = {
  childrens: [],
  loading: true,
};

const parentSlice = createSlice({
  name: "parent",
  initialState,

  reducers: {
    setChildren(state, action: PayloadAction<ChidrenPayload>) {
      state.childrens = action.payload.childrens;
      state.loading = false;
    },
    setChildrenfailed(state) {
      state.childrens = state.childrens ? state.childrens : [];
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setChildren, setChildrenfailed, setLoading } =
  parentSlice.actions;

export default parentSlice.reducer;

export const GetChildrens = () => async (dispatch: any) => {
  dispatch(setLoading(true));

  try {
    const res = await axios.get("/auth/users/get-childrens");
    console.log(res.data.data);

    if (res.data.success) {
      dispatch(setChildren({ childrens: res.data.data }));
    } else {
      dispatch(setChildrenfailed());
    }
  } catch (error) {
    dispatch(setChildrenfailed());
  } finally {
    dispatch(setLoading(false));
  }
};
