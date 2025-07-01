import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import quizReducer from "./slices/quizslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
