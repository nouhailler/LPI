import React from 'react';
import {
  CheckCircle2,
  Lock,
  Award,
  Zap,
  BookOpen,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Target,
  ExternalLink,
} from 'lucide-react';
import { LearningMapNodeData } from './learningMapData';

interface LearningMapNodeCardProps {
  node: LearningMapNodeData;
  isSelected: boolean;
  isActiveTarget: boolean;
  isFrench: boolean;
  onSelect: (nodeId: string) => void;
  onStartExam: (examId: string) => void;
  onOpenFlashcards?: (topicKey: string) => void;
  onOpenLabs: () => void;
  onOpenObjectives?: (topicId: string) => void;
  compact?: boolean;
}

export const LearningMapNodeCard: React.FC<LearningMapNodeCardProps> = ({
  node,
  isSelected,
  isActiveTarget,
  isFrench,
  onSelect,
  onStartExam,
  onOpenFlashcards,
  onOpenLabs,
  onOpenObjectives,
  compact = false,
}) => {
  const readinessTheme = {
    not_started: {
      bg: 'bg-[#f4ebe1]',
      text: 'text-[#817660]',
      border: 'border-[#d3c5ab]',
      dot: 'bg-[#817660]',
    },
    needs_work: {
      bg: 'bg-[#ffdad6]/50',
      text: 'text-[#ba1a1a]',
      border: 'border-[#ba1a1a]/30',
      dot: 'bg-[#ba1a1a]',
    },
    on_track: {
      bg: 'bg-[#e0f2fe]',
      text: 'text-[#0284c7]',
      border: 'border-[#0284c7]/30',
      dot: 'bg-[#0284c7]',
    },
    ready: {
      bg: 'bg-[#dcfce7]',
      text: 'text-[#16a34a]',
      border: 'border-[#16a34a]/30',
      dot: 'bg-[#16a34a]',
    },
  }[node.readinessStatus];

  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer text-left overflow-hidden group flex flex-col justify-between ${
        isSelected
          ? 'bg-[#ffffff] border-[#785a00] shadow-md ring-2 ring-[#785a00]/30 -translate-y-0.5'
          : isActiveTarget
          ? 'bg-[#ffffff] border-[#ffc20e] shadow-sm hover:border-[#785a00]'
          : 'bg-[#ffffff] border-[#d3c5ab] hover:border-[#817660] hover:shadow-xs'
      }`}
    >
      {/* Top Target Indicator Accent */}
      {isActiveTarget && (
        <div className="bg-[#ffc20e] text-[#6d5100] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {isFrench ? 'Objectif de certification actif' : 'Active Certification Target'}
          </span>
          <span>★</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 md:p-5 flex flex-col gap-3.5">
        {/* Header: Code, Tier Badge & Readiness Pill */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shrink-0"
              style={{ backgroundColor: node.tierBadgeColor }}
            >
              {node.tierLabel}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]/60 shrink-0">
              {node.code}
            </span>
          </div>

          {/* Readiness Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${readinessTheme.bg} ${readinessTheme.text} ${readinessTheme.border}`}
            title={isFrench ? 'Indicateur de préparation' : 'Readiness indicator'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${readinessTheme.dot}`} />
            <span className="font-mono">{node.readinessPct}%</span>
            <span className="hidden sm:inline">· {isFrench ? node.readinessLabelFr : node.readinessLabel}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-sans text-base md:text-lg font-bold text-[#201b11] group-hover:text-[#785a00] transition-colors leading-snug">
            {isFrench ? node.titleFr : node.title}
          </h3>
          <p className="text-xs text-[#4f4632] line-clamp-2 mt-0.5 leading-relaxed">
            {isFrench ? node.subtitleFr : node.subtitle}
          </p>
        </div>

        {/* 1. Progression Bar (Live syllabus objectives) */}
        <div className="bg-[#fff8f2] border border-[#d3c5ab]/60 rounded-lg p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#817660] flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <span>{isFrench ? 'Progression' : 'Progression'}</span>
              <span className="text-[#4f4632] font-normal lowercase">
                ({node.masteredObjectivesCount}/{node.totalObjectivesCount} obj)
              </span>
            </span>
            <span className="font-bold font-mono text-sm text-[#785a00]">
              {node.progressionPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#ece1d0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${node.progressionPct}%`,
                backgroundColor: node.progressionPct === 100 ? '#16a34a' : node.accentColor,
              }}
            />
          </div>
        </div>

        {/* 2 to 6. Four Key Pillar Badges: Questions, Flashcards, Labs, Examens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {/* Questions */}
          <div className="bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg p-2 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-[#817660] block">
              {isFrench ? 'Questions' : 'Questions'}
            </span>
            <span className="font-mono font-bold text-xs text-[#201b11]">
              {node.questionsCount} Q
            </span>
          </div>

          {/* Flashcards */}
          <div className="bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg p-2 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-[#817660] block">
              Flashcards
            </span>
            <span className="font-mono font-bold text-xs text-[#0061a4]">
              {node.flashcardsCount}
            </span>
          </div>

          {/* Labs */}
          <div className="bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg p-2 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-[#817660] block">
              Labs
            </span>
            <span className="font-mono font-bold text-xs text-[#785a00]">
              {node.labsCount}
            </span>
          </div>

          {/* Examens */}
          <div className="bg-[#fef2e1] border border-[#d3c5ab]/70 rounded-lg p-2 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-[#817660] block">
              {isFrench ? 'Examen' : 'Exam'}
            </span>
            <span className="font-mono font-bold text-[11px] text-[#201b11]">
              {node.examDetails.durationMinutes}m / 500p
            </span>
          </div>
        </div>
      </div>

      {/* Footer Quick Action Toolbar */}
      <div className="bg-[#f8ecdb]/60 border-t border-[#d3c5ab] px-3 py-2.5 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartExam(node.id);
            }}
            className="px-2.5 py-1.5 rounded-md bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-[11px] uppercase tracking-wider transition-colors shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
            title={isFrench ? 'Lancer un examen blanc sur ce module' : 'Launch practice exam for this module'}
          >
            <Award className="w-3 h-3" />
            <span>{isFrench ? 'Examen' : 'Exam'}</span>
          </button>

          {onOpenFlashcards && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFlashcards(node.flashcardTopicKey);
              }}
              className="px-2 py-1.5 rounded-md bg-[#ffffff] hover:bg-[#ebdcc8] text-[#0061a4] border border-[#d3c5ab] font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
              title={isFrench ? 'Réviser les flashcards de ce module' : 'Review flashcards'}
            >
              <Layers className="w-3 h-3" />
              <span>Cards</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLabs();
            }}
            className="px-2 py-1.5 rounded-md bg-[#ffffff] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
            title={isFrench ? 'Pratiquer sur les labs interactifs' : 'Hands-on practice labs'}
          >
            <Zap className="w-3 h-3" />
            <span>Labs</span>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node.id);
          }}
          className="text-xs font-bold text-[#817660] hover:text-[#201b11] flex items-center gap-0.5 cursor-pointer pl-1"
        >
          <span>{isFrench ? 'Détails' : 'Details'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
