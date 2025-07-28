import { BookOpen, Clock, Users } from "lucide-react";

const RoomQuizCard=()=>{
//     return <div className="pb-20">
//     {filteredQuizzes.length === 0 ? (
//       <div className="text-center py-12 sm:py-20">
//         <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
//           <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
//         </div>
//         <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-300">No quizzes found</h3>
//         <p className="text-gray-400 mb-6 text-sm sm:text-base">
//           {searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All"
//             ? "Try adjusting your search terms or filters."
//             : "No quizzes are available at the moment."}
//         </p>
//         {(searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All") && (
//           <button
//             onClick={() => {
//               setSearchTerm("");
//               setSelectedCategory("All");
//               setSelectedDifficulty("All");
//             }}
//             className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
//           >
//             Clear All Filters
//           </button>
//         )}
//       </div>
//     ) : (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
//         {filteredQuizzes.map((quiz) => (
//           <div
//             key={quiz.id}
//             className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
//           >
//             <div className="flex flex-col h-full">
//               {/* Quiz Header */}
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
//                     {quiz.title}
//                   </h3>
//                 </div>
//                 <span className={`ml-2 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(quiz.difficulty)} flex-shrink-0`}>
//                   {quiz.difficulty}
//                 </span>
//               </div>

//               {/* Quiz Info */}
//               <div className="flex-1 mb-4 sm:mb-6">
//                 <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
//                   {quiz.description}
//                 </p>

//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2 text-xs text-gray-400">
//                     <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
//                     <span className="truncate">{quiz.category.name}</span>
//                   </div>
//                   <div className="flex items-center space-x-2 text-xs text-gray-400">
//                     <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
//                     <span>{quiz.durationInMinutes} mins</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Select Button */}
//               <button
//                 onClick={() => handleSelectQuiz(quiz)}
//                 disabled={isCreatingRoom}
//                 className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
//               >
//                 <Users className="w-4 h-4 sm:w-5 sm:h-5" />
//                 <span>Create Room</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
}