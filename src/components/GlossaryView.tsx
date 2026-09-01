import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Terminal,
  FileCode,
  Layers,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  Share2,
  HelpCircle,
  Lightbulb,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { getAllGlossaryEntries } from '../data/glossaryData';
import { GlossaryEntry, GlossaryItemType, TabType } from '../types';

interface GlossaryViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenLearningTopic?: (topicId?: string) => void;
}

type TierFilter = 'all' | 'lpic-1' | 'lpic-2' | 'lpic-3';
type ExamFilter = 'all' | 'exam-101' | 'exam-102' | 'exam-201' | 'exam-202' | 'exam-300' | 'exam-303' | 'exam-305' | 'exam-306';
type TypeFilter = 'all' | GlossaryItemType;

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  onNavigate,
  onOpenLearningTopic,
}) => {
  const allEntries = useMemo(() => getAllGlossaryEntries(), []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<TierFilter>('all');
  const [selectedExam, setSelectedExam] = useState<ExamFilter>('all');
  const [selectedType, setSelectedType] = useState<TypeFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [studyQuizMode, setStudyQuizMode] = useState<boolean>(false);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  // Active Inspect Modal
  const [inspectEntry, setInspectEntry] = useState<GlossaryEntry | null>(null);

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Bookmarks in localStorage
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lpic_glossary_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (!updated[id]) {
        delete updated[id];
      }
      try {
        localStorage.setItem('lpic_glossary_bookmarks', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save bookmark', err);
      }
      return updated;
    });
  };

  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedToast(`Copied "${text}" to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedToast(null);
    }, 2000);
  };

  const handleCopySnippet = (snippet: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Sync Tier change with Exam selection
  const handleTierChange = (tier: TierFilter) => {
    setSelectedTier(tier);
    setSelectedExam('all');
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach((entry) => set.add(entry.category));
    return Array.from(set).sort();
  }, [allEntries]);

  // Alphabet index calculations
  const letters = useMemo(() => {
    const list = ['ALL', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
    return list;
  }, []);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      // Tier filter
      if (selectedTier !== 'all' && entry.certification !== selectedTier) return false;

      // Exam filter
      if (selectedExam !== 'all' && entry.examId !== selectedExam) return false;

      // Type filter
      if (selectedType !== 'all' && entry.type !== selectedType) return false;

      // Category filter
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) return false;

      // Bookmarks filter
      if (showBookmarksOnly && !bookmarks[entry.id]) return false;

      // Letter filter
      if (selectedLetter !== 'ALL') {
        const firstChar = entry.term.trim().replace(/^[/_.-]/, '').charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          if (/[A-Z]/.test(firstChar)) return false;
        } else {
          if (firstChar !== selectedLetter) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTerm = entry.term.toLowerCase().includes(q);
        const matchDef = entry.definition.toLowerCase().includes(q);
        const matchSyntax = entry.syntaxOrLocation?.toLowerCase().includes(q) || false;
        const matchObj = entry.objectiveId.toLowerCase().includes(q);
        const matchExam = entry.examId.toLowerCase().includes(q);
        const matchCat = entry.category.toLowerCase().includes(q);
        const matchFlags = entry.flagsOrParameters?.some(
          (f) => f.flag.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
        ) || false;

        if (!matchTerm && !matchDef && !matchSyntax && !matchObj && !matchExam && !matchCat && !matchFlags) {
          return false;
        }
      }

      return true;
    });
  }, [
    allEntries,
    selectedTier,
    selectedExam,
    selectedType,
    selectedCategory,
    selectedLetter,
    showBookmarksOnly,
    searchQuery,
    bookmarks,
  ]);

  // Quick statistics
  const stats = useMemo(() => {
    const lpic1Count = allEntries.filter((e) => e.certification === 'lpic-1').length;
    const lpic2Count = allEntries.filter((e) => e.certification === 'lpic-2').length;
    const lpic3Count = allEntries.filter((e) => e.certification === 'lpic-3').length;
    const commandsCount = allEntries.filter((e) => e.type === 'command').length;
    const filesCount = allEntries.filter((e) => e.type === 'file').length;
    const conceptsCount = allEntries.filter((e) => e.type === 'concept' || e.type === 'function_or_directive').length;
    const bookmarkedCount = Object.keys(bookmarks).length;

    return {
      total: allEntries.length,
      lpic1: lpic1Count,
      lpic2: lpic2Count,
      lpic3: lpic3Count,
      commands: commandsCount,
      files: filesCount,
      concepts: conceptsCount,
      bookmarked: bookmarkedCount,
    };
  }, [allEntries, bookmarks]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedTier('all');
    setSelectedExam('all');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedLetter('ALL');
    setShowBookmarksOnly(false);
  };

  const handleJumpToObjective = (entry: GlossaryEntry) => {
    if (onOpenLearningTopic) {
      onOpenLearningTopic(`topic-${entry.topicNumber}`);
    } else {
      onNavigate('learning');
    }
  };

  const toggleRevealCard = (id: string) => {
    setRevealedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Toast alert for copy */}
      {copiedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#201b11] text-[#ffffff] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in border border-[#d3c5ab]/30">
          <Check className="w-4 h-4 text-[#28A745]" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#ffc20e] text-[#6d5100]">
                Curriculum Reference
              </span>
              <span className="text-xs text-[#817660] font-semibold">
                LPIC-1, LPIC-2 & LPIC-3
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#201b11] tracking-tight">
              Linux Glossary & Command Index
            </h1>
            <p className="text-[#4f4632] text-sm md:text-base max-w-3xl mt-1">
              Comprehensive reference library containing all commands, configuration files, kernel parameters, directives, and core architecture concepts defined across LPIC-1 (101 & 102), LPIC-2 (201 & 202), and LPIC-3 (300, 303, 305, and 306).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setStudyQuizMode(!studyQuizMode)}
              className={`px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer shadow-xs ${
                studyQuizMode
                  ? 'bg-[#785a00] text-[#ffffff] border-[#785a00]'
                  : 'bg-[#f8ecdb] text-[#785a00] border-[#d3c5ab] hover:bg-[#ebdcc8]'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{studyQuizMode ? 'Exit Recall Mode' : 'Recall Flashcard Mode'}</span>
            </button>

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer shadow-xs ${
                showBookmarksOnly
                  ? 'bg-[#ffc20e] text-[#6d5100] border-[#ffc20e]'
                  : 'bg-[#f8ecdb] text-[#4f4632] border-[#d3c5ab] hover:bg-[#ebdcc8]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showBookmarksOnly ? 'fill-current' : ''}`} />
              <span>Saved ({stats.bookmarked})</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="bg-[#f8ecdb] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#817660] tracking-wider">Total Index</span>
            <span className="text-xl font-extrabold text-[#201b11]">{stats.total} Terms</span>
          </div>

          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#785a00] tracking-wider">LPIC-1 (101/102)</span>
            <span className="text-xl font-extrabold text-[#785a00]">{stats.lpic1}</span>
          </div>

          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#495e8a] tracking-wider">LPIC-2 (201/202)</span>
            <span className="text-xl font-extrabold text-[#495e8a]">{stats.lpic2}</span>
          </div>

          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#5c3566] tracking-wider">LPIC-3 (Enterprise)</span>
            <span className="text-xl font-extrabold text-[#5c3566]">{stats.lpic3}</span>
          </div>

          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#047857] tracking-wider">Commands</span>
            <span className="text-xl font-extrabold text-[#047857]">{stats.commands}</span>
          </div>

          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#b45309] tracking-wider">Config Files</span>
            <span className="text-xl font-extrabold text-[#b45309]">{stats.files}</span>
          </div>

          <div className="bg-[#fff8f2] p-3 rounded-xl border border-[#d3c5ab] flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#4338ca] tracking-wider">Concepts</span>
            <span className="text-xl font-extrabold text-[#4338ca]">{stats.concepts}</span>
          </div>
        </div>
      </section>

      {/* Main Filter & Search Control Center */}
      <section className="bg-[#f8ecdb] p-4 md:p-5 rounded-2xl border border-[#d3c5ab] shadow-xs flex flex-col gap-4">
        {/* Search Bar & Clear Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#817660]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by command (systemctl), file (/etc/fstab), concept (cgroups), flag (-u), or objective (101.1)..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#ffffff] border border-[#d3c5ab] rounded-xl text-sm text-[#201b11] placeholder:text-[#817660]/70 focus:outline-none focus:ring-2 focus:ring-[#785a00] transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#817660] hover:text-[#201b11]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Topic Domain"
              className="px-3.5 py-2.5 bg-[#ffffff] border border-[#d3c5ab] rounded-xl text-xs md:text-sm font-bold text-[#201b11] focus:outline-none focus:ring-2 focus:ring-[#785a00] cursor-pointer"
            >
              <option value="all">All Topic Domains</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {(searchQuery || selectedTier !== 'all' || selectedExam !== 'all' || selectedType !== 'all' || selectedCategory !== 'all' || selectedLetter !== 'ALL' || showBookmarksOnly) && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-2.5 bg-[#ebdcc8] hover:bg-[#d3c5ab] text-[#4f4632] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Certification Tier Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#817660] uppercase tracking-wider mr-1">Certification:</span>
          
          <button
            onClick={() => handleTierChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTier === 'all'
                ? 'bg-[#201b11] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            All Tiers ({stats.total})
          </button>

          <button
            onClick={() => handleTierChange('lpic-1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTier === 'lpic-1'
                ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#785a00] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            LPIC-1 ({stats.lpic1})
          </button>

          <button
            onClick={() => handleTierChange('lpic-2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTier === 'lpic-2'
                ? 'bg-[#495e8a] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#495e8a] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            LPIC-2 ({stats.lpic2})
          </button>

          <button
            onClick={() => handleTierChange('lpic-3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTier === 'lpic-3'
                ? 'bg-[#5c3566] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#5c3566] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            LPIC-3 Enterprise ({stats.lpic3})
          </button>
        </div>

        {/* Specific Exam Badges Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#d3c5ab]/60">
          <span className="text-xs font-bold text-[#817660] uppercase tracking-wider mr-1">Exam Code:</span>
          
          <button
            onClick={() => setSelectedExam('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              selectedExam === 'all'
                ? 'bg-[#4f4632] text-[#ffffff]'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            All Exams
          </button>

          {(selectedTier === 'all' || selectedTier === 'lpic-1') && (
            <>
              <button
                onClick={() => { setSelectedTier('lpic-1'); setSelectedExam('exam-101'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-101'
                    ? 'bg-[#785a00] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#785a00] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                101-500
              </button>
              <button
                onClick={() => { setSelectedTier('lpic-1'); setSelectedExam('exam-102'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-102'
                    ? 'bg-[#785a00] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#785a00] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                102-500
              </button>
            </>
          )}

          {(selectedTier === 'all' || selectedTier === 'lpic-2') && (
            <>
              <button
                onClick={() => { setSelectedTier('lpic-2'); setSelectedExam('exam-201'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-201'
                    ? 'bg-[#495e8a] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#495e8a] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                201-450
              </button>
              <button
                onClick={() => { setSelectedTier('lpic-2'); setSelectedExam('exam-202'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-202'
                    ? 'bg-[#495e8a] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#495e8a] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                202-450
              </button>
            </>
          )}

          {(selectedTier === 'all' || selectedTier === 'lpic-3') && (
            <>
              <button
                onClick={() => { setSelectedTier('lpic-3'); setSelectedExam('exam-300'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-300'
                    ? 'bg-[#5c3566] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#5c3566] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                300 (Mixed)
              </button>
              <button
                onClick={() => { setSelectedTier('lpic-3'); setSelectedExam('exam-303'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-303'
                    ? 'bg-[#991b1b] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#991b1b] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                303 (Security)
              </button>
              <button
                onClick={() => { setSelectedTier('lpic-3'); setSelectedExam('exam-305'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-305'
                    ? 'bg-[#4338ca] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#4338ca] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                305 (Virt/Containers)
              </button>
              <button
                onClick={() => { setSelectedTier('lpic-3'); setSelectedExam('exam-306'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedExam === 'exam-306'
                    ? 'bg-[#047857] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#047857] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                }`}
              >
                306 (HA & Storage)
              </button>
            </>
          )}
        </div>

        {/* Type / Resource Classification Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#d3c5ab]/60">
          <span className="text-xs font-bold text-[#817660] uppercase tracking-wider mr-1">Classification:</span>

          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-[#201b11] text-[#ffffff]'
                : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            All Types
          </button>

          <button
            onClick={() => setSelectedType('command')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'command'
                ? 'bg-[#047857] text-[#ffffff]'
                : 'bg-[#ffffff] text-[#047857] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Commands ({stats.commands})</span>
          </button>

          <button
            onClick={() => setSelectedType('file')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'file'
                ? 'bg-[#b45309] text-[#ffffff]'
                : 'bg-[#ffffff] text-[#b45309] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Config Files & Paths ({stats.files})</span>
          </button>

          <button
            onClick={() => setSelectedType('concept')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === 'concept'
                ? 'bg-[#4338ca] text-[#ffffff]'
                : 'bg-[#ffffff] text-[#4338ca] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Concepts & Architectures ({stats.concepts})</span>
          </button>
        </div>

        {/* Alphabet Jump Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 border-t border-[#d3c5ab]/60 no-scrollbar">
          {letters.map((char) => (
            <button
              key={char}
              onClick={() => setSelectedLetter(char)}
              className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-bold transition-colors shrink-0 flex items-center justify-center cursor-pointer ${
                selectedLetter === char
                  ? 'bg-[#785a00] text-[#ffffff]'
                  : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </section>

      {/* Result Status Header */}
      <div className="flex justify-between items-center px-1">
        <div className="text-xs font-bold text-[#817660] uppercase tracking-wider">
          Showing <span className="text-[#201b11] font-extrabold">{filteredEntries.length}</span> terms & commands
          {selectedLetter !== 'ALL' && ` starting with "${selectedLetter}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {studyQuizMode && (
          <div className="text-xs font-semibold text-[#785a00] flex items-center gap-1.5 bg-[#f8ecdb] px-2.5 py-1 rounded-lg border border-[#d3c5ab]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Click any card to reveal definition & exam tips</span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="bg-[#ffffff] border-2 border-dashed border-[#d3c5ab] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <BookOpen className="w-12 h-12 text-[#817660]" />
          <h3 className="text-lg font-bold text-[#201b11]">No matching glossary terms found</h3>
          <p className="text-xs md:text-sm text-[#4f4632] max-w-md">
            Try adjusting your search keywords, switching the certification filter, or clearing the active category and alphabetical jump filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-2 px-4 py-2 bg-[#ffc20e] text-[#6d5100] font-bold text-xs rounded-xl shadow-xs hover:bg-[#f9bd00] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => {
          const isBookmarked = !!bookmarks[entry.id];
          const isRevealed = !!revealedCards[entry.id] || !studyQuizMode;

          return (
            <article
              key={entry.id}
              onClick={() => studyQuizMode && toggleRevealCard(entry.id)}
              className={`bg-[#ffffff] rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden shadow-xs hover:shadow-md ${
                isBookmarked ? 'border-[#ffc20e] ring-1 ring-[#ffc20e]/50' : 'border-[#d3c5ab]'
              } ${studyQuizMode ? 'cursor-pointer' : ''}`}
            >
              {/* Card Top Banner */}
              <div className="p-4 bg-[#fef9f4] border-b border-[#ebdcc8] flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    {/* Type Badge */}
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                        entry.type === 'command'
                          ? 'bg-[#dcfce7] text-[#047857]'
                          : entry.type === 'file'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#e0e7ff] text-[#4338ca]'
                      }`}
                    >
                      {entry.type === 'command' && <Terminal className="w-2.5 h-2.5" />}
                      {entry.type === 'file' && <FileCode className="w-2.5 h-2.5" />}
                      {entry.type === 'concept' && <Layers className="w-2.5 h-2.5" />}
                      <span>{entry.type === 'file' ? 'Config File' : entry.type}</span>
                    </span>

                    {/* Cert Tier Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        entry.certification === 'lpic-3'
                          ? 'bg-[#f3e8ff] text-[#5c3566]'
                          : entry.certification === 'lpic-2'
                          ? 'bg-[#e0f2fe] text-[#0369a1]'
                          : 'bg-[#fef08a] text-[#854d0e]'
                      }`}
                    >
                      {entry.certification.toUpperCase()} · {entry.examId.replace('exam-', 'Exam ')}
                    </span>

                    {/* Objective Link Chip */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJumpToObjective(entry);
                      }}
                      title="Jump to Learning Objective module"
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcc8] hover:bg-[#d3c5ab] text-[#4f4632] transition-colors cursor-pointer"
                    >
                      Obj {entry.objectiveId}
                    </button>
                  </div>

                  {/* Term Name */}
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-base md:text-lg text-[#201b11] truncate">
                      {entry.term}
                    </h3>
                    <button
                      onClick={(e) => handleCopy(entry.term, entry.id, e)}
                      title="Copy term name"
                      className="text-[#817660] hover:text-[#201b11] p-1 rounded transition-colors"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-[#28A745]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bookmark Toggle Button */}
                <button
                  onClick={(e) => toggleBookmark(entry.id, e)}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this term'}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-[#ffc20e] text-[#6d5100]'
                      : 'text-[#817660] hover:bg-[#ebdcc8] hover:text-[#201b11]'
                  }`}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 fill-current" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col gap-3">
                {studyQuizMode && !isRevealed ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-[#817660]">
                    <Lightbulb className="w-6 h-6 text-[#ffc20e]" />
                    <span className="text-xs font-bold text-[#201b11]">Test your recall!</span>
                    <p className="text-[11px] text-[#4f4632]">
                      What does this {entry.type} do, where is it used, and what key flags are tested on Exam {entry.examId.replace('exam-', '')}?
                    </p>
                    <span className="text-[10px] font-bold text-[#785a00] uppercase tracking-wider mt-1">
                      Click to reveal
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Definition */}
                    <p className="text-xs md:text-sm text-[#4f4632] leading-relaxed">
                      {entry.definition}
                    </p>

                    {/* Syntax or Location Snippet */}
                    {entry.syntaxOrLocation && (
                      <div className="bg-[#201b11] rounded-xl p-2.5 font-mono text-[11px] text-[#ffc20e] flex items-center justify-between gap-2 overflow-x-auto border border-[#3b3222]">
                        <code className="truncate">{entry.syntaxOrLocation}</code>
                        <button
                          onClick={(e) => handleCopy(entry.syntaxOrLocation!, `${entry.id}-syntax`, e)}
                          title="Copy syntax"
                          className="text-[#d3c5ab] hover:text-[#ffffff] shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Flags / Key Parameters Preview (If Curated) */}
                    {entry.flagsOrParameters && entry.flagsOrParameters.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#817660] block">
                          Essential Flags & Parameters
                        </span>
                        <div className="bg-[#fff8f2] rounded-xl p-2 border border-[#ebdcc8] space-y-1">
                          {entry.flagsOrParameters.slice(0, 3).map((f, idx) => (
                            <div key={idx} className="text-[11px] text-[#201b11] flex items-start gap-1.5">
                              <code className="font-bold text-[#785a00] font-mono shrink-0 bg-[#f8ecdb] px-1 rounded">
                                {f.flag}
                              </code>
                              <span className="text-[#4f4632] line-clamp-1">{f.description}</span>
                            </div>
                          ))}
                          {entry.flagsOrParameters.length > 3 && (
                            <div className="text-[10px] font-bold text-[#785a00] pt-0.5">
                              +{entry.flagsOrParameters.length - 3} more options in detail view
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Exam Tip Note */}
                    {entry.examTips && (
                      <div className="bg-[#fffbeb] border border-[#fef08a] rounded-xl p-2.5 text-[11px] text-[#854d0e] flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-[#b45309] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          <strong>Exam Tip:</strong> {entry.examTips}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#fef9f4] border-t border-[#ebdcc8] flex items-center justify-between gap-2 mt-auto">
                <span className="text-[10px] font-semibold text-[#817660] truncate">
                  Topic {entry.topicNumber}: {entry.topicTitle}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectEntry(entry);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#ffffff] hover:bg-[#ebdcc8] text-[#201b11] text-xs font-bold transition-colors border border-[#d3c5ab] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpToObjective(entry);
                    }}
                    title="Open full learning module"
                    className="p-1 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Deep Dive Inspect Modal */}
      {inspectEntry && (
        <div className="fixed inset-0 z-50 bg-[#201b11]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-[#fef9f4] border-b border-[#ebdcc8] flex justify-between items-start sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      inspectEntry.type === 'command'
                        ? 'bg-[#dcfce7] text-[#047857]'
                        : inspectEntry.type === 'file'
                        ? 'bg-[#fef3c7] text-[#b45309]'
                        : 'bg-[#e0e7ff] text-[#4338ca]'
                    }`}
                  >
                    {inspectEntry.type}
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ffc20e] text-[#6d5100]">
                    {inspectEntry.certification.toUpperCase()} · Exam {inspectEntry.examId.replace('exam-', '')}
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ebdcc8] text-[#4f4632]">
                    Objective {inspectEntry.objectiveId}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold font-mono text-[#201b11]">
                  {inspectEntry.term}
                </h2>
                <p className="text-xs text-[#817660] mt-0.5">
                  Topic {inspectEntry.topicNumber}: {inspectEntry.topicTitle} ({inspectEntry.category})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(inspectEntry.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    bookmarks[inspectEntry.id]
                      ? 'bg-[#ffc20e] text-[#6d5100] border-[#ffc20e]'
                      : 'bg-[#ffffff] text-[#817660] border-[#d3c5ab] hover:bg-[#f8ecdb]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarks[inspectEntry.id] ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setInspectEntry(null)}
                  className="p-2 rounded-xl bg-[#ffffff] border border-[#d3c5ab] text-[#817660] hover:text-[#201b11] hover:bg-[#f8ecdb] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 flex flex-col gap-5">
              {/* Definition */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660] mb-1.5">
                  Definition & Functionality
                </h4>
                <p className="text-sm md:text-base text-[#201b11] leading-relaxed">
                  {inspectEntry.definition}
                </p>
              </div>

              {/* Syntax & Command Line Format */}
              {inspectEntry.syntaxOrLocation && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660]">
                      Syntax / File Location
                    </h4>
                    <button
                      onClick={() => handleCopy(inspectEntry.syntaxOrLocation!, 'modal-syntax')}
                      className="text-xs text-[#785a00] font-bold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="bg-[#201b11] rounded-xl p-3 font-mono text-xs text-[#ffc20e] overflow-x-auto border border-[#3b3222]">
                    <code>{inspectEntry.syntaxOrLocation}</code>
                  </div>
                </div>
              )}

              {/* Flags & Parameters Table */}
              {inspectEntry.flagsOrParameters && inspectEntry.flagsOrParameters.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660] mb-2">
                    Command Options & Key Parameters
                  </h4>
                  <div className="bg-[#fef9f4] border border-[#ebdcc8] rounded-xl divide-y divide-[#ebdcc8] overflow-hidden">
                    {inspectEntry.flagsOrParameters.map((param, idx) => (
                      <div key={idx} className="p-3 text-xs flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                        <code className="font-mono font-bold text-[#785a00] bg-[#f8ecdb] px-2 py-0.5 rounded shrink-0 self-start">
                          {param.flag}
                        </code>
                        <span className="text-[#4f4632] leading-normal">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real World Practical Example */}
              {inspectEntry.exampleSnippet && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660]">
                      Practical Terminal Example
                    </h4>
                    <button
                      onClick={() => handleCopySnippet(inspectEntry.exampleSnippet!, 'modal-snip')}
                      className="text-xs text-[#785a00] font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedSnippetId === 'modal-snip' ? (
                        <>
                          <Check className="w-3 h-3 text-[#28A745]" />
                          <span className="text-[#28A745]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#201b11] rounded-xl p-3.5 font-mono text-xs text-[#ffffff] overflow-x-auto border border-[#3b3222]">
                    <pre className="text-[#ffc20e] whitespace-pre-wrap">{inspectEntry.exampleSnippet}</pre>
                  </div>
                  {inspectEntry.exampleExplanation && (
                    <p className="text-xs text-[#4f4632] mt-1.5 italic">
                      {inspectEntry.exampleExplanation}
                    </p>
                  )}
                </div>
              )}

              {/* Exam Tip Card */}
              {inspectEntry.examTips && (
                <div className="bg-[#fffbeb] border border-[#fef08a] rounded-2xl p-4 flex items-start gap-3 text-xs md:text-sm text-[#854d0e]">
                  <Lightbulb className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-sm mb-0.5">LPI Certification Exam Gotchas:</strong>
                    <p className="leading-relaxed">{inspectEntry.examTips}</p>
                  </div>
                </div>
              )}

              {/* Related Terms Cross Links */}
              {inspectEntry.relatedTerms && inspectEntry.relatedTerms.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660] mb-2">
                    Related Concepts & Terms
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectEntry.relatedTerms.map((rt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(rt);
                          setInspectEntry(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] text-xs font-bold transition-colors border border-[#d3c5ab] cursor-pointer"
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#fef9f4] border-t border-[#ebdcc8] flex justify-between items-center gap-3">
              <button
                onClick={() => handleJumpToObjective(inspectEntry)}
                className="px-4 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs md:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Objective {inspectEntry.objectiveId} Module</span>
              </button>

              <button
                onClick={() => setInspectEntry(null)}
                className="px-4 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#ebdcc8] text-[#4f4632] text-xs md:text-sm font-bold transition-colors border border-[#d3c5ab] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
