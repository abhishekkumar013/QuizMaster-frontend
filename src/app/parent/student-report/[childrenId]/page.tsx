"use client";
import React, { useState, useEffect } from "react";
import {
  Trophy,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  User,
  Award,
  TrendingUp,
  Play,
  BookOpen,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Loading from "@/components/Loading";
import HeaderBar from "@/components/HeaderBar";
import Link from "next/link";

const StudentReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const params = useParams();
  const studentId = params.childrenId;

  useEffect(() => {
    fetchStudentReport();
  }, [studentId]);

  const fetchStudentReport = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `http://localhost:4040/api/v1/result/child/${studentId}`
      );

      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        setError("Failed to fetch report data");
      }
    } catch (err) {
      setError(err.response.data.message || "Error fetching report data");
      console.error("Error:", err.response.data.message);
      //   router.replace("/parent/home");
    } finally {
      setLoading(false);
    }
  };

  const getGradeFromPercentage = (percentage) => {
    if (percentage >= 90)
      return { grade: "A+", color: "from-green-400 to-emerald-500" };
    if (percentage >= 80)
      return { grade: "A", color: "from-green-400 to-green-500" };
    if (percentage >= 70)
      return { grade: "B+", color: "from-blue-400 to-blue-500" };
    if (percentage >= 60)
      return { grade: "B", color: "from-blue-400 to-indigo-500" };
    if (percentage >= 50)
      return { grade: "C", color: "from-yellow-400 to-orange-500" };
    return { grade: "F", color: "from-red-400 to-red-500" };
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateOverallStats = () => {
    if (!reportData || reportData.length === 0) return null;

    const totalAttempts = reportData.length;
    const avgScore =
      reportData.reduce((sum, result) => sum + result.percentage, 0) /
      totalAttempts;
    const bestScore = Math.max(
      ...reportData.map((result) => result.percentage)
    );
    const totalTimeTaken = reportData.reduce(
      (sum, result) => sum + result.timeTaken,
      0
    );
    const passedAttempts = reportData.filter(
      (result) => result.isPassed
    ).length;

    return {
      totalAttempts,
      avgScore: Math.round(avgScore),
      bestScore,
      totalTimeTaken,
      passRate: Math.round((passedAttempts / totalAttempts) * 100),
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl text-red-400 mb-6">{error}</p>
          <Link
            href="/parent/home"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl font-semibold text-white hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const overallStats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center  backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </div>

        <Link
          href={"/parent/home"}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Home</span>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Student Report
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Comprehensive performance analysis and progress tracking
          </p>
        </div>

        {/* Overall Stats Cards */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Attempts</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.totalAttempts}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.avgScore}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Best Score</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.bestScore}%
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Pass Rate</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.passRate}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Time</p>
                  <p className="text-3xl font-bold text-white">
                    {formatDuration(overallStats.totalTimeTaken)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Quiz Results
          </h2>

          {reportData &&
            reportData.map((result, index) => {
              const gradeInfo = getGradeFromPercentage(result.percentage);

              return (
                <div
                  key={result.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quiz Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${gradeInfo.color} rounded-2xl flex items-center justify-center`}
                        >
                          <span className="text-2xl font-bold text-white">
                            {gradeInfo.grade}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {result.quiz.title}
                          </h3>
                          <p className="text-gray-300">
                            Attempt #{result.attemptNumber}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            By {result.quiz.createdBy.user.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            {result.quiz.category.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            Difficulty: {result.quiz.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="lg:col-span-1">
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-white mb-2">
                          {result.percentage}%
                        </div>
                        <div className="text-gray-300">
                          {result.score}/{result.totalMarks} Points
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">
                            {result.questionsCorrect}
                          </div>
                          <div className="text-gray-300 text-sm">Correct</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 text-center">
                          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">
                            {result.questionsIncorrect}
                          </div>
                          <div className="text-gray-300 text-sm">Incorrect</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="lg:col-span-1">
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Time Taken</span>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-xl font-bold text-white">
                            {formatDuration(result.timeTaken)}
                          </div>
                          <div className="text-sm text-gray-400">
                            Limit: {result.quiz.durationInMinutes} minutes
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">
                              Questions Attempted
                            </span>
                            <Target className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-xl font-bold text-white">
                            {result.questionsAttempted}
                          </div>
                          <div className="text-sm text-gray-400">
                            Skipped: {result.questionsSkipped}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Status</span>
                            {result.isPassed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              result.isPassed
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {result.isPassed ? "PASSED" : "FAILED"}
                          </div>
                          <div className="text-sm text-gray-400">
                            Required: {result.quiz.passingMarks}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${gradeInfo.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Empty State */}
        {reportData && reportData.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-300 mb-4">
              No Quiz Results Found
            </h3>
            <p className="text-gray-400">
              This student hasn't taken any quizzes yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReport;
