import { SequencingChallenge } from '../types';

export const lpic1Sequencing102: SequencingChallenge[] = [
  {
    "id": "seq-lpic1-21",
    "title": "Chargement des fichiers de profil Bash (Login Shell)",
    "titleFr": "Chargement des fichiers de profil Bash (Login Shell)",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.1",
    "category": "Shells & Environnement",
    "description": "Lorsqu'un utilisateur ouvre une session de connexion interactive (Login Shell via SSH ou console tty), dans quel ordre exact Bash recherche-t-il et exécute-t-il les fichiers de configuration ?",
    "descriptionFr": "Lorsqu'un utilisateur ouvre une session de connexion interactive (Login Shell via SSH ou console tty), dans quel ordre exact Bash recherche-t-il et exécute-t-il les fichiers de configuration ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. /etc/profile",
        "labelFr": "1. /etc/profile",
        "detail": "Script d'initialisation global exécuté en premier pour tous les utilisateurs du système.",
        "detailFr": "Script d'initialisation global exécuté en premier pour tous les utilisateurs du système."
      },
      {
        "id": "s2",
        "label": "2. /etc/profile.d/*.sh",
        "labelFr": "2. /etc/profile.d/*.sh",
        "detail": "Scripts modulaires appelés depuis /etc/profile pour configurer variables globales et chemins.",
        "detailFr": "Scripts modulaires appelés depuis /etc/profile pour configurer variables globales et chemins."
      },
      {
        "id": "s3",
        "label": "3. Premier trouvé parmi ~/.bash_profile, ~/.bash_login ou ~/.profile",
        "labelFr": "3. Premier trouvé parmi ~/.bash_profile, ~/.bash_login ou ~/.profile",
        "detail": "Bash s'arrête au premier des 3 fichiers existant dans le répertoire utilisateur (sans lire les autres).",
        "detailFr": "Bash s'arrête au premier des 3 fichiers existant dans le répertoire utilisateur (sans lire les autres)."
      },
      {
        "id": "s4",
        "label": "4. ~/.bashrc",
        "labelFr": "4. ~/.bashrc",
        "detail": "Fichier de configuration locale généralement sourcé explicitement par ~/.bash_profile.",
        "detailFr": "Fichier de configuration locale généralement sourcé explicitement par ~/.bash_profile."
      },
      {
        "id": "s5",
        "label": "5. ~/.bash_logout (à la déconnexion)",
        "labelFr": "5. ~/.bash_logout (à la déconnexion)",
        "detail": "Exécuté uniquement lors de la fermeture définitive de la session de login (déconnexion).",
        "detailFr": "Exécuté uniquement lors de la fermeture définitive de la session de login (déconnexion)."
      }
    ],
    "explanation": "Bash lit d'abord /etc/profile (qui source /etc/profile.d/), puis cherche dans le répertoire personnel le PREMIER existant parmi ~/.bash_profile, ~/.bash_login et ~/.profile. ~/.bash_logout n'est exécuté qu'au logout.",
    "explanationFr": "Bash lit d'abord /etc/profile (qui source /etc/profile.d/), puis cherche dans le répertoire personnel le PREMIER existant parmi ~/.bash_profile, ~/.bash_login et ~/.profile. ~/.bash_logout n'est exécuté qu'au logout."
  },
  {
    "id": "seq-lpic1-22",
    "title": "Chargement des fichiers Bash en Non-Login Interactif",
    "titleFr": "Chargement des fichiers Bash en Non-Login Interactif",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.1",
    "category": "Shells & Environnement",
    "description": "Lors de l'ouverture d'un nouveau terminal graphique (ex: gnome-terminal) ou sous-shell sans login, dans quel ordre les fichiers sont-ils sourcés ?",
    "descriptionFr": "Lors de l'ouverture d'un nouveau terminal graphique (ex: gnome-terminal) ou sous-shell sans login, dans quel ordre les fichiers sont-ils sourcés ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Lancement du sous-shell interactif non-login",
        "labelFr": "1. Lancement du sous-shell interactif non-login",
        "detail": "L'environnement hérite des variables exportées par le processus parent.",
        "detailFr": "L'environnement hérite des variables exportées par le processus parent."
      },
      {
        "id": "s2",
        "label": "2. /etc/bash.bashrc (sur Debian/Ubuntu) ou /etc/bashrc (sur RHEL)",
        "labelFr": "2. /etc/bash.bashrc (sur Debian/Ubuntu) ou /etc/bashrc (sur RHEL)",
        "detail": "Fichier de configuration système global pour tous les shells interactifs non-login.",
        "detailFr": "Fichier de configuration système global pour tous les shells interactifs non-login."
      },
      {
        "id": "s3",
        "label": "3. ~/.bashrc de l'utilisateur",
        "labelFr": "3. ~/.bashrc de l'utilisateur",
        "detail": "Définition des alias personnels, invite de commande PS1 et fonctions personnalisées.",
        "detailFr": "Définition des alias personnels, invite de commande PS1 et fonctions personnalisées."
      },
      {
        "id": "s4",
        "label": "4. ~/.bash_aliases (si sourcé par ~/.bashrc)",
        "labelFr": "4. ~/.bash_aliases (si sourcé par ~/.bashrc)",
        "detail": "Chargement optionnel des raccourcis de commandes spécifiques de l'utilisateur.",
        "detailFr": "Chargement optionnel des raccourcis de commandes spécifiques de l'utilisateur."
      }
    ],
    "explanation": "Un shell interactif non-login ne lit JAMAIS /etc/profile ni ~/.bash_profile. Il charge directement /etc/bash.bashrc puis ~/.bashrc (et par extension ~/.bash_aliases).",
    "explanationFr": "Un shell interactif non-login ne lit JAMAIS /etc/profile ni ~/.bash_profile. Il charge directement /etc/bash.bashrc puis ~/.bashrc (et par extension ~/.bash_aliases)."
  },
  {
    "id": "seq-lpic1-23",
    "title": "Ordre d'évaluation et de résolution des commandes par Bash",
    "titleFr": "Ordre d'évaluation et de résolution des commandes par Bash",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.2",
    "category": "Shells & Environnement",
    "description": "Lorsque vous tapez une commande sans chemin absolu, dans quel ordre exact Bash détermine-t-il quelle entité exécuter ?",
    "descriptionFr": "Lorsque vous tapez une commande sans chemin absolu, dans quel ordre exact Bash détermine-t-il quelle entité exécuter ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Alias",
        "labelFr": "1. Alias",
        "detail": "Bash vérifie si le premier mot correspond à un alias défini par la commande alias.",
        "detailFr": "Bash vérifie si le premier mot correspond à un alias défini par la commande alias."
      },
      {
        "id": "s2",
        "label": "2. Mot réservé du shell (Keyword)",
        "labelFr": "2. Mot réservé du shell (Keyword)",
        "detail": "Mots-clés de contrôle de syntaxe du shell (if, then, for, while, case, function).",
        "detailFr": "Mots-clés de contrôle de syntaxe du shell (if, then, for, while, case, function)."
      },
      {
        "id": "s3",
        "label": "3. Fonction shell",
        "labelFr": "3. Fonction shell",
        "detail": "Fonctions définies en mémoire dans la session courante ou chargées depuis ~/.bashrc.",
        "detailFr": "Fonctions définies en mémoire dans la session courante ou chargées depuis ~/.bashrc."
      },
      {
        "id": "s4",
        "label": "4. Commande intégrée au shell (Builtin)",
        "labelFr": "4. Commande intégrée au shell (Builtin)",
        "detail": "Commandes internes exécutées sans fork (cd, echo, pwd, kill, history, type, exit).",
        "detailFr": "Commandes internes exécutées sans fork (cd, echo, pwd, kill, history, type, exit)."
      },
      {
        "id": "s5",
        "label": "5. Fichier exécutable externe dans la variable $PATH (ou hash table)",
        "labelFr": "5. Fichier exécutable externe dans la variable $PATH (ou hash table)",
        "detail": "Recherche séquentielle dans les répertoires listés dans $PATH ou dans le cache des commandes (hash).",
        "detailFr": "Recherche séquentielle dans les répertoires listés dans $PATH ou dans le cache des commandes (hash)."
      }
    ],
    "explanation": "L'ordre de priorité de Bash est capital pour la LPIC-1 : Alias d'abord, puis Keywords (mots réservés), puis Fonctions, puis Commandes internes Builtins, et enfin Exécutables externes trouvés via $PATH. Si rien ne correspond, l'erreur 'command not found' (127) est levée.",
    "explanationFr": "L'ordre de priorité de Bash est capital pour la LPIC-1 : Alias d'abord, puis Keywords (mots réservés), puis Fonctions, puis Commandes internes Builtins, et enfin Exécutables externes trouvés via $PATH. Si rien ne correspond, l'erreur 'command not found' (127) est levée."
  },
  {
    "id": "seq-lpic1-24",
    "title": "Ordre officiel des expansions de ligne de commande par Bash",
    "titleFr": "Ordre officiel des expansions de ligne de commande par Bash",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.2",
    "category": "Shells & Environnement",
    "description": "Dans quel ordre le shell Bash effectue-t-il les expansions sur une ligne de commande avant d'exécuter l'instruction ?",
    "descriptionFr": "Dans quel ordre le shell Bash effectue-t-il les expansions sur une ligne de commande avant d'exécuter l'instruction ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Expansion des accolades : {a,b,c} ou {1..5}",
        "labelFr": "1. Expansion des accolades : {a,b,c} ou {1..5}",
        "detail": "Génération textuelle de chaînes multiples sans référence aux fichiers existants sur disque.",
        "detailFr": "Génération textuelle de chaînes multiples sans référence aux fichiers existants sur disque."
      },
      {
        "id": "s2",
        "label": "2. Expansion du Tilde : ~ ou ~user",
        "labelFr": "2. Expansion du Tilde : ~ ou ~user",
        "detail": "Remplacement par le chemin du répertoire personnel ($HOME ou entrée passwd).",
        "detailFr": "Remplacement par le chemin du répertoire personnel ($HOME ou entrée passwd)."
      },
      {
        "id": "s3",
        "label": "3. Expansion des paramètres, variables et substitutions : $VAR, $(cmd), $((1+2))",
        "labelFr": "3. Expansion des paramètres, variables et substitutions : $VAR, $(cmd), $((1+2))",
        "detail": "Évaluation simultanée des variables, substitutions de commandes et arithmétique de gauche à droite.",
        "detailFr": "Évaluation simultanée des variables, substitutions de commandes et arithmétique de gauche à droite."
      },
      {
        "id": "s4",
        "label": "4. Découpage des mots (Word Splitting) basé sur $IFS",
        "labelFr": "4. Découpage des mots (Word Splitting) basé sur $IFS",
        "detail": "Division des résultats non entourés de guillemets doubles selon les séparateurs (espace, tabulation, saut de ligne).",
        "detailFr": "Division des résultats non entourés de guillemets doubles selon les séparateurs (espace, tabulation, saut de ligne)."
      },
      {
        "id": "s5",
        "label": "5. Expansion des chemins (Filename Expansion / Globbing : *, ?, [a-z])",
        "labelFr": "5. Expansion des chemins (Filename Expansion / Globbing : *, ?, [a-z])",
        "detail": "Remplacement des motifs jokers par la liste réelle des fichiers correspondants sur disque.",
        "detailFr": "Remplacement des motifs jokers par la liste réelle des fichiers correspondants sur disque."
      },
      {
        "id": "s6",
        "label": "6. Suppression des guillemets (Quote Removal)",
        "labelFr": "6. Suppression des guillemets (Quote Removal)",
        "detail": "Élimination des guillemets simples, doubles et antislashs ayant servi à protéger des caractères.",
        "detailFr": "Élimination des guillemets simples, doubles et antislashs ayant servi à protéger des caractères."
      }
    ],
    "explanation": "Selon le manuel officiel de Bash (man bash) : Brace expansion ({}) vient en premier, suivie du Tilde (~), puis Paramètres/Commandes/Arithmétique, puis Word Splitting, puis Pathname Expansion (globbing avec *), et enfin Quote Removal.",
    "explanationFr": "Selon le manuel officiel de Bash (man bash) : Brace expansion ({}) vient en premier, suivie du Tilde (~), puis Paramètres/Commandes/Arithmétique, puis Word Splitting, puis Pathname Expansion (globbing avec *), et enfin Quote Removal."
  },
  {
    "id": "seq-lpic1-25",
    "title": "Démarrage d'une session graphique X11 (Display Manager)",
    "titleFr": "Démarrage d'une session graphique X11 (Display Manager)",
    "certification": "lpic-1",
    "topicNumber": 106,
    "objectiveId": "106.1",
    "category": "Interfaces Utilisateur & Bureaux",
    "description": "Ordonnez les étapes chronologiques du lancement d'un environnement de bureau X11 via un gestionnaire d'affichage comme GDM ou LightDM.",
    "descriptionFr": "Ordonnez les étapes chronologiques du lancement d'un environnement de bureau X11 via un gestionnaire d'affichage comme GDM ou LightDM.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Atteinte de graphical.target par Systemd",
        "labelFr": "1. Atteinte de graphical.target par Systemd",
        "detail": "Systemd lance le service du Display Manager désigné dans /etc/systemd/system/display-manager.service.",
        "detailFr": "Systemd lance le service du Display Manager désigné dans /etc/systemd/system/display-manager.service."
      },
      {
        "id": "s2",
        "label": "2. Lancement du serveur Xorg et affichage de la mire de connexion (Greeter)",
        "labelFr": "2. Lancement du serveur Xorg et affichage de la mire de connexion (Greeter)",
        "detail": "Le serveur Xorg s'appuie sur la carte graphique (/dev/dri/card0) et présente l'écran d'accueil.",
        "detailFr": "Le serveur Xorg s'appuie sur la carte graphique (/dev/dri/card0) et présente l'écran d'accueil."
      },
      {
        "id": "s3",
        "label": "3. Saisie des identifiants et authentification PAM",
        "labelFr": "3. Saisie des identifiants et authentification PAM",
        "detail": "Validation du login et mot de passe de l'utilisateur contre /etc/pam.d/gdm-password.",
        "detailFr": "Validation du login et mot de passe de l'utilisateur contre /etc/pam.d/gdm-password."
      },
      {
        "id": "s4",
        "label": "4. Exécution du script de session Xsession et des fichiers de bureau (/usr/share/xsessions/)",
        "labelFr": "4. Exécution du script de session Xsession et des fichiers de bureau (/usr/share/xsessions/)",
        "detail": "Chargement des variables de session, trousseau de clés, et configurations Xresources.",
        "detailFr": "Chargement des variables de session, trousseau de clés, et configurations Xresources."
      },
      {
        "id": "s5",
        "label": "5. Démarrage du Window Manager et de l'environnement de bureau (GNOME, XFCE)",
        "labelFr": "5. Démarrage du Window Manager et de l'environnement de bureau (GNOME, XFCE)",
        "detail": "Prise en charge de la gestion des fenêtres, de la barre des tâches et des applications utilisateur.",
        "detailFr": "Prise en charge de la gestion des fenêtres, de la barre des tâches et des applications utilisateur."
      }
    ],
    "explanation": "La chaîne X11 moderne suit : graphical.target -> Display Manager -> Serveur Xorg + Greeter -> Authentification PAM -> scripts Xsession -> lancement du Window Manager/Bureau.",
    "explanationFr": "La chaîne X11 moderne suit : graphical.target -> Display Manager -> Serveur Xorg + Greeter -> Authentification PAM -> scripts Xsession -> lancement du Window Manager/Bureau."
  },
  {
    "id": "seq-lpic1-26",
    "title": "Chaîne de rendu et architecture Wayland",
    "titleFr": "Chaîne de rendu et architecture Wayland",
    "certification": "lpic-1",
    "topicNumber": 106,
    "objectiveId": "106.1",
    "category": "Interfaces Utilisateur & Bureaux",
    "description": "Ordonnez le flux de transmission d'un événement utilisateur (clic souris ou touche) et son rendu graphique sous le protocole Wayland.",
    "descriptionFr": "Ordonnez le flux de transmission d'un événement utilisateur (clic souris ou touche) et son rendu graphique sous le protocole Wayland.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Détection de l'événement matériel par le noyau (evdev)",
        "labelFr": "1. Détection de l'événement matériel par le noyau (evdev)",
        "detail": "Le contrôleur matériel transmet l'interruption au pilote d'entrée /dev/input/event* du noyau.",
        "detailFr": "Le contrôleur matériel transmet l'interruption au pilote d'entrée /dev/input/event* du noyau."
      },
      {
        "id": "s2",
        "label": "2. Transmission directe de l'événement au Compositeur Wayland",
        "labelFr": "2. Transmission directe de l'événement au Compositeur Wayland",
        "detail": "Contrairement à X11 où Xorg reçoit l'événement, le compositeur (Mutter/Weston/Sway) lit directement evdev.",
        "detailFr": "Contrairement à X11 où Xorg reçoit l'événement, le compositeur (Mutter/Weston/Sway) lit directement evdev."
      },
      {
        "id": "s3",
        "label": "3. Envoi de l'événement à la fenêtre cliente ciblée",
        "labelFr": "3. Envoi de l'événement à la fenêtre cliente ciblée",
        "detail": "Le compositeur calcule la fenêtre active et lui transmet l'événement via le protocole Wayland.",
        "detailFr": "Le compositeur calcule la fenêtre active et lui transmet l'événement via le protocole Wayland."
      },
      {
        "id": "s4",
        "label": "4. Rendu direct de la surface par l'application cliente (EGL/OpenGL)",
        "labelFr": "4. Rendu direct de la surface par l'application cliente (EGL/OpenGL)",
        "detail": "L'application dessine son interface directement dans un tampon de mémoire partagé (buffer).",
        "detailFr": "L'application dessine son interface directement dans un tampon de mémoire partagé (buffer)."
      },
      {
        "id": "s5",
        "label": "5. Notification du compositeur et basculement d'écran (Page Flip via KMS)",
        "labelFr": "5. Notification du compositeur et basculement d'écran (Page Flip via KMS)",
        "detail": "Le compositeur compose la scène globale et demande au pilote DRM/KMS d'afficher le tampon final sans scintillement.",
        "detailFr": "Le compositeur compose la scène globale et demande au pilote DRM/KMS d'afficher le tampon final sans scintillement."
      }
    ],
    "explanation": "Sous Wayland, le compositeur regroupe le rôle de serveur d'affichage et de gestionnaire de fenêtres. Il reçoit les événements d'evdev, les transmet au client qui dessine dans son propre buffer, puis le compositeur ordonne au sous-système DRM/KMS de basculer l'affichage (Page Flip).",
    "explanationFr": "Sous Wayland, le compositeur regroupe le rôle de serveur d'affichage et de gestionnaire de fenêtres. Il reçoit les événements d'evdev, les transmet au client qui dessine dans son propre buffer, puis le compositeur ordonne au sous-système DRM/KMS de basculer l'affichage (Page Flip)."
  },
  {
    "id": "seq-lpic1-27",
    "title": "Création complète d'un compte utilisateur en ligne de commande",
    "titleFr": "Création complète d'un compte utilisateur en ligne de commande",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.1",
    "category": "Tâches Administratives",
    "description": "Ordonnez les étapes d'administration pour créer un compte utilisateur avec répertoire personnel, mot de passe initialisé et ajout à un groupe secondaire.",
    "descriptionFr": "Ordonnez les étapes d'administration pour créer un compte utilisateur avec répertoire personnel, mot de passe initialisé et ajout à un groupe secondaire.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création du compte avec squelette : useradd -m -s /bin/bash jean",
        "labelFr": "1. Création du compte avec squelette : useradd -m -s /bin/bash jean",
        "detail": "Attribution d'un UID libre, création de /home/jean et copie des fichiers modèles depuis /etc/skel.",
        "detailFr": "Attribution d'un UID libre, création de /home/jean et copie des fichiers modèles depuis /etc/skel."
      },
      {
        "id": "s2",
        "label": "2. Définition du mot de passe initial : passwd jean",
        "labelFr": "2. Définition du mot de passe initial : passwd jean",
        "detail": "Calcul du hash de mot de passe (SHA-512 ou yescrypt) et écriture dans /etc/shadow.",
        "detailFr": "Calcul du hash de mot de passe (SHA-512 ou yescrypt) et écriture dans /etc/shadow."
      },
      {
        "id": "s3",
        "label": "3. Ajout au groupe secondaire d'administration : usermod -aG sudo jean",
        "labelFr": "3. Ajout au groupe secondaire d'administration : usermod -aG sudo jean",
        "detail": "Inscription de l'utilisateur dans la liste des membres du groupe dans /etc/group avec l'option -a (append).",
        "detailFr": "Inscription de l'utilisateur dans la liste des membres du groupe dans /etc/group avec l'option -a (append)."
      },
      {
        "id": "s4",
        "label": "4. Forçage du changement de mot de passe à la 1re connexion : chage -d 0 jean",
        "labelFr": "4. Forçage du changement de mot de passe à la 1re connexion : chage -d 0 jean",
        "detail": "Mise à zéro de la date de dernier changement de mot de passe dans le 3e champ de /etc/shadow.",
        "detailFr": "Mise à zéro de la date de dernier changement de mot de passe dans le 3e champ de /etc/shadow."
      },
      {
        "id": "s5",
        "label": "5. Vérification de l'identité et des groupes : id jean",
        "labelFr": "5. Vérification de l'identité et des groupes : id jean",
        "detail": "Contrôle visuel de l'UID, du GID primaire et des groupes complémentaires.",
        "detailFr": "Contrôle visuel de l'UID, du GID primaire et des groupes complémentaires."
      }
    ],
    "explanation": "La bonne pratique LPIC-1 consiste à créer le compte (useradd -m), définir le mot de passe (passwd), ajouter aux groupes avec usermod -aG, appliquer les politiques d'expiration (chage -d 0 pour obliger le changement immédiat), puis contrôler avec 'id'.",
    "explanationFr": "La bonne pratique LPIC-1 consiste à créer le compte (useradd -m), définir le mot de passe (passwd), ajouter aux groupes avec usermod -aG, appliquer les politiques d'expiration (chage -d 0 pour obliger le changement immédiat), puis contrôler avec 'id'."
  },
  {
    "id": "seq-lpic1-28",
    "title": "Cycle d'exécution périodique du démon Cron (crond)",
    "titleFr": "Cycle d'exécution périodique du démon Cron (crond)",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.2",
    "category": "Tâches Administratives",
    "description": "Ordonnez le cycle d'activité interne du démon cron lorsqu'une minute s'écoule sur le système Linux.",
    "descriptionFr": "Ordonnez le cycle d'activité interne du démon cron lorsqu'une minute s'écoule sur le système Linux.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Éveil du démon crond/cron au début de chaque minute",
        "labelFr": "1. Éveil du démon crond/cron au début de chaque minute",
        "detail": "Le démon sort de son sommeil temporisé dès que la seconde 00 de la minute courante est atteinte.",
        "detailFr": "Le démon sort de son sommeil temporisé dès que la seconde 00 de la minute courante est atteinte."
      },
      {
        "id": "s2",
        "label": "2. Vérification des dates de modification des fichiers crontabs",
        "labelFr": "2. Vérification des dates de modification des fichiers crontabs",
        "detail": "Contrôle de /etc/crontab, /etc/cron.d/ et /var/spool/cron/crontabs/ pour recharger d'éventuels changements.",
        "detailFr": "Contrôle de /etc/crontab, /etc/cron.d/ et /var/spool/cron/crontabs/ pour recharger d'éventuels changements."
      },
      {
        "id": "s3",
        "label": "3. Évaluation des 5 champs temporels (m h dom mon dow)",
        "labelFr": "3. Évaluation des 5 champs temporels (m h dom mon dow)",
        "detail": "Comparaison de l'heure système actuelle avec la programmation de chaque tâche planifiée.",
        "detailFr": "Comparaison de l'heure système actuelle avec la programmation de chaque tâche planifiée."
      },
      {
        "id": "s4",
        "label": "4. Création d'un sous-processus fork() et exécution sous l'UID de l'utilisateur",
        "labelFr": "4. Création d'un sous-processus fork() et exécution sous l'UID de l'utilisateur",
        "detail": "Lancement de la commande via /bin/sh avec un environnement minimal restreint.",
        "detailFr": "Lancement de la commande via /bin/sh avec un environnement minimal restreint."
      },
      {
        "id": "s5",
        "label": "5. Capture des sorties stdout/stderr et envoi par email au destinataire MAILTO",
        "labelFr": "5. Capture des sorties stdout/stderr et envoi par email au destinataire MAILTO",
        "detail": "Si la commande produit du texte, un courriel local est transmis via le MTA au compte désigné.",
        "detailFr": "Si la commande produit du texte, un courriel local est transmis via le MTA au compte désigné."
      }
    ],
    "explanation": "Le démon cron s'éveille toutes les minutes, compare l'horloge aux crontabs, forke un processus avec les privilèges de l'utilisateur cible, exécute la ligne de commande via /bin/sh, et envoie toute sortie écran par mail à l'adresse MAILTO.",
    "explanationFr": "Le démon cron s'éveille toutes les minutes, compare l'horloge aux crontabs, forke un processus avec les privilèges de l'utilisateur cible, exécute la ligne de commande via /bin/sh, et envoie toute sortie écran par mail à l'adresse MAILTO."
  },
  {
    "id": "seq-lpic1-29",
    "title": "Création et activation d'un Timer Systemd moderne",
    "titleFr": "Création et activation d'un Timer Systemd moderne",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.2",
    "category": "Tâches Administratives",
    "description": "Ordonnez les étapes pour remplacer une tâche cron par un couple de fichiers Systemd Service et Timer.",
    "descriptionFr": "Ordonnez les étapes pour remplacer une tâche cron par un couple de fichiers Systemd Service et Timer.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création de l'unité de service : /etc/systemd/system/backup.service",
        "labelFr": "1. Création de l'unité de service : /etc/systemd/system/backup.service",
        "detail": "Définition de [Service] avec Type=oneshot et ExecStart=/usr/local/bin/backup.sh.",
        "detailFr": "Définition de [Service] avec Type=oneshot et ExecStart=/usr/local/bin/backup.sh."
      },
      {
        "id": "s2",
        "label": "2. Création de l'unité timer associée : /etc/systemd/system/backup.timer",
        "labelFr": "2. Création de l'unité timer associée : /etc/systemd/system/backup.timer",
        "detail": "Définition de [Timer] avec la directive OnCalendar=*-*-* 02:00:00 et Persistent=true.",
        "detailFr": "Définition de [Timer] avec la directive OnCalendar=*-*-* 02:00:00 et Persistent=true."
      },
      {
        "id": "s3",
        "label": "3. Rechargement des fichiers de configuration : systemctl daemon-reload",
        "labelFr": "3. Rechargement des fichiers de configuration : systemctl daemon-reload",
        "detail": "Systemd lit les nouveaux fichiers déposés dans /etc/systemd/system/.",
        "detailFr": "Systemd lit les nouveaux fichiers déposés dans /etc/systemd/system/."
      },
      {
        "id": "s4",
        "label": "4. Activation et démarrage du timer : systemctl enable --now backup.timer",
        "labelFr": "4. Activation et démarrage du timer : systemctl enable --now backup.timer",
        "detail": "Armement du déclencheur temporel pour le prochain cycle et persistance au reboot.",
        "detailFr": "Armement du déclencheur temporel pour le prochain cycle et persistance au reboot."
      },
      {
        "id": "s5",
        "label": "5. Contrôle du planning avec systemctl list-timers",
        "labelFr": "5. Contrôle du planning avec systemctl list-timers",
        "detail": "Vérification de l'heure du prochain déclenchement (NEXT) et de la dernière exécution (LAST).",
        "detailFr": "Vérification de l'heure du prochain déclenchement (NEXT) et de la dernière exécution (LAST)."
      }
    ],
    "explanation": "La méthode moderne Systemd sépare l'action (backup.service) de son déclencheur temporel (backup.timer). On crée le .service, puis le .timer avec OnCalendar, on recharge le démon (daemon-reload), on active le timer, et on inspecte avec list-timers.",
    "explanationFr": "La méthode moderne Systemd sépare l'action (backup.service) de son déclencheur temporel (backup.timer). On crée le .service, puis le .timer avec OnCalendar, on recharge le démon (daemon-reload), on active le timer, et on inspecte avec list-timers."
  },
  {
    "id": "seq-lpic1-30",
    "title": "Configuration linguistique et fuseau horaire du système",
    "titleFr": "Configuration linguistique et fuseau horaire du système",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.3",
    "category": "Tâches Administratives",
    "description": "Ordonnez les étapes pour générer une locale française UTF-8, la définir par défaut sur la machine et synchroniser le fuseau horaire.",
    "descriptionFr": "Ordonnez les étapes pour générer une locale française UTF-8, la définir par défaut sur la machine et synchroniser le fuseau horaire.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Décommenter la ligne 'fr_FR.UTF-8 UTF-8' dans /etc/locale.gen",
        "labelFr": "1. Décommenter la ligne 'fr_FR.UTF-8 UTF-8' dans /etc/locale.gen",
        "detail": "Sélection des locales à compiler par le système d'exploitation.",
        "detailFr": "Sélection des locales à compiler par le système d'exploitation."
      },
      {
        "id": "s2",
        "label": "2. Compilation binaire des définitions : locale-gen",
        "labelFr": "2. Compilation binaire des définitions : locale-gen",
        "detail": "Génération de l'archive binaire /usr/lib/locale/locale-archive contenant les tables de caractères.",
        "detailFr": "Génération de l'archive binaire /usr/lib/locale/locale-archive contenant les tables de caractères."
      },
      {
        "id": "s3",
        "label": "3. Définition de la locale système : localectl set-locale LANG=fr_FR.UTF-8",
        "labelFr": "3. Définition de la locale système : localectl set-locale LANG=fr_FR.UTF-8",
        "detail": "Écriture de la variable d'environnement par défaut dans le fichier /etc/locale.conf (ou /etc/default/locale).",
        "detailFr": "Écriture de la variable d'environnement par défaut dans le fichier /etc/locale.conf (ou /etc/default/locale)."
      },
      {
        "id": "s4",
        "label": "4. Définition du fuseau horaire : timedatectl set-timezone Europe/Paris",
        "labelFr": "4. Définition du fuseau horaire : timedatectl set-timezone Europe/Paris",
        "detail": "Création du lien symbolique /etc/localtime vers /usr/share/zoneinfo/Europe/Paris.",
        "detailFr": "Création du lien symbolique /etc/localtime vers /usr/share/zoneinfo/Europe/Paris."
      },
      {
        "id": "s5",
        "label": "5. Contrôle du statut global avec timedatectl et locale",
        "labelFr": "5. Contrôle du statut global avec timedatectl et locale",
        "detail": "Vérification des variables LC_* et confirmation de la synchronisation de l'heure locale et UTC.",
        "detailFr": "Vérification des variables LC_* et confirmation de la synchronisation de l'heure locale et UTC."
      }
    ],
    "explanation": "La configuration internationale requiert : déclaration dans /etc/locale.gen -> compilation par locale-gen -> fixation par localectl set-locale -> configuration du fuseau via timedatectl set-timezone -> validation avec timedatectl et locale.",
    "explanationFr": "La configuration internationale requiert : déclaration dans /etc/locale.gen -> compilation par locale-gen -> fixation par localectl set-locale -> configuration du fuseau via timedatectl set-timezone -> validation avec timedatectl et locale."
  },
  {
    "id": "seq-lpic1-31",
    "title": "Planification et cycle d'exécution d'une tâche différée 'at'",
    "titleFr": "Planification et cycle d'exécution d'une tâche différée 'at'",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.2",
    "category": "Tâches Administratives",
    "description": "Ordonnez la séquence de planification et d'exécution d'une tâche unique ponctuelle avec la commande 'at'.",
    "descriptionFr": "Ordonnez la séquence de planification et d'exécution d'une tâche unique ponctuelle avec la commande 'at'.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Lancement de la commande 'at 23:30' et ouverture du prompt interactif at>",
        "labelFr": "1. Lancement de la commande 'at 23:30' et ouverture du prompt interactif at>",
        "detail": "Spécification de l'horaire de déclenchement unique de la tâche.",
        "detailFr": "Spécification de l'horaire de déclenchement unique de la tâche."
      },
      {
        "id": "s2",
        "label": "2. Saisie des instructions bash et fermeture avec la séquence Ctrl+D (EOF)",
        "labelFr": "2. Saisie des instructions bash et fermeture avec la séquence Ctrl+D (EOF)",
        "detail": "Enregistrement des variables d'environnement courantes (PATH, PWD, umask) dans le job.",
        "detailFr": "Enregistrement des variables d'environnement courantes (PATH, PWD, umask) dans le job."
      },
      {
        "id": "s3",
        "label": "3. Écriture du script du job dans /var/spool/cron/atjobs/ (ou /var/spool/at/)",
        "labelFr": "3. Écriture du script du job dans /var/spool/cron/atjobs/ (ou /var/spool/at/)",
        "detail": "Attribution d'un identifiant de job unique (consultable via atq).",
        "detailFr": "Attribution d'un identifiant de job unique (consultable via atq)."
      },
      {
        "id": "s4",
        "label": "4. Détection de l'échéance par le démon résident atd",
        "labelFr": "4. Détection de l'échéance par le démon résident atd",
        "detail": "À 23:30 précises, le démon atd lit le fichier de spool et exécute le script avec les permissions de l'auteur.",
        "detailFr": "À 23:30 précises, le démon atd lit le fichier de spool et exécute le script avec les permissions de l'auteur."
      },
      {
        "id": "s5",
        "label": "5. Suppression automatique du fichier de job après exécution",
        "labelFr": "5. Suppression automatique du fichier de job après exécution",
        "detail": "Contrairement à cron qui est récurrent, at supprime la tâche du spool dès qu'elle a abouti.",
        "detailFr": "Contrairement à cron qui est récurrent, at supprime la tâche du spool dès qu'elle a abouti."
      }
    ],
    "explanation": "La commande 'at' capture les variables d'environnement au moment de la frappe (Ctrl+D), dépose un fichier de script dans /var/spool/atjobs, le démon atd le surveille et l'exécute à l'heure H, puis le fichier est immédiatement purgé du système.",
    "explanationFr": "La commande 'at' capture les variables d'environnement au moment de la frappe (Ctrl+D), dépose un fichier de script dans /var/spool/atjobs, le démon atd le surveille et l'exécute à l'heure H, puis le fichier est immédiatement purgé du système."
  },
  {
    "id": "seq-lpic1-32",
    "title": "Synchronisation temporelle NTP avec Chrony",
    "titleFr": "Synchronisation temporelle NTP avec Chrony",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.1",
    "category": "Services Système Essentiels",
    "description": "Ordonnez les phases de démarrage et d'ajustement temporel de l'horloge système effectuées par le démon chronyd.",
    "descriptionFr": "Ordonnez les phases de démarrage et d'ajustement temporel de l'horloge système effectuées par le démon chronyd.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Démarrage du démon chronyd et lecture de /etc/chrony/chrony.conf",
        "labelFr": "1. Démarrage du démon chronyd et lecture de /etc/chrony/chrony.conf",
        "detail": "Chargement de la liste des serveurs de strate supérieure (directive pool ou server).",
        "detailFr": "Chargement de la liste des serveurs de strate supérieure (directive pool ou server)."
      },
      {
        "id": "s2",
        "label": "2. Émission de requêtes UDP sur le port 123 vers les serveurs distants",
        "labelFr": "2. Émission de requêtes UDP sur le port 123 vers les serveurs distants",
        "detail": "Calcul du temps de trajet aller-retour (RTT) et des horodatages précis d'envoi et de réception.",
        "detailFr": "Calcul du temps de trajet aller-retour (RTT) et des horodatages précis d'envoi et de réception."
      },
      {
        "id": "s3",
        "label": "3. Calcul de la dérive (offset) et du jitter (dispersion)",
        "labelFr": "3. Calcul de la dérive (offset) et du jitter (dispersion)",
        "detail": "Élimination des sources aberrantes et sélection de la source de référence la plus stable.",
        "detailFr": "Élimination des sources aberrantes et sélection de la source de référence la plus stable."
      },
      {
        "id": "s4",
        "label": "4. Lissage continu de l'horloge système (Slewing)",
        "labelFr": "4. Lissage continu de l'horloge système (Slewing)",
        "detail": "Accélération ou ralentissement imperceptible des tics de l'horloge noyau via adjtimex() pour éviter les sauts brutaux.",
        "detailFr": "Accélération ou ralentissement imperceptible des tics de l'horloge noyau via adjtimex() pour éviter les sauts brutaux."
      },
      {
        "id": "s5",
        "label": "5. Synchronisation de l'horloge matérielle (RTC) : hwclock -w (ou rtcsync)",
        "labelFr": "5. Synchronisation de l'horloge matérielle (RTC) : hwclock -w (ou rtcsync)",
        "detail": "Mise à jour de l'horloge CMOS de la carte mère pour maintenir l'heure exacte en cas d'extinction de la machine.",
        "detailFr": "Mise à jour de l'horloge CMOS de la carte mère pour maintenir l'heure exacte en cas d'extinction de la machine."
      }
    ],
    "explanation": "Chrony interroge les serveurs en UDP 123, calcule la dérive temporelle par rapport aux sources stables, applique un lissage progressif sans rupture (slewing), puis maintient la synchronisation de l'horloge matérielle (hwclock).",
    "explanationFr": "Chrony interroge les serveurs en UDP 123, calcule la dérive temporelle par rapport aux sources stables, applique un lissage progressif sans rupture (slewing), puis maintient la synchronisation de l'horloge matérielle (hwclock)."
  },
  {
    "id": "seq-lpic1-33",
    "title": "Acheminement et filtrage d'un message Syslog",
    "titleFr": "Acheminement et filtrage d'un message Syslog",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.2",
    "category": "Services Système Essentiels",
    "description": "Dans quel ordre un message d'événement généré par un programme traverse-t-il la chaîne Syslog (rsyslog/journald) pour être consigné dans /var/log ?",
    "descriptionFr": "Dans quel ordre un message d'événement généré par un programme traverse-t-il la chaîne Syslog (rsyslog/journald) pour être consigné dans /var/log ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Appel de la fonction de bibliothèque libc : syslog(priority, format, ...)",
        "labelFr": "1. Appel de la fonction de bibliothèque libc : syslog(priority, format, ...)",
        "detail": "L'application déclare une facilité (facility, ex: authpriv, mail, daemon) et un niveau de gravité (severity, ex: err, info).",
        "detailFr": "L'application déclare une facilité (facility, ex: authpriv, mail, daemon) et un niveau de gravité (severity, ex: err, info)."
      },
      {
        "id": "s2",
        "label": "2. Écriture du message sur la socket UNIX locale /dev/log",
        "labelFr": "2. Écriture du message sur la socket UNIX locale /dev/log",
        "detail": "Transmission inter-processus rapide et sécurisée sans passer par la pile réseau TCP/IP.",
        "detailFr": "Transmission inter-processus rapide et sécurisée sans passer par la pile réseau TCP/IP."
      },
      {
        "id": "s3",
        "label": "3. Réception par systemd-journald et rsyslogd",
        "labelFr": "3. Réception par systemd-journald et rsyslogd",
        "detail": "Enrichissement du message avec le PID, le nom de l'exécutable, l'UID et l'horodatage système haute précision.",
        "detailFr": "Enrichissement du message avec le PID, le nom de l'exécutable, l'UID et l'horodatage système haute précision."
      },
      {
        "id": "s4",
        "label": "4. Évaluation des règles de sélecteurs dans /etc/rsyslog.conf (ex: authpriv.*)",
        "labelFr": "4. Évaluation des règles de sélecteurs dans /etc/rsyslog.conf (ex: authpriv.*)",
        "detail": "Filtrage selon les critères facility.severity pour déterminer les destinations (fichiers, console, serveur distant).",
        "detailFr": "Filtrage selon les critères facility.severity pour déterminer les destinations (fichiers, console, serveur distant)."
      },
      {
        "id": "s5",
        "label": "5. Écriture sur disque dans le fichier de destination (/var/log/auth.log ou secure)",
        "labelFr": "5. Écriture sur disque dans le fichier de destination (/var/log/auth.log ou secure)",
        "detail": "Synchronisation du tampon avec le système de fichiers pour garantir la persistance de l'audit.",
        "detailFr": "Synchronisation du tampon avec le système de fichiers pour garantir la persistance de l'audit."
      }
    ],
    "explanation": "Le programme appelle syslog() -> le message transite par la socket /dev/log -> rsyslogd/journald intercepte et ajoute les métadonnées -> les règles de /etc/rsyslog.conf sélectionnent le fichier cible -> écriture finale dans /var/log/.",
    "explanationFr": "Le programme appelle syslog() -> le message transite par la socket /dev/log -> rsyslogd/journald intercepte et ajoute les métadonnées -> les règles de /etc/rsyslog.conf sélectionnent le fichier cible -> écriture finale dans /var/log/."
  },
  {
    "id": "seq-lpic1-34",
    "title": "Cycle de rotation des journaux avec logrotate",
    "titleFr": "Cycle de rotation des journaux avec logrotate",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.2",
    "category": "Services Système Essentiels",
    "description": "Ordonnez les étapes exécutées par l'utilitaire logrotate lorsqu'il procède à la rotation d'un fichier de log de service (ex: /var/log/nginx/access.log).",
    "descriptionFr": "Ordonnez les étapes exécutées par l'utilitaire logrotate lorsqu'il procède à la rotation d'un fichier de log de service (ex: /var/log/nginx/access.log).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déclenchement automatique par le cron quotidien (/etc/cron.daily/logrotate)",
        "labelFr": "1. Déclenchement automatique par le cron quotidien (/etc/cron.daily/logrotate)",
        "detail": "Lecture du fichier principal /etc/logrotate.conf et des inclusions modulaires /etc/logrotate.d/*.",
        "detailFr": "Lecture du fichier principal /etc/logrotate.conf et des inclusions modulaires /etc/logrotate.d/*."
      },
      {
        "id": "s2",
        "label": "2. Évaluation des critères de rotation (taille, fréquence temporelle weekly/daily)",
        "labelFr": "2. Évaluation des critères de rotation (taille, fréquence temporelle weekly/daily)",
        "detail": "Consultation du fichier d'état /var/lib/logrotate/status pour déterminer si la rotation est due.",
        "detailFr": "Consultation du fichier d'état /var/lib/logrotate/status pour déterminer si la rotation est due."
      },
      {
        "id": "s3",
        "label": "3. Décalage des archives existantes et renommage du log actif en access.log.1",
        "labelFr": "3. Décalage des archives existantes et renommage du log actif en access.log.1",
        "detail": "Décalage incrémental (.2 devient .3, .1 devient .2) et purge des archives excédant la directive 'rotate'.",
        "detailFr": "Décalage incrémental (.2 devient .3, .1 devient .2) et purge des archives excédant la directive 'rotate'."
      },
      {
        "id": "s4",
        "label": "4. Création d'un nouveau fichier journal vide (directive 'create')",
        "labelFr": "4. Création d'un nouveau fichier journal vide (directive 'create')",
        "detail": "Attribution immédiate des permissions et propriétaires corrects (ex: 0640 www-data adm).",
        "detailFr": "Attribution immédiate des permissions et propriétaires corrects (ex: 0640 www-data adm)."
      },
      {
        "id": "s5",
        "label": "5. Envoi d'un signal de réouverture au démon via le bloc 'postrotate'",
        "labelFr": "5. Envoi d'un signal de réouverture au démon via le bloc 'postrotate'",
        "detail": "Envoi de SIGHUP ou SIGUSR1 (kill -USR1 $(cat nginx.pid)) pour obliger le démon à fermer l'ancien descripteur.",
        "detailFr": "Envoi de SIGHUP ou SIGUSR1 (kill -USR1 $(cat nginx.pid)) pour obliger le démon à fermer l'ancien descripteur."
      },
      {
        "id": "s6",
        "label": "6. Compression gzip des anciennes archives (directive 'compress' / 'delaycompress')",
        "labelFr": "6. Compression gzip des anciennes archives (directive 'compress' / 'delaycompress')",
        "detail": "Génération de access.log.2.gz pour économiser l'espace disque.",
        "detailFr": "Génération de access.log.2.gz pour économiser l'espace disque."
      }
    ],
    "explanation": "La rotation suit : déclenchement cron.daily -> vérification de status -> renommage du fichier actif -> création du fichier vierge (create) -> envoi du signal SIGHUP/USR1 dans postrotate pour rouvrir le descripteur -> compression gzip.",
    "explanationFr": "La rotation suit : déclenchement cron.daily -> vérification de status -> renommage du fichier actif -> création du fichier vierge (create) -> envoi du signal SIGHUP/USR1 dans postrotate pour rouvrir le descripteur -> compression gzip."
  },
  {
    "id": "seq-lpic1-35",
    "title": "Acheminement et livraison locale de courriels (MTA)",
    "titleFr": "Acheminement et livraison locale de courriels (MTA)",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.3",
    "category": "Services Système Essentiels",
    "description": "Dans quel ordre un agent de transfert de courriels (Postfix / Exim / Sendmail) résout-il la destination d'un message adressé à un utilisateur local ?",
    "descriptionFr": "Dans quel ordre un agent de transfert de courriels (Postfix / Exim / Sendmail) résout-il la destination d'un message adressé à un utilisateur local ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Soumission du courriel via /usr/sbin/sendmail ou connexion SMTP (port 25)",
        "labelFr": "1. Soumission du courriel via /usr/sbin/sendmail ou connexion SMTP (port 25)",
        "detail": "Le message entre dans la file d'attente active du serveur de messagerie (mail queue).",
        "detailFr": "Le message entre dans la file d'attente active du serveur de messagerie (mail queue)."
      },
      {
        "id": "s2",
        "label": "2. Vérification de la table d'alias système /etc/aliases",
        "labelFr": "2. Vérification de la table d'alias système /etc/aliases",
        "detail": "Consultation de la base indexée (générée par la commande newaliases) pour résoudre des alias tels que postmaster ou root.",
        "detailFr": "Consultation de la base indexée (générée par la commande newaliases) pour résoudre des alias tels que postmaster ou root."
      },
      {
        "id": "s3",
        "label": "3. Consultation du fichier de redirection personnel ~/.forward de l'utilisateur",
        "labelFr": "3. Consultation du fichier de redirection personnel ~/.forward de l'utilisateur",
        "detail": "Vérification si le destinataire a configuré un transfert automatique vers une boîte externe ou un script.",
        "detailFr": "Vérification si le destinataire a configuré un transfert automatique vers une boîte externe ou un script."
      },
      {
        "id": "s4",
        "label": "4. Appel de l'agent de livraison locale (MDA / Mail Delivery Agent)",
        "labelFr": "4. Appel de l'agent de livraison locale (MDA / Mail Delivery Agent)",
        "detail": "Transmission du message au composant de distribution (ex: procmail, maildrop ou le livreur interne local).",
        "detailFr": "Transmission du message au composant de distribution (ex: procmail, maildrop ou le livreur interne local)."
      },
      {
        "id": "s5",
        "label": "5. Écriture définitive dans la boîte aux lettres (/var/spool/mail/user ou ~/Maildir/)",
        "labelFr": "5. Écriture définitive dans la boîte aux lettres (/var/spool/mail/user ou ~/Maildir/)",
        "detail": "Le courriel est accessible à l'utilisateur via la commande mail ou un serveur IMAP/POP3.",
        "detailFr": "Le courriel est accessible à l'utilisateur via la commande mail ou un serveur IMAP/POP3."
      }
    ],
    "explanation": "L'acheminement local du MTA vérifie d'abord /etc/aliases (dont la base binaire est compilée avec newaliases), puis le fichier personnel ~/.forward de l'utilisateur cible, avant de confier le message au MDA pour l'écrire dans la boîte de réception (/var/mail ou ~/Maildir).",
    "explanationFr": "L'acheminement local du MTA vérifie d'abord /etc/aliases (dont la base binaire est compilée avec newaliases), puis le fichier personnel ~/.forward de l'utilisateur cible, avant de confier le message au MDA pour l'écrire dans la boîte de réception (/var/mail ou ~/Maildir)."
  },
  {
    "id": "seq-lpic1-36",
    "title": "Négociation de bail DHCP (Processus DORA)",
    "titleFr": "Négociation de bail DHCP (Processus DORA)",
    "certification": "lpic-1",
    "topicNumber": 109,
    "objectiveId": "109.1",
    "category": "Notions Fondamentales Réseau",
    "description": "Ordonnez les 4 échanges de trames réseau constituant la négociation complète d'une adresse IP par un client DHCP (cycle DORA).",
    "descriptionFr": "Ordonnez les 4 échanges de trames réseau constituant la négociation complète d'une adresse IP par un client DHCP (cycle DORA).",
    "steps": [
      {
        "id": "s1",
        "label": "1. DHCPDISCOVER (Client -> Broadcast 255.255.255.255)",
        "labelFr": "1. DHCPDISCOVER (Client -> Broadcast 255.255.255.255)",
        "detail": "Le client non configuré émet un paquet de découverte en broadcast UDP (port 68 vers port 67).",
        "detailFr": "Le client non configuré émet un paquet de découverte en broadcast UDP (port 68 vers port 67)."
      },
      {
        "id": "s2",
        "label": "2. DHCPOFFER (Serveur DHCP -> Client)",
        "labelFr": "2. DHCPOFFER (Serveur DHCP -> Client)",
        "detail": "Le ou les serveurs DHCP du segment proposent une adresse IP disponible, un masque de sous-réseau et une durée de bail.",
        "detailFr": "Le ou les serveurs DHCP du segment proposent une adresse IP disponible, un masque de sous-réseau et une durée de bail."
      },
      {
        "id": "s3",
        "label": "3. DHCPREQUEST (Client -> Broadcast)",
        "labelFr": "3. DHCPREQUEST (Client -> Broadcast)",
        "detail": "Le client choisit une offre et émet une requête publique confirmant son choix et avertissant les autres serveurs.",
        "detailFr": "Le client choisit une offre et émet une requête publique confirmant son choix et avertissant les autres serveurs."
      },
      {
        "id": "s4",
        "label": "4. DHCPACK (Serveur DHCP sélectionné -> Client)",
        "labelFr": "4. DHCPACK (Serveur DHCP sélectionné -> Client)",
        "detail": "Le serveur valide l'assignation définitive du bail, transmet l'adresse de la passerelle et les serveurs DNS.",
        "detailFr": "Le serveur valide l'assignation définitive du bail, transmet l'adresse de la passerelle et les serveurs DNS."
      },
      {
        "id": "s5",
        "label": "5. Configuration locale de l'interface et de /etc/resolv.conf",
        "labelFr": "5. Configuration locale de l'interface et de /etc/resolv.conf",
        "detail": "Le client (dhclient, NetworkManager) assigne l'IP à l'interface eth0 et inscrit la route par défaut.",
        "detailFr": "Le client (dhclient, NetworkManager) assigne l'IP à l'interface eth0 et inscrit la route par défaut."
      }
    ],
    "explanation": "L'acronyme universel DORA définit la négociation DHCP : Discover (recherche client en broadcast) -> Offer (proposition du serveur) -> Request (demande de confirmation du client) -> Acknowledge (accusé de réception et fixation des paramètres IP/DNS).",
    "explanationFr": "L'acronyme universel DORA définit la négociation DHCP : Discover (recherche client en broadcast) -> Offer (proposition du serveur) -> Request (demande de confirmation du client) -> Acknowledge (accusé de réception et fixation des paramètres IP/DNS)."
  },
  {
    "id": "seq-lpic1-37",
    "title": "Ordre de résolution de noms d'hôtes côté client",
    "titleFr": "Ordre de résolution de noms d'hôtes côté client",
    "certification": "lpic-1",
    "topicNumber": 109,
    "objectiveId": "109.2",
    "category": "Notions Fondamentales Réseau",
    "description": "Lorsqu'une commande telle que 'ping serveur.local' est invoquée, dans quel ordre le système Linux résout-il le nom en adresse IP ?",
    "descriptionFr": "Lorsqu'une commande telle que 'ping serveur.local' est invoquée, dans quel ordre le système Linux résout-il le nom en adresse IP ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Lecture de la directive 'hosts:' dans /etc/nsswitch.conf",
        "labelFr": "1. Lecture de la directive 'hosts:' dans /etc/nsswitch.conf",
        "detail": "Le Name Service Switch définit l'ordre des modules de recherche (par exemple : 'hosts: files dns').",
        "detailFr": "Le Name Service Switch définit l'ordre des modules de recherche (par exemple : 'hosts: files dns')."
      },
      {
        "id": "s2",
        "label": "2. Consultation du module 'files' : fichier local /etc/hosts",
        "labelFr": "2. Consultation du module 'files' : fichier local /etc/hosts",
        "detail": "Recherche d'une association statique Nom <-> IP dans la table locale des hôtes.",
        "detailFr": "Recherche d'une association statique Nom <-> IP dans la table locale des hôtes."
      },
      {
        "id": "s3",
        "label": "3. Consultation du module 'dns' : lecture de /etc/resolv.conf",
        "labelFr": "3. Consultation du module 'dns' : lecture de /etc/resolv.conf",
        "detail": "Extraction des adresses IP des serveurs de noms récursifs déclarés avec la directive 'nameserver'.",
        "detailFr": "Extraction des adresses IP des serveurs de noms récursifs déclarés avec la directive 'nameserver'."
      },
      {
        "id": "s4",
        "label": "4. Émission d'une requête DNS UDP sur le port 53 vers le premier serveur",
        "labelFr": "4. Émission d'une requête DNS UDP sur le port 53 vers le premier serveur",
        "detail": "Envoi de la requête de type A (IPv4) ou AAAA (IPv6) avec gestion d'un délai d'attente (timeout).",
        "detailFr": "Envoi de la requête de type A (IPv4) ou AAAA (IPv6) avec gestion d'un délai d'attente (timeout)."
      },
      {
        "id": "s5",
        "label": "5. Transmission de l'adresse IP résolue à la fonction getaddrinfo() de la libc",
        "labelFr": "5. Transmission de l'adresse IP résolue à la fonction getaddrinfo() de la libc",
        "detail": "L'application reçoit la structure sockaddr et peut initier la connexion réseau.",
        "detailFr": "L'application reçoit la structure sockaddr et peut initier la connexion réseau."
      }
    ],
    "explanation": "La libc lit /etc/nsswitch.conf (directive hosts) qui dicte les étapes. Si 'files' précède 'dns', Linux cherche d'abord dans /etc/hosts. S'il n'y est pas, il lit /etc/resolv.conf et contacte le premier 'nameserver' en UDP 53.",
    "explanationFr": "La libc lit /etc/nsswitch.conf (directive hosts) qui dicte les étapes. Si 'files' précède 'dns', Linux cherche d'abord dans /etc/hosts. S'il n'y est pas, il lit /etc/resolv.conf et contacte le premier 'nameserver' en UDP 53."
  },
  {
    "id": "seq-lpic1-38",
    "title": "Établissement d'une connexion TCP (3-Way Handshake)",
    "titleFr": "Établissement d'une connexion TCP (3-Way Handshake)",
    "certification": "lpic-1",
    "topicNumber": 109,
    "objectiveId": "109.1",
    "category": "Notions Fondamentales Réseau",
    "description": "Ordonnez les 3 étapes d'échange de paquets du protocole TCP permettant d'établir une session fiable et orientée connexion.",
    "descriptionFr": "Ordonnez les 3 étapes d'échange de paquets du protocole TCP permettant d'établir une session fiable et orientée connexion.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Le serveur est en écoute passive : état LISTEN",
        "labelFr": "1. Le serveur est en écoute passive : état LISTEN",
        "detail": "Un port de service (ex: 80 pour HTTP, 22 pour SSH) est ouvert et attend des demandes entrantes.",
        "detailFr": "Un port de service (ex: 80 pour HTTP, 22 pour SSH) est ouvert et attend des demandes entrantes."
      },
      {
        "id": "s2",
        "label": "2. Envoi du paquet SYN par le client (état SYN_SENT)",
        "labelFr": "2. Envoi du paquet SYN par le client (état SYN_SENT)",
        "detail": "Le client choisit un numéro de séquence initial aléatoire (ISN = X) et demande l'ouverture de connexion.",
        "detailFr": "Le client choisit un numéro de séquence initial aléatoire (ISN = X) et demande l'ouverture de connexion."
      },
      {
        "id": "s3",
        "label": "3. Réponse SYN-ACK du serveur (état SYN_RCVD)",
        "labelFr": "3. Réponse SYN-ACK du serveur (état SYN_RCVD)",
        "detail": "Le serveur acquitte la séquence reçue (ACK = X + 1) et transmet son propre numéro de séquence (ISN = Y).",
        "detailFr": "Le serveur acquitte la séquence reçue (ACK = X + 1) et transmet son propre numéro de séquence (ISN = Y)."
      },
      {
        "id": "s4",
        "label": "4. Envoi du paquet final ACK par le client",
        "labelFr": "4. Envoi du paquet final ACK par le client",
        "detail": "Le client accuse réception de la séquence du serveur (ACK = Y + 1).",
        "detailFr": "Le client accuse réception de la séquence du serveur (ACK = Y + 1)."
      },
      {
        "id": "s5",
        "label": "5. Passage des deux extrémités à l'état ESTABLISHED",
        "labelFr": "5. Passage des deux extrémités à l'état ESTABLISHED",
        "detail": "La connexion bidirectionnelle fiable est établie et le transfert de données applicatives peut commencer.",
        "detailFr": "La connexion bidirectionnelle fiable est établie et le transfert de données applicatives peut commencer."
      }
    ],
    "explanation": "Le 3-Way Handshake de TCP garantit la synchronisation des numéros de séquence : 1. Client envoie SYN -> 2. Serveur répond SYN-ACK -> 3. Client envoie ACK -> La session devient ESTABLISHED.",
    "explanationFr": "Le 3-Way Handshake de TCP garantit la synchronisation des numéros de séquence : 1. Client envoie SYN -> 2. Serveur répond SYN-ACK -> 3. Client envoie ACK -> La session devient ESTABLISHED."
  },
  {
    "id": "seq-lpic1-39",
    "title": "Génération et déploiement de clés SSH asymétriques",
    "titleFr": "Génération et déploiement de clés SSH asymétriques",
    "certification": "lpic-1",
    "topicNumber": 110,
    "objectiveId": "110.2",
    "category": "Sécurité de l'Hôte",
    "description": "Ordonnez la procédure sécurisée pour configurer une authentification SSH par bi-clé Ed25519 sans mot de passe vers un serveur distant.",
    "descriptionFr": "Ordonnez la procédure sécurisée pour configurer une authentification SSH par bi-clé Ed25519 sans mot de passe vers un serveur distant.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Génération de la paire de clés sur le poste client : ssh-keygen -t ed25519",
        "labelFr": "1. Génération de la paire de clés sur le poste client : ssh-keygen -t ed25519",
        "detail": "Création de la clé privée (~/.ssh/id_ed25519) et de la clé publique (~/.ssh/id_ed25519.pub).",
        "detailFr": "Création de la clé privée (~/.ssh/id_ed25519) et de la clé publique (~/.ssh/id_ed25519.pub)."
      },
      {
        "id": "s2",
        "label": "2. Transfert sécurisé de la clé publique : ssh-copy-id -i ~/.ssh/id_ed25519.pub user@serveur",
        "labelFr": "2. Transfert sécurisé de la clé publique : ssh-copy-id -i ~/.ssh/id_ed25519.pub user@serveur",
        "detail": "Connexion authentifiée pour annexer la clé publique dans le fichier distant ~/.ssh/authorized_keys.",
        "detailFr": "Connexion authentifiée pour annexer la clé publique dans le fichier distant ~/.ssh/authorized_keys."
      },
      {
        "id": "s3",
        "label": "3. Contrôle des permissions strictes sur le serveur (chmod 700 ~/.ssh et chmod 600 authorized_keys)",
        "labelFr": "3. Contrôle des permissions strictes sur le serveur (chmod 700 ~/.ssh et chmod 600 authorized_keys)",
        "detail": "OpenSSH refuse impérativement l'authentification par clé si le répertoire ou le fichier autorise l'écriture à un tiers.",
        "detailFr": "OpenSSH refuse impérativement l'authentification par clé si le répertoire ou le fichier autorise l'écriture à un tiers."
      },
      {
        "id": "s4",
        "label": "4. Test de connexion sans mot de passe : ssh user@serveur",
        "labelFr": "4. Test de connexion sans mot de passe : ssh user@serveur",
        "detail": "Validation que le serveur accepte la signature cryptographique sans solliciter le mot de passe UNIX.",
        "detailFr": "Validation que le serveur accepte la signature cryptographique sans solliciter le mot de passe UNIX."
      },
      {
        "id": "s5",
        "label": "5. Durcissement optionnel dans /etc/ssh/sshd_config : PasswordAuthentication no",
        "labelFr": "5. Durcissement optionnel dans /etc/ssh/sshd_config : PasswordAuthentication no",
        "detail": "Désactivation complète de l'authentification par mot de passe et rechargement de sshd.",
        "detailFr": "Désactivation complète de l'authentification par mot de passe et rechargement de sshd."
      }
    ],
    "explanation": "La séquence standard de déploiement SSH requiert : génération de la paire avec ssh-keygen -> transfert de la clé publique avec ssh-copy-id -> vérification des permissions (700 pour ~/.ssh et 600 pour authorized_keys) -> test de connexion -> désactivation du PasswordAuthentication.",
    "explanationFr": "La séquence standard de déploiement SSH requiert : génération de la paire avec ssh-keygen -> transfert de la clé publique avec ssh-copy-id -> vérification des permissions (700 pour ~/.ssh et 600 pour authorized_keys) -> test de connexion -> désactivation du PasswordAuthentication."
  },
  {
    "id": "seq-lpic1-40",
    "title": "Configuration et mise en service d'un pare-feu local UFW",
    "titleFr": "Configuration et mise en service d'un pare-feu local UFW",
    "certification": "lpic-1",
    "topicNumber": 110,
    "objectiveId": "110.1",
    "category": "Sécurité de l'Hôte",
    "description": "Ordonnez les commandes UFW pour sécuriser un serveur hôte sans risquer de perdre l'accès à distance.",
    "descriptionFr": "Ordonnez les commandes UFW pour sécuriser un serveur hôte sans risquer de perdre l'accès à distance.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition de la politique par défaut entrante : ufw default deny incoming",
        "labelFr": "1. Définition de la politique par défaut entrante : ufw default deny incoming",
        "detail": "Blocage par défaut de tout trafic réseau entrant non sollicité.",
        "detailFr": "Blocage par défaut de tout trafic réseau entrant non sollicité."
      },
      {
        "id": "s2",
        "label": "2. Définition de la politique par défaut sortante : ufw default allow outgoing",
        "labelFr": "2. Définition de la politique par défaut sortante : ufw default allow outgoing",
        "detail": "Autorisation pour le serveur d'initier des connexions vers l'extérieur (mises à jour apt/dnf, DNS, etc.).",
        "detailFr": "Autorisation pour le serveur d'initier des connexions vers l'extérieur (mises à jour apt/dnf, DNS, etc.)."
      },
      {
        "id": "s3",
        "label": "3. Autorisation explicite du port d'administration : ufw allow 22/tcp (ou ufw allow ssh)",
        "labelFr": "3. Autorisation explicite du port d'administration : ufw allow 22/tcp (ou ufw allow ssh)",
        "detail": "Étape VILALE avant toute activation pour éviter d'être immédiatement déconnecté et exclu du serveur.",
        "detailFr": "Étape VILALE avant toute activation pour éviter d'être immédiatement déconnecté et exclu du serveur."
      },
      {
        "id": "s4",
        "label": "4. Activation du pare-feu : ufw enable",
        "labelFr": "4. Activation du pare-feu : ufw enable",
        "detail": "Application active des règles iptables/netfilter et activation du service au démarrage.",
        "detailFr": "Application active des règles iptables/netfilter et activation du service au démarrage."
      },
      {
        "id": "s5",
        "label": "5. Contrôle de l'état des règles actives : ufw status verbose",
        "labelFr": "5. Contrôle de l'état des règles actives : ufw status verbose",
        "detail": "Vérification des politiques par défaut et de la liste numérotée des ports autorisés.",
        "detailFr": "Vérification des politiques par défaut et de la liste numérotée des ports autorisés."
      }
    ],
    "explanation": "Règle absolue d'administration Linux : on définit d'abord la politique par défaut (default deny incoming, default allow outgoing), on ouvre IMPÉRATIVEMENT le port SSH (22/tcp) AVANT d'activer le pare-feu avec 'ufw enable', puis on vérifie avec 'ufw status verbose'.",
    "explanationFr": "Règle absolue d'administration Linux : on définit d'abord la politique par défaut (default deny incoming, default allow outgoing), on ouvre IMPÉRATIVEMENT le port SSH (22/tcp) AVANT d'activer le pare-feu avec 'ufw enable', puis on vérifie avec 'ufw status verbose'."
  }
];
