import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  ArrowRight,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  RefreshCw,
  Layers,
  BookOpen,
  Zap,
  ExternalLink
} from 'lucide-react';
import {
  CompetencyMasteryState,
  ObjectiveCriteriaStatus,
  MasteryOverviewReport,
  getMasteryOverviewReport,
  getMasteryStateInfo,
  MASTERY_EVENT,
  setObjectiveMasteryState
} from '../../services/masteryEngine';
import { ObjectiveMasteryBadge } from './ObjectiveMasteryBadge';
import { ObjectiveMasteryChecklistModal } from './ObjectiveMasteryChecklistModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { TabType } from '../../types';

interface Props {
  onNavigateToTab?: (tab: TabType) => void;
  compact?: boolean;
}

export const CompetencyMasteryWidget: React.FC<Props> = ({
  onNavigateToTab,
  compact = false
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [report, setReport] = useState<MasteryOverviewReport>(() => getMasteryOverviewReport());
  const [selectedStateFilter, setSelectedStateFilter] = useState<'ALL' | CompetencyMasteryState>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingStatus, setInspectingStatus] = useState<ObjectiveCriteriaStatus | null>(null);
  const [copiedChmod, setCopiedChmod] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);
  const [showAllObjectives, setShowAllObjectives] = useState(false);

  // Sync with real-time application updates
  useEffect(() => {
    const handleUpdate = () => {
      setReport(getMasteryOverviewReport());
    };

    window.addEventListener(MASTERY_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lpi_virtual_lab_completed', handleUpdate);
    window.addEventListener('srs_updated', handleUpdate);
    window.addEventListener('lpi_troubleshooting_solved', handleUpdate);
    window.addEventListener('lpi_incident_resolved', handleUpdate);

    return () => {
      window.removeEventListener(MASTERY_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lpi_virtual_lab_completed', handleUpdate);
      window.removeEventListener('srs_updated', handleUpdate);
      window.removeEventListener('lpi_troubleshooting_solved', handleUpdate);
      window.removeEventListener('lpi_incident_resolved', handleUpdate);
    };
  }, []);

  const handleCopyChmod = async () => {
    try {
      await navigator.clipboard.writeText(report.exemplarChmod.asciiChecklist);
      setCopiedChmod(true);
      setTimeout(() => setCopiedChmod(false), 2000);
    } catch {}
  };

  const handleCopyRouting = async () => {
    try {
      await navigator.clipboard.writeText(report.exemplarRouting.asciiChecklist);
      setCopiedRouting(true);
      setTimeout(() => setCopiedRouting(false), 2000);
    } catch {}
  };

  const filteredObjectives = report.objectives.filter((obj) => {
    const matchesFilter = selectedStateFilter === 'ALL' || obj.state === selectedStateFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      obj.id.toLowerCase().includes(q) ||
      obj.name.toLowerCase().includes(q) ||
      (obj.command && obj.command.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const displayedObjectives = showAllObjectives ? filteredObjectives : filteredObjectives.slice(0, 6);

  return (
    <div className="bg-[#ffffff] border-2 border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-6">
      {/* 1. Header & Pedagogical Distinction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ebdcc4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#28A745]/15 text-[#28A745]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e]">
              {isFr ? 'Cadre de Compétence Technique' : 'Technical Competency Framework'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#201b11] mt-1">
            {isFr ? 'Matrice de Maîtrise Linux' : 'Linux Competency Mastery Matrix'}
          </h2>
          <p className="text-sm text-[#4f4632] mt-0.5">
            {isFr
              ? 'Attention à ne pas confondre : terminé et maîtrisé.'
              : 'Caution: Do not confuse completed with truly mastered.'}
          </p>
        </div>

        {/* Global Mastery Stats Badge */}
        <div className="flex items-center gap-3 bg-[#fdf8f0] border border-[#ebdcc4] px-4 py-2.5 rounded-xl self-start md:self-auto">
          <div className="text-right">
            <span className="text-[11px] font-bold text-[#6e634e] uppercase block">
              {isFr ? 'Maîtrise Globale' : 'Overall Mastery'}
            </span>
            <span className="text-lg font-black text-[#28A745]">
              {report.masteredCount} / {report.totalObjectives} ({report.overallMasteryPct}%)
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-600 flex items-center justify-center font-bold text-xs text-[#201b11]">
            {report.overallMasteryPct}%
          </div>
        </div>
      </div>

      {/* 2. The 4 States Progression Flow */}
      <div className="bg-[#faf5ee] border border-[#d3c5ab]/80 rounded-xl p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#4f4632] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            {isFr ? 'Le cycle en 4 états de compétence :' : 'The 4-State Mastery Lifecycle:'}
          </span>
          <span className="text-xs text-[#6e634e]">
            {isFr ? 'Cliquez pour filtrer les objectifs' : 'Click to filter objectives'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* State 1: NOT_STARTED */}
          <button
            onClick={() => setSelectedStateFilter(selectedStateFilter === 'NOT_STARTED' ? 'ALL' : 'NOT_STARTED')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStateFilter === 'NOT_STARTED'
                ? 'bg-stone-200 border-stone-400 shadow-xs ring-2 ring-stone-400/40'
                : 'bg-white border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold mb-1">
              <span>1. NOT_STARTED</span>
              <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                {report.notStartedCount}
              </span>
            </div>
            <div className="font-bold text-stone-800 text-sm">
              {isFr ? 'Non démarré' : 'Not Started'}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isFr ? 'Aucune action engagée' : 'No activity logged'}
            </p>
          </button>

          {/* State 2: LEARNING */}
          <button
            onClick={() => setSelectedStateFilter(selectedStateFilter === 'LEARNING' ? 'ALL' : 'LEARNING')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStateFilter === 'LEARNING'
                ? 'bg-blue-100 border-blue-400 shadow-xs ring-2 ring-blue-400/40'
                : 'bg-white border-blue-200 hover:bg-blue-50/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-blue-600 font-bold mb-1">
              <span>2. LEARNING</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">
                {report.learningCount}
              </span>
            </div>
            <div className="font-bold text-blue-900 text-sm">
              {isFr ? 'En cours' : 'Learning'}
            </div>
            <p className="text-[11px] text-blue-600 mt-0.5">
              {isFr ? 'Théorie & concepts en cours' : 'Concepts in discovery'}
            </p>
          </button>

          {/* State 3: PRACTICING */}
          <button
            onClick={() => setSelectedStateFilter(selectedStateFilter === 'PRACTICING' ? 'ALL' : 'PRACTICING')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStateFilter === 'PRACTICING'
                ? 'bg-orange-100 border-orange-400 shadow-xs ring-2 ring-orange-400/40'
                : 'bg-white border-orange-200 hover:bg-orange-50/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-orange-600 font-bold mb-1">
              <span>3. PRACTICING</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 text-[10px]">
                {report.practicingCount}
              </span>
            </div>
            <div className="font-bold text-orange-900 text-sm">
              {isFr ? 'En pratique' : 'Practicing'}
            </div>
            <p className="text-[11px] text-orange-700 mt-0.5">
              {isFr ? 'QCM / flashcards / lab à finaliser' : 'Labs / troubleshooting in progress'}
            </p>
          </button>

          {/* State 4: MASTERED */}
          <button
            onClick={() => setSelectedStateFilter(selectedStateFilter === 'MASTERED' ? 'ALL' : 'MASTERED')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStateFilter === 'MASTERED'
                ? 'bg-emerald-100 border-emerald-400 shadow-xs ring-2 ring-emerald-400/40'
                : 'bg-white border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-600 font-bold mb-1">
              <span>4. MASTERED</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px]">
                {report.masteredCount}
              </span>
            </div>
            <div className="font-bold text-emerald-900 text-sm">
              {isFr ? 'Maîtrisé' : 'Mastered'}
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              {isFr ? '4 preuves techniques validées' : 'All 4 proofs certified'}
            </p>
          </button>
        </div>
      </div>

      {/* 3. The Two Contrasting Flagship Exemplars (chmod vs network routing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: chmod -> MAÎTRISÉ */}
        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/30 p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#201b11] text-[#ffc20e] font-mono font-bold text-xs rounded">
                    chmod
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                    {isFr ? 'Exemple Maîtrisé' : 'Mastered Example'}
                  </span>
                </div>
                <h4 className="font-black text-base text-[#201b11] mt-1">
                  104.5 Permissions & Droits
                </h4>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-[#28A745] text-white text-xs font-black uppercase tracking-wider shadow-2xs">
                ✓ MAÎTRISÉ
              </span>
            </div>

            {/* Terminal Checklist Representation */}
            <div className="bg-[#1c1b18] text-[#38ef7d] font-mono p-3.5 rounded-lg border border-[#3b3a36] text-xs">
              <div className="flex items-center justify-between text-[#cbd5e0] border-b border-[#3b3a36] pb-1.5 mb-2">
                <span className="text-[10px] font-bold">TERMINAL PROOF</span>
                <button
                  onClick={handleCopyChmod}
                  className="text-[10px] text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedChmod ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedChmod ? 'COPIÉ' : 'COPIER'}</span>
                </button>
              </div>
              <div className="space-y-1 text-[11px] leading-relaxed">
                <div>chmod</div>
                <div className="text-stone-500">────────────────────</div>
                <div className="text-emerald-400">✓ théorie</div>
                <div className="text-emerald-400">✓ 8/10 questions</div>
                <div className="text-emerald-400">✓ 3 flashcards</div>
                <div className="text-emerald-400">✓ Lab réussi</div>
                <div className="pt-1.5 font-bold text-emerald-300">→ MAÎTRISÉ</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
            <span className="text-xs text-emerald-800 font-semibold">
              {isFr ? 'Toutes les preuves sont complètes' : 'All cumulative proofs valid'}
            </span>
            <button
              onClick={() => setInspectingStatus(report.exemplarChmod)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{isFr ? 'Inspecter' : 'Inspect'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card B: network routing -> EN COURS */}
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50/30 p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#201b11] text-[#ffc20e] font-mono font-bold text-xs rounded">
                    network routing
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">
                    {isFr ? 'Exemple En Cours' : 'In Progress Example'}
                  </span>
                </div>
                <h4 className="font-black text-base text-[#201b11] mt-1">
                  109.2 Routage IP & Passerelles
                </h4>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-[#FD7E14] text-white text-xs font-black uppercase tracking-wider shadow-2xs">
                ⚙ EN COURS
              </span>
            </div>

            {/* Terminal Checklist Representation */}
            <div className="bg-[#1c1b18] text-[#38ef7d] font-mono p-3.5 rounded-lg border border-[#3b3a36] text-xs">
              <div className="flex items-center justify-between text-[#cbd5e0] border-b border-[#3b3a36] pb-1.5 mb-2">
                <span className="text-[10px] font-bold">TERMINAL PROOF</span>
                <button
                  onClick={handleCopyRouting}
                  className="text-[10px] text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedRouting ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRouting ? 'COPIÉ' : 'COPIER'}</span>
                </button>
              </div>
              <div className="space-y-1 text-[11px] leading-relaxed">
                <div>network routing</div>
                <div className="text-stone-500">────────────────────</div>
                <div className="text-emerald-400">✓ théorie</div>
                <div className="text-amber-400">✓ 7/10 questions</div>
                <div className="text-red-400">✗ Lab</div>
                <div className="text-red-400">✗ troubleshooting</div>
                <div className="pt-1.5 font-bold text-amber-300">→ EN COURS</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
            <span className="text-xs text-amber-800 font-semibold">
              {isFr ? 'Manque : Lab terminal & dépannage' : 'Missing: Hands-on lab & debug'}
            </span>
            <div className="flex items-center gap-2">
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('training')}
                  className="px-2.5 py-1.5 bg-[#28A745] hover:bg-[#218838] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Lab</span>
                </button>
              )}
              <button
                onClick={() => setInspectingStatus(report.exemplarRouting)}
                className="px-3 py-1.5 bg-[#201b11] hover:bg-[#342e20] text-[#ffc20e] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{isFr ? 'Corriger' : 'Fix'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Objective Explorer & Proof Filter */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e]">
              {isFr ? 'Explorateur des Objectifs LPI :' : 'LPI Objectives Explorer:'}
            </span>
            <span className="text-xs text-[#817660]">
              ({filteredObjectives.length} {isFr ? 'objectifs' : 'objectives'})
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFr ? 'Filtrer par commande, id...' : 'Filter command or id...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#d3c5ab] text-xs bg-[#faf5ee] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffc20e]"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedStateFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              selectedStateFilter === 'ALL'
                ? 'bg-[#201b11] text-[#ffc20e]'
                : 'bg-[#f8ecdb] text-[#4f4632] hover:bg-[#ebdcc8]'
            }`}
          >
            {isFr ? 'Tous les états' : 'All States'} ({report.totalObjectives})
          </button>
          <button
            onClick={() => setSelectedStateFilter('MASTERED')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedStateFilter === 'MASTERED'
                ? 'bg-[#28A745] text-white shadow-2xs'
                : 'bg-emerald-50 text-[#28A745] border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span>✓ {isFr ? 'Maîtrisé' : 'Mastered'} ({report.masteredCount})</span>
          </button>
          <button
            onClick={() => setSelectedStateFilter('PRACTICING')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedStateFilter === 'PRACTICING'
                ? 'bg-[#FD7E14] text-white shadow-2xs'
                : 'bg-orange-50 text-[#FD7E14] border border-orange-200 hover:bg-orange-100'
            }`}
          >
            <span>⚙ {isFr ? 'En cours' : 'Practicing'} ({report.practicingCount})</span>
          </button>
          <button
            onClick={() => setSelectedStateFilter('LEARNING')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedStateFilter === 'LEARNING'
                ? 'bg-[#007BFF] text-white shadow-2xs'
                : 'bg-blue-50 text-[#007BFF] border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span>📖 {isFr ? 'Apprentissage' : 'Learning'} ({report.learningCount})</span>
          </button>
          <button
            onClick={() => setSelectedStateFilter('NOT_STARTED')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedStateFilter === 'NOT_STARTED'
                ? 'bg-[#817660] text-white shadow-2xs'
                : 'bg-stone-100 text-[#817660] border border-stone-200 hover:bg-stone-200'
            }`}
          >
            <span>○ {isFr ? 'Non démarré' : 'Not Started'} ({report.notStartedCount})</span>
          </button>
        </div>

        {/* Objective Rows */}
        <div className="divide-y divide-[#ebdcc4] border border-[#d3c5ab] rounded-xl overflow-hidden bg-white">
          {displayedObjectives.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#817660]">
              {isFr ? 'Aucun objectif ne correspond aux critères.' : 'No objectives matching the criteria.'}
            </div>
          ) : (
            displayedObjectives.map((obj) => (
              <div
                key={obj.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fffbf6] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2 py-0.5 bg-[#201b11] text-[#ffc20e] font-mono font-bold text-xs rounded shrink-0">
                    {obj.id}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-[#201b11] truncate block">
                      {obj.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e634e] mt-0.5">
                      {obj.theory.completed ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">✓ théorie</span>
                      ) : (
                        <span className="text-stone-400">✗ théorie</span>
                      )}
                      <span>•</span>
                      {obj.quiz.passed ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">✓ {obj.quiz.correctCount}/{obj.quiz.totalCount || 10} QCM</span>
                      ) : (
                        <span className="text-amber-700">✗ {obj.quiz.correctCount}/{obj.quiz.totalCount || 10} QCM</span>
                      )}
                      <span>•</span>
                      {obj.flashcards.passed ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">✓ {obj.flashcards.masteredCount} cartes</span>
                      ) : (
                        <span className="text-stone-400">✗ {obj.flashcards.masteredCount} cartes</span>
                      )}
                      <span>•</span>
                      {obj.lab.passed ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">✓ Lab</span>
                      ) : (
                        <span className="text-stone-400">✗ Lab</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <ObjectiveMasteryBadge
                    state={obj.state}
                    size="sm"
                    onClick={() => setInspectingStatus(obj)}
                  />
                  <button
                    onClick={() => setInspectingStatus(obj)}
                    className="px-2 py-1 rounded bg-[#f2e7d6] hover:bg-[#ebdcc4] text-[#4f4632] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isFr ? 'Critères' : 'Criteria'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Expand / Collapse Button */}
        {filteredObjectives.length > 6 && (
          <div className="text-center pt-1">
            <button
              onClick={() => setShowAllObjectives(!showAllObjectives)}
              className="px-4 py-1.5 rounded-lg border border-[#d3c5ab] bg-[#faf5ee] hover:bg-[#f2e7d6] text-[#4f4632] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {showAllObjectives ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>{isFr ? 'Afficher moins d’objectifs' : 'Show fewer objectives'}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>
                    {isFr
                      ? `Voir tous les ${filteredObjectives.length} objectifs`
                      : `View all ${filteredObjectives.length} objectives`}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 5. Inspection Modal */}
      {inspectingStatus && (
        <ObjectiveMasteryChecklistModal
          isOpen={true}
          onClose={() => setInspectingStatus(null)}
          status={inspectingStatus}
          onNavigateToTab={onNavigateToTab}
          onRefresh={() => setReport(getMasteryOverviewReport())}
        />
      )}
    </div>
  );
};
