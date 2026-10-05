import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldAlert,
  Terminal as TerminalIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  Search,
  Eye,
  Send,
  Copy,
  Check,
  Activity,
  FileText,
  Network,
  Wrench,
  ChevronRight,
  Info,
  Zap,
  Lock,
  HardDrive
} from 'lucide-react';
import {
  LINUX_MISSIONS,
  LinuxMission,
  getResolvedMissionIds,
  recordMissionCompleted
} from '../../data/linuxMissionsData';
import { ShellInterpreter } from '../../services/virtualFs/ShellInterpreter';
import {
  MissionInvestigationTracker,
  MissionMethodologyReport,
  InvestigationTimelineItem
} from '../../services/virtualFs/missionEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface TerminalHistoryItem {
  prompt: string;
  command: string;
  output: string;
  exitCode: number;
}

interface Props {
  onScoreUpdate?: (points: number) => void;
  initialMissionId?: string;
}

export const LinuxMissionModule: React.FC<Props> = ({ onScoreUpdate, initialMissionId }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  // Selected mission
  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    initialMissionId || LINUX_MISSIONS[0]?.id || 'mission-042'
  );

  const activeMission = useMemo(() => {
    return LINUX_MISSIONS.find((m) => m.id === selectedMissionId) || LINUX_MISSIONS[0];
  }, [selectedMissionId]);

  // Terminal & VirtualFS instance
  const interpreterRef = useRef<ShellInterpreter>(new ShellInterpreter());
  const trackerRef = useRef<MissionInvestigationTracker>(
    new MissionInvestigationTracker(activeMission)
  );

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([]);
  const [editorFile, setEditorFile] = useState<{ path: string; content: string } | null>(null);

  // Real-time methodology report
  const [report, setReport] = useState<MissionMethodologyReport>(() =>
    trackerRef.current.generateReport()
  );

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    activeMission.timeLimitMinutes * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Resolution state
  const [resolvedMissionIds, setResolvedMissionIds] = useState<Set<string>>(
    () => new Set(getResolvedMissionIds())
  );
  const [resolutionStatus, setResolutionStatus] = useState<{
    isResolved: boolean;
    feedbackFr: string;
  } | null>(null);
  const [showPostMortemModal, setShowPostMortemModal] = useState<boolean>(false);
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset mission
  const initMission = (mission: LinuxMission) => {
    const newInterpreter = new ShellInterpreter();
    mission.setupMission(newInterpreter);
    interpreterRef.current = newInterpreter;

    const newTracker = new MissionInvestigationTracker(mission);
    trackerRef.current = newTracker;

    setTerminalHistory([
      {
        prompt: newInterpreter.getPrompt(),
        command: 'dmesg -T | tail -n 2',
        output: `[${new Date().toLocaleTimeString()}] ALERT: ${mission.service} service reported failure.\n[${new Date().toLocaleTimeString()}] Hostname: ${mission.server} | Session: Emergency root shell`,
        exitCode: 0
      }
    ]);
    setInputVal('');
    setHistoryIndex(-1);
    setEditorFile(null);
    setResolutionStatus(null);
    setShowPostMortemModal(false);
    setSecondsRemaining(mission.timeLimitMinutes * 60);
    setIsTimerRunning(true);
    setReport(newTracker.generateReport());
  };

  useEffect(() => {
    initMission(activeMission);
  }, [activeMission]);

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning || secondsRemaining <= 0 || resolutionStatus?.isResolved) return;
    const interval = setInterval(() => {
      setSecondsRemaining((sec) => Math.max(0, sec - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, resolutionStatus]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCommandSubmit = (cmdToRun?: string) => {
    const rawCmd = cmdToRun !== undefined ? cmdToRun : inputVal;
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const interpreter = interpreterRef.current;
    const prompt = interpreter.getPrompt();

    // Execute command in real VirtualFS
    const res = interpreter.execute(trimmed);

    // If editor command like nano
    if (res.openEditor) {
      const content = interpreter.fs.readFile(res.openEditor) || '';
      setEditorFile({ path: res.openEditor, content });
    }

    if (res.cleared) {
      setTerminalHistory([]);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        {
          prompt,
          command: trimmed,
          output: res.output,
          exitCode: res.exitCode
        }
      ]);
    }

    // Observe methodology
    trackerRef.current.observeCommand(trimmed, res.exitCode, res.output);
    const updatedReport = trackerRef.current.generateReport();
    setReport(updatedReport);

    // Check if the service state resolved automatically
    const check = activeMission.checkResolution(interpreter);
    if (check.isResolved && !resolutionStatus?.isResolved) {
      setResolutionStatus({
        isResolved: true,
        feedbackFr: check.feedbackFr
      });
      setIsTimerRunning(false);
      recordMissionCompleted(activeMission.id, updatedReport.finalScore);
      setResolvedMissionIds((prev) => new Set([...prev, activeMission.id]));
      if (onScoreUpdate) onScoreUpdate(100);
      setShowPostMortemModal(true);
    }

    setInputVal('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const history = interpreterRef.current.history;
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    }
  };

  const handleDeclareResolved = () => {
    const check = activeMission.checkResolution(interpreterRef.current);
    const updatedReport = trackerRef.current.generateReport();
    setReport(updatedReport);

    if (check.isResolved) {
      setResolutionStatus({
        isResolved: true,
        feedbackFr: check.feedbackFr
      });
      setIsTimerRunning(false);
      recordMissionCompleted(activeMission.id, updatedReport.finalScore);
      setResolvedMissionIds((prev) => new Set([...prev, activeMission.id]));
      if (onScoreUpdate) onScoreUpdate(100);
      setShowPostMortemModal(true);
    } else {
      setResolutionStatus({
        isResolved: false,
        feedbackFr: check.feedbackFr
      });
    }
  };

  const handleSaveEditorFile = (path: string, newContent: string) => {
    interpreterRef.current.fs.writeFile(path, newContent, false, '/', 'root', 'root');
    setEditorFile(null);
    setTerminalHistory((prev) => [
      ...prev,
      {
        prompt: interpreterRef.current.getPrompt(),
        command: `# Modification enregistrée sur ${path}`,
        output: `Fichier ${path} mis à jour avec succès dans VirtualFS.`,
        exitCode: 0
      }
    ]);
  };

  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [secondsRemaining]);

  const generateAsciiPostMortem = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    return [
      `========================================================================`,
      `  INCIDENT POST-MORTEM REPORT — ${activeMission.incidentNumber}`,
      `========================================================================`,
      `Server Target   : ${activeMission.server}`,
      `Impacted Service: ${activeMission.service}`,
      `Severity        : ${activeMission.severity}`,
      `Date / Status   : ${dateStr} | RESOLVED`,
      `Time Remaining  : ${formattedTime}`,
      `------------------------------------------------------------------------`,
      `METHODOLOGY SCORE : ${report.finalScore} / 100 (${report.ratingTitleFr})`,
      `Diagnostic Steps  : ${report.completedStepsCount} / ${report.totalSteps} validated`,
      `------------------------------------------------------------------------`,
      `ROOT CAUSE SUMMARY:`,
      activeMission.rootCauseSummaryFr,
      ``,
      `REMEDIATION SUMMARY:`,
      activeMission.remediationSummaryFr,
      ``,
      `INVESTIGATION TIMELINE AUDIT:`,
      ...report.timeline.map((t, idx) => `  [${t.timestamp}] #${idx + 1} $ ${t.command} -> ${t.pedagogicalNoteFr}`),
      ``,
      `DEBRIEFING OBSERVATIONS:`,
      ...report.debriefingFr.map((d) => `  * ${d}`),
      `========================================================================`
    ].join('\n');
  };

  const handleCopyPostMortem = async () => {
    try {
      await navigator.clipboard.writeText(generateAsciiPostMortem());
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner & Mission Switcher */}
      <div className="bg-gradient-to-r from-[#1c1811] via-[#262017] to-[#1a160f] text-[#f7f4ea] rounded-2xl p-6 shadow-sm border border-[#3d3424] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-900/60 text-red-200 border border-red-700/60 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isFr ? 'MODE MISSION' : 'MISSION MODE'}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ffc20e]/20 text-[#ffc20e]">
              VirtualFS Real Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/50">
              {resolvedMissionIds.size} / {LINUX_MISSIONS.length} {isFr ? 'résolus' : 'resolved'}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black font-serif text-white tracking-tight flex items-center gap-2">
            <span>{activeMission.incidentNumber}</span>
            <span className="text-stone-400 font-normal">—</span>
            <span className="text-[#ffc20e]">{activeMission.server}</span>
          </h2>
          <p className="text-xs md:text-sm text-[#d3c5ab] mt-1">
            {isFr
              ? 'Un serveur de production ne répond plus. Prenez le shell root, observez l\'environnement, identifiez puis corrigez la panne.'
              : 'A production server is unresponsive. Take root control, investigate the issue, fix the root cause, and verify.'}
          </p>
        </div>

        {/* Countdown & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-black/40 border border-[#3d3424] px-4 py-2 rounded-xl flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">
                {isFr ? 'Temps d\'intervention' : 'Time Remaining'}
              </span>
              <span className="text-lg font-mono font-black text-amber-300">
                {formattedTime}
              </span>
            </div>
          </div>

          <button
            onClick={() => initMission(activeMission)}
            className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white transition-colors cursor-pointer"
            title={isFr ? 'Réinitialiser la mission' : 'Reset mission'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Mission Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {LINUX_MISSIONS.map((m) => {
          const isSelected = m.id === selectedMissionId;
          const isResolved = resolvedMissionIds.has(m.id);

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMissionId(m.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#201b11] text-[#ffc20e] border-[#ffc20e] shadow-sm'
                  : 'bg-white text-[#4f4632] border-[#d3c5ab] hover:bg-[#faf5ee]'
              }`}
            >
              <span>{m.incidentNumber}</span>
              <span className="text-stone-400 font-normal">({m.server})</span>
              {isResolved && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. The Incident Brief Card & Information Pillars */}
      <div className="bg-[#ffffff] border-2 border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-xs font-bold">
              {activeMission.severity}
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold">
              Service: {activeMission.service}
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-xs font-bold">
              Serveur: {activeMission.server}
            </span>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-black text-[#201b11]">
              {activeMission.titleFr}
            </h3>
            <p className="text-sm font-semibold text-red-700 mt-1">
              Symptôme : {activeMission.symptomFr}
            </p>
          </div>

          <div className="p-3 bg-[#faf5ee] border border-[#ebdcc4] rounded-xl text-xs text-[#5c4e36] space-y-1">
            <span className="font-extrabold text-[#201b11] block">
              {isFr ? 'Objectif d\'intervention :' : 'Mission Goal:'}
            </span>
            <p>{activeMission.objectiveFr}</p>
          </div>
        </div>

        {/* Available Info Checklist Pillars */}
        <div className="bg-[#fcf8f2] border border-[#ebdcc4] rounded-xl p-4 md:w-80 flex flex-col justify-between gap-3 text-xs">
          <div>
            <span className="font-black uppercase tracking-wider text-[#6e634e] text-[11px] block mb-2">
              {isFr ? 'Informations & Outils Disponibles :' : 'Available Diagnostic Tools:'}
            </span>
            <ul className="space-y-1.5 text-[#3b3323]">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{activeMission.availableInfo.terminalFr}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{activeMission.availableInfo.logsFr}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{activeMission.availableInfo.networkFr}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{activeMission.availableInfo.servicesFr}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{activeMission.availableInfo.filesystemFr}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDeclareResolved}
            className="w-full py-2 bg-[#28A745] hover:bg-[#218838] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isFr ? 'Déclarer l\'incident résolu' : 'Declare Incident Resolved'}</span>
          </button>
        </div>
      </div>

      {/* Resolution status alert if checked */}
      {resolutionStatus && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            resolutionStatus.isResolved
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          {resolutionStatus.isResolved ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-1">
            <span className="font-extrabold text-sm block">
              {resolutionStatus.isResolved
                ? isFr ? 'Incident Validé avec Succès !' : 'Incident Resolved!'
                : isFr ? 'Panne encore active' : 'Outage still present'}
            </span>
            <p>{resolutionStatus.feedbackFr}</p>
          </div>
          {resolutionStatus.isResolved && (
            <button
              onClick={() => setShowPostMortemModal(true)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
            >
              {isFr ? 'Voir Post-Mortem' : 'View Post-Mortem'}
            </button>
          )}
        </div>
      )}

      {/* 4. Live Methodology Tracker Bar (Démarche Observée en Direct) */}
      <div className="bg-[#faf5ee] border border-[#d3c5ab] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#201b11]">
              {isFr ? 'Démarche d\'Investigation Observée :' : 'Observed Investigation Methodology:'}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider"
              style={{
                backgroundColor: `${report.ratingBadgeColor}15`,
                color: report.ratingBadgeColor
              }}
            >
              {report.ratingTitleFr}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#5c4e36]">
            {activeMission.diagnosticSteps.map((step) => {
              const isDone = report.completedStepIds.includes(step.id);
              return (
                <span
                  key={step.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    isDone
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-white border-stone-200 text-stone-400'
                  }`}
                >
                  {isDone ? '✓' : '○'} {step.categoryLabelFr}
                </span>
              );
            })}
          </div>
        </div>

        {/* Methodology Score Gauge */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#ebdcc4] shrink-0 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              {isFr ? 'Score Méthode' : 'Methodology Score'}
            </span>
            <span
              className="text-lg font-black font-mono"
              style={{ color: report.ratingBadgeColor }}
            >
              {report.finalScore} / 100
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-full border-3 flex items-center justify-center font-bold text-xs"
            style={{
              borderColor: `${report.ratingBadgeColor}30`,
              borderTopColor: report.ratingBadgeColor,
              color: report.ratingBadgeColor
            }}
          >
            {report.finalScore}%
          </div>
        </div>
      </div>

      {/* 5. The Authentic Linux Terminal & Interactive Shell */}
      <div className="bg-[#1c1b18] text-[#e0dfd5] rounded-xl border-2 border-[#3b3a36] shadow-xl overflow-hidden font-mono text-xs flex flex-col min-h-[460px]">
        {/* Terminal Title Bar */}
        <div className="bg-[#2a2926] px-4 py-2.5 border-b border-[#3b3a36] flex items-center justify-between text-stone-300 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <span className="text-stone-400 font-bold ml-2">
              root@{activeMission.server}:~
            </span>
            <span className="px-1.5 py-0.2 rounded bg-red-900/50 text-red-300 text-[10px] font-bold">
              SSH PROD
            </span>
          </div>

          <div className="text-[11px] text-stone-400 flex items-center gap-3">
            <span>bash 5.2</span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Quick Command Suggestions Pills */}
        <div className="bg-[#242320] px-4 py-2 border-b border-[#3b3a36] flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-stone-400 font-sans text-[10px] uppercase font-bold mr-1">
            {isFr ? 'Commandes recommandées :' : 'Suggested commands:'}
          </span>
          {[
            `systemctl status ${activeMission.service}`,
            `journalctl -u ${activeMission.service}`,
            'ss -lntp',
            'ip addr',
            'ip route',
            'nginx -t',
            'curl -I http://localhost',
            'ps aux'
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommandSubmit(cmd)}
              className="px-2 py-0.5 rounded bg-[#31302c] hover:bg-[#42413c] text-[#ffc20e] text-[11px] transition-colors cursor-pointer border border-[#484640]"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Screen / Output Body */}
        <div
          className="p-4 flex-1 overflow-y-auto space-y-3 font-mono leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {terminalHistory.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-stone-400">
                <span className="text-emerald-400 font-bold">{item.prompt}</span>
                <span className="text-white font-bold">{item.command}</span>
              </div>
              {item.output && (
                <pre className="whitespace-pre-wrap text-stone-300 text-[11px] pl-2 border-l border-stone-700 overflow-x-auto">
                  {item.output}
                </pre>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-[#22211e] p-3 border-t border-[#3b3a36] flex items-center gap-2">
          <span className="text-emerald-400 font-bold shrink-0">
            {interpreterRef.current.getPrompt()}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isFr ? 'Tapez une commande (systemctl, journalctl, ss, ip, curl...)' : 'Type command...'}
            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
            autoFocus
          />
          <button
            onClick={() => handleCommandSubmit()}
            className="p-1.5 rounded-lg bg-[#ffc20e] text-[#6d5100] font-bold text-xs hover:bg-[#f9bd00] transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6. Built-in Editor Modal if nano/vim was triggered */}
      {editorFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#1c1b18] border-2 border-[#ffc20e] rounded-2xl max-w-2xl w-full p-5 shadow-2xl flex flex-col gap-4 text-xs font-mono text-white">
            <div className="flex items-center justify-between pb-2 border-b border-stone-700">
              <span className="text-[#ffc20e] font-bold">
                GNU nano 7.2 — {editorFile.path}
              </span>
              <button
                onClick={() => setEditorFile(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <textarea
              defaultValue={editorFile.content}
              id="nano-content-area"
              rows={14}
              className="w-full bg-[#121110] border border-stone-700 rounded-lg p-3 text-stone-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#ffc20e]"
            />

            <div className="flex items-center justify-between pt-2 border-t border-stone-700">
              <span className="text-stone-400 text-[11px]">
                ^O WriteOut (Enregistrer) | ^X Exit (Fermer)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditorFile(null)}
                  className="px-3 py-1.5 rounded bg-stone-700 hover:bg-stone-600 text-stone-300 text-xs cursor-pointer font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('nano-content-area') as HTMLTextAreaElement;
                    if (el) handleSaveEditorFile(editorFile.path, el.value);
                  }}
                  className="px-4 py-1.5 rounded bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold cursor-pointer"
                >
                  Enregistrer & Quitter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Post-Mortem Incident Report Modal */}
      {showPostMortemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#ffffff] border-2 border-[#d3c5ab] rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#ebdcc4]">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  RAPPORT D'INCIDENT OFFICIEL
                </span>
                <h3 className="text-xl font-black text-[#201b11] mt-1">
                  Post-Mortem : {activeMission.incidentNumber}
                </h3>
                <p className="text-xs text-[#6e634e]">
                  Serveur {activeMission.server} — Rétablissement du service {activeMission.service}
                </p>
              </div>
              <button
                onClick={() => setShowPostMortemModal(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Score & Rating Banner */}
            <div className="p-4 rounded-xl bg-[#faf5ee] border border-[#d3c5ab] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#6e634e] block">
                  Qualité de la démarche sysadmin :
                </span>
                <span className="text-base font-black text-[#201b11]">
                  {report.ratingTitleFr}
                </span>
              </div>
              <span
                className="text-2xl font-black font-mono"
                style={{ color: report.ratingBadgeColor }}
              >
                {report.finalScore} / 100
              </span>
            </div>

            {/* Debriefing Points */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e] block">
                Points clés observés :
              </span>
              <ul className="space-y-1.5 text-xs text-[#3b3323]">
                {report.debriefingFr.map((d, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* ASCII Report Preview */}
            <div className="bg-[#1c1b18] text-[#38ef7d] font-mono p-4 rounded-xl border border-[#3b3a36] text-[11px] space-y-2">
              <div className="flex items-center justify-between text-[#cbd5e0] border-b border-[#3b3a36] pb-1.5">
                <span>TERMINAL ASCII REPORT</span>
                <button
                  onClick={handleCopyPostMortem}
                  className="text-xs hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAscii ? 'COPIÉ !' : 'COPIER RAPPORT'}</span>
                </button>
              </div>
              <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                {generateAsciiPostMortem()}
              </pre>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#ebdcc4]">
              <span className="text-xs text-stone-500">
                Temps restant : {formattedTime}
              </span>
              <button
                onClick={() => setShowPostMortemModal(false)}
                className="px-4 py-2 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
