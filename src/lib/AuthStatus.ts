"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CheckLoginStatus } from "@/store/slices/authSlice";

export const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CheckLoginStatus());
  }, [dispatch]);

  return null;
};
