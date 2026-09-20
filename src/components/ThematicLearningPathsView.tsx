import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  thematicLearningPaths,
  ThematicPath,
  ThematicPathStep,
  getThematicPathProgress,
  toggleThematicPathStep,
  resetThematicPathProgress,
  markAllThematicPathSteps,
} from '../data/thematicLearningPathsData';
import { TabType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ThematicLearningPathsViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenExplainDifferently?: (topic: string, mode?: any, context?: string) => void;
  initialPathId?: 'admin' | 'bash' | 'networking';
}

export const ThematicLearningPathsView: React.FC<ThematicLearningPathsViewProps> = ({
  onNavigate,
  onOpenExplainDifferently,
  initialPathId = 'admin',
}) => {
  const { isFrench } = useLanguage();
  const [selectedPathId, setSelectedPathId] = useState<'admin' | 'bash' | 'networking'>(() => {
    try {
      const saved = localStorage.getItem('thematic_path_selected');
      if (saved === 'admin' || saved === 'bash' || saved === 'networking') {
        return saved;
      }
    } catch {}
    return initialPathId;
  });

  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>(() => ({
    admin: getThematicPathProgress('admin'),
    bash: getThematicPathProgress('bash'),
    networking: getThematicPathProgress('networking'),
  }));
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleSelectPath = (pathId: 'admin' | 'bash' | 'networking') => {
    setSelectedPathId(pathId);
    try {
      localStorage.setItem('thematic_path_selected', pathId);
    } catch {}
  };

  // Synchronize storage updates across tabs/windows
  useEffect(() => {
    const handleUpdate = () => {
      setCompletedSteps({
        admin: getThematicPathProgress('admin'),
        bash: getThematicPathProgress('bash'),
        networking: getThematicPathProgress('networking'),
      });
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('thematic_path_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('thematic_path_updated', handleUpdate);
    };
  }, []);

  const currentPath: ThematicPath =
    thematicLearningPaths.find((p) => p.id === selectedPathId) || thematicLearningPaths[0];

  const currentCompleted = completedSteps[selectedPathId] || [];
  const totalSteps = currentPath.steps.length;
  const progressPct = Math.round((currentCompleted.length / totalSteps) * 100);
  const isAllComplete = progressPct === 100;

  const handleToggleStep = (stepId: string) => {
    const updated = toggleThematicPathStep(selectedPathId, stepId);
    setCompletedSteps((prev) => ({ ...prev, [selectedPathId]: updated }));
  };

  const handleResetProgress = () => {
    if (
      confirm(
        isFrench
          ? 'Réinitialiser votre progression pour ce parcours ?'
          : 'Reset your progress for this learning path?'
      )
    ) {
      resetThematicPathProgress(selectedPathId);
      setCompletedSteps((prev) => ({ ...prev, [selectedPathId]: [] }));
    }
  };

  const handleMarkAll = () => {
    const updated = markAllThematicPathSteps(selectedPathId);
    setCompletedSteps((prev) => ({ ...prev, [selectedPathId]: updated }));
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

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Top Banner introducing Thematic Skill Paths */}
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffc20e]/30 text-[#785a00] border border-[#ffc20e]/60 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc20e] fill-[#ffc20e]" />
              <span>{isFrench ? 'Parcours Thématiques Métier' : 'Thematic Skill Paths'}</span>
              <span className="text-[10px] bg-[#785a00] text-white px-1.5 py-0.2 rounded font-mono">
                {isFrench ? 'Sans certification' : 'Career-focused'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#201b11] tracking-tight">
              {isFrench ? 'Parcours d\'Apprentissage Thématiques' : 'Thematic Learning Paths'}
            </h1>
            <p className="text-sm md:text-base text-[#4f4632] mt-1 max-w-3xl leading-relaxed">
              {isFrench
                ? 'Des feuilles de route progressives et pragmatiques centrées sur le savoir-faire terrain en production, indépendantes du passage immédiat d\'un examen de certification.'
                : 'Progressive, production-tested roadmaps focused on real-world engineering autonomy, completely independent of taking an official certification exam.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-[#ffffff] border border-[#d3c5ab] p-2.5 rounded-xl text-xs">
            <Briefcase className="w-4 h-4 text-[#785a00]" />
            <span className="font-bold text-[#4f4632]">
              {isFrench ? '3 Parcours Essentiels' : '3 Core Career Paths'}
            </span>
          </div>
        </div>

        {/* 3 Path Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#d3c5ab]/60">
          {thematicLearningPaths.map((path) => {
            const isSelected = path.id === selectedPathId;
            const completedCount = (completedSteps[path.id] || []).length;
            const pathPct = Math.round((completedCount / path.steps.length) * 100);

            return (
              <button
                key={path.id}
                id={`path-tab-${path.id}`}
                onClick={() => handleSelectPath(path.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? `bg-[#ffffff] ${path.borderColor} ring-2 ring-offset-1 shadow-sm`
                    : 'bg-[#ffffff]/70 border-[#d3c5ab] hover:bg-[#ffffff] hover:border-[#bdae95]'
                }`}
                style={isSelected ? { outlineColor: path.accentHex } : undefined}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{path.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e]">
                      {path.id === 'admin'
                        ? isFrench
                          ? 'Système & Ops'
                          : 'System & Ops'
                        : path.id === 'bash'
                        ? isFrench
                          ? 'Automatisation'
                          : 'Automation'
                        : isFrench
                        ? 'Réseau & Infra'
                        : 'Networking'}
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

                <h3 className="text-sm font-extrabold text-[#201b11] leading-tight line-clamp-1">
                  {isFrench ? path.titleFr : path.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-[#817660] mt-2 pt-2 border-t border-[#f0e4d2]">
                  <span>{path.steps.length} {isFrench ? 'étapes' : 'steps'}</span>
                  <span>~{path.estimatedHours}h</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 bg-[#ece1d0] rounded-full mt-2 overflow-hidden">
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

      {/* Active Path Header & Progress Card */}
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
            <p className="text-sm text-[#4f4632] max-w-2xl">
              {isFrench ? currentPath.descriptionFr : currentPath.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6e634e] mt-2.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#785a00]" />
                <span>
                  {isFrench ? 'Volume estimé :' : 'Estimated commitment:'}{' '}
                  <strong>~{currentPath.estimatedHours}h</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#785a00]" />
                <span>
                  {isFrench ? 'Cible :' : 'Target audience:'}{' '}
                  <span className="text-[#201b11]">
                    {isFrench ? currentPath.targetAudienceFr : currentPath.targetAudience}
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
                {currentCompleted.length} / {totalSteps} {isFrench ? 'étapes validées' : 'steps mastered'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAll}
                  className="hover:text-[#201b11] underline text-[10px] cursor-pointer"
                  title={isFrench ? 'Valider toutes les étapes' : 'Mark all completed'}
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

        {/* Completion Milestone Badge Banner if 100% */}
        {isAllComplete && (
          <div className="mt-4 p-4 rounded-xl bg-[#047857]/10 border border-[#047857]/40 flex items-center gap-3 animate-fade-in">
            <span className="text-3xl">{currentPath.badgeEarned.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#047857] text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                  {isFrench ? 'Parcours Maîtrisé !' : 'Path Completed!'}
                </span>
                <h4 className="font-extrabold text-sm text-[#047857]">
                  {isFrench ? currentPath.badgeEarned.titleFr : currentPath.badgeEarned.title}
                </h4>
              </div>
              <p className="text-xs text-[#047857]/90 mt-0.5">
                {isFrench
                  ? 'Félicitations ! Vous avez complété toutes les étapes fondamentales de cette feuille de route.'
                  : 'Congratulations! You have mastered all critical engineering checkpoints of this roadmap.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Interactive Pipeline */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#785a00] flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>
              {isFrench
                ? `Étapes du parcours (${currentPath.steps.length} modules chronologiques)`
                : `Pipeline Sequence (${currentPath.steps.length} sequential steps)`}
            </span>
          </h3>
          <span className="text-xs text-[#817660]">
            {isFrench
              ? '💡 Suivez les flèches ↓ pour progresser dans l\'ordre optimal'
              : '💡 Follow the ↓ connectors in recommended chronological order'}
          </span>
        </div>

        <div className="space-y-4 relative">
          {currentPath.steps.map((step, idx) => {
            const isCompleted = currentCompleted.includes(step.id);
            const isExpanded = expandedSteps[step.id] ?? true;
            const isLast = idx === currentPath.steps.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div
                  className={`bg-[#ffffff] rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                    isCompleted
                      ? 'border-[#047857]/40 bg-[#fbfdfb]'
                      : 'border-[#d3c5ab] hover:border-[#bcae96]'
                  }`}
                >
                  {/* Card Header Bar */}
                  <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Checkbox trigger */}
                      <button
                        onClick={() => handleToggleStep(step.id)}
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
                            Étape {step.number}
                          </span>
                          <span className="text-[11px] font-bold text-[#817660] uppercase tracking-wider">
                            {isFrench ? step.conceptTagFr : step.conceptTag}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#047857]/15 text-[#047857]">
                              ✓ {isFrench ? 'Validé' : 'Mastered'}
                            </span>
                          )}
                        </div>
                        <h4
                          onClick={() => toggleExpand(step.id)}
                          className={`text-base font-extrabold cursor-pointer transition-colors ${
                            isCompleted ? 'text-[#047857]' : 'text-[#201b11] hover:text-[#785a00]'
                          }`}
                        >
                          {isFrench ? step.titleFr : step.title}
                        </h4>
                      </div>
                    </div>

                    {/* Expand/Collapse Toggle */}
                    <button
                      onClick={() => toggleExpand(step.id)}
                      className="p-1.5 rounded-lg text-[#817660] hover:bg-[#f8ecdb] hover:text-[#201b11] transition-colors cursor-pointer shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#f0e4d2] flex flex-col gap-4 text-xs">
                      {/* Short description & Production justification */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab]/60">
                          <span className="font-bold text-[#785a00] uppercase tracking-wider block mb-1">
                            {isFrench ? '🎯 Objectif opérationnel :' : '🎯 Operational Objective:'}
                          </span>
                          <p className="text-[#4f4632] leading-relaxed">
                            {isFrench ? step.shortDescFr : step.shortDesc}
                          </p>
                        </div>

                        <div className="bg-[#f0f7fc] p-3 rounded-xl border border-[#0061a4]/20">
                          <span className="font-bold text-[#0061a4] uppercase tracking-wider block mb-1">
                            {isFrench ? '🏢 Pourquoi c\'est crucial en production :' : '🏢 Real-World Impact:'}
                          </span>
                          <p className="text-[#334155] leading-relaxed">
                            {isFrench ? step.whyItMattersFr : step.whyItMatters}
                          </p>
                        </div>
                      </div>

                      {/* Essential Commands Chip List */}
                      <div>
                        <span className="font-bold text-[#6e634e] uppercase tracking-wider block mb-1.5">
                          {isFrench ? 'Commandes & Outils essentiels :' : 'Essential Commands & Tools:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.commands.map((cmd) => (
                            <button
                              key={cmd}
                              onClick={() => copyToClipboard(cmd, `${step.id}-${cmd}`)}
                              className="px-2 py-1 rounded-md bg-[#201b11] text-[#ebdcc8] font-mono text-[11px] hover:bg-[#342c1f] transition-colors flex items-center gap-1.5 group cursor-pointer"
                              title={isFrench ? 'Cliquer pour copier la commande' : 'Click to copy command'}
                            >
                              <span>{cmd}</span>
                              {copiedCodeId === `${step.id}-${cmd}` ? (
                                <Check className="w-3 h-3 text-[#047857]" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 text-[#817660] group-hover:text-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Code Snippet Box */}
                      {step.codeSnippet && (
                        <div className="bg-[#201b11] rounded-xl overflow-hidden border border-[#443825]">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#17130b] text-[11px] text-[#d3c5ab] border-b border-[#342c1f]">
                            <span className="font-mono font-medium">
                              {isFrench ? step.codeSnippet.labelFr : step.codeSnippet.label}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(step.codeSnippet!.code, `${step.id}-snippet`)
                              }
                              className="flex items-center gap-1 text-[10px] text-[#ffc20e] hover:underline cursor-pointer"
                            >
                              {copiedCodeId === `${step.id}-snippet` ? (
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
                            {step.codeSnippet.code}
                          </pre>
                          <div className="p-2 bg-[#2b2417] text-[11px] text-[#ebdcc8]/90 italic border-t border-[#342c1f]">
                            💡 {isFrench ? step.codeSnippet.explanationFr : step.codeSnippet.explanation}
                          </div>
                        </div>
                      )}

                      {/* Production Trap Warning */}
                      <div className="bg-[#fff8f2] border-l-3 border-[#ba1a1a] p-2.5 rounded-r-lg text-[11px] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#ba1a1a] font-bold">
                            {isFrench ? 'Piège classique de terrain :' : 'Production Pitfall:'}{' '}
                          </strong>
                          <span className="text-[#4f4632]">
                            {isFrench ? step.prodTrapFr : step.prodTrap}
                          </span>
                        </div>
                      </div>

                      {/* Checklist & Direct Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#f0e4d2]">
                        {/* Checkpoint list */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6e634e]">
                          {(isFrench ? step.checklistFr : step.checklist).map((item, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#785a00]" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Deep-link Triggers */}
                        <div className="flex items-center gap-2 shrink-0">
                          {onOpenExplainDifferently && (
                            <button
                              onClick={() =>
                                onOpenExplainDifferently(
                                  step.explainTopic,
                                  'simple',
                                  isFrench ? step.shortDescFr : step.shortDesc
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
                            onClick={() => onNavigate(step.trainingTabAction || 'training')}
                            className="px-2.5 py-1 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#4f4632] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Zap className="w-3 h-3 text-[#785a00]" />
                            <span>{isFrench ? 'Pratiquer en Lab' : 'Hands-on Lab'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleStep(step.id)}
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
                                  ? 'Étape Validée'
                                  : 'Completed'
                                : isFrench
                                ? 'Valider cette étape'
                                : 'Mark Complete'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Downward Pipeline Indicator Arrow (↓) between steps */}
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

      {/* Capstone Project / Real-world Challenge */}
      <div className="mt-4 bg-[#ffffff] border-2 border-[#785a00]/40 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ffc20e]/30 text-[#785a00]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#785a00] block">
                {isFrench ? 'Projet de Validation & Défi de Fin de Parcours' : 'Capstone Challenge & Final Project'}
              </span>
              <h3 className="text-lg font-extrabold text-[#201b11]">
                {isFrench ? currentPath.capstone.titleFr : currentPath.capstone.title}
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
          {isFrench ? currentPath.capstone.scenarioFr : currentPath.capstone.scenario}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#fff8f2] p-4 rounded-xl border border-[#d3c5ab]">
            <span className="font-bold text-[#785a00] uppercase tracking-wider block mb-2">
              {isFrench ? 'Livrables attendus :' : 'Expected Deliverables:'}
            </span>
            <ul className="space-y-1.5 text-[#4f4632]">
              {(isFrench ? currentPath.capstone.deliverablesFr : currentPath.capstone.deliverables).map(
                (deliv, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span>{deliv}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="bg-[#f0fdf4] p-4 rounded-xl border border-[#047857]/30">
            <span className="font-bold text-[#047857] uppercase tracking-wider block mb-2">
              {isFrench ? 'Critères de validation terrain :' : 'Production Validation Criteria:'}
            </span>
            <ul className="space-y-1.5 text-[#166534]">
              {(isFrench
                ? currentPath.capstone.validationCriteriaFr
                : currentPath.capstone.validationCriteria
              ).map((crit, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2">
                  <span className="text-[#047857] font-bold">★</span>
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
