# 04 — Modèle Conceptuel de Données (Data Model)

> Ce document unifie et formalise l'ensemble des structures de données du projet **LPI Certification Prep**, modélisées dans `src/types.ts` et `src/services/virtualFs/types.ts`.

---

## 1. Modèle Conceptuel Global (Entités Clés)

Le système s'articule autour de trois graphes de données interconnectés :
1. **Le Graphe de Contenu Pédagogique** : Hiérarchie officielle LPI et ressources d'apprentissage.
2. **Le Graphe de Performance & Faiblesses** : Télémétrie des réponses, taux d'erreurs et remédiation.
3. **Le Graphe d'Exécution Pratique** : Système de fichiers virtuel, états de shell et validation de labs.

```text
  [ Certification ]
          │ 1
          ▼ *
      [ Exam ]
          │ 1
          ▼ *
      [ Topic ]
          │ 1
          ▼ *
    [ Objective ] ◄────────────────────────┐
          │                                │ rattaché à
          ├─────────────┬─────────────┐    │
          ▼ *           ▼ *           ▼ *  │
     [ Question ]  [ Flashcard ]   [ Lab Scenario ]
          │             │
          │ évalué      │ révisé
          ▼             ▼
   [ Exam Answer ] [ SRS Record ]
          │
          ▼ consolidé
   [ Weakness Engine Report ]
          │
          ▼ génère
   [ Targeted Training Session ]
```

---

## 2. Le Référentiel Pédagogique Officiel (Content Hierarchy)

La hiérarchie suit fidèlement le découpage officiel du Linux Professional Institute :

### Hiérarchie :
$$\text{Certification} \longrightarrow \text{Exam} \longrightarrow \text{Topic} \longrightarrow \text{Objective} \longrightarrow \{\text{Questions, Flashcards, Labs, Glossaire}\}$$

### Entités Types :

#### `ExamTier` & `ExamInfo`
- `ExamTier` : Niveau de certification (`lpic-1`, `lpic-2`, `lpic-3`).
- `ExamInfo` : Examen spécifique (ex: `101-500`, `102-500`, `201-450`, `202-450`, `303-300`).
  - Champs clés : `id`, `code`, `name`, `status` (`passed | in_progress | locked`), `progress`.

#### `LPICTopic`
- Représente un grand chapitre du programme officiel (ex: *Topic 101: System Architecture*).
- Champs clés : `id`, `topicNumber`, `title`, `totalWeight`, `examId`, `objectives: LPICObjective[]`.

#### `LPICObjective`
- L'unité élémentaire du programme officiel (ex: *101.1: Determine and configure hardware settings*).
- Attributs majeurs :
  - `id: string` (ex: `"101.1"`)
  - `weight: number` (pondération officielle de 1 à 10, reflétant le nombre de questions le jour de l'examen)
  - `keyKnowledgeAreas: string[]`
  - `termsAndUtilities: string[]`
  - `filesAndPaths: string[]`
  - `keyCommands: LPICCommandSnippet[]`
  - `quickQuestions: ObjectiveQuizQuestion[]`

---

## 3. Le Modèle de Répétition Espacée (SRS Engine)

Le moteur de révision s'appuie sur une machine à états finis couplée à un calendrier d'échéances glissantes :

### États d'une Carte (`SRSState`) :
$$\text{new} \longrightarrow \text{learning} \longrightarrow \text{review} \longrightarrow \text{mastered}$$

### Structure d'une `Flashcard` et de son `SRSCardRecord` :

```typescript
export interface SRSCardRecord {
  cardId: number;
  state: 'new' | 'learning' | 'review' | 'mastered';
  intervalLevel: number; // 0 à 6
  intervalLabel: string; // "10 min", "1 jour", "3 jours", "7 jours", "14 jours", "30 jours", "60 jours"
  dueDate: string;       // Timestamp ISO de la prochaine révision requise
  lastReviewedAt?: string;
  repetitions: number;   // Nombre total de révisions consécutives réussies
  lapses: number;        // Nombre de rechutes après avoir été en review/mastered
  lastRating?: 'hard' | 'good' | 'easy' | 'mastered';
}
```

### Échelle des Intervalles Déterministes :
| Niveau | Délai appliqué | Règle de transition |
| :---: | :---: | :--- |
| **0** | **10 minutes** | Échec ou première rencontre. |
| **1** | **1 jour** | Réponse `good` validée au niveau 0. |
| **2** | **3 jours** | Rétention confirmée à J+1. |
| **3** | **7 jours** | Entrée dans la phase de consolidation. |
| **4** | **14 jours** | Mémorisation à moyen terme. |
| **5** | **30 jours** | Connaissance stable. |
| **6** | **60 jours** | Statut `mastered` : carte ancrée à long terme. |

---

## 4. Le Modèle d'Analyse des Faiblesses (Weakness Engine)

Le moteur de faiblesses analyse l'historique complet des réponses pour quantifier le risque d'échec par domaine :

```text
[ Question Attempt ]
   ├── correct (succès direct)
   ├── incorrect (erreur explicite)
   ├── skipped (abandon)
   └── lucky guess (réussite avec temps anormalement long ou hésitation)
          │
          ▼
   [ Weakness Engine Analytics ]
          ├── Taux d'erreurs brutes
          ├── Taux de "Lucky guesses"
          ├── Nombre d'ateliers / labs échoués
          ├── Sous-thèmes jamais évalués (angles morts)
          └── Temps de décision anormal (> 90 sec)
          │
          ▼
   [ WeaknessDomainStats ]
          ├── status: 'critical' (<50%) | 'moderate' (50-74%) | 'review' (75-89%) | 'solid' (>=90%)
          ├── whyWeakExplanation: explication pédagogique de la fragilité
          ├── commonPitfalls: pièges fréquents identifiés
          └── targetObjectiveIds: liste des identifiants d'objectifs prioritaires
```

### Domaines surveillés (`WeaknessDomainId`) :
- `networking` (Protocoles, DNS, routage, ports, sockets)
- `scripting` (Bash, regex, substitution, boucles, conditions)
- `security` (Permissions, sudo, SSH, pare-feu, shadow, audits)
- `filesystems` (FHS, montages, inodes, partitions, swap, quotas)
- `commands` (Manipulation de texte, filtres, tuyaux, redirection)
- `boot` (UEFI, BIOS, GRUB2, systemd, SysVinit, logs dmesg)
- `packages` (dpkg, apt, rpm, dnf, zypper, tarballs)

---

## 5. Le Modèle du Terminal Virtuel & Labs (`VirtualFS`)

Le moteur de simulation de laboratoire repose sur un arbre d'inodes en mémoire JavaScript :

### Inode Virtuelle (`VfsNode`) :

```typescript
export interface VfsNode {
  name: string;
  type: 'file' | 'directory' | 'symlink';
  mode: number;            // Mode Unix octal (ex: 0o755, 0o640, 0o700)
  owner: string;           // Propriétaire (ex: "student", "root")
  group: string;           // Groupe (ex: "student", "developers", "shadow")
  size: number;            // Taille simulée en octets
  mtime: Date;             // Date de dernière modification
  content?: string;        // Contenu textuel pour les fichiers
  children?: Record<string, VfsNode>; // Table des sous-nœuds pour les répertoires
  target?: string;         // Cible pour les liens symboliques
}
```

### Modèle d'un Scénario de Laboratoire (`SimulatedLabScenario`) :

```typescript
export interface SimulatedLabScenario {
  id: string;
  title: string;
  goal: string;
  initialDirectory: string;
  initialSetup?: (fs: VirtualFs, interpreter: ShellInterpreter) => void;
  instructions: string[];
  hints: string[];
  solutionCommands: string[];
  solutionExplanation: string;
  validate: (fs: VirtualFs, interpreter: ShellInterpreter) => LabScenarioValidation;
}
```

Le validateur `validate` n'analyse pas seulement les commandes saisies dans l'historique : **il sonde l'état microscopique réel du VirtualFS** (ex: `fs.getNode('/home/student/scripts/backup.sh')?.mode === 0o750`).

---

## 6. Persistance & Stockage Local

Toutes les entités mutables sont sérialisées en JSON sous des clés isolées dans le stockage local du navigateur :

| Clé de Stockage | Type Modélisé | Fréquence d'écriture |
| :--- | :--- | :--- |
| `lpi_user_profile` | `UserStats` | À chaque action complétée ou mise à jour de profil. |
| `lpi_srs_records_v1` | `Record<number, SRSCardRecord>` | À chaque évaluation de flashcard. |
| `lpi_completed_objectives` | `string[]` | À chaque coche d'objectif maîtrisé. |
| `lpi_exam_history_v1` | `ExamSessionHistory[]` | À la fin de chaque simulation d'examen. |
| `lpi_diagnostic_result` | `DiagnosticResult` | À l'issue de l'examen diagnostique initial. |
| `lpi_completed_labs` | `string[]` | À chaque scénario de lab validé. |
