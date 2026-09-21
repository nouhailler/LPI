# 16 — Testing Strategy & Quality Assurance

> This document details the multi-layer test pyramid, quality assurance standards, and state validation patterns of **LPI Certification Prep**.

---

## 1. The 4-Layer Testing Pyramid

```text
               ┌───────────────────────────────┐
               │    4. END-TO-END VALIDATION   │  Automated Exam Journeys
               ├───────────────────────────────┤
               │    3. LAB STATE VERIFICATION  │  VirtualFS Inode Checks
               ├───────────────────────────────┤
               │    2. COMPONENT UNIT TESTS    │  React 18 / Hooks / UI
               ├───────────────────────────────┤
               │    1. STATIC TYPE SAFETY      │  TypeScript Strict Mode
               └───────────────────────────────┘
```

---

## 2. Testing Layers Breakdown

1. **Static Type Safety**: TypeScript in strict mode (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`) catches interface mismatches, missing properties, and invalid types during compilation.
2. **Component & Unit Testing**: Validates isolated logic:
   - SRS algorithm interval transitions and ease factor modifications.
   - Syntax tolerance parser handling equivalent flag groupings (`-la` vs `-l -a`).
   - 200–800 scaled scoring algorithm and sub-objective weight computations.
3. **VirtualFS Micro-State Verification**: Automated testing of virtual terminal builtins against POSIX expectations:
   - Path resolution (`..`, `.`, absolute vs relative).
   - Inode permissions, sticky bits, and owner reassignment.
   - Pipe streaming and stdout/stderr redirection.
4. **End-to-End Simulation Testing**: Validates full candidate journeys:
   - Starting a timed practice exam -> answering questions -> auto-submitting on timer expiration -> computing scaled scores.
