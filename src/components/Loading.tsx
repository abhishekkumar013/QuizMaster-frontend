import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
        <p className="text-xl text-white">Loading ...</p>
      </div>
    </div>
  );
};

export default Loading;
