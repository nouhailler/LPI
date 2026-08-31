export type TabType = 'dashboard' | 'path' | 'practice' | 'flashcards';

export interface ExamTier {
  id: string;
  name: string;
  subtitle: string;
  levelTag: string;
  badgeUrl: string;
  status: 'passed' | 'in_progress' | 'locked';
  description: string;
  validity?: string;
  prerequisites?: string;
  exams: ExamInfo[];
}

export interface ExamInfo {
  id: string;
  code: string;
  name: string;
  topics: string;
  progress: number;
  status: 'passed' | 'in_progress' | 'locked';
  totalQuestions?: number;
}

export interface PracticeQuestion {
  id: number;
  examId: string;
  category: string;
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  commandSnippet?: string;
}

export interface Flashcard {
  id: number;
  deck: 'Linux Essentials' | 'LPIC-1 System' | 'LPIC-1 Networking' | 'LPIC-1 Storage';
  command: string;
  definition: string;
  example: string;
  exampleExplanation: string;
  status?: 'unseen' | 'learning' | 'mastered';
}

export interface UserStats {
  name: string;
  role: string;
  currentTarget: string;
  streakDays: number;
  dailyGoal: number;
  questionsDoneToday: number;
  pathCompletionPct: number;
  systemArchitectureProgress: number;
  linuxInstallationProgress: number;
}
