# 02 — Technical Architecture & Code Organization

> This document describes the source code structure, architectural layers, dependency boundaries, and state management patterns of the **LPI Certification Prep** application.

---

## 1. Source Directory Tree (`/src`)

The codebase is organized into cleanly decoupled layers to isolate static curriculum data, computational engines, business services, and UI presentation components:

```text
src/
│
├── App.tsx                          # Root application component & primary state orchestrator
├── main.tsx                         # React 18 entry point & DOM mount
├── index.css                        # Global Tailwind CSS imports
├── types.ts                         # Global domain TypeScript type definitions
│
├── components/                      # Presentation Layer (User Interface)
│   ├── Header.tsx                   # Global header (score, streaks, theme switcher)
│   ├── Navigation.tsx               # Main navigation bar
│   ├── HamburgerMenu.tsx            # Categorized mobile and desktop navigation drawer
│   ├── DashboardView.tsx            # Dashboard home view (KPIs, quick resume, recommendations)
│   ├── LearningObjectivesView.tsx   # Official LPI curriculum explorer
│   ├── ThematicLearningPathsView.tsx# Thematic cross-functional learning paths
│   ├── PracticeExamView.tsx         # Full timed practice exam simulator
│   ├── FlashcardsView.tsx           # Spaced repetition system (SRS) flashcards module
│   ├── GlossaryView.tsx             # Command glossary and reference index
│   ├── CertificationPathView.tsx    # LPI career guide and certification roadmap
│   │
│   ├── practice/                    # Exam sub-components, timers, question renderers
│   ├── training/                    # Hands-on interactive lab workshops
│   │   ├── TrainingHubView.tsx      # Hub router for hands-on drills
│   │   ├── VirtualTerminalModule.tsx# Linux terminal simulator with VirtualFS
│   │   ├── IncidentResponseModule.tsx# On-call incident resolution scenarios
│   │   ├── FillInBlankModule.tsx    # Open command entry drills
│   │   ├── TroubleshootingModule.tsx# Log inspection and fault diagnosis
│   │   ├── TimelineSequencingModule.tsx# Chronological order drag-and-drop
│   │   └── MatchingModule.tsx       # Concept association drills
│   ├── weakness/                    # Diagnostic matrix and weakness widgets
│   ├── knowledgeGraph/              # Visual graph of concept dependencies
│   └── learningMap/                 # Interactive visual progress roadmap
│
├── data/                            # Static Curriculum Data (100% Offline)
│   ├── lpicObjectivesData.ts        # LPIC-1 objectives (101 & 102)
│   ├── lpic2ObjectivesData.ts       # LPIC-2 objectives (201 & 202)
│   ├── lpic3ObjectivesData.ts       # LPIC-3 objectives (300, 303, 305, 306)
│   ├── practiceExamsData.ts         # Question bank for practice tests
│   ├── topic101Flashcards.ts ...    # Modular topic-specific flashcard decks
│   ├── incidentResponseData.ts      # Production incident scenarios
│   ├── diagnosticExamData.ts        # Initial diagnostic assessment question set
│   ├── glossaryData.ts              # Linux commands and technical terminology glossary
│   └── thematicLearningPathsData.ts # Structure of thematic learning paths
│
├── services/                        # Business Services & Autonomous Engines
│   ├── virtualFs/                   # In-Memory Virtual Terminal & Filesystem
│   │   ├── VirtualFs.ts             # Inode tree, permissions, FHS standard
│   │   ├── ShellInterpreter.ts      # Bash parser (lexing, pipes, redirections, builtins)
│   │   ├── initialFs.ts             # Standard baseline directory tree
│   │   ├── labScenarios.ts          # Lab challenge definitions and micro-state validators
│   │   └── types.ts                 # Virtual filesystem type declarations
│   ├── srs/                         # Spaced Repetition Engine (Leitner / SM-2)
│   │   ├── srsService.ts            # Interval schedules, retention ratings, lapse tracking
│   │   └── srsStorage.ts            # Local persistence and migration helpers
│   └── weakness/                    # Diagnostic & Analytics Engine
│       ├── weaknessEngine.ts        # Multi-signal error clustering & targeted session generation
│       └── scoringService.ts        # Scaled 200–800 exam grading and readiness algorithm
│
├── utils/                           # Shared Utilities
│   ├── updateService.ts             # Dynamic version checks and release management
│   ├── exportImportService.ts       # JSON profile export, import, and backup schemas
│   └── syntaxTolerance.ts           # Fuzzy command line parser & alias matcher
│
└── i18n/                            # Internationalization
    ├── LanguageContext.tsx          # React Context for runtime locale management
    └── translations.ts              # Comprehensive French and English dictionary keys
```

---

## 2. Architectural Layers & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│         React 18 Components (Views, Modals, Terminal, HUD)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Hooks, Events, User Actions
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC ENGINES                          │
│   • VirtualFs & Shell     • SRS Engine       • Weakness Engine         │
│   • Syntax Tolerance      • Scoring Engine   • Update Service          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Read/Write Operations
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE LAYER                          │
│   • localStorage (namespaced `lpi_*`)  • In-Memory Transient State     │
│   • JSON Profile Backup / Restore      • Static Bundled Data Modules   │
└────────────────────────────────────────────────────────────────────────┘
```

### Unidirectional Data Flow Principles:
1. **Presentation components** do not perform direct calculations on raw telemetry; they call dedicated engine functions (`srsService`, `weaknessEngine`, `scoringService`).
2. **Engines** are pure TypeScript modules with no hard React DOM dependencies, making them trivially testable in isolation.
3. **Persistence** is wrapped defensively in `try/catch` blocks with automated schema migration.
