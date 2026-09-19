import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Target,
  AlertTriangle,
  Flag,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  ShieldAlert,
  Zap,
  HelpCircle,
  FileText,
  Share2,
} from 'lucide-react';
import { PracticeQuestion } from '../../types';
import { ExamSessionAnalytics } from '../../utils/examAnalytics';
import { useLanguage } from '../../i18n/LanguageContext';

interface ExamPostAnalysisProps {
  analytics: ExamSessionAnalytics;
  questions: PracticeQuestion[];
  userAnswers: Record<number, number>;
  flaggedQuestions: Record<number, boolean>;
  questionTimes: Record<number, number>;
  onRetakeExam: () => void;
  onChangeExam: () => void;
  onExitToDashboard: () => void;
  onOpenExplanationModal?: (question: PracticeQuestion) => void;
}

export const ExamPostAnalysis: React.FC<ExamPostAnalysisProps> = ({
  analytics,
  questions,
  userAnswers,
  flaggedQuestions,
  questionTimes,
  onRetakeExam,
  onChangeExam,
  onExitToDashboard,
  onOpenExplanationModal,
}) => {
  const { isFrench } = useLanguage();

  // Review questions filters
  type ReviewFilter = 'all-review' | 'incorrect' | 'unanswered' | 'flagged' | 'all';
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all-review');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});

  // Toggle single question expansion
  const toggleExpand = (id: number) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all / collapse all
  const toggleAllExpanded = (expand: boolean) => {
    const updated: Record<number, boolean> = {};
    questions.forEach((q) => {
      updated[q.id] = expand;
    });
    setExpandedQuestionIds(updated);
  };

  // Filter questions list
  const filteredQuestions = questions.filter((q) => {
    const isAnswered = userAnswers[q.id] !== undefined;
    const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
    const isFlagged = !!flaggedQuestions[q.id];

    // Status filter
    if (activeFilter === 'all-review') {
      if (isCorrect && !isFlagged) return false;
    } else if (activeFilter === 'incorrect') {
      if (!isAnswered || isCorrect) return false;
    } else if (activeFilter === 'unanswered') {
      if (isAnswered) return false;
    } else if (activeFilter === 'flagged') {
      if (!isFlagged) return false;
    }

    // Domain filter
    if (selectedDomainFilter !== 'all') {
      const cat = (q.category || '').toLowerCase();
      if (!cat.includes(selectedDomainFilter.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSec = sec % 60;
    if (mins === 0) return `${remainderSec} sec`;
    return `${mins} min ${remainderSec.toString().padStart(2, '0')} s`;
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-4 md:py-8 flex flex-col gap-6 md:gap-8 pb-24 text-[#201b11]">
      {/* ========================================================================= */}
      {/* 1. TOP HERO CARD : SCORE GLOBAL & VALIDATION LPI                          */}
      {/* ========================================================================= */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ece1d0] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ffc20e]/25 text-[#785a00] border border-[#785a00]/30">
                {isFrench ? 'Rapport d\'analyse post-examen' : 'Post-Exam Analysis Report'}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#817660]">
                {analytics.examCode}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#201b11]">
              {analytics.examTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRetakeExam}
              className="px-4 py-2 rounded-xl bg-[#f8ecdb] hover:bg-[#f2e7d6] text-[#201b11] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#d3c5ab] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isFrench ? 'Recommencer' : 'Retake'}</span>
            </button>
            <button
              onClick={onChangeExam}
              className="px-4 py-2 rounded-xl bg-[#ffffff] hover:bg-[#f8ecdb] text-[#785a00] font-bold text-xs uppercase tracking-wider transition-colors border border-[#785a00] cursor-pointer"
            >
              <span>{isFrench ? 'Autre examen' : 'Change Exam'}</span>
            </button>
          </div>
        </div>

        {/* Big Score Header & Status */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Score Display */}
          <div className="md:col-span-6 flex flex-col items-start gap-2 bg-[#fef2e1] border border-[#d3c5ab] rounded-xl p-5 md:p-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#817660]">
              {isFrench ? 'Résultat global de la session' : 'Overall Session Result'}
            </span>

            <div className="flex items-baseline gap-3 my-1">
              <span className="text-4xl md:text-5xl font-black tracking-tight text-[#201b11]">
                SCORE : {analytics.scorePct} %
              </span>
            </div>

            {/* Pass / Fail Status Pill */}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  analytics.passed
                    ? 'bg-[#28A745]/15 text-[#28A745] border border-[#28A745]/40'
                    : 'bg-[#ba1a1a]/15 text-[#ba1a1a] border border-[#ba1a1a]/40'
                }`}
              >
                {analytics.passed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>
                  {analytics.passed
                    ? isFrench
                      ? 'Niveau admissible au test officiel'
                      : 'Passing standard met'
                    : isFrench
                    ? 'Sous le seuil d\'admissibilité'
                    : 'Below passing threshold'}
                </span>
              </span>
              <span className="text-xs text-[#817660] font-medium">
                (Seuil LPI : {analytics.passThresholdPct}%)
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 leading-relaxed">
              {analytics.passed
                ? isFrench
                  ? 'Félicitations ! Votre résultat global dépasse la note minimale de passage (500/800). Consultez ci-dessous les points d\'amélioration ciblés pour sécuriser votre examen.'
                  : 'Well done! Your overall score exceeds the passing requirement (500/800). Review the targeted advice below to ensure full readiness.'
                : isFrench
                ? 'Cette tentative met en lumière plusieurs zones à consolider avant le passage réel. L\'analyse ci-dessous détaille précisément ce qui vous a pénalisé.'
                : 'This simulation highlights key areas to strengthen before your official attempt. The detailed review below breaks down what held you back.'}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-3">
            {/* Average time per question */}
            <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#817660] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isFrench ? 'Temps moyen / Q' : 'Avg Time / Q'}
                </span>
                <Clock className="w-4 h-4 text-[#785a00]" />
              </div>
              <span className="text-2xl font-black text-[#201b11]">
                {analytics.averageTimePerQuestionSeconds} sec
              </span>
              <span className="text-[11px] text-[#817660] mt-1">
                {analytics.averageTimePerQuestionSeconds <= 60
                  ? isFrench
                    ? 'Cadence fluide et maîtrisée'
                    : 'Well paced flow'
                  : isFrench
                  ? 'Cadence lente (> 60s)'
                  : 'Slower tempo (> 60s)'}
              </span>
            </div>

            {/* Questions to review count */}
            <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#817660] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isFrench ? 'Questions à revoir' : 'Questions to review'}
                </span>
                <Target className="w-4 h-4 text-[#ba1a1a]" />
              </div>
              <span className="text-2xl font-black text-[#ba1a1a]">
                {analytics.questionsToReviewCount}
              </span>
              <span className="text-[11px] text-[#817660] mt-1">
                {analytics.incorrectCount} {isFrench ? 'erreurs' : 'wrong'} · {analytics.unansweredCount} {isFrench ? 'vides' : 'blank'}
              </span>
            </div>

            {/* Estimated LPI Scale Score */}
            <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#817660] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isFrench ? 'Score LPI estimé' : 'Estimated LPI Score'}
                </span>
                <Award className="w-4 h-4 text-[#0061a4]" />
              </div>
              <span className="text-2xl font-black text-[#0061a4]">
                {analytics.estimatedLpiScore} <span className="text-xs font-semibold text-[#817660]">/ 800</span>
              </span>
              <span className="text-[11px] text-[#817660] mt-1">
                {analytics.estimatedLpiScore >= 500
                  ? isFrench ? '≥ 500 pts (Validation)' : '≥ 500 pts (Pass)'
                  : isFrench ? '< 500 pts (Échec)' : '< 500 pts (Fail)'}
              </span>
            </div>

            {/* Total Duration Used */}
            <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[#817660] mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isFrench ? 'Durée totale' : 'Total Duration'}
                </span>
                <Clock className="w-4 h-4 text-[#817660]" />
              </div>
              <span className="text-2xl font-black text-[#201b11]">
                {formatSeconds(analytics.totalDurationSeconds)}
              </span>
              <span className="text-[11px] text-[#817660] mt-1">
                {analytics.totalQuestions} {isFrench ? 'questions évaluées' : 'evaluated'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCORES PAR DOMAINE PONDÉRÉ                                             */}
      {/*    Format exact demandé : Architecture 84 %, Commands 91 %, etc.         */}
      {/* ========================================================================= */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ece1d0] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#201b11] tracking-tight">
              {isFrench ? 'Performance par Domaine officiel LPI' : 'Performance by Official LPI Domain'}
            </h2>
            <p className="text-xs text-[#817660] mt-0.5">
              {isFrench
                ? 'Scores calculés par grand thème pondéré selon les coefficients du référentiel'
                : 'Scores broken down by official weighted exam objectives'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#f8ecdb] text-[#785a00] self-start sm:self-auto">
            {isFrench ? `Score pondéré : ${analytics.weightedScorePct}%` : `Weighted Score: ${analytics.weightedScorePct}%`}
          </span>
        </div>

        {/* Clean domain breakdown list */}
        <div className="flex flex-col divide-y divide-[#ece1d0]">
          {analytics.domainScores.map((domain) => {
            const isHigh = domain.percentage >= 80;
            const isMid = domain.percentage >= 65 && domain.percentage < 80;
            const isLow = domain.percentage < 65;

            return (
              <div
                key={domain.domainId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#fff8f2]/50 px-2 rounded-lg transition-colors"
              >
                {/* Domain Title & LPI Weight */}
                <div className="flex flex-col gap-1 min-w-[220px] max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#201b11]">
                      {domain.shortName}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]/60">
                      {isFrench ? `Poids ${domain.weight}` : `Weight ${domain.weight}`}
                    </span>
                  </div>
                  <span className="text-xs text-[#817660] truncate">
                    {domain.domainName}
                  </span>
                </div>

                {/* Progress bar + raw score count */}
                <div className="flex-1 flex items-center gap-4 max-w-md">
                  <div className="flex-1 h-3 bg-[#ece1d0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh
                          ? 'bg-[#28A745]'
                          : isMid
                          ? 'bg-[#ffc20e]'
                          : 'bg-[#ba1a1a]'
                      }`}
                      style={{ width: `${Math.max(4, domain.percentage)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#817660] shrink-0 min-w-[50px] text-right">
                    {domain.correctCount} / {domain.totalQuestions}
                  </span>
                </div>

                {/* Big percentage output (Format: Architecture 84%) */}
                <div className="flex items-center justify-end gap-3 shrink-0 min-w-[90px]">
                  <span
                    className={`font-mono text-base font-black tracking-tight ${
                      isHigh
                        ? 'text-[#28A745]'
                        : isMid
                        ? 'text-[#785a00]'
                        : 'text-[#ba1a1a]'
                    }`}
                  >
                    {domain.percentage} %
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isHigh
                        ? 'bg-[#28A745]/15 text-[#28A745]'
                        : isMid
                        ? 'bg-[#ffc20e]/25 text-[#785a00]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {domain.status === 'mastered'
                      ? isFrench ? 'Maîtrisé' : 'Mastered'
                      : domain.status === 'solid'
                      ? isFrench ? 'Solide' : 'Solid'
                      : domain.status === 'needs_work'
                      ? isFrench ? 'À revoir' : 'Needs work'
                      : isFrench ? 'Critique' : 'Critical'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION MAJEURE : "CE QUI RISQUE DE TE PÉNALISER À L'EXAMEN"            */}
      {/*    Grounded purely in session data, without fake predictions              */}
      {/* ========================================================================= */}
      <div className="bg-[#ffffff] border-2 border-[#785a00]/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-start gap-3.5 border-b border-[#ece1d0] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#ffc20e]/20 text-[#785a00] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#201b11] tracking-tight">
              {isFrench ? 'Ce qui risque de te pénaliser à l\'examen' : 'What risks penalizing you on exam day'}
            </h2>
            <p className="text-xs text-[#817660] mt-1">
              {isFrench
                ? '→ basé uniquement sur les données de la session, sans prétendre prédire le résultat officiel.'
                : '→ based strictly on your session data, without claiming to predict the official score.'}
            </p>
          </div>
        </div>

        {/* List of concrete risk factors detected */}
        <div className="flex flex-col gap-4">
          {analytics.riskFactors.map((risk, index) => {
            const isCrit = risk.severity === 'critical';
            const isWarn = risk.severity === 'warning';

            return (
              <div
                key={risk.id || index}
                className={`p-5 rounded-xl border flex flex-col gap-3 transition-all ${
                  isCrit
                    ? 'bg-[#fff5f5] border-[#ba1a1a]/40'
                    : isWarn
                    ? 'bg-[#fffbf0] border-[#785a00]/40'
                    : 'bg-[#fef9f3] border-[#d3c5ab]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCrit
                          ? 'bg-[#ba1a1a] text-white'
                          : isWarn
                          ? 'bg-[#785a00] text-white'
                          : 'bg-[#4f4632] text-white'
                      }`}
                    >
                      {isCrit
                        ? isFrench ? 'Point critique' : 'Critical point'
                        : isWarn
                        ? isFrench ? 'Point de vigilance' : 'Warning'
                        : isFrench ? 'Conseil d\'hygiène' : 'Advisory'}
                    </span>
                    <h3 className="font-bold text-sm md:text-base text-[#201b11]">
                      {risk.title}
                    </h3>
                  </div>
                </div>

                {/* Evidence & Impact */}
                <div className="text-xs space-y-2 text-[#4f4632] leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#817660] shrink-0 min-w-[70px]">
                      {isFrench ? 'Constat session :' : 'Session data:'}
                    </span>
                    <span>{risk.evidence}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#ba1a1a] shrink-0 min-w-[70px]">
                      {isFrench ? 'Risque LPI :' : 'Exam penalty:'}
                    </span>
                    <span className="font-medium text-[#201b11]">{risk.impact}</span>
                  </div>
                </div>

                {/* Recommendation pill */}
                <div className="bg-[#ffffff] border border-[#d3c5ab]/70 rounded-lg p-3 mt-1 flex items-start gap-2 text-xs">
                  <Zap className="w-4 h-4 text-[#785a00] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#785a00] mr-1">
                      {isFrench ? 'Recommandation corrective :' : 'Corrective recommendation:'}
                    </span>
                    <span className="text-[#201b11]">{risk.recommendation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Step Action Plan */}
        <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-xl p-5 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#785a00]">
            {isFrench ? 'Plan d\'action recommandé pour votre prochaine session' : 'Targeted 3-Step Action Plan'}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analytics.actionPlan.map((step) => (
              <div
                key={step.priority}
                className="bg-[#ffffff] border border-[#d3c5ab]/70 rounded-lg p-3.5 flex flex-col gap-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00]">
                    {step.badge}
                  </span>
                  <span className="text-xs font-bold text-[#817660]">#{step.priority}</span>
                </div>
                <h4 className="font-bold text-xs md:text-sm text-[#201b11]">{step.title}</h4>
                <p className="text-xs text-[#4f4632] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. QUESTIONS À REVOIR (Interactive Review with Filters & Full Explanations)*/}
      {/* ========================================================================= */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ece1d0] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#201b11] tracking-tight">
                {isFrench ? 'Questions à revoir' : 'Questions to Review'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ba1a1a]/15 text-[#ba1a1a]">
                {analytics.questionsToReviewCount}
              </span>
            </div>
            <p className="text-xs text-[#817660] mt-1">
              {isFrench
                ? 'Explications complètes, diagnostics d\'erreur et commandes de terminal recommandées'
                : 'Detailed explanations, diagnostic breakdowns, and official CLI reference commands'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleAllExpanded(true)}
              className="text-xs font-semibold text-[#785a00] hover:underline px-2 py-1 cursor-pointer"
            >
              {isFrench ? 'Tout déplier' : 'Expand all'}
            </button>
            <span className="text-[#d3c5ab]">|</span>
            <button
              onClick={() => toggleAllExpanded(false)}
              className="text-xs font-semibold text-[#817660] hover:underline px-2 py-1 cursor-pointer"
            >
              {isFrench ? 'Tout replier' : 'Collapse all'}
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all-review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all-review'
                ? 'bg-[#ba1a1a] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb]'
            }`}
          >
            {isFrench ? 'Toutes à revoir' : 'All to Review'} ({analytics.questionsToReviewCount})
          </button>
          <button
            onClick={() => setActiveFilter('incorrect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'incorrect'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb]'
            }`}
          >
            {isFrench ? 'Erreurs uniquement' : 'Incorrect only'} ({analytics.incorrectCount})
          </button>
          {analytics.unansweredCount > 0 && (
            <button
              onClick={() => setActiveFilter('unanswered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'unanswered'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-[#ffffff] text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb]'
              }`}
            >
              {isFrench ? 'Non répondues' : 'Unanswered'} ({analytics.unansweredCount})
            </button>
          )}
          {analytics.flaggedCount > 0 && (
            <button
              onClick={() => setActiveFilter('flagged')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'flagged'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'bg-[#ffffff] text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb]'
              }`}
            >
              🚩 {isFrench ? 'Marquées' : 'Flagged'} ({analytics.flaggedCount})
            </button>
          )}
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#201b11] text-white shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb]'
            }`}
          >
            {isFrench ? 'Toutes les questions' : 'All Questions'} ({analytics.totalQuestions})
          </button>
        </div>

        {/* Questions list */}
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-10 bg-[#fef2e1] rounded-xl border border-[#d3c5ab] p-6">
            <CheckCircle2 className="w-8 h-8 text-[#28A745] mx-auto mb-2" />
            <p className="font-bold text-sm text-[#201b11]">
              {isFrench ? 'Aucune question dans ce filtre' : 'No questions in this filter'}
            </p>
            <p className="text-xs text-[#817660] mt-1">
              {isFrench
                ? 'Toutes les questions sélectionnées correspondent aux critères de réussite !'
                : 'All selected items meet the success criteria!'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredQuestions.map((q, idx) => {
              const originalIndex = questions.findIndex((item) => item.id === q.id);
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
              const wasFlagged = !!flaggedQuestions[q.id];
              const userChoice = isAnswered ? q.options[userAnswers[q.id]] : null;
              const timeSpent = questionTimes[q.id] || 0;
              const isExpanded = expandedQuestionIds[q.id] ?? (activeFilter !== 'all');

              return (
                <div
                  key={q.id}
                  className={`border rounded-xl transition-all ${
                    isCorrect
                      ? 'border-[#d3c5ab] bg-[#ffffff]'
                      : 'border-[#ba1a1a]/40 bg-[#ffffff] shadow-xs'
                  }`}
                >
                  {/* Question header row */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-4 md:p-5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-[#fef9f3] rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-[#28A745]" />
                        ) : !isAnswered ? (
                          <HelpCircle className="w-5 h-5 text-[#817660]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#ba1a1a]" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#817660]">
                            Q{originalIndex + 1}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]/50">
                            {q.category}
                          </span>
                          {wasFlagged && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ffc20e]/30 text-[#785a00]">
                              🚩 {isFrench ? 'Marquée' : 'Flagged'}
                            </span>
                          )}
                          {timeSpent > 0 && (
                            <span className="text-[10px] text-[#817660] font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeSpent}s
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm md:text-base text-[#201b11] leading-snug">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-[#28A745]/15 text-[#28A745]'
                            : !isAnswered
                            ? 'bg-[#ece1d0] text-[#4f4632]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {isCorrect
                          ? isFrench ? 'Correct' : 'Correct'
                          : !isAnswered
                          ? isFrench ? 'Non répondue' : 'Blank'
                          : isFrench ? 'Erreur' : 'Incorrect'}
                      </span>
                      <button className="text-[#817660] p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-5 pt-2 border-t border-[#ece1d0] flex flex-col gap-4 bg-[#fffdfa] rounded-b-xl">
                      {q.scenario && (
                        <div className="p-3 bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg text-xs text-[#4f4632]">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-[#817660] block mb-0.5">
                            {isFrench ? 'Contexte pratique :' : 'Scenario:'}
                          </span>
                          {q.scenario}
                        </div>
                      )}

                      {/* Your Answer vs Correct Answer */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div
                          className={`p-3 rounded-lg border flex flex-col gap-1 ${
                            isCorrect
                              ? 'bg-[#28A745]/10 border-[#28A745]/30'
                              : !isAnswered
                              ? 'bg-[#ece1d0]/50 border-[#d3c5ab]'
                              : 'bg-[#ffdad6]/60 border-[#ba1a1a]/30'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660]">
                            {isFrench ? 'Votre réponse :' : 'Your answer:'}
                          </span>
                          <span
                            className={`font-mono text-xs font-semibold ${
                              isCorrect
                                ? 'text-[#28A745]'
                                : !isAnswered
                                ? 'text-[#817660] italic'
                                : 'text-[#ba1a1a]'
                            }`}
                          >
                            {isAnswered ? userChoice : isFrench ? '(Aucune réponse sélectionnée)' : '(No answer selected)'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border bg-[#28A745]/10 border-[#28A745]/30 flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#28A745]">
                            {isFrench ? 'Bonne réponse officielle :' : 'Official correct answer:'}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#201b11]">
                            {q.options[q.correctIndex]}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-lg p-4 text-xs text-[#4f4632] leading-relaxed">
                        <span className="font-bold text-[#201b11] block mb-1.5">
                          {isFrench ? 'Explication détaillée :' : 'Detailed Explanation:'}
                        </span>
                        <p>{q.explanation}</p>

                        {q.commandSnippet && (
                          <div className="mt-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660] block mb-1">
                              {isFrench ? 'Syntaxe CLI de référence :' : 'Reference CLI Syntax:'}
                            </span>
                            <div className="bg-[#201b11] text-[#f8ecdb] font-mono text-[11px] p-2.5 rounded-md overflow-x-auto selection:bg-[#ffc20e] selection:text-[#201b11]">
                              <code>{q.commandSnippet}</code>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 shadow-sm">
        <button
          onClick={onExitToDashboard}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#d3c5ab] text-[#4f4632] hover:text-[#201b11] hover:bg-[#f8ecdb] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          {isFrench ? 'Tableau de bord' : 'Dashboard'}
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onChangeExam}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg border border-[#785a00] text-[#785a00] hover:bg-[#f8ecdb] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isFrench ? 'Changer d\'examen' : 'Select Another Exam'}
          </button>
          <button
            onClick={onRetakeExam}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isFrench ? 'Relancer un examen blanc' : 'Retake Practice Exam'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
