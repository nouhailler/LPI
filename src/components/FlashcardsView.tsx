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
  ChevronDown,
  GraduationCap,
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
  Share2,
  Mail,
  Lock,
  Users,
  Boxes,
  Cloud,
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onCardLearned?: (cardId: number) => void;
  initialTopic?: SelectedTopic;
}

type SelectedTopic =
  | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110
  | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212
  | 301 | 302 | 303 | 304 | 305 | 306 | 325 | 326 | 327 | 328
  | 351 | 352 | 353 | 361 | 362 | 363 | 364
  | 'lpic1' | 'lpic2' | 'lpic3'
  | 'all';

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
  | '107.1'
  | '107.2'
  | '107.3'
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
  | '209.1'
  | '209.2'
  | '210.1'
  | '210.2'
  | '210.3'
  | '211.1'
  | '211.2'
  | '211.3'
  | '212.1'
  | '212.2'
  | '212.3'
  | '301.1'
  | '301.2'
  | '301.3'
  | '301.4'
  | '302.1'
  | '302.2'
  | '302.3'
  | '302.4'
  | '302.5'
  | '303.1'
  | '303.2'
  | '303.3'
  | '303.4'
  | '304.1'
  | '304.2'
  | '304.3'
  | '351.1'
  | '351.2'
  | '351.3'
  | '351.4'
  | '351.5'
  | '352.1'
  | '352.2'
  | '352.3'
  | '352.4'
  | '353.1'
  | '353.2'
  | '353.3'
  | '353.4'
  | '361.1'
  | '361.2'
  | '361.3'
  | '361.4'
  | '362.1'
  | '362.2'
  | '362.3'
  | '362.4'
  | '363.1'
  | '363.2'
  | '364.1'
  | '364.2'
  | '364.3'
  | '364.4'
  | '325.1'
  | '325.2'
  | '325.3'
  | '325.4'
  | '326.1'
  | '326.2'
  | '326.3'
  | '326.4'
  | '327.1'
  | '327.2'
  | '327.3'
  | '328.1'
  | '328.2'
  | '328.3'
  | '328.4'
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

    // Filter by Certification or Topic level first
    if (selectedTopic === 'lpic1') {
      result = result.filter(
        (c) =>
          (c.topicNumber && c.topicNumber >= 101 && c.topicNumber <= 110) ||
          c.deck.includes('LPIC-1') ||
          c.deck.includes('Topic 1') ||
          c.objectiveId?.startsWith('10')
      );
    } else if (selectedTopic === 'lpic2') {
      result = result.filter(
        (c) =>
          (c.topicNumber && c.topicNumber >= 200 && c.topicNumber <= 212) ||
          c.deck.includes('LPIC-2') ||
          c.deck.includes('Topic 2') ||
          c.objectiveId?.startsWith('2')
      );
    } else if (selectedTopic === 'lpic3') {
      result = result.filter(
        (c) =>
          (c.topicNumber && c.topicNumber >= 300 && c.topicNumber <= 364) ||
          c.deck.includes('LPIC-3') ||
          c.deck.includes('Topic 3') ||
          c.objectiveId?.startsWith('3')
      );
    } else if (selectedTopic === 101) {
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
    } else if (selectedTopic === 107) {
      result = result.filter(
        (c) => c.topicNumber === 107 || c.deck.includes('Topic 107') || c.objectiveId?.startsWith('107.')
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
    } else if (selectedTopic === 209) {
      result = result.filter(
        (c) => c.topicNumber === 209 || c.deck.includes('Topic 209') || c.objectiveId?.startsWith('209.')
      );
    } else if (selectedTopic === 210) {
      result = result.filter(
        (c) => c.topicNumber === 210 || c.deck.includes('Topic 210') || c.objectiveId?.startsWith('210.')
      );
    } else if (selectedTopic === 211) {
      result = result.filter(
        (c) => c.topicNumber === 211 || c.deck.includes('Topic 211') || c.objectiveId?.startsWith('211.')
      );
    } else if (selectedTopic === 212) {
      result = result.filter(
        (c) => c.topicNumber === 212 || c.deck.includes('Topic 212') || c.objectiveId?.startsWith('212.')
      );
    } else if (selectedTopic === 301) {
      result = result.filter(
        (c) => c.topicNumber === 301 || c.deck.includes('Topic 301') || c.objectiveId?.startsWith('301.')
      );
    } else if (selectedTopic === 302) {
      result = result.filter(
        (c) => c.topicNumber === 302 || c.deck.includes('Topic 302') || c.objectiveId?.startsWith('302.')
      );
    } else if (selectedTopic === 303) {
      result = result.filter(
        (c) => c.topicNumber === 303 || c.deck.includes('Topic 303') || c.objectiveId?.startsWith('303.')
      );
    } else if (selectedTopic === 304) {
      result = result.filter(
        (c) => c.topicNumber === 304 || c.deck.includes('Topic 304') || c.objectiveId?.startsWith('304.')
      );
    } else if (selectedTopic === 305) {
      result = result.filter(
        (c) =>
          c.topicNumber === 305 ||
          c.deck.includes('Topic 305') ||
          c.objectiveId?.startsWith('351.') ||
          c.objectiveId?.startsWith('352.') ||
          c.objectiveId?.startsWith('353.')
      );
    } else if (selectedTopic === 306) {
      result = result.filter(
        (c) =>
          c.topicNumber === 306 ||
          c.deck.includes('Topic 306') ||
          c.objectiveId?.startsWith('361.') ||
          c.objectiveId?.startsWith('362.') ||
          c.objectiveId?.startsWith('363.') ||
          c.objectiveId?.startsWith('364.')
      );
    } else if (selectedTopic === 325) {
      result = result.filter(
        (c) =>
          c.topicNumber === 325 ||
          c.deck.includes('Topic 325') ||
          c.objectiveId?.startsWith('325.')
      );
    } else if (selectedTopic === 328) {
      result = result.filter(
        (c) =>
          c.topicNumber === 328 ||
          c.deck.includes('Topic 328') ||
          c.objectiveId?.startsWith('328.')
      );
    } else if (selectedTopic === 327) {
      result = result.filter(
        (c) =>
          c.topicNumber === 327 ||
          c.deck.includes('Topic 327') ||
          c.objectiveId?.startsWith('327.')
      );
    } else if (selectedTopic === 326) {
      result = result.filter(
        (c) =>
          c.topicNumber === 326 ||
          c.deck.includes('Topic 326') ||
          c.objectiveId?.startsWith('326.')
      );
    } else if (selectedTopic === 351) {
      result = result.filter(
        (c) =>
          c.topicNumber === 351 ||
          c.deck.includes('Topic 351') ||
          c.objectiveId?.startsWith('351.')
      );
    } else if (selectedTopic === 352) {
      result = result.filter(
        (c) =>
          c.topicNumber === 352 ||
          c.deck.includes('Topic 352') ||
          c.objectiveId?.startsWith('352.')
      );
    } else if (selectedTopic === 353) {
      result = result.filter(
        (c) =>
          c.topicNumber === 353 ||
          c.deck.includes('Topic 353') ||
          c.objectiveId?.startsWith('353.')
      );
    } else if (selectedTopic === 361) {
      result = result.filter(
        (c) =>
          c.topicNumber === 361 ||
          c.deck.includes('Topic 361') ||
          c.objectiveId?.startsWith('361.')
      );
    } else if (selectedTopic === 362) {
      result = result.filter(
        (c) =>
          c.topicNumber === 362 ||
          c.deck.includes('Topic 362') ||
          c.objectiveId?.startsWith('362.')
      );
    } else if (selectedTopic === 363) {
      result = result.filter(
        (c) =>
          c.topicNumber === 363 ||
          c.deck.includes('Topic 363') ||
          c.objectiveId?.startsWith('363.')
      );
    } else if (selectedTopic === 364) {
      result = result.filter(
        (c) =>
          c.topicNumber === 364 ||
          c.deck.includes('Topic 364') ||
          c.objectiveId?.startsWith('364.')
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
    } else if (activeDeckFilter === '107.1') {
      result = result.filter((c) => c.objectiveId === '107.1');
    } else if (activeDeckFilter === '107.2') {
      result = result.filter((c) => c.objectiveId === '107.2');
    } else if (activeDeckFilter === '107.3') {
      result = result.filter((c) => c.objectiveId === '107.3');
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
    } else if (activeDeckFilter === '209.1') {
      result = result.filter((c) => c.objectiveId === '209.1');
    } else if (activeDeckFilter === '209.2') {
      result = result.filter((c) => c.objectiveId === '209.2');
    } else if (activeDeckFilter === '210.1') {
      result = result.filter((c) => c.objectiveId === '210.1');
    } else if (activeDeckFilter === '210.2') {
      result = result.filter((c) => c.objectiveId === '210.2');
    } else if (activeDeckFilter === '210.3') {
      result = result.filter((c) => c.objectiveId === '210.3');
    } else if (activeDeckFilter === '211.1') {
      result = result.filter((c) => c.objectiveId === '211.1');
    } else if (activeDeckFilter === '211.2') {
      result = result.filter((c) => c.objectiveId === '211.2');
    } else if (activeDeckFilter === '211.3') {
      result = result.filter((c) => c.objectiveId === '211.3');
    } else if (activeDeckFilter === '212.1') {
      result = result.filter((c) => c.objectiveId === '212.1');
    } else if (activeDeckFilter === '212.2') {
      result = result.filter((c) => c.objectiveId === '212.2');
    } else if (activeDeckFilter === '212.3') {
      result = result.filter((c) => c.objectiveId === '212.3');
    } else if (activeDeckFilter === '301.1') {
      result = result.filter((c) => c.objectiveId === '301.1');
    } else if (activeDeckFilter === '301.2') {
      result = result.filter((c) => c.objectiveId === '301.2');
    } else if (activeDeckFilter === '301.3') {
      result = result.filter((c) => c.objectiveId === '301.3');
    } else if (activeDeckFilter === '301.4') {
      result = result.filter((c) => c.objectiveId === '301.4');
    } else if (activeDeckFilter === '302.1') {
      result = result.filter((c) => c.objectiveId === '302.1');
    } else if (activeDeckFilter === '302.2') {
      result = result.filter((c) => c.objectiveId === '302.2');
    } else if (activeDeckFilter === '302.3') {
      result = result.filter((c) => c.objectiveId === '302.3');
    } else if (activeDeckFilter === '302.4') {
      result = result.filter((c) => c.objectiveId === '302.4');
    } else if (activeDeckFilter === '302.5') {
      result = result.filter((c) => c.objectiveId === '302.5');
    } else if (activeDeckFilter === '303.1') {
      result = result.filter((c) => c.objectiveId === '303.1');
    } else if (activeDeckFilter === '303.2') {
      result = result.filter((c) => c.objectiveId === '303.2');
    } else if (activeDeckFilter === '303.3') {
      result = result.filter((c) => c.objectiveId === '303.3');
    } else if (activeDeckFilter === '303.4') {
      result = result.filter((c) => c.objectiveId === '303.4');
    } else if (activeDeckFilter === '304.1') {
      result = result.filter((c) => c.objectiveId === '304.1');
    } else if (activeDeckFilter === '304.2') {
      result = result.filter((c) => c.objectiveId === '304.2');
    } else if (activeDeckFilter === '304.3') {
      result = result.filter((c) => c.objectiveId === '304.3');
    } else if (activeDeckFilter === '351.1') {
      result = result.filter((c) => c.objectiveId === '351.1');
    } else if (activeDeckFilter === '351.2') {
      result = result.filter((c) => c.objectiveId === '351.2');
    } else if (activeDeckFilter === '351.3') {
      result = result.filter((c) => c.objectiveId === '351.3');
    } else if (activeDeckFilter === '351.4') {
      result = result.filter((c) => c.objectiveId === '351.4');
    } else if (activeDeckFilter === '351.5') {
      result = result.filter((c) => c.objectiveId === '351.5');
    } else if (activeDeckFilter === '352.1') {
      result = result.filter((c) => c.objectiveId === '352.1');
    } else if (activeDeckFilter === '352.2') {
      result = result.filter((c) => c.objectiveId === '352.2');
    } else if (activeDeckFilter === '352.3') {
      result = result.filter((c) => c.objectiveId === '352.3');
    } else if (activeDeckFilter === '352.4') {
      result = result.filter((c) => c.objectiveId === '352.4');
    } else if (activeDeckFilter === '353.1') {
      result = result.filter((c) => c.objectiveId === '353.1');
    } else if (activeDeckFilter === '353.2') {
      result = result.filter((c) => c.objectiveId === '353.2');
    } else if (activeDeckFilter === '353.3') {
      result = result.filter((c) => c.objectiveId === '353.3');
    } else if (activeDeckFilter === '353.4') {
      result = result.filter((c) => c.objectiveId === '353.4');
    } else if (activeDeckFilter === '361.1') {
      result = result.filter((c) => c.objectiveId === '361.1');
    } else if (activeDeckFilter === '361.2') {
      result = result.filter((c) => c.objectiveId === '361.2');
    } else if (activeDeckFilter === '361.3') {
      result = result.filter((c) => c.objectiveId === '361.3');
    } else if (activeDeckFilter === '361.4') {
      result = result.filter((c) => c.objectiveId === '361.4');
    } else if (activeDeckFilter === '362.1') {
      result = result.filter((c) => c.objectiveId === '362.1');
    } else if (activeDeckFilter === '362.2') {
      result = result.filter((c) => c.objectiveId === '362.2');
    } else if (activeDeckFilter === '362.3') {
      result = result.filter((c) => c.objectiveId === '362.3');
    } else if (activeDeckFilter === '362.4') {
      result = result.filter((c) => c.objectiveId === '362.4');
    } else if (activeDeckFilter === '363.1') {
      result = result.filter((c) => c.objectiveId === '363.1');
    } else if (activeDeckFilter === '363.2') {
      result = result.filter((c) => c.objectiveId === '363.2');
    } else if (activeDeckFilter === '364.1') {
      result = result.filter((c) => c.objectiveId === '364.1');
    } else if (activeDeckFilter === '364.2') {
      result = result.filter((c) => c.objectiveId === '364.2');
    } else if (activeDeckFilter === '364.3') {
      result = result.filter((c) => c.objectiveId === '364.3');
    } else if (activeDeckFilter === '364.4') {
      result = result.filter((c) => c.objectiveId === '364.4');
    } else if (activeDeckFilter === '325.1') {
      result = result.filter((c) => c.objectiveId === '325.1');
    } else if (activeDeckFilter === '325.2') {
      result = result.filter((c) => c.objectiveId === '325.2');
    } else if (activeDeckFilter === '325.3') {
      result = result.filter((c) => c.objectiveId === '325.3');
    } else if (activeDeckFilter === '325.4') {
      result = result.filter((c) => c.objectiveId === '325.4');
    } else if (activeDeckFilter === '326.1') {
      result = result.filter((c) => c.objectiveId === '326.1');
    } else if (activeDeckFilter === '326.2') {
      result = result.filter((c) => c.objectiveId === '326.2');
    } else if (activeDeckFilter === '326.3') {
      result = result.filter((c) => c.objectiveId === '326.3');
    } else if (activeDeckFilter === '326.4') {
      result = result.filter((c) => c.objectiveId === '326.4');
    } else if (activeDeckFilter === '327.1') {
      result = result.filter((c) => c.objectiveId === '327.1');
    } else if (activeDeckFilter === '327.2') {
      result = result.filter((c) => c.objectiveId === '327.2');
    } else if (activeDeckFilter === '327.3') {
      result = result.filter((c) => c.objectiveId === '327.3');
    } else if (activeDeckFilter === '328.1') {
      result = result.filter((c) => c.objectiveId === '328.1');
    } else if (activeDeckFilter === '328.2') {
      result = result.filter((c) => c.objectiveId === '328.2');
    } else if (activeDeckFilter === '328.3') {
      result = result.filter((c) => c.objectiveId === '328.3');
    } else if (activeDeckFilter === '328.4') {
      result = result.filter((c) => c.objectiveId === '328.4');
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

  // Certification-level card groupings
  const lpic1Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          (c.topicNumber && c.topicNumber >= 101 && c.topicNumber <= 110) ||
          c.deck.includes('LPIC-1') ||
          c.deck.includes('Topic 1') ||
          c.objectiveId?.startsWith('10')
      ),
    [cards]
  );
  const lpic1Mastered = lpic1Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const lpic2Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          (c.topicNumber && c.topicNumber >= 200 && c.topicNumber <= 212) ||
          c.deck.includes('LPIC-2') ||
          c.deck.includes('Topic 2') ||
          c.objectiveId?.startsWith('2')
      ),
    [cards]
  );
  const lpic2Mastered = lpic2Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const lpic3Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          (c.topicNumber && c.topicNumber >= 300 && c.topicNumber <= 364) ||
          c.deck.includes('LPIC-3') ||
          c.deck.includes('Topic 3') ||
          c.objectiveId?.startsWith('3')
      ),
    [cards]
  );
  const lpic3Mastered = lpic3Cards.filter((c) => masteredCardIds.includes(c.id)).length;

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

  const topic107Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 107 || c.deck.includes('Topic 107') || c.objectiveId?.startsWith('107.')),
    [cards]
  );
  const topic107Mastered = topic107Cards.filter((c) => masteredCardIds.includes(c.id)).length;

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

  const topic209Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 209 || c.deck.includes('Topic 209') || c.objectiveId?.startsWith('209.')),
    [cards]
  );
  const topic209Mastered = topic209Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic210Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 210 || c.deck.includes('Topic 210') || c.objectiveId?.startsWith('210.')),
    [cards]
  );
  const topic210Mastered = topic210Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic211Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 211 || c.deck.includes('Topic 211') || c.objectiveId?.startsWith('211.')),
    [cards]
  );
  const topic211Mastered = topic211Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic212Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 212 || c.deck.includes('Topic 212') || c.objectiveId?.startsWith('212.')),
    [cards]
  );
  const topic212Mastered = topic212Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic301Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 301 || c.deck.includes('Topic 301') || c.objectiveId?.startsWith('301.')),
    [cards]
  );
  const topic301Mastered = topic301Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic302Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 302 || c.deck.includes('Topic 302') || c.objectiveId?.startsWith('302.')),
    [cards]
  );
  const topic302Mastered = topic302Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic303Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 303 || c.deck.includes('Topic 303') || c.objectiveId?.startsWith('303.')),
    [cards]
  );
  const topic303Mastered = topic303Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic304Cards = useMemo(
    () => cards.filter((c) => c.topicNumber === 304 || c.deck.includes('Topic 304') || c.objectiveId?.startsWith('304.')),
    [cards]
  );
  const topic304Mastered = topic304Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic305Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 305 ||
          c.deck.includes('Topic 305') ||
          c.objectiveId?.startsWith('351.') ||
          c.objectiveId?.startsWith('352.') ||
          c.objectiveId?.startsWith('353.')
      ),
    [cards]
  );
  const topic305Mastered = topic305Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic306Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 306 ||
          c.deck.includes('Topic 306') ||
          c.objectiveId?.startsWith('361.') ||
          c.objectiveId?.startsWith('362.') ||
          c.objectiveId?.startsWith('363.') ||
          c.objectiveId?.startsWith('364.')
      ),
    [cards]
  );
  const topic306Mastered = topic306Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic325Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 325 ||
          c.deck.includes('Topic 325') ||
          c.objectiveId?.startsWith('325.')
      ),
    [cards]
  );
  const topic325Mastered = topic325Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic328Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 328 ||
          c.deck.includes('Topic 328') ||
          c.objectiveId?.startsWith('328.')
      ),
    [cards]
  );
  const topic328Mastered = topic328Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic327Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 327 ||
          c.deck.includes('Topic 327') ||
          c.objectiveId?.startsWith('327.')
      ),
    [cards]
  );
  const topic327Mastered = topic327Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic326Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 326 ||
          c.deck.includes('Topic 326') ||
          c.objectiveId?.startsWith('326.')
      ),
    [cards]
  );
  const topic326Mastered = topic326Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic351Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 351 ||
          c.deck.includes('Topic 351') ||
          c.objectiveId?.startsWith('351.')
      ),
    [cards]
  );
  const topic351Mastered = topic351Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic352Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 352 ||
          c.deck.includes('Topic 352') ||
          c.objectiveId?.startsWith('352.')
      ),
    [cards]
  );
  const topic352Mastered = topic352Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic353Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 353 ||
          c.deck.includes('Topic 353') ||
          c.objectiveId?.startsWith('353.')
      ),
    [cards]
  );
  const topic353Mastered = topic353Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic361Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 361 ||
          c.deck.includes('Topic 361') ||
          c.objectiveId?.startsWith('361.')
      ),
    [cards]
  );
  const topic361Mastered = topic361Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic362Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 362 ||
          c.deck.includes('Topic 362') ||
          c.objectiveId?.startsWith('362.')
      ),
    [cards]
  );
  const topic362Mastered = topic362Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic363Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 363 ||
          c.deck.includes('Topic 363') ||
          c.objectiveId?.startsWith('363.')
      ),
    [cards]
  );
  const topic363Mastered = topic363Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const topic364Cards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.topicNumber === 364 ||
          c.deck.includes('Topic 364') ||
          c.objectiveId?.startsWith('364.')
      ),
    [cards]
  );
  const topic364Mastered = topic364Cards.filter((c) => masteredCardIds.includes(c.id)).length;

  const activeTopicTitle =
    selectedTopic === 'lpic1'
      ? 'LPIC-1: Linux Administrator (All Decks)'
      : selectedTopic === 'lpic2'
      ? 'LPIC-2: Linux Engineer (All Decks)'
      : selectedTopic === 'lpic3'
      ? 'LPIC-3: Enterprise Professional (All Specialty Decks)'
      : selectedTopic === 364
      ? 'Topic 364: Single Node High Availability'
      : selectedTopic === 363
      ? 'Topic 363: High Availability Distributed Storage'
      : selectedTopic === 362
      ? 'Topic 362: High Availability Cluster Storage'
      : selectedTopic === 361
      ? 'Topic 361: High Availability Cluster Management'
      : selectedTopic === 353
      ? 'Topic 353: VM Deployment and Provisioning'
      : selectedTopic === 352
      ? 'Topic 352: Container Virtualization'
      : selectedTopic === 351
      ? 'Topic 351: Full Virtualization'
      : selectedTopic === 328
      ? 'Topic 328: Network Security'
      : selectedTopic === 327
      ? 'Topic 327: Access Control'
      : selectedTopic === 326
      ? 'Topic 326: Host Security'
      : selectedTopic === 325
      ? 'Topic 325: Cryptography'
      : selectedTopic === 306
      ? 'Topic 306: High Availability and Storage Clusters'
      : selectedTopic === 305
      ? 'Topic 305: Virtualization & Containerization'
      : selectedTopic === 304
      ? 'Topic 304: Samba Client Configuration'
      : selectedTopic === 303
      ? 'Topic 303: Samba Share Configuration'
      : selectedTopic === 302
      ? 'Topic 302: Samba and Active Directory Domains'
      : selectedTopic === 301
      ? 'Topic 301: Samba Basics'
      : selectedTopic === 212
      ? 'Topic 212: System Security'
      : selectedTopic === 211
      ? 'Topic 211: E-Mail Services'
      : selectedTopic === 210
      ? 'Topic 210: Network Client Management'
      : selectedTopic === 209
      ? 'Topic 209: File Sharing'
      : selectedTopic === 208
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
      : selectedTopic === 107
      ? 'Topic 107: Administrative Tasks'
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
    selectedTopic === 'lpic1'
      ? `${lpic1Cards.length} Cards • 10 Topics (Exams 101 & 102)`
      : selectedTopic === 'lpic2'
      ? `${lpic2Cards.length} Cards • 13 Topics (Exams 201 & 202)`
      : selectedTopic === 'lpic3'
      ? `${lpic3Cards.length} Cards • 15 Topics (Exams 300, 303, 305, 306)`
      : selectedTopic === 364
      ? '100 Cards • 4 Sub-Objectives (Weight 12)'
      : selectedTopic === 363
      ? '100 Cards • 2 Sub-Objectives (Weight 13)'
      : selectedTopic === 362
      ? '100 Cards • 3 Sub-Objectives (Weight 13)'
      : selectedTopic === 361
      ? '100 Cards • 3 Sub-Objectives (Weight 22)'
      : selectedTopic === 353
      ? '100 Cards • 4 Sub-Objectives (Weight 10)'
      : selectedTopic === 352
      ? '100 Cards • 4 Sub-Objectives (Weight 25)'
      : selectedTopic === 351
      ? '100 Cards • 5 Sub-Objectives (Weight 25)'
      : selectedTopic === 328
      ? '100 Cards • 4 Sub-Objectives (Weight 17)'
      : selectedTopic === 327
      ? '100 Cards • 3 Sub-Objectives (Weight 10)'
      : selectedTopic === 326
      ? '100 Cards • 4 Sub-Objectives (Weight 16)'
      : selectedTopic === 325
      ? '100 Cards • 4 Sub-Objectives (Weight 16)'
      : selectedTopic === 306
      ? '100 Cards • 2 Main Topics / 8 Objectives (Weight 58)'
      : selectedTopic === 305
      ? '100 Cards • 3 Main Areas / 13 Objectives (Weight 60)'
      : selectedTopic === 304
      ? '100 Cards • 3 Sub-Objectives (Weight 11)'
      : selectedTopic === 303
      ? '100 Cards • 4 Sub-Objectives (Weight 10)'
      : selectedTopic === 302
      ? '100 Cards • 5 Sub-Objectives (Weight 17)'
      : selectedTopic === 301
      ? '100 Cards • 4 Sub-Objectives (Weight 11)'
      : selectedTopic === 212
      ? '100 Cards • 3 Sub-Objectives (Weight 10)'
      : selectedTopic === 211
      ? '100 Cards • 3 Sub-Objectives (Weight 8)'
      : selectedTopic === 210
      ? '100 Cards • 3 Sub-Objectives (Weight 7)'
      : selectedTopic === 209
      ? '100 Cards • 2 Sub-Objectives (Weight 8/11)'
      : selectedTopic === 208
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
      : selectedTopic === 107
      ? '100 Cards • 3 Sub-Objectives (Weight 12)'
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
    selectedTopic === 'lpic1'
      ? lpic1Mastered
      : selectedTopic === 'lpic2'
      ? lpic2Mastered
      : selectedTopic === 'lpic3'
      ? lpic3Mastered
      : selectedTopic === 364
      ? topic364Mastered
      : selectedTopic === 363
      ? topic363Mastered
      : selectedTopic === 362
      ? topic362Mastered
      : selectedTopic === 361
      ? topic361Mastered
      : selectedTopic === 353
      ? topic353Mastered
      : selectedTopic === 352
      ? topic352Mastered
      : selectedTopic === 351
      ? topic351Mastered
      : selectedTopic === 328
      ? topic328Mastered
      : selectedTopic === 327
      ? topic327Mastered
      : selectedTopic === 326
      ? topic326Mastered
      : selectedTopic === 325
      ? topic325Mastered
      : selectedTopic === 306
      ? topic306Mastered
      : selectedTopic === 305
      ? topic305Mastered
      : selectedTopic === 304
      ? topic304Mastered
      : selectedTopic === 303
      ? topic303Mastered
      : selectedTopic === 302
      ? topic302Mastered
      : selectedTopic === 301
      ? topic301Mastered
      : selectedTopic === 212
      ? topic212Mastered
      : selectedTopic === 211
      ? topic211Mastered
      : selectedTopic === 210
      ? topic210Mastered
      : selectedTopic === 209
      ? topic209Mastered
      : selectedTopic === 208
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
      : selectedTopic === 107
      ? topic107Mastered
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
    selectedTopic === 'lpic1'
      ? lpic1Cards.length
      : selectedTopic === 'lpic2'
      ? lpic2Cards.length
      : selectedTopic === 'lpic3'
      ? lpic3Cards.length
      : selectedTopic === 364
      ? topic364Cards.length || 100
      : selectedTopic === 363
      ? topic363Cards.length || 100
      : selectedTopic === 362
      ? topic362Cards.length || 100
      : selectedTopic === 361
      ? topic361Cards.length || 100
      : selectedTopic === 353
      ? topic353Cards.length || 100
      : selectedTopic === 352
      ? topic352Cards.length || 100
      : selectedTopic === 351
      ? topic351Cards.length || 100
      : selectedTopic === 328
      ? topic328Cards.length || 100
      : selectedTopic === 327
      ? topic327Cards.length || 100
      : selectedTopic === 326
      ? topic326Cards.length || 100
      : selectedTopic === 325
      ? topic325Cards.length || 100
      : selectedTopic === 306
      ? topic306Cards.length || 100
      : selectedTopic === 305
      ? topic305Cards.length || 100
      : selectedTopic === 304
      ? topic304Cards.length || 100
      : selectedTopic === 303
      ? topic303Cards.length || 100
      : selectedTopic === 302
      ? topic302Cards.length || 100
      : selectedTopic === 301
      ? topic301Cards.length || 100
      : selectedTopic === 212
      ? topic212Cards.length || 100
      : selectedTopic === 211
      ? topic211Cards.length || 100
      : selectedTopic === 210
      ? topic210Cards.length || 100
      : selectedTopic === 209
      ? topic209Cards.length || 100
      : selectedTopic === 208
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
      : selectedTopic === 107
      ? topic107Cards.length || 100
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
      {/* 3 Certification Comboboxes Section */}
      <div className="w-full mb-5 bg-white border border-[#d3c5ab] rounded-2xl p-3 sm:p-4 shadow-2xs">
        {/* Header with Title and All Certifications Quick Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d3c5ab]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f8ecdb] text-[#785a00] flex items-center justify-center border border-[#d3c5ab]/80 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#201b11]">
                Certification Topic Selectors
              </h2>
              <p className="text-xs text-[#817660]">
                Select a topic from any certification combobox or study an entire certification deck
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => handleTopicSelect('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTopic === 'all'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-[#fffaf3] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Certifications ({cards.length})</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#f8ecdb]/50 border border-[#d3c5ab]/60 text-xs text-[#817660]">
              <span>Mastered:</span>
              <strong className="text-[#28A745] font-bold">{masteredCardIds.length}</strong>
              <span>/ {cards.length}</span>
            </div>
          </div>
        </div>

        {/* 3 Combobox Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          {/* Combobox 1: LPIC-1 */}
          <div
            className={`rounded-xl p-3 border transition-all ${
              selectedTopic === 'lpic1' ||
              (typeof selectedTopic === 'number' && selectedTopic >= 101 && selectedTopic <= 110)
                ? 'bg-[#fffaf3] border-[#785a00] ring-2 ring-[#785a00]/20 shadow-xs'
                : 'bg-[#fcfaf7] border-[#d3c5ab] hover:border-[#b8a687]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#201b11] leading-tight">
                    LPIC-1
                  </h3>
                  <span className="text-[10px] text-[#817660] block leading-tight">
                    Linux Administrator
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1976d2] border border-[#d3c5ab]/60">
                {lpic1Cards.length} Cards
              </span>
            </div>

            {/* LPIC-1 Combobox Select */}
            <div className="relative mt-2">
              <select
                aria-label="LPIC-1 Topics"
                value={
                  selectedTopic === 'lpic1' ||
                  (typeof selectedTopic === 'number' && selectedTopic >= 101 && selectedTopic <= 110)
                    ? String(selectedTopic)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  if (val === 'lpic1') {
                    handleTopicSelect('lpic1');
                  } else {
                    handleTopicSelect(Number(val) as SelectedTopic);
                  }
                }}
                className="w-full text-xs font-semibold py-2 pl-2.5 pr-8 bg-white border border-[#d3c5ab] rounded-xl text-[#201b11] appearance-none focus:outline-none focus:ring-2 focus:ring-[#785a00] cursor-pointer shadow-2xs"
              >
                <option value="">— Select LPIC-1 Topic —</option>
                <option value="lpic1">🎓 All LPIC-1 Topics (10 Topics • {lpic1Cards.length} Cards)</option>
                <optgroup label="Exam 101-500 Topics">
                  <option value="101">Topic 101: System Architecture (100)</option>
                  <option value="102">Topic 102: Linux Installation & Package Management (100)</option>
                  <option value="103">Topic 103: GNU & Unix Commands (100)</option>
                  <option value="104">Topic 104: Devices, Filesystems & FHS (100)</option>
                </optgroup>
                <optgroup label="Exam 102-500 Topics">
                  <option value="105">Topic 105: Shells & Shell Scripting (100)</option>
                  <option value="106">Topic 106: User Interfaces & Desktops (100)</option>
                  <option value="107">Topic 107: Administrative Tasks (100)</option>
                  <option value="108">Topic 108: Essential System Services (100)</option>
                  <option value="109">Topic 109: Networking Fundamentals (100)</option>
                  <option value="110">Topic 110: Security (100)</option>
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-[#817660] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Progress Bar */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#817660]">
              <span>Mastery:</span>
              <span className="font-semibold text-[#201b11]">
                {lpic1Mastered} / {lpic1Cards.length} ({lpic1Cards.length > 0 ? Math.round((lpic1Mastered / lpic1Cards.length) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-[#e8decd] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#1976d2] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${lpic1Cards.length > 0 ? Math.round((lpic1Mastered / lpic1Cards.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Combobox 2: LPIC-2 */}
          <div
            className={`rounded-xl p-3 border transition-all ${
              selectedTopic === 'lpic2' ||
              (typeof selectedTopic === 'number' && selectedTopic >= 200 && selectedTopic <= 212)
                ? 'bg-[#fffaf3] border-[#785a00] ring-2 ring-[#785a00]/20 shadow-xs'
                : 'bg-[#fcfaf7] border-[#d3c5ab] hover:border-[#b8a687]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#201b11] leading-tight">
                    LPIC-2
                  </h3>
                  <span className="text-[10px] text-[#817660] block leading-tight">
                    Linux Engineer
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2e7d32] border border-[#d3c5ab]/60">
                {lpic2Cards.length} Cards
              </span>
            </div>

            {/* LPIC-2 Combobox Select */}
            <div className="relative mt-2">
              <select
                aria-label="LPIC-2 Topics"
                value={
                  selectedTopic === 'lpic2' ||
                  (typeof selectedTopic === 'number' && selectedTopic >= 200 && selectedTopic <= 212)
                    ? String(selectedTopic)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  if (val === 'lpic2') {
                    handleTopicSelect('lpic2');
                  } else {
                    handleTopicSelect(Number(val) as SelectedTopic);
                  }
                }}
                className="w-full text-xs font-semibold py-2 pl-2.5 pr-8 bg-white border border-[#d3c5ab] rounded-xl text-[#201b11] appearance-none focus:outline-none focus:ring-2 focus:ring-[#785a00] cursor-pointer shadow-2xs"
              >
                <option value="">— Select LPIC-2 Topic —</option>
                <option value="lpic2">🎓 All LPIC-2 Topics (13 Topics • {lpic2Cards.length} Cards)</option>
                <optgroup label="Exam 201-450 Topics">
                  <option value="200">Topic 200: Capacity Planning (100)</option>
                  <option value="201">Topic 201: Linux Kernel (100)</option>
                  <option value="202">Topic 202: System Startup (100)</option>
                  <option value="203">Topic 203: Filesystem and Devices (100)</option>
                  <option value="204">Topic 204: Advanced Storage Device Admin (100)</option>
                  <option value="205">Topic 205: Network Configuration (100)</option>
                  <option value="206">Topic 206: System Maintenance (100)</option>
                </optgroup>
                <optgroup label="Exam 202-450 Topics">
                  <option value="207">Topic 207: Domain Name Server (100)</option>
                  <option value="208">Topic 208: HTTP Servers (100)</option>
                  <option value="209">Topic 209: File Sharing (100)</option>
                  <option value="210">Topic 210: Network Client Management (100)</option>
                  <option value="211">Topic 211: E-Mail Services (100)</option>
                  <option value="212">Topic 212: System Security (100)</option>
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-[#817660] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Progress Bar */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#817660]">
              <span>Mastery:</span>
              <span className="font-semibold text-[#201b11]">
                {lpic2Mastered} / {lpic2Cards.length} ({lpic2Cards.length > 0 ? Math.round((lpic2Mastered / lpic2Cards.length) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-[#e8decd] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#2e7d32] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${lpic2Cards.length > 0 ? Math.round((lpic2Mastered / lpic2Cards.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Combobox 3: LPIC-3 */}
          <div
            className={`rounded-xl p-3 border transition-all ${
              selectedTopic === 'lpic3' ||
              (typeof selectedTopic === 'number' && selectedTopic >= 300 && selectedTopic <= 364)
                ? 'bg-[#fffaf3] border-[#785a00] ring-2 ring-[#785a00]/20 shadow-xs'
                : 'bg-[#fcfaf7] border-[#d3c5ab] hover:border-[#b8a687]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f3e5f5] text-[#7b1fa2] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#201b11] leading-tight">
                    LPIC-3
                  </h3>
                  <span className="text-[10px] text-[#817660] block leading-tight">
                    Enterprise Professional
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#7b1fa2] border border-[#d3c5ab]/60">
                {lpic3Cards.length} Cards
              </span>
            </div>

            {/* LPIC-3 Combobox Select */}
            <div className="relative mt-2">
              <select
                aria-label="LPIC-3 Topics"
                value={
                  selectedTopic === 'lpic3' ||
                  (typeof selectedTopic === 'number' && selectedTopic >= 300 && selectedTopic <= 364)
                    ? String(selectedTopic)
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  if (val === 'lpic3') {
                    handleTopicSelect('lpic3');
                  } else {
                    handleTopicSelect(Number(val) as SelectedTopic);
                  }
                }}
                className="w-full text-xs font-semibold py-2 pl-2.5 pr-8 bg-white border border-[#d3c5ab] rounded-xl text-[#201b11] appearance-none focus:outline-none focus:ring-2 focus:ring-[#785a00] cursor-pointer shadow-2xs"
              >
                <option value="">— Select LPIC-3 Topic —</option>
                <option value="lpic3">🎓 All LPIC-3 Topics ({lpic3Cards.length} Cards)</option>
                <optgroup label="Exam 306-300: High Availability & Storage">
                  <option value="306">Exam 306: All HA & Storage Clusters Decks (400)</option>
                  <option value="361">Topic 361: HA Cluster Management (100)</option>
                  <option value="362">Topic 362: HA Cluster Storage (100)</option>
                  <option value="363">Topic 363: HA Distributed Storage (100)</option>
                  <option value="364">Topic 364: Single Node High Availability (100)</option>
                </optgroup>
                <optgroup label="Exam 305-300: Virtualization & Containers">
                  <option value="305">Exam 305: All Virtualization & Containers Decks (300)</option>
                  <option value="351">Topic 351: Full Virtualization (100)</option>
                  <option value="352">Topic 352: Container Virtualization (100)</option>
                  <option value="353">Topic 353: VM Deployment and Provisioning (100)</option>
                </optgroup>
                <optgroup label="Exam 303-300: Security">
                  <option value="325">Topic 325: Cryptography (100)</option>
                  <option value="326">Topic 326: Access Control & Host Security (100)</option>
                  <option value="327">Topic 327: Access Control / SELinux (100)</option>
                  <option value="328">Topic 328: Network Security (100)</option>
                </optgroup>
                <optgroup label="Exam 300-100: Mixed Environment">
                  <option value="301">Topic 301: OpenLDAP Configuration (100)</option>
                  <option value="302">Topic 302: OpenLDAP Authentication & Integration (100)</option>
                  <option value="303">Topic 303: Samba Basics (100)</option>
                  <option value="304">Topic 304: Samba Share Configuration (100)</option>
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-[#817660] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Progress Bar */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#817660]">
              <span>Mastery:</span>
              <span className="font-semibold text-[#201b11]">
                {lpic3Mastered} / {lpic3Cards.length} ({lpic3Cards.length > 0 ? Math.round((lpic3Mastered / lpic3Cards.length) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-[#e8decd] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#7b1fa2] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${lpic3Cards.length > 0 ? Math.round((lpic3Mastered / lpic3Cards.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Header Topic Banner */}
      <div className="w-full bg-[#fef2e1] border border-[#d3c5ab] rounded-2xl p-4 md:p-5 mb-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#785a00] text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm shrink-0">
              {selectedTopic === 'all' ? 'ALL' : selectedTopic === 'lpic1' ? 'LP-1' : selectedTopic === 'lpic2' ? 'LP-2' : selectedTopic === 'lpic3' ? 'LP-3' : selectedTopic}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-[#785a00] uppercase tracking-wider bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                  {selectedTopic === 'lpic1'
                    ? 'LPIC-1 Curriculum (Exams 101 & 102)'
                    : selectedTopic === 'lpic2'
                    ? 'LPIC-2 Curriculum (Exams 201 & 202)'
                    : selectedTopic === 'lpic3'
                    ? 'LPIC-3 Enterprise Specialty'
                    : selectedTopic === 364 || selectedTopic === 363 || selectedTopic === 362 || selectedTopic === 361 || selectedTopic === 306
                    ? 'LPIC-3 Exam 306-300'
                    : selectedTopic === 353 || selectedTopic === 352 || selectedTopic === 351 || selectedTopic === 305
                    ? 'LPIC-3 Exam 305-300'
                    : selectedTopic === 328 || selectedTopic === 327 || selectedTopic === 326 || selectedTopic === 325
                    ? 'LPIC-3 Exam 303-300'
                    : selectedTopic === 301 || selectedTopic === 302 || selectedTopic === 303 || selectedTopic === 304
                    ? 'LPIC-3 Exam 300-100'
                    : selectedTopic === 200 || selectedTopic === 201 || selectedTopic === 202
                    ? 'LPIC-2 Exam 201-450'
                    : typeof selectedTopic === 'number' && selectedTopic >= 203 && selectedTopic <= 212
                    ? 'LPIC-2 Exam 202-450'
                    : selectedTopic === 105 || selectedTopic === 106 || selectedTopic === 107 || selectedTopic === 108 || selectedTopic === 109 || selectedTopic === 110
                    ? 'LPIC-1 Exam 102-500'
                    : selectedTopic === 101 || selectedTopic === 102 || selectedTopic === 103 || selectedTopic === 104
                    ? 'LPIC-1 Exam 101-500'
                    : 'All LPIC Certifications'}
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
                {selectedTopic === 'all'
                  ? 'Overall'
                  : selectedTopic === 'lpic1'
                  ? 'LPIC-1'
                  : selectedTopic === 'lpic2'
                  ? 'LPIC-2'
                  : selectedTopic === 'lpic3'
                  ? 'LPIC-3'
                  : `Topic ${selectedTopic}`} Mastery
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
              All In Deck ({activeTopicTotal})
            </button>

                        {/* Quick Topic Jump Pills for LPIC-1 */}
            {selectedTopic === 'lpic1' && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-[#817660] mr-0.5">Jump to:</span>
                {[101, 102, 103, 104, 105, 106, 107, 108, 109, 110].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleTopicSelect(num as SelectedTopic)}
                    className="px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#4f4632] hover:bg-[#f8ecdb] hover:text-[#785a00] border border-[#d3c5ab] transition-all cursor-pointer"
                  >
                    Topic {num}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Topic Jump Pills for LPIC-2 */}
            {selectedTopic === 'lpic2' && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-[#817660] mr-0.5">Jump to:</span>
                {[200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleTopicSelect(num as SelectedTopic)}
                    className="px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#4f4632] hover:bg-[#f8ecdb] hover:text-[#785a00] border border-[#d3c5ab] transition-all cursor-pointer"
                  >
                    Topic {num}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Specialty Exam Pills for LPIC-3 */}
            {selectedTopic === 'lpic3' && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] font-bold text-[#817660] mr-0.5">Jump to:</span>
                <button
                  onClick={() => handleTopicSelect(306)}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#4f4632] hover:bg-[#f8ecdb] hover:text-[#785a00] border border-[#d3c5ab] transition-all cursor-pointer"
                >
                  Exam 306 (HA & Storage)
                </button>
                <button
                  onClick={() => handleTopicSelect(305)}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#4f4632] hover:bg-[#f8ecdb] hover:text-[#785a00] border border-[#d3c5ab] transition-all cursor-pointer"
                >
                  Exam 305 (Virtualization)
                </button>
                <button
                  onClick={() => handleTopicSelect(325)}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#4f4632] hover:bg-[#f8ecdb] hover:text-[#785a00] border border-[#d3c5ab] transition-all cursor-pointer"
                >
                  Exam 303 (Security)
                </button>
                <button
                  onClick={() => handleTopicSelect(301)}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#4f4632] hover:bg-[#f8ecdb] hover:text-[#785a00] border border-[#d3c5ab] transition-all cursor-pointer"
                >
                  Exam 300 (Mixed Env)
                </button>
              </div>
            )}

            {/* Topic 364 Sub-Objectives */}
            {selectedTopic === 364 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('364.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '364.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Hardware and Resource High Availability (364.1) - 20 cards (Weight 2)"
                >
                  364.1 Hardware HA & IPMI (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('364.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '364.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Advanced RAID (364.2) - 20 cards (Weight 2)"
                >
                  364.2 Advanced RAID (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('364.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '364.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Advanced LVM (364.3) - 25 cards (Weight 3)"
                >
                  364.3 Advanced LVM (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('364.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '364.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Network High Availability (364.4) - 35 cards (Weight 5)"
                >
                  364.4 Network HA & Bonding (35)
                </button>
              </>
            )}

            {/* Topic 363 Sub-Objectives */}
            {selectedTopic === 363 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('363.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '363.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="GlusterFS Storage Clusters (363.1) - 40 cards (Weight 5)"
                >
                  363.1 GlusterFS (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('363.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '363.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Ceph Storage Clusters (363.2) - 60 cards (Weight 8)"
                >
                  363.2 Ceph Clusters (60)
                </button>
              </>
            )}

            {/* Topic 362 Sub-Objectives */}
            {selectedTopic === 362 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('362.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="DRBD (362.1) - 45 cards (Weight 6)"
                >
                  362.1 DRBD (45)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('362.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Clustered Storage / SAN & iSCSI (362.2) - 25 cards (Weight 3)"
                >
                  362.2 SAN & iSCSI (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('362.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Clustered File Systems (362.3) - 30 cards (Weight 4)"
                >
                  362.3 Clustered FS (30)
                </button>
              </>
            )}

            {/* Topic 361 Sub-Objectives */}
            {selectedTopic === 361 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('361.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="High Availability Concepts (361.1) - 25 cards (Weight 6)"
                >
                  361.1 HA Concepts (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('361.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Load Balanced Clusters (361.2) - 38 cards (Weight 8)"
                >
                  361.2 Load Balanced (38)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('361.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Failover Clusters (361.3) - 37 cards (Weight 8)"
                >
                  361.3 Failover Clusters (37)
                </button>
              </>
            )}

            {/* Topic 353 Sub-Objectives */}
            {selectedTopic === 353 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('353.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Cloud Management Tools (353.1) - 24 cards (Weight 2)"
                >
                  353.1 Cloud Tools (24)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Packer (353.2) - 21 cards (Weight 2)"
                >
                  353.2 Packer (21)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="cloud-init (353.3) - 25 cards (Weight 3)"
                >
                  353.3 cloud-init (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Vagrant (353.4) - 30 cards (Weight 3)"
                >
                  353.4 Vagrant (30)
                </button>
              </>
            )}

            {/* Topic 352 Sub-Objectives */}
            {selectedTopic === 352 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('352.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Container Concepts (352.1) - 28 cards (Weight 7)"
                >
                  352.1 Container Concepts (28)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="LXC (Linux Containers) (352.2) - 24 cards (Weight 6)"
                >
                  352.2 LXC (24)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Docker (352.3) - 36 cards (Weight 9)"
                >
                  352.3 Docker (36)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Container Orchestration Platforms (352.4) - 12 cards (Weight 3)"
                >
                  352.4 Orchestration (12)
                </button>
              </>
            )}

            {/* Topic 351 Sub-Objectives */}
            {selectedTopic === 351 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('351.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Virtualization Concepts and Theory (351.1) - 22 cards (Weight 6)"
                >
                  351.1 Concepts & Theory (22)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Xen Hypervisor (351.2) - 14 cards (Weight 3)"
                >
                  351.2 Xen (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="QEMU (351.3) - 18 cards (Weight 4)"
                >
                  351.3 QEMU (18)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Libvirt Virtual Machine Management (351.4) - 32 cards (Weight 9)"
                >
                  351.4 Libvirt (32)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.5')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.5'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Virtual Machine Disk Image Management (351.5) - 14 cards (Weight 3)"
                >
                  351.5 Disk Images (14)
                </button>
              </>
            )}

            {/* Topic 328 Sub-Objectives */}
            {selectedTopic === 328 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('328.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '328.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Network Hardening (328.1) - 25 cards (Weight 4)"
                >
                  328.1 Network Hardening (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('328.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '328.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Network Intrusion Detection (328.2) - 25 cards (Weight 4)"
                >
                  328.2 Intrusion Detection (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('328.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '328.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Packet Filtering (328.3) - 28 cards (Weight 5)"
                >
                  328.3 Packet Filtering (28)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('328.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '328.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Virtual Private Networks (VPNs) (328.4) - 22 cards (Weight 4)"
                >
                  328.4 VPNs & Tunnels (22)
                </button>
              </>
            )}

            {/* Topic 327 Sub-Objectives */}
            {selectedTopic === 327 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('327.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '327.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Discretionary Access Control (DAC) (327.1) - 35 cards (Weight 3)"
                >
                  327.1 DAC & ACLs (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('327.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '327.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Mandatory Access Control (MAC) (327.2) - 40 cards (Weight 4)"
                >
                  327.2 MAC & SELinux/AppArmor (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('327.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '327.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Network File Systems Security (327.3) - 25 cards (Weight 3)"
                >
                  327.3 NFS & Samba Security (25)
                </button>
              </>
            )}

            {/* Topic 326 Sub-Objectives */}
            {selectedTopic === 326 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('326.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '326.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Host Hardening (326.1) - 25 cards (Weight 4)"
                >
                  326.1 Host Hardening (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('326.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '326.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Host Intrusion Detection (326.2) - 25 cards (Weight 3)"
                >
                  326.2 Intrusion Detection (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('326.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '326.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="User Management and Authentication (326.3) - 25 cards (Weight 5)"
                >
                  326.3 User Mgmt & PAM/SSSD (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('326.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '326.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="FreeIPA Installation and Samba Integration (326.4) - 25 cards (Weight 4)"
                >
                  326.4 FreeIPA & AD Trust (25)
                </button>
              </>
            )}

            {/* Topic 325 Sub-Objectives */}
            {selectedTopic === 325 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('325.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '325.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="X.509 Certificates and PKI (325.1) - 28 cards (Weight 5)"
                >
                  325.1 PKI & X.509 (28)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('325.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '325.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Encryption, Signing & Authentication (325.2) - 24 cards (Weight 4)"
                >
                  325.2 TLS & Signing (24)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('325.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '325.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Encrypted File Systems (325.3) - 24 cards (Weight 4)"
                >
                  325.3 Encrypted FS (24)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('325.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '325.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="DNS and Cryptography (325.4) - 24 cards (Weight 5)"
                >
                  325.4 DNS & Crypto (24)
                </button>
              </>
            )}

            {/* Topic 306 Sub-Objectives */}
            {selectedTopic === 306 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('361.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="HA Concepts & Terminology (361.1) - 8 cards (Weight 5)"
                >
                  361.1 HA Concepts (8)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('361.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Load Balancing Clusters (361.2) - 14 cards (Weight 8)"
                >
                  361.2 Load Balancing (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('361.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Failover Clusters (361.3) - 18 cards (Weight 10)"
                >
                  361.3 Failover (18)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('361.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '361.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="High Availability Storage (DRBD) (361.4) - 10 cards (Weight 7)"
                >
                  361.4 DRBD (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('362.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="iSCSI Storage Area Network (362.1) - 14 cards (Weight 8)"
                >
                  362.1 iSCSI SAN (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('362.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Storage Multipathing (362.2) - 10 cards (Weight 6)"
                >
                  362.2 Multipath (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('362.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Distributed Storage (Ceph & GlusterFS) (362.3) - 14 cards (Weight 8)"
                >
                  362.3 Ceph / Gluster (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('362.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '362.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Clustered File Systems (GFS2 & OCFS2) (362.4) - 12 cards (Weight 8)"
                >
                  362.4 Clustered FS (12)
                </button>
              </>
            )}

            {/* Topic 305 Sub-Objectives */}
            {selectedTopic === 305 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('351.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Virtualization Concepts (351.1) - 8 cards (Weight 4)"
                >
                  351.1 Concepts (8)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Xen Virtualization (351.2) - 10 cards (Weight 6)"
                >
                  351.2 Xen (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="QEMU (351.3) - 10 cards (Weight 6)"
                >
                  351.3 QEMU (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Libvirt Virtual Machine Management (351.4) - 10 cards (Weight 9)"
                >
                  351.4 Libvirt (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('351.5')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '351.5'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Disk Image Management (351.5) - 8 cards (Weight 8)"
                >
                  351.5 Disk Images (8)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Container Concepts (352.1) - 8 cards (Weight 7)"
                >
                  352.1 Container Concepts (8)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Linux Containers (LXC) (352.2) - 10 cards (Weight 6)"
                >
                  352.2 LXC (10)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Docker (352.3) - 14 cards (Weight 9)"
                >
                  352.3 Docker (14)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('352.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '352.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Container Orchestration (352.4) - 6 cards (Weight 3)"
                >
                  352.4 Orchestration (6)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Cloud Management Tools (353.1) - 4 cards (Weight 2)"
                >
                  353.1 Cloud Tools (4)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Packer (353.2) - 4 cards (Weight 2)"
                >
                  353.2 Packer (4)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="cloud-init (353.3) - 4 cards (Weight 3)"
                >
                  353.3 cloud-init (4)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('353.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '353.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Vagrant (353.4) - 4 cards (Weight 3)"
                >
                  353.4 Vagrant (4)
                </button>
              </>
            )}

            {/* Topic 304 Sub-Objectives */}
            {selectedTopic === 304 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('304.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '304.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Linux Authentication Clients (304.1) - 45 cards (Weight 5)"
                >
                  304.1 Linux Auth Clients (45)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('304.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '304.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Linux CIFS Clients (304.2) - 30 cards (Weight 3)"
                >
                  304.2 Linux CIFS Clients (30)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('304.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '304.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Windows Clients (304.3) - 25 cards (Weight 3)"
                >
                  304.3 Windows Clients (25)
                </button>
              </>
            )}

            {/* Topic 303 Sub-Objectives */}
            {selectedTopic === 303 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('303.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '303.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="File Share Configuration (303.1) - 40 cards (Weight 4)"
                >
                  303.1 File Shares (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('303.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '303.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="File Share Security and ACLs (303.2) - 25 cards (Weight 3)"
                >
                  303.2 Security & ACLs (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('303.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '303.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="DFS Share Configuration (303.3) - 15 cards (Weight 1)"
                >
                  303.3 MS-DFS (15)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('303.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '303.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Print Share Configuration (303.4) - 20 cards (Weight 2)"
                >
                  303.4 Print Shares (20)
                </button>
              </>
            )}

            {/* Topic 302 Sub-Objectives */}
            {selectedTopic === 302 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('302.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '302.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Samba as an AD DC (302.1) - 25 cards (Weight 5)"
                >
                  302.1 AD DC (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('302.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '302.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Samba DC DNS (302.2) - 15 cards (Weight 3)"
                >
                  302.2 DNS (15)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('302.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '302.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="AD Domain Management (302.3) - 25 cards (Weight 4)"
                >
                  302.3 Domain Mgmt (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('302.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '302.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Domain Membership (302.4) - 20 cards (Weight 3)"
                >
                  302.4 Membership (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('302.5')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '302.5'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Local User Management (302.5) - 15 cards (Weight 2)"
                >
                  302.5 Local Users & PAM (15)
                </button>
              </>
            )}

            {/* Topic 301 Sub-Objectives */}
            {selectedTopic === 301 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('301.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '301.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Samba Concepts and Architecture (301.1) - 20 cards (Weight 2)"
                >
                  301.1 Concepts (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('301.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '301.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Samba Configuration (301.2) - 35 cards (Weight 4)"
                >
                  301.2 Configuration (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('301.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '301.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Regular Samba Maintenance (301.3) - 20 cards (Weight 2)"
                >
                  301.3 Maintenance (20)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('301.4')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '301.4'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Troubleshooting Samba (301.4) - 25 cards (Weight 3)"
                >
                  301.4 Troubleshooting (25)
                </button>
              </>
            )}

            {/* Topic 212 Sub-Objectives */}
            {selectedTopic === 212 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('212.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '212.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Configuring a Router (Firewalling & NAT) (212.1) - 35 cards (Weight 3)"
                >
                  212.1 Router & Firewall (35)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('212.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '212.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Managing Network Security (212.2) - 40 cards (Weight 4)"
                >
                  212.2 Network Security (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('212.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '212.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="OpenVPN & IPsec (212.3) - 25 cards (Weight 3)"
                >
                  212.3 OpenVPN & IPsec (25)
                </button>
              </>
            )}

            {/* Topic 211 Sub-Objectives */}
            {selectedTopic === 211 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('211.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '211.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Using E-Mail Servers (211.1) - 50 cards (Weight 4)"
                >
                  211.1 Mail Servers (50)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('211.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '211.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Managing E-Mail Delivery (211.2) - 25 cards (Weight 2)"
                >
                  211.2 Mail Delivery (25)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('211.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '211.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Managing Remote E-Mail Delivery (211.3) - 25 cards (Weight 2)"
                >
                  211.3 Remote Delivery (25)
                </button>
              </>
            )}

            {/* Topic 210 Sub-Objectives */}
            {selectedTopic === 210 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('210.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '210.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="DHCP Configuration (210.1) - 30 cards (Weight 2)"
                >
                  210.1 DHCP Config (30)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('210.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '210.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="PAM Authentication (210.2) - 40 cards (Weight 3)"
                >
                  210.2 PAM Auth (40)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('210.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '210.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="LDAP Client Usage (210.3) - 30 cards (Weight 2)"
                >
                  210.3 LDAP Client (30)
                </button>
              </>
            )}

            {/* Topic 209 Sub-Objectives */}
            {selectedTopic === 209 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('209.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '209.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="SAMBA Server Configuration (209.1) - 60 cards (Weight 5)"
                >
                  209.1 SAMBA Server Config (60)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('209.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '209.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="NFS Server Configuration (209.2) - 40 cards (Weight 3)"
                >
                  209.2 NFS Server Config (40)
                </button>
              </>
            )}

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

            {/* Topic 107 Sub-Objectives */}
            {selectedTopic === 107 && (
              <>
                <button
                  onClick={() => setActiveDeckFilter('107.1')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '107.1'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Manage user and group accounts and related system files (107.1)"
                >
                  107.1 User & Group Accounts (42)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('107.2')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '107.2'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Automate system administration tasks by scheduling jobs (107.2)"
                >
                  107.2 Scheduled Jobs & Cron (34)
                </button>

                <button
                  onClick={() => setActiveDeckFilter('107.3')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDeckFilter === '107.3'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-white text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                  }`}
                  title="Localisation and internationalisation (107.3)"
                >
                  107.3 Localisation & i18n (24)
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
                  {selectedTopic === 'all' ? 'All LPIC' : selectedTopic === 'lpic1' ? 'LPIC-1' : selectedTopic === 'lpic2' ? 'LPIC-2' : selectedTopic === 'lpic3' ? 'LPIC-3' : `Topic ${selectedTopic}`} Flashcard Index
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
