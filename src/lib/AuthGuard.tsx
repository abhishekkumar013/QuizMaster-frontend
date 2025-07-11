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
  const studentRoutes = ["/quiz/test", "/update-profile", "/student"];
  const parentRoutes = ["/parent/home"];

  const isPublicRoute = publicRoutes.some(
    (route) => route === pathname || pathname.startsWith(route + "/")
  );

  const isTeacherRoute = teacherRoutes.some(
    (route) => route === pathname || pathname.startsWith(route + "/")
  );
  const isStudentRoute = studentRoutes.some(
    (route) => route === pathname || pathname.startsWith(route + "/")
  );
  const isParentRoutes = parentRoutes.some(
    (route) => route === pathname || pathname.startsWith(route + "/")
  );

  useEffect(() => {
    if (
      isAuthenticated &&
      user.role === "PARENT" &&
      pathname === "/home" &&
      !isParentRoutes
    ) {
      router.replace("/parent/home");
      return;
    }

    if (!loading && !isAuthenticated && !isPublicRoute) {
      router.replace("/signin");
      return;
    }

    if (
      !loading &&
      isAuthenticated &&
      user.role === "TEACHER" &&
      !isPublicRoute &&
      !isTeacherRoute
    ) {
      router.replace("/home");
      return;
    }

    if (
      !loading &&
      isAuthenticated &&
      user.role === "STUDENT" &&
      !isPublicRoute &&
      !isStudentRoute
    ) {
      router.replace("/home");
      return;
    }

    if (
      !loading &&
      isAuthenticated &&
      user.role === "PARENT" &&
      !isPublicRoute &&
      !isParentRoutes &&
      pathname === "/home"
    ) {
      router.replace("/parent/home");
      return;
    }
  }, [isAuthenticated, pathname, loading, user]);

  if (loading && !isPublicRoute) {
    return <Loading />;
  }

  // Don't render children if unauthenticated and route is not public
  if (!loading && !isAuthenticated && !isPublicRoute) {
    return null;
  }

  return children;
}
