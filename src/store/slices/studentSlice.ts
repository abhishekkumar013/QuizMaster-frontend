import axios from "@/lib/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

type StudentReportPayload = {
  reports: any[];
};

type StudentReportState = {
  allReport: any[];
  loading: boolean;
};
const initialState: StudentReportState = {
  allReport: [],
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
      state.allReport = [];
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

export const GetAllReports = () => async (dispatch: any) => {
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
