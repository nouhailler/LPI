# 06 — Moteur Pédagogique (Learning Engine)

> Ce document formalise la boucle d'apprentissage adaptative de **LPI Certification Prep**, son moteur de diagnostic, la structure des parcours thématiques et l'orchestration des activités de formation.

---

## 1. La Boucle d'Apprentissage Adaptative

Le moteur pédagogique a pour objectif de transformer une révision passive en un **parcours guidé par les données réelles de l'apprenant**. Plutôt que d'imposer une lecture linéaire de la documentation, le moteur orchestre un cycle continu en 8 étapes :

```text
               ┌─────────────────────────────────────────┐
               │         1. DIAGNOSTIC INITIAL           │
               │   (Évaluation sans biais du niveau)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │         2. KNOWLEDGE PROFILE            │
               │     (Cartographie des acquis réels)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │         3. WEAKNESS DETECTION           │
               │   (Identification des angles morts)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          4. LEARNING PATH               │
               │     (Sélection du parcours optimal)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          5. CONTENT SELECTION           │
               │     (Fiches, concepts, pièges prod)     │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          6. HANDS-ON PRACTICE           │
               │  (Terminal virtuel, incidents, pannes)  │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          7. SRS CONSOLIDATION           │
               │  (Mémorisation espacée Leitner/SM-2)    │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │          8. REASSESSMENT & EXAM         │
               │   (Simulation d'examen & réévaluation)  │
               └────────────────────┬────────────────────┘
                                    │
                                    └────── (Boucle de progression)
```

---

## 2. Modèle des Parcours Thématiques (`ThematicPath`)

En complément de la révision linéaire par objectif officiel (ex: 101.1 $\to$ 101.2), le moteur propose des **Parcours Thématiques transverses** structurés dans `src/data/thematicLearningPathsData.ts`.

### Typologie des Parcours Existants :
- **🔵 Devenir Administrateur Linux (`admin`)** : De la ligne de commande initiale à la gestion autonome de serveurs en production (25 heures estimées).
- **🟢 Automatisation & Scripting Shell (`bash`)** : Maîtrise des scripts d'administration, expressions régulières, manipulation de flux et automatisation crontab (20 heures).
- **🟣 Réseau Linux & Services (`networking`)** : Configuration IP, routage, résolution DNS, durcissement SSH et sécurité de transport (22 heures).

### Anatomie d'un Parcours (`ThematicPathStep`) :
Chaque étape d'un parcours est découpée de manière hautement opérationnelle :
1. **Concept & Balise** : titre court et contexte métier (ex: *Résolution DNS locale et stub resolver*).
2. **Pourquoi c'est crucial en production (`whyItMatters`)** : justification concrète évitant l'apprentissage abstrait.
3. **Commandes clés** : liste des commandes exactes à tester.
4. **Code Snippet & Décomposition** : exemple annoté avec explication pas-à-pas.
5. **Piège de production (`prodTrap`)** : erreur classique commise sur serveur réel (ex: oublier que `systemd-resolved` écoute sur `127.0.0.53`).
6. **Checklist d'auto-évaluation** : 3 à 5 critères d'acceptation opérationnels.
7. **Projet Fil Rouge (`ThematicCapstoneProject`)** : projet d'intégration terminal (ex: *Déployer et durcir une pile applicative multi-utilisateurs*).

---

## 3. Diagnostic Initial & Profil de Compétences

L'examen diagnostique (`src/data/diagnosticExamData.ts`) constitue la porte d'entrée recommandée :
- **Échantillon représentatif** : 20 questions ciblées couvrant l'ensemble des domaines LPI majeurs.
- **Zéro score de complaisance** : enregistrement séparé des réponses correctes, des erreurs franches et des abandons.
- **Initialisation de la matrice** : injection immédiate dans le `Weakness Engine` pour colorer la carte des compétences sans attendre le premier examen complet de 90 minutes.

---

## 4. Recommandations Pédagogiques Dynamiques

Le moteur recalcule en permanence la meilleure action suivante pour l'étudiant selon la règle de priorité :

1. **Priorité 1 : Cartes SRS Échues** : Si des flashcards ont atteint leur date d'échéance (`dueDate <= now`), la révision quotidienne prime pour contrer la courbe de l'oubli d'Ebbinghaus.
2. **Priorité 2 : Domaines Critiques (< 50% de maîtrise)** : Si un domaine est dans l'état `critical` dans le Weakness Engine, une session d'entraînement ciblée de 8 questions est proposée en tête du Dashboard.
3. **Priorité 3 : Ateliers Pratiques Non Réalisés** : Si la théorie est assimilée mais qu'aucun lab pratique n'a été validé sur l'objectif, le moteur suggère un lab sur le Terminal Virtuel.
4. **Priorité 4 : Simulation d'Examen Blanc** : Dès que la couverture globale dépasse 70 %, un examen chronométré complet de 60 questions est recommandé pour tester la gestion du stress et du temps.
