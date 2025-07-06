"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store/slices/authSlice";
import Loading from "@/components/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );

  const publicRoutes = ["/", "/signin", "/signup", "/home"];
  const teacherRoutes = [
    "/teacher/create-quiz",
    "/teacher/update-quiz",
    "/update-profile",
    "/teacher/quiz-report",
  ];
  const studentRoutes = ["/quiz/test", "/update-profile"];

  useEffect(() => {
    if (!loading && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.replace("/signin");
    }

    const isTeacherRoute = teacherRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (
      !loading &&
      isAuthenticated &&
      user.role === "TEACHER" &&
      !publicRoutes.includes(pathname) &&
      !isTeacherRoute
    ) {
      router.replace("/home");
    }

    const isStudntRoute = studentRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (
      !loading &&
      isAuthenticated &&
      user.role === "STUDENT" &&
      !publicRoutes.includes(pathname) &&
      !isStudntRoute
    ) {
      router.replace("/home");
    }
  }, [isAuthenticated, pathname, loading, user]);

  if (loading && !publicRoutes.includes(pathname)) {
    return <Loading />;
  }

  return children;
}
