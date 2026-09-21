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

// Fallback or mapped document definitions
export const DOC_METADATA = [
  {
    id: '00_OVERVIEW',
    slug: '00-overview',
    title: "00 — Vue d'Ensemble & Cartographie",
    phase: 'Phase 1 — Existant & Modèles',
    category: 'core' as const,
    summary: "Vision générale, stack technique, cartographie des composants et principes directeurs.",
    path: '/docs/00_OVERVIEW.md',
  },
  {
    id: '01_PRODUCT',
    slug: '01-product',
    title: '01 — Vision Produit & Périmètre',
    phase: 'Phase 1 — Existant & Modèles',
    category: 'core' as const,
    summary: "Objectifs pédagogiques LPI, personas cibles, formats d'évaluation et critères de succès.",
    path: '/docs/01_PRODUCT.md',
  },
  {
    id: '02_ARCHITECTURE',
    slug: '02-architecture',
    title: '02 — Architecture Globale & Couches',
    phase: 'Phase 1 — Existant & Modèles',
    category: 'core' as const,
    summary: "Architecture multi-couches, flux de données unidirectionnels et modèles d'isolation.",
    path: '/docs/02_ARCHITECTURE.md',
  },
  {
    id: '04_DATA_MODEL',
    slug: '04-data-model',
    title: '04 — Modèle de Données & Relations',
    phase: 'Phase 1 — Existant & Modèles',
    category: 'core' as const,
    summary: "Schéma relationnel TypeScript, MCD unifié, cycles de vie et typage des entités.",
    path: '/docs/04_DATA_MODEL.md',
  },
  {
    id: '06_LEARNING_ENGINE',
    slug: '06-learning-engine',
    title: '06 — Moteur d\'Apprentissage & Pédagogie',
    phase: 'Phase 2 — Moteurs Métiers',
    category: 'engine' as const,
    summary: "Boucle adaptative d'apprentissage, taxonomie de Bloom et parcours transverses.",
    path: '/docs/06_LEARNING_ENGINE.md',
  },
  {
    id: '07_SRS_ENGINE',
    slug: '07-srs-engine',
    title: '07 — Moteur de Répétition Espacée (SRS)',
    phase: 'Phase 2 — Moteurs Métiers',
    category: 'engine' as const,
    summary: "Algorithme SRS à 7 paliers, calcul des échéances, gestion des lapses et révision active.",
    path: '/docs/07_SRS_ENGINE.md',
  },
  {
    id: '08_WEAKNESS_ENGINE',
    slug: '08-weakness-engine',
    title: '08 — Moteur de Diagnostic des Faiblesses',
    phase: 'Phase 2 — Moteurs Métiers',
    category: 'engine' as const,
    summary: "Weakness Engine multi-signaux, détection des faux positifs et génération de sessions ciblées.",
    path: '/docs/08_WEAKNESS_ENGINE.md',
  },
  {
    id: '09_LABS_ENGINE',
    slug: '09-labs-engine',
    title: '09 — Terminal & Labs Virtuels (VirtualFS)',
    phase: 'Phase 2 — Moteurs Métiers',
    category: 'engine' as const,
    summary: "Terminal virtuel Bash 5.2, arborescence POSIX/FHS in-memory et validation microscopique d'état.",
    path: '/docs/09_LABS_ENGINE.md',
  },
  {
    id: '10_EXAM_ENGINE',
    slug: '10-exam-engine',
    title: '10 — Moteur d\'Examens & Notation 200–800',
    phase: 'Phase 2 — Moteurs Métiers',
    category: 'engine' as const,
    summary: "Échelle officielle LPI 200–800, pondérations, tolérance de syntaxe et analytics comportementales.",
    path: '/docs/10_EXAM_ENGINE.md',
  },
  {
    id: '12_I18N',
    slug: '12-i18n',
    title: '12 — Internationalisation & Bilinguisme',
    phase: 'Phase 3 — Infrastructure & PWA',
    category: 'infra' as const,
    summary: "Architecture bilingue FR/EN, typage strict des dictionnaires et détection navigateur.",
    path: '/docs/12_I18N.md',
  },
  {
    id: '13_PWA_OFFLINE',
    slug: '13-pwa-offline',
    title: '13 — Architecture PWA & Stratégie Offline-First',
    phase: 'Phase 3 — Infrastructure & PWA',
    category: 'infra' as const,
    summary: "Progressive Web App, Service Worker, cache hybride et mises à jour transparentes.",
    path: '/docs/13_PWA_OFFLINE.md',
  },
  {
    id: '15_STORAGE',
    slug: '15-storage',
    title: '15 — Persistance Locale & Contrats de Stockage',
    phase: 'Phase 3 — Infrastructure & PWA',
    category: 'infra' as const,
    summary: "Isolation des clés lpi_*, encapsulation défensive, tolérance aux pannes et format JSON backup.",
    path: '/docs/15_STORAGE.md',
  },
  {
    id: '16_TESTING',
    slug: '16-testing',
    title: '16 — Stratégie de Test & Assurance Qualité',
    phase: 'Phase 3 — Infrastructure & PWA',
    category: 'infra' as const,
    summary: "Pyramide de tests en 4 lignes, typage statique strict, tests unitaires et validation des labs.",
    path: '/docs/16_TESTING.md',
  },
  {
    id: '18_ROADMAP',
    slug: '18-roadmap',
    title: '18 — Feuille de Route (CURRENT / TARGET / ROADMAP)',
    phase: 'Phase 4 — Évolution & Décisions',
    category: 'evolution' as const,
    summary: "Trajectoire stratégique V1 (PWA) -> V2 (Wasm/IndexedDB) -> V3 (Desktop Tauri/Conteneurs natifs).",
    path: '/docs/18_ROADMAP.md',
  },
  {
    id: '19_DECISIONS',
    slug: '19-decisions',
    title: '19 — Synthèse des Décisions d\'Architecture',
    phase: 'Phase 4 — Évolution & Décisions',
    category: 'evolution' as const,
    summary: "Synthèse des choix structurants, compromis acceptés et registre des ADRs.",
    path: '/docs/19_DECISIONS.md',
  },
  // Architecture Decision Records (ADRs)
  {
    id: 'ADR-001',
    slug: 'adr-001-pwa-offline-first',
    title: 'ADR-001 : PWA & Stratégie 100% Hors-Ligne',
    phase: 'Architecture Decision Records (ADRs)',
    category: 'adr' as const,
    summary: "Choix d'une Progressive Web App offline-first plutôt qu'un backend cloud obligatoire.",
    path: '/docs/adr/ADR-001-pwa-offline-first.md',
  },
  {
    id: 'ADR-002',
    slug: 'adr-002-virtual-linux-labs',
    title: 'ADR-002 : Virtual Linux Labs in-Memory',
    phase: 'Architecture Decision Records (ADRs)',
    category: 'adr' as const,
    summary: "Simulation in-memory du filesystem POSIX plutôt qu'une ferme de conteneurs Docker distants.",
    path: '/docs/adr/ADR-002-virtual-linux-labs.md',
  },
  {
    id: 'ADR-003',
    slug: 'adr-003-local-storage-contracts',
    title: 'ADR-003 : Contrats de Persistance Locale',
    phase: 'Architecture Decision Records (ADRs)',
    category: 'adr' as const,
    summary: "Namespace lpi_*, versions de clés, encapsulation try/catch et export/import JSON unifié.",
    path: '/docs/adr/ADR-003-local-storage-contracts.md',
  },
  {
    id: 'ADR-004',
    slug: 'adr-004-ai-optional-fallback',
    title: 'ADR-004 : IA Optionnelle & Repli Déterministe',
    phase: 'Architecture Decision Records (ADRs)',
    category: 'adr' as const,
    summary: "Corpus pédagogique local complet avec enrichissement IA optionnel non-bloquant.",
    path: '/docs/adr/ADR-004-ai-optional-fallback.md',
  },
  {
    id: 'ADR-005',
    slug: 'adr-005-learning-paths',
    title: 'ADR-005 : Parcours Thématiques Métiers',
    phase: 'Architecture Decision Records (ADRs)',
    category: 'adr' as const,
    summary: "Double approche pédagogique : référentiel officiel LPI et parcours thématiques orientés production.",
    path: '/docs/adr/ADR-005-learning-paths.md',
  },
  {
    id: 'ADR-006',
    slug: 'adr-006-desktop-strategy',
    title: 'ADR-006 : Stratégie Desktop & Conteneurs Natifs',
    phase: 'Architecture Decision Records (ADRs)',
    category: 'adr' as const,
    summary: "Wrapper Desktop Tauri/Rust avec conteneurs Podman/Docker locaux pour l'horizon LPIC-2/3 (V3).",
    path: '/docs/adr/ADR-006-desktop-strategy.md',
  },
];

export function getAllDocs(): DocItem[] {
  return DOC_METADATA.map((meta) => {
    const fileModule = rawDocs[meta.path];
    const rawContent = (typeof fileModule === 'string' ? fileModule : (fileModule as any)?.default) || '';
    return {
      id: meta.id,
      slug: meta.slug,
      title: meta.title,
      phase: meta.phase,
      category: meta.category,
      summary: meta.summary,
      filename: meta.path.split('/').pop() || '',
      rawContent: rawContent || `# ${meta.title}\n\n${meta.summary}`,
    };
  });
}
