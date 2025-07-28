"use client"
import { RoomType } from "@/utlis/types";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const RoomCodeDialog=({selectedRoom,setShowCodeDialog}:{selectedRoom:RoomType, setShowCodeDialog: React.Dispatch<React.SetStateAction<boolean>>})=>{
    const [copied, setCopied] = useState(false);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      };
    const handleCopyRoomCode = async () => {
        if (!selectedRoom) return;
    
        try {
          await navigator.clipboard.writeText(selectedRoom.roomCode);
          setCopied(true);
          toast.success('Room code copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Failed to copy room code:', error);
          toast.error('Failed to copy room code');
        }
      };

    return   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-md w-full">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Copy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold mb-4">Room Code</h3>
        <p className="text-gray-300 mb-2 text-sm sm:text-base font-semibold">
          {selectedRoom.title}
        </p>
        <p className="text-gray-400 mb-6 text-sm">
          Share this code with participants to join the quiz room:
        </p>

        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 break-all">
              {selectedRoom.roomCode}
            </span>
            <button
              onClick={handleCopyRoomCode}
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

        <div className="text-xs text-gray-400 mb-6 space-y-1">
          <p>Start: {formatDateTime(selectedRoom.startTime)}</p>
          <p>End: {formatDateTime(selectedRoom.endTime)}</p>
        </div>

        <button
          onClick={() => setShowCodeDialog(false)}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-bold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </div>
  </div>
}

export  default RoomCodeDialog;