# 00 — Functional Guide to Screens & User Journeys

> This document provides the **complete screen-by-screen functional specification** of the **LPI Certification Prep** platform. For every view, it details its primary role, key capabilities, user interactions, and pedagogical value in the Linux certification journey.

---

## 1. General Ergonomics & Navigation Structure

The application is built on a unified adaptive learning architecture, fully responsive on both desktop and mobile devices (100% responsive PWA):

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  TOP HEADER                                                                            │
│  [LPI Logo] [Screen Tabs] [Global Search] [FR/EN Language] [Theme] [Menu ☰]            │
├─────────────────┬──────────────────────────────────────────────────────────────────────┤
│ SIDEBAR         │ MAIN ACTIVE SCREEN CONTENT AREA                                      │
│ (Desktop)       │                                                                      │
│ • Dashboard     │ Full-screen display of the active module                             │
│ • Curriculum    │ (Dashboard, Learning Objectives, Flashcards, Practice, Labs...)      │
│ • Paths         │                                                                      │
│ • Flashcards    │                                                                      │
│ • Practice Exams│                                                                      │
│ • Glossary      │                                                                      │
│ • Labs & Shell  │                                                                      │
│ • Explain 💡    │                                                                      │
└─────────────────┴──────────────────────────────────────────────────────────────────────┘
```

### Main Screen Overview Table

| Identifier | Screen Title | Major Pedagogical Role | Interaction Model |
| :--- | :--- | :--- | :--- |
| `dashboard` | **Dashboard** | Global monitoring, readiness score, and weakness detection | Visual synthesis & Shortcuts |
| `learning` | **Official Curriculum** | Hierarchical study of the LPI syllabus (LPIC-1, 2, 3) and topic cheat-sheets | Exploration & Study sheets |
| `path` | **Thematic Paths** | Cross-functional learning by practical sysadmin domain (Security, Networking...) | Step-by-step milestone tiers |
| `flashcards` | **SRS Flashcards** | Long-term memorization of commands, flags, and critical config files | Active self-assessment (Flip Card) |
| `practice` | **Practice Exam Simulator** | Real-world test training (timed, multiple-choice & fill-in-the-blank) | Summative evaluation & Review |
| `glossary` | **Glossary & Explorer** | Technical dictionary, command syntax breakdown, and knowledge graph | Search & Visual decomposition |
| `training` | **Training Hub & Shell** | Hands-on practice on simulated Unix Terminal and troubleshooting mini-games | Command execution & Lab solving |

---

## 2. Screen 1: Dashboard & System Overview (`dashboard`)

### 2.1. Role and Objective
The **Dashboard** serves as the student's central flight deck. It provides an immediate, honest view of exam readiness for the official LPI certification, while actively prescribing the single most effective next study action.

### 2.2. Key Features
- **Global Readiness Score**: Dynamic gauge from 0 to 100% computed from practice exam scores, SRS mastered card volume, and completed lab exercises. A visual indicator highlights when the candidate crosses the recommended 85% passing threshold.
- **Weakness Engine Widget**: Automated diagnostic analysis of recent errors identifying the top 3 most vulnerable sub-objectives (e.g., *Permissions & umask*, *LVM Partition Management*). A dedicated **"Target this weakness"** button opens targeted exercises.
- **Daily Streak Counter**: Tracks consecutive days of practice along with an activity calendar to encourage steady daily habits.
- **Consolidated Learning Metrics**:
  - Total number of flashcards transitioned to *Mastered* state.
  - Number of practice questions answered and average accuracy percentage.
  - Completed interactive terminal labs.
- **1-Click Quick Actions**:
  - *"Today's SRS Review"*: Launches the flashcard queue due today.
  - *"Take Practice Exam"*: Starts a timed 60-question exam session.
  - *"Diagnostic Assessment"*: Evaluates baseline competence to calibrate study recommendations.
  - *"Official LPI Guide"*: Opens official certification criteria and exam day tips.

---

## 3. Screen 2: Official Curriculum & Learning Objectives (`learning`)

### 3.1. Role and Objective
This screen maps the entire official **Linux Professional Institute** syllabus into an interactive, hierarchical interface, enabling candidates to structure their mastery of theoretical concepts and exam expectations.

### 3.2. Key Features
- **Certification & Exam Selector**:
  - **LPIC-1**: Exam 101 (System architecture, installation, GNU/Unix commands, devices) and Exam 102 (Shells, interfaces, administrative tasks, essential network services, security).
  - **LPIC-2**: Exam 201 (Kernel, startup, advanced storage, networking) and Exam 202 (BIND DNS, Apache, Nginx, Samba, NFS, Postfix mail servers).
  - **LPIC-3**: Enterprise specialty tracks (300 Mixed Environment, 303 Security, 305 Virtualization & Containerization, 306 High Availability & Storage).
- **Official Weights (Pondération)** : Every topic displays its official LPI exam weight (from 1 to 5). Higher weights indicate a larger volume of questions on the official examination.
- **Accordion Sub-Objective Tree**:
  - Official title and detailed syllabus description.
  - **Key Files** (`/etc/fstab`, `/etc/resolv.conf`, `/etc/shadow`...).
  - **Required Commands** (`systemctl`, `chmod`, `fdisk`, `tar`, `ip`...).
  - **Theoretical Terms & Concepts** (GUID, UUID, Inodes, Runlevels).
- **In-Depth Study Sheet (Study Modal)**: Clicking any sub-objective opens an in-depth cheat-sheet with key summaries, exam traps, and a button to train specifically on flashcards for that topic.

---

## 4. Screen 3: Cross-Functional Thematic Paths (`path`)

### 4.1. Role and Objective
Unlike the strict linear numbering of official exam chapters, this screen reorganizes skills around **major real-world Linux system administration pillars**, facilitating progressive milestone-driven learning.

### 4.2. Key Features
- **5 Core Transverse Domains**:
  1. *Files, Permissions & Command Line* (Navigation, octal modes, hard/symbolic links, I/O streams).
  2. *Boot, Kernel & System Services* (BIOS/UEFI, GRUB2, Systemd, SysVinit, kernel module compilation).
  3. *Storage, Partitions & Filesystems* (MBR/GPT, ext4, XFS, swap, LVM, mounting, quotas).
  4. *Local Networking & Internet Services* (IP addressing, routing, BIND DNS, gateways, firewalls).
  5. *Security, Encryption & User Accounts* (PAM, shadow, sudoers, OpenSSH, SSL/TLS certificates).
- **Visual Milestone Progression**: Dedicated progress bars with multi-tier star achievements per thematic pillar.
- **Contextual Lab Triggers**: Direct shortcuts to interactive exercises and flashcard subsets linked to the chosen path.

---

## 5. Screen 4: Flashcards & Spaced Repetition SRS (`flashcards`)

### 5.1. Role and Objective
The Flashcards screen is the **active recall engine** of the application. Powered by an adaptive Spaced Repetition System (SRS derived from Leitner and SM-2), it guarantees that commands, options, and critical files are committed to long-term memory.

### 5.2. Key Features
- **Interactive 3D Flip-Card Mechanism**:
  - *Front*: Scenario-based question or troubleshooting challenge (e.g., "Which command modifies the priority of an already running process?").
  - *Back*: Exact command, mandatory flags, standard syntax, and detailed pedagogical rationale.
- **4-Tier Active Self-Assessment**:
  - **Again**: Recall failure; the card is recycled into the current study session.
  - **Hard**: Difficult recall; brief interval (1 to 2 days).
  - **Good**: Accurate recall with minimal hesitation; standard interval expansion.
  - **Easy**: Flawless mastery; extended interval (up to 60-120 days).
- **Queue Separation**: Clear tracking between *New* cards, cards in *Learning*, and cards due for *Review* today.
- **Deck Inspector & Quick Jump (Grid Index Modal)**: Search and browse the complete deck of 2,000+ cards to review specific commands immediately without waiting for scheduled calendar intervals.

---

## 6. Screen 5: Practice Exam Simulator (`practice`)

### 6.1. Role and Objective
This module immerses candidates in realistic Pearson VUE / LPI testing conditions to validate cognitive speed, stress management, and command syntax precision under pressure.

### 6.2. Key Features
- **Official Timed Exam Simulator**:
  - 60 questions randomly drawn according to exact official LPI topic weight distributions.
  - 90-minute countdown timer with visual remaining-time alerts.
  - Official scoring scaled between **200 and 800 points**, with the passing grade set at **500 points**.
- **Dual Question Typologies**:
  - *Multiple-Choice Questions (MCQ)*: Single-choice radio buttons or multiple-selection checkboxes ("Select two answers").
  - *Fill-in-the-Blank Questions*: Open text input requiring exact command syntax or absolute file paths.
- **Intelligent Syntax Tolerance Engine**: Evaluates typed commands accurately without requiring rigid character-for-character copies (whitespace insensitivity, flag order equivalence `-la` vs `-l -a`, relative vs absolute valid paths).
- **Question Flagging for Review**: Bookmark uncertain questions to revisit them easily before final submission.
- **Post-Exam Retrospective & Analytics**:
  - Final score and official pass/fail status.
  - Sub-objective breakdown of strengths and weaknesses.
  - Question-by-question review highlighting selected answers, correct solutions, and full pedagogical explanations.
- **Baseline Diagnostic Assessment**: A targeted 20-question test enabling new users to calibrate their initial proficiency and generate a personalized study roadmap.

---

## 7. Screen 6: Glossary of Commands & Concepts (`glossary`)

### 7.1. Role and Objective
The **Glossary** serves as the comprehensive technical reference library of the platform. More than a simple dictionary, it provides an anatomical breakdown of key system utilities required for LPI certifications.

### 7.2. Key Features
- **Advanced Search & Filtering**:
  - Instant live search across command names, keywords, and descriptions.
  - Category filters: *File Management*, *Processes & CPU*, *Permissions & Access*, *Networking*, *Disks & FS*, *Package Management*.
- **Command Anatomy Visualizer**: Visually dissects complex Unix command structures (executable binary, short flags `-h`, long flags `--human-readable`, target arguments, redirection operators, and pipes `|`).
- **Comprehensive Command Sheets**:
  - Syntax patterns and concise descriptions.
  - Essential exam flags table.
  - Frequent exam pitfalls and common misunderstandings (e.g., confusing recursive `-r` with reverse).
  - Alternative utilities and nuance comparisons (e.g., `cp` vs `dd`, `find` vs `locate`, `which` vs `whereis`).
- **Interactive Knowledge Graph**: Visual graph representation of relationships between commands, network protocols, and configuration files (e.g., the `sshd` node connected to `/etc/ssh/sshd_config`, port `22`, and `systemctl`).

---

## 8. Screen 7: Practical Labs & Terminal Hub (`training`)

### 8.1. Role and Objective
This screen embodies the **"Hands-On First"** philosophy of the platform. It builds muscle memory at the command line without requiring local virtual machine setup or remote cloud containers.

### 8.2. Key Features
- **In-Memory Unix Terminal Simulator (VirtualFS)**:
  - Interactive Bash 5.2 shell running 100% client-side in browser JavaScript.
  - Realistic POSIX/FHS directory tree in memory (`/home/student`, `/etc`, `/var/log`, `/bin`...).
  - Support for 20+ everyday commands with common flags (`pwd`, `ls`, `cd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, `chmod`, `chown`, `tar`, `echo`, `env`...).
  - Dynamic micro-state verification after command execution to validate scenario completion (e.g., verifying a file was assigned octal mask `0o750`).
- **Incident Response On-Call Drills**: Time-limited crisis scenarios requiring students to investigate realistic production failures (disk full, broken permissions blocking SSH logins, missing swap files).
- **Troubleshooting & Log Analysis**: Inspect authentic system log extracts (`journalctl -xe`, `/var/log/messages`, `dmesg`) to identify root causes.
- **Drag-and-Drop Timeline Sequencing**: Chronologically order critical system processes (e.g., boot sequence BIOS -> MBR -> Bootloader -> Kernel -> Initrd -> Systemd).
- **Rapid Matching Games**: Speed-matching exercises pairing commands with default configuration files or network ports.

---

## 9. Global Modal Windows & Shared System Modules

In addition to the 7 main screens, the application provides cross-cutting modules accessible from anywhere in the interface:

### 9.1. Categorized Hamburger Menu (`HamburgerMenu`)
- Structured side drawer organized into distinct sections:
  - *Main Navigation*: Direct links to the 7 primary views.
  - *Technical Documentation & ADRs*: Instant access to 21 architecture documents and decision records.
  - *Pedagogical Tools & Diagnostics*: Restart baseline diagnostic test or onboarding tour.
  - *Profile, Settings & Offline Mode*: PWA management and data reset options.
- Built-in live search to find tools and features instantly.

### 9.2. In-App Documentation Reader (`DocumentationModal`)
- 100% offline Markdown viewer hosting the complete suite of technical specifications and architectural decision records.
- Full GFM typographic rendering: readable tables, syntax-highlighted code blocks, blockquotes, category filters, and 1-click Markdown copy.

### 9.3. "Explain Differently" Tutor (`ExplainDifferentlyModal`)
- Adaptive pedagogical tool offering 5 distinct angles on complex Linux concepts:
  1. *Executive Summary*: Ultra-concise core takeaways.
  2. *ELI5 / Real-World Metaphor*: Everyday life analogies for beginner comprehension.
  3. *Step-by-Step Terminal Example*: Concrete command workflow with a shortcut to launch the shell.
  4. *Quick Verification Quiz*: Immediate checkpoint question with explanatory rationale.
  5. *Classic Exam Trap*: Insights into common trick questions used by LPI examiners.
- Works 100% offline via the embedded local corpus, with optional live AI enrichment via Google Gemini when an internet connection and API key are available.

### 9.4. Official LPI Certification Guide (`LpiCertificationGuideModal`)
- Official requirements, prerequisites, 5-year recertification policies, Pearson VUE exam procedures, and time-management strategies.

### 9.5. System Settings & PWA Management (`SettingsModal`)
- PWA and Service Worker cache status monitoring.
- Export and import of learning progress as encrypted JSON backup files.
- Local storage telemetry inspection, language switching, and version changelog.
