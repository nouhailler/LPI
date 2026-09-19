import { Flashcard, SRSCardRecord, SRSRating, SRSDeckSummary, SRSState } from '../types';

export interface SRSIntervalDef {
  level: number;
  minutes: number;
  label: string;
  labelFr: string;
  labelEn: string;
}

export const SRS_INTERVALS: SRSIntervalDef[] = [
  { level: 0, minutes: 10, label: '10 min', labelFr: '10 min', labelEn: '10 min' },
  { level: 1, minutes: 1440, label: '1 jour', labelFr: '1 jour', labelEn: '1 day' },
  { level: 2, minutes: 4320, label: '3 jours', labelFr: '3 jours', labelEn: '3 days' },
  { level: 3, minutes: 10080, label: '7 jours', labelFr: '7 jours', labelEn: '7 days' },
  { level: 4, minutes: 20160, label: '14 jours', labelFr: '14 jours', labelEn: '14 days' },
  { level: 5, minutes: 43200, label: '30 jours', labelFr: '30 jours', labelEn: '30 days' },
  { level: 6, minutes: 86400, label: '60 jours', labelFr: '60 jours', labelEn: '60 days' },
];

export const SRS_STORAGE_KEY = 'lpi_srs_records_v1';

/**
 * Return interval definition by level
 */
export function getSRSIntervalDef(level: number): SRSIntervalDef {
  const clamped = Math.max(0, Math.min(SRS_INTERVALS.length - 1, level));
  return SRS_INTERVALS[clamped];
}

/**
 * Preview next interval for a card given a rating
 */
export function previewNextInterval(
  currentLevel: number,
  rating: SRSRating
): { level: number; minutes: number; labelFr: string; labelEn: string; nextState: SRSState } {
  const safeLevel = Math.max(0, Math.min(6, Number(currentLevel) || 0));
  if (rating === 'hard') {
    // Difficile -> 10 min (level 0)
    const def = SRS_INTERVALS[0];
    return { level: 0, minutes: def.minutes, labelFr: def.labelFr, labelEn: def.labelEn, nextState: 'learning' };
  }

  if (rating === 'mastered') {
    // Maîtrisée -> 60 jours
    const def = SRS_INTERVALS[6];
    return { level: 6, minutes: def.minutes, labelFr: def.labelFr, labelEn: def.labelEn, nextState: 'mastered' };
  }

  if (rating === 'easy') {
    // Facile -> advance 2 steps
    const nextLevel = Math.min(6, safeLevel + 2);
    const def = SRS_INTERVALS[nextLevel] || SRS_INTERVALS[6];
    return {
      level: nextLevel,
      minutes: def.minutes,
      labelFr: def.labelFr,
      labelEn: def.labelEn,
      nextState: nextLevel >= 6 ? 'mastered' : 'review',
    };
  }

  // rating === 'good' (Correct) -> advance 1 step
  const nextLevel = Math.min(6, safeLevel + 1);
  const def = SRS_INTERVALS[nextLevel] || SRS_INTERVALS[6];
  return {
    level: nextLevel,
    minutes: def.minutes,
    labelFr: def.labelFr,
    labelEn: def.labelEn,
    nextState: nextLevel >= 6 ? 'mastered' : 'review',
  };
}

/**
 * Load all SRS records from localStorage, with migration from older keys
 */
export function loadSRSRecords(allCards?: Flashcard[]): Record<number, SRSCardRecord> {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load SRS records:', e);
  }

  // If no records yet, seed intelligently using existing legacy keys and LPIC-1 cards
  return initializeDefaultSRSRecords(allCards || []);
}

/**
 * Save SRS records to localStorage
 */
export function saveSRSRecords(records: Record<number, SRSCardRecord>): void {
  try {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(records));
    // Also sync with legacy mastered list for backward compatibility
    const masteredIds = Object.values(records)
      .filter((r) => r.state === 'mastered')
      .map((r) => r.cardId);
    localStorage.setItem('lpic1_mastered_cards', JSON.stringify(masteredIds));

    // And review list
    const reviewIds = Object.values(records)
      .filter((r) => r.state === 'learning' || (r.state === 'review' && new Date(r.dueDate) <= new Date()))
      .map((r) => r.cardId);
    localStorage.setItem('lpic1_review_cards', JSON.stringify(reviewIds));

    // Dispatch event so all components react immediately
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('srs_updated'));
  } catch (e) {
    console.error('Failed to save SRS records:', e);
  }
}

/**
 * Initialize default SRS records ensuring 23 cards due today on start
 */
export function initializeDefaultSRSRecords(allCards: Flashcard[]): Record<number, SRSCardRecord> {
  const records: Record<number, SRSCardRecord> = {};
  const now = new Date();

  // Read existing legacy mastered / review cards if any
  let legacyMastered: number[] = [];
  let legacyReview: number[] = [];
  try {
    legacyMastered = JSON.parse(localStorage.getItem('lpic1_mastered_cards') || '[]');
    legacyReview = JSON.parse(localStorage.getItem('lpic1_review_cards') || '[]');
  } catch {}

  // Apply legacy mastered
  legacyMastered.forEach((id) => {
    records[id] = {
      cardId: id,
      state: 'mastered',
      intervalLevel: 6,
      intervalLabel: '60 jours',
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastReviewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      repetitions: 3,
      lapses: 0,
      lastRating: 'good',
    };
  });

  // Apply legacy review
  legacyReview.forEach((id) => {
    if (!records[id]) {
      records[id] = {
        cardId: id,
        state: 'learning',
        intervalLevel: 0,
        intervalLabel: '10 min',
        dueDate: now.toISOString(), // due now
        lastReviewedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        repetitions: 1,
        lapses: 1,
        lastRating: 'hard',
      };
    }
  });

  // Count current due
  const currentDueCount = Object.values(records).filter(
    (r) => r.state !== 'mastered' && new Date(r.dueDate) <= now
  ).length;

  // Target exactly 23 cards due today for the initial experience requested by the user
  const TARGET_DUE_TODAY = 23;
  const cardsToAdd = Math.max(0, TARGET_DUE_TODAY - currentDueCount);

  if (cardsToAdd > 0 && allCards.length > 0) {
    // Pick the highest-priority fundamental cards from Topic 101, 102, 103, 104
    const candidateCards = allCards.filter(
      (c) =>
        !records[c.id] &&
        ((c.topicNumber && c.topicNumber >= 101 && c.topicNumber <= 104) ||
          c.objectiveId?.startsWith('101.') ||
          c.objectiveId?.startsWith('102.') ||
          c.objectiveId?.startsWith('103.') ||
          c.objectiveId?.startsWith('104.'))
    );

    const picked = candidateCards.slice(0, cardsToAdd);
    picked.forEach((card, idx) => {
      // Stagger slightly so some are step 0 (10 min), step 1 (1 jour) due today
      const isQuickReview = idx % 3 === 0;
      records[card.id] = {
        cardId: card.id,
        state: isQuickReview ? 'learning' : 'review',
        intervalLevel: isQuickReview ? 0 : 1,
        intervalLabel: isQuickReview ? '10 min' : '1 jour',
        dueDate: now.toISOString(), // Ready for today's review!
        lastReviewedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        repetitions: 1,
        lapses: 0,
        lastRating: isQuickReview ? 'hard' : 'good',
      };
    });
  }

  saveSRSRecords(records);
  return records;
}

/**
 * Process a user rating on a flashcard
 */
export function applySRSRating(
  cardId: number,
  rating: SRSRating,
  existingRecords: Record<number, SRSCardRecord>
): { updatedRecord: SRSCardRecord; allRecords: Record<number, SRSCardRecord> } {
  const current = existingRecords[cardId] || {
    cardId,
    state: 'new',
    intervalLevel: 0,
    intervalLabel: '10 min',
    dueDate: new Date().toISOString(),
    repetitions: 0,
    lapses: 0,
  };

  const next = previewNextInterval(current.intervalLevel, rating);
  const now = new Date();
  const nextDueDate = new Date(now.getTime() + next.minutes * 60 * 1000);

  const updatedRecord: SRSCardRecord = {
    cardId,
    state: next.nextState,
    intervalLevel: next.level,
    intervalLabel: next.labelFr,
    dueDate: nextDueDate.toISOString(),
    lastReviewedAt: now.toISOString(),
    repetitions: current.repetitions + 1,
    lapses: rating === 'hard' ? current.lapses + 1 : current.lapses,
    lastRating: rating,
  };

  const allRecords = {
    ...existingRecords,
    [cardId]: updatedRecord,
  };

  saveSRSRecords(allRecords);
  return { updatedRecord, allRecords };
}

/**
 * Get the list of cards due for today's review session
 */
export function getCardsDueToday(
  allCards: Flashcard[],
  records: Record<number, SRSCardRecord>
): Flashcard[] {
  const now = new Date();

  // Find cards that have an SRS record and are due (or overdue)
  const dueCards = allCards.filter((card) => {
    const record = records[card.id];
    if (!record) return false;
    // Mastered cards are only due if their 60-day interval expired
    if (record.state === 'mastered') {
      return new Date(record.dueDate) <= now;
    }
    // Any card with dueDate <= now is due
    return new Date(record.dueDate) <= now;
  });

  // Attach record to card
  return dueCards.map((c) => ({
    ...c,
    srsRecord: records[c.id],
  }));
}

/**
 * Get summary breakdown of cards for the dashboard and flashcard header
 */
export function getSRSDeckSummary(
  allCards: Flashcard[],
  records: Record<number, SRSCardRecord>
): SRSDeckSummary {
  const now = new Date();
  let dueTodayCount = 0;
  let learningCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;

  allCards.forEach((card) => {
    const r = records[card.id];
    if (!r || r.state === 'new') {
      // Unseen / new
      return;
    }

    if (r.state === 'mastered') {
      masteredCount++;
      if (new Date(r.dueDate) <= now) {
        dueTodayCount++;
      }
    } else if (r.state === 'learning') {
      learningCount++;
      if (new Date(r.dueDate) <= now) {
        dueTodayCount++;
      }
    } else if (r.state === 'review') {
      reviewCount++;
      if (new Date(r.dueDate) <= now) {
        dueTodayCount++;
      }
    }
  });

  const totalCards = allCards.length;
  const newCount = totalCards - (learningCount + reviewCount + masteredCount);

  return {
    dueTodayCount,
    newCount: Math.max(0, newCount),
    learningCount,
    reviewCount,
    masteredCount,
    totalCards,
  };
}

export const computeSRSDeckSummary = getSRSDeckSummary;

/**
 * Helper to add N new cards to today's review queue
 */
export function addNewCardsToReviewQueue(
  allCards: Flashcard[],
  records: Record<number, SRSCardRecord>,
  count: number = 10
): Record<number, SRSCardRecord> {
  const now = new Date();
  const unreviewed = allCards.filter((c) => !records[c.id] || records[c.id].state === 'new');
  const toAdd = unreviewed.slice(0, count);

  const updated = { ...records };
  toAdd.forEach((card) => {
    updated[card.id] = {
      cardId: card.id,
      state: 'learning',
      intervalLevel: 0,
      intervalLabel: '10 min',
      dueDate: now.toISOString(),
      repetitions: 0,
      lapses: 0,
    };
  });

  saveSRSRecords(updated);
  return updated;
}
