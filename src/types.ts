export type TabType = 'dashboard' | 'learning' | 'path' | 'practice' | 'flashcards' | 'glossary' | 'training';

export type GlossaryItemType = 'command' | 'concept' | 'file' | 'function_or_directive';

export interface GlossaryFlagOrParam {
  flag: string;
  description: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  type: GlossaryItemType;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  examId: 'exam-101' | 'exam-102' | 'exam-201' | 'exam-202' | 'exam-300' | 'exam-303' | 'exam-305' | 'exam-306';
  objectiveId: string;
  topicNumber: number;
  topicTitle: string;
  category: string;
  definition: string;
  syntaxOrLocation?: string;
  flagsOrParameters?: GlossaryFlagOrParam[];
  exampleSnippet?: string;
  exampleExplanation?: string;
  examTips?: string;
  relatedTerms?: string[];
}

export interface LPICCommandSnippet {
  command: string;
  description: string;
  example: string;
  explanation?: string;
}

export interface ObjectiveQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LPICObjective {
  id: string; // e.g. "101.1"
  title: string;
  weight: number;
  description: string;
  keyKnowledgeAreas: string[];
  termsAndUtilities: string[];
  filesAndPaths: string[];
  keyCommands: LPICCommandSnippet[];
  studyNotes: string[];
  quickQuestions: ObjectiveQuizQuestion[];
}

export interface LPICTopic {
  id: string; // e.g. "topic-101", "topic-201", or "topic-301"
  topicNumber: number; // 101, 201, 301
  title: string; // "System Architecture", "Capacity Planning", "Samba Basics"
  totalWeight: number;
  examId: 'exam-101' | 'exam-102' | 'exam-201' | 'exam-202' | 'exam-300' | 'exam-303' | 'exam-305' | 'exam-306';
  certification?: 'lpic-1' | 'lpic-2' | 'lpic-3';
  description: string;
  objectives: LPICObjective[];
}

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
  deck: string;
  command: string;
  definition: string;
  example: string;
  exampleExplanation: string;
  question?: string;
  answer?: string;
  objectiveId?: string;
  topicNumber?: number;
  category?: string;
  examTip?: string;
  keyNotes?: string[];
  difficulty?: 'Fundamental' | 'Intermediate' | 'Advanced';
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

// ----------------------------------------------------
// Specialized Interactive Training Modules
// ----------------------------------------------------

export type TrainingModeType = 'fill_in_blank' | 'troubleshooting' | 'sequencing' | 'matching' | 'guided_labs';

export interface FillInTheBlankChallenge {
  id: string;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  topicNumber: number;
  objectiveId: string;
  category: string;
  prompt: string;
  promptFr?: string;
  scenario?: string;
  scenarioFr?: string;
  contextCode?: string;
  expectedAnswers: string[];
  caseSensitive?: boolean;
  placeholder: string;
  hint: string;
  hintFr?: string;
  explanation: string;
  explanationFr?: string;
}

export interface TroubleshootingOption {
  id: string;
  label: string;
  labelFr?: string;
  isCorrect: boolean;
  explanation: string;
  explanationFr?: string;
}

export interface TroubleshootingChallenge {
  id: string;
  title: string;
  titleFr?: string;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  topicNumber: number;
  objectiveId: string;
  category: string;
  scenario: string;
  scenarioFr?: string;
  codeSnippet: string;
  language?: 'bash' | 'config' | 'fstab' | 'cron' | 'systemd' | 'yaml' | 'json' | 'xml' | 'ldap' | string;
  bugDescription: string;
  bugDescriptionFr?: string;
  options: TroubleshootingOption[];
  correctedSnippet: string;
  fixExplanation: string;
  fixExplanationFr?: string;
}

export interface SequencingStep {
  id: string;
  label: string;
  labelFr?: string;
  detail: string;
  detailFr?: string;
}

export interface SequencingChallenge {
  id: string;
  title: string;
  titleFr?: string;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  topicNumber: number;
  objectiveId: string;
  category: string;
  description: string;
  descriptionFr?: string;
  steps: SequencingStep[]; // correct chronological order
  explanation: string;
  explanationFr?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  leftFr?: string;
  right: string;
  rightFr?: string;
  note?: string;
  noteFr?: string;
}

export interface MatchingGame {
  id: string;
  title: string;
  titleFr?: string;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  topicNumber: number;
  objectiveId: string;
  category: string;
  description: string;
  descriptionFr?: string;
  pairs: MatchingPair[];
}

export interface GuidedLabStep {
  id: string;
  stepNumber: number;
  title: string;
  titleFr?: string;
  instruction: string;
  instructionFr?: string;
  hint?: string;
  hintFr?: string;
  expectedCommands: string[];
  simulatedOutput: string;
  explanation: string;
  explanationFr?: string;
}

export interface GuidedLabScenario {
  id: string;
  title: string;
  titleFr?: string;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  topicNumber: number;
  objectiveId: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  goal: string;
  goalFr?: string;
  context: string;
  contextFr?: string;
  steps: GuidedLabStep[];
}

