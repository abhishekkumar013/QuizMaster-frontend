import { Calendar, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

export const StudentReportCard = ({ result, onClick }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "HARD":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getRankColor = (rank) => {
    if (rank <= 3) return "text-green-400";
    if (rank <= 10) return "text-yellow-400";
    if (rank <= 20) return "text-orange-400";
    return "text-red-400";
  };

  // Format time taken from seconds to minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get status based on isPassed
  const getStatusBadge = (isPassed) => {
    return isPassed ? (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        Passed
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
        Failed
      </span>
    );
  };

  return (
    <div className="group relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {result.quiz.title}
          </h3>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                result.quiz.difficulty
              )}`}
            >
              {result.quiz.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {result.quiz.category.name}
            </span>
            {getStatusBadge(result.isPassed)}
          </div>
        </div>
        <div
          onClick={() => onClick(result.id)}
          className="flex items-center text-white/60 group-hover:text-cyan-400 transition-colors"
        >
          <span>Details</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Score and Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div
            className={`text-3xl font-bold ${getScoreColor(result.percentage)}`}
          >
            {result.percentage.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-400">Score</div>
        </div>
        <div className="text-center">
          <div
            className={`text-3xl font-bold ${getRankColor(result.rank || 1)}`}
          >
            #{result.rank || 1}
          </div>
          <div className="text-sm text-gray-400">Rank</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>
            {result.questionsCorrect}/{result.questionsAttempted}
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="text-center">
          <div className="text-green-400 font-semibold">
            {result.questionsCorrect}
          </div>
          <div className="text-gray-400">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 font-semibold">
            {result.questionsIncorrect}
          </div>
          <div className="text-gray-400">Incorrect</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatTime(result.timeTaken)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
