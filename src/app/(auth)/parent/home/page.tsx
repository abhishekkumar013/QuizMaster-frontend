"use client";
import React, { useState, useEffect } from "react";
import {
  Play,
  User,
  BarChart3,
  Shield,
  ShieldCheck,
  Eye,
  Users,
  Activity,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/slice";
import { GetChildrens } from "@/store/slices/parentSlice";

const ParentHomePage = () => {
  const dispatch = useDispatch();
  const { childrens, loading } = useSelector(
    (state: RootState) => state.parent
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    dispatch(GetChildrens());
  }, []);

  const getStatusColor = (isActive) => {
    return isActive
      ? "from-green-500 to-emerald-600"
      : "from-red-500 to-rose-600";
  };

  const getStatusText = (isActive) => {
    return isActive ? "Active" : "Blocked";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank <= 3) return "text-gray-300";
    if (rank <= 10) return "text-orange-400";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading children data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-300">Parent Dashboard</p>
            <p className="text-lg font-semibold">Welcome back!</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="relative z-10 container mx-auto px-6 pt-8 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Your Children's
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Progress
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Monitor your children's quiz performance, track their learning
            journey, and celebrate their achievements.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Total Children</p>
                <p className="text-2xl font-bold">{childrens.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Active Children</p>
                <p className="text-2xl font-bold">
                  {childrens.filter((child) => !child.block).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Avg Performance</p>
                <p className="text-2xl font-bold">
                  {childrens.length > 0
                    ? Math.round(
                        childrens.reduce(
                          (sum, child) => sum + child.averageScore,
                          0
                        ) / childrens.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Children List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Children Dashboard
          </h2>

          {childrens.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-300">No children found</p>
              <p className="text-gray-400">
                Add children to start monitoring their progress
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {childrens.map((child) => (
                <div
                  key={child.id}
                  className={`group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 ${
                    isClient
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Child Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(child.user.name)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {child.user.name}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {child.user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(
                              !child.block
                            )}`}
                          >
                            {child.block ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <ShieldCheck className="w-3 h-3" />
                            )}
                            <span>{getStatusText(!child.block)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {/* <span>{child.lastActivity}</span> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <p className="text-xs text-gray-400">Quizzes</p>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {child.quizzesTaken || 0}
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <BarChart3 className="w-4 h-4 text-green-400" />
                          <p className="text-xs text-gray-400">Avg Score</p>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {child.averageScore || 0}%
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <p className="text-xs text-gray-400">Points</p>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {child.points.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Award className="w-4 h-4 text-purple-400" />
                          <p className="text-xs text-gray-400">Rank</p>
                        </div>
                        <p
                          className={`text-lg font-bold ${getRankColor(
                            child.rank
                          )}`}
                        >
                          #{child.rank}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewReport(child.id)}
                        className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>View Report</span>
                      </button>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">
                          Favorite: {child.favoriteSubject || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center mt-12">
        <div className="container mx-auto px-6">
          <p className="text-gray-400">
            © 2025 QuizMaster. Empowering parents to support their children's
            learning journey.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ParentHomePage;
