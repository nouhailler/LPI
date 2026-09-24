import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  HardDrive,
  Network,
  Cpu,
  FileCode2,
  FolderTree,
  ChevronRight,
  Eye,
  Award,
  Layers,
  ArrowRight,
  X,
  BookOpen,
  Info,
  Terminal,
  Check
} from 'lucide-react';
import { simulatedLabScenarios } from '../../services/virtualFs/labScenarios';
import { SimulatedLabScenario } from '../../services/virtualFs/types';
import {
  getCompletedLabIds,
  markLabCompleted,
  unmarkLabCompleted,
  resetAllLabCompletions,
  LAB_COMPLETION_EVENT
} from '../../services/virtualFs/labProgress';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onSelectScenario: (scenarioId: string) => void;
  className?: string;
}

type ViewMode = 'roadmap' | 'domains';
type FilterStatus = 'all' | 'completed' | 'pending';
type CategoryFilter = 'all' | 'permissions' | 'files' | 'processes' | 'security' | 'network' | 'storage';

interface StageGroup {
  id: string;
  stageNumber: number;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  scenarioIds: string[];
}

const STAGES: StageGroup[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Core Essentials & File Permissions',
    titleFr: 'Niveau 1 : Fondamentaux & Permissions Fichiers',
    description: 'Master file rights, redirection streams, and symbolic links.',
    descriptionFr: 'Maîtriser les droits d\'accès, flux de redirection et liens symboliques.',
    scenarioIds: ['lab-chmod-backup', 'lab-grep-auth', 'lab-symlink-creation'],
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Systems Administration & Backups',
    titleFr: 'Niveau 2 : Administration Système & Sauvegardes',
    description: 'Recursive ownership, tar gzip archives, and directory cleanup.',
    descriptionFr: 'Propriété récursive, archives tar compressées et nettoyage.',
    scenarioIds: ['lab-chown-ownership', 'lab-tar-archive', 'lab-find-and-clean'],
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Processes, Services & Text Processing',
    titleFr: 'Niveau 3 : Processus, Services & Pipelines Textuels',
    description: 'Signal handling, systemd service management, and pipe manipulation.',
    descriptionFr: 'Gestion des signaux, supervision systemd et traitement de flux.',
    scenarioIds: ['lab-kill-process', 'lab-systemd-service', 'lab-text-filter-pipeline', 'lab-text-filter-sed-awk'],
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: Security Hardening, Networking & Storage',
    titleFr: 'Niveau 4 : Durcissement, Réseau & Disques',
    description: 'Protect sensitive files, test network routes, and mount storage devices.',
    descriptionFr: 'Sécuriser /etc/shadow, diagnostiquer le réseau et monter des disques.',
    scenarioIds: ['lab-security-shadow', 'lab-network-ping-diag', 'lab-storage-mount-disk', 'lab-fstab-mount-umount'],
  },
];

export const LinuxLabVisualMap: React.FC<Props> = ({ onSelectScenario, className = '' }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [completedIds, setCompletedIds] = useState<string[]>(() => getCompletedLabIds());
  const [viewMode, setViewMode] = useState<ViewMode>('roadmap');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenarioForModal, setSelectedScenarioForModal] = useState<SimulatedLabScenario | null>(null);

  // Sync completion states with storage events
  useEffect(() => {
    const handleStorageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ allCompleted: string[] }>;
      if (customEvent.detail?.allCompleted) {
        setCompletedIds(customEvent.detail.allCompleted);
      } else {
        setCompletedIds(getCompletedLabIds());
      }
    };

    window.addEventListener(LAB_COMPLETION_EVENT, handleStorageUpdate);
    return () => {
      window.removeEventListener(LAB_COMPLETION_EVENT, handleStorageUpdate);
    };
  }, []);

  const totalLabs = simulatedLabScenarios.length;
  const completedCount = completedIds.length;
  const progressPct = totalLabs > 0 ? Math.round((completedCount / totalLabs) * 100) : 0;
  const totalPointsEarned = completedCount * 100;
  const totalMaxPoints = totalLabs * 100;

  // Identify next recommended lab (first pending lab in sequential list)
  const nextRecommendedId = useMemo(() => {
    const pending = simulatedLabScenarios.find((s) => !completedIds.includes(s.id));
    return pending ? pending.id : null;
  }, [completedIds]);

  // Filtering
  const filteredScenarios = useMemo(() => {
    return simulatedLabScenarios.filter((scenario) => {
      const isCompleted = completedIds.includes(scenario.id);

      // Status filter
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'pending' && isCompleted) return false;

      // Category filter
      if (categoryFilter !== 'all' && scenario.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${scenario.title} ${scenario.titleFr} ${scenario.goal} ${scenario.goalFr} ${scenario.category} ${scenario.solutionCommands.join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [completedIds, statusFilter, categoryFilter, searchQuery]);

  const handleToggleCompleted = (scenarioId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedIds.includes(scenarioId)) {
      unmarkLabCompleted(scenarioId);
    } else {
      markLabCompleted(scenarioId);
    }
  };

  const handleResetAll = () => {
    if (window.confirm(isFr ? 'Réinitialiser la progression de tous les labs ?' : 'Reset progress for all practical labs?')) {
      resetAllLabCompletions();
    }
  };

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'permissions':
        return {
          label: isFr ? 'Permissions & Droits' : 'Permissions & Ownership',
          icon: ShieldCheck,
          color: 'text-amber-800 bg-amber-100/70 border-amber-300',
        };
      case 'files':
        return {
          label: isFr ? 'Fichiers & Flux' : 'Files & Streams',
          icon: FolderTree,
          color: 'text-blue-800 bg-blue-100/70 border-blue-300',
        };
      case 'processes':
        return {
          label: isFr ? 'Processus & Services' : 'Processes & Services',
          icon: Cpu,
          color: 'text-purple-800 bg-purple-100/70 border-purple-300',
        };
      case 'security':
        return {
          label: isFr ? 'Sécurité Système' : 'System Security',
          icon: ShieldCheck,
          color: 'text-red-800 bg-red-100/70 border-red-300',
        };
      case 'network':
        return {
          label: isFr ? 'Réseau & Diagnostic' : 'Network & Routing',
          icon: Network,
          color: 'text-teal-800 bg-teal-100/70 border-teal-300',
        };
      case 'storage':
        return {
          label: isFr ? 'Stockage & Montages' : 'Storage & Mounts',
          icon: HardDrive,
          color: 'text-orange-800 bg-orange-100/70 border-orange-300',
        };
      default:
        return {
          label: cat,
          icon: FileCode2,
          color: 'text-zinc-800 bg-zinc-100 border-zinc-300',
        };
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Visual Map Overview & Progress Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#ebdcc8]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f8ecdb] text-[#785a00] text-xs font-bold uppercase tracking-wider border border-[#ebdcc8]">
                <Layers className="w-3.5 h-3.5" />
                <span>{isFr ? 'Carte Visuelle des Labs Linux' : 'Linux Practical Labs Visual Map'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#817660] bg-[#fdfbf7] px-2 py-0.5 rounded border border-[#e4d7c5]">
                {totalLabs} {isFr ? 'scénarios interactifs' : 'interactive scenarios'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#201b11]">
              {isFr
                ? 'Progression & Arborescence des Compétences Linux'
                : 'Linux Practical Skills Tree & Lab Progression'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4f4632] leading-relaxed">
              {isFr
                ? 'Suivez vos ateliers pratiques terminés en temps réel. Chaque atelier s\'exécute dans le terminal simulé (VirtualFS) avec validation automatique des critères LPIC-1.'
                : 'Track your completed hands-on lab missions in real time. Each lab runs in the simulated offline Linux engine with full LPIC-1 criteria validation.'}
            </p>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-[#fffcf7] p-3.5 rounded-xl border border-[#ebdcc8]">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs gap-3">
                <span className="font-semibold text-[#4f4632]">
                  {isFr ? 'Validation des Labs' : 'Lab Completion'}
                </span>
                <span className="font-bold text-[#785a00]">
                  {completedCount} / {totalLabs} ({progressPct}%)
                </span>
              </div>
              <div className="w-44 sm:w-52 h-2.5 bg-[#ebdcc8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#817660]">
                <span>{totalPointsEarned} / {totalMaxPoints} pts</span>
                {completedCount === totalLabs && (
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> {isFr ? 'Maîtrise 100%' : '100% Mastered'}
                  </span>
                )}
              </div>
            </div>

            {nextRecommendedId && (
              <button
                onClick={() => onSelectScenario(nextRecommendedId)}
                className="px-3.5 py-2 rounded-lg bg-[#ffc20e] hover:bg-[#e5ad0c] text-[#4f3c00] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFr ? 'Continuer le prochain' : 'Continue Next'}</span>
              </button>
            )}
          </div>
        </div>

        {/* View Toggle, Filters and Search */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* View mode toggle */}
          <div className="flex items-center gap-1.5 bg-[#f8ecdb]/60 p-1 rounded-xl border border-[#ebdcc8] self-start">
            <button
              onClick={() => setViewMode('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'roadmap'
                  ? 'bg-white text-[#785a00] shadow-xs border border-[#ebdcc8]'
                  : 'text-[#817660] hover:text-[#201b11]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? 'Parcours Connecté' : 'Connected Roadmap'}</span>
            </button>
            <button
              onClick={() => setViewMode('domains')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'domains'
                  ? 'bg-white text-[#785a00] shadow-xs border border-[#ebdcc8]'
                  : 'text-[#817660] hover:text-[#201b11]'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>{isFr ? 'Piliers & Domaines' : 'Domain Matrix'}</span>
            </button>
          </div>

          {/* Status & Search Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pills */}
            <div className="flex items-center bg-[#fdfbf7] p-1 rounded-lg border border-[#ebdcc8] text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#785a00] text-white font-bold'
                    : 'text-[#817660] hover:text-[#201b11]'
                }`}
              >
                {isFr ? 'Tous' : 'All'} ({totalLabs})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-[#817660] hover:text-[#201b11]'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>{isFr ? 'Validés' : 'Completed'} ({completedCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-[#817660] hover:text-[#201b11]'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{isFr ? 'En attente' : 'Pending'} ({totalLabs - completedCount})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-52">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#817660]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFr ? 'Filtrer (ex: chmod, mount, ping)...' : 'Filter (e.g. chmod, mount)...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#fdfbf7] border border-[#ebdcc8] rounded-lg text-[#201b11] placeholder-[#817660] focus:outline-hidden focus:border-[#785a00] focus:ring-1 focus:ring-[#785a00]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#817660] hover:text-[#201b11]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Reset progress */}
            {completedCount > 0 && (
              <button
                onClick={handleResetAll}
                title={isFr ? 'Réinitialiser la progression' : 'Reset progress'}
                className="p-1.5 text-[#817660] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: ROADMAP / SKILL TREE VIEW */}
      {viewMode === 'roadmap' && (
        <div className="space-y-8">
          {STAGES.map((stage) => {
            const stageScenarios = simulatedLabScenarios.filter((s) => stage.scenarioIds.includes(s.id));
            const filteredInStage = stageScenarios.filter((s) => filteredScenarios.some((fs) => fs.id === s.id));

            if (filteredInStage.length === 0) return null;

            const stageCompletedCount = stageScenarios.filter((s) => completedIds.includes(s.id)).length;
            const isStageFullyCompleted = stageCompletedCount === stageScenarios.length;

            return (
              <div key={stage.id} className="relative">
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-sm border shadow-2xs ${
                        isStageFullyCompleted
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-[#201b11] text-[#ffc20e] border-[#3d3424]'
                      }`}
                    >
                      {isStageFullyCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : `0${stage.stageNumber}`}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#201b11] flex items-center gap-2">
                        <span>{isFr ? stage.titleFr : stage.title}</span>
                        {isStageFullyCompleted && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {isFr ? 'Étape validée' : 'Stage completed'}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#817660]">
                        {isFr ? stage.descriptionFr : stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-[#817660] bg-[#f8ecdb] px-2.5 py-1 rounded-md border border-[#ebdcc8]">
                    {stageCompletedCount} / {stageScenarios.length}
                  </div>
                </div>

                {/* Connected Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
                  {stageScenarios.map((scenario, index) => {
                    const isVisible = filteredInStage.some((s) => s.id === scenario.id);
                    const isCompleted = completedIds.includes(scenario.id);
                    const isNext = scenario.id === nextRecommendedId;
                    const catMeta = getCategoryMeta(scenario.category);
                    const CatIcon = catMeta.icon;

                    if (!isVisible) return null;

                    return (
                      <div
                        key={scenario.id}
                        className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                          isCompleted
                            ? 'bg-linear-to-b from-emerald-50/90 to-white border-emerald-300 hover:border-emerald-400 shadow-2xs hover:shadow-sm'
                            : isNext
                            ? 'bg-linear-to-b from-amber-50/90 to-white border-[#ffc20e] ring-2 ring-[#ffc20e]/40 shadow-xs hover:border-[#e5ad0c]'
                            : 'bg-white border-[#d3c5ab] hover:border-[#b5a790] hover:bg-[#fffcf7] shadow-2xs'
                        }`}
                        onClick={() => setSelectedScenarioForModal(scenario)}
                      >
                        {/* Top Node Indicator & Tags */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {/* Node Number */}
                              <span
                                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : isNext
                                    ? 'bg-[#ffc20e]/30 text-[#6d5100] border-[#ffc20e]'
                                    : 'bg-[#f8ecdb] text-[#817660] border-[#ebdcc8]'
                                }`}
                              >
                                #{String(simulatedLabScenarios.findIndex((s) => s.id === scenario.id) + 1).padStart(2, '0')}
                              </span>

                              {/* Category Badge */}
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${catMeta.color}`}>
                                <CatIcon className="w-3 h-3" />
                                <span>{catMeta.label}</span>
                              </span>
                            </div>

                            {/* Status Icon Indicator */}
                            <div
                              onClick={(e) => handleToggleCompleted(scenario.id, e)}
                              title={isCompleted ? (isFr ? 'Cliquer pour marquer en attente' : 'Click to unmark') : (isFr ? 'Cliquer pour valider' : 'Click to mark complete')}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                  : isNext
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                                  : 'bg-zinc-100 text-zinc-400 border border-zinc-200 hover:text-zinc-600'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </div>

                          {/* Next Recommended Badge */}
                          {isNext && (
                            <div className="mb-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffc20e] text-[#4f3c00] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                              <Zap className="w-3 h-3 fill-current" />
                              <span>{isFr ? 'Prochaine étape conseillée' : 'Next Recommended Step'}</span>
                            </div>
                          )}

                          {/* Node Title */}
                          <h5 className="font-bold text-sm text-[#201b11] group-hover:text-[#785a00] transition-colors leading-snug">
                            {isFr ? scenario.titleFr : scenario.title}
                          </h5>

                          {/* Goal Preview */}
                          <p className="text-xs text-[#4f4632] mt-1.5 line-clamp-2 leading-relaxed">
                            {isFr ? scenario.goalFr : scenario.goal}
                          </p>
                        </div>

                        {/* Node Footer with Commands & Actions */}
                        <div className="mt-4 pt-3 border-t border-[#ebdcc8]/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#817660]">
                            <Clock className="w-3 h-3" />
                            <span>{scenario.estimatedMinutes} min</span>
                            <span className="mx-0.5">•</span>
                            <span className="font-semibold">{isFr ? scenario.difficultyFr : scenario.difficulty}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectScenario(scenario.id);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-[#ffc20e] text-[#4f3c00] hover:bg-[#e5ad0c] shadow-2xs'
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{isCompleted ? (isFr ? 'Rejouer' : 'Replay') : (isFr ? 'Lancer' : 'Start')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: DOMAIN CLUSTERS VIEW */}
      {viewMode === 'domains' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { id: 'permissions', name: 'Permissions & Droits', nameEn: 'Permissions & Ownership', icon: ShieldCheck },
              { id: 'files', name: 'Fichiers, Flux & Archives', nameEn: 'Files, Streams & Archives', icon: FolderTree },
              { id: 'processes', name: 'Processus & Services Démons', nameEn: 'Processes & Daemons', icon: Cpu },
              { id: 'security', name: 'Sécurité Système & Audit', nameEn: 'System Security & Audit', icon: ShieldCheck },
              { id: 'network', name: 'Réseau & Diagnostic IP', nameEn: 'Networking & IP Diag', icon: Network },
              { id: 'storage', name: 'Stockage & Systèmes de Fichiers', nameEn: 'Storage & Filesystems', icon: HardDrive },
            ].map((domain) => {
              const domainScenarios = simulatedLabScenarios.filter((s) => s.category === domain.id);
              const domainCompletedCount = domainScenarios.filter((s) => completedIds.includes(s.id)).length;
              const DomainIcon = domain.icon;

              if (domainScenarios.length === 0) return null;

              return (
                <div key={domain.id} className="bg-white rounded-2xl border border-[#d3c5ab] p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ebdcc8]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#f8ecdb] text-[#785a00] flex items-center justify-center">
                          <DomainIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#201b11]">{isFr ? domain.name : domain.nameEn}</h4>
                          <span className="text-[11px] text-[#817660]">
                            {domainCompletedCount} / {domainScenarios.length} {isFr ? 'validés' : 'completed'}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#f8ecdb] flex items-center justify-center font-mono font-bold text-xs text-[#785a00]">
                        {Math.round((domainCompletedCount / domainScenarios.length) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {domainScenarios.map((scenario) => {
                        const isCompleted = completedIds.includes(scenario.id);
                        const isNext = scenario.id === nextRecommendedId;

                        return (
                          <div
                            key={scenario.id}
                            onClick={() => setSelectedScenarioForModal(scenario)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isCompleted
                                ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/70'
                                : isNext
                                ? 'bg-amber-50/80 border-[#ffc20e] hover:bg-amber-100/80'
                                : 'bg-[#fffcf7] border-[#ebdcc8] hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                onClick={(e) => handleToggleCompleted(scenario.id, e)}
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                  isCompleted ? 'bg-emerald-600 text-white' : 'border border-[#b5a790] text-transparent hover:text-zinc-400'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#201b11] truncate">
                                  {isFr ? scenario.titleFr : scenario.title}
                                </div>
                                <div className="text-[10.5px] text-[#817660] truncate">
                                  {scenario.solutionCommands[0]}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectScenario(scenario.id);
                              }}
                              className="px-2 py-1 rounded bg-[#ffc20e] hover:bg-[#e5ad0c] text-[#4f3c00] text-[11px] font-bold shrink-0 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER */}
      {selectedScenarioForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#d3c5ab] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#ebdcc8]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#ebdcc8]">
                    {selectedScenarioForModal.certification.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                    {selectedScenarioForModal.category}
                  </span>
                  {completedIds.includes(selectedScenarioForModal.id) ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {isFr ? 'Lab Validé (100 pts)' : 'Completed (100 pts)'}
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {isFr ? 'En attente de réalisation' : 'Pending completion'}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-serif text-[#201b11] pt-1">
                  {isFr ? selectedScenarioForModal.titleFr : selectedScenarioForModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedScenarioForModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#817660] hover:text-[#201b11] hover:bg-[#f8ecdb] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Goal & Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#785a00]">
                {isFr ? 'Objectif d\'administration' : 'Administration Goal'}
              </h4>
              <p className="text-sm text-[#201b11] leading-relaxed bg-[#fffcf7] p-3.5 rounded-xl border border-[#ebdcc8]">
                {isFr ? selectedScenarioForModal.goalFr : selectedScenarioForModal.goal}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#785a00]">
                {isFr ? 'Instructions pas à pas' : 'Step-by-step Instructions'}
              </h4>
              <div className="space-y-2">
                {(isFr ? selectedScenarioForModal.instructionsFr : selectedScenarioForModal.instructions).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-[#4f4632]">
                    <div className="w-5 h-5 rounded-full bg-[#f8ecdb] text-[#785a00] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </div>
                    <div className="pt-0.5">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample commands practiced */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#785a00]">
                {isFr ? 'Commandes clés & solution recommandée' : 'Key Commands & Recommended Solution'}
              </h4>
              <div className="bg-[#1e1910] text-[#ffc20e] p-3.5 rounded-xl font-mono text-xs space-y-1">
                {selectedScenarioForModal.solutionCommands.map((cmd, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#817660]">$</span>
                    <span className="text-[#f7f4ea]">{cmd}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#817660]">
                {isFr ? selectedScenarioForModal.solutionExplanationFr : selectedScenarioForModal.solutionExplanation}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#ebdcc8]">
              <button
                onClick={(e) => {
                  handleToggleCompleted(selectedScenarioForModal.id, e);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  completedIds.includes(selectedScenarioForModal.id)
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-white text-[#4f4632] border-[#d3c5ab] hover:bg-[#fffcf7]'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {completedIds.includes(selectedScenarioForModal.id)
                    ? (isFr ? 'Marqué comme complété' : 'Marked as completed')
                    : (isFr ? 'Marquer comme validé' : 'Mark as completed')}
                </span>
              </button>

              <button
                onClick={() => {
                  const targetId = selectedScenarioForModal.id;
                  setSelectedScenarioForModal(null);
                  onSelectScenario(targetId);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#e5ad0c] text-[#4f3c00] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>{isFr ? 'Ouvrir dans le Terminal Virtuel' : 'Open in Virtual Terminal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
