import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Zap,
  Layers,
  Check,
  Award,
  BarChart3,
  ShieldCheck,
  Cpu,
  Terminal,
  HardDrive,
  Network,
} from 'lucide-react';
import {
  DiagnosticQuestion,
  DiagnosticResult,
  DiagnosticDomainScore,
  TabType,
} from '../types';
import {
  diagnosticQuestions,
  calculateDiagnosticResult,
  saveDiagnosticResult,
  getStoredDiagnosticResult,
  DIAGNOSTIC_DOMAINS,
} from '../data/diagnosticExamData';
import { useLanguage } from '../i18n/LanguageContext';

interface DiagnosticExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType, topicId?: string) => void;
  onStartExam?: (examId: string) => void;
  initialMode?: 'intro' | 'test' | 'results';
}

export const DiagnosticExamModal: React.FC<DiagnosticExamModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onStartExam,
  initialMode = 'intro',
}) => {
  const { isFrench } = useLanguage();

  const [currentStage, setCurrentStage] = useState<'intro' | 'test' | 'results'>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Sync with stored result or reset on modal open
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredDiagnosticResult();
      if (initialMode === 'results' && stored) {
        setResult(stored);
        setCurrentStage('results');
      } else if (initialMode === 'test') {
        setCurrentStage('test');
        setCurrentIndex(0);
        setAnswers({});
      } else {
        if (stored) {
          setResult(stored);
        }
        setCurrentStage('intro');
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const currentQ: DiagnosticQuestion = diagnosticQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalCount = diagnosticQuestions.length;
  const progressPct = Math.round((answeredCount / totalCount) * 100);

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    const computed = calculateDiagnosticResult(answers);
    saveDiagnosticResult(computed);
    setResult(computed);
    setCurrentStage('results');
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setCurrentStage('test');
  };

  const getDomainIcon = (domainId: string) => {
    switch (domainId) {
      case 'architecture':
        return <Cpu className="w-4 h-4" />;
      case 'commands':
        return <Terminal className="w-4 h-4" />;
      case 'filesystems':
        return <HardDrive className="w-4 h-4" />;
      case 'bash':
        return <Terminal className="w-4 h-4" />;
      case 'networking':
        return <Network className="w-4 h-4" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#fefcf8] border border-[#d3c5ab] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#ebdcc8] bg-[#f8ecdb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-[#201b11]">
                  {isFrench ? 'Évaluation Diagnostique de Niveau' : 'Diagnostic Level Assessment'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ffc20e] text-[#6d5100]">
                  20 {isFrench ? 'Questions' : 'Questions'}
                </span>
              </div>
              <p className="text-xs text-[#4f4632]">
                {isFrench
                  ? 'Matrice de compétences & 3 priorités d\'apprentissage'
                  : 'Skills Matrix & 3 Learning Priorities'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStage === 'test' && (
              <span className="text-xs font-mono font-bold text-[#785a00] bg-[#ffffff] px-2.5 py-1 rounded border border-[#ffc20e]/60">
                {answeredCount}/{totalCount}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#4f4632] hover:bg-[#ebdcc8] hover:text-[#201b11] transition-colors cursor-pointer"
              title={isFrench ? 'Fermer' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 text-[#201b11]">
          {/* ======================================================== */}
          {/* STAGE 1: INTRO                                           */}
          {/* ======================================================== */}
          {currentStage === 'intro' && (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto py-2">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ffc20e]/30 text-[#785a00] mx-auto border border-[#ffc20e]">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#201b11]">
                  {isFrench
                    ? 'Calibrez votre parcours d\'apprentissage LPIC'
                    : 'Calibrate your LPIC learning path'}
                </h3>
                <p className="text-sm md:text-base text-[#4f4632] leading-relaxed">
                  {isFrench
                    ? 'Cette évaluation initiale de 20 questions mesure vos points forts et faiblesses à travers 6 domaines fondamentaux du programme. Les résultats alimentent directement le moteur de recommandation.'
                    : 'This 20-question initial assessment gauges your strengths and gaps across 6 fundamental curriculum domains. Results directly power your personalized recommendation engine.'}
                </p>
              </div>

              {/* 6 Domains Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-1">
                {DIAGNOSTIC_DOMAINS.map((dom) => (
                  <div
                    key={dom.id}
                    className="p-3 rounded-xl border border-[#ebdcc8] bg-[#fbf5ed] flex items-center gap-2.5 text-xs font-medium text-[#201b11]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#ffffff] border border-[#d3c5ab] text-[#785a00] flex items-center justify-center shrink-0">
                      {getDomainIcon(dom.id)}
                    </div>
                    <div>
                      <div className="font-bold text-[#201b11]">{isFrench ? dom.nameFr : dom.name}</div>
                      <div className="text-[10px] text-[#817660]">Topic {dom.topicNumber}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Previous Result Notification if exists */}
              {result && (
                <div className="p-4 rounded-xl border border-[#d3c5ab] bg-[#fff8f2] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#817660]">
                      {isFrench ? 'Dernier résultat enregistré :' : 'Last recorded result:'}
                    </div>
                    <div className="text-sm font-bold text-[#201b11]">
                      {result.correctAnswers}/{result.totalQuestions} ({result.percentage}%) —{' '}
                      {new Date(result.completedAt).toLocaleDateString(isFrench ? 'fr-FR' : 'en-US')}
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStage('results')}
                    className="px-3 py-1.5 rounded-lg border border-[#785a00] text-[#785a00] hover:bg-[#ebdcc8] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isFrench ? 'Voir la matrice' : 'View matrix'}
                  </button>
                </div>
              )}

              {/* Start Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {result
                      ? isFrench
                        ? 'Repasser l\'évaluation (20 Q)'
                        : 'Retake assessment (20 Q)'
                      : isFrench
                      ? 'Démarrer l\'évaluation (15 min)'
                      : 'Start assessment (15 min)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[#d3c5ab] text-[#4f4632] hover:bg-[#ebdcc8] text-sm font-semibold transition-colors cursor-pointer"
                >
                  {isFrench ? 'Plus tard' : 'Later'}
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: TEST MODE                                       */}
          {/* ======================================================== */}
          {currentStage === 'test' && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {/* Progress Bar & Question Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#4f4632]">
                  <span className="font-bold text-[#201b11]">
                    {isFrench ? 'Question' : 'Question'} {currentIndex + 1} / {totalCount}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#ffc20e]"></span>
                    {answeredCount} {isFrench ? 'répondu(es)' : 'answered'}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#ebdcc8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ffc20e] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Question Card */}
              <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]/70">
                    {getDomainIcon(currentQ.domainId)}
                    <span>
                      {isFrench
                        ? DIAGNOSTIC_DOMAINS.find((d) => d.id === currentQ.domainId)?.nameFr
                        : DIAGNOSTIC_DOMAINS.find((d) => d.id === currentQ.domainId)?.name}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#817660] bg-[#fbf5ed] px-2 py-0.5 rounded border border-[#ebdcc8]">
                    Topic {currentQ.topicNumber} • Obj {currentQ.objectiveId}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-[#201b11] leading-relaxed">
                  {isFrench ? currentQ.questionFr : currentQ.question}
                </h3>

                {currentQ.commandSnippet && (
                  <div className="p-3 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs md:text-sm rounded-lg border border-[#333333] overflow-x-auto">
                    <code>{currentQ.commandSnippet}</code>
                  </div>
                )}

                {/* Options list */}
                <div className="space-y-2.5 pt-2">
                  {(isFrench ? currentQ.optionsFr : currentQ.options).map((option, idx) => {
                    const isSelected = answers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-[#ffc20e] bg-[#fff8f2] shadow-xs text-[#201b11] font-semibold ring-1 ring-[#ffc20e]'
                            : 'border-[#ebdcc8] hover:border-[#d3c5ab] hover:bg-[#fbf5ed] text-[#4f4632]'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                            isSelected
                              ? 'border-[#ffc20e] bg-[#ffc20e] text-[#6d5100]'
                              : 'border-[#d3c5ab] text-[#817660]'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-sm leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons & Question Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#d3c5ab] text-[#4f4632] hover:bg-[#ebdcc8] disabled:opacity-40 disabled:pointer-events-none text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isFrench ? 'Précédente' : 'Previous'}</span>
                </button>

                {/* Quick question pill jump */}
                <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
                  {diagnosticQuestions.map((q, idx) => {
                    const isAns = answers[q.id] !== undefined;
                    const isCurr = currentIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                          isCurr
                            ? 'bg-[#201b11] text-[#ffffff] ring-2 ring-[#ffc20e]'
                            : isAns
                            ? 'bg-[#ffc20e] text-[#6d5100]'
                            : 'bg-[#ebdcc8] text-[#4f4632] hover:bg-[#d3c5ab]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {currentIndex < totalCount - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isFrench ? 'Suivante' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#201b11] hover:bg-[#332b1b] text-[#ffffff] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#ffc20e]" />
                    <span>{isFrench ? 'Terminer & voir ma matrice' : 'Submit & see matrix'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: RESULTS SCREEN — MATRIX & 3 PRIORITIES          */}
          {/* ======================================================== */}
          {currentStage === 'results' && result && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto py-1">
              {/* Overall Summary Card */}
              <div className="bg-[#fff8f2] border border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold text-2xl shadow-xs shrink-0 mx-auto md:mx-0">
                    {result.percentage}%
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#785a00]">
                      {isFrench ? 'Bilan Diagnostique' : 'Diagnostic Summary'}
                    </div>
                    <h3 className="text-xl font-bold text-[#201b11]">
                      {result.correctAnswers} / {result.totalQuestions}{' '}
                      <span className="text-sm font-normal text-[#4f4632]">
                        ({result.percentage}%)
                      </span>
                    </h3>
                    <p className="text-xs text-[#4f4632] mt-0.5">
                      {isFrench
                        ? 'Matrice calculée sur les 6 domaines LPIC-1 fondamentaux.'
                        : 'Matrix evaluated across 6 foundational LPIC-1 domains.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2.5 rounded-xl border border-[#d3c5ab] text-[#785a00] hover:bg-[#ebdcc8] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isFrench ? 'Refaire le test' : 'Retake test'}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isFrench ? 'Terminer' : 'Done'}</span>
                  </button>
                </div>
              </div>

              {/* 1. LA MATRICE PAR DOMAINE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm md:text-base font-bold text-[#201b11] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#785a00]" />
                    <span>{isFrench ? 'Matrice de compétences par domaine' : 'Skills Matrix by Domain'}</span>
                  </h4>
                  <span className="text-xs text-[#817660]">
                    🟢 ≥75% • 🟠 50-74% • 🔴 &lt;50%
                  </span>
                </div>

                <div className="border border-[#ebdcc8] rounded-xl overflow-hidden bg-[#ffffff] shadow-xs">
                  <div className="divide-y divide-[#ebdcc8]">
                    {result.domainScores.map((domain) => {
                      const isHigh = domain.percentage >= 75;
                      const isMed = domain.percentage >= 50 && domain.percentage < 75;
                      const badgeEmoji = isHigh ? '🟢' : isMed ? '🟠' : '🔴';
                      const badgeColor = isHigh
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : isMed
                        ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : 'text-rose-700 bg-rose-50 border-rose-200';

                      const barColor = isHigh
                        ? 'bg-emerald-500'
                        : isMed
                        ? 'bg-amber-500'
                        : 'bg-rose-500';

                      return (
                        <div
                          key={domain.domainId}
                          className="p-3.5 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fbf5ed] transition-colors"
                        >
                          <div className="flex items-center gap-3 sm:w-1/3">
                            <div className="w-8 h-8 rounded-lg bg-[#f8ecdb] text-[#785a00] flex items-center justify-center shrink-0 border border-[#d3c5ab]/60">
                              {getDomainIcon(domain.domainId)}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-[#201b11]">
                                {isFrench ? domain.nameFr : domain.name}
                              </div>
                              <div className="text-[11px] text-[#817660]">
                                Topic {domain.associatedTopicNumber} ({domain.correctQuestions}/{domain.totalQuestions})
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="flex-1 max-w-xs sm:px-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-mono font-bold text-[#201b11]">
                                {domain.percentage}%
                              </span>
                              <span className="text-[10px] text-[#817660]">
                                {isHigh
                                  ? isFrench ? 'Maîtrisé' : 'Mastered'
                                  : isMed
                                  ? isFrench ? 'En cours' : 'In progress'
                                  : isFrench ? 'Priorité' : 'Priority'}
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-[#ebdcc8] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                style={{ width: `${domain.percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Badge tag */}
                          <div className="sm:w-28 text-right shrink-0">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeColor}`}
                            >
                              <span>{badgeEmoji}</span>
                              <span>{domain.percentage}%</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. TES 3 PRIORITÉS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm md:text-base font-bold text-[#201b11] flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-600" />
                    <span>{isFrench ? 'Tes 3 priorités d\'apprentissage' : 'Your 3 Top Priorities'}</span>
                  </h4>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    {isFrench ? 'Alimente les recommandations' : 'Powers recommendations'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.topPriorities.map((prio, idx) => {
                    const isCritical = prio.percentage < 50;
                    return (
                      <div
                        key={prio.domainId}
                        className={`rounded-xl p-4 border flex flex-col justify-between gap-3 shadow-xs ${
                          idx === 0
                            ? 'bg-[#fff8f2] border-[#ffc20e]'
                            : 'bg-[#ffffff] border-[#ebdcc8]'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                idx === 0
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : idx === 1
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-[#ebdcc8] text-[#4f4632]'
                              }`}
                            >
                              #{idx + 1} {isFrench ? 'Priorité' : 'Priority'}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#201b11]">
                              {prio.percentage}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#f8ecdb] text-[#785a00] flex items-center justify-center shrink-0">
                              {getDomainIcon(prio.domainId)}
                            </div>
                            <h5 className="font-bold text-sm text-[#201b11]">
                              {isFrench ? prio.nameFr : prio.name}
                            </h5>
                          </div>

                          <p className="text-xs text-[#4f4632] leading-relaxed">
                            {isFrench ? prio.summaryNoteFr : prio.summaryNoteEn}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-1.5 pt-2 border-t border-[#ebdcc8]">
                          <button
                            onClick={() => {
                              onClose();
                              onNavigate('learning', prio.associatedTopicId);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{isFrench ? 'Étudier le cours' : 'Study topic'}</span>
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => {
                                onClose();
                                onNavigate('flashcards');
                              }}
                              className="px-2 py-1 rounded-lg border border-[#d3c5ab] hover:bg-[#fbf5ed] text-[#4f4632] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Layers className="w-3 h-3" />
                              <span>Flashcards</span>
                            </button>

                            <button
                              onClick={() => {
                                onClose();
                                onNavigate('training');
                              }}
                              className="px-2 py-1 rounded-lg border border-[#d3c5ab] hover:bg-[#fbf5ed] text-[#4f4632] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Zap className="w-3 h-3 text-[#785a00]" />
                              <span>{isFrench ? 'Labs' : 'Labs'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-2 text-center">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mx-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isFrench
                      ? 'Appliquer et aller au Tableau de bord'
                      : 'Apply and view Dashboard'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
