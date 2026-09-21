# 00 — Project Overview

> **LPI Certification Prep** — An offline-first web platform for learning, hands-on practice, and intensive preparation for the **Linux Professional Institute** certifications (Linux Essentials, LPIC-1, LPIC-2, LPIC-3).
>
> 🧭 **Screen Functional Guide**: For an exhaustive screen-by-screen breakdown of all views, features, and interactions, consult the companion document: **[00 — Functional Guide to Screens & User Journeys](./00_FUNCTIONAL_GUIDE.md)**.

---

## 1. What is LPI Certification Prep?

**LPI Certification Prep** is an interactive learning platform engineered to transform Linux certification study from passive memorization into **active, hands-on mastery**.

It is designed for system administrators, DevOps engineers, computer science students, and self-taught professionals seeking industry-recognized Linux certifications.

### Core Architectural Pillars:
1. **100% Autonomous & Offline-First (PWA)**: No mandatory internet connection or remote account required. All 2,000+ flashcards, exam questions, practical exercises, and the virtual terminal engine run locally in the browser.
2. **Exhaustive Official LPI Syllabus Coverage**: Strict alignment with official LPI curriculum standards (LPIC-1 101 & 102 v5.0, LPIC-2 201 & 202 v4.5, LPIC-3 300, 303, 305, 306).
3. **Real Practice Beyond Simple Multiple-Choice**: Real LPI exams feature free-form command line entry ("Fill-in-the-blank"). The application integrates an intelligent syntax tolerance engine and an in-memory Unix virtual filesystem (*VirtualFS*).
4. **Decentralized Pedagogical Intelligence**: Spaced Repetition System (SRS based on Leitner/SM-2) and a multi-signal *Weakness Engine* that immediately directs students to their critical knowledge gaps.

---

## 2. System Mental Model & Functional Flow

The diagram below illustrates how core modules interconnect to establish an adaptive learning feedback loop:

```text
                                  ┌───────────────────────────────┐
                                  │   LPI CERTIFICATION PREP      │
                                  └───────────────┬───────────────┘
                                                  │
        ┌─────────────────────────────────────────┼────────────────────────────────────────┐
        │                                         │                                        │
        ▼                                         ▼                                        ▼
 ┌───────────────┐                         ┌───────────────┐                        ┌───────────────┐
 │   LEARNING    │                         │   PRACTICE    │                        │   TRAINING    │
 │   (Study)     │                         │  (Evaluate)   │                        │  (Hands-on)   │
 └──────┬────────┘                         └───────┬───────┘                        └───────┬───────┘
        │                                          │                                        │
        ├─ Official Objectives (LPIC-1/2/3)        ├─ Timed Practice Exams (101, 102, 201)  ├─ Virtual Terminal (VirtualFS)
        ├─ Thematic Career Paths                   ├─ Command Syntax Tolerance Engine       ├─ Incident Response Drills
        ├─ Glossary & Command Index                ├─ Baseline Diagnostic Assessment        ├─ Fill-in-the-Blank Drills
        └─ Interactive Flashcards                  └─ Readiness Score Computation           ├─ Troubleshooting Labs
                                                                                            ├─ Timeline Sequencing
                                                                                            └─ Matching Games & Mini-Labs
        │                                          │                                        │
        └──────────────────────────────────────────┼────────────────────────────────────────┘
                                                   │
                                                   ▼
                                    ┌──────────────────────────────┐
                                    │      LEARNING PROGRESS       │
                                    │     (Local Telemetry)        │
                                    └──────────────┬───────────────┘
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        │                                                     │
                        ▼                                                     ▼
         ┌──────────────────────────────┐                      ┌──────────────────────────────┐
         │     SRS ENGINE (SM-2)        │                      │      WEAKNESS ENGINE         │
         │  (Spaced Repetition Review)  │                      │    (Diagnostic Matrix)       │
         └──────────────────────────────┘                      └──────────────────────────────┘
```

---

## 3. Technology Stack & Key Libraries

- **Framework**: React 18+ with TypeScript in strict mode (`strict: true`).
- **Build Tool**: Vite with ES module bundling and fast hot reload during development.
- **Styling**: Tailwind CSS with responsive layout prefixes and WCAG AA contrast compliance.
- **Icons**: Lucide React.
- **Animations**: Motion (`motion/react`).
- **Data Visualizations**: Recharts and SVG charts for progress metrics and mastery distribution.
- **Markdown Viewer**: Custom GFM renderer (`MarkdownView`) with tables, callouts, and syntax highlighting.
- **Persistence**: Browser `localStorage` with versioned keys, error boundaries, and defensive fallbacks.
- **PWA / Offline**: Service Worker with pre-caching manifest for 100% offline availability.
