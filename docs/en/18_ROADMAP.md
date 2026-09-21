# 18 — Strategic Roadmap (CURRENT / TARGET / FUTURE)

> This document outlines the technical evolution trajectory of **LPI Certification Prep** across three successive milestones: V1 (Current PWA), V2 (WebAssembly Linux Engine), and V3 (Native Desktop & Containers).

---

## 1. Trajectory Overview

```text
[ V1: PWA Offline-First (Current) ]
  │ • Pure client-side React 18 + TypeScript
  │ • In-memory VirtualFS shell simulation (LPIC-1)
  │ • Spaced Repetition (SRS Leitner/SM-2)
  │ • Multi-signal Weakness Engine
  ▼
[ V2: WebAssembly Linux Micro-Kernel ]
  │ • v86 / WebContainers runtime in-browser
  │ • Real Linux micro-kernel for LPIC-2 service labs (BIND, Apache, Nginx)
  │ • IndexedDB storage engine for large state snapshots
  ▼
[ V3: Native Desktop & Disposable Containers ]
  │ • Tauri / Rust native wrapper for Windows, macOS, Linux
  │ • Local Docker / Podman daemon integration
  │ • Real enterprise labs: LPIC-3 High Availability, Corosync, KVM, Samba AD
```

---

## 2. Milestone Details

### Tier V1: Core Web & PWA (Current State)
- **Scope**: Linux Essentials, LPIC-1 (Exams 101 & 102), and foundational LPIC-2/3 study tracks.
- **Infrastructure**: Static client-side bundle, 100% offline PWA, in-memory VirtualFS.
- **Target**: Universal browser access with zero install requirements.

### Tier V2: WebAssembly Emulation (Target)
- **Scope**: LPIC-2 intermediate administration.
- **Engine**: In-browser x86 PC emulation via WebAssembly executing real mini-distribution kernels.
- **Storage**: IndexedDB backing store for persistent virtual disk images.

### Tier V3: Desktop Application (Future Vision)
- **Scope**: Enterprise LPIC-3 certifications.
- **Architecture**: Ultra-lightweight Tauri desktop shell interacting with local container engines for disposable, sandboxed server configurations.
