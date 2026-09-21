# 19 — Synthèse des Décisions d'Architecture (Architecture Decisions Synthesis)

> Ce document synthétise les choix d'architecture stratégiques qui fondent **LPI Certification Prep**, leurs justifications techniques, les compromis acceptés et leurs liens avec les Architecture Decision Records (ADRs).

---

## 1. Philosophie Générale : Simplicité, Autonomie & Rigueur

L'architecture de **LPI Certification Prep** a été construite autour d'un principe directeur : **l'autonomie absolue de l'apprenant**.
Toutes les décisions techniques ont été arbitrées en faveur d'une disponibilité immédiate, d'une latence nulle, d'un respect strict de la vie privée des données de révision, et d'une fidélité sans compromis aux spécifications d'examen du Linux Professional Institute.

---

## 2. Synthèse des Choix Structurants

### A. PWA 100% Offline vs Backend Cloud Obligatoire
- **Choix arrêté** : Application monopage (SPA) transformée en **Progressive Web App (PWA)** avec Service Worker autonome et stockage local (`localStorage`).
- **Ce qui a été rejeté** : Une architecture SaaS traditionnelle imposant un serveur d'API distant, une base de données PostgreSQL dans le cloud et une authentification utilisateur obligatoire.
- **Justification** : Les candidats révisent dans les transports, en avion, ou sur des réseaux d'entreprise filtrés. L'absence de backend serveur garantit un coût d'exploitation quasi-nul, une disponibilité à 100% et une vitesse d'affichage instantanée.
- 🔗 **Référence** : [ADR-001 : PWA & Stratégie Offline-First](./adr/ADR-001-pwa-offline-first.md)

---

### B. VirtualFS In-Memory vs Ferme de Conteneurs Docker Distants
- **Choix arrêté** : Un simulateur de système de fichiers POSIX (`VirtualFs`) et un shell Bash (`ShellInterpreter`) développés en pur TypeScript et exécutés localement dans le thread du navigateur.
- **Ce qui a été rejeté** : L'allocation dynamique de conteneurs Docker/Linux distants par session utilisateur (modèle type Killercoda ou Katacoda).
- **Justification** : Une infrastructure de conteneurs dans le cloud coûte cher à maintenir, présente des risques de sécurité (évasion de conteneurs, minage) et s'effondre en cas de perte de réseau. Le VirtualFS in-memory offre une réactivité à 0 ms, supporte la navigation hors-ligne et permet une **validation microscopique d'état** (on inspecte les bits de permission et les inodes résultants).
- 🔗 **Référence** : [ADR-002 : Virtual Linux Labs via VirtualFS](./adr/ADR-002-virtual-linux-labs.md)

---

### C. Contrats de Persistance Locale & Isolation des Clés
- **Choix arrêté** : Encapsulation systématique de `localStorage` sous des clés préfixées `lpi_*` et versionnées (`_v1`, `_v2`), avec des blocs `try/catch` défensifs et un format d'export/import JSON unifié (`LPIProfileBackupV1`).
- **Ce qui a été rejeté** : Des écritures désordonnées non préfixées ou une dépendance aveugle à l'API `localStorage` sans gestion des quotas.
- **Justification** : Protéger l'apprenant contre les corruptions silencieuses lors des mises à jour applicatives et éviter les crashs en navigation privée (iOS Safari).
- 🔗 **Référence** : [ADR-003 : Contrats de Persistance Locale & Isolation des Clés](./adr/ADR-003-local-storage-contracts.md)

---

### D. IA Générative Optionnelle vs Moteur Déterministe Embarqué
- **Choix arrêté** : Un corpus pédagogique local ultra-complet (explications alternatives, pièges de prod `prodTraps`, métaphores) embarqué dans le code source, avec l'IA comme enrichissement optionnel non-bloquant.
- **Ce qui a été rejeté** : Une application où la génération d'explications et la correction des réponses dépendent exclusivement d'un appel réseau à un LLM distant.
- **Justification** : Assurer la pérennité de l'application hors connexion et ne jamais bloquer un utilisateur qui ne possède pas de clé d'API.
- 🔗 **Référence** : [ADR-004 : IA Optionnelle & Repli Pédagogique Déterministe](./adr/ADR-004-ai-optional-fallback.md)

---

### E. Double Approche Pédagogique : Thématique & Officielle Linéaire
- **Choix arrêté** : Proposer conjointement le découpage officiel par objectifs LPI (101.1 $\to$ 101.2) **et** des **Parcours Thématiques transverses** orientés métiers (`admin`, `bash`, `networking`).
- **Ce qui a été rejeté** : Un catalogue purement théorique aligné uniquement sur les numéros d'objectifs LPI.
- **Justification** : Les objectifs LPI sont parfois dispersés (ex: le réseau est abordé dans le Topic 109 du LPIC-1 puis dans les Topics 207-212 du LPIC-2). Les parcours thématiques permettent de donner du sens opérationnel aux compétences requises sur le marché du travail.
- 🔗 **Référence** : [ADR-005 : Parcours Thématiques Métiers vs Révision Linéaire](./adr/ADR-005-learning-paths.md)

---

### F. Stratégie d'Extension Desktop & Conteneurs Natifs
- **Choix arrêté** : Conserver le cœur Web / PWA pour la portabilité universelle, et prévoir un wrapper Desktop léger (Tauri / Rust) pour connecter des conteneurs Linux locaux (Podman / Docker) pour les labs de haut niveau (LPIC-2 et LPIC-3).
- **Ce qui a été rejeté** : Forcer dès la V1 l'obligation de télécharger un installateur lourd de 500 Mo.
- **Justification** : Permettre à 95% des étudiants de démarrer instantanément en un clic sur le Web, tout en traçant une voie claire pour les administrateurs avancés nécessitant un vrai noyau Linux.
- 🔗 **Référence** : [ADR-006 : Stratégie Desktop & Conteneurs Natifs](./adr/ADR-006-desktop-strategy.md)

---

## 3. Registre Récapitulatif des ADRs

| Identifiant | Intitulé de la Décision | Statut | Date |
| :--- | :--- | :---: | :---: |
| **[ADR-001](./adr/ADR-001-pwa-offline-first.md)** | Architecture PWA & Stratégie Offline-First | **Accepté** | 2026-09 |
| **[ADR-002](./adr/ADR-002-virtual-linux-labs.md)** | Virtual Linux Labs via Filesystem Virtuel In-Memory | **Accepté** | 2026-09 |
| **[ADR-003](./adr/ADR-003-local-storage-contracts.md)** | Contrats de Persistance Locale & Isolation des Clés | **Accepté** | 2026-09 |
| **[ADR-004](./adr/ADR-004-ai-optional-fallback.md)** | IA Générative Optionnelle & Repli Déterministe | **Accepté** | 2026-09 |
| **[ADR-005](./adr/ADR-005-learning-paths.md)** | Parcours Thématiques Métiers vs Révision Linéaire | **Accepté** | 2026-09 |
| **[ADR-006](./adr/ADR-006-desktop-strategy.md)** | Stratégie Desktop & Conteneurs Natifs (V3) | **Accepté** | 2026-09 |
