# 10 — Moteur d'Examens Blancs (Exam Engine)

> Ce document détaille l'implémentation du moteur de simulation d'examens LPI de **LPI Certification Prep**, articulé autour de `src/utils/examAnalytics.ts`, `src/utils/commandTolerance.ts` et `src/data/practiceExamsData.ts`.

---

## 1. Caractéristiques d'un Examen LPI

Le moteur reproduit fidèlement le format et les contraintes réelles des examens du Linux Professional Institute :

| Paramètre | Spécification LPI Officielle | Implémentation dans l'App |
| :--- | :--- | :--- |
| **Volume de Questions** | 60 questions par examen | 60 questions sélectionnées selon le référentiel |
| **Durée Épreuve** | 90 minutes (5 400 secondes) | Chronomètre interactif avec alertes visuelles de temps |
| **Typologie** | Mixte : QCM & Saisie directe (*Fill-in-the-blank*) | QCM simple, QCM multiple et champs textuels de commande |
| **Échelle de Notation** | **200 à 800 points** | Calcul du score LPI estimé (`estimatedLpiScore`) |
| **Seuil de Réussite** | **500 points** (~65% à 70% selon pondération) | Seuil paramétré (`passThresholdPct: 65%`) |
| **Pondération des Objectifs** | Coefficients de 1 à 10 par sous-objectif | Score pondéré (`weightedScorePct`) |

---

## 2. Calcul du Score Officiel Estimé (Échelle 200–800)

Le score officiel LPI ne correspond pas à un simple pourcentage arithmétique. Il tient compte du coefficient (`weight`) assigné à chaque objectif dans le cursus officiel LPI.

### Formule de Calcul du Score Pondéré :

$$\text{weightedScorePct} = \frac{\sum_{i=1}^{N} \text{isCorrect}_i \times \text{weight}_i}{\sum_{i=1}^{N} \text{weight}_i} \times 100$$

### Conversion sur l'Échelle LPI (200 à 800) :

$$\text{estimatedLpiScore} = \text{round}\left(200 + \frac{\text{weightedScorePct}}{100} \times 600\right)$$

- **Score 200** : 0% de réussite.
- **Score 500** : Seuil officiel de certification (passé si $\ge 500$).
- **Score 800** : Performance parfaite (100%).

---

## 3. Moteur de Tolérance aux Commandes (`commandTolerance.ts`)

Pour les questions de type saisie libre (*Fill-in-the-blank*), l'apprenant doit taper une commande brute.
Le moteur applique une **validation syntaxique intelligente** évitant les faux négatifs injustes :

```typescript
export function validateCommandTolerance(
  userInput: string,
  expectedAnswers: string[],
  caseSensitive: boolean = false
): ToleranceValidationResult
```

### Règles de Tolérance Appliquées :
1. **Suppression des Prompts Shell** : Élimination automatique des préfixes classiques de terminal au début de la saisie (`$ `, `# `, `> `).
2. **Normalisation des Espaces et Ponctuation** : Compression des espaces multiples en un espace unique, suppression des points-virgules finaux facultatifs (`;`).
3. **Suppression des Guillemets Englobants** : Tolérance si l'utilisateur englobe sa commande entre guillemets doubles ou simples.
4. **Permutation Libre des Drapeaux Courts (`extractFlagsAndArgs`)** :
   - `tar -xvf archive.tar` $\equiv$ `tar -vxf archive.tar` $\equiv$ `tar -x -v -f archive.tar`
   - Le moteur décompose les combinaisons de drapeaux courts en ensembles (`Set<string>`) pour accepter n'importe quel ordre de paramètres.
5. **Détection des Frappes Proches (*Near-Misses*) via Levenshtein** :
   - Si la réponse est incorrecte mais que la distance de Levenshtein est $\le 2$ (ex: `chmdo 755 file` au lieu de `chmod 755 file`), le système signale une coquille de frappe pour encourager l'apprenant.

---

## 4. Analyse Comportementale & Facteurs de Risque

À la soumission de l'épreuve, `examAnalytics.ts` produit un rapport diagnostique complet pour aider le candidat à comprendre sa posture d'examen :

### Métriques Comportementales Clés :
- **Erreurs Précipitées (`rushedErrorsCount`)** : Nombre de questions répondues en **moins de 15 secondes** s'étant soldées par une erreur. Le moteur alerte sur le risque de précipitation et le piège des lectures diagonales.
- **Questions Bloquantes (`stalledQuestionsCount`)** : Questions ayant mobilisé **plus de 90 secondes**. Le moteur conseille l'utilisation du marquage pour examen ultérieur (*Flag for review*).
- **Questions Marquées (`flaggedCount` & `flaggedErrorsCount`)** : Mesure de l'intuition du candidat et de sa capacité à auto-évaluer son doute.

### Modèle d'un Facteur de Risque (`ExamRiskFactor`) :
```typescript
interface ExamRiskFactor {
  id: string;
  severity: 'critical' | 'warning' | 'advisory';
  title: string;
  evidence: string;      // Preuve factuelle (ex: "Temps moyen < 12s sur 4 erreurs")
  impact: string;        // Impact potentiel le jour de l'examen officiel
  recommendation: string;// Conseil d'ajustement comportemental
  domainName?: string;
}
```

---

## 5. Plan d'Action Personnalisé

Le moteur génère automatiquement les 3 actions prioritaires post-examen :
1. **Révision ciblée du domaine le plus pénalisant** (Topic avec le plus fort coefficient et le score le plus bas).
2. **Injection des questions ratées** dans le deck SRS pour un ancrage mémoriel à 10 min et 1 jour.
3. **Session de lab pratique** sur le terminal virtuel pour les notions impliquant de la syntaxe de configuration complexe.
