import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  Terminal,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Play,
  FileQuestion,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { CommandPedagogy, GlossaryEntry } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  entry: GlossaryEntry;
  pedagogy: CommandPedagogy;
  onNavigateToTerm?: (term: string) => void;
  onOpenExamQuestion?: (questionId: string | number) => void;
  onOpenLab?: (labId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const CommandPedagogySection: React.FC<Props> = ({
  entry,
  pedagogy,
  onNavigateToTerm,
  onOpenExamQuestion,
  onOpenLab,
  onNavigateTab,
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [copiedCmd, setCopiedCmd] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [isExamExpanded, setIsExamExpanded] = useState(false);

  const commandToCopy = pedagogy.commandExample || entry.exampleSnippet || entry.term;

  const handleCopy = () => {
    navigator.clipboard.writeText(commandToCopy);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const fullQuestion = pedagogy.associatedExamQuestion?.fullQuestion;

  return (
    <div className="rounded-2xl border-2 border-[#ffc20e]/40 bg-gradient-to-b from-[#fffcf7] via-[#fffbf3] to-[#fff8ea] p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ebdcc8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ffc20e] flex items-center justify-center text-[#201b11] shadow-xs">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ffc20e]/20 text-[#785a00] text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{isFr ? 'Pédagogie & Réseau de Connaissances' : 'Pedagogy & Knowledge Network'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#201b11] mt-0.5 font-mono">
              {isFr ? (pedagogy.whyTitleFr || `Pourquoi cette commande : ${entry.term} ?`) : (pedagogy.whyTitle || `Why this command: ${entry.term}?`)}
            </h3>
          </div>
        </div>

        {/* Command Badge with 1-click copy */}
        <div className="flex items-center gap-2 bg-[#201b11] text-[#ffc20e] px-3.5 py-2 rounded-xl font-mono text-xs border border-[#3d3424] self-start sm:self-auto shadow-xs">
          <Terminal className="w-3.5 h-3.5 text-[#ffc20e] shrink-0" />
          <span className="font-bold truncate max-w-[220px]">{commandToCopy}</span>
          <button
            onClick={handleCopy}
            title={isFr ? 'Copier la commande' : 'Copy command'}
            className="text-[#d3c5ab] hover:text-white transition-colors cursor-pointer ml-1 p-1 hover:bg-white/10 rounded"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 1. POURQUOI ? (Visual Breakdown & Justification) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#785a00]">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ffc20e] text-[#201b11] text-[11px] font-bold">1</span>
          <span>{isFr ? 'Pourquoi ? (Décomposition & Rôle)' : 'Why? (Breakdown & Role)'}</span>
        </div>

        {/* Summary text */}
        <p className="text-xs sm:text-sm text-[#201b11] font-medium leading-relaxed bg-[#fff9ed] p-3 rounded-xl border border-[#ebdcc8]">
          {isFr ? (pedagogy.why.summaryFr || pedagogy.why.summary) : (pedagogy.why.summary || pedagogy.why.summaryFr)}
        </p>

        {/* Visual Octal / Flag Breakdown Table if available */}
        {pedagogy.why.breakdown && pedagogy.why.breakdown.length > 0 && (
          <div className="bg-[#201b11] text-[#f7f4ea] rounded-xl p-3.5 sm:p-4 border border-[#3b3222] font-mono text-xs shadow-inner space-y-2.5">
            <div className="text-[11px] text-[#ffc20e] font-bold uppercase tracking-wider flex items-center justify-between pb-1 border-b border-[#3b3222]">
              <span>{isFr ? 'Décomposition octale / Paramètres' : 'Octal / Parameter Breakdown'}</span>
              <span className="text-[#817660] text-[10px] font-normal">{entry.term}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {pedagogy.why.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#2d2518] rounded-lg p-2.5 border border-[#4a3f2b] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-[#ffc20e] bg-[#201b11] px-2 py-0.5 rounded border border-[#574932]">
                      {item.digit}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      {item.permissions}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-white uppercase tracking-wider">
                    {isFr ? (item.targetFr || item.target) : item.target}
                  </div>
                  <div className="text-[10px] text-[#d3c5ab] mt-1 font-sans leading-tight">
                    {isFr ? (item.explanationFr || item.explanation) : (item.explanation || item.explanationFr)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed bullet list */}
        {((isFr ? pedagogy.why.detailsFr : pedagogy.why.details) || pedagogy.why.details || []).length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {((isFr ? pedagogy.why.detailsFr : pedagogy.why.details) || pedagogy.why.details || []).map((det, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#4f4632] leading-normal">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#785a00] shrink-0 mt-0.5" />
                <span>{det}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. QUAND L'UTILISER ? */}
      <div className="space-y-2 pt-2 border-t border-[#ebdcc8]">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#785a00]">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ffc20e] text-[#201b11] text-[11px] font-bold">2</span>
          <span>{isFr ? 'Quand l\'utiliser ? (Cas d\'usage concret)' : 'When to use? (Real-World Use Cases)'}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#4f4632] leading-relaxed bg-[#ffffff] p-3 rounded-xl border border-[#ebdcc8]">
          {isFr ? (pedagogy.whenToUseFr || pedagogy.whenToUse) : (pedagogy.whenToUse || pedagogy.whenToUseFr)}
        </p>
      </div>

      {/* 3. ERREURS FRÉQUENTES */}
      {pedagogy.commonErrors && pedagogy.commonErrors.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-[#ebdcc8]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#b45309]">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-bold border border-[#fde68a]">3</span>
            <span>{isFr ? 'Erreurs fréquentes & Pièges d\'administration' : 'Common Errors & Pitfalls'}</span>
          </div>

          <div className="space-y-2">
            {pedagogy.commonErrors.map((err, idx) => (
              <div
                key={idx}
                className="bg-[#fffbeb] rounded-xl p-3 border border-[#fde68a] text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 font-mono font-bold text-[#b45309]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                  <code>{isFr ? (err.errorFr || err.error) : err.error}</code>
                </div>
                <p className="text-[#854d0e] text-[11px] pl-5 leading-normal">
                  {isFr ? (err.explanationFr || err.explanation) : (err.explanation || err.explanationFr)}
                </p>
                {err.correction && (
                  <div className="pl-5 pt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#15803d]">
                    <span className="font-bold text-[#166534] uppercase text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                      {isFr ? 'Correction' : 'Fix'} :
                    </span>
                    <code className="bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {err.correction}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMMANDES SIMILAIRES */}
      {pedagogy.similarCommands && pedagogy.similarCommands.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-[#ebdcc8]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#785a00]">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ffc20e] text-[#201b11] text-[11px] font-bold">4</span>
            <span>{isFr ? 'Commandes similaires & Distinctions clés' : 'Similar Commands & Distinctions'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pedagogy.similarCommands.map((sim, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 border border-[#ebdcc8] hover:border-[#ffc20e] transition-colors flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#201b11] bg-[#f8ecdb] px-2 py-0.5 rounded group-hover:bg-[#ffc20e] transition-colors">
                    {sim.command}
                  </span>
                  {onNavigateToTerm && (
                    <button
                      onClick={() => onNavigateToTerm(sim.command)}
                      className="text-[10px] font-bold text-[#785a00] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isFr ? 'Voir dans le glossaire' : 'View entry'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#4f4632] mt-1.5 leading-normal">
                  {isFr ? (sim.distinctionFr || sim.distinction) : (sim.distinction || sim.distinctionFr)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. QUESTION D'EXAMEN ASSOCIÉE */}
      {pedagogy.associatedExamQuestion && (
        <div className="space-y-2.5 pt-2 border-t border-[#ebdcc8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#4338ca]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#e0e7ff] text-[#4338ca] text-[11px] font-bold border border-[#c7d2fe]">5</span>
              <span>{isFr ? 'Question d\'examen associée' : 'Associated Exam Question'}</span>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0e7ff] text-[#4338ca]">
              {pedagogy.associatedExamQuestion.objectiveId ? `LPIC Obj ${pedagogy.associatedExamQuestion.objectiveId}` : 'Certification Exam'}
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#c7d2fe] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#4338ca]">
                  {isFr ? (pedagogy.associatedExamQuestion.titleFr || pedagogy.associatedExamQuestion.title) : pedagogy.associatedExamQuestion.title}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-[#1e1b4b] leading-snug">
                  {isFr ? (pedagogy.associatedExamQuestion.previewFr || pedagogy.associatedExamQuestion.preview) : pedagogy.associatedExamQuestion.preview}
                </h4>
              </div>

              {fullQuestion && (
                <button
                  onClick={() => setIsExamExpanded(!isExamExpanded)}
                  className="px-2.5 py-1 rounded-lg bg-[#e0e7ff] hover:bg-[#c7d2fe] text-[#4338ca] text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <FileQuestion className="w-3.5 h-3.5" />
                  <span>{isExamExpanded ? (isFr ? 'Masquer le quiz' : 'Hide quiz') : (isFr ? 'Tester cette question' : 'Try this question')}</span>
                  {isExamExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Interactive Question Solver if fullQuestion is provided and expanded */}
            {fullQuestion && isExamExpanded && (
              <div className="pt-2 border-t border-[#e0e7ff] space-y-3">
                <p className="text-xs font-medium text-[#1e1b4b]">
                  {isFr ? (fullQuestion.questionFr || fullQuestion.question) : fullQuestion.question}
                </p>

                <div className="space-y-1.5">
                  {((isFr ? fullQuestion.optionsFr : fullQuestion.options) || fullQuestion.options).map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === fullQuestion.correctIndex;
                    let optionStyle = 'bg-white border-[#d3c5ab] text-[#201b11] hover:border-[#ffc20e]';

                    if (hasSubmittedAnswer) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                      } else {
                        optionStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-[#fff8ea] border-[#ffc20e] text-[#201b11] font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasSubmittedAnswer}
                        onClick={() => setSelectedOption(optIdx)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <span className="font-mono">{opt}</span>
                        {hasSubmittedAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {hasSubmittedAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Validation and Explanation */}
                <div className="flex items-center justify-between pt-1">
                  {!hasSubmittedAnswer ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={() => setHasSubmittedAnswer(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        selectedOption !== null
                          ? 'bg-[#4338ca] text-white hover:bg-[#3730a3]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isFr ? 'Valider la réponse' : 'Submit Answer'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOption(null);
                        setHasSubmittedAnswer(false);
                      }}
                      className="text-xs text-[#4338ca] font-bold hover:underline cursor-pointer"
                    >
                      {isFr ? 'Recommencer' : 'Reset'}
                    </button>
                  )}

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('practice')}
                      className="text-xs text-[#4338ca] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isFr ? 'Ouvrir dans le simulateur' : 'Open in practice exam'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {hasSubmittedAnswer && (
                  <div className="p-3 rounded-lg bg-[#f5f3ff] border border-[#ddd6fe] text-xs text-[#4c1d95] space-y-1">
                    <strong>{isFr ? 'Explication détaillée :' : 'Detailed Explanation:'}</strong>
                    <p className="leading-relaxed">
                      {isFr ? (fullQuestion.explanationFr || fullQuestion.explanation) : fullQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. LAB ASSOCIÉ */}
      {pedagogy.associatedLab && (
        <div className="space-y-2.5 pt-2 border-t border-[#ebdcc8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#047857]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#d1fae5] text-[#065f46] text-[11px] font-bold border border-[#a7f3d0]">6</span>
              <span>{isFr ? 'Lab associé (Atelier Pratique)' : 'Associated Hands-On Lab'}</span>
            </div>

            <div className="flex items-center gap-2">
              {pedagogy.associatedLab.difficulty && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                  {pedagogy.associatedLab.difficulty}
                </span>
              )}
              {pedagogy.associatedLab.estimatedMinutes && (
                <span className="text-[10px] font-semibold text-[#817660]">
                  ~{pedagogy.associatedLab.estimatedMinutes} min
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#a7f3d0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#059669]">
                {pedagogy.associatedLab.labId}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[#064e3b]">
                {isFr ? (pedagogy.associatedLab.titleFr || pedagogy.associatedLab.title) : pedagogy.associatedLab.title}
              </h4>
              <p className="text-[11px] text-[#047857] leading-relaxed">
                {isFr ? (pedagogy.associatedLab.goalFr || pedagogy.associatedLab.goal) : (pedagogy.associatedLab.goal || pedagogy.associatedLab.goalFr)}
              </p>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => {
                  if (onOpenLab) {
                    onOpenLab(pedagogy.associatedLab!.labId);
                  } else {
                    onNavigateTab('training');
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFr ? 'Lancer ce lab' : 'Launch Lab'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
