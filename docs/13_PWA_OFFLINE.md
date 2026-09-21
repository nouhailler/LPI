# 13 — Architecture PWA & Stratégie Offline-First

> Ce document détaille l'implémentation Progressive Web App (PWA) de **LPI Certification Prep**, son Service Worker personnalisé, sa stratégie de cache à deux vitesses et son mécanisme de mise à jour transparente sans perte de progression.

---

## 1. Principes & Exigences Fondamentales

L'application a été conçue dès son origine selon le paradigme **Offline-First Absolu** :
- **Fonctionnement Sans Connexion** : Une fois installée ou chargée une première fois, l'intégralité des 2 000+ flashcards, des questions d'examen et du terminal virtuel fonctionne en totale coupure réseau (mode avion, transports, zones blanches).
- **Zéro Dépendance Serveur Critique** : Aucun backend n'est requis pour exécuter le code ou persister les résultats.
- **Préservation Intégrale de l'État** : Les mises à jour de version de l'application s'appliquent sans jamais purger ni corrompre le stockage local de l'étudiant.

---

## 2. Le Web App Manifest (`public/manifest.json`)

Le fichier de manifeste configure l'application pour une installation native multiplateforme (Desktop Windows/macOS/Linux, Tablettes, Android, iOS) :

```json
{
  "name": "LPI Certification Prep",
  "short_name": "LPI Prep",
  "description": "Plateforme complète de préparation aux certifications LPIC-1, LPIC-2 et LPIC-3.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fff8f2",
  "theme_color": "#201b11",
  "orientation": "any",
  "icons": [
    {
      "src": "/app-logo.jpg",
      "sizes": "192x192",
      "type": "image/jpeg",
      "purpose": "any maskable"
    },
    {
      "src": "/app-logo.jpg",
      "sizes": "512x512",
      "type": "image/jpeg",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education", "productivity", "utilities"]
}
```

### Paramètres Notables :
- `display: "standalone"` : Supprime la barre d'adresse et les contrôles du navigateur hôte pour une immersion de bureau native.
- `theme_color: "#201b11"` : Teinte sombre chaleureuse alignée avec la palette de l'en-tête de l'application.
- `purpose: "any maskable"` : Permet aux OS mobiles de découper l'icône selon leurs gabarits propriétaires (cercles, squircles, carrés arrondis).

---

## 3. Le Service Worker (`public/sw.js`)

Le Service Worker implémente une stratégie de cache hybride hautement optimisée :

```text
                                 Requête Réseau
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
           [ url === '/version.json' ]             [ Autre Ressource ]
                    │                                     │
                    ▼                                     ▼
             NETWORK-FIRST                     STALE-WHILE-REVALIDATE
       (Détection d'update immédiate)                     │
                                                          ▼
                                              1. Retourner le Cache instantané
                                              2. Mettre à jour en tâche de fond
```

### 1. Cycle de Vie & Installation (`install` & `activate`) :
- `self.skipWaiting()` : Le nouveau Service Worker prend la main immédiatement sans attendre la fermeture de tous les onglets actifs.
- **Purge Sélective des Anciens Caches** :
  ```javascript
  caches.keys().then((names) => {
    return Promise.all(
      names.map((name) => {
        if (name !== CACHE_NAME) return caches.delete(name);
      })
    );
  })
  ```
  Les caches obsolètes sont éliminés pour libérer l'espace disque du périphérique sans impacter `localStorage`.

### 2. Stratégie de Distribution Réseau (`fetch`) :
- **`/version.json` (Network-First avec Fallback Cache)** : Cette ressource critique n'est jamais servie depuis le cache persistant tant que le réseau répond, permettant de détecter les nouvelles releases en temps réel.
- **Navigation SPA (`mode === 'navigate'`)** : En cas de rechargement ou de navigation interne hors-ligne, le worker sert `/index.html` en secours, garantissant l'accès à l'application.
- **Ressources Statiques (`stale-while-revalidate`)** : Les assets (scripts, styles, polices, images) sont servis depuis le cache local à latence zéro ($< 5\text{ ms}$), tandis qu'une copie fraîche est téléchargée en tâche de fond pour la session suivante.

---

## 4. Service de Détection & Déploiement des Mises à Jour (`updateService.ts`)

Le service client coordonne la détection proactive et l'expérience utilisateur de mise à jour :

```typescript
export interface VersionInfo {
  version: string;
  releaseDate: string;
  buildTime: string;
  changelog: string[];
}
```

### Flux d'Exécution :
1. **Contrôle Périodique Automatisé** : Un intervalle paramétrable (15 minutes par défaut) effectue une requête légère `HEAD` ou `GET /version.json?_t=<timestamp>`.
2. **Comparaison Sémantique** : Si la version distante diffère de `CURRENT_APP_VERSION` (ex: `2.4.1` vs `2.4.0`), le service notifie les composants abonnés via `subscribeToUpdateEvents`.
3. **Bannière Non-Intrusive** : Une barre d'information discrète signale la disponibilité de la mise à jour avec affichage du changelog.
4. **Activation Atomique (`applyUpdateAndReload`)** :
   ```typescript
   export function applyUpdateAndReload() {
     if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
       navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
     }
     window.location.reload();
   }
   ```

---

## 5. Résumé des Avantages Opérationnels

| Caractéristique | Comportement Standard Web | Implémentation LPI Certification Prep |
| :--- | :--- | :--- |
| **Accès Hors-Ligne** | Page d'erreur "No Internet" | **100 % Fonctionnel** (terminal, labs, examens, SRS) |
| **Latence au Démarrage** | Dépendante de la connexion réseau | **Instantanée** (chargement local complet depuis le cache) |
| **Données de Progression** | Dépendantes d'une API backend | **Stockées localement**, préservées après mise à jour |
| **Installation** | Nécessite un magasin d'apps (App Store) | **Installation directe 1-clic** sur le bureau ou l'accueil |
