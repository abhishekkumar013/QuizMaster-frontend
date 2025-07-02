"use client";
import React, { useState, useEffect } from "react";
import {
  Play,
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  BookOpen,
  Settings,
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Delete,
  DeleteIcon,
  Trash,
} from "lucide-react";
import { toast } from "react-toastify";

export default function CreateQuizPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    categoryId: "",
    accessType: "PUBLIC",
    difficulty: "MEDIUM",
    durationInMinutes: 60,
    totalMarks: 0,
    passingMarks: 0,
    maxAttempts: 1,
    startTime: "",
    endTime: "",
    status: "DRAFT",
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      options: [
        { text: "", isCorrect: false, order: 1 },
        { text: "", isCorrect: false, order: 2 },
      ],
      score: 1,
      marks: 1,
      explanation: "",
      order: 1,
      isRequired: true,
    },
  ]);

  const [categories] = useState([
    { id: 1, name: "Science", icon: "🔬" },
    { id: 2, name: "Mathematics", icon: "📊" },
    { id: 3, name: "History", icon: "📚" },
    { id: 4, name: "Geography", icon: "🌍" },
    { id: 5, name: "Literature", icon: "📖" },
    { id: 6, name: "Technology", icon: "💻" },
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now

    setFormData((prev) => ({
      ...prev,
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: "",
      options: [
        { text: "", isCorrect: false, order: 1 },
        { text: "", isCorrect: false, order: 2 },
      ],
      score: 1,
      marks: 1,
      explanation: "",
      order: questions.length + 1,
      isRequired: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      const updatedQuestions = questions
        .filter((q) => q.id !== id)
        .map((q, index) => ({ ...q, order: index + 1 }));
      setQuestions(updatedQuestions);
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (questionId, optionIndex, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      )
    );
  };
  const setCorrectAnswer = (questionId, optionIndex) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => ({
                ...opt,
                isCorrect: idx === optionIndex,
              })),
            }
          : q
      )
    );
  };
  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { text: "", isCorrect: false, order: q.options.length + 1 },
              ],
            }
          : q
      )
    );
  };
  const removeOption = (questionId, optionIndex) => {
    const ques = questions.find((q) => q.id === questionId);
    if (ques?.options.length === 2) {
      toast.error("Minimum 2 Options Required");
      return;
    }
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options
                .filter((_, idx) => idx !== optionIndex)
                .map((opt, idx) => ({ ...opt, order: idx + 1 })),
            }
          : q
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.durationInMinutes || formData.durationInMinutes <= 0) {
      newErrors.durationInMinutes = "Duration must be greater than 0";
    }
    if (!formData.maxAttempts || formData.maxAttempts <= 0) {
      newErrors.maxAttempts = "Max attempts must be greater than 0";
    }
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestions = () => {
    const newErrors = {};

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
      setErrors(newErrors);
      return false;
    }

    questions.forEach((q, index) => {
      if (!q.text.trim()) {
        newErrors[`question_${q.id}`] = `Question ${
          index + 1
        } text is required`;
      }

      if (typeof q.score !== "number" || q.score < 0) {
        newErrors[`score_${q.id}`] = `Question ${
          index + 1
        } score must be a non-negative number`;
      }

      const filledOptions = q.options.filter((opt) => opt.text.trim());
      if (filledOptions.length < 2) {
        newErrors[`options_${q.id}`] = `Question ${
          index + 1
        } needs at least 2 options`;
      }

      const hasCorrectAnswer = q.options.some((opt) => opt.isCorrect);
      if (!hasCorrectAnswer) {
        newErrors[`correct_${q.id}`] = `Question ${
          index + 1
        } must have at least one correct answer`;
      }

      const correctOption = q.options.find((opt) => opt.isCorrect);
      if (correctOption && !correctOption.text.trim()) {
        newErrors[`correct_text_${q.id}`] = `Question ${
          index + 1
        } correct answer cannot be empty`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createQuiz = async (isDraft = false) => {
    if (!validateQuizDetails()) return null;

    try {
      // Calculate total marks from questions
      const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

      const quizPayload = {
        ...formData,
        totalMarks,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        categoryId: parseInt(formData.categoryId),
        createdById: parseInt(formData.createdById),
      };

      console.log("Creating quiz with payload:", quizPayload);

      // Here you would make the API call to create quiz
      // const response = await fetch('/api/quiz/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(quizPayload)
      // });

      // Simulate API response
      const mockQuizResponse = {
        id: Math.floor(Math.random() * 1000),
        ...quizPayload,
        createdAt: new Date().toISOString(),
      };

      return mockQuizResponse;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  };

  const addQuestionsToQuiz = async (quizId) => {
    if (!validateQuestions()) return false;

    try {
      // Format questions for the API
      const questionsPayload = questions.map((q) => ({
        text: q.text.trim(),
        score: q.score,
        explanation: q.explanation?.trim() || null,
        marks: q.marks || 1,
        order: q.order,
        isRequired: q.isRequired !== undefined ? q.isRequired : true,
        options: q.options
          .filter((opt) => opt.text.trim()) // Only include non-empty options
          .map((opt, index) => ({
            text: opt.text.trim(),
            isCorrect: opt.isCorrect,
            order: opt.order || index + 1,
          })),
      }));

      const payload = {
        quizId: parseInt(quizId),
        questions: questionsPayload,
      };

      console.log("Adding questions with payload:", payload);

      // Here you would make the API call to add questions
      // const response = await fetch('/api/quiz/add-questions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      return true;
    } catch (error) {
      console.error("Error adding questions:", error);
      throw error;
    }
  };

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      if (!isDraft && !validateQuestions()) {
        setIsSubmitting(false);
        return;
      }

      const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

      const quizPayload = {
        ...formData,
        totalMarks,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        categoryId: parseInt(formData.categoryId),
        questions: questions.map((q) => ({
          text: q.text.trim(),
          score: q.score,
          explanation: q.explanation?.trim() || null,
          marks: q.marks || 1,
          order: q.order,
          isRequired: q.isRequired !== undefined ? q.isRequired : true,
          options: q.options
            .filter((opt) => opt.text.trim())
            .map((opt, index) => ({
              text: opt.text.trim(),
              isCorrect: opt.isCorrect,
              order: opt.order || index + 1,
            })),
        })),
      };

      console.log("Quiz payload:", quizPayload);

      alert(
        `Quiz ${
          isDraft ? "saved as draft" : "created and published"
        } successfully!`
      );
    } catch (error) {
      console.error("Error in quiz creation process:", error);
      alert("Error creating quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Quiz Details", icon: <Settings className="w-5 h-5" /> },
    { id: 2, title: "Questions", icon: <BookOpen className="w-5 h-5" /> },
    { id: 3, title: "Review", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              QuizMaster
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Quiz"}
          </button>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Create New Quiz
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Design engaging quizzes with customizable questions and settings
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "bg-white/10 border-2 border-white/20"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`font-semibold ${
                    currentStep >= step.id ? "text-cyan-400" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ml-4 ${
                      currentStep > step.id ? "bg-cyan-400" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Quiz Details */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2">
                <Settings className="w-6 h-6 text-cyan-400" />
                <span>Quiz Configuration</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter quiz title"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
                      placeholder="Brief description of the quiz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        handleInputChange("categoryId", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          className="bg-gray-800"
                        >
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.durationInMinutes}
                        onChange={(e) =>
                          handleInputChange(
                            "durationInMinutes",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Target className="w-4 h-4 inline mr-1" />
                        Max Attempts
                      </label>
                      <input
                        type="number"
                        value={formData.maxAttempts}
                        onChange={(e) =>
                          handleInputChange(
                            "maxAttempts",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Start Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) =>
                          handleInputChange("startTime", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                      />
                      {errors.startTime && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.startTime}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        End Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) =>
                          handleInputChange("endTime", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                      />
                      {errors.endTime && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Access Type
                    </label>
                    <select
                      value={formData.accessType}
                      onChange={(e) =>
                        handleInputChange("accessType", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                    >
                      <option value="PUBLIC" className="bg-gray-800">
                        Public - Anyone can join
                      </option>
                      <option value="PRIVATE" className="bg-gray-800">
                        Private - Invite only
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Trophy className="w-4 h-4 inline mr-1" />
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        handleInputChange("difficulty", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                    >
                      <option value="EASY" className="bg-gray-800">
                        🟢 Easy
                      </option>
                      <option value="MEDIUM" className="bg-gray-800">
                        🟡 Medium
                      </option>
                      <option value="HARD" className="bg-gray-800">
                        🔴 Hard
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Passing Marks (%)
                    </label>
                    <input
                      type="number"
                      value={formData.passingMarks}
                      onChange={(e) =>
                        handleInputChange(
                          "passingMarks",
                          parseInt(e.target.value)
                        )
                      }
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) =>
                        handleInputChange("instructions", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
                      placeholder="Instructions for quiz participants"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Next: Add Questions</span>
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Questions */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <span>Quiz Questions ({questions.length})</span>
              </h2>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-cyan-400">
                      Question {index + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Question Text *
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "question",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
                        placeholder="Enter your question here..."
                      />
                      {errors[`question_${question.id}`] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors[`question_${question.id}`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-gray-300">
                          Answer Options * (Select the correct answer)
                        </label>
                        <button
                          onClick={() => addOption(question.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Option</span>
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="radio"
                              name={`correct_${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() =>
                                updateQuestion(
                                  question.id,
                                  "correctAnswer",
                                  optionIndex
                                )
                              }
                              className="w-4 h-4 text-cyan-400 border-white/20 focus:ring-cyan-400 focus:ring-2"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              onClick={() =>
                                removeOption(question.id, optionIndex)
                              }
                            >
                              <Trash />
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors[`options_${question.id}`] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors[`options_${question.id}`]}
                        </p>
                      )}
                      {errors[`correct_${question.id}`] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors[`correct_${question.id}`]}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Marks
                        </label>
                        <input
                          type="number"
                          value={question.marks}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "marks",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Explanation (Optional)
                        </label>
                        <input
                          type="text"
                          value={question.explanation}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "explanation",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Explain the correct answer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Review Quiz</span>
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
                <span>Review Your Quiz</span>
              </h2>

              {/* Quiz Summary */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="font-semibold text-cyan-400 mb-2">
                      Quiz Details
                    </h3>
                    <p>
                      <span className="text-gray-400">Title:</span>{" "}
                      {formData.title}
                    </p>
                    <p>
                      <span className="text-gray-400">Category:</span>{" "}
                      {
                        categories.find((c) => c.id == formData.categoryId)
                          ?.name
                      }
                    </p>
                    <p>
                      <span className="text-gray-400">Difficulty:</span>{" "}
                      {formData.difficulty}
                    </p>
                    <p>
                      <span className="text-gray-400">Duration:</span>{" "}
                      {formData.durationInMinutes} minutes
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="font-semibold text-cyan-400 mb-2">
                      Quiz Statistics
                    </h3>
                    <p>
                      <span className="text-gray-400">Total Questions:</span>{" "}
                      {questions.length}
                    </p>
                    <p>
                      <span className="text-gray-400">Total Marks:</span>{" "}
                      {questions.reduce((sum, q) => sum + q.marks, 0)}
                    </p>
                    <p>
                      <span className="text-gray-400">Passing Marks:</span>{" "}
                      {formData.passingMarks}%
                    </p>
                    <p>
                      <span className="text-gray-400">Max Attempts:</span>{" "}
                      {formData.maxAttempts}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">
                  Questions Preview
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 bg-white/5 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">Question {index + 1}</h4>
                        <span className="text-sm text-cyan-400">
                          {question.marks} marks
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{question.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded-lg text-sm ${
                              question.correctAnswer === optionIndex
                                ? "bg-green-500/20 border border-green-500/50 text-green-300"
                                : "bg-white/5 text-gray-400"
                            }`}
                          >
                            {option.text || `Option ${optionIndex + 1}`}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className="text-sm text-gray-400 mt-2">
                          <span className="font-semibold">Explanation:</span>{" "}
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Questions</span>
                </button>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>
                      {isSubmitting ? "Publishing..." : "Publish Quiz"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
