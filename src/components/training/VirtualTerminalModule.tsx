import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Folder,
  FileText,
  Shield,
  Layers,
  Send,
  Eye,
  Zap,
  Info,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { simulatedLabScenarios } from '../../services/virtualFs/labScenarios';
import { SimulatedLabScenario, LabScenarioValidation, VfsNode } from '../../services/virtualFs/types';
import { VirtualFs } from '../../services/virtualFs/VirtualFs';
import { ShellInterpreter } from '../../services/virtualFs/ShellInterpreter';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onScoreUpdate?: (points: number) => void;
  initialScenarioId?: string;
}

interface TerminalHistoryItem {
  prompt: string;
  command: string;
  output: string;
  exitCode: number;
}

export const VirtualTerminalModule: React.FC<Props> = ({ onScoreUpdate, initialScenarioId }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  // Selected scenario ('sandbox' means free exploration)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId || simulatedLabScenarios[0]?.id || 'sandbox'
  );

  const activeScenario = useMemo(() => {
    return simulatedLabScenarios.find((s) => s.id === selectedScenarioId) || null;
  }, [selectedScenarioId]);

  // Terminal & VFS instance state
  const interpreterRef = useRef<ShellInterpreter>(new ShellInterpreter());
  const [, setFsTick] = useState(0); // Trigger re-render of FS tree
  const triggerFsUpdate = () => setFsTick((t) => t + 1);

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([]);
  const [validationResult, setValidationResult] = useState<LabScenarioValidation | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());
  const [selectedTreePath, setSelectedTreePath] = useState<string>('/home/student/scripts/backup.sh');
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({
    '/': true,
    '/home': true,
    '/home/student': true,
    '/home/student/scripts': true,
    '/home/student/projects': true,
    '/etc': true,
    '/var': true,
    '/var/log': true,
    '/tmp': true,
  });
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset scenario
  const initScenario = (scenario: SimulatedLabScenario | null) => {
    const fs = new VirtualFs();
    const interp = new ShellInterpreter(fs);

    if (scenario) {
      if (scenario.initialSetup) {
        scenario.initialSetup(fs, interp);
      }
      interp.cwd = scenario.initialDirectory || '/home/student';
      interp.env.PWD = interp.cwd;
    } else {
      interp.cwd = '/home/student';
      interp.env.PWD = '/home/student';
    }

    interpreterRef.current = interp;
    setValidationResult(null);
    setShowHint(false);
    setShowSolution(false);
    setHistoryIndex(-1);

    // Initial welcome banner in terminal
    const welcomeOutput = scenario
      ? `=== LPI LAB SIMULATOR (100% PWA & Offline) ===\n` +
        `Objectif : ${isFr ? scenario.goalFr : scenario.goal}\n` +
        `Répertoire initial : ${interp.cwd}\n` +
        `Astuce : Tapez 'ls -l' ou 'help' pour démarrer.`
      : `=== MODE SANDBOX LIBRE (Linux VirtualFS) ===\n` +
        `Bienvenue dans le moteur de terminal simulé LPI.\n` +
        `Vous disposez d'un système complet (/home/student, /etc, /var/log, /tmp, /root).\n` +
        `Commandes : pwd, ls, cd, mkdir, touch, cp, mv, rm, cat, grep, find, chmod, chown, ps, kill, tar, etc.`;

    setTerminalHistory([
      {
        prompt: 'system@lpi-engine',
        command: 'init-lab',
        output: welcomeOutput,
        exitCode: 0,
      },
    ]);

    triggerFsUpdate();
  };

  useEffect(() => {
    initScenario(activeScenario);
  }, [selectedScenarioId]);

  // Scroll to bottom on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const interp = interpreterRef.current;
    const currentPrompt = interp.getPrompt();

    const result = interp.execute(cmd);

    if (result.cleared) {
      setTerminalHistory([]);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        {
          prompt: currentPrompt,
          command: cmd,
          output: result.output,
          exitCode: result.exitCode,
        },
      ]);
    }

    setInputVal('');
    setHistoryIndex(-1);
    triggerFsUpdate();

    // If an active scenario exists, auto-validate progress
    if (activeScenario) {
      const val = activeScenario.validate(interp.fs, interp);
      setValidationResult(val);
      if (val.isComplete && !completedLabs.has(activeScenario.id)) {
        setCompletedLabs((prev) => new Set([...prev, activeScenario.id]));
        if (onScoreUpdate) {
          onScoreUpdate(val.score);
        }
      }
    }
  };

  const handleManualValidate = () => {
    if (!activeScenario) return;
    const interp = interpreterRef.current;
    const val = activeScenario.validate(interp.fs, interp);
    setValidationResult(val);
    if (val.isComplete && !completedLabs.has(activeScenario.id)) {
      setCompletedLabs((prev) => new Set([...prev, activeScenario.id]));
      if (onScoreUpdate) {
        onScoreUpdate(val.score);
      }
    }
  };

  // Keyboard navigation for history (Up/Down) & Tab autocompletion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hist = interpreterRef.current.history;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hist.length === 0) return;
      const nextIdx = historyIndex === -1 ? hist.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(hist[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= hist.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(hist[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    const interp = interpreterRef.current;
    const currentVal = inputVal;
    const lastWord = currentVal.split(' ').pop() || '';
    if (!lastWord) return;

    // List items in current directory
    const dirItems = interp.fs.listDir(interp.cwd, true, interp.cwd) || [];
    const candidates = dirItems
      .map((it) => it.name)
      .filter((name) => name.startsWith(lastWord) && name !== '.' && name !== '..');

    if (candidates.length === 1) {
      const match = candidates[0];
      const prefix = currentVal.slice(0, currentVal.length - lastWord.length);
      setInputVal(prefix + match);
    }
  };

  const toggleFolder = (path: string) => {
    setTreeExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const handleInsertCommand = (cmd: string) => {
    setInputVal(cmd);
    inputRef.current?.focus();
  };

  // Render file tree recursively
  const renderTreeNode = (node: VfsNode, currentPath: string, depth: number = 0) => {
    const isDir = node.type === 'directory';
    const isExpanded = treeExpanded[currentPath];
    const isSelected = selectedTreePath === currentPath;
    const modeStr = VirtualFs.formatMode(node);

    return (
      <div key={currentPath} className="select-none text-xs">
        <div
          onClick={() => {
            if (isDir) toggleFolder(currentPath);
            setSelectedTreePath(currentPath);
          }}
          className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors ${
            isSelected
              ? 'bg-[#ffc20e]/20 text-[#ffc20e] font-medium'
              : 'hover:bg-white/5 text-[#d3c5ab]'
          }`}
          style={{ paddingLeft: `${Math.max(8, depth * 14)}px` }}
        >
          {isDir ? (
            <Folder className={`w-3.5 h-3.5 shrink-0 ${isExpanded ? 'text-[#ffc20e]' : 'text-[#a89984]'}`} />
          ) : (
            <FileText className="w-3.5 h-3.5 shrink-0 text-[#83a598]" />
          )}

          <span className="truncate flex-1 font-mono text-[11px]">{node.name || '/'}</span>

          <span
            className={`font-mono text-[10px] px-1 py-0.2 rounded border shrink-0 ${
              modeStr.includes('rwx')
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                : 'bg-black/30 text-[#a89984] border-white/5'
            }`}
          >
            {modeStr}
          </span>
        </div>

        {isDir && isExpanded && node.children && (
          <div>
            {Object.keys(node.children)
              .sort()
              .map((childName) => {
                const childNode = node.children![childName];
                const childPath = currentPath === '/' ? `/${childName}` : `${currentPath}/${childName}`;
                return renderTreeNode(childNode, childPath, depth + 1);
              })}
          </div>
        )}
      </div>
    );
  };

  const selectedNode = interpreterRef.current.fs.getNode(selectedTreePath);

  return (
    <div className="space-y-6">
      {/* Top Header / Selector */}
      <div className="bg-[#201b11] border border-[#3d3424] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffc20e]/20 text-[#ffc20e] text-[11px] font-bold tracking-wider uppercase">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>{isFr ? 'Simulateur Terminal 100% PWA' : '100% PWA Terminal Simulator'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-white">
              {activeScenario ? (isFr ? activeScenario.titleFr : activeScenario.title) : isFr ? 'Mode Sandbox Libre' : 'Free Sandbox Mode'}
            </h2>
            <p className="text-xs md:text-sm text-[#d3c5ab]">
              {activeScenario
                ? (isFr ? activeScenario.goalFr : activeScenario.goal)
                : isFr
                ? 'Expérimentez librement avec le système de fichiers virtuel (chmod, chown, grep, find, tar, ps, redirections).'
                : 'Freely experiment with the virtual filesystem (chmod, chown, grep, find, tar, ps, redirections).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="bg-[#17130b] border border-[#3d3424] text-[#f7f4ea] text-xs font-medium rounded-xl px-3 py-2 outline-hidden focus:border-[#ffc20e] cursor-pointer"
            >
              <optgroup label={isFr ? '🎯 Missions de Lab LPIC-1' : '🎯 LPIC-1 Lab Missions'}>
                {simulatedLabScenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {completedLabs.has(s.id) ? '✓ ' : ''}
                    {isFr ? s.titleFr : s.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label={isFr ? '🧪 Mode Libre' : '🧪 Free Sandbox'}>
                <option value="sandbox">
                  {isFr ? 'Mode Sandbox (Exploration libre)' : 'Sandbox Mode (Free exploration)'}
                </option>
              </optgroup>
            </select>

            <button
              onClick={() => initScenario(activeScenario)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#d3c5ab] hover:text-white border border-white/10 text-xs font-medium transition-colors"
              title={isFr ? 'Réinitialiser le lab' : 'Reset lab'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFr ? 'Reset' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Validation Banner if validated */}
        {validationResult && (
          <div
            className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-all ${
              validationResult.isComplete
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-200'
            }`}
          >
            {validationResult.isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs md:text-sm">
              <div className="font-bold mb-0.5">
                {validationResult.isComplete
                  ? isFr
                    ? '🎉 Objectif du Lab validé avec succès ! (+100 pts)'
                    : '🎉 Lab Objective completed successfully! (+100 pts)'
                  : isFr
                  ? 'État du système non validé'
                  : 'System state not validated'}
              </div>
              <p className="opacity-90">{isFr ? validationResult.feedbackFr : validationResult.feedback}</p>
            </div>
            {validationResult.isComplete && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                100% Validé
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Split Layout: Terminal on Left / Lab Guide & VFS Tree on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Terminal Window (7 or 8 columns on desktop) */}
        <div className="lg:col-span-8 bg-[#15120c] border border-[#302718] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
          {/* Terminal Window Bar */}
          <div className="bg-[#201b11] border-b border-[#302718] px-4 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 cursor-pointer" />
              <span className="ml-2 font-mono text-xs text-[#a89984] font-medium truncate">
                {interpreterRef.current.getPrompt()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTerminalHistory([])}
                className="text-[11px] font-mono text-[#a89984] hover:text-[#f7f4ea] px-2 py-0.5 rounded hover:bg-white/5 transition-colors"
                title="Clear screen"
              >
                clear
              </button>
              <div className="text-[10px] px-2 py-0.5 rounded bg-[#ffc20e]/10 text-[#ffc20e] font-mono border border-[#ffc20e]/20">
                Bash 5.2
              </div>
            </div>
          </div>

          {/* Terminal Output Body */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-3 bg-[#120f09] text-[#ebdbb2] selection:bg-[#ffc20e]/30 selection:text-white"
          >
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                {item.command !== 'init-lab' && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-400 font-bold">{item.prompt}</span>
                    <span className="text-white font-semibold">{item.command}</span>
                    {item.exitCode !== 0 && (
                      <span className="text-[10px] px-1 rounded bg-red-950 text-red-400 border border-red-800">
                        exit {item.exitCode}
                      </span>
                    )}
                  </div>
                )}
                {item.output && (
                  <pre className="whitespace-pre-wrap text-[#d5c4a1] text-xs font-mono pl-2 border-l border-white/10">
                    {item.output}
                  </pre>
                )}
              </div>
            ))}

            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Line */}
          <form
            onSubmit={handleExecute}
            className="bg-[#1a150e] border-t border-[#302718] p-3 flex items-center gap-2"
          >
            <span className="font-mono text-xs text-emerald-400 font-bold shrink-0 select-none">
              {interpreterRef.current.getPrompt()}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isFr ? "Tapez une commande (ex: chmod 750 backup.sh, ls -la, help)..." : "Type a command (e.g. chmod 750 backup.sh, ls -la, help)..."}
              className="flex-1 bg-transparent border-none outline-hidden font-mono text-xs text-white placeholder-[#7c6f64] caret-[#ffc20e]"
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-[#ffc20e]/20 hover:bg-[#ffc20e]/30 text-[#ffc20e] transition-colors"
              title="Exécuter"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* RIGHT: Lab Instructions & Filesystem Inspector (4 or 5 columns on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Lab Card */}
          {activeScenario ? (
            <div className="bg-[#201b11] border border-[#3d3424] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ffc20e] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {isFr ? 'Mission Active' : 'Active Mission'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-[#d3c5ab]">
                  ~{activeScenario.estimatedMinutes} min
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white font-serif">
                  {isFr ? activeScenario.titleFr : activeScenario.title}
                </h3>
                <p className="text-xs text-[#d3c5ab] leading-relaxed">
                  {isFr ? activeScenario.goalFr : activeScenario.goal}
                </p>
              </div>

              {/* Instructions List */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold text-[#f7f4ea] uppercase tracking-wider">
                  {isFr ? 'Instructions Pas-à-Pas' : 'Step-by-step Instructions'}
                </div>
                <div className="space-y-1">
                  {(isFr ? activeScenario.instructionsFr : activeScenario.instructions).map((ins, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#d3c5ab]">
                      <span className="w-4 h-4 rounded-full bg-[#ffc20e]/20 text-[#ffc20e] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Validate & Hint */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleManualValidate}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#ffc20e] hover:bg-[#e0a90b] text-[#1c1810] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFr ? 'Vérifier l\'état' : 'Verify State'}</span>
                </button>

                <button
                  onClick={() => setShowHint(!showHint)}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#d3c5ab] hover:text-white border border-white/10 text-xs font-medium transition-colors"
                  title={isFr ? 'Afficher un indice' : 'Show hint'}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Progressive Hint */}
              {showHint && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Indice pédagogique' : 'Pedagogical Hint'}</span>
                  </div>
                  <p>{isFr ? activeScenario.hintsFr[0] : activeScenario.hints[0]}</p>
                </div>
              )}

              {/* Solution Accordion */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-xs text-[#a89984] hover:text-[#ffc20e] flex items-center gap-1 font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showSolution ? (isFr ? 'Masquer la solution' : 'Hide Solution') : (isFr ? 'Voir les commandes de solution' : 'Reveal Solution')}</span>
                </button>

                {showSolution && (
                  <div className="mt-2 p-3 rounded-xl bg-[#17130b] border border-[#3d3424] space-y-2 text-xs">
                    <div className="text-[11px] font-bold text-[#ffc20e]">
                      {isFr ? 'Commandes recommandées :' : 'Recommended Commands:'}
                    </div>
                    <div className="space-y-1">
                      {activeScenario.solutionCommands.map((sc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between font-mono text-[11px] bg-black/40 px-2 py-1 rounded border border-white/5"
                        >
                          <span className="text-emerald-400">{sc}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleInsertCommand(sc)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#d3c5ab]"
                              title={isFr ? 'Insérer dans le terminal' : 'Insert into terminal'}
                            >
                              Insert
                            </button>
                            <button
                              onClick={() => handleCopyCommand(sc)}
                              className="text-[10px] p-0.5 text-[#a89984] hover:text-white"
                            >
                              {copiedCmd === sc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#a89984] leading-relaxed">
                      {isFr ? activeScenario.solutionExplanationFr : activeScenario.solutionExplanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#201b11] border border-[#3d3424] rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffc20e] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {isFr ? 'Bac à Sable Libre' : 'Free Sandbox Mode'}
              </span>
              <p className="text-xs text-[#d3c5ab] leading-relaxed">
                {isFr
                  ? 'Exécutez n\'importe quelle commande sans contrainte de validation. Le filesystem virtuel réagit en direct.'
                  : 'Run any command freely without restrictions. The virtual filesystem reacts live.'}
              </p>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="text-[#a89984] text-[10px] uppercase font-bold tracking-wider">Commandes suggérées :</div>
                <div className="flex flex-wrap gap-1">
                  {['ls -la', 'chmod 750 /home/student/scripts/backup.sh', 'cat /etc/passwd', 'ps aux', 'df -h', 'grep Accepted /var/log/auth.log'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleInsertCommand(c)}
                      className="px-2 py-0.5 rounded bg-[#17130b] hover:bg-white/10 text-emerald-400 border border-[#3d3424] text-[10px]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Virtual Filesystem Explorer */}
          <div className="bg-[#201b11] border border-[#3d3424] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                <Folder className="w-4 h-4 text-[#ffc20e]" />
                <span>{isFr ? 'Explorateur VirtualFS (Temps Réel)' : 'VirtualFS Explorer (Live)'}</span>
              </div>
              <span className="text-[10px] text-[#a89984] font-mono">100% In-Memory</span>
            </div>

            {/* Tree Container */}
            <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5">
              {renderTreeNode(interpreterRef.current.fs.getRoot(), '/', 0)}
            </div>

            {/* Selected File Details Preview */}
            {selectedNode && (
              <div className="p-2.5 rounded-xl bg-[#17130b] border border-[#3d3424] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#ffc20e] font-bold truncate">{selectedTreePath}</span>
                  <span className="text-[#a89984]">{VirtualFs.formatMode(selectedNode)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#a89984]">
                  <span>Propriétaire : <b className="text-[#d3c5ab]">{selectedNode.owner}:{selectedNode.group}</b></span>
                  <span>Taille : <b className="text-[#d3c5ab]">{selectedNode.size} octets</b></span>
                </div>
                {selectedNode.type === 'file' && selectedNode.content !== undefined && (
                  <div className="mt-1">
                    <div className="text-[10px] text-[#a89984] font-bold">Contenu :</div>
                    <pre className="mt-0.5 p-1.5 rounded bg-black/40 text-[10px] font-mono text-[#83a598] max-h-20 overflow-y-auto whitespace-pre-wrap">
                      {selectedNode.content || '(fichier vide)'}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
