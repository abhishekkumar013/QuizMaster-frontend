import {
  formatTime,
  formatDate,
  Quiz,
  getDifficultyColor,
  isQuizActive,
} from "@/lib/Common-Function";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Lock,
  Play,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

export const QuizCard = ({
  quiz,
  isPrivate = false,
}: {
  quiz: Quiz;
  isPrivate?: boolean;
}) => {
  const isActive = isQuizActive(quiz.startTime, quiz.endTime);

  return (
    <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {isPrivate ? (
            <Lock className="w-5 h-5 text-purple-400" />
          ) : (
            <Globe className="w-5 h-5 text-blue-400" />
          )}
          <span className="text-sm text-gray-400">
            {isPrivate ? "Private Quiz" : "Public Quiz"}
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
            quiz.difficulty
          )}`}
        >
          {quiz.difficulty}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300">
        {quiz.title}
      </h3>

      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {quiz.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{quiz.category.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span>{quiz.totalMarks} marks</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{quiz.durationInMinutes} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>
              {quiz.maxAttempts} attempt{quiz.maxAttempts !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(quiz.startTime)}</span>
          </div>
          <span className="text-xs">
            {formatTime(quiz.startTime)} - {formatTime(quiz.endTime)}
          </span>
        </div>

        <div className="text-sm text-gray-400">
          <span>Created by: </span>
          <span className="text-purple-400 font-medium">
            {quiz.createdBy.name}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-2 text-sm ${
            isActive ? "text-green-400" : "text-red-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          <span>{isActive ? "Live Now" : "Not Active"}</span>
        </div>

        <Link
          href={`/quiz/${quiz.title.toLowerCase().replace(/\s+/g, "-")}/${
            quiz.id
          }`}
          className={`group/btn flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
              : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isActive) {
              e.preventDefault();
            }
          }}
        >
          <Play className="w-4 h-4" />
          <span>Start Quiz</span>
          {isActive && (
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          )}
        </Link>
      </div>
    </div>
  );
};
