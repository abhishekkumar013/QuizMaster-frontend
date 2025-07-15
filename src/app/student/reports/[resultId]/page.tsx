"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Target,
  BookOpen,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/slice";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

const DetailReportPage = () => {
  const params = useParams();
  const router = useRouter();
  const resultId = params.resultId;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/result/single/${resultId}`);
      // console.log("R", res);
      if (res.data.success) {
        setResult(res.data.data.results);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <p className="text-gray-300">Unable to load the quiz results.</p>
        </div>
      </div>
    );
  }
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/20 text-green-400";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400";
      case "HARD":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getQuestionStatus = (question, userAnswer) => {
    if (!userAnswer) return "skipped";
    return userAnswer.isCorrect ? "correct" : "incorrect";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "incorrect":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "skipped":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "correct":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "incorrect":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "skipped":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Create a map of answers for quick lookup
  const answerMap = {};
  result.session?.answers?.forEach((answer) => {
    answerMap[answer.questionId] = answer;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Results</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Detailed Report
              </span>
            </h1>
            <p className="text-gray-300">{result?.quiz?.title}</p>
          </div>

          <div className="w-32"></div>
        </div>

        {/* Quiz Summary Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {result?.percentage.toFixed(2)}%
              </h3>
              <p className="text-gray-300">Final Score</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {result?.score}/{result?.totalMarks}
              </h3>
              <p className="text-gray-300">Points Earned</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {formatDuration(result?.timeTaken)}
              </h3>
              <p className="text-gray-300">Time Taken</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {result?.questionsAttempted}
              </h3>
              <p className="text-gray-300">Questions</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span>
                Category:{" "}
                <span className="text-white font-semibold">
                  {result?.quiz?.category?.name}
                </span>
              </span>
              <span>•</span>
              <span>
                Difficulty:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    result?.quiz?.difficulty
                  )}`}
                >
                  {result?.quiz?.difficulty}
                </span>
              </span>
              <span>•</span>
              <span>
                Created by:{" "}
                <span className="text-white font-semibold">
                  {result?.quiz?.createdBy?.user?.name}
                </span>
              </span>
              <span>•</span>
              <span>
                Submitted:{" "}
                <span className="text-white font-semibold">
                  {formatDate(result?.submittedAt)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-500/10 backdrop-blur-md rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-400">
                Correct Answers
              </h3>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {result?.questionsCorrect}
            </p>
          </div>

          <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-red-400">
                Incorrect Answers
              </h3>
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {result?.questionsIncorrect}
            </p>
          </div>

          <div className="bg-yellow-500/10 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-yellow-400">
                Skipped Questions
              </h3>
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {result?.questionsSkipped}
            </p>
          </div>
        </div>

        {/* Questions Detail */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Question-wise Analysis
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Correct</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Incorrect</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">Skipped</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result?.quiz?.questions?.map((question, index) => {
              const userAnswer = answerMap[question.id];
              const status = getQuestionStatus(question, userAnswer);
              const correctOption = question?.options?.find(
                (opt) => opt?.isCorrect
              );

              return (
                <div
                  key={question?.id}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-sm font-medium text-gray-400">
                          Question {index + 1}
                        </span>
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          <span className="capitalize">{status}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          ({question?.marks} mark
                          {question?.marks > 1 ? "s" : ""})
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white leading-relaxed">
                        {question?.text}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {question?.options?.map((option) => {
                      const isSelected = userAnswer?.optionId === option?.id;
                      const isCorrect = option?.isCorrect;

                      let optionStyle =
                        "bg-white/5 border-white/10 text-gray-300";

                      if (isSelected && isCorrect) {
                        optionStyle =
                          "bg-green-500/20 border-green-500/50 text-green-400";
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          "bg-red-500/20 border-red-500/50 text-red-400";
                      } else if (!isSelected && isCorrect) {
                        optionStyle =
                          "bg-green-500/10 border-green-500/30 text-green-400";
                      }

                      return (
                        <div
                          key={option?.id}
                          className={`p-4 rounded-xl border-2 ${optionStyle} transition-all duration-200`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.text}</span>
                            <div className="flex items-center space-x-2">
                              {isSelected && (
                                <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                                  Your Answer
                                </span>
                              )}
                              {isCorrect && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                              {isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {status === "skipped" && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        <Clock className="w-4 h-4 inline mr-2" />
                        This question was skipped. The correct answer was:{" "}
                        <span className="font-semibold">
                          {correctOption?.text}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailReportPage;
