import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  FileQuestion,
  FlaskConical,
  Sparkles,
  Wrench,
  CheckCircle2,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Award,
} from 'lucide-react';
import { PathModule, LearningPath } from '../../data/learningPaths/types';
import {
  CompetencyActivityType,
  ActivityProof,
  completeAdaptiveActivity,
  CompetencyMastery,
} from '../../services/adaptivePathEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface CompetencyActivityPanelProps {
  path: LearningPath;
  module: PathModule;
  competencyMastery: CompetencyMastery;
  activeTab: CompetencyActivityType;
  onTabChange: (tab: CompetencyActivityType) => void;
  onOpenExplainDifferently?: (topic: string, mode?: any, context?: string) => void;
  onNavigateTab?: (tab: any) => void;
  onOpenTerminalLab?: (labId?: string) => void;
}

export const CompetencyActivityPanel: React.FC<CompetencyActivityPanelProps> = ({
  path,
  module,
  competencyMastery,
  activeTab,
  onTabChange,
  onOpenExplainDifferently,
  onNavigateTab,
  onOpenTerminalLab,
}) => {
  const { isFrench } = useLanguage();
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<string, boolean>>({});
  const [labStepIndex, setLabStepIndex] = useState<number>(0);
  const [isDiagnosticOutputRevealed, setIsDiagnosticOutputRevealed] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleValidateActivity = (activityType: CompetencyActivityType, score?: number) => {
    completeAdaptiveActivity(path, module, activityType, score);
    const label =
      activityType === 'theory'
        ? isFrench ? 'Théorie validée ! Preuve de maîtrise enregistrée.' : 'Theory validated! Mastery proof saved.'
        : activityType === 'quiz'
        ? isFrench ? 'QCM réussi ! Objectif LPI validé.' : 'Quiz passed! LPI Objective mastered.'
        : activityType === 'lab'
        ? isFrench ? 'Lab pratique validé ! Synchronisé avec le Terminal.' : 'Hands-on lab validated! Synced with Terminal.'
        : activityType === 'flashcards'
        ? isFrench ? 'Flashcard mémorisée ! Enregistrée dans le moteur SRS.' : 'Flashcard memorized! Saved in SRS engine.'
        : activityType === 'explain'
        ? isFrench ? 'Concept exploré ! Preuve pédagogique validée.' : 'Concept explored! Pedagogical proof validated.'
        : isFrench ? 'Panne de production résolue ! Incident validé.' : 'Production incident solved! Verified.';

    setActionNotice(label);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const availableTypes: CompetencyActivityType[] = React.useMemo(() => {
    if (module.activeActivityTypes && module.activeActivityTypes.length > 0) {
      return module.activeActivityTypes;
    }
    return [
      'theory',
      ...(module.explainTopic ? (['explain'] as CompetencyActivityType[]) : []),
      'flashcards',
      'quiz',
      'lab',
      'troubleshoot',
    ];
  }, [module]);

  React.useEffect(() => {
    if (!availableTypes.includes(activeTab)) {
      onTabChange(availableTypes[0] || 'theory');
    }
  }, [availableTypes, activeTab, onTabChange]);

  const defaultTabInfo: Record<
    CompetencyActivityType,
    { label: string; labelFr: string; icon: React.ReactNode; colorClass: string; activeClass: string; hoverClass: string }
  > = {
    theory: {
      label: '1. Theory & Impact',
      labelFr: '1. Théorie & Concepts',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      colorClass: 'text-[#6e634e]',
      activeClass: 'bg-[#785a00] text-white shadow-xs',
      hoverClass: 'hover:bg-[#f8ecdb]',
    },
    explain: {
      label: 'Explain Differently',
      labelFr: '« Explique-moi autrement »',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      colorClass: 'text-[#d97706]',
      activeClass: 'bg-[#d97706] text-white shadow-xs',
      hoverClass: 'hover:bg-[#fffbeb]',
    },
    flashcards: {
      label: 'Flashcards & SRS',
      labelFr: 'Flashcards & SRS',
      icon: <Layers className="w-3.5 h-3.5" />,
      colorClass: 'text-[#6e634e]',
      activeClass: 'bg-[#785a00] text-white shadow-xs',
      hoverClass: 'hover:bg-[#f8ecdb]',
    },
    quiz: {
      label: 'Practice Quiz',
      labelFr: 'Quiz formatif',
      icon: <FileQuestion className="w-3.5 h-3.5" />,
      colorClass: 'text-[#6e634e]',
      activeClass: 'bg-[#785a00] text-white shadow-xs',
      hoverClass: 'hover:bg-[#f8ecdb]',
    },
    lab: {
      label: 'Hands-on Lab',
      labelFr: 'LAB Pratique',
      icon: <FlaskConical className="w-3.5 h-3.5" />,
      colorClass: 'text-[#047857]',
      activeClass: 'bg-[#047857] text-white shadow-xs',
      hoverClass: 'hover:bg-[#ecfdf5]',
    },
    troubleshoot: {
      label: 'Troubleshooting',
      labelFr: 'Troubleshooting',
      icon: <Wrench className="w-3.5 h-3.5" />,
      colorClass: 'text-[#ba1a1a]',
      activeClass: 'bg-[#ba1a1a] text-white shadow-xs',
      hoverClass: 'hover:bg-[#fff0f0]',
    },
  };

  const currentProof = competencyMastery.activities[activeTab];

  return (
    <div className="flex flex-col gap-4">
      {/* Activity Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f0e4d2] pb-2">
        {availableTypes.map((t) => {
          const info = defaultTabInfo[t];
          const custom = module.activityLabels?.[t];
          const label = custom ? (isFrench ? custom.labelFr : custom.label) : (isFrench ? info.labelFr : info.label);
          const isCompleted = competencyMastery.activities[t]?.completed;
          const isActive = activeTab === t;

          return (
            <button
              key={t}
              onClick={() => onTabChange(t)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isActive ? info.activeClass : `${info.colorClass} ${info.hoverClass}`
              }`}
            >
              {info.icon}
              <span>{label}</span>
              {isCompleted && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Proof of Mastery Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
          currentProof?.completed
            ? 'bg-[#f0fbf2] border-[#047857]/30 text-[#047857]'
            : 'bg-[#fffaf0] border-[#ffc20e]/60 text-[#785a00]'
        }`}
      >
        <div className="flex items-center gap-2">
          {currentProof?.completed ? (
            <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#785a00] shrink-0" />
          )}
          <div>
            <span className="font-extrabold uppercase tracking-wider block text-[10px]">
              {currentProof?.completed
                ? isFrench
                  ? '✓ Preuve de maîtrise vérifiée'
                  : '✓ Verified Mastery Proof'
                : isFrench
                ? 'Preuve de maîtrise en attente'
                : 'Mastery Proof Pending'}
            </span>
            <span className="text-[11px]">
              {currentProof?.completed
                ? isFrench
                  ? currentProof.proofLabelFr
                  : currentProof.proofLabel
                : isFrench
                ? 'Complétez cette activité pour valider automatiquement cette compétence.'
                : 'Complete this activity to automatically validate this competency.'}
            </span>
          </div>
        </div>

        {!currentProof?.completed && (
          <button
            onClick={() => handleValidateActivity(activeTab)}
            className="px-3 py-1 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer shrink-0"
          >
            {isFrench ? 'Valider la preuve' : 'Verify Proof'}
          </button>
        )}
      </div>

      {/* Transient Action Notice */}
      {actionNotice && (
        <div className="p-2.5 bg-[#f0fdf4] border border-[#28A745]/30 text-[#15803d] rounded-xl text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#28A745] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* TAB 1: THEORY */}
      {activeTab === 'theory' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#fff8f2] p-3.5 rounded-xl border border-[#d3c5ab]/60">
              <span className="font-bold text-[#785a00] uppercase tracking-wider block mb-1">
                {isFrench ? '🎯 Résumé théorique :' : '🎯 Concept Summary:'}
              </span>
              <p className="text-[#4f4632] leading-relaxed">
                {isFrench ? module.theory.summaryFr : module.theory.summary}
              </p>
            </div>

            <div className="bg-[#f0f7fc] p-3.5 rounded-xl border border-[#0061a4]/20">
              <span className="font-bold text-[#0061a4] uppercase tracking-wider block mb-1">
                {isFrench ? '🏢 Impact en production :' : '🏢 Real-World Impact:'}
              </span>
              <p className="text-[#334155] leading-relaxed">
                {isFrench ? module.theory.whyItMattersFr : module.theory.whyItMatters}
              </p>
            </div>
          </div>

          {/* Commands */}
          <div>
            <span className="font-bold text-[#6e634e] uppercase tracking-wider block mb-1.5">
              {isFrench ? 'Commandes & Outils essentiels :' : 'Essential Commands & Tools:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {module.theory.commands.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => copyToClipboard(cmd, `${module.id}-${cmd}`)}
                  className="px-2.5 py-1 rounded-md bg-[#201b11] text-[#ebdcc8] font-mono text-[11px] hover:bg-[#342c1f] transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>{cmd}</span>
                  {copiedCodeId === `${module.id}-${cmd}` ? (
                    <Check className="w-3 h-3 text-[#047857]" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 text-[#817660] group-hover:text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Code Snippet Box */}
          {module.theory.codeSnippet && (
            <div className="bg-[#201b11] rounded-xl overflow-hidden border border-[#443825]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#17130b] text-[11px] text-[#d3c5ab] border-b border-[#342c1f]">
                <span className="font-mono font-medium">
                  {isFrench ? module.theory.codeSnippet.labelFr : module.theory.codeSnippet.label}
                </span>
                <button
                  onClick={() => copyToClipboard(module.theory.codeSnippet!.code, `${module.id}-snippet`)}
                  className="flex items-center gap-1 text-[10px] text-[#ffc20e] hover:underline cursor-pointer"
                >
                  {copiedCodeId === `${module.id}-snippet` ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>{isFrench ? 'Copié' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isFrench ? 'Copier' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 font-mono text-[11px] text-[#00e5ff] overflow-x-auto leading-relaxed">
                {module.theory.codeSnippet.code}
              </pre>
            </div>
          )}

          {/* Production Trap */}
          <div className="p-3 bg-[#fff0f0] rounded-xl border border-[#ba1a1a]/20 flex items-start gap-2.5 text-[#ba1a1a]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px]">
                {isFrench ? '⚠️ Piège classique en production :' : '⚠️ Production Trap & Mistake:'}
              </span>
              <p className="text-[11px] leading-relaxed text-[#7f1d1d] mt-0.5">
                {isFrench ? module.theory.prodTrapFr : module.theory.prodTrap}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleValidateActivity('theory')}
              className="px-4 py-2 bg-[#785a00] hover:bg-[#634b00] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFrench ? 'Marquer la théorie comme assimilée' : 'Mark Theory as Understood'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: EXPLAIN DIFFERENTLY */}
      {activeTab === 'explain' && module.explainTopic && (
        <div className="bg-[#fffdf8] p-4 rounded-xl border border-[#f0e4d2] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffc20e]" />
              <h4 className="font-extrabold text-sm text-[#201b11]">
                {isFrench
                  ? `Explorer '${module.explainTopic}' sous 5 angles pédagogiques`
                  : `Explore '${module.explainTopic}' from 5 pedagogical perspectives`}
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f0e4d2] rounded font-bold text-[#785a00]">
              5 Angles
            </span>
          </div>

          <p className="text-xs text-[#4f4632] leading-relaxed">
            {isFrench
              ? `Le tuteur pédagogique « Explique-moi autrement » décompose ce concept avec des analogies concrètes, des diagrammes ASCII, un quiz interactif et un rappel de pièges fréquents.`
              : `The "Explain Differently" pedagogical tutor breaks down this concept using simple analogies, ASCII diagrams, a targeted quiz, and production anti-patterns.`}
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                if (onOpenExplainDifferently) {
                  onOpenExplainDifferently(module.explainTopic!, 'simple');
                }
                handleValidateActivity('explain');
              }}
              className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isFrench ? 'Ouvrir « Explique-moi autrement »' : 'Launch "Explain Differently"'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-[#6e634e] flex items-center justify-between">
            <span>
              {isFrench
                ? `${module.flashcards.length} fiches mémo pour ce concept :`
                : `${module.flashcards.length} review cards for this concept:`}
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('flashcards')}
                className="text-[#785a00] hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>{isFrench ? 'Ouvrir le Deck SRS complet' : 'Open Full SRS Deck'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {module.flashcards.map((card) => {
              const isRevealed = revealedFlashcards[card.id] || false;
              return (
                <div
                  key={card.id}
                  onClick={() =>
                    setRevealedFlashcards((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                  }
                  className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#ffffff] hover:border-[#ffc20e] cursor-pointer transition-all flex flex-col justify-between min-h-[110px]"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider block mb-1">
                      {isFrench ? 'Question :' : 'Prompt:'}
                    </span>
                    <p className="font-semibold text-xs text-[#201b11]">
                      {isFrench ? card.questionFr : card.question}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#f2e7d6]">
                    {isRevealed ? (
                      <div>
                        <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block mb-0.5">
                          {isFrench ? 'Réponse :' : 'Answer:'}
                        </span>
                        <p className="font-mono text-[11px] text-[#047857]">
                          {isFrench ? card.answerFr : card.answer}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#785a00] font-semibold italic">
                        {isFrench ? '👉 Cliquer pour révéler la réponse' : '👉 Click to reveal answer'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleValidateActivity('flashcards')}
              className="px-4 py-2 bg-[#785a00] hover:bg-[#634b00] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFrench ? 'Valider la mémorisation des fiches' : 'Validate Flashcard Mastery'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-[#fffdfa] p-4 rounded-xl border border-[#d3c5ab] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#785a00] uppercase tracking-wider">
              {isFrench ? 'Question d\'application :' : 'Application Question:'}
            </span>
            {module.linkedLpiObjective && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ece1d0] text-[#4f4632]">
                Objectif LPI {module.linkedLpiObjective}
              </span>
            )}
          </div>

          <p className="text-xs font-bold text-[#201b11] leading-relaxed">
            {isFrench ? module.question.questionFr : module.question.question}
          </p>

          <div className="space-y-1.5 mt-1">
            {(isFrench && module.question.optionsFr ? module.question.optionsFr : module.question.options).map(
              (opt, optIdx) => {
                const isSelected = selectedQuizIndex === optIdx;
                const isCorrect = optIdx === module.question.correctIndex;
                const hasAnswered = selectedQuizIndex !== null;

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      setSelectedQuizIndex(optIdx);
                      if (optIdx === module.question.correctIndex) {
                        handleValidateActivity('quiz', 100);
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left font-sans text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      hasAnswered
                        ? isCorrect
                          ? 'bg-[#f0fbf2] border-[#047857] text-[#047857] font-bold'
                          : isSelected
                          ? 'bg-[#fff0f0] border-[#ba1a1a] text-[#ba1a1a]'
                          : 'bg-[#ffffff] border-[#e2d5c0] text-[#817660] opacity-60'
                        : isSelected
                        ? 'bg-[#fff8f2] border-[#785a00] font-bold text-[#785a00]'
                        : 'bg-[#ffffff] border-[#e2d5c0] hover:bg-[#fff8f2] text-[#201b11]'
                    }`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />}
                  </button>
                );
              }
            )}
          </div>

          {selectedQuizIndex !== null && (
            <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#d3c5ab] text-xs text-[#4f4632] mt-2">
              <span className="font-bold block text-[#201b11] mb-0.5">
                {selectedQuizIndex === module.question.correctIndex
                  ? isFrench ? '✓ Bonne réponse ! Explication :' : '✓ Correct! Explanation:'
                  : isFrench ? '❌ Réponse inexacte. Explication :' : '❌ Incorrect. Explanation:'}
              </span>
              <p>{isFrench ? module.question.explanationFr : module.question.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: LAB */}
      {activeTab === 'lab' && (
        <div className="bg-[#fcfdfc] p-4 rounded-xl border border-[#047857]/30 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-sm text-[#047857] flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                <span>{isFrench ? module.lab.titleFr : module.lab.title}</span>
              </h4>
              <p className="text-xs text-[#4f4632] mt-0.5">
                {isFrench ? module.lab.goalFr : module.lab.goal}
              </p>
            </div>

            {onOpenTerminalLab && (
              <button
                onClick={() => {
                  onOpenTerminalLab(module.lab.id);
                  handleValidateActivity('lab');
                }}
                className="px-3 py-1.5 bg-[#047857] hover:bg-[#036246] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Lancer dans le Terminal interactif' : 'Open in Virtual Terminal'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-2 mt-1">
            {module.lab.steps.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-3 bg-[#ffffff] rounded-lg border border-[#d3c5ab] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#201b11]">
                    {isFrench ? `Étape ${step.stepNumber} : ${step.titleFr}` : `Step ${step.stepNumber}: ${step.title}`}
                  </span>
                  <span className="text-[10px] font-mono text-[#817660]">
                    {step.expectedCommands[0]}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632]">
                  {isFrench ? step.instructionFr : step.instruction}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    {step.expectedCommands.map((c) => (
                      <code
                        key={c}
                        onClick={() => copyToClipboard(c, `lab-${c}`)}
                        className="px-2 py-0.5 bg-[#201b11] text-[#00e5ff] rounded font-mono text-[11px] cursor-pointer hover:bg-[#342c1f]"
                      >
                        {c}
                      </code>
                    ))}
                  </div>

                  <span className="text-[10px] text-[#047857] font-semibold">
                    {isFrench ? step.explanationFr : step.explanation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleValidateActivity('lab')}
              className="px-4 py-2 bg-[#047857] hover:bg-[#036246] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFrench ? 'Valider la réalisation du lab' : 'Validate Lab Completion'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: TROUBLESHOOTING */}
      {activeTab === 'troubleshoot' && (
        <div className="bg-[#fffbfb] p-4 rounded-xl border border-[#ba1a1a]/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#ba1a1a]" />
              <h4 className="font-extrabold text-sm text-[#ba1a1a]">
                {isFrench ? module.troubleshooting.titleFr : module.troubleshooting.title}
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a]">
              Incident de Production
            </span>
          </div>

          <div className="p-3 bg-[#ffffff] rounded-lg border border-[#ebdcc8] text-xs">
            <span className="font-bold text-[#ba1a1a] uppercase tracking-wider block mb-1 text-[10px]">
              {isFrench ? '🚨 Symptôme / Alerte :' : '🚨 Symptom / Incident Alert:'}
            </span>
            <p className="text-[#201b11] font-medium leading-relaxed">
              {isFrench ? module.troubleshooting.symptomFr : module.troubleshooting.symptom}
            </p>
          </div>

          {/* Investigation command */}
          <div>
            <span className="font-bold text-[#6e634e] uppercase tracking-wider block mb-1 text-[10px]">
              {isFrench ? 'Commandes d\'investigation recommandées :' : 'Investigation Commands:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {module.troubleshooting.investigationCommands.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => copyToClipboard(cmd, `tr-${cmd}`)}
                  className="px-2.5 py-1 rounded bg-[#201b11] text-[#00e5ff] font-mono text-[11px] hover:bg-[#342c1f] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{cmd}</span>
                  <Copy className="w-2.5 h-2.5 text-[#817660]" />
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Output Toggle */}
          <div className="bg-[#201b11] rounded-xl overflow-hidden border border-[#443825]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#17130b] text-[11px] text-[#d3c5ab]">
              <span className="font-mono">{isFrench ? 'Sortie console diagnostique' : 'Diagnostic Terminal Output'}</span>
              <button
                onClick={() => setIsDiagnosticOutputRevealed(!isDiagnosticOutputRevealed)}
                className="text-[10px] text-[#ffc20e] hover:underline cursor-pointer"
              >
                {isDiagnosticOutputRevealed
                  ? isFrench ? 'Masquer la sortie' : 'Hide output'
                  : isFrench ? 'Afficher la sortie console' : 'Inspect console output'}
              </button>
            </div>
            {isDiagnosticOutputRevealed && (
              <pre className="p-3 font-mono text-[11px] text-[#ffb4ab] overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {module.troubleshooting.diagnosticOutput}
              </pre>
            )}
          </div>

          {/* Root cause and solution */}
          <div className="p-3 bg-[#f0fbf2] rounded-lg border border-[#047857]/30 text-xs text-[#047857]">
            <span className="font-extrabold uppercase tracking-wider block text-[10px] mb-1">
              {isFrench ? '🔍 Cause racine & Remédiation :' : '🔍 Root Cause & Remediation:'}
            </span>
            <p className="text-[#134e4a] leading-relaxed">
              {isFrench ? module.troubleshooting.rootCauseFr : module.troubleshooting.rootCause}
            </p>
            <div className="mt-2 pt-2 border-t border-[#047857]/20 flex items-center justify-between">
              <code className="font-mono font-bold text-[#047857] text-[11px]">
                {module.troubleshooting.solutionCommand}
              </code>
              <span className="text-[10px] text-[#4f4632]">
                {isFrench ? module.troubleshooting.solutionExplanationFr : module.troubleshooting.solutionExplanation}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleValidateActivity('troubleshoot')}
              className="px-4 py-2 bg-[#ba1a1a] hover:bg-[#991b1b] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFrench ? 'Valider la résolution du problème' : 'Validate Incident Resolution'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
