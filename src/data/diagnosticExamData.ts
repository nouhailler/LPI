import {
  DiagnosticDomainId,
  DiagnosticDomainScore,
  DiagnosticQuestion,
  DiagnosticResult,
} from '../types';

export const DIAGNOSTIC_DOMAINS: {
  id: DiagnosticDomainId;
  name: string;
  nameFr: string;
  topicId: string;
  topicNumber: number;
  descriptionFr: string;
  descriptionEn: string;
}[] = [
  {
    id: 'architecture',
    name: 'Architecture & Boot',
    nameFr: 'Architecture',
    topicId: 'topic-101',
    topicNumber: 101,
    descriptionFr: 'Matériel, BIOS/UEFI, chargeur GRUB2, processus de boot et cibles systemd.',
    descriptionEn: 'Hardware settings, BIOS/UEFI, GRUB2 bootloader, boot stages and systemd targets.',
  },
  {
    id: 'commands',
    name: 'GNU/Linux Commands',
    nameFr: 'Commandes GNU/Linux',
    topicId: 'topic-103',
    topicNumber: 103,
    descriptionFr: 'Filtres textuels (grep, sed, awk), flux d\'E/S, tubes, expressions régulières et gestion des fichiers.',
    descriptionEn: 'Text filters (grep, sed, awk), I/O streams, pipes, regular expressions, and file management.',
  },
  {
    id: 'filesystems',
    name: 'Filesystems & Storage',
    nameFr: 'Filesystems',
    topicId: 'topic-104',
    topicNumber: 104,
    descriptionFr: 'Partitions MBR/GPT, volumes LVM, configuration fstab, FHS et maintenance des systèmes de fichiers.',
    descriptionEn: 'MBR/GPT partitions, LVM volumes, fstab configuration, FHS, and filesystem maintenance.',
  },
  {
    id: 'bash',
    name: 'Bash & Scripting',
    nameFr: 'Bash',
    topicId: 'topic-105',
    topicNumber: 105,
    descriptionFr: 'Environnement shell, variables, conditions de test, boucles de script et codes de sortie.',
    descriptionEn: 'Shell environment, variables, test brackets, script loops, and return exit codes.',
  },
  {
    id: 'networking',
    name: 'Networking & Protocols',
    nameFr: 'Réseau',
    topicId: 'topic-109',
    topicNumber: 109,
    descriptionFr: 'Masques CIDR, routage par défaut, résolution DNS, ports de service et commandes ip/ss.',
    descriptionEn: 'CIDR masks, default gateway routing, DNS resolution, service ports, and ip/ss commands.',
  },
  {
    id: 'security',
    name: 'Security & Permissions',
    nameFr: 'Sécurité',
    topicId: 'topic-110',
    topicNumber: 110,
    descriptionFr: 'Permissions octales, bits spéciaux (SUID/SGID/Sticky), /etc/shadow, sudo et durcissement SSH.',
    descriptionEn: 'Octal permissions, special bits (SUID/SGID/Sticky), /etc/shadow, sudo, and SSH hardening.',
  },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // -------------------------------------------------------------
  // 1. ARCHITECTURE (4 Questions)
  // -------------------------------------------------------------
  {
    id: 1,
    domainId: 'architecture',
    topicId: 'topic-101',
    topicNumber: 101,
    objectiveId: '101.1',
    question: 'Which command is used to display loaded Linux kernel modules along with their dependencies and usage count?',
    questionFr: 'Quelle commande permet d\'afficher la liste des modules du noyau Linux actuellement chargés en mémoire avec leurs dépendances ?',
    commandSnippet: '$ _____',
    options: ['modinfo', 'lsmod', 'depmod -a', 'insmod --list'],
    optionsFr: ['modinfo', 'lsmod', 'depmod -a', 'insmod --list'],
    correctIndex: 1,
    explanation: 'The `lsmod` command reads `/proc/modules` and formats the list of currently loaded kernel modules, their size, and referring modules.',
    explanationFr: 'La commande `lsmod` lit `/proc/modules` et affiche la liste formatée de tous les modules du noyau actuellement chargés en mémoire.',
  },
  {
    id: 2,
    domainId: 'architecture',
    topicId: 'topic-101',
    topicNumber: 101,
    objectiveId: '101.2',
    question: 'When configuring GRUB 2 on a modern Linux distribution, which file should an administrator edit to permanently modify kernel boot parameters before running update-grub or grub-mkconfig?',
    questionFr: 'Lors de la configuration de GRUB 2, quel fichier l\'administrateur doit-il éditer pour modifier de manière permanente les paramètres de démarrage du noyau avant d\'exécuter update-grub ?',
    commandSnippet: '$ sudo nano _____',
    options: ['/boot/grub/grub.cfg', '/etc/default/grub', '/etc/grub.conf', '/boot/efi/EFI/grub.env'],
    optionsFr: ['/boot/grub/grub.cfg', '/etc/default/grub', '/etc/grub.conf', '/boot/efi/EFI/grub.env'],
    correctIndex: 1,
    explanation: '`/etc/default/grub` contains main configuration variables such as `GRUB_CMDLINE_LINUX` and `GRUB_TIMEOUT`. `/boot/grub/grub.cfg` is generated automatically and should never be edited manually.',
    explanationFr: '`/etc/default/grub` contient les variables globales de configuration (`GRUB_CMDLINE_LINUX`, `GRUB_TIMEOUT`). Le fichier `/boot/grub/grub.cfg` est généré automatiquement et ne doit jamais être modifié à la main.',
  },
  {
    id: 3,
    domainId: 'architecture',
    topicId: 'topic-101',
    topicNumber: 101,
    objectiveId: '101.3',
    question: 'On a systemd-based system, which command safely changes the active target to multi-user mode without rebooting?',
    questionFr: 'Sur un système utilisant systemd, quelle commande permet de basculer immédiatement vers le mode multi-utilisateur sans redémarrer la machine ?',
    commandSnippet: '$ sudo _____',
    options: [
      'systemctl switch multi-user.target',
      'systemctl isolate multi-user.target',
      'systemctl set-default multi-user.target',
      'telinit 6'
    ],
    optionsFr: [
      'systemctl switch multi-user.target',
      'systemctl isolate multi-user.target',
      'systemctl set-default multi-user.target',
      'telinit 6'
    ],
    correctIndex: 1,
    explanation: '`systemctl isolate <target>` stops units that are not in the specified target and starts those that are, functionally equivalent to changing runlevels.',
    explanationFr: '`systemctl isolate <cible>` arrête les services absents de la cible demandée et démarre ceux qui y figurent, ce qui correspond au changement dynamique de runlevel.',
  },
  {
    id: 4,
    domainId: 'architecture',
    topicId: 'topic-101',
    topicNumber: 101,
    objectiveId: '101.1',
    question: 'Which pseudo-filesystem exports real-time kernel hardware, driver attributes, and device tree hierarchy for modern udev rule processing?',
    questionFr: 'Quel pseudo-système de fichiers virtuel expose les périphériques détectés par le noyau, leurs pilotes et la hiérarchie matérielle pour les règles udev ?',
    commandSnippet: '$ ls -la _____',
    options: ['/proc', '/sys', '/dev/pts', '/var/run'],
    optionsFr: ['/proc', '/sys', '/dev/pts', '/var/run'],
    correctIndex: 1,
    explanation: '`/sys` (sysfs) is a ram-based filesystem that exports a structured view of kernel device drivers and subsystem attributes used directly by udev.',
    explanationFr: '`/sys` (sysfs) est un système virtuel en mémoire qui expose la vue structurée des pilotes et matériels détectés par le noyau, directement exploitée par le démon udev.',
  },

  // -------------------------------------------------------------
  // 2. COMMANDES GNU/LINUX (4 Questions)
  // -------------------------------------------------------------
  {
    id: 5,
    domainId: 'commands',
    topicId: 'topic-103',
    topicNumber: 103,
    objectiveId: '103.2',
    question: 'Which pipeline extracts only the non-empty, non-comment lines from a configuration file where comments begin with `#`?',
    questionFr: 'Quel enchaînement de commandes permet d\'extraire uniquement les lignes utiles (non vides et non commentées débutant par `#`) d\'un fichier de configuration ?',
    commandSnippet: '$ grep -v \'^#\' config.conf | _____',
    options: ['grep -v \'^$\'', 'grep -e \'^blank\'', 'cut -d \'#\' -f 1', 'sed \'/^#/d\''],
    optionsFr: ['grep -v \'^$\'', 'grep -e \'^blank\'', 'cut -d \'#\' -f 1', 'sed \'/^#/d\''],
    correctIndex: 0,
    explanation: '`grep -v \'^#\'` filters out comments, and `grep -v \'^$\'` inverts matching for lines that have nothing between start `^` and end `$`.',
    explanationFr: '`grep -v \'^#\'` élimine les lignes débutant par un dièse, et `grep -v \'^$\'` élimine toutes les lignes totalement vides.',
  },
  {
    id: 6,
    domainId: 'commands',
    topicId: 'topic-103',
    topicNumber: 103,
    objectiveId: '103.2',
    question: 'Which command extracts only the first field (usernames) from `/etc/passwd` when fields are separated by colons (`:`)?',
    questionFr: 'Quelle commande permet d\'extraire uniquement le premier champ (les noms d\'utilisateurs) du fichier `/etc/passwd` délimité par des deux-points (`:`) ?',
    commandSnippet: '$ _____ /etc/passwd',
    options: ['cut -d: -f1', 'awk \'{print $0}\'', 'sed -n \'1p\'', 'paste -d: -s1'],
    optionsFr: ['cut -d: -f1', 'awk \'{print $0}\'', 'sed -n \'1p\'', 'paste -d: -s1'],
    correctIndex: 0,
    explanation: '`cut -d: -f1` specifies colon as the field delimiter (`-d:`) and selects field 1 (`-f1`).',
    explanationFr: '`cut -d: -f1` définit le deux-points comme délimiteur de champ (`-d:`) et extrait le 1er champ (`-f1`).',
  },
  {
    id: 7,
    domainId: 'commands',
    topicId: 'topic-103',
    topicNumber: 103,
    objectiveId: '103.3',
    question: 'Which find command searches the `/var/log` directory for regular files modified more than 30 days ago ending with `.log`?',
    questionFr: 'Quelle commande find recherche dans `/var/log` les fichiers réguliers modifiés il y a plus de 30 jours et se terminant par `.log` ?',
    commandSnippet: '$ find /var/log _____',
    options: [
      '-type f -name "*.log" -mtime +30',
      '-type d -iname "*.log" -atime -30',
      '-perm f -name "*.log" -ctime 30',
      '-file -name "*.log" -older 30d'
    ],
    optionsFr: [
      '-type f -name "*.log" -mtime +30',
      '-type d -iname "*.log" -atime -30',
      '-perm f -name "*.log" -ctime 30',
      '-file -name "*.log" -older 30d'
    ],
    correctIndex: 0,
    explanation: '`-type f` restricts to regular files, `-name "*.log"` matches filename pattern, and `-mtime +30` finds files modified strictly more than 30 days ago.',
    explanationFr: '`-type f` filtre les fichiers réguliers, `-name "*.log"` cible l\'extension, et `-mtime +30` sélectionne les fichiers modifiés il y a strictement plus de 30 jours.',
  },
  {
    id: 8,
    domainId: 'commands',
    topicId: 'topic-103',
    topicNumber: 103,
    objectiveId: '103.3',
    question: 'Which tar flags create a gzip-compressed archive named `backup.tar.gz` from the `/etc` directory while showing verbose progress?',
    questionFr: 'Quels paramètres de la commande tar permettent de créer une archive compressée avec gzip nommée `backup.tar.gz` du dossier `/etc` avec affichage détaillé ?',
    commandSnippet: '$ tar _____ backup.tar.gz /etc',
    options: ['-czvf', '-xzvf', '-cjvf', '-tzvf'],
    optionsFr: ['-czvf', '-xzvf', '-cjvf', '-tzvf'],
    correctIndex: 0,
    explanation: '`-c` creates an archive, `-z` compresses using gzip, `-v` outputs verbose progress, and `-f` specifies the destination file name.',
    explanationFr: '`-c` crée l\'archive, `-z` compresse via gzip, `-v` active le mode verbeux, et `-f` spécifie le nom du fichier d\'archive cible.',
  },

  // -------------------------------------------------------------
  // 3. FILESYSTEMS & STORAGE (3 Questions)
  // -------------------------------------------------------------
  {
    id: 9,
    domainId: 'filesystems',
    topicId: 'topic-104',
    topicNumber: 104,
    objectiveId: '104.1',
    question: 'In what exact logical order must an administrator configure Logical Volume Management (LVM) components starting from raw physical partitions?',
    questionFr: 'Dans quel ordre logique rigoureux un administrateur doit-il configurer les composants LVM en partant de partitions physiques brutes ?',
    options: [
      'Physical Volumes (pvcreate) → Volume Group (vgcreate) → Logical Volumes (lvcreate)',
      'Volume Group (vgcreate) → Physical Volumes (pvcreate) → Logical Volumes (lvcreate)',
      'Logical Volumes (lvcreate) → Volume Group (vgcreate) → Physical Volumes (pvcreate)',
      'Filesystem (mkfs) → Volume Group (vgcreate) → Physical Volumes (pvcreate)'
    ],
    optionsFr: [
      'Physical Volumes (pvcreate) → Volume Group (vgcreate) → Logical Volumes (lvcreate)',
      'Volume Group (vgcreate) → Physical Volumes (pvcreate) → Logical Volumes (lvcreate)',
      'Logical Volumes (lvcreate) → Volume Group (vgcreate) → Physical Volumes (pvcreate)',
      'Filesystem (mkfs) → Volume Group (vgcreate) → Physical Volumes (pvcreate)'
    ],
    correctIndex: 0,
    explanation: 'Storage devices are initialized as Physical Volumes (PVs), grouped into a Volume Group (VG) pool, from which Logical Volumes (LVs) are allocated.',
    explanationFr: 'Les disques/partitions sont initialisés en Volumes Physiques (PV), regroupés dans un Groupe de Volumes (VG), à partir duquel sont alloués les Volumes Logiques (LV).',
  },
  {
    id: 10,
    domainId: 'filesystems',
    topicId: 'topic-104',
    topicNumber: 104,
    objectiveId: '104.3',
    question: 'In `/etc/fstab`, what does the 6th field (last numeric column) indicate?',
    questionFr: 'Dans le fichier `/etc/fstab`, que contrôle le 6ème et dernier champ numérique d\'une ligne de montage ?',
    commandSnippet: 'UUID=xxxx / ext4 defaults 1 1',
    options: [
      'The dump utility backup schedule priority',
      'The filesystem check (fsck) execution order at boot time',
      'The maximum number of mounts before automatic defragmentation',
      'The user quota allocation index'
    ],
    optionsFr: [
      'La priorité de sauvegarde par l\'outil dump',
      'L\'ordre de vérification du système de fichiers par fsck au démarrage',
      'Le nombre maximal de montages avant défragmentation automatique',
      'L\'index d\'allocation des quotas utilisateurs'
    ],
    correctIndex: 1,
    explanation: 'The 6th field is the `fsck` pass order: `1` for the root partition `/`, `2` for other local filesystems, and `0` to disable boot check.',
    explanationFr: 'Le 6ème champ détermine l\'ordre de vérification par `fsck` au démarrage : `1` pour la racine `/`, `2` pour les autres disques, et `0` pour désactiver la vérification.',
  },
  {
    id: 11,
    domainId: 'filesystems',
    topicId: 'topic-104',
    topicNumber: 104,
    objectiveId: '104.2',
    question: 'A disk reports "No space left on device" even though df shows 40% free disk capacity. Which command diagnoses if the filesystem has exhausted its available inode table?',
    questionFr: 'Un disque affiche l\'erreur "No space left on device" alors que `df` montre 40% d\'espace libre. Quelle commande permet de vérifier si la table des inodes est saturée ?',
    commandSnippet: '$ _____',
    options: ['df -i', 'du -sh /', 'tune2fs -l', 'lsattr -d'],
    optionsFr: ['df -i', 'du -sh /', 'tune2fs -l', 'lsattr -d'],
    correctIndex: 0,
    explanation: '`df -i` displays the number of free and used inodes instead of block storage space. Exhausting inodes prevents new file creation even when disk space is free.',
    explanationFr: '`df -i` affiche l\'utilisation de la table des inodes. L\'épuisement des inodes empêche la création de nouveaux fichiers même s\'il reste des gigaoctets d\'espace disque libre.',
  },

  // -------------------------------------------------------------
  // 4. BASH & SCRIPTING (3 Questions)
  // -------------------------------------------------------------
  {
    id: 12,
    domainId: 'bash',
    topicId: 'topic-105',
    topicNumber: 105,
    objectiveId: '105.1',
    question: 'In Bash, what is the key difference between enclosing a variable in double quotes (`"$VAR"`) versus single quotes (`\'$VAR\'`)?',
    questionFr: 'En Bash, quelle est la différence fondamentale entre entourer une variable de guillemets doubles (`"$VAR"`) et de guillemets simples (`\'$VAR\'`) ?',
    options: [
      'Double quotes allow parameter and command expansion; single quotes preserve the literal string',
      'Single quotes allow variable expansion; double quotes disable all expansions',
      'Double quotes can only be used inside if statements',
      'Single quotes convert strings to integer data types'
    ],
    optionsFr: [
      'Les guillemets doubles permettent l\'expansion des variables ($) ; les simples préservent la chaîne littérale brute',
      'Les guillemets simples permettent l\'expansion des variables ; les doubles la bloquent',
      'Les guillemets doubles ne sont autorisés que dans les instructions conditionnelles',
      'Les guillemets simples convertissent la chaîne en type entier'
    ],
    correctIndex: 0,
    explanation: 'Double quotes expand variables (`$VAR`) and command substitutions (`$(...)`), while single quotes treat every character literally without expansion.',
    explanationFr: 'Les guillemets doubles interprètent les variables (`$VAR`) et les substitutions, tandis que les apostrophes simples traitent tous les caractères de façon strictement littérale.',
  },
  {
    id: 13,
    domainId: 'bash',
    topicId: 'topic-105',
    topicNumber: 105,
    objectiveId: '105.2',
    question: 'Which special parameter holds the numeric exit status of the most recently executed foreground pipeline or command in Bash?',
    questionFr: 'Quelle variable spéciale contient le code de retour numérique de la toute dernière commande exécutée au premier plan en Bash ?',
    commandSnippet: 'echo $_____',
    options: ['?', '#', '!', '0'],
    optionsFr: ['?', '#', '!', '0'],
    correctIndex: 0,
    explanation: '`$?` returns the exit code of the last command: `0` denotes success, while non-zero values (1-255) indicate an error.',
    explanationFr: '`$?` contient le code de retour de la dernière commande : `0` indique le succès, tandis qu\'une valeur non nulle (1 à 255) signale une erreur.',
  },
  {
    id: 14,
    domainId: 'bash',
    topicId: 'topic-105',
    topicNumber: 105,
    objectiveId: '105.2',
    question: 'Which Bash test operator checks whether a target path exists AND is a regular file (not a directory or special device)?',
    questionFr: 'Quel opérateur de test dans une condition Bash permet de vérifier qu\'un chemin cible existe ET est un fichier ordinaire (et non un dossier) ?',
    commandSnippet: 'if [ _____ "$FILE" ]; then echo "OK"; fi',
    options: ['-f', '-d', '-e', '-s'],
    optionsFr: ['-f', '-d', '-e', '-s'],
    correctIndex: 0,
    explanation: '`-f file` is true if the file exists and is a regular file. (`-d` tests for a directory, `-e` tests existence of any type).',
    explanationFr: '`-f file` est vrai si le fichier existe et est un fichier ordinaire. (`-d` teste un dossier, `-e` teste l\'existence tous types confondus).',
  },

  // -------------------------------------------------------------
  // 5. RÉSEAU & CONNECTIVITÉ (3 Questions)
  // -------------------------------------------------------------
  {
    id: 15,
    domainId: 'networking',
    topicId: 'topic-109',
    topicNumber: 109,
    objectiveId: '109.1',
    question: 'How many usable host IP addresses are available in a standard `/24` IPv4 subnet mask (255.255.255.0)?',
    questionFr: 'Combien d\'adresses d\'hôtes utilisables sont disponibles dans un sous-réseau IPv4 standard en `/24` (masque 255.255.255.0) ?',
    options: ['254', '256', '255', '128'],
    optionsFr: ['254', '256', '255', '128'],
    correctIndex: 0,
    explanation: 'A `/24` subnet has 256 total IP addresses ($2^8$), minus 2 reserved addresses (network address .0 and broadcast address .255), giving 254 assignable hosts.',
    explanationFr: 'Un `/24` compte 256 adresses au total, moins l\'adresse réseau (.0) et l\'adresse de diffusion broadcast (.255), soit 254 adresses d\'hôtes configurables.',
  },
  {
    id: 16,
    domainId: 'networking',
    topicId: 'topic-109',
    topicNumber: 109,
    objectiveId: '109.2',
    question: 'Which modern iproute2 command displays all active listening TCP sockets with process names and numerical port numbers?',
    questionFr: 'Quelle commande moderne du paquet iproute2 permet d\'afficher toutes les connexions TCP actuellement en écoute (listening) avec les ports numériques et noms de processus ?',
    commandSnippet: '$ sudo _____',
    options: ['ss -tulpn', 'ip route show', 'netstat -arp', 'ifconfig -l'],
    optionsFr: ['ss -tulpn', 'ip route show', 'netstat -arp', 'ifconfig -l'],
    correctIndex: 0,
    explanation: '`ss -tulpn` displays TCP (`-t`), UDP (`-u`), listening sockets (`-l`), numeric ports (`-n`), and process owner information (`-p`).',
    explanationFr: '`ss -tulpn` liste les sockets TCP (`-t`), UDP (`-u`), en écoute (`-l`), avec résolution numérique des ports (`-n`) et noms de processus associés (`-p`).',
  },
  {
    id: 17,
    domainId: 'networking',
    topicId: 'topic-109',
    topicNumber: 109,
    objectiveId: '109.2',
    question: 'Which configuration file contains the IP addresses of DNS nameservers queried by the local system resolver for hostname resolution?',
    questionFr: 'Quel fichier de configuration système contient les adresses IP des serveurs DNS interrogés par la bibliothèque resolver pour résoudre les noms de domaine ?',
    commandSnippet: '$ cat _____',
    options: ['/etc/resolv.conf', '/etc/hosts', '/etc/nsswitch.conf', '/etc/network/interfaces'],
    optionsFr: ['/etc/resolv.conf', '/etc/hosts', '/etc/nsswitch.conf', '/etc/network/interfaces'],
    correctIndex: 0,
    explanation: '`/etc/resolv.conf` defines `nameserver` directives pointing to recursive DNS servers used to resolve hostnames to IP addresses.',
    explanationFr: '`/etc/resolv.conf` définit les directives `nameserver` avec les adresses IP des serveurs DNS interrogés pour résoudre les noms de domaine.',
  },

  // -------------------------------------------------------------
  // 6. SÉCURITÉ & PERMISSIONS (3 Questions)
  // -------------------------------------------------------------
  {
    id: 18,
    domainId: 'security',
    topicId: 'topic-110',
    topicNumber: 110,
    objectiveId: '110.1',
    question: 'What numerical octal permission gives the file owner Read/Write/Execute (rwx), group members Read/Execute (r-x), and other users No permissions (---)?',
    questionFr: 'Quelle valeur octale de permissions attribue au propriétaire Lecture/Écriture/Exécution (rwx), au groupe Lecture/Exécution (r-x), et aucun droit aux autres (---) ?',
    commandSnippet: '$ chmod _____ script.sh',
    options: ['750', '755', '640', '770'],
    optionsFr: ['750', '755', '640', '770'],
    correctIndex: 0,
    explanation: 'Owner `rwx` = 4+2+1 = 7; Group `r-x` = 4+0+1 = 5; Others `---` = 0. Therefore, the mode is 750.',
    explanationFr: 'Propriétaire `rwx` = 4+2+1 = 7 ; Groupe `r-x` = 4+0+1 = 5 ; Autres `---` = 0. Le mode octal est donc 750.',
  },
  {
    id: 19,
    domainId: 'security',
    topicId: 'topic-110',
    topicNumber: 110,
    objectiveId: '110.1',
    question: 'Which sensitive file stores encrypted user password hashes, expiration dates, and salt values, protected with strict root-only read permissions?',
    questionFr: 'Quel fichier sensible stocke les empreintes de mots de passe chiffrés, les dates d\'expiration et les sels, restreint en lecture au seul utilisateur root ?',
    commandSnippet: '$ sudo cat _____',
    options: ['/etc/shadow', '/etc/passwd', '/etc/security/pam_env.conf', '/var/log/secure'],
    optionsFr: ['/etc/shadow', '/etc/passwd', '/etc/security/pam_env.conf', '/var/log/secure'],
    correctIndex: 0,
    explanation: '`/etc/shadow` isolates encrypted passwords from the world-readable `/etc/passwd` file and is only readable by root (`000` or `640`).',
    explanationFr: '`/etc/shadow` isole les condensats chiffrés des mots de passe hors du fichier public `/etc/passwd`, et n\'est lisible que par root.',
  },
  {
    id: 20,
    domainId: 'security',
    topicId: 'topic-110',
    topicNumber: 110,
    objectiveId: '110.3',
    question: 'On an OpenSSH server, which file inside a user\'s home directory holds public keys authorized for passwordless key-based login?',
    questionFr: 'Sur un serveur OpenSSH, quel fichier placé dans le répertoire personnel de l\'utilisateur contient les clés publiques autorisées pour la connexion par clé ?',
    commandSnippet: '~/.ssh/_____',
    options: ['authorized_keys', 'known_hosts', 'id_rsa.pub', 'config'],
    optionsFr: ['authorized_keys', 'known_hosts', 'id_rsa.pub', 'config'],
    correctIndex: 0,
    explanation: '`~/.ssh/authorized_keys` stores the public keys allowed to authenticate into that specific user account (requires `chmod 600` permissions).',
    explanationFr: '`~/.ssh/authorized_keys` stocke les clés publiques autorisées à se connecter sur ce compte utilisateur (nécessite des permissions strictes `chmod 600`).',
  },
];

// Helper calculations & persistence
export const DIAGNOSTIC_STORAGE_KEY = 'lpi_diagnostic_result';
export const DIAGNOSTIC_DISMISSED_KEY = 'lpi_diagnostic_dismissed';

export function calculateDiagnosticResult(answers: Record<number, number>): DiagnosticResult {
  let totalCorrect = 0;

  const domainMap: Record<
    DiagnosticDomainId,
    { correct: number; total: number }
  > = {
    architecture: { correct: 0, total: 0 },
    commands: { correct: 0, total: 0 },
    filesystems: { correct: 0, total: 0 },
    bash: { correct: 0, total: 0 },
    networking: { correct: 0, total: 0 },
    security: { correct: 0, total: 0 },
  };

  diagnosticQuestions.forEach((q) => {
    domainMap[q.domainId].total += 1;
    if (answers[q.id] === q.correctIndex) {
      domainMap[q.domainId].correct += 1;
      totalCorrect += 1;
    }
  });

  const domainScores: DiagnosticDomainScore[] = DIAGNOSTIC_DOMAINS.map((domain) => {
    const stats = domainMap[domain.id];
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    let level: 'high' | 'medium' | 'low' = 'medium';
    if (pct >= 75) level = 'high';
    else if (pct < 50) level = 'low';

    const summaryNoteFr =
      level === 'high'
        ? 'Compétence solide. Révisions légères recommandées.'
        : level === 'medium'
        ? 'Notions présentes mais score perfectible. Consolidation requise.'
        : 'Priorité d\'apprentissage immédiate. Lacunes conceptuelles détectées.';

    const summaryNoteEn =
      level === 'high'
        ? 'Strong proficiency. Light recall maintenance suggested.'
        : level === 'medium'
        ? 'Foundational knowledge present. Consolidation needed.'
        : 'High-priority focus area. Immediate review recommended.';

    return {
      domainId: domain.id,
      name: domain.name,
      nameFr: domain.nameFr,
      totalQuestions: stats.total,
      correctQuestions: stats.correct,
      percentage: pct,
      level,
      associatedTopicId: domain.topicId,
      associatedTopicNumber: domain.topicNumber,
      summaryNoteFr,
      summaryNoteEn,
    };
  });

  // Calculate top 3 priorities: sort ascending by percentage, then by lowest correct
  const sortedByPriority = [...domainScores].sort((a, b) => {
    if (a.percentage !== b.percentage) return a.percentage - b.percentage;
    return a.correctQuestions - b.correctQuestions;
  });

  const topPriorities = sortedByPriority.slice(0, 3);

  const overallPercentage = Math.round((totalCorrect / diagnosticQuestions.length) * 100);

  return {
    completedAt: new Date().toISOString(),
    totalQuestions: diagnosticQuestions.length,
    correctAnswers: totalCorrect,
    percentage: overallPercentage,
    domainScores,
    topPriorities,
    answers,
  };
}

export function getStoredDiagnosticResult(): DiagnosticResult | null {
  try {
    const data = localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && Array.isArray(parsed.domainScores) && Array.isArray(parsed.topPriorities)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDiagnosticResult(result: DiagnosticResult): void {
  try {
    localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(result));
    localStorage.removeItem(DIAGNOSTIC_DISMISSED_KEY);
    // Dispatch event so other tabs and components update reactively
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save diagnostic result', err);
  }
}

export function clearDiagnosticResult(): void {
  try {
    localStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to clear diagnostic result', err);
  }
}
