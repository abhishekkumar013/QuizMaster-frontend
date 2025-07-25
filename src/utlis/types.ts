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
