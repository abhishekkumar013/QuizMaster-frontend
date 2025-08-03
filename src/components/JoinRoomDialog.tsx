"use client";
import { RoomType } from "@/utlis/types";
import { Check, Copy, LogIn, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/slice";

const JoinRoomDialog = ({
  setShowCodeDialog,
}: {
  setShowCodeDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      const existingSockets = (window as any).activeSockets || [];
      existingSockets.forEach((socket: any) => {
        if (socket && socket.connected) {
          socket.disconnect();
        }
      });
    };
  }, []);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    setIsJoining(true);
    let socket: Socket | null = null;

    try {
      const userId = user.id;
      const studentProfileId = user.roleId;

      if (!userId || !studentProfileId) {
        toast.error("Please log in to join a room");
        setIsJoining(false);
        return;
      }

      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4040";
      //   console.log("🔌 Connecting to socket:", socketUrl);

      socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
      });

      if (!(window as any).activeSockets) {
        (window as any).activeSockets = [];
      }
      (window as any).activeSockets.push(socket);

      socket.on("connect", () => {
        const joinData = {
          roomCode: roomCode,
          userId,
          studentProfileId,
        };

        socket!.emit("join-room", joinData);
      });

      socket.on(
        "quiz-started",
        ({ sessionId, roomId, quizId, roomStatsData }) => {
          // console.log("Quiz started received:", { sessionId, roomId });
          toast.success("Successfully joined the room!");

          localStorage.setItem("currentSessionId", sessionId);
          localStorage.setItem("currentRoomId", roomId);
          localStorage.setItem("currentQuizId", quizId);

          setShowCodeDialog(false);

          if (sessionId && roomId && quizId) {
            router.push(
              `/student/room/quiz?roomId=${roomId}&sessionId=${sessionId}&quizId=${quizId}&studentsJoined=${roomStatsData.studentsJoined}&highestScore=${roomStatsData.highestScore}&totalSubmissions=${roomStatsData.totalSubmissions}`
            );
          }

          setIsJoining(false);
          socket?.disconnect();
        }
      );

      socket.on("error", ({ message }) => {
        toast.error(
          message || "Failed to join room. Please check the room code."
        );
        setIsJoining(false);
        socket?.disconnect();
      });

      socket.on("connect_error", (error) => {
        toast.error("Failed to connect to server. Please try again.");
        setIsJoining(false);
        socket?.disconnect();
      });

      //   socket.onAny((eventName, ...args) => {
      //     console.log(`Socket event: ${eventName}`, args);
      //   });

      setTimeout(() => {
        if (isJoining && !socket?.connected) {
          socket?.disconnect();
          setIsJoining(false);
          toast.error(
            "Connection timeout. Please check your internet connection and try again."
          );
        }
      }, 15000);
    } catch (error) {
      toast.error(
        "An unexpected error occurred. Please try again to join room."
      );
      setIsJoining(false);
      socket?.disconnect();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isJoining) {
      handleJoinRoom();
    }
  };

  const handleClose = () => {
    if (!isJoining) {
      setShowCodeDialog(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-md w-full relative">
        <button
          onClick={handleClose}
          disabled={isJoining}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
            <p className="text-white/70 text-sm">
              Enter the room code to join an existing quiz room
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-white/90 text-left">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-wider transition-all duration-200"
              placeholder="ABCD1234"
              maxLength={8}
              disabled={isJoining}
              autoComplete="off"
            />
            <p className="text-white/50 text-xs mt-2 text-left">
              Enter the room code shared by your teacher
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-white transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isJoining}
            >
              Cancel
            </button>
            <button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim() || isJoining}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Joining Room...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Join Room
                </>
              )}
            </button>
          </div>

          {isJoining && (
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <p className="text-blue-200 text-sm">
                Connecting to room... Please wait.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinRoomDialog;
