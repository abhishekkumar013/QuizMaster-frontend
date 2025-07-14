"use client";

import GlitchText from "@/components/GlitchText";

const ErrorPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <GlitchText
        speed={1}
        enableShadows={true}
        enableOnHover={true}
        className="text-xl font-bold text-white"
      >
        Page Not Found!
      </GlitchText>
    </div>
  );
};

export default ErrorPage;
