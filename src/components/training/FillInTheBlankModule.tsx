import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { FillInTheBlankChallenge } from '../../types';
import { validateCommandTolerance, ToleranceValidationResult } from '../../utils/commandTolerance';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  challenges: FillInTheBlankChallenge[];
  onScoreUpdate?: (points: number) => void;
}

export const FillInTheBlankModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<ToleranceValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [filterTopic, setFilterTopic] = useState<number | 'all'>('all');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const filteredChallenges = challenges.filter(
    (c) => filterTopic === 'all' || c.topicNumber === filterTopic
  );

  const current = filteredChallenges[currentIndex] || filteredChallenges[0];

  const handleValidate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!current || !userInput.trim()) return;

    const validation = validateCommandTolerance(userInput, current.expectedAnswers, current.caseSensitive);
    setResult(validation);

    if (validation.isCorrect) {
      if (!completedIds.has(current.id)) {
        const nextSet = new Set(completedIds);
        nextSet.add(current.id);
        setCompletedIds(nextSet);
        if (onScoreUpdate) onScoreUpdate(10);
      }
    }
  };

  const handleNext = () => {
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  if (!current) {
    return (
      <div className="p-8 text-center text-[#817660]">
        Aucun défi trouvé pour ce filtre.
      </div>
    );
  }

  const promptText = isFr && current.promptFr ? current.promptFr : current.prompt;
  const scenarioText = isFr && current.scenarioFr ? current.scenarioFr : current.scenario;
  const hintText = isFr && current.hintFr ? current.hintFr : current.hint;
  const explanationText = isFr && current.explanationFr ? current.explanationFr : current.explanation;

  return (
    <div className="space-y-6">
      {/* Header Info & Topic Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffc20e]/20 text-[#785a00] flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11]">
              {isFr ? 'Saisie exacte sans QCM' : 'Direct Fill-in-the-Blank'}
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Tapez la commande ou le chemin exact (vérification tolérante d\'espaces et de drapeaux)'
                : 'Type the exact command or path (tolerant flag & whitespace verification)'}
            </p>
          </div>
        </div>

        {/* Progress & Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedIds.size} / {filteredChallenges.length} {isFr ? 'réussis' : 'mastered'}
            </span>
          </div>

          <div className="flex items-center gap-1 border border-[#d3c5ab] rounded-lg px-2 py-1 bg-white text-xs text-[#4f4632]">
            <Filter className="w-3.5 h-3.5 text-[#817660]" />
            <select
              value={filterTopic}
              onChange={(e) => {
                setFilterTopic(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentIndex(0);
                handleReset();
              }}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">{isFr ? 'Tous les Thèmes' : 'All Topics'}</option>
              <option value={101}>Topic 101 (Architecture)</option>
              <option value={102}>Topic 102 (Installation & Packages)</option>
              <option value={103}>Topic 103 (GNU & Unix Commands)</option>
              <option value={104}>Topic 104 (Devices & Filesystems)</option>
              <option value={107}>Topic 107 (Admin Tasks & Cron)</option>
              <option value={201}>Topic 201 (Kernel & Modules)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
        {/* Top bar of card */}
        <div className="px-6 py-3 bg-[#fdf8f0] border-b border-[#ebdcc8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
              {current.certification.toUpperCase()} • Obj {current.objectiveId}
            </span>
            <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
          </div>
          <span className="text-xs font-bold text-[#817660]">
            Question {currentIndex + 1} / {filteredChallenges.length}
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Scenario if present */}
          {scenarioText && (
            <div className="p-3 bg-[#f8f5ee] rounded-xl text-xs text-[#60553e] border border-[#e5dcce]/60 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#a67c00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#443b27]">{isFr ? 'Contexte : ' : 'Scenario: '}</span>
                {scenarioText}
              </div>
            </div>
          )}

          {/* Prompt */}
          <div>
            <h4 className="text-base font-bold text-[#201b11] leading-snug">{promptText}</h4>
          </div>

          {/* Context Code / Terminal Prompt */}
          {current.contextCode && (
            <div className="rounded-xl bg-[#1e1b18] text-[#f7f4ea] p-3.5 font-mono text-xs overflow-x-auto shadow-inner border border-[#3b352b]">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-white/50 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono">bash terminal</span>
              </div>
              <pre className="text-[#a6e22e] whitespace-pre-wrap">{current.contextCode}</pre>
            </div>
          )}

          {/* User Input Form */}
          <form onSubmit={handleValidate} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#817660]">
              {isFr ? 'Votre commande ou saisie :' : 'Your command or input:'}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    if (result) setResult(null);
                  }}
                  disabled={result?.isCorrect}
                  placeholder={current.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full px-4 py-2.5 font-mono text-sm rounded-xl border transition-all ${
                    result?.isCorrect
                      ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]'
                      : result?.isNearMiss
                      ? 'bg-[#fffde7] border-[#fbc02d] text-[#201b11]'
                      : result && !result.isCorrect
                      ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828]'
                      : 'bg-white border-[#d3c5ab] text-[#201b11] focus:ring-2 focus:ring-[#785a00] focus:border-transparent'
                  }`}
                />
              </div>

              {!result?.isCorrect && (
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="px-5 py-2.5 bg-[#785a00] hover:bg-[#5f4700] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isFr ? 'Valider' : 'Submit'}
                </button>
              )}

              {result?.isCorrect && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{isFr ? 'Suivant' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Validation Feedback */}
          {result && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                result.isCorrect
                  ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#1b5e20]'
                  : result.isNearMiss
                  ? 'bg-[#fffde7] border-[#fff59d] text-[#f57f17]'
                  : 'bg-[#ffebee] border-[#ef9a9a] text-[#b71c1c]'
              }`}
            >
              {result.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#2e7d32]" />
              ) : result.isNearMiss ? (
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-[#f57f17]" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#d32f2f]" />
              )}
              <div className="space-y-1">
                <div className="text-xs font-bold">{result.feedbackMessage}</div>
                {result.isCorrect && (
                  <p className="text-xs opacity-90 leading-relaxed pt-1 border-t border-black/10">
                    {explanationText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Hint & Solution Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ebdcc8]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 text-xs font-semibold text-[#785a00] hover:bg-[#f8ecdb] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? (isFr ? 'Masquer l\'indice' : 'Hide Hint') : (isFr ? 'Afficher un indice' : 'Show Hint')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="px-3 py-1.5 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg transition-colors cursor-pointer"
              >
                {showSolution ? (isFr ? 'Masquer la réponse' : 'Hide Answer') : (isFr ? 'Voir la réponse officielle' : 'Reveal Official Answer')}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg transition-colors cursor-pointer"
                title={isFr ? 'Réinitialiser' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-1.5 text-xs font-semibold text-[#4f4632] hover:bg-[#ebdcc8]/60 border border-[#d3c5ab] rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <span>{isFr ? 'Passer' : 'Skip'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded Hint Box */}
          {showHint && (
            <div className="p-3 bg-[#fff8e1] border border-[#ffe082] rounded-xl text-xs text-[#8d6e63] flex items-start gap-2 animate-fade-in">
              <Lightbulb className="w-4 h-4 text-[#ffa000] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#5d4037]">{isFr ? 'Indice : ' : 'Hint: '}</span>
                {hintText}
              </div>
            </div>
          )}

          {/* Expanded Solution Box */}
          {showSolution && (
            <div className="p-4 bg-[#eefeef] border border-[#a5d6a7] rounded-xl text-xs text-[#1b5e20] space-y-2 animate-fade-in">
              <div className="font-bold text-sm text-[#2e7d32]">
                {isFr ? 'Réponses acceptées par le simulateur LPI :' : 'Accepted Answers:'}
              </div>
              <ul className="list-disc pl-5 font-mono space-y-1">
                {current.expectedAnswers.map((ans, i) => (
                  <li key={i}>{ans}</li>
                ))}
              </ul>
              <div className="pt-2 text-xs border-t border-[#c8e6c9] leading-relaxed">
                {explanationText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
