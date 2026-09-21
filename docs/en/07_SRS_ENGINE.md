# 07 — Spaced Repetition Engine (SRS Engine)

> This document details the algorithmic implementation of the Spaced Repetition System (SRS) of **LPI Certification Prep**, located in `src/utils/srsEngine.ts`.

---

## 1. Principles & Mathematical Model

The SRS engine is built upon a hybrid adaptation of the **Leitner** and **SuperMemo SM-2** algorithms, engineered to reconcile long-term memorization of dense Linux syntax with rapid, focused study sessions (micro-learning in 5-to-15 minute sprints).

### Flashcard Finite State Machine

Every card in the 2,000+ flashcard deck progresses through four sequential states:

```text
    [ NEW ]
       │
       ▼ (First review)
  [ LEARNING ] ◄──────────────────┐
       │                          │ (Failure: 'hard')
       ▼ (Interval >= 1 day)      │
   [ REVIEW ] ────────────────────┘
       │
       ▼ (Interval >= 60 days OR explicit 'mastered' validation)
  [ MASTERED ]
```

---

## 2. Deterministic Interval Schedule

Unlike systems relying on unstable floating-point ease factors ($EF$), the engine employs a **7-tier deterministic interval ladder** (`SRS_INTERVALS`):

| Level (`level`) | Duration (minutes) | Real Interval | Label (FR / EN) | Resulting State |
| :---: | :---: | :---: | :---: | :---: |
| **0** | $10\text{ min}$ | 10 minutes | `10 min` | `learning` |
| **1** | $1\,440\text{ min}$ | 1 day | `1 jour` / `1 day` | `review` |
| **2** | $4\,320\text{ min}$ | 3 days | `3 jours` / `3 days` | `review` |
| **3** | $10\,080\text{ min}$ | 7 days | `7 jours` / `7 days` | `review` |
| **4** | $20\,160\text{ min}$ | 14 days | `14 jours` / `14 days` | `review` |
| **5** | $43\,200\text{ min}$ | 30 days | `30 jours` / `30 days` | `review` |
| **6** | $86\,400\text{ min}$ | 60 days | `60 jours` / `60 days` | `mastered` |

---

## 3. Rating Transition Matrix

When reviewing the back of a card, the student selects one of 4 ratings (`SRSRating`):

1. **Hard (`hard`)**:
   - Immediate reset to **Level 0** (10 minutes).
   - State returns to `learning`.
   - Increments the lapse counter (`lapses++`).
2. **Good (`good`)**:
   - Promotes to next ladder level: `level = min(6, currentLevel + 1)`.
   - Transitions to `review` (or `mastered` if Level 6 is reached).
   - Standard interval expansion.
3. **Easy (`easy`)**:
   - Double-step jump: `level = min(6, currentLevel + 2)`.
   - Fast-tracks confident knowledge to reduce review fatigue.
4. **Mastered (`mastered`)**:
   - Immediately sets `level = 6` (60 days) and state to `mastered`.

---

## 4. Due Queue & Daily Review Selection

The daily study queue prioritizes cards based on their computed due timestamp:

$$\text{isDue} \iff \text{currentTime} \ge \text{record.dueDate}$$

Cards due for review are loaded first, followed by learning cards, and finally a controlled quota of new cards, preventing learner overwhelm.
