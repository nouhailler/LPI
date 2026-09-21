# 06 — Learning Engine & Adaptive Pedagogy

> This document formalizes the adaptive learning loop of **LPI Certification Prep**, its diagnostic assessment mechanism, thematic path architecture, and pedagogical activity orchestration.

---

## 1. The Adaptive Learning Loop

The learning engine transforms passive cramming into an **autonomous feedback loop driven by the learner's actual telemetry**. Rather than imposing a linear reading of the curriculum, the engine guides students through an 8-stage continuous cycle:

```text
               ┌─────────────────────────────────────────┐
               │         1. BASELINE DIAGNOSTIC          │
               │   (Unbiased initial competence check)   │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │         2. KNOWLEDGE PROFILE            │
               │      (Mapping verified competencies)    │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │         3. WEAKNESS DETECTION           │
               │     (Pinpointing blind spots & traps)   │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          4. LEARNING PATH               │
               │     (Selecting the optimal milestone)   │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          5. TARGETED CONTENT            │
               │     (Cheat-sheets, concepts, traps)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          6. HANDS-ON PRACTICE           │
               │   (Virtual terminal, incident labs)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          7. SRS CONSOLIDATION           │
               │   (Spaced repetition Leitner/SM-2)      │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          8. REASSESSMENT & EXAM         │
               │     (Timed practice exam evaluation)    │
               └────────────────────┬────────────────────┘
                                    │
                                    └────── (Continuous cycle)
```

---

## 2. Bloom's Taxonomy in Linux Learning

To ensure deep operational mastery, content is systematically designed across Bloom's pedagogical levels:

1. **Remember**: Memorize command names, default config paths (`/etc/resolv.conf`), and standard ports (`22` for SSH). *Assessed via SRS Flashcards & Glossary.*
2. **Understand**: Explain the purpose of flags (`tar -czvf`), file formats (`/etc/fstab`), and signal numbers (`SIGTERM 15` vs `SIGKILL 9`). *Assessed via "Explain Differently" & cheat-sheets.*
3. **Apply**: Write correct commands to accomplish concrete tasks (set octal permissions `chmod 750`, compress archives, manage processes). *Assessed via Fill-in-the-Blank & Virtual Terminal.*
4. **Analyze**: Interpret log errors (`journalctl`, `dmesg`), diagnose missing swap space, and resolve broken dependencies. *Assessed via Troubleshooting & Incident Response.*
5. **Evaluate**: Compare competing tools (`ip` vs `ifconfig`, `find` vs `locate`, `systemd` vs `sysvinit`) and choose the best administrative strategy. *Assessed via Capstone Scenarios.*
