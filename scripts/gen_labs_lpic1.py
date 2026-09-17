# -*- coding: utf-8 -*-
"""
LPIC-1: 20 Guided Mini-Labs (10 for Exam 101, 10 for Exam 102)
"""

labs_lpic1 = [
  # --- EXAM 101 ---
  {
    "id": "lab-lpic1-01",
    "title": "Hardware Discovery & Kernel Module Identification",
    "titleFr": "Découverte matérielle & Identification des pilotes du noyau",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.1",
    "category": "System Architecture",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Inspect PCI buses, detect Ethernet controller drivers, list connected USB devices, and check kernel initialization messages.",
    "goalFr": "Inspecter les bus PCI, identifier le pilote du contrôleur Ethernet, lister les périphériques USB et vérifier les messages de boot du noyau.",
    "context": "A newly installed server experiences networking issues. You must inspect hardware peripherals and verify driver bindings.",
    "contextFr": "Un serveur fraîchement installé a des soucis réseau. Vous devez inspecter les périphériques matériels et vérifier les modules associés.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List PCI devices with kernel drivers in use",
        "titleFr": "Lister les périphériques PCI avec leurs pilotes en cours",
        "instruction": "Run lspci with the flag that displays the kernel driver and module handling each PCI device.",
        "instructionFr": "Exécutez lspci avec l'option affichant le pilote noyau et le module prenant en charge chaque périphérique.",
        "hint": "lspci -k",
        "hintFr": "lspci -k",
        "expectedCommands": ["lspci -k", "sudo lspci -k", "/usr/bin/lspci -k"],
        "simulatedOutput": "00:1f.6 Ethernet controller: Intel Corporation Ethernet Connection (2) I219-LM (rev 31)\n\tSubsystem: Dell Device 07a0\n\tKernel driver in use: e1000e\n\tKernel modules: e1000e\n01:00.0 VGA compatible controller: NVIDIA Corporation GP107 [GeForce GTX 1050]\n\tKernel driver in use: nouveau",
        "explanation": "lspci -k reveals both the loaded kernel driver and available kernel modules for all detected PCI hardware.",
        "explanationFr": "lspci -k affiche pour chaque périphérique PCI le pilote noyau actuellement actif ainsi que les modules compatibles."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect USB bus topology and connected peripherals",
        "titleFr": "Inspecter la topologie du bus USB et périphériques connectés",
        "instruction": "Execute the standard utility to list all connected USB devices and controllers.",
        "instructionFr": "Exécutez l'utilitaire standard pour lister tous les périphériques et contrôleurs USB connectés.",
        "hint": "lsusb",
        "hintFr": "lsusb",
        "expectedCommands": ["lsusb", "sudo lsusb", "/usr/bin/lsusb"],
        "simulatedOutput": "Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub\nBus 001 Device 002: ID 046d:c52b Logitech, Inc. Unifying Receiver\nBus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub\nBus 002 Device 002: ID 0781:5581 SanDisk Corp. Ultra USB 3.0",
        "expectedCommands": ["lsusb", "sudo lsusb", "/usr/bin/lsusb", "lsusb -v"],
        "explanation": "lsusb queries the sysfs /proc/bus/usb tree to report USB hubs, device IDs, and vendor strings.",
        "explanationFr": "lsusb interroge l'arborescence sysfs pour restituer les identifiants constructeurs/produits et hubs USB."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Filter kernel ring buffer for network link events",
        "titleFr": "Filtrer le tampon circulaire du noyau pour les événements réseau",
        "instruction": "Inspect dmesg filtering case-insensitively for 'eth' messages to check initialization logs.",
        "instructionFr": "Consultez dmesg en filtrant de manière insensible à la casse sur 'eth' pour vérifier les logs d'initialisation.",
        "hint": "dmesg | grep -i eth",
        "hintFr": "dmesg | grep -i eth",
        "expectedCommands": ["dmesg | grep -i eth", "sudo dmesg | grep -i eth", "dmesg --ctime | grep -i eth"],
        "simulatedOutput": "[    1.841920] e1000e 0000:00:1f.6 eth0: (PCI Express:2.5GT/s:Width x1) 54:bf:64:12:34:56\n[    1.841925] e1000e 0000:00:1f.6 eth0: Intel(R) PRO/1000 Network Connection\n[    1.842100] e1000e 0000:00:1f.6 eth0: MAC: 11, PHY: 12, PBA No: FFFFFF-0FF",
        "explanation": "dmesg queries the kernel ring buffer. Piping into grep isolates driver initialization and hardware negotiation status.",
        "explanationFr": "dmesg lit le tampon dmesg du noyau. Le filtre grep permet d'isoler la détection du pilote réseau."
      }
    ]
  },
  {
    "id": "lab-lpic1-02",
    "title": "Boot Targets & Emergency Rescue Operations",
    "titleFr": "Cibles de démarrage & Opérations en mode secours (Rescue)",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.2",
    "category": "Boot & Initialization",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Verify the active default systemd target, switch to rescue target, check critical boot errors in journalctl, and return to default target.",
    "goalFr": "Vérifier la cible de démarrage systemd par défaut, basculer en mode rescue, analyser les erreurs critiques et revenir à la cible par défaut.",
    "context": "A misconfigured service blocks graphical login. You must switch to single-user maintenance mode and inspect failure logs.",
    "contextFr": "Un service défaillant bloque la connexion graphique. Vous devez basculer en maintenance single-user et analyser les erreurs.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Query current default systemd boot target",
        "titleFr": "Afficher la cible systemd active par défaut",
        "instruction": "Execute systemctl with the sub-command that displays the active default boot target.",
        "instructionFr": "Exécutez systemctl avec la sous-commande affichant la cible de démarrage par défaut.",
        "hint": "systemctl get-default",
        "hintFr": "systemctl get-default",
        "expectedCommands": ["systemctl get-default", "sudo systemctl get-default"],
        "simulatedOutput": "graphical.target",
        "explanation": "systemctl get-default displays the symbolic link target (/etc/systemd/system/default.target).",
        "explanationFr": "systemctl get-default indique la cible par défaut vers laquelle pointe default.target."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Isolate system into single-user rescue mode",
        "titleFr": "Basculer le système en mode secours (rescue.target)",
        "instruction": "Use systemctl isolate to switch runtime state to rescue.target immediately.",
        "instructionFr": "Utilisez systemctl isolate pour basculer immédiatement en rescue.target.",
        "hint": "systemctl isolate rescue.target",
        "hintFr": "systemctl isolate rescue.target",
        "expectedCommands": ["systemctl isolate rescue.target", "sudo systemctl isolate rescue.target", "systemctl isolate rescue"],
        "simulatedOutput": "Stopping graphical display manager and background user sessions...\nReached target Rescue Mode.\nWelcome to emergency/rescue shell! (Type ^D to resume normal boot)",
        "explanation": "systemctl isolate stops non-essential services and starts only units required by rescue.target (runlevel 1 equivalent).",
        "explanationFr": "systemctl isolate stoppe les services non indispensables pour activer l'environnement minimal de maintenance."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect critical boot errors in journalctl",
        "titleFr": "Consulter les erreurs de boot critiques avec journalctl",
        "instruction": "Query journalctl for the current boot (-b) filtering only error level and higher (-p err).",
        "instructionFr": "Interrogez journalctl sur le boot courant (-b) en filtrant les messages de niveau erreur et pire (-p err).",
        "hint": "journalctl -b -p err",
        "hintFr": "journalctl -b -p err",
        "expectedCommands": ["journalctl -b -p err", "sudo journalctl -b -p err", "journalctl -b -p 3"],
        "simulatedOutput": "Sep 16 10:04:12 srv systemd[1]: Failed to start Light Display Manager.\nSep 16 10:04:12 srv lightdm[842]: [CRITICAL] Failed to initialize X server: display not detected.\nSep 16 10:04:12 srv systemd[1]: lightdm.service: Main process exited, code=exited, status=1/FAILURE",
        "explanation": "journalctl -b -p err isolates priority 3 (err) down to emergency (0) events recorded during the current startup.",
        "explanationFr": "journalctl -b -p err isole les logs de sévérité 3 (err) et supérieure sur le démarrage en cours."
      }
    ]
  },
  {
    "id": "lab-lpic1-03",
    "title": "GRUB2 Boot Parameters & Kernel Arguments",
    "titleFr": "Paramètres d'amorçage GRUB2 & Arguments du noyau",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.3",
    "category": "Boot Configuration",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Inspect live kernel boot parameters, examine /etc/default/grub defaults, and regenerate the grub2 configuration file.",
    "goalFr": "Consulter les paramètres effectifs passés au noyau, examiner /etc/default/grub et régénérer le fichier grub.cfg.",
    "context": "You need to verify whether the console output redirection and quiet boot flags are enabled on this host.",
    "contextFr": "Vous devez vérifier si la redirection console et les options quiet/splash sont appliquées sur ce système.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "View active kernel command line arguments",
        "titleFr": "Afficher les arguments de démarrage du noyau actif",
        "instruction": "Display the virtual kernel pseudo-file containing the exact arguments used at boot time.",
        "instructionFr": "Affichez le contenu du pseudo-fichier virtuel contenant la ligne de commande exacte passée au noyau.",
        "hint": "cat /proc/cmdline",
        "hintFr": "cat /proc/cmdline",
        "expectedCommands": ["cat /proc/cmdline"],
        "simulatedOutput": "BOOT_IMAGE=/boot/vmlinuz-6.8.0-40-generic root=UUID=6d51a9e8-42f1-4b10-a299-91823ab0213d ro quiet splash vt.handoff=7",
        "explanation": "/proc/cmdline exposes the read-only parameters that were supplied to the Linux kernel by GRUB at boot time.",
        "explanationFr": "/proc/cmdline expose en lecture seule les paramètres fournis au noyau par le chargeur d'amorçage."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect GRUB2 default configuration file",
        "titleFr": "Examiner le fichier de configuration par défaut de GRUB2",
        "instruction": "Display the /etc/default/grub configuration file.",
        "instructionFr": "Affichez le fichier de configuration /etc/default/grub.",
        "hint": "cat /etc/default/grub",
        "hintFr": "cat /etc/default/grub",
        "expectedCommands": ["cat /etc/default/grub", "less /etc/default/grub", "head -n 20 /etc/default/grub"],
        "simulatedOutput": "GRUB_DEFAULT=0\nGRUB_TIMEOUT_STYLE=hidden\nGRUB_TIMEOUT=5\nGRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`\nGRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash\"\nGRUB_CMDLINE_LINUX=\"\"",
        "explanation": "/etc/default/grub contains high-level user configurations used by generator scripts in /etc/grub.d/.",
        "explanationFr": "/etc/default/grub contient les variables de personnalisation de base utilisées lors de la génération de grub.cfg."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Regenerate GRUB2 configuration",
        "titleFr": "Régénérer la configuration GRUB2",
        "instruction": "Run update-grub (or grub2-mkconfig) to compile /etc/default/grub and /etc/grub.d/ into grub.cfg.",
        "instructionFr": "Exécutez update-grub (ou grub2-mkconfig) pour compiler la configuration finale.",
        "hint": "update-grub ou grub2-mkconfig -o /boot/grub2/grub.cfg",
        "hintFr": "update-grub ou grub2-mkconfig -o /boot/grub2/grub.cfg",
        "expectedCommands": [
          "update-grub",
          "sudo update-grub",
          "grub-mkconfig -o /boot/grub/grub.cfg",
          "grub2-mkconfig -o /boot/grub2/grub.cfg",
          "sudo grub-mkconfig -o /boot/grub/grub.cfg",
          "sudo grub2-mkconfig -o /boot/grub2/grub.cfg"
        ],
        "simulatedOutput": "Sourcing file `/etc/default/grub'\nGenerating grub configuration file ...\nFound linux image: /boot/vmlinuz-6.8.0-40-generic\nFound initrd image: /boot/initrd.img-6.8.0-40-generic\ndone",
        "explanation": "update-grub executes grub-mkconfig to parse templates and write the binary/scripted /boot/grub/grub.cfg file.",
        "explanationFr": "update-grub exécute grub-mkconfig pour assembler les scripts et régénérer le grub.cfg définitif."
      }
    ]
  },
  {
    "id": "lab-lpic1-04",
    "title": "Disk Partitioning with fdisk & gdisk (MBR vs GPT)",
    "titleFr": "Partitionnement de disques avec fdisk & gdisk (MBR vs GPT)",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.1",
    "category": "Storage & Partitions",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "goal": "Inspect block devices with lsblk, list partition table of /dev/sdb, and reload partition changes with partprobe.",
    "goalFr": "Examiner la hiérarchie des disques avec lsblk, lister la table de partition de /dev/sdb et forcer la relecture noyau avec partprobe.",
    "context": "A secondary storage disk (/dev/sdb) has been added. You need to verify its partition schema and trigger kernel sync.",
    "contextFr": "Un second disque (/dev/sdb) vient d'être connecté. Vous devez analyser sa table de partitions et forcer la détection.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List block device topology with filesystems",
        "titleFr": "Lister la topologie des disques blocs avec leurs systèmes de fichiers",
        "instruction": "Execute lsblk with the flag showing filesystem types and mountpoints.",
        "instructionFr": "Exécutez lsblk avec l'option affichant les types de systèmes de fichiers et points de montage.",
        "hint": "lsblk -f",
        "hintFr": "lsblk -f",
        "expectedCommands": ["lsblk -f", "lsblk", "sudo lsblk -f"],
        "simulatedOutput": "NAME   FSTYPE FSVER LABEL  UUID                                 FSAVAIL FSUSE% MOUNTPOINTS\nsda                                                                                \n├─sda1 vfat   FAT32 BOOT   42C1-19B2                             480.2M     6% /boot/efi\n└─sda2 ext4   1.0   ROOT   6d51a9e8-42f1-4b10-a299-91823ab0213d   38.4G    44% /\nsdb                                                                                \n└─sdb1",
        "explanation": "lsblk -f provides a clear hierarchical overview of block devices, UUIDs, filesystem types, and mount points.",
        "explanationFr": "lsblk -f offre une vue arborescente détaillée des périphériques blocs, UUID, types de FS et points de montage."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Print partition table of /dev/sdb using fdisk",
        "titleFr": "Afficher la table de partitionnement de /dev/sdb avec fdisk",
        "instruction": "Run fdisk with the print list flag (-l) targeting /dev/sdb.",
        "instructionFr": "Exécutez fdisk avec le drapeau de listage (-l) ciblant /dev/sdb.",
        "hint": "fdisk -l /dev/sdb",
        "hintFr": "fdisk -l /dev/sdb",
        "expectedCommands": ["fdisk -l /dev/sdb", "sudo fdisk -l /dev/sdb"],
        "simulatedOutput": "Disk /dev/sdb: 50 GiB, 53687091200 bytes, 104857600 sectors\nDisk model: VBOX HARDDISK   \nUnits: sectors of 1 * 512 = 512 bytes\nDisklabel type: gpt\nDisk identifier: 8E790212-4B21-4E10-9F12-781A92B10012\n\nDevice     Start       End   Sectors Size Type\n/dev/sdb1   2048 104855551 104853504  50G Linux filesystem",
        "explanation": "fdisk -l /dev/sdb reads the disk label type (GPT or DOS) and outputs sector boundaries and partition identifiers.",
        "explanationFr": "fdisk -l /dev/sdb analyse le type de label de disque (GPT ou MBR) et détaille chaque partition."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Notify kernel of partition table updates",
        "titleFr": "Informer le noyau de la mise à jour des partitions sans reboot",
        "instruction": "Run partprobe on /dev/sdb to refresh kernel partition mappings without rebooting.",
        "instructionFr": "Exécutez partprobe sur /dev/sdb pour actualiser les tables en mémoire du noyau.",
        "hint": "partprobe /dev/sdb",
        "hintFr": "partprobe /dev/sdb",
        "expectedCommands": ["partprobe /dev/sdb", "sudo partprobe /dev/sdb", "partprobe"],
        "simulatedOutput": "[OK] Kernel partition table re-read for /dev/sdb successfully.",
        "explanation": "partprobe calls the BLKRRPART ioctl to instruct the Linux kernel to re-scan partition tables on active disks.",
        "explanationFr": "partprobe demande au noyau via l'ioctl BLKRRPART de relire la table des partitions sans redémarrage."
      }
    ]
  },
  {
    "id": "lab-lpic1-05",
    "title": "Filesystem Formatting & Labeling (ext4 & XFS)",
    "titleFr": "Formatage et étiquetage de systèmes de fichiers (ext4 & XFS)",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.2",
    "category": "Storage & Filesystems",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Format a partition as ext4 with label 'DataVol', inspect block attributes with blkid, and check filesystem parameters with tune2fs.",
    "goalFr": "Formater une partition en ext4 avec le label 'DataVol', vérifier les attributs avec blkid et examiner les métadonnées avec tune2fs.",
    "context": "A newly created partition /dev/sdb1 must be prepared for application data storage with a persistent volume label.",
    "contextFr": "Une nouvelle partition /dev/sdb1 doit être initialisée en ext4 avec un label explicite pour les sauvegardes.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Format partition with ext4 and volume label",
        "titleFr": "Formater la partition en ext4 avec le label DataVol",
        "instruction": "Use mkfs.ext4 with label option -L to format /dev/sdb1 with label 'DataVol'.",
        "instructionFr": "Utilisez mkfs.ext4 avec l'option de label -L pour formater /dev/sdb1 en nommant le volume 'DataVol'.",
        "hint": "mkfs.ext4 -L DataVol /dev/sdb1",
        "hintFr": "mkfs.ext4 -L DataVol /dev/sdb1",
        "expectedCommands": [
          "mkfs.ext4 -L DataVol /dev/sdb1",
          "sudo mkfs.ext4 -L DataVol /dev/sdb1",
          "mkfs -t ext4 -L DataVol /dev/sdb1",
          "sudo mkfs -t ext4 -L DataVol /dev/sdb1"
        ],
        "simulatedOutput": "mke2fs 1.47.0 (5-Feb-2023)\nCreating filesystem with 13106688 4k blocks and 3276800 inodes\nFilesystem UUID: 9fa1c20e-8840-4211-9a10-410a82b9e190\nSuperblock backups stored on blocks: \n\t32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632\n\nAllocating group tables: done                            \nWriting inode tables: done                            \nCreating journal (65536 blocks): done\nWriting superblocks and filesystem accounting information: done",
        "explanation": "mkfs.ext4 initializes inodes, superblocks, block groups, and sets the volume label tag in superblock.",
        "explanationFr": "mkfs.ext4 structure les blocs, alloue les tables d'inodes, crée le journal et inscrit le label dans le superblock."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Verify UUID and volume label with blkid",
        "titleFr": "Vérifier le UUID et le label de volume avec blkid",
        "instruction": "Run blkid targeting /dev/sdb1 to verify its assigned LABEL, UUID, and TYPE.",
        "instructionFr": "Exécutez blkid sur /dev/sdb1 pour contrôler son LABEL, UUID et TYPE.",
        "hint": "blkid /dev/sdb1",
        "hintFr": "blkid /dev/sdb1",
        "expectedCommands": ["blkid /dev/sdb1", "sudo blkid /dev/sdb1", "/sbin/blkid /dev/sdb1"],
        "simulatedOutput": "/dev/sdb1: LABEL=\"DataVol\" UUID=\"9fa1c20e-8840-4211-9a10-410a82b9e190\" BLOCK_SIZE=\"4096\" TYPE=\"ext4\" PARTUUID=\"8e790212-01\"",
        "explanation": "blkid queries libblkid cache to print persistent block device attributes without mounting.",
        "explanationFr": "blkid interroge le cache libblkid pour afficher les attributs (LABEL, UUID, TYPE) sans nécessiter de montage."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect superblock metadata with tune2fs",
        "titleFr": "Examiner les métadonnées du superblock avec tune2fs",
        "instruction": "Execute tune2fs with the flag to list superblock contents (-l) for /dev/sdb1.",
        "instructionFr": "Exécutez tune2fs avec l'option de listage du superblock (-l) pour /dev/sdb1.",
        "hint": "tune2fs -l /dev/sdb1",
        "hintFr": "tune2fs -l /dev/sdb1",
        "expectedCommands": ["tune2fs -l /dev/sdb1", "sudo tune2fs -l /dev/sdb1"],
        "simulatedOutput": "tune2fs 1.47.0 (5-Feb-2023)\nFilesystem volume name:   DataVol\nLast mounted on:          <not available>\nFilesystem UUID:          9fa1c20e-8840-4211-9a10-410a82b9e190\nFilesystem magic number:  0xEF53\nFilesystem state:         clean\nErrors behavior:          Continue\nFilesystem OS type:       Linux\nInode count:              3276800\nBlock count:              13106688\nReserved block count:     655334 (5.0%)",
        "explanation": "tune2fs -l displays parameters such as mount count, block size, error behavior, and reserved space.",
        "explanationFr": "tune2fs -l affiche les détails d'ingénierie du FS : état, nombre de montages, blocs réservés et comportement sur erreur."
      }
    ]
  },
  {
    "id": "lab-lpic1-06",
    "title": "Mount Operations, /etc/fstab & Systemd Mount Units",
    "titleFr": "Opérations de montage, /etc/fstab & Unités de montage systemd",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.3",
    "category": "Storage & Mounts",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Create mount point /mnt/data, mount /dev/sdb1, remount it read-only, and trigger systemctl daemon-reload.",
    "goalFr": "Créer le point de montage /mnt/data, monter /dev/sdb1, le remonter à chaud en lecture seule et recharger systemd.",
    "context": "A data filesystem must be mounted manually, verified, and toggled between read-write and read-only modes.",
    "contextFr": "Un système de fichiers de données doit être monté, vérifié, puis basculé en lecture seule pour maintenance.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Create directory /mnt/data and mount partition",
        "titleFr": "Créer le répertoire /mnt/data et monter la partition",
        "instruction": "Create directory /mnt/data with mkdir -p, then mount /dev/sdb1 onto /mnt/data.",
        "instructionFr": "Créez le point de montage /mnt/data puis montez /dev/sdb1 sur ce dossier.",
        "hint": "mount /dev/sdb1 /mnt/data",
        "hintFr": "mount /dev/sdb1 /mnt/data",
        "expectedCommands": [
          "mount /dev/sdb1 /mnt/data",
          "sudo mount /dev/sdb1 /mnt/data",
          "mkdir -p /mnt/data && mount /dev/sdb1 /mnt/data",
          "sudo mkdir -p /mnt/data && sudo mount /dev/sdb1 /mnt/data"
        ],
        "simulatedOutput": "[OK] /dev/sdb1 mounted on /mnt/data (type ext4, rw, relatime).",
        "explanation": "mount binds the block device filesystem to the specified directory tree point.",
        "explanationFr": "mount raccorde le système de fichiers du périphérique bloc au nœud d'arborescence spécifié."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Remount filesystem in read-only mode online",
        "titleFr": "Remonter le système de fichiers en lecture seule à chaud",
        "instruction": "Use mount with -o remount,ro to toggle /mnt/data to read-only without unmounting.",
        "instructionFr": "Utilisez mount avec l'option -o remount,ro pour basculer /mnt/data en lecture seule sans démontage.",
        "hint": "mount -o remount,ro /mnt/data",
        "hintFr": "mount -o remount,ro /mnt/data",
        "expectedCommands": [
          "mount -o remount,ro /mnt/data",
          "sudo mount -o remount,ro /mnt/data",
          "mount -o remount,ro /dev/sdb1 /mnt/data"
        ],
        "simulatedOutput": "[OK] Filesystem /mnt/data successfully remounted with options (ro,relatime).",
        "explanation": "The remount flag changes filesystem mount attributes on the fly without breaking active directory references.",
        "explanationFr": "L'option remount modifie dynamiquement les attributs du montage sans rompre les références de dossiers."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Reload systemd mount generators after fstab modification",
        "titleFr": "Recharger les générateurs de montage systemd après fstab",
        "instruction": "Instruct systemd to reload its configuration and re-evaluate /etc/fstab mount definitions.",
        "instructionFr": "Demandez à systemd de recharger sa configuration pour recalculer les unités à partir de /etc/fstab.",
        "hint": "systemctl daemon-reload",
        "hintFr": "systemctl daemon-reload",
        "expectedCommands": ["systemctl daemon-reload", "sudo systemctl daemon-reload"],
        "simulatedOutput": "[OK] systemd-fstab-generator executed. Regenerated 8 mount/swap unit files.",
        "explanation": "systemctl daemon-reload triggers systemd generators, transforming /etc/fstab lines into native systemd .mount units.",
        "explanationFr": "systemctl daemon-reload réexécute les générateurs systemd traduisant fstab en unités .mount."
      }
    ]
  },
  {
    "id": "lab-lpic1-07",
    "title": "Process Monitoring & Signal Dispatching",
    "titleFr": "Surveillance des processus & Envoi de signaux POSIX",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.1",
    "category": "Process Management",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Find process PIDs using pgrep, send graceful reload SIGHUP (1), send termination SIGTERM (15), and forcefully terminate stubborn workers.",
    "goalFr": "Trouver des processus avec pgrep, envoyer un signal de rechargement SIGHUP (1), puis un arrêt propre SIGTERM (15).",
    "context": "A rogue background web worker needs to reload its configuration first, and later be safely terminated.",
    "contextFr": "Un processus de traitement en tâche de fond doit recharger sa configuration, puis être arrêté proprement.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Locate process PID by name using pgrep",
        "titleFr": "Trouver le PID d'un processus par son nom avec pgrep",
        "instruction": "Find the PID of all processes matching 'nginx' with pgrep.",
        "instructionFr": "Identifiez le PID de tous les processus 'nginx' avec la commande pgrep.",
        "hint": "pgrep -l nginx",
        "hintFr": "pgrep -l nginx",
        "expectedCommands": ["pgrep -l nginx", "pgrep nginx", "pgrep -a nginx", "ps aux | grep nginx"],
        "simulatedOutput": "1284 nginx (master process)\n1285 nginx (worker process 1)\n1286 nginx (worker process 2)",
        "explanation": "pgrep searches currently active processes and lists process IDs matching selection criteria.",
        "explanationFr": "pgrep recherche dans la table des processus et renvoie les identifiants numériques correspondants."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Send SIGHUP (Signal 1) to trigger configuration reload",
        "titleFr": "Envoyer un SIGHUP (Signal 1) pour recharger la configuration",
        "instruction": "Send SIGHUP (-1 or -HUP) to nginx master process (PID 1284) using the kill command.",
        "instructionFr": "Envoyez SIGHUP (-1 ou -HUP) au processus maître nginx (PID 1284) avec la commande kill.",
        "hint": "kill -HUP 1284 ou kill -1 1284",
        "hintFr": "kill -HUP 1284 ou kill -1 1284",
        "expectedCommands": [
          "kill -HUP 1284",
          "kill -1 1284",
          "kill -s HUP 1284",
          "sudo kill -HUP 1284",
          "sudo kill -1 1284",
          "kill -HUP $(pgrep -f 'nginx: master')",
          "killall -HUP nginx"
        ],
        "simulatedOutput": "[OK] Signal 1 (SIGHUP) dispatched to PID 1284. Configuration reloaded without connection drop.",
        "explanation": "SIGHUP informs daemons to reread configuration files without restarting the main listening socket.",
        "explanationFr": "SIGHUP ordonne aux démons de relire leur configuration sans couper les connexions établies."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Terminate worker processes by name with pkill",
        "titleFr": "Arrêter les processus par nom avec pkill",
        "instruction": "Use pkill with SIGTERM (default or -15) to terminate all 'nginx' processes gracefully.",
        "instructionFr": "Utilisez pkill avec SIGTERM (par défaut ou -15) pour terminer tous les processus 'nginx' proprement.",
        "hint": "pkill nginx ou pkill -15 nginx",
        "hintFr": "pkill nginx ou pkill -15 nginx",
        "expectedCommands": [
          "pkill nginx",
          "pkill -15 nginx",
          "pkill -TERM nginx",
          "sudo pkill nginx",
          "sudo pkill -15 nginx",
          "killall nginx"
        ],
        "simulatedOutput": "[OK] SIGTERM signal delivered to matching processes. Master and workers exited cleanly.",
        "explanation": "pkill sends POSIX signals to all processes matching the pattern by scanning /proc entries.",
        "explanationFr": "pkill envoie un signal POSIX à l'ensemble des processus dont le nom correspond au motif."
      }
    ]
  },
  {
    "id": "lab-lpic1-08",
    "title": "Process Scheduling Priorities (nice & renice)",
    "titleFr": "Priorités d'ordonnancement des processus (nice & renice)",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.2",
    "category": "Process Management",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Launch a backup compression command with lower CPU priority (+15), verify its niceness, and adjust an active process with renice.",
    "goalFr": "Lancer une compression avec une priorité CPU dégradée (+15), vérifier sa niceness et modifier un PID existant avec renice.",
    "context": "A heavy tar archive task threatens database performance. You must deprioritize its CPU scheduling slice.",
    "contextFr": "Une sauvegarde tar consomme trop de CPU. Vous devez baisser sa priorité pour préserver la base de données.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Launch backup command with nice level +15",
        "titleFr": "Démarrer la commande avec une priorité nice de +15",
        "instruction": "Execute nice with -n 15 to run 'tar -czf /tmp/backup.tar.gz /var/log'.",
        "instructionFr": "Exécutez la commande nice avec -n 15 pour lancer 'tar -czf /tmp/backup.tar.gz /var/log'.",
        "hint": "nice -n 15 tar -czf /tmp/backup.tar.gz /var/log",
        "hintFr": "nice -n 15 tar -czf /tmp/backup.tar.gz /var/log",
        "expectedCommands": [
          "nice -n 15 tar -czf /tmp/backup.tar.gz /var/log",
          "nice -15 tar -czf /tmp/backup.tar.gz /var/log",
          "nice -n 15 tar -cf /tmp/backup.tar.gz /var/log"
        ],
        "simulatedOutput": "[OK] Process launched: PID 2049, nice value set to 15 (lower scheduling priority).",
        "explanation": "nice modifies the static scheduling priority (from -20 highest to +19 lowest) before program execution begins.",
        "explanationFr": "nice attribue une valeur de courtoisie (-20 à +19) avant le démarrage du processus."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Verify nice value of running PID 2049",
        "titleFr": "Vérifier la valeur de politesse du PID 2049",
        "instruction": "Use ps with custom format (-o pid,comm,ni) to inspect the niceness of PID 2049.",
        "instructionFr": "Utilisez ps avec le format personnalisé (-o pid,comm,ni) pour vérifier la niceness du PID 2049.",
        "hint": "ps -o pid,comm,ni -p 2049",
        "hintFr": "ps -o pid,comm,ni -p 2049",
        "expectedCommands": [
          "ps -o pid,comm,ni -p 2049",
          "ps -o pid,ni,comm -p 2049",
          "ps -p 2049 -o pid,comm,ni",
          "ps -l -p 2049",
          "top -p 2049"
        ],
        "simulatedOutput": "  PID COMMAND          NI\n 2049 tar              15",
        "explanation": "The 'NI' column in ps and top shows the current nice value governing CFS (Completely Fair Scheduler) shares.",
        "explanationFr": "La colonne 'NI' indique la priorité effective prise en compte par l'ordonnanceur du noyau Linux."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Alter priority of running process to +19 with renice",
        "titleFr": "Passer la priorité du processus à +19 avec renice",
        "instruction": "Use renice to change PID 2049 to priority 19 (minimum CPU priority).",
        "instructionFr": "Utilisez renice pour basculer le PID 2049 à la priorité 19 (priorité CPU minimale).",
        "hint": "renice +19 -p 2049 ou renice 19 -p 2049",
        "hintFr": "renice +19 -p 2049 ou renice 19 -p 2049",
        "expectedCommands": [
          "renice +19 -p 2049",
          "renice 19 -p 2049",
          "renice -n 19 -p 2049",
          "sudo renice 19 -p 2049"
        ],
        "simulatedOutput": "2049 (process ID) old priority 15, new priority 19",
        "explanation": "renice dynamically updates the scheduling priority of already running processes without restarting them.",
        "explanationFr": "renice ajuste dynamiquement en mémoire la priorité d'un processus déjà en cours d'exécution."
      }
    ]
  },
  {
    "id": "lab-lpic1-09",
    "title": "Text Stream Processing & Pipeline Filtering",
    "titleFr": "Traitement de flux texte & Filtrage de pipelines",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.3",
    "category": "Text & Stream Processing",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Extract usernames and login shells from /etc/passwd using cut, sort unique shells, and count occurrences with uniq -c.",
    "goalFr": "Extraire utilisateurs et shells depuis /etc/passwd avec cut, trier et compter la fréquence de chaque shell avec uniq -c.",
    "context": "A security audit requires reporting how many system accounts have valid login shells versus nologin/false.",
    "contextFr": "Un audit de sécurité exige de comptabiliser le nombre de comptes affectés à chaque shell système.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Extract field 7 (login shell) from /etc/passwd",
        "titleFr": "Extraire le 7ème champ (shell) de /etc/passwd",
        "instruction": "Execute cut using delimiter ':' (-d:) to output only field 7 (-f7) from /etc/passwd.",
        "instructionFr": "Exécutez cut avec le délimiteur ':' (-d:) pour extraire uniquement le champ 7 (-f7) de /etc/passwd.",
        "hint": "cut -d: -f7 /etc/passwd",
        "hintFr": "cut -d: -f7 /etc/passwd",
        "expectedCommands": [
          "cut -d: -f7 /etc/passwd",
          "cut -d ':' -f 7 /etc/passwd",
          "awk -F: '{print $7}' /etc/passwd"
        ],
        "simulatedOutput": "/bin/bash\n/usr/sbin/nologin\n/bin/false\n/bin/bash\n/usr/sbin/nologin\n/usr/sbin/nologin",
        "explanation": "cut -d: -f7 splits text lines by the colon separator and extracts column 7.",
        "explanationFr": "cut -d: -f7 découpe chaque ligne par le caractère deux-points et ne conserve que la 7e colonne."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Sort extracted shells and count unique occurrences",
        "titleFr": "Trier les shells et compter les occurrences uniques",
        "instruction": "Pipe cut output into sort, then pipe into uniq -c to get frequency counts.",
        "instructionFr": "Passez la sortie de cut dans sort, puis dans uniq -c pour afficher le décompte.",
        "hint": "cut -d: -f7 /etc/passwd | sort | uniq -c",
        "hintFr": "cut -d: -f7 /etc/passwd | sort | uniq -c",
        "expectedCommands": [
          "cut -d: -f7 /etc/passwd | sort | uniq -c",
          "cut -d ':' -f 7 /etc/passwd | sort | uniq -c",
          "awk -F: '{print $7}' /etc/passwd | sort | uniq -c"
        ],
        "simulatedOutput": "      4 /bin/bash\n      2 /bin/false\n      1 /bin/sync\n     28 /usr/sbin/nologin",
        "explanation": "uniq requires sorted input to eliminate or count adjacent identical lines.",
        "explanationFr": "uniq exige une entrée préalablement triée par sort pour regrouper et dénombrer les lignes identiques."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Sort results numerically in descending order",
        "titleFr": "Trier le décompte de manière numérique décroissante",
        "instruction": "Append sort -nr to the previous pipeline to see the most frequent shell at the top.",
        "instructionFr": "Ajoutez sort -nr à la fin du pipeline pour afficher le shell le plus répandu en premier.",
        "hint": "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -nr",
        "hintFr": "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -nr",
        "expectedCommands": [
          "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -nr",
          "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -n -r",
          "awk -F: '{print $7}' /etc/passwd | sort | uniq -c | sort -nr"
        ],
        "simulatedOutput": "     28 /usr/sbin/nologin\n      4 /bin/bash\n      2 /bin/false\n      1 /bin/sync",
        "explanation": "sort -n performs arithmetic comparison, and -r reverses output to descending order.",
        "explanationFr": "sort -nr effectue un tri numérique (-n) en ordre décroissant (-r)."
      }
    ]
  },
  {
    "id": "lab-lpic1-10",
    "title": "Debian & Red Hat Package Management (dpkg & rpm)",
    "titleFr": "Gestion des paquets Debian & Red Hat (dpkg & rpm)",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.4",
    "category": "Package Management",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Query installed packages, identify which package owns /etc/nginx/nginx.conf, and list files installed by a deb/rpm package.",
    "goalFr": "Interroger les paquets installés, identifier quel paquet possède /etc/nginx/nginx.conf et lister les fichiers installés.",
    "context": "An auditor requests proof of package provenance for web server configuration files.",
    "contextFr": "Un auditeur demande la provenance exacte du fichier de configuration du serveur web.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Identify which package installed /etc/nginx/nginx.conf",
        "titleFr": "Identifier quel paquet a installé /etc/nginx/nginx.conf",
        "instruction": "Use dpkg -S (or rpm -qf) to find the owner package of /etc/nginx/nginx.conf.",
        "instructionFr": "Utilisez dpkg -S (ou rpm -qf) pour localiser le paquet propriétaire de /etc/nginx/nginx.conf.",
        "hint": "dpkg -S /etc/nginx/nginx.conf",
        "hintFr": "dpkg -S /etc/nginx/nginx.conf",
        "expectedCommands": [
          "dpkg -S /etc/nginx/nginx.conf",
          "dpkg --search /etc/nginx/nginx.conf",
          "rpm -qf /etc/nginx/nginx.conf"
        ],
        "simulatedOutput": "nginx-common: /etc/nginx/nginx.conf",
        "explanation": "dpkg -S scans the database /var/lib/dpkg/info/*.list to identify which installed package provided the designated file.",
        "explanationFr": "dpkg -S recherche dans la base des paquets installés le propriétaire d'un fichier spécifique."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List all installed files provided by package nginx-common",
        "titleFr": "Lister tous les fichiers installés par le paquet nginx-common",
        "instruction": "Use dpkg -L to list every filesystem path created by nginx-common.",
        "instructionFr": "Utilisez dpkg -L pour lister tous les fichiers et dossiers installés par nginx-common.",
        "hint": "dpkg -L nginx-common",
        "hintFr": "dpkg -L nginx-common",
        "expectedCommands": [
          "dpkg -L nginx-common",
          "dpkg --listfiles nginx-common",
          "rpm -ql nginx-common"
        ],
        "simulatedOutput": "/etc\n/etc/logrotate.d\n/etc/logrotate.d/nginx\n/etc/nginx\n/etc/nginx/conf.d\n/etc/nginx/mime.types\n/etc/nginx/nginx.conf\n/usr/share/man/man8/nginx.8.gz",
        "explanation": "dpkg -L reads /var/lib/dpkg/info/<pkg>.list to report all managed filesystem entries.",
        "explanationFr": "dpkg -L affiche la liste complète des chemins système déployés par le paquet."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Check package integrity and detect modified files",
        "titleFr": "Vérifier l'intégrité du paquet et détecter les fichiers altérés",
        "instruction": "Execute dpkg -V (or rpm -V) to verify MD5/SHA checksums of installed files for nginx-common.",
        "instructionFr": "Exécutez dpkg -V (ou rpm -V) pour vérifier l'intégrité des fichiers du paquet nginx-common.",
        "hint": "dpkg -V nginx-common",
        "hintFr": "dpkg -V nginx-common",
        "expectedCommands": [
          "dpkg -V nginx-common",
          "dpkg --verify nginx-common",
          "rpm -V nginx-common"
        ],
        "simulatedOutput": "??5?????? c /etc/nginx/nginx.conf",
        "explanation": "dpkg -V compares file checksums against package digests. '5' indicates the MD5 digest changed due to user edits.",
        "explanationFr": "dpkg -V contrôle les sommes de contrôle. L'indicateur '5' signale que le fichier a été modifié depuis son installation."
      }
    ]
  },

  # --- EXAM 102 ---
  {
    "id": "lab-lpic1-11",
    "title": "Shell Environment Customization & Aliases",
    "titleFr": "Personnalisation de l'environnement Shell & Alias",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.1",
    "category": "Shells & Environment",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Export PATH variable to include /opt/tools/bin, define a persistent alias, and check shell environment variables.",
    "goalFr": "Exporter la variable PATH avec /opt/tools/bin, définir un alias et vérifier les variables d'environnement.",
    "context": "Administrators require custom utilities located in /opt/tools/bin to be directly accessible from the command line.",
    "contextFr": "Les administrateurs doivent accéder directement aux scripts situés dans /opt/tools/bin.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Append directory to active PATH variable",
        "titleFr": "Ajouter le répertoire à la variable PATH active",
        "instruction": "Export PATH with /opt/tools/bin appended to its current contents.",
        "instructionFr": "Exportez la variable PATH en ajoutant /opt/tools/bin à sa valeur existante.",
        "hint": "export PATH=$PATH:/opt/tools/bin",
        "hintFr": "export PATH=$PATH:/opt/tools/bin",
        "expectedCommands": [
          "export PATH=$PATH:/opt/tools/bin",
          "export PATH=\"$PATH:/opt/tools/bin\"",
          "PATH=$PATH:/opt/tools/bin; export PATH"
        ],
        "simulatedOutput": "[OK] PATH updated: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/tools/bin",
        "explanation": "export marks the modified variable for export to all subsequently executed child processes.",
        "explanationFr": "export transmet la variable d'environnement modifiée à tous les futurs processus enfants."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Define an alias for detailed directory listing",
        "titleFr": "Définir un alias pour un listage détaillé des dossiers",
        "instruction": "Create the alias 'll' to run 'ls -la --color=auto'.",
        "instructionFr": "Créez l'alias 'll' équivalent à 'ls -la --color=auto'.",
        "hint": "alias ll='ls -la --color=auto'",
        "hintFr": "alias ll='ls -la --color=auto'",
        "expectedCommands": [
          "alias ll='ls -la --color=auto'",
          "alias ll=\"ls -la --color=auto\"",
          "alias ll='ls -la'",
          "alias ll=\"ls -la\""
        ],
        "simulatedOutput": "[OK] Alias registered: ll='ls -la --color=auto'",
        "explanation": "The alias builtin creates command shortcuts evaluated in interactive shell sessions.",
        "explanationFr": "La commande interne alias associe un raccourci de commande réutilisable dans le terminal interactif."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Display HISTSIZE configuration value",
        "titleFr": "Afficher la valeur configurée de HISTSIZE",
        "instruction": "Display the value of the environment variable HISTSIZE using echo.",
        "instructionFr": "Affichez la valeur de la variable d'environnement HISTSIZE avec echo.",
        "hint": "echo $HISTSIZE",
        "hintFr": "echo $HISTSIZE",
        "expectedCommands": ["echo $HISTSIZE", "echo \"$HISTSIZE\""],
        "simulatedOutput": "1000",
        "explanation": "HISTSIZE defines how many executed command lines are retained in memory during a shell session.",
        "explanationFr": "HISTSIZE détermine le nombre de commandes conservées en mémoire vive pendant la session shell."
      }
    ]
  },
  {
    "id": "lab-lpic1-12",
    "title": "Writing & Executing Basic Bash Automation Scripts",
    "titleFr": "Écriture & Exécution de scripts d'automatisation Bash",
    "certification": "lpic-1",
    "topicNumber": 105,
    "objectiveId": "105.2",
    "category": "Shell Scripting",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Set execute permissions on script.sh, test condition on /etc/passwd, and verify exit status ($?).",
    "goalFr": "Attribuer les droits d'exécution sur script.sh, tester la présence d'un fichier et contrôler le code retour ($?).",
    "context": "An automation script needs executable permissions and condition checks before integration into production cron jobs.",
    "contextFr": "Un script d'automatisation nécessite l'ajout des droits d'exécution et la vérification des codes de retour.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Add execute bit to backup script",
        "titleFr": "Ajouter le droit d'exécution sur le script de sauvegarde",
        "instruction": "Run chmod with symbolic or octal syntax to make /usr/local/bin/backup.sh executable (+x or 755).",
        "instructionFr": "Exécutez chmod pour rendre /usr/local/bin/backup.sh exécutable (+x ou 755).",
        "hint": "chmod +x /usr/local/bin/backup.sh",
        "hintFr": "chmod +x /usr/local/bin/backup.sh",
        "expectedCommands": [
          "chmod +x /usr/local/bin/backup.sh",
          "chmod 755 /usr/local/bin/backup.sh",
          "sudo chmod +x /usr/local/bin/backup.sh",
          "sudo chmod 755 /usr/local/bin/backup.sh"
        ],
        "simulatedOutput": "[OK] Permissions updated: -rwxr-xr-x 1 root root 842 /usr/local/bin/backup.sh",
        "explanation": "The execute bit (+x) allows the kernel execve syscall to run the script via its shebang line (#!/bin/bash).",
        "explanationFr": "Le droit d'exécution (+x) permet au noyau de lancer l'interpréteur spécifié dans le shebang (#!/bin/bash)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Test if file /etc/hosts exists and is a regular file",
        "titleFr": "Tester si /etc/hosts existe et est un fichier ordinaire",
        "instruction": "Use the test command (or [ ... ]) with -f to verify /etc/hosts.",
        "instructionFr": "Utilisez la commande test (ou [ ... ]) avec -f pour vérifier l'existence de /etc/hosts.",
        "hint": "test -f /etc/hosts",
        "hintFr": "test -f /etc/hosts",
        "expectedCommands": [
          "test -f /etc/hosts",
          "[ -f /etc/hosts ]",
          "[[ -f /etc/hosts ]]"
        ],
        "simulatedOutput": "",
        "explanation": "test -f evaluates file existence and regular file type without generating stdout output.",
        "explanationFr": "test -f valide la présence d'un fichier régulier et renvoie silencieusement un code de retour 0 en cas de succès."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Check exit code of preceding test command",
        "titleFr": "Vérifier le code de sortie de la commande de test",
        "instruction": "Print the value of the special variable $? to confirm success.",
        "instructionFr": "Affichez la valeur de la variable spéciale $? pour confirmer le succès.",
        "hint": "echo $?",
        "hintFr": "echo $?",
        "expectedCommands": ["echo $?", "echo \"$?\""],
        "simulatedOutput": "0",
        "explanation": "Exit code 0 indicates success. Non-zero values (1-255) signal false condition or runtime errors.",
        "explanationFr": "Le code retour 0 signale le succès. Toute valeur non nulle indique une condition fausse ou une erreur."
      }
    ]
  },
  {
    "id": "lab-lpic1-13",
    "title": "User Account Administration & Password Aging",
    "titleFr": "Administration des comptes utilisateurs & Expiration des mots de passe",
    "certification": "lpic-1",
    "topicNumber": 106,
    "objectiveId": "106.1",
    "category": "User Accounts",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Create a user account with specific shell, inspect password aging parameters with chage, and lock the user account.",
    "goalFr": "Créer un compte avec shell dédié, inspecter l'expiration du mot de passe avec chage et verrouiller le compte.",
    "context": "A contractor account 'operator1' must be created, configured for 90-day password expiration, and locked upon contract end.",
    "contextFr": "Un compte prestataire 'operator1' doit être créé avec expiration à 90 jours, puis verrouillé en fin de mission.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Create user operator1 with home directory and /bin/bash shell",
        "titleFr": "Créer l'utilisateur operator1 avec home et shell /bin/bash",
        "instruction": "Use useradd with -m (create home) and -s /bin/bash to create user operator1.",
        "instructionFr": "Utilisez useradd avec -m et -s /bin/bash pour créer l'utilisateur operator1.",
        "hint": "useradd -m -s /bin/bash operator1",
        "hintFr": "useradd -m -s /bin/bash operator1",
        "expectedCommands": [
          "useradd -m -s /bin/bash operator1",
          "sudo useradd -m -s /bin/bash operator1",
          "useradd -s /bin/bash -m operator1",
          "sudo useradd -s /bin/bash -m operator1"
        ],
        "simulatedOutput": "[OK] User operator1 created (UID 1004, GID 1004). Home directory /home/operator1 created.",
        "explanation": "useradd registers the user in /etc/passwd and /etc/shadow, copying skeleton files from /etc/skel.",
        "explanationFr": "useradd inscrit le compte dans /etc/passwd et /etc/shadow en initialisant le home depuis /etc/skel."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Display password aging details for operator1 with chage",
        "titleFr": "Afficher les paramètres d'expiration du mot de passe avec chage",
        "instruction": "Execute chage with -l to view password expiration details for operator1.",
        "instructionFr": "Exécutez chage avec -l pour consulter les règles d'expiration du mot de passe de operator1.",
        "hint": "chage -l operator1",
        "hintFr": "chage -l operator1",
        "expectedCommands": [
          "chage -l operator1",
          "sudo chage -l operator1"
        ],
        "simulatedOutput": "Last password change\t\t\t\t\t: Sep 16, 2026\nPassword expires\t\t\t\t\t: never\nPassword inactive\t\t\t\t\t: never\nAccount expires\t\t\t\t\t\t: never\nMinimum number of days between password change\t\t: 0\nMaximum number of days between password change\t\t: 99999\nNumber of days of warning before password expires\t: 7",
        "explanation": "chage -l reads fields 3 through 8 of /etc/shadow to report password aging policy.",
        "explanationFr": "chage -l lit les champs d'expiration de /etc/shadow et restitue les délais de validité du mot de passe."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Lock account operator1 using usermod",
        "titleFr": "Verrouiller le compte operator1 avec usermod",
        "instruction": "Use usermod with lock flag (-L) to disable logins for operator1.",
        "instructionFr": "Utilisez usermod avec l'option de verrouillage (-L) pour bloquer les connexions de operator1.",
        "hint": "usermod -L operator1",
        "hintFr": "usermod -L operator1",
        "expectedCommands": [
          "usermod -L operator1",
          "sudo usermod -L operator1",
          "passwd -l operator1",
          "sudo passwd -l operator1"
        ],
        "simulatedOutput": "[OK] Account operator1 locked (exclamation mark prepended to password hash in /etc/shadow).",
        "explanation": "usermod -L prepends a '!' to the hashed password in /etc/shadow, disabling password authentication.",
        "explanationFr": "usermod -L ajoute un point d'exclamation devant le hash dans /etc/shadow pour neutraliser l'authentification."
      }
    ]
  },
  {
    "id": "lab-lpic1-14",
    "title": "Group Management & Collaborative SGID Permissions",
    "titleFr": "Gestion des groupes & Droits collaboratifs avec le bit SGID",
    "certification": "lpic-1",
    "topicNumber": 106,
    "objectiveId": "106.2",
    "category": "Groups & Permissions",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Create group 'devteam', change group ownership of /srv/project, and enforce the SGID bit.",
    "goalFr": "Créer le groupe 'devteam', affecter le groupe propriétaire sur /srv/project et activer le bit SGID.",
    "context": "A team needs a shared folder where every file automatically inherits the team group ownership.",
    "contextFr": "Une équipe a besoin d'un dossier partagé où chaque nouveau fichier hérite automatiquement du groupe de l'équipe.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Create system group 'devteam'",
        "titleFr": "Créer le groupe système 'devteam'",
        "instruction": "Execute groupadd to register the group 'devteam'.",
        "instructionFr": "Exécutez groupadd pour créer le groupe 'devteam'.",
        "hint": "groupadd devteam",
        "hintFr": "groupadd devteam",
        "expectedCommands": ["groupadd devteam", "sudo groupadd devteam"],
        "simulatedOutput": "[OK] Group 'devteam' created with GID 1008.",
        "explanation": "groupadd inserts a new record into /etc/group and /etc/gshadow.",
        "explanationFr": "groupadd insère le nouvel enregistrement de groupe dans /etc/group et /etc/gshadow."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Change group ownership of /srv/project to devteam",
        "titleFr": "Affecter la propriété de groupe de /srv/project à devteam",
        "instruction": "Use chgrp (or chown) to assign group 'devteam' to /srv/project.",
        "instructionFr": "Utilisez chgrp (ou chown) pour affecter le groupe 'devteam' au dossier /srv/project.",
        "hint": "chgrp devteam /srv/project",
        "hintFr": "chgrp devteam /srv/project",
        "expectedCommands": [
          "chgrp devteam /srv/project",
          "sudo chgrp devteam /srv/project",
          "chown :devteam /srv/project",
          "sudo chown :devteam /srv/project"
        ],
        "simulatedOutput": "[OK] Ownership: drwxr-xr-x 2 root devteam 4096 /srv/project",
        "explanation": "chgrp changes the group owner without altering the user owner.",
        "explanationFr": "chgrp modifie le groupe propriétaire sans toucher à l'utilisateur propriétaire."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Enforce SGID bit and group read-write-execute permissions",
        "titleFr": "Activer le bit SGID et les droits d'écriture pour le groupe",
        "instruction": "Apply octal mode 2775 (or g+s,g+w) to /srv/project using chmod.",
        "instructionFr": "Appliquez le mode octal 2775 (ou g+s) sur /srv/project avec chmod.",
        "hint": "chmod 2775 /srv/project ou chmod g+s /srv/project",
        "hintFr": "chmod 2775 /srv/project ou chmod g+s /srv/project",
        "expectedCommands": [
          "chmod 2775 /srv/project",
          "sudo chmod 2775 /srv/project",
          "chmod g+s /srv/project",
          "sudo chmod g+s /srv/project",
          "chmod 2770 /srv/project",
          "sudo chmod 2770 /srv/project"
        ],
        "simulatedOutput": "[OK] Permissions: drwxrwsr-x 2 root devteam 4096 /srv/project (SGID active).",
        "explanation": "The SGID bit on a directory forces new child files to inherit the directory's group instead of the creator's primary group.",
        "explanationFr": "Le bit SGID sur un dossier force tout nouveau fichier à hériter du groupe du dossier plutôt que de l'auteur."
      }
    ]
  },
  {
    "id": "lab-lpic1-15",
    "title": "Automating Periodic Tasks with Cron & Anacron",
    "titleFr": "Automatisation de tâches périodiques avec Cron & Anacron",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.1",
    "category": "Task Automation",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "List active crontab entries, display system-wide /etc/crontab, and verify cron daemon service status.",
    "goalFr": "Lister les tâches crontab actives, afficher le fichier système /etc/crontab et vérifier le démon cron.",
    "context": "Scheduled backup and log rotation scripts must be audited to verify their execution intervals.",
    "contextFr": "Les tâches planifiées de sauvegarde et de rotation de logs doivent être contrôlées.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List current user crontab entries",
        "titleFr": "Lister les tâches de la crontab de l'utilisateur courant",
        "instruction": "Execute crontab with the list flag (-l).",
        "instructionFr": "Exécutez crontab avec l'option de listage (-l).",
        "hint": "crontab -l",
        "hintFr": "crontab -l",
        "expectedCommands": ["crontab -l", "sudo crontab -l"],
        "simulatedOutput": "# m h  dom mon dow   command\n0 2 * * * /usr/local/bin/backup.sh > /dev/null 2>&1\n30 4 * * 1 /usr/local/bin/weekly-audit.sh",
        "explanation": "crontab -l reads the spool file in /var/spool/cron/crontabs/ for the active user.",
        "explanationFr": "crontab -l lit le fichier de spool utilisateur dans /var/spool/cron/crontabs/."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "View system-wide crontab with username column",
        "titleFr": "Consulter la crontab globale /etc/crontab avec la colonne utilisateur",
        "instruction": "Display the file /etc/crontab.",
        "instructionFr": "Affichez le contenu du fichier /etc/crontab.",
        "hint": "cat /etc/crontab",
        "hintFr": "cat /etc/crontab",
        "expectedCommands": ["cat /etc/crontab", "head -n 20 /etc/crontab", "less /etc/crontab"],
        "simulatedOutput": "SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n# m h dom mon dow user  command\n17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly\n25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )",
        "explanation": "/etc/crontab has 7 fields: minute, hour, day-of-month, month, day-of-week, username, and command.",
        "explanationFr": "/etc/crontab possède un 6e champ supplémentaire spécifiant sous quel utilisateur s'exécute la commande."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Check status of the cron daemon",
        "titleFr": "Vérifier le statut du démon cron",
        "instruction": "Use systemctl status to check the cron (or crond) daemon service.",
        "instructionFr": "Utilisez systemctl status pour vérifier le service cron (ou crond).",
        "hint": "systemctl status cron",
        "hintFr": "systemctl status cron",
        "expectedCommands": [
          "systemctl status cron",
          "systemctl status crond",
          "sudo systemctl status cron",
          "sudo systemctl status crond"
        ],
        "simulatedOutput": "● cron.service - Regular background program processing daemon\n     Loaded: loaded (/lib/systemd/system/cron.service; enabled)\n     Active: active (running) since Wed 2026-09-16 08:00:00 UTC\n   Main PID: 741 (cron)",
        "explanation": "The cron daemon wakes every 60 seconds to inspect /etc/crontab and /var/spool/cron entries.",
        "explanationFr": "Le démon cron se réveille chaque minute pour vérifier si des tâches correspondent à l'heure courante."
      }
    ]
  },
  {
    "id": "lab-lpic1-16",
    "title": "System Logging with Systemd Journal & Rsyslog",
    "titleFr": "Journalisation système avec Journald & Rsyslog",
    "certification": "lpic-1",
    "topicNumber": 107,
    "objectiveId": "107.2",
    "category": "System Logging",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Emit a manual test message with logger, query journalctl by unit, and follow logs in real time.",
    "goalFr": "Émettre un message avec logger, interroger journalctl par unité et suivre les logs en direct.",
    "context": "You need to inject a tagged audit log message and verify that journald and rsyslog record it properly.",
    "contextFr": "Vous devez injecter un log de test pour vérifier la chaîne de transmission vers rsyslog et journald.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Emit a custom syslog message using logger",
        "titleFr": "Émettre un message syslog personnalisé avec logger",
        "instruction": "Use logger with facility.priority local0.warn and tag 'AUDIT_TEST' with message 'Security compliance check'.",
        "instructionFr": "Utilisez logger avec -p local0.warn et le tag -t AUDIT_TEST pour envoyer le message 'Security compliance check'.",
        "hint": "logger -p local0.warn -t AUDIT_TEST \"Security compliance check\"",
        "hintFr": "logger -p local0.warn -t AUDIT_TEST \"Security compliance check\"",
        "expectedCommands": [
          "logger -p local0.warn -t AUDIT_TEST \"Security compliance check\"",
          "logger -p local0.warn -t AUDIT_TEST 'Security compliance check'",
          "logger -t AUDIT_TEST \"Security compliance check\"",
          "logger \"Security compliance check\""
        ],
        "simulatedOutput": "[OK] Message dispatched to /dev/log socket.",
        "explanation": "logger writes directly to the /dev/log Unix domain socket consumed by systemd-journald or rsyslogd.",
        "explanationFr": "logger écrit dans le socket /dev/log lu par le démon de journalisation système."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Search journal logs for the emitted tag",
        "titleFr": "Rechercher le tag émis dans journalctl",
        "instruction": "Query journalctl with -t AUDIT_TEST to retrieve the newly recorded log entry.",
        "instructionFr": "Interrogez journalctl avec -t AUDIT_TEST pour retrouver l'entrée correspondante.",
        "hint": "journalctl -t AUDIT_TEST",
        "hintFr": "journalctl -t AUDIT_TEST",
        "expectedCommands": [
          "journalctl -t AUDIT_TEST",
          "sudo journalctl -t AUDIT_TEST",
          "journalctl | grep AUDIT_TEST"
        ],
        "simulatedOutput": "Sep 16 14:10:02 srv AUDIT_TEST: Security compliance check",
        "explanation": "journalctl -t filters entries matching the SYSLOG_IDENTIFIER field.",
        "explanationFr": "journalctl -t permet d'isoler rapidement les entrées par identifiant de programme ou tag."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Query logs for sshd unit from the last hour",
        "titleFr": "Afficher les logs de l'unité sshd depuis 1 heure",
        "instruction": "Execute journalctl filtering on unit ssh (or sshd) for the last hour (--since '1 hour ago').",
        "instructionFr": "Exécutez journalctl en filtrant sur l'unité ssh pour la dernière heure (--since '1 hour ago').",
        "hint": "journalctl -u ssh --since \"1 hour ago\"",
        "hintFr": "journalctl -u ssh --since \"1 hour ago\"",
        "expectedCommands": [
          "journalctl -u ssh --since \"1 hour ago\"",
          "journalctl -u sshd --since \"1 hour ago\"",
          "sudo journalctl -u ssh --since \"1 hour ago\"",
          "sudo journalctl -u sshd --since \"1 hour ago\"",
          "journalctl -u ssh -n 20"
        ],
        "simulatedOutput": "Sep 16 13:45:10 srv sshd[1502]: Server listening on 0.0.0.0 port 22.\nSep 16 13:52:33 srv sshd[1812]: Accepted publickey for admin from 192.168.1.50 port 52344 ssh2",
        "explanation": "journalctl -u filters by systemd unit name, and --since parses human-readable relative time expressions.",
        "explanationFr": "journalctl -u sélectionne les logs d'une unité systemd spécifique avec des bornes temporelles lisibles."
      }
    ]
  },
  {
    "id": "lab-lpic1-17",
    "title": "IPv4 Network Interface Configuration with iproute2",
    "titleFr": "Configuration réseau IPv4 avec iproute2",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.1",
    "category": "Networking Fundamentals",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Inspect IP addresses on eth0, add a static alias address, configure default route, and bring the link up.",
    "goalFr": "Consulter les adresses IP sur eth0, ajouter une adresse IP statique et vérifier la route par défaut.",
    "context": "A secondary IP address must be assigned to eth0 for hosting an internal web application.",
    "contextFr": "Une adresse IP secondaire doit être attribuée à l'interface eth0 pour héberger une application.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Show current IP addresses on interface eth0",
        "titleFr": "Afficher les adresses IP de l'interface eth0",
        "instruction": "Use the modern ip command to show address information on interface eth0.",
        "instructionFr": "Utilisez la commande ip pour afficher les adresses configurées sur eth0.",
        "hint": "ip addr show eth0",
        "hintFr": "ip addr show eth0",
        "expectedCommands": [
          "ip addr show eth0",
          "ip a show eth0",
          "ip addr show dev eth0",
          "ip a s eth0",
          "ip address show eth0"
        ],
        "simulatedOutput": "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0\n       valid_lft forever preferred_lft forever",
        "explanation": "ip addr show displays MAC address, IPv4/IPv6 addresses, subnet prefix, and interface flags.",
        "explanationFr": "ip addr show détaille l'adresse MAC, les adresses IPv4/v6, le masque CIDR et l'état opérationnel du lien."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Add secondary IP address 192.168.1.200/24 to eth0",
        "titleFr": "Ajouter l'adresse secondaire 192.168.1.200/24 sur eth0",
        "instruction": "Execute ip addr add to attach 192.168.1.200/24 to dev eth0.",
        "instructionFr": "Exécutez ip addr add pour affecter 192.168.1.200/24 à dev eth0.",
        "hint": "ip addr add 192.168.1.200/24 dev eth0",
        "hintFr": "ip addr add 192.168.1.200/24 dev eth0",
        "expectedCommands": [
          "ip addr add 192.168.1.200/24 dev eth0",
          "sudo ip addr add 192.168.1.200/24 dev eth0",
          "ip a add 192.168.1.200/24 dev eth0",
          "sudo ip a add 192.168.1.200/24 dev eth0"
        ],
        "simulatedOutput": "[OK] Address 192.168.1.200/24 bound to eth0.",
        "explanation": "ip addr add registers a secondary IPv4 address on the interface without needing legacy alias devices (eth0:1).",
        "explanationFr": "ip addr add permet de cumuler plusieurs adresses IP sur la même interface sans recourir aux anciens alias."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Display kernel routing table",
        "titleFr": "Afficher la table de routage du noyau",
        "instruction": "Run ip route show to inspect active routing entries and gateway.",
        "instructionFr": "Exécutez ip route show pour visualiser les routes actives et la passerelle par défaut.",
        "hint": "ip route show",
        "hintFr": "ip route show",
        "expectedCommands": [
          "ip route show",
          "ip r show",
          "ip route",
          "ip r"
        ],
        "simulatedOutput": "default via 192.168.1.1 dev eth0 proto static \n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100",
        "explanation": "ip route displays the kernel's routing table (FIB), identifying next-hop gateways.",
        "explanationFr": "ip route affiche les passerelles et tables de routage gérées par le noyau."
      }
    ]
  },
  {
    "id": "lab-lpic1-18",
    "title": "Network Troubleshooting & Port Inspection with ss",
    "titleFr": "Diagnostic réseau & Inspection des ports avec ss",
    "certification": "lpic-1",
    "topicNumber": 108,
    "objectiveId": "108.2",
    "category": "Network Troubleshooting",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Inspect listening TCP sockets with ss, resolve DNS queries with dig, and verify localhost ping response.",
    "goalFr": "Inspecter les sockets d'écoute TCP avec ss, résoudre un nom avec dig et vérifier le ping localhost.",
    "context": "A web service is unreachable. You must verify if the application daemon is actually listening on TCP port 80/443.",
    "contextFr": "Un service web est inaccessible. Vous devez vérifier si le port TCP est ouvert et en écoute.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List all listening TCP sockets with process names using ss",
        "titleFr": "Lister tous les ports TCP en écoute avec les processus via ss",
        "instruction": "Execute ss with flags for TCP (-t), listening (-l), numeric ports (-n), and processes (-p).",
        "instructionFr": "Exécutez ss avec les options pour TCP (-t), écoute (-l), numérique (-n) et processus (-p).",
        "hint": "ss -tlnp",
        "hintFr": "ss -tlnp",
        "expectedCommands": [
          "ss -tlnp",
          "sudo ss -tlnp",
          "ss -tlpn",
          "sudo ss -tlpn",
          "ss -tulnp",
          "netstat -tlnp"
        ],
        "simulatedOutput": "State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process\nLISTEN  0       128            0.0.0.0:22          0.0.0.0:*      users:((\"sshd\",pid=782,fd=3))\nLISTEN  0       511            0.0.0.0:80          0.0.0.0:*      users:((\"nginx\",pid=1284,fd=6))\nLISTEN  0       128          127.0.0.1:3306        0.0.0.0:*      users:((\"mariadbd\",pid=940,fd=19))",
        "explanation": "ss queries socket statistics via Linux kernel sock_diag netlink subsystem, replacing older netstat.",
        "explanationFr": "ss interroge directement le sous-système netlink du noyau pour restituer les sockets d'écoute."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Perform forward DNS lookup for example.com with dig",
        "titleFr": "Effectuer une résolution DNS de example.com avec dig",
        "instruction": "Use dig with +short to query the IPv4 address of example.com.",
        "instructionFr": "Utilisez dig avec l'option +short pour obtenir l'adresse IP de example.com.",
        "hint": "dig +short example.com",
        "hintFr": "dig +short example.com",
        "expectedCommands": [
          "dig +short example.com",
          "dig example.com +short",
          "dig example.com",
          "host example.com"
        ],
        "simulatedOutput": "93.184.216.34",
        "explanation": "dig +short issues an DNS A query and prints only the resulting resource record IP.",
        "explanationFr": "dig +short interroge les serveurs DNS configurés et affiche uniquement le résultat de la résolution."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Send 3 ICMP echo requests to the loopback address",
        "titleFr": "Envoyer 3 requêtes ICMP echo vers l'adresse de bouclage",
        "instruction": "Use ping with -c 3 to test 127.0.0.1.",
        "instructionFr": "Utilisez ping avec l'option -c 3 pour tester 127.0.0.1.",
        "hint": "ping -c 3 127.0.0.1",
        "hintFr": "ping -c 3 127.0.0.1",
        "expectedCommands": [
          "ping -c 3 127.0.0.1",
          "ping -c 3 localhost"
        ],
        "simulatedOutput": "PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.031 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms\n64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.035 ms\n\n--- 127.0.0.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2048ms",
        "explanation": "ping -c 3 limits ICMP echo packets to 3, validating IP stack and loopback driver functionality.",
        "explanationFr": "ping -c 3 valide le bon fonctionnement de la pile TCP/IP locale et de l'interface loopback."
      }
    ]
  },
  {
    "id": "lab-lpic1-19",
    "title": "SSH Key Generation & Client Security Hardening",
    "titleFr": "Génération de clés SSH & Sécurisation de l'accès distant",
    "certification": "lpic-1",
    "topicNumber": 109,
    "objectiveId": "109.1",
    "category": "Remote Access Security",
    "difficulty": "Beginner",
    "estimatedMinutes": 8,
    "goal": "Generate an Ed25519 SSH keypair, set correct file permissions on authorized_keys (600), and inspect ~/.ssh/ permissions.",
    "goalFr": "Générer une paire de clés SSH Ed25519, configurer les permissions de authorized_keys à 600 et vérifier ~/.ssh.",
    "context": "Password authentication is disabled on target servers. You must generate an Ed25519 keypair and secure SSH file permissions.",
    "contextFr": "L'authentification par mot de passe est coupée. Vous devez créer une clé Ed25519 et sécuriser les droits de authorized_keys.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Generate an Ed25519 SSH keypair",
        "titleFr": "Générer une paire de clés SSH Ed25519",
        "instruction": "Run ssh-keygen -t ed25519 with empty passphrase (-N \"\") saving to ~/.ssh/id_ed25519.",
        "instructionFr": "Exécutez ssh-keygen -t ed25519 avec une passphrase vide (-N \"\") dans le fichier par défaut.",
        "hint": "ssh-keygen -t ed25519 -N \"\" -f ~/.ssh/id_ed25519",
        "hintFr": "ssh-keygen -t ed25519 -N \"\" -f ~/.ssh/id_ed25519",
        "expectedCommands": [
          "ssh-keygen -t ed25519 -N \"\" -f ~/.ssh/id_ed25519",
          "ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_ed25519",
          "ssh-keygen -t ed25519"
        ],
        "simulatedOutput": "Generating public/private ed25519 key pair.\nYour identification has been saved in /home/user/.ssh/id_ed25519\nYour public key has been saved in /home/user/.ssh/id_ed25519.pub\nThe key fingerprint is:\nSHA256:4K+b7m9kZ10/Ld89eA11bcD34fG56hI78jK90lM12nO user@client\nThe key's randomart image is:\n+--[ED25519 256]--+\n|    ..o.         |\n|   . + . .       |\n|    + = +        |\n|   . * B o       |\n|    S * B .      |\n+----[SHA256]-----+",
        "explanation": "Ed25519 provides high performance and modern elliptic curve security with small 68-character keys.",
        "explanationFr": "Ed25519 offre un chiffrement moderne à courbes elliptiques alliant compacité et robustesse."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Apply strict 600 permissions to ~/.ssh/authorized_keys",
        "titleFr": "Appliquer des permissions strictes 600 sur ~/.ssh/authorized_keys",
        "instruction": "Use chmod to set permissions 600 on ~/.ssh/authorized_keys.",
        "instructionFr": "Utilisez chmod pour définir les permissions à 600 sur ~/.ssh/authorized_keys.",
        "hint": "chmod 600 ~/.ssh/authorized_keys",
        "hintFr": "chmod 600 ~/.ssh/authorized_keys",
        "expectedCommands": [
          "chmod 600 ~/.ssh/authorized_keys",
          "chmod 0600 ~/.ssh/authorized_keys",
          "chmod 600 /root/.ssh/authorized_keys"
        ],
        "simulatedOutput": "[OK] Permissions updated: -rw------- 1 user user 571 ~/.ssh/authorized_keys",
        "explanation": "OpenSSH enforces StrictModes: if authorized_keys or ~/.ssh is writable by group or others, logins are rejected.",
        "explanationFr": "OpenSSH refuse toute connexion si le fichier authorized_keys ou le dossier .ssh est accessible en écriture par des tiers."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Enforce 700 permissions on the ~/.ssh directory",
        "titleFr": "Appliquer des permissions 700 sur le dossier ~/.ssh",
        "instruction": "Use chmod 700 to protect the ~/.ssh directory from other users.",
        "instructionFr": "Utilisez chmod 700 pour sécuriser le répertoire ~/.ssh.",
        "hint": "chmod 700 ~/.ssh",
        "hintFr": "chmod 700 ~/.ssh",
        "expectedCommands": [
          "chmod 700 ~/.ssh",
          "chmod 0700 ~/.ssh",
          "chmod 700 /root/.ssh"
        ],
        "simulatedOutput": "[OK] Directory permissions updated: drwx------ 2 user user 4096 ~/.ssh",
        "explanation": "Mode 700 restricts directory traversal and reading to the file owner exclusively.",
        "explanationFr": "Le mode 700 réserve l'accès, la traversée et la lecture du répertoire au seul propriétaire."
      }
    ]
  },
  {
    "id": "lab-lpic1-20",
    "title": "Immutable Attributes & Sticky Bit Directory Security",
    "titleFr": "Attributs immuables & Sécurité du Sticky Bit",
    "certification": "lpic-1",
    "topicNumber": 110,
    "objectiveId": "110.1",
    "category": "System Hardening",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Set the immutable attribute (+i) on /etc/resolv.conf with chattr, verify with lsattr, and enforce the Sticky Bit (1777) on /var/tmp/share.",
    "goalFr": "Activer l'attribut immuable (+i) sur /etc/resolv.conf, contrôler avec lsattr et appliquer le Sticky Bit sur /var/tmp/share.",
    "context": "DHCP scripts repeatedly overwrite /etc/resolv.conf. Furthermore, a shared scratch directory must prevent users from deleting each other's files.",
    "contextFr": "Un démon DHCP écrase /etc/resolv.conf. De plus, un dossier partagé doit empêcher les utilisateurs d'effacer les fichiers d'autrui.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Lock /etc/resolv.conf against all modifications with chattr",
        "titleFr": "Verrouiller /etc/resolv.conf contre toute modification avec chattr",
        "instruction": "Use chattr with +i to make /etc/resolv.conf immutable.",
        "instructionFr": "Utilisez chattr avec l'attribut +i pour rendre /etc/resolv.conf immuable.",
        "hint": "chattr +i /etc/resolv.conf",
        "hintFr": "chattr +i /etc/resolv.conf",
        "expectedCommands": [
          "chattr +i /etc/resolv.conf",
          "sudo chattr +i /etc/resolv.conf"
        ],
        "simulatedOutput": "[OK] Immutable flag (+i) set on /etc/resolv.conf.",
        "explanation": "The immutable flag prevents even the root user from modifying, deleting, renaming, or linking the file until cleared.",
        "explanationFr": "L'attribut immuable (+i) empêche toute modification, suppression ou renommage, même par l'utilisateur root."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Verify extended filesystem attributes with lsattr",
        "titleFr": "Vérifier les attributs étendus avec lsattr",
        "instruction": "Execute lsattr on /etc/resolv.conf to inspect the active flags.",
        "instructionFr": "Exécutez lsattr sur /etc/resolv.conf pour contrôler les attributs actifs.",
        "hint": "lsattr /etc/resolv.conf",
        "hintFr": "lsattr /etc/resolv.conf",
        "expectedCommands": [
          "lsattr /etc/resolv.conf",
          "sudo lsattr /etc/resolv.conf"
        ],
        "simulatedOutput": "----i---------e---- /etc/resolv.conf",
        "explanation": "lsattr reads ext4/xfs inode flags; 'i' indicates the file is locked in immutable mode.",
        "explanationFr": "lsattr affiche les drapeaux d'inode du système de fichiers ; le 'i' confirme le verrouillage en mode immuable."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Enforce Sticky Bit (1777) on shared directory /var/tmp/share",
        "titleFr": "Appliquer le Sticky Bit (1777) sur le dossier partagé /var/tmp/share",
        "instruction": "Use chmod 1777 (or +t) on /var/tmp/share to ensure only file owners can delete their files.",
        "instructionFr": "Utilisez chmod 1777 (ou +t) sur /var/tmp/share pour que seuls les créateurs puissent supprimer leurs fichiers.",
        "hint": "chmod 1777 /var/tmp/share",
        "hintFr": "chmod 1777 /var/tmp/share",
        "expectedCommands": [
          "chmod 1777 /var/tmp/share",
          "sudo chmod 1777 /var/tmp/share",
          "chmod +t /var/tmp/share",
          "sudo chmod +t /var/tmp/share"
        ],
        "simulatedOutput": "[OK] Permissions: drwxrwxrwt 2 root root 4096 /var/tmp/share (Sticky bit set).",
        "explanation": "The Sticky Bit (1 in octal or 't' in ls -l) allows anyone to create files in a world-writable directory, but only the file owner can delete or rename them.",
        "explanationFr": "Le Sticky Bit (1 en octal ou 't') autorise la création par tous mais interdit la suppression des fichiers par un non-propriétaire."
      }
    ]
  }
]
