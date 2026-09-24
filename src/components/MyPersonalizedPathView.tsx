import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Layers,
  Zap,
  HelpCircle,
  Award,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Check,
  Compass,
} from 'lucide-react';
import {
  PersonalizedPathConfig,
  PersonalizedLearningPathState,
  TabType,
  UserStats,
  DailyTrainingItem,
} from '../types';
import {
  getStoredPersonalizedPathConfig,
  savePersonalizedPathConfig,
  getCompletedTaskIds,
  toggleTaskCompleted,
  calculatePersonalizedLearningPath,
  CERTIFICATION_GOALS,
} from '../services/personalizedPathEngine';
import { getStoredDiagnosticResult } from '../data/diagnosticExamData';
import { PersonalizedPathSetupModal } from './PersonalizedPathSetupModal';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  userStats: UserStats;
  onNavigate: (tab: TabType, payload?: any) => void;
  onStartExam?: (examId: string) => void;
  onOpenDiagnostic?: () => void;
  onOpenExplainDifferently?: (topic: string, mode?: any, context?: string) => void;
}

export const MyPersonalizedPathView: React.FC<Props> = ({
  userStats,
  onNavigate,
  onStartExam,
  onOpenDiagnostic,
  onOpenExplainDifferently,
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [config, setConfig] = useState<PersonalizedPathConfig>(() =>
    getStoredPersonalizedPathConfig()
  );
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() =>
    getCompletedTaskIds()
  );

  // Read mastered objectives
  const [masteredObjectiveIds, setMasteredObjectiveIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lpic_mastered_objectives');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Read diagnostic result
  const [diagnosticResult, setDiagnosticResult] = useState(() =>
    getStoredDiagnosticResult()
  );

  // Listen to storage events to keep reactive
  useEffect(() => {
    const handleStorage = () => {
      setConfig(getStoredPersonalizedPathConfig());
      setCompletedTaskIds(getCompletedTaskIds());
      setDiagnosticResult(getStoredDiagnosticResult());
      try {
        const saved = localStorage.getItem('lpic_mastered_objectives');
        if (saved) setMasteredObjectiveIds(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('lpic_path_updated', handleStorage);
    window.addEventListener('lpic_task_completed', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lpic_path_updated', handleStorage);
      window.removeEventListener('lpic_task_completed', handleStorage);
    };
  }, []);

  // Compute live engine state
  const pathState: PersonalizedLearningPathState = useMemo(() => {
    return calculatePersonalizedLearningPath(
      config,
      masteredObjectiveIds,
      diagnosticResult,
      completedTaskIds
    );
  }, [config, masteredObjectiveIds, diagnosticResult, completedTaskIds]);

  const handleToggleTask = (taskId: string) => {
    const next = toggleTaskCompleted(taskId);
    setCompletedTaskIds(next);
  };

  const handleLaunchTask = (item: DailyTrainingItem) => {
    // Navigate with context
    if (item.navTarget === 'learning') {
      onNavigate('learning', item.navPayload?.topicId);
    } else if (item.navTarget === 'flashcards') {
      onNavigate('flashcards', item.navPayload?.topicId);
    } else if (item.navTarget === 'training') {
      onNavigate('training');
    } else if (item.navTarget === 'practice') {
      if (onStartExam && item.navPayload?.examId) {
        onStartExam(item.navPayload.examId);
      } else {
        onNavigate('practice');
      }
    }
  };

  // Format readable French/English date
  const formattedTargetDate = useMemo(() => {
    try {
      const d = new Date(config.targetDate);
      return d.toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return config.targetDate;
    }
  }, [config.targetDate, isFr]);

  const goalMeta = CERTIFICATION_GOALS.find((g) => g.id === config.goal) || CERTIFICATION_GOALS[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Overview Dashboard Card (Matching user blueprint: Objectif • Niveau initial • Temps dispo • Date cible • Progression estimée) */}
      <div className="bg-gradient-to-br from-[#ffffff] via-[#fffdfa] to-[#fef2e1] border-2 border-[#ffc20e] rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc20e]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#ffc20e] text-[#6d5100] shadow-2xs">
                🎯 {isFr ? 'Mon parcours LPIC sur mesure' : 'My Custom LPIC Path'}
              </span>
              <span className="text-xs font-mono font-bold text-[#785a00] bg-[#ffffff] px-2.5 py-0.5 rounded border border-[#ffc20e]/60">
                {goalMeta.examCode}
              </span>
              {pathState.readinessStatus === 'ready' ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✅ {isFr ? 'Prêt pour l\'examen' : 'Ready for Exam'}
                </span>
              ) : pathState.readinessStatus === 'on_track' ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                  🚀 {isFr ? 'Sur la bonne voie' : 'On Track'}
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  ⚡ {isFr ? 'Phase d\'entraînement intensif' : 'Intensive Training'}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201b11] tracking-tight">
              {isFr ? goalMeta.nameFr : goalMeta.name}
            </h2>
            <p className="text-sm text-[#4f4632] max-w-2xl leading-relaxed">
              {isFr ? goalMeta.descriptionFr : goalMeta.description}
            </p>
          </div>

          {/* Action buttons to customize */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-[#785a00] bg-white hover:bg-[#fff9f0] text-[#785a00] font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{isFr ? 'Modifier l\'objectif' : 'Edit Goal'}</span>
            </button>
            {onOpenDiagnostic && (
              <button
                onClick={onOpenDiagnostic}
                className="px-4 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isFr ? 'Diagnostic (Score)' : 'Diagnostic Test'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Metadata Badges (Exactly matching user requirement) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#d3c5ab]/60 relative z-10">
          {/* 1. Niveau initial */}
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-[#d3c5ab]/70">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#817660] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc20e]" />
              <span>{isFr ? 'Niveau initial' : 'Starting Level'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#201b11] mt-1">
              {config.hasTakenDiagnostic ? `${config.initialDiagnosticScore} %` : '60 % (estimé)'}
            </div>
            <div className="text-[10px] text-[#817660]">
              {config.hasTakenDiagnostic
                ? (isFr ? 'Évalué par test diagnostic' : 'From diagnostic test')
                : (isFr ? 'Cliquez sur Diagnostic' : 'Take test to calibrate')}
            </div>
          </div>

          {/* 2. Temps disponible */}
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-[#d3c5ab]/70">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#817660] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#0061a4]" />
              <span>{isFr ? 'Temps disponible' : 'Available Time'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#201b11] mt-1">
              {config.dailyMinutes} min <span className="text-xs font-normal text-[#817660]">/ jour</span>
            </div>
            <div className="text-[10px] text-[#817660]">
              {isFr ? 'Format 4 micro-tâches' : '4 micro-tasks daily'}
            </div>
          </div>

          {/* 3. Date cible */}
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-[#d3c5ab]/70">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#817660] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#785a00]" />
              <span>{isFr ? 'Date cible' : 'Target Date'}</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-[#201b11] mt-1 truncate">
              {formattedTargetDate}
            </div>
            <div className="text-[10px] text-[#817660]">
              {pathState.daysRemaining} {isFr ? 'jours restants' : 'days left'}
            </div>
          </div>

          {/* 4. Progression estimée */}
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-[#d3c5ab]/70">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#817660] uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-[#047857]" />
              <span>{isFr ? 'Progression estimée' : 'Est. Progress'}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0061a4] mt-1">
              {pathState.estimatedProgressPct} %
            </div>
            <div className="text-[10px] text-[#817660]">
              {pathState.masteredObjectivesCount}/{pathState.totalObjectivesCount} {isFr ? 'objectifs acquis' : 'mastered'}
            </div>
          </div>
        </div>

        {/* Big visual progress bar */}
        <div className="mt-4 relative z-10">
          <div className="w-full h-3 bg-[#ece1d0] rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#ffc20e] via-[#0061a4] to-[#047857] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pathState.estimatedProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Today's Daily Training Quad (Exact copy of user request) */}
      {/* 🎯 Aujourd'hui : 📚 Réviser • 🧠 12 flashcards • 💻 1 mini-lab • 📝 10 questions */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ebdcc8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#785a00]">
                  {isFr ? 'Aujourd\'hui' : 'Today\'s Syllabus'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#f8ecdb] text-[#785a00] font-bold">
                  {pathState.todayPlan.tasks.filter((t) => t.completed).length} / {pathState.todayPlan.tasks.length} {isFr ? 'terminés' : 'done'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#201b11]">
                {isFr ? 'Programme d\'entraînement du jour' : 'Daily Training Plan'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6e634e]">
            <Clock className="w-4 h-4 text-[#785a00]" />
            <span>
              {isFr
                ? `Séance calibrée pour ~${config.dailyMinutes} minutes`
                : `Tailored for ~${config.dailyMinutes} minutes`}
            </span>
          </div>
        </div>

        {/* The 4 tasks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {pathState.todayPlan.tasks.map((task) => {
            const isCompleted = task.completed;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#f4fbf7] border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-[#fffdfa] border-[#d3c5ab] hover:border-[#ffc20e] hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {task.type === 'concept'
                          ? '📚'
                          : task.type === 'flashcards'
                          ? '🧠'
                          : task.type === 'lab'
                          ? '💻'
                          : '📝'}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#ebdcc8] text-[#785a00]'
                        }`}
                      >
                        {task.type === 'concept'
                          ? (isFr ? 'Révision Cursus' : 'Course Review')
                          : task.type === 'flashcards'
                          ? 'Flashcards SRS'
                          : task.type === 'lab'
                          ? 'Mini-Lab Virtuel'
                          : 'Quiz Ciblé'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className="text-[#817660] hover:text-[#28A745] p-1 transition-colors cursor-pointer"
                      title={isFr ? 'Marquer comme fait' : 'Toggle complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#817660]" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#201b11]">
                      {isFr ? task.titleFr : task.title}
                    </h4>
                    <p className="text-xs text-[#4f4632] mt-0.5">
                      {isFr ? task.subtitleFr : task.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebdcc8]/50 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#817660] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{task.estimatedMinutes} min</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleLaunchTask(task)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        : 'bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] shadow-2xs active:scale-98'
                    }`}
                  >
                    <span>{isFr ? 'Lancer' : 'Start'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 1-click bonus action: Explain Differently */}
        {onOpenExplainDifferently && (
          <div className="bg-[#fef2e1] border border-[#ffc20e]/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ffc20e] fill-[#ffc20e] shrink-0" />
              <div className="text-xs text-[#4f4632]">
                <strong className="text-[#201b11]">
                  {isFr ? 'Besoin d\'un déclic pédagogique ?' : 'Need an intuitive breakdown?'}
                </strong>{' '}
                {isFr
                  ? 'Consultez les 5 angles (vulgarisation, métaphores réelles, pièges LPI).'
                  : 'Explore the 5 angles (analogy, edge cases, LPI traps).'}
              </div>
            </div>
            <button
              onClick={() => onOpenExplainDifferently('systemd', 'analogy')}
              className="text-xs font-bold text-[#785a00] hover:underline shrink-0 cursor-pointer"
            >
              {isFr ? 'Expliquer autrement →' : 'Explain Differently →'}
            </button>
          </div>
        )}
      </div>

      {/* 3. Upcoming Days Preview (Prochains jours de révision) */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#ebdcc8]">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#785a00]" />
            <h3 className="text-base sm:text-lg font-bold text-[#201b11]">
              {isFr ? 'Prochaines étapes de votre parcours' : 'Upcoming Learning Steps'}
            </h3>
          </div>
          <span className="text-xs text-[#817660]">
            {pathState.upcomingDays.length} {isFr ? 'jours planifiés' : 'days planned'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pathState.upcomingDays.map((day) => (
            <div
              key={day.dayNumber}
              className="p-3.5 rounded-xl border border-[#ebdcc8] bg-[#fffdfa] hover:bg-[#fff9f0] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#f8ecdb] text-[#785a00]">
                    Jour {day.dayNumber}
                  </span>
                  <span className="text-[10px] font-semibold text-[#817660]">
                    {day.date}
                  </span>
                </div>
                <div className="font-bold text-xs text-[#201b11] line-clamp-1">
                  Obj {day.objectiveId}
                </div>
                <div className="text-[11px] text-[#4f4632] line-clamp-2 mt-0.5">
                  {day.objectiveTitle}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#ebdcc8]/50 flex items-center justify-between text-[10px] text-[#817660]">
                <span>2 {isFr ? 'tâches' : 'tasks'}</span>
                {day.isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Exam Simulation Milestone banner */}
      <div className="bg-gradient-to-r from-[#201b11] to-[#3a301c] text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ffc20e]/20 text-[#ffc20e]">
                {isFr ? 'Étape finale' : 'Final Milestone'}
              </span>
              <span className="text-xs text-white/70">
                {isFr ? 'Validation des acquis' : 'Readiness validation'}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              {isFr
                ? `Examen blanc officiel : ${goalMeta.name}`
                : `Official Mock Exam: ${goalMeta.name}`}
            </h4>
            <p className="text-xs text-white/80 max-w-xl">
              {isFr
                ? 'Testez-vous en conditions réelles avec chronomètre de 45 minutes, calcul du seuil officiel (500/800) et diagnostic d\'après-session.'
                : 'Test yourself under real conditions with 45-minute countdown, passing score threshold, and post-exam analytics.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onStartExam) onStartExam(goalMeta.examId);
            else onNavigate('practice');
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-98"
        >
          <Zap className="w-4 h-4" />
          <span>{isFr ? 'Lancer un examen blanc' : 'Start Mock Exam'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Setup & Configuration Modal */}
      <PersonalizedPathSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        currentConfig={config}
        onConfigSaved={(updated) => setConfig(updated)}
        onOpenDiagnostic={onOpenDiagnostic}
      />
    </div>
  );
};
