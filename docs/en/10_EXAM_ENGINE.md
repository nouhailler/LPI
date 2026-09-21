# 10 — Practice Exam Engine & 200–800 Scaled Scoring

> This document formalizes the exam simulation engine, question selection algorithms, and official LPI 200–800 scaled scoring implementation in `src/utils/scoringService.ts`.

---

## 1. Official LPI Exam Format & Constraints

- **Exam Duration**: Strictly 90 minutes.
- **Question Volume**: 60 questions per official exam session.
- **Question Distribution**: Weighted proportionally across topics according to official LPI syllabus weights (1 to 5).
- **Scoring Scale**: Scaled from **200 to 800 points**, with the passing cutoff set at **500 points** (approx. 70% raw accuracy).

---

## 2. Scaled Score Calculation Algorithm

Raw percentage scores are mapped to the official LPI 200–800 point scale using a piece-wise linear transformation calibrated against historical exam standards:

$$\text{ScaledScore} = 200 + \text{round}\left( \frac{\text{CorrectWeight}}{\text{TotalWeight}} \times 600 \right)$$

```typescript
export function computeScaledScore(
  questions: ExamQuestion[],
  answers: Record<string, string | string[]>
): {
  scaledScore: number;      // 200 - 800
  percentage: number;       // 0 - 100%
  passed: boolean;          // scaledScore >= 500
  topicBreakdown: Record<string, { correct: number; total: number; pct: number }>;
}
```

---

## 3. Intelligent Syntax Tolerance Engine

For Fill-in-the-Blank questions, the syntax tolerance parser evaluates command line entries flexibly:
- **Whitespace normalization**: Trailing spaces and redundant internal spaces are collapsed.
- **Flag order invariance**: `-la`, `-al`, and `-l -a` are recognized as equivalent.
- **Path normalization**: Canonical relative and absolute equivalents are honored when appropriate.
- **Case sensitivity awareness**: Linux command names and paths remain strictly case-sensitive, while argument parameters follow standard Unix semantics.
