import {
  GlossaryEntry,
  CommandPedagogy,
  OctalBreakdownItem,
  CommandCommonError,
  SimilarCommandItem,
  AssociatedExamQuestion,
  AssociatedLabItem,
} from '../types';

export const curatedCommandPedagogy: Record<string, CommandPedagogy> = {
  chmod: {
    commandExample: 'chmod 640 fichier',
    whyTitle: 'Pourquoi « chmod 640 fichier » ?',
    whyTitleFr: 'Pourquoi « chmod 640 fichier » ?',
    why: {
      summary:
        'chmod 640 applies the principle of least privilege to sensitive configuration and application files, ensuring full control for the owner, read-only safety for group daemons, and zero exposure to untrusted users.',
      summaryFr:
        'chmod 640 applique le principe du moindre privilège sur les fichiers sensibles et confidentiels : contrôle total pour le propriétaire, lecture sécurisée pour le groupe du service, et isolation totale contre tout utilisateur tiers.',
      breakdown: [
        {
          digit: '6',
          target: 'owner',
          targetFr: 'propriétaire',
          permissions: 'rw-',
          explanation: 'Read (4) + Write (2) = 6',
          explanationFr: 'Lecture (4) + Écriture (2) = 6',
        },
        {
          digit: '4',
          target: 'group',
          targetFr: 'groupe',
          permissions: 'r--',
          explanation: 'Read (4) = 4',
          explanationFr: 'Lecture (4) = 4',
        },
        {
          digit: '0',
          target: 'others',
          targetFr: 'autres',
          permissions: '---',
          explanation: 'No permissions (0)',
          explanationFr: 'Aucun accès (0)',
        },
      ],
      details: [
        '6 → Owner (rw-): Can read, audit, and modify the file contents.',
        '4 → Group (r--): Read-only permission so backup daemons or team members can read without tampering.',
        '0 → Others (---): Completely forbidden from reading, writing, or executing, preventing data leakage.',
      ],
      detailsFr: [
        '6 → Propriétaire : rw- (accès complet en lecture et modification du contenu)',
        '4 → Groupe : r-- (lecture seule sans risque d\'altération par les membres ou démons)',
        '0 → Autres : --- (accès strictement interdit, prévient toute fuite d\'informations)',
      ],
    },
    whenToUse:
      'To protect sensitive production configuration files (database credentials, API keys, private certificates, /etc/shadow mirrors) where a specific daemon or group needs read access while completely barring all other local users.',
    whenToUseFr:
      'Pour sécuriser les fichiers de configuration de production (identifiants SQL, clés API, certificats applicatifs, répertoires restreints) où un démon de service spécifique doit lire le fichier sans pouvoir le corrompre, tout en interdisant formellement l\'accès aux autres comptes.',
    commonErrors: [
      {
        error: 'chmod 777 fichier',
        errorFr: 'chmod 777 fichier',
        explanation:
          'Dangerous antipattern: gives unrestricted write and execute permissions to anyone on the server, opening doors to privilege escalation and file poisoning.',
        explanationFr:
          'Antipattern critique : accorde les droits complets d\'écriture et d\'exécution à tous les utilisateurs du système, créant une faille d\'altération et d\'escalade de privilèges.',
        correction: 'chmod 640 fichier (ou 600 si aucun groupe n\'a besoin d\'accéder)',
      },
      {
        error: 'chmod -R 755 /var/www/html',
        errorFr: 'chmod -R 755 /var/www/html',
        explanation:
          'Applies the execute bit (+x) recursively to standard documents, images, and text files that should never be marked as executable.',
        explanationFr:
          'Attribue le bit d\'exécution (+x) récursivement à des images, feuilles CSS et documents qui ne doivent jamais être marqués comme exécutables.',
        correction:
          'find /var/www/html -type d -exec chmod 755 {} + && find /var/www/html -type f -exec chmod 644 {} +',
      },
      {
        error: 'chmod user:group fichier (confusion avec chown)',
        errorFr: 'chmod user:group fichier (confusion avec chown)',
        explanation:
          'Attempting to change file ownership with chmod instead of chown.',
        explanationFr:
          'Tenter de modifier le propriétaire ou le groupe avec chmod au lieu de la commande chown.',
        correction: 'chown user:group fichier',
      },
    ],
    similarCommands: [
      {
        command: 'chown',
        distinction:
          'Changes the user and/or group owner of files, whereas chmod only adjusts the permission bits (rwx/SUID/SGID/Sticky).',
        distinctionFr:
          'Modifie l\'utilisateur et/ou le groupe propriétaire du fichier, alors que chmod ajuste uniquement les bits de permissions.',
      },
      {
        command: 'chgrp',
        distinction:
          'Dedicated utility to change only the group ownership without modifying the user owner.',
        distinctionFr:
          'Utilitaire dédié pour changer exclusivement le groupe propriétaire sans impacter le compte utilisateur.',
      },
      {
        command: 'umask',
        distinction:
          'Defines the base bitmask subtracted by the kernel during the creation of new files and folders.',
        distinctionFr:
          'Définit le masque par défaut soustrait par le noyau lors de la création de nouveaux fichiers et dossiers.',
      },
      {
        command: 'setfacl',
        distinction:
          'Configures granular POSIX Access Control Lists allowing distinct permissions for multiple specific users or groups.',
        distinctionFr:
          'Configure des listes de contrôle d\'accès (ACL) granulaires pour plusieurs utilisateurs ou groupes distincts.',
      },
    ],
    associatedExamQuestion: {
      questionId: 10106,
      title: 'LPIC-1 Exam 101 - Question 10106',
      titleFr: 'Examen LPIC-1 101 - Question 10106',
      preview:
        'What is the octal permission value for read and execute permissions for owner, and read-only for group and others?',
      previewFr:
        'Quelle est la valeur octale des permissions pour lecture et exécution pour le propriétaire, et lecture seule pour le groupe et les autres ?',
      objectiveId: '104.5',
      examId: 'exam-101',
      fullQuestion: {
        question:
          'What is the octal permission value for read and execute permissions for owner, and read-only for group and others?',
        questionFr:
          'Quelle est la valeur octale des permissions pour lecture et exécution pour le propriétaire, et lecture seule pour le groupe et les autres ?',
        options: [
          '544 (r-xr--r--)',
          '755 (rwxr-xr-x)',
          '644 (rw-r--r--)',
          '550 (r-xr-x---)',
        ],
        optionsFr: [
          '544 (r-xr--r--)',
          '755 (rwxr-xr-x)',
          '644 (rw-r--r--)',
          '550 (r-xr-x---)',
        ],
        correctIndex: 0,
        explanation:
          'Owner: Read (4) + Execute (1) = 5. Group: Read (4) = 4. Others: Read (4) = 4. Result is 544.',
        explanationFr:
          'Propriétaire : Lecture (4) + Exécution (1) = 5. Groupe : Lecture (4) = 4. Autres : Lecture (4) = 4. Résultat : 544.',
      },
    },
    associatedLab: {
      labId: 'lab-lpic1-14',
      title: 'Group Management & Collaborative SGID Permissions',
      titleFr: 'Gestion des groupes & Droits collaboratifs avec le bit SGID',
      goal:
        'Create group devteam, configure permissions octales (2775 / 640), and enforce SGID bit inheritance on shared workspace.',
      goalFr:
        'Créer le groupe devteam, appliquer les permissions octales (2775 / 640) et activer l\'héritage SGID sur un dossier de travail partagé.',
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
      scenarioId: 'lab-lpic1-14',
    },
  },

  systemctl: {
    commandExample: 'sudo systemctl restart --now nginx.service',
    whyTitle: 'Pourquoi « systemctl restart » ?',
    whyTitleFr: 'Pourquoi « systemctl restart » ?',
    why: {
      summary:
        'systemctl is the central API client to communicate with PID 1 (systemd), orchestrating process lifecycles, cgroups containment, dependencies, and socket-activated listeners.',
      summaryFr:
        'systemctl est le client officiel qui dialogue avec le PID 1 (systemd) pour orchestrer le cycle de vie des processus, l\'isolation cgroups, les dépendances et l\'activation par socket.',
      breakdown: [
        {
          digit: 'systemctl',
          target: 'CLI client',
          targetFr: 'Client de contrôle',
          permissions: 'D-Bus call',
          explanation: 'Sends commands via system D-Bus to systemd manager daemon.',
          explanationFr: 'Envoie les ordres via le bus D-Bus système au démon systemd.',
        },
        {
          digit: 'restart',
          target: 'action',
          targetFr: 'action',
          permissions: 'SIGTERM + start',
          explanation: 'Stops running main PID and initiates fresh execve start.',
          explanationFr: 'Arrête le processus principal puis relance une nouvelle instance propre.',
        },
        {
          digit: 'nginx.service',
          target: 'unit name',
          targetFr: 'unité ciblée',
          permissions: 'Service unit',
          explanation: 'Defines ExecStart, User, Group, and sandboxing rules.',
          explanationFr: 'Définit les directives ExecStart, User, et les règles d\'isolation.',
        },
      ],
      details: [
        'Safe process recycling with clean shutdown timeouts (TimeoutStopSec).',
        'Automatic cgroups tracking ensuring orphaned child workers are reaped.',
        'Immediate logging integration piped directly into systemd-journald.',
      ],
      detailsFr: [
        'Recyclage propre des processus avec respect du délai TimeoutStopSec.',
        'Suivi rigoureux par cgroups éliminant tout processus enfant orphelin.',
        'Intégration directe des sorties standard dans systemd-journald.',
      ],
    },
    whenToUse:
      'After updating software configurations, renewing SSL/TLS certificates, or recovering from a crashed or stuck background service.',
    whenToUseFr:
      'Après modification d\'un fichier de configuration, renouvellement de certificats TLS ou pour récupérer un service en état défaillant.',
    commonErrors: [
      {
        error: 'Editing unit file in /lib/systemd/system and forgetting daemon-reload',
        errorFr: 'Modifier un fichier .service sans faire daemon-reload',
        explanation:
          'systemd caches unit definitions in RAM. Without daemon-reload, changes have zero effect.',
        explanationFr:
          'systemd garde les unités en mémoire RAM. Sans daemon-reload, les modifications ne sont jamais prises en compte.',
        correction: 'sudo systemctl daemon-reload && sudo systemctl restart <service>',
      },
      {
        error: 'Confusing systemctl stop with systemctl mask',
        errorFr: 'Confondre systemctl stop et systemctl mask',
        explanation:
          'stop only terminates the current process; another service can pull it back up. mask symlinks it to /dev/null to make it permanently unstartable.',
        explanationFr:
          'stop arrête le service temporairement ; un autre service peut le réactiver. mask lie l\'unité à /dev/null, la rendant impossible à démarrer.',
        correction: 'sudo systemctl mask <service>',
      },
    ],
    similarCommands: [
      {
        command: 'service',
        distinction:
          'Legacy SysVinit wrapper that redirects to systemctl on modern distributions.',
        distinctionFr:
          'Ancienne commande SysVinit qui redirige vers systemctl sur les distributions modernes.',
      },
      {
        command: 'journalctl',
        distinction:
          'Dedicated tool to inspect the log streams generated by systemd units.',
        distinctionFr:
          'Outil dédié pour inspecter les journaux générés par les unités systemd.',
      },
      {
        command: 'systemd-analyze',
        distinction:
          'Analyzes boot performance, critical chains, and security sandboxing exposures of units.',
        distinctionFr:
          'Analyse le temps de démarrage, la chaîne critique et les réglages de sécurité des unités.',
      },
    ],
    associatedExamQuestion: {
      questionId: 10103,
      title: 'LPIC-1 Exam 101 - Objective 101.3',
      titleFr: 'Examen LPIC-1 101 - Objectif 101.3',
      preview:
        'Which systemctl command updates the manager configuration after adding or editing a unit file?',
      previewFr:
        'Quelle commande systemctl met à jour la configuration après modification d\'une unité ?',
      objectiveId: '101.3',
      examId: 'exam-101',
    },
    associatedLab: {
      labId: 'lab-lpic1-03',
      title: 'Managing systemd Services, Targets, and Runlevels',
      titleFr: 'Gestion des services systemd, targets et niveaux d\'exécution',
      goal:
        'Start, stop, enable, mask services, switch targets, and diagnose failed states.',
      goalFr:
        'Démarrer, masquer des services, basculer de target et diagnostiquer des pannes.',
      difficulty: 'Intermediate',
      estimatedMinutes: 10,
      scenarioId: 'lab-lpic1-03',
    },
  },

  journalctl: {
    commandExample: 'journalctl -u sshd -b 0 -p err..emerg --no-pager',
    whyTitle: 'Pourquoi « journalctl -u sshd -b 0 » ?',
    whyTitleFr: 'Pourquoi « journalctl -u sshd -b 0 » ?',
    why: {
      summary:
        'Precision log filtering that extracts exactly the critical issues of the OpenSSH server during the current uptime session, eliminating megabytes of noisy background noise.',
      summaryFr:
        'Filtrage de précision des journaux extrayant exactement les erreurs critiques du serveur OpenSSH lors de la session de boot en cours, sans bruit superflu.',
      breakdown: [
        {
          digit: '-u sshd',
          target: 'unit filter',
          targetFr: 'filtre unité',
          permissions: 'cgroup match',
          explanation: 'Restricts query to messages emitted by sshd.service cgroup.',
          explanationFr: 'Limite la recherche aux messages émis par le cgroup de sshd.service.',
        },
        {
          digit: '-b 0',
          target: 'boot session',
          targetFr: 'session de boot',
          permissions: 'boot ID',
          explanation: 'Only queries events since the most recent boot (0 = current).',
          explanationFr: 'Restreint aux événements survenus depuis le dernier boot (0 = actuel).',
        },
        {
          digit: '-p err..emerg',
          target: 'severity range',
          targetFr: 'plage sévérité',
          permissions: 'syslog priority',
          explanation: 'Filters logs from Error (3) up to Emergency (0).',
          explanationFr: 'Filtre les journaux de sévérité Erreur (3) jusqu\'à Urgence (0).',
        },
      ],
      details: [
        'Provides instant root-cause analysis for failed SSH daemon launches.',
        'Eliminates paging delay with --no-pager for fast scripting and terminal analysis.',
        'Correlates kernel syscall failures and PAM authentication rejections.',
      ],
      detailsFr: [
        'Permet un diagnostic immédiat en cas d\'échec de lancement du démon SSH.',
        'Désactive la pagination avec --no-pager pour une inspection rapide en console.',
        'Corrèle les rejets d\'authentification PAM et les erreurs système.',
      ],
    },
    whenToUse:
      'During real-time incident troubleshooting, diagnosing why a service refused to start, or auditing brute-force authentication attacks.',
    whenToUseFr:
      'Lors du dépannage d\'incidents en production, pour diagnostiquer pourquoi un service a échoué ou auditer des tentatives d\'intrusion.',
    commonErrors: [
      {
        error: 'Searching /var/log/messages on systems where systemd-journald is volatile',
        errorFr: 'Chercher dans /var/log/messages alors que rsyslog n\'est pas installé',
        explanation:
          'On modern minimal distros, logs reside strictly in journald (/run/log/journal/ or /var/log/journal/).',
        explanationFr:
          'Sur les installations modernes sans rsyslog, les logs résident exclusivement dans journald.',
        correction: 'journalctl -u <service>',
      },
      {
        error: 'Omission of -b flag when investigating recent reboot crashes',
        errorFr: 'Oublier l\'option -b lors d\'un crash après reboot',
        explanation:
          'Without -b, you view the current boot. Use -b -1 to inspect the previous boot before the crash.',
        explanationFr:
          'Sans -b, vous voyez la session actuelle. Utilisez -b -1 pour voir la session précédente qui a crashé.',
        correction: 'journalctl -b -1 -u <service>',
      },
    ],
    similarCommands: [
      {
        command: 'dmesg',
        distinction:
          'Prints exclusively the kernel ring buffer, whereas journalctl unifies kernel, system daemons, and user services.',
        distinctionFr:
          'Affiche uniquement le tampon circulaire du noyau, alors que journalctl unifie noyau, démons et services utilisateurs.',
      },
      {
        command: 'tail -f',
        distinction:
          'Follows a static text file, whereas journalctl -f follows a binary indexed journal with metadata tags.',
        distinctionFr:
          'Suit un fichier texte brut, tandis que journalctl -f suit un journal binaire indexé avec métadonnées.',
      },
    ],
    associatedExamQuestion: {
      questionId: 10103,
      title: 'LPIC-1 Exam 101 - Objective 101.3 / 108.2',
      titleFr: 'Examen LPIC-1 101 - Objectif 101.3 / 108.2',
      preview:
        'Where must directory /var/log/journal exist to ensure journalctl logs persist across reboots?',
      previewFr:
        'Quel répertoire assure la persistance des journaux journalctl après redémarrage ?',
      objectiveId: '101.3',
      examId: 'exam-101',
    },
    associatedLab: {
      labId: 'lab-lpic1-04',
      title: 'Log Inspection & Persistent Journal Management',
      titleFr: 'Inspection des logs & Configuration de la persistance Journald',
      goal:
        'Configure persistent storage, vacuum journal limits, and filter events by priority.',
      goalFr:
        'Configurer le stockage persistant, purger les journaux et filtrer par priorité.',
      difficulty: 'Beginner',
      estimatedMinutes: 8,
      scenarioId: 'lab-lpic1-04',
    },
  },

  umask: {
    commandExample: 'umask 027',
    whyTitle: 'Pourquoi « umask 027 » ?',
    whyTitleFr: 'Pourquoi « umask 027 » ?',
    why: {
      summary:
        'umask 027 ensures newly generated files automatically receive 640 (rw-r-----) and directories 750 (rwxr-x---), enforcing secure isolation by default.',
      summaryFr:
        'umask 027 garantit que les nouveaux fichiers reçoivent automatiquement les droits 640 (rw-r-----) et les dossiers 750 (rwxr-x---), assurant une sécurité proactive par défaut.',
      breakdown: [
        {
          digit: '0',
          target: 'owner mask',
          targetFr: 'masque propriétaire',
          permissions: '--- (aucun retrait)',
          explanation: 'Files retain 6 (rw-), directories retain 7 (rwx).',
          explanationFr: 'Les fichiers gardent 6 (rw-), les dossiers gardent 7 (rwx).',
        },
        {
          digit: '2',
          target: 'group mask',
          targetFr: 'masque groupe',
          permissions: '-w- (retrait écriture)',
          explanation: 'Files become 4 (r--), directories become 5 (r-x).',
          explanationFr: 'Les fichiers deviennent 4 (r--), les dossiers deviennent 5 (r-x).',
        },
        {
          digit: '7',
          target: 'others mask',
          targetFr: 'masque autres',
          permissions: 'rwx (retrait total)',
          explanation: 'Files and directories become 0 (---).',
          explanationFr: 'Fichiers et dossiers reçoivent 0 (---).',
        },
      ],
      details: [
        'Base calculation for files: 666 - 027 = 640 (rw-r-----).',
        'Base calculation for directories: 777 - 027 = 750 (rwxr-x---).',
        'No executable permission is ever awarded to files upon initial creation.',
      ],
      detailsFr: [
        'Calcul de base pour les fichiers : 666 - 027 = 640 (rw-r-----).',
        'Calcul de base pour les dossiers : 777 - 027 = 750 (rwxr-x---).',
        'Aucun droit d\'exécution n\'est jamais accordé aux fichiers réguliers à la création.',
      ],
    },
    whenToUse:
      'In /etc/profile, /etc/login.defs, or user ~/.bashrc to enforce a secure enterprise baseline for all user files.',
    whenToUseFr:
      'Dans /etc/profile, /etc/login.defs ou ~/.bashrc pour imposer un standard de sécurité strict pour tous les documents créés.',
    commonErrors: [
      {
        error: 'Assuming umask can grant execute (+x) rights to a created file',
        errorFr: 'Croire que le umask peut donner le droit d\'exécution (+x) à un fichier',
        explanation:
          'Files have a maximum base mask of 666 (rw-rw-rw-). Even umask 000 creates 666, never 777.',
        explanationFr:
          'La base maximale d\'un fichier est 666. Même un umask 000 donnera 666, jamais 777.',
        correction: 'chmod +x <fichier>',
      },
    ],
    similarCommands: [
      {
        command: 'chmod',
        distinction:
          'Modifies permissions on existing files, whereas umask influences permissions during creation.',
        distinctionFr:
          'Modifie les permissions de fichiers existants, tandis que umask agit lors de la création.',
      },
    ],
    associatedExamQuestion: {
      questionId: 10106,
      title: 'LPIC-1 Exam 101 - Objective 104.5',
      titleFr: 'Examen LPIC-1 101 - Objectif 104.5',
      preview:
        'With a umask of 027, what permissions will a newly created regular text file have?',
      previewFr:
        'Avec un umask de 027, quelles seront les permissions d\'un nouveau fichier texte régulier ?',
      objectiveId: '104.5',
      examId: 'exam-101',
    },
    associatedLab: {
      labId: 'lab-lpic1-14',
      title: 'File Permissions & Default Umask Configuration',
      titleFr: 'Permissions de fichiers & Configuration du umask par défaut',
      goal:
        'Calculate octal complements, configure session umask, and verify created file modes.',
      goalFr:
        'Calculer les compléments octaux, régler le umask et vérifier les modes créés.',
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
      scenarioId: 'lab-lpic1-14',
    },
  },

  tar: {
    commandExample: 'tar -czvf backup.tar.gz -C /etc .',
    whyTitle: 'Pourquoi « tar -czvf » ?',
    whyTitleFr: 'Pourquoi « tar -czvf » ?',
    why: {
      summary:
        'Combines an entire directory tree into a single portable tape archive (tar) and streams it through the gzip compression engine on the fly.',
      summaryFr:
        'Regroupe une arborescence complète dans une archive unique tout en préservant les métadonnées et en compressant à la volée avec gzip.',
      breakdown: [
        {
          digit: '-c',
          target: 'create',
          targetFr: 'créer',
          permissions: 'archive mode',
          explanation: 'Creates a new archive from specified input paths.',
          explanationFr: 'Crée une nouvelle archive à partir des fichiers sources.',
        },
        {
          digit: '-z',
          target: 'gzip',
          targetFr: 'gzip',
          permissions: 'compression',
          explanation: 'Filters archive through gzip compressor (.tar.gz).',
          explanationFr: 'Compresse l\'archive avec l\'algorithme gzip.',
        },
        {
          digit: '-v',
          target: 'verbose',
          targetFr: 'verbeux',
          permissions: 'feedback',
          explanation: 'Lists each archived file name as it is processed.',
          explanationFr: 'Affiche le nom de chaque fichier archivé dans la console.',
        },
        {
          digit: '-f',
          target: 'file',
          targetFr: 'fichier cible',
          permissions: 'output file',
          explanation: 'Next parameter MUST be the destination archive file name.',
          explanationFr: 'Le paramètre suivant DOIT être le nom du fichier d\'archive.',
        },
      ],
      details: [
        'Preserves file ownership, permissions, and directory structures.',
        'Reduces transfer time across networks or backup storage media.',
        '-C changes working directory before archiving to prevent storing absolute paths.',
      ],
      detailsFr: [
        'Préserve les permissions, propriétaires et liens symboliques.',
        'Réduit le volume de stockage et le temps de transfert réseau.',
        '-C évite d\'archiver des chemins absolus avec un / initial dangereux.',
      ],
    },
    whenToUse:
      'Performing system backups, packaging application releases, or transmitting directory structures across SSH pipes.',
    whenToUseFr:
      'Effectuer des sauvegardes locales de configuration, empaqueter des livrables ou transférer des arborescences complètes via le réseau.',
    commonErrors: [
      {
        error: 'Placing flags after the -f parameter (e.g. tar -cfz archive.tar)',
        errorFr: 'Placer des options après le -f (ex: tar -cfz archive.tar)',
        explanation:
          'The argument immediately following -f is treated as the file name, causing tar to error out or write to a file named "z".',
        explanationFr:
          'L\'argument suivant immédiatement -f est considéré comme le nom du fichier d\'archive.',
        correction: 'tar -czvf archive.tar.gz /path',
      },
    ],
    similarCommands: [
      {
        command: 'cpio',
        distinction:
          'Processes lists of file paths streamed via standard input (e.g. find | cpio).',
        distinctionFr:
          'Traite les listes de chemins transmises via l\'entrée standard (find | cpio).',
      },
      {
        command: 'rsync',
        distinction:
          'Synchronizes directory trees incrementally without necessarily creating an archive envelope.',
        distinctionFr:
          'Synchronise des arborescences de manière incrémentale sans créer de conteneur d\'archive.',
      },
    ],
    associatedExamQuestion: {
      questionId: 10103,
      title: 'LPIC-1 Exam 101 - Objective 103.5',
      titleFr: 'Examen LPIC-1 101 - Objectif 103.5',
      preview:
        'Which tar option is used to compress archives using bzip2 (-j) vs gzip (-z) vs xz (-J)?',
      previewFr:
        'Quelle option de tar compresse avec bzip2 (-j), gzip (-z) ou xz (-J) ?',
      objectiveId: '103.5',
      examId: 'exam-101',
    },
    associatedLab: {
      labId: 'lab-lpic1-09',
      title: 'Archiving and Compressing System Files with tar and cpio',
      titleFr: 'Archivage et compression avec tar et cpio',
      goal:
        'Create compressed archives, inspect contents without unpacking, and restore to specific paths.',
      goalFr:
        'Créer des archives compressées, lister le contenu et restaurer dans un dossier cible.',
      difficulty: 'Beginner',
      estimatedMinutes: 8,
      scenarioId: 'lab-lpic1-09',
    },
  },
};

/**
 * Resolves or dynamically synthesizes a complete 6-part pedagogy for any glossary entry.
 */
export function getCommandPedagogy(entry: GlossaryEntry, isFrench: boolean): CommandPedagogy {
  const normalized = entry.term.trim().toLowerCase();

  if (curatedCommandPedagogy[normalized]) {
    return curatedCommandPedagogy[normalized];
  }

  // Dynamic synthesis for any other command / directive
  const topFlags = entry.flagsOrParameters?.slice(0, 3) || [];
  const breakdown: OctalBreakdownItem[] = topFlags.map((flag, idx) => ({
    digit: flag.flag,
    target: isFrench ? `Paramètre #${idx + 1}` : `Parameter #${idx + 1}`,
    targetFr: `Paramètre #${idx + 1}`,
    permissions: isFrench ? 'Contrôle clé' : 'Key control',
    explanation: flag.description,
    explanationFr: flag.description,
  }));

  const example = entry.exampleSnippet || `${entry.term} --help`;

  return {
    commandExample: example,
    whyTitle: isFrench ? `Pourquoi « ${entry.term} » ?` : `Why "${entry.term}"?`,
    whyTitleFr: `Pourquoi « ${entry.term} » ?`,
    why: {
      summary: entry.exampleExplanation || entry.definition,
      summaryFr: entry.exampleExplanation || entry.definition,
      breakdown: breakdown.length > 0 ? breakdown : undefined,
      details: [
        isFrench
          ? `Garantit l'exécution conforme aux exigences de l'objectif LPIC ${entry.objectiveId}.`
          : `Ensures compliance with LPIC Objective ${entry.objectiveId} requirements.`,
        isFrench
          ? `Permet de standardiser l'administration système sous ${entry.certification.toUpperCase()}.`
          : `Standardizes system administration under ${entry.certification.toUpperCase()}.`,
      ],
      detailsFr: [
        `Garantit l'exécution conforme aux exigences de l'objectif LPIC ${entry.objectiveId}.`,
        `Permet de standardiser l'administration système sous ${entry.certification.toUpperCase()}.`,
      ],
    },
    whenToUse: isFrench
      ? `Dans le cadre de l'administration système (${entry.category}) sous l'objectif LPI ${entry.objectiveId}.`
      : `Within system administration (${entry.category}) under LPI Objective ${entry.objectiveId}.`,
    whenToUseFr: `Dans le cadre de l'administration système (${entry.category}) sous l'objectif LPI ${entry.objectiveId}.`,
    commonErrors: [
      {
        error: isFrench ? `Syntaxe incorrecte ou arguments manquants` : `Invalid syntax or missing flags`,
        errorFr: `Syntaxe incorrecte ou arguments manquants`,
        explanation: entry.examTips || (isFrench ? `Attention aux pièges et options évaluées à l'examen.` : `Watch out for exam traps and tested flags.`),
        explanationFr: entry.examTips || `Attention aux pièges et options évaluées à l'examen.`,
        correction: `man ${entry.term}`,
      },
    ],
    similarCommands: (entry.relatedTerms || []).slice(0, 3).map((rt) => ({
      command: rt,
      distinction: isFrench
        ? `Concept connexe au sein du même domaine (${entry.category}).`
        : `Connected concept in the same domain (${entry.category}).`,
      distinctionFr: `Concept connexe au sein du même domaine (${entry.category}).`,
    })),
    associatedExamQuestion: {
      questionId: entry.objectiveId,
      title: isFrench ? `Question Objectif ${entry.objectiveId}` : `Objective ${entry.objectiveId} Question`,
      titleFr: `Question Objectif ${entry.objectiveId}`,
      preview: entry.examTips || entry.definition,
      previewFr: entry.examTips || entry.definition,
      objectiveId: entry.objectiveId,
      examId: entry.examId,
    },
    associatedLab: {
      labId: `lab-${entry.objectiveId.replace('.', '-')}`,
      title: isFrench ? `Atelier Pratique : ${entry.term}` : `Hands-On Lab: ${entry.term}`,
      titleFr: `Atelier Pratique : ${entry.term}`,
      goal: entry.definition,
      goalFr: entry.definition,
      difficulty: 'Intermediate',
      estimatedMinutes: 8,
    },
  };
}
