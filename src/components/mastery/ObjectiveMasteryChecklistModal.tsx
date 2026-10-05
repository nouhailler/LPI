import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Terminal,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Wrench,
  Copy,
  Check
} from 'lucide-react';
import {
  ObjectiveCriteriaStatus,
  setObjectiveMasteryState,
  markTheoryCompleted,
  CompetencyMasteryState
} from '../../services/masteryEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { TabType } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  status: ObjectiveCriteriaStatus | null;
  onNavigateToTab?: (tab: TabType) => void;
  onRefresh?: () => void;
}

export const ObjectiveMasteryChecklistModal: React.FC<Props> = ({
  isOpen,
  onClose,
  status,
  onNavigateToTab,
  onRefresh
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;
  const [copied, setCopied] = useState(false);

  if (!isOpen || !status) return null;

  const handleCopyAscii = async () => {
    try {
      await navigator.clipboard.writeText(status.asciiChecklist);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleStateChange = (newState: CompetencyMasteryState) => {
    setObjectiveMasteryState(status.id, newState);
    if (onRefresh) onRefresh();
  };

  const handleToggleTheory = () => {
    markTheoryCompleted(status.id, !status.theory.completed);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#ffffff] border-2 border-[#d3c5ab] rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 pb-3 border-b border-[#ebdcc4]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#201b11] text-[#ffc20e] font-mono text-xs font-bold">
                {status.id}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider"
                style={{
                  backgroundColor: `${status.stateBadgeColor}15`,
                  color: status.stateBadgeColor
                }}
              >
                {status.stateLabelFr}
              </span>
              {status.command && (
                <code className="px-2 py-0.5 bg-[#f8ecdb] border border-[#d3c5ab] text-[#785a00] font-mono text-xs rounded font-bold">
                  {status.command}
                </code>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-black text-[#201b11]">
              {status.name}
            </h3>
            <p className="text-xs text-[#6e634e] mt-0.5">
              {isFr
                ? 'Critères cumulatifs requis pour valider la véritable maîtrise technique'
                : 'Cumulative criteria required to demonstrate genuine technical mastery'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#817660] hover:bg-[#f2e7d6] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pedagogical Distinction Alert */}
        <div className="p-3.5 rounded-xl bg-[#fff8ee] border border-amber-300 text-xs text-[#5c4e36] flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-[#201b11] block">
              {isFr ? 'Attention à ne pas confondre « Terminé » et « Maîtrisé »' : 'Important: Done ≠ Mastered'}
            </span>
            <p>
              {isFr
                ? 'La maîtrise ne s’obtient pas seulement en cochant une case ou en réussissant un QCM. Elle exige la preuve théorique, pratique sous terminal et de diagnostic.'
                : 'Mastery requires comprehensive proof across theoretical concepts, quiz accuracy, SRS retention, and hands-on terminal execution.'}
            </p>
          </div>
        </div>

        {/* The 4 Core Mastery Criteria Checklist */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e] block">
            {isFr ? 'Grille des 4 preuves de compétence :' : 'The 4 Competency Proofs:'}
          </span>

          <div className="space-y-2">
            {/* 1. Théorie */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                status.theory.completed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {status.theory.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm text-[#201b11] block">
                    {status.theory.completed ? '✓ ' : '✗ '} {status.theory.labelFr}
                  </span>
                  <span className="text-xs text-[#6e634e]">
                    {status.theory.detailsFr}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleTheory}
                className="px-2.5 py-1 rounded bg-[#ffffff] border border-[#d3c5ab] text-xs font-bold text-[#785a00] hover:bg-[#fff8ee] transition-colors cursor-pointer shrink-0"
              >
                {status.theory.completed ? (isFr ? 'Revalider' : 'Recheck') : (isFr ? 'Marquer lu' : 'Mark read')}
              </button>
            </div>

            {/* 2. Questions / QCM */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                status.quiz.passed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {status.quiz.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm text-[#201b11] block">
                    {status.quiz.passed ? '✓ ' : '✗ '} {status.quiz.labelFr} ({status.quiz.ratioPct}% / min 80%)
                  </span>
                  <span className="text-xs text-[#6e634e]">
                    {status.quiz.detailsFr}
                  </span>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('practice')}
                  className="px-2.5 py-1 rounded bg-[#ffffff] border border-[#d3c5ab] text-xs font-bold text-[#785a00] hover:bg-[#fff8ee] transition-colors cursor-pointer shrink-0"
                >
                  {isFr ? 'S’entraîner' : 'Practice'}
                </button>
              )}
            </div>

            {/* 3. Flashcards SRS */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                status.flashcards.passed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {status.flashcards.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-sm text-[#201b11] block">
                    {status.flashcards.passed ? '✓ ' : '✗ '} {status.flashcards.labelFr} ({status.flashcards.masteredCount}/{status.flashcards.targetCount} cartes)
                  </span>
                  <span className="text-xs text-[#6e634e]">
                    {status.flashcards.detailsFr}
                  </span>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('flashcards')}
                  className="px-2.5 py-1 rounded bg-[#ffffff] border border-[#d3c5ab] text-xs font-bold text-[#785a00] hover:bg-[#fff8ee] transition-colors cursor-pointer shrink-0"
                >
                  {isFr ? 'Réviser SRS' : 'Review SRS'}
                </button>
              )}
            </div>

            {/* 4. Lab Pratique / Dépannage */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                status.lab.passed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {status.lab.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="font-bold text-sm text-[#201b11] block truncate">
                    {status.lab.passed ? '✓ ' : '✗ '} {status.lab.labelFr}
                  </span>
                  <span className="text-xs text-[#6e634e] block truncate">
                    {status.lab.detailsFr}
                  </span>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('training')}
                  className="px-2.5 py-1 rounded bg-[#28A745] hover:bg-[#218838] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Lancer Lab' : 'Start Lab'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ASCII Checklist Preview (Matching user prompt) */}
        <div className="bg-[#1c1b18] text-[#38ef7d] font-mono p-4 rounded-xl border border-[#3b3a36] text-xs space-y-2">
          <div className="flex items-center justify-between text-[#cbd5e0] border-b border-[#3b3a36] pb-1.5">
            <span>TERMINAL ASCII PROOF</span>
            <button
              onClick={handleCopyAscii}
              className="text-xs hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIÉ !' : 'COPIER'}</span>
            </button>
          </div>
          <pre className="whitespace-pre overflow-x-auto text-[11px] leading-relaxed">
            {status.asciiChecklist}
          </pre>
        </div>

        {/* Recommendation */}
        <div className="p-3.5 rounded-xl bg-[#fff8ee] border border-amber-300 text-xs text-[#5c4e36] space-y-1">
          <span className="font-bold text-[#201b11] block">
            {isFr ? 'Prochaine étape pour progresser :' : 'Next recommended action:'}
          </span>
          <p>{status.nextStepRecommendationFr}</p>
        </div>

        {/* Fast State Override Buttons */}
        <div className="pt-2 border-t border-[#ebdcc4] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#6e634e] uppercase mr-1">
              {isFr ? 'Basculer l’état :' : 'Set state:'}
            </span>
            {(['NOT_STARTED', 'LEARNING', 'PRACTICING', 'MASTERED'] as CompetencyMasteryState[]).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => handleStateChange(st)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    status.state === st
                      ? 'bg-[#201b11] text-[#ffc20e]'
                      : 'bg-[#f2e7d6] text-[#6e634e] hover:bg-[#ebdcc4]'
                  }`}
                >
                  {st === 'NOT_STARTED'
                    ? 'Non démarré'
                    : st === 'LEARNING'
                    ? 'Apprentissage'
                    : st === 'PRACTICING'
                    ? 'Pratique'
                    : 'Maîtrisé'}
                </button>
              )
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
