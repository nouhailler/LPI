import { LearningPath, PathModule } from './types';

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
   PARCOURS PRATIQUES (4 PARCOURS)
   ========================================================================== */

const troubleshootingModules: PathModule[] = [
  createModule({
    id: 'tb-1-slow',
    number: 1,
    title: 'Incident 1: Slow Machine & Resource Exhaustion',
    titleFr: 'Incident 1 : Machine Lente & Saturation de Ressources',
    conceptTag: 'CPU & Load Average',
    conceptTagFr: 'CPU & Charge Système',
    shortDesc: 'Triage high load average, distinguish CPU bottleneck vs I/O wait (wa), and isolate runaway processes.',
    shortDescFr: 'Diagnostiquer un load average élevé, distinguer goulot CPU vs attente I/O (wa) et isoler les coupables.',
    linkedLpiObjective: '103.5',
    explainTopic: 'process',
    glossaryTerms: ['uptime', 'top', 'htop', 'vmstat', 'iostat'],
    theory: {
      summary: 'Load average measures the number of processes in Runnable (R) and Uninterruptible sleep (D, typically waiting on disk I/O) states. High load with low CPU % indicates disk I/O bottlenecks.',
      summaryFr: 'Le load average compte les processus en état Runnable (R) ou en attente d\'I/O disque bloquante (D). Une forte charge avec un CPU bas trahit un goulot d\'étranglement sur les disques.',
      whyItMatters: 'Sysadmins are woken up at 2 AM for "the server is slow". Fast methodic triage saves customer SLA and prevents panic reboots.',
      whyItMattersFr: 'L\'administrateur est alerté en astreinte car "le serveur rame". Un triage méthodique rapide évite les arrêts brutaux inutiles.',
      commands: ['uptime', 'top -b -n 1 | head -n 15', 'vmstat 1 5', 'iostat -xz 1 3'],
      codeSnippet: {
        label: 'Fast Triage Script for System Slowness',
        labelFr: 'Script de diagnostic express en 5 secondes',
        code: 'echo "=== UPTIME & LOAD ==="\nuptime\necho "=== CPU & IO WAIT ==="\nvmstat 1 3\necho "=== TOP 5 CPU CONSUMERS ==="\nps aux --sort=-%cpu | head -n 6',
        explanation: 'Rapid triage output revealing load average, wait I/O ratio, and the exact PIDs consuming cycles.',
        explanationFr: 'Affiche en un coup d\'œil le load average, le pourcentage d\'attente I/O et les PIDs coupables.',
      },
      prodTrap: 'Rebooting a machine with high disk I/O wait without checking sync status can severely corrupt active databases.',
      prodTrapFr: 'Rebooter sauvagement un serveur en forte attente I/O sans vérifier l\'activité disque peut corrompre les bases de données.',
    },
    flashcards: [
      {
        id: 'fc-tb-1',
        question: 'In top or vmstat output, what does a high `wa` (Wait I/O) percentage indicate?',
        questionFr: 'Dans la sortie de top ou vmstat, qu\'indique un pourcentage `wa` (Wait I/O) élevé ?',
        answer: 'The CPU is idle waiting for slow or overloaded disk/storage read/write operations to complete.',
        answerFr: 'Le CPU est en attente passive de la fin d\'opérations de lecture/écriture lentes sur les disques.',
        examTip: 'High `wa` means the bottleneck is storage, NOT compute CPU.',
        examTipFr: 'Un `wa` fort signifie que le goulot vient du stockage, pas du processeur.',
      }
    ],
    question: {
      id: 'q-tb-1',
      question: 'A 4-core server reports load average: `16.00, 15.50, 14.20`. What does this indicate?',
      questionFr: 'Un serveur à 4 cœurs affiche un load average de `16.00, 15.50, 14.20`. Quelle est la situation ?',
      options: [
        'The server is overloaded: on average 12 processes are constantly queued waiting for CPU or disk.',
        'The server is running at 16% capacity.',
        'The server has run out of memory.',
        'The CPU clock speed is 16 GHz.'
      ],
      optionsFr: [
        'Le serveur est saturé : en moyenne 12 processus font la queue en attente de CPU ou d\'I/O.',
        'Le serveur tourne à 16% de sa capacité.',
        'La machine manque de mémoire vive.',
        'La fréquence du processeur est de 16 GHz.'
      ],
      correctIndex: 0,
      explanation: 'On a 4-core machine, load of 4.0 represents 100% capacity. Load 16.0 means 4x the available compute bandwidth.',
      explanationFr: 'Sur 4 cœurs, un load de 4,0 correspond à 100%. 16,0 signifie 4 fois plus de charge que la capacité disponible.',
      commandSnippet: 'uptime',
    },
    lab: {
      id: 'lab-tb-1',
      title: 'Isolating a CPU Spin Loop Process',
      titleFr: 'Isolation d\'un processus en boucle infinie',
      goal: 'Identify the runaway PID and lower its execution priority.',
      goalFr: 'Identifier le PID en boucle et rétrograder sa priorité nice.',
      context: 'An infinite loop script is consuming 100% of core 0.',
      contextFr: 'Un script en boucle infinie sature 100% d\'un cœur processeur.',
      steps: [
        {
          stepNumber: 1,
          title: 'Find high-CPU PID',
          titleFr: 'Trouver le PID saturant le CPU',
          instruction: 'Run ps sorted by CPU descending.',
          instructionFr: 'Lancez ps trié par utilisation CPU.',
          hint: 'ps aux --sort=-%cpu | head -n 2',
          hintFr: 'ps aux --sort=-%cpu | head -n 2',
          expectedCommands: ['ps aux --sort=-%cpu | head -n 2', 'ps aux --sort=-pcpu | head -n 2'],
          simulatedOutput: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nappuser   3912 99.8  0.1  24100  4200 ?        R    11:00  14:32 python3 leak.py',
          explanation: 'PID 3912 is pinned at 99.8% CPU in state R.',
          explanationFr: 'Le PID 3912 monopolise 99,8% du CPU à lui seul en état R.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-tb-1',
      title: 'Unkillable Process in D State',
      titleFr: 'Processus impossible à tuer (état D)',
      symptom: '`kill -9 <PID>` fails to kill a process; it remains visible in `ps aux` in state `D`.',
      symptomFr: '`kill -9 <PID>` n\'a aucun effet; le processus reste affiché dans `ps aux` avec le statut `D`.',
      investigationCommands: ['ps aux | grep " D "', 'cat /proc/<PID>/stack'],
      diagnosticOutput: '[<0>] sync_inodes_sb+0x... [<0>] sync_filesystem+0x... [<0>] nfs_wait_bit_uninterruptible',
      rootCause: 'State D is Uninterruptible Sleep waiting on kernel I/O (often a hanging NFS mount or broken physical drive). POSIX signals are ignored until the I/O returns.',
      rootCauseFr: 'L\'état D est un sommeil non interruptible en attente de réponse matérielle ou réseau (ex: montage NFS gelé). Aucun signal ne peut l\'interrompre.',
      solutionCommand: 'unmount the hanging NFS share with `umount -f -l <mountpoint>`, or reboot if storage controller died',
      solutionExplanation: 'Restore network to the NFS server or perform lazy unmount (`umount -l`) to allow the kernel syscall to complete.',
      solutionExplanationFr: 'Rétablissez l\'accès au serveur NFS ou effectuez un démontage paresseux (`umount -l`).',
    }
  }),
  createModule({
    id: 'tb-2-service-fail',
    number: 2,
    title: 'Incident 2: Service That Won\'t Start',
    titleFr: 'Incident 2 : Service qui refuse de démarrer',
    conceptTag: 'systemd Debugging',
    conceptTagFr: 'Diagnostic systemd',
    shortDesc: 'Diagnose status exit codes, port conflicts (Address already in use), and permission blockers.',
    shortDescFr: 'Diagnostiquer les codes de sortie status, conflits de ports et blocages de droits.',
    linkedLpiObjective: '101.3',
    explainTopic: 'systemd',
    glossaryTerms: ['systemctl', 'journalctl', 'ss', 'nginx -t'],
    theory: {
      summary: 'When `systemctl start` fails, the three most frequent causes are: 1) Syntax error in daemon configuration file, 2) Target port already bound by another process, 3) Permission denied on log/PID paths.',
      summaryFr: 'Quand `systemctl start` échoue, les 3 causes majeures sont : 1) Erreur de syntaxe dans le fichier de configuration, 2) Port réseau déjà squatté, 3) Droits refusés sur les répertoires de logs.',
      whyItMatters: 'Production outages often follow configuration changes or automated package upgrades. Isolating the error line quickly reduces downtime.',
      whyItMattersFr: 'Les pannes de production surviennent souvent après une modification de configuration. Trouver la ligne en erreur réduit le temps d\'indisponibilité.',
      commands: ['systemctl status <service>', 'journalctl -xeu <service>', 'ss -tulpn | grep :<port>', 'nginx -t'],
      codeSnippet: {
        label: 'Systematic Service Diagnostic Protocol',
        labelFr: 'Protocole de diagnostic d\'un service en échec',
        code: '# 1. Check exit code & status\nsystemctl status nginx.service\n# 2. Check daemon config syntax\nnginx -t\n# 3. Check if port 80/443 is already held\nss -tulpn | grep -E ":(80|443) "\n# 4. View detailed recent errors\njournalctl -u nginx -n 25 --no-pager',
        explanation: 'Chronological triage eliminating syntax errors, port collisions, and execution permissions.',
        explanationFr: 'Protocole ordonné éliminant les erreurs de syntaxe, les conflits de ports et les droits d\'accès.',
      },
      prodTrap: 'Do not randomly restart the service 20 times. systemd rate-limits restart loops (burst limit) and will lock the service in failed state.',
      prodTrapFr: 'Ne tentez pas de relancer le service 20 fois de suite. La protection anti-emballement de systemd va bloquer l\'unité.',
    },
    flashcards: [
      {
        id: 'fc-tb-2',
        question: 'Which flag in `journalctl` shows log entries specifically for a designated systemd unit with full explanations and recent lines?',
        questionFr: 'Quelle commande `journalctl` affiche les logs d\'une unité spécifique avec explications détaillées ?',
        answer: 'journalctl -xeu <service-name>',
        answerFr: 'journalctl -xeu <nom-du-service>',
        examTip: '-x (catalog explanations), -e (jump to end), -u (unit name).',
        examTipFr: '-x (explications étendues), -e (fin du log), -u (filtrage par unité).',
      }
    ],
    question: {
      id: 'q-tb-2',
      question: 'A web server fails to start with: `bind() to 0.0.0.0:80 failed (98: Address already in use)`. What is the immediate diagnostic step?',
      questionFr: 'Un serveur web ne démarre pas avec l\'erreur `Address already in use` sur le port 80. Quelle est l\'action immédiate ?',
      options: [
        'Run `ss -tulpn | grep :80` to find which process PID already holds port 80.',
        'Reinstall the operating system.',
        'Change the IP address of the machine.',
        'Delete `/var/log/nginx`.'
      ],
      optionsFr: [
        'Exécuter `ss -tulpn | grep :80` pour trouver le PID du processus occupant le port 80.',
        'Réinstaller le système d\'exploitation.',
        'Changer l\'adresse IP de la machine.',
        'Supprimer le dossier `/var/log/nginx`.'
      ],
      correctIndex: 0,
      explanation: 'Address already in use means another daemon (e.g. Apache, old Nginx, or Docker container) is already bound to port 80.',
      explanationFr: 'Cette erreur indique qu\'un autre processus écoute déjà sur le port 80. `ss -tulpn` donne son nom et son PID.',
      commandSnippet: 'sudo ss -tulpn | grep :80',
    },
    lab: {
      id: 'lab-tb-2',
      title: 'Resolving Port 80 Conflict Between Apache and Nginx',
      titleFr: 'Résolution de conflit sur le port 80 entre Apache et Nginx',
      goal: 'Identify the conflicting daemon and stop it so Nginx can start.',
      goalFr: 'Identifier le daemon en conflit et l\'arrêter pour permettre le démarrage de Nginx.',
      context: 'Nginx fails to start because an old Apache instance is running.',
      contextFr: 'Nginx ne démarre pas car un vieux Apache tourne en arrière-plan.',
      steps: [
        {
          stepNumber: 1,
          title: 'Locate port 80 owner with ss',
          titleFr: 'Localiser le processus sur le port 80 avec ss',
          instruction: 'Run ss -tulpn filtering for port 80.',
          instructionFr: 'Lancez ss -tulpn filtré sur le port 80.',
          hint: 'ss -tulpn | grep :80',
          hintFr: 'ss -tulpn | grep :80',
          expectedCommands: ['ss -tulpn | grep :80', 'sudo ss -tulpn | grep :80'],
          simulatedOutput: 'tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("apache2",pid=1204,fd=4))',
          explanation: 'Apache2 with PID 1204 is listening on port 80.',
          explanationFr: 'Le processus apache2 (PID 1204) occupe le port 80.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-tb-2',
      title: 'Unit Configuration Cache Out of Sync',
      titleFr: 'Configuration de l\'unité désynchronisée du cache',
      symptom: '`systemctl status myapp` displays a warning: "Warning: The unit file, source configuration file or drop-ins of myapp.service changed on disk. Run \'systemctl daemon-reload\' to reload units."',
      symptomFr: 'systemctl affiche un avertissement indiquant que le fichier unit a changé sur le disque.',
      investigationCommands: ['systemctl daemon-reload'],
      diagnosticOutput: 'Reloading systemd manager configuration...',
      rootCause: 'The `.service` file was edited on disk, but systemd is still running the previously loaded definition from RAM.',
      rootCauseFr: 'Le fichier `.service` a été modifié mais systemd utilise toujours l\'ancienne version stockée en mémoire.',
      solutionCommand: 'systemctl daemon-reload && systemctl restart myapp.service',
      solutionExplanation: 'Run `daemon-reload` to compile and cache the new unit directives, then restart.',
      solutionExplanationFr: 'Exécutez `daemon-reload` pour relire les directives, puis relancez le service.',
    }
  }),
  createModule({
    id: 'tb-3-disk-full',
    number: 3,
    title: 'Incident 3: Disk Full (No Space Left on Device)',
    titleFr: 'Incident 3 : Disque Plein (No Space Left on Device)',
    conceptTag: 'Disk & Inodes',
    conceptTagFr: 'Disque & Inodes',
    shortDesc: 'Handle 100% capacity partitions, hidden unlinked open files, and inode exhaustion (df -i).',
    shortDescFr: 'Traiter les partitions à 100%, les fichiers supprimés mais ouverts et la saturation d\'inodes (df -i).',
    linkedLpiObjective: '104.1',
    explainTopic: 'filesystems',
    glossaryTerms: ['df', 'du', 'lsof', 'ncdu', 'find'],
    theory: {
      summary: '"No space left on device" can happen for two distinct reasons: 1) 100% of data blocks are used (`df -h`), OR 2) 100% of inodes are used (`df -i`), preventing creation of any new file even if gigabytes of free disk space remain.',
      summaryFr: '"No space left on device" arrive dans 2 cas distincts : 1) Saturation des blocs de données (`df -h`), OU 2) Saturation des inodes (`df -i`), interdisant tout nouveau fichier même avec des gigaoctets libres.',
      whyItMatters: 'Databases shut down instantly when storage hits 100%. Knowing how to find large directories and free inodes in under 60 seconds is critical.',
      whyItMattersFr: 'Une base de données se crashe ou se verrouille en lecture seule quand le disque est plein. Savoir libérer de l\'espace en 60 secondes est vital.',
      commands: ['df -h', 'df -i', 'du -ahx /var/log | sort -rh | head -n 20', 'lsof +L1'],
      codeSnippet: {
        label: 'Fast Disk Space & Inode Analysis',
        labelFr: 'Analyse rapide de l\'espace disque et des inodes',
        code: '# 1. Check storage blocks\ndf -hT\n# 2. Check inode exhaustion\ndf -iT\n# 3. Check for deleted unlinked files still open\nlsof +L1',
        explanation: 'Validates both block usage and inode table exhaustion, while detecting unreleased open file descriptors.',
        explanationFr: 'Vérifie à la fois les blocs de données, la table d\'inodes et les descripteurs ouverts sur fichiers supprimés.',
      },
      prodTrap: 'Running `rm -rf *` inside a directory containing 1 million tiny files will fail with "Argument list too long". Use `find . -type f -delete`.',
      prodTrapFr: 'Lancer `rm -rf *` dans un dossier de 1 million de fichiers échoue avec "Argument list too long". Utilisez `find . -type f -delete`.',
    },
    flashcards: [
      {
        id: 'fc-tb-3',
        question: 'How can a Linux partition report "No space left on device" when `df -h` shows 50GB of free space?',
        questionFr: 'Comment une partition peut-elle renvoyer "No space left on device" alors que `df -h` affiche 50 Go d\'espace libre ?',
        answer: 'The filesystem has exhausted its available Inodes (check with `df -i`).',
        answerFr: 'Le système de fichiers a épuisé sa table d\'inodes (vérifier avec `df -i`).',
        examTip: 'Usually caused by millions of tiny session files or unpurged email queues.',
        examTipFr: 'Souvent causé par des millions de petits fichiers de session ou de mails non purgés.',
      }
    ],
    question: {
      id: 'q-tb-3',
      question: 'Which `du` flags summarize directory sizes with human-readable formatting, sorted by largest first, staying on one filesystem?',
      questionFr: 'Quelles options de `du` permettent de lister les dossiers les plus volumineux sans traverser les autres disques ?',
      options: [
        'du -hx --max-depth=1 /var | sort -rh | head',
        'du -all /var',
        'du -f /var',
        'du --recursive-only /var'
      ],
      optionsFr: [
        'du -hx --max-depth=1 /var | sort -rh | head',
        'du -all /var',
        'du -f /var',
        'du --recursive-only /var'
      ],
      correctIndex: 0,
      explanation: '`-h` gives human units (M, G), `-x` (one-file-system) prevents traversing into /proc, /sys or mounted network shares, and `sort -rh` puts the largest consumers at the top.',
      explanationFr: '`-h` donne des unités lisibles, `-x` évite d\'explorer les autres points de montage, et `sort -rh` classe les plus gros en tête.',
      commandSnippet: 'du -hx --max-depth=1 /var | sort -rh | head',
    },
    lab: {
      id: 'lab-tb-3',
      title: 'Diagnosing Inode Exhaustion in /var/spool',
      titleFr: 'Diagnostic d\'épuisement d\'inodes dans /var/spool',
      goal: 'Identify the partition suffering from 100% inode saturation.',
      goalFr: 'Identifier la partition victime d\'une saturation à 100% des inodes.',
      context: 'Users cannot create any files despite 80GB free disk space.',
      contextFr: 'Impossible de créer le moindre fichier malgré 80 Go d\'espace libre.',
      steps: [
        {
          stepNumber: 1,
          title: 'Inspect inodes with df -i',
          titleFr: 'Inspecter les inodes avec df -i',
          instruction: 'Run df -i on filesystems.',
          instructionFr: 'Lancez df -i sur les systèmes de fichiers.',
          hint: 'df -i',
          hintFr: 'df -i',
          expectedCommands: ['df -i', 'df -ih', 'df -iT'],
          simulatedOutput: 'Filesystem       Inodes   IUsed   IFree IUse% Mounted on\n/dev/sda1       1310720 1310720       0  100% /\ntmpfs            250100       5  250095    1% /dev/shm',
          explanation: 'Root filesystem `/dev/sda1` has 0 free inodes (100% IUse).',
          explanationFr: 'Le système racine a 0 inode libre (100% utilisé).',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-tb-3',
      title: 'Deleted Log File Still Holding Storage',
      titleFr: 'Fichier de log supprimé conservant l\'espace occupé',
      symptom: '`rm /var/log/app.log` was executed, but `df -h` still displays 100% usage.',
      symptomFr: '`rm /var/log/app.log` a été exécuté mais `df -h` affiche toujours 100% d\'occupation.',
      investigationCommands: ['lsof +L1'],
      diagnosticOutput: 'app-service 1942 root 4w REG 8,1 35433480192 0 /var/log/app.log (deleted)',
      rootCause: 'Process 1942 still holds an open file handle to the deleted inode.',
      rootCauseFr: 'Le processus 1942 maintient le descripteur de fichier ouvert sur l\'inode supprimé.',
      solutionCommand: ': > /proc/1942/fd/4  # or restart service',
      solutionExplanation: 'Truncate the file descriptor directly or reload the daemon to release the allocated disk blocks.',
      solutionExplanationFr: 'Tronquez le descripteur ou redémarrez le service pour libérer les blocs alloués.',
    }
  })
];

export const practicalLearningPaths: LearningPath[] = [
  // 1. Linux Troubleshooting ⭐
  {
    id: 'practical-troubleshooting',
    category: 'practical',
    emoji: '🛠️',
    title: 'Linux Troubleshooting Masterclass',
    titleFr: 'Linux Troubleshooting ⭐',
    subtitle: 'Machine lente ↓ Service qui ne démarre plus ↓ Disque plein ↓ Permission refusée ↓ DNS cassé ↓ SSH inaccessible ↓ Processus bloqué ↓ Filesystem non monté.',
    subtitleFr: 'Machine lente ↓ Service qui ne démarre plus ↓ Disque plein ↓ Permission refusée ↓ DNS cassé ↓ SSH inaccessible ↓ Processus bloqué ↓ Filesystem non monté.',
    description: 'The premier hands-on Linux incident resolution track. 8 realistic production disaster scenarios: sluggish systems, failed systemd daemons, 100% full disks & inodes, permission denials, broken DNS, locked SSH access, uninterruptible D-state processes, and unbootable fstab filesystems.',
    descriptionFr: 'Le parcours de référence en dépannage et résolution d\'incidents en production. 8 scénarios d\'incidents réels : saturation CPU/I/O, daemons en échec, disques et inodes pleins, blocages de droits, pannes DNS, SSH verrouillé, processus en état D et corruption fstab.',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedHours: 24,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
    themeColor: 'amber',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    accentHex: '#d97706',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    objectives: [
      'Isolate CPU saturation vs storage wait I/O bottlenecks in under 3 minutes',
      'Diagnose and restore crashing systemd service units with exit code analysis',
      'Resolve "No space left on device" errors caused by unreleased file descriptors or exhausted inodes',
      'Diagnose and fix network DNS lookup failures and MTU packet drops',
      'Regain access to locked SSH servers with mismatched keys or permissions',
      'Fix emergency boot drops caused by broken `/etc/fstab` entries'
    ],
    objectivesFr: [
      'Isoler saturation CPU vs attente I/O disque en moins de 3 minutes',
      'Diagnostiquer et réparer un service systemd en échec avec l\'analyse des codes de sortie',
      'Résoudre les erreurs "No space left on device" dues aux inodes ou descripteurs ouverts',
      'Corriger les pannes de résolution DNS et les blocages réseau',
      'Rétablir l\'accès à un serveur SSH verrouillé par des permissions erronées',
      'Dépanner les échecs de boot causés par une erreur de syntaxe dans `/etc/fstab`'
    ],
    prerequisites: ['Linux Administration and Networking foundations'],
    prerequisitesFr: ['Bases solides d\'administration et réseau Linux'],
    modules: troubleshootingModules,
    steps: troubleshootingModules,
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Triage Protocols & Resource Locks',
      titleFr: 'Évaluation intermédiaire : Protocoles de Triage & Verrous',
      description: 'Validate diagnostic methods across CPU, storage, and service states.',
      descriptionFr: 'Valider les méthodes de diagnostic sur CPU, stockage et services.',
      passingScorePct: 80,
      questions: [
        troubleshootingModules[0].question,
        troubleshootingModules[1].question,
        troubleshootingModules[2].question,
      ]
    },
    finalEvaluation: {
      title: 'Troubleshooting Capstone: Multi-System Production Outage Drill',
      titleFr: 'Projet final : Résolution d\'une panne de production multi-systèmes',
      scenario: 'A major incident is declared on a production cluster: API responses timing out, database refusing connections, and SSH access rejected for developers. Methodically triage and resolve each layer: clean up unlinked log files, fix postgresql.conf syntax error, restore DNS resolver, and correct permissions on `~/.ssh/authorized_keys`.',
      scenarioFr: 'Un incident critique est déclaré : temps de réponse infinis, base de données refusant les connexions et accès SSH rejeté. Résoudre méthodiquement chaque niveau : libérer l\'espace disque, corriger la syntaxe de configuration du service, restaurer le DNS et réinitialiser les droits SSH.',
      deliverables: [
        'Root cause analysis document for each of the 4 cascade failures',
        'Execution of `lsof +L1` and safe file descriptor truncation',
        'Restoration of systemd service without burst-limit lock',
        'Verification of SSH login and successful end-to-end API health check'
      ],
      deliverablesFr: [
        'Rapport d\'analyse causale pour les 4 défaillances en cascade',
        'Libération des blocs orphelins via `lsof +L1`',
        'Redémarrage propre du service systemd sans déclenchement de la limite',
        'Validation complète de l\'accès SSH et du bon fonctionnement de l\'API'
      ],
      validationCriteria: [
        'All services green in `systemctl is-active`',
        'Zero data loss and zero unauthorized reboots performed'
      ],
      validationCriteriaFr: [
        'Tous les services au vert dans `systemctl is-active`',
        'Aucune perte de données et aucun redémarrage sauvage effectué'
      ]
    },
    capstone: {
      title: 'Troubleshooting Capstone: Multi-System Production Outage Drill',
      titleFr: 'Projet final : Résolution d\'une panne de production multi-systèmes',
      scenario: 'A major incident is declared on a production cluster: API responses timing out, database refusing connections, and SSH access rejected for developers. Methodically triage and resolve each layer: clean up unlinked log files, fix postgresql.conf syntax error, restore DNS resolver, and correct permissions on `~/.ssh/authorized_keys`.',
      scenarioFr: 'Un incident critique est déclaré : temps de réponse infinis, base de données refusant les connexions et accès SSH rejeté. Résoudre méthodiquement chaque niveau : libérer l\'espace disque, corriger la syntaxe de configuration du service, restaurer le DNS et réinitialiser les droits SSH.',
      deliverables: [
        'Root cause analysis document for each of the 4 cascade failures',
        'Execution of `lsof +L1` and safe file descriptor truncation',
        'Restoration of systemd service without burst-limit lock',
        'Verification of SSH login and successful end-to-end API health check'
      ],
      deliverablesFr: [
        'Rapport d\'analyse causale pour les 4 défaillances en cascade',
        'Libération des blocs orphelins via `lsof +L1`',
        'Redémarrage propre du service systemd sans déclenchement de la limite',
        'Validation complète de l\'accès SSH et du bon fonctionnement de l\'API'
      ],
      validationCriteria: [
        'All services green in `systemctl is-active`',
        'Zero data loss and zero unauthorized reboots performed'
      ],
      validationCriteriaFr: [
        'Tous les services au vert dans `systemctl is-active`',
        'Aucune perte de données et aucun redémarrage sauvage effectué'
      ]
    },
    badgeEarned: {
      title: 'Linux Production Troubleshooting Grandmaster',
      titleFr: 'Grand Maître du Dépannage Linux',
      icon: '🛠️'
    }
  },

  // 2. Linux pour DevOps
  {
    id: 'practical-devops',
    category: 'practical',
    emoji: '🚀',
    title: 'Linux for DevOps Engineers',
    titleFr: 'Linux pour DevOps',
    subtitle: 'Linux OS ↓ Bash ↓ Git ↓ SSH ↓ Processus ↓ Services ↓ Logs ↓ Docker/Podman ↓ CI/CD.',
    subtitleFr: 'Linux OS ↓ Bash ↓ Git ↓ SSH ↓ Processus ↓ Services ↓ Logs ↓ Docker/Podman ↓ CI/CD.',
    description: 'The bridge between system administration and cloud delivery: Linux system primitives, Bash automation, Git workflows, SSH deploy keys, process management, log pipelines, rootless containers with Docker and Podman, and CI/CD runner deployment.',
    descriptionFr: 'La passerelle entre l\'administration système et le Cloud : primitives Linux, automatisation Bash, flux Git, clés de déploiement SSH, conteneurs sans privilèges root (Docker/Podman) et déploiement de runners CI/CD.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 22,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-300',
    themeColor: 'blue',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    accentHex: '#2563eb',
    bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    objectives: [
      'Automate system deployment with idempotent Bash scripts',
      'Manage SSH deployment keys and agent forwarding safely',
      'Deploy and run rootless OCI containers using Podman and Docker',
      'Configure self-hosted CI/CD runners on dedicated Linux nodes'
    ],
    objectivesFr: [
      'Automatiser le déploiement système par scripts Bash idempotents',
      'Administrer les clés SSH de déploiement et le forwarding d\'agent',
      'Déployer des conteneurs OCI rootless avec Podman et Docker',
      'Configurer un runner CI/CD auto-hébergé sur un serveur Linux dédié'
    ],
    prerequisites: ['Linux Foundations & Basic Scripting'],
    prerequisitesFr: ['Bases de Linux et de la programmation shell'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Git, SSH & Bash Automation',
      titleFr: 'Évaluation intermédiaire : Git, SSH & Automatisation Bash',
      description: 'Validate key deployment workflows and automation scripts.',
      descriptionFr: 'Valider les flux Git, les clés de déploiement et les scripts.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'DevOps Capstone: Automated Containerized Pipeline & Runner',
      titleFr: 'Projet final DevOps : Pipeline de conteneurs & Runner automatisé',
      scenario: 'Set up an automated delivery node: configure a non-root runner user with Podman rootless socket, write a deployment script with automatic rollback on test failure, and orchestrate it via a systemd user unit.',
      scenarioFr: 'Mettre en place un nœud de livraison continue : configurer un utilisateur runner avec socket Podman sans privilège root, rédiger un script de déploiement avec rollback automatique et piloter le tout via systemd.',
      deliverables: [
        'Rootless container running with systemd user unit',
        'Automated healthcheck and rollback script in `/opt/deploy/run.sh`'
      ],
      deliverablesFr: [
        'Conteneur rootless géré par une unité systemd utilisateur',
        'Script de test de santé et de rollback automatique dans `/opt/deploy/run.sh`'
      ],
      validationCriteria: [
        'Zero root privileges required for container runtime',
        'Automatic rollback triggers predictably on faulty container image'
      ],
      validationCriteriaFr: [
        'Aucun privilège root requis pour exécuter les conteneurs',
        'Le rollback automatique s\'enclenche en cas d\'image défaillante'
      ]
    },
    capstone: {
      title: 'DevOps Capstone: Automated Containerized Pipeline & Runner',
      titleFr: 'Projet final DevOps : Pipeline de conteneurs & Runner automatisé',
      scenario: 'Set up an automated delivery node: configure a non-root runner user with Podman rootless socket, write a deployment script with automatic rollback on test failure, and orchestrate it via a systemd user unit.',
      scenarioFr: 'Mettre en place un nœud de livraison continue : configurer un utilisateur runner avec socket Podman sans privilège root, rédiger un script de déploiement avec rollback automatique et piloter le tout via systemd.',
      deliverables: [
        'Rootless container running with systemd user unit',
        'Automated healthcheck and rollback script in `/opt/deploy/run.sh`'
      ],
      deliverablesFr: [
        'Conteneur rootless géré par une unité systemd utilisateur',
        'Script de test de santé et de rollback automatique dans `/opt/deploy/run.sh`'
      ],
      validationCriteria: [
        'Zero root privileges required for container runtime',
        'Automatic rollback triggers predictably on faulty container image'
      ],
      validationCriteriaFr: [
        'Aucun privilège root requis pour exécuter les conteneurs',
        'Le rollback automatique s\'enclenche en cas d\'image défaillante'
      ]
    },
    badgeEarned: {
      title: 'Certified Linux DevOps Practitioner',
      titleFr: 'Praticien Linux DevOps Certifié',
      icon: '🚀'
    }
  },

  // 3. Automatisation Linux
  {
    id: 'practical-automation',
    category: 'practical',
    emoji: '🤖',
    title: 'Linux Automation & Scheduled Tasks',
    titleFr: 'Automatisation Linux',
    subtitle: 'Bash → Scripts → Cron → systemd Timers → Logs & alertes → Automatisation.',
    subtitleFr: 'Bash → Scripts → Cron → systemd Timers → Logs & alertes → Automatisation.',
    description: 'Master server automation: robust idempotent Bash scripts, cron scheduling syntax (/etc/crontab, cron.d), modern systemd timer units with calendar specifications, email/webhook alert notifications, and failure monitoring.',
    descriptionFr: 'Maîtrisez l\'automatisation des tâches récurrentes : scripts Bash idempotents, planification cron (/etc/crontab, cron.d), timers systemd modernes avec syntaxe OnCalendar, alertes webhooks et surveillance des échecs.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 16,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-300',
    themeColor: 'teal',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-700',
    accentHex: '#0d9488',
    bgGradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
    objectives: [
      'Write idempotent administration scripts using test conditionals',
      'Configure legacy cron jobs and handle environment path pitfalls',
      'Deploy calendar-based systemd timers (`OnCalendar=*-*-* 03:00:00`)',
      'Implement Discord/Slack/Email webhook notifications on script failure'
    ],
    objectivesFr: [
      'Écrire des scripts d\'administration idempotents',
      'Planifier des tâches cron en évitant les pièges de variables de $PATH',
      'Déployer des timers systemd avec spécification calendaire (`OnCalendar`)',
      'Intégrer des notifications par webhook (Slack/Discord/Email) en cas d\'échec'
    ],
    prerequisites: ['Linux command line and Bash basics'],
    prerequisitesFr: ['Bases de la ligne de commande et de Bash'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Cron vs systemd Timers',
      titleFr: 'Évaluation intermédiaire : Cron vs Timers systemd',
      description: 'Test cron syntax expressions and OnCalendar specifications.',
      descriptionFr: 'Tester la syntaxe des crontabs et les directives OnCalendar.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Automation Capstone: Zero-Maintenance Database Backup & Pruning Engine',
      titleFr: 'Projet final : Moteur de sauvegarde et purge automatisé',
      scenario: 'Build a production-grade automated database backup engine: triggers every night at 2:00 AM via systemd timer, takes a compressed dump, verifies archive integrity, prunes backups older than 14 days, and fires a webhook notification upon failure.',
      scenarioFr: 'Développer un moteur de sauvegarde automatisé : déclenché chaque nuit à 2h00 par un timer systemd, réalise un dump compressé, vérifie l\'intégrité de l\'archive, purge les sauvegardes de plus de 14 jours et alerte par webhook en cas d\'erreur.',
      deliverables: [
        'Timer unit `/etc/systemd/system/db-backup.timer` with `OnCalendar` schedule',
        'Service unit `/etc/systemd/system/db-backup.service` linked with `OnFailure` alert unit',
        'Idempotent backup script with automatic prune logic'
      ],
      deliverablesFr: [
        'Unité timer `/etc/systemd/system/db-backup.timer` active',
        'Unité service liée avec `OnFailure=` vers une unité d\'alerte',
        'Script de sauvegarde idempotent avec purge automatique'
      ],
      validationCriteria: [
        'Simulated script failure correctly triggers the OnFailure alert handler',
        'No overlapping execution if a backup takes longer than 24 hours'
      ],
      validationCriteriaFr: [
        'Un échec simulé déclenche correctement l\'alerte OnFailure',
        'Aucun risque d\'exécutions concurrentes si la sauvegarde dure plus de 24h'
      ]
    },
    capstone: {
      title: 'Automation Capstone: Zero-Maintenance Database Backup & Pruning Engine',
      titleFr: 'Projet final : Moteur de sauvegarde et purge automatisé',
      scenario: 'Build a production-grade automated database backup engine: triggers every night at 2:00 AM via systemd timer, takes a compressed dump, verifies archive integrity, prunes backups older than 14 days, and fires a webhook notification upon failure.',
      scenarioFr: 'Développer un moteur de sauvegarde automatisé : déclenché chaque nuit à 2h00 par un timer systemd, réalise un dump compressé, vérifie l\'intégrité de l\'archive, purge les sauvegardes de plus de 14 jours et alerte par webhook en cas d\'erreur.',
      deliverables: [
        'Timer unit `/etc/systemd/system/db-backup.timer` with `OnCalendar` schedule',
        'Service unit `/etc/systemd/system/db-backup.service` linked with `OnFailure` alert unit',
        'Idempotent backup script with automatic prune logic'
      ],
      deliverablesFr: [
        'Unité timer `/etc/systemd/system/db-backup.timer` active',
        'Unité service liée avec `OnFailure=` vers une unité d\'alerte',
        'Script de sauvegarde idempotent avec purge automatique'
      ],
      validationCriteria: [
        'Simulated script failure correctly triggers the OnFailure alert handler',
        'No overlapping execution if a backup takes longer than 24 hours'
      ],
      validationCriteriaFr: [
        'Un échec simulé déclenche correctement l\'alerte OnFailure',
        'Aucun risque d\'exécutions concurrentes si la sauvegarde dure plus de 24h'
      ]
    },
    badgeEarned: {
      title: 'Linux Systems Automation Architect',
      titleFr: 'Architecte en Automatisation Linux',
      icon: '🤖'
    }
  },

  // 4. Linux pour développeurs
  {
    id: 'practical-developers',
    category: 'practical',
    emoji: '💻',
    title: 'Linux for Software Developers',
    titleFr: 'Linux pour développeurs',
    subtitle: 'CLI → Git → Processus → Environnement (.bashrc, PATH) → Permissions → Réseau (curl) → Debugging (strace).',
    subtitleFr: 'CLI → Git → Processus → Environnement (.bashrc, PATH) → Permissions → Réseau (curl) → Debugging (strace).',
    description: 'Empower developers with native Linux capabilities: modern CLI workflows, Git integration, background jobs and multiplexing, environment variable management, Unix domain sockets, curl/HTTP diagnostics, and low-level system call debugging with strace and lsof.',
    descriptionFr: 'Donnez aux développeurs les superpouvoirs de Linux : environnement CLI moderne, Git, gestion des processus en arrière-plan, variables d\'environnement (.bashrc, PATH), sockets Unix, requêtes HTTP avec curl et débogage bas niveau avec strace et lsof.',
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
      'Master shell customization (.bashrc, environment variables, PATH resolution)',
      'Manage background jobs, foregrounding (fg/bg), and terminal detachment with tmux',
      'Inspect application HTTP APIs and headers using curl and jq',
      'Trace failing system calls (file missing, permission denied) using strace'
    ],
    objectivesFr: [
      'Personnaliser son shell (.bashrc, variables d\'environnement, résolution de PATH)',
      'Gérer les jobs d\'arrière-plan (bg/fg) et le multiplexage avec tmux',
      'Auditer des APIs et requêtes HTTP en ligne de commande avec curl et jq',
      'Tracer les appels système défaillants avec strace et inspecter les fichiers avec lsof'
    ],
    prerequisites: ['Basic programming knowledge and terminal exposure'],
    prerequisitesFr: ['Bases du développement et utilisation du terminal'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Environment, Jobs & curl',
      titleFr: 'Évaluation intermédiaire : Environnement, Jobs & curl',
      description: 'Test PATH hierarchy, background job management, and curl flags.',
      descriptionFr: 'Tester la résolution du PATH, les jobs et les requêtes curl.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Developer Capstone: Low-Level Debugging of a Crashing App',
      titleFr: 'Projet final : Débogage bas niveau d\'une application défaillante',
      scenario: 'A proprietary binary crashes on launch with a generic "Fatal Error". Use strace to attach to the binary execution, trace openat/access system calls, identify the exact missing configuration file path, fix the permissions, and verify successful execution.',
      scenarioFr: 'Un binaire plante au démarrage avec un laconique "Fatal Error". Utiliser strace pour tracer les appels système `openat`, identifier le fichier de configuration manquant, corriger ses permissions et valider le lancement.',
      deliverables: [
        'strace log capturing the exact failing system call (ENOENT / EACCES)',
        'Resolution of the missing dependency or permission blocker'
      ],
      deliverablesFr: [
        'Fichier de log strace isolant l\'appel système en échec (ENOENT ou EACCES)',
        'Résolution du fichier manquant ou du problème de droit'
      ],
      validationCriteria: [
        'Binary launches cleanly without crashing',
        'Identification of root cause without access to application source code'
      ],
      validationCriteriaFr: [
        'Le binaire se lance sans crash',
        'Cause racine trouvée sans avoir besoin du code source'
      ]
    },
    capstone: {
      title: 'Developer Capstone: Low-Level Debugging of a Crashing App',
      titleFr: 'Projet final : Débogage bas niveau d\'une application défaillante',
      scenario: 'A proprietary binary crashes on launch with a generic "Fatal Error". Use strace to attach to the binary execution, trace openat/access system calls, identify the exact missing configuration file path, fix the permissions, and verify successful execution.',
      scenarioFr: 'Un binaire plante au démarrage avec un laconique "Fatal Error". Utiliser strace pour tracer les appels système `openat`, identifier le fichier de configuration manquant, corriger ses permissions et valider le lancement.',
      deliverables: [
        'strace log capturing the exact failing system call (ENOENT / EACCES)',
        'Resolution of the missing dependency or permission blocker'
      ],
      deliverablesFr: [
        'Fichier de log strace isolant l\'appel système en échec (ENOENT ou EACCES)',
        'Résolution du fichier manquant ou du problème de droit'
      ],
      validationCriteria: [
        'Binary launches cleanly without crashing',
        'Identification of root cause without access to application source code'
      ],
      validationCriteriaFr: [
        'Le binaire se lance sans crash',
        'Cause racine trouvée sans avoir besoin du code source'
      ]
    },
    badgeEarned: {
      title: 'Linux Power Developer Specialist',
      titleFr: 'Spécialiste Linux pour Développeurs',
      icon: '💻'
    }
  }
];
