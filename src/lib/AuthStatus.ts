"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CheckLoginStatus } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/slice";

export const AppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(CheckLoginStatus());
  }, [dispatch]);

  return null;
};
