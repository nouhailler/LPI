# 08 — Weakness Detection Engine

> This document specifies the multi-signal diagnostic and remediation engine of **LPI Certification Prep**, located in `src/utils/weaknessEngine.ts`.

---

## 1. Multi-Signal Diagnostic Principles

The **Weakness Engine** detects knowledge vulnerabilities not through a single isolated test score, but by cross-referencing multiple learning signals across time:

```text
Practice Exam Errors ────┐
                         │
SRS Flashcard Lapses ────┼───► [ Multi-Signal Weakness Engine ] ───► [ Prioritized Remediation Plan ]
                         │
Failed Terminal Labs ────┘
```

### Signal Weights:
- **Practice Exam Mistake**: High weight ($W_{exam} = 3.0$). Demonstrates failure in formal summative evaluation.
- **SRS Lapse (`hard` rating)**: Medium-high weight ($W_{srs} = 2.0$). Indicates recall failure of key syntax.
- **Virtual Terminal Lab Failure**: High weight ($W_{lab} = 2.5$). Demonstrates hands-on execution gaps.

---

## 2. Objective Vulnerability Index (OVI)

For every sub-objective $O_i$, the engine calculates a normalized Vulnerability Index:

$$\text{OVI}(O_i) = \frac{\sum_{s \in \text{Signals}(O_i)} W_s \cdot \text{Count}_s(O_i)}{\text{TotalInteractions}(O_i) + \epsilon}$$

Sub-objectives are ranked in descending order of vulnerability. The top 3 are featured directly on the **Dashboard** with instant 1-click remediation shortcuts.

---

## 3. Targeted Remediation Workflow

When a student clicks **"Target this weakness"**:
1. The engine generates a customized mini-session isolating the specific sub-objective.
2. It aggregates:
   - 5 targeted flashcards covering the required commands and files.
   - 1 hands-on lab drill focusing on practical command execution.
   - 3 exam questions directly tied to the objective.
3. Upon successful completion, the objective's vulnerability score decays, updating the user's readiness metrics in real time.
