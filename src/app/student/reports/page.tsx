"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  BarChart3,
  Target,
  Trophy,
  Star,
  Play,
  ArrowLeft,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AppDispatch, RootState } from "@/store/slice";
import { useDispatch, useSelector } from "react-redux";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { StudentReportCard } from "@/components/Student-Report-Card";
import { GetAllReports } from "@/store/slices/studentSlice";
import Loading from "@/components/Loading";
import { GetCategory } from "@/store/slices/categorySlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Generate performance data for charts
const generatePerformanceData = (reports) => {
  // console.log("R", reports);

  return reports?.results
    ?.map((report, index) => ({
      name: report.quiz.title.substring(0, 8) + "...",
      percentage: report.percentage,
      rank: 1,
      date: new Date(report.submittedAt).toLocaleDateString(),
    }))
    .reverse();
};

export default function StudentReports() {
  const { allReport, loading } = useSelector(
    (state: RootState) => state.studentreport
  );
  const { category } = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    dispatch(GetAllReports());
    dispatch(GetCategory());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  const performanceData = generatePerformanceData(allReport || []);
  const categories = category;

  const filterReports = (reports) => {
    if (!reports || reports.length === 0) return [];

    return reports.results.filter((report) => {
      const matchesSearch = report.quiz.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "ALL" ||
        report.quiz.difficulty === selectedDifficulty;
      const matchesCategory =
        selectedCategory === "ALL" ||
        report.quiz.category.name === selectedCategory;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  };

  const filteredReports = filterReports(allReport || []);

  // Calculate analytics based on actual data
  const calculateAnalytics = () => {
    if (!allReport || allReport.results.length === 0) {
      return {
        averageScore: 0,
        averageRank: 0,
        totalQuizzes: 0,
        bestScore: 0,
      };
    }

    //TODO previoouly rank is  allReport?.rank;
    const averageRank = Math.round(
      allReport.results.reduce((sum, r) => sum + (r.rank || 0), 0) /
        allReport.results.length
    );

    const totalQuizzes = allReport.results.length;
    const bestScore = Math.max(...allReport.results.map((r) => r.percentage));
    const averageScore = Math.round(
      allReport.results.reduce((sum, report) => sum + report.percentage, 0) /
        allReport.results.length
    );

    return { averageScore, averageRank, totalQuizzes, bestScore };
  };

  const { averageScore, averageRank, totalQuizzes, bestScore } =
    calculateAnalytics();

  const handleCardClick = (resultId) => {
    // Navigate to /student/report/resultId
    router.push(`/student/reports/${resultId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
          href={"/home"}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Home</span>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              My Results
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your progress and analyze your performance across all quizzes
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Average Score"
            value={`${averageScore}%`}
            subtitle="Overall Performance"
            icon={Target}
            color="bg-green-500"
            trend={5}
          />
          <AnalyticsCard
            title="Average Rank"
            value={`#${averageRank}`}
            subtitle="Position"
            icon={Trophy}
            color="bg-yellow-500"
            trend={-2}
          />
          <AnalyticsCard
            title="Total Quizzes"
            value={totalQuizzes}
            subtitle="Completed"
            icon={BookOpen}
            color="bg-blue-500"
            trend={12}
          />
          <AnalyticsCard
            title="Best Score"
            value={`${bestScore}%`}
            subtitle="Top Performance"
            icon={Star}
            color="bg-purple-500"
            trend={8}
          />
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Trend Chart */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Score Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rank Performance Chart */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Rank Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="rank"
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="ALL" className="bg-gray-800 text-white">
                  All Difficulties
                </option>
                <option value="EASY" className="bg-gray-800 text-white">
                  Easy
                </option>
                <option value="MEDIUM" className="bg-gray-800 text-white">
                  Medium
                </option>
                <option value="HARD" className="bg-gray-800 text-white">
                  Hard
                </option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="ALL" className="bg-gray-800 text-white">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.name}
                    className="bg-gray-800 text-white"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReports.map((result) => (
            <StudentReportCard
              key={result.id}
              result={result}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-400">
              {searchTerm ||
              selectedDifficulty !== "ALL" ||
              selectedCategory !== "ALL"
                ? "Try adjusting your search filters"
                : "No quiz results available at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
