"use client";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Logo from "./Logo";
import { useRouter } from "next/navigation";

const BackButtonLogo = () => {
  const router = useRouter();
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <Logo />
    </div>
  );
};

export default BackButtonLogo;
