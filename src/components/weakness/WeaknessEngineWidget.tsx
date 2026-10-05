import React, { useState, useEffect } from 'react';
import {
  Flame,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  Zap,
  BookOpen,
  Info,
  Shield,
  Terminal,
  Network,
  Cpu,
  HardDrive,
  Brain,
  XCircle,
  Wrench,
  Layers,
  Lightbulb
} from 'lucide-react';
import { WeaknessDomainId, WeaknessDomainStats, WeaknessEngineReport } from '../../types';
import {
  getWeaknessReport,
  resetWeaknessData,
  computeCausalAnalysis
} from '../../utils/weaknessEngine';
import { WeaknessTrainingModal } from './WeaknessTrainingModal';
import { useLanguage } from '../../i18n/LanguageContext';

interface WeaknessEngineWidgetProps {
  onNavigateToTraining?: (mode?: string) => void;
  onNavigateToExam?: (examId?: string) => void;
  compact?: boolean;
}

export const WeaknessEngineWidget: React.FC<WeaknessEngineWidgetProps> = ({
  onNavigateToTraining,
  onNavigateToExam,
  compact = false
}) => {
  const { isFrench } = useLanguage();

  const [report, setReport] = useState<WeaknessEngineReport>(() => getWeaknessReport());
  const [selectedDomainId, setSelectedDomainId] = useState<WeaknessDomainId>('networking');
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [activeTrainingDomainId, setActiveTrainingDomainId] = useState<WeaknessDomainId | undefined>(undefined);
  const [showEngineInfo, setShowEngineInfo] = useState(false);

  // Synchronisation avec les événements du Weakness Engine
  useEffect(() => {
    const handleUpdate = () => {
      setReport(getWeaknessReport());
    };
    window.addEventListener('weakness_report_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('weakness_report_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const selectedDomain = report.domains.find((d) => d.id === selectedDomainId) || report.domains[0];

  const handleOpenTraining = (domainId?: WeaknessDomainId) => {
    setActiveTrainingDomainId(domainId);
    setIsTrainingModalOpen(true);
  };

  const handleMasteryUpdated = () => {
    setReport(getWeaknessReport());
  };

  // Icône par domaine
  const getDomainIcon = (id: WeaknessDomainId) => {
    switch (id) {
      case 'networking':
        return <Network className="w-4 h-4 text-red-600 shrink-0" />;
      case 'scripting':
        return <Terminal className="w-4 h-4 text-orange-600 shrink-0" />;
      case 'security':
        return <Shield className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'filesystems':
        return <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'commands':
        return <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Flame className="w-4 h-4 text-amber-600 shrink-0" />;
    }
  };

  // Couleur de jauge selon le %
  const getMasteryColor = (pct: number) => {
    if (pct < 50) return { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50 border-red-200' };
    if (pct < 70) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
    if (pct < 85) return { bar: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
  };

  return (
    <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
      {/* Background soft accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-red-500/5 pointer-events-none blur-xl" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#ebdcc4]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-amber-500/20 via-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center text-red-600 shadow-2xs shrink-0">
            <Flame className="w-6 h-6 fill-red-500/30 text-red-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-[#201b11] tracking-tight flex items-center gap-2">
                <span>{isFrench ? 'Mes faiblesses' : 'My Weaknesses'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold uppercase tracking-wider border border-red-200">
                  Weakness Engine
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6e634e] mt-0.5">
              {isFrench
                ? 'Analyse croisée des erreurs d\'examens, cartes SRS, temps d\'hésitation et réussites par hasard'
                : 'Cross-analysis of exam mistakes, SRS lapses, hesitation time, and lucky guesses'}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEngineInfo(!showEngineInfo)}
            className="p-2 rounded-lg text-[#6e634e] hover:bg-[#f2e2cb] hover:text-[#201b11] transition-colors border border-[#d3c5ab] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title={isFrench ? 'Comment fonctionne l\'algorithme ?' : 'How does the engine analyze?'}
          >
            <Info className="w-4 h-4 text-[#785a00]" />
            <span className="hidden md:inline">{isFrench ? 'Algorithme' : 'Algorithm'}</span>
          </button>

          <button
            id="train-all-weaknesses-btn"
            onClick={() => handleOpenTraining()}
            className="py-2.5 px-4 rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Flame className="w-4 h-4 fill-white/30" />
            <span>{isFrench ? 'Entraîner mes faiblesses' : 'Train My Weaknesses'}</span>
          </button>
        </div>
      </div>

      {/* Explanatory banner toggleable */}
      {showEngineInfo && (
        <div className="mt-4 p-4 rounded-xl bg-[#fff8ee] border border-amber-200 text-xs sm:text-sm text-[#4f432e] animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-[#201b11] flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#785a00]" />
              {isFrench ? 'Les 7 sources analysées en continu par le Weakness Engine :' : '7 dimensions continuously tracked:'}
            </h4>
            <button
              onClick={() => setShowEngineInfo(false)}
              className="text-xs text-[#817660] hover:text-[#201b11]"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-2">
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">1. Erreurs aux examens</span>
              <span className="text-[11px] text-[#6e634e]">Questions ratées lors des examens blancs LPIC.</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">2. Erreurs flashcards</span>
              <span className="text-[11px] text-[#6e634e]">Cartes notées "Difficile" ou oublis répétés (lapses SRS).</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">3. Labs échoués</span>
              <span className="text-[11px] text-[#6e634e]">Scénarios d'incidents non résolus dans le temps imparti.</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">4. Temps passé</span>
              <span className="text-[11px] text-[#6e634e]">&gt;90s indique une hésitation ou une lacune conceptuelle.</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">5. Questions sautées</span>
              <span className="text-[11px] text-[#6e634e]">Signal de blocage ou manque de confiance sur un objectif.</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">6. Réussites par hasard</span>
              <span className="text-[11px] text-[#6e634e]">Bonne réponse avec drapeau 🚩 ou délai d'hésitation extrême.</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60">
              <span className="font-bold block text-[#201b11]">7. Sujets jamais étudiés</span>
              <span className="text-[11px] text-[#6e634e]">Objectifs sans aucune révision, identifiés comme angles morts.</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-amber-200/60 flex items-center justify-center">
              <button
                onClick={() => {
                  if (confirm(isFrench ? 'Réinitialiser les données du Weakness Engine ?' : 'Reset Weakness data?')) {
                    resetWeaknessData();
                    setReport(getWeaknessReport());
                  }
                }}
                className="text-[11px] font-semibold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                {isFrench ? 'Réinitialiser démo' : 'Reset sample data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left Column: Weakness List with Percentages & Bars */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e]">
              {isFrench ? 'Domaines classés par urgence' : 'Skills Ranked by Urgency'}
            </span>
            <span className="text-xs text-[#817660]">
              {report.domains.length} {isFrench ? 'compétences' : 'skills'}
            </span>
          </div>

          {report.domains.map((domain) => {
            const isSelected = domain.id === selectedDomainId;
            const colors = getMasteryColor(domain.masteryPct);

            return (
              <div
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#fffcf7] border-[#785a00] shadow-sm ring-1 ring-[#785a00]/30'
                    : 'bg-[#ffffff] border-[#ebdcc4] hover:bg-[#fffbf2] hover:border-[#d3c5ab]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {getDomainIcon(domain.id)}
                    <div>
                      <span className="font-bold text-sm sm:text-base text-[#201b11] block">
                        {isFrench ? domain.nameFr.split('(')[0].trim() : domain.name}
                      </span>
                      <span className="text-[11px] text-[#6e634e]">
                        {domain.totalErrors} {isFrench ? 'erreurs' : 'errors'}
                        {domain.subtopics.length > 0 && ` · ${domain.subtopics[0].nameFr || domain.subtopics[0].name}`}
                      </span>
                    </div>
                  </div>

                  {/* Percentage score */}
                  <div className="flex items-center gap-2">
                    <span className={`text-lg sm:text-xl font-black font-mono ${colors.text}`}>
                      {domain.masteryPct}%
                    </span>
                    <span className="text-xs text-[#817660]">
                      {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#ebdcc4] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${domain.masteryPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive "Pourquoi [Sujet] est faible ?" */}
        <div className="lg:col-span-7 bg-[#fffcf7] border border-[#d3c5ab] rounded-2xl p-5 sm:p-6 shadow-xs">
          
          {/* Header of the drilldown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ebdcc4]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                  {isFrench ? 'Diagnostic Approfondi' : 'Deep-Dive Diagnostic'}
                </span>
                <span className="text-xs font-mono font-semibold text-[#785a00]">
                  Maîtrise : {selectedDomain.masteryPct}%
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#201b11]">
                {isFrench
                  ? `Pourquoi ${selectedDomain.nameFr.split('(')[0].trim()} est faible ?`
                  : `Why is ${selectedDomain.name} weak?`}
              </h3>
            </div>

            {/* Train this domain button */}
            <button
              onClick={() => handleOpenTraining(selectedDomain.id)}
              className="py-2 px-3.5 rounded-xl bg-[#ffc20e] hover:bg-[#eab007] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isFrench ? `Entraîner ce sujet (${selectedDomain.masteryPct}%)` : `Train this skill`}</span>
            </button>
          </div>

          {/* 🧠 SECTION MAJEURE : « Pourquoi suis-je faible ? » — Analyse Causale Cognitive */}
          {(() => {
            const causal = selectedDomain.causalAnalysis || computeCausalAnalysis(selectedDomain);
            if (!causal) return null;

            return (
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#ffffff] via-[#fffdfa] to-[#fff8ee] border-2 border-amber-300 shadow-xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-[#201b11] flex items-center gap-2">
                        <span>{isFrench ? 'Pourquoi suis-je faible ?' : 'Why am I weak?'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                          {isFrench ? 'Analyse causale' : 'Causal Analysis'}
                        </span>
                      </h4>
                      <p className="text-xs text-[#6e634e]">
                        {isFrench
                          ? 'Décomposition cognitive : Connaissances vs Commandes vs Pratique vs Diagnostic'
                          : 'Cognitive breakdown: Knowledge vs Commands vs Practice vs Troubleshooting'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Cognitive Dimensions Gauges */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e] block">
                    {isFrench ? 'Causes probables de contre-performance :' : 'Probable root causes:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(causal.dimensions).map((dim) => {
                      const isLow = dim.scorePct < 50;
                      const isMid = dim.scorePct >= 50 && dim.scorePct < 70;
                      const statusColor = isLow
                        ? 'text-red-700 bg-red-50 border-red-200'
                        : isMid
                        ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200';
                      const barColor = isLow ? 'bg-red-500' : isMid ? 'bg-amber-500' : 'bg-emerald-500';

                      return (
                        <div
                          key={dim.id}
                          className={`p-3 rounded-xl border ${statusColor} space-y-1.5 transition-all`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5 truncate">
                              {dim.scorePct < 50 ? (
                                <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              ) : dim.scorePct < 70 ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                              <span className="truncate">{dim.nameFr}</span>
                            </span>
                            <span className="font-mono text-sm font-black shrink-0">
                              {dim.scorePct} %
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} rounded-full transition-all duration-500`}
                              style={{ width: `${dim.scorePct}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#6e634e] pt-0.5">
                            <span className="truncate max-w-[190px]">{dim.descriptionFr}</span>
                            {dim.isRootCause && (
                              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-extrabold uppercase text-[9px] shrink-0">
                                {isFrench ? 'Cause racine' : 'Root cause'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Deductive Pedagogical Diagnosis */}
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs sm:text-sm text-[#201b11] space-y-1.5 font-medium leading-relaxed">
                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-950 whitespace-pre-line">
                    {causal.rootCauseDiagnosisFr}
                  </div>
                  <div className="text-xs text-[#5c4e36] pt-1.5 border-t border-amber-200">
                    {causal.diagnosisSummaryFr}
                  </div>
                </div>

                {/* Actionable Prescriptive Rule */}
                <div className="p-4 rounded-xl bg-linear-to-r from-red-600/10 via-orange-500/10 to-amber-500/10 border border-red-300 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider text-red-950">
                      {isFrench ? 'Prescription pédagogique du Weakness Engine :' : 'Weakness Engine Prescription:'}
                    </span>
                  </div>

                  <div className="text-sm font-black text-red-900 bg-white/95 p-3 rounded-xl border border-red-200 shadow-2xs">
                    « {causal.prescription.actionPlanFr} »
                  </div>

                  {/* Step Sequence */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e634e] block">
                      {isFrench ? 'Séquence recommandée avant tout QCM :' : 'Recommended steps before quiz:'}
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {causal.prescription.steps.map((step) => (
                        <div
                          key={step.order}
                          className="p-2.5 rounded-xl bg-white border border-[#ebdcc4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-[#ffc20e] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-[#ffc20e] text-[#6d5100] text-xs font-bold flex items-center justify-center shrink-0">
                              {step.order}
                            </span>
                            <span className="text-xs font-bold text-[#201b11] truncate">
                              {step.titleFr}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              if (step.type === 'lab' && onNavigateToTraining) {
                                onNavigateToTraining('guided_labs');
                              } else if (step.type === 'troubleshooting' && onNavigateToTraining) {
                                onNavigateToTraining('troubleshooting');
                              } else if (step.type === 'qcm' && onNavigateToExam) {
                                onNavigateToExam(step.targetId || 'exam-101');
                              } else if (onNavigateToTraining) {
                                onNavigateToTraining('guided_labs');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#201b11] hover:bg-[#38332a] text-[#fff8f2] text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                          >
                            <span>{step.actionLabelFr}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Core breakdown summary badges */}
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200">
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  {selectedDomain.totalErrors} {isFrench ? 'erreurs recensées au total' : 'total recorded mistakes'}
                </span>
              </div>

              {/* Specific subtopics list (e.g. 7 erreurs DNS, 3 erreurs routing, 2 erreurs IPv6) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {selectedDomain.subtopics.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2.5 rounded-lg bg-white border border-red-200 shadow-2xs flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-[#201b11] truncate">
                      {isFrench ? sub.nameFr : sub.name}
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-black text-red-600 font-mono">
                        {sub.errorsCount} {isFrench ? 'erreurs' : 'errors'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral analysis pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-[#fff8ee] border border-[#ebdcc4]">
                <span className="text-[10px] uppercase font-bold text-[#6e634e] block">
                  {isFrench ? 'Par Hasard' : 'Lucky Guesses'}
                </span>
                <span className="text-lg font-bold text-amber-700 font-mono">
                  {selectedDomain.luckyGuessesCount}
                </span>
                <span className="text-[10px] text-[#817660] block">
                  {isFrench ? 'Doutes flaggués' : 'Flagged doubts'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#fff8ee] border border-[#ebdcc4]">
                <span className="text-[10px] uppercase font-bold text-[#6e634e] block">
                  {isFrench ? 'Sautées' : 'Skipped'}
                </span>
                <span className="text-lg font-bold text-stone-700 font-mono">
                  {selectedDomain.skippedCount}
                </span>
                <span className="text-[10px] text-[#817660] block">
                  {isFrench ? 'Questions esquivées' : 'Questions skipped'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#fff8ee] border border-[#ebdcc4]">
                <span className="text-[10px] uppercase font-bold text-[#6e634e] block">
                  {isFrench ? 'Labs Échoués' : 'Failed Labs'}
                </span>
                <span className="text-lg font-bold text-red-700 font-mono">
                  {selectedDomain.failedLabsCount}
                </span>
                <span className="text-[10px] text-[#817660] block">
                  {isFrench ? 'Incidents non résolus' : 'Unresolved incidents'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#fff8ee] border border-[#ebdcc4]">
                <span className="text-[10px] uppercase font-bold text-[#6e634e] block">
                  {isFrench ? 'Temps Moyen' : 'Avg Time'}
                </span>
                <span className="text-lg font-bold text-blue-700 font-mono">
                  {selectedDomain.timeSpentAvgSeconds}s
                </span>
                <span className="text-[10px] text-[#817660] block">
                  {selectedDomain.timeSpentAvgSeconds > 90
                    ? isFrench ? '⚠️ Hésitation forte' : 'High hesitation'
                    : isFrench ? 'Cadence normale' : 'Normal pace'}
                </span>
              </div>
            </div>

            {/* Diagnostic explanation text */}
            <div className="p-4 rounded-xl bg-white border border-[#ebdcc4] text-xs sm:text-sm text-[#4f432e] leading-relaxed">
              <p className="font-medium">
                {isFrench ? selectedDomain.whyWeakExplanationFr : selectedDomain.whyWeakExplanation}
              </p>
            </div>

            {/* LPIC Pitfalls */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-700" />
                <span>{isFrench ? 'Pièges d\'examen typiques' : 'Typical Exam Pitfalls'}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-800">
                {(isFrench ? selectedDomain.commonPitfallsFr : selectedDomain.commonPitfalls).map((pitfall, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample mistake questions review */}
            {selectedDomain.sampleMistakes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6e634e] block">
                  {isFrench ? 'Exemples d\'erreurs passées à corriger' : 'Sample Past Mistakes'}
                </span>
                <div className="space-y-2">
                  {selectedDomain.sampleMistakes.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className="p-3 bg-white rounded-xl border border-[#ebdcc4] text-xs space-y-1"
                    >
                      <div className="font-bold text-[#201b11]">
                        {isFrench ? m.questionFr || m.question : m.question}
                      </div>
                      <div className="text-emerald-800 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isFrench ? 'Réponse attendue :' : 'Expected :'} {m.correctAnswer}</span>
                      </div>
                      {m.mistakeReasonFr && isFrench && (
                        <div className="text-stone-500 text-[11px] italic">
                          Cause : {m.mistakeReasonFr}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Call-To-Action */}
            <div className="pt-2">
              <button
                onClick={() => handleOpenTraining(selectedDomain.id)}
                className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-white/20" />
                <span>
                  {isFrench
                    ? `Lancer l'entraînement adaptatif sur ${selectedDomain.nameFr.split('(')[0].trim()}`
                    : `Launch Adaptive Training on ${selectedDomain.name}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Training Modal */}
      <WeaknessTrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        targetDomainId={activeTrainingDomainId}
        targetDomainNameFr={
          activeTrainingDomainId
            ? report.domains.find((d) => d.id === activeTrainingDomainId)?.nameFr
            : undefined
        }
        onMasteryUpdated={handleMasteryUpdated}
      />
    </div>
  );
};
