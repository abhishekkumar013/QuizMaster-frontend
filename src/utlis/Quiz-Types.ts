type OptionType = {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number;
};

type QuestionType = {
  id: string;
  quizId: string;
  text: string;
  score: number;
  explanation: string | null;
  marks: number;
  order: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  options: OptionType[];
};

type UserType = {
  name: string;
  email: string;
};

type CreatedByType = {
  id: string;
  user: UserType;
};

type CategoryType = {
  id: string;
  name: string;
};

export type QuizType = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  totalMarks: number;
  accessType: "PUBLIC" | "PRIVATE";
  status: "DRAFT" | "PUBLISHED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  passingMarks: number;
  maxAttempts: number;
  durationInMinutes: number;
  startTime: string;
  endTime: string;
  createdBy: CreatedByType;
  questions: QuestionType[];
  category: CategoryType;
};
export type QuizList = QuizType[];
