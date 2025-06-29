// app/ClientLayout.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store/slice";
import { ToastContainer } from "react-toastify";
import { AppInitializer } from "@/lib/AuthStatus";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AppInitializer />
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Provider>
  );
}
