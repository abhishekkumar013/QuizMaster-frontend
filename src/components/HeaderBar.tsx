"use client";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { RootState } from "@/store/slice";
import { getUserInitial } from "@/lib/UserInitial";
import BackButtonLogo from "./BackButton-Logo";
import Link from "next/link";
import { UserRoundCog } from "lucide-react";

const HeaderBar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 z-50 ">
      <div className="text-xl font-bold text-white">
        <BackButtonLogo />
      </div>

      <Link
        href={`/update-profile/${user.id}`}
        className="group w-auto px-4 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-md hover:scale-105 transition-transform duration-200 shadow-lg"
      >
        <UserRoundCog className="w-5 h-5 mr-2 group-hover:rotate-12 transition-all duration-200" />
        <span className="">{getUserInitial(user)}</span>
      </Link>
    </div>
  );
};
export default HeaderBar;
