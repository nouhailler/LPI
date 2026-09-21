# 08 — Moteur de Détection des Faiblesses (Weakness Engine)

> Ce document détaille le fonctionnement du moteur heuristique de détection et de remédiation des lacunes de **LPI Certification Prep**, situé dans `src/utils/weaknessEngine.ts`.

---

## 1. Philosophie & Rôle

Le **Weakness Engine** ne se limite pas à comptabiliser un pourcentage global de bonnes réponses. Son rôle est de détecter les **angles morts cognitifs** et les faux sentiments de maîtrise chez le candidat avant le jour de l'examen officiel.

Il surveille cinq types de signaux de performance :
1. **Erreurs directes (`totalErrors`)** : réponses incorrectes répétées sur une même sous-compétence (ex: 7 erreurs sur le DNS).
2. **Coups de chance suspectés (`luckyGuessesCount`)** : bonne réponse obtenue avec un temps de latence anormalement élevé ($> 90\text{ secondes}$) ou signalée avec un niveau de confiance faible.
3. **Abandons & Sauts (`skippedCount`)** : questions évitées par manque d'assurance sur le sujet.
4. **Échecs d'Ateliers Pratiques (`failedLabsCount`)** : incapacité à résoudre un incident ou à appliquer des permissions dans le terminal virtuel.
5. **Sous-thèmes non testés (`untestedSubtopicsCount`)** : lacunes potentielles par absence totale d'évaluation.

---

## 2. Les 7 Domaines Analysés

Le moteur agrège les résultats autour des grands piliers du cursus Linux Professionnal Institute :

| Identifiant (`id`) | Intitulé | Domaines LPI Couverts |
| :--- | :--- | :---: |
| `networking` | Réseau & Protocoles | Topic 109 / Topic 207-212 (DNS, routage, IPv6, ports) |
| `scripting` | Scripts Shell & Automatisation | Topic 105 (Bash, boucles, tests, sed, awk, quoting) |
| `security` | Sécurité & Droits | Topic 110 / Topic 303 (SELinux, SUID/SGID, SSH, clés) |
| `filesystems` | Disques & Systèmes de Fichiers | Topic 104 (fstab, inodes, UUID, LVM, swap, quotas) |
| `commands` | Commandes GNU & Traitement de Texte | Topic 103 (find, xargs, redirections, regex, tar) |
| `boot` | Amorçage & Gestionnaires d'Init | Topic 101/102 (GRUB2, UEFI, systemd, runlevels) |
| `packages` | Gestion des Paquets Logiciels | Topic 102 (Debian dpkg/apt, RPM/yum/dnf, bibliothèques partagées) |

---

## 3. Échelle de Criticité & Seuils

Chaque domaine est classé dynamiquement selon son taux de maîtrise global (`masteryPct`) :

```typescript
function updateDomainStatus(domain: WeaknessDomainStats): void {
  if (domain.masteryPct < 50) {
    domain.status = 'critical';   // 🚨 Alerte rouge - Risque d'échec à l'examen
  } else if (domain.masteryPct < 70) {
    domain.status = 'moderate';   // ⚠️ Point de vigilance - Connaissances partielles
  } else if (domain.masteryPct < 85) {
    domain.status = 'review';     // 🟡 En cours de consolidation
  } else {
    domain.status = 'solid';      // 🟢 Acquis solide (>= 85%)
  }
}
```

---

## 4. Génération de Sessions d'Entraînement Ciblées

La méthode `generateWeaknessTrainingSession(targetDomainId?)` extrait un sous-ensemble sur-mesure de questions à haute valeur pédagogique :

1. **Si un domaine spécifique est sélectionné** : les questions associées aux pièges identifiés de ce domaine sont tirées au sort.
2. **Si aucun domaine n'est spécifié** : le moteur identifie les **3 domaines les plus faibles** (ex: Réseau 41%, Scripts 48%, Sécurité 53%) et assemble un mix prioritaire de 8 questions combinant :
   - Des questions re-testant d'anciennes erreurs commises (`isRetestOfPastMistake: true`).
   - Des questions sur des concepts adjacents piégeux (ex: syntaxe `restorecon` pour SELinux ou quotes simples vs doubles en Bash).

---

## 5. Algorithme de Réévaluation en Temps Réel

Lorsqu'un apprenant s'entraîne sur ses faiblesses, chaque réponse recalcule immédiatement la maîtrise du domaine via `applyWeaknessTrainingResult()` :

```text
                     ┌───────────────────────────────┐
                     │   Réponse à la question       │
                     └───────────────┬───────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
             [ BONNE RÉPONSE ]                 [ MAUVAISE RÉPONSE ]
                    │                                 │
            ┌───────┴───────┐                         ▼
            │               │                 • Score : -2%
     [ CONFIANT ]     [ HÉSITANT ]            • Erreurs : +1
            │               │
            ▼               ▼
     • Score : +5%    • Score : +2%
     • Erreurs : -1   • Sans bonus vitesse
     • Lucky guess résolu
```

Ce mécanisme encourage l'apprenant : quelques réponses réussies avec certitude effacent progressivement le statut critique du domaine sans nécessiter des centaines de questions.

---

## 6. Persistance des Données

L'état du moteur est sérialisé sous la clé `lpi_weakness_engine_data_v2`.
En cas de première ouverture, l'application injecte un jeu d'évaluation représentatif initial (`INITIAL_WEAKNESS_REPORT`) permettant d'illustrer immédiatement la matrice des faiblesses sur les sujets classiquement les plus redoutés de l'examen LPIC-1 (DNS local, expressions régulières et permissions spéciales).
