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

  [Explore Objectives](#-learning-objectives-curriculum) • [Practice Exams](#-practice-exam-engine) • [Linux Glossary](#-glossary--command-index) • [Install App](#-install-on-desktop--mobile-pwa) • [Quickstart](#-getting-started)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
  - [1. 📚 Learning Objectives & Study Modules](#1--learning-objectives--study-modules)
  - [2. 📖 Linux Glossary & Command Index](#2--linux-glossary--command-index)
  - [3. 📝 Timed Practice Exam Engine](#3--timed-practice-exam-engine)
  - [4. 🗂️ Interactive Flashcards Deck](#4-️-interactive-flashcards-deck)
  - [5. 🗺️ Career Roadmap & Certification Path](#5-️-career-roadmap--certification-path)
  - [6. 📈 Progress Tracker & Analytics](#6--progress-tracker--analytics)
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

## ✨ Key Features

### 1. 📚 Learning Objectives & Study Modules
- Comprehensive breakdown aligned with official LPI exam objectives.
- Covers **System Architecture**, **Linux Installation & Package Management**, **GNU and Unix Commands**, **Devices & Filesystems**, **Shell Scripting & SQL**, **System Services & Networking**, and **Enterprise Infrastructure**.
- Detailed explanations, key terms, configuration files, and common exam pitfalls (*"Exam Gotchas"*).

### 2. 📖 Linux Glossary & Command Index
- Complete dictionary of Linux utilities, configuration files, kernel parameters, and architectural terms.
- Real-time search across command names, syntax, option flags, and objective numbers.
- Filter by certification tier (**LPIC-1**, **LPIC-2**, **LPIC-3**), exam code, topic domain, and classification (Commands vs Config Files vs Concepts).
- **Deep-Dive Inspect Modal**: Syntax copy snippets, option tables, and practical terminal examples.
- **Recall Mode**: Test your memory flashcard-style directly in the glossary.
- Local bookmarking for quick review.

### 3. 📝 Timed Practice Exam Engine
- Realistic multiple-choice and single-choice exam simulation.
- Configurable question banks for **Exam 101**, **Exam 102**, **Exam 201**, **Exam 202**, and **LPIC-3 Specialties**.
- Flag questions for review, jump to unattempted items, and submit with real-time pass/fail score calculations.
- Comprehensive answer reviews with in-depth technical explanations for every option.

### 4. 🗂️ Interactive Flashcards Deck
- Smooth 3D card flip animations powered by Tailwind & CSS.
- Filter by certification tier and knowledge area.
- Shuffle mode and recall tracking (Mark as *"Mastered"* vs *"Needs Review"*).

### 5. 🗺️ Career Roadmap & Certification Path
- Visual step-by-step career path from **Linux Essentials** $\rightarrow$ **LPIC-1** $\rightarrow$ **LPIC-2** $\rightarrow$ **LPIC-3 Specialties**.
- Prerequisites, exam codes, question counts, passing scores, and recommended hands-on experience requirements.

### 6. 📈 Progress Tracker & Analytics
- Track study streaks, completed questions, practice exam attempts, and category proficiencies.
- Persistent local storage: no account or sign-up needed, your study progress stays securely in your browser.

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
│   ├── icon.jpg               # Favicon asset
│   ├── apple-touch-icon.jpg   # iOS Home screen touch icon
│   └── manifest.json          # Web App Manifest for Desktop/Mobile install
├── src/
│   ├── assets/                # App artwork and generated icons
│   ├── components/
│   │   ├── CertificationPathView.tsx   # Visual LPI career roadmap
│   │   ├── DashboardView.tsx           # Main hub with study metrics & jump links
│   │   ├── ExplanationModal.tsx        # In-depth technical question review modal
│   │   ├── FlashcardsView.tsx          # Spaced-repetition flashcard deck
│   │   ├── GlossaryView.tsx            # Searchable Linux Glossary & Command Index
│   │   ├── Header.tsx                  # Global header with stats & quick actions
│   │   ├── LearningObjectivesView.tsx  # Detailed curriculum & topic modules
│   │   ├── Navigation.tsx              # Responsive sidebar & mobile bottom navigation
│   │   ├── PracticeExamView.tsx        # Timed test engine with question scoring
│   │   └── ProfileModal.tsx            # User study stats, streaks & reset controls
│   ├── data/
│   │   ├── glossaryData.ts             # 1000+ commands, config files & gotchas
│   │   └── lpiData.ts                  # Exam questions, flashcards, and objectives
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
