"use client";
import React, { useState, useEffect } from "react";
import { Play, User, Users, Activity, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/slice";
import { GetChildrens } from "@/store/slices/parentSlice";
import ChildrenCard from "@/components/Children-Card";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ParentHomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { childrens, loading } = useSelector(
    (state: RootState) => state.parent
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    dispatch(GetChildrens());
  }, []);

  if (loading) {
    return <Loading />;
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
        <Link href={"/"} className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            QuizMaster
          </span>
        </Link>
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
        <ChildrenCard childrens={childrens} isClient={isClient} />
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
