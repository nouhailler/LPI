import React from 'react';
import {
  Sparkles,
  BookOpen,
  Baby,
  Terminal,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { openExplainDifferently, TransversalTutorMode } from '../utils/explainDifferentlyHelper';
import { useLanguage } from '../i18n/LanguageContext';

export interface ExplainDifferentlyPillsProps {
  topic: string;
  context?: string;
  variant?: 'banner' | 'compact' | 'inline' | 'card-footer';
  className?: string;
  label?: string;
  subLabel?: string;
  showQuiz?: boolean;
}

export const ExplainDifferentlyPills: React.FC<ExplainDifferentlyPillsProps> = ({
  topic,
  context,
  variant = 'compact',
  className = '',
  label,
  subLabel,
  showQuiz = false,
}) => {
  const { isFrench } = useLanguage();

  const handleLaunch = (mode: TransversalTutorMode, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    openExplainDifferently(topic, mode, context);
  };

  const defaultLabel = label ?? (isFrench ? 'Explique-moi autrement' : 'Explain differently');
  const defaultSubLabel =
    subLabel ??
    (isFrench
      ? 'Débloquez ce concept avec 4 angles pédagogiques adaptés :'
      : 'Unlock this concept with 4 tailored pedagogical angles:');

  // Variant 1: Full banner (Ideal for Lab failures, Exam wrong answers, Post-exam review)
  if (variant === 'banner') {
    return (
      <div
        className={`bg-gradient-to-r from-[#fff9f0] via-[#fef4e6] to-[#fbf1dc] border border-[#ffc20e]/60 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm md:text-base text-[#201b11] leading-tight">
                {defaultLabel}
              </span>
              <span className="font-mono text-xs font-bold bg-[#201b11] text-[#ffc20e] px-2 py-0.5 rounded-md border border-[#3b3222]">
                {topic}
              </span>
            </div>
            <p className="text-xs text-[#5c4a1e] mt-1 leading-relaxed">
              {defaultSubLabel}
            </p>
          </div>
        </div>

        {/* 4 Mode Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          {/* Simple */}
          <button
            type="button"
            onClick={(e) => handleLaunch('simple', e)}
            className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#e0f2fe] text-[#0369a1] text-xs font-bold border border-[#bae6fd] shadow-2xs hover:border-[#0284c7] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isFrench ? 'Explication directe et points clés' : 'Direct synthesis and key points'}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>{isFrench ? 'Simple' : 'Simple'}</span>
          </button>

          {/* Analogie */}
          <button
            type="button"
            onClick={(e) => handleLaunch('analogie', e)}
            className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#fef3c7] text-[#b45309] text-xs font-bold border border-[#fde68a] shadow-2xs hover:border-[#d97706] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isFrench ? 'Métaphore imagée pour débutant' : 'Beginner-friendly real-world analogy'}
          >
            <Baby className="w-3.5 h-3.5 text-[#d97706]" />
            <span>{isFrench ? 'Analogie' : 'Analogy'}</span>
          </button>

          {/* Exemple */}
          <button
            type="button"
            onClick={(e) => handleLaunch('exemple', e)}
            className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#dcfce7] text-[#15803d] text-xs font-bold border border-[#bbf7d0] shadow-2xs hover:border-[#16a34a] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isFrench ? 'Démonstration terminal et commandes bash' : 'Practical CLI terminal snippet'}
          >
            <Terminal className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>{isFrench ? 'Exemple' : 'Example'}</span>
          </button>

          {/* Expert / Pièges */}
          <button
            type="button"
            onClick={(e) => handleLaunch('expert', e)}
            className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#fee2e2] text-[#b91c1c] text-xs font-bold border border-[#fecaca] shadow-2xs hover:border-[#dc2626] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isFrench ? "Pièges d'examen et subtilités LPI" : 'LPI exam traps and gotchas'}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>{isFrench ? 'Expert' : 'Expert'}</span>
          </button>

          {showQuiz && (
            <button
              type="button"
              onClick={(e) => handleLaunch('quiz', e)}
              className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#ede9fe] text-[#6d28d9] text-xs font-bold border border-[#ddd6fe] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>Quiz</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Variant 2: Card footer / Inline compact pill row
  if (variant === 'card-footer') {
    return (
      <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
        <button
          type="button"
          onClick={(e) => handleLaunch('simple', e)}
          className="px-2 py-1 rounded-lg bg-[#fff8ea] hover:bg-[#f9bd00]/30 text-[#785a00] text-[11px] font-bold border border-[#ffc20e]/60 flex items-center gap-1 cursor-pointer transition-colors"
          title={isFrench ? 'Explique-moi simplement' : 'Explain simply'}
        >
          <Sparkles className="w-3 h-3 text-[#ffc20e] fill-[#ffc20e]" />
          <span>{isFrench ? 'Expliquer' : 'Explain'}</span>
        </button>

        <div className="flex items-center bg-[#f8ecdb] p-0.5 rounded-lg border border-[#d3c5ab]/60 gap-0.5">
          <button
            type="button"
            onClick={(e) => handleLaunch('simple', e)}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#4f4632] hover:text-[#0284c7] hover:bg-white transition-colors cursor-pointer"
            title="Mode Simple"
          >
            {isFrench ? 'Simple' : 'Simple'}
          </button>
          <button
            type="button"
            onClick={(e) => handleLaunch('analogie', e)}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#4f4632] hover:text-[#d97706] hover:bg-white transition-colors cursor-pointer"
            title="Mode Analogie"
          >
            {isFrench ? 'Analogie' : 'Analogy'}
          </button>
          <button
            type="button"
            onClick={(e) => handleLaunch('exemple', e)}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#4f4632] hover:text-[#16a34a] hover:bg-white transition-colors cursor-pointer"
            title="Mode Exemple"
          >
            {isFrench ? 'Exemple' : 'Example'}
          </button>
          <button
            type="button"
            onClick={(e) => handleLaunch('expert', e)}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#4f4632] hover:text-[#dc2626] hover:bg-white transition-colors cursor-pointer"
            title="Mode Expert / Pièges"
          >
            {isFrench ? 'Expert' : 'Expert'}
          </button>
        </div>
      </div>
    );
  }

  // Variant 3: Compact toolbar
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#fff8ea] border border-[#ffc20e]/60 rounded-xl px-2 py-1 shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={(e) => handleLaunch('simple', e)}
        className="flex items-center gap-1 text-[11px] font-bold text-[#785a00] hover:text-[#201b11] transition-colors cursor-pointer mr-1"
        title="Ouvrir le tuteur transversal LPI"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#ffc20e] fill-[#ffc20e]" />
        <span>{defaultLabel}</span>
      </button>

      <div className="h-3 w-px bg-[#ebdcc8]" />

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => handleLaunch('simple', e)}
          className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-[#0369a1] bg-[#e0f2fe]/80 hover:bg-[#bae6fd] transition-colors cursor-pointer"
          title="Mode Simple"
        >
          {isFrench ? 'Simple' : 'Simple'}
        </button>
        <button
          type="button"
          onClick={(e) => handleLaunch('analogie', e)}
          className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-[#b45309] bg-[#fef3c7]/80 hover:bg-[#fde68a] transition-colors cursor-pointer"
          title="Mode Analogie"
        >
          {isFrench ? 'Analogie' : 'Analogy'}
        </button>
        <button
          type="button"
          onClick={(e) => handleLaunch('exemple', e)}
          className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-[#15803d] bg-[#dcfce7]/80 hover:bg-[#bbf7d0] transition-colors cursor-pointer"
          title="Mode Exemple"
        >
          {isFrench ? 'Exemple' : 'Example'}
        </button>
        <button
          type="button"
          onClick={(e) => handleLaunch('expert', e)}
          className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-[#b91c1c] bg-[#fee2e2]/80 hover:bg-[#fecaca] transition-colors cursor-pointer"
          title="Mode Expert"
        >
          {isFrench ? 'Expert' : 'Expert'}
        </button>
      </div>
    </div>
  );
};
