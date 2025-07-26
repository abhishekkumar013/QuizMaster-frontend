interface Category {
  id: string;
  name: string;
}
interface CreatedBy {
  id: string;
  user: {
    id?: string;
    name: string;
    email: string;
  };
}
export interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions: string;
  status: string;
  durationInMinutes: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  totalMarks: number;
  maxAttempts: number;
  startTime: string;
  endTime: string;
  isReachMaxAttempt?: boolean;
  category: Category;
  createdBy: CreatedBy;
}

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "MEDIUM":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    case "HARD":
      return "bg-red-500/20 text-red-300 border-red-500/50";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/50";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isQuizActive = (startTime: string, endTime: string) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
};
