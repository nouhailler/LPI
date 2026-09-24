# 00 — Guide Fonctionnel des Écrans & Parcours Utilisateur

> Ce document fournit la **spécification fonctionnelle complète écran par écran** de la plateforme **LPI Certification Prep**. Il détaille pour chaque vue son rôle principal, ses fonctionnalités clés, ses interactions et sa valeur pédagogique dans le parcours de préparation aux certifications Linux.

---

## 1. Ergonomie Générale & Structure de Navigation

L'application repose sur une architecture d'apprentissage adaptative unifiée, accessible sur desktop comme sur mobile (100% responsive PWA) :

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  EN-TÊTE SUPÉRIEUR (Header)                                                            │
│  [Logo LPI] [Onglets Écrans] [Recherche Globale] [Langue FR/EN] [Thème] [Menu ☰]      │
├─────────────────┬──────────────────────────────────────────────────────────────────────┤
│ BARRE LATÉRALE  │ ZONE PRINCIPALE DE L'ÉCRAN ACTIF (Main Content Area)                 │
│ (Desktop)       │                                                                      │
│ • Tableau Bord  │ Affichage plein écran du module sélectionné                          │
│ • Curriculum    │ (Tableau de bord, Objectifs, Flashcards, Examens, Labs...)           │
│ • Parcours      │                                                                      │
│ • Flashcards    │                                                                      │
│ • Examens QCM   │                                                                      │
│ • Glossaire     │                                                                      │
│ • Labs & Shell  │                                                                      │
│ • Explique 💡   │                                                                      │
└─────────────────┴──────────────────────────────────────────────────────────────────────┘
```

### Tableau Synthétique des Écrans Principaux

| Identifiant | Intitulé de l'Écran | Rôle Pédagogique Majeur | Type d'Interaction |
| :--- | :--- | :--- | :--- |
| `dashboard` | **Tableau de Bord** | Pilotage global, score de préparation et détection des faiblesses | Synthèse visuelle & Raccourcis |
| `learning` | **Curriculum Officiel** | Étude hiérarchique du référentiel LPI (LPIC-1, 2, 3) et fiches objectifs | Exploration & Fiches de cours |
| `path` | **Parcours Thématiques** | Apprentissage transversal par domaine métier (Sécurité, Réseau...) | Paliers progressifs jalonnés |
| `flashcards` | **Répétition Espacée SRS** | Mémorisation durable des commandes, options et fichiers clés | Auto-évaluation active (Flip Card) |
| `practice` | **Simulateur d'Examens** | Entraînement en conditions réelles (chronométré, QCM & Fill-in-the-blank) | Évaluation sommative & Correction |
| `glossary` | **Glossaire & Explorateur** | Dictionnaire technique, syntaxe des commandes et graphe conceptuel | Recherche & Décomposition visuelle |
| `training` | **Hub d'Ateliers & Shell** | Pratique réelle sur Terminal Unix simulé et mini-jeux de dépannage | Saisie de commandes & Résolution |

---

## 2. Écran 1 : Tableau de Bord & Vue d'Ensemble (`dashboard`)

### 2.1. Rôle et Objectif
Le **Tableau de Bord** constitue la tour de contrôle de l'étudiant. Il donne une vision instantanée et sans fard de son état de préparation pour l'examen officiel du LPI, tout en guidant sa prochaine action d'apprentissage la plus efficace.

### 2.2. Fonctionnalités Clés
- **Score de Préparation Global (Readiness Score)** : Jauge dynamique de 0 à 100 % calculée à partir des résultats d'examens blancs, du volume de cartes maîtrisées en SRS et des ateliers complétés. Un indicateur explicite avertit l'étudiant dès qu'il franchit le seuil recommandé de 85 %.
- **Widget du Moteur de Faiblesses (Weakness Engine)** : Analyse automatique des erreurs commises pour identifier les 3 sous-objectifs les plus fragiles (ex: *Permissions & umask*, *Gestion des partitions LVM*). Un bouton **« Travailler cette lacune »** ouvre directement un atelier ciblé.
- **Indicateur de Régularité (Daily Streak)** : Compteur de jours consécutifs d'entraînement avec calendrier d'assiduité pour encourager la constance quotidienne.
- **Métriques d'Apprentissage Consolidées** :
  - Nombre total de flashcards passées au statut *Maîtrisé*.
  - Nombre de questions d'examen résolues et taux de réussite moyen.
  - Labs terminaux complétés avec succès.
- **Accès Rapides 1-Clic** :
  - *« Révision SRS du Jour »* : Lance la pile de cartes échues aujourd'hui.
  - *« Passer un Examen Blanc »* : Démarre une session de test chronométrée.
  - *« Examen Diagnostique »* : Évalue le niveau initial pour étalonner le profil.
  - *« Guide Officiel LPI »* : Ouvre la modale d'information sur les examens officiels.

---

## 3. Écran 2 : Curriculum Officiel & Objectifs d'Étude (`learning`)

### 3.1. Rôle et Objectif
Cet écran transpose l'intégralité du programme officiel du **Linux Professional Institute** dans une interface hiérarchique et interactive, permettant à l'étudiant de structurer son acquisition des savoirs théoriques.

### 3.2. Fonctionnalités Clés
- **Sélecteur de Certification & d'Examen** :
  - **LPIC-1** : Examen 101 (Architecture système, installation, commandes GNU/Unix, périphériques) et Examen 102 (Shells, interfaces, tâches administratives, services réseau essentiels, sécurité).
  - **LPIC-2** : Examen 201 (Noyau, démarrage, stockage avancé, réseau) et Examen 202 (Serveurs BIND, Apache, Nginx, Samba, NFS, Postfix).
  - **LPIC-3** : Certifications de spécialisation (300 Mixed Environment, 303 Security, 305 Virtualization & Containerization, 306 High Availability & Storage).
- **Pondération Officielle (Weights)** : Chaque topic affiche son coefficient officiel LPI (de 1 à 5). Plus le poids est élevé, plus le nombre de questions issues de cet objectif à l'examen officiel sera important.
- **Arborescence Déroulante par Sous-Objectif** :
  - Intitulé officiel et description des attentes de l'examen.
  - Liste des **fichiers clés** (`/etc/fstab`, `/etc/resolv.conf`, `/etc/shadow`...).
  - Liste des **commandes requises** (`systemctl`, `chmod`, `fdisk`, `tar`, `ip`...).
  - Liste des **termes et concepts théoriques** (GUID, UUID, Inodes, Runlevels).
- **Fiche d'Étude Approfondie (In-Depth Study Modal)** : En cliquant sur un sous-objectif, une fiche synthétique s'ouvre avec un résumé concis, les pièges classiques et un bouton pour s'entraîner spécifiquement sur les cartes de ce topic.

---

## 4. Écran 3 : Mon parcours LPIC & Roadmap de Certification (`path`)

### 4.1. Rôle et Objectif
Cet écran constitue le véritable **moteur d'entraînement guidé et personnalisé** de l'application. Il donne du sens et un fil conducteur direct à toutes les fonctionnalités existantes (Syllabus, Flashcards SRS, Labs virtuels, Simulateur d'examens). L'utilisateur n'est plus livré à lui-même : il définit son cap et l'application calcule sa feuille de route journalière adaptative.

### 4.2. Fonctionnalités Clés
- **🎯 Moteur Personnalisé (« Mon parcours LPIC »)** :
  - **Flux structuré en 5 étapes** :
    $$\text{Objectif} \longrightarrow \text{Diagnostic} \longrightarrow \text{Parcours personnalisé} \longrightarrow \text{Entraînement quotidien} \longrightarrow \text{Examens blancs}$$
  - **Sélection de l'Objectif de Certification** : Choix libre parmi LPIC-1 (101-500, 102-500 ou cursus complet 101+102), LPIC-2 (201, 202 ou cursus complet), LPIC-3 (Spécialités 300, 303, 305, 306) et Linux Essentials.
  - **Diagnostic & Étalonnage du Niveau Initial** : Matrice de compétences sur 6 domaines (Architecture, Commandes, Filesystems, Bash, Réseau, Sécurité) pondérant le niveau de départ (ex: 63 %).
  - **Contraintes de Rythme Personnalisées** : Choix du temps disponible par jour (15 min, 30 min, 45 min, 60 min) et de la date cible de passage d'examen (échéance calendaire).
  - **Programme Quotidien en 4 Micro-Tâches Calibrées (« Aujourd'hui »)** :
    - 📚 **Révision ciblée** d'un objectif prioritaire (ex: *101.2 — BIOS/UEFI & Boot Sequence*).
    - 🧠 **12 Flashcards SRS ciblées** sur le thème pour ancrage mnémotechnique.
    - 💻 **1 Mini-lab pratique** en terminal virtuel avec validation de scénario en temps réel.
    - 📝 **10 Questions ciblées** de validation pour évaluer l'assimilation.
  - **Indicateurs & Paliers de Maturité** : Progression globale estimée (%), jours restants, objectifs acquis et badge d'état (*Intensive Training*, *On Track*, *Ready for Exam*).
- **Parcours Métier Thématiques (21 Roadmaps transverses)** : Approche par métier (Fichiers & Droits, Démarrage & Noyau, Stockage & FS, Réseau & Services, Sécurité & Chiffrement) avec étoiles de maîtrise.
- **Learning Map Interactive** : Arborescence complète des nœuds du cursus LPI avec visualisation graphique de la progression.
- **Paliers & Règles Officielles LPI** : Documentation des prérequis (ex: obtention de LPIC-1 avant délivrance du titre LPIC-2) et pondérations des topics.

---

## 5. Écran 4 : Flashcards & Répétition Espacée SRS (`flashcards`)

### 5.1. Rôle et Objectif
L'écran Flashcards est le moteur de **mémorisation active** de l'application. Grâce à l'algorithme de répétition espacée (SRS dérivé de Leitner et SM-2), il garantit que les commandes, drapeaux et fichiers appris ne soient jamais oubliés.

### 5.2. Fonctionnalités Clés
- **Mécanique Flip-Card 3D Interactive** :
  - *Recto* : Question de mise en situation ou problème système (ex: « Quelle commande permet de modifier la priorité d'un processus déjà en cours d'exécution ? »).
  - *Verso* : Commande exacte, drapeaux obligatoires, syntaxe type et explication pédagogique détaillée.
- **Auto-Évaluation en 4 Paliers de Rétention** :
  - **À revoir** (*Again*) : Échec de rappel, la carte reviendra dans la session en cours.
  - **Difficile** (*Hard*) : Rappel laborieux, intervalle court (1 à 2 jours).
  - **Bon** (*Good*) : Rappel correct sans hésitation, intervalle standard multiplié.
  - **Facile** (*Easy*) : Maîtrise parfaite, intervalle long (jusqu'à 60-120 jours).
- **Gestion des Files d'Attente (Queues)** : Séparation claire entre les cartes *Nouvelles* (à découvrir), les cartes en *Apprentissage* et les cartes en *Révision* échues aujourd'hui.
- **Tiroir d'Inspection & Saut Rapide (Grid Index Modal)** : Possibilité de feuilleter l'intégralité du deck de plus de 2 000 cartes avec filtre de recherche pour étudier une commande précise sans attendre son échéance calendaire.

---

## 6. Écran 5 : Simulateur d'Examens & Entraînement (`practice`)

### 6.1. Rôle et Objectif
Ce module plonge l'étudiant dans les conditions réelles d'un centre de test Pearson VUE / LPI. Il permet de valider la vitesse de réflexion, la gestion du stress et la précision syntaxique.

### 6.2. Fonctionnalités Clés
- **Simulateur d'Examen Chronométré Officiel** :
  - 60 questions tirées aléatoirement selon la pondération exacte des objectifs LPI.
  - Minuteur dégressif de 90 minutes avec alerte visuelle de temps restant.
  - Calcul officiel du score sur une échelle de **200 à 800 points**, avec seuil de certification fixé à **500 points**.
- **Double Typologie de Questions** :
  - *Questions à Choix Multiples (QCM)* : Sélection simple (bouton radio) ou sélections multiples (« Choisissez deux réponses »).
  - *Questions à Saisie Libre (Fill-in-the-blank)* : Champ de texte libre demandant de saisir la commande exacte ou le chemin absolu du fichier.
- **Moteur de Tolérance Syntaxique Intelligent** : Évalue avec précision les réponses saisies au clavier sans exiger un copier-coller rigide (insensibilité aux espaces superflus, équivalence de drapeaux combinés `-la` vs `-l -a`, chemins relatifs vs absolus valides).
- **Marquage des Questions pour Révision (Flag Question)** : Possibilité de marquer une question incertaine pour y revenir facilement avant la soumission définitive.
- **Bilan Post-Examen & Analyse Rétrospective** :
  - Score total obtenu et statut officiel (Admis / Ajourné).
  - Ventilation précise des performances par sous-objectif.
  - Revue question par question avec mise en évidence de la réponse choisie, de la bonne réponse et de la justification pédagogique complète.
- **Examen Diagnostique Initial** : Test court de 20 questions permettant à un nouvel utilisateur d'étalonner instantanément ses connaissances et de construire une feuille de route sur-mesure.

---

## 7. Écran 6 : Glossaire des Commandes & Concepts (`glossary`)

### 7.1. Rôle et Objectif
Le **Glossaire** constitue la référence documentaire et technique de l'application. Plus qu'un simple dictionnaire, il offre une décomposition anatomique des commandes système les plus importantes des certifications LPI.

### 7.2. Fonctionnalités Clés
- **Moteur de Recherche & Filtrage Avancé** :
  - Recherche instantanée par nom de commande, mot-clé, ou description.
  - Filtres par catégories : *Gestion de fichiers*, *Processus & CPU*, *Permissions & Droits*, *Réseau*, *Disques & FS*, *Gestion de paquets*.
- **Décomposition Anatomique d'une Commande** : Décortique visuellement les constituants d'une instruction Unix complexe (binaire exécutable, options courtes `-h`, options longues `--human-readable`, arguments cibles, opérateurs de redirection et pipes `|`).
- **Fiche Détaillée par Commande** :
  - Description concise et syntaxe type.
  - Tableau des drapeaux essentiels indispensables pour l'examen.
  - Erreurs fréquentes et contre-sens typiques des candidats (ex: confusion entre `-r` récursif et reverse).
  - Commandes alternatives et nuances d'usage (ex: `cp` vs `dd`, `find` vs `locate`, `which` vs `whereis`).
- **Graphe de Connaissances Interactif (Knowledge Graph)** : Visualisation graphique des interconnexions entre commandes, protocoles réseau et fichiers de configuration (ex: le nœud `sshd` relié à `/etc/ssh/sshd_config`, au port `22` et à la commande `systemctl`).

---

## 8. Écran 7 : Hub d'Ateliers Pratiques & Labs (`training`)

### 8.1. Rôle et Objectif
Cet écran concrétise l'engagement **« Pratique réelle »** de la plateforme. Il permet d'acquérir les réflexes musculaires de la ligne de commande sans nécessiter l'installation d'une machine virtuelle Linux ou d'un conteneur Docker distant.

### 8.2. Fonctionnalités Clés
- **Simulateur de Terminal Unix (VirtualFS)** :
  - Shell Bash 5.2 interactif s'exécutant intégralement en JavaScript côté client.
  - Système de fichiers virtuel complet en mémoire vive (`/home/student`, `/etc`, `/var/log`, `/bin`...).
  - Support de 20+ commandes courantes avec leurs drapeaux (`pwd`, `ls`, `cd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, `chmod`, `chown`, `tar`, `echo`, `env`...).
  - Évaluation dynamique de l'état du filesystem virtuel après exécution pour valider la réussite de l'exercice (ex: vérifier qu'un fichier a bien reçu le masque `chmod 750`).
- **Ateliers de Réponse à Incidents (Incident Response)** : Scénarios de crise en temps limité où l'étudiant doit investiguer une panne système réaliste (disque plein, permissions cassées interdisant le login SSH, fichier de swap manquant).
- **Ateliers Dépannage & Analyse de Logs (Troubleshooting)** : Présentation de véritables extraits de journaux système (`journalctl -xe`, `/var/log/messages`, `dmesg`) avec questions d'analyse pour isoler la cause racine.
- **Séquençage Chronologique par Glisser-Déposer** : Ateliers où l'étudiant réordonne les étapes d'un processus critique (ex: séquence de boot BIOS -> MBR -> Bootloader -> Kernel -> Initrd -> Systemd).
- **Jeux d'Association Rapide** : Exercices de mise en relation rapide entre une commande et son fichier de configuration ou son port réseau par défaut.

---

## 9. Écrans Modaux & Modules Transverses du Système

En complément des 7 écrans principaux, l'application intègre des modules transversaux accessibles depuis n'importe quelle vue :

### 9.1. Le Menu Hamburger Catégorisé (`HamburgerMenu`)
- Volet latéral structuré en sections claires :
  - *Navigation Principale* : Accès direct aux 7 écrans.
  - *Documentation Technique & Architecture* : Raccourci vers les 21 documents et ADRs.
  - *Outils Pédagogiques & Diagnostic* : Relance de l'examen diagnostique ou du guide de démarrage.
  - *Profil, Paramètres & Mode Hors-ligne* : Gestion de la PWA et réinitialisation.
- Moteur de recherche intégré pour trouver instantanément une fonctionnalité par mot-clé.

### 9.2. Lecteur de Documentation In-App (`DocumentationModal`)
- Visualiseur Markdown 100% hors-ligne embarquant les 21 spécifications techniques de l'application.
- Rendu typographique GFM complet : tableaux lisibles, coloration de code, citations, filtres par phase (Cœur, Moteurs, Infra, Évolution, ADRs) et copie en un clic du Markdown brut.

### 9.3. « Explique-moi Autrement » (`ExplainDifferentlyModal`)
- Outil de vulgarisation pédagogique adaptative capable de reformuler un concept selon 5 angles :
  1. *Synthèse Droit au But* : Explication ultra-concise des points clés.
  2. *Comme à un Débutant (ELI5 / Métaphore)* : Image mentale tirée de la vie quotidienne.
  3. *Exemple Concret Terminal* : Commande pas-à-pas avec bouton pour ouvrir le shell.
  4. *Mini-Quiz de Vérification* : Question piège immédiate avec correction commentée.
  5. *Piège d'Examen Classique* : Identification des chausse-trappes posées par les examinateurs LPI.
- Fonctionne 100 % hors-ligne avec la base locale intégrée, et peut être enrichi dynamiquement via l'IA Gemini si une connexion est disponible.

### 9.4. Guide Officiel des Certifications LPI (`LpiCertificationGuideModal`)
- Synthèse des exigences officielles du LPI : prérequis, règles de recertification (durée de validité de 5 ans), déroulement de l'épreuve Pearson VUE, conseils de gestion du temps le jour J.

### 9.5. Paramètres & Gestion Hors-ligne (`SettingsModal`)
- Contrôle de la PWA (Progressive Web App) et de l'état du Service Worker.
- Export et import de la progression d'apprentissage sous format JSON chiffré/sauvegardé.
- Gestion du stockage local et journal des versions.
