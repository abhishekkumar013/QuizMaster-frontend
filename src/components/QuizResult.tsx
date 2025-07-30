import React from "react";
import HeaderBar from "./HeaderBar";
import {
  Award,
  CheckCircle,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { ResultType } from "@/utlis/types";

const QuizResult = ({
  showReport,
  results,
  setShowReport,
}: {
  showReport: boolean;
  results: ResultType;
  setShowReport: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <HeaderBar />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mt-14 mx-auto">
          {!showReport ? (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    results.isPassed
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-orange-400 to-red-500"
                  }`}
                >
                  {results.isPassed ? (
                    <Award className="w-10 h-10 text-white" />
                  ) : (
                    <RotateCcw className="w-10 h-10 text-white" />
                  )}
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">
                  {results.isPassed ? "Congratulations!" : "Keep Learning!"}
                </h1>
                <p className="text-gray-300 mb-6">
                  {results.isPassed
                    ? "You have successfully completed the quiz"
                    : "You can retake the quiz to improve your score"}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {results.score}
                  </div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {results.percentage}%
                  </div>
                  <div className="text-sm text-gray-300">Percentage</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {results.questionsCorrect}
                  </div>
                  <div className="text-sm text-gray-300">Correct</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {results.questionsIncorrect}
                  </div>
                  <div className="text-sm text-gray-300">Incorrect</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowReport(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                >
                  View Detailed Report
                </button>
                <button
                  onClick={() => router.push("/home")}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Detailed Report
                </h2>
                <button
                  onClick={() => setShowReport(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Back to Summary
                </button>
              </div>

              <div className="space-y-6">
                {results.evaluation?.map((item, index) => (
                  <div
                    key={item.questionId}
                    className="bg-white/5 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Q{index + 1}. {item.questionText}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.skipped
                            ? "bg-yellow-500/20 text-yellow-400"
                            : item.isCorrect
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.skipped
                          ? "Skipped"
                          : item.isCorrect
                          ? "Correct"
                          : "Incorrect"}
                      </div>
                    </div>

                    {!item.skipped && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">
                            Your Answer:
                          </span>
                          <span
                            className={`${
                              item.isCorrect ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {item.selectedOptionText}
                          </span>
                        </div>
                        {!item.isCorrect && (
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">
                              Correct Answer:
                            </span>
                            <span className="text-green-400">
                              {item.correctOptionText}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {item.skipped && (
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">
                          Correct Answer:
                        </span>
                        <span className="text-green-400">
                          {item.correctOptionText}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizResult;
