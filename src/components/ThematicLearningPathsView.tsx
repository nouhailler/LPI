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
  savePathProgress,
  togglePathStep,
  resetPathProgress,
  markAllPathSteps,
} from '../data/learningPaths/storage';
import { TabType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ThematicLearningPathsViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenExplainDifferently?: (topic: string, mode?: any, context?: string) => void;
  initialPathId?: string;
}

export const ThematicLearningPathsView: React.FC<ThematicLearningPathsViewProps> = ({
  onNavigate,
  onOpenExplainDifferently,
  initialPathId = 'fund-beginner',
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

  // Step Progress State
  const [progressMap, setProgressMap] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    for (const p of allLearningPaths) {
      map[p.id] = getPathProgress(p.id);
    }
    return map;
  });

  // UI Expanded & Interaction States
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [activeStepTab, setActiveStepTab] = useState<Record<string, 'theory' | 'quiz' | 'flashcard' | 'lab' | 'troubleshoot'>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<string, boolean>>({});

  // Synchronize storage updates across tabs/windows
  useEffect(() => {
    const handleUpdate = () => {
      const map: Record<string, string[]> = {};
      for (const p of allLearningPaths) {
        map[p.id] = getPathProgress(p.id);
      }
      setProgressMap(map);
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('learning_path_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('learning_path_updated', handleUpdate);
    };
  }, []);

  const handleSelectCategory = (catId: LearningPathCategoryId) => {
    setSelectedCategory(catId);
    try {
      localStorage.setItem('thematic_category_selected', catId);
    } catch {}
    // Auto-select first path in category if current path is not in this category
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
    // Ensure category matches
    const path = allLearningPaths.find((p) => p.id === pathId);
    if (path && path.category !== selectedCategory) {
      setSelectedCategory(path.category);
    }
  };

  const currentPath: LearningPath = useMemo(() => {
    return allLearningPaths.find((p) => p.id === selectedPathId) || allLearningPaths[0];
  }, [selectedPathId]);

  const currentCompleted = progressMap[currentPath.id] || [];
  const totalSteps = currentPath.modules.length;
  const progressPct = totalSteps > 0 ? Math.round((currentCompleted.length / totalSteps) * 100) : 0;
  const isAllComplete = progressPct === 100;

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

  const handleToggleStep = (stepId: string) => {
    const updated = togglePathStep(currentPath.id, stepId);
    setProgressMap((prev) => ({ ...prev, [currentPath.id]: updated }));
  };

  const handleResetProgress = () => {
    if (
      confirm(
        isFrench
          ? 'Réinitialiser votre progression pour ce parcours ?'
          : 'Reset your progress for this learning path?'
      )
    ) {
      resetPathProgress(currentPath.id);
      setProgressMap((prev) => ({ ...prev, [currentPath.id]: [] }));
    }
  };

  const handleMarkAll = () => {
    const updated = markAllPathSteps(currentPath.id);
    setProgressMap((prev) => ({ ...prev, [currentPath.id]: updated }));
  };

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: prev[stepId] === undefined ? false : !prev[stepId],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const toggleFlashcardReveal = (cardId: string) => {
    setRevealedFlashcards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Top Banner introducing Thematic Skill Paths */}
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffc20e]/30 text-[#785a00] border border-[#ffc20e]/60 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc20e] fill-[#ffc20e]" />
              <span>{isFrench ? 'Parcours Thématiques Métier' : 'Thematic Career Paths'}</span>
              <span className="text-[10px] bg-[#785a00] text-white px-1.5 py-0.2 rounded font-mono">
                {isFrench ? '21 Parcours Indépendants' : '21 Career Roadmaps'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#201b11] tracking-tight">
              {isFrench ? 'Parcours d\'Apprentissage Thématiques' : 'Thematic Learning Paths'}
            </h1>
            <p className="text-sm md:text-base text-[#4f4632] mt-1 max-w-3xl leading-relaxed">
              {isFrench
                ? 'Une nouvelle couche d\'orchestration pédagogique structurée par objectifs, modules complets (Théorie, Flashcards, Questions, Labs, Troubleshooting), évaluation intermédiaire et capstone final.'
                : 'A dedicated pedagogical orchestration layer structured with explicit objectives, complete modules (Theory, Flashcards, Questions, Labs, Troubleshooting), mid-term checkpoints, and final capstones.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-[#ffffff] border border-[#d3c5ab] p-2.5 rounded-xl text-xs">
            <Briefcase className="w-4 h-4 text-[#785a00]" />
            <span className="font-bold text-[#4f4632]">
              {isFrench ? '5 Catégories Métier' : '5 Career Categories'}
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
                  ? 'Rechercher parmi les 21 parcours (ex: bash, systemd, iptables, disk full, devops...)'
                  : 'Search across all 21 paths (e.g. bash, systemd, iptables, disk full, devops...)'
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
            const completedCount = (progressMap[path.id] || []).length;
            const pathPct =
              path.modules.length > 0
                ? Math.round((completedCount / path.modules.length) * 100)
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

          {/* Progress Box */}
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 shadow-xs shrink-0 w-full lg:w-72">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#817660] uppercase tracking-wider">
                {isFrench ? 'Progression du parcours' : 'Path Progression'}
              </span>
              <span className="text-lg font-black" style={{ color: currentPath.accentHex }}>
                {progressPct}%
              </span>
            </div>

            <div className="w-full h-3 bg-[#ece1d0] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: currentPath.accentHex,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6e634e] font-medium">
              <span>
                {currentCompleted.length} / {totalSteps} {isFrench ? 'modules validés' : 'modules mastered'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAll}
                  className="hover:text-[#201b11] underline text-[10px] cursor-pointer"
                  title={isFrench ? 'Valider tous les modules' : 'Mark all completed'}
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
          </div>
        </div>

        {/* Explicit Path Objectives */}
        <div className="mt-4 pt-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#785a00] block mb-2">
            {isFrench ? '🎯 Objectifs opérationnels du parcours :' : '🎯 Operational Path Objectives:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isFrench ? currentPath.objectivesFr : currentPath.objectives).map((obj, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#4f4632]">
                <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Milestone Badge Banner if 100% */}
        {isAllComplete && (
          <div className="mt-5 p-4 rounded-xl bg-[#047857]/10 border border-[#047857]/40 flex items-center gap-3 animate-fade-in">
            <span className="text-3xl">{currentPath.badgeEarned.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#047857] text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                  {isFrench ? 'Parcours Maîtrisé !' : 'Path Mastered!'}
                </span>
                <h4 className="font-extrabold text-sm text-[#047857]">
                  {isFrench ? currentPath.badgeEarned.titleFr : currentPath.badgeEarned.title}
                </h4>
              </div>
              <p className="text-xs text-[#047857]/90 mt-0.5">
                {isFrench
                  ? 'Félicitations ! Vous avez validé tous les modules pédagogiques et techniques de ce parcours.'
                  : 'Congratulations! You have completed all theoretical and practical modules of this roadmap.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sequential Modules Pipeline */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#785a00] flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>
              {isFrench
                ? `Modules du parcours (${currentPath.modules.length} étapes chronologiques)`
                : `Pipeline Sequence (${currentPath.modules.length} chronological modules)`}
            </span>
          </h3>
          <span className="text-xs text-[#817660]">
            {isFrench
              ? '💡 Suivez les connecteurs ↓ dans l\'ordre recommandé'
              : '💡 Follow the ↓ connectors in recommended order'}
          </span>
        </div>

        <div className="space-y-4 relative">
          {currentPath.modules.map((mod, idx) => {
            const isCompleted = currentCompleted.includes(mod.id);
            const isExpanded = expandedSteps[mod.id] ?? true;
            const isLast = idx === currentPath.modules.length - 1;
            const activeTab = activeStepTab[mod.id] || 'theory';

            return (
              <div key={mod.id} className="relative">
                {/* Module Card */}
                <div
                  className={`bg-[#ffffff] rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                    isCompleted
                      ? 'border-[#047857]/40 bg-[#fbfdfb]'
                      : 'border-[#d3c5ab] hover:border-[#bcae96]'
                  }`}
                >
                  {/* Module Card Header */}
                  <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Checkbox trigger */}
                      <button
                        onClick={() => handleToggleStep(mod.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'text-[#047857] hover:bg-[#047857]/10'
                            : 'text-[#817660] hover:text-[#201b11] hover:bg-[#f8ecdb]'
                        }`}
                        title={
                          isCompleted
                            ? isFrench
                              ? 'Marquer comme non terminé'
                              : 'Mark as incomplete'
                            : isFrench
                            ? 'Marquer comme validé'
                            : 'Mark as completed'
                        }
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 fill-[#047857] text-white" />
                        ) : (
                          <Circle className="w-6 h-6 stroke-[1.8]" />
                        )}
                      </button>

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
                          {isCompleted && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#047857]/15 text-[#047857]">
                              ✓ {isFrench ? 'Validé' : 'Mastered'}
                            </span>
                          )}
                        </div>
                        <h4
                          onClick={() => toggleExpand(mod.id)}
                          className={`text-base font-extrabold cursor-pointer transition-colors ${
                            isCompleted ? 'text-[#047857]' : 'text-[#201b11] hover:text-[#785a00]'
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
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#f0e4d2] flex flex-col gap-4 text-xs">
                      {/* Sub-module Navigation Tabs */}
                      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f0e4d2] pb-2">
                        <button
                          onClick={() => setActiveStepTab((prev) => ({ ...prev, [mod.id]: 'theory' }))}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTab === 'theory'
                              ? 'bg-[#785a00] text-white shadow-xs'
                              : 'text-[#6e634e] hover:bg-[#f8ecdb]'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isFrench ? 'Théorie & Production' : 'Theory & Impact'}</span>
                        </button>

                        <button
                          onClick={() => setActiveStepTab((prev) => ({ ...prev, [mod.id]: 'quiz' }))}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTab === 'quiz'
                              ? 'bg-[#785a00] text-white shadow-xs'
                              : 'text-[#6e634e] hover:bg-[#f8ecdb]'
                          }`}
                        >
                          <FileQuestion className="w-3.5 h-3.5" />
                          <span>{isFrench ? 'Question d\'entraînement' : 'Practice Question'}</span>
                        </button>

                        <button
                          onClick={() => setActiveStepTab((prev) => ({ ...prev, [mod.id]: 'flashcard' }))}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTab === 'flashcard'
                              ? 'bg-[#785a00] text-white shadow-xs'
                              : 'text-[#6e634e] hover:bg-[#f8ecdb]'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>{isFrench ? 'Flashcard' : 'Flashcard'}</span>
                        </button>

                        <button
                          onClick={() => setActiveStepTab((prev) => ({ ...prev, [mod.id]: 'lab' }))}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTab === 'lab'
                              ? 'bg-[#785a00] text-white shadow-xs'
                              : 'text-[#6e634e] hover:bg-[#f8ecdb]'
                          }`}
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>{isFrench ? 'Lab Pratique' : 'Hands-on Lab'}</span>
                        </button>

                        <button
                          onClick={() => setActiveStepTab((prev) => ({ ...prev, [mod.id]: 'troubleshoot' }))}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTab === 'troubleshoot'
                              ? 'bg-[#ba1a1a] text-white shadow-xs'
                              : 'text-[#ba1a1a] hover:bg-[#fff0f0]'
                          }`}
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{isFrench ? 'Troubleshooting' : 'Troubleshooting'}</span>
                        </button>
                      </div>

                      {/* TAB 1: THEORY & PRODUCTION */}
                      {activeTab === 'theory' && (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab]/60">
                              <span className="font-bold text-[#785a00] uppercase tracking-wider block mb-1">
                                {isFrench ? '🎯 Résumé théorique :' : '🎯 Concept Summary:'}
                              </span>
                              <p className="text-[#4f4632] leading-relaxed">
                                {isFrench ? mod.theory.summaryFr : mod.theory.summary}
                              </p>
                            </div>

                            <div className="bg-[#f0f7fc] p-3 rounded-xl border border-[#0061a4]/20">
                              <span className="font-bold text-[#0061a4] uppercase tracking-wider block mb-1">
                                {isFrench ? '🏢 Pourquoi c\'est crucial en production :' : '🏢 Real-World Impact:'}
                              </span>
                              <p className="text-[#334155] leading-relaxed">
                                {isFrench ? mod.theory.whyItMattersFr : mod.theory.whyItMatters}
                              </p>
                            </div>
                          </div>

                          {/* Essential Commands */}
                          <div>
                            <span className="font-bold text-[#6e634e] uppercase tracking-wider block mb-1.5">
                              {isFrench ? 'Commandes & Outils essentiels :' : 'Essential Commands & Tools:'}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {mod.theory.commands.map((cmd) => (
                                <button
                                  key={cmd}
                                  onClick={() => copyToClipboard(cmd, `${mod.id}-${cmd}`)}
                                  className="px-2 py-1 rounded-md bg-[#201b11] text-[#ebdcc8] font-mono text-[11px] hover:bg-[#342c1f] transition-colors flex items-center gap-1.5 group cursor-pointer"
                                  title={isFrench ? 'Cliquer pour copier la commande' : 'Click to copy command'}
                                >
                                  <span>{cmd}</span>
                                  {copiedCodeId === `${mod.id}-${cmd}` ? (
                                    <Check className="w-3 h-3 text-[#047857]" />
                                  ) : (
                                    <Copy className="w-2.5 h-2.5 text-[#817660] group-hover:text-white" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Code Snippet Box */}
                          {mod.theory.codeSnippet && (
                            <div className="bg-[#201b11] rounded-xl overflow-hidden border border-[#443825]">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-[#17130b] text-[11px] text-[#d3c5ab] border-b border-[#342c1f]">
                                <span className="font-mono font-medium">
                                  {isFrench ? mod.theory.codeSnippet.labelFr : mod.theory.codeSnippet.label}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(mod.theory.codeSnippet!.code, `${mod.id}-snippet`)
                                  }
                                  className="flex items-center gap-1 text-[10px] text-[#ffc20e] hover:underline cursor-pointer"
                                >
                                  {copiedCodeId === `${mod.id}-snippet` ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>{isFrench ? 'Copié !' : 'Copied!'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>{isFrench ? 'Copier' : 'Copy'}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-3 text-xs text-[#fef2e1] font-mono overflow-x-auto whitespace-pre leading-relaxed">
                                {mod.theory.codeSnippet.code}
                              </pre>
                              <div className="p-2 bg-[#2b2417] text-[11px] text-[#ebdcc8]/90 italic border-t border-[#342c1f]">
                                💡 {isFrench ? mod.theory.codeSnippet.explanationFr : mod.theory.codeSnippet.explanation}
                              </div>
                            </div>
                          )}

                          {/* Production Pitfall Warning */}
                          <div className="bg-[#fff8f2] border-l-3 border-[#ba1a1a] p-2.5 rounded-r-lg text-[11px] flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-[#ba1a1a] font-bold">
                                {isFrench ? 'Piège classique de terrain :' : 'Production Pitfall:'}{' '}
                              </strong>
                              <span className="text-[#4f4632]">
                                {isFrench ? mod.theory.prodTrapFr : mod.theory.prodTrap}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: PRACTICE QUESTION */}
                      {activeTab === 'quiz' && (
                        <div className="bg-[#fffbf6] p-4 rounded-xl border border-[#d3c5ab]/80 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#785a00] uppercase tracking-wider text-[11px]">
                              {isFrench ? 'Question de validation du concept :' : 'Concept Verification Question:'}
                            </span>
                            <span className="text-[10px] bg-[#ece1d0] px-2 py-0.5 rounded font-bold text-[#6e634e]">
                              QCM Interactif
                            </span>
                          </div>

                          <p className="text-sm font-bold text-[#201b11]">
                            {isFrench ? mod.question.questionFr : mod.question.question}
                          </p>

                          <div className="space-y-1.5 mt-1">
                            {(isFrench ? mod.question.optionsFr : mod.question.options).map((opt, oIdx) => {
                              const isSelected = selectedAnswers[mod.question.id] === oIdx;
                              const isAnswered = selectedAnswers[mod.question.id] !== undefined;
                              const isCorrect = oIdx === mod.question.correctIndex;

                              let btnStyle = 'bg-white border-[#d3c5ab] hover:border-[#785a00] text-[#201b11]';
                              if (isAnswered) {
                                if (isCorrect) {
                                  btnStyle = 'bg-[#047857]/10 border-[#047857] text-[#047857] font-bold';
                                } else if (isSelected) {
                                  btnStyle = 'bg-[#ba1a1a]/10 border-[#ba1a1a] text-[#ba1a1a]';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectAnswer(mod.question.id, oIdx)}
                                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-[#047857]" />}
                                  {isAnswered && isSelected && !isCorrect && (
                                    <XCircle className="w-4 h-4 text-[#ba1a1a]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {selectedAnswers[mod.question.id] !== undefined && (
                            <div className="mt-2 p-3 rounded-lg bg-white border border-[#d3c5ab] text-xs">
                              <p className="font-bold text-[#201b11] mb-1">
                                {selectedAnswers[mod.question.id] === mod.question.correctIndex ? (
                                  <span className="text-[#047857]">✓ {isFrench ? 'Excellente réponse !' : 'Correct!'}</span>
                                ) : (
                                  <span className="text-[#ba1a1a]">✗ {isFrench ? 'Incorrect.' : 'Incorrect.'}</span>
                                )}
                              </p>
                              <p className="text-[#4f4632]">
                                {isFrench ? mod.question.explanationFr : mod.question.explanation}
                              </p>
                              {mod.question.commandSnippet && (
                                <code className="block mt-1.5 p-1.5 bg-[#201b11] text-[#ebdcc8] rounded font-mono text-[11px]">
                                  {mod.question.commandSnippet}
                                </code>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 3: FLASHCARD */}
                      {activeTab === 'flashcard' && (
                        <div className="space-y-3">
                          {mod.flashcards.map((fc) => {
                            const isRevealed = revealedFlashcards[fc.id] || false;
                            return (
                              <div
                                key={fc.id}
                                className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 shadow-2xs"
                              >
                                <span className="text-[10px] font-bold text-[#785a00] uppercase tracking-wider block mb-1">
                                  {isFrench ? 'Flashcard de mémorisation rapide :' : 'Rapid Memory Flashcard:'}
                                </span>
                                <h5 className="text-sm font-extrabold text-[#201b11] mb-3">
                                  {isFrench ? fc.questionFr : fc.question}
                                </h5>

                                {isRevealed ? (
                                  <div className="p-3 rounded-lg bg-[#047857]/10 border border-[#047857]/30 text-xs animate-fade-in">
                                    <span className="font-extrabold text-[#047857] block mb-1">
                                      {isFrench ? 'Réponse attendue :' : 'Target Answer:'}
                                    </span>
                                    <p className="font-bold text-[#201b11]">{isFrench ? fc.answerFr : fc.answer}</p>
                                    {(fc.examTip || fc.examTipFr) && (
                                      <p className="text-[11px] text-[#6e634e] mt-2 italic">
                                        💡 {isFrench ? fc.examTipFr : fc.examTip}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => toggleFlashcardReveal(fc.id)}
                                    className="px-3 py-1.5 bg-[#785a00] hover:bg-[#604700] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                  >
                                    {isFrench ? 'Afficher la réponse' : 'Reveal Answer'}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* TAB 4: HANDS-ON LAB */}
                      {activeTab === 'lab' && (
                        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#785a00] block">
                                {isFrench ? 'Atelier Pratique Guidé' : 'Guided Hands-on Lab'}
                              </span>
                              <h5 className="text-sm font-extrabold text-[#201b11]">
                                {isFrench ? mod.lab.titleFr : mod.lab.title}
                              </h5>
                            </div>
                            <button
                              onClick={() => onNavigate('training')}
                              className="px-2.5 py-1 rounded-lg bg-[#785a00] hover:bg-[#604700] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Terminal className="w-3.5 h-3.5" />
                              <span>{isFrench ? 'Ouvrir Terminal' : 'Open Terminal'}</span>
                            </button>
                          </div>

                          <div className="bg-[#fff8f2] p-2.5 rounded-lg border border-[#d3c5ab]/60 text-xs">
                            <strong className="text-[#785a00]">{isFrench ? 'Objectif :' : 'Goal:'} </strong>
                            <span className="text-[#4f4632]">{isFrench ? mod.lab.goalFr : mod.lab.goal}</span>
                          </div>

                          <div className="space-y-2">
                            {mod.lab.steps.map((step) => (
                              <div key={step.stepNumber} className="p-2.5 bg-[#fbfdfb] border border-[#d3c5ab]/60 rounded-lg">
                                <span className="font-bold text-[#047857] block mb-0.5">
                                  {isFrench ? `Étape ${step.stepNumber} : ${step.titleFr}` : `Step ${step.stepNumber}: ${step.title}`}
                                </span>
                                <p className="text-[#4f4632] mb-1.5">{isFrench ? step.instructionFr : step.instruction}</p>
                                <div className="p-2 bg-[#201b11] text-[#ebdcc8] font-mono text-[11px] rounded flex items-center justify-between">
                                  <span>$ {step.expectedCommands[0]}</span>
                                  <button
                                    onClick={() => copyToClipboard(step.expectedCommands[0], `lab-${mod.id}`)}
                                    className="text-[10px] text-[#ffc20e] hover:underline cursor-pointer"
                                  >
                                    {copiedCodeId === `lab-${mod.id}` ? '✓ Copié' : 'Copier'}
                                  </button>
                                </div>
                                {step.simulatedOutput && (
                                  <pre className="mt-1 p-2 bg-[#17130b] text-[#a3e635] font-mono text-[10px] rounded overflow-x-auto">
                                    {step.simulatedOutput}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TAB 5: TROUBLESHOOTING */}
                      {activeTab === 'troubleshoot' && (
                        <div className="bg-[#fff5f5] border border-[#ba1a1a]/40 rounded-xl p-4 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-[#ba1a1a]" />
                            <h5 className="text-sm font-extrabold text-[#ba1a1a]">
                              {isFrench ? mod.troubleshooting.titleFr : mod.troubleshooting.title}
                            </h5>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="bg-white p-2.5 rounded-lg border border-[#ba1a1a]/20">
                              <span className="font-bold text-[#ba1a1a] block mb-0.5">
                                {isFrench ? 'Symptôme constaté en production :' : 'Observed Symptom:'}
                              </span>
                              <p className="text-[#4f4632]">{isFrench ? mod.troubleshooting.symptomFr : mod.troubleshooting.symptom}</p>
                            </div>

                            <div className="bg-[#201b11] p-2.5 rounded-lg text-white font-mono text-[11px]">
                              <span className="text-[#ffc20e] block mb-1">
                                # {isFrench ? 'Commande d\'investigation :' : 'Investigation command:'}
                              </span>
                              <div>$ {mod.troubleshooting.investigationCommands.join('\n$ ')}</div>
                              {mod.troubleshooting.diagnosticOutput && (
                                <pre className="mt-2 pt-2 border-t border-[#443825] text-[#f87171] text-[10px]">
                                  {mod.troubleshooting.diagnosticOutput}
                                </pre>
                              )}
                            </div>

                            <div className="bg-white p-2.5 rounded-lg border border-[#ba1a1a]/20">
                              <span className="font-bold text-[#ba1a1a] block mb-0.5">
                                {isFrench ? 'Cause racine :' : 'Root Cause:'}
                              </span>
                              <p className="text-[#4f4632]">{isFrench ? mod.troubleshooting.rootCauseFr : mod.troubleshooting.rootCause}</p>
                            </div>

                            <div className="bg-[#047857]/10 p-2.5 rounded-lg border border-[#047857]/30">
                              <span className="font-bold text-[#047857] block mb-0.5">
                                {isFrench ? 'Procédure de remédiation :' : 'Remediation Command:'}
                              </span>
                              <code className="block p-1.5 bg-[#201b11] text-[#a3e635] font-mono text-[11px] rounded mb-1">
                                {mod.troubleshooting.solutionCommand}
                              </code>
                              <p className="text-[#4f4632] text-[11px]">
                                {isFrench ? mod.troubleshooting.solutionExplanationFr : mod.troubleshooting.solutionExplanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#f0e4d2]">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6e634e]">
                          {mod.checklist.map((item, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#785a00]" />
                              <span>{isFrench ? mod.checklistFr?.[cIdx] || item : item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onOpenExplainDifferently && (
                            <button
                              onClick={() =>
                                onOpenExplainDifferently(
                                  mod.explainTopic,
                                  'simple',
                                  isFrench ? mod.theory.summaryFr : mod.theory.summary
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#ffc20e]/20 hover:bg-[#ffc20e]/30 border border-[#ffc20e]/60 text-[#785a00] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              title={isFrench ? 'Explique-moi autrement ce concept' : 'Explain differently'}
                            >
                              <Sparkles className="w-3 h-3 text-[#ffc20e] fill-[#ffc20e]" />
                              <span>{isFrench ? 'Explique-moi' : 'Explain'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => onNavigate('training')}
                            className="px-2.5 py-1 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#4f4632] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Zap className="w-3 h-3 text-[#785a00]" />
                            <span>{isFrench ? 'Pratiquer en Lab' : 'Hands-on Lab'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleStep(mod.id)}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-[#047857] text-white hover:bg-[#035f45]'
                                : 'bg-[#785a00] text-white hover:bg-[#604700]'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>
                              {isCompleted
                                ? isFrench
                                  ? 'Module Validé'
                                  : 'Completed'
                                : isFrench
                                ? 'Valider ce module'
                                : 'Mark Complete'}
                            </span>
                          </button>
                        </div>
                      </div>
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

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f7fc] border border-[#0061a4]/20 text-xs">
            <span className="text-[#334155]">
              {isFrench
                ? `Score requis pour valider le checkpoint : ${currentPath.midTermEvaluation.passingScorePct}%`
                : `Passing threshold: ${currentPath.midTermEvaluation.passingScorePct}%`}
            </span>
            <span className="font-bold text-[#0061a4]">
              {currentPath.midTermEvaluation.questions.length} {isFrench ? 'questions clés' : 'key questions'}
            </span>
          </div>
        </div>
      )}

      {/* Capstone Project / Final Validation Challenge */}
      <div className="bg-[#ffffff] border-2 border-[#785a00]/40 rounded-2xl p-6 shadow-xs relative overflow-hidden">
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
          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab]/60">
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

          <div className="bg-[#f0fdf4] p-3 rounded-xl border border-[#047857]/30">
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
      </div>
    </div>
  );
};
