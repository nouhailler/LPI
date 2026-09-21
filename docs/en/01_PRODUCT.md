# 01 — Product Vision & Scope

> This document defines the functional vision, target audience personas, value proposition, and feature maturity roadmap for **LPI Certification Prep**.

---

## 1. Product Positioning

**LPI Certification Prep** is the premier **offline-first** web platform for learning, hands-on training, and intensive exam preparation for **Linux Professional Institute (LPI)** certifications.

It sets itself apart from conventional exam dumps by offering an interactive ecosystem of simulated Unix terminal exercises, active recall flashcards, and diagnostic analytics that build real administrative reflexes.

---

## 2. Target Personas

| Persona | Key Needs | Primary Features Utilized |
| :--- | :--- | :--- |
| **LPIC-1 Candidate (101 & 102)** | Beginner to intermediate. Needs to master basic commands, permissions, disk partitioning, services, and local networking. | SRS Flashcards, Fill-in-the-blank drills, Virtual Terminal (`chmod`, `grep`, `tar` exercises). |
| **LPIC-2 Candidate (201 & 202)** | Experienced sysadmin. Deep dive into the kernel, advanced storage (LVM, RAID), network servers (BIND, Apache, Samba, Postfix). | Practice Exams 201/202, DNS/Mail incident drills, boot and kernel troubleshooting labs. |
| **LPIC-3 Candidate (300, 303, 305, 306)** | Senior Enterprise Linux Specialist (Mixed Environments, Security, Virtualization & Cloud, High Availability). | LPIC-3 specialty modules, advanced security questions (SELinux, AppArmor, OpenSSL, iptables/nftables). |
| **Working Sysadmin / Refresher** | Working professional brushing up on commands before a technical interview or infrastructure migration. | Quick diagnostic exam, Training Hub (Incident Response), Glossary & command sheets. |
| **Student / Self-Taught Learner** | Practicing without access to a dedicated Linux host (e.g., locked corporate laptop, tablet, offline transit). | 100% in-browser PWA terminal simulator without requiring virtual machines. |

---

## 3. Feature Maturity Matrix

To ensure documentation accuracy and prevent drift between architectural plans and implemented code, every capability is classified under one of three statuses:

- **✅ IMPLEMENTED**: Fully developed, tested, present in the codebase, and accessible in the UI.
- **🔄 PLANNED**: Architecturally designed (types, interfaces, or mockups ready), prioritized in the roadmap.
- **🧪 EXPERIMENTAL**: Exploratory prototype or optional third-party integration requiring external keys.

---

### Detailed Capability Matrix

| Module | Feature | Status | Scope & Implementation Notes |
| :--- | :--- | :---: | :--- |
| **Core & Nav** | Navigation & Dashboard | ✅ IMPLEMENTED | Categorized drawer menu, readiness score, learning metrics, view switcher. |
| **Core & Nav** | Internationalization (i18n) | ✅ IMPLEMENTED | Full French/English bilingualism with instant runtime toggle without reloading. |
| **Core & Nav** | PWA & Offline Mode | ✅ IMPLEMENTED | Installable on desktop/mobile, Service Worker, complete data and asset caching. |
| **Learning** | LPIC-1, 2, 3 Curriculum | ✅ IMPLEMENTED | Complete official objective hierarchy with weights and detailed sub-objectives. |
| **Learning** | Thematic Career Paths | ✅ IMPLEMENTED | Cross-functional sysadmin tracks (e.g., Networking, Security, Storage). |
| **Learning** | Glossary & Command Index | ✅ IMPLEMENTED | Complete Linux command dictionary with category filters, common flags, and examples. |
| **Learning** | Command Anatomy | ✅ IMPLEMENTED | Visual breakdown of commands (binary, short/long flags, arguments, pipes). |
| **Flashcards** | Leitner / SM-2 SRS Algorithm | ✅ IMPLEMENTED | Spaced repetition with state tracking (*new, learning, review, mastered*), lapses, and intervals. |
| **Flashcards** | 2,000+ Card Deck | ✅ IMPLEMENTED | Cards spanning all LPIC-1 topics (101-110), LPIC-2 (201-212), and LPIC-3 tracks. |
| **Practice** | Timed Practice Exams | ✅ IMPLEMENTED | 60-question / 90-minute timed simulator with question flagging and scaled scoring. |
| **Practice** | Syntax Tolerance Engine | ✅ IMPLEMENTED | Intelligent command evaluation (whitespace insensitivity, flag ordering, equivalent aliases). |
| **Practice** | Baseline Diagnostic Exam | ✅ IMPLEMENTED | Initial assessment generating a personalized competency matrix and study priorities. |
| **Analytics** | Weakness Engine | ✅ IMPLEMENTED | Dynamic knowledge gap computation, recurring error tracking, and targeted drill recommendations. |
| **Analytics** | Readiness Score | ✅ IMPLEMENTED | Statistical likelihood of passing the official exam based on consolidated performance telemetry. |
| **Training** | Virtual Terminal (VirtualFS) | ✅ IMPLEMENTED | In-memory filesystem (`/home`, `/etc`, `/var/log`), simulated Bash 5.2 shell, and state validation. |
| **Training** | Incident Response Drills | ✅ IMPLEMENTED | Timed on-call crisis simulations with realistic production troubleshooting scenarios. |
| **Training** | Fill-in-the-Blank Drills | ✅ IMPLEMENTED | Open-ended command entry questions without multiple-choice crutches, featuring instant feedback. |
| **Training** | Troubleshooting Labs | ✅ IMPLEMENTED | Log analysis based on authentic error messages (`dmesg`, `journalctl`, `syslog`). |
| **Training** | Timeline Sequencing | ✅ IMPLEMENTED | Drag-and-drop chronological ordering of critical workflows (UEFI/GRUB boot, packet flow). |
| **Training** | Matching Games | ✅ IMPLEMENTED | Rapid association drills linking commands, config files, and standard network ports. |
| **Career** | Certification Path Guide | ✅ IMPLEMENTED | Interactive guide covering LPI prerequisites, validity periods, and exam day recommendations. |
| **AI / Tutor** | "Explain Differently" | 🧪 EXPERIMENTAL | Multi-angle concept explanations via Gemini API with deterministic offline local fallback. |
| **Labs V2** | Dedicated Containers (Wasm) | 🔄 PLANNED | Linux micro-kernel execution in the browser via WebAssembly (v86/WebContainers) for native systemd. |
| **Sync** | Multi-Device Sync | 🔄 PLANNED | Encrypted JSON profile backup/restore and optional sync across devices. |
| **Desktop** | Tauri / Electron Native Build | 🔄 PLANNED | Native desktop bundle with local Docker/Podman daemon integration for advanced LPIC-2/3 labs. |
