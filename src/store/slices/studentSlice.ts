import axios from "@/lib/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "../slice";
import { AllReportResponse } from "@/utlis/types";

type StudentReportPayload = {
  reports: AllReportResponse;
};

type StudentReportState = {
  allReport: AllReportResponse;
  loading: boolean;
};
const initialState: StudentReportState = {
  allReport: null,
  loading: true,
};

const studentReportSlice = createSlice({
  name: "studentreport",
  initialState,

  reducers: {
    setAllReport(state, action: PayloadAction<StudentReportPayload>) {
      state.allReport = action.payload.reports;
      state.loading = false;
    },
    setReportFailed(state) {
      state.allReport = {
        rank: 0,
        points: 0,
        results: [],
      };
      state.loading = false;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});
export const { setAllReport, setReportFailed, setLoading } =
  studentReportSlice.actions;

export default studentReportSlice.reducer;

export const GetAllReports = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get("/result/all");
    // console.log(res.data);

    if (res.data.success) {
      dispatch(setAllReport({ reports: res.data.data }));
    } else {
      dispatch(setReportFailed());
    }
  } catch (error) {
    toast.error(error.response.data.message || "Error in Report Fetching");
  } finally {
    dispatch(setLoading(false));
  }
};
