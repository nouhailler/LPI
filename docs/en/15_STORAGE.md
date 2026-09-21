# 15 — Local Storage Contracts & Persistence Strategy

> This document formalizes local storage contracts, `lpi_*` key namespacing, corruption resilience, JSON backup schemas, and future migration paths for **LPI Certification Prep**.

---

## 1. Principles & Storage Governance

The platform relies on browser `localStorage` to fulfill its **100% offline-first** commitment. This requires rigorous key governance:

### Golden Rules:
1. **Mandatory Namespacing (`lpi_*`)**: No key may pollute the global origin namespace without an `lpi_` prefix.
2. **Defensive Encapsulation**: Every `localStorage.getItem()` and `localStorage.setItem()` call is wrapped in a defensive `try / catch` block to handle iOS Private Browsing and `QuotaExceededError`.
3. **Integrated Schema Versioning**: Keys embed schema versions (e.g., `_v1`, `_v2`) to enable automated data migration upon initialization.

---

## 2. Key Registry

| Key | Purpose | Format | Average Size |
| :--- | :--- | :---: | :---: |
| `lpi_srs_records_v1` | SRS state machine (due cards, levels 0-6, intervals, lapses) | JSON object | 15–45 KB |
| `lpi_weakness_engine_data_v2` | Weakness metrics across domains & critical alerts | JSON object | 5–12 KB |
| `lpi_prep_language` | UI language selection (`'fr'` or `'en'`) | String | 2 bytes |
| `lpi_exam_history` | Timed practice exam attempt histories | JSON array | 20–80 KB |
| `lpic_mastered_objectives` | Sub-objectives verified as mastered | JSON array | 2–5 KB |
| `lpi_essentials_status` | Status for Linux Essentials (passed / in-progress) | String | 10 bytes |
| `lpi_prep_update_settings` | Update check intervals and preferences | JSON object | 120 bytes |

---

## 3. Universal JSON Profile Backup Schema

To allow learners to transfer their complete study history across devices (e.g., desktop to mobile) without intermediary servers:

```typescript
export interface LPIProfileBackupV1 {
  version: '1.0';
  exportedAt: string;        // ISO 8601
  appVersion: string;
  userStats: UserStats;
  srsRecords: Record<string, SRSRecord>;
  examHistory: ExamSessionResult[];
  weaknessReport: WeaknessReport;
  masteredObjectives: string[];
}
```
