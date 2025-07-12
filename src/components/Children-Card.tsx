import {
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Eye,
  Shield,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const ChildrenCard = ({
  childrens,
  isClient,
}: {
  childrens: any;
  isClient: Boolean;
}) => {
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

  return (
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
                    <p className="text-gray-300 text-sm">{child.user.email}</p>
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
                        {/* <span>{child.lastActivity}</span>  */}
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
                      {child.points}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Award className="w-4 h-4 text-purple-400" />
                      <p className="text-xs text-gray-400">Rank</p>
                    </div>
                    <p
                      className={`text-lg font-bold ${getRankColor(
                        child.Rank
                      )}`}
                    >
                      #{child.Rank}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col space-y-2">
                  <Link
                    // onClick={() => handleViewReport(child.id)}
                    href={`/parent/student-report/${child.id}`}
                    className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>View Report</span>
                  </Link>
                  {/* <div className="text-center">
                          <p className="text-xs text-gray-400">
                            Favorite: {child.favoriteSubject || ""}
                          </p>
                        </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildrenCard;
