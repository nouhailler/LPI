# 15 — Stratégie de Stockage Local & Persistance (Storage)

> Ce document formalise les contrats de stockage local, l'isolation des clés `lpi_*`, la tolérance aux corruptions, le format d'export/import de données et les perspectives de migration de **LPI Certification Prep**.

---

## 1. Principes & Gouvernance du Stockage

L'application repose sur le stockage local du navigateur (`localStorage`) pour satisfaire son engagement **100 % hors-ligne**. Cette approche exige une rigueur stricte pour éviter tout écrasement accidentel ou dépassement de quota.

### Règles d'Or :
1. **Préfixage Obligatoire (`lpi_*`)** : Aucune clé ne doit polluer le namespace global sans le préfixe `lpi_` (ou les clés d'historique en cours de migration).
2. **Encapsulation Défensive** : Tout appel `localStorage.getItem()` ou `localStorage.setItem()` doit être obligatoirement encapsulé dans un bloc `try / catch` pour gérer le mode Navigation Privée d'iOS/Safari et les dépassements de quota (`QuotaExceededError`).
3. **Migration & Versioning Intégré** : Les clés intègrent leur numéro de version majeur dans leur nom (ex: `_v1`, `_v2`) pour permettre des montées de schéma transparentes.

---

## 2. Registre des Clés de Persistance

| Clé Stockage | Rôle | Format | Taille Moyenne | Fréquence d'Écriture |
| :--- | :--- | :---: | :---: | :---: |
| `lpi_srs_records_v1` | Machine à états du SRS (cartes dues, niveaux 0-6, répétitions, lapses) | `Record<string, SRSCardRecord>` (JSON) | 15 à 45 Ko | À chaque carte validée |
| `lpi_weakness_engine_data_v2` | Métriques des 7 domaines de faiblesses, alertes critiques | `WeaknessEngineReport` (JSON) | 5 à 12 Ko | À chaque fin d'entraînement ou examen |
| `lpi_prep_language` | Préférence linguistique de l'interface | `'fr' \| 'en'` | 2 octets | Lors du changement de langue |
| `lpi_prep_update_settings` | Préférences de vérification PWA (intervalle, auto-check) | `UpdateSettings` (JSON) | 120 octets | Lors d'une modification des réglages |
| `lpi_onboarding_completed` | Indicateur de premier lancement franchi | `'true'` | 4 octets | Une seule fois à l'initialisation |
| `lpi_diagnostic_seen` | Indicateur de passation de l'évaluation diagnostique | `'true'` | 4 octets | Une seule fois à l'initialisation |
| `lpi_exam_history` | Historique des sessions d'examen blanc terminées | `ExamSessionResult[]` (JSON) | 20 à 80 Ko | À la soumission d'une simulation |
| `lpic1_mastered_cards` *(Legacy)* | Ancienne liste d'identifiants de cartes maîtrisées | `number[]` (JSON) | Déprécié | Migré vers `lpi_srs_records_v1` |

---

## 3. Exemple d'Encapsulation Défensive

```typescript
export function safeGetStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[Storage] Erreur de lecture de la clé "${key}":`, error);
    return defaultValue;
  }
}

export function safeSetStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Impossible d'écrire la clé "${key}" (quota plein ou restriction):`, error);
    return false;
  }
}
```

---

## 4. Spécification d'Export / Import de Profil (JSON Backup)

Afin de permettre la synchronisation manuelle entre plusieurs ordinateurs (ou la sauvegarde préventive avant de vider le cache du navigateur), l'application propose un schéma d'échange JSON unifié :

### Schéma `LPIProfileBackupV1` :
```json
{
  "schemaVersion": "1.0.0",
  "exportedAt": "2026-09-21T10:15:30.000Z",
  "appVersion": "2.4.0",
  "data": {
    "language": "fr",
    "onboardingCompleted": true,
    "srsRecords": {
      "card-101-1": {
        "cardId": 101,
        "state": "review",
        "intervalLevel": 3,
        "dueDate": "2026-09-28T10:00:00.000Z",
        "repetitions": 4,
        "lapses": 0
      }
    },
    "weaknessReport": {
      "overallReadinessScore": 76,
      "domains": []
    },
    "examHistory": []
  }
}
```

### Règles de Restauration :
1. **Validation du Schéma** : Contrôle de la présence de `schemaVersion === "1.0.0"` et des nœuds requis.
2. **Assainissement** : Élimination des identifiants non valides ou de dates corrompues.
3. **Fusion / Écrasement Contrôlé** : Proposition à l'utilisateur d'écraser la progression locale ou de fusionner les enregistrements SRS en conservant le niveau d'intervalle le plus élevé.

---

## 5. Perspectives d'Évolution (Roadmap Stockage)

- **V1 (Actuel)** : `localStorage` synchrone, hautement réactif, suffisant pour l'ensemble des données textuelles (< 500 Ko sur un quota habituel de 5 à 10 Mo par domaine).
- **V2 (Planifié)** : Introduction d'une couche d'abstraction asynchrone type `idb-keyval` (IndexedDB) pour stocker les enregistrements d'historique de terminal volumineux, les sorties complètes de sessions de labs et les captures d'écran de progression sans impacter le thread principal.
