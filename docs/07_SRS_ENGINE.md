# 07 — Moteur de Répétition Espacée (SRS Engine)

> Ce document détaille l'implémentation algorithmique du moteur de répétition espacée (Spaced Repetition System) de **LPI Certification Prep**, situé dans `src/utils/srsEngine.ts`.

---

## 1. Principes & Modèle Mathématique

Le moteur SRS repose sur une adaptation hybride des algorithmes **Leitner** et **SuperMemo SM-2**, conçue pour concilier la mémorisation à long terme de syntaxe Linux dense avec des sessions d'étude rapides (micro-learning de 5 à 15 minutes).

### Machine à États Finis d'une Carte

Chaque carte parmi les 2 000+ flashcards du corpus traverse quatre états successifs :

```text
    [ NEW ]
       │
       ▼ (première révision)
  [ LEARNING ] ◄──────────────────┐
       │                          │ (Échec : 'hard')
       ▼ (intervalle >= 1 jour)   │
   [ REVIEW ] ────────────────────┘
       │
       ▼ (intervalle >= 60 jours OU validation 'mastered')
  [ MASTERED ]
```

---

## 2. Échelle d'Intervalles Déterministes

Contrairement aux implémentations qui calculent des facteurs multiplicatifs flottants instables ($EF$), le moteur utilise une **grille d'intervalles déterministes à 7 paliers** (`SRS_INTERVALS`) :

| Niveau (`level`) | Durée (minutes) | Intervalle Réel | Libellé (FR / EN) | État Résultant |
| :---: | :---: | :---: | :---: | :---: |
| **0** | $10\text{ min}$ | 10 minutes | `10 min` | `learning` |
| **1** | $1\,440\text{ min}$ | 1 jour | `1 jour` / `1 day` | `review` |
| **2** | $4\,320\text{ min}$ | 3 jours | `3 jours` / `3 days` | `review` |
| **3** | $10\,080\text{ min}$ | 7 jours | `7 jours` / `7 days` | `review` |
| **4** | $20\,160\text{ min}$ | 14 jours | `14 jours` / `14 days` | `review` |
| **5** | $43\,200\text{ min}$ | 30 jours | `30 jours` / `30 days` | `review` |
| **6** | $86\,400\text{ min}$ | 60 jours | `60 jours` / `60 days` | `mastered` |

---

## 3. Matrice de Transition selon le Rating

Lorsqu'un apprenant consulte le verso d'une flashcard, il sélectionne l'une des 4 évaluations possibles (`SRSRating`) :

```typescript
export function previewNextInterval(
  currentLevel: number,
  rating: SRSRating
): { level: number; minutes: number; labelFr: string; labelEn: string; nextState: SRSState }
```

### Comportement des Évaluations :
1. **Difficile (`hard`)** :
   - Rétrogradation immédiate au **Niveau 0** (10 minutes).
   - L'état repasse en `learning`.
   - Incrément du compteur d'oublis (`lapses += 1`).
2. **Correct (`good`)** :
   - Progression régulière d'**1 palier** ($\text{niveau} = \min(6, \text{niveau} + 1)$).
   - L'état passe en `review` (ou `mastered` si niveau 6).
3. **Facile (`easy`)** :
   - Saut accéléré de **2 paliers** ($\text{niveau} = \min(6, \text{niveau} + 2)$).
   - L'état passe en `review` (ou `mastered` si niveau $\ge 5$).
4. **Maîtrisé (`mastered`)** :
   - Saut direct au **Niveau 6** (60 jours).
   - L'état devient instantanément `mastered`.

---

## 4. Calcul des Cartes Dues du Jour (`Due Cards`)

Une carte est considérée comme « due pour révision » lorsque la condition temporelle suivante est vérifiée :

$$\text{isDue} \iff (\text{state} \ne \text{'mastered'}) \land (\text{new Date}(\text{record.dueDate}) \le \text{now})$$

### Amorçage Initial Défensif (`initializeDefaultSRSRecords`)
Afin d'offrir une valeur immédiate à un nouvel utilisateur sans l'obliger à configurer manuellement un deck, le moteur :
1. Vérifie si des clés historiques existent déjà (`lpic1_mastered_cards`, `lpic1_review_cards`) et les migre.
2. Si aucun enregistrement n'existe, il sélectionne automatiquement les concepts fondamentaux des Topics 101 à 104 pour garantir **exactement 23 cartes prêtes pour la première session du jour**.

---

## 5. Persistance & Synchronisation Événementielle

Le moteur stocke son état complet dans `localStorage` sous la clé `lpi_srs_records_v1`.

### Schéma d'un Enregistrement (`SRSCardRecord`) :
```typescript
interface SRSCardRecord {
  cardId: number;
  state: 'new' | 'learning' | 'review' | 'mastered';
  intervalLevel: number;    // 0 à 6
  intervalLabel: string;    // ex: "3 jours"
  dueDate: string;          // ISO 8601 UTC
  lastReviewedAt?: string;  // ISO 8601 UTC
  repetitions: number;      // Nombre total de passages
  lapses: number;           // Nombre de régressions au niveau 0
  lastRating?: SRSRating;   // 'hard' | 'good' | 'easy' | 'mastered'
}
```

### Émission Réactive :
À chaque appel de `saveSRSRecords()`, deux événements sont émis sur la fenêtre globale :
```typescript
window.dispatchEvent(new Event('storage'));
window.dispatchEvent(new CustomEvent('srs_updated'));
```
Cela garantit que l'en-tête, le tableau de bord et la vue d'entraînement se rafraîchissent instantanément sans rechargement de page.
