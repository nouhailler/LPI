export type LearningPathCategoryId =
  | 'fundamentals'
  | 'admin'
  | 'networking'
  | 'security'
  | 'practical'
  | 'skills';

export interface LearningPathCategory {
  id: LearningPathCategoryId;
  title: string;
  titleFr: string;
  emoji: string;
  description: string;
  descriptionFr: string;
}

export interface ModuleTheory {
  summary: string;
  summaryFr: string;
  whyItMatters: string;
  whyItMattersFr: string;
  commands: string[];
  codeSnippet?: {
    label: string;
    labelFr: string;
    code: string;
    explanation: string;
    explanationFr: string;
  };
  prodTrap: string;
  prodTrapFr: string;
}

export interface ModuleFlashcard {
  id: string;
  question: string;
  questionFr: string;
  answer: string;
  answerFr: string;
  codeSnippet?: string;
  examTip?: string;
  examTipFr?: string;
}

export interface ModulePracticeQuestion {
  id: string;
  question: string;
  questionFr: string;
  scenario?: string;
  scenarioFr?: string;
  options: string[];
  optionsFr?: string[];
  correctIndex: number;
  explanation: string;
  explanationFr: string;
  commandSnippet?: string;
}

export interface ModuleLabStep {
  stepNumber: number;
  title: string;
  titleFr: string;
  instruction: string;
  instructionFr: string;
  hint?: string;
  hintFr?: string;
  expectedCommands: string[];
  simulatedOutput: string;
  explanation: string;
  explanationFr: string;
}

export interface ModuleLab {
  id: string;
  title: string;
  titleFr: string;
  goal: string;
  goalFr: string;
  context: string;
  contextFr: string;
  steps: ModuleLabStep[];
}

export interface ModuleTroubleshooting {
  id: string;
  title: string;
  titleFr: string;
  symptom: string;
  symptomFr: string;
  investigationCommands: string[];
  diagnosticOutput: string;
  rootCause: string;
  rootCauseFr: string;
  solutionCommand: string;
  solutionExplanation: string;
  solutionExplanationFr: string;
}

export interface PathModule {
  id: string;
  number: number;
  title: string;
  titleFr: string;
  conceptTag: string;
  conceptTagFr: string;
  shortDesc: string;
  shortDescFr: string;

  // Pedagogical orchestration dimensions:
  theory: ModuleTheory;
  flashcards: ModuleFlashcard[];
  question: ModulePracticeQuestion;
  lab: ModuleLab;
  troubleshooting: ModuleTroubleshooting;

  // LPI Integration references:
  linkedLpiObjective?: string; // e.g. "103.1", "104.5", "201.1", "303.2"
  explainTopic?: string; // topic key for ExplainDifferentlyModal
  glossaryTerms?: string[]; // e.g. ["chmod", "chown", "umask"]

  // Legacy field support for backward compatibility:
  whyItMatters: string;
  whyItMattersFr: string;
  commands: string[];
  codeSnippet?: {
    label: string;
    labelFr: string;
    code: string;
    explanation: string;
    explanationFr: string;
  };
  prodTrap: string;
  prodTrapFr: string;
  checklist: string[];
  checklistFr: string[];
  trainingTabAction?: 'training' | 'glossary' | 'practice';
}

export interface MidTermEvaluation {
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  passingScorePct: number;
  questions: ModulePracticeQuestion[];
}

export interface FinalEvaluation {
  title: string;
  titleFr: string;
  scenario: string;
  scenarioFr: string;
  deliverables: string[];
  deliverablesFr: string[];
  validationCriteria: string[];
  validationCriteriaFr: string[];
  finalQuiz?: ModulePracticeQuestion[];
}

export interface LearningPath {
  id: string;
  category: LearningPathCategoryId;
  emoji: string;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  description: string;
  descriptionFr: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyFr: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedHours: number;
  badgeColor: string;
  themeColor: string;
  borderColor: string;
  textColor: string;
  accentHex: string;
  bgGradient: string;

  // Structured pedagogical model:
  objectives: string[];
  objectivesFr: string[];
  prerequisites: string[];
  prerequisitesFr: string[];

  modules: PathModule[];
  midTermEvaluation: MidTermEvaluation;
  finalEvaluation: FinalEvaluation;

  badgeEarned: {
    title: string;
    titleFr: string;
    icon: string;
  };

  // Aliases for backward compatibility:
  steps: PathModule[];
  capstone: FinalEvaluation;
}
