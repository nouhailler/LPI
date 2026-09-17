# -*- coding: utf-8 -*-
"""
LPIC-1: 20 Matching Games (10 for Exam 101, 10 for Exam 102)
"""

matching_games_lpic1 = [
  # --- EXAM 101 ---
  {
    "id": "match-lpic1-01",
    "title": "POSIX Signals & Standard Signal Numbers",
    "titleFr": "Signaux POSIX & Numéros de signaux standards",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.5",
    "category": "Process Management",
    "description": "Match each official Linux signal name with its standard signal number.",
    "descriptionFr": "Associez chaque nom de signal officiel Linux à son numéro standard correspondant.",
    "pairs": [
      {"id": "p1", "left": "SIGHUP", "right": "Signal 1", "rightFr": "Signal 1", "note": "Hangup: reload configuration without stopping daemon", "noteFr": "Hangup : rechargement de configuration sans arrêt"},
      {"id": "p2", "left": "SIGINT", "right": "Signal 2", "rightFr": "Signal 2", "note": "Interrupt: emitted by Ctrl+C keyboard shortcut", "noteFr": "Interrupt : émis par le raccourci Ctrl+C"},
      {"id": "p3", "left": "SIGQUIT", "right": "Signal 3", "rightFr": "Signal 3", "note": "Quit: emitted by Ctrl+\\ with core dump generation", "noteFr": "Quit : émis par Ctrl+\\ avec core dump"},
      {"id": "p4", "left": "SIGKILL", "right": "Signal 9", "rightFr": "Signal 9", "note": "Kill immediate: cannot be caught or ignored", "noteFr": "Kill immédiat : non interceptable et non ignorable"},
      {"id": "p5", "left": "SIGTERM", "right": "Signal 15", "rightFr": "Signal 15", "note": "Termination standard: default signal for kill command", "noteFr": "Termination standard : signal par défaut de kill"},
      {"id": "p6", "left": "SIGCONT", "right": "Signal 18", "rightFr": "Signal 18", "note": "Continue: resumes a stopped process", "noteFr": "Continue : reprend un processus suspendu"},
      {"id": "p7", "left": "SIGSTOP", "right": "Signal 19", "rightFr": "Signal 19", "note": "Stop: suspends execution unconditionally", "noteFr": "Stop : suspend l'exécution sans interception possible"},
      {"id": "p8", "left": "SIGTSTP", "right": "Signal 20", "rightFr": "Signal 20", "note": "Terminal Stop: emitted by Ctrl+Z from terminal", "noteFr": "Terminal Stop : émis par Ctrl+Z depuis le terminal"}
    ]
  },
  {
    "id": "match-lpic1-02",
    "title": "FHS Standard: Official Role of Linux Root Directories",
    "titleFr": "Standard FHS : Rôle officiel des répertoires racine Linux",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.7",
    "category": "Filesystem Hierarchy Standard",
    "description": "Match each standard FHS directory to its canonical system purpose.",
    "descriptionFr": "Reliez chaque répertoire racine selon la norme FHS à sa fonction officielle.",
    "pairs": [
      {"id": "p1", "left": "/etc", "right": "Host-specific static configuration files", "rightFr": "Fichiers de configuration statiques de la machine", "note": "Editable system configuration files", "noteFr": "Fichiers de configuration système éditables"},
      {"id": "p2", "left": "/var", "right": "Variable data (logs, spools, caches, databases)", "rightFr": "Données variables (journaux, spools, bases de données)", "note": "Files whose size constantly changes", "noteFr": "Fichiers dont la taille évolue continuellement"},
      {"id": "p3", "left": "/opt", "right": "Add-on application software packages", "rightFr": "Logiciels applicatifs tiers autonomes (add-on)", "note": "Self-contained third-party installations", "noteFr": "Packages propriétaires ou autoportants"},
      {"id": "p4", "left": "/srv", "right": "Data served by system services (FTP, Web, Rsync)", "rightFr": "Données servies par les services réseau (FTP, Web, Rsync)", "note": "Site-specific data served by this system", "noteFr": "Données spécifiques servies par la machine"},
      {"id": "p5", "left": "/usr/local", "right": "Locally installed software by the administrator", "rightFr": "Programmes installés localement par l'administrateur", "note": "Not overwritten by distribution package manager", "noteFr": "Non écrasé par le gestionnaire de paquets"},
      {"id": "p6", "left": "/proc", "right": "Virtual filesystem for process and kernel runtime state", "rightFr": "Système de fichiers virtuel des processus et du noyau", "note": "Dynamically generated in RAM", "noteFr": "Généré dynamiquement en mémoire vive"},
      {"id": "p7", "left": "/sys", "right": "Sysfs representation of kernel device drivers", "rightFr": "Arborescence sysfs des périphériques et pilotes du noyau", "note": "Unified kernel driver model", "noteFr": "Modèle unifié de pilotes du noyau Linux"}
    ]
  },
  {
    "id": "match-lpic1-03",
    "title": "SysVinit Runlevels & Systemd Target Units",
    "titleFr": "Niveaux d'exécution SysVinit & Cibles Systemd",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.3",
    "category": "System Architecture",
    "description": "Match traditional SysVinit runlevels (0 to 6) with their modern systemd target equivalents.",
    "descriptionFr": "Associez les niveaux d'exécution traditionnels SysVinit (0 à 6) à leurs cibles Systemd équivalentes.",
    "pairs": [
      {"id": "p1", "left": "Runlevel 0", "right": "poweroff.target", "rightFr": "poweroff.target", "note": "Halts and powers off the system", "noteFr": "Arrêt complet et extinction électrique"},
      {"id": "p2", "left": "Runlevel 1 / S", "right": "rescue.target", "rightFr": "rescue.target", "note": "Single-user mode for maintenance without networking", "noteFr": "Mode mono-utilisateur pour maintenance sans réseau"},
      {"id": "p3", "left": "Runlevel 3", "right": "multi-user.target", "rightFr": "multi-user.target", "note": "Standard multi-user CLI mode with networking", "noteFr": "Mode multi-utilisateur console standard avec réseau"},
      {"id": "p4", "left": "Runlevel 5", "right": "graphical.target", "rightFr": "graphical.target", "note": "Multi-user mode with GUI display manager", "noteFr": "Mode multi-utilisateur avec interface graphique"},
      {"id": "p5", "left": "Runlevel 6", "right": "reboot.target", "rightFr": "reboot.target", "note": "Reboots the system cleanly", "noteFr": "Redémarrage propre de la machine"},
      {"id": "p6", "left": "Emergency Mode", "right": "emergency.target", "rightFr": "emergency.target", "note": "Minimal shell with root filesystem mounted read-only", "noteFr": "Shell minimal avec racine montée en lecture seule"}
    ]
  },
  {
    "id": "match-lpic1-04",
    "title": "Tar Options & Compression Tools",
    "titleFr": "Options de l'outil Tar & Outils de compression",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.3",
    "category": "GNU & Unix Commands",
    "description": "Match each tar command option with its compression algorithm or archive operation.",
    "descriptionFr": "Associez chaque option de la commande tar à son algorithme de compression ou son opération.",
    "pairs": [
      {"id": "p1", "left": "-c (--create)", "right": "Create a new archive", "rightFr": "Créer une nouvelle archive", "note": "Packs files into a tape archive file", "noteFr": "Empaquette des fichiers dans un conteneur tar"},
      {"id": "p2", "left": "-x (--extract)", "right": "Extract files from an archive", "rightFr": "Extraire des fichiers depuis une archive", "note": "Unpacks archive contents to destination", "noteFr": "Décompresse les fichiers vers la destination"},
      {"id": "p3", "left": "-z (--gzip)", "right": "Compress/decompress using gzip (.tar.gz / .tgz)", "rightFr": "Compression/décompression via gzip (.tar.gz / .tgz)", "note": "Standard fast compression algorithm", "noteFr": "Algorithme standard rapide"},
      {"id": "p4", "left": "-j (--bzip2)", "right": "Compress/decompress using bzip2 (.tar.bz2 / .tbz2)", "rightFr": "Compression/décompression via bzip2 (.tar.bz2 / .tbz2)", "note": "Higher compression ratio than gzip", "noteFr": "Meilleur taux de compression que gzip"},
      {"id": "p5", "left": "-J (--xz)", "right": "Compress/decompress using xz (.tar.xz / .txz)", "rightFr": "Compression/décompression via xz (.tar.xz / .txz)", "note": "LZMA2 algorithm for maximum compression", "noteFr": "Algorithme LZMA2 à taux de compression maximal"},
      {"id": "p6", "left": "-t (--list)", "right": "List the contents of an archive without extracting", "rightFr": "Lister le contenu de l'archive sans l'extraire", "note": "Inspects archive TOC", "noteFr": "Inspecte la table des matières de l'archive"},
      {"id": "p7", "left": "-p (--preserve-permissions)", "right": "Preserve file permissions and ownership attributes", "rightFr": "Conserver les permissions et attributs d'origine", "note": "Essential for root system backups", "noteFr": "Indispensable pour les sauvegardes système"}
    ]
  },
  {
    "id": "match-lpic1-05",
    "title": "Special Permissions & Octal Values (SUID, SGID, Sticky Bit)",
    "titleFr": "Permissions spéciales & Valeurs octales (SUID, SGID, Sticky Bit)",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.5",
    "category": "Devices & Filesystems",
    "description": "Match special permission types and octal values with their behavioral impact.",
    "descriptionFr": "Associez les types de permissions spéciales et leurs valeurs octales à leurs impacts concrets.",
    "pairs": [
      {"id": "p1", "left": "Octal 4000 (SUID)", "right": "Executes with the UID of the file owner (e.g., /usr/bin/passwd)", "rightFr": "S'exécute avec l'UID du propriétaire (ex: /usr/bin/passwd)", "note": "Represented by 's' in user execute position", "noteFr": "Représenté par 's' sur les droits propriétaire"},
      {"id": "p2", "left": "Octal 2000 on file (SGID)", "right": "Executes with the GID of the file group owner", "rightFr": "S'exécute avec le GID du groupe propriétaire", "note": "Represented by 's' in group execute position", "noteFr": "Représenté par 's' sur les droits groupe"},
      {"id": "p3", "left": "Octal 2000 on directory (SGID)", "right": "New files created inside inherit the parent directory's group", "rightFr": "Les nouveaux fichiers héritent du groupe du répertoire parent", "note": "Crucial for collaborative group directories", "noteFr": "Essentiel pour les espaces partagés d'équipe"},
      {"id": "p4", "left": "Octal 1000 on directory (Sticky Bit)", "right": "Only file owner or root can delete or rename files (e.g., /tmp)", "rightFr": "Seul le propriétaire du fichier ou root peut le supprimer (ex: /tmp)", "note": "Represented by 't' in other execute position", "noteFr": "Représenté par 't' sur les droits autres"},
      {"id": "p5", "left": "Capital 'S' in ls -l", "right": "SUID or SGID is set, but the execute bit (x) is missing", "rightFr": "SUID ou SGID actif, mais le bit d'exécution (x) est absent", "note": "Indicates permission misconfiguration", "noteFr": "Indique une anomalie de configuration"},
      {"id": "p6", "left": "Capital 'T' in ls -l", "right": "Sticky bit is set, but the others execute bit (x) is missing", "rightFr": "Sticky bit actif, mais le bit d'exécution autre (x) est absent", "note": "chmod 1776 instead of 1777", "noteFr": "chmod 1776 au lieu de 1777"}
    ]
  },
  {
    "id": "match-lpic1-06",
    "title": "Debian Package Management Commands (dpkg & apt)",
    "titleFr": "Commandes de gestion des paquets Debian (dpkg & apt)",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.4",
    "category": "Linux Installation & Packages",
    "description": "Match low-level dpkg and high-level apt commands to their exact package operations.",
    "descriptionFr": "Associez les commandes de bas niveau dpkg et de haut niveau apt à leurs opérations exactes.",
    "pairs": [
      {"id": "p1", "left": "dpkg -i package.deb", "right": "Install or upgrade a local .deb binary file", "rightFr": "Installer ou mettre à jour un paquet .deb local", "note": "Does not automatically resolve remote dependencies", "noteFr": "Ne résout pas automatiquement les dépendances distantes"},
      {"id": "p2", "left": "dpkg -r package", "right": "Remove package binaries but preserve configuration files", "rightFr": "Supprimer les binaires mais conserver les fichiers de configuration", "note": "Configuration files in /etc remain intact", "noteFr": "Les fichiers de configuration /etc sont conservés"},
      {"id": "p3", "left": "dpkg -P package", "right": "Purge package entirely including all configuration files", "rightFr": "Purger intégralement le paquet et ses fichiers de configuration", "note": "Deletes binaries and /etc files", "noteFr": "Supprime binaires et configurations"},
      {"id": "p4", "left": "dpkg -S /path/to/file", "right": "Identify which installed package owns a given file", "rightFr": "Identifier quel paquet installé est propriétaire d'un fichier", "note": "Searches local dpkg database", "noteFr": "Recherche dans la base locale dpkg"},
      {"id": "p5", "left": "dpkg -L package", "right": "List all installed files provided by a package", "rightFr": "Lister tous les fichiers installés par un paquet", "note": "Shows file paths installed on system", "noteFr": "Affiche les chemins des fichiers déployés"},
      {"id": "p6", "left": "apt update", "right": "Resynchronize package index files from remote repositories", "rightFr": "Resynchroniser les index de paquets depuis les dépôts distants", "note": "Downloads fresh metadata from /etc/apt/sources.list", "noteFr": "Télécharge les métadonnées depuis sources.list"},
      {"id": "p7", "left": "apt full-upgrade", "right": "Upgrade all packages and handle changing dependencies (removals if needed)", "rightFr": "Mettre à niveau tous les paquets en gérant les suppressions si requis", "note": "More comprehensive than apt upgrade", "noteFr": "Plus complet que apt upgrade"}
    ]
  },
  {
    "id": "match-lpic1-07",
    "title": "Red Hat Package Management (RPM & YUM/DNF)",
    "titleFr": "Gestion des paquets Red Hat (RPM & YUM/DNF)",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.5",
    "category": "Linux Installation & Packages",
    "description": "Match RPM options and DNF commands to their specific package administration actions.",
    "descriptionFr": "Associez les options RPM et commandes DNF à leurs actions d'administration de paquets.",
    "pairs": [
      {"id": "p1", "left": "rpm -ivh package.rpm", "right": "Install package with verbose progress hash marks", "rightFr": "Installer le paquet avec affichage de la progression par dièses", "note": "Standard command for first-time installation", "noteFr": "Installation initiale standard"},
      {"id": "p2", "left": "rpm -Uvh package.rpm", "right": "Upgrade existing package or install if not already present", "rightFr": "Mettre à jour un paquet ou l'installer s'il est absent", "note": "Preferred over -i for updates", "noteFr": "Recommandé par rapport à -i pour les mises à jour"},
      {"id": "p3", "left": "rpm -qa", "right": "Query and list all currently installed packages on system", "rightFr": "Interroger et lister tous les paquets installés sur la machine", "note": "Outputs all installed RPM package names", "noteFr": "Affiche la liste complète des RPM installés"},
      {"id": "p4", "left": "rpm -qf /path/to/file", "right": "Find which installed RPM package owns a specific file", "rightFr": "Trouver quel paquet RPM installé fournit un fichier donné", "note": "Inverse file lookup in RPM database", "noteFr": "Recherche inversée dans la base RPM"},
      {"id": "p5", "left": "rpm -ql package", "right": "List all files installed by a specific package name", "rightFr": "Lister l'ensemble des fichiers installés par un paquet", "note": "Query file list", "noteFr": "Interroge la liste des fichiers"},
      {"id": "p6", "left": "dnf provides command", "right": "Find which repository package provides a binary or file", "rightFr": "Trouver quel paquet du dépôt fournit un binaire ou fichier", "note": "Equivalent to repoquery --whatprovides", "noteFr": "Identifie le paquet fournissant une commande"},
      {"id": "p7", "left": "rpm2cpio file.rpm | cpio -idmv", "right": "Extract files from RPM archive without installing it", "rightFr": "Extraire les fichiers d'un RPM sans l'installer", "note": "Useful for emergency file extraction", "noteFr": "Utile pour extraire un fichier en urgence"}
    ]
  },
  {
    "id": "match-lpic1-08",
    "title": "Regex Metacharacters (Basic & Extended)",
    "titleFr": "Métacaractères d'expressions rationnelles (BRE & ERE)",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.7",
    "category": "GNU & Unix Commands",
    "description": "Match regex metacharacters with their pattern matching definitions.",
    "descriptionFr": "Associez les métacaractères d'expressions régulières à leurs définitions.",
    "pairs": [
      {"id": "p1", "left": "^ (Caret)", "right": "Anchors pattern to the beginning of a line", "rightFr": "Ancre le motif au début d'une ligne", "note": "^root matches lines starting with 'root'", "noteFr": "^root correspond aux lignes débutant par 'root'"},
      {"id": "p2", "left": "$ (Dollar)", "right": "Anchors pattern to the end of a line", "rightFr": "Ancre le motif à la fin d'une ligne", "note": "bash$ matches lines ending with 'bash'", "noteFr": "bash$ correspond aux lignes finissant par 'bash'"},
      {"id": "p3", "left": ". (Dot)", "right": "Matches any single character except newline", "rightFr": "Correspond à n'importe quel caractère unique sauf retour ligne", "note": "Wildcard for exactly one character", "noteFr": "Joker pour exactement un caractère"},
      {"id": "p4", "left": "* (Asterisk)", "right": "Matches preceding element zero or more times", "rightFr": "Correspond à l'élément précédent zéro ou plusieurs fois", "note": "a* matches '', 'a', 'aa', 'aaa'", "noteFr": "Quantificateur de répétition 0 à N fois"},
      {"id": "p5", "left": "+ (Plus - ERE)", "right": "Matches preceding element one or more times", "rightFr": "Correspond à l'élément précédent une ou plusieurs fois", "note": "Requires egrep or grep -E", "noteFr": "Requiert egrep ou grep -E (au moins 1 occurrence)"},
      {"id": "p6", "left": "? (Question mark - ERE)", "right": "Matches preceding element zero or one time (optional)", "rightFr": "Correspond à l'élément précédent zéro ou une fois (optionnel)", "note": "Optional quantifier", "noteFr": "Quantificateur d'élément optionnel"},
      {"id": "p7", "left": "[^abc]", "right": "Negated character class: matches any character except a, b, or c", "rightFr": "Classe inversée : correspond à tout caractère sauf a, b ou c", "note": "Exclusion list inside square brackets", "noteFr": "Exclusion de caractères entre crochets"}
    ]
  },
  {
    "id": "match-lpic1-09",
    "title": "Text Processing & Filter Commands",
    "titleFr": "Commandes de traitement de texte & Filtres Linux",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.2",
    "category": "GNU & Unix Commands",
    "description": "Match GNU text filtering utilities to their primary function in a pipeline.",
    "descriptionFr": "Associez les utilitaires GNU de traitement de texte à leur fonction dans un pipeline.",
    "pairs": [
      {"id": "p1", "left": "cut -d: -f1", "right": "Extracts the first field using ':' as delimiter", "rightFr": "Extrait le premier champ avec ':' comme délimiteur", "note": "Commonly used on /etc/passwd", "noteFr": "Couramment utilisé sur /etc/passwd"},
      {"id": "p2", "left": "sort -n -r", "right": "Sorts lines numerically in reverse descending order", "rightFr": "Trie les lignes par valeur numérique décroissante", "note": "Sorts numbers from highest to lowest", "noteFr": "Du plus grand au plus petit nombre"},
      {"id": "p3", "left": "uniq -c", "right": "Prefixes lines by the number of consecutive occurrences", "rightFr": "Préfixe chaque ligne par son nombre d'occurrences consécutives", "note": "Requires prior sorting with sort", "noteFr": "Nécessite un tri préalable avec sort"},
      {"id": "p4", "left": "tr 'a-z' 'A-Z'", "right": "Translates all lowercase characters to uppercase", "rightFr": "Convertit tous les caractères minuscules en majuscules", "note": "Operates purely on standard input stream", "noteFr": "Opère sur le flux standard d'entrée"},
      {"id": "p5", "left": "wc -l", "right": "Counts and displays only the number of lines", "rightFr": "Compte et affiche uniquement le nombre de lignes", "note": "Word count line counter", "noteFr": "Compteur de lignes"},
      {"id": "p6", "left": "tee -a file.txt", "right": "Duplicates stdout to display and appends to a file simultaneously", "rightFr": "Duplique la sortie écran et l'ajoute en fin de fichier simultanément", "note": "T-junction pipeline tool with append mode", "noteFr": "Bifurcation de flux avec mode ajout"}
    ]
  },
  {
    "id": "match-lpic1-10",
    "title": "Partition Table Standards & Filesystem Types",
    "titleFr": "Types de tables de partitionnement & Systèmes de fichiers",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.1",
    "category": "Devices & Filesystems",
    "description": "Match disk partition structures and filesystem types with their technical specifications.",
    "descriptionFr": "Associez les structures de partitionnement et systèmes de fichiers à leurs caractéristiques.",
    "pairs": [
      {"id": "p1", "left": "MBR Partition Table", "right": "Limited to 4 primary partitions and 2 TiB maximum disk size", "rightFr": "Limité à 4 partitions primaires et 2 Tio par disque", "note": "Legacy BIOS standard partition table", "noteFr": "Standard historique BIOS"},
      {"id": "p2", "left": "GPT Partition Table", "right": "Supports 128+ partitions, disks > 2 TiB, and uses UUIDs with CRC32", "rightFr": "Supporte 128+ partitions, disques > 2 Tio et utilise GUID/CRC32", "note": "Modern UEFI standard partition table", "noteFr": "Standard moderne UEFI"},
      {"id": "p3", "left": "ESP (EFI System Partition)", "right": "FAT32 partition containing UEFI bootloaders and kernel stubs", "rightFr": "Partition FAT32 contenant les chargeurs de démarrage UEFI", "note": "Mounted at /boot/efi", "noteFr": "Montée sur /boot/efi"},
      {"id": "p4", "left": "Ext4 Filesystem", "right": "Linux native journaling filesystem with extents and backward compatibility", "rightFr": "Système de fichiers journalisé Linux avec extents", "note": "Default on Debian and Ubuntu", "noteFr": "Standard Debian et Ubuntu"},
      {"id": "p5", "left": "XFS Filesystem", "right": "High-performance 64-bit journaling filesystem optimized for parallel I/O", "rightFr": "Système 64 bits haute performance optimisé pour les E/S parallèles", "note": "Default filesystem on RHEL and CentOS", "noteFr": "Système par défaut sous RHEL et CentOS"},
      {"id": "p6", "left": "Linux Swap", "right": "Dedicated disk space used as virtual memory when RAM is exhausted", "rightFr": "Espace disque dédié servant de mémoire virtuelle en cas de saturation", "note": "Managed with mkswap and swapon", "noteFr": "Initialisé avec mkswap et swapon"}
    ]
  },

  # --- EXAM 102 ---
  {
    "id": "match-lpic1-11",
    "title": "Standard Exit Codes (POSIX & Bash)",
    "titleFr": "Codes de sortie standards (Exit Codes Bash & POSIX)",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.2",
    "category": "Shell Scripting",
    "description": "Match each shell return exit code ($?) to its conventional meaning in Linux.",
    "descriptionFr": "Associez chaque valeur de code retour $? à sa signification conventionnelle sous Linux.",
    "pairs": [
      {"id": "p1", "left": "Exit Code 0", "right": "Complete success with no errors", "rightFr": "Succès complet sans aucune anomalie", "note": "Standard UNIX zero-exit success", "noteFr": "Convention UNIX de terminaison réussie"},
      {"id": "p2", "left": "Exit Code 1", "right": "General catchall error or unspecified failure", "rightFr": "Erreur générale ou échec standard non spécifié", "note": "Standard generic command error", "noteFr": "Erreur standard d'une commande"},
      {"id": "p3", "left": "Exit Code 2", "right": "Misuse of shell built-in or keyword syntax error", "rightFr": "Mauvais usage d'un mot-clé ou erreur de syntaxe shell", "note": "Missing or illegal argument", "noteFr": "Argument manquant ou invalide"},
      {"id": "p4", "left": "Exit Code 126", "right": "Command invoked cannot execute (permission denied / not executable)", "rightFr": "Commande trouvée mais non exécutable (droits d'exécution manquants)", "note": "File exists but lacks +x execution bit", "noteFr": "Fichier présent mais sans bit +x"},
      {"id": "p5", "left": "Exit Code 127", "right": "Command not found in PATH or wrong path specified", "rightFr": "Commande introuvable dans le PATH ou chemin erroné", "note": "No such binary in directories listed in $PATH", "noteFr": "Aucun binaire trouvé dans le $PATH"},
      {"id": "p6", "left": "Exit Code 130", "right": "Script or command terminated by Control+C (SIGINT = 128 + 2)", "rightFr": "Commande interrompue par Ctrl+C (SIGINT = 128 + 2)", "note": "Fatal signal termination rule (128 + N)", "noteFr": "Règle UNIX 128 + numéro de signal"}
    ]
  },
  {
    "id": "match-lpic1-12",
    "title": "Essential Shell Environment Variables",
    "titleFr": "Variables d'environnement Shell indispensables",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.1",
    "category": "Shells & Scripting",
    "description": "Match standard Bash environment variables to their system role.",
    "descriptionFr": "Associez les variables d'environnement Bash standards à leur rôle système.",
    "pairs": [
      {"id": "p1", "left": "$PATH", "right": "Colon-separated list of directories searched for executable commands", "rightFr": "Liste de répertoires séparés par ':' où chercher les exécutables", "note": "Defines binary search order", "noteFr": "Ordre de recherche des commandes"},
      {"id": "p2", "left": "$HOME", "right": "Absolute path to current user's home directory", "rightFr": "Chemin absolu vers le répertoire personnel de l'utilisateur", "note": "Tilde (~) expands to $HOME", "noteFr": "Le tilde (~) se résout vers $HOME"},
      {"id": "p3", "left": "$HISTSIZE", "right": "Maximum number of commands remembered in memory during active session", "rightFr": "Nombre maximum de commandes conservées en mémoire vive pendant la session", "note": "Controls in-memory history buffer", "noteFr": "Taille de l'historique en mémoire"},
      {"id": "p4", "left": "$HISTFILESIZE", "right": "Maximum number of lines stored in the persistent ~/.bash_history file", "rightFr": "Nombre maximum de lignes stockées dans le fichier ~/.bash_history", "note": "Controls disk history file length", "noteFr": "Taille maximale sur disque"},
      {"id": "p5", "left": "$PS1", "right": "Defines the primary interactive shell prompt format and styling", "rightFr": "Définit le format d'affichage de l'invite de commande principale", "note": "Prompt string 1 (e.g. \\u@\\h:\\w\\$ )", "noteFr": "Format du prompt utilisateur"},
      {"id": "p6", "left": "$LD_LIBRARY_PATH", "right": "Colon-separated paths searched for dynamic shared libraries at runtime", "rightFr": "Chemins supplémentaires explorés pour charger les bibliothèques partagées", "note": "Overrides /etc/ld.so.conf for user session", "noteFr": "Surcharge temporaire pour le lieur dynamique ld.so"}
    ]
  },
  {
    "id": "match-lpic1-13",
    "title": "Display Servers & Graphical Protocols (X11 & Wayland)",
    "titleFr": "Serveurs d'affichage & Protocoles graphiques (X11 & Wayland)",
    "certification": "lpic-1",
    "topicNumber": 106,
    "objectiveId": "106.1",
    "category": "User Interfaces & Desktops",
    "description": "Match graphical display server components and protocols with their responsibilities.",
    "descriptionFr": "Associez les composants et protocoles des serveurs graphiques à leurs responsabilités.",
    "pairs": [
      {"id": "p1", "left": "X.Org Server (X11)", "right": "Network-transparent display server using client-server architecture", "rightFr": "Serveur d'affichage réseau transparent basé sur une architecture client-serveur", "note": "Traditional Linux graphic display system", "noteFr": "Serveur d'affichage historique Linux"},
      {"id": "p2", "left": "Wayland", "right": "Modern lightweight display protocol where the compositor is the display server", "rightFr": "Protocole moderne où le compositeur fait directement office de serveur d'affichage", "note": "Direct rendering without intermediate X server", "noteFr": "Rendu direct sans intermédiaire X"},
      {"id": "p3", "left": "Display Manager (GDM/LightDM/SDDM)", "right": "Provides graphical login screen and starts user desktop session", "rightFr": "Fournit l'écran de connexion graphique et lance la session utilisateur", "note": "Handles authentication on VT", "noteFr": "Gère l'authentification graphique"},
      {"id": "p4", "left": "$DISPLAY (:0.0)", "right": "Specifies the hostname and display number for X11 client connections", "rightFr": "Indique le serveur d'affichage et l'écran cible pour les applications X11", "note": "Required for remote X forwarding (ssh -X)", "noteFr": "Requis pour le déport X11 via SSH"},
      {"id": "p5", "left": "~/.xinitrc", "right": "Shell script executed when starting X session manually with startx", "rightFr": "Script shell exécuté lors du lancement manuel d'une session X via startx", "note": "Defines window manager to launch", "noteFr": "Définit le gestionnaire de fenêtres à démarrer"},
      {"id": "p6", "left": "Xwayland", "right": "Compatibility compatibility layer allowing legacy X11 apps to run on Wayland", "rightFr": "Couche de rétrocompatibilité exécutant les applications X11 sous Wayland", "note": "Embedded X server inside Wayland compositor", "noteFr": "Serveur X intégré au compositeur Wayland"}
    ]
  },
  {
    "id": "match-lpic1-14",
    "title": "User Account & Authentication Configuration Files",
    "titleFr": "Fichiers de configuration des comptes & Authentification",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.1",
    "category": "Administrative Tasks",
    "description": "Match critical user and group configuration files to their stored contents.",
    "descriptionFr": "Associez les fichiers critiques de gestion des utilisateurs à leur contenu.",
    "pairs": [
      {"id": "p1", "left": "/etc/passwd", "right": "World-readable account database (username, UID, GID, GECOS, home, shell)", "rightFr": "Base des comptes lisible par tous (identifiant, UID, GID, GECOS, home, shell)", "note": "7 colon-separated fields", "noteFr": "7 champs séparés par des deux-points"},
      {"id": "p2", "left": "/etc/shadow", "right": "Restricted file storing salted password hashes and password expiration aging", "rightFr": "Fichier restreint stockant les hashs de mots de passe salés et leur expiration", "note": "Readable only by root (permissions 0640 or 0000)", "noteFr": "Lisible uniquement par root"},
      {"id": "p3", "left": "/etc/group", "right": "Defines system groups and their secondary member user lists", "rightFr": "Définit les groupes système et la liste de leurs utilisateurs membres secondaires", "note": "group_name:password:GID:user_list", "noteFr": "Structure à 4 champs séparés par ':'"},
      {"id": "p4", "left": "/etc/gshadow", "right": "Secure group file containing encrypted group passwords and group administrators", "rightFr": "Fichier sécurisé contenant les mots de passe de groupe et administrateurs", "note": "Companion to /etc/group", "noteFr": "Équivalent de /etc/shadow pour les groupes"},
      {"id": "p5", "left": "/etc/skel", "right": "Template directory whose files are copied into a newly created user's home", "rightFr": "Modèle de répertoire copié dans le dossier personnel d'un nouvel utilisateur", "note": "Populates .bashrc, .profile, etc.", "noteFr": "Alimente .bashrc, .profile, etc."},
      {"id": "p6", "left": "/etc/default/useradd", "right": "Default parameters for useradd (default shell, skeleton, home base, group)", "rightFr": "Paramètres par défaut de la commande useradd (shell, dossier personnel)", "note": "Configured via useradd -D", "noteFr": "Consultable via useradd -D"}
    ]
  },
  {
    "id": "match-lpic1-15",
    "title": "Task Scheduling: Crontab Syntax & Anacron",
    "titleFr": "Planification de tâches : Syntaxe Crontab & Anacron",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.2",
    "category": "Administrative Tasks",
    "description": "Match cron time fields and anacron configuration files to their execution schedule.",
    "descriptionFr": "Associez les champs temporels de crontab et fichiers anacron à leur planification.",
    "pairs": [
      {"id": "p1", "left": "Field 1 of Crontab", "right": "Minute of the hour (0 - 59)", "rightFr": "Minute de l'heure (0 - 59)", "note": "First temporal column", "noteFr": "Première colonne temporelle"},
      {"id": "p2", "left": "Field 2 of Crontab", "right": "Hour of the day (0 - 23)", "rightFr": "Heure du jour (0 - 23)", "note": "24-hour format", "noteFr": "Format 24 heures"},
      {"id": "p3", "left": "Field 3 of Crontab", "right": "Day of the month (1 - 31)", "rightFr": "Jour du mois (1 - 31)", "note": "Calendar day", "noteFr": "Jour calendaire"},
      {"id": "p4", "left": "Field 4 of Crontab", "right": "Month of the year (1 - 12)", "rightFr": "Mois de l'année (1 - 12)", "note": "Calendar month or JAN-DEC", "noteFr": "Mois calendaire ou JAN-DEC"},
      {"id": "p5", "left": "Field 5 of Crontab", "right": "Day of the week (0 - 7, where 0 and 7 are Sunday)", "rightFr": "Jour de la semaine (0 - 7, où 0 et 7 représentent dimanche)", "note": "SUN-SAT or 0-7", "noteFr": "Dimanche à Samedi"},
      {"id": "p6", "left": "/etc/anacrontab", "right": "Schedules tasks that execute even if machine was powered off at schedule time", "rightFr": "Planifie des tâches exécutées même si la machine était éteinte à l'heure prévue", "note": "Format: period in days, delay in min, job-id, cmd", "noteFr": "Idéal pour postes de travail et portables"}
    ]
  },
  {
    "id": "match-lpic1-16",
    "title": "Syslog RFC 5424 Severity Levels",
    "titleFr": "Niveaux de sévérité Syslog RFC 5424",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.2",
    "category": "Essential System Services",
    "description": "Match numerical Syslog severity codes (0 through 7) to their official syslog priority names.",
    "descriptionFr": "Associez les codes numériques de sévérité Syslog (0 à 7) à leurs noms de priorité officiels.",
    "pairs": [
      {"id": "p1", "left": "Severity 0", "right": "Emergency (emerg) - System is completely unusable", "rightFr": "Emergency (emerg) : Système totalement inutilisable", "note": "Panic state broadcast to all consoles", "noteFr": "État de panique absolue du système"},
      {"id": "p2", "left": "Severity 1", "right": "Alert (alert) - Immediate action must be taken", "rightFr": "Alert (alert) : Action corrective immédiate requise", "note": "Corrupted database or failed hardware", "noteFr": "Base corrompue ou panne matérielle"},
      {"id": "p3", "left": "Severity 2", "right": "Critical (crit) - Critical conditions in primary system components", "rightFr": "Critical (crit) : Conditions critiques d'un composant système", "note": "Hard device errors", "noteFr": "Erreurs graves sur périphérique"},
      {"id": "p4", "left": "Severity 3", "right": "Error (err / error) - Error conditions preventing normal operation", "rightFr": "Error (err / error) : Conditions d'erreur empêchant un fonctionnement", "note": "Non-urgent service failure", "noteFr": "Échec non urgent d'un service"},
      {"id": "p5", "left": "Severity 4", "right": "Warning (warning / warn) - Warning conditions indicating potential issues", "rightFr": "Warning (warning / warn) : Avertissement sur une anomalie potentielle", "note": "Approaching resource threshold", "noteFr": "Seuil de ressource approché"},
      {"id": "p6", "left": "Severity 5 & 6", "right": "Notice (notice) & Informational (info) - Normal operational events", "rightFr": "Notice (notice) & Informational (info) : Événements normaux du système", "note": "Service started, user login", "noteFr": "Démarrage de service, connexion utilisateur"},
      {"id": "p7", "left": "Severity 7", "right": "Debug (debug) - Verbose debug-level messages for troubleshooting", "rightFr": "Debug (debug) : Messages détaillés de mise au point et diagnostic", "note": "Highest verbosity logging", "noteFr": "Niveau de traçabilité le plus verbeux"}
    ]
  },
  {
    "id": "match-lpic1-17",
    "title": "System Time & Clock Synchronization Utilities",
    "titleFr": "Outils de synchronisation d'horloge & Temps système",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.1",
    "category": "Essential System Services",
    "description": "Match time management commands and configuration files to their exact operations.",
    "descriptionFr": "Associez les commandes de gestion du temps et fichiers à leurs opérations exactes.",
    "pairs": [
      {"id": "p1", "left": "timedatectl set-ntp true", "right": "Enables network time synchronization via systemd-timesyncd or chrony", "rightFr": "Active la synchronisation temporelle réseau via timesyncd ou chrony", "note": "Controls systemd SNTP client", "noteFr": "Active le client SNTP systemd"},
      {"id": "p2", "left": "hwclock -w (--systohc)", "right": "Copies current software system time into the hardware RTC clock", "rightFr": "Copie l'heure système logicielle vers l'horloge matérielle RTC", "note": "Persists time across poweroffs", "noteFr": "Pérennise l'heure hors tension"},
      {"id": "p3", "left": "hwclock -s (--hctosys)", "right": "Sets the system software clock from the hardware RTC clock", "rightFr": "Règle l'heure logicielle à partir de l'horloge matérielle RTC", "note": "Used during boot before NTP starts", "noteFr": "Utilisé au boot avant l'accès réseau"},
      {"id": "p4", "left": "/etc/timezone or /etc/localtime", "right": "Configures the system's active local timezone (symlink to /usr/share/zoneinfo)", "rightFr": "Définit le fuseau horaire actif (lien symbolique vers /usr/share/zoneinfo)", "note": "Managed by timedatectl set-timezone", "noteFr": "Géré via timedatectl set-timezone"},
      {"id": "p5", "left": "chronyc sources -v", "right": "Displays detailed status of active NTP time servers and offsets", "rightFr": "Affiche le statut détaillé des serveurs de temps NTP et le décalage", "note": "Shows stratum, reachability, delay", "noteFr": "Affiche strate, joignabilité et délai"}
    ]
  },
  {
    "id": "match-lpic1-18",
    "title": "Standard LPI Network Ports & Protocols",
    "titleFr": "Ports réseau standards LPI & Protocoles",
    "certification": "lpic-1",
    "topicNumber": 109,
    "objectiveId": "109.1",
    "category": "Networking Fundamentals",
    "description": "Match official TCP/UDP port numbers to their standard network protocols.",
    "descriptionFr": "Associez les numéros de ports TCP/UDP officiels aux protocoles réseau correspondants.",
    "pairs": [
      {"id": "p1", "left": "Port 22 TCP", "right": "SSH (Secure Shell) & SFTP secure transfer", "rightFr": "SSH (Secure Shell) & Transfert chiffré SFTP", "note": "Secure remote administrative shell", "noteFr": "Shell distant chiffré"},
      {"id": "p2", "left": "Port 25 TCP", "right": "SMTP (Simple Mail Transfer Protocol - MTA to MTA)", "rightFr": "SMTP (Simple Mail Transfer Protocol - transfert entre MTA)", "note": "Inter-server email delivery", "noteFr": "Acheminement de courriers"},
      {"id": "p3", "left": "Port 53 UDP & TCP", "right": "DNS (Domain Name System queries and zone transfers)", "rightFr": "DNS (Résolution de noms et transferts de zone)", "note": "UDP for lookups, TCP for transfers >512 bytes", "noteFr": "UDP pour requêtes, TCP pour transferts de zone"},
      {"id": "p4", "left": "Port 67 / 68 UDP", "right": "DHCP Server (67) & DHCP Client (68)", "rightFr": "Serveur DHCP (67) & Client DHCP (68)", "note": "Dynamic IP address allocation (BOOTP)", "noteFr": "Attribution dynamique d'adresses IP"},
      {"id": "p5", "left": "Port 123 UDP", "right": "NTP (Network Time Protocol)", "rightFr": "NTP (Network Time Protocol - horloge)", "note": "Time synchronization across network", "noteFr": "Synchronisation horaire réseau"},
      {"id": "p6", "left": "Port 389 TCP", "right": "LDAP (Lightweight Directory Access Protocol - plain/StartTLS)", "rightFr": "LDAP (Annuaire réseau d'entreprise non chiffré / StartTLS)", "note": "Central identity directory lookup", "noteFr": "Annuaire d'authentification centralisé"},
      {"id": "p7", "left": "Port 443 TCP", "right": "HTTPS (Hypertext Transfer Protocol Secure over TLS)", "rightFr": "HTTPS (Web sécurisé avec chiffrement TLS/SSL)", "note": "Encrypted Web server traffic", "noteFr": "Trafic web sécurisé"}
    ]
  },
  {
    "id": "match-lpic1-19",
    "title": "Modern 'ip' Commands vs Deprecated Net-Tools",
    "titleFr": "Commandes réseau modernes 'ip' vs Anciens utilitaires Net-Tools",
    "certification": "lpic-1",
    "topicNumber": 109,
    "objectiveId": "109.2",
    "category": "Networking Fundamentals",
    "description": "Match deprecated Linux network commands to their modern iproute2 replacements.",
    "descriptionFr": "Associez les anciennes commandes réseau dépréciées à leurs équivalents modernes iproute2.",
    "pairs": [
      {"id": "p1", "left": "ifconfig eth0", "right": "ip addr show dev eth0 (or ip a)", "rightFr": "ip addr show dev eth0 (ou ip a)", "note": "Displays IP addresses and interface link status", "noteFr": "Affiche les adresses IP et l'état de l'interface"},
      {"id": "p2", "left": "route -n", "right": "ip route show (or ip r)", "rightFr": "ip route show (ou ip r)", "note": "Displays kernel routing table with default gateway", "noteFr": "Affiche la table de routage du noyau"},
      {"id": "p3", "left": "netstat -tuln", "right": "ss -tuln", "rightFr": "ss -tuln", "note": "Displays listening TCP and UDP sockets with port numbers", "noteFr": "Affiche les sockets d'écoute TCP/UDP numériques"},
      {"id": "p4", "left": "arp -an", "right": "ip neighbor show (or ip neigh)", "rightFr": "ip neighbor show (ou ip neigh)", "note": "Inspects local ARP cache mapping IP to MAC addresses", "noteFr": "Consulte le cache ARP résolvant IP en adresses MAC"},
      {"id": "p5", "left": "ifconfig eth0 up/down", "right": "ip link set eth0 up/down", "rightFr": "ip link set eth0 up/down", "note": "Enables or disables network interface at layer 2", "noteFr": "Active ou désactive une interface réseau au niveau lien"}
    ]
  },
  {
    "id": "match-lpic1-20",
    "title": "SSH Keys, Files & Critical sshd_config Directives",
    "titleFr": "Clés SSH, Fichiers & Directives critiques sshd_config",
    "certification": "lpic-1",
    "topicNumber": 110,
    "objectiveId": "110.2",
    "category": "Security & SSH",
    "description": "Match SSH files and sshd_config security parameters to their defensive purpose.",
    "descriptionFr": "Associez les fichiers SSH et directives sshd_config à leurs objectifs de sécurité.",
    "pairs": [
      {"id": "p1", "left": "~/.ssh/authorized_keys", "right": "Stores public keys allowed to log into this user account without password", "rightFr": "Stocke les clés publiques autorisées à se connecter sans mot de passe", "note": "Must have 0600 file permissions", "noteFr": "Doit obligatoirement avoir les droits 0600"},
      {"id": "p2", "left": "~/.ssh/known_hosts", "right": "Stores server host public keys to verify host identity and prevent MITM", "rightFr": "Stocke les clés publiques des serveurs distants pour contrer le MITM", "note": "Warns if server key changes", "noteFr": "Alerte si l'empreinte du serveur distant change"},
      {"id": "p3", "left": "PermitRootLogin no", "right": "Disallows direct SSH logins as root; requires standard user with sudo", "rightFr": "Interdit la connexion directe de root en SSH ; oblige à utiliser sudo", "note": "Core security hardening rule", "noteFr": "Règle clé de durcissement"},
      {"id": "p4", "left": "PasswordAuthentication no", "right": "Enforces public key authentication exclusively; disables plain passwords", "rightFr": "Impose exclusivement l'authentification par clé ; désactive les mots de passe", "note": "Prevents brute-force dictionary attacks", "noteFr": "Bloque les attaques par force brute"},
      {"id": "p5", "left": "/etc/ssh/ssh_host_*_key", "right": "Private cryptographic identity keys of the SSH server host itself", "rightFr": "Clés privées d'identité cryptographique du serveur SSH lui-même", "note": "Generated during initial installation", "noteFr": "Générées à l'installation du paquet openssh-server"},
      {"id": "p6", "left": "ssh-keygen -t ed25519", "right": "Generates a modern high-security EdDSA elliptic curve key pair", "rightFr": "Génère une paire de clés moderne et hautement sécurisée à courbe elliptique", "note": "Recommended over legacy RSA 2048", "noteFr": "Recommandé face au standard RSA 2048"}
    ]
  }
]
