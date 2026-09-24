import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  CheckCircle2,
  Flame,
  BookOpen,
  ChevronRight,
  Layers,
  Library,
  Zap,
  HelpCircle,
  Clock,
  Award,
  ArrowRight,
  Calendar,
  Sparkles,
  Target,
  BarChart3,
  RotateCcw,
  Brain,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { ExamTier, TabType, UserStats, ExamSessionHistory, DiagnosticResult } from '../types';
import { flashcardsData } from '../data/lpiData';
import { lpicTopicsData } from '../data/lpicObjectivesData';
import { useLanguage } from '../i18n/LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { LpiCertificationGuideModal } from './LpiCertificationGuideModal';
import { getStoredDiagnosticResult } from '../data/diagnosticExamData';
import { loadSRSRecords, computeSRSDeckSummary } from '../utils/srsEngine';
import { WeaknessEngineWidget } from './weakness/WeaknessEngineWidget';
import { thematicLearningPaths, getThematicPathProgress } from '../data/thematicLearningPathsData';
import {
  getStoredPersonalizedPathConfig,
  getCompletedTaskIds,
  calculatePersonalizedLearningPath,
  CERTIFICATION_GOALS,
} from '../services/personalizedPathEngine';

interface DashboardViewProps {
  userStats: UserStats;
  tiers: ExamTier[];
  onNavigate: (tab: TabType) => void;
  onSelectTier: (tierId: string) => void;
  onStartExam: (examId: string) => void;
  onOpenLearning?: (topicId?: string) => void;
  onOpenDiagnostic?: (mode?: 'intro' | 'test' | 'results') => void;
  onOpenFlashcards?: (topic?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  tiers,
  onNavigate,
  onSelectTier,
  onStartExam,
  onOpenLearning,
  onOpenDiagnostic,
  onOpenFlashcards,
}) => {
  const { t, isFrench } = useLanguage();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // SRS Deck Summary State (auto-updates via custom events & storage)
  const [srsSummary, setSrsSummary] = useState(() => {
    const records = loadSRSRecords();
    return computeSRSDeckSummary(flashcardsData, records);
  });

  useEffect(() => {
    const handleSRSUpdate = () => {
      const records = loadSRSRecords();
      setSrsSummary(computeSRSDeckSummary(flashcardsData, records));
    };
    window.addEventListener('storage', handleSRSUpdate);
    window.addEventListener('srs_updated', handleSRSUpdate);
    return () => {
      window.removeEventListener('storage', handleSRSUpdate);
      window.removeEventListener('srs_updated', handleSRSUpdate);
    };
  }, []);

  // Diagnostic result state
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(() =>
    getStoredDiagnosticResult()
  );

  // Read mastered objectives dynamically from localStorage
  const [masteredObjectiveIds, setMasteredObjectiveIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lpic_mastered_objectives');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (
            parsed.length === 3 &&
            parsed.includes('101.1') &&
            parsed.includes('101.2') &&
            parsed.includes('200.1')
          ) {
            return [];
          }
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Read practice exam history from localStorage
  const [examHistory, setExamHistory] = useState<ExamSessionHistory[]>(() => {
    try {
      const saved = localStorage.getItem('lpi_exam_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const savedObjs = localStorage.getItem('lpic_mastered_objectives');
        if (savedObjs) {
          setMasteredObjectiveIds(JSON.parse(savedObjs));
        }
        const savedHistory = localStorage.getItem('lpi_exam_history');
        if (savedHistory) {
          setExamHistory(JSON.parse(savedHistory));
        }
        setDiagnosticResult(getStoredDiagnosticResult());
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Compute Next Recommended Step dynamically
  // If diagnostic exists, target the highest-weight unmastered objective inside Top Priority #1 (or #2/#3)
  // Otherwise target the highest-weight unmastered objective across LPIC-1 (101-110)
  const nextRecommendedStep = useMemo(() => {
    const lpic1Topics = lpicTopicsData.filter(
      (topic) => topic.topicNumber && topic.topicNumber >= 101 && topic.topicNumber <= 110
    );

    // Check priorities from diagnostic first
    if (diagnosticResult && diagnosticResult.topPriorities && diagnosticResult.topPriorities.length > 0) {
      for (let i = 0; i < diagnosticResult.topPriorities.length; i++) {
        const prio = diagnosticResult.topPriorities[i];
        const targetTopic = lpic1Topics.find(
          (t) => t.topicNumber === prio.associatedTopicNumber || t.id === prio.associatedTopicId
        );

        if (targetTopic) {
          let candidateInPrio: {
            topicId: string;
            topicNumber: number;
            topicTitle: string;
            objectiveId: string;
            objectiveTitle: string;
            weight: number;
            examCode: string;
            examId: string;
            isFromDiagnostic?: boolean;
            diagnosticRank?: number;
            diagnosticDomainName?: string;
            diagnosticScore?: number;
          } | null = null;

          for (const obj of targetTopic.objectives) {
            if (!masteredObjectiveIds.includes(obj.id)) {
              if (!candidateInPrio || obj.weight > candidateInPrio.weight) {
                candidateInPrio = {
                  topicId: targetTopic.id,
                  topicNumber: targetTopic.topicNumber,
                  topicTitle: targetTopic.title,
                  objectiveId: obj.id,
                  objectiveTitle: obj.title,
                  weight: obj.weight,
                  examCode: targetTopic.examId === 'exam-102' ? '102-500' : '101-500',
                  examId: targetTopic.examId,
                  isFromDiagnostic: true,
                  diagnosticRank: i + 1,
                  diagnosticDomainName: isFrench ? prio.nameFr : prio.name,
                  diagnosticScore: prio.percentage,
                };
              }
            }
          }

          if (candidateInPrio) {
            return candidateInPrio;
          }
        }
      }
    }

    let candidateObj: {
      topicId: string;
      topicNumber: number;
      topicTitle: string;
      objectiveId: string;
      objectiveTitle: string;
      weight: number;
      examCode: string;
      examId: string;
      isFromDiagnostic?: boolean;
      diagnosticRank?: number;
      diagnosticDomainName?: string;
      diagnosticScore?: number;
    } | null = null;

    for (const topic of lpic1Topics) {
      for (const obj of topic.objectives) {
        if (!masteredObjectiveIds.includes(obj.id)) {
          if (!candidateObj || obj.weight > candidateObj.weight) {
            candidateObj = {
              topicId: topic.id,
              topicNumber: topic.topicNumber,
              topicTitle: topic.title,
              objectiveId: obj.id,
              objectiveTitle: obj.title,
              weight: obj.weight,
              examCode: topic.examId === 'exam-102' ? '102-500' : '101-500',
              examId: topic.examId,
            };
          }
        }
      }
    }

    return candidateObj;
  }, [masteredObjectiveIds, diagnosticResult, isFrench]);

  const sysArchDone = masteredObjectiveIds.filter((id) => id.startsWith('101.')).length;
  const sysArchTotal = 3;
  const systemArchProgress = Math.round((sysArchDone / sysArchTotal) * 100);

  const linuxInstDone = masteredObjectiveIds.filter((id) => id.startsWith('102.')).length;
  const linuxInstTotal = 5;
  const linuxInstProgress = Math.round((linuxInstDone / linuxInstTotal) * 100);

  const lpic1TotalObjs = 60;
  const lpic1DoneCount = masteredObjectiveIds.filter(
    (id) =>
      id.startsWith('101.') ||
      id.startsWith('102.') ||
      id.startsWith('103.') ||
      id.startsWith('104.') ||
      id.startsWith('105.') ||
      id.startsWith('106.') ||
      id.startsWith('107.') ||
      id.startsWith('108.') ||
      id.startsWith('109.') ||
      id.startsWith('110.')
  ).length;
  const lpic1Pct = Math.round((lpic1DoneCount / lpic1TotalObjs) * 100);

  const totalCardsCount = flashcardsData.length;
  const lpic1CardsCount = flashcardsData.filter((c) => c.topicNumber && c.topicNumber >= 101 && c.topicNumber <= 110).length;
  const lpic2CardsCount = flashcardsData.filter((c) => c.topicNumber && c.topicNumber >= 200 && c.topicNumber <= 212).length;
  const lpic3CardsCount = flashcardsData.filter((c) => c.topicNumber && c.topicNumber >= 300 && c.topicNumber <= 399).length;

  // Stats for recent exams
  const avgExamScore = useMemo(() => {
    if (examHistory.length === 0) return 0;
    const sum = examHistory.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / examHistory.length);
  }, [examHistory]);

  const quickTopics = [
    { id: 'topic-101', number: 101, title: 'System Architecture', exam: 'LPIC-1 (101)', weight: 8 },
    { id: 'topic-103', number: 103, title: 'GNU & Unix Commands', exam: 'LPIC-1 (101)', weight: 26 },
    { id: 'topic-109', number: 109, title: 'Networking Fundamentals', exam: 'LPIC-1 (102)', weight: 14 },
    { id: 'topic-200', number: 200, title: 'Capacity Planning', exam: 'LPIC-2 (201)', weight: 8 },
    { id: 'topic-208', number: 208, title: 'Web Services (Apache, Squid, Nginx)', exam: 'LPIC-2 (202)', weight: 12 },
    { id: 'topic-209', number: 209, title: 'File Sharing (Samba, NFS)', exam: 'LPIC-2 (202)', weight: 8 },
    { id: 'topic-210', number: 210, title: 'Network Client Management (DHCP, PAM, LDAP)', exam: 'LPIC-2 (202)', weight: 7 },
    { id: 'topic-211', number: 211, title: 'E-Mail Services (Postfix, Dovecot, Delivery)', exam: 'LPIC-2 (202)', weight: 8 },
    { id: 'topic-212', number: 212, title: 'System Security (Router, IDS, OpenVPN, IPsec)', exam: 'LPIC-2 (202)', weight: 10 },
    { id: 'topic-301', number: 301, title: 'Samba Basics (smb.conf, TDB/LDB, RPC)', exam: 'LPIC-3 (300)', weight: 11 },
  ];

  // Personalized Path State for Dashboard Widget
  const [personalizedConfig, setPersonalizedConfig] = useState(() => getStoredPersonalizedPathConfig());
  const [completedPathTaskIds, setCompletedPathTaskIds] = useState(() => getCompletedTaskIds());

  useEffect(() => {
    const handleUpdate = () => {
      setPersonalizedConfig(getStoredPersonalizedPathConfig());
      setCompletedPathTaskIds(getCompletedTaskIds());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lpic_path_updated', handleUpdate);
    window.addEventListener('lpic_task_completed', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lpic_path_updated', handleUpdate);
      window.removeEventListener('lpic_task_completed', handleUpdate);
    };
  }, []);

  const personalizedPathState = useMemo(() => {
    return calculatePersonalizedLearningPath(
      personalizedConfig,
      masteredObjectiveIds,
      diagnosticResult,
      completedPathTaskIds
    );
  }, [personalizedConfig, masteredObjectiveIds, diagnosticResult, completedPathTaskIds]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Certification Guide Modal */}
      <LpiCertificationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartExam={onStartExam}
        onOpenLearning={() => {
          if (onOpenLearning) onOpenLearning();
          else onNavigate('learning');
        }}
      />

      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
            {t.dashboard.welcomeBack}, {userStats.name}
          </h2>
          <p className="text-[#4f4632] text-sm md:text-base mt-1">
            {t.dashboard.welcomeSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Guide Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="bg-[#fff8f2] text-[#785a00] border border-[#ffc20e] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ffc20e]/20 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#785a00]" />
            <span>{t.dashboard.guideBtn}</span>
          </button>

          <button
            onClick={() => onNavigate('training')}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#785a00]" />
            <span>{t.nav.training}</span>
          </button>
          <button
            onClick={() => onNavigate('glossary')}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Library className="w-4 h-4" />
            <span>{t.nav.glossary}</span>
          </button>
          <button
            onClick={() => (onOpenLearning ? onOpenLearning() : onNavigate('learning'))}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.dashboard.studyModules}</span>
          </button>
          <button
            onClick={() => onStartExam('exam-101')}
            className="bg-[#ffc20e] text-[#6d5100] px-4 md:px-5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#f9bd00] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.dashboard.continueExam}</span>
          </button>
        </div>
      </section>

      {/* 1. Diagnostic First Launch Invitation Banner (If not yet completed) */}
      {!diagnosticResult && (
        <div className="bg-[#fff8f2] border-2 border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start gap-4 z-10">
            <div className="w-12 h-12 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ffc20e] text-[#6d5100]">
                  {isFrench ? 'Évaluation Initiale Recommandée' : 'Recommended Initial Assessment'}
                </span>
                <span className="text-xs font-mono font-bold text-[#785a00] bg-[#ffffff] px-2 py-0.5 rounded border border-[#ffc20e]/60">
                  20 {isFrench ? 'Questions • 6 Domaines' : 'Questions • 6 Domains'}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-[#201b11] mt-1">
                {isFrench
                  ? 'Passez le test diagnostic pour calibrer votre matrice et vos 3 priorités'
                  : 'Take the diagnostic test to calibrate your skills matrix and top 3 priorities'}
              </h3>
              <p className="text-xs md:text-sm text-[#4f4632]">
                {isFrench
                  ? 'Évaluez vos compétences sur Architecture, Commandes GNU/Linux, Filesystems, Bash, Réseau et Sécurité pour piloter vos révisions de manière ciblée.'
                  : 'Assess your skills across Architecture, GNU/Linux Commands, Filesystems, Bash, Networking and Security to power your targeted study engine.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 z-10">
            <button
              onClick={() => onOpenDiagnostic && onOpenDiagnostic('intro')}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFrench ? 'Démarrer le diagnostic' : 'Start diagnostic'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 🎯 MON PARCOURS LPIC — Dynamic Goal & Daily Training Engine Widget */}
      <div className="bg-gradient-to-br from-[#ffffff] via-[#fffdfa] to-[#fef2e1] border-2 border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffc20e]/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#ebdcc8]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#ffc20e] text-[#6d5100]">
                  🎯 {isFrench ? 'Mon parcours LPIC' : 'My LPIC Path'}
                </span>
                <span className="text-xs font-mono font-bold text-[#785a00]">
                  {CERTIFICATION_GOALS.find((g) => g.id === personalizedConfig.goal)?.examCode || '101-500'}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-[#201b11] mt-0.5">
                {isFrench ? personalizedConfig.goalTitleFr : personalizedConfig.goalTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onNavigate('path')}
            className="w-full lg:w-auto px-4 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{isFrench ? 'Ouvrir mon parcours complet' : 'Open Full Roadmap'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 relative z-10">
          <div className="bg-white/90 p-2.5 rounded-xl border border-[#d3c5ab]/60">
            <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider block">
              {isFrench ? 'Niveau initial' : 'Starting Level'}
            </span>
            <span className="text-lg font-black text-[#201b11]">
              {personalizedConfig.hasTakenDiagnostic ? `${personalizedConfig.initialDiagnosticScore} %` : '60 %'}
            </span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-[#d3c5ab]/60">
            <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider block">
              {isFrench ? 'Temps / jour' : 'Time / day'}
            </span>
            <span className="text-lg font-black text-[#201b11]">
              {personalizedConfig.dailyMinutes} min
            </span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-[#d3c5ab]/60">
            <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider block">
              {isFrench ? 'Date cible' : 'Target Date'}
            </span>
            <span className="text-base font-black text-[#201b11] truncate block">
              {new Date(personalizedConfig.targetDate).toLocaleDateString(isFrench ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-[#d3c5ab]/60">
            <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider block">
              {isFrench ? 'Progression estimée' : 'Est. Progress'}
            </span>
            <span className="text-lg font-black text-[#0061a4]">
              {personalizedPathState.estimatedProgressPct} %
            </span>
          </div>
        </div>

        {/* Today's 4 Tasks Quick Bar */}
        <div className="pt-3 border-t border-[#ebdcc8] relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-[#201b11] mb-2.5">
            <span className="uppercase tracking-wider text-[#785a00] flex items-center gap-1.5">
              <span>📅</span>
              <span>{isFrench ? 'Aujourd\'hui : 4 micro-tâches calibrées' : 'Today: 4 calibrated micro-tasks'}</span>
            </span>
            <span className="text-[#817660]">
              {personalizedPathState.todayPlan.tasks.filter((t) => t.completed).length} / 4 {isFrench ? 'faits' : 'done'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {personalizedPathState.todayPlan.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onNavigate('path')}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  task.completed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-white border-[#d3c5ab] hover:border-[#ffc20e]'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <span>
                      {task.type === 'concept' ? '📚' : task.type === 'flashcards' ? '🧠' : task.type === 'lab' ? '💻' : '📝'}
                    </span>
                    <span className="truncate">{isFrench ? task.titleFr : task.title}</span>
                  </div>
                  <span className="text-[10px] text-[#817660] block mt-0.5">
                    ~{task.estimatedMinutes} min
                  </span>
                </div>
                {task.completed && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Next Step Banner (Action directe 1-clic) */}
      <div className="bg-[#fff8f2] border border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4 z-10">
          <div className="w-12 h-12 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0 shadow-xs">
            {nextRecommendedStep?.isFromDiagnostic ? (
              <Target className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ffc20e] text-[#6d5100]">
                {t.dashboard.nextStepTitle}
              </span>
              {nextRecommendedStep?.isFromDiagnostic && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                  {isFrench
                    ? `🎯 Priorité #${nextRecommendedStep.diagnosticRank} (${nextRecommendedStep.diagnosticDomainName} ${nextRecommendedStep.diagnosticScore}%)`
                    : `🎯 Priority #${nextRecommendedStep.diagnosticRank} (${nextRecommendedStep.diagnosticDomainName} ${nextRecommendedStep.diagnosticScore}%)`}
                </span>
              )}
              {nextRecommendedStep && (
                <span className="text-xs font-mono font-bold text-[#785a00] bg-[#ffffff] px-2 py-0.5 rounded border border-[#ffc20e]/60">
                  {nextRecommendedStep.examCode} • Obj {nextRecommendedStep.objectiveId}
                </span>
              )}
              {nextRecommendedStep && (
                <span className="inline-flex items-center gap-1 text-xs text-[#817660] font-semibold bg-[#ffffff] px-2 py-0.5 rounded border border-[#d3c5ab]/60">
                  <span>{t.dashboard.nextStepWeightBadge}: {nextRecommendedStep.weight}</span>
                  <InfoTooltip
                    title={t.dashboard.weight}
                    content={t.dashboard.weightTooltip}
                  />
                </span>
              )}
            </div>

            {nextRecommendedStep ? (
              <>
                <h3 className="text-base md:text-lg font-bold text-[#201b11] mt-1">
                  {isFrench ? 'Thème' : 'Topic'} {nextRecommendedStep.topicNumber} : {nextRecommendedStep.topicTitle} — {nextRecommendedStep.objectiveTitle}
                </h3>
                <p className="text-xs md:text-sm text-[#4f4632]">
                  {nextRecommendedStep.isFromDiagnostic
                    ? isFrench
                      ? `Recommandé directement par votre test diagnostic pour consolider vos acquis en ${nextRecommendedStep.diagnosticDomainName}.`
                      : `Recommended directly by your diagnostic test to strengthen your foundation in ${nextRecommendedStep.diagnosticDomainName}.`
                    : t.dashboard.nextStepSubtitle}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base md:text-lg font-bold text-[#201b11] mt-1">
                  {t.dashboard.allObjectivesMastered}
                </h3>
                <p className="text-xs md:text-sm text-[#4f4632]">
                  {t.dashboard.allObjectivesMasteredDesc}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 z-10">
          {nextRecommendedStep ? (
            <button
              onClick={() => {
                if (onOpenLearning) {
                  onOpenLearning(nextRecommendedStep.topicId);
                } else {
                  onNavigate('learning');
                }
              }}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.dashboard.nextStepAction}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onStartExam('exam-101')}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.dashboard.takeFinalExam}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Matrice Diagnostique & Tes 3 Priorités Card (When diagnostic is completed) */}
      {diagnosticResult && (
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebdcc8] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f8ecdb] border border-[#d3c5ab] text-[#785a00] flex items-center justify-center font-bold shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-bold text-[#201b11]">
                    {isFrench ? 'Matrice Diagnostique & Vos 3 Priorités' : 'Diagnostic Matrix & Top 3 Priorities'}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#fff8f2] border border-[#ffc20e] text-[#785a00]">
                    {diagnosticResult.percentage}% ({diagnosticResult.correctAnswers}/{diagnosticResult.totalQuestions})
                  </span>
                </div>
                <p className="text-xs text-[#4f4632]">
                  {isFrench
                    ? `Dernière évaluation le ${new Date(diagnosticResult.completedAt).toLocaleDateString('fr-FR')} • Alimente le moteur de recommandation`
                    : `Last evaluated on ${new Date(diagnosticResult.completedAt).toLocaleDateString()} • Powers the recommendation engine`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDiagnostic && onOpenDiagnostic('results')}
                className="px-3 py-1.5 rounded-lg border border-[#d3c5ab] hover:bg-[#fbf5ed] text-[#4f4632] text-xs font-bold transition-colors cursor-pointer"
              >
                {isFrench ? 'Matrice complète' : 'Full matrix'}
              </button>
              <button
                onClick={() => onOpenDiagnostic && onOpenDiagnostic('test')}
                className="px-3 py-1.5 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Refaire le test' : 'Retake test'}</span>
              </button>
            </div>
          </div>

          {/* Grid: 6 Domains Table (Left) + 3 Priorities (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: 6 Domains Table (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#4f4632] px-1">
                <span>{isFrench ? 'Domaine' : 'Domain'}</span>
                <span>{isFrench ? 'Niveau' : 'Level'}</span>
              </div>

              <div className="border border-[#ebdcc8] rounded-xl overflow-hidden divide-y divide-[#ebdcc8] bg-[#fdfaf5]">
                {diagnosticResult.domainScores.map((domain) => {
                  const isHigh = domain.percentage >= 75;
                  const isMed = domain.percentage >= 50 && domain.percentage < 75;
                  const badgeEmoji = isHigh ? '🟢' : isMed ? '🟠' : '🔴';
                  const barColor = isHigh ? 'bg-emerald-500' : isMed ? 'bg-amber-500' : 'bg-rose-500';

                  return (
                    <div
                      key={domain.domainId}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-[#ffffff] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-medium text-[#201b11] min-w-[140px]">
                        <span className="text-sm">{badgeEmoji}</span>
                        <span className="font-bold">{isFrench ? domain.nameFr : domain.name}</span>
                      </div>

                      <div className="flex-1 max-w-[170px] hidden sm:block">
                        <div className="w-full h-2 bg-[#ebdcc8] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                            style={{ width: `${domain.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold text-[#201b11] min-w-[50px]">
                        {domain.percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Tes 3 Priorités (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700 px-1">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{isFrench ? 'Tes 3 priorités' : 'Your 3 Priorities'}</span>
                </span>
                <span className="text-[10px] text-[#817660] font-normal">
                  {isFrench ? 'Action directe' : 'Direct action'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {diagnosticResult.topPriorities.map((prio, idx) => (
                  <div
                    key={prio.domainId}
                    className="p-3 rounded-xl border border-[#ebdcc8] bg-[#fbf5ed] flex items-center justify-between gap-3 hover:border-[#ffc20e] transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            idx === 0
                              ? 'bg-rose-100 text-rose-800'
                              : idx === 1
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#ebdcc8] text-[#4f4632]'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-xs text-[#201b11]">
                          {isFrench ? prio.nameFr : prio.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#817660] font-mono">
                        Topic {prio.associatedTopicNumber} • {prio.percentage}%
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          if (onOpenLearning) onOpenLearning(prio.associatedTopicId);
                          else onNavigate('learning');
                        }}
                        title={isFrench ? 'Étudier ce thème' : 'Study this topic'}
                        className="px-2 py-1 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{isFrench ? 'Cours' : 'Learn'}</span>
                      </button>
                      <button
                        onClick={() => onNavigate('training')}
                        title={isFrench ? 'Pratique hands-on' : 'Hands-on practice'}
                        className="px-2 py-1 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Labs</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Weakness Engine: Mes Faiblesses & Entraînement Ciblé */}
      <WeaknessEngineWidget
        onNavigateToTraining={(mode) => onNavigate('training')}
        onNavigateToExam={(examId) => onStartExam(examId || 'exam-101')}
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column: Progress & Goals */}
        <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
          {/* Current Progress Card with Tooltip */}
          <div className="bg-[#f8ecdb] rounded-xl p-5 md:p-6 border border-[#d3c5ab] shadow-xs flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#495e8a] uppercase tracking-wider">
                    {t.dashboard.currentTarget}
                  </span>
                  <InfoTooltip
                    title={t.dashboard.currentTarget}
                    content={t.dashboard.targetProgressTooltip}
                  />
                </div>
                <h3 className="text-xl font-bold text-[#201b11] mt-0.5">
                  {userStats.currentTarget}
                </h3>
              </div>
              <CheckCircle2 className="w-6 h-6 text-[#28A745] fill-[#28A745]/20" />
            </div>

            {/* System Architecture */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                <span className="flex items-center gap-1">
                  <span>{t.dashboard.systemArchitecture}</span>
                  <InfoTooltip
                    title={t.dashboard.systemArchitecture}
                    content={isFrench ? "Thème 101 LPIC-1 (Poids 8) : Matériel, amorçage, runlevels et cibles systemd." : "Topic 101 LPIC-1 (Weight 8): Hardware, boot process, runlevels and systemd targets."}
                  />
                </span>
                <span>{systemArchProgress}%</span>
              </div>
              <div className="w-full bg-[#ece1d0] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${systemArchProgress}%` }}
                />
              </div>
            </div>

            {/* Linux Installation */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                <span className="flex items-center gap-1">
                  <span>{t.dashboard.linuxInstallation}</span>
                  <InfoTooltip
                    title={t.dashboard.linuxInstallation}
                    content={isFrench ? "Thème 102 LPIC-1 (Poids 11) : Partitionnement, gestionnaires de paquets Debian/RPM et bibliothèques partagées." : "Topic 102 LPIC-1 (Weight 11): Partitioning, Debian/RPM package managers and shared libraries."}
                  />
                </span>
                <span>{linuxInstProgress}%</span>
              </div>
              <div className="w-full bg-[#ece1d0] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${linuxInstProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily Streak Card with Tooltip */}
          <div className="bg-[#d8e2ff] rounded-xl p-5 md:p-6 border border-[#b7ccfe] shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#314671] uppercase tracking-wider">
                  {t.dashboard.dailyStreak}
                </span>
                <InfoTooltip
                  title={t.dashboard.dailyStreak}
                  content={t.dashboard.streakTooltip}
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Flame className="w-6 h-6 text-[#E67E22] fill-[#E67E22]" />
                <span className="text-xl font-bold text-[#001a42]">
                  {userStats.streakDays} {t.common.days}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#314671] uppercase tracking-wider">
                {t.common.questions}
              </span>
              <div className="text-xl font-bold text-[#001a42] mt-1 font-mono">
                {userStats.questionsDoneToday} / {userStats.dailyGoal}
              </div>
            </div>
          </div>

          {/* Official Exam Metrics Box with Duration & Passing Score Reminder */}
          <div className="bg-[#ffffff] rounded-xl p-5 border border-[#d3c5ab] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#817660] uppercase tracking-wider flex items-center gap-1">
                <span>{isFrench ? 'Métriques d\'examen officiel' : 'Official Exam Standards'}</span>
                <InfoTooltip
                  title={isFrench ? 'Règles LPI' : 'LPI Standards'}
                  content={t.dashboard.examMetricsTooltip}
                />
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ebdcc8] text-[#785a00]">
                LPI 2026
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#fdf9f4] p-2.5 rounded-lg border border-[#d3c5ab]/60">
                <span className="text-[10px] uppercase font-bold text-[#817660] block">
                  {isFrench ? 'Durée réelle' : 'Official Time'}
                </span>
                <span className="text-sm font-bold text-[#201b11]">90 min</span>
                <span className="text-[10px] text-[#785a00] block mt-0.5">
                  {isFrench ? 'App : 45 min test' : 'App: 45 min sprint'}
                </span>
              </div>

              <div className="bg-[#fdf9f4] p-2.5 rounded-lg border border-[#d3c5ab]/60">
                <span className="text-[10px] uppercase font-bold text-[#817660] block">
                  {isFrench ? 'Score requis' : 'Passing Mark'}
                </span>
                <span className="text-sm font-bold text-[#28A745]">70 % (500/800)</span>
                <span className="text-[10px] text-[#817660] block mt-0.5">
                  60 {isFrench ? 'questions' : 'questions'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Certification Path Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* 🚨 NOUVEAU : INCIDENT RESPONSE BANNER */}
          <div
            onClick={() => onNavigate('training')}
            className="bg-[#1e1313] border-2 border-[#ba1a1a] rounded-2xl p-4 md:p-5 text-white shadow-md relative overflow-hidden cursor-pointer hover:border-red-400 hover:shadow-lg transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#ba1a1a] text-white text-[10px] font-extrabold uppercase tracking-widest rounded">
                      {isFrench ? '🚨 NOUVEL ATELIER' : '🚨 NEW LAB'}
                    </span>
                    <span className="px-2 py-0.5 bg-red-950/80 border border-red-700/60 text-red-200 text-[10px] font-bold rounded">
                      {isFrench ? 'Astreinte & Pannes Réelles' : 'Live Incident Triage'}
                    </span>
                    <span className="text-xs text-red-300/80 font-mono">15 min chrono</span>
                  </div>
                  <h4 className="text-base md:text-lg font-bold font-serif text-white mt-1">
                    {isFrench ? 'Incident Response : Raisonnement & Dépannage Réaliste' : 'Incident Response: Realistic Sysadmin Outage Triage'}
                  </h4>
                  <p className="text-xs text-red-100/80 mt-0.5 leading-relaxed max-w-xl">
                    {isFrench
                      ? 'Serveurs inaccessibles au boot, systemd bloqué, saturation d\'inodes, sockets en conflit... Sorties CLI réelles (journalctl, ss, mount, df), indices progressifs et diagnostic RCA.'
                      : 'Server boot lockups, systemd halts, inode exhaustion, port collisions... Real CLI outputs (journalctl, ss, mount, df), progressive hints, and root-cause analysis.'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 sm:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('training');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{isFrench ? 'Résoudre un incident' : 'Start Incident Lab'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* THEMATIC LEARNING PATHS (SANS CERTIFICATION) */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-xl font-bold text-[#201b11]">
                  {isFrench ? 'Parcours Thématiques Métier' : 'Thematic Career Paths'}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ffc20e]/30 text-[#785a00] border border-[#ffc20e]/60 uppercase tracking-wider">
                  {isFrench ? 'Indépendant LPI' : 'Career Roadmaps'}
                </span>
                <InfoTooltip
                  title={isFrench ? "Parcours Thématiques" : "Thematic Skill Paths"}
                  content={isFrench ? "Feuilles de route progressives axées sur le savoir-faire pratique (Admin, Bash, Réseau) sans obligation de passer une certification." : "Progressive roadmaps focused on practical hands-on mastery (Admin, Bash, Networking) independent of certification exams."}
                />
              </div>
              <button
                onClick={() => {
                  try {
                    localStorage.setItem('cert_path_view_mode', 'thematic');
                  } catch {}
                  onNavigate('path');
                }}
                className="text-xs font-bold text-[#785a00] hover:underline uppercase tracking-wider cursor-pointer"
              >
                {isFrench ? 'Voir les 3 parcours →' : 'View all 3 paths →'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {thematicLearningPaths.map((path) => {
                const completedCount = getThematicPathProgress(path.id).length;
                const totalCount = path.steps.length;
                const pct = Math.round((completedCount / totalCount) * 100);

                return (
                  <div
                    key={path.id}
                    onClick={() => {
                      try {
                        localStorage.setItem('cert_path_view_mode', 'thematic');
                      } catch {}
                      onNavigate('path');
                    }}
                    className={`bg-[#ffffff] rounded-xl border ${path.borderColor} p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-[#ffc20e]`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{path.emoji}</span>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${path.badgeColor}`}>
                            {isFrench ? path.difficultyFr : path.difficulty}
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-[#785a00] bg-[#fff8f2] border border-[#d3c5ab] px-2 py-0.5 rounded">
                          {pct}%
                        </span>
                      </div>

                      <h4 className="font-extrabold text-[#201b11] text-base group-hover:text-[#785a00] transition-colors line-clamp-1">
                        {isFrench ? path.titleFr : path.title}
                      </h4>

                      <p className="text-xs text-[#4f4632] mt-1 line-clamp-2 leading-relaxed">
                        {isFrench ? path.descriptionFr : path.description}
                      </p>

                      {/* Step sequence preview */}
                      <div className="mt-3 pt-2.5 border-t border-[#f0e4d2] text-[11px] text-[#6e634e] font-mono line-clamp-1">
                        {path.steps.map((s) => s.title.split(':')[0]).join(' ↓ ')}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f0e4d2] flex items-center justify-between text-xs">
                      <div className="flex-1 mr-3">
                        <div className="w-full h-1.5 bg-[#ece1d0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%`, backgroundColor: path.accentHex }}
                          />
                        </div>
                        <span className="text-[10px] text-[#817660] mt-1 block">
                          {completedCount} / {totalCount} {isFrench ? 'étapes validées' : 'steps completed'}
                        </span>
                      </div>
                      <span className="font-bold text-[#785a00] group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
                        {isFrench ? 'Ouvrir' : 'Open'} →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#201b11]">{t.dashboard.certPath}</h3>
              <InfoTooltip
                title={t.dashboard.certPath}
                content={isFrench ? "Parcours progressif en 4 paliers : Linux Essentials (initiation), LPIC-1 (administrateur), LPIC-2 (ingénieur) et spécialités LPIC-3." : "Progressive 4-tier journey: Linux Essentials (literacy), LPIC-1 (administrator), LPIC-2 (engineer), and LPIC-3 specialties."}
              />
            </div>
            <button
              onClick={() => onNavigate('path')}
              className="text-xs font-bold text-[#785a00] hover:underline uppercase tracking-wider cursor-pointer"
            >
              {t.dashboard.viewFullPath} →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LPIC-1 Card */}
            <div
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#ffc20e]"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-1 Logo"
                  className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                  src="/lpic-1.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOhdrjtM5GESOO_G3NptEHGSY9JxAvXjpHZ67Z9T1_EFVVeMa2S7VVikLqRsW0HmGlO12TrKVAJ4-A91bsR0wNKxAoHTH8SFtFK-OP2X4iunJIUfIkdrmGedPmMl-qg5pB3VNp0vd5ChGR8-bS-bKZQ4F8cX-konp-PHlepO4F5GxWU139c8kBlPq4sLfrFaFz7Hu_UvP71eiOJwN1wjS-03sXoMH5Gkry-YacArysYMHEZkF4iRX') {
                      target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOhdrjtM5GESOO_G3NptEHGSY9JxAvXjpHZ67Z9T1_EFVVeMa2S7VVikLqRsW0HmGlO12TrKVAJ4-A91bsR0wNKxAoHTH8SFtFK-OP2X4iunJIUfIkdrmGedPmMl-qg5pB3VNp0vd5ChGR8-bS-bKZQ4F8cX-konp-PHlepO4F5GxWU139c8kBlPq4sLfrFaFz7Hu_UvP71eiOJwN1wjS-03sXoMH5Gkry-YacArysYMHEZkF4iRX';
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#785a00] uppercase tracking-wider">
                    {isFrench ? 'Échelon Actif' : 'Active Tier'}
                  </span>
                  <h4 className="font-bold text-[#201b11] text-base mt-0.5">
                    LPIC-1: Administrator
                  </h4>
                  <p className="text-xs text-[#4f4632] mt-1 line-clamp-2">
                    {isFrench
                      ? 'Examens 101 & 102 : architecture système, paquetages, réseau et sécurité.'
                      : 'Exams 101 & 102: system architecture, packages, networking, and security.'}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                    <span>{isFrench ? 'Objectifs validés' : 'Mastered'}</span>
                    <span>{lpic1Pct}%</span>
                  </div>
                  <div className="w-full bg-[#ece1d0] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                      style={{ width: `${lpic1Pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* LPIC-2 Card */}
            <div
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#ffc20e]"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-2 Logo"
                  className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                  src="/lpic-2.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqT9Pj_d3_m6F9W4_3j1fP_tQ0Vw_6l2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j') {
                      target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqT9Pj_d3_m6F9W4_3j1fP_tQ0Vw_6l2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j';
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider">
                    {isFrench ? 'Échelon Avancé' : 'Next Tier'}
                  </span>
                  <h4 className="font-bold text-[#201b11] text-base mt-0.5">
                    LPIC-2: Linux Engineer
                  </h4>
                  <p className="text-xs text-[#4f4632] mt-1 line-clamp-2">
                    {isFrench
                      ? 'Examens 201 & 202 : noyau, démarrage, serveurs réseau et sécurité approfondie.'
                      : 'Exams 201 & 202: kernel, startup, network servers, and advanced security.'}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                    <span>{t.dashboard.cardsReady}</span>
                    <span className="text-[#785a00] font-mono">{lpic2CardsCount}</span>
                  </div>
                  <div className="w-full bg-[#ece1d0] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#ffc20e] h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* LPIC-3 Card */}
            <div
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#ffc20e]"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-3 Logo"
                  className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                  src="/lpic-3.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqT9Pj_d3_m6F9W4_3j1fP_tQ0Vw_6l2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j') {
                      target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFqT9Pj_d3_m6F9W4_3j1fP_tQ0Vw_6l2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j';
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider">
                    {isFrench ? 'Échelon Expert' : 'Expert Tier'}
                  </span>
                  <h4 className="font-bold text-[#201b11] text-base mt-0.5">
                    LPIC-3: Enterprise
                  </h4>
                  <p className="text-xs text-[#4f4632] mt-1 line-clamp-2">
                    {isFrench
                      ? 'Spécialités 300 (Environnements mixtes), 303 (Sécurité), 305 (Virtualisation) & 306 (Haute dispo).'
                      : 'Specialties 300 (Mixed Env), 303 (Security), 305 (Virtualization) & 306 (High Availability).'}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                    <span>{t.dashboard.specialties}</span>
                    <span className="text-[#785a00] font-mono">4 {isFrench ? 'examens' : 'exams'}</span>
                  </div>
                  <div className="w-full bg-[#ece1d0] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#ffc20e] h-full rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Practice Exam Performance Widget (Dernières performances d'entraînement) */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d3c5ab]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#ffc20e] text-[#6d5100] text-[10px] font-bold uppercase tracking-wider rounded">
                {isFrench ? 'Historique' : 'History'}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#201b11]">
                {t.dashboard.recentHistoryTitle}
              </h3>
              <InfoTooltip
                title={t.dashboard.recentHistoryTitle}
                content={isFrench ? "Conserve les résultats de vos 10 derniers examens blancs passés dans le simulateur, avec calcul de moyenne." : "Stores scores from your last 10 practice simulations, tracking passing status and averages."}
              />
            </div>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
              {examHistory.length > 0
                ? `${examHistory.length} ${t.dashboard.examsTakenCount.toLowerCase()} • ${t.dashboard.avgScore} : ${avgExamScore} %`
                : t.dashboard.recentHistoryEmptyDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('practice')}
              className="px-3.5 py-2 rounded-lg border border-[#785a00] text-[#785a00] hover:bg-[#fff8f2] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {t.dashboard.viewAllExamsBtn}
            </button>
            <button
              onClick={() => onStartExam('exam-101')}
              className="px-4 py-2 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.dashboard.startExam}</span>
            </button>
          </div>
        </div>

        {examHistory.length === 0 ? (
          <div className="bg-[#fdf9f4] border border-dashed border-[#d3c5ab] rounded-xl p-6 text-center space-y-3">
            <Award className="w-10 h-10 text-[#d3c5ab] mx-auto" />
            <div>
              <h4 className="font-bold text-sm text-[#201b11]">
                {t.dashboard.recentHistoryEmpty}
              </h4>
              <p className="text-xs text-[#817660] max-w-md mx-auto mt-1">
                {t.dashboard.recentHistoryEmptyDesc}
              </p>
            </div>
            <button
              onClick={() => onStartExam('exam-101')}
              className="px-4 py-2 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.dashboard.startFirstExamBtn}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {examHistory.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[#d3c5ab] bg-[#fdf9f4] hover:bg-[#ffffff] hover:border-[#785a00] transition-all flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#817660] uppercase">
                      {item.examCode}
                    </span>
                    <h4 className="font-bold text-sm text-[#201b11] mt-0.5">
                      {item.examName}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      item.passed
                        ? 'bg-[#28A745]/15 text-[#1b702e] border border-[#28A745]/30'
                        : 'bg-[#dc3545]/15 text-[#a71d2a] border border-[#dc3545]/30'
                    }`}
                  >
                    {item.passed ? t.dashboard.statusPassed : t.dashboard.statusFailed}
                  </span>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-[#d3c5ab]/50 text-xs">
                  <div>
                    <span className="text-[10px] text-[#817660] block">
                      {new Date(item.date).toLocaleDateString(isFrench ? 'fr-FR' : 'en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-[#4f4632] font-semibold">
                      {item.correctCount} / {item.totalQuestions} {isFrench ? 'justes' : 'correct'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-[#201b11]">
                      {item.score}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SRS « Révision du jour » Spaced Repetition Engine Widget */}
      <div className="bg-[#fff8f2] border-2 border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center text-3xl font-bold shrink-0 shadow-xs">
              🧠
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#785a00] text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {isFrench ? 'Moteur de Répétition Espacée (SRS)' : 'Spaced Repetition System (SRS)'}
                </span>
                <span className="px-2.5 py-0.5 bg-[#ba1a1a] text-white text-[11px] font-bold rounded-md flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5" />
                  <span>
                    {isFrench
                      ? `${srsSummary.dueTodayCount} carte${srsSummary.dueTodayCount > 1 ? 's' : ''} à revoir aujourd'hui`
                      : `${srsSummary.dueTodayCount} card${srsSummary.dueTodayCount > 1 ? 's' : ''} due today`}
                  </span>
                </span>
                <span className="text-xs text-[#817660]">
                  {totalCardsCount} {isFrench ? 'cartes LPIC indexées' : 'total LPIC cards indexed'}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#201b11] mt-1.5 flex items-center gap-2">
                <span>{isFrench ? '« Révision du jour »' : '« Daily Review »'}</span>
                <span className="text-xs font-normal text-[#817660]">
                  (Algorithme 10 min • 1j • 3j • 7j • 14j • 30j • 60j)
                </span>
              </h3>

              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 max-w-2xl leading-relaxed">
                {isFrench
                  ? 'La répétition espacée calcule scientifiquement le moment exact où votre cerveau s\'apprête à oublier une commande, un fichier de configuration ou une notion système pour l\'ancrer définitivement dans votre mémoire à long terme.'
                  : 'Spaced repetition algorithmically schedules cards just as your memory begins to fade, securing Linux administration commands, configuration paths, and architectures into permanent memory.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto shrink-0">
            <button
              onClick={() => (onOpenFlashcards ? onOpenFlashcards('srs-daily') : onNavigate('flashcards'))}
              className="px-6 py-3.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs md:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Brain className="w-4 h-4 text-[#6d5100]" />
              <span>
                {isFrench
                  ? `Lancer la révision (${srsSummary.dueTodayCount})`
                  : `Start Daily Review (${srsSummary.dueTodayCount})`}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => (onOpenFlashcards ? onOpenFlashcards('all') : onNavigate('flashcards'))}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#f8ecdb] text-[#4f4632] border border-[#d3c5ab] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Explorer les 20 thèmes' : 'Browse All 20 Topics'}</span>
            </button>
          </div>
        </div>

        {/* SRS Interval Progression Ladder & Metrics Grid */}
        <div className="pt-3 border-t border-[#d3c5ab]/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Ladder Visual */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] font-semibold text-[#4f4632] flex-wrap">
            <span className="text-[10px] uppercase font-bold text-[#817660] mr-1">Intervalles :</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#d3c5ab] text-[#ba1a1a] font-mono font-bold">10 min</span>
            <span className="text-[#817660]">➔</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#d3c5ab] text-[#1976d2] font-mono font-bold">1 jour</span>
            <span className="text-[#817660]">➔</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#d3c5ab] text-[#1976d2] font-mono font-bold">3 jours</span>
            <span className="text-[#817660]">➔</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#d3c5ab] text-[#1976d2] font-mono font-bold">7 jours</span>
            <span className="text-[#817660]">➔</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#d3c5ab] text-[#1976d2] font-mono font-bold">14 jours</span>
            <span className="text-[#817660]">➔</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#d3c5ab] text-[#1976d2] font-mono font-bold">30 jours</span>
            <span className="text-[#817660]">➔</span>
            <span className="px-2 py-0.5 rounded bg-[#e8f5e9] border border-[#2e7d32]/30 text-[#2e7d32] font-mono font-bold">60 jours (Maîtrisée)</span>
          </div>

          {/* Quick Counter Summary */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#4f4632]">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
              <span>Dues : <strong className="text-[#ba1a1a]">{srsSummary.dueTodayCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#4f4632]">
              <span className="w-2 h-2 rounded-full bg-[#1976d2]" />
              <span>En cours : <strong className="text-[#1976d2]">{srsSummary.learningCount + srsSummary.reviewCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#4f4632]">
              <span className="w-2 h-2 rounded-full bg-[#2e7d32]" />
              <span>Maîtrisées : <strong className="text-[#2e7d32]">{srsSummary.masteredCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Learning Section with Weight Tooltips */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d3c5ab]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#ffc20e] text-[#6d5100] text-[10px] font-bold uppercase tracking-wider rounded">
                {t.dashboard.studyModules}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#201b11]">
                {isFrench ? 'Chapitres de cours officiels LPIC-1, LPIC-2 & LPIC-3' : 'Official LPIC-1, LPIC-2 & LPIC-3 Study Chapters'}
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
              {isFrench
                ? 'Explorez les domaines clés, syntaxes de commandes et fichiers de configuration pour les examens 101, 102, 201, 202, 300, 303, 305 & 306.'
                : 'Explore key knowledge areas, command syntax, and configuration files for Exams 101, 102, 201, 202, 300, 303, 305 & 306.'}
            </p>
          </div>

          <button
            onClick={() => (onOpenLearning ? onOpenLearning() : onNavigate('learning'))}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#785a00] hover:underline cursor-pointer"
          >
            <span>{isFrench ? 'Voir tous les thèmes & objectifs' : 'View All Topics & Objectives'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Topics Grid with Weight Tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => (onOpenLearning ? onOpenLearning(topic.id) : onNavigate('learning'))}
              className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#fdf9f4] hover:bg-[#ffffff] hover:border-[#785a00] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded">
                    {topic.exam}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#817660]">
                    <span>{isFrench ? 'Poids' : 'Weight'}: {topic.weight}</span>
                    <InfoTooltip
                      title={`${isFrench ? 'Poids officiel LPI' : 'Official Weight'} (${topic.weight})`}
                      content={t.dashboard.weightTooltip}
                    />
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#201b11] group-hover:text-[#785a00] transition-colors">
                  {isFrench ? 'Thème' : 'Topic'} {topic.number}: {topic.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 text-xs font-bold text-[#785a00]">
                <span>{isFrench ? 'Objectifs d\'étude' : 'Study Objectives'}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
