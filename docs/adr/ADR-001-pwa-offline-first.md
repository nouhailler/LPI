# ADR-001 : Architecture PWA & Stratégie Offline-First

## Statut
**Accepté**

## Contexte
Les candidats aux certifications LPI préparent souvent leurs examens en déplacement (transports en commun, train, avion) ou dans des environnements d'apprentissage sans garantie de connectivité stable. Par ailleurs, imposer la création d'un compte cloud ou la dépendance à un serveur distant freine l'adoption immédiate et expose l'application à des pannes réseau.

## Décision
1. Construire l'application selon les standards **PWA (Progressive Web App)** :
   - Service Worker gérant la mise en cache préventive de l'ensemble des assets statiques (HTML, JavaScript, CSS, polices, données d'examen).
   - Web App Manifest configuré pour l'installation sur tous les OS (Desktop & Mobile).
2. Embarquer l'intégralité du corpus pédagogique (objectifs LPIC-1/2/3, 2 000+ flashcards, questions d'examen, glossaire) sous forme de modules TypeScript compilés dans le bundle statique.
3. Conserver l'état de progression de l'apprenant exclusivement dans le stockage local du navigateur (`localStorage`), avec clés préfixées et structures défensives.

## Conséquences
### Positives :
- **Autonomie totale** : l'application fonctionne sans aucune connexion internet dès son premier chargement.
- **Latence zéro** : aucune requête réseau requise pour naviguer entre les questions, générer des sessions SRS ou lancer des ateliers.
- **Confidentialité maximale** : les scores, erreurs et temps de réponse restent sur la machine de l'utilisateur.
- **Coût d'hébergement minimal** : distribution simple en fichiers statiques (CDN).

### Limitations :
- La synchronisation automatique et transparente entre plusieurs appareils n'est pas native (nécessite un export/import manuel de profil).
- Capacité de stockage limitée aux quotas du navigateur pour le domaine (suffisant pour le volume textuel de progression).
