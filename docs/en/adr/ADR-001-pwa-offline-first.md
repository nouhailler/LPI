# ADR-001: PWA Architecture & Offline-First Strategy

## Status
**Accepted**

## Context
Candidates preparing for LPI certification exams often study on the move (commute, train, flights) or in training environments without guaranteed, stable internet connectivity. Furthermore, requiring cloud account creation or dependency on a remote server creates friction for immediate adoption and exposes the application to network outages.

## Decision
1. Build the application following **PWA (Progressive Web App)** standards:
   - Service Worker handling proactive caching of all static assets (HTML, JavaScript, CSS, typography, exam data).
   - Web App Manifest configured for installation across all operating systems (Desktop & Mobile).
2. Embed the entire educational curriculum (LPIC-1/2/3 objectives, 2,000+ flashcards, exam questions, technical glossary) as TypeScript modules bundled into the static client build.
3. Keep the learner's progress state exclusively in client-side browser storage (`localStorage`), using strictly namespaced keys and defensive structures.

## Consequences
### Positive:
- **Complete Autonomy**: The application functions without any internet connection from its very first load.
- **Zero Latency**: No network requests required to navigate questions, generate SRS review sessions, or launch lab workspaces.
- **Maximum Privacy**: Scores, mistakes, and response times remain on the user's local device.
- **Minimal Hosting Costs**: Simple distribution via static file CDN.

### Limitations:
- Transparent multi-device synchronization is not automatic (requires manual JSON profile export/import).
- Storage capacity is bounded by browser domain quotas (more than sufficient for textual learning progress telemetry).
