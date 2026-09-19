import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  ChevronDown,
  Lock,
  CheckCircle2,
  Zap,
  BookOpen,
  Target,
  Sparkles,
  Info,
  Layers,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';
import { LearningMapNodeData } from './learningMapData';
import { LearningMapNodeCard } from './LearningMapNodeCard';
import { NodeDetailDrawer } from './NodeDetailDrawer';

interface LearningMapTreeProps {
  nodes: Record<string, LearningMapNodeData>;
  activeTarget: string;
  isFrench: boolean;
  onSetTarget: (target: string) => void;
  onStartExam: (examId: string) => void;
  onOpenFlashcards?: (topicKey: string) => void;
  onOpenLabs: () => void;
  onOpenObjectives?: (topicId: string) => void;
  masteredObjectiveIds: string[];
  onToggleObjectiveMastery: (objectiveId: string) => void;
}

export const LearningMapTree: React.FC<LearningMapTreeProps> = ({
  nodes,
  activeTarget,
  isFrench,
  onSetTarget,
  onStartExam,
  onOpenFlashcards,
  onOpenLabs,
  onOpenObjectives,
  masteredObjectiveIds,
  onToggleObjectiveMastery,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  // Tier aggregates for milestone cards
  const lpic1Completed =
    (nodes['exam-101']?.progressionPct ?? 0) >= 80 &&
    (nodes['exam-102']?.progressionPct ?? 0) >= 80;

  const lpic2Completed =
    (nodes['exam-201']?.progressionPct ?? 0) >= 80 &&
    (nodes['exam-202']?.progressionPct ?? 0) >= 80;

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-2">
      {/* Node Detail Inspection Drawer */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          isOpen={!!selectedNode}
          onClose={() => setSelectedNodeId(null)}
          isFrench={isFrench}
          isActiveTarget={activeTarget.includes(selectedNode.code) || activeTarget.includes(selectedNode.tierLabel)}
          onSetTarget={onSetTarget}
          onStartExam={onStartExam}
          onOpenFlashcards={onOpenFlashcards}
          onOpenLabs={onOpenLabs}
          onOpenObjectives={onOpenObjectives}
          masteredObjectiveIds={masteredObjectiveIds}
          onToggleObjectiveMastery={onToggleObjectiveMastery}
        />
      )}

      {/* ========================================================
          LEVEL 0: LINUX ESSENTIALS (Entry Level)
      ======================================================== */}
      <div className="flex flex-col items-center">
        {/* Tier Header Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0369a1] border border-[#0369a1]/20">
            {isFrench ? 'Point d\'entrée · Fondations Open Source' : 'Entry Point · Open Source Literacy'}
          </span>
        </div>

        {/* Essentials Card (Centered) */}
        <div className="w-full max-w-md">
          {nodes['exam-010'] && (
            <LearningMapNodeCard
              node={nodes['exam-010']}
              isSelected={selectedNodeId === 'exam-010'}
              isActiveTarget={activeTarget.includes('Essentials')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
            />
          )}
        </div>

        {/* Vertical Connector Line 0 -> 1 */}
        <div className="flex flex-col items-center my-2 text-[#817660]">
          <div className="w-0.5 h-8 bg-[#d3c5ab]" />
          <div className="w-6 h-6 rounded-full bg-[#f8ecdb] border border-[#d3c5ab] flex items-center justify-center text-[10px] text-[#785a00]">
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-0.5 h-4 bg-[#d3c5ab]" />
        </div>
      </div>

      {/* ========================================================
          LEVEL 1: LPIC-1 (Linux Administrator)
          ┌─────┴─────┐
        101           102
         │             │
         └──────┬──────┘
      ======================================================== */}
      <div className="flex flex-col items-center w-full">
        {/* LPIC-1 Milestone Hub Header */}
        <div className="bg-[#fff8f2] border-2 border-[#785a00] rounded-2xl px-5 py-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 max-w-lg w-full mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc20e]/30 text-[#785a00] flex items-center justify-center font-bold text-base shrink-0 border border-[#785a00]/30">
              1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#201b11]">
                  LPIC-1: Linux Administrator
                </h3>
                {lpic1Completed && (
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                )}
              </div>
              <p className="text-xs text-[#4f4632]">
                {isFrench
                  ? 'Exige la validation conjointe des examens 101 et 102'
                  : 'Requires passing both exams 101-500 and 102-500'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] shrink-0">
            {isFrench ? '2 Examens Requis' : '2 Required Exams'}
          </span>
        </div>

        {/* Branching Connectors: ┌─────┴─────┐ */}
        <div className="hidden md:flex flex-col items-center w-full max-w-3xl mb-2">
          <div className="w-0.5 h-4 bg-[#785a00]" />
          <div className="w-1/2 h-0.5 bg-[#785a00]" />
          <div className="w-1/2 flex justify-between">
            <div className="w-0.5 h-4 bg-[#785a00]" />
            <div className="w-0.5 h-4 bg-[#785a00]" />
          </div>
        </div>

        {/* 2 Child Exam Cards: 101 & 102 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {nodes['exam-101'] && (
            <LearningMapNodeCard
              node={nodes['exam-101']}
              isSelected={selectedNodeId === 'exam-101'}
              isActiveTarget={activeTarget.includes('LPIC-1') || activeTarget.includes('101')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
            />
          )}

          {nodes['exam-102'] && (
            <LearningMapNodeCard
              node={nodes['exam-102']}
              isSelected={selectedNodeId === 'exam-102'}
              isActiveTarget={activeTarget.includes('LPIC-1') || activeTarget.includes('102')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
            />
          )}
        </div>

        {/* Merge Connectors: └──────┬──────┘ */}
        <div className="hidden md:flex flex-col items-center w-full max-w-3xl mt-2 mb-2">
          <div className="w-1/2 flex justify-between">
            <div className="w-0.5 h-4 bg-[#785a00]" />
            <div className="w-0.5 h-4 bg-[#785a00]" />
          </div>
          <div className="w-1/2 h-0.5 bg-[#785a00]" />
          <div className="w-0.5 h-6 bg-[#785a00]" />
          <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isFrench ? 'Certification LPIC-1 Obtenue' : 'LPIC-1 Certified'}</span>
          </div>
          <div className="w-0.5 h-6 bg-[#0061a4]" />
          <div className="w-6 h-6 rounded-full bg-[#e0f2fe] border border-[#0061a4] flex items-center justify-center text-[10px] text-[#0061a4]">
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-0.5 h-4 bg-[#0061a4]" />
        </div>

        {/* Mobile vertical spacer with badge */}
        <div className="md:hidden flex flex-col items-center my-4">
          <div className="w-0.5 h-6 bg-[#d3c5ab]" />
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab]">
            ▼ {isFrench ? 'Prérequis LPIC-1' : 'LPIC-1 Prerequisite'}
          </span>
          <div className="w-0.5 h-6 bg-[#d3c5ab]" />
        </div>
      </div>

      {/* ========================================================
          LEVEL 2: LPIC-2 (Linux Engineer)
          ┌─────┴─────┐
        201           202
                 │
                 ▼
      ======================================================== */}
      <div className="flex flex-col items-center w-full">
        {/* LPIC-2 Milestone Hub Header */}
        <div className="bg-[#f0f7fc] border-2 border-[#0061a4] rounded-2xl px-5 py-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 max-w-lg w-full mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0061a4] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
              2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#201b11]">
                  LPIC-2: Linux Engineer
                </h3>
                {lpic2Completed && (
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                )}
              </div>
              <p className="text-xs text-[#4f4632]">
                {isFrench
                  ? 'Administration avancée & réseaux mixtes (Examens 201 + 202)'
                  : 'Advanced Administration & Mixed Networks (Exams 201 + 202)'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0061a4] border border-[#bcd2ea] shrink-0">
            {isFrench ? 'Prérequis : LPIC-1' : 'Prereq: LPIC-1'}
          </span>
        </div>

        {/* Branching Connectors: ┌─────┴─────┐ */}
        <div className="hidden md:flex flex-col items-center w-full max-w-3xl mb-2">
          <div className="w-0.5 h-4 bg-[#0061a4]" />
          <div className="w-1/2 h-0.5 bg-[#0061a4]" />
          <div className="w-1/2 flex justify-between">
            <div className="w-0.5 h-4 bg-[#0061a4]" />
            <div className="w-0.5 h-4 bg-[#0061a4]" />
          </div>
        </div>

        {/* 2 Child Exam Cards: 201 & 202 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {nodes['exam-201'] && (
            <LearningMapNodeCard
              node={nodes['exam-201']}
              isSelected={selectedNodeId === 'exam-201'}
              isActiveTarget={activeTarget.includes('LPIC-2') || activeTarget.includes('201')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
            />
          )}

          {nodes['exam-202'] && (
            <LearningMapNodeCard
              node={nodes['exam-202']}
              isSelected={selectedNodeId === 'exam-202'}
              isActiveTarget={activeTarget.includes('LPIC-2') || activeTarget.includes('202')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
            />
          )}
        </div>

        {/* Vertical connector down from LPIC-2 to LPIC-3 */}
        <div className="flex flex-col items-center my-4 text-[#817660]">
          <div className="w-0.5 h-6 bg-[#0061a4]" />
          <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#e0f2fe] text-[#0061a4] border border-[#bcd2ea] flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isFrench ? 'Certification LPIC-2 Obtenue' : 'LPIC-2 Certified'}</span>
          </div>
          <div className="w-0.5 h-6 bg-[#0284c7]" />
          <div className="w-6 h-6 rounded-full bg-[#f0f9ff] border border-[#0284c7] flex items-center justify-center text-[10px] text-[#0284c7]">
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="w-0.5 h-4 bg-[#0284c7]" />
        </div>
      </div>

      {/* ========================================================
          LEVEL 3: LPIC-3 (Enterprise Professional)
          ┌────┬────┬────┐
         300  303  305  306
      ======================================================== */}
      <div className="flex flex-col items-center w-full">
        {/* LPIC-3 Milestone Hub Header */}
        <div className="bg-[#f0f9ff] border-2 border-[#0284c7] rounded-2xl px-5 py-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 max-w-lg w-full mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-base text-[#201b11]">
                LPIC-3: Enterprise Professional
              </h3>
              <p className="text-xs text-[#4f4632]">
                {isFrench
                  ? 'Spécialisations d\'élite · 1 seul examen requis parmi les 4'
                  : 'Elite Specializations · 1 single exam needed among the 4'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0284c7] border border-[#0284c7]/30 shrink-0">
            {isFrench ? '1 Spécialité au Choix' : '1 Specialty Choice'}
          </span>
        </div>

        {/* 4-way Branching Connectors: ┌────┬────┬────┐ */}
        <div className="hidden lg:flex flex-col items-center w-full max-w-5xl mb-2">
          <div className="w-0.5 h-4 bg-[#0284c7]" />
          <div className="w-3/4 h-0.5 bg-[#0284c7]" />
          <div className="w-3/4 flex justify-between">
            <div className="w-0.5 h-4 bg-[#0284c7]" />
            <div className="w-0.5 h-4 bg-[#0284c7]" />
            <div className="w-0.5 h-4 bg-[#0284c7]" />
            <div className="w-0.5 h-4 bg-[#0284c7]" />
          </div>
        </div>

        {/* 4 Specialty Child Exam Cards: 300, 303, 305, 306 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {nodes['exam-300'] && (
            <LearningMapNodeCard
              node={nodes['exam-300']}
              isSelected={selectedNodeId === 'exam-300'}
              isActiveTarget={activeTarget.includes('300')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
              compact
            />
          )}

          {nodes['exam-303'] && (
            <LearningMapNodeCard
              node={nodes['exam-303']}
              isSelected={selectedNodeId === 'exam-303'}
              isActiveTarget={activeTarget.includes('303')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
              compact
            />
          )}

          {nodes['exam-305'] && (
            <LearningMapNodeCard
              node={nodes['exam-305']}
              isSelected={selectedNodeId === 'exam-305'}
              isActiveTarget={activeTarget.includes('305')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
              compact
            />
          )}

          {nodes['exam-306'] && (
            <LearningMapNodeCard
              node={nodes['exam-306']}
              isSelected={selectedNodeId === 'exam-306'}
              isActiveTarget={activeTarget.includes('306')}
              isFrench={isFrench}
              onSelect={(id) => setSelectedNodeId(id)}
              onStartExam={onStartExam}
              onOpenFlashcards={onOpenFlashcards}
              onOpenLabs={onOpenLabs}
              onOpenObjectives={onOpenObjectives}
              compact
            />
          )}
        </div>
      </div>
    </div>
  );
};
