import React, { useEffect, useState } from "react";
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
  CloudUpload,
  Globe,
  Lock,
  NotebookTabs,
  Play,
  Trophy,
  Users,
  X,
  Search,
  Plus,
  Trash2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { toast } from "react-toastify";

interface User {
  id: string;
  email: string;
  name: string;
}

export const AssignQuizCard = ({
  quiz,
  teacherId,
}: {
  quiz: Quiz;
  teacherId: String;
}) => {
  const isActive = isQuizActive(quiz.startTime, quiz.endTime);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // search for users by email
  const searchUserByEmail = async (email: string) => {
    if (!email.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(`/auth/students/search/${email}`);
      console.log("Search ", res.data);

      if (res.data.success) {
        setSearchResults(res.data.data || []);
      } else {
        toast.error(res.data.message);
        setSearchResults([]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  //  add user to selected list
  const addUserToSelected = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchEmail("");
    setSearchResults([]);
  };

  //remove user from selected list
  const removeUserFromSelected = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  // assign quiz to selected users
  const assignQuizToUsers = async () => {
    if (selectedUsers.length === 0) return;

    setIsAssigning(true);
    try {
      const userIds = selectedUsers.map((user) => user.id);
      const senddata = {
        teacherId: teacherId,
        quizId: quiz.id,
        studentIds: userIds,
      };

      const res = await axios.post("/quiz/assign", senddata);
      console.log("Res ", res);

      if (res.data.success) {
        // Success - close modal and reset state
        setIsModalOpen(false);
        setSelectedUsers([]);
        setSearchEmail("");
        setSearchResults([]);

        // Show success message (you can integrate with your notification system)
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error assigning quiz:2", error);
      toast.error(error.response.data.message);
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    if (!searchEmail.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUserByEmail(searchEmail);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchEmail]);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
  };

  return (
    <>
      <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Private Quiz</span>
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
              {quiz.createdBy.user.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="group/btn flex items-center space-x-2 px-4 py-2 rounded-2xl font-semibold transition-all duration-300 
              bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white w-fit"
          >
            <CloudUpload className="w-4 h-4" />
            <span>Assign</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Assign Quiz</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search User by Email
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter user email..."
                  value={searchEmail}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white/5 border border-white/10 rounded-lg max-h-32 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 hover:bg-white/10 cursor-pointer"
                      onClick={() => addUserToSelected(user)}
                    >
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user?.user.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {user?.user.email}
                          </div>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-green-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Users */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Users ({selectedUsers.length})
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user?.user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user?.user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUserFromSelected(user.id)}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedUsers.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    No users selected
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={assignQuizToUsers}
                disabled={selectedUsers.length === 0 || isAssigning}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isAssigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Assigning...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Assign Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
