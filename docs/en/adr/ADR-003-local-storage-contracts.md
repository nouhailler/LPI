# ADR-003: Local Persistence Contracts & Key Isolation

## Status
**Accepted**

## Context
The application runs 100% offline and preserves all learning state (Spaced Repetition SRS, Weakness Engine diagnostic reports, timed exam attempt histories, UI preferences, and update settings) in the browser's `localStorage`.
Without rigorous architecture, relying on `localStorage` can lead to key naming collisions with other apps on the same origin domain, silent corruptions across version updates, and catastrophic crashes in private browsing mode or when storage quotas are reached.

## Decision
1. **Unified Namespace**:
   All persistence keys must strictly begin with the `lpi_` prefix and be version-stamped (e.g., `lpi_srs_records_v1`, `lpi_weakness_engine_data_v2`).
2. **Defensive Encapsulation**:
   No component or service is permitted to call `localStorage` directly without a `try / catch` wrapper and a deterministic in-memory fallback.
3. **Automatic Startup Migration**:
   Legacy unversioned keys (e.g., `lpic1_mastered_cards`) are detected during initialization, migrated into the schema `lpi_srs_records_v1`, and cleanly pruned.
4. **Universal JSON Export/Import**:
   Allow learners to backup and restore their full profile as a single JSON file (`LPIProfileBackupV1`), facilitating effortless transfer between desktop and mobile without intermediary cloud servers.

## Consequences
### Positive:
- Total resilience against full disk quotas or restricted private browsing modes.
- Clear data schema versioning and backward compatibility.
- Complete independence from remote databases and external cloud accounts.

### Limitations:
- Total storage volume is bounded by browser domain quotas (typically 5MB - 10MB). The application's cumulative footprint remains well under 500KB even after months of intensive study.
