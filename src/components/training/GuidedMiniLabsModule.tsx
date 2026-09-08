import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Clock,
  BookOpen,
  Send
} from 'lucide-react';
import { GuidedLabScenario } from '../../types';
import { validateCommandTolerance, ToleranceValidationResult } from '../../utils/commandTolerance';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  scenarios: GuidedLabScenario[];
  onScoreUpdate?: (points: number) => void;
}

export const GuidedMiniLabsModule: React.FC<Props> = ({ scenarios, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<ToleranceValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<{ command: string; output: string; isSuccess: boolean }[]>([]);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  const scenario = scenarios[activeScenarioIndex] || scenarios[0];
  const step = scenario?.steps[activeStepIndex];

  if (!scenario || !step) {
    return <div className="p-8 text-center text-[#817660]">Aucun scénario disponible.</div>;
  }

  const title = isFr && scenario.titleFr ? scenario.titleFr : scenario.title;
  const goal = isFr && scenario.goalFr ? scenario.goalFr : scenario.goal;
  const context = isFr && scenario.contextFr ? scenario.contextFr : scenario.context;

  const stepTitle = isFr && step.titleFr ? step.titleFr : step.title;
  const stepInstruction = isFr && step.instructionFr ? step.instructionFr : step.instruction;
  const stepHint = isFr && step.hintFr ? step.hintFr : step.hint;
  const stepExplanation = isFr && step.explanationFr ? step.explanationFr : step.explanation;

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const validation = validateCommandTolerance(userInput, step.expectedCommands);
    setResult(validation);

    if (validation.isCorrect) {
      const entry = {
        command: userInput,
        output: step.simulatedOutput,
        isSuccess: true,
      };
      setTerminalHistory((prev) => [...prev, entry]);
      setUserInput('');
      setShowHint(false);

      if (activeStepIndex === scenario.steps.length - 1) {
        if (!completedScenarios.has(scenario.id)) {
          const next = new Set(completedScenarios);
          next.add(scenario.id);
          setCompletedScenarios(next);
          if (onScoreUpdate) onScoreUpdate(30);
        }
      }
    } else {
      const entry = {
        command: userInput,
        output: validation.isNearMiss
          ? `bash: syntax error near '${userInput}' (Presque ! Vérifiez l'option ou la syntaxe)`
          : `bash: command or arguments not recognized for this lab objective`,
        isSuccess: false,
      };
      setTerminalHistory((prev) => [...prev, entry]);
    }
  };

  const handleNextStep = () => {
    if (activeStepIndex < scenario.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      setResult(null);
      setUserInput('');
      setShowHint(false);
    }
  };

  const handleResetLab = () => {
    setActiveStepIndex(0);
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setTerminalHistory([]);
  };

  const handleNextScenario = () => {
    if (activeScenarioIndex < scenarios.length - 1) {
      setActiveScenarioIndex(activeScenarioIndex + 1);
    } else {
      setActiveScenarioIndex(0);
    }
    handleResetLab();
  };

  const isScenarioFinished = activeStepIndex === scenario.steps.length - 1 && result?.isCorrect;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11]">
              {isFr ? 'Scénarios pratiques guidés (Mini-Labs)' : 'Guided Mini-Labs'}
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Résolvez des missions d\'administration pas à pas dans un terminal interactif'
                : 'Solve realistic administration tasks step-by-step in an interactive simulated terminal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#817660]">
            <Clock className="w-3.5 h-3.5" />
            <span>~{scenario.estimatedMinutes} min</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedScenarios.size} / {scenarios.length} {isFr ? 'complétés' : 'completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Lab Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Stepper & Mission Briefing (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#d3c5ab] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
                {scenario.certification.toUpperCase()} • Obj {scenario.objectiveId}
              </span>
              <span className="text-xs font-semibold text-[#817660]">{scenario.category}</span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-[#201b11]">{title}</h4>
              <p className="text-xs text-[#60553e] leading-relaxed">{context}</p>
            </div>

            <div className="p-3 bg-[#fdf8f0] border border-[#ebdcc8] rounded-xl text-xs text-[#554b38] space-y-1">
              <div className="font-bold text-[#201b11]">{isFr ? 'Objectif de la mission :' : 'Mission Goal:'}</div>
              <div>{goal}</div>
            </div>

            {/* Stepper list */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#817660]">
                {isFr ? 'Étapes du lab :' : 'Lab Steps:'}
              </div>

              <div className="space-y-2">
                {scenario.steps.map((st, idx) => {
                  const isDone = idx < activeStepIndex || (idx === activeStepIndex && result?.isCorrect);
                  const isCurrent = idx === activeStepIndex;

                  return (
                    <div
                      key={st.id}
                      className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-[#fdf3e2] border-[#785a00] text-[#201b11] shadow-xs'
                          : isDone
                          ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]'
                          : 'bg-[#faf7f2] border-[#e5dcce] text-[#817660] opacity-70'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-[#2e7d32] text-white'
                            : isCurrent
                            ? 'bg-[#785a00] text-white'
                            : 'bg-[#d3c5ab] text-[#4f4632]'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold">{isFr && st.titleFr ? st.titleFr : st.title}</div>
                        {isCurrent && (
                          <div className="text-[11px] text-[#785a00] font-medium leading-relaxed pt-0.5">
                            {isFr && st.instructionFr ? st.instructionFr : st.instruction}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Lab Button */}
            <button
              type="button"
              onClick={handleResetLab}
              className="w-full py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 border border-[#d3c5ab] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFr ? 'Recommencer ce lab depuis le début' : 'Restart Lab'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-[#181614] rounded-2xl border border-[#3b352b] shadow-lg flex-1 flex flex-col overflow-hidden">
            {/* Terminal Titlebar */}
            <div className="px-4 py-2.5 bg-[#25221e] border-b border-[#3b352b] flex items-center justify-between text-xs text-[#a09789]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="font-mono text-[11px] ml-2 text-white/70">root@lpi-lab:~#</span>
              </div>
              <span className="font-mono text-[10px] text-white/40">tty1</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs text-[#f3f0e6] space-y-3 min-h-[320px] max-h-[460px] overflow-y-auto">
              <div className="text-white/40 text-[11px]">
                {isFr
                  ? '# Environnement de lab LPI initialisé. Tapez votre commande ci-dessous.'
                  : '# LPI Lab Environment Initialized. Type your command below.'}
              </div>

              {/* History output */}
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-[#ffc20e]">
                    <span className="text-[#a5d6a7]">root@lpi-lab:~#</span>
                    <span>{item.command}</span>
                  </div>
                  <pre
                    className={`whitespace-pre-wrap text-[11.5px] pl-3 border-l-2 ${
                      item.isSuccess ? 'border-[#2e7d32] text-[#a5d6a7]' : 'border-[#d32f2f] text-[#ef9a9a]'
                    }`}
                  >
                    {item.output}
                  </pre>
                </div>
              ))}

              {/* Active Step Prompt */}
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-[11.5px] text-[#ffe082]">
                <span className="font-bold text-white">
                  Étape {activeStepIndex + 1}/{scenario.steps.length} :
                </span>{' '}
                {stepInstruction}
              </div>
            </div>

            {/* Terminal Input Form */}
            <form onSubmit={handleExecute} className="p-3 bg-[#201d19] border-t border-[#3b352b] flex items-center gap-2">
              <span className="font-mono text-xs text-[#a5d6a7] shrink-0">#</span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isFr ? 'Tapez votre commande Linux...' : 'Type your Linux command...'}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent font-mono text-xs text-white placeholder-white/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-3 py-1.5 bg-[#785a00] hover:bg-[#a67c00] disabled:opacity-30 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{isFr ? 'Exécuter' : 'Run'}</span>
              </button>
            </form>
          </div>

          {/* Step Actions & Progress Feedback */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 text-xs font-semibold text-[#785a00] hover:bg-[#f8ecdb] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? (isFr ? 'Masquer l\'indice' : 'Hide Hint') : (isFr ? 'Indice de commande' : 'Command Hint')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {result?.isCorrect && activeStepIndex < scenario.steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{isFr ? 'Étape suivante' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {isScenarioFinished && (
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="px-5 py-2 bg-[#785a00] hover:bg-[#5f4700] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer animate-bounce"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isFr ? 'Scénario terminé ! Passer au suivant' : 'Lab Finished! Next Scenario'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Hint Box */}
          {showHint && stepHint && (
            <div className="p-3 bg-[#fff8e1] border border-[#ffe082] rounded-xl text-xs text-[#8d6e63] flex items-start gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-[#ffa000] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#5d4037]">{isFr ? 'Indice de syntaxe : ' : 'Syntax Hint: '}</span>
                <span className="font-mono font-bold text-[#e65100]">{stepHint}</span>
              </div>
            </div>
          )}

          {/* Step Explanation if correct */}
          {result?.isCorrect && (
            <div className="p-3.5 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl text-xs text-[#1b5e20] leading-relaxed">
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                <span>{isFr ? 'Validation réussie :' : 'Step Completed:'}</span>
              </div>
              <div>{stepExplanation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
