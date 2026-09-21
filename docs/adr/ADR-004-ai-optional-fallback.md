# ADR-004 : IA Générative Optionnelle & Repli Pédagogique Déterministe

## Statut
**Accepté**

## Contexte
L'apprentissage de concepts Linux denses (ex: `umask`, hiérarchie des processus `systemd`, bit Sticky, permissions octales, encapsulation DNS) bénéficie grandement d'explications sous plusieurs angles : analogie de la vie courante, décomposition pas-à-pas ou vulgarisation pour débutant.
L'intégration de modèles d'IA générative (comme Google Gemini) permet d'engager des explications dynamiques sur-mesure. Néanmoins, imposer une dépendance réseau à une API d'IA contredirait frontalement le pilier **100 % Offline PWA** de l'application et bloquerait les étudiants révisant sans connexion ou sans clé d'API.

## Décision
1. **L'IA Générative est un Enrichissement Optionnel** :
   Aucun parcours pédagogique fondamental, examen blanc ou laboratoire pratique ne doit dépendre d'un appel à un modèle d'IA pour fonctionner ou être validé.
2. **Corpus Pédagogique Local Exhaustif (Fallback Déterministe)** :
   Un dictionnaire complet d'explications alternatives prédéfinies (`ExplainModal`, `prodTraps`, métaphores système) est embarqué localement en pur TypeScript.
3. **Comportement Dégradé Transparent** :
   - Si l'environnement dispose d'une connexion et des capacités requises : l'assistant propose des reformulations personnalisées.
   - Si l'utilisateur est hors-ligne ou qu'aucune clé n'est fournie : l'application bascule automatiquement et silencieusement sur le corpus local déterministe pré-calculé, sans afficher de message d'erreur bloquant.

## Conséquences
### Positives :
- Disponibilité continue de l'ensemble de la valeur pédagogique en toute circonstance (mode avion, tunnels, coupure serveur).
- Zéro friction à l'embarquement : l'apprenant n'est jamais invité de force à créer une clé API ou un compte pour étudier.
- Latence immédiate pour 99% des interactions d'étude.

### Limitations :
- Les explications déterministes locales sont limitées au catalogue rédigé par l'équipe pédagogique et n'offrent pas une liberté conversationnelle infinie hors-ligne.
