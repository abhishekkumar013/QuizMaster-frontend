import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

type CategoryPayload = {
  category: any[];
};

type CategoryState = {
  category: any[];
  loading: boolean;
};

const initialState: CategoryState = {
  category: [],
  loading: true,
};

const categorySlice = createSlice({
  name: "category",
  initialState,

  reducers: {
    setCategory(state, action: PayloadAction<CategoryPayload>) {
      state.category = action.payload.category;
      state.loading = false;
    },
    setCategooryfailed(state) {
      state.category = state.category ? state.category : [];
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setCategooryfailed, setCategory, setLoading } =
  categorySlice.actions;

export default categorySlice.reducer;

export const GetCategory = () => async (dispatch: any) => {
  dispatch(setLoading(true));

  try {
    const res = await axios.get("/category/all");

    if (res.data.success) {
      dispatch(setCategory({ category: res.data.data }));
    } else {
      dispatch(setCategooryfailed());
    }
  } catch (error) {
    dispatch(setCategooryfailed());
  } finally {
    dispatch(setLoading(false));
  }
};
