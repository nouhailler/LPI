import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Code2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  FileCode,
  Check
} from 'lucide-react';
import { TroubleshootingChallenge } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  challenges: TroubleshootingChallenge[];
  onScoreUpdate?: (points: number) => void;
}

export const TroubleshootingModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const current = challenges[currentIndex] || challenges[0];

  if (!current) {
    return <div className="p-8 text-center text-[#817660]">Aucun défi de dépannage disponible.</div>;
  }

  const title = isFr && current.titleFr ? current.titleFr : current.title;
  const scenario = isFr && current.scenarioFr ? current.scenarioFr : current.scenario;
  const fixExplanation = isFr && current.fixExplanationFr ? current.fixExplanationFr : current.fixExplanation;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setHasSubmitted(true);

    const chosen = current.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      if (!completedIds.has(current.id)) {
        const nextSet = new Set(completedIds);
        nextSet.add(current.id);
        setCompletedIds(nextSet);
        if (onScoreUpdate) onScoreUpdate(15);
      }
    }
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const selectedOption = current.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d32f2f]/10 text-[#d32f2f] flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11]">
              {isFr ? 'Défis de dépannage (Troubleshooting)' : 'Troubleshooting & Find the Bug'}
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Inspectez les fichiers de config ou scripts défaillants et trouvez l\'anomalie'
                : 'Inspect faulty configuration files or scripts and identify the bug'}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedIds.size} / {challenges.length} {isFr ? 'résolus' : 'solved'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-3 bg-[#fdf8f0] border-b border-[#ebdcc8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
              {current.certification.toUpperCase()} • Obj {current.objectiveId}
            </span>
            <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
          </div>
          <span className="text-xs font-bold text-[#817660]">
            Défi {currentIndex + 1} / {challenges.length}
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Title and Scenario */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-[#201b11]">{title}</h4>
            <div className="p-3.5 bg-[#fbf9f4] border border-[#ebdcc8] rounded-xl text-xs text-[#554b38] leading-relaxed">
              <span className="font-bold text-[#201b11]">{isFr ? 'Scénario d\'incident : ' : 'Incident Scenario: '}</span>
              {scenario}
            </div>
          </div>

          {/* Faulty Code / Config Viewer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#817660] px-1">
              <span className="flex items-center gap-1.5 font-mono">
                <FileCode className="w-3.5 h-3.5" />
                {current.language ? `syntax: ${current.language}` : 'Code snippet'}
              </span>
              <span className="text-[11px] text-[#d32f2f] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isFr ? 'Contient une erreur critique' : 'Contains a critical error'}
              </span>
            </div>

            <div className="rounded-xl bg-[#1e1b18] border border-[#3d372e] p-4 text-xs font-mono text-[#f3f0e6] overflow-x-auto shadow-inner">
              <pre className="leading-relaxed">
                {current.codeSnippet.split('\n').map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-6 shrink-0 text-white/30 select-none text-right pr-3 font-sans text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-[#e6db74]">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>

          {/* Question Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#817660]">
              {isFr
                ? 'Quelle est l\'anomalie exacte dans cet extrait ?'
                : 'What is the exact flaw in this configuration?'}
            </label>

            <div className="space-y-2.5">
              {current.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardStyle = 'bg-white border-[#d3c5ab] hover:border-[#785a00] hover:bg-[#fffcf7]';

                if (hasSubmitted) {
                  if (opt.isCorrect) {
                    cardStyle = 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] font-semibold';
                  } else if (isSelected && !opt.isCorrect) {
                    cardStyle = 'bg-[#ffebee] border-[#d32f2f] text-[#c62828]';
                  } else {
                    cardStyle = 'bg-gray-50 border-gray-200 opacity-60';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-[#fdf3e2] border-[#785a00] text-[#201b11] ring-1 ring-[#785a00]';
                }

                const optLabel = isFr && opt.labelFr ? opt.labelFr : opt.label;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? hasSubmitted
                            ? opt.isCorrect
                              ? 'bg-[#2e7d32] border-[#2e7d32] text-white'
                              : 'bg-[#d32f2f] border-[#d32f2f] text-white'
                            : 'bg-[#785a00] border-[#785a00] text-white'
                          : 'border-[#b5a790] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs leading-snug flex-1">{optLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {!hasSubmitted ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className="w-full py-3 bg-[#785a00] hover:bg-[#5f4700] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {isFr ? 'Valider le diagnostic' : 'Submit Diagnostic'}
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Outcome Banner */}
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
                        ? 'Diagnostic parfait !'
                        : 'Perfect Diagnostic!'
                      : isFr
                      ? 'Diagnostic erroné.'
                      : 'Incorrect Diagnostic.'}
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {selectedOption?.explanation}
                  </p>
                </div>
              </div>

              {/* Corrected Snippet Card */}
              <div className="p-4 bg-[#f1f8e9] border border-[#c8e6c9] rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#2e7d32] flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>{isFr ? 'Configuration corrigée recommandée :' : 'Recommended Fix:'}</span>
                </div>
                <pre className="p-3 bg-[#1e1b18] text-[#a6e22e] rounded-lg font-mono text-xs overflow-x-auto">
                  {current.correctedSnippet}
                </pre>
                <p className="text-xs text-[#33691e] leading-relaxed pt-1">{fixExplanation}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Recommencer ce défi' : 'Try Again'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#785a00] hover:bg-[#5f4700] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{isFr ? 'Défi suivant' : 'Next Challenge'}</span>
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
