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
  HelpCircle
} from 'lucide-react';
import { TrainingModeType } from '../../types';
import {
  fillInTheBlankChallenges,
  troubleshootingChallenges,
  sequencingChallenges,
  matchingGames,
  guidedLabScenarios,
} from '../../data/trainingData';
import { FillInTheBlankModule } from './FillInTheBlankModule';
import { TroubleshootingModule } from './TroubleshootingModule';
import { SequencingModule } from './SequencingModule';
import { MatchingModule } from './MatchingModule';
import { GuidedMiniLabsModule } from './GuidedMiniLabsModule';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  initialMode?: TrainingModeType;
  onNavigateTab?: (tab: any) => void;
}

export const TrainingHubView: React.FC<Props> = ({ initialMode = 'fill_in_blank', onNavigateTab }) => {
  const { currentLanguage } = useLanguage();
  const isFr = currentLanguage === 'fr';

  const [currentMode, setCurrentMode] = useState<TrainingModeType>(initialMode);
  const [totalScore, setTotalScore] = useState(0);

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
      id: 'fill_in_blank',
      label: 'Fill-in-the-Blank',
      labelFr: 'Saisie exacte',
      badge: `${fillInTheBlankChallenges.length} défis`,
      icon: Terminal,
      description: 'Direct command typing without multiple choice, with tolerant syntax checking.',
      descriptionFr: 'Saisie libre de commandes et chemins sans QCM avec validation intelligente tolérante.',
    },
    {
      id: 'troubleshooting',
      label: 'Troubleshooting',
      labelFr: 'Défis dépannage',
      badge: `${troubleshootingChallenges.length} cas`,
      icon: AlertTriangle,
      description: 'Identify syntax flaws and errors in configuration files and scripts.',
      descriptionFr: 'Identifier et corriger les erreurs de syntaxe dans fstab, crontab, systemd, etc.',
    },
    {
      id: 'sequencing',
      label: 'Sequencing',
      labelFr: 'Ordonnancement',
      badge: `${sequencingChallenges.length} timelines`,
      icon: ListOrdered,
      description: 'Arrange boot steps, shell profile loads, and storage stages in order.',
      descriptionFr: 'Ordonner la séquence de boot, le chargement des profils shell, etc.',
    },
    {
      id: 'matching',
      label: 'Matching Games',
      labelFr: 'Appariement',
      badge: `${matchingGames.length} ateliers`,
      icon: Link2,
      description: 'Match signals, exit codes, ports, and FHS directories with fast associations.',
      descriptionFr: 'Associer signaux POSIX, codes de sortie, ports réseau et standards FHS.',
    },
    {
      id: 'guided_labs',
      label: 'Guided Labs',
      labelFr: 'Mini-Labs guidés',
      badge: `${guidedLabScenarios.length} missions`,
      icon: Sparkles,
      description: 'Step-by-step interactive simulated terminal missions with live validation.',
      descriptionFr: 'Missions d\'administration complètes pas à pas dans un terminal simulé.',
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
              {isFr ? 'Au-delà des Flashcards : 5 Ateliers Pratiques' : 'Beyond Flashcards: 5 Practical Training Modes'}
            </h2>
            <p className="text-xs md:text-sm text-[#d3c5ab] leading-relaxed">
              {isFr
                ? 'Préparez l\'examen LPI avec les formats réels : saisie sans choix multiples, analyse de pannes, chronologie des processus, associations rapides et mini-labs guidés.'
                : 'Master the LPI exams with authentic hands-on formats: fill-in-the-blank commands, bug troubleshooting, timeline sequencing, matching games, and guided terminal labs.'}
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

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
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
    </div>
  );
};
