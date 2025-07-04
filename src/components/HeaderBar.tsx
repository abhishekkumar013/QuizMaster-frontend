"use client";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { RootState } from "@/store/slice";
import { getUserInitial } from "@/lib/UserInitial";

const HeaderBar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 z-50 ">
      <div className="text-xl font-bold text-white">
        <Logo />
      </div>
      <a href="/profile">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {getUserInitial(user)}
        </div>
      </a>
    </div>
  );
};
export default HeaderBar;
