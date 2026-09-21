# 00 — Vue d'ensemble du Projet (Overview)

> **LPI Certification Prep** — Plateforme web offline-first d'apprentissage, d'entraînement pratique et de préparation intensive aux certifications du **Linux Professional Institute** (Linux Essentials, LPIC-1, LPIC-2, LPIC-3).
>
> 🧭 **Documentation Fonctionnelle des Écrans** : Pour une description détaillée écran par écran avec toutes les fonctionnalités et interactions de chaque vue, consultez la fiche préalable : **[00 — Guide Fonctionnel des Écrans & Parcours Utilisateur](./00_FUNCTIONAL_GUIDE.md)**.

---

## 1. Qu'est-ce que LPI Certification Prep ?

**LPI Certification Prep** est une suite d'apprentissage interactive conçue pour transformer la préparation aux certifications Linux d'une mémorisation passive en une **maîtrise pratique et réflexe**.

Elle s'adresse aux administrateurs systèmes, ingénieurs DevOps, étudiants et autodidactes souhaitant certifier leurs compétences professionnelles Linux.

### Les 4 Piliers Fondamentaux :
1. **100 % Autonome & Offline-First (PWA)** : Aucune obligation de connexion internet ni de compte distant. L'ensemble des 2 000+ flashcards, questions d'examen, ateliers pratiques et le moteur de terminal virtuel s'exécutent localement dans le navigateur.
2. **Couverture exhaustive des objectifs officiels LPI** : Alignement strict sur le programme officiel du LPI (LPIC-1 101 & 102 v5.0, LPIC-2 201 & 202 v4.5, LPIC-3 300, 303, 305, 306).
3. **Pratique réelle & Non-QCM** : Les examens réels LPI contiennent des questions à saisie libre de commandes ("Fill-in-the-blank"). L'application intègre un moteur de tolérance syntaxique et un terminal virtuel simulant un système de fichiers Unix réel (*VirtualFS*).
4. **Intelligence Pédagogique Décentralisée** : Moteur de répétition espacée (SRS algorithme Leitner/SM-2) et moteur d'analyse des faiblesses (*Weakness Engine*) pour orienter immédiatement l'étudiant vers ses lacunes critiques.

---

## 2. Carte Mentale du Système (Flux Fonctionnel)

Le schéma ci-dessous illustre comment les différents modules interagissent pour créer un cycle d'apprentissage adaptatif :

```text
                                  ┌───────────────────────────────┐
                                  │   LPI CERTIFICATION PREP      │
                                  └───────────────┬───────────────┘
                                                  │
        ┌─────────────────────────────────────────┼────────────────────────────────────────┐
        │                                         │                                        │
        ▼                                         ▼                                        ▼
 ┌───────────────┐                         ┌───────────────┐                        ┌───────────────┐
 │   LEARNING    │                         │   PRACTICE    │                        │   TRAINING    │
 │   (Apprendre) │                         │  (S'évaluer)  │                        │  (Pratiquer)  │
 └──────┬────────┘                         └───────┬───────┘                        └───────┬───────┘
        │                                          │                                        │
        ├─ Objectifs & Théorie (LPIC-1/2/3)        ├─ Examens Blancs (101, 102, 201...)     ├─ Terminal Virtuel (VirtualFS)
        ├─ Parcours Thématiques                    ├─ Tolérance Commandes (Regex/Flags)     ├─ Réponse à Incidents
        ├─ Glossaire & Index Commandes             ├─ Examen Diagnostique Initial           ├─ Saisie Libre (Fill-in-blank)
        └─ Flashcards Interactives                 └─ Score de Préparation (Readiness)      ├─ Analyse de Pannes (Troubleshoot)
                                                                                            ├─ Séquençage Chronologique
                                                                                            └─ Mini-Labs Guidés & Jeux
        │                                          │                                        │
        └──────────────────────────────────────────┼────────────────────────────────────────┘
                                                   │
                                                   ▼
                                    ┌──────────────────────────────┐
                                    │      LEARNING PROGRESS       │
                                    │    (Télémétrie Locale)       │
                                    └──────────────┬───────────────┘
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        │                                                     │
                        ▼                                                     ▼
         ┌──────────────────────────────┐                      ┌──────────────────────────────┐
         │     SRS / ESPACEMENT         │                      │      WEAKNESS ENGINE         │
         │  (Algorithme Répétition)     │                      │   (Matrice des Faiblesses)   │
         └──────────────┬───────────────┘                      └──────────────┬───────────────┘
                        │                                                     │
                        │  - Intervalles (10m -> 60j)                          │  - Analyse par domaine & sujet
                        │  - Suivi des lapses / rétention                     │  - Détection "lucky guesses"
                        │  - Cartes dues quotidiennes                         │  - Temps passé & échecs récurrents
                        │                                                     │
                        └──────────────────────────┬──────────────────────────┘
                                                   │
                                                   ▼
                                    ┌──────────────────────────────┐
                                    │       RECOMMENDATIONS        │
                                    │  (Sessions d'Étude Ciblées)  │
                                    └──────────────────────────────┘
```

---

## 3. Parcours Utilisateur Typique

1. **Diagnostic Initial** :
   - L'apprenant commence par l'évaluation diagnostique pour établir son niveau de base sans influence préalable.
   - Le système dresse une **Matrice de Compétences** initiale par domaine (Systèmes de fichiers, Réseau, Sécurité, Commandes, Scripting, Boot, Packages).

2. **Acquisition & Consolidation** :
   - Consultation des **Objectifs Détaillés** et des **Parcours Thématiques** (ex: *Maîtriser le stockage Linux*, *Sécurité & Permissions*).
   - Mémorisation active via le deck de **Flashcards** géré par le **SRS Engine** (calcul automatique des cartes à réviser le jour J).

3. **Pratique en Ateliers (Hands-On)** :
   - Entraînement sur le **Terminal Virtuel** : exécution de vraies commandes Unix (`chmod 750`, `grep`, `tar`, `ps`, `kill`) sur une arborescence simulée (*VirtualFS*), avec validation instantanée de l'état système.
   - Résolution de scénarios d'**Incident Response** (astreinte système en temps limité).
   - Exercices de **Troubleshooting** (décortiquer un bug d'amorçage ou de droits) et de **Séquençage** (ordonnancement chronologique du boot).

4. **Simulation en Conditions Réelles** :
   - Passage d'un **Practice Exam** chronométré (60 questions, 90 minutes, QCM + saisie de commandes).
   - Analyse approfondie après soumission : identification des erreurs, questions manquées, temps moyen par question.

5. **Remédiation Continue** :
   - Le **Weakness Engine** agrège tous les résultats pour générer des **Sessions de Révision Ciblées** (entraînement exclusif sur les lacunes prioritaires).

---

## 4. Vocabulaire du Projet

| Terme | Définition dans le projet |
| :--- | :--- |
| **PWA** | *Progressive Web App* : application installable sur bureau et mobile, fonctionnant à 100 % hors-ligne via Service Worker et Web App Manifest. |
| **VirtualFS** | Système de fichiers Unix simulé en mémoire JavaScript respectant le FHS (*Filesystem Hierarchy Standard*), avec inodes, droits octaux, propriétaires et hiérarchie. |
| **ShellInterpreter** | Interpréteur de commandes JavaScript simulant Bash 5.2 avec support des redirections (`>`, `>>`), pipes (`|`) et commandes courantes. |
| **SRS Engine** | Moteur de répétition espacée (*Spaced Repetition System*) basé sur Leitner/SM-2 ordonnançant la révision des cartes mémoire selon la courbe de l'oubli. |
| **Weakness Engine** | Moteur heuristique calculant le score de risque et de faiblesse d'un candidat par domaine et sous-thème LPI. |
| **Command Tolerance** | Algorithme de normalisation et d'évaluation syntaxique comparant les commandes saisies par l'utilisateur aux réponses attendues (ordre des flags, arguments). |
