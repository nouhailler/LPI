export type VfsNodeType = 'file' | 'directory' | 'symlink';

export interface VfsNode {
  name: string;
  type: VfsNodeType;
  mode: number; // e.g. 0o755, 0o644, 0o750
  owner: string; // e.g. 'student', 'root'
  group: string; // e.g. 'student', 'root', 'developers'
  size: number;
  mtime: Date;
  content?: string; // For files
  children?: Record<string, VfsNode>; // For directories: name -> VfsNode
  target?: string; // For symlinks
}

export interface VfsProcess {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  vsz: number;
  rss: number;
  tty: string;
  stat: string;
  start: string;
  time: string;
  command: string;
}

export interface CommandExecutionResult {
  output: string;
  exitCode: number;
  error?: string;
  cleared?: boolean;
}

export interface LabScenarioValidation {
  isComplete: boolean;
  score: number;
  feedback: string;
  feedbackFr: string;
  unmetCriteria: string[];
  unmetCriteriaFr: string[];
}

export interface SimulatedLabScenario {
  id: string;
  title: string;
  titleFr: string;
  certification: 'lpic-1' | 'lpic-2' | 'lpic-3';
  category: 'permissions' | 'files' | 'processes' | 'scripts' | 'network' | 'storage' | 'security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyFr: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedMinutes: number;
  goal: string;
  goalFr: string;
  initialDirectory: string;
  initialSetup?: (fs: any, interpreter?: any) => void;
  instructions: string[];
  instructionsFr: string[];
  hints: string[];
  hintsFr: string[];
  solutionCommands: string[];
  solutionExplanation: string;
  solutionExplanationFr: string;
  validate: (fs: any, interpreter: any) => LabScenarioValidation;
}
