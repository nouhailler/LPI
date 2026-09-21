# 16 — Stratégie de Test & Assurance Qualité (Testing)

> Ce document détaille l'approche de validation, la pyramide de tests, les points de contrôle critiques et les procédures d'assurance qualité pour **LPI Certification Prep**.

---

## 1. Philosophie & Pyramide de Tests

Dans une application d'entraînement aux certifications professionnelles, une erreur de calcul de score, une tolérance de commande défaillante ou un bug de date SRS nuit directement à la préparation du candidat.

Notre stratégie repose sur **quatre lignes de défense complémentaires** :

```text
               ┌───────────────────────────────┐
               │    E2E & Smoke Tests PWA      │  ◄ (Validation Offline & Parcours)
               ├───────────────────────────────┤
               │   Tests d'Intégration Labs    │  ◄ (Scénarios VirtualFS & Shell)
               ├───────────────────────────────┤
               │   Tests Unitaires Moteurs     │  ◄ (SRS, Weakness, Tolérance, 200–800)
               ├───────────────────────────────┤
               │   Typage Strict & Linting     │  ◄ (TypeScript 5.8 sans émission)
               └───────────────────────────────┘
```

---

## 2. Première Ligne : Typage Statique Strict & Linting

Le contrôle de type statique constitue le socle du projet. Il est exécuté à chaque modification via le script npm :

```bash
npm run lint    # Exécute : tsc --noEmit
```

### Règles Enforcées :
- `noImplicitAny: true` : Interdiction formelle du type `any` non contrôlé.
- **Vérification Exhaustive des Dictionnaires i18n** : `frTranslations` et `enTranslations` implémentent rigoureusement `TranslationDictionary` ; l'oubli d'une seule clé provoque un échec immédiat de compilation.
- **Conformité des Modèles LPI** : Les structures de questions, d'options et de flashcards doivent respecter strictement les interfaces définies dans `src/types.ts`.

---

## 3. Deuxième Ligne : Tests Unitaires des Moteurs Métiers

Les moteurs du projet étant des fonctions pures et déterministes (sans dépendance réseau), ils se prêtent à une couverture unitaire maximale via un runner moderne (ex: **Vitest**) :

### Suites de Tests Prioritaires :

#### A. Moteur SRS (`src/utils/srsEngine.ts`)
- **Vérification des 7 Paliers** :
  - Un rating `hard` doit systématiquement rétrograder la carte au niveau 0 (10 min).
  - Un rating `good` depuis le niveau 2 doit promouvoir au niveau 3 (7 jours).
  - Un rating `easy` depuis le niveau 4 doit sauter directement au niveau 6 (60 jours).
  - Un rating `mastered` doit immédiatement basculer l'état en `mastered`.
- **Calcul des Cartes Dues** :
  - Une carte dont la `dueDate` est antérieure à `Date.now()` doit figurer dans `getDueCards()`.
  - Une carte dont l'état est `mastered` ne doit jamais être considérée comme due.

#### B. Moteur de Tolérance aux Commandes (`src/utils/commandTolerance.ts`)
- **Normalisation** :
  - `$ tar -xvf archive.tar` $\to$ suppression du prompt `$ `, résultat valide.
  - `chmod    755   test.sh;` $\to$ compression des espaces, suppression du point-virgule, résultat valide.
- **Permutation des Drapeaux Courts** :
  - `tar -xvf foo.tar` vs `tar -vxf foo.tar` vs `tar -x -v -f foo.tar` $\to$ doivent tous être reconnus comme strictement équivalents.
- **Tolérance de Typo (Levenshtein)** :
  - `chmdo 755 file` vs `chmod 755 file` (distance 2) $\to$ doit remonter l'avertissement de coquille proche.

#### C. Calcul du Score Officiel Estimé (`src/utils/examAnalytics.ts`)
- **Échelle 200 à 800** :
  - 0% de réussite pondérée $\to$ score exact 200.
  - 100% de réussite pondérée $\to$ score exact 800.
  - Seuil de 500 points atteint à partir de 50% de score pondéré.
  - Prise en compte rigoureuse des coefficients LPI (`weight: 1..10`).

---

## 4. Troisième Ligne : Validation des Scénarios de Labs (`VirtualFs`)

Les ateliers pratiques valident l'état microscopique du système de fichiers simulé. Leurs validateurs doivent être éprouvés pour parer aux faux positifs et faux négatifs :

```typescript
describe('VirtualFS Lab Scenarios', () => {
  it('valide la sécurisation de backup.sh par plusieurs syntaxes équivalentes', () => {
    const fs = createInitialFs();
    const shell = new ShellInterpreter(fs);

    // Cas 1 : Notation octale
    shell.execute('chmod 750 /home/student/backup.sh');
    shell.execute('chown student:developers /home/student/backup.sh');
    expect(scenarioBackup.validate(fs).isComplete).toBe(true);

    // Cas 2 : Notation symbolique équivalente
    fs.reset();
    shell.execute('chmod u=rwx,g=rx,o= /home/student/backup.sh');
    shell.execute('chown student:developers /home/student/backup.sh');
    expect(scenarioBackup.validate(fs).isComplete).toBe(true);
  });
});
```

---

## 5. Quatrième Ligne : Tests E2E & Smoke Tests PWA

Validation des parcours critiques en conditions réelles avec **Playwright** :
1. **Test de Premier Démarrage (Onboarding)** :
   - Chargement de la page d'accueil sans état local préalable.
   - Présentation de la modal d'onboarding et du diagnostic initial.
2. **Test Hors-Ligne (Offline Emulation)** :
   - Coupure de la connectivité réseau du navigateur virtuel (`network.setOffline(true)`).
   - Navigation entre les modules, passage d'une session de flashcards, exécution de commandes dans le terminal virtuel.
   - Aucune requête HTTP réseau ne doit échouer ni bloquer l'interface.
3. **Test de Maintien de l'État après Mise à Jour** :
   - Simulation de l'arrivée d'une nouvelle version PWA (`SKIP_WAITING`).
   - Rechargement de la page : les enregistrements SRS et l'historique d'examens doivent être rigoureusement intacts.

---

## 6. Critères de Validation (Quality Gates)

Avant tout déploiement en production ou fusion de branche :
- [x] **Zero Type Error** : `tsc --noEmit` retourne un code 0 sans avertissement.
- [x] **Compilation de Production** : `vite build` génère les fichiers statiques sans anomalie d'importation circulaire.
- [x] **Couverture Bilingue** : 100% des clés `TranslationDictionary` traduites en FR et EN.
- [x] **Isolation Storage** : Aucune écriture dans `localStorage` sans bloc `try/catch`.
