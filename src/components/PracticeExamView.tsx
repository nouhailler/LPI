import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { PracticeQuestion } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  practiceExamsRegistry,
  getExamQuestions,
  PracticeExamInfo,
} from '../data/practiceExamsData';

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

  // Exam state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  // Fetch questions for active exam & language
  const questions = useMemo<PracticeQuestion[]>(() => {
    return getExamQuestions(activeExamId, isFrench);
  }, [activeExamId, isFrench]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const answeredCount = Object.keys(userAnswers).length;

  // Filtered exams list for lobby selector
  const filteredExams = useMemo(() => {
    if (selectedTierFilter === 'all') return practiceExamsRegistry;
    return practiceExamsRegistry.filter((e) => e.tier === selectedTierFilter);
  }, [selectedTierFilter]);

  // Start exam from lobby
  const handleStartExam = (examId?: string) => {
    if (examId) {
      setActiveExamId(examId);
    }
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers({});
    setFlaggedQuestions({});
    setScreenMode('exam');
    if (onStartTimer) onStartTimer();
  };

  // Select an answer option
  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));
  };

  // Navigate to specific question index
  const handleJumpToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    setCurrentIndex(targetIndex);
    const targetQId = questions[targetIndex].id;
    setSelectedOption(userAnswers[targetQId] !== undefined ? userAnswers[targetQId] : null);
  };

  // Previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleJumpToQuestion(currentIndex - 1);
    }
  };

  // Next question or Finish
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      handleJumpToQuestion(currentIndex + 1);
    } else {
      // Complete exam
      setScreenMode('results');
      if (onStopTimer) onStopTimer();

      let correct = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) {
          correct++;
        }
      });
      onCompleteSession(correct, questions.length, activeExamId);
    }
  };

  // Toggle flag on current question
  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Retake current exam
  const handleRetake = () => {
    handleStartExam(activeExamId);
  };

  // Back to lobby
  const handleReturnToLobby = () => {
    setShowExitConfirm(false);
    setScreenMode('lobby');
    if (onStopTimer) onStopTimer();
  };

  // ==========================================
  // RENDER 1: LOBBY / EXAM WELCOME SCREEN
  // ==========================================
  if (screenMode === 'lobby') {
    return (
      <div className="max-w-5xl mx-auto w-full py-2 md:py-6 flex flex-col gap-6 pb-20">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ffc20e]/20 text-[#785a00] border border-[#785a00]/30">
                {isFrench ? 'Simulateur LPI' : 'LPI Simulator'}
              </span>
              <span className="text-xs text-[#817660]">
                {isFrench ? 'Conditions réelles d\'examen' : 'Official exam conditions'}
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
            className="px-4 py-2 border border-[#d3c5ab] text-[#4f4632] hover:text-[#201b11] hover:bg-[#f8ecdb] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {isFrench ? 'Tableau de bord' : 'Dashboard'}
          </button>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTierFilter('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedTierFilter === 'all'
                ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            {isFrench ? 'Tous les examens' : 'All Exams'} ({practiceExamsRegistry.length})
          </button>
          <button
            onClick={() => setSelectedTierFilter('lpic-1')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedTierFilter === 'lpic-1'
                ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            LPIC-1 (101 & 102)
          </button>
          <button
            onClick={() => setSelectedTierFilter('lpic-2')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedTierFilter === 'lpic-2'
                ? 'bg-[#0061a4] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            LPIC-2 (201 & 202)
          </button>
          <button
            onClick={() => setSelectedTierFilter('lpic-3')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedTierFilter === 'lpic-3'
                ? 'bg-[#0284c7] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
            }`}
          >
            LPIC-3 (300, 303, 305, 306)
          </button>
          <button
            onClick={() => setSelectedTierFilter('essentials')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
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
                    {isFrench ? 'Session test' : 'Test session'}
                  </span>
                  <span className="font-bold text-sm text-[#201b11]">
                    {questions.length} {isFrench ? 'questions' : 'questions'}
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
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="start-exam-button"
                  onClick={() => handleStartExam(activeExamId)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{t.practice.startExam}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: RESULTS SCREEN
  // ==========================================
  if (screenMode === 'results') {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = scorePct >= currentExamInfo.passScorePct;

    return (
      <div className="max-w-3xl mx-auto w-full py-4 md:py-6 flex flex-col gap-6 pb-20">
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-6 md:p-8 text-center shadow-xs flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-[#28A745]/15 text-[#28A745]' : 'bg-[#ffc20e]/20 text-[#785a00]'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817660]">
              {isFrench ? currentExamInfo.titleFr : currentExamInfo.title}
            </span>
            <span className="text-xs font-mono text-[#785a00] font-semibold">
              ({currentExamInfo.code})
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#201b11] mt-1 mb-2">
            {passed ? t.practice.passedTitle : t.practice.failedTitle}
          </h2>
          <p className="text-sm text-[#4f4632] max-w-md mb-6">
            {passed ? t.practice.passedDesc : t.practice.failedDesc}
          </p>

          {/* Score Badge */}
          <div className="flex gap-4 md:gap-6 justify-center mb-6">
            <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl px-6 py-3">
              <span className="text-xs text-[#817660] font-bold block">{t.practice.score}</span>
              <span className="text-3xl font-bold text-[#201b11]">{scorePct}%</span>
            </div>
            <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl px-6 py-3">
              <span className="text-xs text-[#817660] font-bold block">{t.practice.correct}</span>
              <span className="text-3xl font-bold text-[#28A745]">
                {correctCount} / {questions.length}
              </span>
            </div>
            <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl px-6 py-3">
              <span className="text-xs text-[#817660] font-bold block">{t.practice.passingScore}</span>
              <span className="text-3xl font-bold text-[#785a00]">{currentExamInfo.passScorePct}%</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 px-4 rounded-lg bg-[#f8ecdb] hover:bg-[#f2e7d6] text-[#201b11] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-[#d3c5ab]"
            >
              <RotateCcw className="w-4 h-4" />
              {t.practice.retake}
            </button>
            <button
              onClick={handleReturnToLobby}
              className="flex-1 py-3 px-4 rounded-lg bg-[#ffffff] hover:bg-[#f8ecdb] text-[#785a00] font-bold text-xs uppercase tracking-wider transition-colors border border-[#785a00]"
            >
              {t.practice.changeExam}
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 px-4 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              {t.practice.backToDashboard}
            </button>
          </div>
        </div>

        {/* Review Question Breakdown */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#201b11]">{t.practice.review}</h3>
            <span className="text-xs text-[#817660]">
              {questions.length} {isFrench ? 'questions évaluées' : 'questions evaluated'}
            </span>
          </div>

          {questions.map((q, i) => {
            const isCorrect = userAnswers[q.id] === q.correctIndex;
            const userChoice = userAnswers[q.id] !== undefined ? q.options[userAnswers[q.id]] : null;
            const wasFlagged = flaggedQuestions[q.id];

            return (
              <div
                key={q.id}
                className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 md:p-5 flex flex-col gap-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[#28A745] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-[#817660] uppercase tracking-wider">
                        {q.category} {wasFlagged && '· 🚩'}
                      </span>
                      <span className="font-bold text-sm md:text-base text-[#201b11]">
                        Q{i + 1}. {q.question}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded shrink-0 ${
                      isCorrect
                        ? 'bg-[#28A745]/15 text-[#28A745]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {isCorrect ? t.practice.correctBadge : t.practice.incorrectBadge}
                  </span>
                </div>

                {/* User answer vs correct answer */}
                <div className="text-xs text-[#4f4632] bg-[#fff8f2] p-3.5 rounded-lg border border-[#d3c5ab]/60 flex flex-col gap-2">
                  {!isCorrect && userChoice && (
                    <div>
                      <span className="font-bold text-[#ba1a1a] block mb-0.5">
                        {isFrench ? 'Votre réponse :' : 'Your answer:'}
                      </span>
                      <code className="font-mono text-xs text-[#ba1a1a] bg-[#ffdad6]/60 px-2 py-0.5 rounded inline-block">
                        {userChoice}
                      </code>
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-[#28A745] block mb-0.5">
                      {t.practice.correctAnswer} :
                    </span>
                    <code className="font-mono text-xs text-[#201b11] font-bold bg-[#f8ecdb] px-2 py-0.5 rounded inline-block border border-[#d3c5ab]/60">
                      {q.options[q.correctIndex]}
                    </code>
                  </div>

                  <p className="mt-1 text-[#4f4632] leading-relaxed">{q.explanation}</p>

                  {q.commandSnippet && (
                    <div className="mt-1 bg-[#201b11] text-[#f8ecdb] font-mono text-[11px] p-2 rounded overflow-x-auto">
                      {q.commandSnippet}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 3: ACTIVE EXAM IN PROGRESS
  // ==========================================
  const isFlagged = flaggedQuestions[currentQuestion.id] || false;

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-5 pb-20">
      {/* Top Controls: Switch Exam & Flag for review */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (answeredCount > 0) {
              setShowExitConfirm(true);
            } else {
              handleReturnToLobby();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#817660] hover:text-[#201b11] hover:bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.practice.changeExamBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white"
            style={{ backgroundColor: currentExamInfo.accentColor }}
          >
            {currentExamInfo.code}
          </span>
          <button
            onClick={handleToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isFlagged
                ? 'bg-[#ffc20e] text-[#6d5100] border-[#785a00]'
                : 'bg-[#ffffff] text-[#817660] border-[#d3c5ab] hover:bg-[#f8ecdb]'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-[#6d5100]' : ''}`} />
            <span>{isFlagged ? t.practice.flagged : t.practice.flagForReview}</span>
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
            {t.practice.question} {currentIndex + 1} {t.practice.of} {questions.length}
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
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-3 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#817660]">
          <span>{t.practice.questionNavigator}</span>
          <span>
            {answeredCount}/{questions.length} {isFrench ? 'répondues' : 'answered'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, idx) => {
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
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans text-xl md:text-2xl font-bold text-[#201b11] leading-snug">
            {currentQuestion.question}
          </h2>
          {currentQuestion.scenario && (
            <div className="p-3 bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg">
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
                className={`relative flex items-center p-3.5 md:p-4 cursor-pointer border rounded-lg transition-all duration-150 group ${
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

                {/* Monospace option pill */}
                <span className="font-mono text-xs md:text-sm text-[#201b11] bg-[#f8ecdb] px-2.5 py-1 rounded border border-[#d3c5ab]/60">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex justify-between items-center mt-2 gap-3">
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

          {/* Explanation Button */}
          <button
            onClick={() => onOpenExplanation(currentQuestion)}
            className="flex items-center gap-2 px-3.5 py-2.5 border border-[#495e8a] text-[#495e8a] rounded-lg font-bold text-xs md:text-sm hover:bg-[#495e8a] hover:text-[#ffffff] transition-colors cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{t.practice.explain}</span>
          </button>
        </div>

        {/* Next Question / Finish Exam Button */}
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-xs ${
            selectedOption !== null
              ? 'bg-[#ffc20e] text-[#6d5100] hover:bg-[#f9bd00] cursor-pointer active:scale-95'
              : 'bg-[#d3c5ab]/50 text-[#817660] cursor-not-allowed'
          }`}
        >
          <span>{currentIndex === questions.length - 1 ? t.practice.finish : t.practice.next}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#ba1a1a]">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
              </div>
              <h3 className="font-bold text-lg text-[#201b11]">
                {t.practice.confirmExit}
              </h3>
            </div>

            <p className="text-sm text-[#4f4632]">
              {t.practice.confirmExitDesc}
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 border border-[#d3c5ab] rounded-lg text-xs font-bold uppercase tracking-wider text-[#4f4632] hover:bg-[#f8ecdb]"
              >
                {t.practice.cancel}
              </button>
              <button
                onClick={handleReturnToLobby}
                className="px-4 py-2 bg-[#ba1a1a] text-[#ffffff] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#93000a]"
              >
                {t.practice.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
