import React, { useState } from 'react';
import {
  X,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Terminal,
  Award,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { WeaknessDomainId } from '../../types';
import {
  WeaknessTrainingQuestion,
  generateWeaknessTrainingSession,
  applyWeaknessTrainingResult
} from '../../utils/weaknessEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface WeaknessTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDomainId?: WeaknessDomainId;
  targetDomainNameFr?: string;
  onMasteryUpdated?: () => void;
}

export const WeaknessTrainingModal: React.FC<WeaknessTrainingModalProps> = ({
  isOpen,
  onClose,
  targetDomainId,
  targetDomainNameFr,
  onMasteryUpdated
}) => {
  const { isFrench } = useLanguage();

  const [questions, setQuestions] = useState<WeaknessTrainingQuestion[]>(() =>
    generateWeaknessTrainingSession(targetDomainId)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wasConfident, setWasConfident] = useState<boolean | null>(null);
  const [sessionProgress, setSessionProgress] = useState<
    { isCorrect: boolean; domainId: WeaknessDomainId; improvement: number }[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);

  // Restart session
  const handleRestart = (newTargetDomainId?: WeaknessDomainId) => {
    const newQuestions = generateWeaknessTrainingSession(newTargetDomainId || targetDomainId);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setWasConfident(null);
    setSessionProgress([]);
    setIsFinished(false);
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  // Answer selection
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  // Submit answer
  const handleSubmitAnswer = (confidentChoice: boolean = true) => {
    if (selectedOption === null || isAnswered) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    setIsAnswered(true);
    setWasConfident(confidentChoice);

    // Apply result in engine
    const outcome = applyWeaknessTrainingResult(
      currentQ.domainId,
      currentQ.subtopicId,
      isCorrect,
      confidentChoice
    );

    setSessionProgress((prev) => [
      ...prev,
      { isCorrect, domainId: currentQ.domainId, improvement: outcome.improvement }
    ]);

    if (onMasteryUpdated) {
      onMasteryUpdated();
    }
  };

  // Next question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setWasConfident(null);
    } else {
      setIsFinished(true);
    }
  };

  const totalCorrect = sessionProgress.filter((p) => p.isCorrect).length;
  const netMasteryGain = sessionProgress.reduce((acc, p) => acc + p.improvement, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#fffcf7] text-[#201b11] border border-[#d3c5ab] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#d3c5ab] bg-[#fff8ee] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600">
              <Flame className="w-5 h-5 fill-red-500/20 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-[#201b11]">
                  {isFrench ? 'Entraînement des faiblesses' : 'Weakness Targeted Training'}
                </h2>
                {targetDomainNameFr && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffc20e]/25 text-[#785a00] border border-[#785a00]/30 uppercase">
                    {targetDomainNameFr}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6e634e]">
                {isFrench
                  ? 'Exercices ciblés pour combler vos lacunes et éliminer le hasard'
                  : 'Targeted drills to close knowledge gaps and eliminate lucky guesses'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f2e2cb] text-[#6e634e] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {!isFinished ? (
            <div className="space-y-5">
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-[#6e634e]">
                  <span>
                    {isFrench ? 'Question' : 'Question'} {currentIndex + 1} / {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {isFrench ? currentQ.domainNameFr : currentQ.domainId.toUpperCase()} · {isFrench ? currentQ.subtopicNameFr : currentQ.subtopicId}
                    </span>
                    {currentQ.isRetestOfPastMistake && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        {isFrench ? 'Erreur passée' : 'Past mistake'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#ebdcc4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-500 to-red-500 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 sm:p-5 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[#201b11] leading-snug">
                  {isFrench ? currentQ.questionFr : currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQ.correctIndex;

                  let buttonStyle = 'bg-[#ffffff] border-[#d3c5ab] hover:border-amber-500 hover:bg-[#fffcf7] text-[#201b11]';
                  if (isSelected && !isAnswered) {
                    buttonStyle = 'bg-amber-50 border-amber-500 text-amber-950 font-semibold ring-1 ring-amber-500';
                  } else if (isAnswered) {
                    if (isCorrectAnswer) {
                      buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrectAnswer) {
                      buttonStyle = 'bg-red-50 border-red-500 text-red-950 font-semibold';
                    } else {
                      buttonStyle = 'bg-stone-50/70 border-stone-200 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-md bg-black/5 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium">{opt}</span>
                      </div>

                      {isAnswered && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Confidence Evaluation & Validation Button */}
              {!isAnswered ? (
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => handleSubmitAnswer(true)}
                    disabled={selectedOption === null}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#ffc20e] hover:bg-[#eab007] disabled:opacity-40 disabled:cursor-not-allowed text-[#6d5100] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isFrench ? 'Valider (J\'étais certain · +5%)' : 'Submit (I was confident · +5%)'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSubmitAnswer(false)}
                    disabled={selectedOption === null}
                    className="py-3 px-4 rounded-xl bg-[#f2e2cb] hover:bg-[#e7d2b5] disabled:opacity-40 disabled:cursor-not-allowed text-[#4f432e] font-bold text-xs uppercase tracking-wider transition-all border border-[#d3c5ab] flex items-center justify-center gap-2 cursor-pointer"
                    title={isFrench ? 'Valider en indiquant que vous avez deviné ou hésité' : 'Submit stating you had doubts'}
                  >
                    <span>{isFrench ? 'J\'ai hésité / hasard (+2%)' : 'I guessed / hesitated (+2%)'}</span>
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Explanation panel */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div
                    className={`p-4 rounded-xl border ${
                      selectedOption === currentQ.correctIndex
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-red-50/80 border-red-300 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                      {selectedOption === currentQ.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>
                            {isFrench
                              ? wasConfident
                                ? 'Excellent ! Maîtrise confirmée (+5%)'
                                : 'Bonne réponse avec hésitation (+2%)'
                              : 'Correct Answer!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span>{isFrench ? 'Erreur identifiée' : 'Incorrect Answer'}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed mt-1">
                      {isFrench ? currentQ.explanationFr : currentQ.explanation}
                    </p>

                    {currentQ.commandTip && (
                      <div className="mt-3 p-2.5 rounded-lg bg-black/85 text-emerald-400 font-mono text-xs flex items-center gap-2">
                        <Terminal className="w-4 h-4 shrink-0 text-emerald-400" />
                        <code>{currentQ.commandTip}</code>
                      </div>
                    )}

                    {currentQ.examTipFr && isFrench && (
                      <div className="mt-2.5 text-[11px] text-stone-700 bg-white/70 p-2 rounded-lg border border-stone-200 flex items-start gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#785a00] shrink-0 mt-0.5" />
                        <span><strong>Astuce Examen LPIC :</strong> {currentQ.examTipFr}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-3 px-5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {currentIndex < questions.length - 1
                        ? isFrench
                          ? 'Question suivante'
                          : 'Next Question'
                        : isFrench
                        ? 'Voir le bilan de la session'
                        : 'View Session Summary'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results / Summary screen */
            <div className="text-center py-4 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <Flame className="w-8 h-8 fill-white/20" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#201b11]">
                  {isFrench ? 'Session d\'entraînement terminée !' : 'Training Session Complete!'}
                </h3>
                <p className="text-sm text-[#6e634e] mt-1 max-w-md mx-auto">
                  {isFrench
                    ? 'Vos réponses ont directement renforcé votre score de maîtrise dans le Weakness Engine.'
                    : 'Your answers have directly improved your mastery score in the Weakness Engine.'}
                </p>
              </div>

              {/* Stats pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="bg-[#fff8ee] border border-[#d3c5ab] rounded-xl p-3">
                  <span className="text-[11px] text-[#6e634e] font-bold block">
                    {isFrench ? 'Réussite' : 'Correct'}
                  </span>
                  <span className="text-2xl font-bold text-emerald-700">
                    {totalCorrect} / {questions.length}
                  </span>
                </div>

                <div className="bg-[#fff8ee] border border-[#d3c5ab] rounded-xl p-3">
                  <span className="text-[11px] text-[#6e634e] font-bold block">
                    {isFrench ? 'Gain Maîtrise' : 'Mastery Gain'}
                  </span>
                  <span className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                    netMasteryGain >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {netMasteryGain > 0 ? `+${netMasteryGain}%` : `${netMasteryGain}%`}
                  </span>
                </div>

                <div className="bg-[#fff8ee] border border-[#d3c5ab] rounded-xl p-3 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[#6e634e] font-bold block">
                    {isFrench ? 'Hasard éliminé' : 'Guesses cleared'}
                  </span>
                  <span className="text-2xl font-bold text-amber-700">
                    {sessionProgress.filter((p) => p.isCorrect).length} notions
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <button
                  onClick={() => handleRestart()}
                  className="py-3 px-5 rounded-xl bg-[#f2e2cb] hover:bg-[#e7d2b5] text-[#201b11] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-[#d3c5ab] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isFrench ? 'Autre session' : 'Another Session'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl bg-[#ffc20e] hover:bg-[#eab007] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                >
                  <span>{isFrench ? 'Retour au tableau de bord' : 'Return to Dashboard'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
