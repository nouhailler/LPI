# 02 — Architecture Technique & Organisation du Code

> Ce document décrit la structure du code source, les couches architecturales, les règles de dépendance et la gestion d'état de l'application.

---

## 1. Arborescence du Code Source (`/src`)

Le projet est structuré selon des modules clairement découplés pour isoler les données statiques, les moteurs de calcul, les services et les composants d'interface utilisateur :

```text
src/
│
├── App.tsx                          # Composant racine & orchestrateur principal d'état
├── main.tsx                         # Point d'entrée React 18 & montage DOM
├── index.css                        # Styles globaux & configuration Tailwind CSS
├── types.ts                         # Définitions TypeScript globales du domaine LPI
│
├── components/                      # Couche Présentation (Interface Utilisateur)
│   ├── Header.tsx                   # En-tête de l'application (score, streaks, mode sombre)
│   ├── Navigation.tsx               # Barre de navigation principale
│   ├── HamburgerMenu.tsx            # Tiroir latéral de navigation catégorisé
│   ├── DashboardView.tsx            # Vue d'accueil (KPIs, reprise rapide, suggestions)
│   ├── LearningObjectivesView.tsx   # Explorateur d'objectifs LPI officiels
│   ├── ThematicLearningPathsView.tsx# Parcours d'apprentissage thématiques
│   ├── PracticeExamView.tsx         # Simulateur d'examen chronométré complet
│   ├── FlashcardsView.tsx           # Module de révision par répétition espacée (SRS)
│   ├── GlossaryView.tsx             # Glossaire et index des commandes
│   ├── CertificationPathView.tsx    # Guide de carrière et roadmap LPI
│   │
│   ├── practice/                    # Sous-composants d'examen et d'évaluation
│   ├── training/                    # Ateliers pratiques hands-on
│   │   ├── TrainingHubView.tsx      # Hub principal d'aiguillage des ateliers
│   │   ├── VirtualTerminalModule.tsx# Simulateur de terminal Linux avec VirtualFS
│   │   ├── IncidentResponseModule.tsx# Simulation d'astreinte et résolution d'incidents
│   │   ├── FillInBlankModule.tsx    # Saisie libre de commandes
│   │   ├── TroubleshootingModule.tsx# Détection et analyse de pannes
│   │   ├── TimelineSequencingModule.tsx# Ordonnancement chronologique
│   │   └── MatchingModule.tsx       # Jeux d'association de concepts
│   ├── weakness/                    # Composants d'analyse des faiblesses
│   ├── knowledgeGraph/              # Visualisation en graphe des dépendances de concepts
│   └── learningMap/                 # Carte interactive de progression
│
├── data/                            # Données Pédagogiques Statiques (100% Offline)
│   ├── lpicObjectivesData.ts        # Objectifs LPIC-1 (101 & 102)
│   ├── lpic2ObjectivesData.ts       # Objectifs LPIC-2 (201 & 202)
│   ├── lpic3ObjectivesData.ts       # Objectifs LPIC-3 (300, 303, 305, 306)
│   ├── practiceExamsData.ts         # Banque de questions d'examen
│   ├── topic101Flashcards.ts ...    # Decks de flashcards modulaires par topic
│   ├── incidentResponseData.ts      # Scénarios d'incidents système
│   ├── diagnosticExamData.ts        # Banque de questions de l'examen diagnostique
│   ├── glossaryData.ts              # Dictionnaire des termes et commandes Linux
│   └── thematicLearningPathsData.ts # Structure des parcours transverses
│
├── services/                        # Services Métiers Autonomes & Engines
│   ├── virtualFs/                   # Moteur de Terminal Virtuel & Système de Fichiers
│   │   ├── VirtualFs.ts             # Arborescence en mémoire, inodes, permissions, FHS
│   │   ├── ShellInterpreter.ts      # Interpréteur Bash (lexing, redirections, pipes, builtins)
│   │   ├── initialFs.ts             # État initial standard (/home, /etc, /var/log, /tmp)
│   │   ├── labScenarios.ts          # Définition des scénarios de lab et validateurs d'état
│   │   └── types.ts                 # Types du VFS (VfsNode, ShellResult, etc.)
│   └── explainDifferentlyService.ts # Service d'explication pédagogique adaptative
│
├── utils/                           # Fonctions Pures & Moteurs Algorithmiques
│   ├── srsEngine.ts                 # Algorithme de répétition espacée (intervalles, lapses, dues)
│   ├── weaknessEngine.ts            # Calcul de la matrice de compétences et des faiblesses
│   ├── examAnalytics.ts             # Consolidation des statistiques d'examen et readiness
│   ├── commandTolerance.ts          # Normalisation et comparaison syntaxique de commandes
│   └── updateService.ts             # Détection des mises à jour PWA et gestion du cache
│
└── i18n/                            # Internationalisation
    ├── LanguageContext.tsx          # Contexte React pour le bilinguisme FR / EN
    └── translations.ts              # Dictionnaires de traduction
```

---

## 2. Modèle en Couches (Architecture Logique)

Le principe fondamental de l'architecture est une séparation stricte des responsabilités. Le flux d'information doit respecter le sens descendant :

```text
┌─────────────────────────────────────────────────────────────┐
│                       COUCHE UI                             │
│       Composants React, Vues, Modales, Formulaires          │
└──────────────────────────────┬──────────────────────────────┘
                               │ appelle
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   COUCHE DOMAIN LOGIC                       │
│     Règles de validation, calculs d'évaluation, tolérance    │
│    (srsEngine, weaknessEngine, examAnalytics, tolerance)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ consomme
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     COUCHE SERVICES                         │
│   VirtualFS, ShellInterpreter, Moteurs d'exécution, i18n    │
└──────────────────────────────┬──────────────────────────────┘
                               │ persiste via
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   COUCHE PERSISTENCE                        │
│          Storage Local (localStorage, IndexedDB)            │
└─────────────────────────────────────────────────────────────┘
```

### ⚠️ Règle d'Or : Interdiction du Couplage Sauvage
Il est **strictement interdit** d'accéder directement au `localStorage` depuis les composants visuels en y mélangeant de la logique métier :

```typescript
// ❌ ANTI-PATTERN INTERDIT :
// Dans un composant UI :
const handleClick = () => {
  const data = JSON.parse(localStorage.getItem('cards') || '[]');
  data.push({ id: 1, interval: data.interval * 2.5 }); // Logique métier mélangée !
  localStorage.setItem('cards', JSON.stringify(data));
};

// ✅ PATTERN RECOMMANDÉ :
// Le composant UI délègue au moteur dédié :
const handleAnswer = (grade: SRSGrade) => {
  const updatedRecord = srsEngine.reviewCard(cardId, grade);
  saveSrsRecord(updatedRecord); // Fonction de persistance dédiée
};
```

---

## 3. Le Rôle d'`App.tsx` (Point d'Orchestration)

À ce jour, `App.tsx` agit comme l'**orchestrateur racine** de l'application :
- **Gestion de la vue active** (`activeTab` : `'dashboard' | 'objectives' | 'practice' | 'flashcards' | 'training' | 'glossary' | 'career'`).
- **Gestion des modales transverses** : Examen diagnostique, profil utilisateur, paramètres, sélecteur de langue, guide officiel LPI, onboarding.
- **Stockage de l'état utilisateur racine** :
  - `userProfile` (nom, niveau cible, certification visée).
  - `completedObjectives` (ensemble des identifiants d'objectifs validés).
  - `srsCards` (registre complet des flashcards révisées).
  - `examHistory` (résultats des simulations d'examens passées).

### Stratégie de Découplage Futur (Refactoring Cible) :
Pour éviter l'engorgement d'`App.tsx`, l'architecture cible prévoit :
1. L'introduction de contextes spécialisés (`ProgressContext`, `ExamContext`) ou d'un store léger sans boilerplate.
2. La déportation de la logique de synchronisation locale dans des hooks dédiés (`useUserProfile`, `useSrsTracker`, `useExamSession`).

---

## 4. Architecture PWA & Stratégie Offline-First

L'application est conçue pour fonctionner dans un train, un avion ou une salle sans réseau :
- **Zéro appel réseau obligatoire** en cours d'utilisation : l'ensemble des données pédagogiques (`/src/data`) est compilé statiquement dans le bundle de l'application.
- **Service Worker** : enregistrement des assets (HTML, JS, CSS, icônes, polices) dans le cache du navigateur pour un chargement instantané à froid.
- **Stockage Local Déterministe** :
  - Clés préfixées (ex: `lpi_user_profile`, `lpi_srs_records_v1`, `lpi_exam_history_v1`).
  - Tolérance aux données corrompues avec initialisation défensive par valeurs par défaut.
