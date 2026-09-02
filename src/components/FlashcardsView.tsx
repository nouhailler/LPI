import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RotateCw,
  Check,
  Hand,
  Sparkles,
  RotateCcw,
  Shuffle,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Search,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Copy,
  CheckCheck,
  Grid,
  Filter,
  Layers,
  HelpCircle,
  HardDrive,
  Cpu,
  Package,
  Terminal,
  Code2,
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onCardLearned?: (cardId: number) => void;
  initialTopic?: 101 | 102 | 103 | 104 | 105 | 'all';
}

type SelectedTopic = 101 | 102 | 103 | 104 | 105 | 'all';

type FilterObjective =
  | 'all-topic'
  | '101.1'
  | '101.2'
  | '101.3'
  | '102.1'
  | '102.2'
  | '102.3'
  | '102.4'
  | '102.5'
  | '102.6'
  | '103.1'
  | '103.2'
  | '103.3'
  | '103.4'
  | '103.5'
  | '103.6'
  | '103.7'
  | '103.8'
  | '104.1'
  | '104.2'
  | '104.3'
  | '104.4'
  | '104.5'
  | '104.6'
  | '104.7'
  | '105.1'
  | '105.2'
  | 'starred'
  | 'review';

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  onCardLearned,
  initialTopic = 105,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic>(initialTopic);
  const [activeDeckFilter, setActiveDeckFilter] = useState<FilterObjective>('all-topic');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);

  // Local persistence for mastered cards and starred cards
  const [masteredCardIds, setMasteredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('lpic1_mastered_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviewCardIds, setReviewCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('lpic1_review_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [starredCardIds, setStarredCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('lpic1_starred_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lpic1_mastered_cards', JSON.stringify(masteredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('lpic1_review_cards', JSON.stringify(reviewCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewCardIds]);

  useEffect(() => {
    try {
      localStorage.setItem('lpic1_starred_cards', JSON.stringify(starredCardIds));
    } catch (e) {
      console.error(e);
    }
  }, [starredCardIds]);

  // Reset filter when topic changes
  const handleTopicSelect = (topic: SelectedTopic) => {
    setSelectedTopic(topic);
    setActiveDeckFilter('all-topic');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Compute filtered card list
  const filteredCards = useMemo(() => {
    let result = cards;

    // Filter by Topic level first
    if (selectedTopic === 101) {
      result = result.filter(
        (c) => c.topicNumber === 101 || c.deck.includes('Topic 101') || c.objectiveId?.startsWith('101.')
      );
    } else if (selectedTopic === 102) {
      result = result.filter(
        (c) => c.topicNumber === 102 || c.deck.includes('Topic 102') || c.objectiveId?.startsWith('102.')
      );
    } else if (selectedTopic === 103) {
      result = result.filter(
        (c) => c.topicNumber === 103 || c.deck.includes('Topic 103') || c.objectiveId?.startsWith('103.')
      );
    } else if (selectedTopic === 104) {
      result = result.filter(
        (c) => c.topicNumber === 104 || c.deck.includes('Topic 104') || c.objectiveId?.startsWith('104.')
      );
    } else if (selectedTopic === 105) {
      result = result.filter(
        (c) => c.topicNumber === 105 || c.deck.includes('Topic 105') || c.objectiveId?.startsWith('105.')
      );
    }

    // Filter by sub-objective / state
    if (activeDeckFilter === '101.1') {
      result = result.filter((c) => c.objectiveId === '101.1');
    } else if (activeDeckFilter === '101.2') {
      result = result.filter((c) => c.objectiveId === '101.2');
    } else if (activeDeckFilter === '101.3') {
      result = result.filter((c) => c.objectiveId === '101.3');
    } else if (activeDeckFilter === '102.1') {
      result = result.filter((c) => c.objectiveId === '102.1');
    } else if (activeDeckFilter === '102.2') {
      result = result.filter((c) => c.objectiveId === '102.2');
    } else if (activeDeckFilter === '102.3') {
      result = result.filter((c) => c.objectiveId === '102.3');
    } else if (activeDeckFilter === '102.4') {
      result = result.filter((c) => c.objectiveId === '102.4');
    } else if (activeDeckFilter === '102.5') {
      result = result.filter((c) => c.objectiveId === '102.5');
    } else if (activeDeckFilter === '102.6') {
      result = result.filter((c) => c.objectiveId === '102.6');
    } else if (activeDeckFilter === '103.1') {
      result = result.filter((c) => c.objectiveId === '103.1');
    } else if (activeDeckFilter === '103.2') {
      result = result.filter((c) => c.objectiveId === '103.2');
    } else if (activeDeckFilter === '103.3') {
      result = result.filter((c) => c.objectiveId === '103.3');
    } else if (activeDeckFilter === '103.4') {
      result = result.filter((c) => c.objectiveId === '103.4');
    } else if (activeDeckFilter === '103.5') {
      result = result.filter((c) => c.objectiveId === '103.5');
    } else if (activeDeckFilter === '103.6') {
      result = result.filter((c) => c.objectiveId === '103.6');
    } else if (activeDeckFilter === '103.7') {
      result = result.filter((c) => c.objectiveId === '103.7');
    } else if (activeDeckFilter === '103.8') {
      result = result.filter((c) => c.objectiveId === '103.8');
    } else if (activeDeckFilter === '104.1') {
      result = result.filter((c) => c.objectiveId === '104.1');
    } else if (activeDeckFilter === '104.2') {
      result = result.filter((c) => c.objectiveId === '104.2');
    } else if (activeDeckFilter === '104.3') {
      result = result.filter((c) => c.objectiveId === '104.3');
    } else if (activeDeckFilter === '104.4') {
      result = result.filter((c) => c.objectiveId === '104.4');
    } else if (activeDeckFilter === '104.5') {
      result = result.filter((c) => c.objectiveId === '104.5');
    } else if (activeDeckFilter === '104.6') {
      result = result.filter((c) => c.objectiveId === '104.6');
    } else if (activeDeckFilter === '104.7') {
      result = result.filter((c) => c.objectiveId === '104.7');
    } else if (activeDeckFilter === '105.1') {
      result = result.filter((c) => c.objectiveId === '105.1');
    } else if (activeDeckFilter === '105.2') {
      result = result.filter((c) => c.objectiveId === '105.2');
    } else if (activeDeckFilter === 'starred') {
      result = result.filter((c) => starredCardIds.includes(c.id));
    } else if (activeDeckFilter === 'review') {
      result = result.filter((c) => reviewCardIds.includes(c.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.command.toLowerCase().includes(q) ||
          c.definition.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.example?.toLowerCase().includes(q) ||
          c.examTip?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [cards, selectedTopic, activeDeckFilter, searchQuery, starredCardIds, reviewCardIds]);

  // Display deck
  const [deckOrder, setDeckOrder] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (isShuffled) {
      const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
      setDeckOrder(shuffled);
    } else {
      setDeckOrder(filteredCards);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filteredCards, isShuffled]);

  const currentCard: Flashcard | undefined = deckOrder[currentIndex] || deckOrder[0];
  const totalInDeck = deckOrder.length;
  const progressPercent = totalInDeck > 0 ? Math.round(((currentIndex + 1) / totalInDeck) * 100) : 0;

  const isCurrentMastered = currentCard ? masteredCardIds.includes(currentCard.id) : false;
  const isCurrentStarred = currentCard ? starredCardIds.includes(currentCard.id) : false;

  // Flip Handler
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Card Navigation
  const nextCard = useCallback(() => {
    setIsFlipped(false);
    if (totalInDeck === 0) return;
    if (currentIndex < totalInDeck - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalInDeck]);

  const prevCard = useCallback(() => {
    setIsFlipped(false);
    if (totalInDeck === 0) return;
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(totalInDeck - 1);
    }
  }, [currentIndex, totalInDeck]);

  // Action handlers
  const handleGotIt = useCallback(() => {
    if (!currentCard) return;
    const cardId = currentCard.id;

    setMasteredCardIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
    setReviewCardIds((prev) => prev.filter((id) => id !== cardId));

    if (onCardLearned) {
      onCardLearned(cardId);
    }
    nextCard();
  }, [currentCard, onCardLearned, nextCard]);

  const handleStudyAgain = useCallback(() => {
    if (!currentCard) return;
    const cardId = currentCard.id;

    setReviewCardIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
    setMasteredCardIds((prev) => prev.filter((id) => id !== cardId));

    nextCard();
  }, [currentCard, nextCard]);

  const toggleStarred = useCallback(() => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    setStarredCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  }, [currentCard]);

  const handleShuffleToggle = () => {
    setIsShuffled((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleCopyCode = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in search input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleGotIt();
      } else if (e.code === 'ArrowLeft' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleStudyAgain();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleShuffleToggle();
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleStarred();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleGotIt, handleStudyAgain, toggleStarred]);

  // Compute metrics for Topic 101, Topic 102, Topic 103, Topic 104, and Topic 105
  const topic101Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 101 || c.deck.includes('Topic 101') || c.objectiveId?.startsWith('101.')),
    [cards]
  );
  const topic101Mastered = topic101Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic102Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 102 || c.deck.includes('Topic 102') || c.objectiveId?.startsWith('102.')),
    [cards]
  );
  const topic102Mastered = topic102Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic103Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 103 || c.deck.includes('Topic 103') || c.objectiveId?.startsWith('103.')),
    [cards]
  );
  const topic103Mastered = topic103Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic104Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 104 || c.deck.includes('Topic 104') || c.objectiveId?.startsWith('104.')),
    [cards]
  );
  const topic104Mastered = topic104Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic105Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 105 || c.deck.includes('Topic 105') || c.objectiveId?.startsWith('105.')),
    [cards]
  );
  const topic105Mastered = topic105Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const activeTopicTitle =
    selectedTopic === 105
      ? 'Topic 105: Shells and Shell Scripting'
      : selectedTopic === 104
      ? 'Topic 104: Devices, Linux Filesystems, Filesystem Hierarchy Standard'
      : selectedTopic === 103
      ? 'Topic 103: GNU and Unix Commands'
      : selectedTopic === 102
      ? 'Topic 102: Linux Installation and Package Management'
      : selectedTopic === 101
      ? 'Topic 101: System Architecture'
      : 'All LPIC-1 Flashcards';

  const activeTopicBadge =
    selectedTopic === 105
      ? '100 Cards • 2 Sub-Objectives (Weight 8)'
      : selectedTopic === 104
      ? '100 Cards • 7 Sub-Objectives'
      : selectedTopic === 103
      ? '100 Cards • 8 Sub-Objectives'
      : selectedTopic === 102
      ? '100 Cards • 6 Sub-Objectives'
      : selectedTopic === 101
      ? '100 Cards • 3 Sub-Objectives'
      : `${cards.length} Total Cards`;

  const activeTopicMastered =
    selectedTopic === 105
      ? topic105Mastered
      : selectedTopic === 104
      ? topic104Mastered
      : selectedTopic === 103
      ? topic103Mastered
      : selectedTopic === 102
      ? topic102Mastered
      : selectedTopic === 101
      ? topic101Mastered
      : masteredCardIds.length;

  const activeTopicTotal =
    selectedTopic === 105
      ? topic105Cards.length || 100
      : selectedTopic === 104
      ? topic104Cards.length || 100
      : selectedTopic === 103
      ? topic103Cards.length || 100
      : selectedTopic === 102
      ? topic102Cards.length || 100
      : selectedTopic === 101
      ? topic101Cards.length || 100
      : cards.length;

  const activeTopicPct = activeTopicTotal > 0 ? Math.round((activeTopicMastered / activeTopicTotal) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center pb-24 px-2">
      {/* Top Topic Switcher Tabs */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 bg-white p-1.5 rounded-2xl border border-[#d3c5ab] shadow-2xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => handleTopicSelect(105)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 105
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Topic 105 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              New
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(104)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 104
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Topic 104 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(103)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 103
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Topic 103 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(102)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 102
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Topic 102 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(101)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 101
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Topic 101 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect('all')}
            className={`hidden sm:flex px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer items-center justify-center gap-1.5 ${
              selectedTopic === 'all'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All LPIC-1 ({cards.length})</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 pr-2 text-xs text-[#817660]">
          <span>Total Mastered:</span>
          <strong className="text-[#28A745] font-bold">{masteredCardIds.length}</strong>
        </div>
      </div>

      {/* Header Topic Banner */}
      <div className="w-full bg-[#fef2e1] border border-[#d3c5ab] rounded-2xl p-4 md:p-5 mb-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#785a00] text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm shrink-0">
              {selectedTopic === 'all' ? '101+' : selectedTopic}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-[#785a00] uppercase tracking-wider bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                  {selectedTopic === 105 ? 'LPIC-1 Exam 102-500' : 'LPIC-1 Exam 101-500'}
                </span>
                <span className="text-[11px] font-bold text-[#495e8a] bg-white px-2 py-0.5 rounded border border-[#d3c5ab]">
                  {activeTopicBadge}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#201b11] mt-0.5">
                {activeTopicTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/80 border border-[#d3c5ab] px-4 py-2 rounded-xl self-start md:self-auto shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#817660] block">
                {selectedTopic === 105 ? 'Topic 105' : selectedTopic === 104 ? 'Topic 104' : selectedTopic === 103 ? 'Topic 103' : selectedTopic === 102 ? 'Topic 102' : selectedTopic === 101 ? 'Topic 101' : 'Overall'} Mastery
              </span>
              <span className="text-base font-bold text-[#785a00]">
                {activeTopicMastered} / {activeTopicTotal}{' '}
                <span className="text-xs text-[#817660] font-normal">
                  ({activeTopicPct}%)
                </span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#785a00] flex items-center justify-center font-bold text-xs text-[#785a00] bg-[#fef2e1]">
              {activeTopicPct}%
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-[#d3c5ab]/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {/* All Topic Pill */}
            <button
              onClick={() => setActiveDeckFilter('all-topic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDeckFilter === 'all-topic'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All In Deck ({selectedTopic === 105 ? topic105Cards.length : selectedTopic === 104 ? topic104Cards.length : selectedTopic === 103 ? topic103Cards.length : selectedTopic === 102 ? topic102Cards.length : selectedTopic === 101 ? topic101Cards.length : cards.length})
            </button>

            {/* Topic 105 Sub-Objectives */}
            {selectedTopic === 105 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('105.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '105.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Customize and use the shell environment (105.1)"
                >
                  105.1 Shell Env & Startup (50)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('105.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '105.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Customize or write simple scripts (105.2)"
                >
                  105.2 Shell Scripting (50)
                </button>
              </>
            )}

            {/* Topic 104 Sub-Objectives */}
            {selectedTopic === 104 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('104.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Create partitions and filesystems (104.1)"
                >
                  104.1 Partitions & FS (16)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('104.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Maintain the integrity of filesystems (104.2)"
                >
                  104.2 Integrity & fsck (16)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('104.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Control mounting and unmounting of filesystems (104.3)"
                >
                  104.3 Mounts & fstab (16)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('104.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Manage disk quotas (104.4)"
                >
                  104.4 Quotas (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('104.5')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.5'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Manage file permissions and ownership (104.5)"
                >
                  104.5 Permissions (16)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('104.6')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.6'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Create and change hard and symbolic links (104.6)"
                >
                  104.6 Links & Inodes (12)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('104.7')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '104.7'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Find system files and place files in correct location (104.7)"
                >
                  104.7 FHS & Find (14)
                </button>
              </>
            )}

            {/* Topic 103 Sub-Objectives */}
            {selectedTopic === 103 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('103.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Work on the command line (103.1)"
                >
                  103.1 CLI Basics (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Process text streams using filters (103.2)"
                >
                  103.2 Text Filters (22)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Perform basic file management (103.3)"
                >
                  103.3 File Mgmt (16)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Use streams, pipes and redirects (103.4)"
                >
                  103.4 Pipes & Redir (12)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.5')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.5'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Create, monitor and kill processes (103.5)"
                >
                  103.5 Processes (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.6')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.6'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Modify process execution priorities (103.6)"
                >
                  103.6 Priorities (6)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.7')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.7'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Search text files using regular expressions (103.7)"
                >
                  103.7 RegEx (8)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('103.8')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '103.8'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Basic file editing with vi (103.8)"
                >
                  103.8 vi Editing (8)
                </button>
              </>
            )}

            {/* Topic 102 Sub-Objectives */}
            {selectedTopic === 102 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('102.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '102.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Design hard disk layout (LVM, Partitions, fstab)"
                >
                  102.1 Disks & LVM (18)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('102.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '102.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Install a boot manager (GRUB 2, UEFI)"
                >
                  102.2 GRUB & Boot (18)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('102.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '102.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Manage shared libraries (ldd, ldconfig)"
                >
                  102.3 Libraries (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('102.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '102.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Use Debian package management (dpkg, apt)"
                >
                  102.4 Debian/APT (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('102.5')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '102.5'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Use RPM and YUM/DNF package management"
                >
                  102.5 RPM/YUM (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('102.6')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '102.6'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Linux as a virtualization guest (cloud-init, VM tools)"
                >
                  102.6 Cloud & Virt (10)
                </button>
              </>
            )}

            {/* Topic 101 Sub-Objectives */}
            {selectedTopic === 101 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('101.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '101.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                >
                  101.1 Hardware (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('101.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '101.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                >
                  101.2 Boot & GRUB (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('101.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '101.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                >
                  101.3 Runlevels (30)
                </button>
              </>
            )}

            {/* Global Starred & Needs Review Filters */}
            <button
              onClick={() => setActiveDeckFilter('starred')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeDeckFilter === 'starred'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Starred ({starredCardIds.length})
            </button>

            <button
              onClick={() => setActiveDeckFilter('review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeDeckFilter === 'review'
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'bg-white text-[#ba1a1a] hover:bg-[#ffdad6] border border-[#d3c5ab]'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Review ({reviewCardIds.length})
            </button>
          </div>

          {/* Quick Jump Grid Button */}
          <button
            onClick={() => setShowGridModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#495e8a] hover:bg-[#ece1d0] border border-[#d3c5ab] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Browse all cards in a visual index"
          >
            <Grid className="w-3.5 h-3.5" />
            Card Index ({filteredCards.length})
          </button>
        </div>
      </div>

      {/* Search and Secondary Controls */}
      <div className="w-full max-w-xl flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              selectedTopic === 102
                ? 'Search dpkg, rpm, ldd, fstab, LVM, cloud-init...'
                : selectedTopic === 101
                ? 'Search lsmod, GRUB, systemd, udev, dmesg...'
                : 'Search all LPIC-1 commands, files, or concepts...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-[#d3c5ab] text-[#201b11] focus:outline-none focus:ring-2 focus:ring-[#785a00] transition-all shadow-2xs placeholder-[#817660]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#817660] hover:text-[#201b11]"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={handleShuffleToggle}
          className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
            isShuffled
              ? 'bg-[#785a00] text-white border-[#785a00]'
              : 'bg-white text-[#4f4632] border-[#d3c5ab] hover:bg-[#f8ecdb]'
          }`}
          title="Shuffle Deck (S key)"
        >
          <Shuffle className="w-4 h-4" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        <button
          onClick={handleRestart}
          className="p-2 rounded-xl bg-white text-[#4f4632] border border-[#d3c5ab] hover:bg-[#f8ecdb] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          title="Reset to first card"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Main Flashcard Container */}
      {totalInDeck === 0 ? (
        <div className="w-full max-w-xl bg-white border border-[#d3c5ab] rounded-2xl p-12 text-center my-6">
          <HelpCircle className="w-12 h-12 text-[#817660] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-[#201b11]">No flashcards found</h3>
          <p className="text-xs text-[#817660] mt-1 max-w-xs mx-auto">
            {searchQuery
              ? `No cards matching "${searchQuery}" in this filter.`
              : 'You have no cards in this category yet.'}
          </p>
          <button
            onClick={() => {
              setActiveDeckFilter('all-topic');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#785a00] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-[#6d5100]"
          >
            Show All Cards
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* Deck Progress Bar & Counter */}
          <div className="w-full flex flex-col gap-1.5 mb-3">
            <div className="flex justify-between items-center text-xs font-bold text-[#495e8a]">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider">
                  {currentCard?.objectiveId ? `OBJ ${currentCard.objectiveId}` : `TOPIC ${currentCard?.topicNumber || 101}`}
                </span>
                {currentCard?.category && (
                  <span className="text-[10px] font-semibold bg-[#f8ecdb] text-[#785a00] px-2 py-0.5 rounded border border-[#d3c5ab]">
                    {currentCard.category}
                  </span>
                )}
              </div>
              <span>
                Card {currentIndex + 1} of {totalInDeck}
              </span>
            </div>
            <div className="w-full h-2 bg-[#ece1d0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ffc20e] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive Flashcard with 3D Flip */}
          <div
            className="w-full min-h-[380px] md:min-h-[420px] perspective-1000 cursor-pointer select-none relative group"
            onClick={handleFlip}
          >
            {/* Layered stack visual effect */}
            <div className="absolute -bottom-2 inset-x-2 h-full bg-[#f2e7d6] rounded-2xl border border-[#d3c5ab] -z-10 shadow-xs" />
            <div className="absolute -bottom-4 inset-x-4 h-full bg-[#ece1d0] rounded-2xl border border-[#d3c5ab] -z-20 shadow-xs" />

            {/* Flipping card container */}
            <div
              className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT FACE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl border border-[#d3c5ab] bg-[#fff8f2] shadow-sm flex flex-col justify-between p-6 md:p-8">
                {/* Front Top Bar */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono uppercase font-bold text-[11px] bg-[#785a00] text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                      {currentCard?.objectiveId ? `LPIC-1: ${currentCard.objectiveId}` : 'LPIC-1'}
                    </span>
                    {currentCard?.difficulty && (
                      <span className="text-[10px] font-bold text-[#817660] bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                        {currentCard.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={toggleStarred}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isCurrentStarred
                          ? 'bg-[#ffc20e] text-[#6d5100] border-[#ffc20e]'
                          : 'bg-white text-[#817660] border-[#d3c5ab] hover:text-[#201b11]'
                      }`}
                      title={isCurrentStarred ? 'Bookmarked' : 'Bookmark Card'}
                    >
                      {isCurrentStarred ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => handleSpeak(currentCard?.command || '', e)}
                      className="p-1.5 rounded-lg bg-white border border-[#d3c5ab] text-[#817660] hover:text-[#201b11] transition-colors cursor-pointer"
                      title="Pronounce aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Front Center: The Concept / Command Name */}
                <div className="flex-grow flex flex-col items-center justify-center my-6 text-center">
                  <span className="font-mono font-bold text-2xl md:text-3xl text-[#1A1A1A] bg-[#ece1d0] px-6 py-3.5 rounded-xl border border-[#d3c5ab] shadow-2xs group-hover:border-[#785a00] transition-colors max-w-full break-words">
                    {currentCard?.command}
                  </span>

                  {currentCard?.category && (
                    <span className="text-xs text-[#817660] font-semibold mt-3">
                      Category: {currentCard.category}
                    </span>
                  )}
                </div>

                {/* Front Footer */}
                <div className="flex justify-between items-center text-xs text-[#817660]">
                  <div className="flex items-center gap-1.5">
                    {isCurrentMastered ? (
                      <span className="text-[#28A745] font-bold flex items-center gap-1 text-[11px] bg-[#28A745]/10 px-2 py-0.5 rounded">
                        <Check className="w-3.5 h-3.5" /> Mastered
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#817660]">Tap card to view answer</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[#785a00] font-bold">
                    <Hand className="w-4 h-4 animate-bounce" />
                    <span>Flip card</span>
                  </div>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border border-[#d3c5ab] bg-[#ffffff] shadow-sm flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                {/* Back Top Bar */}
                <div className="flex justify-between items-center text-xs text-[#817660]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[10px] uppercase text-[#28A745] bg-[#28A745]/10 px-2 py-0.5 rounded border border-[#28A745]/20">
                      Definition & Syntax
                    </span>
                    <span className="font-mono text-[10px] text-[#785a00] font-bold">
                      {currentCard?.command}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleSpeak(currentCard?.definition || '', e)}
                      className="p-1 rounded-md bg-[#f8ecdb] text-[#785a00] hover:bg-[#ece1d0] cursor-pointer"
                      title="Read explanation aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <Sparkles className="w-4 h-4 text-[#ffc20e]" />
                  </div>
                </div>

                {/* Back Content Body */}
                <div className="flex-grow flex flex-col gap-3 my-3 text-left">
                  {/* Definition */}
                  <h3 className="font-bold text-sm md:text-base text-[#201b11] leading-snug">
                    {currentCard?.definition}
                  </h3>

                  {/* Code Example Box */}
                  {currentCard?.example && (
                    <div className="bg-[#fef2e1] p-3 rounded-xl border border-[#d3c5ab] w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#495e8a]">
                          Live Command Example
                        </span>
                        <button
                          onClick={(e) => handleCopyCode(currentCard.example, e)}
                          className="text-[10px] font-bold text-[#785a00] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-[#d3c5ab]"
                        >
                          {copiedCode ? (
                            <>
                              <CheckCheck className="w-3 h-3 text-[#28A745]" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <code className="font-mono text-xs md:text-sm text-[#1A1A1A] font-bold block bg-[#ffffff] p-2 rounded-lg border border-[#d3c5ab]/60 overflow-x-auto whitespace-pre-wrap">
                        {currentCard.example}
                      </code>
                      <p className="text-xs text-[#4f4632] mt-1.5 leading-relaxed">
                        {currentCard.exampleExplanation}
                      </p>
                    </div>
                  )}

                  {/* High-Yield Exam Tip */}
                  {currentCard?.examTip && (
                    <div className="bg-[#fff9e6] border border-[#ffc20e] p-2.5 rounded-xl flex items-start gap-2 text-xs">
                      <Lightbulb className="w-4 h-4 text-[#785a00] flex-shrink-0 mt-0.5" />
                      <p className="text-[#6d5100] leading-snug">
                        <strong>Exam Tip:</strong> {currentCard.examTip}
                      </p>
                    </div>
                  )}
                </div>

                {/* Back Footer */}
                <div className="flex justify-between items-center text-xs text-[#817660] pt-2 border-t border-[#d3c5ab]/40">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[#f8ecdb] border border-[#d3c5ab] rounded text-[10px] font-mono">
                      Space
                    </kbd>
                    <span className="text-[10px]">to flip</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#785a00]">Tap to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Study Again vs Mastered */}
          <div className="w-full flex items-center justify-between gap-3 mt-5">
            <button
              onClick={prevCard}
              className="p-3 rounded-xl bg-white border border-[#d3c5ab] text-[#4f4632] hover:bg-[#f8ecdb] transition-colors cursor-pointer shadow-2xs"
              title="Previous card (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleStudyAgain}
              className="flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl border border-[#ba1a1a] bg-white text-[#ba1a1a] hover:bg-[#ffdad6] transition-all gap-2 shadow-2xs active:scale-98 cursor-pointer font-bold text-xs uppercase tracking-wider"
            >
              <RotateCw className="w-4 h-4" />
              <span>Study Again</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 bg-[#ffdad6] rounded text-[10px] lowercase font-normal">
                R key
              </kbd>
            </button>

            <button
              onClick={handleGotIt}
              className="flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl bg-[#28A745] text-white hover:bg-[#218838] transition-all gap-2 shadow-xs active:scale-98 cursor-pointer font-bold text-xs uppercase tracking-wider"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Got It (Mastered)</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 bg-black/20 text-white rounded text-[10px] lowercase font-normal">
                L key
              </kbd>
            </button>

            <button
              onClick={nextCard}
              className="p-3 rounded-xl bg-white border border-[#d3c5ab] text-[#4f4632] hover:bg-[#f8ecdb] transition-colors cursor-pointer shadow-2xs"
              title="Next card (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-between items-center w-full px-2 mt-4 text-xs font-semibold text-[#817660]">
            <span>
              Mastered: <strong className="text-[#28A745]">{masteredCardIds.length}</strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-[#817660]">
                Press <kbd className="px-1 bg-[#f8ecdb] rounded text-[10px]">Space</kbd> to flip
              </span>
            </div>
            <span>
              Needs Review: <strong className="text-[#ba1a1a]">{reviewCardIds.length}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Quick Jump Index Drawer Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d3c5ab] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#d3c5ab] flex justify-between items-center bg-[#fff8f2] rounded-t-2xl">
              <div>
                <h3 className="font-bold text-base text-[#201b11]">
                  {selectedTopic === 105 ? 'Topic 105' : selectedTopic === 104 ? 'Topic 104' : selectedTopic === 103 ? 'Topic 103' : selectedTopic === 102 ? 'Topic 102' : selectedTopic === 101 ? 'Topic 101' : 'LPIC-1'} Flashcard Index
                </h3>
                <p className="text-xs text-[#817660]">
                  Click on any card to jump directly to it ({filteredCards.length} cards available)
                </p>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-xl text-[#817660] hover:bg-[#ece1d0] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {deckOrder.map((card, idx) => {
                const isMastered = masteredCardIds.includes(card.id);
                const isReview = reviewCardIds.includes(card.id);
                const isStarred = starredCardIds.includes(card.id);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsFlipped(false);
                      setShowGridModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#785a00] bg-[#fef2e1] ring-2 ring-[#785a00]/30'
                        : isMastered
                        ? 'border-[#28A745]/40 bg-[#28A745]/5 hover:border-[#28A745]'
                        : isReview
                        ? 'border-[#ba1a1a]/40 bg-[#ba1a1a]/5 hover:border-[#ba1a1a]'
                        : 'border-[#d3c5ab] bg-white hover:bg-[#fff8f2]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#817660]">
                        #{card.id}
                      </span>
                      <div className="flex items-center gap-1">
                        {isStarred && <Bookmark className="w-3 h-3 text-[#ffc20e] fill-current" />}
                        {isMastered && <Check className="w-3 h-3 text-[#28A745] stroke-[3]" />}
                        {isReview && <RotateCw className="w-3 h-3 text-[#ba1a1a]" />}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#201b11] truncate block">
                      {card.command}
                    </span>
                    <span className="text-[10px] text-[#817660] truncate block mt-0.5">
                      {card.objectiveId ? `Obj ${card.objectiveId}` : card.category || `Topic ${card.topicNumber || 101}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-[#d3c5ab] bg-[#fff8f2] flex justify-between items-center text-xs text-[#817660] rounded-b-2xl">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28A745]" /> Mastered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /> Review
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffc20e]" /> Starred
                </span>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="px-3 py-1 bg-[#785a00] text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-[#6d5100]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
