<div align="center">

  <img src="public/app-logo.jpg" alt="LPI Certification Prep Logo" width="130" height="130" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.25);" />

  # 🐧 LPI Certification Prep
  ### Plateforme Offline-First de Préparation aux Certifications LPIC-1, LPIC-2 & LPIC-3

  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![PWA 100% Offline](https://img.shields.io/badge/PWA-100%25_Offline-FFC20E?style=for-the-badge&logo=pwa&logoColor=black)](#-install-pwa)
  [![Documentation](https://img.shields.io/badge/Docs-V1_Complete-blue?style=for-the-badge)](./docs/00_OVERVIEW.md)
  [![License](https://img.shields.io/badge/License-MIT-28A745?style=for-the-badge)](#-license)

  <p align="center">
    <strong>Suite complète d'apprentissage interactif, de simulations d'examens chronométrés et de laboratoires avec terminal virtuel Linux simulé (VirtualFS).</strong>
  </p>

</div>

---

## 🖥️ Aperçu de l'Application

<div align="center">
  <img src="public/dashboard-screenshot.jpg" alt="Aperçu du Tableau de Bord LPI Certification Prep" width="900" style="border-radius: 14px; border: 1px solid #d3c5ab; box-shadow: 0 14px 36px rgba(0,0,0,0.18);" />
</div>

---

## ✨ Fonctionnalités Principales

- **🖥️ Terminal Virtuel & Labs Similés (VirtualFS)** : Interpréteur de commandes Linux 100 % in-memory et PWA (`chmod`, `chown`, `grep`, `tar`, `ps`, redirections) avec validation d'état réel du système de fichiers.
- **📝 Examens Blancs Chronométrés** : Simulations fidèles aux conditions LPI (LPIC-1 101/102, LPIC-2 201/202, LPIC-3) avec tolérance de commandes et explications pédagogiques détaillées.
- **🧠 Flashcards avec Algorithme SRS (2 000+ cartes)** : Moteur de répétition espacée (Leitner/SM-2) avec calcul des cartes dues du jour et paliers de rétention.
- **🚨 Ateliers Hands-On Pratiques** : Simulation d'astreinte (*Incident Response*), saisie libre (*Fill-in-the-blank*), analyse de pannes (*Troubleshooting*) et ordonnancement chronologique (*Sequencing*).
- **🎯 Weakness Engine & Matrice de Compétences** : Détection algorithmique des angles morts et des lacunes pour des révisions ultra-ciblées.
- **📖 Glossaire & Index des Commandes** : Dictionnaire complet des utilitaires, fichiers de configuration FHS et pièges d'examen avec décomposition de la syntaxe.
- **🌐 Expérience 100 % Bilingue** : Basculement instantané Français / Anglais sur toute l'application.

---

## 🎯 Certifications LPI Couvertes

| Certification | Examens | Statut du Curriculum |
| :--- | :--- | :---: |
| **Linux Essentials** | Exam 010 | ✅ Couvert (Fondamentaux) |
| **LPIC-1** (Administrateur Linux) | Exam 101-500 & Exam 102-500 | ✅ 100 % Complet (10 topics) |
| **LPIC-2** (Ingénieur Linux) | Exam 201-450 & Exam 202-450 | ✅ 100 % Complet (Topics 200 à 212) |
| **LPIC-3 Enterprise** (Spécialiste) | 300 (Mixte/Samba), 303 (Sécurité), 305 (Virtualisation/Cloud), 306 (Haute Dispo) | ✅ Modules Dédiés |

---

## 🏗️ Architecture

Le projet adopte une architecture modulaire et découplée :
$$\text{UI Components} \longrightarrow \text{Domain Logic (SRS, Weakness, Analytics)} \longrightarrow \text{Services (VirtualFS, Shell)} \longrightarrow \text{Persistence (Storage)}$$

👉 **Voir la documentation complète de l'architecture : [docs/02_ARCHITECTURE.md](./docs/02_ARCHITECTURE.md)**

---

## 📚 Documentation Technique (`docs/`)

La documentation interne du projet est organisée dans le dossier `docs/` selon une séparation claire entre l'existant (**CURRENT**), les cibles architecturales (**TARGET**) et la feuille de route (**ROADMAP**) :

### Phase 1 — Comprendre l'existant (Complète)
- **[00_OVERVIEW.md](./docs/00_OVERVIEW.md)** : Carte mentale du projet, flux d'interaction entre modules et parcours apprenant.
- **[01_PRODUCT.md](./docs/01_PRODUCT.md)** : Positionnement, personas et matrice de maturité (Existant / Planifié / Expérimental).
- **[02_ARCHITECTURE.md](./docs/02_ARCHITECTURE.md)** : Arborescence `src/`, modèle en couches et principes de découplage.
- **[04_DATA_MODEL.md](./docs/04_DATA_MODEL.md)** : Modèle conceptuel de données unifié (LPI Hierarchy, SRS, Weakness, VirtualFS).

### Phase 2 — Moteurs Métiers (Complète)
- **[06_LEARNING_ENGINE.md](./docs/06_LEARNING_ENGINE.md)** : Boucle pédagogique adaptative, diagnostic initial et parcours thématiques.
- **[07_SRS_ENGINE.md](./docs/07_SRS_ENGINE.md)** : Algorithme de répétition espacée, paliers déterministes et machine à états.
- **[08_WEAKNESS_ENGINE.md](./docs/08_WEAKNESS_ENGINE.md)** : Détection heuristique des lacunes, 7 domaines LPI et entraînements ciblés.
- **[09_LABS_ENGINE.md](./docs/09_LABS_ENGINE.md)** : Terminal virtuel Bash 5.2, arborescence POSIX/FHS in-memory et validation d'état microscopique.
- **[10_EXAM_ENGINE.md](./docs/10_EXAM_ENGINE.md)** : Échelle officielle 200–800, pondération, tolérance syntaxique aux commandes et analytics comportementales.

### Phase 3 — Infrastructure & PWA (Complète)
- **[12_I18N.md](./docs/12_I18N.md)** : Internationalisation bilingue FR/EN, typage strict des dictionnaires et détection navigateur.
- **[13_PWA_OFFLINE.md](./docs/13_PWA_OFFLINE.md)** : Architecture PWA, Service Worker, cache hybride et mises à jour transparentes.
- **[15_STORAGE.md](./docs/15_STORAGE.md)** : Contrats de stockage local, isolation des clés `lpi_*`, migration et export/import JSON.
- **[16_TESTING.md](./docs/16_TESTING.md)** : Stratégie de test multi-niveaux, typage statique TypeScript et validation des labs.

### Phase 4 — Évolution & Décisions (Complète)
- **[18_ROADMAP.md](./docs/18_ROADMAP.md)** : Trajectoire V1 (PWA) -> V2 (Wasm/IndexedDB) -> V3 (Desktop Tauri/Conteneurs natifs).
- **[19_DECISIONS.md](./docs/19_DECISIONS.md)** : Synthèse des choix d'architecture, compromis techniques et catalogue des ADRs.

### Architecture Decision Records (ADRs)
- **[Registre des Décisions](./docs/adr/README.md)**
  - [ADR-001 : PWA & Offline-First](./docs/adr/ADR-001-pwa-offline-first.md)
  - [ADR-002 : Virtual Linux Labs in-Memory](./docs/adr/ADR-002-virtual-linux-labs.md)
  - [ADR-003 : Contrats de Persistance Locale](./docs/adr/ADR-003-local-storage-contracts.md)
  - [ADR-004 : IA Optionnelle & Repli Déterministe](./docs/adr/ADR-004-ai-optional-fallback.md)
  - [ADR-005 : Parcours Thématiques Métiers vs Révision Linéaire](./docs/adr/ADR-005-learning-paths.md)
  - [ADR-006 : Stratégie Desktop & Conteneurs Natifs (V3)](./docs/adr/ADR-006-desktop-strategy.md)

---

## 🚀 Démarrage Rapide (Development)

### Prérequis
- Node.js 18+ ou Bun 1.1+

### Installation & Lancement
```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-compte/lpi-certification-prep.git
cd lpi-certification-prep

# 2. Installer les dépendances
npm install
# ou : bun install

# 3. Démarrer le serveur de développement local
npm run dev

# 4. Ouvrir l'application
http://localhost:3000
```

### Compilation pour la Production
```bash
npm run build
```
Les fichiers statiques optimisés sont générés dans le dossier `dist/`, prêts à être déployés sur n'importe quel hébergeur statique ou conteneur.

---

## 📱 Installation PWA

L'application est 100 % installable sur ordinateur (Chrome, Edge, Safari macOS) et smartphone/tablette (Android, iOS) via le bouton **Installer** de la barre d'adresse. Une fois installée, elle fonctionne en mode autonome sans connexion réseau.

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE) — libre pour un usage d'étude personnelle, en formation ou en entreprise.
