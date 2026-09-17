import React, { useState, useMemo } from 'react';
import {
  Terminal,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  Clock,
  Send,
  Search,
  Check,
  ListFilter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { GuidedLabScenario } from '../../types';
import { validateCommandTolerance, ToleranceValidationResult } from '../../utils/commandTolerance';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  scenarios: GuidedLabScenario[];
  onScoreUpdate?: (points: number) => void;
}

type CertFilter = 'all' | 'lpic-1' | 'lpic-2' | 'lpic-3';

export const GuidedMiniLabsModule: React.FC<Props> = ({ scenarios, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [selectedCert, setSelectedCert] = useState<CertFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(() => scenarios[0]?.id || '');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<ToleranceValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<{ command: string; output: string; isSuccess: boolean }[]>([]);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      const matchCert = selectedCert === 'all' || s.certification === selectedCert;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCert;

      const titleMatch = (s.title + ' ' + (s.titleFr || '')).toLowerCase().includes(q);
      const catMatch = (s.category || '').toLowerCase().includes(q);
      const objMatch = (s.objectiveId || '').toLowerCase().includes(q);
      return matchCert && (titleMatch || catMatch || objMatch);
    });
  }, [scenarios, selectedCert, searchQuery]);

  // Ensure active scenario is valid
  const currentScenario = useMemo(() => {
    const found = scenarios.find((s) => s.id === activeScenarioId);
    if (found) return found;
    return filteredScenarios[0] || scenarios[0];
  }, [scenarios, activeScenarioId, filteredScenarios]);

  const currentIndexInFiltered = useMemo(() => {
    return filteredScenarios.findIndex((s) => s.id === currentScenario?.id);
  }, [filteredScenarios, currentScenario]);

  const step = currentScenario?.steps[activeStepIndex] || currentScenario?.steps[0];

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setActiveStepIndex(0);
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setTerminalHistory([]);
    setIsDropdownOpen(false);
  };

  const handleNextScenario = () => {
    if (filteredScenarios.length === 0) return;
    const nextIdx = (currentIndexInFiltered + 1) % filteredScenarios.length;
    handleSelectScenario(filteredScenarios[nextIdx].id);
  };

  const handlePrevScenario = () => {
    if (filteredScenarios.length === 0) return;
    const prevIdx = (currentIndexInFiltered - 1 + filteredScenarios.length) % filteredScenarios.length;
    handleSelectScenario(filteredScenarios[prevIdx].id);
  };

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || !step) return;

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

      if (currentScenario && activeStepIndex === currentScenario.steps.length - 1) {
        if (!completedScenarios.has(currentScenario.id)) {
          const next = new Set(completedScenarios);
          next.add(currentScenario.id);
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
    if (currentScenario && activeStepIndex < currentScenario.steps.length - 1) {
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

  if (!currentScenario || !step) {
    return <div className="p-8 text-center text-[#817660]">Aucun scénario disponible.</div>;
  }

  const title = isFr && currentScenario.titleFr ? currentScenario.titleFr : currentScenario.title;
  const goal = isFr && currentScenario.goalFr ? currentScenario.goalFr : currentScenario.goal;
  const context = isFr && currentScenario.contextFr ? currentScenario.contextFr : currentScenario.context;

  const stepInstruction = isFr && step.instructionFr ? step.instructionFr : step.instruction;
  const stepHint = isFr && step.hintFr ? step.hintFr : step.hint;
  const stepExplanation = isFr && step.explanationFr ? step.explanationFr : step.explanation;

  const isScenarioFinished = activeStepIndex === currentScenario.steps.length - 1 && result?.isCorrect;

  // Counts per certification
  const lpic1Count = scenarios.filter((s) => s.certification === 'lpic-1').length;
  const lpic2Count = scenarios.filter((s) => s.certification === 'lpic-2').length;
  const lpic3Count = scenarios.filter((s) => s.certification === 'lpic-3').length;

  return (
    <div className="space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11] flex items-center gap-2">
              <span>{isFr ? 'Scénarios Pratiques Guidés (60 Mini-Labs)' : 'Guided Mini-Labs (60 Practical Labs)'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2e7d32]/10 text-[#2e7d32] font-semibold">
                60 Labs
              </span>
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Résolvez des missions d\'administration pas à pas dans un terminal interactif avec tolérance de frappe'
                : 'Solve realistic administration tasks step-by-step in an interactive simulated terminal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs text-[#817660]">
            <Clock className="w-3.5 h-3.5" />
            <span>~{currentScenario.estimatedMinutes} min</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedScenarios.size} / {scenarios.length} {isFr ? 'complétés' : 'completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Certification Filter Tabs & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#d3c5ab] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setSelectedCert('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'all'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-[#faf7f2] hover:bg-[#ebdcc8] text-[#60553e] border border-[#d3c5ab]'
              }`}
            >
              {isFr ? 'Tous les labs' : 'All Labs'} ({scenarios.length})
            </button>

            <button
              type="button"
              onClick={() => { setSelectedCert('lpic-1'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'lpic-1'
                  ? 'bg-[#1565c0] text-white shadow-xs'
                  : 'bg-[#faf7f2] hover:bg-[#e3f2fd] text-[#1565c0] border border-[#bbdefb]'
              }`}
            >
              LPIC-1 ({lpic1Count})
            </button>

            <button
              type="button"
              onClick={() => { setSelectedCert('lpic-2'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'lpic-2'
                  ? 'bg-[#2e7d32] text-white shadow-xs'
                  : 'bg-[#faf7f2] hover:bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]'
              }`}
            >
              LPIC-2 ({lpic2Count})
            </button>

            <button
              type="button"
              onClick={() => { setSelectedCert('lpic-3'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'lpic-3'
                  ? 'bg-[#7b1fa2] text-white shadow-xs'
                  : 'bg-[#faf7f2] hover:bg-[#f3e5f5] text-[#7b1fa2] border border-[#e1bee7]'
              }`}
            >
              LPIC-3 ({lpic3Count})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#817660]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFr ? 'Rechercher un lab...' : 'Search labs...'}
              className="w-full pl-8 pr-3 py-1.5 bg-[#faf7f2] border border-[#d3c5ab] rounded-lg text-xs text-[#201b11] placeholder-[#817660] focus:outline-none focus:border-[#785a00]"
            />
          </div>
        </div>

        {/* Quick Scenario Selector Bar */}
        <div className="pt-2 border-t border-[#ebdcc8] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="relative flex-1 min-w-[260px]">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f3ede2] border border-[#d3c5ab] rounded-lg text-left flex items-center justify-between font-medium text-[#201b11] cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcc8] text-[#785a00] shrink-0">
                  {currentScenario.certification.toUpperCase()} • Obj {currentScenario.objectiveId}
                </span>
                <span className="truncate font-semibold">{title}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#817660] shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown list */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-white border border-[#d3c5ab] rounded-xl shadow-lg z-30 p-1 space-y-1">
                {filteredScenarios.map((s, idx) => {
                  const sTitle = isFr && s.titleFr ? s.titleFr : s.title;
                  const isDone = completedScenarios.has(s.id);
                  const isSelected = s.id === currentScenario.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectScenario(s.id)}
                      className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#785a00] text-white font-bold'
                          : 'hover:bg-[#faf7f2] text-[#201b11]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#ebdcc8] text-[#785a00]'
                        }`}>
                          {idx + 1}. {s.certification.toUpperCase()} {s.objectiveId}
                        </span>
                        <span className="truncate">{sTitle}</span>
                      </div>
                      {isDone && (
                        <Check className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#2e7d32]'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrevScenario}
              className="p-1.5 bg-[#faf7f2] hover:bg-[#ebdcc8] border border-[#d3c5ab] rounded-lg text-[#60553e] cursor-pointer"
              title={isFr ? 'Scénario précédent' : 'Previous scenario'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-[#817660]">
              {currentIndexInFiltered >= 0 ? currentIndexInFiltered + 1 : 1} / {filteredScenarios.length}
            </span>
            <button
              type="button"
              onClick={handleNextScenario}
              className="p-1.5 bg-[#faf7f2] hover:bg-[#ebdcc8] border border-[#d3c5ab] rounded-lg text-[#60553e] cursor-pointer"
              title={isFr ? 'Scénario suivant' : 'Next scenario'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
                {currentScenario.certification.toUpperCase()} • Obj {currentScenario.objectiveId}
              </span>
              <span className="text-xs font-semibold text-[#817660]">{currentScenario.category}</span>
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
                {currentScenario.steps.map((st, idx) => {
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
              className="w-full py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 border border-[#d3c5ab] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
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
                  Étape {activeStepIndex + 1}/{currentScenario.steps.length} :
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
              {result?.isCorrect && activeStepIndex < currentScenario.steps.length - 1 && (
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
