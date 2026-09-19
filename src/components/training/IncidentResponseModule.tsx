import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AlertTriangle,
  Clock,
  Terminal,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Play,
  Pause,
  FileText,
  Activity,
  Award,
  ArrowRight,
  HelpCircle,
  Flame,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { IncidentScenario, IncidentDiagnosticCommand } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  scenarios: IncidentScenario[];
  onScoreUpdate?: (points: number) => void;
}

export const IncidentResponseModule: React.FC<Props> = ({ scenarios, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  // Selected incident scenario
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const currentScenario = scenarios[selectedScenarioIndex] || scenarios[0];

  // Active terminal state
  const [selectedCommand, setSelectedCommand] = useState<IncidentDiagnosticCommand | null>(
    currentScenario.diagnosticCommands[0] || null
  );
  const [cliInput, setCliInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<{ command: string; output: string; analysis?: string }[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Progressive hints state (set of revealed hint levels per scenario)
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});

  // RCA Q&A state: record of chosen option IDs per question
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showRcaFeedback, setShowRcaFeedback] = useState<Record<string, boolean>>({});

  // Countdown timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (currentScenario?.timeLimitMinutes || 15) * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Incident resolved tracking
  const [resolvedIncidentIds, setResolvedIncidentIds] = useState<Set<string>>(new Set());

  // Filter scenarios by certification track
  const [certFilter, setCertFilter] = useState<'all' | 'lpic-1' | 'lpic-2' | 'lpic-3'>('all');

  const filteredScenarios = scenarios
    .map((sc, idx) => ({ sc, originalIndex: idx }))
    .filter(({ sc }) => certFilter === 'all' || sc.certification === certFilter);

  // Reset or change scenario
  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    const scenario = scenarios[index];
    setSelectedCommand(scenario.diagnosticCommands[0] || null);
    setCliInput('');
    setCommandHistory([
      {
        command: scenario.diagnosticCommands[0]?.command || 'journalctl -xb',
        output: scenario.diagnosticCommands[0]?.output || '',
        analysis: isFr
          ? scenario.diagnosticCommands[0]?.analysisFr || scenario.diagnosticCommands[0]?.analysis
          : scenario.diagnosticCommands[0]?.analysis
      }
    ]);
    setSecondsRemaining((scenario?.timeLimitMinutes || 15) * 60);
    setIsTimerRunning(true);
  };

  // Synchronize on mount or scenario switch
  useEffect(() => {
    if (currentScenario) {
      setSelectedCommand(currentScenario.diagnosticCommands[0] || null);
      setCommandHistory([
        {
          command: currentScenario.diagnosticCommands[0]?.command || 'journalctl -xb',
          output: currentScenario.diagnosticCommands[0]?.output || '',
          analysis: isFr
            ? currentScenario.diagnosticCommands[0]?.analysisFr || currentScenario.diagnosticCommands[0]?.analysis
            : currentScenario.diagnosticCommands[0]?.analysis
        }
      ]);
      setSecondsRemaining((currentScenario?.timeLimitMinutes || 15) * 60);
      setIsTimerRunning(true);
    }
  }, [currentScenario?.id, isFr]);

  // Timer interval countdown
  useEffect(() => {
    if (!isTimerRunning || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  // Format timer as mm:ss
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check command execution in terminal
  const executeCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim().toLowerCase();
    if (!cleanCmd) return;

    // Find in scenario commands
    const match = currentScenario.diagnosticCommands.find(
      (c) =>
        c.command.toLowerCase() === cleanCmd ||
        c.aliases?.some((a) => a.toLowerCase() === cleanCmd) ||
        cleanCmd.startsWith(c.command.toLowerCase())
    );

    if (match) {
      setSelectedCommand(match);
      setCommandHistory((prev) => [
        ...prev,
        {
          command: match.command,
          output: match.output,
          analysis: isFr ? match.analysisFr || match.analysis : match.analysis
        }
      ]);
    } else {
      setCommandHistory((prev) => [
        ...prev,
        {
          command: cmdStr,
          output: `bash: ${cmdStr}: command executed but returned standard exit code or not directly relevant to this triage phase.\nSuggested diagnostic commands: ${currentScenario.diagnosticCommands.map((c) => c.command).join(', ')}`,
          analysis: isFr
            ? 'Conseil : Utilisez les commandes de diagnostic recommandées ci-dessus pour inspecter le système en profondeur.'
            : 'Hint: Try one of the designated diagnostic commands above to gather evidence.'
        }
      ]);
    }

    setCliInput('');
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Progressive hints unlock handler
  const handleRevealHint = (level: number) => {
    const currentList = revealedHints[currentScenario.id] || [];
    if (!currentList.includes(level)) {
      setRevealedHints({
        ...revealedHints,
        [currentScenario.id]: [...currentList, level]
      });
    }
  };

  // RCA Answer selection
  const handleSelectRCA = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowRcaFeedback((prev) => ({ ...prev, [questionId]: true }));

    // Check if all questions are answered and correct
    const question = currentScenario.rcaQuestions.find((q) => q.id === questionId);
    const chosenOption = question?.options.find((o) => o.id === optionId);

    if (chosenOption?.isCorrect) {
      // Check if all are now correct
      const allCorrect = currentScenario.rcaQuestions.every((q) => {
        const ans = q.id === questionId ? optionId : userAnswers[q.id];
        return q.options.find((o) => o.id === ans)?.isCorrect;
      });

      if (allCorrect && !resolvedIncidentIds.has(currentScenario.id)) {
        const nextSet = new Set(resolvedIncidentIds);
        nextSet.add(currentScenario.id);
        setResolvedIncidentIds(nextSet);
        setIsTimerRunning(false);

        // Calculate score bonus (50 base pts + time bonus - hint penalty)
        const hintsUsed = revealedHints[currentScenario.id]?.length || 0;
        const timeBonus = Math.floor(secondsRemaining / 60) * 2;
        const finalPoints = Math.max(20, 50 + timeBonus - hintsUsed * 5);

        if (onScoreUpdate) {
          onScoreUpdate(finalPoints);
        }
      }
    }
  };

  const isCurrentIncidentResolved = resolvedIncidentIds.has(currentScenario.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Alert Bar */}
      <div className="bg-[#1e1313] border-2 border-[#ba1a1a] rounded-2xl p-5 md:p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#ba1a1a] text-white text-[10px] font-extrabold uppercase tracking-widest rounded">
                  🚨 {isFr ? 'Incident Réponse en Direct' : 'Live Incident Response'}
                </span>
                <span className="px-2 py-0.5 bg-red-950/80 border border-red-700/60 text-red-200 text-[10px] font-bold rounded">
                  {currentScenario.severity}
                </span>
                <span className="text-xs text-red-300/80 font-mono">
                  {currentScenario.certification.toUpperCase()} • Topic {currentScenario.topicNumber} ({currentScenario.objectiveId})
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-bold font-serif text-white mt-1">
                {isFr ? currentScenario.titleFr : currentScenario.title}
              </h2>
              <p className="text-xs md:text-sm text-red-100/80 mt-0.5 max-w-3xl leading-relaxed">
                {isFr ? currentScenario.contextFr : currentScenario.context}
              </p>
            </div>
          </div>

          {/* Countdown Timer Widget */}
          <div className="flex items-center gap-3 bg-black/60 border border-red-800/80 rounded-xl px-4 py-2.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <Clock
                className={`w-5 h-5 ${
                  secondsRemaining < 180 ? 'text-red-500 animate-ping' : 'text-[#ffc20e]'
                }`}
              />
              <div>
                <div className="text-[10px] uppercase font-bold text-red-300/70 tracking-wider">
                  {isFr ? 'Temps restant' : 'Time Remaining'}
                </div>
                <div
                  className={`text-xl font-mono font-bold ${
                    secondsRemaining < 180
                      ? 'text-red-400'
                      : secondsRemaining < 450
                      ? 'text-[#ffc20e]'
                      : 'text-emerald-400'
                  }`}
                >
                  {formatTimer(secondsRemaining)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-red-800/60">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                title={isTimerRunning ? 'Pause' : 'Resume'}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setSecondsRemaining(currentScenario.timeLimitMinutes * 60);
                  setIsTimerRunning(true);
                }}
                title="Reset timer"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scenario Carousel / Quick Switcher */}
        <div className="mt-5 pt-4 border-t border-red-900/60 space-y-3">
          {/* Certification Filter Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-red-300 uppercase mr-1 shrink-0">
                {isFr ? 'Filtrer par niveau :' : 'Filter by track:'}
              </span>
              {[
                { id: 'all', label: isFr ? 'Tous (15)' : 'All (15)' },
                { id: 'lpic-1', label: 'LPIC-1 (8)' },
                { id: 'lpic-2', label: 'LPIC-2 (4)' },
                { id: 'lpic-3', label: 'LPIC-3 (3)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCertFilter(tab.id as any)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    certFilter === tab.id
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'bg-black/50 text-red-200/70 hover:bg-white/10 border border-red-900/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isCurrentIncidentResolved && (
              <div className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isFr ? 'INCIDENT RÉSOLU' : 'INCIDENT RESOLVED'}</span>
              </div>
            )}
          </div>

          {/* Scenario Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {filteredScenarios.map(({ sc, originalIndex }) => {
              const isSelected = originalIndex === selectedScenarioIndex;
              const isResolved = resolvedIncidentIds.has(sc.id);
              const certTag = sc.certification === 'lpic-1' ? 'L1' : sc.certification === 'lpic-2' ? 'L2' : 'L3';
              const certColor =
                sc.certification === 'lpic-1'
                  ? 'bg-blue-900/80 text-blue-200'
                  : sc.certification === 'lpic-2'
                  ? 'bg-purple-900/80 text-purple-200'
                  : 'bg-amber-900/80 text-amber-200';

              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(originalIndex)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ffc20e] text-[#6d5100] font-bold shadow-xs ring-2 ring-amber-400/50'
                      : 'bg-black/40 hover:bg-white/10 text-red-100/80 border border-red-900/40'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${certColor}`}>
                    {certTag}
                  </span>
                  {isResolved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono opacity-60">#{originalIndex + 1}</span>
                  )}
                  <span>{isFr ? sc.titleFr.split(':')[0] : sc.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Observed Symptoms Box (Ticket d'incident) */}
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-[#ba1a1a]">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#201b11]">
            {isFr ? 'Rapport des Symptômes Constatés (Monitoring / Astreinte)' : 'Observed Outage Symptoms'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
          {(isFr ? currentScenario.symptomsFr : currentScenario.symptoms).map((symptom, i) => (
            <div
              key={i}
              className="bg-white border border-[#ba1a1a]/30 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 text-[#ba1a1a] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                •
              </div>
              <span className="text-xs md:text-sm font-semibold text-[#3a3020] leading-snug">
                {symptom}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Diagnostic Console & Terminal Output */}
      <div className="bg-[#0f141c] border-2 border-[#2b3544] rounded-2xl overflow-hidden shadow-lg text-gray-200">
        {/* Terminal Header Bar */}
        <div className="bg-[#18202c] px-4 py-3 border-b border-[#2b3544] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono text-gray-400 font-bold ml-2">
              root@rescue-console:~# (Emergency Mode)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Terminal className="w-3.5 h-3.5 text-[#ffc20e]" />
            <span>{isFr ? 'Console d\'Investigation Linux' : 'Linux Triage Console'}</span>
          </div>
        </div>

        {/* Diagnostic Command Quick Toolbar */}
        <div className="p-3 bg-[#131923] border-b border-[#2b3544] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffc20e] shrink-0 mr-1 flex items-center gap-1">
            <Search className="w-3 h-3" />
            {isFr ? 'Commandes de diagnostic :' : 'Diagnostic commands:'}
          </span>
          {currentScenario.diagnosticCommands.map((cmd) => {
            const isCurrent = selectedCommand?.command === cmd.command;
            return (
              <button
                key={cmd.command}
                onClick={() => executeCommand(cmd.command)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#ffc20e] text-[#423100] shadow-xs ring-1 ring-[#ffc20e]'
                    : 'bg-[#1e2736] hover:bg-[#283548] text-gray-200 border border-[#344256]'
                }`}
              >
                <span>{cmd.command}</span>
                {cmd.isKeyEvidence && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" title="Indice clé" />
                )}
              </button>
            );
          })}
        </div>

        {/* Terminal Screen Body */}
        <div className="p-4 md:p-5 font-mono text-xs md:text-sm overflow-x-auto max-h-[460px] overflow-y-auto space-y-4 select-text">
          {commandHistory.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>root@rescue-console:~#</span>
                <span className="text-white">{item.command}</span>
              </div>
              <pre className="text-gray-300 bg-[#070a0f] p-3 rounded-lg border border-[#1e2736] whitespace-pre-wrap leading-relaxed">
                {item.output}
              </pre>
              {item.analysis && (
                <div className="bg-[#1c2738]/80 border-l-4 border-[#ffc20e] p-2.5 rounded-r-lg text-xs font-sans text-gray-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#ffc20e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#ffc20e] block mb-0.5 uppercase text-[10px] tracking-wider">
                      {isFr ? 'Analyse de l\'Administrateur Système :' : 'Sysadmin Diagnostic Note:'}
                    </strong>
                    <span>{item.analysis}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>

        {/* Terminal Interactive Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(cliInput);
          }}
          className="bg-[#18202c] p-3 border-t border-[#2b3544] flex items-center gap-2"
        >
          <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">
            root@rescue:~#
          </span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder={
              isFr
                ? 'Tapez une commande (ex: journalctl -xb, ss -lntp, mount, df -h, cat /etc/fstab)...'
                : 'Type a command (e.g. journalctl -xb, ss -lntp, mount, df -h, cat /etc/fstab)...'
            }
            className="flex-1 bg-[#0d121a] border border-[#2b3544] rounded-lg px-3 py-1.5 text-xs md:text-sm font-mono text-white focus:outline-none focus:border-[#ffc20e] transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            {isFr ? 'Exécuter' : 'Run'}
          </button>
        </form>
      </div>

      {/* Progressive Hints Section */}
      <div className="bg-white border border-[#d3c5ab] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fff4cc] text-[#785a00] flex items-center justify-center font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-[#201b11]">
                {isFr ? 'Indices Progressifs d\'Investigation' : 'Progressive Diagnostic Clues'}
              </h3>
              <p className="text-xs text-[#817660]">
                {isFr
                  ? 'Débloquez les indices au fur et à mesure si votre raisonnement nécessite une orientation.'
                  : 'Unlock tiered clues if you need targeted guidance during triage.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#817660]">
            {isFr ? '3 niveaux d\'indices' : '3 tiers available'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {currentScenario.progressiveHints.map((hint) => {
            const isRevealed = (revealedHints[currentScenario.id] || []).includes(hint.level);

            return (
              <div
                key={hint.level}
                className={`p-4 rounded-xl border transition-all ${
                  isRevealed
                    ? 'bg-[#fffcf7] border-[#ffc20e] shadow-xs'
                    : 'bg-[#faf8f4] border-[#e0d6c4]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#785a00]">
                    {isFr ? hint.titleFr || hint.title : hint.title}
                  </span>
                  {isRevealed ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      {isFr ? 'Révélé' : 'Unlocked'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#817660] font-semibold">
                      -{hint.penaltyPoints || 2} pts
                    </span>
                  )}
                </div>

                {isRevealed ? (
                  <p className="text-xs md:text-sm text-[#3a3020] leading-relaxed">
                    {isFr ? hint.hintFr || hint.hint : hint.hint}
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#817660] italic">
                      {isFr
                        ? 'Indice masqué pour favoriser votre propre déduction.'
                        : 'Hint locked to encourage independent troubleshooting.'}
                    </p>
                    <button
                      onClick={() => handleRevealHint(hint.level)}
                      className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-[#ffc20e]" />
                      <span>{isFr ? 'Révéler cet indice' : 'Unlock Hint'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Root Cause Analysis (RCA) & Troubleshooting Reasoning Form */}
      <div className="bg-white border-2 border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
        <div className="border-b border-[#d3c5ab] pb-4">
          <div className="flex items-center gap-2 text-[#ba1a1a]">
            <Activity className="w-5 h-5" />
            <h3 className="text-base md:text-lg font-bold text-[#201b11]">
              {isFr ? 'Raisonnement & Plan d\'Action : Root Cause Analysis (RCA)' : 'Triage Reasoning & Root Cause Analysis'}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-[#817660] mt-0.5">
            {isFr
              ? 'Validez vos conclusions de diagnostic pour neutraliser l\'incident et rétablir la production.'
              : 'Validate your diagnostic findings to resolve the incident and restore service.'}
          </p>
        </div>

        <div className="space-y-6">
          {currentScenario.rcaQuestions.map((question, qIdx) => {
            const selectedOptId = userAnswers[question.id];
            const hasAnswered = !!selectedOptId;

            return (
              <div
                key={question.id}
                className="bg-[#fffdfa] border border-[#d3c5ab] rounded-xl p-4 md:p-5 space-y-3 shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#ffc20e] text-[#6d5100] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-[#201b11]">
                      {isFr ? question.titleFr || question.title : question.title}
                    </h4>
                    <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
                      {isFr ? question.questionFr || question.question : question.question}
                    </p>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {question.options.map((option) => {
                    const isSelected = selectedOptId === option.id;
                    const showFeedback = hasAnswered && isSelected;

                    return (
                      <div key={option.id} className="space-y-1.5">
                        <button
                          onClick={() => handleSelectRCA(question.id, option.id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs md:text-sm transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? option.isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium'
                                : 'bg-red-50 border-red-400 text-red-950 font-medium'
                              : 'bg-white border-[#e0d6c4] hover:bg-[#faf7f0] text-[#3a3020]'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? option.isCorrect
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-red-600 bg-red-600 text-white'
                                : 'border-[#b5a790]'
                            }`}
                          >
                            {isSelected && (option.isCorrect ? <Check className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />)}
                          </div>
                          <span className="flex-1 leading-relaxed">
                            {isFr ? option.textFr || option.text : option.text}
                          </span>
                        </button>

                        {showFeedback && (
                          <div
                            className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                              option.isCorrect
                                ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-900'
                                : 'bg-red-100/70 border border-red-300 text-red-900'
                            }`}
                          >
                            {option.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                            )}
                            <span>{isFr ? option.feedbackFr || option.feedback : option.feedback}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post-Mortem & Debriefing Report (Unlocked when incident is solved) */}
      {isCurrentIncidentResolved && (
        <div className="bg-[#f2faf3] border-2 border-emerald-500 rounded-2xl p-5 md:p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between gap-3 flex-wrap border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-emerald-950">
                  {isFr ? 'Rapport Post-Mortem d\'Incident' : 'Incident Post-Mortem Report'}
                </h3>
                <span className="text-xs text-emerald-700 font-semibold">
                  {isFr ? 'Résolution validée • Clôture d\'astreinte' : 'Incident Resolved • Root Cause Verified'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextIndex = (selectedScenarioIndex + 1) % scenarios.length;
                  handleSelectScenario(nextIndex);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isFr ? 'Incident Suivant' : 'Next Incident'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs md:text-sm text-emerald-950">
            <div>
              <h4 className="font-bold text-emerald-900 uppercase text-xs tracking-wider mb-1">
                {isFr ? 'Synthèse de l\'Incident :' : 'Incident Summary:'}
              </h4>
              <p className="leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-200">
                {isFr ? currentScenario.postMortemReport.summaryFr || currentScenario.postMortemReport.summary : currentScenario.postMortemReport.summary}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-emerald-900 uppercase text-xs tracking-wider mb-1">
                {isFr ? 'Chronologie de la Panne (Timeline) :' : 'Failure Timeline:'}
              </h4>
              <ul className="space-y-1.5 bg-white/80 p-3 rounded-xl border border-emerald-200">
                {(isFr
                  ? currentScenario.postMortemReport.timelineFr || currentScenario.postMortemReport.timeline
                  : currentScenario.postMortemReport.timeline
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-mono text-xs">
                    <span className="text-emerald-700 font-bold">⏱</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-emerald-900 uppercase text-xs tracking-wider mb-1">
                {isFr ? 'Bonnes Pratiques d\'Ingénierie Système (LPIC) :' : 'Key Sysadmin Takeaways:'}
              </h4>
              <ul className="space-y-1 bg-white/80 p-3 rounded-xl border border-emerald-200 list-disc list-inside">
                {(isFr
                  ? currentScenario.postMortemReport.sysadminKeyTakeawaysFr ||
                    currentScenario.postMortemReport.sysadminKeyTakeaways
                  : currentScenario.postMortemReport.sysadminKeyTakeaways
                ).map((takeaway, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
