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
  - [2. 🍔 Categorized Navigation Drawer & Feature Index](#2--categorized-navigation-drawer--feature-index)
  - [3. ⚙️ Automatic Updates & Settings Menu](#3-️-automatic-updates--settings-menu)
  - [4. 📖 Linux Glossary & Command Index](#4--linux-glossary--command-index)
  - [5. 📝 Timed Practice Exam Engine](#5--timed-practice-exam-engine)
  - [6. 🗂️ Interactive Flashcards Deck](#6-️-interactive-flashcards-deck)
  - [7. 🗺️ Career Roadmap & Certification Path](#7-️-career-roadmap--certification-path)
  - [8. 📈 Progress Tracker & Analytics](#8--progress-tracker--analytics)
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

### 5. 📝 Timed Practice Exam Engine
- Realistic multiple-choice and single-choice exam simulation.
- Configurable question banks for **Exam 101**, **Exam 102**, **Exam 201**, **Exam 202**, and **LPIC-3 Specialties**.
- Flag questions for review, jump to unattempted items, and submit with real-time pass/fail score calculations.
- Comprehensive answer reviews with in-depth technical explanations for every option.

### 6. 🗂️ 200 Interactive Flashcards (Topic 101 & Topic 102)
- **100 Dedicated Cards for Topic 101 (System Architecture)**: Exhaustive recall deck spanning all three sub-objectives:
  - **101.1 Hardware Settings (35 Cards)**: `lsmod`, `modprobe`, `insmod`, `rmmod`, `modinfo`, `depmod`, `/etc/modprobe.d/`, `lspci`, `lsusb`, `lscpu`, `lshw`, `dmidecode`, `udevadm` (info, monitor, trigger), `/etc/udev/rules.d/`, `/proc/cpuinfo`, `/proc/meminfo`, `/proc/interrupts`, `/proc/ioports`, `/proc/dma`, `/sys/`, `/dev/`, `sysctl`, `mknod`, D-Bus, and coldplug/hotplug.
  - **101.2 Boot the System (35 Cards)**: BIOS vs UEFI, MBR vs GPT, ESP partition, `efibootmgr`, 7-stage boot process, `initramfs`/`initrd`, `vmlinuz`, `dracut`, `/boot/grub/grub.cfg`, `/etc/default/grub`, `/etc/grub.d/`, `grub-install`, GRUB interactive shell (`set root`, `linux`, `initrd`, `boot`), legacy partition numbering vs GRUB 2, `/proc/cmdline`, `init=/bin/bash`, `systemd.unit=`, `dmesg`, `journalctl -b`, `systemd-boot`, `update-grub`, and `systemd-analyze`.
  - **101.3 Runlevels, Boot Targets & Shutdown (30 Cards)**: SysV runlevels (0-6), `/etc/inittab`, `telinit`, `init`, `runlevel`, `/etc/rc.d/` S/K scripts, systemd target units (`poweroff.target`, `rescue.target`, `multi-user.target`, `graphical.target`, `reboot.target`, `emergency.target`), `systemctl get-default`, `systemctl set-default`, `systemctl isolate`, `shutdown`, `wall`, `reboot`, `halt`, `poweroff`, `/etc/nologin`, `systemctl daemon-reload`, `systemctl mask/unmask`, Magic SysRq keys, and `ctrl-alt-del.target`.

- **100 Dedicated Cards for Topic 102 (Linux Installation and Package Management)**: Complete coverage across all six sub-objectives:
  - **102.1 Design Hard Disk Layout & LVM (18 Cards)**: MBR partition limits (4 primary vs 3+1 extended), swap sizing rules, `/boot`, `/var`, `/home` partitioning strategies, EFI System Partition (FAT32, `/boot/efi`), LVM architecture (PV, VG, LV), `pvcreate`, `pvdisplay`, `vgcreate`, `vgextend`, `lvcreate`, `lvextend`, LVM snapshot volumes, `/etc/fstab` structure (6 fields), UUID/LABEL identification, and `blkid`.
  - **102.2 Install a Boot Manager (18 Cards)**: GRUB Legacy vs GRUB 2 architecture, `/boot/grub/grub.cfg`, `/etc/default/grub` configuration (`GRUB_DEFAULT`, `GRUB_TIMEOUT`, `GRUB_CMDLINE_LINUX`), `/etc/grub.d/` scripts (`00_header`, `10_linux`, `40_custom`), `grub-mkconfig` / `update-grub`, `grub-install`, GRUB 2 disk naming syntax `(hd0,gpt2)`, GRUB interactive commands (`set root`, `linux`, `initrd`, `boot`), `efibootmgr` command & NVRAM boot entries, GRUB 2 password hashing (`grub-mkpasswd-pbkdf2`), and chainloading.
  - **102.3 Manage Shared Libraries (14 Cards)**: Shared library naming conventions (SONAME, real name, linker name), `ldd` command, Dynamic Linker/Loader (`/lib/ld-linux.so.2` & `/lib64/ld-linux-x86-64.so.2`), `/etc/ld.so.conf` & `/etc/ld.so.conf.d/`, `ldconfig` binary and cache generation (`/etc/ld.so.cache`), `ldconfig -p` cache inspection, `LD_LIBRARY_PATH` and `LD_PRELOAD` environment variables, and static vs dynamic linking tradeoffs.
  - **102.4 Debian Package Management (20 Cards)**: `dpkg -i`, `dpkg -r` vs `dpkg -P` (purge configuration), `dpkg -l`, `dpkg -s`, `dpkg -L` (list files installed by package), `dpkg -S` (find which package owns a file), `dpkg -c` (inspect `.deb` archive contents), `dpkg-reconfigure`, `/var/lib/dpkg/status`, `apt-get` / `apt` (`update`, `upgrade`, `dist-upgrade` / `full-upgrade`, `install`, `remove`, `purge`, `autoremove`, `clean`, `autoclean`), `apt-cache search` / `show`, `apt-file search`, `/etc/apt/sources.list` & `/etc/apt/sources.list.d/`, repository line format (type, URI, suite, components), and `/etc/apt/preferences` (package pinning).
  - **102.5 RPM and YUM/DNF Package Management (20 Cards)**: `rpm -ivh`, `rpm -Uvh` vs `rpm -Fvh` (freshen), `rpm -e` (erase), `rpm -qa`, `rpm -qi`, `rpm -ql`, `rpm -qf` (query file ownership), `rpm -q --scripts`, `rpm -q --changelog`, `rpm -q --requires`, `rpm -qp` (query uninstalled `.rpm` package), `rpm -V` (verify package integrity and file digest codes like `5`, `S`, `M`, `D`), `rpm2cpio` archive extraction, `yum` / `dnf` commands (`install`, `update`, `erase`/`remove`, `reinstall`, `search`, `info`, `provides`/`whatprovides`, `history`), `/etc/yum.repos.d/` (`.repo` file fields: `[id]`, `name`, `baseurl`, `enabled`, `gpgcheck`), and `zypper` (openSUSE package manager: `in`, `rm`, `up`, `se`, `lr`, `ar`).
  - **102.6 Linux as a Virtualization Guest (10 Cards)**: Hypervisor Type 1 (bare-metal) vs Type 2 (hosted), KVM `/dev/kvm`, VirtIO paravirtualized device drivers, Guest Agent utilities (`qemu-guest-agent`, `open-vm-tools`), `cloud-init` automated multi-distribution instance provisioning, cloud-init YAML user-data formats, `/var/lib/cloud/` and `/var/log/cloud-init.log`, machine identity regeneration (`machine-id`, SSH host keys via `ssh-keygen -A`), `/etc/localtime` timezone synchronization with hypervisor, and D-Bus hypervisor integration.

- **Interactive Deck Controls & Features**:
  - Top deck switcher tabs: **Topic 102 Deck (100 Cards)**, **Topic 101 Deck (100 Cards)**, and **All LPIC-1 (200 Cards)**.
  - Sub-objective filter pills (**Disks & LVM**, **GRUB & Boot**, **Libraries**, **Debian/APT**, **RPM/YUM**, **Cloud & Virt**).
  - 3D perspective flip card animations with tactile feedback.
  - Search filter across all commands, definitions, examples, and exam tips.
  - Card Index visual modal to quickly jump to any of the 200 cards.
  - Keyboard shortcuts (`Space`/`Enter` to flip, `Left`/`Right` arrow or `R`/`L` keys for review/mastery, `S` for shuffle, `B` to star/bookmark).
  - Speech synthesis (TTS) pronunciation audio for commands and definitions.
  - One-click copy for command syntax examples.
  - High-yield **Exam Tip** callouts highlighting key gotchas.
  - Local persistence for Mastered, Needs Review, and Starred status across browser sessions.

### 7. 🗺️ Career Roadmap & Certification Path
- Visual step-by-step career path from **Linux Essentials** $\rightarrow$ **LPIC-1** $\rightarrow$ **LPIC-2** $\rightarrow$ **LPIC-3 Specialties**.
- Prerequisites, exam codes, question counts, passing scores, and recommended hands-on experience requirements.

### 8. 📈 Progress Tracker & Analytics
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
