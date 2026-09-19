import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Clock,
  Target,
  HelpCircle,
  Flag,
  ChevronRight,
  AlertTriangle,
  FileText,
  Compass,
  ShieldAlert,
  Zap,
  Check,
  Send,
} from 'lucide-react';
import { PracticeQuestion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  practiceExamsRegistry,
  getExamQuestions,
  PracticeExamInfo,
} from '../data/practiceExamsData';
import { recordQuestionInteraction } from '../utils/weaknessEngine';
import {
  shuffleExamQuestions,
  computeExamSessionAnalytics,
  ExamSessionAnalytics,
} from '../utils/examAnalytics';
import { ExamPostAnalysis } from './practice/ExamPostAnalysis';

interface PracticeExamViewProps {
  initialExamId?: string;
  onCompleteSession: (correctCount: number, total: number, examId: string) => void;
  onExit: () => void;
  onOpenExplanation: (question: PracticeQuestion) => void;
  onStartTimer?: () => void;
  onStopTimer?: () => void;
}

export const PracticeExamView: React.FC<PracticeExamViewProps> = ({
  initialExamId = 'exam-101',
  onCompleteSession,
  onExit,
  onOpenExplanation,
  onStartTimer,
  onStopTimer,
}) => {
  const { isFrench, t } = useLanguage();

  // Screen modes: 'lobby' (welcome/choice) | 'exam' (active testing) | 'results'
  const [screenMode, setScreenMode] = useState<'lobby' | 'exam' | 'results'>('lobby');
  const [activeExamId, setActiveExamId] = useState<string>(initialExamId);
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'essentials' | 'lpic-1' | 'lpic-2' | 'lpic-3'>('all');

  // Exam mode: 'realistic' (official simulator - default) vs 'practice' (learning mode with explanations)
  const [examMode, setExamMode] = useState<'realistic' | 'practice'>('realistic');

  // Active questions in session (shuffled if realistic)
  const [activeQuestions, setActiveQuestions] = useState<PracticeQuestion[]>([]);

  // Exam runtime state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Strict countdown timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(45 * 60);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [totalTimeElapsedSeconds, setTotalTimeElapsedSeconds] = useState<number>(0);

  // Time tracking per individual question
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const questionEnterTimeRef = useRef<number>(Date.now());

  // Modals
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showTimeExpiredModal, setShowTimeExpiredModal] = useState(false);

  // Computed analytics when session is finished
  const [sessionAnalytics, setSessionAnalytics] = useState<ExamSessionAnalytics | null>(null);

  // Sync initialExamId if parent updates it
  useEffect(() => {
    if (initialExamId) {
      setActiveExamId(initialExamId);
    }
  }, [initialExamId]);

  // Current active exam info
  const currentExamInfo = useMemo<PracticeExamInfo>(() => {
    return (
      practiceExamsRegistry.find((e) => e.id === activeExamId) ||
      practiceExamsRegistry[1] // fallback to exam-101
    );
  }, [activeExamId]);

  // Filtered exams list for lobby selector
  const filteredExams = useMemo(() => {
    if (selectedTierFilter === 'all') return practiceExamsRegistry;
    return practiceExamsRegistry.filter((e) => e.tier === selectedTierFilter);
  }, [selectedTierFilter]);

  const currentQuestion = activeQuestions[currentIndex] || activeQuestions[0] || null;
  const progressPercent =
    activeQuestions.length > 0 ? Math.round(((currentIndex + 1) / activeQuestions.length) * 100) : 0;
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = Math.max(0, activeQuestions.length - answeredCount);
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  // Helper: Commit elapsed time for current question
  const commitCurrentQuestionTime = () => {
    if (!currentQuestion) return;
    const now = Date.now();
    const elapsed = Math.max(1, Math.round((now - questionEnterTimeRef.current) / 1000));
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + elapsed,
    }));
    questionEnterTimeRef.current = now;
  };

  // Strict Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (screenMode === 'exam' && isExamActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            // Time expired! Auto submit
            clearInterval(interval!);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [screenMode, isExamActive, timeLeftSeconds]);

  // Handle time expiration
  const handleTimeExpired = () => {
    commitCurrentQuestionTime();
    setIsExamActive(false);
    setShowTimeExpiredModal(true);
  };

  // Start exam from lobby
  const handleStartExam = (examId?: string) => {
    const targetExamId = examId || activeExamId;
    if (examId) {
      setActiveExamId(examId);
    }

    const rawQuestions = getExamQuestions(targetExamId, isFrench);
    // In realistic mode, questions are shuffled
    const questionsToUse =
      examMode === 'realistic' ? shuffleExamQuestions(rawQuestions, false) : rawQuestions;

    const examInfo =
      practiceExamsRegistry.find((e) => e.id === targetExamId) || currentExamInfo;
    const durationSeconds = examInfo.durationMinutes * 60;

    setActiveQuestions(questionsToUse);
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers({});
    setFlaggedQuestions({});
    setQuestionTimes({});
    setTimeLeftSeconds(durationSeconds);
    setExamStartTime(Date.now());
    setTotalTimeElapsedSeconds(0);
    setIsExamActive(true);
    questionEnterTimeRef.current = Date.now();
    setSessionAnalytics(null);
    setShowTimeExpiredModal(false);
    setShowFinishConfirm(false);
    setShowExitConfirm(false);

    setScreenMode('exam');
    if (onStartTimer) onStartTimer();
  };

  // Select an answer option
  const handleSelectOption = (idx: number) => {
    if (!currentQuestion) return;
    setSelectedOption(idx);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));
  };

  // Navigate to specific question index
  const handleJumpToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= activeQuestions.length) return;
    commitCurrentQuestionTime();
    setCurrentIndex(targetIndex);
    const targetQId = activeQuestions[targetIndex].id;
    setSelectedOption(userAnswers[targetQId] !== undefined ? userAnswers[targetQId] : null);
    questionEnterTimeRef.current = Date.now();
  };

  // Previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleJumpToQuestion(currentIndex - 1);
    }
  };

  // Next question or trigger Finish modal
  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      handleJumpToQuestion(currentIndex + 1);
    } else {
      // At last question, ask confirmation to submit
      setShowFinishConfirm(true);
    }
  };

  // Toggle flag on current question
  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Finalize and Submit Exam
  const handleSubmitExam = () => {
    commitCurrentQuestionTime();
    setIsExamActive(false);
    if (onStopTimer) onStopTimer();

    const totalElapsed = Math.round((Date.now() - examStartTime) / 1000);
    setTotalTimeElapsedSeconds(totalElapsed);

    // Compute complete post-exam analytics
    const analytics = computeExamSessionAnalytics({
      examId: activeExamId,
      questions: activeQuestions,
      userAnswers,
      flaggedQuestions,
      questionTimes,
      totalTimeElapsedSeconds: totalElapsed,
      isFrench,
    });

    setSessionAnalytics(analytics);

    // Record interactions for weakness engine
    activeQuestions.forEach((q) => {
      const isAnswered = userAnswers[q.id] !== undefined;
      const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
      try {
        recordQuestionInteraction({
          questionId: q.id,
          questionText: q.question,
          category: q.category,
          isCorrect,
          timeSpentSeconds: questionTimes[q.id] || 45,
          wasFlagged: !!flaggedQuestions[q.id],
          wasSkipped: !isAnswered,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      } catch {}
    });

    onCompleteSession(analytics.correctCount, activeQuestions.length, activeExamId);
    setShowFinishConfirm(false);
    setShowTimeExpiredModal(false);
    setScreenMode('results');
  };

  // Retake current exam
  const handleRetake = () => {
    handleStartExam(activeExamId);
  };

  // Back to lobby
  const handleReturnToLobby = () => {
    commitCurrentQuestionTime();
    setIsExamActive(false);
    setShowExitConfirm(false);
    setShowFinishConfirm(false);
    setShowTimeExpiredModal(false);
    setScreenMode('lobby');
    if (onStopTimer) onStopTimer();
  };

  const formatTimerClock = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimerLow = timeLeftSeconds <= 300; // < 5 minutes
  const isTimerCritical = timeLeftSeconds <= 60; // < 1 minute

  // ==========================================
  // RENDER 1: LOBBY / EXAM WELCOME SCREEN
  // ==========================================
  if (screenMode === 'lobby') {
    const sampleQuestions = getExamQuestions(activeExamId, isFrench);

    return (
      <div className="max-w-5xl mx-auto w-full py-2 md:py-6 flex flex-col gap-6 pb-20">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ffc20e]/20 text-[#785a00] border border-[#785a00]/30">
                {isFrench ? 'Simulateur LPI Officiel' : 'Official LPI Simulator'}
              </span>
              <span className="text-xs text-[#817660]">
                {isFrench ? 'Conditions réelles d\'examen' : 'Realistic exam conditions'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
              {t.practice.examLobby}
            </h1>
            <p className="text-sm text-[#4f4632] mt-1 max-w-2xl">
              {t.practice.examLobbySubtitle}
            </p>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 border border-[#d3c5ab] text-[#4f4632] hover:text-[#201b11] hover:bg-[#f8ecdb] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isFrench ? 'Tableau de bord' : 'Dashboard'}
          </button>
        </div>

        {/* Mode Selector Cards: Realistic Mode vs Practice Mode */}
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#201b11]">
                {isFrench ? 'Mode de passage de l\'examen blanc' : 'Practice Exam Mode'}
              </h3>
              <p className="text-xs text-[#817660]">
                {isFrench
                  ? 'Sélectionnez le niveau d\'exigence de votre session'
                  : 'Choose the strictness level of your exam session'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Mode Examen Réaliste (Default) */}
            <div
              onClick={() => setExamMode('realistic')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-3 relative ${
                examMode === 'realistic'
                  ? 'border-[#785a00] bg-[#fff8f2] shadow-sm ring-1 ring-[#785a00]'
                  : 'border-[#d3c5ab] hover:border-[#817660] bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#785a00] text-white flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#201b11]">
                      {isFrench ? 'Mode Examen Réaliste' : 'Realistic Exam Mode'}
                    </h4>
                    <span className="text-[10px] font-bold text-[#785a00] uppercase tracking-wider">
                      {isFrench ? 'Recommandé · Simulation officielle' : 'Recommended · Official Simulation'}
                    </span>
                  </div>
                </div>
                {examMode === 'realistic' && (
                  <span className="w-5 h-5 rounded-full bg-[#785a00] text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <ul className="text-xs text-[#4f4632] space-y-1.5 mt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0" />
                  <span>{isFrench ? 'Chronomètre strict avec soumission automatique à 00:00' : 'Strict countdown timer with auto-submit'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0" />
                  <span>{isFrench ? 'Questions et énoncés mélangés aléatoirement' : 'Randomly shuffled questions'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0" />
                  <span>{isFrench ? 'Pondération officielle des domaines LPI' : 'Official LPI domain weighting'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0" />
                  <span>{isFrench ? 'Aucune explication ni correction pendant l\'épreuve' : 'No explanations during testing'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0" />
                  <span>{isFrench ? 'Analyse post-examen complète et diagnostic des risques' : 'Detailed post-exam analysis & risk diagnosis'}</span>
                </li>
              </ul>
            </div>

            {/* 2. Mode Entraînement Guidé */}
            <div
              onClick={() => setExamMode('practice')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-3 relative ${
                examMode === 'practice'
                  ? 'border-[#0061a4] bg-[#f0f7fc] shadow-sm ring-1 ring-[#0061a4]'
                  : 'border-[#d3c5ab] hover:border-[#817660] bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#0061a4] text-white flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#201b11]">
                      {isFrench ? 'Mode Entraînement Guidé' : 'Guided Practice Mode'}
                    </h4>
                    <span className="text-[10px] font-bold text-[#0061a4] uppercase tracking-wider">
                      {isFrench ? 'Apprentissage pas à pas' : 'Step-by-step learning'}
                    </span>
                  </div>
                </div>
                {examMode === 'practice' && (
                  <span className="w-5 h-5 rounded-full bg-[#0061a4] text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <ul className="text-xs text-[#4f4632] space-y-1.5 mt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0061a4] shrink-0" />
                  <span>{isFrench ? 'Accès aux explications et commandes à tout moment' : 'Instant explanations and command hints'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0061a4] shrink-0" />
                  <span>{isFrench ? 'Sans pression temporelle stricte' : 'Self-paced exploration without strict cutoff'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0061a4] shrink-0" />
                  <span>{isFrench ? 'Idéal pour découvrir les notions avant l\'examen blanc' : 'Ideal for learning before full simulations'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTierFilter('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTierFilter === 'all'
                ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            {isFrench ? 'Tous les examens' : 'All Exams'} ({practiceExamsRegistry.length})
          </button>
          <button
            onClick={() => setSelectedTierFilter('lpic-1')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTierFilter === 'lpic-1'
                ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            LPIC-1 (101 & 102)
          </button>
          <button
            onClick={() => setSelectedTierFilter('lpic-2')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTierFilter === 'lpic-2'
                ? 'bg-[#0061a4] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            LPIC-2 (201 & 202)
          </button>
          <button
            onClick={() => setSelectedTierFilter('lpic-3')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTierFilter === 'lpic-3'
                ? 'bg-[#0284c7] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            LPIC-3 (300, 303, 305, 306)
          </button>
          <button
            onClick={() => setSelectedTierFilter('essentials')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTierFilter === 'essentials'
                ? 'bg-[#0061a4] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            Linux Essentials
          </button>
        </div>

        {/* Two Columns: Left = Exams List, Right = Selected Exam Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Exams Selection Cards */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817660] px-1">
              {t.practice.selectExam}
            </span>
            <div className="flex flex-col gap-2.5">
              {filteredExams.map((exam) => {
                const isSelected = exam.id === activeExamId;
                return (
                  <div
                    key={exam.id}
                    onClick={() => setActiveExamId(exam.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#ffffff] border-[#785a00] shadow-sm ring-2 ring-[#785a00]/30'
                        : 'bg-[#ffffff] border-[#d3c5ab] hover:border-[#817660] hover:bg-[#fef2e1]'
                    }`}
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white"
                          style={{ backgroundColor: exam.accentColor }}
                        >
                          {exam.tierLabel}
                        </span>
                        <span className="text-xs font-mono font-semibold text-[#817660]">
                          {exam.code}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#201b11] truncate">
                        {isFrench ? exam.titleFr : exam.title}
                      </h3>
                      <p className="text-xs text-[#4f4632] line-clamp-1">
                        {isFrench ? exam.subtitleFr : exam.subtitle}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#f8ecdb] text-[#785a00]">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Exam Detailed Card & Launch CTA */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
              {/* Badge & Code */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece1d0] pb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: currentExamInfo.accentColor }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#817660]">
                    {currentExamInfo.tierLabel}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]/60">
                    {currentExamInfo.code}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#817660]">
                  {isFrench ? 'Épreuve officielle LPI' : 'Official LPI Exam'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl font-bold text-[#201b11] mb-2">
                  {isFrench ? currentExamInfo.titleFr : currentExamInfo.title}
                </h2>
                <p className="text-sm font-medium text-[#785a00] mb-3">
                  {isFrench ? currentExamInfo.subtitleFr : currentExamInfo.subtitle}
                </p>
                <p className="text-sm text-[#4f4632] leading-relaxed">
                  {isFrench ? currentExamInfo.descriptionFr : currentExamInfo.description}
                </p>
              </div>

              {/* 4 Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#fef2e1] border border-[#d3c5ab]/80 rounded-xl p-3 text-center">
                  <Clock className="w-4 h-4 text-[#785a00] mx-auto mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#817660] block">
                    {t.practice.examDuration}
                  </span>
                  <span className="font-bold text-sm text-[#201b11]">
                    {currentExamInfo.durationMinutes} min
                  </span>
                </div>

                <div className="bg-[#fef2e1] border border-[#d3c5ab]/80 rounded-xl p-3 text-center">
                  <Target className="w-4 h-4 text-[#28A745] mx-auto mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#817660] block">
                    {t.practice.passingScore}
                  </span>
                  <span className="font-bold text-sm text-[#28A745]">
                    {currentExamInfo.passScorePct}% (500/800)
                  </span>
                </div>

                <div className="bg-[#fef2e1] border border-[#d3c5ab]/80 rounded-xl p-3 text-center">
                  <FileText className="w-4 h-4 text-[#0061a4] mx-auto mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#817660] block">
                    {isFrench ? 'Questions session' : 'Questions pool'}
                  </span>
                  <span className="font-bold text-sm text-[#201b11]">
                    {sampleQuestions.length} Q
                  </span>
                </div>

                <div className="bg-[#fef2e1] border border-[#d3c5ab]/80 rounded-xl p-3 text-center">
                  <Compass className="w-4 h-4 text-[#991b1b] mx-auto mb-1" />
                  <span className="text-[10px] uppercase font-bold text-[#817660] block">
                    {t.practice.totalQuestions}
                  </span>
                  <span className="font-bold text-sm text-[#201b11]">
                    {currentExamInfo.totalOfficialQuestions} Q
                  </span>
                </div>
              </div>

              {/* Topics Covered */}
              <div className="flex flex-col gap-2.5 bg-[#fff8f2] border border-[#d3c5ab]/70 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#817660]">
                  {t.practice.topicsCovered}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentExamInfo.topics.map((tp) => (
                    <div
                      key={tp.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#ffffff] border border-[#d3c5ab]/60"
                    >
                      <span className="text-[#201b11] font-medium truncate mr-2">
                        {isFrench ? tp.nameFr : tp.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] shrink-0">
                        {isFrench ? `Poids ${tp.weight}` : `Weight ${tp.weight}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Instructions & Call to action */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  id="start-exam-button"
                  onClick={() => handleStartExam(activeExamId)}
                  className="w-full py-4 px-6 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>
                    {examMode === 'realistic'
                      ? isFrench ? 'Lancer l\'Examen en Conditions Réelles' : 'Start Realistic Practice Exam'
                      : t.practice.startExam}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-[#817660]">
                  {examMode === 'realistic'
                    ? isFrench
                      ? '⏱️ Chronomètre strict · 🔀 Questions mélangées · 🚫 Aucune explication pendant l\'épreuve'
                      : '⏱️ Strict timer · 🔀 Shuffled questions · 🚫 No explanations during testing'
                    : isFrench
                    ? '💡 Mode entraînement avec accès aux explications pas à pas'
                    : '💡 Guided learning with step-by-step explanations'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: RESULTS SCREEN (POST-EXAM ANALYSIS)
  // ==========================================
  if (screenMode === 'results' && sessionAnalytics) {
    return (
      <ExamPostAnalysis
        analytics={sessionAnalytics}
        questions={activeQuestions}
        userAnswers={userAnswers}
        flaggedQuestions={flaggedQuestions}
        questionTimes={questionTimes}
        onRetakeExam={handleRetake}
        onChangeExam={handleReturnToLobby}
        onExitToDashboard={onExit}
        onOpenExplanationModal={onOpenExplanation}
      />
    );
  }

  // ==========================================
  // RENDER 3: ACTIVE EXAM IN PROGRESS
  // ==========================================
  if (!currentQuestion) return null;
  const isFlagged = flaggedQuestions[currentQuestion.id] || false;

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-5 pb-24 text-[#201b11]">
      {/* Top Controls: Leave Exam, Timer Badge & Flag for review */}
      <div className="flex items-center justify-between gap-2 bg-[#ffffff] border border-[#d3c5ab] rounded-xl px-4 py-2.5 shadow-xs">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#817660] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg border border-[#d3c5ab] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isFrench ? 'Abandonner' : 'Exit Exam'}</span>
        </button>

        {/* Strict Countdown Timer Badge */}
        <div
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs md:text-sm font-bold border transition-all ${
            isTimerCritical
              ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] animate-pulse'
              : isTimerLow
              ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/40'
              : 'bg-[#f8ecdb] text-[#785a00] border-[#d3c5ab]'
          }`}
          title={isFrench ? 'Temps restant avant soumission automatique' : 'Time remaining before auto-submit'}
        >
          <Clock className={`w-4 h-4 ${isTimerCritical ? 'text-white' : isTimerLow ? 'text-[#ba1a1a]' : 'text-[#785a00]'}`} />
          <span>{formatTimerClock(timeLeftSeconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Flag button */}
          <button
            onClick={handleToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              isFlagged
                ? 'bg-[#ffc20e] text-[#6d5100] border-[#785a00]'
                : 'bg-[#ffffff] text-[#817660] border-[#d3c5ab] hover:bg-[#f8ecdb]'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-[#6d5100]' : ''}`} />
            <span className="hidden sm:inline">{isFlagged ? t.practice.flagged : t.practice.flagForReview}</span>
          </button>

          {/* Quick Submit Button */}
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#785a00] text-white hover:bg-[#634a00] transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline">{isFrench ? 'Terminer' : 'Finish'}</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-xs md:text-sm font-semibold text-[#4f4632] truncate max-w-[65%]">
            {currentQuestion.category}
          </span>
          <span className="text-xs md:text-sm font-bold text-[#785a00] shrink-0">
            {t.practice.question} {currentIndex + 1} {t.practice.of} {activeQuestions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-[#ece1d0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffc20e] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Direct Question Navigation Grid (1 to N) */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-3.5 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#817660]">
          <span className="font-bold uppercase tracking-wider">{t.practice.questionNavigator}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#28A745]" />
              {answeredCount}/{activeQuestions.length} {isFrench ? 'répondues' : 'answered'}
            </span>
            {flaggedCount > 0 && (
              <span className="flex items-center gap-1 text-[#785a00]">
                <span>🚩</span> {flaggedCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {activeQuestions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = userAnswers[q.id] !== undefined;
            const hasFlag = flaggedQuestions[q.id];

            return (
              <button
                key={q.id}
                onClick={() => handleJumpToQuestion(idx)}
                title={`Question ${idx + 1}`}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center relative transition-all cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-[#785a00] bg-[#785a00] text-[#ffffff]'
                    : isAnswered
                    ? 'bg-[#28A745]/15 text-[#28A745] border border-[#28A745]/40 hover:bg-[#28A745]/25'
                    : 'bg-[#f8ecdb]/70 text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb]'
                }`}
              >
                {idx + 1}
                {hasFlag && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ffc20e] border border-[#785a00]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-7 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#817660]">
              Q{currentIndex + 1} / {activeQuestions.length}
            </span>
            {examMode === 'realistic' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00]">
                {isFrench ? 'Mode Réaliste' : 'Realistic Mode'}
              </span>
            )}
          </div>

          <h2 className="font-sans text-xl md:text-2xl font-bold text-[#201b11] leading-snug">
            {currentQuestion.question}
          </h2>

          {currentQuestion.scenario && (
            <div className="p-3.5 bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660] block mb-0.5">
                {isFrench ? 'Scénario pratique' : 'Practical Scenario'}
              </span>
              <p className="text-xs md:text-sm text-[#4f4632] leading-relaxed">
                {currentQuestion.scenario}
              </p>
            </div>
          )}
        </div>

        {/* Options (Radio Group) */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <label
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`relative flex items-center p-3.5 md:p-4 cursor-pointer border rounded-xl transition-all duration-150 group ${
                  isSelected
                    ? 'border-[#785a00] bg-[#f8ecdb]/60 shadow-xs ring-1 ring-[#785a00]'
                    : 'border-[#d3c5ab] hover:bg-[#fef2e1] bg-[#ffffff]'
                }`}
              >
                <input
                  type="radio"
                  name="quiz_option"
                  checked={isSelected}
                  onChange={() => handleSelectOption(idx)}
                  className="sr-only"
                />

                {/* Custom radio circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3.5 shrink-0 transition-colors ${
                    isSelected
                      ? 'border-[#785a00] bg-[#785a00]'
                      : 'border-[#817660] group-hover:border-[#785a00]'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full bg-[#ffffff] transition-transform ${
                      isSelected ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </div>

                {/* Option text */}
                <span className="font-mono text-xs md:text-sm text-[#201b11] bg-[#f8ecdb] px-2.5 py-1 rounded border border-[#d3c5ab]/60 leading-relaxed">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex justify-between items-center mt-1 gap-3">
        <div className="flex items-center gap-2">
          {/* Previous Question Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-bold text-xs md:text-sm border transition-colors ${
              currentIndex > 0
                ? 'border-[#817660] text-[#201b11] bg-[#ffffff] hover:bg-[#f8ecdb] cursor-pointer'
                : 'border-[#d3c5ab]/60 text-[#817660]/50 bg-[#f8ecdb]/30 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.practice.previous}</span>
          </button>

          {/* Explanation Button (ONLY available in practice mode, STRICTLY hidden in realistic exam) */}
          {examMode === 'practice' && (
            <button
              onClick={() => onOpenExplanation(currentQuestion)}
              className="flex items-center gap-2 px-3.5 py-2.5 border border-[#495e8a] text-[#495e8a] rounded-lg font-bold text-xs md:text-sm hover:bg-[#495e8a] hover:text-[#ffffff] transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{t.practice.explain}</span>
            </button>
          )}
        </div>

        {/* Next Question / Finish Exam Button */}
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider bg-[#ffc20e] text-[#6d5100] hover:bg-[#f9bd00] transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <span>
            {currentIndex === activeQuestions.length - 1
              ? isFrench ? 'Terminer l\'examen' : 'Finish Exam'
              : t.practice.next}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MODAL 1: Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#ba1a1a]">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
              </div>
              <h3 className="font-bold text-lg text-[#201b11]">
                {isFrench ? 'Abandonner l\'examen blanc ?' : 'Abandon ongoing exam?'}
              </h3>
            </div>

            <p className="text-sm text-[#4f4632] leading-relaxed">
              {isFrench
                ? 'Votre progression sur cette session sera interrompue. Souhaitez-vous vraiment retourner à l\'accueil des examens ?'
                : 'Your ongoing answers will not be recorded in full. Are you sure you want to exit to the exam lobby?'}
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 border border-[#d3c5ab] rounded-lg text-xs font-bold uppercase tracking-wider text-[#4f4632] hover:bg-[#f8ecdb] cursor-pointer"
              >
                {isFrench ? 'Continuer l\'examen' : 'Keep Taking Exam'}
              </button>
              <button
                onClick={handleReturnToLobby}
                className="px-4 py-2 bg-[#ba1a1a] text-[#ffffff] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#93000a] cursor-pointer"
              >
                {isFrench ? 'Confirmer l\'abandon' : 'Confirm Exit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Finish Exam Confirmation Modal (with summary) */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl max-w-md w-full p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-3 text-[#785a00]">
              <div className="w-10 h-10 rounded-xl bg-[#ffc20e]/25 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#201b11]">
                  {isFrench ? 'Valider et soumettre l\'examen ?' : 'Submit and Grade Exam?'}
                </h3>
                <span className="text-xs text-[#817660]">
                  {isFrench ? 'Récapitulatif de votre session' : 'Session summary before final submission'}
                </span>
              </div>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 bg-[#fef2e1] p-3 rounded-xl border border-[#d3c5ab]">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[#817660] block">
                  {isFrench ? 'Répondues' : 'Answered'}
                </span>
                <span className="font-mono font-bold text-base text-[#28A745]">
                  {answeredCount} / {activeQuestions.length}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[#817660] block">
                  {isFrench ? 'Sans réponse' : 'Blank'}
                </span>
                <span className={`font-mono font-bold text-base ${unansweredCount > 0 ? 'text-[#ba1a1a]' : 'text-[#817660]'}`}>
                  {unansweredCount}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[#817660] block">
                  {isFrench ? 'Marquées 🚩' : 'Flagged 🚩'}
                </span>
                <span className="font-mono font-bold text-base text-[#785a00]">
                  {flaggedCount}
                </span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3 bg-[#fff5f5] border border-[#ba1a1a]/30 rounded-lg text-xs text-[#ba1a1a] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {isFrench
                    ? 'Rappel LPI : Il n\'y a pas de point négatif ! Répondez par élimination même en cas d\'incertitude.'
                    : 'LPI Tip: There are no negative marks! Pick your best guess instead of leaving blanks.'}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-1">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-4 py-2.5 border border-[#d3c5ab] rounded-xl text-xs font-bold uppercase tracking-wider text-[#4f4632] hover:bg-[#f8ecdb] cursor-pointer"
              >
                {isFrench ? 'Reprendre l\'épreuve' : 'Review More'}
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2.5 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {isFrench ? 'Confirmer la soumission' : 'Grade My Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Time Expired Auto-Submit Modal */}
      {showTimeExpiredModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#ffffff] border-2 border-[#ba1a1a] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 text-center items-center">
            <div className="w-14 h-14 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-xl text-[#201b11]">
                {isFrench ? 'Temps écoulé !' : 'Time is Up!'}
              </h3>
              <p className="text-xs text-[#817660] mt-1">
                {isFrench
                  ? 'Le chronomètre officiel a atteint 00:00. Vos réponses sont enregistrées et l\'analyse post-examen va être générée.'
                  : 'The official timer reached 00:00. Your answers are submitted and your analysis report is ready.'}
              </p>
            </div>

            <button
              onClick={handleSubmitExam}
              className="w-full py-3.5 px-6 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              {isFrench ? 'Découvrir mon Analyse Post-Examen' : 'View Post-Exam Analysis'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
