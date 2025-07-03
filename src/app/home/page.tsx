"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Clock,
  Trophy,
  Users,
  BookOpen,
  Star,
  Calendar,
  ArrowRight,
  Filter,
  Search,
  Loader2,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  GetPublicQuiz,
  GetQuiz,
  GetTeacherQuiz,
} from "@/store/slices/quizSlice";
import Loading from "@/components/Loading";
import { QuizCard } from "@/components/QuizCard";

interface Category {
  id: string;
  name: string;
}

interface CreatedBy {
  id: string;
  name: string;
  email: string;
}

export default function QuizHomePage() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const quizState = useSelector((state) => state.quiz);
  const {
    publicQuiz = [],
    privateQuiz = [],
    protectedQuiz = [],
    loading = true,
  } = quizState || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState("public");

  useEffect(() => {
    if (isAuthenticated === false) {
      dispatch(GetPublicQuiz());
    } else if (isAuthenticated === true && user.role === "STUDENT") {
      dispatch(GetQuiz());
    } else if (isAuthenticated === true && user.role === "TEACHER") {
      dispatch(GetTeacherQuiz());
    }
  }, [dispatch, isAuthenticated]);

  const getUniqueCategories = (quizzes: Quiz[]) => {
    const categories = quizzes.map((quiz) => quiz.category.name);
    return [...new Set(categories)];
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const filterQuizzes = (quizzes: Quiz[]) => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "ALL" || quiz.difficulty === selectedDifficulty;
      const matchesCategory =
        selectedCategory === "ALL" || quiz.category.name === selectedCategory;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  };

  if (loading) {
    return <Loading />;
  }

  const filteredPublicQuizzes = filterQuizzes(publicQuiz || []);
  const filteredPrivateQuizzes = filterQuizzes(privateQuiz || []);
  const filteredProtectedQuizzes = filterQuizzes(protectedQuiz || []);
  const allQuizzes = [
    ...(publicQuiz || []),
    ...(privateQuiz || []),
    ...(protectedQuiz || []),
  ];
  const categories = getUniqueCategories(allQuizzes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Top Navigation with Logo */}
      <div className="relative z-10 w-full">
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Top Left */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                QuizMaster
              </span>
            </Link>

            {/* Navigation Links (Optional - you can add more links here) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Home
              </Link>

              {!isAuthenticated ? (
                <Link
                  href="/signin"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
                >
                  Sign In
                </Link>
              ) : (
                <>
                  {user.role === "TEACHER" && (
                    <Link
                      href="/teacher/create-quiz"
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      Create Quiz
                    </Link>
                  )}
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getUserInitial()}
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Explore Quizzes
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Challenge yourself with our collection of interactive quizzes across
            various topics
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
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
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-gray-800 text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-2xl p-1 inline-flex">
            <button
              onClick={() => setActiveTab("public")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "public"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Public Quizzes ({filteredPublicQuizzes.length})
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab("private")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "private"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                My Private Quizzes ({filteredPrivateQuizzes.length})
              </button>
            )}
            {isAuthenticated && user.role === "TEACHER" && (
              <button
                onClick={() => setActiveTab("protected")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "protected"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                My Protected Quizzes ({filteredProtectedQuizzes.length})
              </button>
            )}
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === "public" &&
            filteredPublicQuizzes.length > 0 &&
            filteredPublicQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} role={user?.role} />
            ))}

          {activeTab === "private" &&
            isAuthenticated &&
            filteredPrivateQuizzes.length > 0 &&
            filteredPrivateQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                isPrivate={true}
                role={user?.role}
              />
            ))}
          {activeTab === "protected" &&
            isAuthenticated &&
            user.role === "TEACHER" &&
            filteredProtectedQuizzes.length > 0 &&
            filteredProtectedQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                isPrivate={true}
                role={user?.role}
              />
            ))}
        </div>

        {/* Empty States */}
        {activeTab === "public" && filteredPublicQuizzes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              No Public Quizzes Found
            </h3>
            <p className="text-gray-400">
              {searchTerm ||
              selectedDifficulty !== "ALL" ||
              selectedCategory !== "ALL"
                ? "Try adjusting your search filters"
                : "No public quizzes are available at the moment"}
            </p>
          </div>
        )}

        {activeTab === "private" &&
          isAuthenticated &&
          filteredPrivateQuizzes.length === 0 && (
            <div className="text-center py-16">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                No Private Quizzes Found
              </h3>
              <p className="text-gray-400">
                {searchTerm ||
                selectedDifficulty !== "ALL" ||
                selectedCategory !== "ALL"
                  ? "Try adjusting your search filters"
                  : user.role === "TEACHER"
                  ? "You haven't created any protected quizzes yet"
                  : "You haven't been assigned any private quizzes yet"}
              </p>
            </div>
          )}

        {activeTab === "private" && !isAuthenticated && (
          <div className="text-center py-16">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              Sign In Required
            </h3>
            <p className="text-gray-400 mb-6">
              Please sign in to view your private quizzes
            </p>
            <Link
              href="/signin"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        )}
        {activeTab === "protected" &&
          isAuthenticated &&
          user.role === "TEACHER" &&
          filteredProtectedQuizzes.length === 0 && (
            <div className="text-center py-16">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                No Protected Quizzes Found
              </h3>
              <p className="text-gray-400">
                {searchTerm ||
                selectedDifficulty !== "ALL" ||
                selectedCategory !== "ALL"
                  ? "Try adjusting your search filters"
                  : "You haven't created any protected quizzes yet"}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
