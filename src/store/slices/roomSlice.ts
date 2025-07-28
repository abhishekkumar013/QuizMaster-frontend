import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { AppDispatch } from "../slice";
import { RoomType } from "@/utlis/types";

type RoomPayload = {
  room: RoomType[];
};

type RoomState = {
    rooms: RoomType[];
    loading: boolean;
  };
  
const initialState: RoomState = {
    rooms: [],
    loading: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,

  reducers: {
    setRoom(state,action:PayloadAction<RoomPayload>){
        state.rooms=action.payload.room
        state.loading=false
    },
    setRoomFailed(state){
        state.rooms=[]
    },
    setLoading(state,action){
        state.loading=action.payload
    }
  },
});

export const {
  setRoom,
  setRoomFailed,
  setLoading
} = roomSlice.actions;

export default roomSlice.reducer;

export const GetRoom = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const res = await axios.get("/room/get-all");
    console.log("res pub", res.data);
    if (res.data.success) {
      dispatch(
        setRoom({
          room: res.data.data,
        })
      );
    } else {
      dispatch(setRoomFailed());
    }
  } catch (error) {
    dispatch(setRoomFailed());
  } finally {
    dispatch(setLoading(false));
  }
};

