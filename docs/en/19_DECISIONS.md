# 19 — Architectural Decision Summary & ADR Index

> This document synthesizes key architectural trade-offs, accepted constraints, and references the full collection of Architecture Decision Records (ADRs).

---

## 1. Summary of Foundational Choices

| Domain | Selected Architecture | Rejected Alternative | Primary Rationale |
| :--- | :--- | :--- | :--- |
| **Hosting Model** | 100% Offline-First PWA | Traditional Client-Server + Cloud DB | Uninterrupted study anywhere (commute, flights), zero latency, maximum privacy. |
| **Lab Execution** | In-Memory VirtualFS | Remote Cloud Docker Containers | Instant zero-cost execution without cloud infrastructure or network requirements. |
| **State Storage** | Browser `localStorage` with `lpi_*` contracts | Backend SQL / NoSQL Database | True user ownership of telemetry, effortless offline operation. |
| **AI Integration** | Optional enhancement with deterministic fallback | Mandatory AI backend API | Guarantees 100% functional availability offline without required API keys. |
| **Curriculum Flow** | Dual Mode: Official LPI + Thematic Paths | Strict linear topic numbering only | Bridges theoretical exam criteria with operational day-to-day sysadmin workflows. |

---

## 2. Index of Architecture Decision Records (ADRs)

- **[ADR-001 : PWA Architecture & Offline-First Strategy](./adr/ADR-001-pwa-offline-first.md)**
- **[ADR-002 : In-Memory VirtualFS Linux Lab Simulation](./adr/ADR-002-virtual-linux-labs.md)**
- **[ADR-003 : Local Persistence Contracts & Key Isolation](./adr/ADR-003-local-storage-contracts.md)**
- **[ADR-004 : Optional Generative AI & Deterministic Local Fallback](./adr/ADR-004-ai-optional-fallback.md)**
- **[ADR-005 : Thematic Career Paths vs. Linear Syllabus Review](./adr/ADR-005-learning-paths.md)**
- **[ADR-006 : Desktop Application Strategy & Native Containers (Horizon V3)](./adr/ADR-006-desktop-strategy.md)**
