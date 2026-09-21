// Registry of technical documentation and ADRs for in-app viewing

export interface DocItem {
  id: string;
  slug: string;
  title: string;
  phase: string;
  category: 'core' | 'engine' | 'infra' | 'evolution' | 'adr';
  summary: string;
  filename: string;
  rawContent: string;
}

// Import all markdown files in /docs using Vite's glob import
const rawDocs = import.meta.glob<{ default: string }>('/docs/**/*.md', {
  query: '?raw',
  eager: true,
});

export interface DocMetaDefinition {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  phaseFr: string;
  phaseEn: string;
  category: 'core' | 'engine' | 'infra' | 'evolution' | 'adr';
  summaryFr: string;
  summaryEn: string;
  pathFr: string;
  pathEn: string;
}

// Full bilingual metadata for all documentation modules
export const DOC_DEFINITIONS: DocMetaDefinition[] = [
  {
    id: '00_FUNCTIONAL_GUIDE',
    slug: '00-functional-guide',
    titleFr: "00 — Guide Fonctionnel des Écrans (Écran par Écran)",
    titleEn: "00 — Functional Guide to Screens & User Journeys",
    phaseFr: 'Phase 1 — Existant & Modèles',
    phaseEn: 'Phase 1 — Core Architecture & Models',
    category: 'core',
    summaryFr: "Documentation fonctionnelle complète écran par écran : rôle, fonctionnalités clés, interactions et parcours utilisateur.",
    summaryEn: "Complete screen-by-screen functional specification: primary roles, key capabilities, user interactions, and learning pathways.",
    pathFr: '/docs/00_FUNCTIONAL_GUIDE.md',
    pathEn: '/docs/en/00_FUNCTIONAL_GUIDE.md',
  },
  {
    id: '00_OVERVIEW',
    slug: '00-overview',
    titleFr: "00b — Vue d'Ensemble & Cartographie Technique",
    titleEn: "00b — System Overview & Architecture Map",
    phaseFr: 'Phase 1 — Existant & Modèles',
    phaseEn: 'Phase 1 — Core Architecture & Models',
    category: 'core',
    summaryFr: "Vision générale, stack technique, cartographie des composants et principes directeurs.",
    summaryEn: "High-level vision, technology stack, component mapping, and core architectural principles.",
    pathFr: '/docs/00_OVERVIEW.md',
    pathEn: '/docs/en/00_OVERVIEW.md',
  },
  {
    id: '01_PRODUCT',
    slug: '01-product',
    titleFr: '01 — Vision Produit & Périmètre',
    titleEn: '01 — Product Vision & Scope',
    phaseFr: 'Phase 1 — Existant & Modèles',
    phaseEn: 'Phase 1 — Core Architecture & Models',
    category: 'core',
    summaryFr: "Objectifs pédagogiques LPI, personas cibles, formats d'évaluation et critères de succès.",
    summaryEn: "LPI learning goals, user personas, evaluation formats, and feature maturity matrix.",
    pathFr: '/docs/01_PRODUCT.md',
    pathEn: '/docs/en/01_PRODUCT.md',
  },
  {
    id: '02_ARCHITECTURE',
    slug: '02-architecture',
    titleFr: '02 — Architecture Globale & Couches',
    titleEn: '02 — Global Architecture & Layers',
    phaseFr: 'Phase 1 — Existant & Modèles',
    phaseEn: 'Phase 1 — Core Architecture & Models',
    category: 'core',
    summaryFr: "Architecture multi-couches, flux de données unidirectionnels et modèles d'isolation.",
    summaryEn: "Multi-layer architecture, unidirectional data flows, engine decoupling, and isolation models.",
    pathFr: '/docs/02_ARCHITECTURE.md',
    pathEn: '/docs/en/02_ARCHITECTURE.md',
  },
  {
    id: '04_DATA_MODEL',
    slug: '04-data-model',
    titleFr: '04 — Modèle de Données & Relations',
    titleEn: '04 — Conceptual Data Model & Relations',
    phaseFr: 'Phase 1 — Existant & Modèles',
    phaseEn: 'Phase 1 — Core Architecture & Models',
    category: 'core',
    summaryFr: "Schéma relationnel TypeScript, MCD unifié, cycles de vie et typage des entités.",
    summaryEn: "TypeScript relational schema, unified ERD, entity lifecycles, and strict domain typings.",
    pathFr: '/docs/04_DATA_MODEL.md',
    pathEn: '/docs/en/04_DATA_MODEL.md',
  },
  {
    id: '06_LEARNING_ENGINE',
    slug: '06-learning-engine',
    titleFr: "06 — Moteur d'Apprentissage & Pédagogie",
    titleEn: '06 — Learning Engine & Adaptive Pedagogy',
    phaseFr: 'Phase 2 — Moteurs Métiers',
    phaseEn: 'Phase 2 — Domain Engines',
    category: 'engine',
    summaryFr: "Boucle adaptative d'apprentissage, taxonomie de Bloom et parcours transverses.",
    summaryEn: "Adaptive 8-step learning feedback loop, Bloom's taxonomy, and thematic career paths.",
    pathFr: '/docs/06_LEARNING_ENGINE.md',
    pathEn: '/docs/en/06_LEARNING_ENGINE.md',
  },
  {
    id: '07_SRS_ENGINE',
    slug: '07-srs-engine',
    titleFr: '07 — Moteur de Répétition Espacée (SRS)',
    titleEn: '07 — Spaced Repetition Engine (SRS)',
    phaseFr: 'Phase 2 — Moteurs Métiers',
    phaseEn: 'Phase 2 — Domain Engines',
    category: 'engine',
    summaryFr: "Algorithme SRS à 7 paliers, calcul des échéances, gestion des lapses et révision active.",
    summaryEn: "7-level deterministic SRS ladder (SM-2/Leitner), due queues, lapse recovery, and retention.",
    pathFr: '/docs/07_SRS_ENGINE.md',
    pathEn: '/docs/en/07_SRS_ENGINE.md',
  },
  {
    id: '08_WEAKNESS_ENGINE',
    slug: '08-weakness-engine',
    titleFr: '08 — Moteur de Diagnostic des Faiblesses',
    titleEn: '08 — Weakness Detection Engine',
    phaseFr: 'Phase 2 — Moteurs Métiers',
    phaseEn: 'Phase 2 — Domain Engines',
    category: 'engine',
    summaryFr: "Weakness Engine multi-signaux, détection des faux positifs et génération de sessions ciblées.",
    summaryEn: "Multi-signal weakness detection, Objective Vulnerability Index, and targeted drill generation.",
    pathFr: '/docs/08_WEAKNESS_ENGINE.md',
    pathEn: '/docs/en/08_WEAKNESS_ENGINE.md',
  },
  {
    id: '09_LABS_ENGINE',
    slug: '09-labs-engine',
    titleFr: '09 — Terminal & Labs Virtuels (VirtualFS)',
    titleEn: '09 — Virtual Terminal & In-Memory Labs (VirtualFS)',
    phaseFr: 'Phase 2 — Moteurs Métiers',
    phaseEn: 'Phase 2 — Domain Engines',
    category: 'engine',
    summaryFr: "Terminal virtuel Bash 5.2, arborescence POSIX/FHS in-memory et validation microscopique d'état.",
    summaryEn: "In-memory Bash 5.2 terminal simulator, POSIX/FHS filesystem tree, and microscopic state validators.",
    pathFr: '/docs/09_LABS_ENGINE.md',
    pathEn: '/docs/en/09_LABS_ENGINE.md',
  },
  {
    id: '10_EXAM_ENGINE',
    slug: '10-exam-engine',
    titleFr: "10 — Moteur d'Examens & Notation 200–800",
    titleEn: '10 — Practice Exam Engine & Scaled Scoring (200–800)',
    phaseFr: 'Phase 2 — Moteurs Métiers',
    phaseEn: 'Phase 2 — Domain Engines',
    category: 'engine',
    summaryFr: "Échelle officielle LPI 200–800, pondérations, tolérance de syntaxe et analytics comportementales.",
    summaryEn: "Official LPI 200–800 scaled scoring scale, topic weight distributions, and syntax tolerance.",
    pathFr: '/docs/10_EXAM_ENGINE.md',
    pathEn: '/docs/en/10_EXAM_ENGINE.md',
  },
  {
    id: '12_I18N',
    slug: '12-i18n',
    titleFr: '12 — Internationalisation & Bilinguisme',
    titleEn: '12 — Internationalization & Bilingualism',
    phaseFr: 'Phase 3 — Infrastructure & PWA',
    phaseEn: 'Phase 3 — Infrastructure & Offline',
    category: 'infra',
    summaryFr: "Architecture bilingue FR/EN, typage strict des dictionnaires et détection navigateur.",
    summaryEn: "Runtime FR/EN bilingual architecture, type-safe dictionaries, and browser locale detection.",
    pathFr: '/docs/12_I18N.md',
    pathEn: '/docs/en/12_I18N.md',
  },
  {
    id: '13_PWA_OFFLINE',
    slug: '13-pwa-offline',
    titleFr: '13 — Architecture PWA & Stratégie Offline-First',
    titleEn: '13 — PWA Architecture & Offline-First Strategy',
    phaseFr: 'Phase 3 — Infrastructure & PWA',
    phaseEn: 'Phase 3 — Infrastructure & Offline',
    category: 'infra',
    summaryFr: "Progressive Web App, Service Worker, cache hybride et mises à jour transparentes.",
    summaryEn: "Progressive Web App, Service Worker, two-tier cache strategy, and background update polling.",
    pathFr: '/docs/13_PWA_OFFLINE.md',
    pathEn: '/docs/en/13_PWA_OFFLINE.md',
  },
  {
    id: '15_STORAGE',
    slug: '15-storage',
    titleFr: '15 — Persistance Locale & Contrats de Stockage',
    titleEn: '15 — Local Storage Contracts & Persistence',
    phaseFr: 'Phase 3 — Infrastructure & PWA',
    phaseEn: 'Phase 3 — Infrastructure & Offline',
    category: 'infra',
    summaryFr: "Isolation des clés lpi_*, encapsulation défensive, tolérance aux pannes et format JSON backup.",
    summaryEn: "Key namespacing under lpi_*, defensive encapsulation, schema versioning, and JSON backups.",
    pathFr: '/docs/15_STORAGE.md',
    pathEn: '/docs/en/15_STORAGE.md',
  },
  {
    id: '16_TESTING',
    slug: '16-testing',
    titleFr: '16 — Stratégie de Test & Assurance Qualité',
    titleEn: '16 — Testing Strategy & Quality Assurance',
    phaseFr: 'Phase 3 — Infrastructure & PWA',
    phaseEn: 'Phase 3 — Infrastructure & Offline',
    category: 'infra',
    summaryFr: "Pyramide de tests en 4 lignes, typage statique strict, tests unitaires et validation des labs.",
    summaryEn: "4-tier testing pyramid, strict TypeScript typing, unit tests, and VirtualFS state checks.",
    pathFr: '/docs/16_TESTING.md',
    pathEn: '/docs/en/16_TESTING.md',
  },
  {
    id: '18_ROADMAP',
    slug: '18-roadmap',
    titleFr: '18 — Feuille de Route (CURRENT / TARGET / ROADMAP)',
    titleEn: '18 — Strategic Roadmap (CURRENT / TARGET / FUTURE)',
    phaseFr: 'Phase 4 — Évolution & Décisions',
    phaseEn: 'Phase 4 — Evolution & Architecture Records',
    category: 'evolution',
    summaryFr: "Trajectoire stratégique V1 (PWA) -> V2 (Wasm/IndexedDB) -> V3 (Desktop Tauri/Conteneurs natifs).",
    summaryEn: "Three-tier evolution: V1 (PWA) -> V2 (WebAssembly Linux Engine) -> V3 (Desktop Tauri & Podman).",
    pathFr: '/docs/18_ROADMAP.md',
    pathEn: '/docs/en/18_ROADMAP.md',
  },
  {
    id: '19_DECISIONS',
    slug: '19-decisions',
    titleFr: "19 — Synthèse des Décisions d'Architecture",
    titleEn: '19 — Architectural Decision Summary & ADR Index',
    phaseFr: 'Phase 4 — Évolution & Décisions',
    phaseEn: 'Phase 4 — Evolution & Architecture Records',
    category: 'evolution',
    summaryFr: "Synthèse des choix structurants, compromis acceptés et registre des ADRs.",
    summaryEn: "Synthesis of architectural trade-offs, accepted constraints, and complete ADR registry index.",
    pathFr: '/docs/19_DECISIONS.md',
    pathEn: '/docs/en/19_DECISIONS.md',
  },
  // Architecture Decision Records (ADRs)
  {
    id: 'ADR-001',
    slug: 'adr-001-pwa-offline-first',
    titleFr: 'ADR-001 : PWA & Stratégie 100% Hors-Ligne',
    titleEn: 'ADR-001: PWA Architecture & 100% Offline-First Strategy',
    phaseFr: 'Architecture Decision Records (ADRs)',
    phaseEn: 'Architecture Decision Records (ADRs)',
    category: 'adr',
    summaryFr: "Choix d'une Progressive Web App offline-first plutôt qu'un backend cloud obligatoire.",
    summaryEn: "Choice of a 100% offline-first Progressive Web App over mandatory cloud backends.",
    pathFr: '/docs/adr/ADR-001-pwa-offline-first.md',
    pathEn: '/docs/en/adr/ADR-001-pwa-offline-first.md',
  },
  {
    id: 'ADR-002',
    slug: 'adr-002-virtual-linux-labs',
    titleFr: 'ADR-002 : Virtual Linux Labs in-Memory',
    titleEn: 'ADR-002: In-Memory Virtual Linux Labs (VirtualFS)',
    phaseFr: 'Architecture Decision Records (ADRs)',
    phaseEn: 'Architecture Decision Records (ADRs)',
    category: 'adr',
    summaryFr: "Simulation in-memory du filesystem POSIX plutôt qu'une ferme de conteneurs Docker distants.",
    summaryEn: "In-memory POSIX filesystem simulation over remote cloud Docker container farms.",
    pathFr: '/docs/adr/ADR-002-virtual-linux-labs.md',
    pathEn: '/docs/en/adr/ADR-002-virtual-linux-labs.md',
  },
  {
    id: 'ADR-003',
    slug: 'adr-003-local-storage-contracts',
    titleFr: 'ADR-003 : Contrats de Persistance Locale',
    titleEn: 'ADR-003: Local Persistence Contracts & Key Isolation',
    phaseFr: 'Architecture Decision Records (ADRs)',
    phaseEn: 'Architecture Decision Records (ADRs)',
    category: 'adr',
    summaryFr: "Namespace lpi_*, versions de clés, encapsulation try/catch et export/import JSON unifié.",
    summaryEn: "Namespace lpi_*, versioned keys, defensive try/catch wrapping, and universal JSON export/import.",
    pathFr: '/docs/adr/ADR-003-local-storage-contracts.md',
    pathEn: '/docs/en/adr/ADR-003-local-storage-contracts.md',
  },
  {
    id: 'ADR-004',
    slug: 'adr-004-ai-optional-fallback',
    titleFr: 'ADR-004 : IA Optionnelle & Repli Déterministe',
    titleEn: 'ADR-004: Optional Generative AI & Deterministic Local Fallback',
    phaseFr: 'Architecture Decision Records (ADRs)',
    phaseEn: 'Architecture Decision Records (ADRs)',
    category: 'adr',
    summaryFr: "Corpus pédagogique local complet avec enrichissement IA optionnel non-bloquant.",
    summaryEn: "Comprehensive local pedagogical corpus with optional non-blocking AI enrichment.",
    pathFr: '/docs/adr/ADR-004-ai-optional-fallback.md',
    pathEn: '/docs/en/adr/ADR-004-ai-optional-fallback.md',
  },
  {
    id: 'ADR-005',
    slug: 'adr-005-learning-paths',
    titleFr: 'ADR-005 : Parcours Thématiques Métiers',
    titleEn: 'ADR-005: Thematic Career Paths vs. Linear Syllabus Review',
    phaseFr: 'Architecture Decision Records (ADRs)',
    phaseEn: 'Architecture Decision Records (ADRs)',
    category: 'adr',
    summaryFr: "Double approche pédagogique : référentiel officiel LPI et parcours thématiques orientés production.",
    summaryEn: "Dual pedagogical approach: academic official LPI curriculum and practical sysadmin tracks.",
    pathFr: '/docs/adr/ADR-005-learning-paths.md',
    pathEn: '/docs/en/adr/ADR-005-learning-paths.md',
  },
  {
    id: 'ADR-006',
    slug: 'adr-006-desktop-strategy',
    titleFr: 'ADR-006 : Stratégie Desktop & Conteneurs Natifs',
    titleEn: 'ADR-006: Desktop Strategy & Native Containers (Horizon V3)',
    phaseFr: 'Architecture Decision Records (ADRs)',
    phaseEn: 'Architecture Decision Records (ADRs)',
    category: 'adr',
    summaryFr: "Wrapper Desktop Tauri/Rust avec conteneurs Podman/Docker locaux pour l'horizon LPIC-2/3 (V3).",
    summaryEn: "Lightweight Tauri/Rust desktop wrapper with local Docker/Podman engine for LPIC-2/3 (V3).",
    pathFr: '/docs/adr/ADR-006-desktop-strategy.md',
    pathEn: '/docs/en/adr/ADR-006-desktop-strategy.md',
  },
];

// Backwards-compatible DOC_METADATA mapping
export const DOC_METADATA = DOC_DEFINITIONS.map(def => ({
  id: def.id,
  slug: def.slug,
  title: def.titleFr,
  phase: def.phaseFr,
  category: def.category,
  summary: def.summaryFr,
  path: def.pathFr,
}));

export function getAllDocs(lang: 'fr' | 'en' = 'fr'): DocItem[] {
  const isEn = lang === 'en';
  return DOC_DEFINITIONS.map((meta) => {
    const targetPath = isEn ? meta.pathEn : meta.pathFr;
    const fallbackPath = isEn ? meta.pathFr : meta.pathEn;
    
    // Attempt primary path, then fallback
    const fileModule = rawDocs[targetPath] || rawDocs[fallbackPath];
    const rawContent = (typeof fileModule === 'string' ? fileModule : (fileModule as any)?.default) || '';
    
    const title = isEn ? meta.titleEn : meta.titleFr;
    const phase = isEn ? meta.phaseEn : meta.phaseFr;
    const summary = isEn ? meta.summaryEn : meta.summaryFr;
    
    return {
      id: meta.id,
      slug: meta.slug,
      title,
      phase,
      category: meta.category,
      summary,
      filename: targetPath.split('/').pop() || '',
      rawContent: rawContent || `# ${title}\n\n${summary}`,
    };
  });
}
