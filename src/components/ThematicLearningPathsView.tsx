import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  BookOpen,
  ArrowDown,
  Copy,
  Check,
  AlertTriangle,
  Award,
  Clock,
  Briefcase,
  Terminal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  FileQuestion,
  FlaskConical,
  Search,
  CheckCircle,
  XCircle,
  ListOrdered,
  Layers,
  Wrench,
  Shield,
  Network,
  Cpu,
  Bookmark,
  ShieldCheck,
  GitBranch,
  Target,
  ExternalLink,
} from 'lucide-react';
import {
  allLearningPaths,
  learningPathCategories,
  LearningPath,
  LearningPathCategoryId,
  PathModule,
  ModulePracticeQuestion,
} from '../data/learningPaths';
import {
  getPathProgress,
  resetPathProgress,
  markAllPathSteps,
} from '../data/learningPaths/storage';
import {
  calculatePathAdaptiveMastery,
  completeAdaptiveActivity,
  resetPathAdaptiveMastery,
  saveEvaluation,
  CompetencyActivityType,
  PathAdaptiveMastery,
  markObjectiveMastered,
} from '../services/adaptivePathEngine';
import { AdaptiveCompetencyTree } from './learningPaths/AdaptiveCompetencyTree';
import { CompetencyActivityPanel } from './learningPaths/CompetencyActivityPanel';
import { TabType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ThematicLearningPathsViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenExplainDifferently?: (topic: string, mode?: any, context?: string) => void;
  initialPathId?: string;
  onOpenTerminalLab?: (labId?: string) => void;
}

export const ThematicLearningPathsView: React.FC<ThematicLearningPathsViewProps> = ({
  onNavigate,
  onOpenExplainDifferently,
  initialPathId = 'fund-beginner',
  onOpenTerminalLab,
}) => {
  const { isFrench } = useLanguage();

  // Active Category & Selected Path
  const [selectedCategory, setSelectedCategory] = useState<LearningPathCategoryId>(() => {
    try {
      const savedCat = localStorage.getItem('thematic_category_selected');
      if (
        savedCat === 'fundamentals' ||
        savedCat === 'admin' ||
        savedCat === 'networking' ||
        savedCat === 'security' ||
        savedCat === 'practical'
      ) {
        return savedCat as LearningPathCategoryId;
      }
    } catch {}
    return 'fundamentals';
  });

  const [selectedPathId, setSelectedPathId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('thematic_path_selected');
      if (saved && allLearningPaths.some((p) => p.id === saved)) {
        return saved;
      }
    } catch {}
    return initialPathId;
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // View Mode: 'tree' (Arborescence adaptative) vs 'pipeline' (Modules & activités détaillés)
  const [viewMode, setViewMode] = useState<'tree' | 'pipeline'>('tree');

  // Trigger for reactive adaptive recalculation across all platform modules
  const [adaptiveTick, setAdaptiveTick] = useState(0);

  // UI Expanded & Interaction States
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [activeStepTab, setActiveStepTab] = useState<Record<string, CompetencyActivityType>>({});
  const [midTermSelectedAnswers, setMidTermSelectedAnswers] = useState<Record<string, number>>({});
  const [finalQuizSelectedAnswers, setFinalQuizSelectedAnswers] = useState<Record<string, number>>({});
  const [showEvaluationFeedback, setShowEvaluationFeedback] = useState<Record<string, boolean>>({});

  // Synchronize storage and cross-module updates
  useEffect(() => {
    const handleUpdate = () => {
      setAdaptiveTick((t) => t + 1);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('adaptive_path_updated', handleUpdate);
    window.addEventListener('learning_path_updated', handleUpdate);
    window.addEventListener('lpi_virtual_lab_completed', handleUpdate);
    window.addEventListener('srs_updated', handleUpdate);
    window.addEventListener('lpi_topic_explained', handleUpdate);
    window.addEventListener('lpi_incident_resolved', handleUpdate);
    window.addEventListener('lpi_objective_mastered', handleUpdate);
    window.addEventListener('lpi_command_executed', handleUpdate);
    window.addEventListener('lpi_quiz_topic_mastered', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('adaptive_path_updated', handleUpdate);
      window.removeEventListener('learning_path_updated', handleUpdate);
      window.removeEventListener('lpi_virtual_lab_completed', handleUpdate);
      window.removeEventListener('srs_updated', handleUpdate);
      window.removeEventListener('lpi_topic_explained', handleUpdate);
      window.removeEventListener('lpi_incident_resolved', handleUpdate);
      window.removeEventListener('lpi_objective_mastered', handleUpdate);
      window.removeEventListener('lpi_command_executed', handleUpdate);
      window.removeEventListener('lpi_quiz_topic_mastered', handleUpdate);
    };
  }, []);

  const handleSelectCategory = (catId: LearningPathCategoryId) => {
    setSelectedCategory(catId);
    try {
      localStorage.setItem('thematic_category_selected', catId);
    } catch {}
    const catPaths = allLearningPaths.filter((p) => p.category === catId);
    if (catPaths.length > 0 && !catPaths.some((p) => p.id === selectedPathId)) {
      handleSelectPath(catPaths[0].id);
    }
  };

  const handleSelectPath = (pathId: string) => {
    setSelectedPathId(pathId);
    try {
      localStorage.setItem('thematic_path_selected', pathId);
    } catch {}
    const path = allLearningPaths.find((p) => p.id === pathId);
    if (path && path.category !== selectedCategory) {
      setSelectedCategory(path.category);
    }
  };

  const currentPath: LearningPath = useMemo(() => {
    return allLearningPaths.find((p) => p.id === selectedPathId) || allLearningPaths[0];
  }, [selectedPathId]);

  // Compute live Adaptive Mastery synthesizing direct proofs & cross-module achievements
  const adaptiveMastery: PathAdaptiveMastery = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    adaptiveTick; // dependency trigger
    return calculatePathAdaptiveMastery(currentPath);
  }, [currentPath, adaptiveTick]);

  // Filtered paths based on category and search query
  const displayedPaths = useMemo(() => {
    let list = allLearningPaths.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = allLearningPaths.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleFr.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.subtitleFr.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.descriptionFr.toLowerCase().includes(q) ||
          p.modules.some(
            (m) =>
              m.title.toLowerCase().includes(q) ||
              m.titleFr.toLowerCase().includes(q) ||
              m.commands.some((c) => c.toLowerCase().includes(q))
          )
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleResetProgress = () => {
    if (
      confirm(
        isFrench
          ? 'Réinitialiser votre progression et vos preuves de maîtrise pour ce parcours ?'
          : 'Reset your progress and mastery proofs for this learning path?'
      )
    ) {
      resetPathAdaptiveMastery(currentPath.id);
      setAdaptiveTick((t) => t + 1);
    }
  };

  const handleMarkAll = () => {
    markAllPathSteps(currentPath.id);
    for (const mod of currentPath.modules) {
      completeAdaptiveActivity(currentPath, mod, 'theory');
      completeAdaptiveActivity(currentPath, mod, 'quiz');
      completeAdaptiveActivity(currentPath, mod, 'lab');
    }
    setAdaptiveTick((t) => t + 1);
  };

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: prev[stepId] === undefined ? false : !prev[stepId],
    }));
  };

  const handleSelectTreeActivity = (moduleId: string, activityType: CompetencyActivityType) => {
    setViewMode('pipeline');
    setExpandedSteps((prev) => ({ ...prev, [moduleId]: true }));
    setActiveStepTab((prev) => ({ ...prev, [moduleId]: activityType }));

    // Smooth scroll into module
    setTimeout(() => {
      const el = document.getElementById(`module-card-${moduleId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleSelectEvaluation = (type: 'quiz' | 'lab' | 'troubleshoot') => {
    if (type === 'lab') {
      if (onOpenTerminalLab && currentPath.finalEvaluation.capstoneLab?.id) {
        onOpenTerminalLab(currentPath.finalEvaluation.capstoneLab.id);
      } else {
        onNavigate('training');
      }
      return;
    }
    if (type === 'troubleshoot') {
      onNavigate('training');
      return;
    }
    // Quiz: scroll to final evaluation quiz in pipeline
    setViewMode('pipeline');
    setTimeout(() => {
      const el = document.getElementById('final-evaluation-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Mid-Term Evaluation check
  const handleValidateMidTerm = () => {
    if (!currentPath.midTermEvaluation) return;
    const questions = currentPath.midTermEvaluation.questions;
    let correct = 0;
    for (const q of questions) {
      if (midTermSelectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    }
    const scorePct = Math.round((correct / questions.length) * 100);
    const passed = scorePct >= currentPath.midTermEvaluation.passingScorePct;
    saveEvaluation(currentPath.id, {
      midTermScore: scorePct,
      midTermPassed: passed,
    });
    setShowEvaluationFeedback((prev) => ({ ...prev, midterm: true }));
  };

  // Final Capstone check
  const handleValidateFinalQuiz = () => {
    const finalQuiz = currentPath.finalEvaluation.finalQuiz;
    if (!finalQuiz) {
      saveEvaluation(currentPath.id, { finalQuizPassed: true, finalQuizScore: 100 });
      return;
    }
    let correct = 0;
    for (const q of finalQuiz) {
      if (finalQuizSelectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    }
    const scorePct = Math.round((correct / finalQuiz.length) * 100);
    const passed = scorePct >= 70;
    saveEvaluation(currentPath.id, {
      finalQuizScore: scorePct,
      finalQuizPassed: passed,
      finalLabPassed: true,
      finalTroubleshootingPassed: true,
    });
    setShowEvaluationFeedback((prev) => ({ ...prev, final: true }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Top Banner introducing Adaptive Thematic Skill Paths */}
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffc20e]/30 text-[#785a00] border border-[#ffc20e]/60 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc20e] fill-[#ffc20e]" />
              <span>{isFrench ? 'Parcours Adaptatifs & Preuves de Maîtrise' : 'Adaptive Mastery Paths'}</span>
              <span className="text-[10px] bg-[#785a00] text-white px-1.5 py-0.2 rounded font-mono">
                {isFrench ? '21 Parcours Structurés' : '21 Structured Roadmaps'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#201b11] tracking-tight">
              {isFrench ? 'Parcours d\'Apprentissage Adaptatifs' : 'Adaptive Learning Paths'}
            </h1>
            <p className="text-sm md:text-base text-[#4f4632] mt-1 max-w-3xl leading-relaxed">
              {isFrench
                ? 'Une architecture d\'apprentissage par compétences : chaque étape est jalonnée d\'activités formatives (Théorie, SRS, Quiz, Labs, Dépannage) et reliée automatiquement aux réussites dans le Terminal et les Examens.'
                : 'A competency-first adaptive architecture: every stage is backed by formative activities (Theory, SRS, Quiz, Labs, Troubleshooting) and automatically synchronized with Terminal and Exam milestones.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-[#ffffff] border border-[#d3c5ab] p-2.5 rounded-xl text-xs">
            <ShieldCheck className="w-4 h-4 text-[#047857]" />
            <span className="font-bold text-[#4f4632]">
              {isFrench ? 'Preuve de maîtrise active' : 'Real-time Proof of Mastery'}
            </span>
          </div>
        </div>

        {/* 5 Main Category Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-5 border-t border-[#d3c5ab]/60">
          {learningPathCategories.map((cat) => {
            const isCatSelected = cat.id === selectedCategory && !searchQuery;
            const count = allLearningPaths.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSearchQuery('');
                  handleSelectCategory(cat.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isCatSelected
                    ? 'bg-[#785a00] text-white border-[#785a00] shadow-xs'
                    : 'bg-[#ffffff]/80 text-[#4f4632] border-[#d3c5ab] hover:bg-[#ffffff] hover:border-[#bdae95]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{cat.emoji}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCatSelected ? 'bg-white/20 text-white' : 'bg-[#ece1d0] text-[#4f4632]'
                    }`}
                  >
                    {count} {isFrench ? 'parcours' : 'paths'}
                  </span>
                </div>
                <span className="text-xs font-black tracking-tight leading-tight line-clamp-1">
                  {isFrench ? cat.nameFr : cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar for Fast Exploration */}
        <div className="mt-4 pt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#817660]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isFrench
                  ? 'Rechercher parmi les 21 parcours (ex: permissions, chmod, umask, systemd, bash, iptables...)'
                  : 'Search across all 21 paths (e.g. permissions, chmod, umask, systemd, bash, iptables...)'
              }
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#d3c5ab] text-xs text-[#201b11] placeholder:text-[#817660] focus:outline-hidden focus:border-[#785a00]"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 bg-white border border-[#d3c5ab] text-xs font-bold rounded-xl text-[#6e634e] hover:bg-[#f8ecdb] cursor-pointer"
            >
              {isFrench ? 'Effacer' : 'Clear'}
            </button>
          )}
        </div>

        {/* Path Picker Grid inside Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
          {displayedPaths.map((path) => {
            const isSelected = path.id === selectedPathId;
            const compDone = (getPathProgress(path.id) || []).length;
            const pathPct =
              path.modules.length > 0
                ? Math.round((compDone / path.modules.length) * 100)
                : 0;

            return (
              <button
                key={path.id}
                onClick={() => handleSelectPath(path.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? `bg-[#ffffff] ${path.borderColor} ring-2 ring-offset-1 shadow-sm`
                    : 'bg-[#ffffff]/70 border-[#d3c5ab] hover:bg-[#ffffff] hover:border-[#bdae95]'
                }`}
                style={isSelected ? { outlineColor: path.accentHex } : undefined}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{path.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e634e]">
                      ~{path.estimatedHours}h
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      pathPct === 100 ? 'bg-[#047857] text-white' : 'bg-[#ece1d0] text-[#4f4632]'
                    }`}
                  >
                    {pathPct}%
                  </span>
                </div>

                <h3 className="text-xs font-black text-[#201b11] leading-snug line-clamp-1">
                  {isFrench ? path.titleFr : path.title}
                </h3>
                <p className="text-[11px] text-[#6e634e] line-clamp-1 mt-0.5">
                  {isFrench ? path.subtitleFr : path.subtitle}
                </p>

                {/* Micro Progress Bar */}
                <div className="w-full h-1 bg-[#ece1d0] rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pathPct}%`,
                      backgroundColor: path.accentHex,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Path Header & Overview Card */}
      <div
        className={`bg-linear-to-br ${currentPath.bgGradient} bg-[#ffffff] border ${currentPath.borderColor} rounded-2xl p-6 shadow-xs`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-[#d3c5ab]/60">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-2xl">{currentPath.emoji}</span>
              <h2 className="text-xl md:text-2xl font-black text-[#201b11]">
                {isFrench ? currentPath.titleFr : currentPath.title}
              </h2>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${currentPath.badgeColor}`}>
                {isFrench ? currentPath.difficultyFr : currentPath.difficulty}
              </span>
            </div>
            <p className="text-xs font-bold text-[#785a00] mb-1">
              {isFrench ? currentPath.subtitleFr : currentPath.subtitle}
            </p>
            <p className="text-sm text-[#4f4632] max-w-2xl leading-relaxed">
              {isFrench ? currentPath.descriptionFr : currentPath.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6e634e] mt-2.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#785a00]" />
                <span>
                  {isFrench ? 'Volume estimé :' : 'Estimated duration:'}{' '}
                  <strong>~{currentPath.estimatedHours}h</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#785a00]" />
                <span>
                  {isFrench ? 'Prérequis :' : 'Prerequisites:'}{' '}
                  <span className="text-[#201b11] font-medium">
                    {(isFrench ? currentPath.prerequisitesFr : currentPath.prerequisites).join(', ')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Adaptive Progress Box */}
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 shadow-xs shrink-0 w-full lg:w-80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#817660] uppercase tracking-wider">
                {isFrench ? 'Maîtrise adaptative' : 'Adaptive Mastery'}
              </span>
              <span className="text-lg font-black" style={{ color: currentPath.accentHex }}>
                {adaptiveMastery.overallMasteryPct}%
              </span>
            </div>

            <div className="w-full h-3 bg-[#ece1d0] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${adaptiveMastery.overallMasteryPct}%`,
                  backgroundColor: currentPath.accentHex,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6e634e] font-medium">
              <span>
                {adaptiveMastery.masteredCompetenciesCount} / {adaptiveMastery.totalCompetenciesCount}{' '}
                {isFrench ? 'compétences acquises' : 'competencies mastered'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAll}
                  className="hover:text-[#201b11] underline text-[10px] cursor-pointer"
                  title={isFrench ? 'Tout valider' : 'Mark all completed'}
                >
                  {isFrench ? 'Tout valider' : 'Mark all'}
                </button>
                <span>•</span>
                <button
                  onClick={handleResetProgress}
                  className="hover:text-[#ba1a1a] text-[10px] cursor-pointer flex items-center gap-0.5"
                  title={isFrench ? 'Réinitialiser' : 'Reset'}
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[#f0e4d2] flex items-center justify-between text-[10px] text-[#047857]">
              <span>
                {adaptiveMastery.totalActivitiesCompleted} / {adaptiveMastery.totalActivitiesCount}{' '}
                {isFrench ? 'activités prouvées' : 'verified activities'}
              </span>
              <span className="font-bold">
                {isFrench ? 'Synchronisé avec la plateforme' : 'Synced across platform'}
              </span>
            </div>
          </div>
        </div>

        {/* Adaptive Recommendation Card */}
        {adaptiveMastery.recommendedCompetency && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#fffaf0] border border-[#ffc20e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Target className="w-5 h-5 text-[#d97706] shrink-0" />
              <div>
                <span className="font-extrabold uppercase tracking-wider text-[#d97706] block text-[10px]">
                  {isFrench ? '🎯 Recommandation Adaptative :' : '🎯 Adaptive Recommendation:'}
                </span>
                <p className="text-[#201b11] font-bold">
                  {isFrench
                    ? `Travailler la compétence : ${adaptiveMastery.recommendedCompetency.titleFr}`
                    : `Next target: ${adaptiveMastery.recommendedCompetency.title}`}
                </p>
                {adaptiveMastery.recommendedCompetency.recommendedNextActivity && (
                  <p className="text-[#785a00] text-[11px]">
                    {isFrench ? 'Activité recommandée : ' : 'Suggested action: '}
                    <strong>
                      {isFrench
                        ? adaptiveMastery.recommendedCompetency.recommendedNextActivity.labelFr
                        : adaptiveMastery.recommendedCompetency.recommendedNextActivity.label}
                    </strong>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const comp = adaptiveMastery.recommendedCompetency!;
                handleSelectTreeActivity(
                  comp.moduleId,
                  comp.recommendedNextActivity?.type || 'theory'
                );
              }}
              className="px-3.5 py-1.5 bg-[#785a00] hover:bg-[#604700] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>{isFrench ? 'Démarrer l\'activité' : 'Start Activity'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Completion Milestone Badge Banner if 100% */}
        {adaptiveMastery.isPathMastered && (
          <div className="mt-5 p-4 rounded-xl bg-[#047857]/10 border border-[#047857]/40 flex items-center gap-3 animate-fade-in">
            <span className="text-3xl">{currentPath.badgeEarned.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#047857] text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                  {isFrench ? 'Parcours Validé & Maîtrisé !' : 'Mastery Path Validated!'}
                </span>
                <h4 className="font-extrabold text-sm text-[#047857]">
                  {isFrench ? currentPath.badgeEarned.titleFr : currentPath.badgeEarned.title}
                </h4>
              </div>
              <p className="text-xs text-[#047857]/90 mt-0.5">
                {isFrench
                  ? 'Félicitations ! Toutes les compétences et évaluations de ce parcours ont été validées avec preuves de maîtrise.'
                  : 'Congratulations! All competencies and evaluations have been successfully verified with proof of mastery.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Switcher Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1 bg-[#ffffff] p-1 rounded-xl border border-[#d3c5ab] text-xs">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#6e634e] hover:bg-[#f8ecdb]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{isFrench ? 'Arborescence des Compétences' : 'Competency Tree View'}</span>
          </button>
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'pipeline'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#6e634e] hover:bg-[#f8ecdb]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isFrench ? 'Modules & Activités' : 'Modules & Activities'}</span>
          </button>
        </div>

        <span className="text-xs text-[#817660] hidden sm:inline-block">
          {viewMode === 'tree'
            ? isFrench ? '💡 Cliquez sur une activité pour y accéder' : '💡 Click on any activity to launch it'
            : isFrench ? '💡 Cliquez pour déplier chaque compétence' : '💡 Click to expand each competency'}
        </span>
      </div>

      {/* VIEW MODE 1: ADAPTIVE COMPETENCY TREE */}
      {viewMode === 'tree' && (
        <AdaptiveCompetencyTree
          path={currentPath}
          adaptiveMastery={adaptiveMastery}
          onSelectActivity={handleSelectTreeActivity}
          onSelectEvaluation={handleSelectEvaluation}
        />
      )}

      {/* VIEW MODE 2: PIPELINE OF COMPETENCIES & ACTIVITY CARDS */}
      {viewMode === 'pipeline' && (
        <div className="flex flex-col gap-3">
          <div className="space-y-4 relative">
            {currentPath.modules.map((mod, idx) => {
              const comp = adaptiveMastery.competencies[mod.id];
              const isMastered = comp?.isMastered ?? false;
              const isExpanded = expandedSteps[mod.id] ?? true;
              const isLast = idx === currentPath.modules.length - 1;
              const activeTab = activeStepTab[mod.id] || 'theory';

              return (
                <div key={mod.id} id={`module-card-${mod.id}`} className="relative">
                  {/* Module Card */}
                  <div
                    className={`bg-[#ffffff] rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                      isMastered
                        ? 'border-[#047857]/40 bg-[#fbfdfb]'
                        : 'border-[#d3c5ab] hover:border-[#bcae96]'
                    }`}
                  >
                    {/* Module Card Header */}
                    <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Checkbox badge */}
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isMastered ? 'text-[#047857]' : 'text-[#817660]'
                          }`}
                        >
                          {isMastered ? (
                            <CheckCircle2 className="w-6 h-6 fill-[#047857] text-white" />
                          ) : (
                            <Circle className="w-6 h-6 stroke-[1.8]" />
                          )}
                        </div>

                        {/* Step Number & Title */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span
                              className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: currentPath.accentHex }}
                            >
                              Module {mod.number}
                            </span>
                            <span className="text-[11px] font-bold text-[#817660] uppercase tracking-wider">
                              {isFrench ? mod.conceptTagFr : mod.conceptTag}
                            </span>
                            {mod.linkedLpiObjective && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#ece1d0] text-[#4f4632]">
                                LPI {mod.linkedLpiObjective}
                              </span>
                            )}
                            {isMastered ? (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#047857]/15 text-[#047857]">
                                ✓ {isFrench ? 'Compétence acquise' : 'Competency Mastered'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#f0e4d2] text-[#785a00]">
                                {comp
                                  ? `${comp.completedActivitiesCount}/${comp.totalActivitiesCount} ${
                                      isFrench ? 'activités' : 'activities'
                                    }`
                                  : 'En cours'}
                              </span>
                            )}
                          </div>
                          <h4
                            onClick={() => toggleExpand(mod.id)}
                            className={`text-base font-extrabold cursor-pointer transition-colors ${
                              isMastered ? 'text-[#047857]' : 'text-[#201b11] hover:text-[#785a00]'
                            }`}
                          >
                            {isFrench ? mod.titleFr : mod.title}
                          </h4>
                        </div>
                      </div>

                      {/* Expand/Collapse Toggle */}
                      <button
                        onClick={() => toggleExpand(mod.id)}
                        className="p-1.5 rounded-lg text-[#817660] hover:bg-[#f8ecdb] hover:text-[#201b11] transition-colors cursor-pointer shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && comp && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#f0e4d2] flex flex-col gap-4 text-xs">
                        <CompetencyActivityPanel
                          path={currentPath}
                          module={mod}
                          competencyMastery={comp}
                          activeTab={activeTab}
                          onTabChange={(tab) =>
                            setActiveStepTab((prev) => ({ ...prev, [mod.id]: tab }))
                          }
                          onOpenExplainDifferently={onOpenExplainDifferently}
                          onNavigateTab={onNavigate}
                          onOpenTerminalLab={onOpenTerminalLab}
                        />
                      </div>
                    )}
                  </div>

                  {/* Downward Pipeline Connector (↓) */}
                  {!isLast && (
                    <div className="flex flex-col items-center justify-center my-1.5">
                      <div className="w-0.5 h-3 bg-[#d3c5ab]" />
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-2xs border border-[#d3c5ab]"
                        style={{
                          backgroundColor: '#fff8f2',
                          color: currentPath.accentHex,
                        }}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-0.5 h-3 bg-[#d3c5ab]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mid-Term Checkpoint Evaluation Card */}
      {currentPath.midTermEvaluation && (
        <div className="bg-[#ffffff] border border-[#0061a4]/40 rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#0061a4]/10 text-[#0061a4]">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0061a4] block">
                {isFrench ? 'Évaluation Intermédiaire' : 'Mid-Term Evaluation Checkpoint'}
              </span>
              <h3 className="text-lg font-extrabold text-[#201b11]">
                {isFrench ? currentPath.midTermEvaluation.titleFr : currentPath.midTermEvaluation.title}
              </h3>
            </div>
          </div>
          <p className="text-sm text-[#4f4632] leading-relaxed mb-4">
            {isFrench ? currentPath.midTermEvaluation.descriptionFr : currentPath.midTermEvaluation.description}
          </p>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f7fc] border border-[#0061a4]/20 text-xs mb-4">
            <span className="text-[#334155]">
              {isFrench
                ? `Score requis pour valider le checkpoint : ${currentPath.midTermEvaluation.passingScorePct}%`
                : `Passing threshold: ${currentPath.midTermEvaluation.passingScorePct}%`}
            </span>
            <span className="font-bold text-[#0061a4]">
              {currentPath.midTermEvaluation.questions.length} {isFrench ? 'questions clés' : 'key questions'}
            </span>
          </div>

          {/* Interactive Midterm Questions */}
          <div className="space-y-3">
            {currentPath.midTermEvaluation.questions.map((q, qIdx) => (
              <div key={q.id} className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#fffdfa] text-xs">
                <span className="font-bold text-[#785a00] block mb-1">
                  Question {qIdx + 1} : {isFrench ? q.questionFr : q.question}
                </span>
                <div className="space-y-1.5 mt-2">
                  {(isFrench && q.optionsFr ? q.optionsFr : q.options).map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() =>
                        setMidTermSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`w-full p-2 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                        midTermSelectedAnswers[q.id] === optIdx
                          ? 'bg-[#0061a4] text-white border-[#0061a4] font-bold'
                          : 'bg-[#ffffff] border-[#e2d5c0] hover:bg-[#f0f7fc] text-[#201b11]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#f0e4d2]">
            <span className="text-xs text-[#0061a4] font-bold">
              {adaptiveMastery.evaluation.midTermPassed
                ? isFrench
                  ? `✓ Checkpoint validé (Score: ${adaptiveMastery.evaluation.midTermScore}%)`
                  : `✓ Checkpoint passed (Score: ${adaptiveMastery.evaluation.midTermScore}%)`
                : isFrench
                ? 'Répondez aux questions pour enregistrer la preuve intermédiaire'
                : 'Answer questions to record mid-term proof'}
            </span>
            <button
              onClick={handleValidateMidTerm}
              className="px-4 py-2 bg-[#0061a4] hover:bg-[#004e84] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isFrench ? 'Valider l\'évaluation intermédiaire' : 'Submit Mid-Term Checkpoint'}
            </button>
          </div>
        </div>
      )}

      {/* Capstone Project / Final Validation Challenge */}
      <div id="final-evaluation-section" className="bg-[#ffffff] border-2 border-[#785a00]/40 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ffc20e]/30 text-[#785a00]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#785a00] block">
                {isFrench ? 'Évaluation Finale & Défi Capstone' : 'Final Evaluation & Capstone Challenge'}
              </span>
              <h3 className="text-lg font-extrabold text-[#201b11]">
                {isFrench ? currentPath.finalEvaluation.titleFr : currentPath.finalEvaluation.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onNavigate('training')}
            className="px-4 py-2 rounded-xl bg-[#785a00] hover:bg-[#604700] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Terminal className="w-4 h-4" />
            <span>{isFrench ? 'Lancer le simulateur de terminal' : 'Open Terminal Lab'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-[#4f4632] leading-relaxed mb-4">
          {isFrench ? currentPath.finalEvaluation.scenarioFr : currentPath.finalEvaluation.scenario}
        </p>

        {/* Deliverables and Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#f0e4d2] text-xs">
          <div className="bg-[#fff8f2] p-3.5 rounded-xl border border-[#d3c5ab]/60">
            <span className="font-bold text-[#785a00] uppercase tracking-wider block mb-2">
              {isFrench ? 'Livrables attendus :' : 'Expected Deliverables:'}
            </span>
            <ul className="space-y-1.5 text-[#4f4632]">
              {(isFrench ? currentPath.finalEvaluation.deliverablesFr : currentPath.finalEvaluation.deliverables).map(
                (item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#785a00] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-[#f0fdf4] p-3.5 rounded-xl border border-[#047857]/30">
            <span className="font-bold text-[#047857] uppercase tracking-wider block mb-2">
              {isFrench ? 'Critères de validation :' : 'Validation Criteria:'}
            </span>
            <ul className="space-y-1.5 text-[#14532d]">
              {(isFrench
                ? currentPath.finalEvaluation.validationCriteriaFr
                : currentPath.finalEvaluation.validationCriteria
              ).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#047857] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Final Validation Action */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#f0e4d2]">
          <span className="text-xs text-[#047857] font-bold">
            {adaptiveMastery.evaluation.finalQuizPassed
              ? isFrench
                ? '✓ Défi Capstone & Évaluation finale validés !'
                : '✓ Capstone & Final Evaluation Verified!'
              : isFrench
              ? 'Validez les critères de réalisation pour clore le parcours'
              : 'Submit deliverables to certify completion'}
          </span>
          <button
            onClick={handleValidateFinalQuiz}
            className="px-4 py-2 bg-[#785a00] hover:bg-[#604700] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isFrench ? 'Certifier la réussite du capstone' : 'Certify Capstone Success'}
          </button>
        </div>
      </div>
    </div>
  );
};
