import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quizReducer from "./slices/quizSlice";
import categoryReducer from "./slices/categorySlice";
import parentRoutes from "./slices/parentSlice";
import studentReportRoutes from "./slices/studentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    category: categoryReducer,
    parent: parentRoutes,
    studentreport: studentReportRoutes,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
