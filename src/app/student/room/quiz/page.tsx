"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Flag,
  CheckCircle,
  Circle,
  ArrowLeft,
  ArrowRight,
  Send,
  Users,
  Trophy,
  Target,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import axios from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizType } from "@/utlis/Quiz-Types";
import { ResultType, RoomStatsDataType } from "@/utlis/types";
import { toast } from "react-toastify";
import QuizResult from "@/components/QuizResult";

const RoomQuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quizData, setQuizData] = useState<QuizType | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [results, setResults] = useState<ResultType | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const searchParams = useSearchParams();
  const roomIdParms = searchParams.get("roomId");
  const studentsJoined = searchParams.get("studentsJoined");
  const highestScore = searchParams.get("highestScore");
  const totalSubmissions = searchParams.get("totalSubmissions");

  useEffect(() => {
    setRoomId(roomIdParms);
    setRoomStats({
      studentsJoined: Number(studentsJoined) || 0,
      highestScore: Number(highestScore) || 0,
      totalSubmissions: Number(totalSubmissions) || 0,
    });
  }, []);

  const [roomStats, setRoomStats] = useState({
    studentsJoined: 0,
    highestScore: 0,
    totalSubmissions: 0,
  });

  const router = useRouter();

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/quiz/room/${roomId}`);

      if (res.data.success) {
        setQuizData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load quiz data");
    }
  };

  const handleRoomStatsUpdated = useCallback(
    (data: {
      studentsJoined: number;
      highestScore: number;
      totalSubmissions: number;
    }) => {
      setRoomStats(data);
    },
    []
  );

  useEffect(() => {
    if (!roomId) return;

    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get("roomId");
    const sessionIdFromUrl = urlParams.get("sessionId");

    const storedRoomId = localStorage.getItem("currentRoomId");
    const storedSessionId = localStorage.getItem("currentSessionId");

    const finalRoomId = roomIdFromUrl || storedRoomId;
    const finalSessionId = sessionIdFromUrl || storedSessionId;

    setRoomId(finalRoomId);
    setSessionId(finalSessionId);

    fetchQuiz();

    const socketConnection = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4040",
      {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      // console.log("Socket connected:", socketConnection.id);
      setIsConnecting(false);
      setConnectionError(null);

      if (finalSessionId && finalRoomId) {
        // console.log("Attempting to restore session:", finalSessionId);
        socketConnection.emit("restore-session", {
          sessionId: finalSessionId,
          roomId: finalRoomId,
        });
      }
    });

    socketConnection.on("disconnect", () => {
      // console.log("Socket disconnected");
      setIsConnecting(true);
    });

    socketConnection.on("connect_error", (error) => {
      // console.error("Socket connection error:", error);
      setConnectionError("Failed to connect to server");
      setIsConnecting(false);
    });

    return () => {
      socketConnection?.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleQuizStarted = (data: {
      sessionId: string;
      roomId?: string;
      quizId?: string;
      roomStatsData: RoomStatsDataType;
    }) => {
      console.log("HHHH", data);
      setSessionId(data.sessionId);
      if (data.roomId) setRoomId(data.roomId);

      localStorage.setItem("currentSessionId", data.sessionId);
      if (data.roomId) {
        localStorage.setItem("currentRoomId", data.roomId);
      }
      setRoomStats(data.roomStatsData);
    };

    const handleSessionRestored = (data: {
      sessionId: string;
      roomId?: string;
      quizId?: string;
    }) => {
      setSessionId(data.sessionId);
      if (data.roomId) setRoomId(data.roomId);
    };

    const handleQuizSubmitted = (data: any) => {
      if (data.success) {
        setResults(data.result);
        setQuizCompleted(true);
        localStorage.removeItem("currentSessionId");
        localStorage.removeItem("currentRoomId");
      } else {
        toast.error("Quiz submission failed.");
      }
      setIsSubmitting(false);
    };

    const handleAnswerSaved = (data: any) => {
      // console.log("Answer saved:", data);
    };

    const handleError = (error: { message: string }) => {
      // console.error("Socket error:", error);
      toast.error(error.message);

      if (
        error.message.includes("session") ||
        error.message.includes("Session")
      ) {
        router.replace("/home");
      }
    };

    // Set up all event listeners
    socket.on("quiz-started", handleQuizStarted);
    socket.on("session-restored", handleSessionRestored);
    socket.on("quiz-submitted", handleQuizSubmitted);
    socket.on("answer-saved", handleAnswerSaved);
    socket.on("error", handleError);
    socket.on("room-stats-updated", handleRoomStatsUpdated);

    return () => {
      socket.off("quiz-started", handleQuizStarted);
      socket.off("session-restored", handleSessionRestored);
      socket.off("quiz-submitted", handleQuizSubmitted);
      socket.off("answer-saved", handleAnswerSaved);
      socket.off("error", handleError);
      socket.off("room-stats-updated", handleRoomStatsUpdated);
    };
  }, [socket, handleRoomStatsUpdated, router]);

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitting && sessionId) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && sessionId) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, isSubmitting, sessionId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmitQuiz = useCallback(() => {
    if (!socket || !sessionId || isSubmitting) {
      return;
    }

    // console.log("Submitting quiz with sessionId:", sessionId);
    setIsSubmitting(true);

    socket.emit("submit-quiz-room", { sessionId });
  }, [socket, sessionId, isSubmitting]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    if (socket && sessionId) {
      socket.emit("save-answer", {
        sessionId,
        questionId,
        optionId,
      });
    } else {
      toast.error("Cannot save answer");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quizData?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestion(index);
  };

  const getQuestionStatus = (index: number) => {
    const question = quizData?.questions[index];
    if (!question) return "unanswered";

    if (selectedAnswers[question.id]) {
      return "answered";
    }
    return "unanswered";
  };

  const currentQuestionData = quizData?.questions[currentQuestion];
  const totalQuestions = quizData?.questions?.length || 0;
  const answeredCount = Object.keys(selectedAnswers).length;

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl">Connecting to server...</div>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-xl text-red-400 mb-4">{connectionError}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-pulse text-xl">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <QuizResult
        results={results}
        showReport={showReport}
        setShowReport={setShowReport}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col gap-4">
            {/* Title and Room Info */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {quizData.title}
                </h1>
                <p className="text-white/70">Room Quiz Session</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="text-white">
                  <span className="text-sm opacity-70">Progress: </span>
                  <span className="font-semibold">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            </div>

            {/* Room Statistics */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Students Joined:</span>
                <span className="font-bold text-blue-400">
                  {roomStats.studentsJoined}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Highest Score:</span>
                <span className="font-bold text-yellow-400">
                  {roomStats.highestScore > 0 ? roomStats.highestScore : "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Submissions:</span>
                <span className="font-bold text-green-400">
                  {roomStats.totalSubmissions}
                </span>
              </div>

              {roomStats.totalSubmissions > 0 && (
                <div className="ml-auto px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                  <span className="text-sm text-purple-200 font-medium">
                    🔥 Live Competition Active!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Questions
              </h3>

              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {quizData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentQuestion === index
                        ? "bg-blue-500 text-white ring-2 ring-blue-300"
                        : getQuestionStatus(index) === "answered"
                        ? "bg-green-500 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-4 h-4 bg-white/20 rounded"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Current</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-300 font-semibold">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <div className="flex items-center gap-2">
                    {getQuestionStatus(currentQuestion) === "answered" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-white leading-relaxed">
                  {currentQuestionData?.text}
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                {currentQuestionData?.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleAnswerSelect(currentQuestionData.id, option.id)
                    }
                    className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 ${
                      selectedAnswers[currentQuestionData.id] === option.id
                        ? "border-blue-400 bg-blue-500/20 text-white"
                        : "border-white/20 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestionData.id] === option.id
                            ? "border-blue-400 bg-blue-500"
                            : "border-white/40"
                        }`}
                      >
                        {selectedAnswers[currentQuestionData.id] ===
                          option.id && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === totalQuestions - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomQuizPage;
