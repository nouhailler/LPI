import React, { useState } from 'react';
import {
  Terminal,
  AlertTriangle,
  ListOrdered,
  Link2,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Flame,
  ArrowRight
} from 'lucide-react';
import { TrainingModeType } from '../../types';
import {
  fillInTheBlankChallenges,
  troubleshootingChallenges,
  sequencingChallenges,
  matchingGames,
  guidedLabScenarios,
  incidentScenarios,
} from '../../data/trainingData';
import { FillInTheBlankModule } from './FillInTheBlankModule';
import { TroubleshootingModule } from './TroubleshootingModule';
import { SequencingModule } from './SequencingModule';
import { MatchingModule } from './MatchingModule';
import { GuidedMiniLabsModule } from './GuidedMiniLabsModule';
import { IncidentResponseModule } from './IncidentResponseModule';
import { VirtualTerminalModule } from './VirtualTerminalModule';
import { WeaknessTrainingModal } from '../weakness/WeaknessTrainingModal';
import { getWeaknessReport } from '../../utils/weaknessEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  initialMode?: TrainingModeType;
  onNavigateTab?: (tab: any) => void;
}

export const TrainingHubView: React.FC<Props> = ({ initialMode = 'incident_response', onNavigateTab }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [currentMode, setCurrentMode] = useState<TrainingModeType>(initialMode);
  const [totalScore, setTotalScore] = useState(0);
  const [isWeaknessModalOpen, setIsWeaknessModalOpen] = useState(false);
  const report = getWeaknessReport();

  const handleScoreUpdate = (points: number) => {
    setTotalScore((prev) => prev + points);
  };

  const trainingModes: {
    id: TrainingModeType;
    label: string;
    labelFr: string;
    badge: string;
    icon: React.FC<{ className?: string }>;
    description: string;
    descriptionFr: string;
  }[] = [
    {
      id: 'virtual_terminal',
      label: 'Virtual Terminal & Labs',
      labelFr: '🖥️ Terminal Virtuel & Labs',
      badge: '100% PWA & Offline — VirtualFS',
      icon: Terminal,
      description: 'Simulated JavaScript Linux engine with real VirtualFS (/home/student, /etc, /var/log). Run real chmod, chown, grep, find, tar, ps, kill, and verify exact filesystem state offline!',
      descriptionFr: 'Moteur Linux simulé 100% JavaScript avec filesystem virtuel (/home/student, /etc, /var/log). Exécutez chmod, chown, grep, find, tar, ps, kill et vérifiez l\'état réel du système hors-ligne !',
    },
    {
      id: 'incident_response',
      label: 'Incident Response',
      labelFr: '🚨 Incident Response',
      badge: `${incidentScenarios.length} scénarios d'astreinte réels`,
      icon: ShieldAlert,
      description: 'Realistic live enterprise outage scenarios with 15-minute countdown, diagnostic console (journalctl, systemctl, ip, ss, df, mount), progressive clues, and root-cause analysis (RCA).',
      descriptionFr: 'Scénarios réels de pannes en production avec compte à rebours de 15 minutes, console de diagnostic (journalctl, systemctl, ip, ss, df, mount), indices progressifs et analyse RCA.',
    },
    {
      id: 'fill_in_blank',
      label: 'Fill-in-the-Blank',
      labelFr: 'Saisie exacte',
      badge: `${fillInTheBlankChallenges.length} défis (100 LPIC-3 + 100 LPIC-2 + 100 LPIC-1)`,
      icon: Terminal,
      description: '100 challenges exclusively for LPIC-3 (Security, Cloud, HA, AD) + 100 for LPIC-2 + 100 for LPIC-1. Direct command typing.',
      descriptionFr: '100 défis exclusifs LPIC-3 (Sécurité, Cloud KVM, Clusters HA, Samba AD) + 100 LPIC-2 + 100 LPIC-1. Saisie directe.',
    },
    {
      id: 'troubleshooting',
      label: 'Troubleshooting',
      labelFr: 'Défis dépannage',
      badge: `${troubleshootingChallenges.length} défis (100 LPIC-3 + 100 LPIC-2 + 100 LPIC-1)`,
      icon: AlertTriangle,
      description: '100 troubleshooting challenges exclusively for LPIC-3 (Exams 300, 303, 305, 306) + 100 exclusively for LPIC-2 (Exams 201, 202) + 100 exclusively for LPIC-1 (Exams 101, 102). Diagnose and resolve real enterprise incidents.',
      descriptionFr: '100 défis de dépannage EXCLUSIFS pour LPIC-3 (Examens 300, 303, 305, 306) + 100 EXCLUSIFS pour LPIC-2 (Examens 201 et 202) + 100 EXCLUSIFS pour LPIC-1. Résoudre des pannes réelles d\'infrastructure et d\'administration système.',
    },
    {
      id: 'sequencing',
      label: 'Sequencing',
      labelFr: 'Ordonnancement',
      badge: `${sequencingChallenges.length} protocoles (40 LPIC-1 + 40 LPIC-2 + 40 LPIC-3)`,
      icon: ListOrdered,
      description: '120 sequencing challenges for LPIC-1 (Exams 101 & 102), LPIC-2 (Exams 201 & 202), and LPIC-3 (Specialties 300, 303, 305, 306) with filters by certification, exam, and topic. Reorder real enterprise administration procedures.',
      descriptionFr: '120 exercices d\'ordonnancement pour LPIC-1 (Examens 101 & 102), LPIC-2 (Examens 201 & 202) et LPIC-3 (Spécialités 300, 303, 305, 306) avec filtres par certification, examen et topic. Ordonner des procédures d\'administration réelles.',
    },
    {
      id: 'matching',
      label: 'Matching Games',
      labelFr: 'Appariement',
      badge: `${matchingGames.length} ateliers (20 LPIC-1 + 20 LPIC-2 + 20 LPIC-3)`,
      icon: Link2,
      description: '60 matching games across LPIC-1 (Exams 101 & 102), LPIC-2 (Exams 201 & 202), and LPIC-3 (Specialties 300, 303, 305, 306). Fast mental associations of commands, config directives, and core concepts.',
      descriptionFr: '60 ateliers d\'appariement pour LPIC-1 (101 & 102), LPIC-2 (201 & 202) et LPIC-3 (300, 303, 305, 306). Associations réflexes de commandes, directives et concepts clés.',
    },
    {
      id: 'guided_labs',
      label: 'Guided Labs',
      labelFr: 'Mini-Labs guidés',
      badge: `${guidedLabScenarios.length} missions (20 LPIC-1 + 20 LPIC-2 + 20 LPIC-3)`,
      icon: Sparkles,
      description: '60 interactive guided mini-labs for LPIC-1 (101/102), LPIC-2 (201/202), and LPIC-3 (300/303/305/306) with simulated terminal, step-by-step verification, and command tolerance.',
      descriptionFr: '60 mini-labs guidés pas à pas pour LPIC-1 (101/102), LPIC-2 (201/202) et LPIC-3 (300/303/305/306) avec terminal interactif et tolérance de saisie.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#201b11] via-[#2c2417] to-[#1e1910] text-[#f7f4ea] rounded-2xl p-6 shadow-sm border border-[#3d3424] relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffc20e]/20 text-[#ffc20e] text-[11px] font-bold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>{isFr ? 'Ateliers d\'entraînement intensif' : 'Hands-On Practice Labs'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight text-white">
              {isFr ? 'Ateliers Pratiques & Terminal Virtuel PWA' : 'Hands-On Labs & PWA Virtual Terminal'}
            </h2>
            <p className="text-xs md:text-sm text-[#d3c5ab] leading-relaxed">
              {isFr
                ? 'Préparez l\'examen LPI avec les formats réels : terminal simulé 100% hors-ligne (VirtualFS), astreinte Incident Response, saisie directe, pannes système et ordonnancement.'
                : 'Master the LPI exams with authentic formats: 100% offline simulated terminal (VirtualFS), live Incident Response, exact command typing, troubleshooting, and sequencing.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/10">
            <Award className="w-6 h-6 text-[#ffc20e]" />
            <div>
              <div className="text-[10px] uppercase font-bold text-white/70">
                {isFr ? 'Score Session Pratique' : 'Practice Score'}
              </div>
              <div className="text-lg font-bold text-[#ffc20e]">{totalScore} pts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weakness Engine Targeted Banner */}
      <div className="bg-[#fff8f2] border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
            <Flame className="w-5 h-5 fill-red-500/30 text-red-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                {isFr ? '🔥 Vos points faibles' : '🔥 Priority Weaknesses'}
              </span>
              <span className="text-xs font-mono font-bold text-[#4f4632]">
                {report.domains.slice(0, 3).map((d) => `${d.nameFr.split('(')[0].trim()} ${d.masteryPct}%`).join(' • ')}
              </span>
            </div>
            <p className="text-xs text-[#4f4632] mt-1">
              {isFr
                ? 'L\'algorithme a détecté vos principales lacunes (DNS, routing, scripts, SELinux). Entraînez-vous avec des questions adaptatives ciblées.'
                : 'The engine pinpointed your highest error rates (DNS, routing, shell, SELinux). Train with targeted adaptive challenges.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsWeaknessModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-98"
        >
          <Flame className="w-4 h-4 fill-white/30" />
          <span>{isFr ? 'Entraîner mes faiblesses' : 'Train Weaknesses'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {trainingModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-[#ffc20e] border-[#785a00] text-[#6d5100] shadow-sm ring-1 ring-[#785a00]'
                  : 'bg-white border-[#d3c5ab] text-[#4f4632] hover:bg-[#fffcf7] hover:border-[#b5a790]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-[#6d5100]/20 text-[#6d5100]' : 'bg-[#f8ecdb] text-[#785a00]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#6d5100] text-[#ffc20e]' : 'bg-[#ebdcc8] text-[#785a00]'
                  }`}
                >
                  {mode.badge}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">
                  {isFr ? mode.labelFr : mode.label}
                </div>
                <div
                  className={`text-[10.5px] line-clamp-1 mt-0.5 ${
                    isActive ? 'text-[#6d5100]/80' : 'text-[#817660]'
                  }`}
                >
                  {isFr ? mode.descriptionFr : mode.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Selected Module */}
      <div className="transition-all">
        {currentMode === 'virtual_terminal' && (
          <VirtualTerminalModule
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentMode === 'incident_response' && (
          <IncidentResponseModule
            scenarios={incidentScenarios}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentMode === 'fill_in_blank' && (
          <FillInTheBlankModule
            challenges={fillInTheBlankChallenges}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentMode === 'troubleshooting' && (
          <TroubleshootingModule
            challenges={troubleshootingChallenges}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentMode === 'sequencing' && (
          <SequencingModule
            challenges={sequencingChallenges}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentMode === 'matching' && (
          <MatchingModule
            games={matchingGames}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {currentMode === 'guided_labs' && (
          <GuidedMiniLabsModule
            scenarios={guidedLabScenarios}
            onScoreUpdate={handleScoreUpdate}
          />
        )}
      </div>

      {/* Weakness Engine Training Modal */}
      <WeaknessTrainingModal
        isOpen={isWeaknessModalOpen}
        onClose={() => setIsWeaknessModalOpen(false)}
      />
    </div>
  );
};
