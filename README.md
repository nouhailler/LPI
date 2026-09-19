<div align="center">

  <img src="public/app-logo.jpg" alt="LPI Certification Prep Logo" width="140" height="140" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.25);" />

  # 🐧 LPI Certification Prep
  ### Complete Study Platform for LPIC-1, LPIC-2 & LPIC-3 Enterprise Certifications

  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Installable-FFC20E?style=for-the-badge&logo=pwa&logoColor=black)](#-install-on-desktop--mobile-pwa)
  [![License](https://img.shields.io/badge/License-MIT-28A745?style=for-the-badge)](#-license)

  <p align="center">
    <strong>An interactive, modern study suite designed to help Linux engineers and system administrators master the Linux Professional Institute (LPI) certification curriculum.</strong>
  </p>

  <br />

  <p align="center">
    <img src="public/dashboard-screenshot.jpg" alt="LPI Certification Prep Application Screenshot" width="900" style="border-radius: 16px; border: 1px solid #d3c5ab; box-shadow: 0 16px 40px rgba(0,0,0,0.18);" />
  </p>

  <br />

  [Explore Objectives](#-learning-objectives-curriculum) • [Practice Exams](#-practice-exam-engine) • [Linux Glossary](#-glossary--command-index) • [Install App](#-install-on-desktop--mobile-pwa) • [Quickstart](#-getting-started)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [🖥️ Application Preview](#️-application-preview)
- [✨ Key Features](#-key-features)
  - [1. 📚 Learning Objectives & Study Modules](#1--learning-objectives--study-modules)
  - [2. 🍔 Categorized Navigation Drawer & Feature Index](#2--categorized-navigation-drawer--feature-index)
  - [3. ⚙️ Automatic Updates & Settings Menu](#3-️-automatic-updates--settings-menu)
  - [4. 📖 Linux Glossary & Command Index](#4--linux-glossary--command-index)
  - [5. 📝 Timed Practice Exam Engine & Simulation](#5--timed-practice-exam-engine--simulation)
  - [6. 🗂️ Spaced-Repetition Interactive Flashcards (2,000+ Cards)](#6-️-spaced-repetition-interactive-flashcards-2000-cards)
  - [7. ⚡ Hands-on Interactive Training Hub (Labs & Scenarios)](#7-️-hands-on-interactive-training-hub-labs--scenarios)
  - [8. 🎯 Examen Diagnostique Initial & Matrice de Compétences](#8--examen-diagnostique-initial--matrice-de-compétences)
  - [9. 📊 Intelligent Dashboard, LPI Guide & Exam Standards](#9--intelligent-dashboard-lpi-guide--exam-standards)
  - [10. 🗺️ Career Roadmap & Certification Path](#10-️-career-roadmap--certification-path)
  - [11. 📈 Progress Tracker & Exam Analytics](#11--progress-tracker--exam-analytics)
  - [12. 🌐 Full Bilingual Experience (Français / English)](#12--full-bilingual-experience-français--english)
- [📱 Install on Desktop & Mobile (PWA)](#-install-on-desktop--mobile-pwa)
- [🎯 Covered LPI Certification Exams](#-covered-lpi-certification-exams)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Local Run](#installation--local-run)
  - [Production Build](#production-build)
- [📂 Project Directory Structure](#-project-directory-structure)
- [📄 License](#-license)

---

## 🌟 Overview

**LPI Certification Prep** is an all-in-one exam preparation suite for Linux professionals. Whether you are aiming for your first sysadmin credential with **LPIC-1**, elevating your server infrastructure skills with **LPIC-2**, or specializing in **LPIC-3 Enterprise** security, virtualization, mixed environments, and high-availability clusters, this platform provides structured study content, realistic simulated exams, deep command references, and interactive flashcards.

---

## 🖥️ Application Preview

<div align="center">
  <img src="public/dashboard-screenshot.jpg" alt="Interface du Tableau de bord LPI Certification Prep" width="100%" style="border-radius: 14px; border: 1px solid #d3c5ab; box-shadow: 0 12px 32px rgba(0,0,0,0.15);" />
  <p align="center">
    <em>Tableau de bord interactif : Suivi des objectifs LPIC-1/2/3, série d'entraînement, métriques d'examen officiel et accès direct aux modules de révision.</em>
  </p>
</div>

---

## ✨ Key Features

### 1. 📚 Learning Objectives & Study Modules
- Comprehensive breakdown aligned with official LPI exam objectives.
- Covers **System Architecture**, **Linux Installation & Package Management**, **GNU and Unix Commands**, **Devices & Filesystems**, **Shell Scripting & SQL**, **System Services & Networking**, and **Enterprise Infrastructure**.
- Detailed explanations, key terms, configuration files, and common exam pitfalls (*"Exam Gotchas"*).

### 2. 🍔 Categorized Navigation Drawer & Feature Index
- Accessible anytime via the **Hamburger menu button** in the top navigation bar.
- Features categorized cleanly into **Primary Navigation**, **LPIC-1 Curriculum**, **LPIC-2 Curriculum**, **LPIC-3 Enterprise Specialties**, **Specialized Testing Tools**, and **Profile & Progress**.
- Integrated real-time search filter to jump straight to any topic or utility (e.g., `BIND`, `LVM`, `RAID`, `Bash`, `GRUB`).
- Collapsible categories with item counts and quick-launch badge tags.

### 3. ⚙️ Automatic Updates & Settings Menu
- **Live Version Number & Release Date**: Displays current release (e.g., `v2.4.0`) and release date (`September 1, 2026`).
- **Automatic Background Update Engine**: Service Worker and runtime version verification poll for newly deployed versions and show instant notification banners.
- **Force Update & Cache Purge**: One-click **Force Update** button that unregisters stale workers, clears all `CacheStorage` caches, and performs a clean reload with fresh assets.
- **Customizable Update Intervals**: Toggle background auto-update on/off and select check frequencies (every 5 mins, 15 mins, or 1 hour).

### 4. 📖 Linux Glossary & Command Index
- Complete dictionary of Linux utilities, configuration files, kernel parameters, and architectural terms.
- Real-time search across command names, syntax, option flags, and objective numbers.
- Filter by certification tier (**LPIC-1**, **LPIC-2**, **LPIC-3**), exam code, topic domain, and classification (Commands vs Config Files vs Concepts).
- **Deep-Dive Inspect Modal**: Syntax copy snippets, option tables, and practical terminal examples.
- **Recall Mode**: Test your memory flashcard-style directly in the glossary.
- Local bookmarking for quick review.

### 5. 📝 Timed Practice Exam Engine & Simulation
- **Multi-Tier Certification Exams**: Select and simulate official exam sessions for **LPIC-1 (Exams 101 & 102)**, **LPIC-2 (Exams 201 & 202)**, and **LPIC-3 Specialties (300 Mixed Environment, 303 Security, 305 Virtualization, 306 High Availability)**.
- **Dedicated Exam Briefing / Intro Screen**: Detailed preparation instructions, passing score reminder (70% / 500 out of 800), question count, and test rules before launching.
- **Dynamic Navigation & Question Controls**: Seamless **Previous Question** and **Next Question** buttons, question review flag toggle, and interactive questions grid showing answered, flagged, and unattempted items.
- **Sprint Mode Timer**: 45-minute sprint simulation (matching official 90-minute real-world exam pace in accelerated format) with live pause and resume controls.
- **Instant Scoring & Technical Explanations**: Immediate scoring upon completion with pass/fail badges, review breakdown by question, and in-depth technical explanation modals analyzing each distractor and correct answer.

### 6. 🗂️ Spaced-Repetition Interactive Flashcards (2,000+ Cards)
- **Comprehensive Coverage Across All Tiers**:
  - **LPIC-1 Curriculum**: 100 dedicated cards per topic across all 10 topics:
    - **Topic 101**: System Architecture (Hardware, Boot Process, Runlevels & systemd)
    - **Topic 102**: Linux Installation & Package Management (Disks, LVM, GRUB2, Libraries, Debian/APT, RPM/YUM, Cloud & Virtualization)
    - **Topic 103**: GNU and Unix Commands (Streams, Pipes, Text Processing, File Management, Regex)
    - **Topic 104**: Devices, Linux Filesystems, Filesystem Hierarchy Standard (FHS)
    - **Topic 105**: Shells, Shell Scripting and Data Management (Bash, Environment, SQL)
    - **Topic 106**: User Interfaces and Desktops (X11, Wayland, Accessibility)
    - **Topic 107**: Administrative Tasks (Users, Groups, Scheduling cron/systemd-timers, Localization)
    - **Topic 108**: Essential System Services (System Time, Logging rsyslog/journald, Mail Transfer)
    - **Topic 109**: Networking Fundamentals (IPv4/IPv6, Routing, DNS, Ports, Configuration)
    - **Topic 110**: Security (Host Hardening, Permissions, SSH, GPG)
  - **LPIC-2 Curriculum**: Exhaustive decks spanning Topics 200 through 212 (Capacity Planning, Linux Kernel, System Startup, Advanced Storage LVM/RAID, Networking, BIND9 DNS, Apache/Nginx Web Services, Samba/NFS File Sharing, DHCP/PAM/LDAP Client Management, Postfix/Dovecot E-Mail, and System Security/Firewalls).
  - **LPIC-3 Enterprise Specialties**: Dedicated card sets covering Samba AD DC & LDAP (300), Advanced Cryptography & Hardening (303), Virtualization & Containers (305), and High Availability Clusters (306).
- **Moteur Scientifique de Répétition Espacée (SRS Engine)**:
  - **Machine d'états 5 niveaux** : `Nouvelle` ➔ `À revoir` ➔ (`Difficile` / `Correct` / `Facile`) ➔ `Maîtrisée`.
  - **Échelle d'intervalles calculée** : `10 min` ➔ `1 jour` ➔ `3 jours` ➔ `7 jours` ➔ `14 jours` ➔ `30 jours` ➔ `60 jours (Maîtrisée)`.
  - **« Révision du jour » (Daily Review)** : File d'attente intelligente sélectionnant précisément les cartes dues à la date du jour (ex: `🧠 23 cartes à revoir aujourd'hui`).
  - **Matrice de notation à 4 touches** :
    - `1` / **Difficile** : Ramène l'intervalle à 10 min pour consolider la notion immédiatement.
    - `2` / **Correct** : Progresse vers l'intervalle supérieur (1j, 3j, 7j, etc.).
    - `3` / **Facile** : Avance de 2 paliers d'intervalles.
    - `4` / **Maîtrisée** : Ancre directement à 60 jours.
  - **Widget Dédié sur le Tableau de bord** : Accès direct avec compteur dynamique en temps réel, échelle des paliers et ventilation des cartes en cours d'apprentissage.
  - **Synchronisation locale** : Persistance automatique dans `localStorage` avec synchronisation inter-onglets et événements d'état en direct.
- **Interactive Deck Controls & Features**:
  - Sub-objective filter pills to narrow down exact focus areas.
  - 3D perspective flip card animations with tactile feedback.
  - Search filter across all commands, definitions, examples, and exam tips.
  - Card Index visual modal to quickly jump to any card in the deck.
  - Keyboard shortcuts (`Space`/`Enter` to flip, `1-4` for SRS ratings, `S` for shuffle, `B` to star/bookmark).
  - Speech synthesis (TTS) pronunciation audio for commands and definitions.
  - One-click copy for command syntax examples.
  - High-yield **Exam Tip** callouts highlighting gotchas and edge cases.

### 7. ⚡ Hands-on Interactive Training Hub (Labs & Scenarios)
- **Guided Mini-Labs**: Step-by-step interactive CLI challenges guiding students through partition setup, systemd unit configuration, user administration, and network troubleshooting with real-time command syntax validation.
- **Troubleshooting Scenarios**: Diagnostic break-fix cases simulating realistic server emergencies (boot failures, broken GRUB configurations, permission locks, degraded RAID arrays, crashed daemons) with progressive hints and verified resolution steps.
- **Command Sequencing Drills**: Arrange commands into the exact chronological order required to execute multi-step sysadmin procedures safely.
- **Matching Pairs Game**: Rapid-fire visual matching linking commands to syntax flags, configuration files to services, network ports to protocols, and utilities to LPI topics.
- **Fill-in-the-Blank Challenges**: Test exact CLI command syntax, options, and configuration directives.

### 8. 🎯 Examen Diagnostique Initial & Matrice de Compétences
- **Évaluation initiale 20 questions** : Déclenchée au premier lancement (ou accessible à tout moment depuis le menu et le bandeau d'accueil) pour calibrer le niveau de l'étudiant sur les 6 domaines fondamentaux LPIC-1.
- **Matrice Domaine / Niveau détaillée** :
  | Domaine | Niveau visuel | Seuil |
  | :--- | :--- | :--- |
  | **Architecture système** | 🟢 Vert (Acquis) | $\ge 75\%$ |
  | **Commandes GNU/Linux** | 🟢 Vert (Acquis) | $\ge 75\%$ |
  | **Filesystems & Périphériques** | 🟠 Orange (En cours) | $50\% - 74\%$ |
  | **Bash & Shell Scripting** | 🔴 Rouge (Prioritaire) | $< 50\%$ |
  | **Réseau (Networking)** | 🔴 Rouge (Prioritaire) | $< 50\%$ |
  | **Sécurité (Security)** | 🟠 Orange (En cours) | $50\% - 74\%$ |
- **« Vos 3 Priorités »** : Extraction automatique des 3 domaines les plus faibles avec indicateurs d'urgence (`#1 Priorité`, `#2`, `#3`) et boutons d'action directe en 1 clic (Cours, Flashcards ciblées, Labs interactifs).
- **Alimentation directe du moteur de recommandation** : Le bandeau « Prochaine étape recommandée » du tableau de bord bascule automatiquement en ciblant en priorité absolue le thème le plus faible révélé par le diagnostic jusqu'à sa maîtrise complète.

### 9. 📊 Intelligent Dashboard, LPI Guide & Exam Standards
- **Dynamic "Next Recommended Step"**: Real-time evaluation of study progress that automatically prioritizes the diagnostic assessment's weakest domains before falling back to the highest-weight unmastered LPIC-1 objectives.
- **LPI Certification Methodology Guide (`LpiCertificationGuideModal`)**: Direct-access guide outlining the 4 pillars of preparation (weight prioritization, active recall, hands-on terminal practice, exam simulation) and how to avoid common traps (case sensitivity, absolute paths, multi-select questions).
- **Context-Aware Tooltips (`InfoTooltip`)**: Discreet tooltips explaining LPI weights (1 weight point ≈ 1 exam question), official 90-minute testing vs 45-minute sprint mode, and passing standards (70% / 500 out of 800).
- **Recent Practice Exam Performance Widget**: Preserves recent test runs with scores, dates, correct answer counts, pass/fail status, and average percentage.

### 10. 🗺️ Career Roadmap & Certification Path
- Visual step-by-step career path from **Linux Essentials** $\rightarrow$ **LPIC-1** $\rightarrow$ **LPIC-2** $\rightarrow$ **LPIC-3 Specialties**.
- Prerequisites, exam codes, question counts, passing scores, and recommended hands-on experience requirements.

### 11. 📈 Progress Tracker & Analytics
- Track study streaks, completed questions, practice exam attempts, and category proficiencies.
- Persistent local storage: no account or sign-up needed, your study progress stays securely in your browser.

### 12. 🌐 Full Bilingual Experience (Français / English)
- Instant language toggle (`FR` / `EN`) in the top navigation bar.
- Fully localized interface labels, curriculum objectives, practice questions, technical explanations, exam rules, and methodologies.

---

## 📱 Install on Desktop & Mobile (PWA)

This platform includes a complete **Web App Manifest (`manifest.json`)**, custom application icons, and touch icons so you can install it as a standalone desktop or mobile application.

```
┌──────────────────────────────────────────────────────────────┐
│                   LPI Prep App Installation                  │
├──────────────────────────────┬───────────────────────────────┤
│ 🖥️ Desktop (Chrome / Edge)    │ 📱 Mobile (iOS Safari / Chrome)│
│ 1. Click the Install icon in │ 1. Tap the Share button (iOS) │
│    the browser address bar   │ 2. Select 'Add to Home Screen'│
│ 2. Launch as standalone app  │ 3. Open directly from home    │
└──────────────────────────────┴───────────────────────────────┘
```

- **Android / Chrome**: Tap the three-dot menu and tap **"Install App"** or **"Add to Home screen"**.
- **iOS / Safari**: Tap the **Share** button at the bottom and select **"Add to Home Screen"**.
- **macOS / Windows / Linux (Chrome & Edge)**: Click the **Install** button on the right side of the URL address bar to install to your dock / desktop.

---

## 🎯 Covered LPI Certification Exams

| Certification | Exam Code | Focus Areas | Status |
|---|---|---|---|
| **LPIC-1** | `101-500` | System Architecture, Linux Installation, Package Management, GNU/Unix Commands, Devices & Filesystems | ✅ Complete |
| **LPIC-1** | `102-500` | Shells, Shell Scripting, SQL, User Interfaces, Administrative Tasks, Essential Services, Networking & Security | ✅ Complete |
| **LPIC-2** | `201-450` | Capacity Planning, Linux Kernel, System Startup, Filesystems & Devices, Advanced Storage (LVM, RAID), Network Configuration | ✅ Complete |
| **LPIC-2** | `202-450` | Domain Name Server (BIND9), Web Services (Apache/Nginx), File Sharing (Samba/NFS), Mail Services, System Security | ✅ Complete |
| **LPIC-3** | `300-100` | Mixed Environment: OpenLDAP, Samba Active Directory Domain Controller, Winbind, Kerberos authentication | ✅ Included |
| **LPIC-3** | `303-300` | Security: Cryptography (LUKS2, OpenSSL), Host Hardening (AppArmor, SELinux, Auditd), Network Security | ✅ Included |
| **LPIC-3** | `305-300` | Virtualization & Containerization: QEMU/KVM, Libvirt, LXC, Podman, Docker, Vagrant, Packer | ✅ Included |
| **LPIC-3** | `306-300` | High Availability & Storage Clusters: Pacemaker, Corosync, DRBD, iSCSI, Ceph, Keepalived, HAProxy | ✅ Included |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Animations & Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Typography**: IBM Plex Sans + JetBrains Mono
- **State & Storage**: React Hooks + Browser LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- `npm` or `bun` or `yarn`

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/lpi-certification-prep.git
   cd lpi-certification-prep
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Production Build

To compile and produce a static distribution bundle for deployment:

```bash
npm run build
```

The optimized static files will be generated in the `dist/` directory ready for deployment on GitHub Pages, Cloud Run, Vercel, Netlify, or any static host.

---

## 📂 Project Directory Structure

```
lpi-certification-prep/
├── public/
│   ├── app-logo.jpg           # Application vector icon & PWA icon
│   ├── dashboard-screenshot.jpg # Application interface preview screenshot
│   ├── icon.jpg               # Favicon asset
│   ├── apple-touch-icon.jpg   # iOS Home screen touch icon
│   └── manifest.json          # Web App Manifest for Desktop/Mobile install
├── src/
│   ├── assets/                # App artwork and generated icons
│   ├── components/
│   │   ├── training/                   # Interactive hands-on training hub
│   │   │   ├── TrainingHubView.tsx     # Training dashboard & module switcher
│   │   │   ├── GuidedMiniLabsModule.tsx # Step-by-step CLI missions with syntax check
│   │   │   ├── TroubleshootingModule.tsx # Break-fix diagnosis & root-cause challenges
│   │   │   ├── SequencingModule.tsx    # Chronological command order drills
│   │   │   ├── MatchingModule.tsx      # Command, file & port matching game
│   │   │   └── FillInTheBlankModule.tsx # Exact command flag & directive syntax drills
│   │   ├── CertificationPathView.tsx   # Visual LPI career roadmap (Essentials to LPIC-3)
│   │   ├── DashboardView.tsx           # Main hub with dynamic next steps & performance
│   │   ├── ExplanationModal.tsx        # In-depth technical question review modal
│   │   ├── FlashcardsView.tsx          # 2,000+ cards spaced-repetition deck with audio TTS
│   │   ├── GlossaryView.tsx            # Searchable Linux Glossary & Command Index
│   │   ├── HamburgerMenu.tsx           # Categorized drawer menu with real-time search
│   │   ├── Header.tsx                  # Global header with stats, streak & lang switcher
│   │   ├── InfoTooltip.tsx             # Context-sensitive tooltips for LPI exam standards
│   │   ├── LanguageSelector.tsx        # Bilingual language toggle (FR / EN)
│   │   ├── LearningObjectivesView.tsx  # Detailed curriculum & topic modules (101 to 306)
│   │   ├── LpiCertificationGuideModal.tsx # Official LPI methodology & preparation guide
│   │   ├── Navigation.tsx              # Responsive sidebar & mobile bottom navigation
│   │   ├── PracticeExamView.tsx        # Timed test engine with intro screen & questions grid
│   │   ├── ProfileModal.tsx            # User study stats, streaks & reset controls
│   │   ├── SettingsModal.tsx           # Service worker updates, cache purge & preferences
│   │   └── UpdateNotificationBanner.tsx # Live banner notifying of newly deployed versions
│   ├── data/
│   │   ├── glossaryData.ts             # 1000+ commands, config files & gotchas
│   │   ├── lpiData.ts                  # Exam questions, flashcards, and objectives
│   │   ├── practiceExamsData.ts        # Comprehensive question banks (LPIC-1, 2, 3)
│   │   ├── trainingData.ts             # Labs, troubleshooting & sequencing challenges
│   │   └── topic*Flashcards.ts         # Exhaustive topic-by-topic flashcard decks
│   ├── i18n/
│   │   ├── LanguageContext.tsx         # Global language state and provider
│   │   ├── translations.ts             # UI strings in French and English
│   │   └── frenchData.ts               # Localized curriculum & exam questions
│   ├── utils/
│   │   └── updateService.ts            # PWA service worker lifecycle & version checks
│   ├── App.tsx                         # Root router and state management
│   ├── main.tsx                        # React application DOM root
│   ├── index.css                       # Tailwind design token definitions
│   └── types.ts                        # Shared TypeScript interfaces & types
├── index.html                          # Entry HTML with PWA meta tags & Web Fonts
├── package.json                        # Node dependencies and scripts
├── tsconfig.json                       # TypeScript compiler configuration
├── vite.config.ts                      # Vite build configuration
└── README.md                           # Documentation & user guide
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for personal study, educational institutions, and training bootcamps.

<div align="center">
  <sub>Built with ❤️ for the Linux and Open Source community. Good luck on your LPI Certification exams! 🚀</sub>
</div>
