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
  Monitor,
  Server,
  Network,
  Shield,
  Activity,
  Power,
  FolderTree,
  CheckCircle2,
  Globe,
  Wrench,
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onCardLearned?: (cardId: number) => void;
  initialTopic?: 101 | 102 | 103 | 104 | 105 | 106 | 108 | 109 | 110 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 'all';
}

type SelectedTopic = 101 | 102 | 103 | 104 | 105 | 106 | 108 | 109 | 110 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 'all';

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
  | '106.1'
  | '106.2'
  | '106.3'
  | '108.1'
  | '108.2'
  | '108.3'
  | '108.4'
  | '109.1'
  | '109.2'
  | '109.3'
  | '109.4'
  | '110.1'
  | '110.2'
  | '110.3'
  | '200.1'
  | '200.2'
  | '201.1'
  | '201.2'
  | '201.3'
  | '202.1'
  | '202.2'
  | '202.3'
  | '203.1'
  | '203.2'
  | '203.3'
  | '204.1'
  | '204.2'
  | '204.3'
  | '205.1'
  | '205.2'
  | '205.3'
  | '206.1'
  | '206.2'
  | '206.3'
  | '207.1'
  | '207.2'
  | '207.3'
  | '208.1'
  | '208.2'
  | '208.3'
  | '208.4'
  | 'starred'
  | 'review';

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  cards,
  onCardLearned,
  initialTopic = 203,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic>(initialTopic);
  const [activeDeckFilter, setActiveDeckFilter] = useState<FilterObjective>('all-topic');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
    } else if (selectedTopic === 106) {
      result = result.filter(
        (c) => c.topicNumber === 106 || c.deck.includes('Topic 106') || c.objectiveId?.startsWith('106.')
      );
    } else if (selectedTopic === 108) {
      result = result.filter(
        (c) => c.topicNumber === 108 || c.deck.includes('Topic 108') || c.objectiveId?.startsWith('108.')
      );
    } else if (selectedTopic === 109) {
      result = result.filter(
        (c) => c.topicNumber === 109 || c.deck.includes('Topic 109') || c.objectiveId?.startsWith('109.')
      );
    } else if (selectedTopic === 110) {
      result = result.filter(
        (c) => c.topicNumber === 110 || c.deck.includes('Topic 110') || c.objectiveId?.startsWith('110.')
      );
    } else if (selectedTopic === 200) {
      result = result.filter(
        (c) => c.topicNumber === 200 || c.deck.includes('Topic 200') || c.objectiveId?.startsWith('200.')
      );
    } else if (selectedTopic === 201) {
      result = result.filter(
        (c) => c.topicNumber === 201 || c.deck.includes('Topic 201') || c.objectiveId?.startsWith('201.')
      );
    } else if (selectedTopic === 202) {
      result = result.filter(
        (c) => c.topicNumber === 202 || c.deck.includes('Topic 202') || c.objectiveId?.startsWith('202.')
      );
    } else if (selectedTopic === 203) {
      result = result.filter(
        (c) => c.topicNumber === 203 || c.deck.includes('Topic 203') || c.objectiveId?.startsWith('203.')
      );
    } else if (selectedTopic === 204) {
      result = result.filter(
        (c) => c.topicNumber === 204 || c.deck.includes('Topic 204') || c.objectiveId?.startsWith('204.')
      );
    } else if (selectedTopic === 205) {
      result = result.filter(
        (c) => c.topicNumber === 205 || c.deck.includes('Topic 205') || c.objectiveId?.startsWith('205.')
      );
    } else if (selectedTopic === 206) {
      result = result.filter(
        (c) => c.topicNumber === 206 || c.deck.includes('Topic 206') || c.objectiveId?.startsWith('206.')
      );
    } else if (selectedTopic === 207) {
      result = result.filter(
        (c) => c.topicNumber === 207 || c.deck.includes('Topic 207') || c.objectiveId?.startsWith('207.')
      );
    } else if (selectedTopic === 208) {
      result = result.filter(
        (c) => c.topicNumber === 208 || c.deck.includes('Topic 208') || c.objectiveId?.startsWith('208.')
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
    } else if (activeDeckFilter === '106.1') {
      result = result.filter((c) => c.objectiveId === '106.1');
    } else if (activeDeckFilter === '106.2') {
      result = result.filter((c) => c.objectiveId === '106.2');
    } else if (activeDeckFilter === '106.3') {
      result = result.filter((c) => c.objectiveId === '106.3');
    } else if (activeDeckFilter === '108.1') {
      result = result.filter((c) => c.objectiveId === '108.1');
    } else if (activeDeckFilter === '108.2') {
      result = result.filter((c) => c.objectiveId === '108.2');
    } else if (activeDeckFilter === '108.3') {
      result = result.filter((c) => c.objectiveId === '108.3');
    } else if (activeDeckFilter === '108.4') {
      result = result.filter((c) => c.objectiveId === '108.4');
    } else if (activeDeckFilter === '109.1') {
      result = result.filter((c) => c.objectiveId === '109.1');
    } else if (activeDeckFilter === '109.2') {
      result = result.filter((c) => c.objectiveId === '109.2');
    } else if (activeDeckFilter === '109.3') {
      result = result.filter((c) => c.objectiveId === '109.3');
    } else if (activeDeckFilter === '109.4') {
      result = result.filter((c) => c.objectiveId === '109.4');
    } else if (activeDeckFilter === '110.1') {
      result = result.filter((c) => c.objectiveId === '110.1');
    } else if (activeDeckFilter === '110.2') {
      result = result.filter((c) => c.objectiveId === '110.2');
    } else if (activeDeckFilter === '110.3') {
      result = result.filter((c) => c.objectiveId === '110.3');
    } else if (activeDeckFilter === '200.1') {
      result = result.filter((c) => c.objectiveId === '200.1');
    } else if (activeDeckFilter === '200.2') {
      result = result.filter((c) => c.objectiveId === '200.2');
    } else if (activeDeckFilter === '201.1') {
      result = result.filter((c) => c.objectiveId === '201.1');
    } else if (activeDeckFilter === '201.2') {
      result = result.filter((c) => c.objectiveId === '201.2');
    } else if (activeDeckFilter === '201.3') {
      result = result.filter((c) => c.objectiveId === '201.3');
    } else if (activeDeckFilter === '202.1') {
      result = result.filter((c) => c.objectiveId === '202.1');
    } else if (activeDeckFilter === '202.2') {
      result = result.filter((c) => c.objectiveId === '202.2');
    } else if (activeDeckFilter === '202.3') {
      result = result.filter((c) => c.objectiveId === '202.3');
    } else if (activeDeckFilter === '203.1') {
      result = result.filter((c) => c.objectiveId === '203.1');
    } else if (activeDeckFilter === '203.2') {
      result = result.filter((c) => c.objectiveId === '203.2');
    } else if (activeDeckFilter === '203.3') {
      result = result.filter((c) => c.objectiveId === '203.3');
    } else if (activeDeckFilter === '204.1') {
      result = result.filter((c) => c.objectiveId === '204.1');
    } else if (activeDeckFilter === '204.2') {
      result = result.filter((c) => c.objectiveId === '204.2');
    } else if (activeDeckFilter === '204.3') {
      result = result.filter((c) => c.objectiveId === '204.3');
    } else if (activeDeckFilter === '205.1') {
      result = result.filter((c) => c.objectiveId === '205.1');
    } else if (activeDeckFilter === '205.2') {
      result = result.filter((c) => c.objectiveId === '205.2');
    } else if (activeDeckFilter === '205.3') {
      result = result.filter((c) => c.objectiveId === '205.3');
    } else if (activeDeckFilter === '206.1') {
      result = result.filter((c) => c.objectiveId === '206.1');
    } else if (activeDeckFilter === '206.2') {
      result = result.filter((c) => c.objectiveId === '206.2');
    } else if (activeDeckFilter === '206.3') {
      result = result.filter((c) => c.objectiveId === '206.3');
    } else if (activeDeckFilter === '207.1') {
      result = result.filter((c) => c.objectiveId === '207.1');
    } else if (activeDeckFilter === '207.2') {
      result = result.filter((c) => c.objectiveId === '207.2');
    } else if (activeDeckFilter === '207.3') {
      result = result.filter((c) => c.objectiveId === '207.3');
    } else if (activeDeckFilter === '208.1') {
      result = result.filter((c) => c.objectiveId === '208.1');
    } else if (activeDeckFilter === '208.2') {
      result = result.filter((c) => c.objectiveId === '208.2');
    } else if (activeDeckFilter === '208.3') {
      result = result.filter((c) => c.objectiveId === '208.3');
    } else if (activeDeckFilter === '208.4') {
      result = result.filter((c) => c.objectiveId === '208.4');
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
          c.question?.toLowerCase().includes(q) ||
          c.answer?.toLowerCase().includes(q) ||
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
    setShowHint(false);
    if (totalInDeck === 0) return;
    if (currentIndex < totalInDeck - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalInDeck]);

  const prevCard = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
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

  const topic106Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 106 || c.deck.includes('Topic 106') || c.objectiveId?.startsWith('106.')),
    [cards]
  );
  const topic106Mastered = topic106Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic108Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 108 || c.deck.includes('Topic 108') || c.objectiveId?.startsWith('108.')),
    [cards]
  );
  const topic108Mastered = topic108Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic109Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 109 || c.deck.includes('Topic 109') || c.objectiveId?.startsWith('109.')),
    [cards]
  );
  const topic109Mastered = topic109Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic110Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 110 || c.deck.includes('Topic 110') || c.objectiveId?.startsWith('110.')),
    [cards]
  );
  const topic110Mastered = topic110Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic200Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 200 || c.deck.includes('Topic 200') || c.objectiveId?.startsWith('200.')),
    [cards]
  );
  const topic200Mastered = topic200Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic201Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 201 || c.deck.includes('Topic 201') || c.objectiveId?.startsWith('201.')),
    [cards]
  );
  const topic201Mastered = topic201Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic202Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 202 || c.deck.includes('Topic 202') || c.objectiveId?.startsWith('202.')),
    [cards]
  );
  const topic202Mastered = topic202Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic203Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 203 || c.deck.includes('Topic 203') || c.objectiveId?.startsWith('203.')),
    [cards]
  );
  const topic203Mastered = topic203Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic204Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 204 || c.deck.includes('Topic 204') || c.objectiveId?.startsWith('204.')),
    [cards]
  );
  const topic204Mastered = topic204Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic205Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 205 || c.deck.includes('Topic 205') || c.objectiveId?.startsWith('205.')),
    [cards]
  );
  const topic205Mastered = topic205Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic206Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 206 || c.deck.includes('Topic 206') || c.objectiveId?.startsWith('206.')),
    [cards]
  );
  const topic206Mastered = topic206Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic207Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 207 || c.deck.includes('Topic 207') || c.objectiveId?.startsWith('207.')),
    [cards]
  );
  const topic207Mastered = topic207Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic208Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 208 || c.deck.includes('Topic 208') || c.objectiveId?.startsWith('208.')),
    [cards]
  );
  const topic208Mastered = topic208Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const activeTopicTitle =
    selectedTopic === 208
      ? 'Topic 208: Web Services'
      : selectedTopic === 207
      ? 'Topic 207: Domain Name Server (DNS)'
      : selectedTopic === 206
      ? 'Topic 206: System Maintenance'
      : selectedTopic === 205
      ? 'Topic 205: Network Configuration'
      : selectedTopic === 204
      ? 'Topic 204: Advanced Storage Device Administration'
      : selectedTopic === 203
      ? 'Topic 203: Filesystem and Devices'
      : selectedTopic === 202
      ? 'Topic 202: System Startup'
      : selectedTopic === 201
      ? 'Topic 201: Linux Kernel'
      : selectedTopic === 200
      ? 'Topic 200: Capacity Planning'
      : selectedTopic === 110
      ? 'Topic 110: Security'
      : selectedTopic === 109
      ? 'Topic 109: Networking Fundamentals'
      : selectedTopic === 108
      ? 'Topic 108: Essential System Services'
      : selectedTopic === 106
      ? 'Topic 106: User Interfaces and Desktops'
      : selectedTopic === 105
      ? 'Topic 105: Shells and Shell Scripting'
      : selectedTopic === 104
      ? 'Topic 104: Devices, Linux Filesystems, Filesystem Hierarchy Standard'
      : selectedTopic === 103
      ? 'Topic 103: GNU and Unix Commands'
      : selectedTopic === 102
      ? 'Topic 102: Linux Installation and Package Management'
      : selectedTopic === 101
      ? 'Topic 101: System Architecture'
      : 'All LPIC Flashcards';

  const activeTopicBadge =
    selectedTopic === 208
      ? '100 Cards • 4 Sub-Objectives (Weight 12)'
      : selectedTopic === 207
      ? '100 Cards • 3 Sub-Objectives (Weight 12)'
      : selectedTopic === 206
      ? '100 Cards • 3 Sub-Objectives (Weight 6)'
      : selectedTopic === 205
      ? '100 Cards • 3 Sub-Objectives (Weight 11)'
      : selectedTopic === 204
      ? '100 Cards • 3 Sub-Objectives (Weight 10)'
      : selectedTopic === 203
      ? '100 Cards • 3 Sub-Objectives (Weight 8)'
      : selectedTopic === 202
      ? '100 Cards • 3 Sub-Objectives (Weight 11)'
      : selectedTopic === 201
      ? '100 Cards • 3 Sub-Objectives (Weight 9)'
      : selectedTopic === 200
      ? '100 Cards • 2 Sub-Objectives (Weight 8)'
      : selectedTopic === 110
      ? '100 Cards • 3 Sub-Objectives (Weight 9)'
      : selectedTopic === 109
      ? '100 Cards • 4 Sub-Objectives (Weight 14)'
      : selectedTopic === 108
      ? '100 Cards • 4 Sub-Objectives (Weight 12)'
      : selectedTopic === 106
      ? '100 Cards • 3 Sub-Objectives (Weight 4)'
      : selectedTopic === 105
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
    selectedTopic === 208
      ? topic208Mastered
      : selectedTopic === 207
      ? topic207Mastered
      : selectedTopic === 206
      ? topic206Mastered
      : selectedTopic === 205
      ? topic205Mastered
      : selectedTopic === 204
      ? topic204Mastered
      : selectedTopic === 203
      ? topic203Mastered
      : selectedTopic === 202
      ? topic202Mastered
      : selectedTopic === 201
      ? topic201Mastered
      : selectedTopic === 200
      ? topic200Mastered
      : selectedTopic === 110
      ? topic110Mastered
      : selectedTopic === 109
      ? topic109Mastered
      : selectedTopic === 108
      ? topic108Mastered
      : selectedTopic === 106
      ? topic106Mastered
      : selectedTopic === 105
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
    selectedTopic === 208
      ? topic208Cards.length || 100
      : selectedTopic === 207
      ? topic207Cards.length || 100
      : selectedTopic === 206
      ? topic206Cards.length || 100
      : selectedTopic === 205
      ? topic205Cards.length || 100
      : selectedTopic === 204
      ? topic204Cards.length || 100
      : selectedTopic === 203
      ? topic203Cards.length || 100
      : selectedTopic === 202
      ? topic202Cards.length || 100
      : selectedTopic === 201
      ? topic201Cards.length || 100
      : selectedTopic === 200
      ? topic200Cards.length || 100
      : selectedTopic === 110
      ? topic110Cards.length || 100
      : selectedTopic === 109
      ? topic109Cards.length || 100
      : selectedTopic === 108
      ? topic108Cards.length || 100
      : selectedTopic === 106
      ? topic106Cards.length || 100
      : selectedTopic === 105
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
            onClick={() => handleTopicSelect(208)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 208
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Topic 208 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2 (202)
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(207)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 207
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Topic 207 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2 (202)
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(206)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 206
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Topic 206 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2 (201)
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(205)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 205
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Topic 205 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2 (201)
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(204)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 204
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Topic 204 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(203)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 203
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Topic 203 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2 (201)
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(202)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 202
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>Topic 202 Deck (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(201)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 201
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Topic 201 (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(200)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 200
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Topic 200 (100)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">
              LPIC-2
            </span>
          </button>

          <button
            onClick={() => handleTopicSelect(110)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 110
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Topic 110 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(109)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 109
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Topic 109 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(108)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 108
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Topic 108 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(106)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 106
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Topic 106 (100)</span>
          </button>

          <button
            onClick={() => handleTopicSelect(105)}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedTopic === 105
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Topic 105 (100)</span>
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
            <span>All ({cards.length})</span>
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
                  {selectedTopic === 200 || selectedTopic === 201 || selectedTopic === 202 ? 'LPIC-2 Exam 201-450' : selectedTopic === 105 || selectedTopic === 106 || selectedTopic === 108 || selectedTopic === 109 || selectedTopic === 110 ? 'LPIC-1 Exam 102-500' : 'LPIC-1 Exam 101-500'}
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
                {selectedTopic === 207 ? 'Topic 207' : selectedTopic === 206 ? 'Topic 206' : selectedTopic === 205 ? 'Topic 205' : selectedTopic === 204 ? 'Topic 204' : selectedTopic === 203 ? 'Topic 203' : selectedTopic === 202 ? 'Topic 202' : selectedTopic === 201 ? 'Topic 201' : selectedTopic === 200 ? 'Topic 200' : selectedTopic === 110 ? 'Topic 110' : selectedTopic === 109 ? 'Topic 109' : selectedTopic === 108 ? 'Topic 108' : selectedTopic === 106 ? 'Topic 106' : selectedTopic === 105 ? 'Topic 105' : selectedTopic === 104 ? 'Topic 104' : selectedTopic === 103 ? 'Topic 103' : selectedTopic === 102 ? 'Topic 102' : selectedTopic === 101 ? 'Topic 101' : 'Overall'} Mastery
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
              All In Deck ({selectedTopic === 208 ? topic208Cards.length : selectedTopic === 207 ? topic207Cards.length : selectedTopic === 206 ? topic206Cards.length : selectedTopic === 205 ? topic205Cards.length : selectedTopic === 204 ? topic204Cards.length : selectedTopic === 203 ? topic203Cards.length : selectedTopic === 202 ? topic202Cards.length : selectedTopic === 201 ? topic201Cards.length : selectedTopic === 200 ? topic200Cards.length : selectedTopic === 110 ? topic110Cards.length : selectedTopic === 109 ? topic109Cards.length : selectedTopic === 108 ? topic108Cards.length : selectedTopic === 106 ? topic106Cards.length : selectedTopic === 105 ? topic105Cards.length : selectedTopic === 104 ? topic104Cards.length : selectedTopic === 103 ? topic103Cards.length : selectedTopic === 102 ? topic102Cards.length : selectedTopic === 101 ? topic101Cards.length : cards.length})
            </button>

            {/* Topic 208 Sub-Objectives */}
            {selectedTopic === 208 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('208.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '208.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Basic Apache Configuration (208.1) - 30 cards (Weight 4)"
                >
                  208.1 Apache Configuration (30)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('208.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '208.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Apache Configuration for HTTPS (208.2) - 25 cards (Weight 3)"
                >
                  208.2 Apache HTTPS & SSL (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('208.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '208.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Implementing Squid as a Caching Proxy (208.3) - 20 cards (Weight 2)"
                >
                  208.3 Squid Caching Proxy (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('208.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '208.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Implementing Nginx as a Web Server and Reverse Proxy (208.4) - 25 cards (Weight 3)"
                >
                  208.4 Nginx Web & Proxy (25)
                </button>
              </>
            )}

            {/* Topic 207 Sub-Objectives */}
            {selectedTopic === 207 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('207.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '207.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Basic DNS Server Configuration (207.1) - 35 cards (Weight 4)"
                >
                  207.1 DNS Config & BIND (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('207.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '207.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Create and Maintain DNS Zones (207.2) - 35 cards (Weight 4)"
                >
                  207.2 DNS Zones & RRs (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('207.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '207.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Securing a DNS Server (207.3) - 30 cards (Weight 4)"
                >
                  207.3 Securing DNS & DNSSEC (30)
                </button>
              </>
            )}

            {/* Topic 206 Sub-Objectives */}
            {selectedTopic === 206 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('206.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '206.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Make and install programs from source (206.1) - 35 cards (Weight 2)"
                >
                  206.1 Source Compilation (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('206.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '206.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Backup Operations (206.2) - 40 cards (Weight 3)"
                >
                  206.2 Backup Operations (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('206.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '206.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Notify users on system-related issues (206.3) - 25 cards (Weight 1)"
                >
                  206.3 User Notifications (25)
                </button>
              </>
            )}

            {/* Topic 205 Sub-Objectives */}
            {selectedTopic === 205 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('205.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '205.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Basic Networking Configuration (205.1) - 35 cards (Weight 3)"
                >
                  205.1 Basic Networking (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('205.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '205.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Advanced Network Configuration & Troubleshooting (205.2) - 35 cards (Weight 4)"
                >
                  205.2 Bonding, VLAN & Wireless (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('205.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '205.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Troubleshooting Network Issues (205.3) - 30 cards (Weight 4)"
                >
                  205.3 Network Diagnostics & Capture (30)
                </button>
              </>
            )}

            {/* Topic 204 Sub-Objectives */}
            {selectedTopic === 204 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('204.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '204.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Operating the Linux filesystem (204.1) - 35 cards (Weight 3)"
                >
                  204.1 Operating FS (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('204.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '204.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Maintaining a Linux filesystem (204.2) - 35 cards (Weight 3)"
                >
                  204.2 Maintaining FS (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('204.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '204.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Creating and configuring filesystem options (204.3) - 30 cards (Weight 4)"
                >
                  204.3 FS Options & LVM/RAID (30)
                </button>
              </>
            )}

            {/* Topic 203 Sub-Objectives */}
            {selectedTopic === 203 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('203.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '203.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Operating the Linux Filesystem (203.1) - 40 cards (Weight 3)"
                >
                  203.1 Operating FS & autofs (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('203.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '203.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Maintaining a Linux Filesystem (203.2) - 35 cards (Weight 3)"
                >
                  203.2 Maintaining FS & SMART (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('203.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '203.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Creating and Configuring Filesystem Options (203.3) - 25 cards (Weight 2)"
                >
                  203.3 ISO, FUSE & ZFS (25)
                </button>
              </>
            )}

            {/* Topic 202 Sub-Objectives */}
            {selectedTopic === 202 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('202.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '202.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Customizing SysV-init System Startup (202.1) - 30 cards (Weight 3)"
                >
                  202.1 SysV-init (30)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('202.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '202.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Systemd System Startup (202.2) - 38 cards (Weight 4)"
                >
                  202.2 Systemd (38)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('202.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '202.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="System Recovery (202.3) - 32 cards (Weight 4)"
                >
                  202.3 System Recovery (32)
                </button>
              </>
            )}

            {/* Topic 201 Sub-Objectives */}
            {selectedTopic === 201 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('201.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '201.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Kernel Components (201.1) - 25 cards (Weight 2)"
                >
                  201.1 Components (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('201.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '201.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Compiling a Kernel (201.2) - 35 cards (Weight 3)"
                >
                  201.2 Compiling (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('201.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '201.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Kernel Runtime Management & Troubleshooting (201.3) - 40 cards (Weight 4)"
                >
                  201.3 Runtime & Troubleshooting (40)
                </button>
              </>
            )}

            {/* Topic 200 Sub-Objectives */}
            {selectedTopic === 200 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('200.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '200.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Measure and Troubleshoot Resource Usage (200.1)"
                >
                  200.1 Resource Usage (65)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('200.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '200.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Predict Future Resource Needs (200.2)"
                >
                  200.2 Forecasting & RRD (35)
                </button>
              </>
            )}

            {/* Topic 110 Sub-Objectives */}
            {selectedTopic === 110 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('110.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '110.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Perform security administration tasks (110.1)"
                >
                  110.1 Security Admin (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('110.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '110.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Setup host security (110.2)"
                >
                  110.2 Host Security (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('110.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '110.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Securing data with encryption (110.3)"
                >
                  110.3 Encryption (30)
                </button>
              </>
            )}

            {/* Topic 109 Sub-Objectives */}
            {selectedTopic === 109 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('109.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '109.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Fundamentals of internet protocols (109.1)"
                >
                  109.1 Internet Protocols (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('109.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '109.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Persistent network configuration (109.2)"
                >
                  109.2 Network Config (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('109.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '109.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Basic network troubleshooting (109.3)"
                >
                  109.3 Troubleshooting (30)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('109.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '109.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Configure client side DNS (109.4)"
                >
                  109.4 Client DNS (20)
                </button>
              </>
            )}

            {/* Topic 108 Sub-Objectives */}
            {selectedTopic === 108 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('108.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '108.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Maintain system time (108.1)"
                >
                  108.1 System Time (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('108.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '108.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="System logging (108.2)"
                >
                  108.2 System Logging (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('108.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '108.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Mail Transfer Agent (MTA) basics (108.3)"
                >
                  108.3 MTA Basics (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('108.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '108.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Manage printers and printing (108.4)"
                >
                  108.4 Printing & CUPS (15)
                </button>
              </>
            )}

            {/* Topic 106 Sub-Objectives */}
            {selectedTopic === 106 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('106.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '106.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Install and configure X11 (106.1)"
                >
                  106.1 Install & Config X11 (45)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('106.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '106.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Graphical Desktops (106.2)"
                >
                  106.2 Graphical Desktops (30)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('106.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '106.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Accessibility (106.3)"
                >
                  106.3 Accessibility (25)
                </button>
              </>
            )}
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
              selectedTopic === 202
                ? 'Search systemctl, journalctl, inittab, grub-install, chroot, efibootmgr...'
                : selectedTopic === 201
                ? 'Search vmlinuz, make menuconfig, modprobe, sysctl, udev, DKMS...'
                : selectedTopic === 200
                ? 'Search iostat, sar, vmstat, collectd, rrdtool, Cacti, nc...'
                : selectedTopic === 110
                ? 'Search sudo, iptables, ufw, gpg, ssh-keygen, fail2ban...'
                : selectedTopic === 109
                ? 'Search ip, nmcli, ss, dig, traceroute, /etc/resolv.conf...'
                : selectedTopic === 102
                ? 'Search dpkg, rpm, ldd, fstab, LVM, cloud-init...'
                : selectedTopic === 101
                ? 'Search lsmod, GRUB, systemd, udev, dmesg...'
                : 'Search all LPIC commands, parameters, files, or concepts...'
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
        <div className="w-full max-w-2xl flex flex-col items-center">
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

          {/* Interactive Flashcard with 3D Flip (Auto-sizing, no scrollbar needed) */}
          <div className="w-full relative select-none">
            {/* Layered stack visual effect behind */}
            <div className="absolute -bottom-2 inset-x-2 h-full bg-[#f2e7d6] rounded-2xl border border-[#d3c5ab] -z-10 shadow-xs pointer-events-none" />
            <div className="absolute -bottom-4 inset-x-4 h-full bg-[#ece1d0] rounded-2xl border border-[#d3c5ab] -z-20 shadow-xs pointer-events-none" />

            <div
              className="w-full perspective-1000 cursor-pointer group"
              onClick={handleFlip}
            >
              {!isFlipped ? (
                /* FRONT FACE */
                <div
                  key={`front-${currentCard?.id}`}
                  className="w-full min-h-[380px] rounded-2xl border border-[#d3c5ab] bg-[#fff8f2] shadow-sm flex flex-col justify-between p-5 sm:p-7 md:p-8 animate-card-flip"
                >
                  {/* Front Top Bar */}
                  <div className="flex justify-between items-center text-xs mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono uppercase font-bold text-[11px] bg-[#785a00] text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                        {currentCard?.topicNumber && currentCard.topicNumber >= 200
                          ? `LPIC-2: ${currentCard.objectiveId || currentCard.topicNumber}`
                          : currentCard?.objectiveId
                          ? `LPIC-1: ${currentCard.objectiveId}`
                          : 'LPIC-1'}
                      </span>
                      {currentCard?.difficulty && (
                        <span className="text-[10px] font-bold text-[#817660] bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                          {currentCard.difficulty}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-[#785a00] bg-[#fff4db] px-2 py-0.5 rounded border border-[#ffc20e]/60 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-[#785a00]" />
                        Challenge
                      </span>
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
                        onClick={(e) => handleSpeak(currentCard?.question || currentCard?.command || '', e)}
                        className="p-1.5 rounded-lg bg-white border border-[#d3c5ab] text-[#817660] hover:text-[#201b11] transition-colors cursor-pointer"
                        title="Pronounce question aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Front Center: The Exam Question / Challenge */}
                  <div className="flex-grow flex flex-col items-center justify-center my-6 text-center px-2">
                    <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2e1] border border-[#d3c5ab] text-[11px] font-bold text-[#785a00]">
                      <HelpCircle className="w-3.5 h-3.5 text-[#785a00]" />
                      <span>LPI Exam Question / Challenge</span>
                    </div>

                    {/* The specific question */}
                    <h2 className="font-bold text-base sm:text-lg md:text-xl text-[#1A1A1A] leading-relaxed max-w-xl mb-3">
                      {currentCard?.question
                        ? currentCard.question
                        : `What is the syntax, key options, and purpose of the "${currentCard?.command}" command in Linux?`}
                    </h2>

                    {currentCard?.category && (
                      <span className="text-xs text-[#817660] font-semibold bg-white/80 px-2.5 py-1 rounded-md border border-[#d3c5ab]/60">
                        Objective Area: {currentCard.category}
                      </span>
                    )}

                    {/* Hint peek toggle */}
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      {showHint ? (
                        <div className="inline-flex items-center gap-2 text-xs bg-[#ece1d0] text-[#785a00] font-mono font-bold px-3 py-1.5 rounded-lg border border-[#d3c5ab] shadow-2xs">
                          <Lightbulb className="w-3.5 h-3.5 text-[#ffc20e] flex-shrink-0" />
                          <span>Command Clue: <strong className="text-[#1A1A1A]">{currentCard?.command}</strong></span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowHint(true)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#817660] hover:text-[#785a00] px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#d3c5ab] transition-colors cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-[#ffc20e]" />
                          <span>Show Command Clue</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Front Footer */}
                  <div className="flex justify-between items-center text-xs text-[#817660] pt-2 border-t border-[#d3c5ab]/40">
                    <div className="flex items-center gap-1.5">
                      {isCurrentMastered ? (
                        <span className="text-[#28A745] font-bold flex items-center gap-1 text-[11px] bg-[#28A745]/10 px-2 py-0.5 rounded">
                          <Check className="w-3.5 h-3.5" /> Mastered
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#817660]">Tap card to reveal answer</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[#785a00] font-bold">
                      <Hand className="w-4 h-4 animate-bounce" />
                      <span>Tap to view answer</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* BACK FACE (Completely displayed answer, zero scrollbar needed) */
                <div
                  key={`back-${currentCard?.id}`}
                  className="w-full min-h-[380px] rounded-2xl border border-[#d3c5ab] bg-white shadow-sm flex flex-col justify-between p-5 sm:p-7 md:p-8 animate-card-flip"
                >
                  {/* Back Top Bar */}
                  <div className="flex justify-between items-center text-xs text-[#817660] mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[10px] uppercase text-[#28A745] bg-[#28A745]/10 px-2.5 py-1 rounded-md border border-[#28A745]/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745]" />
                        Correct Answer & Solution
                      </span>
                      <span className="font-mono text-xs text-[#785a00] font-bold bg-[#f8ecdb] px-2.5 py-0.5 rounded border border-[#d3c5ab]">
                        {currentCard?.command}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleSpeak(currentCard?.answer || currentCard?.definition || '', e)}
                        className="p-1.5 rounded-lg bg-white border border-[#d3c5ab] text-[#785a00] hover:bg-[#f8ecdb] transition-colors cursor-pointer"
                        title="Read answer aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <Sparkles className="w-4 h-4 text-[#ffc20e]" />
                    </div>
                  </div>

                  {/* Back Content Body - Completely visible, structured naturally */}
                  <div className="flex-grow flex flex-col gap-3 my-2 text-left">
                    {/* Primary Answer & Explanation */}
                    {currentCard?.answer ? (
                      <>
                        <div className="bg-[#f0f9f1] border border-[#28A745]/30 p-3 rounded-xl shadow-2xs">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1e7e34] mb-1">
                            <Check className="w-3.5 h-3.5 text-[#28A745]" />
                            <span>Direct Answer:</span>
                          </div>
                          <p className="font-mono text-xs sm:text-sm font-bold text-[#1A1A1A] bg-white p-2.5 rounded-lg border border-[#28A745]/20 leading-relaxed break-words">
                            {currentCard.answer}
                          </p>
                        </div>

                        {currentCard?.definition && currentCard.definition !== currentCard.answer && (
                          <div className="flex flex-col gap-1 bg-[#fff8f2] p-2.5 rounded-xl border border-[#d3c5ab]/60">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#785a00]">
                              Detailed Explanation
                            </span>
                            <p className="font-medium text-xs sm:text-sm text-[#201b11] leading-relaxed">
                              {currentCard.definition}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-[#f0f9f1] border border-[#28A745]/30 p-3.5 rounded-xl shadow-2xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1e7e34] mb-1.5">
                          <Check className="w-3.5 h-3.5 text-[#28A745]" />
                          <span>Core Answer & Concept:</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                          {currentCard?.definition}
                        </p>
                      </div>
                    )}

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
                        <code className="font-mono text-xs text-[#1A1A1A] font-bold block bg-white p-2 rounded-lg border border-[#d3c5ab]/60 overflow-x-auto whitespace-pre-wrap break-all">
                          {currentCard.example}
                        </code>
                        {currentCard.exampleExplanation && (
                          <p className="text-xs text-[#4f4632] mt-1.5 leading-relaxed">
                            {currentCard.exampleExplanation}
                          </p>
                        )}
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
                  <div className="flex justify-between items-center text-xs text-[#817660] pt-2 border-t border-[#d3c5ab]/40 mt-1">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-[#f8ecdb] border border-[#d3c5ab] rounded text-[10px] font-mono">
                        Space
                      </kbd>
                      <span className="text-[10px]">to flip</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#785a00] flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      Tap card to flip back
                    </span>
                  </div>
                </div>
              )}
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
                  {selectedTopic === 110 ? 'Topic 110' : selectedTopic === 109 ? 'Topic 109' : selectedTopic === 108 ? 'Topic 108' : selectedTopic === 106 ? 'Topic 106' : selectedTopic === 105 ? 'Topic 105' : selectedTopic === 104 ? 'Topic 104' : selectedTopic === 103 ? 'Topic 103' : selectedTopic === 102 ? 'Topic 102' : selectedTopic === 101 ? 'Topic 101' : 'LPIC-1'} Flashcard Index
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
