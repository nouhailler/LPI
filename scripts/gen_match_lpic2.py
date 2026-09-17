# -*- coding: utf-8 -*-
"""
LPIC-2: 20 Matching Games (10 for Exam 201, 10 for Exam 202)
"""

matching_games_lpic2 = [
  # --- EXAM 201 ---
  {
    "id": "match-lpic2-01",
    "title": "System Performance Monitoring Utilities (sar, vmstat, iostat)",
    "titleFr": "Outils de mesure de performance et métrologie (sar, vmstat, iostat)",
    "certification": "lpic-2",
    "topicNumber": 200,
    "objectiveId": "200.1",
    "category": "Capacity Planning",
    "description": "Match performance measurement tools and options to the subsystem they monitor.",
    "descriptionFr": "Associez les outils et options de mesure de performance au sous-système surveillé.",
    "pairs": [
      {"id": "p1", "left": "vmstat 1", "right": "Virtual memory, processes, paging, blocks in/out, and CPU breakdown", "rightFr": "Mémoire virtuelle, processus, pagination, blocs E/S et répartition CPU", "note": "Instantaneous whole-system summary updated every second", "noteFr": "Vue globale rafraîchie chaque seconde"},
      {"id": "p2", "left": "iostat -xz 1", "right": "Disk block devices I/O utilization, await latency, and service times", "rightFr": "Taux d'utilisation des disques, temps d'attente await et latence", "note": "Isolates storage bottlenecks (%util, await)", "noteFr": "Isole les goulots d'étranglement disque (%util)"},
      {"id": "p3", "left": "sar -q", "right": "Historical CPU run queue length and system load averages", "rightFr": "Historique de la file d'attente CPU (run-queue) et charge moyenne", "note": "Part of sysstat daily data logging", "noteFr": "Données historiques archivées par sysstat"},
      {"id": "p4", "left": "sar -n DEV", "right": "Network interface throughput in packets/sec and kB/sec", "rightFr": "Débit des interfaces réseau en paquets/sec et Ko/sec", "note": "Monitors network bandwidth saturation", "noteFr": "Mesure la saturation de bande passante réseau"},
      {"id": "p5", "left": "mpstat -P ALL 1", "right": "Per-core CPU utilization breakdown (user, system, iowait, softirq)", "rightFr": "Utilisation détaillée processeur cœur par cœur (user, sys, iowait)", "note": "Detects single-core CPU spikes or IRQ imbalances", "noteFr": "Détecte les déséquilibres de charge multi-cœurs"},
      {"id": "p6", "left": "uptime", "right": "System uptime, logged-in users, and load averages over 1, 5, 15 minutes", "rightFr": "Temps de fonctionnement, utilisateurs connectés et charge sur 1, 5, 15 min", "note": "Fastest high-level system sanity check", "noteFr": "Vérification rapide de santé système"}
    ]
  },
  {
    "id": "match-lpic2-02",
    "title": "Memory Metrics & /proc/meminfo Indicators",
    "titleFr": "Métriques de mémoire & Indicateurs /proc/meminfo",
    "certification": "lpic-2",
    "topicNumber": 200,
    "objectiveId": "200.2",
    "category": "Capacity Planning",
    "description": "Match Linux memory states and /proc/meminfo fields to their architectural meanings.",
    "descriptionFr": "Associez les états de la mémoire Linux et champs /proc/meminfo à leur signification.",
    "pairs": [
      {"id": "p1", "left": "MemAvailable", "right": "Estimate of memory available for starting new applications without swapping", "rightFr": "Estimation de la mémoire disponible sans déclencher de pagination swap", "note": "Much more accurate than MemFree", "noteFr": "Plus pertinent que MemFree car inclut caches réclamables"},
      {"id": "p2", "left": "Buffers", "right": "Memory used by kernel block device buffers for raw disk blocks", "rightFr": "Mémoire utilisée par le noyau pour les métadonnées et blocs disques bruts", "note": "Reclaimable under memory pressure", "noteFr": "Mémoire réclamable sous pression"},
      {"id": "p3", "left": "Cached", "right": "Page cache memory holding file data read from or written to disk", "rightFr": "Cache de pages (page cache) conservant les fichiers lus ou écrits", "note": "Accelerates subsequent file reads", "noteFr": "Accélère les accès ultérieurs aux fichiers"},
      {"id": "p4", "left": "SwapCached", "right": "Memory once swapped out, now read back into RAM but still also on swap disk", "rightFr": "Pages présentes à la fois en RAM et sur le disque de swap", "note": "Can be dropped instantly if RAM is needed", "noteFr": "Libérable immédiatement sans réécriture disque"},
      {"id": "p5", "left": "CommitLimit", "right": "Total memory amount currently allocatable under strict overcommit mode 2", "rightFr": "Quantité maximale de mémoire allouable sous le mode strict overcommit 2", "note": "Swap + (RAM * overcommit_ratio / 100)", "noteFr": "Swap + (RAM * ratio / 100)"},
      {"id": "p6", "left": "swapon -s / swapon --show", "right": "Displays active swap partitions/files, priorities, and current disk usage", "rightFr": "Affiche les partitions/fichiers swap actifs, priorités et consommation", "note": "Inspects swap hierarchy", "noteFr": "Inspecte la hiérarchie de pagination"}
    ]
  },
  {
    "id": "match-lpic2-03",
    "title": "Linux Kernel Components, Files & Image Types",
    "titleFr": "Composants du noyau Linux, Fichiers & Types d'images",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.1",
    "category": "Linux Kernel",
    "description": "Match kernel image files, initramfs artifacts, and system paths to their boot roles.",
    "descriptionFr": "Associez les fichiers d'images du noyau et composants d'amorçage à leurs rôles.",
    "pairs": [
      {"id": "p1", "left": "/boot/vmlinuz-<version>", "right": "Compressed executable Linux kernel binary booted by GRUB", "rightFr": "Binaire noyau Linux exécutable et compressé chargé par GRUB", "note": "Self-extracting bzImage format", "noteFr": "Image amorçable auto-extractible"},
      {"id": "p2", "left": "/boot/initramfs-<version>.img", "right": "Root filesystem in RAM containing pre-boot storage/RAID/crypto drivers", "rightFr": "Système de fichiers en RAM fournissant les pilotes disques/RAID/LUKS initiaux", "note": "CPIO archive unpacked by kernel at boot", "noteFr": "Archive CPIO décompressée au boot"},
      {"id": "p3", "left": "/lib/modules/<version>/", "right": "Directory containing dynamically loadable kernel object modules (.ko / .ko.xz)", "rightFr": "Répertoire abritant les modules noyau dynamiques compilés (.ko)", "note": "Structured by kernel subsystem", "noteFr": "Organisé par sous-système (net, fs, drivers)"},
      {"id": "p4", "left": "/lib/modules/<version>/modules.dep", "right": "Dependency map of all loadable kernel modules generated by depmod", "rightFr": "Table des dépendances entre modules noyau générée par depmod", "note": "Consulted by modprobe to load prerequisites", "noteFr": "Consulté par modprobe pour charger les dépendances"},
      {"id": "p5", "left": "/boot/System.map-<version>", "right": "Symbol lookup table linking kernel function names to memory addresses", "rightFr": "Table de correspondance reliant les noms de fonctions noyau aux adresses mémoire", "note": "Used for debugging kernel panics and oopses", "noteFr": "Utilisé pour décoder les kernel panics"}
    ]
  },
  {
    "id": "match-lpic2-04",
    "title": "Kernel Module Management Commands (modprobe, insmod, lsmod)",
    "titleFr": "Commandes de gestion des modules noyau (modprobe, insmod, lsmod)",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.2",
    "category": "Linux Kernel",
    "description": "Match module utilities with their operational characteristics and behavior.",
    "descriptionFr": "Associez les commandes de gestion des modules noyau à leurs comportements.",
    "pairs": [
      {"id": "p1", "left": "lsmod", "right": "Formats and displays currently loaded modules from /proc/modules", "rightFr": "Formate et affiche les modules actuellement chargés depuis /proc/modules", "note": "Shows size and dependent module counts", "noteFr": "Affiche taille et modules dépendants"},
      {"id": "p2", "left": "modprobe module_name", "right": "Loads a module and automatically resolves and loads all its dependencies", "rightFr": "Charge un module et résout/charge automatiquement ses dépendances", "note": "Reads modules.dep and /etc/modprobe.d/", "noteFr": "Lit modules.dep et /etc/modprobe.d/"},
      {"id": "p3", "left": "modprobe -r module_name", "right": "Unloads a module and its unused dependencies cleanly", "rightFr": "Décharge un module et ses dépendances inutilisées proprement", "note": "Fails safely if module is in use", "noteFr": "Échoue proprement si le module est occupé"},
      {"id": "p4", "left": "insmod /path/to/module.ko", "right": "Low-level insertion of a single raw module file without dependency resolution", "rightFr": "Insertion bas niveau d'un fichier .ko sans résolution de dépendances", "note": "Fails if dependencies are not already loaded", "noteFr": "Échoue si les prérequis ne sont pas en mémoire"},
      {"id": "p5", "left": "rmmod module_name", "right": "Low-level removal of a single module without removing dependencies", "rightFr": "Retrait bas niveau d'un module sans toucher à ses dépendances", "note": "Direct kernel module removal", "noteFr": "Déchargement direct"},
      {"id": "p6", "left": "modinfo module_name", "right": "Displays module author, license, aliases, dependencies, and parameters", "rightFr": "Affiche auteur, licence, alias, dépendances et paramètres d'un module", "note": "Inspects module metadata without loading it", "noteFr": "Inspecte les métadonnées sans charger le module"}
    ]
  },
  {
    "id": "match-lpic2-05",
    "title": "GRUB 2 Configuration Directives (/etc/default/grub)",
    "titleFr": "Directives de configuration GRUB 2 (/etc/default/grub)",
    "certification": "lpic-2",
    "topicNumber": 202,
    "objectiveId": "202.1",
    "category": "System Startup",
    "description": "Match GRUB 2 variables in /etc/default/grub with their bootloader behavior.",
    "descriptionFr": "Associez les variables GRUB 2 de /etc/default/grub à leur comportement au démarrage.",
    "pairs": [
      {"id": "p1", "left": "GRUB_DEFAULT=saved", "right": "Boots the last manually selected entry automatically next time", "rightFr": "Amorce automatiquement la dernière entrée sélectionnée par l'utilisateur", "note": "Requires GRUB_SAVEDEFAULT=true", "noteFr": "Nécessite GRUB_SAVEDEFAULT=true"},
      {"id": "p2", "left": "GRUB_TIMEOUT=5", "right": "Waits 5 seconds on boot menu before automatically launching default entry", "rightFr": "Attend 5 secondes sur le menu avant de lancer l'entrée par défaut", "note": "Set to -1 to wait indefinitely", "noteFr": "-1 pour attendre indéfiniment"},
      {"id": "p3", "left": "GRUB_CMDLINE_LINUX", "right": "Kernel command-line parameters appended to all boot menu entries", "rightFr": "Paramètres de ligne de commande passés au noyau pour toutes les entrées", "note": "e.g., quiet splash nomodeset", "noteFr": "ex: quiet splash net.ifnames=0"},
      {"id": "p4", "left": "GRUB_DISABLE_RECOVERY=true", "right": "Hides single-user recovery mode submenu entries from boot menu", "rightFr": "Masque les entrées de sous-menu de dépannage (recovery mode)", "note": "Hardens production server boot menu", "noteFr": "Évite l'accès console non authentifié"},
      {"id": "p5", "left": "grub2-mkconfig -o /boot/grub2/grub.cfg", "right": "Compiles /etc/default/grub and /etc/grub.d/* scripts into runtime grub.cfg", "rightFr": "Compile les scripts /etc/grub.d/* et /etc/default/grub dans grub.cfg", "note": "update-grub on Debian/Ubuntu systems", "noteFr": "Équivalent de update-grub sous Debian/Ubuntu"}
    ]
  },
  {
    "id": "match-lpic2-06",
    "title": "Filesystem Maintenance Tools (Ext4 vs XFS)",
    "titleFr": "Outils de maintenance de systèmes de fichiers (Ext4 vs XFS)",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.1",
    "category": "Filesystem & Devices",
    "description": "Match filesystem diagnostic and tuning tools to their target filesystem.",
    "descriptionFr": "Associez les utilitaires de réglage et de réparation à leur système de fichiers cible.",
    "pairs": [
      {"id": "p1", "left": "tune2fs -c 30 -i 180d /dev/sdb1", "right": "Adjusts max mount count and time interval between forced fsck on Ext4", "rightFr": "Règle le nombre de montages et le délai entre vérifications fsck (Ext4)", "note": "Ext2/Ext3/Ext4 filesystem tuning tool", "noteFr": "Outil de paramétrage Ext2/Ext3/Ext4"},
      {"id": "p2", "left": "dumpe2fs -h /dev/sdb1", "right": "Dumps superblock and block group metadata headers for an Ext filesystem", "rightFr": "Affiche le superbloc et les métadonnées de groupes de blocs (Ext)", "note": "-h prints only superblock headers", "noteFr": "-h affiche l'en-tête du superbloc"},
      {"id": "p3", "left": "resize2fs /dev/vg0/lv_data", "right": "Expands or shrinks an unmounted or mounted Ext4 filesystem online", "rightFr": "Agrandit en ligne ou réduit hors ligne un système de fichiers Ext4", "note": "Online expansion, offline shrinking", "noteFr": "Agrandissement à chaud supporté"},
      {"id": "p4", "left": "xfs_growfs /mnt/data", "right": "Expands a mounted XFS filesystem to fill underlying expanded block device", "rightFr": "Agrandit un système de fichiers XFS monté pour occuper l'espace bloc", "note": "Operates strictly on mountpoint; XFS cannot shrink", "noteFr": "Opère sur le point de montage (irréversible)"},
      {"id": "p5", "left": "xfs_repair /dev/sdb1", "right": "Repairs corrupted XFS filesystem structures (must be unmounted)", "rightFr": "Répare les structures corrompues d'un volume XFS (démontage obligatoire)", "note": "XFS native consistency fixer", "noteFr": "Réparateur natif XFS"},
      {"id": "p6", "left": "xfs_admin -L 'BACKUP' /dev/sdb1", "right": "Changes the volume label or UUID on an unmounted XFS partition", "rightFr": "Modifie le label de volume ou l'UUID d'une partition XFS démontée", "note": "XFS administrative management tool", "noteFr": "Gestion des métadonnées administratives XFS"}
    ]
  },
  {
    "id": "match-lpic2-07",
    "title": "File Attributes (chattr) & Advanced Mount Options",
    "titleFr": "Attributs de fichiers (chattr) & Options de montage avancées",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.2",
    "category": "Filesystem & Devices",
    "description": "Match file attribute flags and mount options to their behavioral security restrictions.",
    "descriptionFr": "Associez les drapeaux d'attributs de fichiers et options de montage à leurs restrictions.",
    "pairs": [
      {"id": "p1", "left": "chattr +i file.txt", "right": "Immutable attribute: prevents deletion, renaming, modifying, or linking by anyone (even root)", "rightFr": "Attribut immuable : interdit suppression, renommage et modification même par root", "note": "Must be removed with chattr -i to edit", "noteFr": "Doit être retiré avec chattr -i"},
      {"id": "p2", "left": "chattr +a /var/log/app.log", "right": "Append-only attribute: file can only be opened for writing in append mode", "rightFr": "Attribut ajout seul : le fichier ne peut être ouvert qu'en écriture à la fin", "note": "Crucial for tamper-evident security audit logs", "noteFr": "Essentiel pour les fichiers de logs sécurisés"},
      {"id": "p3", "left": "mount -o noexec", "right": "Prevents direct execution of any binary or executable code on this partition", "rightFr": "Interdit l'exécution directe de tout binaire ou exécutable sur la partition", "note": "Hardens /tmp, /dev/shm, /home", "noteFr": "Durcit /tmp, /dev/shm et /home"},
      {"id": "p4", "left": "mount -o nosuid", "right": "Blocks SUID and SGID privilege elevation bits from taking effect on partition", "rightFr": "Neutralise les bits SUID et SGID sur l'ensemble de la partition", "note": "Blocks local privilege escalation vectors", "noteFr": "Bloque l'élévation de privilèges"},
      {"id": "p5", "left": "mount -o noatime", "right": "Disables updating file access timestamps upon read for higher I/O performance", "rightFr": "Désactive la mise à jour de la date de dernier accès pour doper les E/S", "note": "Drastically reduces metadata disk writes", "noteFr": "Réduit considérablement les écritures disque"}
    ]
  },
  {
    "id": "match-lpic2-08",
    "title": "Linux Software RAID Levels (mdadm)",
    "titleFr": "Niveaux RAID logiciel Linux (mdadm)",
    "certification": "lpic-2",
    "topicNumber": 204,
    "objectiveId": "204.1",
    "category": "Advanced Storage",
    "description": "Match RAID levels to their fault tolerance, disk parity, and storage efficiency characteristics.",
    "descriptionFr": "Associez les niveaux de RAID logiciel à leur tolérance aux pannes et caractéristiques.",
    "pairs": [
      {"id": "p1", "left": "RAID 0 (Striping)", "right": "Data striped across disks; maximum speed, zero redundancy; 1 failure loses all data", "rightFr": "Agrégat par bandes : vitesse maximale, zéro tolérance (1 panne = perte totale)", "note": "Capacity = N * smallest disk", "noteFr": "Capacité = N * taille du plus petit disque"},
      {"id": "p2", "left": "RAID 1 (Mirroring)", "right": "Exact copy on 2+ disks; tolerates N-1 disk failures; high read throughput", "rightFr": "Miroir exact sur 2+ disques : tolère N-1 pannes, excellente lecture", "note": "Capacity = 1 disk size", "noteFr": "Capacité = taille d'un seul disque"},
      {"id": "p3", "left": "RAID 5 (Distributed Parity)", "right": "Striping with distributed parity; tolerates exactly 1 failed disk; min 3 disks", "rightFr": "Bandes avec parité répartie : tolère la panne de 1 disque ; min 3 disques", "note": "Usable capacity = (N - 1) disks", "noteFr": "Capacité utile = (N - 1) disques"},
      {"id": "p4", "left": "RAID 6 (Dual Parity)", "right": "Dual distributed parity; tolerates up to 2 simultaneous disk failures; min 4 disks", "rightFr": "Double parité distribuée : tolère 2 pannes simultanées de disques ; min 4 disques", "note": "Usable capacity = (N - 2) disks", "noteFr": "Capacité utile = (N - 2) disques"},
      {"id": "p5", "left": "RAID 10 (Striped Mirrors)", "right": "Stripe of mirrors; tolerates 1 disk loss per sub-mirror; high performance & redundancy", "rightFr": "Miroir de bandes : tolère 1 panne par sous-miroir ; performance & résilience", "note": "Requires minimum 4 disks; 50% capacity", "noteFr": "Minimum 4 disques, 50% d'efficacité"},
      {"id": "p6", "left": "mdadm --fail /dev/md0 /dev/sdb1", "right": "Manually marks a healthy disk drive as faulty to initiate hot replacement", "rightFr": "Marque volontairement un disque sain comme défaillant pour le remplacer", "note": "Precedes --remove and --add", "noteFr": "Précède le retrait et l'insertion du disque"}
    ]
  },
  {
    "id": "match-lpic2-09",
    "title": "Logical Volume Manager (LVM) Architecture & Commands",
    "titleFr": "Architecture LVM & Commandes associées (PV, VG, LV)",
    "certification": "lpic-2",
    "topicNumber": 204,
    "objectiveId": "204.2",
    "category": "Advanced Storage",
    "description": "Match LVM abstraction layers and commands to their storage management operations.",
    "descriptionFr": "Associez les couches d'abstraction LVM et commandes à leurs opérations de stockage.",
    "pairs": [
      {"id": "p1", "left": "pvcreate /dev/sdb1", "right": "Initializes raw disk partition as a Physical Volume (PV) for LVM use", "rightFr": "Initialise une partition brute en Volume Physique (PV) pour LVM", "note": "Writes LVM label and metadata", "noteFr": "Inscrit l'en-tête et métadonnées LVM"},
      {"id": "p2", "left": "vgcreate vg_data /dev/sdb1 /dev/sdc1", "right": "Aggregates multiple PVs into a pooled storage pool Volume Group (VG)", "rightFr": "Agrège plusieurs PV en un groupe de volumes (VG) formant un pool d'extents", "note": "Allocates Physical Extents (PE)", "noteFr": "Découpe l'espace en Physical Extents (PE)"},
      {"id": "p3", "left": "lvcreate -L 50G -n lv_web vg_data", "right": "Carves a 50 GB Logical Volume (LV) out of a Volume Group", "rightFr": "Alloue un volume logique (LV) de 50 Go à partir d'un groupe de volumes", "note": "Block device ready for formatting", "noteFr": "Périphérique bloc prêt au formatage"},
      {"id": "p4", "left": "lvextend -L +10G -r /dev/vg_data/lv_web", "right": "Increases LV size by 10 GB and expands the filesystem in a single step (-r)", "rightFr": "Agrandit le LV de 10 Go et redimensionne le système de fichiers en un coup (-r)", "note": "Online non-disruptive expansion", "noteFr": "Agrandissement en ligne sans interruption"},
      {"id": "p5", "left": "lvcreate -s -L 5G -n snap_web /dev/vg_data/lv_web", "right": "Creates a 5 GB Copy-on-Write (CoW) point-in-time snapshot of an active LV", "rightFr": "Crée un snapshot Copy-on-Write (CoW) figé de 5 Go d'un volume logique", "note": "Ideal for non-disruptive backups", "noteFr": "Idéal pour des sauvegardes cohérentes"},
      {"id": "p6", "left": "pvmove /dev/sdb1", "right": "Migrates allocated physical extents from a source PV to other available PVs in VG", "rightFr": "Déplace les extents alloués d'un PV source vers les autres PV libres du VG", "note": "Enables zero-downtime disk replacement", "noteFr": "Permet le retrait à chaud d'un disque physique"}
    ]
  },
  {
    "id": "match-lpic2-10",
    "title": "Network Troubleshooting Tools (mtr, ss, tcpdump, ethtool)",
    "titleFr": "Outils de diagnostic réseau avancés (mtr, ss, tcpdump, ethtool)",
    "certification": "lpic-2",
    "topicNumber": 205,
    "objectiveId": "205.1",
    "category": "Networking",
    "description": "Match advanced networking diagnostics to their specialized inspection role.",
    "descriptionFr": "Associez les utilitaires de diagnostic réseau avancé à leur rôle d'inspection.",
    "pairs": [
      {"id": "p1", "left": "mtr -rw target.com", "right": "Combines traceroute and ping into continuous hop-by-hop packet loss report", "rightFr": "Combine traceroute et ping en un rapport continu de perte de paquets par saut", "note": "Identifies routing congestion points", "noteFr": "Isole les congestions sur le trajet"},
      {"id": "p2", "left": "tcpdump -i eth0 -nn 'port 53'", "right": "Captures and decodes live network packets for DNS queries without reverse DNS lookups", "rightFr": "Capture et décode les paquets DNS en temps réel sans résolution inverse (-nn)", "note": "Low-level packet sniffer", "noteFr": "Analyseur de paquets réseau bas niveau"},
      {"id": "p3", "left": "ethtool eth0", "right": "Queries physical NIC link speed, duplex mode, auto-negotiation, and driver", "rightFr": "Interroge la vitesse physique, le duplex, l'auto-négociation et le pilote de la carte", "note": "Layer 1/2 physical interface inspector", "noteFr": "Inspecteur physique couche 1 et 2"},
      {"id": "p4", "left": "ss -tulpn", "right": "Lists all listening TCP/UDP sockets with process PIDs and program names", "rightFr": "Liste tous les sockets TCP/UDP en écoute avec PID et nom de programme", "note": "Modern fast socket statistics", "noteFr": "Statistiques de sockets haute performance"},
      {"id": "p5", "left": "ip route get 8.8.8.8", "right": "Simulates kernel routing decision to determine outbound interface and source IP", "rightFr": "Simule la décision de routage du noyau pour déterminer l'interface et l'IP source", "note": "Instantly verifies which gateway is chosen", "noteFr": "Vérifie quelle passerelle est choisie"}
    ]
  },

  # --- EXAM 202 ---
  {
    "id": "match-lpic2-11",
    "title": "DNS Resource Records in BIND 9 Zone Files",
    "titleFr": "Enregistrements de ressources DNS dans les zones BIND 9",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "Domain Name Server",
    "description": "Match DNS Resource Record types to their standard definition and usage.",
    "descriptionFr": "Associez les types d'enregistrements DNS à leur définition et usage.",
    "pairs": [
      {"id": "p1", "left": "SOA (Start of Authority)", "right": "Zone authority record specifying master server, contact email, serial, refresh, and TTL", "rightFr": "Enregistrement d'autorité de zone définissant serveur maître, contact, série et TTL", "note": "Mandatory first record of every zone", "noteFr": "Premier enregistrement obligatoire d'une zone"},
      {"id": "p2", "left": "NS (Name Server)", "right": "Delegates a DNS zone to an authoritative name server hostname", "rightFr": "Délègue une zone DNS à un serveur de noms faisant autorité", "note": "Must point to a hostname, never an IP", "noteFr": "Pointe vers un nom d'hôte, jamais une IP"},
      {"id": "p3", "left": "A & AAAA Records", "right": "Maps a hostname to an IPv4 (A) or IPv6 (AAAA) address", "rightFr": "Résout un nom d'hôte vers une adresse IPv4 (A) ou IPv6 (AAAA)", "note": "Fundamental forward resolution records", "noteFr": "Enregistrements de résolution directe"},
      {"id": "p4", "left": "PTR (Pointer Record)", "right": "Reverse DNS mapping of an in-addr.arpa or ip6.arpa address to a FQDN", "rightFr": "Résolution inverse associant une IP sous in-addr.arpa à un FQDN", "note": "Essential for email sender verification", "noteFr": "Indispensable pour valider les serveurs mail"},
      {"id": "p5", "left": "CNAME (Canonical Name)", "right": "Alias mapping one hostname to another existing canonical hostname", "rightFr": "Alias associant un nom d'hôte vers un autre nom canonique existant", "note": "Cannot coexist with other records for same name", "noteFr": "Ne peut coexister avec d'autres types sur le même nom"},
      {"id": "p6", "left": "MX (Mail Exchanger)", "right": "Specifies mail server accepting emails for domain with numerical preference", "rightFr": "Indique le serveur de messagerie du domaine avec priorité numérique", "note": "Lowest preference number has highest priority", "noteFr": "La plus petite valeur est la plus prioritaire"},
      {"id": "p7", "left": "SRV Record", "right": "Locates servers for specific services (SIP, LDAP, Kerberos) with port and weight", "rightFr": "Localise des serveurs pour des services spécifiques (SIP, LDAP) avec port et poids", "note": "Format: _service._proto.name TTL Class SRV prio weight port target", "noteFr": "Requis par Active Directory, LDAP et SIP"}
    ]
  },
  {
    "id": "match-lpic2-12",
    "title": "BIND 9 Configuration Directives (named.conf)",
    "titleFr": "Directives de configuration BIND 9 (named.conf)",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.2",
    "category": "Domain Name Server",
    "description": "Match BIND named.conf directives to their zone management behavior.",
    "descriptionFr": "Associez les directives de configuration named.conf de BIND à leur comportement.",
    "pairs": [
      {"id": "p1", "left": "allow-transfer { IP; };", "right": "Restricts AXFR full zone transfers to authorized secondary slave servers", "rightFr": "Limite les transferts de zone complets (AXFR) aux serveurs secondaires autorisés", "note": "Critical security defense against zone enumeration", "noteFr": "Empêche l'énumération de zone par des tiers"},
      {"id": "p2", "left": "allow-query { IP; };", "right": "Specifies which client IP subnets are permitted to issue standard DNS queries", "rightFr": "Définit les réseaux autorisés à soumettre des requêtes de résolution DNS", "note": "Controls read query access", "noteFr": "Contrôle les clients autorisés à interroger le DNS"},
      {"id": "p3", "left": "recursion no;", "right": "Transforms the DNS server into an authoritative-only server, preventing open relay", "rightFr": "Transforme le serveur en DNS faisant autorité seule, interdisant le relais ouvert", "note": "Mitigates DNS amplification DDoS attacks", "noteFr": "Neutralise les attaques DDoS par amplification"},
      {"id": "p4", "left": "forwarders { 8.8.8.8; };", "right": "IP addresses of upstream recursive resolvers to which unknown queries are sent", "rightFr": "Adresses IP des résolveurs amont vers lesquels relayer les requêtes inconnues", "note": "Used in forward only or forward first setups", "noteFr": "Utilisé en mode forward-only ou forward-first"},
      {"id": "p5", "left": "named-checkconf & named-checkzone", "right": "Validates named.conf syntax and zone file integrity before reloading daemon", "rightFr": "Valide la syntaxe de named.conf et l'intégrité d'une zone avant rechargement", "note": "Prevents crashing BIND with typos", "noteFr": "Évite de crasher BIND suite à une coquille"}
    ]
  },
  {
    "id": "match-lpic2-13",
    "title": "Apache HTTP Server Directives (httpd.conf)",
    "titleFr": "Directives du serveur HTTP Apache (httpd.conf)",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services",
    "description": "Match core Apache HTTPd directives to their configuration role.",
    "descriptionFr": "Associez les directives fondamentales Apache HTTPd à leur rôle de configuration.",
    "pairs": [
      {"id": "p1", "left": "DocumentRoot '/var/www/html'", "right": "Top-level directory tree out of which website static files are served", "rightFr": "Répertoire racine contenant l'arborescence des fichiers servis par le site", "note": "Base path for URL mappings", "noteFr": "Chemin de base résolvant les URL"},
      {"id": "p2", "left": "ServerName www.example.com:80", "right": "Hostname and port used by Apache to identify itself and match virtual hosts", "rightFr": "Nom d'hôte et port par lesquels Apache s'identifie et résout les hôtes virtuels", "note": "Primary identifier of virtual host", "noteFr": "Identifiant principal de l'hôte virtuel"},
      {"id": "p3", "left": "AllowOverride All", "right": "Enables per-directory configuration overrides via local .htaccess files", "rightFr": "Autorise la surcharge de configuration locale par répertoire via .htaccess", "note": "None disables .htaccess for performance", "noteFr": "'None' désactive .htaccess pour gagner en vitesse"},
      {"id": "p4", "left": "Require all granted / denied", "right": "Mod_authz_core authorization directive allowing or blocking all access", "rightFr": "Directive d'autorisation mod_authz_core accordant ou refusant tout accès", "note": "Replaces legacy Apache 2.2 'Allow from all'", "noteFr": "Remplace l'ancienne syntaxe 'Allow from all'"},
      {"id": "p5", "left": "DirectoryIndex index.html index.php", "right": "Specifies default files to serve when a client requests a directory URL", "rightFr": "Définit les fichiers servis par défaut lorsqu'un client demande un dossier", "note": "Checked in left-to-right priority", "noteFr": "Testé de gauche à droite"},
      {"id": "p6", "left": "<VirtualHost *:443>", "right": "Defines a dedicated virtual host container handling HTTPS TLS traffic", "rightFr": "Définit un conteneur d'hôte virtuel dédié au trafic chiffré HTTPS", "note": "Contains SSLEngine and certificates", "noteFr": "Contient SSLEngine et les certificats"}
    ]
  },
  {
    "id": "match-lpic2-14",
    "title": "Nginx Reverse Proxy & Load Balancing Directives",
    "titleFr": "Directives de reverse proxy & Répartition de charge Nginx",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.2",
    "category": "Web Services",
    "description": "Match Nginx configuration blocks and directives to their HTTP traffic behavior.",
    "descriptionFr": "Associez les blocs et directives de configuration Nginx à leur comportement.",
    "pairs": [
      {"id": "p1", "left": "server { listen 80; ... }", "right": "Defines an HTTP virtual server block listening on specific port and interface", "rightFr": "Définit un bloc de serveur virtuel HTTP écoutant sur un port donné", "note": "Equivalent to Apache VirtualHost", "noteFr": "Équivalent du VirtualHost Apache"},
      {"id": "p2", "left": "location /api/ { ... }", "right": "Configures URI routing rules and directives for matching URL prefixes or regex", "rightFr": "Définit les règles de routage et directives pour un préfixe d'URI ou une regex", "note": "Routing block inside server context", "noteFr": "Bloc de routage dans le contexte server"},
      {"id": "p3", "left": "proxy_pass http://backend_pool;", "right": "Forwards matched incoming client requests to upstream backend servers", "rightFr": "Transfère la requête client vers un serveur ou groupe de serveurs en amont", "note": "Core reverse proxy directive", "noteFr": "Directive centrale de reverse proxy"},
      {"id": "p4", "left": "upstream backend_pool { ... }", "right": "Defines a group of backend application servers for load balancing and failover", "rightFr": "Définit un pool de serveurs d'application backend avec équilibrage de charge", "note": "Supports round-robin, least_conn, ip_hash", "noteFr": "Supporte round-robin, least_conn, ip_hash"},
      {"id": "p5", "left": "try_files $uri $uri/ /index.php?$args;", "right": "Checks file existence on disk, then directory, and falls back to front controller", "rightFr": "Teste l'existence du fichier, puis du dossier, et bascule sur le contrôleur frontal", "note": "Standard pattern for modern SPA and CMS", "noteFr": "Modèle standard pour les SPA et CMS modernes"},
      {"id": "p6", "left": "proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;", "right": "Passes the real client IP address to backend application through proxy headers", "rightFr": "Transmet l'adresse IP réelle du client au serveur backend via l'en-tête HTTP", "note": "Prevents backend from seeing only proxy IP", "noteFr": "Évite que le backend ne voie que l'IP du proxy"}
    ]
  },
  {
    "id": "match-lpic2-15",
    "title": "NFS Server & Client Directives (/etc/exports & mount)",
    "titleFr": "Directives de partage & Montage NFS (/etc/exports & mount)",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing",
    "description": "Match NFS export options and diagnostic tools to their file sharing behavior.",
    "descriptionFr": "Associez les options d'exportation NFS et outils de diagnostic à leur comportement.",
    "pairs": [
      {"id": "p1", "left": "rw / ro", "right": "Grants read-write or read-only access to the exported directory share", "rightFr": "Accorde des droits d'accès en lecture-écriture (rw) ou lecture seule (ro)", "note": "Basic share permission flag", "noteFr": "Droit fondamental du partage"},
      {"id": "p2", "left": "sync vs async", "right": "sync commits writes to disk before replying; async replies before disk commit", "rightFr": "sync confirme l'écriture sur disque avant réponse ; async répond immédiatement", "note": "sync prevents data loss on server crash", "noteFr": "sync garantit la sécurité des données"},
      {"id": "p3", "left": "root_squash", "right": "Maps remote client root requests (UID 0) to anonymous user (nobody / nfsnobody)", "rightFr": "Transforme les requêtes de root client (UID 0) en utilisateur anonyme (nobody)", "note": "Default security rule preventing remote root takeover", "noteFr": "Règle de sécurité par défaut indispensable"},
      {"id": "p4", "left": "no_root_squash", "right": "Preserves remote client UID 0 as root on server (high security risk)", "rightFr": "Conserve l'UID 0 du client comme root sur le serveur (risque de sécurité élevé)", "note": "Useful for diskless boot or backup nodes", "noteFr": "Réservé aux nœuds de sauvegarde ou clusters"},
      {"id": "p5", "left": "exportfs -rav", "right": "Re-reads /etc/exports and dynamically refreshes all active NFS shares", "rightFr": "Relit /etc/exports et actualise dynamiquement tous les partages NFS actifs", "note": "Applies changes without restarting nfs-server", "noteFr": "Applique les partages sans redémarrer le service"},
      {"id": "p6", "left": "showmount -e server_ip", "right": "Queries a remote NFS server and displays its publicly exported shares", "rightFr": "Interroge un serveur NFS distant et affiche la liste de ses partages exportés", "note": "Client-side export discovery tool", "noteFr": "Outil de découverte côté client"}
    ]
  },
  {
    "id": "match-lpic2-16",
    "title": "Samba Server Configuration Directives (smb.conf)",
    "titleFr": "Directives de configuration du serveur Samba (smb.conf)",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing",
    "description": "Match Samba smb.conf directives and management tools to their SMB/CIFS role.",
    "descriptionFr": "Associez les directives smb.conf et utilitaires Samba à leur rôle SMB/CIFS.",
    "pairs": [
      {"id": "p1", "left": "[global] section", "right": "Defines server-wide operational parameters (workgroup, security mode, netbios name)", "rightFr": "Définit les paramètres généraux du serveur (groupe de travail, mode de sécurité)", "note": "Global configuration scope", "noteFr": "Portée globale du serveur"},
      {"id": "p2", "left": "security = user", "right": "Enforces user-level authentication with local or domain credentials for share access", "rightFr": "Impose une authentification par compte utilisateur pour accéder aux partages", "note": "Default standard modern Samba security", "noteFr": "Mode standard moderne"},
      {"id": "p3", "left": "valid users = @developers, alice", "right": "Restricts share access strictly to specified users and group members", "rightFr": "Restreint l'accès au partage aux seuls utilisateurs et groupes mentionnés", "note": "@ prefix specifies a system group", "noteFr": "Le préfixe @ désigne un groupe"},
      {"id": "p4", "left": "read only = yes / writable = yes", "right": "Toggles whether authenticated clients can create and modify files on share", "rightFr": "Détermine si les clients authentifiés peuvent créer ou modifier des fichiers", "note": "writable = yes is opposite of read only = yes", "noteFr": "writable = yes équivaut à read only = no"},
      {"id": "p5", "left": "testparm -v", "right": "Syntax checks smb.conf for invalid directives and prints active loaded values", "rightFr": "Vérifie la syntaxe de smb.conf et affiche les valeurs actives chargées", "note": "Catches typos before restarting smbd", "noteFr": "Détecte les erreurs avant de relancer smbd"},
      {"id": "p6", "left": "smbpasswd -a username", "right": "Creates or updates an encrypted SMB password for a user in passdb.tdb", "rightFr": "Crée ou met à jour le mot de passe SMB chiffré d'un utilisateur dans passdb.tdb", "note": "User must already exist in /etc/passwd", "noteFr": "L'utilisateur doit déjà exister dans /etc/passwd"}
    ]
  },
  {
    "id": "match-lpic2-17",
    "title": "DHCP Server Configuration Directives (dhcpd.conf)",
    "titleFr": "Directives de configuration du serveur DHCP (dhcpd.conf)",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.1",
    "category": "Network Client Management",
    "description": "Match ISC DHCP server dhcpd.conf parameters to their lease management duties.",
    "descriptionFr": "Associez les directives de configuration dhcpd.conf à leurs fonctions d'attribution de baux.",
    "pairs": [
      {"id": "p1", "left": "subnet 192.168.1.0 netmask 255.255.255.0 { ... }", "right": "Declares an addressable network segment served by the DHCP daemon", "rightFr": "Déclare un segment réseau adressable géré par le démon DHCP", "note": "Container for pool and subnet options", "noteFr": "Conteneur de pool et d'options réseau"},
      {"id": "p2", "left": "range 192.168.1.50 192.168.1.200;", "right": "Defines the dynamic pool of assignable IP addresses for requesting clients", "rightFr": "Définit la plage d'adresses IP dynamiques attribuables aux clients", "note": "Pool of dynamic lease allocations", "noteFr": "Plage de baux dynamiques"},
      {"id": "p3", "left": "option routers 192.168.1.1;", "right": "Pushes the default gateway IPv4 address to configured DHCP clients", "rightFr": "Transmet l'adresse IPv4 de la passerelle par défaut aux clients DHCP", "note": "Configures client default route", "noteFr": "Renseigne la route par défaut du client"},
      {"id": "p4", "left": "option domain-name-servers 1.1.1.1, 8.8.8.8;", "right": "Pushes recursive DNS resolver IP addresses for client /etc/resolv.conf", "rightFr": "Transmet les adresses des résolveurs DNS pour le /etc/resolv.conf du client", "note": "Configures DNS for client hosts", "noteFr": "Alimente la résolution de noms"},
      {"id": "p5", "left": "hardware ethernet 00:11:22:33:44:55; fixed-address 192.168.1.25;", "right": "Binds a static reserved IP address to a client machine's physical MAC address", "rightFr": "Associe une adresse IP fixe et réservée à l'adresse MAC physique du client", "note": "DHCP static reservation inside host block", "noteFr": "Réservation statique dans un bloc host"},
      {"id": "p6", "left": "default-lease-time 86400; max-lease-time 604800;", "right": "Defines standard and maximum lease validity duration in seconds", "rightFr": "Définit la durée standard et maximale de validité d'un bail en secondes", "note": "Controls client lease renewal timers", "noteFr": "Contrôle les délais de renouvellement"}
    ]
  },
  {
    "id": "match-lpic2-18",
    "title": "Pluggable Authentication Modules (PAM) Control Flags & Types",
    "titleFr": "Drapeaux de contrôle & Types de modules PAM (Linux-PAM)",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.2",
    "category": "Authentication & PAM",
    "description": "Match PAM module types and control flags to their decision evaluation flow.",
    "descriptionFr": "Associez les types de modules et drapeaux de contrôle PAM à leurs règles d'évaluation.",
    "pairs": [
      {"id": "p1", "left": "auth (Module Type)", "right": "Authenticates user identity (e.g. password prompt) and grants credentials", "rightFr": "Authentifie l'identité de l'utilisateur (mot de passe) et accorde les jetons", "note": "First authentication phase", "noteFr": "Première phase d'authentification"},
      {"id": "p2", "left": "account (Module Type)", "right": "Verifies account validity (expiration, allowed login hours, access restrictions)", "rightFr": "Vérifie la validité du compte (expiration, plages horaires autorisées)", "note": "Checks if valid user is allowed to log in", "noteFr": "Vérifie si le compte est autorisé"},
      {"id": "p3", "left": "password (Module Type)", "right": "Handles password updates, complexity enforcement, and hashing algorithms", "rightFr": "Gère le renouvellement des mots de passe, leur complexité et leur chiffrement", "note": "Used by passwd command", "noteFr": "Utilisé lors du changement de mot de passe"},
      {"id": "p4", "left": "session (Module Type)", "right": "Performs pre/post-login environment setup (mounting home, setting limits, logging)", "rightFr": "Prépare l'environnement de session (montage du home, limites ulimit, audit)", "note": "Sets up environment for shell/desktop", "noteFr": "Configure l'environnement de session"},
      {"id": "p5", "left": "required (Control Flag)", "right": "Failure causes eventual authentication denial, but all subsequent modules still run", "rightFr": "Un échec entraîne le refus final, mais tous les modules suivants sont exécutés", "note": "Continues evaluating stack to hide failure origin", "noteFr": "Masque l'étape exacte en faute"},
      {"id": "p6", "left": "requisite (Control Flag)", "right": "Failure causes immediate authentication abort without executing remaining modules", "rightFr": "Un échec interrompt immédiatement l'authentification sans exécuter la suite", "note": "Fails fast without checking rest of stack", "noteFr": "Échoue immédiatement"},
      {"id": "p7", "left": "sufficient (Control Flag)", "right": "Success immediately grants approval if no prior required module has failed", "rightFr": "Un succès valide immédiatement l'accès si aucun module required antérieur n'a échoué", "note": "Fast success path in PAM stack", "noteFr": "Validation directe en cas de succès"}
    ]
  },
  {
    "id": "match-lpic2-19",
    "title": "Postfix Mail Transfer Agent Directives (main.cf)",
    "titleFr": "Directives du serveur de messagerie Postfix (main.cf)",
    "certification": "lpic-2",
    "topicNumber": 211,
    "objectiveId": "211.1",
    "category": "E-Mail Services",
    "description": "Match Postfix main.cf parameters to their mail routing and anti-relay roles.",
    "descriptionFr": "Associez les paramètres main.cf de Postfix à leur rôle de routage et de filtrage.",
    "pairs": [
      {"id": "p1", "left": "myhostname = mail.example.com", "right": "Defines the Internet hostname of this mail server system", "rightFr": "Définit le nom d'hôte Internet officiel de ce serveur de messagerie", "note": "Used in SMTP HELO/EHLO greeting banner", "noteFr": "Utilisé dans la bannière SMTP d'accueil"},
      {"id": "p2", "left": "mydomain = example.com", "right": "Specifies the parent Internet domain of the mail server", "rightFr": "Spécifie le domaine Internet parent du serveur de messagerie", "note": "Base domain name for postmaster emails", "noteFr": "Nom de domaine de référence"},
      {"id": "p3", "left": "myorigin = $mydomain", "right": "Specifies domain appended to locally submitted emails without domain suffix", "rightFr": "Définit le domaine ajouté aux courriers locaux émis sans suffixe de domaine", "note": "Ensures root@mail becomes root@example.com", "noteFr": "Garantit des adresses expéditrices valides"},
      {"id": "p4", "left": "mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain", "right": "List of domains for which Postfix delivers mail locally into user mailboxes", "rightFr": "Liste des domaines pour lesquels Postfix délivre les courriers en local", "note": "Non-matching domains get relayed or rejected", "noteFr": "Les autres domaines sont relayés ou rejetés"},
      {"id": "p5", "left": "mynetworks = 127.0.0.0/8, 192.168.1.0/24", "right": "Trusted client IP subnets authorized to relay outbound mail through Postfix", "rightFr": "Sous-réseaux IP de confiance autorisés à relayer des courriers sortants", "note": "Anti-open relay firewall defense", "noteFr": "Protection contre le relais de spam ouvert"},
      {"id": "p6", "left": "relayhost = [smtp.upstream-provider.com]:587", "right": "Upstream smarthost MTA through which all outbound email must be routed", "rightFr": "Serveur relais amont (smarthost) par lequel acheminer tous les courriers sortants", "note": "Brackets disable MX DNS lookup", "noteFr": "Les crochets évitent la résolution MX"}
    ]
  },
  {
    "id": "match-lpic2-20",
    "title": "Linux Firewalls: nftables vs iptables Architecture",
    "titleFr": "Pare-feu Linux : Architecture nftables vs iptables",
    "certification": "lpic-2",
    "topicNumber": 212,
    "objectiveId": "212.1",
    "category": "System Security & Firewalls",
    "description": "Match packet filtering frameworks, tables, and hooks to their traffic inspection point.",
    "descriptionFr": "Associez les structures de filtrage, tables et crochets à leur étape d'inspection.",
    "pairs": [
      {"id": "p1", "left": "PREROUTING Hook", "right": "Inspects incoming packets before the kernel makes any routing decision", "rightFr": "Traite les paquets entrants avant toute décision de routage par le noyau", "note": "Standard location for DNAT and port forwarding", "noteFr": "Emplacement privilégié pour le DNAT"},
      {"id": "p2", "left": "POSTROUTING Hook", "right": "Inspects packets after routing, just before transmission onto network wire", "rightFr": "Traite les paquets après routage, juste avant leur émission sur le câble", "note": "Standard location for SNAT and MASQUERADE", "noteFr": "Emplacement du SNAT et du MASQUERADE"},
      {"id": "p3", "left": "INPUT Chain / Hook", "right": "Inspects incoming packets whose destination IP address is this local machine", "rightFr": "Inspecte les paquets entrants dont l'IP destination est la machine locale", "note": "Protects local services (SSH, Web, DB)", "noteFr": "Protège les services hébergés en local"},
      {"id": "p4", "left": "FORWARD Chain / Hook", "right": "Inspects packets routed across this machine from one network to another", "rightFr": "Filtre les paquets routés à travers la machine d'un réseau vers un autre", "note": "Crucial for Linux routers and VPN gateways", "noteFr": "Essentiel pour les passerelles et routeurs"},
      {"id": "p5", "left": "nft add rule inet filter input ct state established,related accept", "right": "Stateful firewall rule allowing return traffic for established connections", "rightFr": "Règle de filtrage avec état acceptant les paquets retours de flux établis", "note": "Stateful connection tracking (conntrack)", "noteFr": "Suivi des connexions conntrack"},
      {"id": "p6", "left": "nftables 'inet' family", "right": "Dual-stack filtering table handling both IPv4 and IPv6 traffic in a single rule", "rightFr": "Famille unifiée traitant simultanément le trafic IPv4 et IPv6 dans une seule règle", "note": "Major improvement over iptables + ip6tables", "noteFr": "Progrès majeur face à iptables et ip6tables"}
    ]
  }
]
