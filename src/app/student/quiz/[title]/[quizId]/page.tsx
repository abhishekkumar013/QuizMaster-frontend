"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Target,
  Timer,
  BookOpen,
  RotateCcw,
  Send,
} from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/slice";
import axios from "@/lib/axios";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

let socket = null;

const QuizTakingComponent = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId;

  const [socketConnected, setSocketConnected] = useState(false);

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added missing state
  const [results, setResults] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [startingQuiz, setStartingQuiz] = useState(false); // Added new state
  const timerRef = useRef(null);

  const initializeSocket = () => {
    if (socket) {
      socket.disconnect();
    }

    socket = io("http://localhost:4040", {
      withCredentials: true,
      forceNew: true, // Force a new connection
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    return socket;
  };

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`quiz/id/${quizId}`);
      // console.log("quiz idata",res.)
      if (res.data.success) {
        setQuiz(res.data.data);
        setTimeLeft(res.data.data.durationInMinutes * 60);
      } else {
        toast.error(res.data.message);
        router.replace("/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch quiz");
      router.replace("/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    // Initialize socket when component mounts
    const currentSocket = initializeSocket();

    // Set up socket event listeners
    const handleQuizStarted = ({ sessionId }) => {
      console.log("Quiz started with session:", sessionId);
      setSessionId(sessionId);
      setQuizStarted(true);
      setStartingQuiz(false);
      startTimer();
    };

    const handleAnswerSaved = (data) => {
      console.log("Answer saved:", data);
    };

    const handleQuizSubmitted = (data) => {
      console.log("Quiz submitted successfully:", data);
      setResults(data.result);
      setQuizCompleted(true);
      setIsSubmitting(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    const handleQuizCompleted = (data) => {
      console.log("Quiz completed:", data.message);
    };

    const handleError = (data) => {
      console.error("Socket error:", data);
      toast.error(data.message);
      setStartingQuiz(false);
      setIsSubmitting(false);
    };

    // Add event listeners
    currentSocket.on("quiz-started", handleQuizStarted);
    currentSocket.on("answer-saved", handleAnswerSaved);
    currentSocket.on("quiz-submitted", handleQuizSubmitted);
    currentSocket.on("quiz-completed", handleQuizCompleted);
    currentSocket.on("error", handleError);

    // Cleanup function
    return () => {
      currentSocket.off("quiz-started", handleQuizStarted);
      currentSocket.off("answer-saved", handleAnswerSaved);
      currentSocket.off("quiz-submitted", handleQuizSubmitted);
      currentSocket.off("quiz-completed", handleQuizCompleted);
      currentSocket.off("error", handleError);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Don't disconnect socket here - let it disconnect naturally
      // currentSocket.disconnect();
    };
  }, [quizId]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    if (!quiz || !user) {
      toast.error("Quiz or user data not available");
      return;
    }

    // Ensure socket is connected before starting quiz
    if (!socketConnected) {
      toast.error("Connection not established. Please wait...");
      return;
    }

    console.log("Starting quiz with:", { quiz, user });
    setStartingQuiz(true);

    socket.emit("start-quiz", {
      quizId: quiz.id,
      userId: user.id,
      studentProfileId: user.roleId,
    });
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    if (sessionId) {
      socket.emit("save-answer", {
        sessionId,
        questionId,
        optionId,
      });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!sessionId) {
      toast.error("No active session found");
      return;
    }

    if (!socketConnected) {
      toast.error("Connection lost. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    socket.emit("submit-quiz", { sessionId });
  };

  const currentQuestion = quiz ? quiz.questions[currentQuestionIndex] : null;
  const progress = quiz
    ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
    : 0;

  if (loading || !quiz) return <Loading />;

  // Quiz Start Screen
  if (!quizStarted && !quizCompleted) {
    return (
      <>
        <HeaderBar />
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 mt-14 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full border border-white/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {quiz.title}
              </h1>
              <p className="text-gray-300 mb-6">{quiz.description}</p>

              <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Instructions:
                </h3>
                <p className="text-gray-300 mb-4">{quiz.instructions}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-gray-300">
                      Duration: {quiz.durationInMinutes} minutes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-gray-300">
                      Total Marks: {quiz.totalMarks}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={startingQuiz}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {startingQuiz ? "Starting Quiz..." : "Start Quiz"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Quiz Results Screen
  if (quizCompleted && results) {
    return (
      <>
        <HeaderBar />
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
          <div className="max-w-4xl mt-14 mx-auto">
            {!showReport ? (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                      results.isPassed
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-orange-400 to-red-500"
                    }`}
                  >
                    {results.isPassed ? (
                      <Award className="w-10 h-10 text-white" />
                    ) : (
                      <RotateCcw className="w-10 h-10 text-white" />
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-white mb-2">
                    {results.isPassed ? "Congratulations!" : "Keep Learning!"}
                  </h1>
                  <p className="text-gray-300 mb-6">
                    {results.isPassed
                      ? "You have successfully completed the quiz"
                      : "You can retake the quiz to improve your score"}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {results.score}
                    </div>
                    <div className="text-sm text-gray-300">Score</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {results.percentage}%
                    </div>
                    <div className="text-sm text-gray-300">Percentage</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {results.questionsCorrect}
                    </div>
                    <div className="text-sm text-gray-300">Correct</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {results.questionsIncorrect}
                    </div>
                    <div className="text-sm text-gray-300">Incorrect</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowReport(true)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                  >
                    View Detailed Report
                  </button>
                  <button
                    onClick={() => router.push("/home")}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Detailed Report
                  </h2>
                  <button
                    onClick={() => setShowReport(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Back to Summary
                  </button>
                </div>

                <div className="space-y-6">
                  {results.evaluation?.map((item, index) => (
                    <div
                      key={item.questionId}
                      className="bg-white/5 rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          Q{index + 1}. {item.questionText}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.skipped
                              ? "bg-yellow-500/20 text-yellow-400"
                              : item.isCorrect
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.skipped
                            ? "Skipped"
                            : item.isCorrect
                            ? "Correct"
                            : "Incorrect"}
                        </div>
                      </div>

                      {!item.skipped && (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">
                              Your Answer:
                            </span>
                            <span
                              className={`${
                                item.isCorrect
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {item.selectedOptionText}
                            </span>
                          </div>
                          {!item.isCorrect && (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-2">
                                Correct Answer:
                              </span>
                              <span className="text-green-400">
                                {item.correctOptionText}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {item.skipped && (
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">
                            Correct Answer:
                          </span>
                          <span className="text-green-400">
                            {item.correctOptionText}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Quiz Taking Screen
  if (quizStarted && !quizCompleted && currentQuestion) {
    return (
      <>
        <HeaderBar />
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
          <div className="max-w-4xl mt-14 mx-auto">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {quiz.title}
                  </h1>
                  <p className="text-gray-300">
                    Question {currentQuestionIndex + 1} of{" "}
                    {quiz.questions.length}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white/10 rounded-2xl px-4 py-2">
                    <Clock className="w-5 h-5 text-cyan-400 mr-2" />
                    <span className="text-white font-mono">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-6 border border-white/20">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {currentQuestion.text}
                </h2>
                <div className="text-sm text-gray-400">
                  Marks: {currentQuestion.marks}
                </div>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.id, option.id)
                    }
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-200 ${
                      answers[currentQuestion.id] === option.id
                        ? "bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border-2 border-cyan-400"
                        : "bg-white/5 hover:bg-white/10 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQuestion.id] === option.id
                            ? "border-cyan-400 bg-cyan-400"
                            : "border-gray-400"
                        }`}
                      >
                        {answers[currentQuestion.id] === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-white">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-6 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {quiz.questions.map((q, index) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        index === currentQuestionIndex
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : answers[q.id]
                          ? "bg-green-500/30 text-green-400"
                          : "bg-white/10 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(quiz.questions.length - 1, prev + 1)
                      )
                    }
                    className="flex items-center px-6 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Fallback loading state
  return <Loading />;
};

export default QuizTakingComponent;
