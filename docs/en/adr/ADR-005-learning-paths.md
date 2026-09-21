# ADR-005: Thematic Career Paths vs. Linear Syllabus Review

## Status
**Accepted**

## Context
The official Linux Professional Institute curriculum organizes certifications into numbered Topics and Sub-objectives (e.g., Topic 101, 102... through 110 for LPIC-1). While this taxonomy is ideal for verifying that an examinee covers 100% of the syllabus, it presents a notable pedagogical limitation: skills are fragmented and isolated from actual day-to-day sysadmin workflows.
For instance, network management spans modifying files in `/etc`, running diagnostic commands, configuring firewall rules, and setting permissions—concepts scattered across four distinct topics.

## Decision
1. **Preserve Official LPI Reference Mode**: Enable learners to review academically through each official topic of the curriculum (LPIC-1, LPIC-2, LPIC-3).
2. **Introduce Thematic Cross-Functional Career Paths (`ThematicPath`)**:
   - Group competencies by practical engineering roles:
     - *Linux System Administrator* (`admin`): Autonomous production server management.
     - *Shell Scripting & Automation* (`bash`): Operational scripts, loops, regex, crontab.
     - *Linux Networking & Core Services* (`networking`): DNS resolution, routing, SSH, network hardening.
   - Structure each milestone around concrete operational context:
     - The concept and production rationale (`whyItMatters`).
     - Common production traps (`prodTraps`).
     - Actionable self-assessment checklist.
     - An integrative Capstone Project.

## Consequences
### Positive:
- Infuses motivation and meaning by bridging exam theory with real-world administration practices.
- Serves learners seeking practical skill advancement without necessarily sitting for the formal certification immediately.

### Limitations:
- Requires maintaining parity between thematic milestones and subsequent LPI syllabus revisions.
