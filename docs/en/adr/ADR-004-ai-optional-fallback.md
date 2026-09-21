# ADR-004: Optional Generative AI & Deterministic Pedagogical Fallback

## Status
**Accepted**

## Context
Learning dense Linux concepts (e.g., `umask`, `systemd` process hierarchy, Sticky bit, octal permissions, DNS resolution) benefits greatly from multi-angle explanations: real-life metaphors, step-by-step breakdowns, or beginner-friendly analogies.
Integrating generative AI models (such as Google Gemini) allows dynamically tailored explanations. However, enforcing a hard network dependency on an AI API would directly violate the application's core **100% Offline PWA** foundation and block students studying without internet access or without API keys.

## Decision
1. **Generative AI is an Optional Enhancement**:
   No foundational curriculum path, practice exam, or lab workspace may depend on an AI API call to function or be validated.
2. **Comprehensive Local Pedagogical Corpus (Deterministic Fallback)**:
   A complete dictionary of multi-perspective explanations (`ExplainModal`, `prodTraps`, system analogies) is bundled locally in pure TypeScript.
3. **Transparent Degraded Behavior**:
   - If internet connectivity and API capabilities are available: the assistant provides customized dynamic reformulations.
   - If offline or without an API key: the application seamlessly and silently falls back to the local deterministic pre-authored corpus, without blocking error popups.

## Consequences
### Positive:
- Constant availability of educational value under all conditions (airplane mode, transit tunnels, server outages).
- Zero onboarding friction: learners are never forced to acquire API keys or register an account to study.
- Instant, sub-millisecond response time for 99% of study interactions.

### Limitations:
- Local deterministic explanations are confined to the curated educational catalog and do not provide infinite conversational breadth offline.
