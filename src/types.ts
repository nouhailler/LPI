export type TabType = 'dashboard' | 'learning' | 'path' | 'practice' | 'flashcards' | 'glossary' | 'training';

export type GlossaryItemType = 'command' | 'concept' | 'file' | 'function_or_directive';

export interface GlossaryFlagOrParam {
  flag: string;
  description: string;
}

export interface OctalBreakdownItem {
  digit: string | number;
  target: string;
  targetFr?: string;
  permissions: string;
  explanation?: string;
  explanationFr?: string;
}

export interface CommandCommonError {
  error: string;
  errorFr?: string;
  explanation: string;
  explanationFr?: string;
  correction?: string;
}

export interface SimilarCommandItem {
  command: string;
  distinction: string;
  distinctionFr?: string;
}

export interface AssociatedExamQuestion {
  questionId: number | string;
  title: string;
  titleFr?: string;
  preview: string;
  previewFr?: string;
  objectiveId?: string;
  examId?: string;
  fullQuestion?: {
    question: string;
    questionFr?: string;
    options: string[];
    optionsFr?: string[];
    correctIndex: number;
    explanation: string;
    explanationFr?: string;
  };
}

export interface AssociatedLabItem {
  labId: string;
  title: string;
  titleFr?: string;
  goal: string;
  goalFr?: string;
  difficulty?: string;
  estimatedMinutes?: number;
  scenarioId?: string;
}

export interface CommandPedagogy {
  commandExample?: string; // e.g. "chmod 640 fichier"
  whyTitle?: string;
  whyTitleFr?: string;
  why: {
    summary?: string;
    summaryFr?: string;
    breakdown?: OctalBreakdownItem[];
    details?: string[];
    detailsFr?: string[];
  };
  whenToUse: string;
  whenToUseFr?: string;
  commonErrors: CommandCommonError[];
  similarCommands: SimilarCommandItem[];
  associatedExamQuestion?: AssociatedExamQuestion;
  associatedLab?: AssociatedLabItem;
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
  pedagogy?: CommandPedagogy;
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

export type SRSState = 'new' | 'learning' | 'review' | 'mastered';
export type SRSRating = 'hard' | 'good' | 'easy' | 'mastered';

export interface SRSCardRecord {
  cardId: number;
  state: SRSState;
  intervalLevel: number; // 0: 10 min, 1: 1j, 2: 3j, 3: 7j, 4: 14j, 5: 30j, 6: 60j
  intervalLabel: string; // "10 min", "1 jour", "3 jours", "7 jours", "14 jours", "30 jours", "60 jours"
  dueDate: string; // ISO string
  lastReviewedAt?: string;
  repetitions: number;
  lapses: number;
  lastRating?: SRSRating;
}

export interface SRSDeckSummary {
  dueTodayCount: number;
  newCount: number;
  learningCount: number;
  reviewCount: number;
  masteredCount: number;
  totalCards: number;
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
  srsRecord?: SRSCardRecord;
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

export interface ExamSessionHistory {
  id: string;
  examId: string;
  examCode: string;
  examName: string;
  date: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

// ----------------------------------------------------
// Specialized Interactive Training Modules
// ----------------------------------------------------

export type TrainingModeType =
  | 'virtual_terminal'
  | 'incident_response'
  | 'fill_in_blank'
  | 'troubleshooting'
  | 'sequencing'
  | 'matching'
  | 'guided_labs';

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

export type DiagnosticDomainId =
  | 'architecture'
  | 'commands'
  | 'filesystems'
  | 'bash'
  | 'networking'
  | 'security';

export interface DiagnosticDomainScore {
  domainId: DiagnosticDomainId;
  name: string;
  nameFr: string;
  totalQuestions: number;
  correctQuestions: number;
  percentage: number;
  level: 'high' | 'medium' | 'low'; // 🟢 high (>=75%), 🟠 medium (50-74%), 🔴 low (<50%)
  associatedTopicId: string;
  associatedTopicNumber: number;
  summaryNoteFr: string;
  summaryNoteEn: string;
}

export interface DiagnosticQuestion {
  id: number;
  domainId: DiagnosticDomainId;
  question: string;
  questionFr: string;
  commandSnippet?: string;
  options: string[];
  optionsFr: string[];
  correctIndex: number;
  explanation: string;
  explanationFr: string;
  topicId: string;
  topicNumber: number;
  objectiveId: string;
}

export interface DiagnosticResult {
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  domainScores: DiagnosticDomainScore[];
  topPriorities: DiagnosticDomainScore[];
  answers: Record<number, number>;
}

// ----------------------------------------------------
// 🚨 Realistic Incident Response Scenarios
// ----------------------------------------------------

export interface IncidentDiagnosticCommand {
  command: string;
  aliases?: string[];
  category: 'systemd' | 'network' | 'storage' | 'logs' | 'process' | 'security' | 'kernel';
  output: string;
  analysis: string;
  analysisFr?: string;
  isKeyEvidence?: boolean;
}

export interface IncidentProgressiveHint {
  level: 1 | 2 | 3;
  title: string;
  titleFr?: string;
  hint: string;
  hintFr?: string;
  penaltyPoints?: number;
}

export interface IncidentRCAOption {
  id: string;
  text: string;
  textFr?: string;
  isCorrect: boolean;
  feedback: string;
  feedbackFr?: string;
}

export interface IncidentRCAQuestion {
  id: string;
  type: 'root_cause' | 'immediate_action' | 'prevention' | 'long_term_fix';
  title: string;
  titleFr?: string;
  question: string;
  questionFr?: string;
  options: IncidentRCAOption[];
}

export interface IncidentScenario {
  id: string;
  title: string;
  titleFr: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timeLimitMinutes: number; // e.g. 15 minutes
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  topicNumber: number;
  objectiveId: string;
  category: string;
  context: string;
  contextFr: string;
  symptoms: string[];
  symptomsFr: string[];
  diagnosticCommands: IncidentDiagnosticCommand[];
  progressiveHints: IncidentProgressiveHint[];
  rcaQuestions: IncidentRCAQuestion[];
  postMortemReport: {
    summary: string;
    summaryFr?: string;
    timeline: string[];
    timelineFr?: string[];
    sysadminKeyTakeaways: string[];
    sysadminKeyTakeawaysFr?: string[];
  };
}

// ----------------------------------------------------
// 🔥 WEAKNESS ENGINE (Moteur d'analyse des faiblesses)
// ----------------------------------------------------

export type WeaknessDomainId =
  | 'networking'
  | 'scripting'
  | 'security'
  | 'filesystems'
  | 'commands'
  | 'boot'
  | 'packages';

export interface WeaknessSubtopicMetric {
  id: string;
  name: string;
  nameFr: string;
  errorsCount: number;
  luckyGuessesCount?: number;
  skippedCount?: number;
  descriptionFr?: string;
}

export interface WeaknessQuestionDetail {
  id: string | number;
  question: string;
  questionFr?: string;
  category: string;
  subtopic: string;
  correctAnswer: string;
  explanation: string;
  explanationFr?: string;
  mistakeReason?: string;
  mistakeReasonFr?: string;
}

export interface WeaknessDomainStats {
  id: WeaknessDomainId;
  name: string;
  nameFr: string;
  masteryPct: number; // e.g. 41 for 41%
  totalErrors: number; // e.g. 12
  subtopics: WeaknessSubtopicMetric[];
  luckyGuessesCount: number; // Questions répondues par hasard / avec hésitation
  skippedCount: number; // Questions sautées
  failedLabsCount: number; // Labs échoués sur ce thème
  untestedSubtopicsCount: number; // Sujets jamais étudiés
  timeSpentAvgSeconds: number; // Temps moyen (anormalement élevé = hésitation)
  status: 'critical' | 'moderate' | 'review' | 'solid';
  whyWeakExplanation: string;
  whyWeakExplanationFr: string;
  commonPitfalls: string[];
  commonPitfallsFr: string[];
  recommendedAction: string;
  recommendedActionFr: string;
  targetObjectiveIds: string[];
  sampleMistakes: WeaknessQuestionDetail[];
}

export interface WeaknessEngineReport {
  domains: WeaknessDomainStats[];
  totalErrors: number;
  totalLuckyGuesses: number;
  totalSkipped: number;
  totalFailedLabs: number;
  untestedTopicsCount: number;
  overallHealthPct: number;
  lastUpdated: string;
}


