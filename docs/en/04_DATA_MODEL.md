# 04 — Conceptual Data Model

> This document unifies and formalizes all data structures used throughout **LPI Certification Prep**, as defined in `src/types.ts` and `src/services/virtualFs/types.ts`.

---

## 1. Global Entity Relationship Overview

The data architecture connects three primary conceptual graphs:
1. **Curriculum Graph**: Official LPI certification taxonomy and educational resources.
2. **Performance & Telemetry Graph**: Answer history, error rates, and weakness diagnostics.
3. **Practical Execution Graph**: In-memory virtual filesystem, shell states, and lab challenge validators.

```text
  [ Certification ]
          │ 1
          ▼ *
      [ Exam ]
          │ 1
          ▼ *
      [ Topic ]
          │ 1
          ▼ *
    [ Objective ] ◄────────────────────────┐
          │                                │ Linked to
          ├─────────────┬─────────────┐    │
          ▼ *           ▼ *           ▼ *  │
     [ Question ]  [ Flashcard ]   [ Lab Scenario ]
          │             │
          │ evaluated   │ reviewed
          ▼             ▼
   [ Exam Answer ] [ SRS Record ]
          │
          ▼ consolidated
   [ Weakness Engine Report ]
          │
          ▼ generates
   [ Targeted Training Session ]
```

---

## 2. Official Curriculum Hierarchy

The structure mirrors the official Linux Professional Institute taxonomy:

$$\text{Certification} \longrightarrow \text{Exam} \longrightarrow \text{Topic} \longrightarrow \text{Objective} \longrightarrow \{\text{Questions, Flashcards, Labs, Glossary}\}$$

### Key Entity Interfaces:

#### `ExamTier` & `ExamInfo`
- `ExamTier`: Certification tier (`lpic-1`, `lpic-2`, `lpic-3`).
- `ExamInfo`: Specific exam (e.g., `101-500`, `102-500`, `201-450`, `202-450`, `303-300`).
  - Fields: `id`, `code`, `name`, `status` (`passed | in_progress | locked`), `progress`.

#### `LPICTopic`
- Represents a major curriculum topic (e.g., *Topic 101: System Architecture*).
- Fields: `id`, `topicNumber`, `title`, `totalWeight`, `examId`, `objectives: LPICObjective[]`.

#### `LPICObjective`
- Granular sub-objective tested on the examination (e.g., *101.1 Determine and configure hardware settings*).
- Fields: `id`, `title`, `weight`, `description`, `keyFiles: string[]`, `keyCommands: string[]`, `keyTerms: string[]`.

---

## 3. Flashcards & Spaced Repetition (SRS) Model

```typescript
export type SRSState = 'new' | 'learning' | 'review' | 'mastered';
export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

export interface SRSRecord {
  cardId: string;
  objectiveId: string;
  state: SRSState;
  intervalDays: number;
  easeFactor: number;        // Default 2.5, dynamic based on ratings
  repetitionCount: number;
  lapseCount: number;         // Incremented when rated 'again'
  lastReviewedDate: string;   // ISO 8601
  nextDueDate: string;        // ISO 8601
  totalReviews: number;
  consecutiveCorrect: number;
}
```

---

## 4. Virtual Filesystem (VirtualFS) Data Model

```typescript
export interface VfsPermissions {
  octal: number;       // e.g., 0o755
  symbolic: string;    // e.g., "-rwxr-xr-x"
  owner: string;       // e.g., "root"
  group: string;       // e.g., "root"
}

export interface VfsNode {
  name: string;
  type: 'file' | 'directory' | 'symlink';
  path: string;
  permissions: VfsPermissions;
  content?: string;
  children?: { [key: string]: VfsNode };
  targetPath?: string; // For symlinks
  sizeBytes: number;
  modifiedAt: string;
}
```
