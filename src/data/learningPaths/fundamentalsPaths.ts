import { LearningPath, PathModule } from './types';

// Helper to create a fully formed module with legacy alias fields
function createModule(data: Omit<PathModule, 'whyItMatters' | 'whyItMattersFr' | 'commands' | 'codeSnippet' | 'prodTrap' | 'prodTrapFr' | 'checklist' | 'checklistFr'> & {
  checklist?: string[];
  checklistFr?: string[];
}): PathModule {
  return {
    ...data,
    whyItMatters: data.theory.whyItMatters,
    whyItMattersFr: data.theory.whyItMattersFr,
    commands: data.theory.commands,
    codeSnippet: data.theory.codeSnippet,
    prodTrap: data.theory.prodTrap,
    prodTrapFr: data.theory.prodTrapFr,
    checklist: data.checklist || [
      'Understand core concept and syntax',
      'Execute practice commands in terminal',
      'Complete hands-on lab step',
      'Review production troubleshooting scenario'
    ],
    checklistFr: data.checklistFr || [
      'Comprendre le concept théorique et la syntaxe',
      'Exécuter les commandes clés dans le terminal',
      'Valider l\'étape du lab pratique',
      'Analyser le piège de production et le dépannage'
    ],
  };
}

/* ==========================================================================
   1. LINUX POUR DÉBUTANT (fundamentals-beginner)
   Terminal → fichiers → permissions → processus → utilisateurs → réseau
   ========================================================================== */
const beginnerModules: PathModule[] = [
  createModule({
    id: 'beg-1-terminal',
    number: 1,
    title: 'The Terminal & Shell Essentials',
    titleFr: 'Le Terminal et les fondamentaux du Shell',
    conceptTag: 'CLI Essentials',
    conceptTagFr: 'Fondamentaux CLI',
    shortDesc: 'Understand the shell prompt, command syntax, standard streams, and shortcuts.',
    shortDescFr: 'Comprendre l\'invite de commande, la syntaxe Linux, les flux standards et raccourcis.',
    linkedLpiObjective: '103.1',
    explainTopic: 'bash',
    glossaryTerms: ['echo', 'pwd', 'whoami', 'clear', 'history'],
    theory: {
      summary: 'The shell (typically Bash) is the primary interface between the administrator and the Linux kernel. Every command follows the structure: `command [options] [arguments]`.',
      summaryFr: 'Le shell (généralement Bash) est l\'interface maîtresse entre l\'administrateur et le noyau Linux. Chaque commande suit la structure : `commande [options] [arguments]`.',
      whyItMatters: '99% of cloud and data-center Linux servers have no graphical interface (GUI). CLI mastery is non-negotiable for system administration.',
      whyItMattersFr: '99% des serveurs Linux en entreprise et dans le cloud n\'ont aucune interface graphique. La maîtrise du shell est le prérequis absolu.',
      commands: ['whoami', 'pwd', 'uname -a', 'echo $SHELL', 'history | tail -n 10'],
      codeSnippet: {
        label: 'Essential Shell Inspection',
        labelFr: 'Inspection initiale du Shell',
        code: 'echo "Logged as: $(whoami) on $(hostname) running $(uname -r)"\npwd\necho $SHELL',
        explanation: 'Queries your current user identity, server hostname, active kernel release, and working directory.',
        explanationFr: 'Affiche votre identité courante, le nom de machine, la version du noyau et le répertoire courant.',
      },
      prodTrap: 'Do not run commands blind with root privileges without checking which machine and directory you are located in (`pwd` and `hostname`).',
      prodTrapFr: 'Ne lancez jamais de commande en root sans vérifier immédiatement sur quelle machine et dans quel dossier vous vous trouvez (`hostname` et `pwd`).',
    },
    flashcards: [
      {
        id: 'fc-beg-1',
        question: 'What is the standard syntax for executing Linux commands?',
        questionFr: 'Quelle est la syntaxe standard pour exécuter une commande sous Linux ?',
        answer: 'command [options] [arguments] (e.g. ls -la /var/log)',
        answerFr: 'commande [options] [arguments] (ex: ls -la /var/log)',
        examTip: 'Options modify command behavior; arguments specify target files or values.',
        examTipFr: 'Les options modifient le comportement; les arguments ciblent les fichiers ou valeurs.',
      },
      {
        id: 'fc-beg-2',
        question: 'Which keyboard shortcut immediately terminates the currently running foreground command?',
        questionFr: 'Quel raccourci clavier interrompt immédiatement le processus interactif en cours ?',
        answer: 'Ctrl + C (sends SIGINT signal)',
        answerFr: 'Ctrl + C (envoie le signal SIGINT)',
        examTip: 'Ctrl+Z suspends (SIGTSTP), while Ctrl+C terminates (SIGINT).',
        examTipFr: 'Ctrl+Z suspend (SIGTSTP) alors que Ctrl+C termine (SIGINT).',
      }
    ],
    question: {
      id: 'q-beg-1',
      question: 'Which environment variable contains the absolute path to the user\'s default login shell?',
      questionFr: 'Quelle variable d\'environnement contient le chemin absolu du shell de connexion par défaut ?',
      options: ['$SHELL', '$BASH', '$USER_SHELL', '$PATH'],
      optionsFr: ['$SHELL', '$BASH', '$USER_SHELL', '$PATH'],
      correctIndex: 0,
      explanation: 'The $SHELL variable holds the full path to the default shell specified in /etc/passwd (e.g., /bin/bash).',
      explanationFr: 'La variable $SHELL contient le chemin complet du shell par défaut renseigné dans /etc/passwd (ex: /bin/bash).',
      commandSnippet: 'echo $SHELL',
    },
    lab: {
      id: 'lab-beg-1',
      title: 'First Steps in the Linux Shell',
      titleFr: 'Premiers pas dans le Shell Linux',
      goal: 'Identify your user, hostname, kernel version, and print the environment PATH.',
      goalFr: 'Identifier votre utilisateur, le hostname, la version du noyau et afficher le PATH.',
      context: 'You just opened a remote SSH session on a freshly deployed server.',
      contextFr: 'Vous venez d\'ouvrir une session SSH sur une machine fraîchement déployée.',
      steps: [
        {
          stepNumber: 1,
          title: 'Display current user identity',
          titleFr: 'Afficher l\'identité de l\'utilisateur courant',
          instruction: 'Execute the command to print your effective username.',
          instructionFr: 'Exécutez la commande pour afficher votre nom d\'utilisateur actif.',
          hint: 'whoami',
          hintFr: 'whoami',
          expectedCommands: ['whoami'],
          simulatedOutput: 'sysadmin',
          explanation: '`whoami` displays the effective username of the current session.',
          explanationFr: '`whoami` renvoie le nom d\'utilisateur sous lequel la session tourne.',
        },
        {
          stepNumber: 2,
          title: 'Inspect kernel and architecture',
          titleFr: 'Inspecter le noyau et l\'architecture',
          instruction: 'Print all system and kernel information.',
          instructionFr: 'Affichez l\'ensemble des informations système et du noyau.',
          hint: 'uname -a',
          hintFr: 'uname -a',
          expectedCommands: ['uname -a', 'uname -r'],
          simulatedOutput: 'Linux debian-srv 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
          explanation: '`uname -a` shows the kernel name, hostname, kernel release, build date, and CPU architecture.',
          explanationFr: '`uname -a` affiche le nom du noyau, le hostname, la version, la date et l\'architecture x86_64.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-beg-1',
      title: 'Command Not Found in Shell',
      titleFr: 'Commande introuvable dans le Shell',
      symptom: 'Typing a command returns: "bash: htop: command not found"',
      symptomFr: 'La commande retourne : "bash: htop: command not found"',
      investigationCommands: ['which htop', 'echo $PATH', 'type htop'],
      diagnosticOutput: 'which: no htop in (/usr/local/bin:/usr/bin:/bin)',
      rootCause: 'The executable is either not installed on the system, or its installation directory is not present in the $PATH environment variable.',
      rootCauseFr: 'L\'exécutable n\'est pas installé sur le système, ou bien son répertoire d\'installation ne figure pas dans le $PATH.',
      solutionCommand: 'sudo apt update && sudo apt install -y htop',
      solutionExplanation: 'Install the package using the distribution package manager, or add the binary\'s directory to $PATH in ~/.bashrc.',
      solutionExplanationFr: 'Installez le paquet via le gestionnaire APT, ou ajoutez le chemin du binaire au $PATH dans ~/.bashrc.',
    }
  }),
  createModule({
    id: 'beg-2-files',
    number: 2,
    title: 'Files & Navigation (FHS)',
    titleFr: 'Fichiers & Navigation dans l\'arborescence',
    conceptTag: 'File Hierarchy',
    conceptTagFr: 'Arborescence FHS',
    shortDesc: 'Navigate directories, create, copy, move, inspect, and organize files in the Linux FHS.',
    shortDescFr: 'Naviguer dans les dossiers, créer, copier, déplacer, inspecter et organiser des fichiers.',
    linkedLpiObjective: '103.2',
    explainTopic: 'filesystems',
    glossaryTerms: ['ls', 'cd', 'mkdir', 'cp', 'mv', 'rm', 'touch', 'cat', 'less'],
    theory: {
      summary: 'Linux uses a single unified hierarchical directory tree starting at root (`/`). Key directories include `/etc` (config), `/var` (variable data & logs), `/home` (user files), `/bin` and `/usr/bin` (programs).',
      summaryFr: 'Linux utilise une arborescence unifiée débutant à la racine (`/`). Dossiers vitaux : `/etc` (configuration), `/var` (données variables & logs), `/home` (utilisateurs), `/bin` et `/usr/bin` (programmes).',
      whyItMatters: 'Finding logs, config files, and binary executables quickly is the everyday routine of any Linux engineer.',
      whyItMattersFr: 'Localiser rapidement un fichier de log, une configuration ou un binaire est le geste quotidien de tout administrateur.',
      commands: ['ls -lah', 'cd /var/log', 'mkdir -p /opt/myapp/data', 'cp -r src/ dst/', 'mv old.txt new.txt', 'rm -rf /tmp/test'],
      codeSnippet: {
        label: 'Safe File Operations',
        labelFr: 'Opérations sécurisées sur fichiers',
        code: 'mkdir -p /opt/backups/$(date +%F)\ncp -v /etc/hosts /opt/backups/$(date +%F)/\nls -lh /opt/backups/$(date +%F)/',
        explanation: 'Creates a timestamped backup directory and copies the hosts file with verbose feedback.',
        explanationFr: 'Crée un dossier horodaté et y copie le fichier hosts avec affichage verbeux.',
      },
      prodTrap: '`rm -rf` deletes silently without asking confirmation and there is NO recycle bin in Linux command line.',
      prodTrapFr: '`rm -rf` supprime immédiatement et sans corbeille. Une erreur de frappe sur le chemin est irréversible.',
    },
    flashcards: [
      {
        id: 'fc-beg-3',
        question: 'Which directory in the Linux FHS contains host-specific system configuration files?',
        questionFr: 'Quel répertoire du FHS contient les fichiers de configuration système de la machine ?',
        answer: '/etc',
        answerFr: '/etc',
        examTip: '/etc holds plain text config files (e.g. /etc/fstab, /etc/passwd, /etc/ssh/sshd_config).',
        examTipFr: '/etc contient les fichiers de configuration textuels du système.',
      }
    ],
    question: {
      id: 'q-beg-2',
      question: 'Which `mkdir` flag creates parent directories as needed without throwing an error if they already exist?',
      questionFr: 'Quelle option de `mkdir` crée les répertoires parents nécessaires sans renvoyer d\'erreur s\'ils existent déjà ?',
      options: ['-p (parents)', '-r (recursive)', '-f (force)', '-a (all)'],
      optionsFr: ['-p (parents)', '-r (récursif)', '-f (force)', '-a (tous)'],
      correctIndex: 0,
      explanation: '`mkdir -p` creates intermediate parent folders if missing and ignores existing folders.',
      explanationFr: '`mkdir -p` crée automatiquement les répertoires intermédiaires manquants.',
      commandSnippet: 'mkdir -p /var/www/html/assets/img',
    },
    lab: {
      id: 'lab-beg-2',
      title: 'Directory Tree Construction',
      titleFr: 'Construction d\'une arborescence projet',
      goal: 'Create nested directories, copy a template file, and verify listing.',
      goalFr: 'Créer des répertoires imbriqués, copier un fichier modèle et vérifier le contenu.',
      context: 'You are setting up an application directory under /var/app.',
      contextFr: 'Vous préparez l\'arborescence d\'une application sous /var/app.',
      steps: [
        {
          stepNumber: 1,
          title: 'Create nested directory structure',
          titleFr: 'Créer les répertoires imbriqués',
          instruction: 'Create /tmp/lab-app/config and /tmp/lab-app/logs in one command.',
          instructionFr: 'Créez /tmp/lab-app/config et /tmp/lab-app/logs en une seule commande.',
          hint: 'mkdir -p /tmp/lab-app/{config,logs}',
          hintFr: 'mkdir -p /tmp/lab-app/{config,logs}',
          expectedCommands: ['mkdir -p /tmp/lab-app/config /tmp/lab-app/logs', 'mkdir -p /tmp/lab-app/{config,logs}'],
          simulatedOutput: '',
          explanation: 'The `-p` flag creates intermediate directories safely.',
          explanationFr: 'L\'option `-p` crée tous les répertoires nécessaires sans erreur.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-beg-2',
      title: 'Accidental Overwrite with cp or mv',
      titleFr: 'Écrasement accidentel de fichier',
      symptom: 'A critical config file was overwritten when moving a new version.',
      symptomFr: 'Un fichier de configuration critique a été écrasé lors d\'un déplacement.',
      investigationCommands: ['ls -la', 'alias cp', 'alias mv'],
      diagnosticOutput: 'alias cp=\'cp -i\' was not set in root session',
      rootCause: 'By default, cp and mv overwrite destination files without warning unless `-i` (interactive) or `-b` (backup) is supplied.',
      rootCauseFr: 'Par défaut, cp et mv écrasent la cible sans avertissement sauf si l\'option `-i` ou `-b` est utilisée.',
      solutionCommand: 'cp -b --suffix=.bak source.conf /etc/app.conf',
      solutionExplanation: 'Use `-b` to automatically create a backup copy before overwriting, or alias `cp -i` in your shell profile.',
      solutionExplanationFr: 'Utilisez `cp -b` pour créer une copie `.bak` automatique avant tout écrasement.',
    }
  }),
  createModule({
    id: 'beg-3-perms',
    number: 3,
    title: 'Linux Permissions & Ownership',
    titleFr: 'Permissions et Propriété des fichiers',
    conceptTag: 'Permissions & Security',
    conceptTagFr: 'Droits d\'accès & Sécurité',
    shortDesc: 'Master read (r), write (w), execute (x) for user (u), group (g), others (o), and octal modes (chmod, chown).',
    shortDescFr: 'Maîtriser lecture (r), écriture (w), exécution (x), propriétaires et modes octaux.',
    linkedLpiObjective: '104.5',
    explainTopic: 'permissions',
    glossaryTerms: ['chmod', 'chown', 'chgrp', 'umask', 'stat'],
    theory: {
      summary: 'Every file and folder has 3 permission categories: User (owner), Group, and Others. Permissions are Read (4), Write (2), and Execute (1). Total octal permissions range from 000 to 777.',
      summaryFr: 'Chaque fichier et dossier possède 3 classes de droits : Propriétaire (u), Groupe (g) et Autres (o). Droits : Lecture (4), Écriture (2), Exécution (1). La valeur octale va de 000 à 777.',
      whyItMatters: 'Incorrect permissions are the #1 cause of security breaches (world-writable sensitive files) and deployment outages (permission denied on execution or logs).',
      whyItMattersFr: 'Des permissions mal réglées sont la première cause de failles (fichiers sensibles ouverts à tous) et d\'incidents applicatifs (Permission Denied).',
      commands: ['ls -l file.txt', 'chmod 750 script.sh', 'chmod 644 config.conf', 'chown www-data:www-data /var/www', 'umask'],
      codeSnippet: {
        label: 'Securing an Application Directory',
        labelFr: 'Sécurisation d\'un dossier applicatif',
        code: 'chown -R appuser:appgroup /opt/myapp\nfind /opt/myapp -type d -exec chmod 750 {} +\nfind /opt/myapp -type f -exec chmod 640 {} +',
        explanation: 'Enforces principle of least privilege: directories are 750 (traversable by owner/group), files are 640 (non-executable, closed to others).',
        explanationFr: 'Applique le principe du moindre privilège : dossiers en 750, fichiers en 640 (fermés aux autres).',
      },
      prodTrap: 'NEVER use `chmod 777` as a quick fix in production. It allows any local process or compromised service to overwrite or inject code.',
      prodTrapFr: 'Ne faites JAMAIS `chmod 777` en production. Cela permet à n\'importe quel processus compromis d\'écrire ou d\'injecter du code.',
    },
    flashcards: [
      {
        id: 'fc-beg-4',
        question: 'What do the octal numbers 4, 2, and 1 represent in Linux file permissions?',
        questionFr: 'Que représentent les chiffres octaux 4, 2 et 1 dans les permissions Linux ?',
        answer: '4 = Read (r), 2 = Write (w), 1 = Execute (x)',
        answerFr: '4 = Lecture (r), 2 = Écriture (w), 1 = Exécution (x)',
        examTip: 'rwxr-xr-- translates to: (4+2+1=7) (4+0+1=5) (4+0+0=4) = 754.',
        examTipFr: 'rwxr-xr-- donne : 7 (u), 5 (g), 4 (o) = 754.',
      }
    ],
    question: {
      id: 'q-beg-3',
      question: 'What permission must a user have on a directory in order to enter it (`cd`) or access files inside it?',
      questionFr: 'Quel droit est obligatoire sur un répertoire pour pouvoir y entrer (`cd`) ou accéder aux fichiers qu\'il contient ?',
      options: ['Execute (x)', 'Read (r)', 'Write (w)', 'SetUID (s)'],
      optionsFr: ['Exécution (x)', 'Lecture (r)', 'Écriture (w)', 'SetUID (s)'],
      correctIndex: 0,
      explanation: 'On a directory, the execute permission (x) allows traversal and accessing its inodes. Read (r) only allows listing file names.',
      explanationFr: 'Sur un répertoire, le droit d\'exécution (x) permet la traversée. Sans x, impossible d\'accéder aux fichiers du dossier même avec r.',
      commandSnippet: 'chmod u+x /shared/projects',
    },
    lab: {
      id: 'lab-beg-3',
      title: 'Fixing Broken Script Permissions',
      titleFr: 'Correction des permissions d\'un script',
      goal: 'Make a script executable for the owner and group, but deny all access to others.',
      goalFr: 'Rendre un script exécutable par le propriétaire et le groupe, et interdire tout accès aux autres.',
      context: 'A deployment script cannot be executed due to missing execute bits.',
      contextFr: 'Un script de déploiement ne peut pas être lancé par manque de droits d\'exécution.',
      steps: [
        {
          stepNumber: 1,
          title: 'Apply 750 permission mode',
          titleFr: 'Appliquer le mode octal 750',
          instruction: 'Run chmod with octal 750 on /tmp/deploy.sh.',
          instructionFr: 'Exécutez chmod en mode 750 sur /tmp/deploy.sh.',
          hint: 'chmod 750 /tmp/deploy.sh',
          hintFr: 'chmod 750 /tmp/deploy.sh',
          expectedCommands: ['chmod 750 /tmp/deploy.sh'],
          simulatedOutput: '',
          explanation: 'Mode 750 assigns rwxr-x--- (full owner, read/exec group, none for others).',
          explanationFr: 'Le mode 750 donne rwxr-x--- (total propriétaire, lecture/exécution groupe, rien pour les autres).',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-beg-3',
      title: 'Permission Denied on Existing Script',
      titleFr: 'Permission Denied sur un script existant',
      symptom: 'Running `./backup.sh` returns `bash: ./backup.sh: Permission denied` despite user owning the file.',
      symptomFr: 'Exécuter `./backup.sh` affiche `Permission denied` alors que l\'utilisateur est propriétaire.',
      investigationCommands: ['ls -l backup.sh'],
      diagnosticOutput: '-rw-r--r-- 1 admin admin 540 Sep 20 10:00 backup.sh',
      rootCause: 'The execute bit (x) is missing for the user on the file.',
      rootCauseFr: 'Le bit d\'exécution (x) n\'est pas positionné sur le fichier.',
      solutionCommand: 'chmod +x backup.sh',
      solutionExplanation: 'Add the execute flag so the shell can spawn the script.',
      solutionExplanationFr: 'Ajoutez le droit d\'exécution avec `chmod +x backup.sh`.',
    }
  }),
  createModule({
    id: 'beg-4-procs',
    number: 4,
    title: 'Process Lifecycle & Monitoring',
    titleFr: 'Cycle de vie des Processus & Supervision',
    conceptTag: 'Processes & Resources',
    conceptTagFr: 'Processus & Ressources',
    shortDesc: 'Inspect running processes with ps, top, htop, understand PIDs, send signals (SIGTERM, SIGKILL).',
    shortDescFr: 'Inspecter les processus (ps, top, htop), comprendre les PIDs et envoyer des signaux (SIGTERM, SIGKILL).',
    linkedLpiObjective: '103.5',
    explainTopic: 'process',
    glossaryTerms: ['ps', 'top', 'htop', 'kill', 'pkill', 'killall', 'nice', 'renice'],
    theory: {
      summary: 'Every running program in Linux is represented as a Process with a unique Process ID (PID). Parent processes create child processes using fork/exec. Linux uses POSIX signals (SIGTERM 15, SIGKILL 9) to control them.',
      summaryFr: 'Tout programme en cours est représenté par un processus avec un PID unique. Les processus parents créent des enfants via fork/exec. On les pilote via les signaux POSIX (SIGTERM 15, SIGKILL 9).',
      whyItMatters: 'Troubleshooting frozen applications, memory leaks, and runaway CPU processes is a core competency of any sysadmin.',
      whyItMattersFr: 'Diagnostiquer un processus bloqué, une fuite mémoire ou un CPU à 100% est la compétence pivot de l\'ingénieur système.',
      commands: ['ps aux | head', 'ps -ef | grep nginx', 'top -b -n 1', 'kill -15 <PID>', 'kill -9 <PID>', 'pkill -f myapp'],
      codeSnippet: {
        label: 'Finding and Gracefully Stopping a Process',
        labelFr: 'Rechercher et arrêter proprement un processus',
        code: 'pgrep -l nginx\n# Send graceful SIGTERM first\nkill -15 $(pgrep nginx | head -n 1)\n# If still stuck after 10s, force kill\nkill -9 <PID>',
        explanation: 'Always attempt graceful termination (SIGTERM 15) so the process flushes buffers and closes sockets before resorting to SIGKILL (9).',
        explanationFr: 'Toujours envoyer SIGTERM (15) en premier pour permettre la fermeture propre des fichiers avant d\'utiliser SIGKILL (9).',
      },
      prodTrap: 'Never use `kill -9` as your first reaction. It prevents daemons from writing state files, releasing locks, or finishing active transactions.',
      prodTrapFr: 'N\'utilisez jamais `kill -9` en premier réflexe. Le processus ne peut pas fermer ses transactions ni libérer ses verrous.',
    },
    flashcards: [
      {
        id: 'fc-beg-5',
        question: 'What is the difference between signal 15 (SIGTERM) and signal 9 (SIGKILL)?',
        questionFr: 'Quelle est la différence entre le signal 15 (SIGTERM) et le signal 9 (SIGKILL) ?',
        answer: 'SIGTERM can be caught and handled cleanly by the process; SIGKILL cannot be caught and is handled directly by the kernel.',
        answerFr: 'SIGTERM peut être intercepté pour une fermeture propre; SIGKILL ne peut pas être intercepté et est exécuté directement par le noyau.',
        examTip: 'Default kill command sends signal 15 (SIGTERM).',
        examTipFr: 'La commande kill sans option envoie par défaut le signal 15 (SIGTERM).',
      }
    ],
    question: {
      id: 'q-beg-4',
      question: 'Which `ps` options display all running processes from all users with detailed BSD-style formatting?',
      questionFr: 'Quelles options de `ps` affichent tous les processus de tous les utilisateurs au format détaillé BSD ?',
      options: ['ps aux', 'ps -ef', 'ps -all', 'ps -debug'],
      optionsFr: ['ps aux', 'ps -ef', 'ps -all', 'ps -debug'],
      correctIndex: 0,
      explanation: '`ps aux` displays all processes (`a` = all users, `u` = user-oriented format with CPU/MEM, `x` = includes processes without a controlling tty).',
      explanationFr: '`ps aux` affiche tous les processus de tous les utilisateurs (`a`), avec consommation CPU/RAM (`u`) et processus d\'arrière-plan (`x`).',
      commandSnippet: 'ps aux | grep node',
    },
    lab: {
      id: 'lab-beg-4',
      title: 'Identifying High-CPU Processes',
      titleFr: 'Identification des processus gourmands en CPU',
      goal: 'Find the top 5 CPU-consuming processes on the server.',
      goalFr: 'Trouver les 5 processus consommant le plus de CPU sur la machine.',
      context: 'The server response time has doubled. You need to identify the culprit.',
      contextFr: 'Le temps de réponse du serveur a doublé. Vous devez identifier le coupable.',
      steps: [
        {
          stepNumber: 1,
          title: 'Sort processes by CPU',
          titleFr: 'Trier les processus par utilisation CPU',
          instruction: 'Run ps aux sorted by CPU descending, showing the top 5.',
          instructionFr: 'Lancez ps aux trié par CPU décroissant, limité aux 5 premiers.',
          hint: 'ps aux --sort=-%cpu | head -n 6',
          hintFr: 'ps aux --sort=-%cpu | head -n 6',
          expectedCommands: ['ps aux --sort=-%cpu | head -n 6', 'ps aux --sort=-pcpu | head -n 6'],
          simulatedOutput: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nmysql     1420 89.2 12.4 1250200 450120 ?      Sl   08:00  12:45 /usr/sbin/mysqld\nroot       812  4.2  0.5  140500  18200 ?      Ss   07:55   0:30 nginx: master process\nwww-data   813  2.1  0.8  145000  28400 ?      S    07:55   0:15 nginx: worker process',
          explanation: 'The sort flag `--sort=-%cpu` sorts by highest processor utilization first.',
          explanationFr: 'L\'option `--sort=-%cpu` classe immédiatement les processus les plus gourmands en tête.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-beg-4',
      title: 'Zombie Process Accumulation',
      titleFr: 'Accumulation de processus zombies (état Z)',
      symptom: '`ps aux` reveals numerous processes marked with `<defunct>` or state `Z`.',
      symptomFr: '`ps aux` révèle de nombreux processus marqués `<defunct>` ou avec l\'état `Z`.',
      investigationCommands: ['ps aux | grep "Z"', 'ps -o ppid= -p <PID>'],
      diagnosticOutput: 'appuser 4892  0.0  0.0      0     0 ?        Z    10:20   0:00 [worker] <defunct>',
      rootCause: 'Child processes have finished execution, but their parent process has not read their exit status via the wait() syscall.',
      rootCauseFr: 'Les processus enfants se sont terminés, mais leur parent n\'a pas appelé wait() pour récupérer leur statut de sortie.',
      solutionCommand: 'kill -15 <PPID>',
      solutionExplanation: 'Zombies cannot be killed directly with kill -9 because they are already dead. Restart or terminate the parent process (PPID) so init (PID 1) reaps them.',
      solutionExplanationFr: 'Un zombie est déjà mort : on ne peut pas le tuer avec kill -9. Il faut redémarrer ou tuer le processus parent (PPID).',
    }
  }),
  createModule({
    id: 'beg-5-users',
    number: 5,
    title: 'User Accounts & Privilege Escalation (sudo)',
    titleFr: 'Comptes Utilisateurs & Élévation de privilèges (sudo)',
    conceptTag: 'Identity & Access',
    conceptTagFr: 'Gestion des Identités & Accès',
    shortDesc: 'Manage accounts (/etc/passwd, /etc/shadow, /etc/group), useradd, usermod, and secure sudoers config.',
    shortDescFr: 'Gérer les comptes (/etc/passwd, /etc/shadow, /etc/group), useradd, usermod et sudoers.',
    linkedLpiObjective: '107.1',
    explainTopic: 'security',
    glossaryTerms: ['useradd', 'usermod', 'userdel', 'passwd', 'groupadd', 'sudo', 'visudo', 'id'],
    theory: {
      summary: 'Linux accounts are defined in `/etc/passwd` (UID, GID, home, shell), passwords hashes in `/etc/shadow` (readable only by root), and groups in `/etc/group`. `sudo` allows delegated execution with audit logging.',
      summaryFr: 'Les comptes sont définis dans `/etc/passwd` (UID, GID, home, shell), les empreintes de mots de passe dans `/etc/shadow` (accès root uniquement), et les groupes dans `/etc/group`. `sudo` délègue les droits avec traçabilité.',
      whyItMatters: 'Direct root login over SSH is completely prohibited in security compliance. Sysadmins must log in as unprivileged users and elevate via sudo.',
      whyItMattersFr: 'La connexion directe en root par SSH est formellement bannie en entreprise. On se connecte en compte nommé puis on élève ses droits via sudo.',
      commands: ['id', 'sudo -i', 'useradd -m -s /bin/bash dev1', 'usermod -aG sudo dev1', 'visudo'],
      codeSnippet: {
        label: 'Creating a Provisioned Sysadmin User',
        labelFr: 'Création d\'un compte administrateur sécurisé',
        code: 'useradd -m -s /bin/bash -c "Alice Martin" amartin\nusermod -aG sudo,adm amartin\npasswd amartin',
        explanation: 'Creates user home directory (-m), assigns default bash shell (-s), adds to sudo group (-aG), and sets password.',
        explanationFr: 'Crée le répertoire personnel (-m), assigne bash (-s), ajoute au groupe sudo (-aG) et définit le mot de passe.',
      },
      prodTrap: 'Never edit `/etc/sudoers` with a standard text editor like nano or vim. ALWAYS use `visudo`, which performs syntax validation before saving.',
      prodTrapFr: 'Ne modifiez JAMAIS `/etc/sudoers` avec un éditeur classique. Utilisez TOUJOURS `visudo` qui vérifie la syntaxe avant d\'enregistrer.',
    },
    flashcards: [
      {
        id: 'fc-beg-6',
        question: 'Which file stores encrypted user password hashes and password expiration policies?',
        questionFr: 'Quel fichier stocke les empreintes de mots de passe chiffrées et la politique d\'expiration ?',
        answer: '/etc/shadow (mode 640, root:shadow)',
        answerFr: '/etc/shadow (droits 640, root:shadow)',
        examTip: '/etc/passwd is world-readable (644); /etc/shadow is strictly restricted (640 or 000).',
        examTipFr: '/etc/passwd est lisible par tous (644); /etc/shadow est strictement protégé.',
      }
    ],
    question: {
      id: 'q-beg-5',
      question: 'Which `usermod` flags must be used together to add a user to a supplementary group without removing existing groups?',
      questionFr: 'Quelles options de `usermod` doivent être utilisées ensemble pour ajouter un groupe secondaire sans écraser les groupes existants ?',
      options: ['-aG (append to Groups)', '-g (primary group)', '-G only', '-u (update)'],
      optionsFr: ['-aG (ajouter aux groupes existants)', '-g (groupe primaire)', '-G seul', '-u (mise à jour)'],
      correctIndex: 0,
      explanation: 'Omitting `-a` when using `-G` will remove the user from all other supplementary groups, potentially locking them out of administrative access.',
      explanationFr: 'Oublier `-a` avec `-G` retire l\'utilisateur de tous ses autres groupes secondaires, ce qui peut lui faire perdre son accès sudo.',
      commandSnippet: 'sudo usermod -aG docker developer',
    },
    lab: {
      id: 'lab-beg-5',
      title: 'Auditing User Group Memberships',
      titleFr: 'Audit des appartenances de groupes',
      goal: 'Inspect user groups and verify administrative sudo delegation.',
      goalFr: 'Inspecter les groupes d\'un utilisateur et vérifier son statut sudo.',
      context: 'You must verify if the account `operator` belongs to group `adm`.',
      contextFr: 'Vous devez vérifier si le compte `operator` fait partie du groupe `adm`.',
      steps: [
        {
          stepNumber: 1,
          title: 'Display user groups with id',
          titleFr: 'Afficher les groupes avec id',
          instruction: 'Run id for the current user.',
          instructionFr: 'Exécutez id pour l\'utilisateur en cours.',
          hint: 'id',
          hintFr: 'id',
          expectedCommands: ['id'],
          simulatedOutput: 'uid=1000(sysadmin) gid=1000(sysadmin) groups=1000(sysadmin),4(adm),27(sudo)',
          explanation: '`id` displays effective UID, primary GID, and all supplementary groups.',
          explanationFr: '`id` liste l\'UID, le GID principal et l\'ensemble des groupes secondaires.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-beg-5',
      title: 'Corrupted Sudoers File Lockout',
      titleFr: 'Verrouillage suite à une erreur dans sudoers',
      symptom: 'Running any `sudo` command fails with: "syntax error in /etc/sudoers near line 25".',
      symptomFr: 'Toute commande sudo échoue avec : "syntax error in /etc/sudoers near line 25".',
      investigationCommands: ['sudo -l', 'pkexec visudo'],
      diagnosticOutput: '>>> /etc/sudoers: syntax error near line 25 <<<\nsudo: parse error in /etc/sudoers near line 25\nsudo: no valid sudoers sources found',
      rootCause: 'An administrator manually edited `/etc/sudoers` with a typo instead of using `visudo`.',
      rootCauseFr: 'Un administrateur a édité `/etc/sudoers` sans passer par `visudo`, introduisant une faute de syntaxe.',
      solutionCommand: 'pkexec visudo -c && pkexec visudo',
      solutionExplanation: 'Use `pkexec visudo` from GUI/polkit or boot into single-user / recovery mode to correct the file with visudo.',
      solutionExplanationFr: 'Utilisez `pkexec visudo` ou redémarrez en mode recovery/single-user pour corriger le fichier avec visudo.',
    }
  }),
  createModule({
    id: 'beg-6-network',
    number: 6,
    title: 'Baseline Linux Networking',
    titleFr: 'Fondamentaux du Réseau sous Linux',
    conceptTag: 'Network Basics',
    conceptTagFr: 'Bases Réseau',
    shortDesc: 'Inspect IP addresses (ip addr), routing (ip route), test connectivity (ping, curl), and sockets (ss -tulpn).',
    shortDescFr: 'Inspecter les IPs (ip addr), routes (ip route), tester la connectivité (ping, curl) et sockets (ss -tulpn).',
    linkedLpiObjective: '109.1',
    explainTopic: 'networking',
    glossaryTerms: ['ip', 'ping', 'ss', 'traceroute', 'curl', 'dig', 'host'],
    theory: {
      summary: 'Modern Linux systems use the `iproute2` suite (`ip addr`, `ip route`, `ip link`) replacing obsolete legacy tools (`ifconfig`, `netstat`, `route`). Sockets are inspected with `ss`.',
      summaryFr: 'Les distributions modernes utilisent la suite `iproute2` (`ip addr`, `ip route`, `ip link`) qui remplace les vieux outils obsolètes (`ifconfig`, `netstat`). Les sockets sont inspectés avec `ss`.',
      whyItMatters: 'Every server interacts over the network. Knowing whether an issue is IP-level, DNS-level, port-blocked, or service-down is the key triage skill.',
      whyItMattersFr: 'Tout serveur vit en réseau. Savoir si une panne vient de l\'IP, du DNS, du port ou du service est la base du diagnostic.',
      commands: ['ip addr show', 'ip route', 'ping -c 4 8.8.8.8', 'ss -tulpn', 'curl -I https://debian.org'],
      codeSnippet: {
        label: 'Network Health Check Triage',
        labelFr: 'Diagnostic réseau en 4 étapes',
        code: '# 1. Check local IP\nip -br addr\n# 2. Check default gateway\nip route show default\n# 3. Test gateway ping\nping -c 2 $(ip route show default | awk \'{print $3}\')\n# 4. Check listening sockets\nss -tulpn',
        explanation: 'Sequential triage isolating interface, gateway, latency, and active listening ports.',
        explanationFr: 'Triage ordonné vérifiant interface, passerelle, connectivité et ports en écoute.',
      },
      prodTrap: 'Do not rely on `ifconfig` or `netstat` in modern production. They are deprecated and often not installed on recent Debian/Ubuntu/RHEL images.',
      prodTrapFr: 'N\'utilisez plus `ifconfig` ou `netstat`. Ils sont dépréciés et souvent absents des conteneurs et distributions récentes.',
    },
    flashcards: [
      {
        id: 'fc-beg-7',
        question: 'Which modern command displays all listening TCP and UDP sockets with process names and port numbers?',
        questionFr: 'Quelle commande moderne affiche tous les sockets TCP et UDP en écoute avec noms de processus et ports ?',
        answer: 'ss -tulpn (or ss -tulwn)',
        answerFr: 'ss -tulpn (ou ss -tulwn)',
        examTip: '-t (tcp), -u (udp), -l (listening), -p (processes), -n (numeric ports).',
        examTipFr: '-t (tcp), -u (udp), -l (écoute), -p (processus), -n (numérique sans résolution DNS).',
      }
    ],
    question: {
      id: 'q-beg-6',
      question: 'Which command displays the Linux kernel routing table using the modern iproute2 suite?',
      questionFr: 'Quelle commande affiche la table de routage du noyau avec la suite moderne iproute2 ?',
      options: ['ip route show', 'route -n', 'netstat -r', 'ifconfig -r'],
      optionsFr: ['ip route show', 'route -n', 'netstat -r', 'ifconfig -r'],
      correctIndex: 0,
      explanation: '`ip route` (or `ip route show`) is the modern iproute2 command that lists routing entries including the default gateway.',
      explanationFr: '`ip route show` est la commande standard moderne pour afficher les passerelles et tables de routage.',
      commandSnippet: 'ip route show',
    },
    lab: {
      id: 'lab-beg-6',
      title: 'Validating Web Server Sockets',
      titleFr: 'Validation des sockets d\'un serveur Web',
      goal: 'Inspect active listening ports to confirm a web server is bound to port 80.',
      goalFr: 'Inspecter les ports en écoute pour confirmer que le serveur web écoute sur le port 80.',
      context: 'A customer reports that the web service is unreachable. You must verify local socket binding.',
      contextFr: 'Un client signale le site inaccessible. Vérifiez si le port écoute localement.',
      steps: [
        {
          stepNumber: 1,
          title: 'Check listening TCP sockets with ss',
          titleFr: 'Vérifier les sockets TCP en écoute avec ss',
          instruction: 'Run ss with flags for TCP, listening, and numeric output.',
          instructionFr: 'Lancez ss avec les options TCP, écoute et numérique.',
          hint: 'ss -tln',
          hintFr: 'ss -tln',
          expectedCommands: ['ss -tln', 'ss -tulpn', 'sudo ss -tulpn'],
          simulatedOutput: 'State      Recv-Q Send-Q Local Address:Port               Peer Address:Port\nLISTEN     0      511          0.0.0.0:80                      0.0.0.0:*\nLISTEN     0      128          0.0.0.0:22                      0.0.0.0:*',
          explanation: 'Port 80 is listening on 0.0.0.0 (all interfaces), confirming the daemon is active.',
          explanationFr: 'Le port 80 est bien en écoute sur 0.0.0.0, confirmant que le daemon web fonctionne.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-beg-6',
      title: 'DNS Resolution Failure on Server',
      titleFr: 'Échec de résolution DNS sur le serveur',
      symptom: '`ping 8.8.8.8` works, but `ping google.com` fails with "Temporary failure in name resolution".',
      symptomFr: '`ping 8.8.8.8` répond, mais `ping google.com` échoue avec "Temporary failure in name resolution".',
      investigationCommands: ['cat /etc/resolv.conf', 'systemctl status systemd-resolved'],
      diagnosticOutput: '# /etc/resolv.conf is empty or contains unreachable nameserver 192.168.1.254',
      rootCause: 'Network layer routing is operational, but DNS nameservers defined in `/etc/resolv.conf` are unreachable or invalid.',
      rootCauseFr: 'La couche IP fonctionne, mais les serveurs DNS configurés dans `/etc/resolv.conf` sont invalides ou injoignables.',
      solutionCommand: 'echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf',
      solutionExplanation: 'Configure a valid working DNS resolver in `/etc/resolv.conf` or update network manager configuration.',
      solutionExplanationFr: 'Définissez un résolveur DNS fonctionnel dans `/etc/resolv.conf` ou via le gestionnaire réseau.',
    }
  }),
];

/* ==========================================================================
   EXPORTED PATHS - FUNDAMENTALS CATEGORY (5 PARCOURS)
   ========================================================================== */

export const fundamentalsLearningPaths: LearningPath[] = [
  // 1. Linux pour débutant
  {
    id: 'fundamentals-beginner',
    category: 'fundamentals',
    emoji: '🐧',
    title: 'Linux for Beginners',
    titleFr: 'Linux pour débutant',
    subtitle: 'From zero terminal experience to solid autonomy across files, users, permissions, processes, and network.',
    subtitleFr: 'Du terminal initial à l\'autonomie sur les fichiers, utilisateurs, permissions, processus et réseau.',
    description: 'The definitive introduction to Linux systems: terminal navigation, FHS filesystem structure, file ownership, permissions, process monitoring, and networking fundamentals.',
    descriptionFr: 'Le parcours d\'initiation complet : navigation shell, arborescence FHS, droits et propriétaires, gestion des processus et diagnostic réseau.',
    difficulty: 'Beginner',
    difficultyFr: 'Débutant',
    estimatedHours: 15,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    themeColor: 'emerald',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    accentHex: '#059669',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    objectives: [
      'Master essential terminal navigation and shell hotkeys',
      'Navigate and manipulate files within the Linux FHS',
      'Configure octal and symbolic permissions with chmod and chown',
      'Monitor and control background processes with ps, top, and signals',
      'Manage user accounts, groups, and delegated privileges with sudo',
      'Verify network interfaces, IP addresses, and listening sockets'
    ],
    objectivesFr: [
      'Maîtriser la navigation dans le terminal et les raccourcis shell',
      'Manipuler fichiers et répertoires dans l\'arborescence FHS',
      'Configurer les droits octaux et symboliques avec chmod et chown',
      'Surveiller et piloter les processus avec ps, top et signaux',
      'Gérer les utilisateurs, groupes et délégations sudo',
      'Diagnostiquer interfaces, adresses IP et sockets en écoute'
    ],
    prerequisites: [
      'No prior Linux experience required',
      'Basic computer literacy and understanding of operating systems'
    ],
    prerequisitesFr: [
      'Aucune expérience préalable de Linux requise',
      'Connaissances générales de base en informatique'
    ],
    modules: beginnerModules,
    steps: beginnerModules,
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Shell, Files & Permissions',
      titleFr: 'Évaluation intermédiaire : Shell, Fichiers & Droits',
      description: 'Validate your understanding of navigation, file operations, and permissions before moving to processes and networking.',
      descriptionFr: 'Validez votre compréhension de la navigation, des manipulations de fichiers et des droits d\'accès.',
      passingScorePct: 75,
      questions: [
        beginnerModules[0].question,
        beginnerModules[1].question,
        beginnerModules[2].question,
      ]
    },
    finalEvaluation: {
      title: 'Beginner Autonomy Challenge: System Onboarding',
      titleFr: 'Évaluation finale : Prise en main d\'un serveur Linux',
      scenario: 'You are provided a freshly installed Debian server. You must create an administrative user, configure project directory permissions, verify running services, and ensure network reachability.',
      scenarioFr: 'Sur un serveur Debian fraîchement installé, vous devez créer un compte utilisateur administrateur, configurer les permissions d\'un dossier partagé, vérifier les processus actifs et valider la connectivité réseau.',
      deliverables: [
        'User `devops` created with home directory and sudo membership',
        'Directory `/var/project` configured with mode 770 and group ownership',
        'Top 3 CPU processes identified and logged to `/tmp/perf.log`',
        'Network default gateway and DNS reachability verified'
      ],
      deliverablesFr: [
        'Utilisateur `devops` créé avec dossier personnel et accès sudo',
        'Répertoire `/var/project` configuré en mode 770 avec groupe dédié',
        'Top 3 des processus les plus consommateurs relevés dans `/tmp/perf.log`',
        'Passerelle par défaut et résolution DNS validées'
      ],
      validationCriteria: [
        'visudo syntax check passed without errors',
        'No world-writable permissions (777 strictly avoided)',
        'Network and DNS diagnostics executed with iproute2 and ping'
      ],
      validationCriteriaFr: [
        'Syntaxe sudoers validée sans erreur via visudo',
        'Aucun droit 777 permissif utilisé',
        'Diagnostic réseau exécuté avec les outils modernes iproute2'
      ],
      finalQuiz: [
        beginnerModules[3].question,
        beginnerModules[4].question,
        beginnerModules[5].question,
      ]
    },
    capstone: {
      title: 'Beginner Autonomy Challenge: System Onboarding',
      titleFr: 'Évaluation finale : Prise en main d\'un serveur Linux',
      scenario: 'You are provided a freshly installed Debian server. You must create an administrative user, configure project directory permissions, verify running services, and ensure network reachability.',
      scenarioFr: 'Sur un serveur Debian fraîchement installé, vous devez créer un compte utilisateur administrateur, configurer les permissions d\'un dossier partagé, vérifier les processus actifs et valider la connectivité réseau.',
      deliverables: [
        'User `devops` created with home directory and sudo membership',
        'Directory `/var/project` configured with mode 770 and group ownership',
        'Top 3 CPU processes identified and logged to `/tmp/perf.log`',
        'Network default gateway and DNS reachability verified'
      ],
      deliverablesFr: [
        'Utilisateur `devops` créé avec dossier personnel et accès sudo',
        'Répertoire `/var/project` configuré en mode 770 avec groupe dédié',
        'Top 3 des processus les plus consommateurs relevés dans `/tmp/perf.log`',
        'Passerelle par défaut et résolution DNS validées'
      ],
      validationCriteria: [
        'visudo syntax check passed without errors',
        'No world-writable permissions (777 strictly avoided)',
        'Network and DNS diagnostics executed with iproute2 and ping'
      ],
      validationCriteriaFr: [
        'Syntaxe sudoers validée sans erreur via visudo',
        'Aucun droit 777 permissif utilisé',
        'Diagnostic réseau exécuté avec les outils modernes iproute2'
      ],
    },
    badgeEarned: {
      title: 'Linux Beginner Foundations Certified',
      titleFr: 'Certifié Fondations Linux Débutant',
      icon: '🐧'
    }
  },

  // 2. Maîtriser la ligne de commande
  {
    id: 'fundamentals-cli',
    category: 'fundamentals',
    emoji: '⌨️',
    title: 'Mastering the Command Line',
    titleFr: 'Maîtriser la ligne de commande',
    subtitle: 'ls, cp, mv, find, grep, pipes, redirections, and advanced CLI manipulation.',
    subtitleFr: 'ls, cp, mv, find, grep, tubes, redirections et commandes avancées (xargs, tar, sed).',
    description: 'Elevate your shell skills to pro level: stream redirections, powerful find filters, regular expressions with grep, pipeline composition, archive handling, and batch text processing.',
    descriptionFr: 'Passez au niveau professionnel sur la ligne de commande : redirections de flux, recherche puissante avec find, regex avec grep, pipelines, archives tar et traitement batch avec xargs.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 18,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-300',
    themeColor: 'blue',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    accentHex: '#2563eb',
    bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    objectives: [
      'Master file searching with find (-name, -mtime, -size, -exec)',
      'Construct text processing pipelines using grep, cut, sort, and uniq',
      'Control stdin, stdout, and stderr with redirections (>, >>, 2>&1)',
      'Parallelize and chain operations with xargs',
      'Create and extract compressed archives with tar (tar.gz, tar.xz)'
    ],
    objectivesFr: [
      'Maîtriser la recherche avec find (-name, -mtime, -size, -exec)',
      'Construire des pipelines de traitement texte avec grep, cut, sort et uniq',
      'Rediriger proprement stdin, stdout et stderr (>, >>, 2>&1)',
      'Chaîner et paralléliser des commandes batch avec xargs',
      'Créer et extraire des archives compressées avec tar (tar.gz, tar.xz)'
    ],
    prerequisites: ['Linux for Beginners or equivalent CLI exposure'],
    prerequisitesFr: ['Avoir suivi Linux pour débutant ou posséder les bases du terminal'],
    modules: [
      createModule({
        id: 'cli-1-pipes',
        number: 1,
        title: 'Pipes & Stream Redirections',
        titleFr: 'Tubes (pipes) et Redirections de flux',
        conceptTag: 'Streams & Pipes',
        conceptTagFr: 'Flux & Tubes',
        shortDesc: 'Master stdout (1), stderr (2), appending (>>), and chaining commands with pipes (|).',
        shortDescFr: 'Maîtriser stdout (1), stderr (2), l\'ajout (>>) et le chaînage via les tubes (|).',
        linkedLpiObjective: '103.4',
        explainTopic: 'bash',
        glossaryTerms: ['tee', 'cat', 'xargs', 'sort', 'uniq', 'wc'],
        theory: {
          summary: 'In Linux, every program opens three standard streams: stdin (0), stdout (1), and stderr (2). `>` overwrites stdout, `>>` appends, `2>&1` redirects stderr into stdout, and `|` passes output as input to the next tool.',
          summaryFr: 'Sous Linux, tout programme ouvre 3 flux : stdin (0), stdout (1), stderr (2). `>` écrase la sortie, `>>` ajoute, `2>&1` fusionne les erreurs, et `|` passe la sortie en entrée de la commande suivante.',
          whyItMatters: 'Redirecting output and silencing error noise is critical for building reliable automated scripts and cron jobs.',
          whyItMattersFr: 'La redirection propre des sorties et erreurs est essentielle pour créer des scripts fiables et des tâches cron silencieuses.',
          commands: ['cmd > file.log 2>&1', 'grep "ERROR" /var/log/syslog | sort | uniq -c', 'cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -nr | head'],
          codeSnippet: {
            label: 'Logging Both Output and Errors with Timestamp',
            labelFr: 'Journaliser sortie et erreurs avec horodatage',
            code: './deploy.sh > >(tee -a deploy.log) 2> >(tee -a deploy.err >&2)',
            explanation: 'Uses process substitution to write both to console and dedicated log files simultaneously.',
            explanationFr: 'Utilise la substitution de processus pour afficher à l\'écran tout en consignant dans des fichiers.',
          },
          prodTrap: 'Using `>` instead of `>>` on a production log file immediately wipes its entire historical content.',
          prodTrapFr: 'Utiliser `>` au lieu de `>>` sur un fichier de log de production efface instantanément tout son historique.',
        },
        flashcards: [
          {
            id: 'fc-cli-1',
            question: 'How do you redirect both standard output and standard error to the same file in Bash?',
            questionFr: 'Comment rediriger à la fois stdout et stderr vers le même fichier sous Bash ?',
            answer: 'command > output.log 2>&1 (or modern shortcut: command &> output.log)',
            answerFr: 'commande > output.log 2>&1 (ou raccourci moderne : commande &> output.log)',
            examTip: '2>&1 means "send file descriptor 2 (stderr) to where file descriptor 1 (stdout) is currently going".',
            examTipFr: '2>&1 signifie "rediriger le descripteur 2 (stderr) vers le descripteur 1 (stdout)".',
          }
        ],
        question: {
          id: 'q-cli-1',
          question: 'Which utility splits standard input into both standard output and one or more files?',
          questionFr: 'Quel utilitaire permet de dupliquer l\'entrée standard vers la sortie standard ET dans un fichier ?',
          options: ['tee', 'split', 'dual', 'pipe'],
          optionsFr: ['tee', 'split', 'dual', 'pipe'],
          correctIndex: 0,
          explanation: '`tee` reads from standard input and writes to standard output and files in one go (like a T-pipe).',
          explanationFr: '`tee` lit l\'entrée standard et l\'écrit simultanément sur stdout et dans les fichiers spécifiés.',
          commandSnippet: 'echo "Configuration updated" | sudo tee -a /etc/motd',
        },
        lab: {
          id: 'lab-cli-1',
          title: 'Extracting Unique Client IPs from Web Logs',
          titleFr: 'Extraction des IPs uniques depuis les logs web',
          goal: 'Extract client IPs, count occurrences, and sort descending.',
          goalFr: 'Extraire les IPs clientes, compter les occurrences et trier par fréquence.',
          context: 'An ongoing denial of service is targeting your reverse proxy.',
          contextFr: 'Une attaque par déni de service cible votre proxy inverse.',
          steps: [
            {
              stepNumber: 1,
              title: 'Count unique IPs with pipeline',
              titleFr: 'Compter les IPs uniques via pipeline',
              instruction: 'Use cut, sort, uniq -c, and sort -nr.',
              instructionFr: 'Utilisez cut, sort, uniq -c et sort -nr.',
              hint: 'cut -d " " -f 1 /var/log/nginx/access.log | sort | uniq -c | sort -nr',
              hintFr: 'cut -d " " -f 1 /var/log/nginx/access.log | sort | uniq -c | sort -nr',
              expectedCommands: ['cut -d " " -f 1 /var/log/nginx/access.log | sort | uniq -c | sort -nr'],
              simulatedOutput: '   1420 198.51.100.23\n    812 203.0.113.88\n     42 192.0.2.1',
              explanation: 'Reveals that IP 198.51.100.23 has made 1,420 hits.',
              explanationFr: 'Met en évidence l\'IP 198.51.100.23 avec 1 420 requêtes suspectes.',
            }
          ]
        },
        troubleshooting: {
          id: 'tb-cli-1',
          title: 'Silent Script Failure Due to Buried Stderr',
          titleFr: 'Échec silencieux d\'un script par masquage de stderr',
          symptom: 'A cron script fails every night without sending any failure alert.',
          symptomFr: 'Un script cron échoue chaque nuit sans lever d\'alerte.',
          investigationCommands: ['crontab -l', 'grep CRON /var/log/syslog'],
          diagnosticOutput: '0 2 * * * /opt/backup.sh > /dev/null 2>&1',
          rootCause: 'Redirecting `2>&1 > /dev/null` completely discards errors, hiding critical failures.',
          rootCauseFr: 'La redirection vers `/dev/null` supprime toutes les erreurs sans laisser de trace.',
          solutionCommand: '0 2 * * * /opt/backup.sh >> /var/log/backup.log 2>&1',
          solutionExplanation: 'Always log to a persistent file rather than /dev/null so failures can be inspected.',
          solutionExplanationFr: 'Redirigez toujours vers un fichier de log persistant pour pouvoir auditer les échecs.',
        }
      }),
      createModule({
        id: 'cli-2-find-grep',
        number: 2,
        title: 'Precision Search with find & grep',
        titleFr: 'Recherche chirurgicale avec find & grep',
        conceptTag: 'Search & RegEx',
        conceptTagFr: 'Recherche & Expressions Régulières',
        shortDesc: 'Find files by modification time, size, permissions, and search regex patterns inside file contents.',
        shortDescFr: 'Rechercher par date de modification, taille, droits et trouver des motifs regex dans les fichiers.',
        linkedLpiObjective: '103.3',
        explainTopic: 'grep',
        glossaryTerms: ['find', 'grep', 'locate', 'which', 'whereis', 'sed', 'awk'],
        theory: {
          summary: '`find` searches the directory tree for files matching criteria (name, size, age, ownership, permissions). `grep` searches inside text files for matching regular expressions.',
          summaryFr: '`find` parcourt l\'arborescence selon des critères de métadonnées (nom, taille, date, droits). `grep` fouille l\'intérieur des fichiers textuels avec des expressions régulières.',
          whyItMatters: 'Finding corrupted config files, log files that filled the disk, or compromised scripts requires razor-sharp find and grep skills.',
          whyItMattersFr: 'Retrouver un fichier de log qui a saturé le disque ou une ligne d\'erreur parmi des gigaoctets de logs est une compétence vitale.',
          commands: ['find /var/log -type f -name "*.log" -mtime -7', 'find / -type f -size +500M', 'grep -rn "ServerName" /etc/apache2/', 'find /tmp -type f -name "*.tmp" -delete'],
          codeSnippet: {
            label: 'Finding Large Inactive Files and Archiving Them',
            labelFr: 'Trouver et archiver les gros fichiers inactifs',
            code: 'find /var/log -type f -name "*.log" -mtime +30 -size +100M -exec gzip -v {} +',
            explanation: 'Finds log files older than 30 days exceeding 100MB and compresses them in batches using gzip.',
            explanationFr: 'Trouve les logs de plus de 30 jours dépassant 100 Mo et les compresse par lot avec gzip.',
          },
          prodTrap: 'Avoid using `find ... -exec rm {} \\;` on millions of files. It spawns one rm process per file, causing massive CPU overhead. Use `+` instead of `\\;` or pipe to `xargs`.',
          prodTrapFr: 'Évitez `-exec rm {} \\;` sur des millions de fichiers (lance un process rm par fichier). Préférez `+` ou `xargs` pour grouper les appels.',
        },
        flashcards: [
          {
            id: 'fc-cli-2',
            question: 'Which grep flag performs recursive directory searching with line numbers and case insensitivity?',
            questionFr: 'Quelle combinaison d\'options grep effectue une recherche récursive, avec numéros de ligne et insensible à la casse ?',
            answer: 'grep -rni "pattern" /path/to/dir',
            answerFr: 'grep -rni "motif" /chemin/du/dossier',
            examTip: '-r (recursive), -n (line number), -i (ignore case).',
            examTipFr: '-r (récursif), -n (numéro de ligne), -i (ignore la casse).',
          }
        ],
        question: {
          id: 'q-cli-2',
          question: 'Which `find` expression matches files that have the SUID bit set in their permissions?',
          questionFr: 'Quelle expression `find` sélectionne les fichiers possédant le bit SUID actif dans leurs permissions ?',
          options: ['find / -perm -4000', 'find / -perm -2000', 'find / -perm -1000', 'find / -perm -777'],
          optionsFr: ['find / -perm -4000', 'find / -perm -2000', 'find / -perm -1000', 'find / -perm -777'],
          correctIndex: 0,
          explanation: 'The SUID bit corresponds to octal 4000 (SGID is 2000, Sticky bit is 1000). `-perm -4000` checks if at least the 4000 bit is set.',
          explanationFr: 'Le bit SUID correspond à la valeur octale 4000. L\'option `-perm -4000` recherche les fichiers ayant au moins ce bit.',
          commandSnippet: 'find /usr/bin -type f -perm -4000',
        },
        lab: {
          id: 'lab-cli-2',
          title: 'Hunting Large Files on a Filled Partition',
          titleFr: 'Traque des fichiers volumineux sur disque plein',
          goal: 'Locate all files over 100MB in /var/log.',
          goalFr: 'Trouver tous les fichiers de plus de 100 Mo dans /var/log.',
          context: 'Partition /var reached 98% disk capacity.',
          contextFr: 'La partition /var a atteint 98% de capacité.',
          steps: [
            {
              stepNumber: 1,
              title: 'Run find with size filter',
              titleFr: 'Lancer find avec filtre de taille',
              instruction: 'Find regular files in /var/log larger than 100M with readable size output.',
              instructionFr: 'Trouvez les fichiers de /var/log de plus de 100M avec affichage lisible.',
              hint: 'find /var/log -type f -size +100M -exec ls -lh {} +',
              hintFr: 'find /var/log -type f -size +100M -exec ls -lh {} +',
              expectedCommands: ['find /var/log -type f -size +100M -exec ls -lh {} +', 'find /var/log -type f -size +100M'],
              simulatedOutput: '-rw-r----- 1 root adm 1.8G Sep 20 04:12 /var/log/syslog.1\n-rw-r--r-- 1 root root 420M Sep 19 23:59 /var/log/kern.log',
              explanation: 'Identifies two rogue uncompressed log files consuming over 2.2GB.',
              explanationFr: 'Met en évidence deux fichiers de log non compressés monopolisant plus de 2,2 Go.',
            }
          ]
        },
        troubleshooting: {
          id: 'tb-cli-2',
          title: 'grep Binary File Warning and Hang',
          titleFr: 'grep bloque sur un fichier binaire',
          symptom: '`grep -r "error" /var/log/` outputs "Binary file matches" or hangs on socket files.',
          symptomFr: '`grep -r "error" /var/log/` affiche "Binary file matches" ou freeze sur un socket.',
          investigationCommands: ['file /var/log/*'],
          diagnosticOutput: 'Binary file /var/log/journal/system.journal matches',
          rootCause: 'Binary compressed log files and socket files in /var/log trigger grep binary mode.',
          rootCauseFr: 'Des fichiers de logs binaires (systemd journal) déclenchent le mode binaire de grep.',
          solutionCommand: 'grep -r -I --exclude="*.journal" "error" /var/log/',
          solutionExplanation: 'Use `-I` to ignore binary files automatically, or specify `--exclude`.',
          solutionExplanationFr: 'Utilisez `-I` pour ignorer automatiquement les fichiers binaires.',
        }
      })
    ],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Pipes & Redirections',
      titleFr: 'Évaluation intermédiaire : Tubes & Redirections',
      description: 'Validate your proficiency chaining commands, handling errors, and filtering output.',
      descriptionFr: 'Validez votre capacité à chaîner des commandes et à manipuler les flux standard.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'CLI Master Challenge: Log Extraction & Data Cleansing',
      titleFr: 'Évaluation finale : Extraction & Traitement de logs en ligne de commande',
      scenario: 'Parse a multi-gigabyte Apache/Nginx access log file: isolate HTTP 500 errors, extract requested URLs, sort by error frequency, and generate an executive report.',
      scenarioFr: 'Analyser un fichier de log web volumineux : isoler les erreurs HTTP 500, extraire les URLs en cause, classer par récurrence et consigner dans un rapport.',
      deliverables: [
        'Pipeline isolating HTTP 500 responses without temporary files',
        'Top 10 failing endpoints ranked by frequency',
        'Summary report saved to `/opt/reports/500_errors.txt`'
      ],
      deliverablesFr: [
        'Pipeline extrayant les codes 500 sans fichiers temporaires',
        'Top 10 des endpoints en échec classés par fréquence',
        'Rapport synthétique écrit dans `/opt/reports/500_errors.txt`'
      ],
      validationCriteria: [
        'Used cut, awk, sort, and uniq in a single pipeline',
        'Standard error redirected cleanly to avoid cluttering output'
      ],
      validationCriteriaFr: [
        'Utilisation conjointe de cut, awk, sort et uniq en un seul flux',
        'Redirection propre des erreurs'
      ]
    },
    capstone: {
      title: 'CLI Master Challenge: Log Extraction & Data Cleansing',
      titleFr: 'Évaluation finale : Extraction & Traitement de logs en ligne de commande',
      scenario: 'Parse a multi-gigabyte Apache/Nginx access log file: isolate HTTP 500 errors, extract requested URLs, sort by error frequency, and generate an executive report.',
      scenarioFr: 'Analyser un fichier de log web volumineux : isoler les erreurs HTTP 500, extraire les URLs en cause, classer par récurrence et consigner dans un rapport.',
      deliverables: [
        'Pipeline isolating HTTP 500 responses without temporary files',
        'Top 10 failing endpoints ranked by frequency',
        'Summary report saved to `/opt/reports/500_errors.txt`'
      ],
      deliverablesFr: [
        'Pipeline extrayant les codes 500 sans fichiers temporaires',
        'Top 10 des endpoints en échec classés par fréquence',
        'Rapport synthétique écrit dans `/opt/reports/500_errors.txt`'
      ],
      validationCriteria: [
        'Used cut, awk, sort, and uniq in a single pipeline',
        'Standard error redirected cleanly to avoid cluttering output'
      ],
      validationCriteriaFr: [
        'Utilisation conjointe de cut, awk, sort et uniq en un seul flux',
        'Redirection propre des erreurs'
      ]
    },
    badgeEarned: {
      title: 'Command Line Master Certified',
      titleFr: 'Certifié Maître de la Ligne de Commande',
      icon: '⌨️'
    }
  },

  // 3. Maîtriser Bash
  {
    id: 'fundamentals-bash',
    category: 'fundamentals',
    emoji: '🐚',
    title: 'Mastering Bash Scripting',
    titleFr: 'Maîtriser Bash',
    subtitle: 'Variables → conditions → boucles → fonctions → scripts → automatisation.',
    subtitleFr: 'Variables → conditions → boucles → fonctions → scripts → automatisation.',
    description: 'Write robust, maintainable, production-ready shell scripts: shebangs, parameter expansion, exit codes, conditional branching, loops, functions, trap signal handling, and debugging.',
    descriptionFr: 'Concevoir des scripts Bash fiables et industriels : shebang, expansion de paramètres, codes de sortie, conditions, boucles, fonctions, capture de signaux avec trap et mode strict.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 20,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
    themeColor: 'amber',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    accentHex: '#d97706',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    objectives: [
      'Master Bash strict mode (`set -euo pipefail`)',
      'Use positional parameters, environment variables, and parameter expansions',
      'Implement branching with `if/then/elif/fi` and `case` statements',
      'Write robust `for`, `while`, and `until` loops reading files and streams',
      'Structure modular scripts with functions, local variables, and return codes',
      'Handle cleanups and unexpected signals with `trap`'
    ],
    objectivesFr: [
      'Adopter le mode strict Bash (`set -euo pipefail`)',
      'Manipuler paramètres positionnels, variables d\'environnement et expansions',
      'Structurer les conditions avec `if/elif/fi` et les expressions `case`',
      'Créer des boucles `for` et `while` lisant fichiers et flux ligne par ligne',
      'Modulariser avec des fonctions, variables locales et codes de retour',
      'Gérer le nettoyage automatique lors des interruptions avec `trap`'
    ],
    prerequisites: ['Solid familiarity with Linux command line and text editors'],
    prerequisitesFr: ['Bonne aisance avec le terminal et les commandes standards'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Syntax, Variables & Conditions',
      titleFr: 'Évaluation intermédiaire : Syntaxe, Variables & Conditions',
      description: 'Validate parameter handling, conditional tests, and exit code propagation.',
      descriptionFr: 'Vérifier la maîtrise des tests conditionnels et des codes de sortie.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Bash Capstone: Production Backup & Alerting Engine',
      titleFr: 'Projet final Bash : Moteur de sauvegarde et alertes automatisé',
      scenario: 'Develop a resilient backup script that takes source and destination arguments, checks disk space, compresses data, catches SIGINT/SIGTERM with trap to delete partial archives, and logs status.',
      scenarioFr: 'Développer un script de sauvegarde industriel qui vérifie l\'espace disque, compresse les données, capture SIGINT/SIGTERM avec trap pour supprimer les archives partielles et journalise le statut.',
      deliverables: [
        'Script `/usr/local/bin/auto-backup.sh` utilizing `set -euo pipefail`',
        'Help menu triggered by `-h` or missing arguments',
        'Trap handler cleaning temporary files on script abort',
        'Exit codes (0 for success, non-zero for explicit errors)'
      ],
      deliverablesFr: [
        'Script `/usr/local/bin/auto-backup.sh` avec `set -euo pipefail`',
        'Menu d\'aide avec `-h` ou en cas d\'arguments manquants',
        'Fonction trap supprimant les archives corrompues en cas d\'interruption',
        'Codes de sortie conformes (0 = succès, 1..255 = erreur typée)'
      ],
      validationCriteria: [
        'All variables properly quoted (`"$var"`)',
        'Zero shellcheck warnings or syntax defects'
      ],
      validationCriteriaFr: [
        'Toutes les variables correctement protégées (`"$var"`)',
        'Aucune erreur ou avertissement shellcheck'
      ]
    },
    capstone: {
      title: 'Bash Capstone: Production Backup & Alerting Engine',
      titleFr: 'Projet final Bash : Moteur de sauvegarde et alertes automatisé',
      scenario: 'Develop a resilient backup script that takes source and destination arguments, checks disk space, compresses data, catches SIGINT/SIGTERM with trap to delete partial archives, and logs status.',
      scenarioFr: 'Développer un script de sauvegarde industriel qui vérifie l\'espace disque, compresse les données, capture SIGINT/SIGTERM avec trap pour supprimer les archives partielles et journalise le statut.',
      deliverables: [
        'Script `/usr/local/bin/auto-backup.sh` utilizing `set -euo pipefail`',
        'Help menu triggered by `-h` or missing arguments',
        'Trap handler cleaning temporary files on script abort',
        'Exit codes (0 for success, non-zero for explicit errors)'
      ],
      deliverablesFr: [
        'Script `/usr/local/bin/auto-backup.sh` avec `set -euo pipefail`',
        'Menu d\'aide avec `-h` ou en cas d\'arguments manquants',
        'Fonction trap supprimant les archives corrompues en cas d\'interruption',
        'Codes de sortie conformes (0 = succès, 1..255 = erreur typée)'
      ],
      validationCriteria: [
        'All variables properly quoted (`"$var"`)',
        'Zero shellcheck warnings or syntax defects'
      ],
      validationCriteriaFr: [
        'Toutes les variables correctement protégées (`"$var"`)',
        'Aucune erreur ou avertissement shellcheck'
      ]
    },
    badgeEarned: {
      title: 'Bash Automation Master Certified',
      titleFr: 'Certifié Maître en Automatisation Bash',
      icon: '🐚'
    }
  },

  // 4. Filesystem Linux
  {
    id: 'fundamentals-filesystem',
    category: 'fundamentals',
    emoji: '🗄️',
    title: 'Linux Filesystem Architecture',
    titleFr: 'Filesystem Linux',
    subtitle: 'FHS → partitions → montages → permissions → liens → fstab → quotas.',
    subtitleFr: 'FHS → partitions → montages → permissions → liens → fstab → quotas.',
    description: 'Deep dive into Linux storage architecture: Filesystem Hierarchy Standard, partition schemes (MBR/GPT), filesystem creation (mkfs.ext4, mkfs.xfs), mounting, persistent configuration in /etc/fstab, hard/symbolic links, and user quotas.',
    descriptionFr: 'Plongez dans l\'architecture du stockage Linux : standard FHS, partitionnement (MBR/GPT), création de systèmes de fichiers (ext4, xfs), montages, persistance dans /etc/fstab, liens physiques/symboliques et quotas disques.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 18,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-300',
    themeColor: 'teal',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-700',
    accentHex: '#0d9488',
    bgGradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
    objectives: [
      'Understand inodes, blocks, and superblock internals',
      'Create and format partitions with fdisk, gdisk, and mkfs',
      'Mount storage dynamically and persistently configure `/etc/fstab` using UUIDs',
      'Distinguish hard links (`ln`) and symbolic links (`ln -s`)',
      'Configure and enforce filesystem quotas with edquota and repquota'
    ],
    objectivesFr: [
      'Comprendre les inodes, blocs et le superblock',
      'Partitionner et formater avec fdisk, gdisk et mkfs',
      'Monter des disques et configurer `/etc/fstab` par UUID',
      'Distinguer liens physiques (`ln`) et liens symboliques (`ln -s`)',
      'Activer et administrer les quotas disques avec edquota et repquota'
    ],
    prerequisites: ['Basic CLI and command knowledge'],
    prerequisitesFr: ['Bases de la ligne de commande Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Inodes & Partitions',
      titleFr: 'Évaluation intermédiaire : Inodes & Partitions',
      description: 'Test your understanding of filesystem structures, partition types, and formatting.',
      descriptionFr: 'Vérifier la compréhension des structures de partitionnement et des inodes.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Storage Architect Challenge: Dedicated Data Volume',
      titleFr: 'Projet final : Architecture d\'un volume de données persistant',
      scenario: 'Attach a new virtual disk to a server: partition as GPT, format with XFS, locate its filesystem UUID, create mount point `/data`, configure `/etc/fstab` safely with `mount -a`, and create symlinks for the application team.',
      scenarioFr: 'Attacher un nouveau disque virtuel : partitionner en GPT, formater en XFS, récupérer son UUID, créer le point de montage `/data`, configurer `/etc/fstab` de façon résiliente avec test `mount -a`, et créer des liens symboliques pour les développeurs.',
      deliverables: [
        'Partition formatted with XFS filesystem',
        'Entry in `/etc/fstab` using `UUID=...` with `defaults,noatime`',
        'Verification that `mount -a` succeeds without errors'
      ],
      deliverablesFr: [
        'Partition formatée avec le système de fichiers XFS',
        'Ligne `/etc/fstab` utilisant `UUID=...` et options `defaults,noatime`',
        'Validation par `mount -a` sans aucune erreur de syntaxe'
      ],
      validationCriteria: [
        'UUID used instead of brittle device names (`/dev/sdb1`)',
        'Passes boot test and mounts cleanly'
      ],
      validationCriteriaFr: [
        'UUID privilégié au nom volatile `/dev/sdb1`',
        'Montage persistant vérifié après rechargement'
      ]
    },
    capstone: {
      title: 'Storage Architect Challenge: Dedicated Data Volume',
      titleFr: 'Projet final : Architecture d\'un volume de données persistant',
      scenario: 'Attach a new virtual disk to a server: partition as GPT, format with XFS, locate its filesystem UUID, create mount point `/data`, configure `/etc/fstab` safely with `mount -a`, and create symlinks for the application team.',
      scenarioFr: 'Attacher un nouveau disque virtuel : partitionner en GPT, formater en XFS, récupérer son UUID, créer le point de montage `/data`, configurer `/etc/fstab` de façon résiliente avec test `mount -a`, et créer des liens symboliques pour les développeurs.',
      deliverables: [
        'Partition formatted with XFS filesystem',
        'Entry in `/etc/fstab` using `UUID=...` with `defaults,noatime`',
        'Verification that `mount -a` succeeds without errors'
      ],
      deliverablesFr: [
        'Partition formatée avec le système de fichiers XFS',
        'Ligne `/etc/fstab` utilisant `UUID=...` et options `defaults,noatime`',
        'Validation par `mount -a` sans aucune erreur de syntaxe'
      ],
      validationCriteria: [
        'UUID used instead of brittle device names (`/dev/sdb1`)',
        'Passes boot test and mounts cleanly'
      ],
      validationCriteriaFr: [
        'UUID privilégié au nom volatile `/dev/sdb1`',
        'Montage persistant vérifié après rechargement'
      ]
    },
    badgeEarned: {
      title: 'Linux Filesystem Specialist Certified',
      titleFr: 'Spécialiste Filesystem Linux Certifié',
      icon: '🗄️'
    }
  },

  // 5. Utilisateurs et permissions
  {
    id: 'fundamentals-users-perms',
    category: 'fundamentals',
    emoji: '👥',
    title: 'Users, Groups & Permissions Mastery',
    titleFr: 'Utilisateurs et permissions',
    subtitle: 'users → groups → chmod → chown → ACL → sudo.',
    subtitleFr: 'users → groups → chmod → chown → ACL → sudo.',
    description: 'Master access control on Linux: user and group lifecycle, traditional Unix file permissions (chmod, chown, chgrp, umask), special permissions (SUID, SGID, Sticky Bit), POSIX Access Control Lists (setfacl, getfacl), and granular sudo configuration.',
    descriptionFr: 'Maîtrisez la gestion des accès sous Linux : cycle de vie des utilisateurs et groupes, droits Unix traditionnels, bits spéciaux (SUID, SGID, Sticky Bit), listes de contrôle d\'accès POSIX (getfacl, setfacl) et délégation fine avec sudo.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 16,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-300',
    themeColor: 'indigo',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-700',
    accentHex: '#4f46e5',
    bgGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    objectives: [
      'Manage user accounts, passwords, and group memberships',
      'Calculate octal modes and configure umask defaults',
      'Implement SUID, SGID on shared folders, and Sticky Bit on `/tmp`',
      'Configure granular multi-user permissions using POSIX ACLs (`setfacl`)',
      'Design secure sudoers rules with commands, aliases, and no-password constraints'
    ],
    objectivesFr: [
      'Créer et administrer les comptes utilisateurs, mots de passe et groupes',
      'Calculer les modes octaux et définir les valeurs umask par défaut',
      'Déployer SUID, SGID sur les dossiers partagés et Sticky Bit sur `/tmp`',
      'Appliquer des permissions multi-utilisateurs fines via les ACLs (`setfacl`)',
      'Rédiger des règles sudoers sécurisées avec alias de commandes et restrictions'
    ],
    prerequisites: ['Linux for Beginners or equivalent foundational understanding'],
    prerequisitesFr: ['Bases du système Linux et du terminal'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Unix Permissions & Umask',
      titleFr: 'Évaluation intermédiaire : Permissions Unix & Umask',
      description: 'Test calculation of umask, octal permissions, and special permission bits.',
      descriptionFr: 'Tester le calcul d\'umask, les modes octaux et les bits spéciaux.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Permissions Capstone: Collaborative Multi-Department Storage',
      titleFr: 'Projet final : Espace collaboratif multi-services sécurisé',
      scenario: 'Build a shared directory `/srv/collaboration`: enable SGID so all created files inherit the department group, set default ACLs so auditing bots have read-only access, and grant sudo rights for a designated team lead to restart the sync daemon without root password.',
      scenarioFr: 'Créer l\'espace partagé `/srv/collaboration` : activer le bit SGID pour hériter du groupe du dossier, poser des ACLs par défaut pour les robots d\'audit, et déléguer par sudo le redémarrage du service au chef d\'équipe sans mot de passe.',
      deliverables: [
        'SGID active on `/srv/collaboration` (`chmod 2770`)',
        'Default ACL configured with `setfacl -d -m u:auditor:rx`',
        'Drop-in file in `/etc/sudoers.d/teamlead` verified with `visudo -c`'
      ],
      deliverablesFr: [
        'Bit SGID actif sur `/srv/collaboration` (`chmod 2770`)',
        'ACL par défaut configurée avec `setfacl -d -m u:auditor:rx`',
        'Fichier `/etc/sudoers.d/teamlead` vérifié via `visudo -c`'
      ],
      validationCriteria: [
        'New files automatically inherit the parent group',
        'Auditor user can read newly created files without manual chmod',
        'Sudoers entry restricted strictly to the required service restart command'
      ],
      validationCriteriaFr: [
        'Les nouveaux fichiers héritent automatiquement du groupe parent',
        'L\'utilisateur d\'audit accède aux nouveaux fichiers sans chmod manuel',
        'Règle sudoers strictement limitée à la commande de service autorisée'
      ]
    },
    capstone: {
      title: 'Permissions Capstone: Collaborative Multi-Department Storage',
      titleFr: 'Projet final : Espace collaboratif multi-services sécurisé',
      scenario: 'Build a shared directory `/srv/collaboration`: enable SGID so all created files inherit the department group, set default ACLs so auditing bots have read-only access, and grant sudo rights for a designated team lead to restart the sync daemon without root password.',
      scenarioFr: 'Créer l\'espace partagé `/srv/collaboration` : activer le bit SGID pour hériter du groupe du dossier, poser des ACLs par défaut pour les robots d\'audit, et déléguer par sudo le redémarrage du service au chef d\'équipe sans mot de passe.',
      deliverables: [
        'SGID active on `/srv/collaboration` (`chmod 2770`)',
        'Default ACL configured with `setfacl -d -m u:auditor:rx`',
        'Drop-in file in `/etc/sudoers.d/teamlead` verified with `visudo -c`'
      ],
      deliverablesFr: [
        'Bit SGID actif sur `/srv/collaboration` (`chmod 2770`)',
        'ACL par défaut configurée avec `setfacl -d -m u:auditor:rx`',
        'Fichier `/etc/sudoers.d/teamlead` vérifié via `visudo -c`'
      ],
      validationCriteria: [
        'New files automatically inherit the parent group',
        'Auditor user can read newly created files without manual chmod',
        'Sudoers entry restricted strictly to the required service restart command'
      ],
      validationCriteriaFr: [
        'Les nouveaux fichiers héritent automatiquement du groupe parent',
        'L\'utilisateur d\'audit accède aux nouveaux fichiers sans chmod manuel',
        'Règle sudoers strictement limitée à la commande de service autorisée'
      ]
    },
    badgeEarned: {
      title: 'Linux Access Control & Sudo Authority',
      titleFr: 'Expert Contrôle d\'Accès et Sudo Linux',
      icon: '👥'
    }
  }
];
