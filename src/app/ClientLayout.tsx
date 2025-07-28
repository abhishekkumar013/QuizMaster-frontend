"use client";

import { Provider } from "react-redux";
import { store } from "@/store/slice";
import { ToastContainer } from "react-toastify";
import { AppInitializer } from "@/lib/AuthStatus";
import AuthGuard from "@/lib/AuthGuard";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { generateToken, listenToMessages } from "@/lib/Notification";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   generateToken();
  //   listenToMessages();
  // }, []);

  return (
    <Provider store={store}>
      <AppInitializer />
      <AuthGuard>{children}</AuthGuard>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </Provider>
  );
}
