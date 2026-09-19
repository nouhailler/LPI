import React, { useState } from 'react';
import {
  X,
  Share2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  Compass,
  Terminal,
  FileCode,
  Lightbulb,
  Check,
  Copy,
} from 'lucide-react';
import {
  getConceptRelations,
  getKnowledgeNode,
  KnowledgeNodeData,
  ConceptRelation,
} from '../../data/knowledgeGraphData';

interface KnowledgeGraphModalProps {
  initialTerm: string;
  isFrench: boolean;
  onClose: () => void;
  onOpenGlossaryInspect?: (term: string) => void;
  onOpenObjective?: (objectiveId: string) => void;
}

export const KnowledgeGraphModal: React.FC<KnowledgeGraphModalProps> = ({
  initialTerm,
  isFrench,
  onClose,
  onOpenGlossaryInspect,
  onOpenObjective,
}) => {
  // Navigation history for breadcrumbs
  const [history, setHistory] = useState<string[]>([initialTerm]);
  const currentTerm = history[history.length - 1];

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const currentNode = getKnowledgeNode(currentTerm) || {
    id: currentTerm,
    term: currentTerm,
    type: 'concept',
    category: 'Linux Knowledge',
    certification: 'lpic-1',
    examId: 'exam-101',
    objectiveId: '101',
    definitionEn: 'Key Linux certification concept.',
    definitionFr: 'Concept clé de la certification Linux.',
    clusterId: 'systemd-ecosystem',
  } as KnowledgeNodeData;

  const { outgoing, incoming, all } = getConceptRelations(currentTerm);

  const handleNavigateToTerm = (targetTerm: string) => {
    setHistory((prev) => [...prev, targetTerm]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setHistory((prev) => prev.slice(0, index + 1));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#201b11]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#fef9f4] border-b border-[#ebdcc8] flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {history.length > 1 && (
              <button
                onClick={handleBack}
                title={isFrench ? 'Étape précédente' : 'Go back'}
                className="p-1.5 rounded-lg bg-[#ffffff] border border-[#d3c5ab] hover:bg-[#ebdcc8] text-[#4f4632] transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#785a00]">
                  <Share2 className="w-3.5 h-3.5 text-[#785a00]" />
                  {isFrench ? 'Knowledge Graph Linux' : 'Linux Knowledge Graph'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f8ecdb] text-[#785a00] border border-[#ebdcc8]">
                  {all.length} {isFrench ? 'relations' : 'relations'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-[#201b11] truncate">
                {currentNode.term}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#ffffff] border border-[#d3c5ab] text-[#817660] hover:text-[#201b11] hover:bg-[#f8ecdb] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breadcrumbs Navigation Trail */}
        {history.length > 1 && (
          <div className="bg-[#f8ecdb]/60 border-b border-[#ebdcc8] px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[#817660] text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1">
              {isFrench ? 'Parcours :' : 'Trail:'}
            </span>
            {history.map((term, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={`px-2 py-0.5 rounded font-mono font-bold transition-colors cursor-pointer shrink-0 ${
                    idx === history.length - 1
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'text-[#4f4632] hover:bg-[#ebdcc8]'
                  }`}
                >
                  {term}
                </button>
                {idx < history.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#817660] shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Current Node Overview Card */}
          <div className="bg-[#fef9f4] border-2 border-[#785a00]/30 rounded-2xl p-4 sm:p-5 relative shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                    currentNode.type === 'command'
                      ? 'bg-[#dcfce7] text-[#047857]'
                      : currentNode.type === 'file'
                      ? 'bg-[#fef3c7] text-[#b45309]'
                      : 'bg-[#e0e7ff] text-[#4338ca]'
                  }`}
                >
                  {currentNode.type === 'file'
                    ? isFrench ? 'Fichier Système' : 'System File'
                    : currentNode.type === 'command'
                    ? isFrench ? 'Commande CLI' : 'CLI Command'
                    : isFrench ? 'Concept Clé' : 'Core Concept'}
                </span>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ebdcc8] text-[#4f4632]">
                  {currentNode.category}
                </span>

                {currentNode.objectiveId && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#ffc20e] text-[#6d5100]">
                    LPIC Obj {currentNode.objectiveId}
                  </span>
                )}
              </div>

              {currentNode.syntax && (
                <button
                  onClick={() => handleCopy(currentNode.syntax!)}
                  className="text-xs text-[#785a00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === currentNode.syntax ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span className="text-[#16a34a]">{isFrench ? 'Copié !' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isFrench ? 'Copier la syntaxe' : 'Copy syntax'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-sm sm:text-base text-[#201b11] leading-relaxed font-normal">
              {isFrench ? currentNode.definitionFr : currentNode.definitionEn}
            </p>

            {currentNode.syntax && (
              <div className="mt-3 bg-[#201b11] rounded-xl p-2.5 font-mono text-xs text-[#ffc20e] border border-[#3b3222] overflow-x-auto">
                <code>{currentNode.syntax}</code>
              </div>
            )}
          </div>

          {/* Interactive Graph Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Outgoing Relations (Ce concept mène à / contrôle...) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660] flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-[#785a00]" />
                  <span>
                    {isFrench
                      ? `Relations sortantes (${outgoing.length})`
                      : `Outgoing relations (${outgoing.length})`}
                  </span>
                </h4>
                <span className="text-[11px] text-[#817660] italic">
                  {isFrench ? 'Contrôle, génère, bascule...' : 'Controls, generates, switches...'}
                </span>
              </div>

              {outgoing.length === 0 ? (
                <div className="p-4 bg-[#f8ecdb]/40 border border-dashed border-[#d3c5ab] rounded-xl text-xs text-[#817660] text-center italic">
                  {isFrench ? 'Aucune relation sortante directe.' : 'No direct outgoing relations.'}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {outgoing.map((rel, idx) => {
                    const targetNode = getKnowledgeNode(rel.targetTerm);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleNavigateToTerm(rel.targetTerm)}
                        className="group bg-[#ffffff] hover:bg-[#fffbf0] border border-[#d3c5ab] hover:border-[#785a00] p-3.5 rounded-xl transition-all shadow-xs cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] border border-[#ebdcc8] group-hover:bg-[#785a00] group-hover:text-white transition-colors">
                            {isFrench ? rel.labelFr : rel.labelEn}
                          </span>
                          <span className="text-xs font-bold text-[#785a00] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            {isFrench ? 'Explorer' : 'Explore'} →
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#201b11] group-hover:text-[#785a00] transition-colors">
                            {rel.targetTerm}
                          </span>
                          {targetNode?.type && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ebdcc8]/50 text-[#817660]">
                              {targetNode.type}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4f4632] leading-relaxed">
                          {isFrench ? rel.descriptionFr : rel.descriptionEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Incoming Relations (Ce concept dépend de / est configuré par...) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660] flex items-center gap-1.5">
                  <ArrowLeft className="w-4 h-4 text-[#0061a4]" />
                  <span>
                    {isFrench
                      ? `Relations entrantes (${incoming.length})`
                      : `Incoming relations (${incoming.length})`}
                  </span>
                </h4>
                <span className="text-[11px] text-[#817660] italic">
                  {isFrench ? 'Configuré par, dépend de...' : 'Configured by, depends on...'}
                </span>
              </div>

              {incoming.length === 0 ? (
                <div className="p-4 bg-[#f8ecdb]/40 border border-dashed border-[#d3c5ab] rounded-xl text-xs text-[#817660] text-center italic">
                  {isFrench ? 'Aucune relation entrante directe.' : 'No direct incoming relations.'}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {incoming.map((rel, idx) => {
                    const sourceNode = getKnowledgeNode(rel.sourceTerm);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleNavigateToTerm(rel.sourceTerm)}
                        className="group bg-[#ffffff] hover:bg-[#f0f7ff] border border-[#d3c5ab] hover:border-[#0061a4] p-3.5 rounded-xl transition-all shadow-xs cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] group-hover:bg-[#0061a4] group-hover:text-white transition-colors">
                            ← {isFrench ? rel.labelFr : rel.labelEn}
                          </span>
                          <span className="text-xs font-bold text-[#0061a4] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            {isFrench ? 'Remonter' : 'Trace'} →
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#201b11] group-hover:text-[#0061a4] transition-colors">
                            {rel.sourceTerm}
                          </span>
                          {sourceNode?.type && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ebdcc8]/50 text-[#817660]">
                              {sourceNode.type}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4f4632] leading-relaxed">
                          {isFrench ? rel.descriptionFr : rel.descriptionEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#fef9f4] border-t border-[#ebdcc8] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            {onOpenGlossaryInspect && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGlossaryInspect(currentNode.term);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#ffffff] hover:bg-[#ebdcc8] text-[#201b11] text-xs font-bold transition-colors border border-[#d3c5ab] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Fiche complète dans le Glossaire' : 'Full Glossary Entry'}</span>
              </button>
            )}

            {onOpenObjective && currentNode.objectiveId && (
              <button
                onClick={() => {
                  onClose();
                  onOpenObjective(currentNode.objectiveId);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isFrench ? `Objectif LPI ${currentNode.objectiveId}` : `LPI Objective ${currentNode.objectiveId}`}</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#ffffff] hover:bg-[#ebdcc8] text-[#4f4632] text-xs font-bold transition-colors border border-[#d3c5ab] cursor-pointer ml-auto"
          >
            {isFrench ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
