# 18 — Feuille de Route & Horizons d'Évolution (Roadmap)

> Ce document formalise la trajectoire stratégique et technique de **LPI Certification Prep**.
> Afin de préserver la clarté du projet, il applique rigoureusement la tri-partition :
> - **CURRENT** : Ce que l'application réalise déjà aujourd'hui dans le code.
> - **TARGET** : Ce que l'architecture actuelle est conçue pour accueillir à court/moyen terme.
> - **ROADMAP** : Les évolutions majeures et ruptures technologiques futures.

---

## 1. Vue d'Ensemble par Horizon Temporel

```text
  ┌───────────────────────────────┐
  │         CURRENT (V1)          │  ◄── 100% PWA Offline-First
  │   Production Web / Mobile     │      VirtualFS in-memory, SRS 7 paliers,
  └───────────────┬───────────────┘      Weakness Engine, Examens 200–800
                  │
                  ▼
  ┌───────────────────────────────┐
  │         TARGET (V2)           │  ◄── Enrichissement Cognitif & Labs Wasm
  │      Expansion & Données      │      Persistance IndexedDB, exports/imports JSON,
  └───────────────┬───────────────┘      Labs d'incident avancés, terminal WebContainers
                  │
                  ▼
  ┌───────────────────────────────┐
  │         ROADMAP (V3)          │  ◄── Écosystème Desktop & Entreprise
  │   Application Native Dédiée   │      Application Tauri/Electron, conteneurs Podman/Docker
  └───────────────────────────────┘      locaux, synchronisation chiffrée multi-appareils
```

---

## 2. Matrice Évolutive par Domaine

---

### A. Terminal Virtuel & Labs Pratiques

#### CURRENT (V1 - Implémenté)
- [x] Filesystem POSIX virtuel en mémoire (`VirtualFs.ts`) respectant le standard FHS (`/home`, `/etc`, `/var/log`, `/tmp`, `/root`).
- [x] Inodes réelles avec gestion des modes octaux (`0o750`, `0o640`), des propriétaires et groupes (`student`, `root`, `developers`, `shadow`).
- [x] Interpréteur Bash 5.2 (`ShellInterpreter.ts`) avec builtins, redirections (`>`, `>>`), pipes (`|`), variables d'environnement et historique (Flèches, Tab).
- [x] Catalogue d'utilitaires implémentés : `ls`, `cd`, `pwd`, `mkdir`, `rmdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, `head`, `tail`, `find`, `chmod`, `chown`, `tar`, `ps`, `kill`, `df`, `free`, `uptime`, `whoami`, etc.
- [x] Validation microscopique d'état : vérification de l'état résultant des fichiers et permissions plutôt qu'une chaîne de commande rigide.
- [x] Explorateur graphique live du VirtualFS avec inspection instantanée des métadonnées et contenus.

#### TARGET (V2 - Prévu à court/moyen terme)
- [ ] Support d'utilitaires de filtrage avancés (`sed`, `awk` basique, `cut`, `sort`, `uniq`).
- [ ] Simulation de l'utilitaire `journalctl` et d'états de services simulés (`systemctl status`).
- [ ] Simulation de configuration réseau virtuelle (`ip addr`, `ip route`, `ping` simulé vers des hôtes virtuels).
- [ ] Scénarios de dépannage de partitions et de montage virtuel (`mount`, `umount`, inspection de `/etc/fstab`).

#### ROADMAP (V3 - Long terme)
- [ ] Intégration d'un micro-noyau Linux WebAssembly (ex: émulation x86 via v86 ou WebContainers) dans le navigateur pour un boot Linux réel.
- [ ] Passerelle vers un daemon Docker / Podman local dans la future version Desktop (accès à un vrai démon systemd et vrai kernel).

---

### B. Moteur d'Examens & Entraînement

#### CURRENT (V1 - Implémenté)
- [x] Simulations d'examens complets (60 questions / 90 minutes) pour LPIC-1 (101 & 102), LPIC-2 (201 & 202) et spécialités LPIC-3.
- [x] Calcul officiel du score estimé LPI sur l'échelle **200 à 800 points** avec prise en compte des coefficients officiels (`weight: 1..10`).
- [x] Moteur de tolérance syntaxique (`commandTolerance.ts`) pour les questions Fill-in-the-blank (normalisation des prompts, espaces, guillemets, permutation des drapeaux `tar -xvf`).
- [x] Détection des frappes proches (*near-misses*) via distance de Levenshtein.
- [x] Télémétrie d'examen et analytics comportementales : identification des questions précipitées ($<15\text{s}$), bloquantes ($>90\text{s}$) et marquées.
- [x] Formats d'ateliers variés : Incident Response, Fill-in-the-blank, Troubleshooting, Ordonnancement chronologique (Sequencing) et Jeux d'association.

#### TARGET (V2 - Prévu à court/moyen terme)
- [ ] Générateur d'examens personnalisés (sélection à la carte par topic ou durée : mini-examens express de 20 questions).
- [ ] Mode « Examen Blanc Strict » : blocage des indices, masquage immédiat des réponses et simulation exacte des conditions de passage Pearson VUE.
- [ ] Enrichissement continu de la banque de questions avec intégration des retours de la communauté d'apprenants.

#### ROADMAP (V3 - Long terme)
- [ ] Mode d'évaluation orale / audio simulée pour l'entretien d'embauche technique Linux.
- [ ] Système d'analyse comparative anonymisée (benchmarking statistique de son score par rapport aux autres candidats certifiés).

---

### C. Moteurs Pédagogiques (SRS & Weakness Engine)

#### CURRENT (V1 - Implémenté)
- [x] Moteur SRS déterministe à 7 paliers (10m, 1j, 3j, 7j, 14j, 30j, 60j) avec gestion des lapses et cartes dues quotidiennes.
- [x] Weakness Engine multi-signaux surveillant 7 domaines LPI (`networking`, `scripting`, `security`, `filesystems`, `commands`, `boot`, `packages`).
- [x] Détection des faux positifs et des "lucky guesses".
- [x] Génération dynamique de sessions de révision ciblées (focus exclusif sur les 3 domaines les plus faibles).
- [x] Parcours thématiques transverses complets (`admin`, `bash`, `networking`) avec étapes opérationnelles, pièges de prod (`prodTraps`) et projets capstone.

#### TARGET (V2 - Prévu à court/moyen terme)
- [ ] Ajustement adaptatif du facteur d'espacement SRS selon la vitesse de réponse historique de l'étudiant.
- [ ] Carte mentale dynamique des compétences (Knowledge Graph) mise à jour en temps réel selon les scores des ateliers.
- [ ] Planificateur d'étude prédictif : calcul de la date optimale d'inscription à l'examen officiel basée sur la courbe de rétention.

#### ROADMAP (V3 - Long terme)
- [ ] Recommandations croisées vers des projets Open Source réels pour consolider les notions maîtrisées.
- [ ] Tuteur IA local conversationnel (ex: WebLLM / modèle local WebGPU) capable de répondre aux questions techniques complexes 100% hors-ligne.

---

### D. Plateforme, Infrastructure & Synchronisation

#### CURRENT (V1 - Implémenté)
- [x] 100 % PWA Offline-First avec Service Worker et stratégie Stale-While-Revalidate.
- [x] Web App Manifest pour installation autonome sur Desktop (Chrome, Edge, Safari) et Mobile (Android, iOS).
- [x] Bilinguisme intégral Français / Anglais sans dépendance externe, typé de bout en bout (`TranslationDictionary`).
- [x] Persistance locale sécurisée (`localStorage`) avec préfixe `lpi_*`, versions de clés et encapsulation défensive `try/catch`.
- [x] Détection proactive des nouvelles versions (`/version.json`) et bannière de mise à jour non-intrusive.

#### TARGET (V2 - Prévu à court/moyen terme)
- [ ] Module d'Export / Import de profil au format JSON standardisé (`LPIProfileBackupV1`) pour transférer sa progression d'un terminal à un autre.
- [ ] Migration de la persistance volumineuse vers IndexedDB (`idb-keyval`) pour stocker l'historique complet des sessions de terminal.
- [ ] Support d'une 3ᵉ langue officielle (ex: Espagnol ou Allemand).

#### ROADMAP (V3 - Long terme)
- [ ] **Client Desktop Dédié (Tauri / Rust)** : Application native multiplateforme intégrant un démon Linux local pour la pratique système bas niveau.
- [ ] Synchronisation cloud chiffrée de bout en bout (E2EE) optionnelle (zero-knowledge) pour les utilisateurs souhaitant synchroniser automatiquement mobile et bureau.
