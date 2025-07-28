"use client";

import React, { useState } from "react";
import {
  Clock,
  Users,
  Copy,
  Check,
  Trash2,
  Calendar,
  Play,
  Square,
  BookOpen,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "@/lib/axios";
import { RoomType } from "@/utlis/types";
import RoomCodeDialog from "./RoomCodeDialog";



interface RoomCardProps {
  rooms: RoomType[];
  onRoomDeleted?: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ rooms, onRoomDeleted }) => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGetCode = (room: RoomType) => {
    setSelectedRoom(room);
    setShowCodeDialog(true);
  };

  const handleDeleteRoom = (room: RoomType) => {
    setSelectedRoom(room);
    setShowDeleteDialog(true);
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

  const confirmDelete = async () => {
    if (!selectedRoom) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(`/room/${selectedRoom.id}`);
      
      if (res.data.success) {
        toast.success('Room deleted successfully!');
        setShowDeleteDialog(false);
        onRoomDeleted?.(selectedRoom.id);
      } else {
        toast.error(res.data.message || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoomStatus = (room: RoomType) => {
    const now = new Date();
    const startTime = new Date(room.startTime);
    const endTime = new Date(room.endTime);

    if (now < startTime) {
      return { status: 'upcoming', color: 'text-blue-400 bg-blue-400/20 border-blue-400/30' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'active', color: 'text-green-400 bg-green-400/20 border-green-400/30' };
    } else {
      return { status: 'ended', color: 'text-gray-400 bg-gray-400/20 border-gray-400/30' };
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-300">No Rooms Created</h3>
        <p className="text-gray-400 mb-6">
          You haven't created any quiz rooms yet. Create your first room to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto pb-20">
        {rooms.map((room) => {
          const roomStatus = getRoomStatus(room);
          
          return (
            <div
              key={room.id}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col h-full">
                {/* Room Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                      {room.title}
                    </h3>
                  </div>
                  <span className={`ml-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${roomStatus.color} flex-shrink-0 capitalize`}>
                    {roomStatus.status}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 mb-4 sm:mb-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{room.quiz.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{formatDateTime(room.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Ends: {formatDateTime(room.endTime)}</span>
                    </div>
                  </div>

                  {/* Code Preview */}
                  <div className="bg-white/5 rounded-lg p-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Room Code:</span>
                      <span className="text-sm font-mono font-bold text-purple-400">
                        {room.roomCode}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center space-x-2 text-xs">
                    {roomStatus.status === 'active' ? (
                      <Play className="w-3 h-3 text-green-400" />
                    ) : (
                      <Square className="w-3 h-3 text-gray-400" />
                    )}
                    <span className="text-gray-400">
                      {room.isActive ? 'Live' : 'Scheduled'}
                    </span>
                  </div>
                </div>

                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGetCode(room)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-1 text-xs sm:text-sm"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Get Code</span>
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room)}
                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-bold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Code Dialog */}
      {showCodeDialog && selectedRoom && (
       <RoomCodeDialog selectedRoom={selectedRoom} setShowCodeDialog={setShowCodeDialog}/>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-md w-full">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-4">Delete Room?</h3>
              <p className="text-gray-300 mb-2 text-sm sm:text-base font-semibold">
                {selectedRoom.title}
              </p>
              <p className="text-gray-400 mb-6 text-sm">
                This action cannot be undone. All participants will lose access to this room.
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};