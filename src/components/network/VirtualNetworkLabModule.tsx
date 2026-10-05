import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  Server,
  Globe,
  Router,
  Terminal as TerminalIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Play,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Layers,
  Activity,
  ArrowRight,
  HelpCircle,
  Info,
  Maximize2
} from 'lucide-react';
import { ShellInterpreter } from '../../services/virtualFs/ShellInterpreter';
import { VirtualFs } from '../../services/virtualFs/VirtualFs';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onScoreUpdate?: (points: number) => void;
  onNavigateToTab?: (tab: string) => void;
}

interface TerminalHistoryItem {
  prompt: string;
  command: string;
  output: string;
  exitCode: number;
}

export const VirtualNetworkLabModule: React.FC<Props> = ({ onScoreUpdate, onNavigateToTab }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  // Shell interpreter with network simulator
  const interpreterRef = useRef<ShellInterpreter>(new ShellInterpreter(new VirtualFs()));
  const [termHistory, setTermHistory] = useState<TerminalHistoryItem[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedNodeId, setSelectedNodeId] = useState<'web01' | 'db01' | 'router' | 'internet'>('web01');
  const [showTheoryGuide, setShowTheoryGuide] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [lastExecutedCmd, setLastExecutedCmd] = useState<string>('');
  const [isSimulatingPacket, setIsSimulatingPacket] = useState<boolean>(false);
  const [packetFlow, setPacketFlow] = useState<string | null>(null);

  // Live state tracking from network simulator
  const [networkTick, setNetworkTick] = useState(0);
  const refreshNetwork = () => setNetworkTick((t) => t + 1);

  const termEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize environment
  useEffect(() => {
    const interp = interpreterRef.current;
    interp.user = 'root';
    interp.cwd = '/root';
    interp.env.USER = 'root';
    interp.env.HOSTNAME = 'web01';
    interp.networkSimulator.resetToDefaultState();

    // Welcome banner in terminal
    setTermHistory([
      {
        prompt: 'system',
        command: '',
        output: isFr
          ? 'Bienvenue sur le Lab Réseau Virtuel Linux (LPIC-1 109.1 - 109.4)\nTopologie active : web01 (192.168.1.10) ⇄ router (192.168.1.1) ⇄ db01 (192.168.1.20) ⇄ Internet (8.8.8.8)\nQuestion clé : "Pourquoi ping db01 fonctionne mais curl db01:5432 échoue ?"\nDémarrez votre diagnostic avec les commandes : ip addr, ip route, ping db01, curl db01:5432'
          : 'Welcome to the Virtual Linux Network Lab (LPIC-1 109.1 - 109.4)\nActive Topology: web01 (192.168.1.10) ⇄ router (192.168.1.1) ⇄ db01 (192.168.1.20) ⇄ Internet (8.8.8.8)\nKey challenge: "Why does ping db01 work while curl db01:5432 fails?"\nStart your diagnostic: ip addr, ip route, ping db01, curl db01:5432',
        exitCode: 0,
      },
    ]);
  }, [isFr]);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termHistory]);

  const sim = interpreterRef.current.networkSimulator;
  const diag = sim.diagnosticProgress;
  const db01Node = sim.nodes.db01;
  const isPostgresOpen = db01Node?.ports.find((p) => p.port === 5432)?.state === 'open';

  // 5 diagnostic stages calculation
  const isStage1IpOk = diag.ipChecked;
  const isStage2RouteOk = diag.routeChecked;
  const isStage3DnsOk = diag.dnsChecked;
  const isStage4PortClosedObserved = diag.portClosedObserved;
  const isStage5ServiceStarted = isPostgresOpen || diag.serviceStarted;
  const isAllResolved = isStage1IpOk && isStage2RouteOk && isStage3DnsOk && isStage4PortClosedObserved && isStage5ServiceStarted && diag.probeVerified;

  const handleRunCommand = (cmdText: string) => {
    if (!cmdText.trim()) return;
    const interp = interpreterRef.current;
    const trimmed = cmdText.trim();
    setLastExecutedCmd(trimmed);

    // Visual packet pulse animation based on command
    if (trimmed.includes('ping') || trimmed.includes('curl') || trimmed.includes('nc') || trimmed.includes('ssh')) {
      setIsSimulatingPacket(true);
      if (trimmed.includes('db01') || trimmed.includes('192.168.1.20')) {
        setPacketFlow('web01 ─── LAN ───► db01');
      } else if (trimmed.includes('8.8.8.8') || trimmed.includes('google') || trimmed.includes('internet')) {
        setPacketFlow('web01 ─── router ───► Internet');
      } else if (trimmed.includes('192.168.1.1') || trimmed.includes('router')) {
        setPacketFlow('web01 ─── LAN ───► router');
      }
      setTimeout(() => {
        setIsSimulatingPacket(false);
        setPacketFlow(null);
      }, 1400);
    }

    const res = interp.execute(trimmed);
    setTermHistory((prev) => [
      ...prev,
      {
        prompt: `root@web01:~# `,
        command: trimmed,
        output: res.output,
        exitCode: res.exitCode,
      },
    ]);

    refreshNetwork();
    setInputVal('');
    setHistoryIndex(-1);

    if (onScoreUpdate && isAllResolved) {
      onScoreUpdate(50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const userCmds = termHistory.filter((h) => h.command);
      if (userCmds.length === 0) return;
      const nextIdx = historyIndex === -1 ? userCmds.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(userCmds[nextIdx]?.command || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const userCmds = termHistory.filter((h) => h.command);
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= userCmds.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(userCmds[nextIdx]?.command || '');
      }
    }
  };

  const handleCopyAndPaste = (cmd: string) => {
    setInputVal(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
    inputRef.current?.focus();
  };

  const handleResetSimulation = () => {
    interpreterRef.current.networkSimulator.resetToDefaultState();
    setTermHistory((prev) => [
      ...prev,
      {
        prompt: 'system',
        command: 'reset-lab',
        output: isFr
          ? '⚙ Réseau réinitialisé : db01 port 5432 fermé (PostgreSQL arrêté). Prêt pour une nouvelle séance de diagnostic.'
          : '⚙ Network reset: db01 port 5432 closed (PostgreSQL stopped). Ready for fresh investigation.',
        exitCode: 0,
      },
    ]);
    refreshNetwork();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                {isFr ? 'Réseau Virtuel Pédagogique' : 'Virtual Network Lab'}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                LPIC-1 109.1 - 109.4
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
                {isFr ? 'Simulation Temps Réel' : 'Live Simulation'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {isFr
                ? 'Pourquoi ping db01 fonctionne mais curl db01:5432 échoue ?'
                : 'Why does ping db01 work while curl db01:5432 fails?'}
            </h1>
            <p className="text-sm text-stone-600">
              {isFr
                ? 'Expérimentez la démarche systématique en 5 étapes : IP OK → Route OK → DNS OK → Port fermé → Service arrêté.'
                : 'Experience the systematic 5-layer diagnostic pipeline: IP OK → Route OK → DNS OK → Port Closed → Service Stopped.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTheoryGuide(!showTheoryGuide)}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-blue-600" />
              {showTheoryGuide ? (isFr ? 'Masquer la théorie' : 'Hide theory') : (isFr ? 'Comprendre la démarche' : 'View theory guide')}
            </button>
            <button
              onClick={handleResetSimulation}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              title={isFr ? 'Réinitialiser la simulation' : 'Reset simulation'}
            >
              <RotateCcw className="w-4 h-4" />
              {isFr ? 'Réinitialiser' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Collapsible Theory Guide */}
        {showTheoryGuide && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2 animate-fadeIn">
            <div className="font-semibold text-sm text-blue-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {isFr ? 'Le Piège Classique de l\'Administrateur Système' : 'The Classic Sysadmin Pitfall'}
            </div>
            <p>
              {isFr
                ? 'Un administrateur débutant dit souvent : « La base de données tourne puisque ping db01 répond avec 0% de perte ! » C\'est une confusion majeure entre la couche réseau (Couche 3 IP/ICMP) et la couche transport/application (Couches 4 et 7 TCP/RDBMS).'
                : 'A common junior sysadmin error is assuming: "The database is up because ping db01 responds with 0% packet loss!" This confuses Layer 3 (IP/ICMP) reachability with Layer 4/7 (TCP listening daemon).'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2 text-[11px] font-mono">
              <div className="p-2 bg-white/80 rounded border border-blue-200">
                <span className="font-bold text-stone-900">1. IP OK</span>
                <p className="text-stone-600 mt-0.5">Interface eth0 UP avec adresse IP valide (`ip addr`).</p>
              </div>
              <div className="p-2 bg-white/80 rounded border border-blue-200">
                <span className="font-bold text-stone-900">2. Route OK</span>
                <p className="text-stone-600 mt-0.5">Table de routage noyau sait joindre le subnet (`ip route`).</p>
              </div>
              <div className="p-2 bg-white/80 rounded border border-blue-200">
                <span className="font-bold text-stone-900">3. DNS OK</span>
                <p className="text-stone-600 mt-0.5">Nom db01 résolu en 192.168.1.20 & couche 3 ICMP répond (`ping`).</p>
              </div>
              <div className="p-2 bg-white/80 rounded border border-amber-300 bg-amber-50/50">
                <span className="font-bold text-amber-900">4. Port Fermé</span>
                <p className="text-amber-800 mt-0.5">La socket TCP 5432 rejette le handshake (`curl` / `nc` refused).</p>
              </div>
              <div className="p-2 bg-white/80 rounded border border-emerald-300 bg-emerald-50/50">
                <span className="font-bold text-emerald-900">5. Service Arrêté</span>
                <p className="text-emerald-800 mt-0.5">Le démon PostgreSQL est inactif. Relance via `ssh` requise !</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Network Topology Visualizer (ASCII + Interactive Cards) */}
      <div className="bg-[#1c1d22] text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              {isFr ? 'Topologie du Réseau Pédagogique' : 'Educational Virtual Network Topology'}
            </h2>
          </div>
          {isSimulatingPacket && packetFlow && (
            <div className="px-3 py-1 text-xs font-mono rounded bg-blue-900/60 border border-blue-500/50 text-blue-300 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              {packetFlow}
            </div>
          )}
        </div>

        {/* Visual Topology Diagram */}
        <div className="py-6 flex flex-col items-center justify-center">
          {/* Internet Node */}
          <div
            onClick={() => setSelectedNodeId('internet')}
            className={`w-64 p-3 rounded-xl border transition-all cursor-pointer text-center ${
              selectedNodeId === 'internet'
                ? 'bg-blue-950/70 border-blue-400 ring-2 ring-blue-500/20 shadow-lg'
                : 'bg-stone-900/80 border-stone-700 hover:border-stone-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-sky-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>Internet</span>
            </div>
            <div className="text-xs font-mono text-stone-400 mt-0.5">8.8.8.8 / 1.1.1.1</div>
            <div className="text-[11px] text-stone-400">DNS Public & Cloud WAN</div>
          </div>

          {/* Vertical Link Internet <-> Router */}
          <div className="h-6 w-0.5 bg-stone-600 my-1 relative">
            {isSimulatingPacket && packetFlow?.includes('Internet') && (
              <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>

          {/* Router Node */}
          <div
            onClick={() => setSelectedNodeId('router')}
            className={`w-72 p-3.5 rounded-xl border transition-all cursor-pointer text-center relative ${
              selectedNodeId === 'router'
                ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-500/20 shadow-lg'
                : 'bg-stone-900/80 border-stone-700 hover:border-stone-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
              <Router className="w-4 h-4" />
              <span>router (Passerelle NAT)</span>
            </div>
            <div className="text-xs font-mono text-stone-300 mt-0.5">192.168.1.1 / eth0</div>
            <div className="text-[11px] text-stone-400">Default Gateway & DNS Relay (UDP:53)</div>
          </div>

          {/* Vertical Link Router <-> LAN Split */}
          <div className="h-6 w-0.5 bg-stone-600 my-1" />

          {/* Horizontal LAN Bus Bar */}
          <div className="w-[85%] max-w-xl h-0.5 bg-stone-600 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-stone-400 px-2 bg-[#1c1d22]">
              LAN 192.168.1.0/24
            </span>
          </div>

          {/* Two Drops down from LAN Bus */}
          <div className="w-[85%] max-w-xl flex justify-between px-12 sm:px-20">
            <div className="h-6 w-0.5 bg-stone-600" />
            <div className="h-6 w-0.5 bg-stone-600" />
          </div>

          {/* Bottom Host Row: web01 & db01 */}
          <div className="w-[95%] max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* web01 Node */}
            <div
              onClick={() => setSelectedNodeId('web01')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedNodeId === 'web01'
                  ? 'bg-blue-950/50 border-blue-400 ring-2 ring-blue-500/20 shadow-lg'
                  : 'bg-stone-900/80 border-stone-700 hover:border-stone-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  <span>web01</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {isFr ? 'Vous êtes ici (Shell)' : 'You are here (Shell)'}
                </span>
              </div>
              <div className="text-xs font-mono text-stone-300 mt-1">192.168.1.10 / eth0</div>
              <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Services :</span>
                <span className="text-emerald-400 font-mono">nginx (:80) ✓ ssh (:22) ✓</span>
              </div>
            </div>

            {/* db01 Node */}
            <div
              onClick={() => setSelectedNodeId('db01')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedNodeId === 'db01'
                  ? 'bg-purple-950/50 border-purple-400 ring-2 ring-purple-500/20 shadow-lg'
                  : 'bg-stone-900/80 border-stone-700 hover:border-stone-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  <span>db01</span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] rounded border ${
                    isPostgresOpen
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                  }`}
                >
                  {isPostgresOpen ? (isFr ? 'PostgreSQL ACTIF' : 'PostgreSQL ACTIVE') : (isFr ? 'Port 5432 FERMÉ' : 'Port 5432 CLOSED')}
                </span>
              </div>
              <div className="text-xs font-mono text-stone-300 mt-1">192.168.1.20 / eth0</div>
              <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Port 5432 :</span>
                <span className={`font-mono font-bold ${isPostgresOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPostgresOpen ? 'OUVERT (200 OK)' : 'CONN. REFUSED ✗'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Details Bar */}
        <div className="mt-3 p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-300">
              {isFr ? 'Nœud inspecté :' : 'Inspected Node:'}
            </span>
            <span className="font-mono text-blue-400 font-bold uppercase">{selectedNodeId}</span>
            <span className="text-stone-400">
              ({sim.nodes[selectedNodeId]?.ip || '127.0.0.1'} - {sim.nodes[selectedNodeId]?.roleFr})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sim.nodes[selectedNodeId]?.ports.map((p) => (
              <span
                key={p.port}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                  p.state === 'open'
                    ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                    : 'bg-red-950/70 border-red-700 text-red-300'
                }`}
              >
                {p.port}/{p.protocol} ({p.service}) : {p.state}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The 5-Layer Systematic Diagnostic Progress Stepper */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {isFr ? 'Chaîne de Diagnostic en 5 Étapes' : '5-Step Diagnostic Chain'}
            </h2>
            <p className="text-xs text-stone-500">
              {isFr
                ? 'Exécutez les commandes dans le terminal virtuel ci-dessous. Le moteur détecte automatiquement chaque étape validée.'
                : 'Execute commands in the terminal below. The engine automatically detects each validated step.'}
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 self-start sm:self-center">
            {
              [isStage1IpOk, isStage2RouteOk, isStage3DnsOk, isStage4PortClosedObserved, isStage5ServiceStarted].filter(Boolean).length
            }{' '}
            / 5 {isFr ? 'validées' : 'done'}
          </div>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1: IP OK */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isStage1IpOk
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isFr ? 'Étape 1' : 'Step 1'}
              </span>
              {isStage1IpOk ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" />
              )}
            </div>
            <div className="font-bold text-sm text-stone-900">1. IP OK</div>
            <p className="text-[11px] text-stone-600 mt-1">
              {isFr ? 'eth0 active (192.168.1.10/24)' : 'eth0 active (192.168.1.10/24)'}
            </p>
            <button
              onClick={() => handleCopyAndPaste('ip addr show eth0')}
              className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-white border border-stone-300 hover:border-blue-400 text-stone-800 transition-colors w-full text-left truncate"
            >
              $ ip addr
            </button>
          </div>

          {/* Step 2: Route OK */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isStage2RouteOk
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isFr ? 'Étape 2' : 'Step 2'}
              </span>
              {isStage2RouteOk ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" />
              )}
            </div>
            <div className="font-bold text-sm text-stone-900">2. Route OK</div>
            <p className="text-[11px] text-stone-600 mt-1">
              {isFr ? 'Table de routage noyau link 192.168.1.0/24' : 'Kernel routing table direct link'}
            </p>
            <button
              onClick={() => handleCopyAndPaste('ip route show')}
              className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-white border border-stone-300 hover:border-blue-400 text-stone-800 transition-colors w-full text-left truncate"
            >
              $ ip route
            </button>
          </div>

          {/* Step 3: DNS OK */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isStage3DnsOk
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isFr ? 'Étape 3' : 'Step 3'}
              </span>
              {isStage3DnsOk ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" />
              )}
            </div>
            <div className="font-bold text-sm text-stone-900">3. DNS OK</div>
            <p className="text-[11px] text-stone-600 mt-1">
              {isFr ? 'db01 → 192.168.1.20 & ICMP 0% perte' : 'db01 resolved & ICMP 0% loss'}
            </p>
            <button
              onClick={() => handleCopyAndPaste('ping -c 2 db01')}
              className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-white border border-stone-300 hover:border-blue-400 text-stone-800 transition-colors w-full text-left truncate"
            >
              $ ping -c 2 db01
            </button>
          </div>

          {/* Step 4: Port Fermé */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isStage4PortClosedObserved
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isFr ? 'Étape 4' : 'Step 4'}
              </span>
              {isStage4PortClosedObserved ? (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" />
              )}
            </div>
            <div className="font-bold text-sm text-stone-900">4. Port Fermé</div>
            <p className="text-[11px] text-stone-600 mt-1">
              {isFr ? 'curl db01:5432 → Connection refused' : 'curl db01:5432 → Connection refused'}
            </p>
            <button
              onClick={() => handleCopyAndPaste('curl db01:5432')}
              className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-white border border-stone-300 hover:border-blue-400 text-stone-800 transition-colors w-full text-left truncate"
            >
              $ curl db01:5432
            </button>
          </div>

          {/* Step 5: Service Arrêté & Remédié */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isStage5ServiceStarted
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {isFr ? 'Étape 5' : 'Step 5'}
              </span>
              {isStage5ServiceStarted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" />
              )}
            </div>
            <div className="font-bold text-sm text-stone-900">5. Service Démarre</div>
            <p className="text-[11px] text-stone-600 mt-1">
              {isFr ? 'ssh db01 "systemctl start postgresql"' : 'ssh db01 "systemctl start postgresql"'}
            </p>
            <button
              onClick={() => handleCopyAndPaste('ssh db01 "systemctl start postgresql"')}
              className="mt-2 text-[10px] font-mono px-2 py-1 rounded bg-white border border-stone-300 hover:border-blue-400 text-stone-800 transition-colors w-full text-left truncate"
            >
              $ ssh db01 start
            </button>
          </div>
        </div>

        {/* Celebration Banner when All Resolved */}
        {isAllResolved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 animate-fadeIn">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-sm text-emerald-950">
                {isFr ? 'Parfaitement résolu ! Démarche d\'administration Linux validée.' : 'Outage completely solved! Linux sysadmin methodology verified.'}
              </span>
              <p>
                {isFr
                  ? 'Vous avez prouvé la cause racine : le socket TCP 5432 était fermé car le service PostgreSQL était arrêté sur db01, malgré un ping ICMP parfaitement fonctionnel.'
                  : 'You proved the root cause: TCP port 5432 was closed because PostgreSQL was stopped on db01, despite ICMP ping responding 100%.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Virtual Terminal with Quick-Run Chips */}
      <div className="bg-[#121316] rounded-2xl border border-stone-800 overflow-hidden shadow-lg">
        {/* Terminal Header & Quick Chips */}
        <div className="px-4 py-3 bg-[#1a1b20] border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="font-mono text-xs text-stone-300 ml-2 font-semibold">
              root@web01: ~ (Bash Shell)
            </span>
          </div>

          {/* Quick-action command buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-stone-400 text-xs hidden sm:inline mr-1">
              {isFr ? 'Actions rapides :' : 'Quick actions:'}
            </span>
            <button
              onClick={() => handleRunCommand('ip addr show eth0')}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              ip addr
            </button>
            <button
              onClick={() => handleRunCommand('ip route show')}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              ip route
            </button>
            <button
              onClick={() => handleRunCommand('ping -c 2 db01')}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              ping db01
            </button>
            <button
              onClick={() => handleRunCommand('curl db01:5432')}
              className="px-2 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800 transition-colors"
            >
              curl db01:5432
            </button>
            <button
              onClick={() => handleRunCommand('ssh db01 "systemctl status postgresql"')}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              ssh status
            </button>
            <button
              onClick={() => handleRunCommand('ssh db01 "systemctl start postgresql"')}
              className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
            >
              ssh start
            </button>
          </div>
        </div>

        {/* Terminal Screen Output */}
        <div className="p-4 font-mono text-xs text-stone-200 space-y-2 max-h-[380px] overflow-y-auto">
          {termHistory.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              {item.command && (
                <div className="flex items-center gap-1.5 text-stone-400">
                  <span className="text-emerald-400">{item.prompt}</span>
                  <span className="text-stone-100">{item.command}</span>
                </div>
              )}
              {item.output && (
                <pre className="whitespace-pre-wrap text-stone-300 pl-2 leading-relaxed opacity-95">
                  {item.output}
                </pre>
              )}
            </div>
          ))}
          <div ref={termEndRef} />
        </div>

        {/* Terminal Command Input Prompt */}
        <div className="px-4 py-3 bg-[#15161a] border-t border-stone-800 flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-400 shrink-0">root@web01:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isFr
                ? 'Tapez une commande (ip addr, ip route, ping db01, curl db01:5432, ssh db01...)'
                : 'Type a command (ip addr, ip route, ping db01, curl db01:5432, ssh db01...)'
            }
            className="flex-1 bg-transparent text-stone-100 outline-none placeholder:text-stone-600"
            autoFocus
          />
          <button
            onClick={() => handleRunCommand(inputVal)}
            disabled={!inputVal.trim()}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold transition-colors shrink-0"
          >
            {isFr ? 'Exécuter' : 'Run'}
          </button>
        </div>
      </div>
    </div>
  );
};
