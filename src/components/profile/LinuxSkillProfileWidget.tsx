import React, { useState, useEffect, useMemo } from 'react';
import {
  Terminal,
  Layers,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Shield,
  FolderTree,
  Lock,
  Network,
  HardDrive,
  FileCode2,
  Sliders,
  Wrench,
  Sparkles,
  Info
} from 'lucide-react';
import {
  computeLinuxSkillProfile,
  LinuxSkillDomainProfile,
  LinuxSkillProfileReport,
  LinuxSkillDomainId
} from '../../services/skillProfileEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { TabType } from '../../types';

interface Props {
  onNavigateToTab?: (tab: TabType) => void;
  onStartExam?: (examId: string) => void;
  onOpenFlashcards?: (topic?: any) => void;
  compact?: boolean;
}

export const LinuxSkillProfileWidget: React.FC<Props> = ({
  onNavigateToTab,
  onStartExam,
  onOpenFlashcards,
  compact = false
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [profile, setProfile] = useState<LinuxSkillProfileReport>(() => computeLinuxSkillProfile());
  const [viewMode, setViewMode] = useState<'interactive' | 'terminal'>('interactive');
  const [expandedDomainId, setExpandedDomainId] = useState<LinuxSkillDomainId | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'priority' | 'mastered'>('all');

  // Listen to application events to update skill profile in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setProfile(computeLinuxSkillProfile());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('lpi_virtual_lab_completed', handleUpdate);
    window.addEventListener('srs_updated', handleUpdate);
    window.addEventListener('lpi_incident_resolved', handleUpdate);
    window.addEventListener('lpi_troubleshooting_solved', handleUpdate);
    window.addEventListener('lpi_quiz_topic_mastered', handleUpdate);
    window.addEventListener('lpi_exam_history_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('lpi_virtual_lab_completed', handleUpdate);
      window.removeEventListener('srs_updated', handleUpdate);
      window.removeEventListener('lpi_incident_resolved', handleUpdate);
      window.removeEventListener('lpi_troubleshooting_solved', handleUpdate);
      window.removeEventListener('lpi_quiz_topic_mastered', handleUpdate);
      window.removeEventListener('lpi_exam_history_updated', handleUpdate);
    };
  }, []);

  const handleCopyAscii = async () => {
    try {
      await navigator.clipboard.writeText(profile.asciiTable);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const getDomainIcon = (id: LinuxSkillDomainId) => {
    switch (id) {
      case 'filesystem':
        return <FolderTree className="w-5 h-5 text-[#2b6cb0]" />;
      case 'permissions':
        return <Lock className="w-5 h-5 text-[#28A745]" />;
      case 'processes':
        return <Cpu className="w-5 h-5 text-[#805ad5]" />;
      case 'networking':
        return <Network className="w-5 h-5 text-[#dd6b20]" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-[#d69e2e]" />;
      case 'security':
        return <Shield className="w-5 h-5 text-[#e53e3e]" />;
      case 'shell':
        return <FileCode2 className="w-5 h-5 text-[#319795]" />;
      case 'systemd':
        return <Sliders className="w-5 h-5 text-[#4a5568]" />;
      case 'troubleshooting':
        return <Wrench className="w-5 h-5 text-[#c53030]" />;
      default:
        return <Terminal className="w-5 h-5 text-[#785a00]" />;
    }
  };

  const filteredDomains = useMemo(() => {
    if (selectedFilter === 'priority') {
      return profile.domains.filter((d) => d.score < 60);
    }
    if (selectedFilter === 'mastered') {
      return profile.domains.filter((d) => d.score >= 75);
    }
    return profile.domains;
  }, [profile.domains, selectedFilter]);

  const toggleExpand = (domainId: LinuxSkillDomainId) => {
    setExpandedDomainId((prev) => (prev === domainId ? null : domainId));
  };

  return (
    <div className="bg-[#ffffff] border-2 border-[#d3c5ab] rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#fff8f2] via-[#fdf6ec] to-[#f8ecdb] p-5 md:p-6 border-b border-[#d3c5ab] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#201b11] text-[#fff8f2]">
                {isFr ? 'Profil de compétences central' : 'Core Competency Profile'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#28A745]/15 text-[#28A745]">
                {isFr ? 'Pondération 5 dimensions' : '5-Pillar Weighting'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ffffff] text-[#785a00] border border-[#ffc20e]">
                {profile.overallScore}% {isFr ? 'Global' : 'Overall'} • {profile.overallLevelFr}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#201b11] tracking-tight mt-1 flex items-center gap-2">
              <span>Linux Skill Profile</span>
            </h3>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 max-w-2xl">
              {isFr
                ? 'Représentation consolidée de votre compétence technique réelle, combinant la pratique terminal (30%), les QCM (25%), le dépannage (20%), la mémorisation SRS (15%) et les examens blancs (10%).'
                : 'Consolidated representation of your genuine technical competence combining practical labs (30%), quizzes (25%), troubleshooting (20%), SRS retention (15%), and exam simulations (10%).'}
            </p>
          </div>
        </div>

        {/* Action Controls & View Mode */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="bg-[#ffffff] p-1 rounded-xl border border-[#d3c5ab] flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'interactive'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-2xs'
                  : 'text-[#4f4632] hover:bg-[#fff8f2]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vue Détaillée' : 'Detailed'}</span>
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
                viewMode === 'terminal'
                  ? 'bg-[#1c1b18] text-[#38ef7d] shadow-2xs'
                  : 'text-[#4f4632] hover:bg-[#fff8f2]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vue ASCII / Terminal' : 'ASCII / Terminal'}</span>
            </button>
          </div>

          <button
            onClick={handleCopyAscii}
            className="px-3.5 py-2 rounded-xl bg-[#ffffff] hover:bg-[#fff8f2] border border-[#d3c5ab] text-[#785a00] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title={isFr ? 'Copier le profil au format texte / ASCII' : 'Copy ASCII Profile'}
          >
            {copied ? <Check className="w-4 h-4 text-[#28A745]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isFr ? 'Copié !' : 'Copied!') : isFr ? 'Copier ASCII' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 2. Weighting Formula Ribbon */}
      <div className="bg-[#fffdfa] border-b border-[#ebdcc8] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#817660] uppercase tracking-wider text-[10px]">
            {isFr ? 'Formule de calcul :' : 'Formula:'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#3182ce]/10 text-[#2b6cb0] font-bold border border-[#3182ce]/20">
            QCM <span className="font-mono">25%</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#805ad5]/10 text-[#6b46c1] font-bold border border-[#805ad5]/20">
            Flashcards <span className="font-mono">15%</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#28A745]/10 text-[#22863a] font-bold border border-[#28A745]/20">
            Labs <span className="font-mono">30%</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e53e3e]/10 text-[#c53030] font-bold border border-[#e53e3e]/20">
            Troubleshooting <span className="font-mono">20%</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ffc20e]/20 text-[#785a00] font-bold border border-[#ffc20e]/40">
            Examens <span className="font-mono">10%</span>
          </span>
        </div>

        {viewMode === 'interactive' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#ffc20e] text-[#6d5100]'
                  : 'text-[#817660] hover:bg-[#f2e7d6]'
              }`}
            >
              {isFr ? 'Tous (9)' : 'All (9)'}
            </button>
            <button
              onClick={() => setSelectedFilter('priority')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                selectedFilter === 'priority'
                  ? 'bg-[#ba1a1a] text-white'
                  : 'text-[#817660] hover:bg-[#f2e7d6]'
              }`}
            >
              {isFr ? 'À renforcer (<60%)' : 'Needs Work (<60%)'}
            </button>
            <button
              onClick={() => setSelectedFilter('mastered')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                selectedFilter === 'mastered'
                  ? 'bg-[#28A745] text-white'
                  : 'text-[#817660] hover:bg-[#f2e7d6]'
              }`}
            >
              {isFr ? 'Maîtrisés (≥75%)' : 'Mastered (≥75%)'}
            </button>
          </div>
        )}
      </div>

      {/* 3. Main Content Views */}
      {viewMode === 'terminal' ? (
        /* Terminal Sysadmin ASCII View */
        <div className="p-5 md:p-6 bg-[#161512] text-[#38ef7d] font-mono selection:bg-[#38ef7d] selection:text-[#161512]">
          <div className="flex items-center justify-between border-b border-[#2d2c27] pb-3 mb-4 text-xs text-[#a0aec0]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#e53e3e] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#dd6b20] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#38ef7d] inline-block" />
              <span className="ml-2 font-mono text-[#cbd5e0]">sysadmin@lpic-station:~$ ./render-linux-skill-profile.sh</span>
            </div>
            <button
              onClick={handleCopyAscii}
              className="text-xs hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'COPIED!' : 'COPY OUTPUT'}</span>
            </button>
          </div>

          <pre className="text-sm md:text-base leading-relaxed overflow-x-auto whitespace-pre font-mono">
            {profile.asciiTable}
          </pre>

          <div className="mt-5 pt-4 border-t border-[#2d2c27] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#a0aec0]">
            <div>
              <span className="text-[#e2e8f0] block font-bold">STATUS RÉALISATIONS :</span>
              <span>{profile.totalCompletedActivities.labsCompleted} labs terminaux validés</span>
            </div>
            <div>
              <span className="text-[#e2e8f0] block font-bold">SRS RETENTION :</span>
              <span>{profile.totalCompletedActivities.flashcardsMastered} flashcards maîtrisées</span>
            </div>
            <div>
              <span className="text-[#e2e8f0] block font-bold">DÉPANNAGE EN PRODUCTION :</span>
              <span>{profile.totalCompletedActivities.troubleshootingSolved} incidents/bugs résolus</span>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Multi-Dimensional View */
        <div className="p-5 md:p-6 space-y-4">
          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            <div className="bg-[#f0fff4] border border-[#9ae6b4] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#28A745] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#276749] tracking-wider block">
                  {isFr ? 'Point Fort N°1' : 'Top Strength'}
                </span>
                <div className="text-sm font-bold text-[#1a202c] truncate">
                  {profile.topStrength.nameFr} ({profile.topStrength.score}%)
                </div>
                <div className="text-xs text-[#4a5568] truncate">
                  {profile.topStrength.summaryNoteFr}
                </div>
              </div>
            </div>

            <div className="bg-[#fff5f5] border border-[#feb2b2] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e53e3e] text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#9b2c2c] tracking-wider block">
                  {isFr ? 'Priorité d’Entraînement' : 'Top Priority'}
                </span>
                <div className="text-sm font-bold text-[#1a202c] truncate">
                  {profile.topWeakness.nameFr} ({profile.topWeakness.score}%)
                </div>
                <div className="text-xs text-[#4a5568] truncate">
                  {profile.topWeakness.recommendationFr}
                </div>
              </div>
            </div>
          </div>

          {/* 9 Core Domains Cards List */}
          <div className="space-y-3">
            {filteredDomains.map((domain) => {
              const isExpanded = expandedDomainId === domain.id;
              return (
                <div
                  key={domain.id}
                  className={`border rounded-xl transition-all duration-200 ${
                    isExpanded
                      ? 'border-[#ffc20e] bg-[#fffdfa] shadow-xs'
                      : 'border-[#d3c5ab]/80 bg-[#ffffff] hover:border-[#ffc20e]/70'
                  }`}
                >
                  {/* Domain Row Summary Bar */}
                  <div
                    onClick={() => toggleExpand(domain.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#fff8f2] border border-[#ebdcc8] shrink-0">
                        {getDomainIcon(domain.id)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm md:text-base text-[#201b11] truncate">
                            {domain.name}
                          </h4>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${domain.badgeColor}15`,
                              color: domain.badgeColor
                            }}
                          >
                            {domain.levelFr}
                          </span>
                        </div>
                        <p className="text-xs text-[#817660] truncate max-w-md mt-0.5">
                          {domain.descriptionFr}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Score */}
                    <div className="flex items-center gap-4 sm:shrink-0 justify-between sm:justify-end">
                      <div className="flex flex-col items-end gap-1 w-48 sm:w-56">
                        <div className="flex items-center justify-between w-full text-xs font-bold">
                          <span className="font-mono text-[#4a5568] text-[11px]">
                            {domain.asciiBar.split(' ')[0]}
                          </span>
                          <span
                            className="font-mono text-sm font-black"
                            style={{ color: domain.badgeColor }}
                          >
                            {domain.score}%
                          </span>
                        </div>
                        <div className="w-full bg-[#f2e7d6] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${domain.score}%`,
                              backgroundColor: domain.badgeColor
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-1 rounded-lg text-[#817660] hover:bg-[#fff8f2] transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded 5-Dimension Drilldown Panel */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-2 border-t border-[#ebdcc8] space-y-4 animate-in fade-in duration-150">
                      {/* Dimensions Breakdown Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                        {/* 1. QCM (25%) */}
                        <div className="bg-[#ffffff] p-3 rounded-xl border border-[#3182ce]/30 shadow-2xs">
                          <div className="flex justify-between items-center text-xs font-bold text-[#2b6cb0] mb-1">
                            <span>QCM (25%)</span>
                            <span className="font-mono">{domain.dimensions.qcm.score}%</span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#3182ce] rounded-full"
                              style={{ width: `${domain.dimensions.qcm.score}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-[#4a5568]">
                            {domain.dimensions.qcm.detailsFr}
                          </div>
                          <div className="text-[10px] text-[#817660] font-mono mt-0.5">
                            Apport: +{domain.dimensions.qcm.weightedContribution} pts
                          </div>
                        </div>

                        {/* 2. Flashcards (15%) */}
                        <div className="bg-[#ffffff] p-3 rounded-xl border border-[#805ad5]/30 shadow-2xs">
                          <div className="flex justify-between items-center text-xs font-bold text-[#6b46c1] mb-1">
                            <span>Flashcards (15%)</span>
                            <span className="font-mono">{domain.dimensions.flashcards.score}%</span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#805ad5] rounded-full"
                              style={{ width: `${domain.dimensions.flashcards.score}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-[#4a5568]">
                            {domain.dimensions.flashcards.detailsFr}
                          </div>
                          <div className="text-[10px] text-[#817660] font-mono mt-0.5">
                            Apport: +{domain.dimensions.flashcards.weightedContribution} pts
                          </div>
                        </div>

                        {/* 3. Labs (30%) */}
                        <div className="bg-[#ffffff] p-3 rounded-xl border border-[#28A745]/30 shadow-2xs">
                          <div className="flex justify-between items-center text-xs font-bold text-[#22863a] mb-1">
                            <span>Labs (30%)</span>
                            <span className="font-mono">{domain.dimensions.labs.score}%</span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#28A745] rounded-full"
                              style={{ width: `${domain.dimensions.labs.score}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-[#4a5568]">
                            {domain.dimensions.labs.detailsFr}
                          </div>
                          <div className="text-[10px] text-[#817660] font-mono mt-0.5">
                            Apport: +{domain.dimensions.labs.weightedContribution} pts
                          </div>
                        </div>

                        {/* 4. Troubleshooting (20%) */}
                        <div className="bg-[#ffffff] p-3 rounded-xl border border-[#e53e3e]/30 shadow-2xs">
                          <div className="flex justify-between items-center text-xs font-bold text-[#c53030] mb-1">
                            <span>Dépannage (20%)</span>
                            <span className="font-mono">
                              {domain.dimensions.troubleshooting.score}%
                            </span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#e53e3e] rounded-full"
                              style={{ width: `${domain.dimensions.troubleshooting.score}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-[#4a5568]">
                            {domain.dimensions.troubleshooting.detailsFr}
                          </div>
                          <div className="text-[10px] text-[#817660] font-mono mt-0.5">
                            Apport: +{domain.dimensions.troubleshooting.weightedContribution} pts
                          </div>
                        </div>

                        {/* 5. Examens (10%) */}
                        <div className="bg-[#ffffff] p-3 rounded-xl border border-[#ffc20e]/50 shadow-2xs">
                          <div className="flex justify-between items-center text-xs font-bold text-[#785a00] mb-1">
                            <span>Examens (10%)</span>
                            <span className="font-mono">{domain.dimensions.exams.score}%</span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#ffc20e] rounded-full"
                              style={{ width: `${domain.dimensions.exams.score}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-[#4a5568]">
                            {domain.dimensions.exams.detailsFr}
                          </div>
                          <div className="text-[10px] text-[#817660] font-mono mt-0.5">
                            Apport: +{domain.dimensions.exams.weightedContribution} pts
                          </div>
                        </div>
                      </div>

                      {/* Commands & Pedagogical Action Ribbon */}
                      <div className="bg-[#fff8f2] p-4 rounded-xl border border-[#ebdcc8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-xl">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660]">
                              {isFr ? 'Commandes clés :' : 'Key commands:'}
                            </span>
                            {domain.keyCommands.map((cmd) => (
                              <code
                                key={cmd}
                                className="px-1.5 py-0.5 rounded bg-[#ffffff] border border-[#d3c5ab] text-[11px] font-mono font-bold text-[#201b11]"
                              >
                                {cmd}
                              </code>
                            ))}
                          </div>
                          <p className="text-xs text-[#4f4632]">
                            <strong className="text-[#201b11]">
                              {isFr ? 'Recommandation : ' : 'Recommendation: '}
                            </strong>
                            {domain.recommendationFr}
                          </p>
                        </div>

                        {/* Direct CTA shortcuts */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {onNavigateToTab && (
                            <button
                              onClick={() => onNavigateToTab('training')}
                              className="px-3 py-1.5 rounded-lg bg-[#28A745] hover:bg-[#218838] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Terminal className="w-3.5 h-3.5" />
                              <span>{isFr ? 'Atelier Lab' : 'Lab'}</span>
                            </button>
                          )}
                          {onNavigateToTab && (
                            <button
                              onClick={() => onNavigateToTab('training')}
                              className="px-3 py-1.5 rounded-lg bg-[#c53030] hover:bg-[#9b2c2c] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>{isFr ? 'Dépanner' : 'Troubleshoot'}</span>
                            </button>
                          )}
                          {onOpenFlashcards && (
                            <button
                              onClick={() => onOpenFlashcards('srs-daily')}
                              className="px-3 py-1.5 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>{isFr ? 'SRS' : 'Flashcards'}</span>
                            </button>
                          )}
                          {onStartExam && (
                            <button
                              onClick={() => onStartExam('exam-101')}
                              className="px-3 py-1.5 rounded-lg bg-[#201b11] hover:bg-[#38332a] text-[#fff8f2] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                              <span>{isFr ? 'Test QCM' : 'Quiz'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
