import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Award,
  Zap,
  BookOpen,
  Layers,
  Target,
  Clock,
  Compass,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  ExternalLink,
} from 'lucide-react';
import { LearningMapNodeData } from './learningMapData';
import { allLpicTopicsData } from '../../data/lpicObjectivesData';

interface NodeDetailDrawerProps {
  node: LearningMapNodeData;
  isOpen: boolean;
  onClose: () => void;
  isFrench: boolean;
  isActiveTarget: boolean;
  onSetTarget: (targetName: string) => void;
  onStartExam: (examId: string) => void;
  onOpenFlashcards?: (topicKey: string) => void;
  onOpenLabs: () => void;
  onOpenObjectives?: (topicId: string) => void;
  masteredObjectiveIds: string[];
  onToggleObjectiveMastery: (objectiveId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  isOpen,
  onClose,
  isFrench,
  isActiveTarget,
  onSetTarget,
  onStartExam,
  onOpenFlashcards,
  onOpenLabs,
  onOpenObjectives,
  masteredObjectiveIds,
  onToggleObjectiveMastery,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    [node.defaultTopicId]: true,
  });

  if (!isOpen) return null;

  // Filter topics for this exam
  const examTopics = allLpicTopicsData.filter((top) => top.examId === node.id);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const readinessTheme = {
    not_started: {
      bg: 'bg-[#f4ebe1]',
      text: 'text-[#817660]',
      border: 'border-[#d3c5ab]',
    },
    needs_work: {
      bg: 'bg-[#ffdad6]/60',
      text: 'text-[#ba1a1a]',
      border: 'border-[#ba1a1a]/40',
    },
    on_track: {
      bg: 'bg-[#e0f2fe]',
      text: 'text-[#0284c7]',
      border: 'border-[#0284c7]/40',
    },
    ready: {
      bg: 'bg-[#dcfce7]',
      text: 'text-[#16a34a]',
      border: 'border-[#16a34a]/40',
    },
  }[node.readinessStatus];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#ffffff] h-full shadow-2xl flex flex-col justify-between border-l border-[#d3c5ab] overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 md:p-6 border-b border-[#d3c5ab] bg-[#fff8f2] sticky top-0 z-20 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: node.tierBadgeColor }}
              >
                {node.tierLabel}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]">
                {node.code}
              </span>
              {isActiveTarget && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffc20e] text-[#6d5100]">
                  ★ {isFrench ? 'Objectif Prioritaire' : 'Priority Target'}
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-[#201b11] leading-tight">
              {isFrench ? node.titleFr : node.title}
            </h2>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
              {isFrench ? node.subtitleFr : node.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#817660] hover:text-[#201b11] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 md:p-6 flex flex-col gap-6 flex-1">
          {/* Readiness & Progress Diagnostic Banner */}
          <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl p-4 md:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660] block">
                  {isFrench ? 'Diagnostic de Préparation' : 'Readiness Diagnostic'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold font-mono text-[#201b11]">
                    {node.readinessPct}%
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${readinessTheme.bg} ${readinessTheme.text} ${readinessTheme.border}`}
                  >
                    {isFrench ? node.readinessLabelFr : node.readinessLabel}
                  </span>
                </div>
              </div>

              {!isActiveTarget && (
                <button
                  onClick={() => onSetTarget(node.tierLabel)}
                  className="px-3 py-1.5 bg-[#ffffff] hover:bg-[#fff8f2] text-[#785a00] border border-[#d3c5ab] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{isFrench ? 'Cibler ce palier' : 'Set as Target'}</span>
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#6e634e]">
                <span>{isFrench ? 'Objectifs du référentiel validés' : 'Mastered syllabus objectives'}</span>
                <span>
                  {node.masteredObjectivesCount} / {node.totalObjectivesCount} ({node.progressionPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#ece1d0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#785a00] to-[#ffc20e] rounded-full transition-all duration-500"
                  style={{ width: `${node.progressionPct}%` }}
                />
              </div>
            </div>

            {/* Prerequisites */}
            <div className="text-xs bg-[#ffffff] p-2.5 rounded-lg border border-[#d3c5ab]/60 flex items-center justify-between">
              <span className="font-bold text-[#817660]">{isFrench ? 'Prérequis :' : 'Prerequisites:'}</span>
              <span className="font-medium text-[#201b11]">{isFrench ? node.prerequisitesFr : node.prerequisites}</span>
            </div>
          </div>

          {/* 4 Pillars Breakdown (Questions, Flashcards, Labs, Exam) */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#817660]">
              {isFrench ? 'Ressources & Entraînement disponibles' : 'Resources & Training Modules'}
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Practice Exam Pill */}
              <div
                onClick={() => {
                  onClose();
                  onStartExam(node.id);
                }}
                className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#ffffff] hover:bg-[#fef2e1] hover:border-[#785a00] cursor-pointer transition-all flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#ffc20e]/30 text-[#785a00] flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-[#785a00] uppercase group-hover:underline">
                    {isFrench ? 'Lancer →' : 'Launch →'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#201b11]">{isFrench ? 'Examen Blanc' : 'Practice Exam'}</h4>
                <p className="text-xs text-[#4f4632]">
                  {node.questionsCount} questions · {node.examDetails.durationMinutes} min
                </p>
              </div>

              {/* Flashcards Pill */}
              {onOpenFlashcards && (
                <div
                  onClick={() => {
                    onClose();
                    onOpenFlashcards(node.flashcardTopicKey);
                  }}
                  className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#ffffff] hover:bg-[#fef2e1] hover:border-[#0061a4] cursor-pointer transition-all flex flex-col gap-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-[#e0f2fe] text-[#0061a4] flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-[#0061a4] uppercase group-hover:underline">
                      {isFrench ? 'Réviser →' : 'Study →'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#201b11]">Flashcards</h4>
                  <p className="text-xs text-[#4f4632]">
                    {node.flashcardsCount} cartes mémo
                  </p>
                </div>
              )}

              {/* Labs Pill */}
              <div
                onClick={() => {
                  onClose();
                  onOpenLabs();
                }}
                className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#ffffff] hover:bg-[#fef2e1] hover:border-[#785a00] cursor-pointer transition-all flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#fff8f2] text-[#785a00] border border-[#d3c5ab] flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold text-[#785a00] uppercase group-hover:underline">
                    {isFrench ? 'Pratiquer →' : 'Practice →'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#201b11]">{isFrench ? 'Labs & Dépannage' : 'Incident Labs'}</h4>
                <p className="text-xs text-[#4f4632]">
                  {node.labsCount} scénarios CLI guidés
                </p>
              </div>

              {/* Official Exam Info Pill */}
              <div className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#f8ecdb]/60 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#ffffff] text-[#785a00] flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono text-[#817660]">
                    {node.examDetails.officialCode}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#201b11]">{isFrench ? 'Format Officiel' : 'Official Format'}</h4>
                <p className="text-xs text-[#4f4632]">
                  {node.examDetails.totalOfficialQuestions} Q · Seuil {node.examDetails.passingScore}
                </p>
              </div>
            </div>
          </div>

          {/* Official Topics & Objectives Checklist */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#817660]">
                {isFrench ? 'Objectifs Officiels LPI' : 'Official LPI Syllabus Objectives'}
              </span>
              <span className="text-xs text-[#817660]">
                {isFrench ? 'Cocher pour marquer comme acquis' : 'Click to toggle mastery'}
              </span>
            </div>

            {examTopics.length > 0 ? (
              <div className="flex flex-col gap-3">
                {examTopics.map((top) => {
                  const isExpanded = expandedTopics[top.id] ?? false;
                  const topicObjs = top.objectives || [];
                  const masteredInTopic = topicObjs.filter((o) =>
                    masteredObjectiveIds.includes(o.id)
                  ).length;

                  return (
                    <div
                      key={top.id}
                      className="border border-[#d3c5ab] rounded-xl overflow-hidden bg-[#ffffff]"
                    >
                      {/* Topic Bar */}
                      <button
                        onClick={() => toggleTopicExpand(top.id)}
                        className="w-full p-3.5 bg-[#f8ecdb]/50 hover:bg-[#f8ecdb] flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#ffffff] text-[#785a00] border border-[#d3c5ab] shrink-0">
                            {top.id.replace('topic-', 'Topic ')}
                          </span>
                          <span className="font-bold text-sm text-[#201b11] truncate">
                            {top.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-[#785a00]">
                            {masteredInTopic}/{topicObjs.length}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#817660]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#817660]" />
                          )}
                        </div>
                      </button>

                      {/* Objectives List */}
                      {isExpanded && (
                        <div className="p-3 divide-y divide-[#ece1d0]/70 flex flex-col gap-1 bg-[#ffffff]">
                          {topicObjs.map((obj) => {
                            const isMastered = masteredObjectiveIds.includes(obj.id);
                            return (
                              <div
                                key={obj.id}
                                onClick={() => onToggleObjectiveMastery(obj.id)}
                                className="py-2.5 px-2 flex items-start gap-3 hover:bg-[#fff8f2] rounded-lg cursor-pointer transition-colors"
                              >
                                <div
                                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                    isMastered
                                      ? 'bg-[#16a34a] border-[#16a34a] text-white'
                                      : 'border-[#817660] bg-white hover:border-[#785a00]'
                                  }`}
                                >
                                  {isMastered && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-[#817660]">
                                      {obj.id}
                                    </span>
                                    <h5
                                      className={`text-xs font-semibold leading-snug ${
                                        isMastered ? 'line-through text-[#817660]' : 'text-[#201b11]'
                                      }`}
                                    >
                                      {obj.title}
                                    </h5>
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#f8ecdb] text-[#785a00] shrink-0 ml-auto">
                                      Poids {obj.weight}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-[#f8ecdb] border border-[#d3c5ab] rounded-xl text-center text-xs text-[#4f4632]">
                {isFrench
                  ? 'Consultez l\'onglet Cursus pour visualiser tous les objectifs du programme détaillé.'
                  : 'Check the Curriculum tab to view all detailed syllabus objectives.'}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 md:p-5 border-t border-[#d3c5ab] bg-[#fff8f2] sticky bottom-0 z-20 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onOpenObjectives) onOpenObjectives(node.defaultTopicId);
            }}
            className="px-4 py-2.5 border border-[#d3c5ab] hover:bg-[#f8ecdb] text-[#4f4632] hover:text-[#201b11] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isFrench ? 'Cours & Fiches' : 'Course Materials'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartExam(node.id);
            }}
            className="flex-1 py-3 px-5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Award className="w-4 h-4" />
            <span>{isFrench ? 'Lancer l\'Examen Blanc' : 'Start Practice Exam'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
