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
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import { RootState } from "@/store/slice";
import { GetCategory } from "@/store/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import BackButtonLogo from "@/components/BackButton-Logo";
import { AppDispatch } from "@/store/slice";
import {
  AllErrorsType,
  CategoryType,
  CreateFormDataType,
  FormErrorsType,
  QuestionErrorsType,
  QuestionType,
} from "@/utlis/types";

export default function CreateQuizPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Mock categories for demonstration
  const categoryState = useSelector((state: RootState) => state.category);
  const { category } = categoryState;

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [defultMark, setDefaultMark] = useState<number>(1);

  useEffect(() => {
    dispatch(GetCategory());
  }, [dispatch]);

  useEffect(() => {
    setCategories(category);
  }, [category]);

  const [formData, setFormData] = useState<CreateFormDataType>({
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

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    setQuestions([
      {
        id: 1,
        text: "",
        options: [
          { text: "", isCorrect: false, order: 1 },
          { text: "", isCorrect: false, order: 2 },
        ],
        score: defultMark,
        marks: defultMark,
        explanation: "",
        order: 1,
        isRequired: true,
      },
    ]);
  }, [defultMark]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<AllErrorsType>({});

  useEffect(() => {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setFormData((prev) => ({
      ...prev,
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
    }));
  }, []);

  useEffect(() => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.score === defultMark || q.score === 1
          ? { ...q, score: defultMark, marks: defultMark }
          : q
      )
    );
  }, [defultMark]);

  const handleInputChange = (field, value) => {
    console.log(field, "-", value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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
      score: defultMark,
      marks: defultMark,
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
      alert("Minimum 2 Options Required");
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
    const newErrors: FormErrorsType = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryId || formData.categoryId.trim() === "") {
      newErrors.categoryId = "Category is required";
    }
    if (!formData.accessType) newErrors.accessType = "Access type is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";

    if (!formData.durationInMinutes || formData.durationInMinutes <= 0) {
      newErrors.durationInMinutes = "Duration must be greater than 0";
    }
    if (!formData.maxAttempts || formData.maxAttempts <= 0) {
      newErrors.maxAttempts = "Max attempts must be greater than 0";
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestions = () => {
    const newErrors: QuestionErrorsType = {};

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
      setErrors(newErrors);
      return false;
    }

    questions.forEach((q, index) => {
      // Question text validation
      if (!q.text || q.text.trim() === "") {
        newErrors[`question_${q.id}`] = `Question ${
          index + 1
        } text is required`;
      }

      // Score validation
      if (typeof q.score !== "number" || q.score < 0) {
        newErrors[`score_${q.id}`] = `Question ${
          index + 1
        } score must be a non-negative number`;
      }

      // Order validation
      if (typeof q.order !== "number" || q.order < 0) {
        newErrors[`order_${q.id}`] = `Question ${
          index + 1
        } order must be a non-negative number`;
      }

      // Options validation
      if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
        newErrors[`options_${q.id}`] = `Question ${
          index + 1
        } must have at least 2 options`;
      } else {
        // Validate each option
        let hasCorrectAnswer = false;
        q.options.forEach((option, optIndex) => {
          if (!option.text || option.text.trim() === "") {
            newErrors[`option_${q.id}_${optIndex}`] = `Question ${
              index + 1
            }, Option ${optIndex + 1} text is required`;
          }
          if (typeof option.isCorrect !== "boolean") {
            newErrors[`option_correct_${q.id}_${optIndex}`] = `Question ${
              index + 1
            }, Option ${optIndex + 1} isCorrect must be a boolean`;
          }
          if (option.isCorrect) {
            hasCorrectAnswer = true;
          }
        });

        if (!hasCorrectAnswer) {
          newErrors[`correct_${q.id}`] = `Question ${
            index + 1
          } must have at least one correct answer`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!validateForm()) {
        setIsSubmitting(false);
        toast.error("form not valid");
        return;
      }

      // If not draft, validate questions
      if (!isDraft && !validateQuestions()) {
        setIsSubmitting(false);
        toast.error("question not valid");
        return;
      }

      const calculatedTotalMarks = questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );

      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        instructions: formData.instructions?.trim() || null,
        startTime: formData.startTime,
        endTime: formData.endTime,
        categoryId: formData.categoryId,
        accessType: formData.accessType,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        difficulty: formData.difficulty,
        durationInMinutes: formData.durationInMinutes,
        totalMarks: calculatedTotalMarks,
        passingMarks: formData.passingMarks,
        maxAttempts: formData.maxAttempts,
        // Questions
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

      const res = await axios.post("/quiz/create-quiz-question", payload);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
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
        <BackButtonLogo />

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
                      onChange={(e) => {
                        handleInputChange("categoryId", e.target.value);
                        // console.log("e Category ID:", e.target.value);
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          className="bg-gray-800"
                        >
                          {cat.name}
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
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        value={formData.durationInMinutes}
                        onChange={(e) =>
                          handleInputChange(
                            "durationInMinutes",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min="1"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                      />
                      {errors.durationInMinutes && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.durationInMinutes}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Target className="w-4 h-4 inline mr-1" />
                        Max Attempts *
                      </label>
                      <input
                        type="number"
                        value={formData.maxAttempts}
                        onChange={(e) =>
                          handleInputChange(
                            "maxAttempts",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min="1"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                      />
                      {errors.maxAttempts && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.maxAttempts}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Target className="w-4 h-4 inline mr-1" />
                        Default Marks *
                      </label>
                      <input
                        type="number"
                        value={defultMark}
                        onChange={(e) => setDefaultMark(Number(e.target.value))}
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
                      Access Type *
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
                    {errors.accessType && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.accessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Trophy className="w-4 h-4 inline mr-1" />
                      Difficulty Level *
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
                    {errors.difficulty && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.difficulty}
                      </p>
                    )}
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
                          parseInt(e.target.value) || 0
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
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, "text", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
                        placeholder="Enter your question"
                      />
                      {errors[`question_${question.id}`] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors[`question_${question.id}`]}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Score *
                        </label>
                        <input
                          type="number"
                          value={question.score}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "score",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                        />
                        {errors[`score_${question.id}`] && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors[`score_${question.id}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Marks *
                        </label>
                        <input
                          type="number"
                          value={question.marks}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "marks",
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "explanation",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
                        placeholder="Explanation for the correct answer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-gray-300">
                          Options * (Select the correct answer)
                        </label>
                        <button
                          onClick={() => addOption(question.id)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Option</span>
                        </button>
                      </div>

                      {errors[`options_${question.id}`] && (
                        <p className="text-red-400 text-sm mb-2">
                          {errors[`options_${question.id}`]}
                        </p>
                      )}

                      {errors[`correct_${question.id}`] && (
                        <p className="text-red-400 text-sm mb-2">
                          {errors[`correct_${question.id}`]}
                        </p>
                      )}

                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="radio"
                              name={`correct_${question.id}`}
                              checked={option.isCorrect}
                              onChange={() =>
                                setCorrectAnswer(question.id, optIndex)
                              }
                              className="w-4 h-4 text-cyan-400 bg-white/10 border-gray-300 focus:ring-cyan-400 focus:ring-2"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  optIndex,
                                  "text",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            {question.options.length > 2 && (
                              <button
                                onClick={() =>
                                  removeOption(question.id, optIndex)
                                }
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`required_${question.id}`}
                        checked={question.isRequired}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "isRequired",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-cyan-400 bg-white/10 border-gray-300 rounded focus:ring-cyan-400 focus:ring-2"
                      />
                      <label
                        htmlFor={`required_${question.id}`}
                        className="text-sm text-gray-300"
                      >
                        Required Question
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Details</span>
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
                <span>Review Quiz</span>
              </h2>
              <p className="text-gray-300 mt-2">
                Review your quiz details and questions before publishing
              </p>
            </div>

            <div className="space-y-8">
              {/* Quiz Details Summary */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quiz Details</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Title
                      </label>
                      <p className="text-white font-medium">
                        {formData.title || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Description
                      </label>
                      <p className="text-white">
                        {formData.description || "No description provided"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Category
                      </label>
                      <p className="text-white">
                        {categories.find(
                          (cat) => cat.id === formData.categoryId
                        )?.name || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Access Type
                      </label>
                      <p className="text-white capitalize">
                        {formData.accessType?.toLowerCase()}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Difficulty
                      </label>
                      <p className="text-white flex items-center space-x-2">
                        <span>
                          {formData.difficulty === "EASY" && "🟢"}
                          {formData.difficulty === "MEDIUM" && "🟡"}
                          {formData.difficulty === "HARD" && "🔴"}
                        </span>
                        <span className="capitalize">
                          {formData.difficulty?.toLowerCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Duration
                      </label>
                      <p className="text-white flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formData.durationInMinutes} minutes</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Max Attempts
                      </label>
                      <p className="text-white flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>{formData.maxAttempts}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Start Time
                      </label>
                      <p className="text-white flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(formData.startTime).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        End Time
                      </label>
                      <p className="text-white flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(formData.endTime).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Total Marks
                      </label>
                      <p className="text-white flex items-center space-x-2">
                        <Trophy className="w-4 h-4" />
                        <span>
                          {questions.reduce(
                            (sum, q) => sum + (q.marks || 1),
                            0
                          )}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-400">
                        Passing Marks
                      </label>
                      <p className="text-white">{formData.passingMarks}%</p>
                    </div>
                  </div>
                </div>

                {formData.instructions && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <label className="text-sm font-semibold text-gray-400">
                      Instructions
                    </label>
                    <p className="text-white mt-1">{formData.instructions}</p>
                  </div>
                )}
              </div>

              {/* Questions Summary */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Questions ({questions.length})</span>
                </h3>

                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-gray-300">No questions added yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-semibold text-white">
                            Question {index + 1}
                            {question.isRequired && (
                              <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                                Required
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Score: {question.score}</span>
                            <span>Marks: {question.marks}</span>
                          </div>
                        </div>

                        <p className="text-white mb-4">
                          {question.text || "No question text"}
                        </p>

                        <div className="grid md:grid-cols-2 gap-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                option.isCorrect
                                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                                  : "bg-white/5 border-white/10 text-gray-300"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {option.isCorrect && (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                                <span className="text-sm font-medium">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span>
                                  {option.text || `Option ${optIndex + 1}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-400 font-medium mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-blue-300">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Validation Summary */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Validation Summary</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {formData.title ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={
                        formData.title ? "text-green-400" : "text-red-400"
                      }
                    >
                      Quiz title is {formData.title ? "set" : "missing"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {formData.categoryId ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={
                        formData.categoryId ? "text-green-400" : "text-red-400"
                      }
                    >
                      Category is{" "}
                      {formData.categoryId ? "selected" : "not selected"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {questions.length > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span
                      className={
                        questions.length > 0
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {questions.length} question
                      {questions.length !== 1 ? "s" : ""} added
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {questions.every(
                      (q) =>
                        q.text &&
                        q.options.length >= 2 &&
                        q.options.some((opt) => opt.isCorrect)
                    ) ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={
                        questions.every(
                          (q) =>
                            q.text &&
                            q.options.length >= 2 &&
                            q.options.some((opt) => opt.isCorrect)
                        )
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      All questions are{" "}
                      {questions.every(
                        (q) =>
                          q.text &&
                          q.options.length >= 2 &&
                          q.options.some((opt) => opt.isCorrect)
                      )
                        ? "complete"
                        : "incomplete"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {new Date(formData.startTime) <
                    new Date(formData.endTime) ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={
                        new Date(formData.startTime) <
                        new Date(formData.endTime)
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      Quiz timing is{" "}
                      {new Date(formData.startTime) < new Date(formData.endTime)
                        ? "valid"
                        : "invalid"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and Actions */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Questions</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? "Saving..." : "Save as Draft"}</span>
                </button>

                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || questions.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  <span>{isSubmitting ? "Publishing..." : "Publish Quiz"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
