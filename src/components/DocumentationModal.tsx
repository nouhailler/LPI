import React, { useState, useMemo, useEffect } from 'react';
import { MarkdownView } from './MarkdownView';
import {
  X,
  Search,
  BookOpen,
  FileText,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Filter,
  Layers,
  Terminal,
  Cpu,
  Shield,
  Zap,
  Sparkles,
  ExternalLink,
  Code2,
  Menu,
} from 'lucide-react';
import { DOC_METADATA, getAllDocs, DocItem } from '../data/docsRegistry';
import { useLanguage } from '../i18n/LanguageContext';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: string;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  initialDocId,
}) => {
  const { isFrench } = useLanguage();
  const allDocs = useMemo(() => getAllDocs(isFrench ? 'fr' : 'en'), [isFrench]);

  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocId || '00_OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'engine' | 'infra' | 'evolution' | 'adr'>('all');
  const [copied, setCopied] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Sync selectedDocId when initialDocId changes or modal opens
  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
    }
  }, [initialDocId, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter documents by category and search query
  const filteredDocs = useMemo(() => {
    return allDocs.filter((doc) => {
      const matchCategory = activeCategory === 'all' || doc.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q) ||
        doc.phase.toLowerCase().includes(q) ||
        doc.rawContent.toLowerCase().includes(q)
      );
    });
  }, [allDocs, activeCategory, searchQuery]);

  const currentDocIndex = allDocs.findIndex((d) => d.id === selectedDocId);
  const currentDoc: DocItem = allDocs[currentDocIndex >= 0 ? currentDocIndex : 0];

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    setIsSidebarOpenMobile(false);
  };

  const handleNextDoc = () => {
    if (currentDocIndex < allDocs.length - 1) {
      setSelectedDocId(allDocs[currentDocIndex + 1].id);
    }
  };

  const handlePrevDoc = () => {
    if (currentDocIndex > 0) {
      setSelectedDocId(allDocs[currentDocIndex - 1].id);
    }
  };

  const handleCopyDoc = () => {
    if (!currentDoc) return;
    navigator.clipboard.writeText(currentDoc.rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return Layers;
      case 'engine':
        return Zap;
      case 'infra':
        return Terminal;
      case 'evolution':
        return Sparkles;
      case 'adr':
        return Shield;
      default:
        return FileText;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="documentation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#201b11]/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[94vh] bg-[#fff8f2] rounded-xl shadow-2xl border border-[#d3c5ab] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="p-3 sm:p-4 border-b border-[#d3c5ab] bg-[#f8ecdb] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="doc-modal-title" className="font-sans font-bold text-base sm:text-lg text-[#201b11] truncate">
                  {isFrench ? 'Documentation Technique & Architecture' : 'Technical & Architecture Documentation'}
                </h2>
                <span className="hidden sm:inline-flex text-[11px] font-bold px-2 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded-md">
                  {allDocs.length} {isFrench ? 'Fiches & ADRs' : 'Docs & ADRs'}
                </span>
              </div>
              <p className="text-xs text-[#4f4632] truncate">
                {isFrench
                  ? 'Spécifications de conception, moteurs métiers (SRS, Labs, Examens) & ADRs'
                  : 'Design specs, core engines (SRS, Labs, Exam) & Architecture Decision Records'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Toggle Sidebar */}
            <button
              onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
              className="md:hidden px-2.5 py-1.5 rounded-lg bg-[#ebdcc8] text-[#785a00] hover:bg-[#d3c5ab] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              aria-label={isFrench ? 'Afficher le sommaire' : 'Toggle index'}
            >
              <Menu className="w-4 h-4" />
              <span>{isFrench ? 'Sommaire' : 'Index'}</span>
            </button>

            <button
              id="close-doc-modal-btn"
              onClick={onClose}
              aria-label={isFrench ? 'Fermer' : 'Close'}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#4f4632] hover:bg-[#ebdcc8] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inner Content: Sidebar + Viewer */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Navigation Sidebar */}
          <aside
            className={`
              absolute md:static inset-y-0 left-0 z-20 w-80 max-w-[85vw] bg-[#fff8f2] md:bg-[#fcf5eb] border-r border-[#d3c5ab] flex flex-col transition-transform duration-200 ease-out shrink-0
              ${isSidebarOpenMobile ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'}
            `}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-[#d3c5ab] bg-[#fff8f2]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#817660] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isFrench ? 'Rechercher dans les docs...' : 'Search documentation...'}
                  className="w-full bg-[#f8ecdb] border border-[#d3c5ab] rounded-lg pl-8 pr-7 py-1.5 text-xs text-[#201b11] placeholder-[#817660] focus:outline-hidden focus:border-[#785a00] focus:bg-[#fff8f2]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#817660] hover:text-[#201b11]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {[
                  { id: 'all', label: isFrench ? 'Tous' : 'All', count: allDocs.length },
                  { id: 'core', label: isFrench ? 'Phase 1' : 'P1: Core', count: 4 },
                  { id: 'engine', label: isFrench ? 'Phase 2' : 'P2: Engines', count: 5 },
                  { id: 'infra', label: isFrench ? 'Phase 3' : 'P3: Infra', count: 4 },
                  { id: 'evolution', label: isFrench ? 'Phase 4' : 'P4: Evol', count: 2 },
                  { id: 'adr', label: 'ADRs', count: 6 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                      activeCategory === tab.id
                        ? 'bg-[#785a00] text-[#fff8f2]'
                        : 'bg-[#ebdcc8] text-[#785a00] hover:bg-[#d3c5ab]'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-8 px-3 text-[#817660]">
                  <p className="text-xs">{isFrench ? 'Aucun document trouvé.' : 'No document found.'}</p>
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isSelected = doc.id === currentDoc?.id;
                  const Icon = getCategoryIcon(doc.category);

                  return (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#ffc20e] border-[#ebdcc8] text-[#6d5100] shadow-xs'
                          : 'bg-[#fff8f2] hover:bg-[#f8ecdb] border-transparent text-[#201b11]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#6d5100] text-[#ffc20e]' : 'bg-[#ebdcc8] text-[#785a00]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs leading-tight line-clamp-1">
                          {doc.title}
                        </div>
                        <div
                          className={`text-[10px] line-clamp-1 mt-0.5 ${
                            isSelected ? 'text-[#6d5100]/80' : 'text-[#817660]'
                          }`}
                        >
                          {doc.summary}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[9px] font-mono px-1 rounded ${
                              isSelected ? 'bg-[#6d5100]/15 text-[#6d5100]' : 'bg-[#ebdcc8] text-[#785a00]'
                            }`}
                          >
                            {doc.filename}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Reader Area */}
          <main className="flex-1 flex flex-col bg-[#fff8f2] overflow-hidden">
            {currentDoc ? (
              <>
                {/* Active Document Action Bar */}
                <div className="px-4 py-2.5 border-b border-[#d3c5ab] bg-[#fff8f2] flex items-center justify-between gap-3 shrink-0 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded-md shrink-0">
                      {currentDoc.phase}
                    </span>
                    <span className="text-xs font-mono text-[#817660] truncate">
                      docs/{currentDoc.filename}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyDoc}
                      className="px-2.5 py-1 rounded-md bg-[#ebdcc8] hover:bg-[#d3c5ab] text-[#785a00] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={isFrench ? 'Copier le markdown brut' : 'Copy raw markdown'}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (isFrench ? 'Copié !' : 'Copied!') : isFrench ? 'Copier' : 'Copy'}</span>
                    </button>

                    <div className="flex items-center gap-1 pl-2 border-l border-[#d3c5ab]">
                      <button
                        onClick={handlePrevDoc}
                        disabled={currentDocIndex === 0}
                        className="p-1 rounded-md text-[#4f4632] hover:bg-[#ebdcc8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title={isFrench ? 'Document précédent' : 'Previous document'}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono text-[#817660] px-1">
                        {currentDocIndex + 1} / {allDocs.length}
                      </span>
                      <button
                        onClick={handleNextDoc}
                        disabled={currentDocIndex === allDocs.length - 1}
                        className="p-1 rounded-md text-[#4f4632] hover:bg-[#ebdcc8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title={isFrench ? 'Document suivant' : 'Next document'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Markdown Reader Pane */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
                  <article className="prose prose-stone max-w-none text-[#201b11]">
                    <MarkdownView content={currentDoc.rawContent} />
                  </article>

                  {/* Navigation footer at end of document */}
                  <div className="mt-10 pt-6 border-t border-[#d3c5ab] flex items-center justify-between gap-4">
                    {currentDocIndex > 0 ? (
                      <button
                        onClick={handlePrevDoc}
                        className="px-3 py-2 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] border border-[#d3c5ab] text-xs font-semibold text-[#785a00] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="truncate max-w-[180px]">
                          {allDocs[currentDocIndex - 1].title}
                        </span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentDocIndex < allDocs.length - 1 && (
                      <button
                        onClick={handleNextDoc}
                        className="px-3 py-2 rounded-lg bg-[#ffc20e] hover:bg-[#ffc20e]/90 text-xs font-bold text-[#6d5100] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span className="truncate max-w-[180px]">
                          {allDocs[currentDocIndex + 1].title}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-[#817660]">
                <p>{isFrench ? 'Sélectionnez un document dans le sommaire.' : 'Select a document from the index.'}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
