import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Award,
  ChevronRight,
  ListOrdered,
  Sparkles
} from 'lucide-react';
import { SequencingChallenge, SequencingStep } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  challenges: SequencingChallenge[];
  onScoreUpdate?: (points: number) => void;
}

// Simple shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const SequencingModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSteps, setCurrentSteps] = useState<SequencingStep[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const current = challenges[currentIndex] || challenges[0];

  useEffect(() => {
    if (current) {
      // Shuffle initial steps
      let shuffled = shuffleArray<SequencingStep>(current.steps);
      // Ensure it's not already in exact order by accident
      if (shuffled.every((s, idx) => s.id === current.steps[idx].id) && shuffled.length > 1) {
        shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
      }
      setCurrentSteps(shuffled);
      setHasSubmitted(false);
      setIsCorrect(null);
    }
  }, [currentIndex, current]);

  if (!current) {
    return <div className="p-8 text-center text-[#817660]">Aucun exercice d'ordonnancement disponible.</div>;
  }

  const title = isFr && current.titleFr ? current.titleFr : current.title;
  const description = isFr && current.descriptionFr ? current.descriptionFr : current.description;
  const explanation = isFr && current.explanationFr ? current.explanationFr : current.explanation;

  const handleMoveUp = (index: number) => {
    if (index === 0 || hasSubmitted) return;
    const newSteps = [...currentSteps];
    const temp = newSteps[index - 1];
    newSteps[index - 1] = newSteps[index];
    newSteps[index] = temp;
    setCurrentSteps(newSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index === currentSteps.length - 1 || hasSubmitted) return;
    const newSteps = [...currentSteps];
    const temp = newSteps[index + 1];
    newSteps[index + 1] = newSteps[index];
    newSteps[index] = temp;
    setCurrentSteps(newSteps);
  };

  const handleValidate = () => {
    setHasSubmitted(true);
    const correct = currentSteps.every((s, idx) => s.id === current.steps[idx].id);
    setIsCorrect(correct);

    if (correct && !completedIds.has(current.id)) {
      const next = new Set(completedIds);
      next.add(current.id);
      setCompletedIds(next);
      if (onScoreUpdate) onScoreUpdate(20);
    }
  };

  const handleReset = () => {
    let shuffled = shuffleArray(current.steps);
    setCurrentSteps(shuffled);
    setHasSubmitted(false);
    setIsCorrect(null);
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1976d2]/10 text-[#1976d2] flex items-center justify-center font-bold">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11]">
              {isFr ? 'Exercices d\'ordonnancement (Timeline & Boot Order)' : 'Sequencing & Timeline'}
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Réorganisez les étapes dans l\'ordre chronologique exact avec les flèches'
                : 'Reorder steps into the exact chronological order using arrows'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedIds.size} / {challenges.length} {isFr ? 'validés' : 'mastered'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-[#fdf8f0] border-b border-[#ebdcc8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
              {current.certification.toUpperCase()} • Obj {current.objectiveId}
            </span>
            <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
          </div>
          <span className="text-xs font-bold text-[#817660]">
            Exercice {currentIndex + 1} / {challenges.length}
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-[#201b11]">{title}</h4>
            <p className="text-xs text-[#60553e] leading-relaxed">{description}</p>
          </div>

          {/* Interactive Steps List */}
          <div className="space-y-2.5">
            {currentSteps.map((step, idx) => {
              const isMatch = hasSubmitted && step.id === current.steps[idx].id;
              const isMismatch = hasSubmitted && step.id !== current.steps[idx].id;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isMatch
                      ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]'
                      : isMismatch
                      ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828]'
                      : 'bg-[#fffcf7] border-[#d3c5ab] text-[#201b11]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isMatch
                          ? 'bg-[#2e7d32] text-white'
                          : isMismatch
                          ? 'bg-[#d32f2f] text-white'
                          : 'bg-[#ebdcc8] text-[#785a00]'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {isFr && step.labelFr ? step.labelFr : step.label}
                      </div>
                      <div className="text-[11px] opacity-75 truncate">
                        {isFr && step.detailFr ? step.detailFr : step.detail}
                      </div>
                    </div>
                  </div>

                  {/* Ordering Buttons */}
                  {!hasSubmitted && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1.5 rounded-lg border border-[#d3c5ab] bg-white hover:bg-[#f8ecdb] disabled:opacity-30 disabled:cursor-not-allowed text-[#4f4632] cursor-pointer"
                        title="Monter"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentSteps.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1.5 rounded-lg border border-[#d3c5ab] bg-white hover:bg-[#f8ecdb] disabled:opacity-30 disabled:cursor-not-allowed text-[#4f4632] cursor-pointer"
                        title="Descendre"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {hasSubmitted && (
                    <div className="shrink-0">
                      {isMatch ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2e7d32]" />
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          {isFr ? `Devrait être #${current.steps.findIndex((s) => s.id === step.id) + 1}` : `Should be #${current.steps.findIndex((s) => s.id === step.id) + 1}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Validation Action or Results */}
          {!hasSubmitted ? (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFr ? 'Mélanger à nouveau' : 'Shuffle'}</span>
              </button>

              <button
                type="button"
                onClick={handleValidate}
                className="px-6 py-2.5 bg-[#785a00] hover:bg-[#5f4700] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {isFr ? 'Vérifier l\'ordonnancement' : 'Check Order'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isCorrect
                    ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#1b5e20]'
                    : 'bg-[#ffebee] border-[#ef9a9a] text-[#b71c1c]'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2e7d32] mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0 text-[#d32f2f] mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="text-xs font-bold">
                    {isCorrect
                      ? isFr
                        ? 'Ordre exact ! Félicitations.'
                        : 'Perfect order! Well done.'
                      : isFr
                      ? 'L\'ordre n\'est pas tout à fait correct.'
                      : 'Not quite the right order.'}
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">{explanation}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Réessayer' : 'Try Again'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#785a00] hover:bg-[#5f4700] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{isFr ? 'Exercice suivant' : 'Next Exercise'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
