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
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onCardLearned?: (cardId: number) => void;
}

type FilterObjective = 'all-101' | '101.1' | '101.2' | '101.3' | 'all' | 'starred' | 'review';

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, onCardLearned }) => {
  const [activeDeckFilter, setActiveDeckFilter] = useState<FilterObjective>('all-101');
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

  // Compute filtered card list
  const filteredCards = useMemo(() => {
    let result = cards;

    // Filter by deck/objective
    if (activeDeckFilter === 'all-101') {
      result = result.filter(
        (c) => c.topicNumber === 101 || c.deck.includes('Topic 101') || c.objectiveId?.startsWith('101.')
      );
    } else if (activeDeckFilter === '101.1') {
      result = result.filter((c) => c.objectiveId === '101.1');
    } else if (activeDeckFilter === '101.2') {
      result = result.filter((c) => c.objectiveId === '101.2');
    } else if (activeDeckFilter === '101.3') {
      result = result.filter((c) => c.objectiveId === '101.3');
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
  }, [cards, activeDeckFilter, searchQuery, starredCardIds, reviewCardIds]);

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

  // Count metrics for Topic 101
  const topic101Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 101 || c.deck.includes('Topic 101') || c.objectiveId?.startsWith('101.')),
    [cards]
  );
  const topic101Mastered = topic101Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center pb-24 px-2">
      {/* Header Topic 101 Banner */}
      <div className="w-full bg-[#fef2e1] border border-[#d3c5ab] rounded-2xl p-4 md:p-5 mb-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#785a00] text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
              101
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#785a00] uppercase tracking-wider bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                  LPIC-1 Exam 101 Deck
                </span>
                <span className="text-[11px] font-bold text-[#495e8a] bg-white px-2 py-0.5 rounded border border-[#d3c5ab]">
                  100 Interactive Cards
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#201b11] mt-0.5">
                Topic 101: System Architecture
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/80 border border-[#d3c5ab] px-4 py-2 rounded-xl self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#817660] block">Topic 101 Mastery</span>
              <span className="text-base font-bold text-[#785a00]">
                {topic101Mastered} / {topic101Cards.length || 100}{' '}
                <span className="text-xs text-[#817660] font-normal">
                  ({Math.round(((topic101Mastered) / (topic101Cards.length || 100)) * 100)}%)
                </span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#785a00] flex items-center justify-center font-bold text-xs text-[#785a00] bg-[#fef2e1]">
              {Math.round(((topic101Mastered) / (topic101Cards.length || 100)) * 100)}%
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-[#d3c5ab]/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setActiveDeckFilter('all-101')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDeckFilter === 'all-101'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Topic 101 (100)
            </button>

            <button
              onClick={() => setActiveDeckFilter('101.1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDeckFilter === '101.1'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              101.1 Hardware (35)
            </button>

            <button
              onClick={() => setActiveDeckFilter('101.2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDeckFilter === '101.2'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              101.2 Boot & GRUB (35)
            </button>

            <button
              onClick={() => setActiveDeckFilter('101.3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDeckFilter === '101.3'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              101.3 Runlevels & Targets (30)
            </button>

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
              Needs Review ({reviewCardIds.length})
            </button>
          </div>

          {/* Quick Jump Grid Button */}
          <button
            onClick={() => setShowGridModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#495e8a] hover:bg-[#ece1d0] border border-[#d3c5ab] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Browse all 100 cards in a visual index"
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
            placeholder="Search Topic 101 commands, files, or concepts..."
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
              setActiveDeckFilter('all-101');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#785a00] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-[#6d5100]"
          >
            Show All 100 Topic 101 Cards
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* Deck Progress Bar & Counter */}
          <div className="w-full flex flex-col gap-1.5 mb-3">
            <div className="flex justify-between items-center text-xs font-bold text-[#495e8a]">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wider">
                  {currentCard?.objectiveId ? `OBJ ${currentCard.objectiveId}` : 'TOPIC 101'}
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
                      {currentCard?.objectiveId ? `LPIC-1: ${currentCard.objectiveId}` : 'Topic 101'}
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
                      <code className="font-mono text-xs md:text-sm text-[#1A1A1A] font-bold block bg-[#ffffff] p-2 rounded-lg border border-[#d3c5ab]/60 overflow-x-auto">
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
                <h3 className="font-bold text-base text-[#201b11]">Topic 101 Flashcard Index</h3>
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
                      {card.objectiveId ? `Obj ${card.objectiveId}` : card.category || 'Topic 101'}
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
