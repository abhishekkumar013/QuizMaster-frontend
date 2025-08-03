export interface SigninFormData {
  email: string;
  password: string;
  role: string;
}
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  parentEmail: string;
  phone: string;
  experienceYears: number;
}
export interface UpdateFormData {
  name: string;
  email: string;
  role: string;
  parentEmail: string;
  phone: string;
  experienceYears: number;
  id: string;
}

export interface SwitchAccounFormData {
  email: string;
  targetRole: string;
}

export interface ParentUser {
  email?: string;
  id?: string;
  phone?: string;
  name?: string;
}

export interface ParentDetail {
  user?: ParentUser;
}

export interface AuthUser {
  id: string;
  roleId: string;
  email: string;
  role: string;
  name: string;
  phone?: string;
  experienceYears?: number;
  parentEmail?: string;
  parentDetail?: ParentDetail;
  parent?: ParentUser;
}

export interface ResultItem {
  id: string;
  quizId: string;
  rank?: number;
  studentId: string;
  sessionId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  questionsAttempted: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsSkipped: number;
  timeTaken: number;
  isPassed: boolean;
  attemptNumber: number;
  submittedAt: string; // ISO date

  quiz: {
    title: string;
    totalMarks: number;
    durationInMinutes: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    passingMarks: number;
    category: {
      name: string;
    };
    createdBy: {
      user: {
        name: string;
        email: string;
      };
    };
  };

  student: {
    id: string;
    Rank: number;
    points: number;
  };
}

export interface AllReportResponse {
  rank: number;
  points: number;
  results: ResultItem[];
}

export interface CreateFormDataType {
  title: string;
  description: string;
  instructions: string;
  categoryId: string;
  accessType: "PUBLIC" | "PRIVATE";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  durationInMinutes: number;
  totalMarks: number;
  passingMarks: number;
  maxAttempts: number;
  startTime: string;
  endTime: string;
  status: "DRAFT" | "PUBLISHED";
}

export type OptionType = {
  text: string;
  isCorrect: boolean;
  order: number;
};

export type QuestionType = {
  id: number;
  text: string;
  options: OptionType[];
  score: number;
  marks: number;
  explanation: string;
  order: number;
  isRequired: boolean;
};

export type CategoryType = {
  id: string;
  name: String;
};

export type FormErrorsType = Partial<Record<keyof CreateFormDataType, string>>;
export type QuestionErrorsType = Record<string, string>;
export type AllErrorsType = FormErrorsType & QuestionErrorsType;

export type OptionType2 = {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
};

export type UpdateQuestionType = {
  id: string;
  text: string;
  explanation: string;
  isRequired: boolean;
  marks: number;
  order: number;
  score: number;
  options: OptionType2[];
};

export interface RoomType {
  id: string;
  quizId: string;
  teacherId: string;
  roomCode: string;
  title: string;
  startTime: string;
  endTime: string;
  showReport: boolean;
  createdAt: string;
  updatedAt: string;
  quiz: {
    title: string;
  };
  isActive: boolean;
}

interface QuizEvaluation {
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
  marksAwarded: number;
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  skipped: boolean;
  totalMarks: number;
}

export interface ResultType {
  id: string;
  isPassed: boolean;
  percentage: number;
  questionsAttempted: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsSkipped: number;
  score: number;
  timeTaken: number;
  totalMarks: number;
  evaluation: QuizEvaluation[];
  attemptNumber: number;
}

export interface RoomStatsDataType {
  studentsJoined: string;
  highestScore: string;
  totalSubmissions: string;
}
