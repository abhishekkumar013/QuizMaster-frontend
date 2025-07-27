"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Users,
  Clock,
  BookOpen,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/store/slice";
import { GetTeacherQuiz } from "@/store/slices/quizSlice";
import { QuizList, QuizType } from "@/utlis/Quiz-Types";
import { GetCategory } from "@/store/slices/categorySlice";
import { CategoryType } from "@/utlis/types";
import Loading from "@/components/Loading";
import axios from "@/lib/axios";

export default function QuizSelectionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [quizzes, setQuizzes] = useState<QuizList>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [showReport, setShowReport] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState("quiz");

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { privateQuiz, publicQuiz } = useSelector((state: RootState) => state.quiz);
  const { category } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(GetTeacherQuiz());
    dispatch(GetCategory());
  }, []);

  useEffect(() => {
    if (privateQuiz && publicQuiz) {
      setQuizzes([...privateQuiz, ...publicQuiz]);
      setLoading(false);
    }
  }, [privateQuiz, publicQuiz]);

  useEffect(() => {
    setCategories(category);
  }, [category]);

  const difficulties = ["All", "EASY", "MEDIUM", "HARD"];

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || quiz.category.name === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || quiz.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [quizzes, searchTerm, selectedCategory, selectedDifficulty]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSelectQuiz = (quiz: QuizType) => {
    setSelectedQuiz(quiz);
    setShowConfirmDialog(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectedQuiz) return;

    const newErrors: { [key: string]: string } = {};

    if (!roomTitle.trim()) newErrors.title = "Title is required";
    if (!startTime.trim()) newErrors.startTime = "Start time is required";
    if (!endTime.trim()) newErrors.endTime = "End time is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCreatingRoom(true);
    setShowConfirmDialog(false);

    try {
      const res = await axios.post("/room/create", {
        quizId: selectedQuiz.id,
        title: roomTitle,
        startTime: startTime,
        endTime: endTime,
        showReport: showReport
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setRoomId(res.data.data.roomCode);
        setShowRoomDialog(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room. Please try again.');
    } finally {
      setIsCreatingRoom(false);
      setErrors({});
    }
  };

  const handleCopyRoomId = async () => {
    if (!roomId) return;

    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success('Room ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy room ID:', error);
      toast.error('Failed to copy room ID');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'hard':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

    
      <nav className="relative z-10 p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/home"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                QuizMaster
              </span>
            </div>
          </div>
        </div>
      </nav>

     
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Select a Quiz
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
            Choose your quiz to create a room and invite friends to join the challenge
          </p>
        </div>

       
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

         
            {activeTab==="quiz" && <>
                <div className="space-y-4 sm:space-y-6">
           
           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
             <span className="text-sm text-gray-400 font-medium min-w-fit">Category:</span>
             <div className="flex flex-wrap gap-2">
               <button
                 onClick={() => setSelectedCategory("All")}
                 className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                   selectedCategory === "All"
                     ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                     : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                 }`}
               >
                 All
               </button>
               {categories.map((cat) => (
                 <button
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.name.toString())}
                   className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                     selectedCategory === cat.name
                       ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                       : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                   }`}
                 >
                   {cat.name}
                 </button>
               ))}
             </div>
           </div>

          
           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
             <span className="text-sm text-gray-400 font-medium min-w-fit">Difficulty:</span>
             <div className="flex flex-wrap gap-2">
               {difficulties.map((difficulty) => (
                 <button
                   key={difficulty}
                   onClick={() => setSelectedDifficulty(difficulty)}
                   className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                     selectedDifficulty === difficulty
                       ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                       : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                   }`}
                 >
                   {difficulty}
                 </button>
               ))}
             </div>
           </div>
         </div>

        
         <div className="text-center mt-6">
           <p className="text-gray-400 text-sm sm:text-base">
             Showing {filteredQuizzes.length} of {quizzes.length} quizzes
           </p>
         </div>
            </>}
        </div>

        
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === "quiz"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Quizzes ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab("room")}
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === "room"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Rooms
            </button>
          </div>
        </div>

       
        {activeTab === "quiz" && (
          <div className="pb-20">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-300">No quizzes found</h3>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                  {searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All"
                    ? "Try adjusting your search terms or filters."
                    : "No quizzes are available at the moment."}
                </p>
                {(searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setSelectedDifficulty("All");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex flex-col h-full">
                      {/* Quiz Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                            {quiz.title}
                          </h3>
                        </div>
                        <span className={`ml-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(quiz.difficulty)} flex-shrink-0`}>
                          {quiz.difficulty}
                        </span>
                      </div>

                      {/* Quiz Info */}
                      <div className="flex-1 mb-4 sm:mb-6">
                        <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                          {quiz.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{quiz.category.name}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{quiz.durationInMinutes} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Select Button */}
                      <button
                        onClick={() => handleSelectQuiz(quiz)}
                        disabled={isCreatingRoom}
                        className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Create Room</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "room" && (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-300">Room Management</h3>
                    <p className="text-gray-400 mb-6">
                    Room management features coming soon! Here you'll be able to view and manage your active quiz rooms.
                    </p>
                </div>
        )}

      </div>

      {/* input for room */}
      {showConfirmDialog && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold">Create Quiz Room?</h3>
              <p className="text-gray-300 text-sm sm:text-base">You're about to create a room for:</p>
              <p className="text-lg sm:text-xl font-semibold text-purple-400 line-clamp-2">{selectedQuiz.title}</p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-sm mb-1 text-white">Title</label>
                  <input
                    type="text"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    placeholder="Enter room title"
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-white">Start Time</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                  {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-white">End Time</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  />
                  {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-1 text-white">Show Report</label>
                  <select
                    value={showReport.toString()}
                    onChange={(e) => setShowReport(e.target.value === "true")}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSelection}
                  disabled={isCreatingRoom}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isCreatingRoom ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Yes, Create</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room code copy show  */}
      {showRoomDialog && roomId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-4">Room Created!</h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Share this room ID with your friends to join the quiz:
              </p>

              <div className="bg-white/5 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-purple-400 break-all">
                    {roomId}
                  </span>
                  <button
                    onClick={handleCopyRoomId}
                    className="ml-3 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowRoomDialog(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}