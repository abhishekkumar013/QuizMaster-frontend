import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

type QuizPayload = {
  quiz: any[];
};

type QuizState = {
  publicQuiz: any[];
  privateQuiz: any[];
  protectedQuiz: any[];
  loading: boolean;
};

const initialState: QuizState = {
  publicQuiz: [],
  privateQuiz: [],
  protectedQuiz: [],
  loading: true,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,

  reducers: {
    setPublicQuiz(state, action: PayloadAction<QuizPayload>) {
      state.publicQuiz = action.payload.quiz;
      state.loading = false;
    },
    setPrivateQuiz(state, action: PayloadAction<QuizPayload>) {
      state.privateQuiz = action.payload.quiz;
      state.loading = false;
    },
    setProtectedQuiz(state, action: PayloadAction<QuizPayload>) {
      state.protectedQuiz = action.payload.quiz;
      state.loading = false;
    },
    setQuizesfailed(state) {
      state.publicQuiz = state.publicQuiz ? state.publicQuiz : [];
      state.privateQuiz = state.privateQuiz ? state.privateQuiz : [];
      state.protectedQuiz = state.protectedQuiz ? state.protectedQuiz : [];
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setPublicQuiz,
  setPrivateQuiz,
  setProtectedQuiz,
  setQuizesfailed,
  setLoading,
} = quizSlice.actions;

export default quizSlice.reducer;

export const GetPublicQuiz = () => async (dispatch: any) => {
  dispatch(setLoading(true));

  try {
    const res = await axios.get("/quiz/public");

    if (res.data.success) {
      dispatch(
        setPublicQuiz({
          quiz: res.data.data,
        })
      );
    } else {
      dispatch(setQuizesfailed());
    }
  } catch (error) {
    dispatch(setQuizesfailed());
  } finally {
    dispatch(setLoading(false));
  }
};
export const GetQuiz = () => async (dispatch: any) => {
  dispatch(setLoading(true));

  try {
    const res = await axios.get("/quiz/all-quiz");
    // console.log(res.data);
    if (res.data.success) {
      dispatch(
        setPublicQuiz({
          quiz: res.data.data.publicQuizzes,
        })
      );
      dispatch(
        setPrivateQuiz({
          quiz: res.data.data.assignedQuizzes,
        })
      );
    } else {
      dispatch(setQuizesfailed());
    }
  } catch (error) {
    dispatch(setQuizesfailed());
  } finally {
    dispatch(setLoading(false));
  }
};

export const GetTeacherQuiz = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get("/quiz/own-quiz");
    // console.log(res.data);

    if (res.data.success) {
      dispatch(setPublicQuiz({ quiz: res.data.data.publicQuizzes }));
      dispatch(setPrivateQuiz({ quiz: res.data.data.privateQuizzes }));
      dispatch(setProtectedQuiz({ quiz: res.data.data.protectedQuizzes }));
    } else {
      dispatch(setQuizesfailed());
    }
  } catch (error) {
    dispatch(setQuizesfailed());
  } finally {
    dispatch(setLoading(false));
  }
};
