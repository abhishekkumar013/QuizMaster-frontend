import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import quizReducer from "./slices/quizslice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    category: categoryReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
