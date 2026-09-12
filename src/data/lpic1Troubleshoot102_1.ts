import { TroubleshootingChallenge } from '../types';

export const lpic1Troubleshoot102_1: TroubleshootingChallenge[] = [
  // ==========================================
  // TOPIC 105: SHELLS AND SHELL SCRIPTING (105.1 - 105.2) [10 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-105-01',
    title: 'Variable d\'environnement non transmise aux sous-processus sans "export"',
    titleFr: 'Variable locale non transmise aux sous-processus sans commande export',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.1',
    category: 'Shells & Scripting',
    scenario: 'L\'utilisateur définit "DB_PORT=5432" dans son terminal puis lance un script Python "python3 app.py". Le script renvoie "Error: DB_PORT environment variable is not set".',
    scenarioFr: 'L\'utilisateur définit "DB_PORT=5432" dans son terminal puis lance un script Python "python3 app.py". Le script renvoie "Error: DB_PORT environment variable is not set".',
    codeSnippet: `user@srv:~$ DB_PORT=5432
user@srv:~$ python3 -c 'import os; print(os.getenv("DB_PORT"))'
None`,
    language: 'bash',
    bugDescription: 'La variable est locale au shell actuel. Sans la commande "export", elle n\'est pas injectée dans l\'environnement des processus enfants.',
    bugDescriptionFr: 'La variable est locale au shell actuel. Sans la commande "export", elle n\'est pas injectée dans l\'environnement des processus enfants.',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut utiliser "export DB_PORT=5432" (ou "export DB_PORT") pour propager la variable aux processus enfants',
        labelFr: 'Il faut utiliser "export DB_PORT=5432" (ou "export DB_PORT") pour propager la variable aux processus enfants',
        isCorrect: true,
        explanation: 'Dans Bash, une assignation sans export crée une variable locale au shell courant. La table d\'environnement héritée par fork/exec nécessite l\'attribut export.',
        explanationFr: 'Dans Bash, une assignation sans export crée une variable locale au shell courant. La table d\'environnement héritée par fork/exec nécessite l\'attribut export.'
      },
      {
        id: 'opt-2',
        label: 'Il faut redémarrer la machine pour valider les variables',
        labelFr: 'Il faut redémarrer la machine pour valider les variables',
        isCorrect: false,
        explanation: 'Les variables d\'environnement sont modifiables instantanément en mémoire.',
        explanationFr: 'Les variables d\'environnement sont modifiables instantanément en mémoire.'
      },
      {
        id: 'opt-3',
        label: 'Python est incapable de lire l\'environnement sous Linux',
        labelFr: 'Python est incapable de lire l\'environnement sous Linux',
        isCorrect: false,
        explanation: 'os.getenv() lit l\'environnement hérité standard.',
        explanationFr: 'os.getenv() lit l\'environnement hérité standard.'
      },
      {
        id: 'opt-4',
        label: 'Il faut placer la variable dans /etc/hosts',
        labelFr: 'Il faut placer la variable dans /etc/hosts',
        isCorrect: false,
        explanation: '/etc/hosts est la table de résolution de noms statique.',
        explanationFr: '/etc/hosts est la table de résolution de noms statique.'
      }
    ],
    correctedSnippet: `user@srv:~$ export DB_PORT=5432
user@srv:~$ python3 -c 'import os; print(os.getenv("DB_PORT"))'
5432`,
    fixExplanation: '"export" marque la variable pour qu\'elle soit transmise à tous les programmes et sous-shells invoqués.',
    fixExplanationFr: '"export" marque la variable pour qu\'elle soit transmise à tous les programmes et sous-shells invoqués.'
  },
  {
    id: 'tb-lpic1-105-02',
    title: 'Shebang manquant ou invalide provoquant l\'échec d\'exécution d\'un script',
    titleFr: 'Erreur d\'interpréteur : script exécuté par le mauvais shell en l\'absence de shebang #!/bin/bash',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.2',
    category: 'Shells & Scripting',
    scenario: 'Un script contenant des tableaux Bash ("arr=(1 2 3)") et des conditions "[[ ]]" échoue lorsqu\'il est lancé directement avec "./script.sh" sur un système où /bin/sh pointe vers dash.',
    scenarioFr: 'Un script contenant des tableaux Bash ("arr=(1 2 3)") et des conditions "[[ ]]" échoue lorsqu\'il est lancé directement avec "./script.sh" sur un système où /bin/sh pointe vers dash.',
    codeSnippet: `user@srv:~$ ./script.sh
./script.sh: 3: Syntax error: "(" unexpected`,
    language: 'bash',
    bugDescription: 'La première ligne du script ne contient pas le shebang "#!/bin/bash". Le système le passe donc à /bin/sh (dash sous Debian) qui ne gère pas les extensions bashismes.',
    bugDescriptionFr: 'La première ligne du script ne contient pas le shebang "#!/bin/bash". Le système le passe donc à /bin/sh (dash sous Debian) qui ne gère pas les extensions bashismes.',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter la ligne d\'en-tête Shebang "#!/bin/bash" tout en haut du script',
        labelFr: 'Ajouter la ligne d\'en-tête Shebang "#!/bin/bash" tout en haut du script',
        isCorrect: true,
        explanation: 'Le noyau lit les 2 premiers octets ("#!") pour déterminer le binaire interpréteur. Sans shebang, le shell de secours POSIX (/bin/sh) est invoqué.',
        explanationFr: 'Le noyau lit les 2 premiers octets ("#!") pour déterminer le binaire interpréteur. Sans shebang, le shell de secours POSIX (/bin/sh) est invoqué.'
      },
      {
        id: 'opt-2',
        label: 'Renommer le script en "script.exe"',
        labelFr: 'Renommer le script en "script.exe"',
        isCorrect: false,
        explanation: 'Linux n\'utilise pas les extensions pour exécuter des scripts.',
        explanationFr: 'Linux n\'utilise pas les extensions pour exécuter des scripts.'
      },
      {
        id: 'opt-3',
        label: 'Donner les droits 777 avec chmod',
        labelFr: 'Donner les droits 777 avec chmod',
        isCorrect: false,
        explanation: 'Le script s\'exécute déjà (le message vient du parseur syntaxique dash).',
        explanationFr: 'Le script s\'exécute déjà (le message vient du parseur syntaxique dash).'
      },
      {
        id: 'opt-4',
        label: 'Supprimer tous les tableaux du script',
        labelFr: 'Supprimer tous les tableaux du script',
        isCorrect: false,
        explanation: 'Les tableaux sont des structures standard supportées par Bash.',
        explanationFr: 'Les tableaux sont des structures standard supportées par Bash.'
      }
    ],
    correctedSnippet: `#!/bin/bash
arr=(1 2 3)
echo "Taille: \${#arr[@]}"`,
    fixExplanation: 'La directive "#!/bin/bash" garantit que le noyau lance l\'interpréteur Bash compatible.',
    fixExplanationFr: 'La directive "#!/bin/bash" garantit que le noyau lance l\'interpréteur Bash compatible.'
  },
  {
    id: 'tb-lpic1-105-03',
    title: 'Espaces interdits autour du signe égal lors de l\'assignation d\'une variable',
    titleFr: 'Erreur "command not found" causée par des espaces autour du "=" dans une variable shell',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.1',
    category: 'Shells & Scripting',
    scenario: 'Un administrateur veut affecter un nom de serveur dans une variable mais tape "HOST = srv01". Le shell répond "HOST: command not found".',
    scenarioFr: 'Un administrateur veut affecter un nom de serveur dans une variable mais tape "HOST = srv01". Le shell répond "HOST: command not found".',
    codeSnippet: `user@srv:~$ HOST = srv01
bash: HOST: command not found`,
    language: 'bash',
    bugDescription: 'En syntaxe shell, aucun espace ne doit entourer le signe égal ("=") d\'assignation.',
    bugDescriptionFr: 'En syntaxe shell, aucun espace ne doit entourer le signe égal ("=") d\'assignation.',
    options: [
      {
        id: 'opt-1',
        label: 'Supprimer les espaces autour du symbole égal : "HOST=srv01"',
        labelFr: 'Supprimer les espaces autour du symbole égal : "HOST=srv01"',
        isCorrect: true,
        explanation: 'Dans Bash, "HOST = srv01" interprète "HOST" comme une commande et "=" comme son premier argument. L\'affectation stricte s\'écrit "VAR=valeur".',
        explanationFr: 'Dans Bash, "HOST = srv01" interprète "HOST" comme une commande et "=" comme son premier argument. L\'affectation stricte s\'écrit "VAR=valeur".'
      },
      {
        id: 'opt-2',
        label: 'Utiliser "set HOST = srv01"',
        labelFr: 'Utiliser "set HOST = srv01"',
        isCorrect: false,
        explanation: '"set" avec cette syntaxe assignerait des paramètres de position $1, $2...',
        explanationFr: '"set" avec cette syntaxe assignerait des paramètres de position $1, $2...'
      },
      {
        id: 'opt-3',
        label: 'Les noms de variables doivent être en minuscules',
        labelFr: 'Les noms de variables doivent être en minuscules',
        isCorrect: false,
        explanation: 'Les variables en majuscules sont conventionnelles et parfaitement valides en shell.',
        explanationFr: 'Les variables en majuscules sont conventionnelles et parfaitement valides en shell.'
      },
      {
        id: 'opt-4',
        label: 'Il faut utiliser "let HOST = srv01"',
        labelFr: 'Il faut utiliser "let HOST = srv01"',
        isCorrect: false,
        explanation: '"let" est réservé aux calculs arithmétiques.',
        explanationFr: '"let" est réservé aux calculs arithmétiques.'
      }
    ],
    correctedSnippet: `HOST="srv01"
echo "Connecté à $HOST"`,
    fixExplanation: 'L\'absence d\'espace autour du "=" permet au shell de reconnaître l\'instruction d\'affectation.',
    fixExplanationFr: 'L\'absence d\'espace autour du "=" permet au shell de reconnaître l\'instruction d\'affectation.'
  },
  {
    id: 'tb-lpic1-105-04',
    title: 'Code de retour ($?) et opérateur logique conditionnel',
    titleFr: 'Vérification du code de statut de sortie avec $? après une commande',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.2',
    category: 'Shells & Scripting',
    scenario: 'Un script vérifie le statut d\'un ping. Le développeur tape une commande echo intermédiaire, et le test de condition teste le code de retour du echo au lieu du ping.',
    scenarioFr: 'Un script vérifie le statut d\'un ping. Le développeur tape une commande echo intermédiaire, et le test de condition teste le code de retour du echo au lieu du ping.',
    codeSnippet: `ping -c 1 10.255.255.1
echo "Vérification terminée."
if [ $? -eq 0 ]; then
    echo "Hôte joignable !"
fi
# Résultat : "Hôte joignable !" s'affiche même si le ping a échoué !`,
    language: 'bash',
    bugDescription: '"$?" ne contient que le statut de sortie de la DERNIÈRE commande exécutée. La commande "echo" a réussi (code 0) et a écrasé le code d\'échec du ping.',
    bugDescriptionFr: '"$?" ne contient que le statut de sortie de la DERNIÈRE commande exécutée. La commande "echo" a réussi (code 0) et a écrasé le code d\'échec du ping.',
    options: [
      {
        id: 'opt-1',
        label: 'La variable "$?" stocke uniquement le résultat de la commande immédiatement précédente (l\'instruction echo ici) ; il faut tester directement "if ping ...; then" ou sauvegarder $? aussitôt',
        labelFr: 'La variable "$?" stocke uniquement le résultat de la commande immédiatement précédente (l\'instruction echo ici) ; il faut tester directement "if ping ...; then" ou sauvegarder $? aussitôt',
        isCorrect: true,
        explanation: 'Toute commande (y compris echo) réinitialise instantanément $?. En shell idiomatique, on écrit directement "if ping -c 1 IP; then".',
        explanationFr: 'Toute commande (y compris echo) réinitialise instantanément $?. En shell idiomatique, on écrit directement "if ping -c 1 IP; then".'
      },
      {
        id: 'opt-2',
        label: 'ping renvoie toujours 0',
        labelFr: 'ping renvoie toujours 0',
        isCorrect: false,
        explanation: 'ping renvoie 1 ou 2 en cas de perte de paquets ou d\'erreur réseau.',
        explanationFr: 'ping renvoie 1 ou 2 en cas de perte de paquets ou d\'erreur réseau.'
      },
      {
        id: 'opt-3',
        label: 'Le code de succès en Linux est 1 et non 0',
        labelFr: 'Le code de succès en Linux est 1 et non 0',
        isCorrect: false,
        explanation: 'En Unix, 0 indique le succès et toute valeur non nulle indique une erreur.',
        explanationFr: 'En Unix, 0 indique le succès et toute valeur non nulle indique une erreur.'
      },
      {
        id: 'opt-4',
        label: 'La variable $? doit être précédée d\'un antislash',
        labelFr: 'La variable $? doit être précédée d\'un antislash',
        isCorrect: false,
        explanation: 'Un antislash empêcherait l\'évaluation de la variable.',
        explanationFr: 'Un antislash empêcherait l\'évaluation de la variable.'
      }
    ],
    correctedSnippet: `if ping -c 1 10.255.255.1 > /dev/null 2>&1; then
    echo "Hôte joignable !"
else
    echo "Hôte injoignable !"
fi`,
    fixExplanation: 'Brancher la condition if directement sur la commande évalue nativement son code de sortie.',
    fixExplanationFr: 'Brancher la condition if directement sur la commande évalue nativement son code de sortie.'
  },
  {
    id: 'tb-lpic1-105-05',
    title: 'Boucle for shell traitant des noms de fichiers comportant des espaces',
    titleFr: 'Découpage erroné des noms de fichiers contenant des espaces avec "for f in $(ls)"',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.2',
    category: 'Shells & Scripting',
    scenario: 'Un script boucle sur des fichiers multimédia : "for f in $(ls *.mp3); do echo "Fichier: $f"; done". Un fichier nommé "Mon Voyage.mp3" est éclaté en deux fichiers fictifs "Mon" et "Voyage.mp3".',
    scenarioFr: 'Un script boucle sur des fichiers multimédia : "for f in $(ls *.mp3); do echo "Fichier: $f"; done". Un fichier nommé "Mon Voyage.mp3" est éclaté en deux fichiers fictifs "Mon" et "Voyage.mp3".',
    codeSnippet: `user@srv:~$ for f in $(ls *.mp3); do
>     echo "Traitement: $f"
> done
Traitement: Mon
Traitement: Voyage.mp3`,
    language: 'bash',
    bugDescription: 'L\'expansion de commande "$(ls)" est soumise au mot-splitting par la variable IFS (qui contient l\'espace). Il faut utiliser le globbing direct "for f in *.mp3".',
    bugDescriptionFr: 'L\'expansion de commande "$(ls)" est soumise au mot-splitting par la variable IFS (qui contient l\'espace). Il faut utiliser le globbing direct "for f in *.mp3".',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser le globbing natif du shell "for f in *.mp3; do" avec les variables entre guillemets ("$f")',
        labelFr: 'Utiliser le globbing natif du shell "for f in *.mp3; do" avec les variables entre guillemets ("$f")',
        isCorrect: true,
        explanation: 'Le globbing génère chaque élément comme un mot unique préservant les espaces, sans subir le découpage par mot imposé par $(ls).',
        explanationFr: 'Le globbing génère chaque élément comme un mot unique préservant les espaces, sans subir le découpage par mot imposé par $(ls).'
      },
      {
        id: 'opt-2',
        label: 'Renommer tous les fichiers Linux en enlevant les voyelles',
        labelFr: 'Renommer tous les fichiers Linux en enlevant les voyelles',
        isCorrect: false,
        explanation: 'Inutile et destructeur pour les données.',
        explanationFr: 'Inutile et destructeur pour les données.'
      },
      {
        id: 'opt-3',
        label: 'ls est interdit dans les scripts par la norme POSIX',
        labelFr: 'ls est interdit dans les scripts par la norme POSIX',
        isCorrect: false,
        explanation: 'ls est un binaire standard, mais son parsing textuel est une mauvaise pratique reconnue.',
        explanationFr: 'ls est un binaire standard, mais son parsing textuel est une mauvaise pratique reconnue.'
      },
      {
        id: 'opt-4',
        label: 'Forcer la commande avec "for --no-spaces f"',
        labelFr: 'Forcer la commande avec "for --no-spaces f"',
        isCorrect: false,
        explanation: 'Cette option n\'existe pas dans la syntaxe de for.',
        explanationFr: 'Cette option n\'existe pas dans la syntaxe de for.'
      }
    ],
    correctedSnippet: `for f in *.mp3; do
    [ -e "$f" ] || continue
    echo "Traitement: $f"
done`,
    fixExplanation: 'Le globbing direct préserve intégralement les espaces contenus dans les noms de fichiers.',
    fixExplanationFr: 'Le globbing direct préserve intégralement les espaces contenus dans les noms de fichiers.'
  },

  // ==========================================
  // TOPIC 106: USER INTERFACES AND DESKTOPS (106.1 - 106.3) [5 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-106-01',
    title: 'Variable DISPLAY manquante pour le déport d\'application graphique X11',
    titleFr: 'Erreur "cannot open display" lors du lancement d\'un client X11 distant',
    certification: 'lpic-1',
    topicNumber: 106,
    objectiveId: '106.1',
    category: 'User Interfaces & Desktops',
    scenario: 'Connecté via SSH à un serveur distant, l\'utilisateur lance "xclock" mais reçoit immédiatement l\'erreur "Error: Can\'t open display:".',
    scenarioFr: 'Connecté via SSH à un serveur distant, l\'utilisateur lance "xclock" mais reçoit immédiatement l\'erreur "Error: Can\'t open display:".',
    codeSnippet: `user@srv:~$ xclock
Error: Can't open display: 
user@srv:~$ echo $DISPLAY
# La variable est vide !`,
    language: 'bash',
    bugDescription: 'La variable d\'environnement DISPLAY n\'est pas définie ou le transfert X11 n\'a pas été activé lors de la connexion SSH.',
    bugDescriptionFr: 'La variable d\'environnement DISPLAY n\'est pas définie ou le transfert X11 n\'a pas été activé lors de la connexion SSH.',
    options: [
      {
        id: 'opt-1',
        label: 'Activer le transfert X11 avec "ssh -X" ou "ssh -Y", ou configurer DISPLAY sur le serveur X cible (ex: DISPLAY=:0)',
        labelFr: 'Activer le transfert X11 avec "ssh -X" ou "ssh -Y", ou configurer DISPLAY sur le serveur X cible (ex: DISPLAY=:0)',
        isCorrect: true,
        explanation: 'Tout client X11 a besoin de savoir où envoyer ses fenêtres via la variable $DISPLAY (ex: "localhost:10.0" pour le tunnel SSH ou ":0" en local).',
        explanationFr: 'Tout client X11 a besoin de savoir où envoyer ses fenêtres via la variable $DISPLAY (ex: "localhost:10.0" pour le tunnel SSH ou ":0" en local).'
      },
      {
        id: 'opt-2',
        label: 'Installer le paquet xorg-server sur la machine distante obligatoirement',
        labelFr: 'Installer le paquet xorg-server sur la machine distante obligatoirement',
        isCorrect: false,
        explanation: 'Le serveur distant n\'a besoin que des bibliothèques clientes X11, pas du serveur graphique matériel.',
        explanationFr: 'Le serveur distant n\'a besoin que des bibliothèques clientes X11, pas du serveur graphique matériel.'
      },
      {
        id: 'opt-3',
        label: 'xclock ne fonctionne que sous Wayland',
        labelFr: 'xclock ne fonctionne que sous Wayland',
        isCorrect: false,
        explanation: 'xclock est l\'exemple historique par excellence d\'application cliente X11.',
        explanationFr: 'xclock est l\'exemple historique par excellence d\'application cliente X11.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer /tmp/.X11-unix',
        labelFr: 'Supprimer /tmp/.X11-unix',
        isCorrect: false,
        explanation: 'Ce dossier contient les sockets UNIX indispensables à la communication locale de Xorg.',
        explanationFr: 'Ce dossier contient les sockets UNIX indispensables à la communication locale de Xorg.'
      }
    ],
    correctedSnippet: `# Se reconnecter avec le transfert X11 activé :
ssh -X user@srv
# La variable DISPLAY est alors automatiquement initialisée :
echo $DISPLAY
localhost:10.0
xclock`,
    fixExplanation: '"ssh -X" négocie l\'authentification xauth et configure automatiquement la variable DISPLAY.',
    fixExplanationFr: '"ssh -X" négocie l\'authentification xauth et configure automatiquement la variable DISPLAY.'
  },
  {
    id: 'tb-lpic1-106-02',
    title: 'Autorisation d\'accès au serveur X avec xauth et fichier .Xauthority',
    titleFr: 'Erreur "Invalid MIT-MAGIC-COOKIE-1 key" lors de l\'accès à une session graphique',
    certification: 'lpic-1',
    topicNumber: 106,
    objectiveId: '106.1',
    category: 'User Interfaces & Desktops',
    scenario: 'Après avoir basculé sur le compte root avec "su", la commande graphique gedit renvoie "Invalid MIT-MAGIC-COOKIE-1 key" et refuse de s\'afficher sur l\'écran de l\'utilisateur.',
    scenarioFr: 'Après avoir basculé sur le compte root avec "su", la commande graphique gedit renvoie "Invalid MIT-MAGIC-COOKIE-1 key" et refuse de s\'afficher sur l\'écran de l\'utilisateur.',
    codeSnippet: `root@srv:~# gedit
Invalid MIT-MAGIC-COOKIE-1 key
Unable to init server: Could not connect: Connection refused
cannot open display: :0`,
    language: 'bash',
    bugDescription: 'Le cookie d\'autorisation X11 stocké dans ~/.Xauthority appartient à l\'utilisateur initial et n\'est pas accessible à root.',
    bugDescriptionFr: 'Le cookie d\'autorisation X11 stocké dans ~/.Xauthority appartient à l\'utilisateur initial et n\'est pas accessible à root.',
    options: [
      {
        id: 'opt-1',
        label: 'Fusionner le cookie d\'authentification avec "xauth merge ~user/.Xauthority" ou exporter XAUTHORITY',
        labelFr: 'Fusionner le cookie d\'authentification avec "xauth merge ~user/.Xauthority" ou exporter XAUTHORITY',
        isCorrect: true,
        explanation: 'Le protocole X11 contrôle les accès via des clés magiques ("cookies") gérées par l\'utilitaire "xauth" dans le fichier ~/.Xauthority.',
        explanationFr: 'Le protocole X11 contrôle les accès via des clés magiques ("cookies") gérées par l\'utilitaire "xauth" dans le fichier ~/.Xauthority.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer Xorg avec apt purge xorg',
        labelFr: 'Supprimer Xorg avec apt purge xorg',
        isCorrect: false,
        explanation: 'Cela supprimerait l\'environnement graphique complet.',
        explanationFr: 'Cela supprimerait l\'environnement graphique complet.'
      },
      {
        id: 'opt-3',
        label: 'Désactiver le réseau local',
        labelFr: 'Désactiver le réseau local',
        isCorrect: false,
        explanation: 'L\'affichage passe par un socket UNIX local /tmp/.X11-unix/X0.',
        explanationFr: 'L\'affichage passe par un socket UNIX local /tmp/.X11-unix/X0.'
      },
      {
        id: 'opt-4',
        label: 'gedit ne peut tourner qu\'en mode texte',
        labelFr: 'gedit ne peut tourner qu\'en mode texte',
        isCorrect: false,
        explanation: 'gedit est un éditeur graphique GNOME.',
        explanationFr: 'gedit est un éditeur graphique GNOME.'
      }
    ],
    correctedSnippet: `export XAUTHORITY=/home/user/.Xauthority
gedit`,
    fixExplanation: 'Pointer vers le fichier ~/.Xauthority de l\'utilisateur permet à root de valider le MIT-MAGIC-COOKIE.',
    fixExplanationFr: 'Pointer vers le fichier ~/.Xauthority de l\'utilisateur permet à root de valider le MIT-MAGIC-COOKIE.'
  },
  {
    id: 'tb-lpic1-106-03',
    title: 'Gestionnaire de connexion graphique par défaut : GDM, LightDM, SDDM',
    titleFr: 'Affichage graphique absent au démarrage : service Display Manager inactif',
    certification: 'lpic-1',
    topicNumber: 106,
    objectiveId: '106.2',
    category: 'User Interfaces & Desktops',
    scenario: 'Le serveur démarre en mode texte avec un écran noir malgré une cible "graphical.target". Le service gdm.service est désactivé.',
    scenarioFr: 'Le serveur démarre en mode texte avec un écran noir malgré une cible "graphical.target". Le service gdm.service est désactivé.',
    codeSnippet: `root@srv:~# systemctl status display-manager.service
Unit display-manager.service could not be found.`,
    language: 'bash',
    bugDescription: 'Aucun gestionnaire de connexion (GDM, LightDM, SDDM) n\'est lié à l\'alias display-manager.service.',
    bugDescriptionFr: 'Aucun gestionnaire de connexion (GDM, LightDM, SDDM) n\'est lié à l\'alias display-manager.service.',
    options: [
      {
        id: 'opt-1',
        label: 'Activer le gestionnaire d\'affichage installé (ex: "systemctl enable gdm" ou "systemctl enable lightdm")',
        labelFr: 'Activer le gestionnaire d\'affichage installé (ex: "systemctl enable gdm" ou "systemctl enable lightdm")',
        isCorrect: true,
        explanation: 'La cible graphical.target s\'appuie sur display-manager.service pour présenter l\'écran de login graphique.',
        explanationFr: 'La cible graphical.target s\'appuie sur display-manager.service pour présenter l\'écran de login graphique.'
      },
      {
        id: 'opt-2',
        label: 'Modifier la résolution dans /etc/hosts',
        labelFr: 'Modifier la résolution dans /etc/hosts',
        isCorrect: false,
        explanation: '/etc/hosts est réservé aux adresses IP.',
        explanationFr: '/etc/hosts est réservé aux adresses IP.'
      },
      {
        id: 'opt-3',
        label: 'Changer la carte graphique physique',
        labelFr: 'Changer la carte graphique physique',
        isCorrect: false,
        explanation: 'C\'est une anomalie de configuration logicielle de service.',
        explanationFr: 'C\'est une anomalie de configuration logicielle de service.'
      },
      {
        id: 'opt-4',
        label: 'Désinstaller Wayland',
        labelFr: 'Désinstaller Wayland',
        isCorrect: false,
        explanation: 'GDM sait lancer à la fois des sessions X11 et Wayland.',
        explanationFr: 'GDM sait lancer à la fois des sessions X11 et Wayland.'
      }
    ],
    correctedSnippet: `systemctl enable --now gdm3
# ou lightdm :
systemctl enable --now lightdm`,
    fixExplanation: 'Activer et démarrer le gestionnaire de display rétablit l\'écran d\'accueil graphique.',
    fixExplanationFr: 'Activer et démarrer le gestionnaire de display rétablit l\'écran d\'accueil graphique.'
  },

  // ==========================================
  // TOPIC 107: ADMINISTRATIVE TASKS (107.1 - 107.3) [10 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-107-01',
    title: 'Tâche Cron non exécutée en raison d\'un PATH incomplet',
    titleFr: 'Script Cron échouant mystérieusement car les commandes ne sont pas dans son PATH restreint',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.2',
    category: 'Administrative Tasks',
    scenario: 'Une tâche crontab lance un script toutes les heures : "0 * * * * /opt/backup.sh". Dans le script, la commande "ip" ou "vgdisplay" échoue avec "command not found".',
    scenarioFr: 'Une tâche crontab lance un script toutes les heures : "0 * * * * /opt/backup.sh". Dans le script, la commande "ip" ou "vgdisplay" échoue avec "command not found".',
    codeSnippet: `# Sortie reçue par mail cron :
/opt/backup.sh: line 4: vgdisplay: command not found
/opt/backup.sh: line 8: ip: command not found`,
    language: 'bash',
    bugDescription: 'L\'environnement d\'exécution du démon cron fournit un PATH minimaliste (souvent uniquement /usr/bin:/bin), sans /usr/sbin ni /sbin.',
    bugDescriptionFr: 'L\'environnement d\'exécution du démon cron fournit un PATH minimaliste (souvent uniquement /usr/bin:/bin), sans /usr/sbin ni /sbin.',
    options: [
      {
        id: 'opt-1',
        label: 'Définir explicitement la variable "PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin" en tête de crontab ou utiliser les chemins absolus (/sbin/ip)',
        labelFr: 'Définir explicitement la variable "PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin" en tête de crontab ou utiliser les chemins absolus (/sbin/ip)',
        isCorrect: true,
        explanation: 'Cron ne charge pas le ~/.bashrc ni le profil interactif. Son PATH par défaut est très restreint et exclut les outils d\'administration situés dans /sbin.',
        explanationFr: 'Cron ne charge pas le ~/.bashrc ni le profil interactif. Son PATH par défaut est très restreint et exclut les outils d\'administration situés dans /sbin.'
      },
      {
        id: 'opt-2',
        label: 'Créer un lien symbolique vers chaque binaire dans /tmp',
        labelFr: 'Créer un lien symbolique vers chaque binaire dans /tmp',
        isCorrect: false,
        explanation: '/tmp n\'est pas dans le PATH de cron.',
        explanationFr: '/tmp n\'est pas dans le PATH de cron.'
      },
      {
        id: 'opt-3',
        label: 'Cron ne peut exécuter que des scripts Perl',
        labelFr: 'Cron ne peut exécuter que des scripts Perl',
        isCorrect: false,
        explanation: 'Cron exécute n\'importe quel fichier exécutable.',
        explanationFr: 'Cron exécute n\'importe quel fichier exécutable.'
      },
      {
        id: 'opt-4',
        label: 'Il faut passer par l\'outil "at" obligatoirement',
        labelFr: 'Il faut passer par l\'outil "at" obligatoirement',
        isCorrect: false,
        explanation: '"at" est dédié aux tâches ponctuelles, cron gère la récurrence.',
        explanationFr: '"at" est dédié aux tâches ponctuelles, cron gère la récurrence.'
      }
    ],
    correctedSnippet: `# En tête de la crontab (crontab -e) :
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 * * * * /opt/backup.sh`,
    fixExplanation: 'Déclarer un PATH complet dans la crontab garantit que tous les outils système sont localisés.',
    fixExplanationFr: 'Déclarer un PATH complet dans la crontab garantit que tous les outils système sont localisés.'
  },
  {
    id: 'tb-lpic1-107-02',
    title: 'Compte utilisateur verrouillé et expiration de mot de passe avec chage',
    titleFr: 'Compte verrouillé pour mot de passe expiré : diagnostic et déblocage avec chage',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Administrative Tasks',
    scenario: 'L\'utilisateur "bob" ne peut plus se connecter : "Your account has expired; please contact your system administrator". L\'administrateur doit inspecter et réactiver le compte.',
    scenarioFr: 'L\'utilisateur "bob" ne peut plus se connecter : "Your account has expired; please contact your system administrator". L\'administrateur doit inspecter et réactiver le compte.',
    codeSnippet: `root@srv:~# chage -l bob
Last password change                    : Dec 01, 2024
Password expires                        : Jan 01, 2025
Password inactive                       : Jan 10, 2025
Account expires                         : Jan 15, 2025`,
    language: 'bash',
    bugDescription: 'La date d\'expiration du compte ou du mot de passe dans /etc/shadow est dépassée. Il faut utiliser "chage -E" ou "chage -M".',
    bugDescriptionFr: 'La date d\'expiration du compte ou du mot de passe dans /etc/shadow est dépassée. Il faut utiliser "chage -E" ou "chage -M".',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "chage -E -1 bob" pour retirer la date d\'expiration du compte et "passwd bob" pour renouveler son mot de passe',
        labelFr: 'Utiliser "chage -E -1 bob" pour retirer la date d\'expiration du compte et "passwd bob" pour renouveler son mot de passe',
        isCorrect: true,
        explanation: '"chage -E -1" désactive la date d\'expiration du compte. "chage -l" permet de consulter les politiques d\'âge des mots de passe.',
        explanationFr: '"chage -E -1" désactive la date d\'expiration du compte. "chage -l" permet de consulter les politiques d\'âge des mots de passe.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer le compte bob et le recréer avec useradd',
        labelFr: 'Supprimer le compte bob et le recréer avec useradd',
        isCorrect: false,
        explanation: 'Supprimer le compte casserait les UID/GID des fichiers existants.',
        explanationFr: 'Supprimer le compte casserait les UID/GID des fichiers existants.'
      },
      {
        id: 'opt-3',
        label: 'Modifier la date système avec date --set',
        labelFr: 'Modifier la date système avec date --set',
        isCorrect: false,
        explanation: 'Modifier l\'heure du serveur pour contourner une expiration perturbe tous les logs et services réseau.',
        explanationFr: 'Modifier l\'heure du serveur pour contourner une expiration perturbe tous les logs et services réseau.'
      },
      {
        id: 'opt-4',
        label: 'chage ne fonctionne que sous Red Hat',
        labelFr: 'chage ne fonctionne que sous Red Hat',
        isCorrect: false,
        explanation: 'chage fait partie du paquet shadow-utils standard sur toutes les distributions Linux.',
        explanationFr: 'chage fait partie du paquet shadow-utils standard sur toutes les distributions Linux.'
      }
    ],
    correctedSnippet: `root@srv:~# chage -E -1 bob
root@srv:~# chage -M 90 bob
root@srv:~# passwd -u bob`,
    fixExplanation: '"chage -E -1" lève l\'expiration du compte et autorise à nouveau la connexion.',
    fixExplanationFr: '"chage -E -1" lève l\'expiration du compte et autorise à nouveau la connexion.'
  },
  {
    id: 'tb-lpic1-107-03',
    title: 'Utilisateur interdit de crontab par /etc/cron.deny',
    titleFr: 'Accès à la crontab refusé avec "You are not allowed to use this program (crontab)"',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.2',
    category: 'Administrative Tasks',
    scenario: 'L\'utilisateur "claire" tape "crontab -e". Le terminal renvoie immédiatement : "You (claire) are not allowed to use this program (crontab). See crontab(1) for more information".',
    scenarioFr: 'L\'utilisateur "claire" tape "crontab -e". Le terminal renvoie immédiatement : "You (claire) are not allowed to use this program (crontab). See crontab(1) for more information".',
    codeSnippet: `claire@srv:~$ crontab -e
you (claire) are not allowed to use this program (crontab)
See crontab(1) for more information`,
    language: 'bash',
    bugDescription: 'L\'utilisateur est inscrit dans /etc/cron.deny ou bien /etc/cron.allow existe et ne contient pas son nom d\'utilisateur.',
    bugDescriptionFr: 'L\'utilisateur est inscrit dans /etc/cron.deny ou bien /etc/cron.allow existe et ne contient pas son nom d\'utilisateur.',
    options: [
      {
        id: 'opt-1',
        label: 'Retirer "claire" de /etc/cron.deny ou l\'ajouter dans /etc/cron.allow si ce dernier existe',
        labelFr: 'Retirer "claire" de /etc/cron.deny ou l\'ajouter dans /etc/cron.allow si ce dernier existe',
        isCorrect: true,
        explanation: 'Le contrôle d\'accès à crontab vérifie en premier /etc/cron.allow (si présent, seuls ceux qui y figurent ont l\'accès). Sinon, il vérifie /etc/cron.deny.',
        explanationFr: 'Le contrôle d\'accès à crontab vérifie en premier /etc/cron.allow (si présent, seuls ceux qui y figurent ont l\'accès). Sinon, il vérifie /etc/cron.deny.'
      },
      {
        id: 'opt-2',
        label: 'Donner à claire les droits sudo globaux',
        labelFr: 'Donner à claire les droits sudo globaux',
        isCorrect: false,
        explanation: 'Les droits sudo ne doivent pas être accordés juste pour planifier une tâche utilisateur.',
        explanationFr: 'Les droits sudo ne doivent pas être accordés juste pour planifier une tâche utilisateur.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer le binaire /usr/bin/crontab',
        labelFr: 'Supprimer le binaire /usr/bin/crontab',
        isCorrect: false,
        explanation: 'Supprimer le binaire interdirait la planification à tous les utilisateurs.',
        explanationFr: 'Supprimer le binaire interdirait la planification à tous les utilisateurs.'
      },
      {
        id: 'opt-4',
        label: 'Redémarrer le démon cron',
        labelFr: 'Redémarrer le démon cron',
        isCorrect: false,
        explanation: 'Les fichiers cron.allow et cron.deny sont relus à chaque exécution de la commande crontab.',
        explanationFr: 'Les fichiers cron.allow et cron.deny sont relus à chaque exécution de la commande crontab.'
      }
    ],
    correctedSnippet: `# Vérifier les fichiers d'autorisation :
grep claire /etc/cron.deny && sed -i '/claire/d' /etc/cron.deny
# ou ajouter dans cron.allow :
echo "claire" >> /etc/cron.allow`,
    fixExplanation: 'Ajuster /etc/cron.deny ou /etc/cron.allow accorde à l\'utilisateur le droit d\'utiliser crontab.',
    fixExplanationFr: 'Ajuster /etc/cron.deny ou /etc/cron.allow accorde à l\'utilisateur le droit d\'utiliser crontab.'
  },
  {
    id: 'tb-lpic1-107-04',
    title: 'Configuration de la locale système et encodage UTF-8',
    titleFr: 'Caractères accentués corrompus (mojibake) en raison d\'une locale POSIX/C',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.3',
    category: 'Administrative Tasks',
    scenario: 'Sur un serveur fraîchement déployé, les accents des fichiers s\'affichent sous forme de points d\'interrogation ou de symboles étranges. La commande "locale" indique "LANG=POSIX".',
    scenarioFr: 'Sur un serveur fraîchement déployé, les accents des fichiers s\'affichent sous forme de points d\'interrogation ou de symboles étranges. La commande "locale" indique "LANG=POSIX".',
    codeSnippet: `user@srv:~$ locale
LANG=POSIX
LC_CTYPE="POSIX"
LC_ALL=`,
    language: 'bash',
    bugDescription: 'La locale C/POSIX utilise l\'ASCII 7 bits strict sans prise en charge des caractères UTF-8.',
    bugDescriptionFr: 'La locale C/POSIX utilise l\'ASCII 7 bits strict sans prise en charge des caractères UTF-8.',
    options: [
      {
        id: 'opt-1',
        label: 'Générer et définir une locale UTF-8 (ex: "localectl set-locale LANG=fr_FR.UTF-8" ou "locale-gen fr_FR.UTF-8")',
        labelFr: 'Générer et définir une locale UTF-8 (ex: "localectl set-locale LANG=fr_FR.UTF-8" ou "locale-gen fr_FR.UTF-8")',
        isCorrect: true,
        explanation: '"localectl" configure la locale persistante dans /etc/locale.conf. L\'encodage UTF-8 permet l\'affichage correct des caractères multilingues.',
        explanationFr: '"localectl" configure la locale persistante dans /etc/locale.conf. L\'encodage UTF-8 permet l\'affichage correct des caractères multilingues.'
      },
      {
        id: 'opt-2',
        label: 'Changer le clavier physique',
        labelFr: 'Changer le clavier physique',
        isCorrect: false,
        explanation: 'L\'encodage des fichiers texte dépend de la locale, pas de la disposition matérielle du clavier.',
        explanationFr: 'L\'encodage des fichiers texte dépend de la locale, pas de la disposition matérielle du clavier.'
      },
      {
        id: 'opt-3',
        label: 'Linux ne prend en charge que l\'anglais américain',
        labelFr: 'Linux ne prend en charge que l\'anglais américain',
        isCorrect: false,
        explanation: 'Linux dispose d\'un support international complet (glibc locales).',
        explanationFr: 'Linux dispose d\'un support international complet (glibc locales).'
      },
      {
        id: 'opt-4',
        label: 'Supprimer /usr/share/i18n',
        labelFr: 'Supprimer /usr/share/i18n',
        isCorrect: false,
        explanation: 'Ce dossier contient les définitions des locales.',
        explanationFr: 'Ce dossier contient les définitions des locales.'
      }
    ],
    correctedSnippet: `localectl set-locale LANG=fr_FR.UTF-8
# ou sous Debian :
dpkg-reconfigure locales`,
    fixExplanation: '"localectl set-locale LANG=fr_FR.UTF-8" applique une locale Unicode conforme.',
    fixExplanationFr: '"localectl set-locale LANG=fr_FR.UTF-8" applique une locale Unicode conforme.'
  },
  {
    id: 'tb-lpic1-107-05',
    title: 'Création d\'un compte utilisateur sans répertoire personnel avec useradd -m',
    titleFr: 'Répertoire /home non créé lors de l\'ajout d\'un compte avec useradd',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Administrative Tasks',
    scenario: 'L\'administrateur crée un compte avec "useradd david". Quand David se connecte en SSH, le shell affiche "Could not chdir to home directory /home/david: No such file or directory".',
    scenarioFr: 'L\'administrateur crée un compte avec "useradd david". Quand David se connecte en SSH, le shell affiche "Could not chdir to home directory /home/david: No such file or directory".',
    codeSnippet: `root@srv:~# useradd david
root@srv:~# su - david
su: warning: cannot change directory to /home/david: No such file or directory
$ pwd
/`,
    language: 'bash',
    bugDescription: 'Par défaut, la commande bas niveau "useradd" ne crée pas le home directory sauf si l\'option "-m" (--create-home) est spécifiée.',
    bugDescriptionFr: 'Par défaut, la commande bas niveau "useradd" ne crée pas le home directory sauf si l\'option "-m" (--create-home) est spécifiée.',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter l\'option "-m" lors de la création ("useradd -m david") ou créer le dossier et copier le modèle /etc/skel avec les bons droits',
        labelFr: 'Ajouter l\'option "-m" lors de la création ("useradd -m david") ou créer le dossier et copier le modèle /etc/skel avec les bons droits',
        isCorrect: true,
        explanation: 'Contrairement à adduser (script interactif Debian), useradd nécessite explicitement "-m" pour provisionner /home/utilisateur à partir du squelette /etc/skel.',
        explanationFr: 'Contrairement à adduser (script interactif Debian), useradd nécessite explicitement "-m" pour provisionner /home/utilisateur à partir du squelette /etc/skel.'
      },
      {
        id: 'opt-2',
        label: 'useradd est une commande obsolète',
        labelFr: 'useradd est une commande obsolète',
        isCorrect: false,
        explanation: 'useradd est l\'utilitaire standard officiel de base de shadow-utils.',
        explanationFr: 'useradd est l\'utilitaire standard officiel de base de shadow-utils.'
      },
      {
        id: 'opt-3',
        label: 'Il faut monter /home en écriture',
        labelFr: 'Il faut monter /home en écriture',
        isCorrect: false,
        explanation: '/home est déjà en rw ; le dossier n\'a simplement pas été créé sur le disque.',
        explanationFr: '/home est déjà en rw ; le dossier n\'a simplement pas été créé sur le disque.'
      },
      {
        id: 'opt-4',
        label: 'Le nom "david" est réservé par le noyau',
        labelFr: 'Le nom "david" est réservé par le noyau',
        isCorrect: false,
        explanation: 'C\'est un identifiant utilisateur standard parfaitement valide.',
        explanationFr: 'C\'est un identifiant utilisateur standard parfaitement valide.'
      }
    ],
    correctedSnippet: `# Pour corriger le compte existant :
mkhomedir_helper david
# Ou manuellement :
mkdir /home/david
cp -r /etc/skel/. /home/david/
chown -R david:david /home/david`,
    fixExplanation: 'Utiliser useradd avec l\'option -m pour créer automatiquement le répertoire personnel lors de la création du compte.',
    fixExplanationFr: 'Utiliser useradd avec l\'option -m pour créer automatiquement le répertoire personnel lors de la création du compte.'
  },
  {
    id: 'tb-lpic1-105-06',
    title: 'Alias shell non interprétés dans les scripts non interactifs',
    titleFr: 'Alias Bash inactifs dans les scripts exécutés en arrière-plan',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.1',
    category: 'Shells & Scripting',
    scenario: 'Un utilisateur a défini "alias ll=\'ls -la\'" dans son .bashrc. Dans un script "run.sh", la commande "ll" renvoie "run.sh: line 3: ll: command not found".',
    scenarioFr: 'Un utilisateur a défini "alias ll=\'ls -la\'" dans son .bashrc. Dans un script "run.sh", la commande "ll" renvoie "run.sh: line 3: ll: command not found".',
    codeSnippet: `user@srv:~$ cat run.sh
#!/bin/bash
ll /var/log
user@srv:~$ ./run.sh
./run.sh: line 2: ll: command not found`,
    language: 'bash',
    bugDescription: 'Par défaut, les shells non interactifs (scripts) n\'activent pas l\'expansion des alias. Il faut utiliser des fonctions ou activer shopt -s expand_aliases.',
    bugDescriptionFr: 'Par défaut, les shells non interactifs (scripts) n\'activent pas l\'expansion des alias. Il faut utiliser des fonctions ou activer shopt -s expand_aliases.',
    options: [
      {
        id: 'opt-1',
        label: 'Dans les scripts non interactifs, l\'expansion des alias est désactivée par défaut ; il est recommandé d\'utiliser la commande complète "ls -la" ou une fonction shell',
        labelFr: 'Dans les scripts non interactifs, l\'expansion des alias est désactivée par défaut ; il est recommandé d\'utiliser la commande complète "ls -la" ou une fonction shell',
        isCorrect: true,
        explanation: 'Bash désactive expressément les alias dans les scripts pour préserver la portabilité et le déterminisme de l\'exécution.',
        explanationFr: 'Bash désactive expressément les alias dans les scripts pour préserver la portabilité et le déterminisme de l\'exécution.'
      },
      {
        id: 'opt-2',
        label: 'Il faut exporter l\'alias avec "export -a ll"',
        labelFr: 'Il faut exporter l\'alias avec "export -a ll"',
        isCorrect: false,
        explanation: 'Les alias ne peuvent pas être exportés dans l\'environnement sous Linux.',
        explanationFr: 'Les alias ne peuvent pas être exportés dans l\'environnement sous Linux.'
      },
      {
        id: 'opt-3',
        label: 'L\'alias doit obligatoirement être défini dans /etc/sudoers',
        labelFr: 'L\'alias doit obligatoirement être défini dans /etc/sudoers',
        isCorrect: false,
        explanation: '/etc/sudoers gère les privilèges root, pas les alias.',
        explanationFr: '/etc/sudoers gère les privilèges root, pas les alias.'
      },
      {
        id: 'opt-4',
        label: 'll est réservé à FreeBSD',
        labelFr: 'll est réservé à FreeBSD',
        isCorrect: false,
        explanation: 'll est un raccourci conventionnel courant.',
        explanationFr: 'll est un raccourci conventionnel courant.'
      }
    ],
    correctedSnippet: `#!/bin/bash
# Remplacer par la commande réelle ou une fonction :
ls -la /var/log`,
    fixExplanation: 'Utiliser directement les binaires ou des fonctions au lieu d\'alias garantit la fiabilité des scripts.',
    fixExplanationFr: 'Utiliser directement les binaires ou des fonctions au lieu d\'alias garantit la fiabilité des scripts.'
  },
  {
    id: 'tb-lpic1-105-07',
    title: 'Guillemets simples vs doubles : expansion des variables shell',
    titleFr: 'Expansion de variable empêchée par des guillemets simples (\' \') au lieu de guillemets doubles (" ")',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.1',
    category: 'Shells & Scripting',
    scenario: 'Un administrateur définit DIR="/backup". La commande \'echo "Copie vers $DIR"\' affiche bien le chemin, mais la commande \'echo \'Copie vers $DIR\'\' affiche littéralement "$DIR".',
    scenarioFr: 'Un administrateur définit DIR="/backup". La commande \'echo "Copie vers $DIR"\' affiche bien le chemin, mais la commande \'echo \'Copie vers $DIR\'\' affiche littéralement "$DIR".',
    codeSnippet: `user@srv:~$ DIR="/backup"
user@srv:~$ echo 'Copie vers $DIR'
Copie vers $DIR`,
    language: 'bash',
    bugDescription: 'Les guillemets simples (single quotes) neutralisent absolument tout caractère spécial, y compris le symbole "$" d\'évaluation de variable.',
    bugDescriptionFr: 'Les guillemets simples (single quotes) neutralisent absolument tout caractère spécial, y compris le symbole "$" d\'évaluation de variable.',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser des guillemets doubles ("...") qui permettent l\'interpolation de variable tout en protégeant les espaces',
        labelFr: 'Utiliser des guillemets doubles ("...") qui permettent l\'interpolation de variable tout en protégeant les espaces',
        isCorrect: true,
        explanation: 'En Bash, \'...\' est littéral pur (aucun méta-caractère n\'est évalué). "..." permet l\'expansion de $VAR, $(cmd) et \\.',
        explanationFr: 'En Bash, \'...\' est littéral pur (aucun méta-caractère n\'est évalué). "..." permet l\'expansion de $VAR, $(cmd) et \\.'
      },
      {
        id: 'opt-2',
        label: 'Taper echo $$DIR',
        labelFr: 'Taper echo $$DIR',
        isCorrect: false,
        explanation: '$$ est la variable contenant le PID du shell courant.',
        explanationFr: '$$ est la variable contenant le PID du shell courant.'
      },
      {
        id: 'opt-3',
        label: 'Ajouter un point-virgule après DIR',
        labelFr: 'Ajouter un point-virgule après DIR',
        isCorrect: false,
        explanation: 'Le point-virgule sépare des instructions, il n\'influence pas l\'évaluation de variable.',
        explanationFr: 'Le point-virgule sépare des instructions, il n\'influence pas l\'évaluation de variable.'
      },
      {
        id: 'opt-4',
        label: 'La commande echo est dépréciée par POSIX',
        labelFr: 'La commande echo est dépréciée par POSIX',
        isCorrect: false,
        explanation: 'echo est un builtin universellement présent.',
        explanationFr: 'echo est un builtin universellement présent.'
      }
    ],
    correctedSnippet: `echo "Copie vers $DIR"`,
    fixExplanation: 'Les guillemets doubles autorisent le shell à évaluer le contenu de la variable.',
    fixExplanationFr: 'Les guillemets doubles autorisent le shell à évaluer le contenu de la variable.'
  },
  {
    id: 'tb-lpic1-105-08',
    title: 'Chargement de ~/.bashrc lors d\'une session de login SSH',
    titleFr: 'Différence entre login shell (/etc/profile, ~/.bash_profile) et non-login shell (~/.bashrc)',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.1',
    category: 'Shells & Scripting',
    scenario: 'L\'utilisateur ajoute des variables dans ~/.bashrc. Lors de sa connexion initiale via SSH (login shell), les variables ne sont pas chargées car seul ~/.bash_profile est lu.',
    scenarioFr: 'L\'utilisateur ajoute des variables dans ~/.bashrc. Lors de sa connexion initiale via SSH (login shell), les variables ne sont pas chargées car seul ~/.bash_profile est lu.',
    codeSnippet: `# Un login shell lit dans l'ordre :
1. /etc/profile
2. ~/.bash_profile (ou ~/.bash_login, ~/.profile)
# Et ignore ~/.bashrc sauf s'il est explicitement "sourcé" !`,
    language: 'bash',
    bugDescription: 'Un login shell ne charge pas directement ~/.bashrc. ~/.bash_profile doit contenir l\'instruction "source ~/.bashrc".',
    bugDescriptionFr: 'Un login shell ne charge pas directement ~/.bashrc. ~/.bash_profile doit contenir l\'instruction "source ~/.bashrc".',
    options: [
      {
        id: 'opt-1',
        label: 'Inclure le sourcing de ~/.bashrc dans ~/.bash_profile ("test -f ~/.bashrc && . ~/.bashrc")',
        labelFr: 'Inclure le sourcing de ~/.bashrc dans ~/.bash_profile ("test -f ~/.bashrc && . ~/.bashrc")',
        isCorrect: true,
        explanation: 'C\'est la règle classique du cycle de démarrage du shell Bash : un shell de connexion (login) n\'évalue que le profile, qui doit cascader vers le bashrc.',
        explanationFr: 'C\'est la règle classique du cycle de démarrage du shell Bash : un shell de connexion (login) n\'évalue que le profile, qui doit cascader vers le bashrc.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer ~/.bash_profile',
        labelFr: 'Supprimer ~/.bash_profile',
        isCorrect: false,
        explanation: 'Supprimer le profil peut empêcher la configuration de variables système critiques.',
        explanationFr: 'Supprimer le profil peut empêcher la configuration de variables système critiques.'
      },
      {
        id: 'opt-3',
        label: 'Changer le shell de l\'utilisateur vers /bin/false',
        labelFr: 'Changer le shell de l\'utilisateur vers /bin/false',
        isCorrect: false,
        explanation: '/bin/false interdirait purement et simplement toute connexion SSH.',
        explanationFr: '/bin/false interdirait purement et simplement toute connexion SSH.'
      },
      {
        id: 'opt-4',
        label: 'Mettre les variables dans /boot/grub/grub.cfg',
        labelFr: 'Mettre les variables dans /boot/grub/grub.cfg',
        isCorrect: false,
        explanation: 'grub.cfg est réservé au chargeur d\'amorçage.',
        explanationFr: 'grub.cfg est réservé au chargeur d\'amorçage.'
      }
    ],
    correctedSnippet: `# Dans ~/.bash_profile :
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi`,
    fixExplanation: 'Sourcer "~/.bashrc" depuis "~/.bash_profile" unifie les environnements de login et de sous-shells.',
    fixExplanationFr: 'Sourcer "~/.bashrc" depuis "~/.bash_profile" unifie les environnements de login et de sous-shells.'
  },
  {
    id: 'tb-lpic1-105-09',
    title: 'Espaces obligatoires à l\'intérieur des crochets de condition [ ]',
    titleFr: 'Erreur de syntaxe dans test conditionnel : [foo=bar] au lieu de [ "$foo" = "bar" ]',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.2',
    category: 'Shells & Scripting',
    scenario: 'Un script de validation exécute "if [$RET=0]; then". Le shell s\'interrompt avec "[: missing `]\'".',
    scenarioFr: 'Un script de validation exécute "if [$RET=0]; then". Le shell s\'interrompt avec "[: missing `]\'".',
    codeSnippet: `user@srv:~$ if [$RET=0]; then echo "OK"; fi
bash: [0=0]: command not found`,
    language: 'bash',
    bugDescription: 'Le crochet ouvrant "[" est une vraie commande (/usr/bin/[). Elle exige que chaque argument et le crochet fermant "]" soient isolés par des espaces.',
    bugDescriptionFr: 'Le crochet ouvrant "[" est une vraie commande (/usr/bin/[). Elle exige que chaque argument et le crochet fermant "]" soient isolés par des espaces.',
    options: [
      {
        id: 'opt-1',
        label: 'Insérer des espaces après le "[" et avant le "]" : if [ "$RET" = "0" ]; then',
        labelFr: 'Insérer des espaces après le "[" et avant le "]" : if [ "$RET" = "0" ]; then',
        isCorrect: true,
        explanation: 'En shell, "[" est un synonyme de la commande "test" et "]" est son argument final obligatoire. Des espaces doivent séparer tous les arguments.',
        explanationFr: 'En shell, "[" est un synonyme de la commande "test" et "]" est son argument final obligatoire. Des espaces doivent séparer tous les arguments.'
      },
      {
        id: 'opt-2',
        label: 'Remplacer le crochet par des parenthèses simples ( )',
        labelFr: 'Remplacer le crochet par des parenthèses simples ( )',
        isCorrect: false,
        explanation: 'Des parenthèses simples exécutent un sous-shell au lieu d\'un test logique.',
        explanationFr: 'Des parenthèses simples exécutent un sous-shell au lieu d\'un test logique.'
      },
      {
        id: 'opt-3',
        label: 'Il faut doubler le signe égal == et enlever le fi',
        labelFr: 'Il faut doubler le signe égal == et enlever le fi',
        isCorrect: false,
        explanation: '"fi" est obligatoire pour clore un bloc if.',
        explanationFr: '"fi" est obligatoire pour clore un bloc if.'
      },
      {
        id: 'opt-4',
        label: 'L\'instruction if est interdite dans Bash',
        labelFr: 'L\'instruction if est interdite dans Bash',
        isCorrect: false,
        explanation: 'if est la structure de contrôle conditionnelle fondamentale.',
        explanationFr: 'if est la structure de contrôle conditionnelle fondamentale.'
      }
    ],
    correctedSnippet: `if [ "$RET" -eq 0 ]; then
    echo "OK"
fi`,
    fixExplanation: 'Espacer les arguments de la commande "[" permet d\'évaluer la condition correctement.',
    fixExplanationFr: 'Espacer les arguments de la commande "[" permet d\'évaluer la condition correctement.'
  },
  {
    id: 'tb-lpic1-105-10',
    title: 'Interruption immédiate de script sur erreur avec set -e',
    titleFr: 'Script continuant malgré l\'échec d\'une commande critique : utilisation de set -e',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.2',
    category: 'Shells & Scripting',
    scenario: 'Un script effectue "cd /repertoire_inexistant" suivi de "rm -rf *". Comme le cd échoue, le rm s\'exécute dans le dossier courant et détruit tous les fichiers.',
    scenarioFr: 'Un script effectue "cd /repertoire_inexistant" suivi de "rm -rf *". Comme le cd échoue, le rm s\'exécute dans le dossier courant et détruit tous les fichiers.',
    codeSnippet: `#!/bin/bash
cd /mnt/point_de_montage_deconnecte
rm -rf *
# Catastrophe : les fichiers locaux sont effacés !`,
    language: 'bash',
    bugDescription: 'Par défaut, Bash continue l\'exécution des lignes suivantes même si une commande renvoie une erreur. "set -e" (ou "set -o errexit") stoppe immédiatement le script.',
    bugDescriptionFr: 'Par défaut, Bash continue l\'exécution des lignes suivantes même si une commande renvoie une erreur. "set -e" (ou "set -o errexit") stoppe immédiatement le script.',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter "set -e" en tête de script et lier les opérations critiques avec "cd /rep || exit 1"',
        labelFr: 'Ajouter "set -e" en tête de script et lier les opérations critiques avec "cd /rep || exit 1"',
        isCorrect: true,
        explanation: '"set -e" (errexit) ordonne au shell d\'interrompre immédiatement le script dès qu\'une commande se termine avec un code d\'erreur différent de 0.',
        explanationFr: '"set -e" (errexit) ordonne au shell d\'interrompre immédiatement le script dès qu\'une commande se termine avec un code d\'erreur différent de 0.'
      },
      {
        id: 'opt-2',
        label: 'Ajouter set -x',
        labelFr: 'Ajouter set -x',
        isCorrect: false,
        explanation: 'set -x active le mode débogage (trace), mais n\'arrête pas le script sur erreur.',
        explanationFr: 'set -x active le mode débogage (trace), mais n\'arrête pas le script sur erreur.'
      },
      {
        id: 'opt-3',
        label: 'Exécuter le script avec "bash -c"',
        labelFr: 'Exécuter le script avec "bash -c"',
        isCorrect: false,
        explanation: 'bash -c prend une commande en argument textuel sans modifier la tolérance aux erreurs.',
        explanationFr: 'bash -c prend une commande en argument textuel sans modifier la tolérance aux erreurs.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer /bin/rm',
        labelFr: 'Supprimer /bin/rm',
        isCorrect: false,
        explanation: 'Supprimer le binaire système rm détruirait les capacités d\'administration.',
        explanationFr: 'Supprimer le binaire système rm détruirait les capacités d\'administration.'
      }
    ],
    correctedSnippet: `#!/bin/bash
set -euo pipefail
cd /mnt/point_de_montage_deconnecte || exit 1
rm -rf -- *`,
    fixExplanation: '"set -e" et la vérification explicite "|| exit 1" préviennent les désastres en cas d\'échec de déplacement.',
    fixExplanationFr: '"set -e" et la vérification explicite "|| exit 1" préviennent les désastres en cas d\'échec de déplacement.'
  },
  {
    id: 'tb-lpic1-106-04',
    title: 'Technologies d\'accessibilité Linux : lecteur d\'écran Orca',
    titleFr: 'Configuration de l\'accessibilité visuelle avec Orca sous environnement graphique',
    certification: 'lpic-1',
    topicNumber: 106,
    objectiveId: '106.3',
    category: 'User Interfaces & Desktops',
    scenario: 'Un utilisateur malvoyant a besoin de la synthèse vocale et du braille sous GNOME. Le technicien doit identifier la commande standard de lancement du lecteur d\'écran.',
    scenarioFr: 'Un utilisateur malvoyant a besoin de la synthèse vocale et du braille sous GNOME. Le technicien doit identifier la commande standard de lancement du lecteur d\'écran.',
    codeSnippet: `user@srv:~$ screen-reader --start
bash: screen-reader: command not found`,
    language: 'bash',
    bugDescription: 'Le lecteur d\'écran officiel open-source et standard du programme LPIC-1 pour les environnements de bureau Linux est "orca".',
    bugDescriptionFr: 'Le lecteur d\'écran officiel open-source et standard du programme LPIC-1 pour les environnements de bureau Linux est "orca".',
    options: [
      {
        id: 'opt-1',
        label: 'Lancer "orca" (ou orca -s pour les réglages) qui est le lecteur d\'écran et agrandisseur officiel sous X11/Wayland',
        labelFr: 'Lancer "orca" (ou orca -s pour les réglages) qui est le lecteur d\'écran et agrandisseur officiel sous X11/Wayland',
        isCorrect: true,
        explanation: 'Orca est le lecteur d\'écran canonique mentionné dans l\'objectif 106.3 du LPI pour l\'accessibilité graphique.',
        explanationFr: 'Orca est le lecteur d\'écran canonique mentionné dans l\'objectif 106.3 du LPI pour l\'accessibilité graphique.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser speakup obligatoirement en mode graphique',
        labelFr: 'Utiliser speakup obligatoirement en mode graphique',
        isCorrect: false,
        explanation: 'Speakup est un lecteur d\'écran en mode console texte (noyau), pas pour l\'environnement graphique X11.',
        explanationFr: 'Speakup est un lecteur d\'écran en mode console texte (noyau), pas pour l\'environnement graphique X11.'
      },
      {
        id: 'opt-3',
        label: 'Activer GDM en mode sonore',
        labelFr: 'Activer GDM en mode sonore',
        isCorrect: false,
        explanation: 'Orca gère l\'accessibilité complète de la session de bureau.',
        explanationFr: 'Orca gère l\'accessibilité complète de la session de bureau.'
      },
      {
        id: 'opt-4',
        label: 'L\'accessibilité n\'existe pas sous Linux',
        labelFr: 'L\'accessibilité n\'existe pas sous Linux',
        isCorrect: false,
        explanation: 'Linux possède une suite d\'accessibilité complète (AT-SPI, Orca, BrailleTTY).',
        explanationFr: 'Linux possède une suite d\'accessibilité complète (AT-SPI, Orca, BrailleTTY).'
      }
    ],
    correctedSnippet: `orca --replace &`,
    fixExplanation: '"orca" active le lecteur d\'écran avec synthèse vocale et rafraîchisseur braille.',
    fixExplanationFr: '"orca" active le lecteur d\'écran avec synthèse vocale et rafraîchisseur braille.'
  },
  {
    id: 'tb-lpic1-106-05',
    title: 'Protocole Wayland vs Serveur X.Org',
    titleFr: 'Identification du serveur d\'affichage actif (X11 ou Wayland) via XDG_SESSION_TYPE',
    certification: 'lpic-1',
    topicNumber: 106,
    objectiveId: '106.2',
    category: 'User Interfaces & Desktops',
    scenario: 'Un outil de capture d\'écran ne fonctionne pas. Le technicien doit déterminer si la session graphique tourne sous X11 ou sous Wayland.',
    scenarioFr: 'Un technicien doit déterminer si la session graphique tourne sous X11 ou sous Wayland.',
    codeSnippet: `user@srv:~$ echo $XDG_SESSION_TYPE
wayland`,
    language: 'bash',
    bugDescription: 'La variable "$XDG_SESSION_TYPE" indique le protocole d\'affichage en cours ("wayland" ou "x11"). Wayland bloque les captures d\'écran directes sans portail de sécurité.',
    bugDescriptionFr: 'La variable "$XDG_SESSION_TYPE" indique le protocole d\'affichage en cours ("wayland" ou "x11"). Wayland bloque les captures d\'écran directes sans portail de sécurité.',
    options: [
      {
        id: 'opt-1',
        label: 'Interroger la variable "$XDG_SESSION_TYPE" (ou la commande "loginctl show-session") pour identifier la nature de la session',
        labelFr: 'Interroger la variable "$XDG_SESSION_TYPE" (ou la commande "loginctl show-session") pour identifier la nature de la session',
        isCorrect: true,
        explanation: '$XDG_SESSION_TYPE renvoie "wayland", "x11" ou "tty". Wayland isole les fenêtres par conception de sécurité, bloquant les outils X11 traditionnels comme xwd ou import.',
        explanationFr: '$XDG_SESSION_TYPE renvoie "wayland", "x11" ou "tty". Wayland isole les fenêtres par conception de sécurité, bloquant les outils X11 traditionnels comme xwd ou import.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer /dev/tty0',
        labelFr: 'Supprimer /dev/tty0',
        isCorrect: false,
        explanation: 'Détruire les terminaux virtuels endommagerait la console.',
        explanationFr: 'Détruire les terminaux virtuels endommagerait la console.'
      },
      {
        id: 'opt-3',
        label: 'Lire le fichier /etc/wayland.conf',
        labelFr: 'Lire le fichier /etc/wayland.conf',
        isCorrect: false,
        explanation: 'Ce fichier n\'existe pas par défaut.',
        explanationFr: 'Ce fichier n\'existe pas par défaut.'
      },
      {
        id: 'opt-4',
        label: 'Il n\'y a aucune différence technique entre X11 et Wayland',
        labelFr: 'Il n\'y a aucune différence technique entre X11 et Wayland',
        isCorrect: false,
        explanation: 'Wayland remplace l\'architecture client-serveur X11 par un compositeur direct.',
        explanationFr: 'Wayland remplace l\'architecture client-serveur X11 par un compositeur direct.'
      }
    ],
    correctedSnippet: `echo "Session type: $XDG_SESSION_TYPE"`,
    fixExplanation: 'Vérifier $XDG_SESSION_TYPE confirme le protocole graphique actif.',
    fixExplanationFr: 'Vérifier $XDG_SESSION_TYPE confirme le protocole graphique actif.'
  },
  {
    id: 'tb-lpic1-107-06',
    title: 'Ajout d\'un utilisateur à un groupe secondaire sans écraser les existants avec usermod -aG',
    titleFr: 'Omission du drapeau "-a" dans usermod -G retirant l\'utilisateur de tous ses autres groupes',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Administrative Tasks',
    scenario: 'Pour ajouter "alice" au groupe "docker", l\'administrateur tape "usermod -G docker alice". Alice ne peut plus exécuter sudo car elle a été retirée du groupe sudoers.',
    scenarioFr: 'Pour ajouter "alice" au groupe "docker", l\'administrateur tape "usermod -G docker alice". Alice ne peut plus exécuter sudo car elle a été retirée du groupe sudoers.',
    codeSnippet: `root@srv:~# id alice
uid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo),100(users)
root@srv:~# usermod -G docker alice
root@srv:~# id alice
uid=1001(alice) gid=1001(alice) groups=1001(alice),998(docker)
# Le groupe "sudo" a disparu !`,
    language: 'bash',
    bugDescription: 'L\'option "-G" seule remplace la liste complète des groupes secondaires. Il faut impérativement coupler "-a" (append) : "usermod -a -G groupe utilisateur".',
    bugDescriptionFr: 'L\'option "-G" seule remplace la liste complète des groupes secondaires. Il faut impérativement coupler "-a" (append) : "usermod -a -G groupe utilisateur".',
    options: [
      {
        id: 'opt-1',
        label: 'Toujours utiliser "-a" avec "-G" ("usermod -aG docker alice") pour ajouter au groupe sans effacer les appartenances précédentes',
        labelFr: 'Toujours utiliser "-a" avec "-G" ("usermod -aG docker alice") pour ajouter au groupe sans effacer les appartenances précédentes',
        isCorrect: true,
        explanation: 'L\'omission de "-a" est l\'un des pièges classiques LPIC-1. "usermod -G" réinitialise les groupes secondaires à la seule liste fournie.',
        explanationFr: 'L\'omission de "-a" est l\'un des pièges classiques LPIC-1. "usermod -G" réinitialise les groupes secondaires à la seule liste fournie.'
      },
      {
        id: 'opt-2',
        label: 'Il fallait taper "groupadd alice docker"',
        labelFr: 'Il fallait taper "groupadd alice docker"',
        isCorrect: false,
        explanation: 'groupadd ne sert qu\'à créer un nouveau groupe, pas à affecter des membres.',
        explanationFr: 'groupadd ne sert qu\'à créer un nouveau groupe, pas à affecter des membres.'
      },
      {
        id: 'opt-3',
        label: 'Un utilisateur ne peut appartenir qu\'à un seul groupe à la fois sous Linux',
        labelFr: 'Un utilisateur ne peut appartenir qu\'à un seul groupe à la fois sous Linux',
        isCorrect: false,
        explanation: 'Linux supporte jusqu\'à 65 536 groupes secondaires par compte.',
        explanationFr: 'Linux supporte jusqu\'à 65 536 groupes secondaires par compte.'
      },
      {
        id: 'opt-4',
        label: 'Il faut modifier /etc/shadow manuellement',
        labelFr: 'Il faut modifier /etc/shadow manuellement',
        isCorrect: false,
        explanation: 'Les groupes sont définis dans /etc/group, jamais dans /etc/shadow.',
        explanationFr: 'Les groupes sont définis dans /etc/group, jamais dans /etc/shadow.'
      }
    ],
    correctedSnippet: `usermod -aG sudo,docker alice`,
    fixExplanation: '"usermod -aG" préserve les appartenances existantes et ajoute les nouveaux groupes.',
    fixExplanationFr: '"usermod -aG" préserve les appartenances existantes et ajoute les nouveaux groupes.'
  },
  {
    id: 'tb-lpic1-107-07',
    title: 'Suppression propre d\'un utilisateur et de ses données avec userdel -r',
    titleFr: 'Répertoire /home et boîte mail orphelins après userdel sans l\'option -r',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Administrative Tasks',
    scenario: 'L\'administrateur tape "userdel john". Plus tard, un contrôle de sécurité révèle que "/home/john" et "/var/mail/john" sont toujours présents avec un UID orphelin.',
    scenarioFr: 'L\'administrateur tape "userdel john". Plus tard, un contrôle de sécurité révèle que "/home/john" et "/var/mail/john" sont toujours présents avec un UID orphelin.',
    codeSnippet: `root@srv:~# userdel john
root@srv:~# ls -ld /home/john
drwxr-xr-x 2 1005 1005 4096 Oct 12 16:00 /home/john
# Le répertoire appartient désormais à un UID numérique non résolu (1005) !`,
    language: 'bash',
    bugDescription: '"userdel" sans option supprime uniquement les entrées dans /etc/passwd et /etc/shadow. L\'option "-r" (--remove) est nécessaire pour supprimer le home directory et la boîte mail.',
    bugDescriptionFr: '"userdel" sans option supprime uniquement les entrées dans /etc/passwd et /etc/shadow. L\'option "-r" (--remove) est nécessaire pour supprimer le home directory et la boîte mail.',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "userdel -r john" pour supprimer simultanément le répertoire personnel et la boîte de messagerie (spool mail)',
        labelFr: 'Utiliser "userdel -r john" pour supprimer simultanément le répertoire personnel et la boîte de messagerie (spool mail)',
        isCorrect: true,
        explanation: 'L\'option "-r" de userdel supprime les fichiers personnels associés au compte afin d\'éviter de laisser des fichiers avec des UID orphelins.',
        explanationFr: 'L\'option "-r" de userdel supprime les fichiers personnels associés au compte afin d\'éviter de laisser des fichiers avec des UID orphelins.'
      },
      {
        id: 'opt-2',
        label: 'userdel ne peut jamais effacer de fichiers',
        labelFr: 'userdel ne peut jamais effacer de fichiers',
        isCorrect: false,
        explanation: 'L\'option -r a précisément ce rôle.',
        explanationFr: 'L\'option -r a précisément ce rôle.'
      },
      {
        id: 'opt-3',
        label: 'Il faut redémarrer pour que le noyau libère le home',
        labelFr: 'Il faut redémarrer pour que le noyau libère le home',
        isCorrect: false,
        explanation: 'La suppression de fichiers est synchrone sans redémarrage.',
        explanationFr: 'La suppression de fichiers est synchrone sans redémarrage.'
      },
      {
        id: 'opt-4',
        label: 'Utiliser la commande delgroup john',
        labelFr: 'Utiliser la commande delgroup john',
        isCorrect: false,
        explanation: 'delgroup supprime un groupe, pas les fichiers du compte utilisateur.',
        explanationFr: 'delgroup supprime un groupe, pas les fichiers du compte utilisateur.'
      }
    ],
    correctedSnippet: `userdel -r john`,
    fixExplanation: '"userdel -r" garantit la purge complète du compte et de ses données personnelles.',
    fixExplanationFr: '"userdel -r" garantit la purge complète du compte et de ses données personnelles.'
  },
  {
    id: 'tb-lpic1-107-08',
    title: 'Planification différée unique avec at et service atd',
    titleFr: 'Commande at échouant avec "Cannot open /var/run/atd.pid" : démon atd arrêté',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.2',
    category: 'Administrative Tasks',
    scenario: 'L\'administrateur veut planifier un redémarrage à 23h00 avec "echo \'reboot\' | at 23:00". Le terminal renvoie "Cannot open /var/run/atd.pid: No such file or directory".',
    scenarioFr: 'L\'administrateur veut planifier un redémarrage à 23h00 avec "echo \'reboot\' | at 23:00". Le terminal renvoie "Cannot open /var/run/atd.pid: No such file or directory".',
    codeSnippet: `root@srv:~# echo "reboot" | at 23:00
Cannot open /var/run/atd.pid: No such file or directory`,
    language: 'bash',
    bugDescription: 'Le démon de planification temporisée "atd" n\'est pas actif sur la machine.',
    bugDescriptionFr: 'Le démon de planification temporisée "atd" n\'est pas actif sur la machine.',
    options: [
      {
        id: 'opt-1',
        label: 'Démarrer et activer le service atd avec "systemctl enable --now atd"',
        labelFr: 'Démarrer et activer le service atd avec "systemctl enable --now atd"',
        isCorrect: true,
        explanation: 'La commande "at" dépose les travaux dans /var/spool/cron/atjobs mais nécessite le démon atd pour les réveiller à l\'heure prévue.',
        explanationFr: 'La commande "at" dépose les travaux dans /var/spool/cron/atjobs mais nécessite le démon atd pour les réveiller à l\'heure prévue.'
      },
      {
        id: 'opt-2',
        label: 'Créer manuellement le fichier /var/run/atd.pid avec touch',
        labelFr: 'Créer manuellement le fichier /var/run/atd.pid avec touch',
        isCorrect: false,
        explanation: 'Un fichier pid vide sans démon actif ne déclenchera jamais les travaux.',
        explanationFr: 'Un fichier pid vide sans démon actif ne déclenchera jamais les travaux.'
      },
      {
        id: 'opt-3',
        label: 'at ne supporte pas l\'heure au format 23:00',
        labelFr: 'at ne supporte pas l\'heure au format 23:00',
        isCorrect: false,
        explanation: 'Le format HH:MM est un format officiel parfaitement reconnu par at.',
        explanationFr: 'Le format HH:MM est un format officiel parfaitement reconnu par at.'
      },
      {
        id: 'opt-4',
        label: 'at a été supprimé du standard LPIC-1',
        labelFr: 'at a été supprimé du standard LPIC-1',
        isCorrect: false,
        explanation: 'at fait partie intégrante de l\'objectif 107.2.',
        explanationFr: 'at fait partie intégrante de l\'objectif 107.2.'
      }
    ],
    correctedSnippet: `systemctl enable --now atd
echo "reboot" | at 23:00`,
    fixExplanation: 'Activer le démon atd assure l\'exécution ponctuelle des tâches soumises.',
    fixExplanationFr: 'Activer le démon atd assure l\'exécution ponctuelle des tâches soumises.'
  },
  {
    id: 'tb-lpic1-107-09',
    title: 'Minuteur Systemd (timer) non déclenché : absence du service .service associé',
    titleFr: 'Timer systemd actif mais inopérant car l\'unité .service cible est manquante ou en erreur',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.2',
    category: 'Administrative Tasks',
    scenario: 'L\'administrateur a configuré "/etc/systemd/system/backup.timer" qui tourne sans erreur. Pourtant, aucune sauvegarde ne s\'effectue. "systemctl list-timers" montre que le timer expire mais ne lance rien.',
    scenarioFr: 'L\'administrateur a configuré "/etc/systemd/system/backup.timer" qui tourne sans erreur. Pourtant, aucune sauvegarde ne s\'effectue. "systemctl list-timers" montre que le timer expire mais ne lance rien.',
    codeSnippet: `root@srv:~# systemctl list-timers
NEXT                         LEFT          LAST PASSED UNIT         ACTIVATES
Wed 2025-02-19 04:00:00 UTC  2h 15min left n/a  n/a    backup.timer backup.service
root@srv:~# systemctl status backup.service
Unit backup.service could not be found.`,
    language: 'bash',
    bugDescription: 'Un timer systemd ne contient pas les commandes à exécuter ; il active une unité portant le même nom préfixé (backup.service) qui doit définir [Service] ExecStart=...',
    bugDescriptionFr: 'Un timer systemd ne contient pas les commandes à exécuter ; il active une unité portant le même nom préfixé (backup.service) qui doit définir [Service] ExecStart=...',
    options: [
      {
        id: 'opt-1',
        label: 'Créer l\'unité de service correspondante "/etc/systemd/system/backup.service" avec sa directive "ExecStart="',
        labelFr: 'Créer l\'unité de service correspondante "/etc/systemd/system/backup.service" avec sa directive "ExecStart="',
        isCorrect: true,
        explanation: 'Dans systemd, les timers délèguent l\'exécution à une unité .service de même nom (ou spécifiée via Unit=). Sans cette unité de service, le déclencheur timer n\'accomplit aucune action.',
        explanationFr: 'Dans systemd, les timers délèguent l\'exécution à une unité .service de même nom (ou spécifiée via Unit=). Sans cette unité de service, le déclencheur timer n\'accomplit aucune action.'
      },
      {
        id: 'opt-2',
        label: 'Mettre la commande directement dans le fichier backup.timer sous [Timer] Command=',
        labelFr: 'Mettre la commande directement dans le fichier backup.timer sous [Timer] Command=',
        isCorrect: false,
        explanation: 'Systemd timers ne supportent pas de directive ExecStart directement dans la section [Timer].',
        explanationFr: 'Systemd timers ne supportent pas de directive ExecStart directement dans la section [Timer].'
      },
      {
        id: 'opt-3',
        label: 'Systemd timers ne fonctionnent qu\'avec un compte non-root',
        labelFr: 'Systemd timers ne fonctionnent qu\'avec un compte non-root',
        isCorrect: false,
        explanation: 'Systemd gère les timers système (root) et utilisateur (user --unit).',
        explanationFr: 'Systemd gère les timers système (root) et utilisateur (user --unit).'
      },
      {
        id: 'opt-4',
        label: 'Remplacer systemd par SysVinit',
        labelFr: 'Remplacer systemd par SysVinit',
        isCorrect: false,
        explanation: 'SysVinit est un ancien système d\'initialisation sans support natif de timers.',
        explanationFr: 'SysVinit est un ancien système d\'initialisation sans support natif de timers.'
      }
    ],
    correctedSnippet: `# Créer /etc/systemd/system/backup.service :
[Unit]
Description=Service de sauvegarde
[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh

# Recharger et tester :
systemctl daemon-reload
systemctl start backup.service`,
    fixExplanation: 'Fournir le fichier .service cible permet au timer d\'exécuter le script planifié.',
    fixExplanationFr: 'Fournir le fichier .service cible permet au timer d\'exécuter le script planifié.'
  },
  {
    id: 'tb-lpic1-107-10',
    title: 'Paramètres de création utilisateur par défaut dans /etc/default/useradd et /etc/login.defs',
    titleFr: 'Shell par défaut incorrect (/bin/sh au lieu de /bin/bash) lors de useradd',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Administrative Tasks',
    scenario: 'À chaque création de compte avec "useradd", les utilisateurs se retrouvent avec "/bin/sh" au lieu de "/bin/bash". L\'administrateur doit corriger le modèle global.',
    scenarioFr: 'À chaque création de compte avec "useradd", les utilisateurs se retrouvent avec "/bin/sh" au lieu de "/bin/bash". L\'administrateur doit corriger le modèle global.',
    codeSnippet: `root@srv:~# useradd -D
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/sh
SKEL=/etc/skel
CREATE_MAIL_SPOOL=no`,
    language: 'bash',
    bugDescription: 'La configuration par défaut de useradd stockée dans /etc/default/useradd spécifie "SHELL=/bin/sh".',
    bugDescriptionFr: 'La configuration par défaut de useradd stockée dans /etc/default/useradd spécifie "SHELL=/bin/sh".',
    options: [
      {
        id: 'opt-1',
        label: 'Mettre à jour le shell par défaut avec "useradd -D -s /bin/bash" ou éditer /etc/default/useradd',
        labelFr: 'Mettre à jour le shell par défaut avec "useradd -D -s /bin/bash" ou éditer /etc/default/useradd',
        isCorrect: true,
        explanation: '"useradd -D" affiche les paramètres par défaut. "useradd -D -s /bin/bash" modifie directement la valeur "SHELL=" enregistrée dans /etc/default/useradd.',
        explanationFr: '"useradd -D" affiche les paramètres par défaut. "useradd -D -s /bin/bash" modifie directement la valeur "SHELL=" enregistrée dans /etc/default/useradd.'
      },
      {
        id: 'opt-2',
        label: 'Créer un lien symbolique de /bin/sh vers /bin/bash',
        labelFr: 'Créer un lien symbolique de /bin/sh vers /bin/bash',
        isCorrect: false,
        explanation: 'Sous Debian/Ubuntu, cela casserait les scripts optimisés pour Dash.',
        explanationFr: 'Sous Debian/Ubuntu, cela casserait les scripts optimisés pour Dash.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer /etc/shells',
        labelFr: 'Supprimer /etc/shells',
        isCorrect: false,
        explanation: '/etc/shells liste les shells valides autorisés par chsh et PAM.',
        explanationFr: '/etc/shells liste les shells valides autorisés par chsh et PAM.'
      },
      {
        id: 'opt-4',
        label: 'Seul chsh peut modifier les paramètres par défaut',
        labelFr: 'Seul chsh peut modifier les paramètres par défaut',
        isCorrect: false,
        explanation: 'chsh modifie le compte d\'un utilisateur existant, pas le modèle de création par défaut.',
        explanationFr: 'chsh modifie le compte d\'un utilisateur existant, pas le modèle de création par défaut.'
      }
    ],
    correctedSnippet: `useradd -D -s /bin/bash`,
    fixExplanation: '"useradd -D -s /bin/bash" configure Bash comme shell par défaut pour tout nouveau compte créé.',
    fixExplanationFr: '"useradd -D -s /bin/bash" configure Bash comme shell par défaut pour tout nouveau compte créé.'
  }
];

