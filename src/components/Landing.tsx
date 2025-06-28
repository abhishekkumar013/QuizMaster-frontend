"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Zap,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/router";

export default function QuizLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  //   const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Quiz Sessions",
      description:
        "Create and join live quiz sessions with friends and compete in real-time",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description:
        "Get immediate feedback and detailed analytics after every quiz",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Leaderboards",
      description:
        "Climb the ranks and showcase your knowledge across different categories",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
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
        <Link
          href={"/signin"}
          className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Challenge Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Mind
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create, share, and compete in interactive quizzes with friends.
              Test your knowledge across unlimited topics and climb the global
              leaderboards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 flex items-center space-x-2">
                <Link href={"/home"}>Start Quiz</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div
            className={`transform transition-all duration-1000 delay-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative mx-auto w-full max-w-lg">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-left">
                          <div className="text-sm text-gray-300">
                            Question 5 of 10
                          </div>
                          <div className="text-lg font-semibold">
                            Science Quiz
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">85%</div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="text-left mb-4">
                      <div className="text-lg font-semibold mb-3">
                        What is the speed of light?
                      </div>
                      <div className="space-y-2">
                        {[
                          "299,792,458 m/s",
                          "300,000,000 m/s",
                          "250,000,000 m/s",
                          "350,000,000 m/s",
                        ].map((option, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl ${
                              i === 0
                                ? "bg-green-500/20 border border-green-500/50"
                                : "bg-white/5 border border-white/10"
                            } transition-all duration-300`}
                          >
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Why Choose QuizMaster?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the next generation of interactive learning with powerful
            features designed for modern quiz enthusiasts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group transform transition-all duration-500 hover:scale-105 ${
                activeFeature === index ? "scale-105" : ""
              }`}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 h-full">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 scale-110"
                        : "bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-cyan-500 group-hover:to-blue-600"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-3xl border border-white/20 p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of quiz enthusiasts and start your journey to
            becoming a quiz master today.
          </p>
          <button className="group px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 flex items-center space-x-3 mx-auto">
            <Link href={"/home"}>Get Started Now</Link>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center">
        <div className="container mx-auto px-6">
          <p className="text-gray-400">
            © 2025 QuizMaster. Designed for the future of interactive learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
