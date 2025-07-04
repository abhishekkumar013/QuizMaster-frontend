// components/AuthGuard.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store/slices/authSlice";
import Loading from "@/components/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const publicRoutes = ["/", "/signin", "/signup", "/home"];

  useEffect(() => {
    if (!loading && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.replace("/signin");
    }
  }, [isAuthenticated, pathname, loading]);

  if (loading && !publicRoutes.includes(pathname)) {
    return <Loading />;
  }

  return children;
}
