import { GuidedLabScenario } from '../types';

/**
 * 60 Scénarios Pratiques Guidés (Mini-Labs Pas à Pas avec Terminal Virtuel)
 * - 20 Mini-Labs LPIC-1 (Examens 101 et 102)
 * - 20 Mini-Labs LPIC-2 (Examens 201 et 202)
 * - 20 Mini-Labs LPIC-3 (Examens 300, 303, 305, 306)
 */

export const guidedMiniLabsLpic1: GuidedLabScenario[] = [
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
        "expectedCommands": [
          "lspci -k",
          "sudo lspci -k",
          "/usr/bin/lspci -k"
        ],
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
        "expectedCommands": [
          "lsusb",
          "sudo lsusb",
          "/usr/bin/lsusb",
          "lsusb -v"
        ],
        "simulatedOutput": "Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub\nBus 001 Device 002: ID 046d:c52b Logitech, Inc. Unifying Receiver\nBus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub\nBus 002 Device 002: ID 0781:5581 SanDisk Corp. Ultra USB 3.0",
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
        "expectedCommands": [
          "dmesg | grep -i eth",
          "sudo dmesg | grep -i eth",
          "dmesg --ctime | grep -i eth"
        ],
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
        "expectedCommands": [
          "systemctl get-default",
          "sudo systemctl get-default"
        ],
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
        "expectedCommands": [
          "systemctl isolate rescue.target",
          "sudo systemctl isolate rescue.target",
          "systemctl isolate rescue"
        ],
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
        "expectedCommands": [
          "journalctl -b -p err",
          "sudo journalctl -b -p err",
          "journalctl -b -p 3"
        ],
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
        "expectedCommands": [
          "cat /proc/cmdline"
        ],
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
        "expectedCommands": [
          "cat /etc/default/grub",
          "less /etc/default/grub",
          "head -n 20 /etc/default/grub"
        ],
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
        "expectedCommands": [
          "lsblk -f",
          "lsblk",
          "sudo lsblk -f"
        ],
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
        "expectedCommands": [
          "fdisk -l /dev/sdb",
          "sudo fdisk -l /dev/sdb"
        ],
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
        "expectedCommands": [
          "partprobe /dev/sdb",
          "sudo partprobe /dev/sdb",
          "partprobe"
        ],
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
        "expectedCommands": [
          "blkid /dev/sdb1",
          "sudo blkid /dev/sdb1",
          "/sbin/blkid /dev/sdb1"
        ],
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
        "expectedCommands": [
          "tune2fs -l /dev/sdb1",
          "sudo tune2fs -l /dev/sdb1"
        ],
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
        "expectedCommands": [
          "systemctl daemon-reload",
          "sudo systemctl daemon-reload"
        ],
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
        "expectedCommands": [
          "pgrep -l nginx",
          "pgrep nginx",
          "pgrep -a nginx",
          "ps aux | grep nginx"
        ],
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
        "expectedCommands": [
          "echo $HISTSIZE",
          "echo \"$HISTSIZE\""
        ],
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
        "expectedCommands": [
          "echo $?",
          "echo \"$?\""
        ],
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
        "expectedCommands": [
          "groupadd devteam",
          "sudo groupadd devteam"
        ],
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
        "expectedCommands": [
          "crontab -l",
          "sudo crontab -l"
        ],
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
        "expectedCommands": [
          "cat /etc/crontab",
          "head -n 20 /etc/crontab",
          "less /etc/crontab"
        ],
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
];

export const guidedMiniLabsLpic2: GuidedLabScenario[] = [
  {
    "id": "lab-lpic2-01",
    "title": "System Performance Profiling & Bottleneck Analysis",
    "titleFr": "Profilage des performances système & Analyse des goulots d'étranglement",
    "certification": "lpic-2",
    "topicNumber": 200,
    "objectiveId": "200.1",
    "category": "Resource Management",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "goal": "Analyze virtual memory paging activity with vmstat, inspect disk I/O latency with iostat, and assess CPU queue saturation.",
    "goalFr": "Analyser la pagination mémoire avec vmstat, inspecter la latence I/O avec iostat et évaluer la saturation CPU.",
    "context": "A database host experiences severe slowdowns. You must distinguish whether the bottleneck stems from I/O wait, swapping, or CPU contention.",
    "contextFr": "Un serveur de base de données subit des ralentissements critiques. Vous devez diagnostiquer si le goulot est I/O, swap ou CPU.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Sample virtual memory and CPU queues with vmstat",
        "titleFr": "Échantillonner la mémoire virtuelle et les files CPU avec vmstat",
        "instruction": "Execute vmstat with an interval of 1 second for 3 reports (vmstat 1 3).",
        "instructionFr": "Exécutez vmstat avec un intervalle de 1 seconde pour 3 rapports consécutifs.",
        "hint": "vmstat 1 3",
        "hintFr": "vmstat 1 3",
        "expectedCommands": [
          "vmstat 1 3",
          "vmstat 1 4",
          "vmstat 1 5"
        ],
        "simulatedOutput": "procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 3  1 102400 248100  48200 812400    0    0   240   850 1420 3100 45 12 35  8  0\n 4  2 102400 241020  48200 812400    0    0   120  1820 1850 4200 52 18 10 20  0\n 2  0 102400 240500  48200 812400    0    0    80   410 1100 2900 40 10 48  2  0",
        "explanation": "vmstat reveals run queues (r), blocked processes waiting on I/O (b), swap-in/out (si/so), and CPU wait time (wa).",
        "explanationFr": "vmstat expose les processus en file d'attente (r), bloqués sur les I/O (b), le swap et le temps d'attente I/O (wa)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect disk I/O throughput and await latency with iostat",
        "titleFr": "Inspecter le débit disque et la latence await avec iostat",
        "instruction": "Execute iostat with extended statistics (-x) for 1 second intervals, 2 counts.",
        "instructionFr": "Exécutez iostat avec les statistiques étendues (-x) pour 2 mesures de 1 seconde.",
        "hint": "iostat -x 1 2",
        "hintFr": "iostat -x 1 2",
        "expectedCommands": [
          "iostat -x 1 2",
          "iostat -xz 1 2",
          "iostat -x 1 3",
          "iostat -x"
        ],
        "simulatedOutput": "Device            r/s     w/s     rkB/s     wkB/s   rrqm/s   wrqm/s  %rrqm  %wrqm  r_await w_await aqu-sz  %util\nsda              8.00  120.00    128.00   2480.00     0.00    12.00   0.00   9.09     1.20   18.40   2.10  84.50\nsdb              0.00    4.00      0.00     16.00     0.00     0.00   0.00   0.00     0.00    0.80   0.01   0.40",
        "explanation": "iostat -x highlights disk utilization (%util) and write wait latency (w_await); above 80% indicates saturation.",
        "explanationFr": "iostat -x met en évidence le taux d'occupation (%util) et la latence de traitement (w_await)."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect memory allocation and buffer/cache consumption",
        "titleFr": "Inspecter l'allocation mémoire et la consommation buffer/cache",
        "instruction": "Use free with megabyte units (-m) to view available RAM.",
        "instructionFr": "Utilisez free avec l'option mégaoctets (-m) pour afficher la RAM disponible.",
        "hint": "free -m",
        "hintFr": "free -m",
        "expectedCommands": [
          "free -m",
          "free -h",
          "free -m -w"
        ],
        "simulatedOutput": "               total        used        free      shared  buff/cache   available\nMem:            7942        4890         312         184        2740        2590\nSwap:           2047         100        1947",
        "explanation": "free displays RAM distribution; the 'available' column estimates memory reclaimable without forcing swap.",
        "explanationFr": "free montre la mémoire réellement utilisable sans forcer de bascule en swap via la colonne 'available'."
      }
    ]
  },
  {
    "id": "lab-lpic2-02",
    "title": "Kernel Modules: Loading, Parameters & Blacklisting",
    "titleFr": "Modules noyau : Chargement, Paramètres & Liste noire (Blacklist)",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.1",
    "category": "Kernel & Drivers",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Query module details with modinfo, load the overlay module dynamically with modprobe, and verify with lsmod.",
    "goalFr": "Consulter les métadonnées d'un module avec modinfo, charger dynamiquement le module overlay avec modprobe et vérifier avec lsmod.",
    "context": "A container engine requires the kernel 'overlay' driver. You must inspect its dependencies, load it, and verify runtime state.",
    "contextFr": "Un moteur de conteneurs requiert le pilote noyau 'overlay'. Vous devez vérifier ses dépendances et le charger.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Inspect module metadata and dependencies with modinfo",
        "titleFr": "Inspecter les métadonnées et dépendances du module avec modinfo",
        "instruction": "Execute modinfo for the 'overlay' kernel module.",
        "instructionFr": "Exécutez modinfo pour le module noyau 'overlay'.",
        "hint": "modinfo overlay",
        "hintFr": "modinfo overlay",
        "expectedCommands": [
          "modinfo overlay",
          "sudo modinfo overlay"
        ],
        "simulatedOutput": "filename:       /lib/modules/6.8.0-40-generic/kernel/fs/overlayfs/overlay.ko.zst\nalias:          fs-overlay\nlicense:        GPL\ndescription:    Overlay filesystem\nauthor:         Miklos Szeredi <miklos@szeredi.hu>\nsrcversion:     D1829FA031CB4819A208172\ndepends:        \nretpoline:      Y\nintree:         Y\nname:           overlay",
        "explanation": "modinfo extracts author, description, license, module parameters, and dependencies from the compiled .ko file.",
        "explanationFr": "modinfo extrait la description, les alias, la licence et les dépendances du fichier objet .ko."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Load overlay module into running kernel with modprobe",
        "titleFr": "Charger le module overlay dans le noyau en cours d'exécution",
        "instruction": "Use modprobe to insert the overlay module along with any dependencies.",
        "instructionFr": "Utilisez modprobe pour insérer le module overlay en résolvant ses dépendances.",
        "hint": "modprobe overlay",
        "hintFr": "modprobe overlay",
        "expectedCommands": [
          "modprobe overlay",
          "sudo modprobe overlay"
        ],
        "simulatedOutput": "[OK] Module 'overlay' loaded into kernel memory successfully.",
        "explanation": "modprobe reads modules.dep to automatically resolve and load all prerequisite modules before inserting the target.",
        "explanationFr": "modprobe consulte modules.dep pour charger automatiquement toutes les dépendances requises."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Confirm module presence in /proc/modules using lsmod",
        "titleFr": "Confirmer la présence du module avec lsmod",
        "instruction": "Run lsmod and filter for 'overlay' using grep.",
        "instructionFr": "Lancez lsmod et filtrez sur 'overlay' avec grep.",
        "hint": "lsmod | grep overlay",
        "hintFr": "lsmod | grep overlay",
        "expectedCommands": [
          "lsmod | grep overlay",
          "sudo lsmod | grep overlay"
        ],
        "simulatedOutput": "overlay               163840  0",
        "explanation": "lsmod formats the contents of /proc/modules, showing loaded drivers, byte sizes, and dependent module counts.",
        "explanationFr": "lsmod met en forme le contenu de /proc/modules pour afficher les modules actifs et leurs utilisateurs."
      }
    ]
  },
  {
    "id": "lab-lpic2-03",
    "title": "Kernel Runtime Tuning with sysctl & /proc/sys",
    "titleFr": "Ajustement du noyau à chaud avec sysctl & /proc/sys",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.2",
    "category": "Kernel Tuning",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Read IPv4 forwarding setting, enable it on the fly with sysctl -w, and reload /etc/sysctl.conf.",
    "goalFr": "Consulter le paramètre de routage IPv4, l'activer à chaud avec sysctl -w et recharger /etc/sysctl.conf.",
    "context": "The server must act as a router/gateway. You must enable IPv4 packet forwarding dynamically and persist it.",
    "contextFr": "Le serveur doit router des paquets. Vous devez activer le forwarding IPv4 à chaud puis recharger la configuration.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Read current net.ipv4.ip_forward parameter",
        "titleFr": "Lire la valeur actuelle de net.ipv4.ip_forward",
        "instruction": "Execute sysctl with the parameter key net.ipv4.ip_forward.",
        "instructionFr": "Exécutez sysctl avec la clé net.ipv4.ip_forward.",
        "hint": "sysctl net.ipv4.ip_forward",
        "hintFr": "sysctl net.ipv4.ip_forward",
        "expectedCommands": [
          "sysctl net.ipv4.ip_forward",
          "sudo sysctl net.ipv4.ip_forward",
          "cat /proc/sys/net/ipv4/ip_forward"
        ],
        "simulatedOutput": "net.ipv4.ip_forward = 0",
        "explanation": "sysctl translates dotted notation into /proc/sys/ paths (/proc/sys/net/ipv4/ip_forward). Value 0 means forwarding is disabled.",
        "explanationFr": "sysctl lit /proc/sys/net/ipv4/ip_forward ; la valeur 0 indique que le routage est inactif."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Enable IPv4 forwarding on the fly with sysctl -w",
        "titleFr": "Activer le routage IPv4 immédiatement avec sysctl -w",
        "instruction": "Use sysctl -w to set net.ipv4.ip_forward=1 immediately in the running kernel.",
        "instructionFr": "Utilisez sysctl -w pour définir net.ipv4.ip_forward=1 à chaud.",
        "hint": "sysctl -w net.ipv4.ip_forward=1",
        "hintFr": "sysctl -w net.ipv4.ip_forward=1",
        "expectedCommands": [
          "sysctl -w net.ipv4.ip_forward=1",
          "sudo sysctl -w net.ipv4.ip_forward=1",
          "sysctl -w net/ipv4/ip_forward=1"
        ],
        "simulatedOutput": "net.ipv4.ip_forward = 1",
        "explanation": "sysctl -w writes directly to the kernel runtime data structure via the procfs filesystem.",
        "explanationFr": "sysctl -w applique immédiatement la nouvelle valeur en mémoire vive du noyau."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Reload configuration settings from /etc/sysctl.conf",
        "titleFr": "Recharger les paramètres depuis /etc/sysctl.conf",
        "instruction": "Execute sysctl with -p to reload /etc/sysctl.conf rules into kernel state.",
        "instructionFr": "Exécutez sysctl avec -p pour réappliquer les valeurs de /etc/sysctl.conf.",
        "hint": "sysctl -p",
        "hintFr": "sysctl -p",
        "expectedCommands": [
          "sysctl -p",
          "sudo sysctl -p",
          "sysctl -p /etc/sysctl.conf",
          "sudo sysctl -p /etc/sysctl.conf"
        ],
        "simulatedOutput": "net.ipv4.ip_forward = 1\nvm.swappiness = 10\nfs.file-max = 2097152",
        "explanation": "sysctl -p reads persistent configuration files to synchronize live kernel knobs with on-disk policy.",
        "explanationFr": "sysctl -p relit les fichiers de configuration pour synchroniser les réglages permanents."
      }
    ]
  },
  {
    "id": "lab-lpic2-04",
    "title": "Software RAID Array Creation & Management with mdadm",
    "titleFr": "Création & Gestion d'une grappe RAID logicielle avec mdadm",
    "certification": "lpic-2",
    "topicNumber": 202,
    "objectiveId": "202.1",
    "category": "Storage Redundancy",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "goal": "Inspect kernel RAID status in /proc/mdstat, query array details with mdadm --detail, and scan for configuration persistence.",
    "goalFr": "Consulter l'état RAID dans /proc/mdstat, afficher les détails de la grappe avec mdadm --detail et scanner la configuration.",
    "context": "A RAID 5 array /dev/md0 composed of 3 disk partitions has been built. You must verify its synchronization health.",
    "contextFr": "Une grappe RAID 5 (/dev/md0) a été assemblée. Vous devez auditer son état de reconstruction et sa configuration.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Check active software RAID arrays in /proc/mdstat",
        "titleFr": "Consulter les grappes RAID actives dans /proc/mdstat",
        "instruction": "Display the kernel pseudo-file /proc/mdstat.",
        "instructionFr": "Affichez le contenu du fichier virtuel /proc/mdstat.",
        "hint": "cat /proc/mdstat",
        "hintFr": "cat /proc/mdstat",
        "expectedCommands": [
          "cat /proc/mdstat",
          "head -n 20 /proc/mdstat"
        ],
        "simulatedOutput": "Personalities : [raid6] [raid5] [raid4] \nmd0 : active raid5 sdd1[2] sdc1[1] sdb1[0]\n      104755200 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/3] [UUU]\n      \nunused devices: <none>",
        "explanation": "/proc/mdstat shows array state, RAID level, chunk size, disk slots, and health flags ([UUU] indicates all drives healthy).",
        "explanationFr": "/proc/mdstat affiche l'état des disques ; la notation [UUU] certifie que les 3 membres sont opérationnels."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Examine detailed attributes of array /dev/md0",
        "titleFr": "Examiner les attributs détaillés de /dev/md0 avec mdadm",
        "instruction": "Execute mdadm with --detail targeting /dev/md0.",
        "instructionFr": "Exécutez mdadm avec l'option --detail sur /dev/md0.",
        "hint": "mdadm --detail /dev/md0",
        "hintFr": "mdadm --detail /dev/md0",
        "expectedCommands": [
          "mdadm --detail /dev/md0",
          "sudo mdadm --detail /dev/md0",
          "mdadm -D /dev/md0",
          "sudo mdadm -D /dev/md0"
        ],
        "simulatedOutput": "/dev/md0:\n           Version : 1.2\n     Creation Time : Wed Sep 16 09:12:04 2026\n        Raid Level : raid5\n        Array Size : 104755200 (99.90 GiB 107.27 GB)\n     Used Dev Size : 52377600 (49.95 GiB 53.63 GB)\n      Raid Devices : 3\n     Total Devices : 3\n       Persistence : Superblock is persistent\n             State : clean \n    Active Devices : 3\n   Working Devices : 3\n    Failed Devices : 0\n     Spare Devices : 0\n            Layout : left-symmetric\n        Chunk Size : 512K",
        "explanation": "mdadm --detail reveals superblock persistence, RAID layout, rebuild progress, chunk sizing, and failure counters.",
        "explanationFr": "mdadm --detail fournit les informations d'ingénierie : géométrie, taille de chunk, disques actifs et pannes."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Scan arrays to generate mdadm.conf definitions",
        "titleFr": "Scanner les grappes pour générer la configuration mdadm.conf",
        "instruction": "Run mdadm with --detail and --scan to print the ARRAY configuration stanza.",
        "instructionFr": "Lancez mdadm avec --detail et --scan pour générer la ligne ARRAY pour mdadm.conf.",
        "hint": "mdadm --detail --scan",
        "hintFr": "mdadm --detail --scan",
        "expectedCommands": [
          "mdadm --detail --scan",
          "sudo mdadm --detail --scan",
          "mdadm -Ds",
          "sudo mdadm -Ds"
        ],
        "simulatedOutput": "ARRAY /dev/md0 metadata=1.2 name=srv:0 UUID=5b19e20a:8192a012:4c8109bf:3029da11",
        "explanation": "mdadm --detail --scan generates the canonical ARRAY definition containing the unique UUID needed in mdadm.conf.",
        "explanationFr": "mdadm --detail --scan génère l'entrée ARRAY indispensable dans /etc/mdadm/mdadm.conf pour le boot."
      }
    ]
  },
  {
    "id": "lab-lpic2-05",
    "title": "Logical Volume Manager (LVM): Creation & Online Expansion",
    "titleFr": "Gestionnaire de volumes logiques (LVM) : Création & Extension à chaud",
    "certification": "lpic-2",
    "topicNumber": 202,
    "objectiveId": "202.2",
    "category": "LVM Administration",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "goal": "Verify Physical Volumes with pvs, inspect Volume Group datavg with vgs, and extend logical volume datalv with online filesystem resizing.",
    "goalFr": "Vérifier les volumes physiques avec pvs, inspecter le groupe datavg avec vgs et étendre datalv à chaud avec redimensionnement FS.",
    "context": "The application volume /dev/datavg/datalv has reached 95% capacity. You must add 5GB to it without downtime.",
    "contextFr": "Le volume applicatif /dev/datavg/datalv est plein. Vous devez l'agrandir de 5 Go sans interrompre les services.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Inspect Physical Volumes status with pvs",
        "titleFr": "Inspecter l'état des volumes physiques avec pvs",
        "instruction": "Execute pvs to check PV devices, Volume Groups, and free extents.",
        "instructionFr": "Exécutez pvs pour vérifier les volumes physiques (PV) et l'espace libre.",
        "hint": "pvs",
        "hintFr": "pvs",
        "expectedCommands": [
          "pvs",
          "sudo pvs",
          "pvdisplay -s"
        ],
        "simulatedOutput": "  PV         VG     Fmt  Attr PSize   PFree \n  /dev/sdb1  datavg lvm2 a--  <50.00g <30.00g",
        "explanation": "pvs outputs a tabular summary of physical volumes, associated VGs, total size, and free unallocated extents.",
        "explanationFr": "pvs résume les volumes physiques, leurs groupes associés et l'espace non alloué restant."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect Volume Group free capacity with vgs",
        "titleFr": "Vérifier la capacité libre du groupe de volumes avec vgs",
        "instruction": "Run vgs to verify available space in volume group 'datavg'.",
        "instructionFr": "Lancez vgs pour examiner l'espace restant dans 'datavg'.",
        "hint": "vgs datavg",
        "hintFr": "vgs datavg",
        "expectedCommands": [
          "vgs datavg",
          "vgs",
          "sudo vgs",
          "sudo vgs datavg"
        ],
        "simulatedOutput": "  VG     #PV #LV #SN Attr   VSize   VFree  \n  datavg   1   1   0 wz--n- <50.00g <30.00g",
        "explanation": "vgs displays volume group metadata: number of PVs, LVs, snapshots, and total allocatable VFree space.",
        "explanationFr": "vgs affiche les métadonnées globales du groupe de volumes et l'espace disponible (VFree)."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Extend logical volume by 5GB with online filesystem resize",
        "titleFr": "Étendre le volume logique de 5 Go avec redimensionnement du FS à chaud",
        "instruction": "Use lvextend with -r (resize fs) and -L +5G on /dev/datavg/datalv.",
        "instructionFr": "Utilisez lvextend avec l'option -r et -L +5G sur /dev/datavg/datalv.",
        "hint": "lvextend -r -L +5G /dev/datavg/datalv",
        "hintFr": "lvextend -r -L +5G /dev/datavg/datalv",
        "expectedCommands": [
          "lvextend -r -L +5G /dev/datavg/datalv",
          "sudo lvextend -r -L +5G /dev/datavg/datalv",
          "lvextend --resizefs -L +5G /dev/datavg/datalv",
          "sudo lvextend --resizefs -L +5G /dev/datavg/datalv"
        ],
        "simulatedOutput": "  Size of logical volume datavg/datalv changed from 20.00 GiB (5120 extents) to 25.00 GiB (6400 extents).\n  Logical volume datavg/datalv successfully resized.\nresize2fs 1.47.0 (5-Feb-2023)\nFilesystem at /dev/mapper/datavg-datalv is mounted on /mnt/data; on-line resizing required\nold_desc_blocks = 3, new_desc_blocks = 4\nThe filesystem on /dev/mapper/datavg-datalv is now 6553600 (4k) blocks long.",
        "explanation": "The -r (--resizefs) flag automatically invokes resize2fs or xfs_growfs immediately after expanding logical volume extents.",
        "explanationFr": "L'option -r répercute automatiquement l'agrandissement sur le système de fichiers (ext4/XFS) sans interruption."
      }
    ]
  },
  {
    "id": "lab-lpic2-06",
    "title": "Advanced Filesystem Tuning & Maintenance (ext4 & XFS)",
    "titleFr": "Optimisation avancée des systèmes de fichiers (ext4 & XFS)",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.1",
    "category": "Filesystem Tuning",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Inspect ext4 superblock with tune2fs, expand an XFS filesystem with xfs_growfs, and check XFS geometry with xfs_info.",
    "goalFr": "Vérifier le superblock ext4 avec tune2fs, agrandir un FS XFS avec xfs_growfs et inspecter la géométrie avec xfs_info.",
    "context": "An enterprise storage environment uses both ext4 and XFS. You must perform filesystem inspection and online growth.",
    "contextFr": "Un serveur hybride héberge de l'ext4 et du XFS. Vous devez inspecter les blocs et étendre un point de montage XFS.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Display geometry and block size of XFS mount /mnt/xfsdata",
        "titleFr": "Afficher la géométrie et la taille de bloc du montage XFS /mnt/xfsdata",
        "instruction": "Run xfs_info on mount point /mnt/xfsdata.",
        "instructionFr": "Lancez xfs_info sur le point de montage /mnt/xfsdata.",
        "hint": "xfs_info /mnt/xfsdata",
        "hintFr": "xfs_info /mnt/xfsdata",
        "expectedCommands": [
          "xfs_info /mnt/xfsdata",
          "sudo xfs_info /mnt/xfsdata"
        ],
        "simulatedOutput": "meta-data=/dev/sdc1              isize=512    agcount=4, agsize=3276800 blks\n         =                       sectsz=512   attr=2, projid32bit=1\n         =                       crc=1        finobt=1, spinodes=0, rmapbt=0\ndata     =                       bsize=4096   blocks=13107200, imaxpct=25\n         =                       sunit=0      swidth=0 blks\nnaming   =version 2              bsize=4096   ascii-ci=0, ftype=1\nlog      =internal log           bsize=4096   blocks=6400, version=2\n         =                       sectsz=512   sunit=0 blks, lazy-count=1\nrealtime =none                   extsz=4096   blocks=0, rtextents=0",
        "explanation": "xfs_info prints allocation groups (agcount), block sizes (bsize), and inode metadata structures.",
        "explanationFr": "xfs_info détaille la géométrie interne de XFS : allocation groups, taille des blocs et paramètres de journal."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Expand mounted XFS filesystem to fill underlying block device",
        "titleFr": "Agrandir le système XFS monté pour occuper tout le disque",
        "instruction": "Use xfs_growfs targeting the mount point /mnt/xfsdata.",
        "instructionFr": "Utilisez xfs_growfs en ciblant le point de montage /mnt/xfsdata.",
        "hint": "xfs_growfs /mnt/xfsdata",
        "hintFr": "xfs_growfs /mnt/xfsdata",
        "expectedCommands": [
          "xfs_growfs /mnt/xfsdata",
          "sudo xfs_growfs /mnt/xfsdata",
          "xfs_growfs -d /mnt/xfsdata"
        ],
        "simulatedOutput": "meta-data=/dev/sdc1              isize=512    agcount=4, agsize=3276800 blks\ndata blocks changed from 13107200 to 26214400",
        "explanation": "xfs_growfs grows an XFS filesystem while mounted. Note that XFS only supports growing, never shrinking.",
        "explanationFr": "xfs_growfs étend le système de fichiers XFS à chaud (rappel : XFS ne supporte pas la réduction)."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Adjust reserved block percentage on ext4 filesystem",
        "titleFr": "Ajuster le pourcentage de blocs réservés sur ext4",
        "instruction": "Use tune2fs with -m 1 to reduce reserved blocks to 1% on /dev/sdb1.",
        "instructionFr": "Utilisez tune2fs avec -m 1 pour abaisser les blocs réservés à 1% sur /dev/sdb1.",
        "hint": "tune2fs -m 1 /dev/sdb1",
        "hintFr": "tune2fs -m 1 /dev/sdb1",
        "expectedCommands": [
          "tune2fs -m 1 /dev/sdb1",
          "sudo tune2fs -m 1 /dev/sdb1"
        ],
        "simulatedOutput": "tune2fs 1.47.0 (5-Feb-2023)\nSetting reserved blocks percentage to 1% (131072 blocks)",
        "explanation": "tune2fs -m adjusts the percentage of blocks reserved for the superuser (default 5%), reclaiming storage on data drives.",
        "explanationFr": "tune2fs -m ajuste l'espace réservé à root (par défaut 5%), libérant ainsi des giga-octets sur les volumes de données."
      }
    ]
  },
  {
    "id": "lab-lpic2-07",
    "title": "System Recovery, Initramfs Rebuilding & GRUB Reinstallation",
    "titleFr": "Récupération système, Régénération Initramfs & Réinstallation GRUB",
    "certification": "lpic-2",
    "topicNumber": 204,
    "objectiveId": "204.1",
    "category": "Disaster Recovery",
    "difficulty": "Advanced",
    "estimatedMinutes": 10,
    "goal": "Rebuild initramfs image with update-initramfs / dracut, reinstall GRUB onto /dev/sda MBR, and verify boot files.",
    "goalFr": "Reconstruire l'image initramfs avec update-initramfs / dracut, réinstaller GRUB sur /dev/sda et vérifier les fichiers de boot.",
    "context": "After a hardware storage controller upgrade, the server fails to load storage modules during early userspace.",
    "contextFr": "Après un changement de contrôleur disque, le noyau ne parvient plus à monter la racine faute de modules dans l'initrd.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Rebuild initramfs for the currently running kernel",
        "titleFr": "Reconstruire l'initramfs pour la version de noyau courante",
        "instruction": "Execute update-initramfs -u (or dracut --force) to rebuild the initial ramdisk.",
        "instructionFr": "Exécutez update-initramfs -u (ou dracut --force) pour régénérer le ramdisk initial.",
        "hint": "update-initramfs -u",
        "hintFr": "update-initramfs -u",
        "expectedCommands": [
          "update-initramfs -u",
          "sudo update-initramfs -u",
          "update-initramfs -u -k all",
          "dracut --force",
          "sudo dracut --force"
        ],
        "simulatedOutput": "update-initramfs: Generating /boot/initrd.img-6.8.0-40-generic\n[OK] Initramfs regenerated with active kernel storage modules.",
        "explanation": "update-initramfs packages essential early drivers, udev rules, and root discovery tools into an initramfs CPIO archive.",
        "explanationFr": "update-initramfs assemble les pilotes critiques et scripts nécessaires au montage du système de fichiers racine."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Reinstall GRUB bootloader to the primary disk MBR/ESP",
        "titleFr": "Réinstaller le chargeur GRUB sur le disque principal /dev/sda",
        "instruction": "Execute grub-install (or grub2-install) targeting device /dev/sda.",
        "instructionFr": "Exécutez grub-install (ou grub2-install) sur le périphérique /dev/sda.",
        "hint": "grub-install /dev/sda",
        "hintFr": "grub-install /dev/sda",
        "expectedCommands": [
          "grub-install /dev/sda",
          "sudo grub-install /dev/sda",
          "grub2-install /dev/sda",
          "sudo grub2-install /dev/sda"
        ],
        "simulatedOutput": "Installing for x86_64-efi platform.\nInstallation finished. No error reported.",
        "explanation": "grub-install installs boot stage binaries, updates EFI boot manager variables, and writes core image sectors.",
        "explanationFr": "grub-install copie les binaires d'amorçage et réenregistre l'entrée de boot auprès du firmware EFI/BIOS."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Verify generated boot images in /boot directory",
        "titleFr": "Vérifier la présence des images générées dans /boot",
        "instruction": "List kernel images and initramfs files in /boot.",
        "instructionFr": "Listez les noyaux et images initramfs dans /boot.",
        "hint": "ls -lh /boot/vmlinuz* /boot/initrd*",
        "hintFr": "ls -lh /boot/vmlinuz* /boot/initrd*",
        "expectedCommands": [
          "ls -lh /boot/vmlinuz* /boot/initrd*",
          "ls -l /boot",
          "ls /boot",
          "ls -lh /boot"
        ],
        "simulatedOutput": "-rw-r--r-- 1 root root  48M Sep 16 11:20 /boot/initrd.img-6.8.0-40-generic\n-rw------- 1 root root  14M Jul 15 14:10 /boot/vmlinuz-6.8.0-40-generic",
        "explanation": "Verifying presence and valid file sizes in /boot ensures the machine will boot without dropping into grub rescue.",
        "explanationFr": "Le contrôle de la taille et de la date des images dans /boot valide la cohérence des binaires d'amorçage."
      }
    ]
  },
  {
    "id": "lab-lpic2-08",
    "title": "Advanced Static Routing & Policy Routing (ip rule / ip route)",
    "titleFr": "Routage statique avancé & Routage par règles (ip rule / ip route)",
    "certification": "lpic-2",
    "topicNumber": 205,
    "objectiveId": "205.1",
    "category": "Advanced Networking",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Add a static subnet route via a specific gateway, inspect routing table, and display policy routing database rules.",
    "goalFr": "Ajouter une route statique vers un sous-réseau via une passerelle, inspecter la table et lister les règles de routage (ip rule).",
    "context": "Traffic destined for internal subnet 10.200.0.0/16 must be forwarded through internal router 192.168.1.254.",
    "contextFr": "Le flux vers le sous-réseau 10.200.0.0/16 doit transiter par le routeur dédié 192.168.1.254.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Add static route for 10.200.0.0/16 via 192.168.1.254",
        "titleFr": "Ajouter la route statique pour 10.200.0.0/16 via 192.168.1.254",
        "instruction": "Use ip route add to route 10.200.0.0/16 via 192.168.1.254.",
        "instructionFr": "Utilisez ip route add pour router 10.200.0.0/16 via 192.168.1.254.",
        "hint": "ip route add 10.200.0.0/16 via 192.168.1.254",
        "hintFr": "ip route add 10.200.0.0/16 via 192.168.1.254",
        "expectedCommands": [
          "ip route add 10.200.0.0/16 via 192.168.1.254",
          "sudo ip route add 10.200.0.0/16 via 192.168.1.254",
          "ip r add 10.200.0.0/16 via 192.168.1.254"
        ],
        "simulatedOutput": "[OK] Static route installed in main routing table.",
        "explanation": "ip route add inserts an entry into the kernel FIB table specifying destination prefix and next-hop gateway.",
        "explanationFr": "ip route add insère une nouvelle entrée dans la table FIB du noyau avec le préfixe cible et le saut suivant."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Verify route lookup decision for 10.200.5.10",
        "titleFr": "Vérifier la décision de routage pour l'IP 10.200.5.10",
        "instruction": "Use ip route get 10.200.5.10 to test which interface and gateway the kernel selects.",
        "instructionFr": "Utilisez ip route get 10.200.5.10 pour simuler le choix de route par le noyau.",
        "hint": "ip route get 10.200.5.10",
        "hintFr": "ip route get 10.200.5.10",
        "expectedCommands": [
          "ip route get 10.200.5.10",
          "ip r get 10.200.5.10"
        ],
        "simulatedOutput": "10.200.5.10 via 192.168.1.254 dev eth0 src 192.168.1.100 uid 0 \n    cache ",
        "explanation": "ip route get performs an exact FIB query against kernel tables, proving which interface and gateway will handle the packet.",
        "explanationFr": "ip route get effectue une simulation réelle pour déterminer l'interface de sortie et la passerelle choisies."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Display policy routing rules database with ip rule show",
        "titleFr": "Afficher les règles de routage (RPDB) avec ip rule show",
        "instruction": "Execute ip rule show to inspect routing policy priorities.",
        "instructionFr": "Exécutez ip rule show pour examiner les règles de priorités de routage.",
        "hint": "ip rule show",
        "hintFr": "ip rule show",
        "expectedCommands": [
          "ip rule show",
          "ip rule",
          "sudo ip rule show"
        ],
        "simulatedOutput": "0:\tfrom all lookup local\n32766:\tfrom all lookup main\n32767:\tfrom all lookup default",
        "explanation": "ip rule lists the policy routing database (RPDB), determining which table (local, main, custom) evaluates a packet first.",
        "explanationFr": "ip rule liste la base de règles RPDB déterminant l'ordre d'évaluation des différentes tables de routage."
      }
    ]
  },
  {
    "id": "lab-lpic2-09",
    "title": "Network Traffic Capture & Packet Inspection with tcpdump",
    "titleFr": "Capture de trafic réseau & Analyse de paquets avec tcpdump",
    "certification": "lpic-2",
    "topicNumber": 205,
    "objectiveId": "205.2",
    "category": "Network Diagnostics",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Capture 5 DNS queries on interface eth0 using tcpdump with numeric addresses (-nn), and filter for UDP port 53.",
    "goalFr": "Capturer 5 requêtes DNS sur eth0 avec tcpdump sans résolution de noms (-nn) sur le port UDP 53.",
    "context": "Intermittent DNS lookup failures occur. You must capture raw network packets to analyze query and response payloads.",
    "contextFr": "Des lenteurs DNS sont signalées. Vous devez capturer les paquets en direct pour vérifier les temps de réponse.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Capture 5 DNS packets on eth0 with tcpdump",
        "titleFr": "Capturer 5 paquets DNS sur eth0 avec tcpdump",
        "instruction": "Run tcpdump with -i eth0, -nn (disable DNS and port resolution), -c 5 (5 packets), filtering on 'udp port 53'.",
        "instructionFr": "Lancez tcpdump avec -i eth0, -nn, -c 5 en filtrant sur 'udp port 53'.",
        "hint": "tcpdump -nn -i eth0 -c 5 udp port 53",
        "hintFr": "tcpdump -nn -i eth0 -c 5 udp port 53",
        "expectedCommands": [
          "tcpdump -nn -i eth0 -c 5 udp port 53",
          "tcpdump -i eth0 -nn -c 5 udp port 53",
          "sudo tcpdump -nn -i eth0 -c 5 udp port 53",
          "sudo tcpdump -i eth0 -nn -c 5 udp port 53",
          "tcpdump -nn -c 5 port 53"
        ],
        "simulatedOutput": "tcpdump: verbose output suppressed, use -v[v]... for full protocol decode\nlistening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes\n14:22:01.102 IP 192.168.1.100.54321 > 8.8.8.8.53: 5214+ A? lpi.org. (25)\n14:22:01.125 IP 8.8.8.8.53 > 192.168.1.100.54321: 5214 1/0/0 A 65.108.156.173 (41)\n14:22:01.126 IP 192.168.1.100.54322 > 8.8.8.8.53: 5215+ AAAA? lpi.org. (25)\n14:22:01.148 IP 8.8.8.8.53 > 192.168.1.100.54322: 5215 0/1/0 (73)\n14:22:02.001 IP 192.168.1.100.59012 > 192.168.1.1.53: 1044+ PTR? 100.1.168.192.in-addr.arpa. (45)\n5 packets captured\n5 packets received by filter\n0 packets dropped by kernel",
        "explanation": "tcpdump leverages BPF (Berkeley Packet Filter) in the kernel to tap sockets directly before firewall drops.",
        "explanationFr": "tcpdump utilise le filtre BPF du noyau pour capturer les paquets bruts directement sur l'interface réseau."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Check interface link packet drop counters",
        "titleFr": "Vérifier les compteurs d'erreurs et de paquets rejetés",
        "instruction": "Use ip -s link show dev eth0 to inspect RX/TX drop and error counters.",
        "instructionFr": "Utilisez ip -s link show dev eth0 pour examiner les compteurs d'erreurs et de drops.",
        "hint": "ip -s link show dev eth0",
        "hintFr": "ip -s link show dev eth0",
        "expectedCommands": [
          "ip -s link show dev eth0",
          "ip -s link show eth0",
          "ip -s link"
        ],
        "simulatedOutput": "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000\n    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff\n    RX:  bytes packets errors dropped missed mcast   \n      14820121   20194      0       0      0   140   \n    TX:  bytes packets errors dropped carrier collsns \n       4820190   15291      0       0       0       0",
        "explanation": "ip -s reveals low-level hardware or queue drops, isolating physical duplex mismatches or buffer exhaustion.",
        "explanationFr": "ip -s met en évidence les erreurs de trame et pertes de paquets matérielles sur la carte."
      }
    ]
  },
  {
    "id": "lab-lpic2-10",
    "title": "System Backup Strategies with rsync & Incremental Archives",
    "titleFr": "Stratégies de sauvegarde avec rsync & Archives incrémentales",
    "certification": "lpic-2",
    "topicNumber": 206,
    "objectiveId": "206.1",
    "category": "Backup & Archiving",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Synchronize /var/www/ to /backup/www/ using rsync with archive mode and delete flag, and create a compressed tar backup of /etc/.",
    "goalFr": "Synchroniser /var/www/ vers /backup/www/ avec rsync en mode miroir (--delete) et créer une archive tar de /etc/.",
    "context": "You must implement an off-site file mirror and generate a restorable system configuration tarball.",
    "contextFr": "Vous devez synchroniser un répertoire web en miroir et générer une archive compressée de /etc/.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Synchronize /var/www/ to /backup/www/ with rsync archive and delete",
        "titleFr": "Synchroniser /var/www/ vers /backup/www/ avec rsync en mode archive et delete",
        "instruction": "Execute rsync with -av --delete to mirror /var/www/ to /backup/www/.",
        "instructionFr": "Exécutez rsync avec -av --delete pour répliquer /var/www/ vers /backup/www/.",
        "hint": "rsync -av --delete /var/www/ /backup/www/",
        "hintFr": "rsync -av --delete /var/www/ /backup/www/",
        "expectedCommands": [
          "rsync -av --delete /var/www/ /backup/www/",
          "rsync -avz --delete /var/www/ /backup/www/",
          "sudo rsync -av --delete /var/www/ /backup/www/"
        ],
        "simulatedOutput": "sending incremental file list\n./\nindex.html\nassets/style.css\nassets/logo.png\ndeleting old_test_page.html\n\nsent 420,119 bytes  received 104 bytes  840,446.00 bytes/sec\ntotal size is 1,290,412  speedup is 3.07",
        "explanation": "rsync -av preserves permissions, timestamps, symlinks, and ownership; --delete cleans files on target that no longer exist on source.",
        "explanationFr": "rsync -a préserve les métadonnées et droits ; --delete supprime sur la cible les fichiers effacés de la source."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Create gzip-compressed tar archive of /etc",
        "titleFr": "Créer une archive tar compressée en gzip de /etc",
        "instruction": "Run tar -czf /backup/etc-backup.tar.gz /etc.",
        "instructionFr": "Lancez tar -czf /backup/etc-backup.tar.gz /etc pour archiver la configuration.",
        "hint": "tar -czf /backup/etc-backup.tar.gz /etc",
        "hintFr": "tar -czf /backup/etc-backup.tar.gz /etc",
        "expectedCommands": [
          "tar -czf /backup/etc-backup.tar.gz /etc",
          "tar -czvf /backup/etc-backup.tar.gz /etc",
          "sudo tar -czf /backup/etc-backup.tar.gz /etc",
          "sudo tar -czvf /backup/etc-backup.tar.gz /etc"
        ],
        "simulatedOutput": "[OK] Archive /backup/etc-backup.tar.gz created successfully.",
        "explanation": "tar -c (create), -z (gzip), -f (filename) packages the directory tree into a single portable compressed archive.",
        "explanationFr": "tar regroupe les arborescences de fichiers en préservant la hiérarchie et gzip compresse le flux."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Test archive integrity and list contents without extracting",
        "titleFr": "Tester l'intégrité de l'archive et lister le contenu sans extraction",
        "instruction": "Use tar -tzf on /backup/etc-backup.tar.gz to verify the archive structure.",
        "instructionFr": "Utilisez tar -tzf sur /backup/etc-backup.tar.gz pour contrôler la table des matières.",
        "hint": "tar -tzf /backup/etc-backup.tar.gz",
        "hintFr": "tar -tzf /backup/etc-backup.tar.gz",
        "expectedCommands": [
          "tar -tzf /backup/etc-backup.tar.gz",
          "tar -tf /backup/etc-backup.tar.gz",
          "tar -tzvf /backup/etc-backup.tar.gz"
        ],
        "simulatedOutput": "etc/\netc/passwd\netc/group\netc/fstab\netc/hosts\netc/crontab\n...",
        "explanation": "tar -t lists entries in an archive without unpacking to disk, ensuring file headers and gzip checksums are valid.",
        "explanationFr": "tar -t vérifie les blocs et liste les fichiers sans écrire sur le disque, garantissant l'intégrité de l'archive."
      }
    ]
  },
  {
    "id": "lab-lpic2-11",
    "title": "BIND 9 Authoritative DNS Zone Configuration & Validation",
    "titleFr": "Configuration & Validation d'une zone DNS BIND 9 faisant autorité",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "DNS & Name Servers",
    "difficulty": "Intermediate",
    "estimatedMinutes": 10,
    "goal": "Validate BIND configuration files with named-checkconf, test zone syntax with named-checkzone, and reload the zone with rndc.",
    "goalFr": "Valider les fichiers BIND avec named-checkconf, tester la syntaxe de zone avec named-checkzone et recharger avec rndc.",
    "context": "A new DNS zone db.example.com has been edited. You must verify syntax before live reload to avoid dropping DNS service.",
    "contextFr": "La zone db.example.com vient d'être modifiée. Vous devez valider sa syntaxe avant rechargement pour éviter une panne.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Validate global BIND configuration file syntax",
        "titleFr": "Valider la syntaxe du fichier de configuration global BIND",
        "instruction": "Run named-checkconf to ensure named.conf has no syntax errors.",
        "instructionFr": "Exécutez named-checkconf pour valider named.conf.",
        "hint": "named-checkconf",
        "hintFr": "named-checkconf",
        "expectedCommands": [
          "named-checkconf",
          "sudo named-checkconf"
        ],
        "simulatedOutput": "[OK] /etc/bind/named.conf syntax valid (0 errors).",
        "explanation": "named-checkconf parses named.conf and all included files for missing semicolons, unknown clauses, and bracket mismatches.",
        "explanationFr": "named-checkconf vérifie la conformité lexicale et syntaxique de named.conf et de ses inclusions."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Check zone file syntax and serial number with named-checkzone",
        "titleFr": "Vérifier la syntaxe du fichier de zone et le numéro de série avec named-checkzone",
        "instruction": "Execute named-checkzone for domain 'example.com' on /etc/bind/db.example.com.",
        "instructionFr": "Exécutez named-checkzone pour 'example.com' sur /etc/bind/db.example.com.",
        "hint": "named-checkzone example.com /etc/bind/db.example.com",
        "hintFr": "named-checkzone example.com /etc/bind/db.example.com",
        "expectedCommands": [
          "named-checkzone example.com /etc/bind/db.example.com",
          "sudo named-checkzone example.com /etc/bind/db.example.com",
          "named-checkzone example.com /var/named/example.com.zone"
        ],
        "simulatedOutput": "zone example.com/IN: loaded serial 2026091601\nOK",
        "explanation": "named-checkzone verifies SOA format, glue records, MX/NS target validity, and confirms serial number presence.",
        "explanationFr": "named-checkzone vérifie le SOA, les enregistrements NS, MX et la cohérence des numéros de série."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Reload specific zone in BIND using rndc without full daemon restart",
        "titleFr": "Recharger la zone dans BIND via rndc sans redémarrer le démon",
        "instruction": "Use rndc reload to instruct named to reload example.com.",
        "instructionFr": "Utilisez rndc reload pour ordonner à named de recharger la zone example.com.",
        "hint": "rndc reload example.com",
        "hintFr": "rndc reload example.com",
        "expectedCommands": [
          "rndc reload example.com",
          "sudo rndc reload example.com",
          "rndc reload",
          "sudo rndc reload"
        ],
        "simulatedOutput": "zone reload queued for 'example.com'",
        "explanation": "rndc communicates with named via TCP port 953 using an HMAC authentication key to apply updates dynamically.",
        "explanationFr": "rndc communique via le canal sécurisé (port 953) pour rafraîchir la zone sans couper les requêtes en vol."
      }
    ]
  },
  {
    "id": "lab-lpic2-12",
    "title": "Reverse DNS Zone Validation & PTR Resolution",
    "titleFr": "Validation d'une zone DNS inverse & Résolution PTR",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.2",
    "category": "DNS & Name Servers",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Verify reverse zone 1.168.192.in-addr.arpa and perform reverse lookup with dig -x.",
    "goalFr": "Vérifier la zone inverse 1.168.192.in-addr.arpa et effectuer une résolution inverse avec dig -x.",
    "context": "Mail servers require valid PTR records matching forward FQDNs. You must validate the reverse zone.",
    "contextFr": "Les serveurs de messagerie exigent un enregistrement PTR valide. Vous devez tester la zone inverse.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Check reverse zone file with named-checkzone",
        "titleFr": "Vérifier le fichier de zone inverse avec named-checkzone",
        "instruction": "Run named-checkzone for 1.168.192.in-addr.arpa on /etc/bind/db.192.168.1.",
        "instructionFr": "Lancez named-checkzone pour 1.168.192.in-addr.arpa sur /etc/bind/db.192.168.1.",
        "hint": "named-checkzone 1.168.192.in-addr.arpa /etc/bind/db.192.168.1",
        "hintFr": "named-checkzone 1.168.192.in-addr.arpa /etc/bind/db.192.168.1",
        "expectedCommands": [
          "named-checkzone 1.168.192.in-addr.arpa /etc/bind/db.192.168.1",
          "sudo named-checkzone 1.168.192.in-addr.arpa /etc/bind/db.192.168.1"
        ],
        "simulatedOutput": "zone 1.168.192.in-addr.arpa/IN: loaded serial 2026091601\nOK",
        "explanation": "Reverse DNS zones map octets in reverse order under the in-addr.arpa domain tree to provide IP-to-name PTR mappings.",
        "explanationFr": "Les zones inverses inversent les octets sous in-addr.arpa pour faire correspondre les adresses IP aux FQDN."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query PTR record for 192.168.1.10 using dig",
        "titleFr": "Interroger l'enregistrement PTR pour 192.168.1.10 avec dig",
        "instruction": "Execute dig with reverse lookup flag (-x) targeting 192.168.1.10 @localhost.",
        "instructionFr": "Exécutez dig avec l'option de résolution inverse (-x) sur 192.168.1.10 @localhost.",
        "hint": "dig -x 192.168.1.10 @localhost",
        "hintFr": "dig -x 192.168.1.10 @localhost",
        "expectedCommands": [
          "dig -x 192.168.1.10 @localhost",
          "dig -x 192.168.1.10 @127.0.0.1",
          "dig -x 192.168.1.10",
          "host 192.168.1.10"
        ],
        "simulatedOutput": ";; ANSWER SECTION:\n10.1.168.192.in-addr.arpa. 86400 IN PTR mail.example.com.",
        "explanation": "dig -x translates the IPv4 address to its reverse pointer notation and requests the PTR resource record.",
        "explanationFr": "dig -x convertit automatiquement l'adresse IPv4 en notation arpa et demande l'enregistrement PTR."
      }
    ]
  },
  {
    "id": "lab-lpic2-13",
    "title": "Apache HTTPD VirtualHost Configuration & Module Control",
    "titleFr": "Configuration de VirtualHosts Apache & Gestion des modules",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Test Apache configuration syntax with apachectl, enable site configuration, and enable mod_rewrite.",
    "goalFr": "Tester la syntaxe Apache avec apachectl, activer un site virtuel et activer le module rewrite.",
    "context": "A new site configuration /etc/apache2/sites-available/app.conf must be validated and enabled in production.",
    "contextFr": "Un nouveau VirtualHost applicatif doit être validé, activé et le module de réécriture activé.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Test Apache configuration syntax with apachectl",
        "titleFr": "Tester la syntaxe de configuration d'Apache avec apachectl",
        "instruction": "Run apachectl (or apache2ctl) with configtest.",
        "instructionFr": "Lancez apachectl configtest pour vérifier la syntaxe.",
        "hint": "apachectl configtest",
        "hintFr": "apachectl configtest",
        "expectedCommands": [
          "apachectl configtest",
          "apache2ctl configtest",
          "sudo apachectl configtest",
          "sudo apache2ctl configtest",
          "apachectl -t"
        ],
        "simulatedOutput": "Syntax OK",
        "explanation": "apachectl configtest parses all directives in apache2.conf / httpd.conf and returns Syntax OK or reports faulty lines.",
        "explanationFr": "apachectl configtest analyse l'ensemble des directives et signale toute anomalie de syntaxe."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Enable the site app.conf using a2ensite",
        "titleFr": "Activer le site app.conf avec a2ensite",
        "instruction": "Execute a2ensite to enable the site app.conf.",
        "instructionFr": "Exécutez a2ensite pour activer le site app.conf.",
        "hint": "a2ensite app.conf",
        "hintFr": "a2ensite app.conf",
        "expectedCommands": [
          "a2ensite app.conf",
          "sudo a2ensite app.conf",
          "a2ensite app"
        ],
        "simulatedOutput": "Enabling site app.\nTo activate the new configuration, you need to run:\n  systemctl reload apache2",
        "explanation": "a2ensite creates a symbolic link from /etc/apache2/sites-available/app.conf to /etc/apache2/sites-enabled/.",
        "explanationFr": "a2ensite crée le lien symbolique dans /etc/apache2/sites-enabled/ pointant vers sites-available/."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Enable Apache URL rewrite module (mod_rewrite)",
        "titleFr": "Activer le module de réécriture d'URL Apache (mod_rewrite)",
        "instruction": "Use a2enmod to activate the rewrite module.",
        "instructionFr": "Utilisez a2enmod pour activer le module rewrite.",
        "hint": "a2enmod rewrite",
        "hintFr": "a2enmod rewrite",
        "expectedCommands": [
          "a2enmod rewrite",
          "sudo a2enmod rewrite"
        ],
        "simulatedOutput": "Enabling module rewrite.\nTo activate the new configuration, you need to run:\n  systemctl restart apache2",
        "explanation": "a2enmod symlinks rewrite.load from mods-available into mods-enabled.",
        "explanationFr": "a2enmod crée le lien vers rewrite.load dans /etc/apache2/mods-enabled/."
      }
    ]
  },
  {
    "id": "lab-lpic2-14",
    "title": "Nginx Reverse Proxy & Upstream Load Balancing",
    "titleFr": "Reverse Proxy Nginx & Répartition de charge Upstream",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.2",
    "category": "Web Services",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Test Nginx configuration with nginx -t, reload configuration without connection drop, and test response headers with curl.",
    "goalFr": "Tester la configuration Nginx avec nginx -t, recharger sans rupture et tester les en-têtes avec curl.",
    "context": "An upstream cluster of application servers has been added to nginx.conf. You must test and reload the proxy.",
    "contextFr": "Un groupe de serveurs d'arrière-plan a été configuré. Vous devez valider et recharger Nginx.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Validate Nginx configuration syntax with nginx -t",
        "titleFr": "Valider la syntaxe de configuration Nginx avec nginx -t",
        "instruction": "Execute nginx with the test flag (-t).",
        "instructionFr": "Exécutez nginx avec l'option de test (-t).",
        "hint": "nginx -t",
        "hintFr": "nginx -t",
        "expectedCommands": [
          "nginx -t",
          "sudo nginx -t"
        ],
        "simulatedOutput": "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful",
        "explanation": "nginx -t verifies all server blocks, proxy_pass targets, and upstream configurations without affecting live traffic.",
        "explanationFr": "nginx -t valide les blocs server, upstream et directives proxy_pass avant toute bascule."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Reload Nginx service gracefully without connection drops",
        "titleFr": "Recharger le service Nginx à chaud sans coupure de connexions",
        "instruction": "Run nginx -s reload to reread configuration on the fly.",
        "instructionFr": "Lancez nginx -s reload pour réappliquer la configuration sans interruption.",
        "hint": "nginx -s reload",
        "hintFr": "nginx -s reload",
        "expectedCommands": [
          "nginx -s reload",
          "sudo nginx -s reload",
          "systemctl reload nginx",
          "sudo systemctl reload nginx"
        ],
        "simulatedOutput": "[OK] Master process spawned new workers with updated configuration; retiring old workers.",
        "explanation": "nginx -s reload tells the master to start new worker processes and gracefully drain existing ones.",
        "explanationFr": "nginx -s reload lance de nouveaux processus ouvriers avec la nouvelle configuration en terminant les anciens sans coupure."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Verify HTTP response headers and proxy status with curl",
        "titleFr": "Vérifier les en-têtes de réponse HTTP et l'état du proxy avec curl",
        "instruction": "Use curl with -I (head request) against http://localhost/.",
        "instructionFr": "Utilisez curl avec -I pour interroger les en-têtes HTTP de http://localhost/.",
        "hint": "curl -I http://localhost/",
        "hintFr": "curl -I http://localhost/",
        "expectedCommands": [
          "curl -I http://localhost/",
          "curl -I http://127.0.0.1/",
          "curl -IL http://localhost/"
        ],
        "simulatedOutput": "HTTP/1.1 200 OK\nServer: nginx/1.24.0\nDate: Wed, 16 Sep 2026 14:30:12 GMT\nContent-Type: text/html; charset=UTF-8\nConnection: keep-alive\nX-Upstream-Server: app-backend-01",
        "explanation": "curl -I requests only HTTP headers, verifying reverse proxy routing and custom response headers.",
        "explanationFr": "curl -I affiche uniquement les en-têtes HTTP, permettant de vérifier la route inverse du proxy."
      }
    ]
  },
  {
    "id": "lab-lpic2-15",
    "title": "NFSv4 Server Exports & Client Mount Management",
    "titleFr": "Partages NFSv4 côté serveur & Montage côté client",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Re-export filesystems with exportfs -rav, verify active exports with exportfs -v, and mount NFSv4 on client.",
    "goalFr": "Rafraîchir les exports NFS avec exportfs -rav, vérifier les partages avec exportfs -v et monter un partage NFSv4.",
    "context": "A new shared directory /srv/nfs/shared has been added to /etc/exports. You must re-export it and check client connectivity.",
    "contextFr": "Un nouveau dossier partagé a été configuré dans /etc/exports. Vous devez réexporter et vérifier le montage NFSv4.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Synchronize active NFS exports from /etc/exports",
        "titleFr": "Synchroniser les partages NFS actifs depuis /etc/exports",
        "instruction": "Run exportfs with -rav to re-export all directories defined in /etc/exports.",
        "instructionFr": "Exécutez exportfs avec -rav pour réexporter tous les dossiers définis.",
        "hint": "exportfs -rav",
        "hintFr": "exportfs -rav",
        "expectedCommands": [
          "exportfs -rav",
          "sudo exportfs -rav",
          "exportfs -r"
        ],
        "simulatedOutput": "exporting 192.168.1.0/24:/srv/nfs/shared\nexporting 192.168.1.0/24:/srv/nfs/backups",
        "explanation": "exportfs -rav re-reads /etc/exports and updates the kernel nfsd export table without stopping active client sessions.",
        "explanationFr": "exportfs -rav relit /etc/exports et met à jour la table d'exportation du noyau sans interruption."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Display verbose export options for all active shares",
        "titleFr": "Afficher les options détaillées de tous les partages actifs",
        "instruction": "Execute exportfs with the verbose flag (-v).",
        "instructionFr": "Exécutez exportfs avec l'option verbeuse (-v).",
        "hint": "exportfs -v",
        "hintFr": "exportfs -v",
        "expectedCommands": [
          "exportfs -v",
          "sudo exportfs -v"
        ],
        "simulatedOutput": "/srv/nfs/shared\n\t192.168.1.0/24(rw,wdelay,root_squash,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)",
        "explanation": "exportfs -v reveals runtime security parameters including root_squash, subtree checking, and authentication flavor.",
        "explanationFr": "exportfs -v détaille les options de sécurité effectives, notamment root_squash et sec=sys."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Mount NFSv4 export on /mnt/nfs using mount",
        "titleFr": "Monter le partage NFSv4 sur /mnt/nfs",
        "instruction": "Mount the NFSv4 share from localhost:/srv/nfs/shared onto /mnt/nfs specifying -t nfs4.",
        "instructionFr": "Montez le partage NFSv4 localhost:/srv/nfs/shared sur /mnt/nfs avec -t nfs4.",
        "hint": "mount -t nfs4 localhost:/srv/nfs/shared /mnt/nfs",
        "hintFr": "mount -t nfs4 localhost:/srv/nfs/shared /mnt/nfs",
        "expectedCommands": [
          "mount -t nfs4 localhost:/srv/nfs/shared /mnt/nfs",
          "sudo mount -t nfs4 localhost:/srv/nfs/shared /mnt/nfs",
          "mount -t nfs localhost:/srv/nfs/shared /mnt/nfs"
        ],
        "simulatedOutput": "[OK] NFSv4 share mounted on /mnt/nfs (rw,relatime,vers=4.2).",
        "explanation": "NFSv4 uses a single TCP port (2049) and unified pseudo-filesystem namespace.",
        "explanationFr": "NFSv4 utilise un port TCP unique (2049) et un espace de nommage unifié."
      }
    ]
  },
  {
    "id": "lab-lpic2-16",
    "title": "Samba SMB/CIFS File Sharing & User Password Management",
    "titleFr": "Partage de fichiers Samba SMB/CIFS & Gestion des mots de passe",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Verify smb.conf with testparm, register Samba password for user1 with smbpasswd, and check active connections with smbstatus.",
    "goalFr": "Valider smb.conf avec testparm, créer le mot de passe Samba de user1 avec smbpasswd et inspecter les sessions avec smbstatus.",
    "context": "A Windows-compatible file share must be deployed. You must validate the configuration and provision user credentials.",
    "contextFr": "Un partage Windows/Linux doit être mis en production. Vous devez vérifier smb.conf et provisionner un compte.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Test Samba configuration file syntax with testparm",
        "titleFr": "Tester la syntaxe du fichier de configuration Samba avec testparm",
        "instruction": "Run testparm with -s to suppress informational messages and show loaded shares.",
        "instructionFr": "Lancez testparm avec -s pour valider les paramètres sans bruit.",
        "hint": "testparm -s",
        "hintFr": "testparm -s",
        "expectedCommands": [
          "testparm -s",
          "testparm",
          "sudo testparm -s",
          "sudo testparm"
        ],
        "simulatedOutput": "Load smb config files from /etc/samba/smb.conf\nLoaded services file OK.\nServer role: ROLE_STANDALONE\n\n[global]\n\tworkgroup = WORKGROUP\n\tsecurity = USER\n\n[shared]\n\tpath = /srv/samba/shared\n\tread only = No",
        "explanation": "testparm checks smb.conf for invalid parameters, duplicate stanzas, and outputs effective runtime settings.",
        "explanationFr": "testparm contrôle les paramètres de smb.conf et élimine les doublons ou directives inconnues."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Add user1 to Samba password database using smbpasswd",
        "titleFr": "Ajouter user1 à la base de mots de passe Samba avec smbpasswd",
        "instruction": "Execute smbpasswd with -a to register user1.",
        "instructionFr": "Exécutez smbpasswd avec -a pour ajouter user1.",
        "hint": "smbpasswd -a user1",
        "hintFr": "smbpasswd -a user1",
        "expectedCommands": [
          "smbpasswd -a user1",
          "sudo smbpasswd -a user1"
        ],
        "simulatedOutput": "New SMB password:\nRetype new SMB password:\nAdded user user1.",
        "explanation": "smbpasswd stores NT-hashes in /var/lib/samba/private/passdb.tdb, required for NTLM authentication.",
        "explanationFr": "smbpasswd stocke les empreintes NT dans la base passdb.tdb pour l'authentification NTLM."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect active Samba sessions and file locks with smbstatus",
        "titleFr": "Examiner les sessions Samba et verrous de fichiers avec smbstatus",
        "instruction": "Execute smbstatus to view current connected users and locked files.",
        "instructionFr": "Lancez smbstatus pour inspecter les connexions et verrous actifs.",
        "hint": "smbstatus",
        "hintFr": "smbstatus",
        "expectedCommands": [
          "smbstatus",
          "sudo smbstatus",
          "smbstatus -b"
        ],
        "simulatedOutput": "Samba version 4.19.5\nPID     Username     Group        Machine                    Protocol Version\n------------------------------------------------------------------------------\n2184    user1        users        192.168.1.50 (ipv4:...)    SMB3_11 \n\nService      pid     Machine       Connected at\n-------------------------------------------------------\nshared       2184    192.168.1.50  Wed Sep 16 14:35:10 2026",
        "explanation": "smbstatus queries Samba shared memory tables to report active SMB sessions, negotiated protocol dialects, and oplocks.",
        "explanationFr": "smbstatus interroge les tables en mémoire partagée pour restituer les sessions connectées et les verrous."
      }
    ]
  },
  {
    "id": "lab-lpic2-17",
    "title": "Postfix Mail Transfer Agent (MTA) Configuration & Virtual Aliases",
    "titleFr": "Configuration du MTA Postfix & Tables d'alias virtuels",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.1",
    "category": "E-Mail Services",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Update Postfix configuration with postconf, generate binary lookup table with postmap, and inspect mail queue with mailq.",
    "goalFr": "Mettre à jour la configuration avec postconf, compiler la table d'alias avec postmap et inspecter la file avec mailq.",
    "context": "New email domains and virtual alias redirections must be compiled into Postfix lookup databases.",
    "contextFr": "Des alias virtuels de messagerie doivent être compilés dans les bases de recherche Postfix.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Update mydomain parameter in Postfix with postconf -e",
        "titleFr": "Mettre à jour le paramètre mydomain de Postfix avec postconf -e",
        "instruction": "Execute postconf -e 'mydomain = example.com' to update main.cf safely.",
        "instructionFr": "Exécutez postconf -e 'mydomain = example.com' pour mettre à jour main.cf.",
        "hint": "postconf -e \"mydomain = example.com\"",
        "hintFr": "postconf -e \"mydomain = example.com\"",
        "expectedCommands": [
          "postconf -e \"mydomain = example.com\"",
          "postconf -e 'mydomain = example.com'",
          "sudo postconf -e \"mydomain = example.com\"",
          "sudo postconf -e 'mydomain = example.com'"
        ],
        "simulatedOutput": "[OK] /etc/postfix/main.cf updated: mydomain = example.com",
        "explanation": "postconf -e modifies /etc/postfix/main.cf safely without risk of formatting corruption.",
        "explanationFr": "postconf -e édite programmatiquement /etc/postfix/main.cf en préservant la structure du fichier."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Compile virtual alias map into Berkeley DB format with postmap",
        "titleFr": "Compiler la table d'alias virtuels avec postmap",
        "instruction": "Run postmap /etc/postfix/virtual to generate /etc/postfix/virtual.db.",
        "instructionFr": "Lancez postmap /etc/postfix/virtual pour créer la base indexée virtual.db.",
        "hint": "postmap /etc/postfix/virtual",
        "hintFr": "postmap /etc/postfix/virtual",
        "expectedCommands": [
          "postmap /etc/postfix/virtual",
          "sudo postmap /etc/postfix/virtual"
        ],
        "simulatedOutput": "[OK] Indexed lookup table /etc/postfix/virtual.db compiled successfully.",
        "explanation": "postmap compiles plain text map files into indexed hash/db formats for fast O(1) lookups by smtpd.",
        "explanationFr": "postmap compile les tables textuelles en bases Berkeley DB indexées pour un accès ultra-rapide."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect active Postfix outgoing mail queue with mailq",
        "titleFr": "Inspecter la file d'attente des courriels sortants avec mailq",
        "instruction": "Execute mailq (or postqueue -p) to view messages in queue.",
        "instructionFr": "Exécutez mailq (ou postqueue -p) pour inspecter les courriels en attente.",
        "hint": "mailq",
        "hintFr": "mailq",
        "expectedCommands": [
          "mailq",
          "sudo mailq",
          "postqueue -p",
          "sudo postqueue -p"
        ],
        "simulatedOutput": "Mail queue is empty",
        "explanation": "mailq scans /var/spool/postfix/ incoming, active, and deferred queue directories.",
        "explanationFr": "mailq analyse les répertoires de spool de Postfix et liste les messages différés ou bloqués."
      }
    ]
  },
  {
    "id": "lab-lpic2-18",
    "title": "Dovecot IMAP Server Configuration & Authentication Testing",
    "titleFr": "Configuration du serveur IMAP Dovecot & Test d'authentification",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.2",
    "category": "E-Mail Services",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Verify Dovecot non-default configurations with dovecot -n, test user authentication with doveadm auth test, and verify listening port 993.",
    "goalFr": "Vérifier les paramètres Dovecot avec dovecot -n, tester l'authentification avec doveadm auth test et contrôler le port 993.",
    "context": "Dovecot provides IMAP/IMAPS retrieval for client mailboxes. You must test authentication against system shadow accounts.",
    "contextFr": "Dovecot assure la relève IMAP/IMAPS. Vous devez tester la configuration et valider les identifiants.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Dump non-default Dovecot settings with dovecot -n",
        "titleFr": "Afficher les réglages non par défaut de Dovecot avec dovecot -n",
        "instruction": "Execute dovecot with -n (non-default settings only).",
        "instructionFr": "Exécutez dovecot avec -n pour n'afficher que les directives personnalisées.",
        "hint": "dovecot -n",
        "hintFr": "dovecot -n",
        "expectedCommands": [
          "dovecot -n",
          "sudo dovecot -n"
        ],
        "simulatedOutput": "# 2.3.21 (47349e248): /etc/dovecot/dovecot.conf\nmail_location = maildir:~/Maildir\nprotocols = \"imap lmtp\"\nssl_cert = </etc/ssl/certs/ssl-cert-snakeoil.pem\nssl_key = </etc/ssl/private/ssl-cert-snakeoil.key",
        "explanation": "dovecot -n filters out thousands of compiled defaults to display only administrator-configured overrides.",
        "explanationFr": "dovecot -n isole les directives explicitement modifiées par l'administrateur, facilitant le diagnostic."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Test user password authentication with doveadm auth test",
        "titleFr": "Tester l'authentification d'un utilisateur avec doveadm auth test",
        "instruction": "Run doveadm auth test user1 SecretPass123 to verify credential validation.",
        "instructionFr": "Lancez doveadm auth test user1 SecretPass123 pour tester la validation des identifiants.",
        "hint": "doveadm auth test user1 SecretPass123",
        "hintFr": "doveadm auth test user1 SecretPass123",
        "expectedCommands": [
          "doveadm auth test user1 SecretPass123",
          "sudo doveadm auth test user1 SecretPass123",
          "doveadm auth test user1"
        ],
        "simulatedOutput": "passdb: user1 auth succeeded\nextra fields:\n  user=user1",
        "explanation": "doveadm auth test simulates PAM/shadow/LDAP authentication against the Dovecot authentication service socket.",
        "explanationFr": "doveadm auth test valide les identifiants utilisateur directement contre le démon d'authentification."
      }
    ]
  },
  {
    "id": "lab-lpic2-19",
    "title": "PAM (Pluggable Authentication Modules) & Account Lockout",
    "titleFr": "PAM (Pluggable Authentication Modules) & Verrouillage de compte",
    "certification": "lpic-2",
    "topicNumber": 211,
    "objectiveId": "211.1",
    "category": "Authentication & PAM",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Inspect PAM configuration in /etc/pam.d/common-auth, query faillock failed login records, and reset failed counters for a locked user.",
    "goalFr": "Examiner /etc/pam.d/common-auth, inspecter les échecs de connexion avec faillock et réinitialiser les compteurs d'un utilisateur.",
    "context": "A brute-force policy locks accounts after 5 failed password attempts. User 'alice' is locked out and requests a counter reset.",
    "contextFr": "Une politique de sécurité bloque les comptes après 5 échecs. 'alice' est verrouillée et vous devez débloquer son compte.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Display PAM authentication stack configuration",
        "titleFr": "Afficher la pile d'authentification PAM",
        "instruction": "Display /etc/pam.d/common-auth to inspect active auth modules.",
        "instructionFr": "Affichez /etc/pam.d/common-auth pour inspecter les modules d'authentification.",
        "hint": "cat /etc/pam.d/common-auth",
        "hintFr": "cat /etc/pam.d/common-auth",
        "expectedCommands": [
          "cat /etc/pam.d/common-auth",
          "less /etc/pam.d/common-auth",
          "head -n 20 /etc/pam.d/common-auth"
        ],
        "simulatedOutput": "auth\trequired\t\t\tpam_faillock.so preauth silent audit deny=5 unlock_time=900\nauth\t[success=1 default=ignore]\tpam_unix.so nullok_secure\nauth\t[default=die]\t\t\tpam_faillock.so authfail audit deny=5 unlock_time=900\nauth\tsufficient\t\t\tpam_faillock.so authsucc audit deny=5 unlock_time=900\nauth\trequisite\t\t\tpam_deny.so\nauth\trequired\t\t\tpam_permit.so",
        "explanation": "PAM common-auth evaluates pam_faillock to count failures and deny access when the threshold is exceeded.",
        "explanationFr": "common-auth orchestre les modules PAM ; pam_faillock comptabilise les échecs et bloque le compte."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Check failed authentication attempts for user alice with faillock",
        "titleFr": "Vérifier les tentatives d'authentification échouées de alice avec faillock",
        "instruction": "Run faillock --user alice to inspect failed attempt timestamps.",
        "instructionFr": "Lancez faillock --user alice pour visualiser les tentatives infructueuses.",
        "hint": "faillock --user alice",
        "hintFr": "faillock --user alice",
        "expectedCommands": [
          "faillock --user alice",
          "sudo faillock --user alice",
          "pam_tally2 --user alice"
        ],
        "simulatedOutput": "alice:\nWhen                Type  Source                           Valid\n2026-09-16 14:10:11 TTY   /dev/pts/1                           V\n2026-09-16 14:10:14 TTY   /dev/pts/1                           V\n2026-09-16 14:10:18 TTY   /dev/pts/1                           V\n2026-09-16 14:10:21 TTY   /dev/pts/1                           V\n2026-09-16 14:10:24 TTY   /dev/pts/1                           V",
        "explanation": "faillock reads tally logs in /var/run/faillock/ to verify whether the account has reached lockout limits.",
        "explanationFr": "faillock lit les journaux d'échecs et confirme si le compte est actuellement sous verrouillage."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Reset failed authentication tally for user alice",
        "titleFr": "Réinitialiser le compteur d'échecs de alice pour débloquer le compte",
        "instruction": "Execute faillock with --user alice and --reset to clear the lockout.",
        "instructionFr": "Exécutez faillock avec --user alice et --reset pour déverrouiller le compte.",
        "hint": "faillock --user alice --reset",
        "hintFr": "faillock --user alice --reset",
        "expectedCommands": [
          "faillock --user alice --reset",
          "sudo faillock --user alice --reset",
          "faillock --reset --user alice",
          "sudo faillock --reset --user alice",
          "pam_tally2 --user alice --reset"
        ],
        "simulatedOutput": "[OK] Authentication tally cleared for user alice. Account unlocked.",
        "explanation": "faillock --reset purges the tally records for the user, restoring immediate login eligibility.",
        "explanationFr": "faillock --reset efface les enregistrements de tentatives échouées, débloquant l'accès instantanément."
      }
    ]
  },
  {
    "id": "lab-lpic2-20",
    "title": "Packet Filtering & Firewalling with Nftables",
    "titleFr": "Filtrage de paquets & Pare-feu avec Nftables",
    "certification": "lpic-2",
    "topicNumber": 212,
    "objectiveId": "212.1",
    "category": "Firewall & Security",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "List current nftables ruleset, create an inet table, create an input base chain with drop policy, and allow incoming SSH (port 22).",
    "goalFr": "Lister le ruleset nftables, créer une table inet, une chaîne input en drop et autoriser SSH (port 22).",
    "context": "The server must be secured using modern Linux nftables, blocking all unsolicited inbound connections except SSH.",
    "contextFr": "Le serveur doit être protégé avec nftables en bloquant tout le trafic entrant sauf le port SSH 22.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List all currently loaded nftables rules",
        "titleFr": "Lister l'ensemble des règles nftables chargées",
        "instruction": "Execute nft with the command to list the entire ruleset.",
        "instructionFr": "Exécutez nft avec la commande de listage du ruleset.",
        "hint": "nft list ruleset",
        "hintFr": "nft list ruleset",
        "expectedCommands": [
          "nft list ruleset",
          "sudo nft list ruleset"
        ],
        "simulatedOutput": "# Active nftables ruleset (empty)",
        "explanation": "nft list ruleset outputs all family tables, chains, sets, and active packet filtering rules.",
        "explanationFr": "nft list ruleset restitue l'intégralité des tables, chaînes et règles actives dans le noyau."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Create inet family table named 'filter'",
        "titleFr": "Créer une table de famille inet nommée 'filter'",
        "instruction": "Execute nft add table inet filter.",
        "instructionFr": "Exécutez nft add table inet filter pour gérer IPv4 et IPv6 simultanément.",
        "hint": "nft add table inet filter",
        "hintFr": "nft add table inet filter",
        "expectedCommands": [
          "nft add table inet filter",
          "sudo nft add table inet filter"
        ],
        "simulatedOutput": "[OK] Table 'filter' of family 'inet' added.",
        "explanation": "The 'inet' family in nftables evaluates both IPv4 and IPv6 packets within a single unified rule set.",
        "explanationFr": "La famille 'inet' permet de traiter simultanément les paquets IPv4 et IPv6 dans la même table."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Allow incoming SSH (port 22) connections",
        "titleFr": "Autoriser les connexions entrantes SSH (port 22)",
        "instruction": "Add a rule to chain input allowing tcp dport 22: nft add rule inet filter input tcp dport 22 accept.",
        "instructionFr": "Ajoutez la règle acceptant le port 22 : nft add rule inet filter input tcp dport 22 accept.",
        "hint": "nft add rule inet filter input tcp dport 22 accept",
        "hintFr": "nft add rule inet filter input tcp dport 22 accept",
        "expectedCommands": [
          "nft add rule inet filter input tcp dport 22 accept",
          "sudo nft add rule inet filter input tcp dport 22 accept"
        ],
        "simulatedOutput": "[OK] Rule added: tcp dport 22 accept in chain input.",
        "explanation": "nftables evaluates rules in order; matches trigger the verdict (accept, drop, reject) directly in kernel space.",
        "explanationFr": "nftables évalue les règles séquentiellement et applique immédiatement le verdict 'accept'."
      }
    ]
  }
];

export const guidedMiniLabsLpic3: GuidedLabScenario[] = [
  {
    "id": "lab-lpic3-01",
    "title": "OpenLDAP Directory Search & LDIF Object Ingestion",
    "titleFr": "Recherche dans l'annuaire OpenLDAP & Injection d'objets LDIF",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.1",
    "category": "OpenLDAP Identity",
    "difficulty": "Advanced",
    "estimatedMinutes": 10,
    "goal": "Search the directory with ldapsearch, parse LDIF entries, and insert a new organizationalUnit with ldapadd.",
    "goalFr": "Interroger l'annuaire avec ldapsearch, analyser les entrées LDIF et insérer une organizationalUnit avec ldapadd.",
    "context": "An enterprise identity infrastructure runs OpenLDAP. You must verify tree contents and provision a new department branch.",
    "contextFr": "Une infrastructure d'identité tourne sous OpenLDAP. Vous devez auditer la branche DIT et ajouter une nouvelle unité.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Search directory tree using simple authentication",
        "titleFr": "Rechercher dans l'annuaire avec authentification simple",
        "instruction": "Execute ldapsearch with -x (simple auth) and base search (-b \"dc=example,dc=com\") for objectClass=posixAccount.",
        "instructionFr": "Exécutez ldapsearch avec -x et -b \"dc=example,dc=com\" en filtrant sur (objectClass=posixAccount).",
        "hint": "ldapsearch -x -b \"dc=example,dc=com\" \"(objectClass=posixAccount)\"",
        "hintFr": "ldapsearch -x -b \"dc=example,dc=com\" \"(objectClass=posixAccount)\"",
        "expectedCommands": [
          "ldapsearch -x -b \"dc=example,dc=com\" \"(objectClass=posixAccount)\"",
          "ldapsearch -x -b 'dc=example,dc=com' '(objectClass=posixAccount)'",
          "ldapsearch -x -b dc=example,dc=com objectClass=posixAccount"
        ],
        "simulatedOutput": "# extended LDIF\n#\n# LDAPv3\n# base <dc=example,dc=com> with scope subtree\n# filter: (objectClass=posixAccount)\n# entries: 2\n\ndn: uid=john,ou=People,dc=example,dc=com\nobjectClass: inetOrgPerson\nobjectClass: posixAccount\nuid: john\ncn: John Doe\nsn: Doe\nuidNumber: 1001\ngidNumber: 1001\nhomeDirectory: /home/john\nloginShell: /bin/bash\n\n# numResponses: 3\n# numEntries: 2",
        "explanation": "ldapsearch queries LDAP directories over port 389, returning results structured in LDIF (RFC 2849).",
        "explanationFr": "ldapsearch interroge l'annuaire sur le port 389 et renvoie les entrées au standard LDIF."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Insert new OU branch using ldapadd with LDIF input",
        "titleFr": "Insérer une nouvelle branche OU avec ldapadd via un fichier LDIF",
        "instruction": "Run ldapadd with -x, bind DN -D \"cn=admin,dc=example,dc=com\", -W (prompt password), and file -f /tmp/ou_dev.ldif.",
        "instructionFr": "Lancez ldapadd avec -x, -D \"cn=admin,dc=example,dc=com\" et -f /tmp/ou_dev.ldif.",
        "hint": "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -W -f /tmp/ou_dev.ldif",
        "hintFr": "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -W -f /tmp/ou_dev.ldif",
        "expectedCommands": [
          "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -W -f /tmp/ou_dev.ldif",
          "ldapadd -x -D 'cn=admin,dc=example,dc=com' -W -f /tmp/ou_dev.ldif",
          "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -w secret -f /tmp/ou_dev.ldif",
          "ldapadd -x -D 'cn=admin,dc=example,dc=com' -w secret -f /tmp/ou_dev.ldif"
        ],
        "simulatedOutput": "Enter LDAP Password: \nadding new entry \"ou=Engineering,dc=example,dc=com\"\n[OK] Entry committed successfully.",
        "explanation": "ldapadd sends LDAP_REQ_ADD protocol messages to the slapd server to insert directory objects.",
        "explanationFr": "ldapadd envoie la requête LDAP_REQ_ADD pour créer le nouvel objet dans la hiérarchie DIT."
      }
    ]
  },
  {
    "id": "lab-lpic3-02",
    "title": "OpenLDAP Dynamic Online Configuration with cn=config",
    "titleFr": "Configuration dynamique OpenLDAP en ligne avec cn=config",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.2",
    "category": "OpenLDAP Configuration",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Inspect configuration database using slapcat -n 0, and apply dynamic configuration changes via ldapmodify with SASL EXTERNAL.",
    "goalFr": "Examiner la base de configuration avec slapcat -n 0 et appliquer une modification en ligne via ldapmodify et SASL EXTERNAL.",
    "context": "Slapd configuration must be modified online through the cn=config database without restarting the slapd daemon.",
    "contextFr": "La configuration d'OpenLDAP doit être ajustée à chaud dans l'arbre cn=config sans interrompre le démon.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Dump configuration database (database 0) with slapcat",
        "titleFr": "Extraire la base de configuration (base 0) avec slapcat",
        "instruction": "Execute slapcat with -n 0 to export the dynamic cn=config tree.",
        "instructionFr": "Exécutez slapcat avec -n 0 pour extraire l'arborescence cn=config.",
        "hint": "slapcat -n 0",
        "hintFr": "slapcat -n 0",
        "expectedCommands": [
          "slapcat -n 0",
          "sudo slapcat -n 0",
          "slapcat -b cn=config"
        ],
        "simulatedOutput": "dn: cn=config\nobjectClass: olcGlobal\ncn: config\nolcArgsFile: /var/run/slapd/slapd.args\nolcPidFile: /var/run/slapd/slapd.pid\n\ndn: cn=module{0},cn=config\nobjectClass: olcModuleList\ncn: module{0}\nolcModulePath: /usr/lib/ldap\nolcModuleLoad: {0}back_mdb\n\ndn: olcDatabase={0}config,cn=config\nobjectClass: olcDatabaseConfig\nolcDatabase: {0}config",
        "explanation": "slapcat -n 0 reads the local MDB/BDB files directly from disk to output configuration LDIF without requiring a running slapd.",
        "explanationFr": "slapcat -n 0 accède directement aux fichiers physiques de la base pour exporter la configuration cn=config."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Apply dynamic modification via IPC Unix domain socket with ldapmodify",
        "titleFr": "Appliquer la modification dynamique via le socket IPC avec ldapmodify",
        "instruction": "Use ldapmodify with SASL EXTERNAL (-Y EXTERNAL), URI ldapi:/// (-H ldapi:///), and file /tmp/tune.ldif.",
        "instructionFr": "Utilisez ldapmodify avec -Y EXTERNAL, -H ldapi:/// et -f /tmp/tune.ldif.",
        "hint": "ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
        "hintFr": "ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
        "expectedCommands": [
          "ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
          "sudo ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
          "ldapmodify -Y EXTERNAL -H 'ldapi:///' -f /tmp/tune.ldif"
        ],
        "simulatedOutput": "SASL/EXTERNAL authentication started\nSASL username: gidNumber=0+uidNumber=0,cn=peercred,cn=external,cn=auth\nSASL SSF: 0\nmodifying entry \"cn=config\"\n[OK] Configuration parameter applied dynamically.",
        "explanation": "SASL EXTERNAL authentication over Unix domain sockets (ldapi:///) grants root instant administrative access to cn=config.",
        "explanationFr": "L'authentification SASL EXTERNAL sur le socket Unix (ldapi:///) permet à root de modifier cn=config sans mot de passe."
      }
    ]
  },
  {
    "id": "lab-lpic3-03",
    "title": "SSSD Integration & Identity Provider Verification",
    "titleFr": "Intégration du client SSSD & Validation des fournisseurs d'identité",
    "certification": "lpic-3",
    "topicNumber": 303,
    "objectiveId": "303.1",
    "category": "SSSD & PAM Integration",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Verify sssd.conf syntax with sssctl config-check, query user resolution with getent passwd, and inspect cached identities.",
    "goalFr": "Vérifier sssd.conf avec sssctl config-check, tester la résolution avec getent passwd et inspecter le cache SSSD.",
    "context": "SSSD binds this Linux host to central Active Directory and LDAP. You must validate configuration permissions and user lookup.",
    "contextFr": "SSSD relie la machine à l'annuaire d'entreprise. Vous devez auditer la configuration et tester la résolution NSS.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Validate SSSD configuration permissions and syntax",
        "titleFr": "Valider les permissions et la syntaxe de sssd.conf",
        "instruction": "Execute sssctl config-check to inspect /etc/sssd/sssd.conf.",
        "instructionFr": "Lancez sssctl config-check pour auditer la configuration de SSSD.",
        "hint": "sssctl config-check",
        "hintFr": "sssctl config-check",
        "expectedCommands": [
          "sssctl config-check",
          "sudo sssctl config-check"
        ],
        "simulatedOutput": "Issues identified by validators: 0\nFile /etc/sssd/sssd.conf is valid and permissions (0600) are correct.",
        "explanation": "SSSD refuses to start if /etc/sssd/sssd.conf has permissions other than 0600 (read/write root only).",
        "explanationFr": "SSSD refuse catégoriquement de démarrer si les permissions de sssd.conf diffèrent du mode strict 0600."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Verify NSS user resolution from directory with getent",
        "titleFr": "Vérifier la résolution utilisateur NSS avec getent",
        "instruction": "Use getent passwd to look up enterprise account 'john'.",
        "instructionFr": "Utilisez getent passwd pour interroger le compte d'entreprise 'john'.",
        "hint": "getent passwd john",
        "hintFr": "getent passwd john",
        "expectedCommands": [
          "getent passwd john",
          "getent passwd john@example.com"
        ],
        "simulatedOutput": "john:*:10001:10001:John Doe:/home/john:/bin/bash",
        "explanation": "getent queries NSS (Name Service Switch) which delegates the query to libnss_sss.so provided by SSSD.",
        "explanationFr": "getent interroge la couche NSS qui fait appel au module libnss_sss.so de SSSD pour contacter l'annuaire."
      }
    ]
  },
  {
    "id": "lab-lpic3-04",
    "title": "Samba Active Directory Domain Join & Winbind Inspection",
    "titleFr": "Jonction de domaine Active Directory avec Samba & Winbind",
    "certification": "lpic-3",
    "topicNumber": 304,
    "objectiveId": "304.1",
    "category": "Active Directory Interoperability",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Verify domain membership with net ads testjoin, list domain users with wbinfo -u, and inspect trusted domain relationships.",
    "goalFr": "Tester l'adhésion au domaine avec net ads testjoin et lister les utilisateurs distants avec wbinfo -u.",
    "context": "The server has joined an Active Directory domain. You must verify that the Kerberos trust and Winbind daemon are operational.",
    "contextFr": "Le serveur a été rattaché au domaine AD. Vous devez tester la confiance Kerberos et l'état de Winbind.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Verify domain membership trust with net ads testjoin",
        "titleFr": "Vérifier l'adhésion au domaine avec net ads testjoin",
        "instruction": "Execute net ads testjoin to validate the computer account trust password.",
        "instructionFr": "Exécutez net ads testjoin pour valider la relation de confiance avec le contrôleur de domaine.",
        "hint": "net ads testjoin",
        "hintFr": "net ads testjoin",
        "expectedCommands": [
          "net ads testjoin",
          "sudo net ads testjoin"
        ],
        "simulatedOutput": "Join to domain 'EXAMPLE' is OK",
        "explanation": "net ads testjoin verifies the machine account credentials in Active Directory and machine password validity.",
        "explanationFr": "net ads testjoin valide le secret du compte machine de l'hôte enregistré dans l'annuaire Active Directory."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List domain users cached and enumerated by winbind",
        "titleFr": "Lister les utilisateurs du domaine via winbind",
        "instruction": "Execute wbinfo -u to query domain users.",
        "instructionFr": "Exécutez wbinfo -u pour lister les utilisateurs du domaine.",
        "hint": "wbinfo -u",
        "hintFr": "wbinfo -u",
        "expectedCommands": [
          "wbinfo -u",
          "sudo wbinfo -u"
        ],
        "simulatedOutput": "EXAMPLE\\administrator\nEXAMPLE\\guest\nEXAMPLE\\krbtgt\nEXAMPLE\\alice\nEXAMPLE\\bob",
        "explanation": "wbinfo communicates with the winbindd daemon over its local IPC pipe to enumerate domain principals.",
        "explanationFr": "wbinfo interroge le démon winbindd pour énumérer les comptes et groupes du domaine Windows."
      }
    ]
  },
  {
    "id": "lab-lpic3-05",
    "title": "Kerberos KDC Ticket Granting & Keytab Management",
    "titleFr": "Tickets Kerberos KDC & Gestion des fichiers Keytab",
    "certification": "lpic-3",
    "topicNumber": 305,
    "objectiveId": "305.1",
    "category": "Enterprise Authentication",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Obtain a Kerberos TGT with kinit, list active encryption types and expiration with klist -e, and destroy tickets with kdestroy.",
    "goalFr": "Obtenir un TGT Kerberos avec kinit, lister les tickets et chiffrements avec klist -e et détruire le ticket avec kdestroy.",
    "context": "Kerberos single sign-on (SSO) authentication must be tested using ticket granting tickets.",
    "contextFr": "L'authentification unique (SSO) Kerberos doit être validée en générant et inspectant les tickets TGT.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Acquire Ticket Granting Ticket (TGT) with kinit",
        "titleFr": "Obtenir un ticket TGT avec kinit",
        "instruction": "Execute kinit for principal admin@EXAMPLE.COM.",
        "instructionFr": "Exécutez kinit pour le principal admin@EXAMPLE.COM.",
        "hint": "kinit admin@EXAMPLE.COM",
        "hintFr": "kinit admin@EXAMPLE.COM",
        "expectedCommands": [
          "kinit admin@EXAMPLE.COM",
          "kinit admin"
        ],
        "simulatedOutput": "Password for admin@EXAMPLE.COM: \n[OK] TGT acquired from KDC kdc.example.com.",
        "explanation": "kinit contacts the Kerberos AS (Authentication Service) and retrieves a TGT cached in /tmp/krb5cc_<uid>.",
        "explanationFr": "kinit contacte le KDC Kerberos et stocke le ticket TGT dans le cache de session /tmp/krb5cc_<uid>."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect active ticket details and cipher suites with klist -e",
        "titleFr": "Inspecter les tickets actifs et algorithmes de chiffrement avec klist -e",
        "instruction": "Run klist with the encryption flag (-e) to display ticket details.",
        "instructionFr": "Lancez klist avec l'option -e pour afficher les tickets et chiffrements.",
        "hint": "klist -e",
        "hintFr": "klist -e",
        "expectedCommands": [
          "klist -e",
          "klist"
        ],
        "simulatedOutput": "Ticket cache: FILE:/tmp/krb5cc_1000\nDefault principal: admin@EXAMPLE.COM\n\nValid starting       Expires              Service principal\n09/16/2026 14:40:00  09/17/2026 00:40:00  krbtgt/EXAMPLE.COM@EXAMPLE.COM\n\tEtype (skey, tkt): aes256-cts-hmac-sha1-96, aes256-cts-hmac-sha1-96",
        "explanation": "klist -e verifies that modern secure ciphers (such as AES-256) are negotiated instead of obsolete RC4/DES.",
        "explanationFr": "klist -e certifie que le chiffrement AES-256 est bien négocié à la place d'anciens chiffrements dépréciés."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Destroy active Kerberos ticket cache",
        "titleFr": "Détruire le cache de tickets Kerberos",
        "instruction": "Run kdestroy to purge credentials from cache.",
        "instructionFr": "Exécutez kdestroy pour effacer les tickets en cache.",
        "hint": "kdestroy",
        "hintFr": "kdestroy",
        "expectedCommands": [
          "kdestroy"
        ],
        "simulatedOutput": "[OK] Kerberos credential cache destroyed.",
        "explanation": "kdestroy securely unlinks and overwrites the active credentials cache file.",
        "explanationFr": "kdestroy purge et détruit de façon sécurisée le fichier de cache de tickets de session."
      }
    ]
  },
  {
    "id": "lab-lpic3-06",
    "title": "X.509 Certificate Management & Private Key Generation",
    "titleFr": "Gestion des certificats X.509 & Génération de clés privées",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.1",
    "category": "Cryptography & PKI",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Generate an RSA 2048 private key and Certificate Signing Request (CSR) with openssl, and inspect certificate fields.",
    "goalFr": "Générer une clé privée RSA 2048 et une demande de signature CSR avec openssl, puis inspecter les champs.",
    "context": "A secure web portal requires a valid TLS certificate request containing SAN (Subject Alternative Names).",
    "contextFr": "Un portail web sécurisé exige une demande de signature CSR avec clé privée RSA dédiée.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Generate RSA private key and Certificate Signing Request (CSR)",
        "titleFr": "Générer la clé privée RSA et la demande CSR avec openssl",
        "instruction": "Run openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr.",
        "instructionFr": "Exécutez openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr.",
        "hint": "openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr",
        "hintFr": "openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr",
        "expectedCommands": [
          "openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr",
          "sudo openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr"
        ],
        "simulatedOutput": "Generating a 2048 bit RSA private key\nwriting new private key to '/etc/ssl/private/srv.key'\n-----\n[OK] CSR written to /etc/ssl/certs/srv.csr.",
        "explanation": "openssl req generates an unencrypted RSA private key (-nodes) and prepares a PKCS#10 CSR.",
        "explanationFr": "openssl req génère la clé RSA privée et produit la demande CSR (PKCS#10) à soumettre à l'autorité de certification."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect CSR contents and attributes with openssl req -text",
        "titleFr": "Inspecter les attributs de la CSR avec openssl req -text",
        "instruction": "Use openssl req -in /etc/ssl/certs/srv.csr -noout -text to view parsed fields.",
        "instructionFr": "Utilisez openssl req -in /etc/ssl/certs/srv.csr -noout -text pour examiner la CSR.",
        "hint": "openssl req -in /etc/ssl/certs/srv.csr -noout -text",
        "hintFr": "openssl req -in /etc/ssl/certs/srv.csr -noout -text",
        "expectedCommands": [
          "openssl req -in /etc/ssl/certs/srv.csr -noout -text",
          "openssl req -text -noout -in /etc/ssl/certs/srv.csr"
        ],
        "simulatedOutput": "Certificate Request:\n    Data:\n        Version: 1 (0x0)\n        Subject: CN = srv.example.com\n        Subject Public Key Info:\n            Public Key Algorithm: rsaEncryption\n                RSA Public-Key: (2048 bit)",
        "explanation": "openssl req -text decodes ASN.1 structures to verify Common Name, Organization, and Public Key parameters.",
        "explanationFr": "openssl req -text décode la structure ASN.1 pour contrôler le Common Name et la robustesse de la clé."
      }
    ]
  },
  {
    "id": "lab-lpic3-07",
    "title": "Block Device Encryption with LUKS2 & Cryptsetup",
    "titleFr": "Chiffrement de disque bloc avec LUKS2 & Cryptsetup",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.3",
    "category": "Data at Rest Encryption",
    "difficulty": "Advanced",
    "estimatedMinutes": 10,
    "goal": "Format a partition with LUKS2 using cryptsetup, open the encrypted mapping, and inspect cryptographic status.",
    "goalFr": "Formater une partition avec LUKS2 via cryptsetup, ouvrir le mapping chiffré et inspecter son statut.",
    "context": "A confidential database partition /dev/sdb1 must be fully encrypted at rest against disk theft.",
    "contextFr": "Une partition de base de données sensible (/dev/sdb1) doit être chiffrée avec LUKS2 pour prévenir tout vol physique.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Format partition with LUKS2 encryption",
        "titleFr": "Formater la partition avec le chiffrement LUKS2",
        "instruction": "Execute cryptsetup luksFormat --type luks2 /dev/sdb1.",
        "instructionFr": "Exécutez cryptsetup luksFormat --type luks2 /dev/sdb1.",
        "hint": "cryptsetup luksFormat --type luks2 /dev/sdb1",
        "hintFr": "cryptsetup luksFormat --type luks2 /dev/sdb1",
        "expectedCommands": [
          "cryptsetup luksFormat --type luks2 /dev/sdb1",
          "sudo cryptsetup luksFormat --type luks2 /dev/sdb1",
          "cryptsetup luksFormat /dev/sdb1",
          "sudo cryptsetup luksFormat /dev/sdb1"
        ],
        "simulatedOutput": "WARNING!\n========\nThis will overwrite data on /dev/sdb1 irrevocably.\nAre you sure? (Type 'yes' in capital letters): YES\nEnter passphrase for /dev/sdb1: \nVerify passphrase: \n[OK] LUKS2 header and keyslot 0 created successfully.",
        "explanation": "cryptsetup luksFormat initializes the on-disk LUKS2 header, sets PBKDF2/Argon2id keyslots, and formats metadata.",
        "explanationFr": "cryptsetup luksFormat installe l'en-tête LUKS2 et dérive la clé maîtresse à l'aide d'Argon2id."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Open encrypted LUKS container creating device mapper node",
        "titleFr": "Ouvrir le conteneur LUKS et créer le nœud device-mapper",
        "instruction": "Execute cryptsetup open /dev/sdb1 cryptdata.",
        "instructionFr": "Exécutez cryptsetup open /dev/sdb1 cryptdata.",
        "hint": "cryptsetup open /dev/sdb1 cryptdata",
        "hintFr": "cryptsetup open /dev/sdb1 cryptdata",
        "expectedCommands": [
          "cryptsetup open /dev/sdb1 cryptdata",
          "sudo cryptsetup open /dev/sdb1 cryptdata",
          "cryptsetup luksOpen /dev/sdb1 cryptdata",
          "sudo cryptsetup luksOpen /dev/sdb1 cryptdata"
        ],
        "simulatedOutput": "Enter passphrase for /dev/sdb1: \n[OK] Device mapper mapping created: /dev/mapper/cryptdata.",
        "explanation": "cryptsetup open unlocks the master volume key and creates an active dm-crypt virtual device.",
        "explanationFr": "cryptsetup open déchiffre la clé maîtresse et monte le périphérique virtuel déchiffré /dev/mapper/cryptdata."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect status and cipher parameters of active mapping",
        "titleFr": "Inspecter le statut et les algorithmes de chiffrement du mapping",
        "instruction": "Run cryptsetup status cryptdata.",
        "instructionFr": "Lancez cryptsetup status cryptdata.",
        "hint": "cryptsetup status cryptdata",
        "hintFr": "cryptsetup status cryptdata",
        "expectedCommands": [
          "cryptsetup status cryptdata",
          "sudo cryptsetup status cryptdata"
        ],
        "simulatedOutput": "/dev/mapper/cryptdata is active and is in use.\n  type:    LUKS2\n  cipher:  aes-xts-plain64\n  keysize: 512 bits\n  key location: keyring\n  device:  /dev/sdb1\n  sector size:  4096 bytes\n  mode:    read/write",
        "explanation": "cryptsetup status displays active cipher mode (AES-XTS), key length (512-bit), and underlying physical block device.",
        "explanationFr": "cryptsetup status confirme l'état opérationnel, l'algorithme (aes-xts) et la longueur de clé (512 bits)."
      }
    ]
  },
  {
    "id": "lab-lpic3-08",
    "title": "SELinux Policy Enforcement, Contexts & Booleans",
    "titleFr": "Application des politiques SELinux, Contextes & Booléens",
    "certification": "lpic-3",
    "topicNumber": 322,
    "objectiveId": "322.1",
    "category": "Mandatory Access Control (MAC)",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Check enforcement mode with getenforce, restore default filesystem security labels with restorecon, and toggle a boolean with setsebool.",
    "goalFr": "Contrôler le mode avec getenforce, restaurer les contextes de fichiers avec restorecon et basculer un booléen avec setsebool.",
    "context": "SELinux blocks web server network connections to backend database sockets. You must adjust contexts and policy booleans.",
    "contextFr": "SELinux bloque l'accès du serveur web aux connexions sortantes. Vous devez corriger les contextes et activer le booléen.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Query current SELinux operational mode",
        "titleFr": "Afficher le mode de fonctionnement courant de SELinux",
        "instruction": "Execute getenforce to check whether SELinux is Enforcing, Permissive, or Disabled.",
        "instructionFr": "Exécutez getenforce pour connaître le mode actif.",
        "hint": "getenforce",
        "hintFr": "getenforce",
        "expectedCommands": [
          "getenforce",
          "sudo getenforce",
          "sestatus"
        ],
        "simulatedOutput": "Enforcing",
        "explanation": "getenforce reads /sys/fs/selinux/enforce. 'Enforcing' actively denies actions violating loaded TE (Type Enforcement) policies.",
        "explanationFr": "getenforce vérifie si les politiques sont strictement appliquées (Enforcing) ou seulement tracées (Permissive)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Restore default SELinux file contexts recursively on /var/www/html",
        "titleFr": "Restaurer les contextes de sécurité par défaut sur /var/www/html",
        "instruction": "Run restorecon with -Rv on /var/www/html.",
        "instructionFr": "Lancez restorecon avec -Rv sur /var/www/html pour rétablir les étiquettes légitimes.",
        "hint": "restorecon -Rv /var/www/html",
        "hintFr": "restorecon -Rv /var/www/html",
        "expectedCommands": [
          "restorecon -Rv /var/www/html",
          "sudo restorecon -Rv /var/www/html",
          "restorecon -v -R /var/www/html"
        ],
        "simulatedOutput": "Relabeled /var/www/html/index.php from unconfined_u:object_r:user_home_t:s0 to system_u:object_r:httpd_sys_content_t:s0",
        "explanation": "restorecon queries the file context specifications database (/etc/selinux/targeted/contexts/files/) and resets extended xattr labels.",
        "explanationFr": "restorecon réinitialise les étiquettes de sécurité de l'inode conformément aux règles de la politique ciblée."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Enable persistent boolean allowing web server network connections",
        "titleFr": "Activer le booléen permanent autorisant les connexions réseau du serveur web",
        "instruction": "Use setsebool with -P to permanently enable httpd_can_network_connect.",
        "instructionFr": "Utilisez setsebool avec -P pour activer durablement httpd_can_network_connect.",
        "hint": "setsebool -P httpd_can_network_connect on",
        "hintFr": "setsebool -P httpd_can_network_connect on",
        "expectedCommands": [
          "setsebool -P httpd_can_network_connect on",
          "setsebool -P httpd_can_network_connect 1",
          "sudo setsebool -P httpd_can_network_connect on",
          "sudo setsebool -P httpd_can_network_connect 1"
        ],
        "simulatedOutput": "[OK] Boolean httpd_can_network_connect set to true in runtime and persistent policy store.",
        "explanation": "The -P flag writes the boolean state into the binary policy store on disk, ensuring survival across reboots.",
        "explanationFr": "L'option -P inscrit l'état du booléen dans la politique compilée sur disque pour persister au redémarrage."
      }
    ]
  },
  {
    "id": "lab-lpic3-09",
    "title": "Kernel Auditing Framework: Auditd Rules & Ausearch Analysis",
    "titleFr": "Cadre d'audit du noyau Linux : Règles Auditd & Analyse avec Ausearch",
    "certification": "lpic-3",
    "topicNumber": 323,
    "objectiveId": "323.1",
    "category": "System Auditing & Forensics",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Add a kernel file watch on /etc/shadow using auditctl, list loaded audit rules, and search audit logs with ausearch.",
    "goalFr": "Ajouter une surveillance noyau sur /etc/shadow avec auditctl, lister les règles et analyser les logs avec ausearch.",
    "context": "Compliance standards mandate real-time logging whenever password files are accessed or modified.",
    "contextFr": "Les normes de conformité exigent une traçabilité inviolable de tout accès ou modification de /etc/shadow.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Add kernel audit watch rule on /etc/shadow with key 'shadow_mod'",
        "titleFr": "Ajouter une règle de surveillance sur /etc/shadow avec la clé 'shadow_mod'",
        "instruction": "Execute auditctl to add a watch (-w /etc/shadow) on write and attribute changes (-p wa) with key (-k shadow_mod).",
        "instructionFr": "Exécutez auditctl pour surveiller -w /etc/shadow en écriture/attributs (-p wa) avec la clé -k shadow_mod.",
        "hint": "auditctl -w /etc/shadow -p wa -k shadow_mod",
        "hintFr": "auditctl -w /etc/shadow -p wa -k shadow_mod",
        "expectedCommands": [
          "auditctl -w /etc/shadow -p wa -k shadow_mod",
          "sudo auditctl -w /etc/shadow -p wa -k shadow_mod"
        ],
        "simulatedOutput": "[OK] Watch rule on /etc/shadow loaded into kernel audit subsystem.",
        "explanation": "auditctl injects filtering hooks directly into kernel system call dispatcher tables.",
        "explanationFr": "auditctl injecte la règle de capture directement dans les appels système du noyau Linux."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List all active kernel audit rules with auditctl -l",
        "titleFr": "Lister l'ensemble des règles d'audit actives avec auditctl -l",
        "instruction": "Run auditctl -l to verify installed rules.",
        "instructionFr": "Lancez auditctl -l pour contrôler les règles actuellement actives.",
        "hint": "auditctl -l",
        "hintFr": "auditctl -l",
        "expectedCommands": [
          "auditctl -l",
          "sudo auditctl -l"
        ],
        "simulatedOutput": "-w /etc/shadow -p wa -k shadow_mod",
        "explanation": "auditctl -l queries the audit netlink socket to display kernel audit filters currently in memory.",
        "explanationFr": "auditctl -l interroge le sous-système netlink pour afficher les règles d'audit en mémoire."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Search audit logs for events tagged with key 'shadow_mod'",
        "titleFr": "Rechercher les événements d'audit enregistrés sous la clé 'shadow_mod'",
        "instruction": "Execute ausearch with -k shadow_mod to inspect recorded audit events.",
        "instructionFr": "Exécutez ausearch avec -k shadow_mod pour consulter les événements enregistrés.",
        "hint": "ausearch -k shadow_mod",
        "hintFr": "ausearch -k shadow_mod",
        "expectedCommands": [
          "ausearch -k shadow_mod",
          "sudo ausearch -k shadow_mod",
          "ausearch -k shadow_mod --raw"
        ],
        "simulatedOutput": "----\ntime->Wed Sep 16 14:48:12 2026\ntype=SYSCALL msg=audit(1789570092.102:402): arch=c000003e syscall=257 success=yes exit=3 a0=ffffff9c a1=7ffd9421 a2=2 a3=0 items=1 ppid=1201 pid=2910 auid=1000 uid=0 gid=0 euid=0 exe=\"/usr/sbin/passwd\" key=\"shadow_mod\"",
        "explanation": "ausearch parses /var/log/audit/audit.log, correlating multi-line SYSCALL, CWD, and PATH records by event ID.",
        "explanationFr": "ausearch décode les enregistrements de /var/log/audit/audit.log en reliant l'UID réel et le binaire exécuté."
      }
    ]
  },
  {
    "id": "lab-lpic3-10",
    "title": "StrongSwan IKEv2 IPsec VPN Tunnel Management",
    "titleFr": "Gestion d'un tunnel VPN IPsec IKEv2 avec StrongSwan",
    "certification": "lpic-3",
    "topicNumber": 324,
    "objectiveId": "324.1",
    "category": "VPN & Encrypted Channels",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Load strongSwan configuration with swanctl --load-all, initiate child SA tunnel, and verify established Security Associations with swanctl --list-sas.",
    "goalFr": "Charger la configuration strongSwan avec swanctl --load-all, initier le tunnel et vérifier les associations de sécurité (SA).",
    "context": "A site-to-site IPsec tunnel links our headquarters to a cloud datacenter. You must control the tunnel using modern swanctl.",
    "contextFr": "Un tunnel IPsec relie deux sites. Vous devez piloter et vérifier l'association de sécurité IKEv2 avec swanctl.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Load all swanctl connections and credentials into charon daemon",
        "titleFr": "Charger les connexions et identifiants swanctl dans charon",
        "instruction": "Execute swanctl with --load-all.",
        "instructionFr": "Exécutez swanctl avec --load-all pour recharger la configuration.",
        "hint": "swanctl --load-all",
        "hintFr": "swanctl --load-all",
        "expectedCommands": [
          "swanctl --load-all",
          "sudo swanctl --load-all",
          "swanctl -q"
        ],
        "simulatedOutput": "loaded pool 'ipv4' (0 pools loaded)\nloaded connection 'net-to-net'\nsuccessfully loaded 1 connections, 0 pools, 1 authorities, 1 secrets",
        "explanation": "swanctl --load-all reads /etc/swanctl/swanctl.conf and communicates with the charon daemon via vici interface.",
        "explanationFr": "swanctl communique avec charon via le protocole VICI pour charger connexions et clés pré-partagées."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Initiate child IPsec Security Association for connection 'net-to-net'",
        "titleFr": "Initier l'association de sécurité IPsec enfant pour 'net-to-net'",
        "instruction": "Run swanctl --initiate --child net-to-net.",
        "instructionFr": "Lancez swanctl --initiate --child net-to-net.",
        "hint": "swanctl --initiate --child net-to-net",
        "hintFr": "swanctl --initiate --child net-to-net",
        "expectedCommands": [
          "swanctl --initiate --child net-to-net",
          "sudo swanctl --initiate --child net-to-net",
          "swanctl -i -c net-to-net"
        ],
        "simulatedOutput": "[IKE] initiating IKE_SA net-to-net[1] to 198.51.100.1\n[IKE] established IKE_SA net-to-net[1] between 203.0.113.2...198.51.100.1\n[IKE] IKE_SA net-to-net[1] state change: CONNECTING => ESTABLISHED\n[CHILD_SA] child 'net-to-net' established",
        "explanation": "swanctl --initiate performs IKEv2 Diffie-Hellman key exchange and installs kernel XFRM IPsec states.",
        "explanationFr": "swanctl effectue l'échange de clés IKEv2 et insère les règles de chiffrement XFRM dans le noyau."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "List established Security Associations (SAs) with swanctl --list-sas",
        "titleFr": "Lister les associations de sécurité (SA) actives avec swanctl --list-sas",
        "instruction": "Execute swanctl --list-sas to verify active encryption and lifetime.",
        "instructionFr": "Exécutez swanctl --list-sas pour vérifier le tunnel et les compteurs d'octets.",
        "hint": "swanctl --list-sas",
        "hintFr": "swanctl --list-sas",
        "expectedCommands": [
          "swanctl --list-sas",
          "sudo swanctl --list-sas",
          "swanctl -l"
        ],
        "simulatedOutput": "net-to-net: #1, ESTABLISHED, IKEv2, 7a82b9e102_i* 99fa021cb8_r\n  local  '203.0.113.2' @ 203.0.113.2[500]\n  remote '198.51.100.1' @ 198.51.100.1[500]\n  AES_CBC_256/HMAC_SHA2_256_128/PRF_HMAC_SHA2_256/MODP_2048\n  net-to-net: #1, reqid 1, INSTALLED, TUNNEL, ESP:AES_GCM_16_256\n    installed 12s ago, rekeying in 3588s\n    in  c1092ab8,    840 bytes,    10 pkts\n    out c2098ba1,    840 bytes,    10 pkts",
        "explanation": "swanctl --list-sas outputs negotiated crypto algorithms, ESP encapsulation mode, and transmission statistics.",
        "explanationFr": "swanctl --list-sas expose les algorithmes négociés (AES-GCM), le mode tunnel et le volume de paquets chiffrés."
      }
    ]
  },
  {
    "id": "lab-lpic3-11",
    "title": "KVM Hypervisor Hardware Virtualization & Module Verification",
    "titleFr": "Hyperviseur KVM : Virtualisation matérielle & Modules noyau",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.1",
    "category": "KVM Virtualization",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Verify Intel VT-x/AMD-V hardware virtualization CPU extensions with kvm-ok or lscpu, and inspect loaded KVM kernel modules.",
    "goalFr": "Vérifier le support VT-x/AMD-V du processeur avec kvm-ok ou lscpu et inspecter les modules noyau KVM.",
    "context": "Before deploying enterprise virtual machines, you must certify that the hardware supports accelerated KVM virtualization.",
    "contextFr": "Avant d'installer des machines virtuelles, vous devez valider la compatibilité des extensions processeur.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Check hardware virtualization capability using kvm-ok (or lscpu)",
        "titleFr": "Tester le support matériel de la virtualisation avec kvm-ok (ou lscpu)",
        "instruction": "Run kvm-ok to test if hardware virtualization is supported and enabled in BIOS/UEFI.",
        "instructionFr": "Lancez kvm-ok pour vérifier si la virtualisation matérielle est disponible et activée.",
        "hint": "kvm-ok",
        "hintFr": "kvm-ok",
        "expectedCommands": [
          "kvm-ok",
          "sudo kvm-ok",
          "lscpu | grep -i Virtualization",
          "egrep -c '(vmx|svm)' /proc/cpuinfo"
        ],
        "simulatedOutput": "INFO: /dev/kvm exists\nKVM acceleration can be used",
        "explanation": "kvm-ok probes the MSR registers for VMX (Intel) or SVM (AMD) instruction set extensions.",
        "explanationFr": "kvm-ok interroge les drapeaux processeur pour confirmer la présence de VMX (Intel) ou SVM (AMD)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Confirm loaded KVM kernel accelerator drivers with lsmod",
        "titleFr": "Confirmer les modules accélérateurs KVM chargés avec lsmod",
        "instruction": "Execute lsmod filtering for 'kvm'.",
        "instructionFr": "Exécutez lsmod en filtrant sur 'kvm'.",
        "hint": "lsmod | grep kvm",
        "hintFr": "lsmod | grep kvm",
        "expectedCommands": [
          "lsmod | grep kvm",
          "sudo lsmod | grep kvm"
        ],
        "simulatedOutput": "kvm_intel             385024  0\nkvm                  1105920  1 kvm_intel\nirqbypass              16384  1 kvm",
        "explanation": "kvm and kvm_intel/kvm_amd provide the kernel execution engine that transforms the Linux kernel into a Type-1 hypervisor.",
        "explanationFr": "kvm_intel/kvm_amd exposent le pilote /dev/kvm permettant l'exécution native des VM sur le CPU."
      }
    ]
  },
  {
    "id": "lab-lpic3-12",
    "title": "Libvirt VM Management & Live Snapshots with Virsh",
    "titleFr": "Gestion des VM Libvirt & Snapshots avec Virsh",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.2",
    "category": "KVM Virtualization",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "List virtual machines with virsh list --all, start a guest VM, create a point-in-time snapshot, and inspect domain info.",
    "goalFr": "Lister les VM avec virsh list --all, démarrer une VM, créer un snapshot et inspecter ses ressources.",
    "context": "A production database guest 'db-prod' must be backed up via a consistent storage snapshot before applying patches.",
    "contextFr": "Une machine virtuelle 'db-prod' doit faire l'objet d'un snapshot avant une mise à jour système.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List all registered libvirt domains (running and stopped)",
        "titleFr": "Lister tous les domaines libvirt enregistrés avec virsh list --all",
        "instruction": "Execute virsh list --all to view domain states.",
        "instructionFr": "Exécutez virsh list --all pour afficher l'ensemble des machines virtuelles.",
        "hint": "virsh list --all",
        "hintFr": "virsh list --all",
        "expectedCommands": [
          "virsh list --all",
          "sudo virsh list --all"
        ],
        "simulatedOutput": " Id   Name      State\n-------------------------\n 1    web-app   running\n -    db-prod   shut off",
        "explanation": "virsh communicates with libvirtd daemon via RPC to control QEMU/KVM virtual machine instances.",
        "explanationFr": "virsh communique avec le démon libvirtd pour superviser et piloter le cycle de vie des invités QEMU/KVM."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Start guest domain db-prod with virsh",
        "titleFr": "Démarrer le domaine invité db-prod avec virsh",
        "instruction": "Run virsh start db-prod.",
        "instructionFr": "Lancez virsh start db-prod pour démarrer la machine.",
        "hint": "virsh start db-prod",
        "hintFr": "virsh start db-prod",
        "expectedCommands": [
          "virsh start db-prod",
          "sudo virsh start db-prod"
        ],
        "simulatedOutput": "Domain 'db-prod' started",
        "explanation": "virsh start launches the QEMU process with CPU, disk, memory, and network parameters configured in domain XML.",
        "explanationFr": "virsh start instancie le processus QEMU en attachant les ressources allouées dans la définition XML."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Create a live snapshot for db-prod with snapshot-create-as",
        "titleFr": "Créer un snapshot pour db-prod avec snapshot-create-as",
        "instruction": "Execute virsh snapshot-create-as db-prod snap_prepatch 'Pre-patch backup snapshot'.",
        "instructionFr": "Exécutez virsh snapshot-create-as db-prod snap_prepatch 'Pre-patch backup snapshot'.",
        "hint": "virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
        "hintFr": "virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
        "expectedCommands": [
          "virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
          "virsh snapshot-create-as db-prod snap_prepatch 'Pre-patch backup snapshot'",
          "sudo virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
          "virsh snapshot-create-as db-prod snap_prepatch"
        ],
        "simulatedOutput": "Domain snapshot snap_prepatch created",
        "explanation": "virsh snapshot-create-as captures disk delta state (qcow2 internal or external overlays) for point-in-time recovery.",
        "explanationFr": "snapshot-create-as fige l'état de la machine dans l'image qcow2 pour permettre un retour arrière instantané."
      }
    ]
  },
  {
    "id": "lab-lpic3-13",
    "title": "Rootless Container Lifecycle Management with Podman",
    "titleFr": "Cycle de vie des conteneurs Rootless avec Podman",
    "certification": "lpic-3",
    "topicNumber": 352,
    "objectiveId": "352.1",
    "category": "Container Management",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Run a rootless nginx container on port 8080 with podman run, check container status with podman ps, and inspect container logs.",
    "goalFr": "Lancer un conteneur rootless nginx sur le port 8080, vérifier avec podman ps et afficher les logs.",
    "context": "Modern enterprise environments ban root-owned container daemons. You must manage rootless containers via Podman.",
    "contextFr": "Les conteneurs doivent s'exécuter sans privilèges root. Vous devez piloter un conteneur avec Podman.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Run a detached rootless Nginx container publishing port 8080",
        "titleFr": "Démarrer un conteneur Nginx rootless détaché publiant le port 8080",
        "instruction": "Run podman run -d --name web -p 8080:80 nginx:alpine.",
        "instructionFr": "Lancez podman run -d --name web -p 8080:80 nginx:alpine.",
        "hint": "podman run -d --name web -p 8080:80 nginx:alpine",
        "hintFr": "podman run -d --name web -p 8080:80 nginx:alpine",
        "expectedCommands": [
          "podman run -d --name web -p 8080:80 nginx:alpine",
          "podman run -d --name web -p 8080:80 docker.io/library/nginx:alpine"
        ],
        "simulatedOutput": "Trying to pull docker.io/library/nginx:alpine...\nGetting image source signatures\nCopying blob 43c622d120f4 done\nCopying config 9fa1c20e10 done\nWriting manifest to image destination\n84a102bc4910298a0912f90123b09210a48b9102c918a2048f0291ba019283f1",
        "explanation": "Podman uses user namespaces (subuid/subgid) and slirp4netns/pasta to run fully unprivileged rootless containers without a daemon.",
        "explanationFr": "Podman s'exécute sans démon centralisé via les namespaces utilisateurs du noyau (subuid/subgid)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List running containers with podman ps",
        "titleFr": "Lister les conteneurs actifs avec podman ps",
        "instruction": "Execute podman ps to verify port mappings and uptime.",
        "instructionFr": "Exécutez podman ps pour contrôler les ports publiés et l'état du conteneur.",
        "hint": "podman ps",
        "hintFr": "podman ps",
        "expectedCommands": [
          "podman ps",
          "podman container ls"
        ],
        "simulatedOutput": "CONTAINER ID  IMAGE                           COMMAND               CREATED        STATUS        PORTS                 NAMES\n84a102bc4910  docker.io/library/nginx:alpine  nginx -g 'daemon o... 10 seconds ago Up 10 seconds 0.0.0.0:8080->80/tcp  web",
        "explanation": "podman ps queries the local sqlite/storage graph to report active container cgroups and network forwardings.",
        "explanationFr": "podman ps affiche l'identifiant, l'image source, les ports mappés et le statut du conteneur."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect container stdout logs with podman logs",
        "titleFr": "Afficher les logs standard du conteneur avec podman logs",
        "instruction": "Run podman logs web to check server initialization.",
        "instructionFr": "Lancez podman logs web pour visualiser les logs d'initialisation du serveur web.",
        "hint": "podman logs web",
        "hintFr": "podman logs web",
        "expectedCommands": [
          "podman logs web"
        ],
        "simulatedOutput": "/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration\n/docker-entrypoint.sh: Configuration complete; ready for start up\n2026/09/16 14:55:00 [notice] 1#1: using the \"epoll\" event method\n2026/09/16 14:55:00 [notice] 1#1: nginx/1.25.5\n2026/09/16 14:55:00 [notice] 1#1: start worker processes",
        "explanation": "podman logs retrieves console output redirected through the crun/runc log driver.",
        "explanationFr": "podman logs extrait les flux stdout/stderr enregistrés par le moteur d'exécution crun/runc."
      }
    ]
  },
  {
    "id": "lab-lpic3-14",
    "title": "Cloud-Init Instance Bootstrapping & Metadata Validation",
    "titleFr": "Initialisation d'instances Cloud-Init & Audit des métadonnées",
    "certification": "lpic-3",
    "topicNumber": 353,
    "objectiveId": "353.2",
    "category": "Cloud Orchestration",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Verify cloud-init execution status with cloud-init status, query instance metadata with cloud-init query, and inspect output logs.",
    "goalFr": "Contrôler le statut avec cloud-init status, interroger les métadonnées avec cloud-init query et inspecter les logs d'exécution.",
    "context": "A newly provisioned cloud instance executes user-data scripts. You must verify that bootstrapping finalized successfully.",
    "contextFr": "Une instance cloud exécute un script user-data. Vous devez vous assurer que le provisioning s'est achevé sans erreur.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Check cloud-init completion status",
        "titleFr": "Vérifier le statut d'achèvement de cloud-init",
        "instruction": "Execute cloud-init status to check if all bootstrap modules completed.",
        "instructionFr": "Exécutez cloud-init status pour vérifier la fin de l'initialisation.",
        "hint": "cloud-init status",
        "hintFr": "cloud-init status",
        "expectedCommands": [
          "cloud-init status",
          "cloud-init status --wait",
          "sudo cloud-init status"
        ],
        "simulatedOutput": "status: done",
        "explanation": "cloud-init status confirms that generator, network, config, and final stage execution phases succeeded.",
        "explanationFr": "cloud-init status confirme le succès des différentes étapes (local, network, config, final)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query cloud instance ID using cloud-init query",
        "titleFr": "Interroger l'identifiant d'instance avec cloud-init query",
        "instruction": "Run cloud-init query instance_id.",
        "instructionFr": "Lancez cloud-init query instance_id pour extraire l'ID fourni par le fournisseur cloud.",
        "hint": "cloud-init query instance_id",
        "hintFr": "cloud-init query instance_id",
        "expectedCommands": [
          "cloud-init query instance_id",
          "cloud-init query ds.meta_data.instance_id"
        ],
        "simulatedOutput": "i-09f18a204b12",
        "explanation": "cloud-init query reads normalized metadata from the active datasource cache (/run/cloud-init/instance-data.json).",
        "explanationFr": "cloud-init query extrait les attributs normalisés depuis le cache de la datasource."
      }
    ]
  },
  {
    "id": "lab-lpic3-15",
    "title": "Kubernetes Workload Rolling Updates & Inspection with Kubectl",
    "titleFr": "Mises à jour progressives (Rolling Update) Kubernetes avec Kubectl",
    "certification": "lpic-3",
    "topicNumber": 354,
    "objectiveId": "354.1",
    "category": "Kubernetes Clusters",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "List cluster nodes with kubectl get nodes, inspect pods, trigger a zero-downtime rolling restart, and track rollout status.",
    "goalFr": "Lister les nœuds du cluster avec kubectl get nodes, redémarrer un déploiement et suivre l'avancement du rollout.",
    "context": "A containerized microservice deployment 'webapp' must be redeployed with zero downtime across the cluster.",
    "contextFr": "Le déploiement 'webapp' doit être redémarré en rolling update sans interruption de service.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Inspect cluster node status with kubectl",
        "titleFr": "Inspecter l'état des nœuds du cluster avec kubectl",
        "instruction": "Execute kubectl get nodes to verify node readiness.",
        "instructionFr": "Exécutez kubectl get nodes pour vérifier l'état des nœuds.",
        "hint": "kubectl get nodes",
        "hintFr": "kubectl get nodes",
        "expectedCommands": [
          "kubectl get nodes",
          "kubectl get no"
        ],
        "simulatedOutput": "NAME       STATUS   ROLES           AGE   VERSION\nk8s-cp-1   Ready    control-plane   45d   v1.30.2\nk8s-wk-1   Ready    <none>          45d   v1.30.2\nk8s-wk-2   Ready    <none>          45d   v1.30.2",
        "explanation": "kubectl get nodes contacts the kube-apiserver and confirms all node kubelets report Healthy/Ready state.",
        "explanationFr": "kubectl get nodes interroge le serveur d'API pour s'assurer que les agents kubelet sont opérationnels."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Trigger a rolling restart of deployment/webapp",
        "titleFr": "Déclencher un redémarrage progressif du déploiement webapp",
        "instruction": "Run kubectl rollout restart deployment/webapp.",
        "instructionFr": "Lancez kubectl rollout restart deployment/webapp.",
        "hint": "kubectl rollout restart deployment/webapp",
        "hintFr": "kubectl rollout restart deployment/webapp",
        "expectedCommands": [
          "kubectl rollout restart deployment/webapp",
          "kubectl rollout restart deploy/webapp",
          "kubectl rollout restart deployment webapp"
        ],
        "simulatedOutput": "deployment.apps/webapp restarted",
        "explanation": "kubectl rollout restart injects a timestamp annotation in pod template metadata, triggering a rolling update.",
        "explanationFr": "kubectl rollout restart force la recréation ordonnée des pods via le contrôleur de déploiement."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Monitor rollout progression until all pods are replaced",
        "titleFr": "Suivre la progression du déploiement avec rollout status",
        "instruction": "Execute kubectl rollout status deployment/webapp.",
        "instructionFr": "Exécutez kubectl rollout status deployment/webapp pour attendre la stabilisation.",
        "hint": "kubectl rollout status deployment/webapp",
        "hintFr": "kubectl rollout status deployment/webapp",
        "expectedCommands": [
          "kubectl rollout status deployment/webapp",
          "kubectl rollout status deploy/webapp"
        ],
        "simulatedOutput": "Waiting for deployment \"webapp\" rollout to finish: 1 out of 3 new replicas have been updated...\nWaiting for deployment \"webapp\" rollout to finish: 2 out of 3 new replicas have been updated...\nWaiting for deployment \"webapp\" rollout to finish: 1 old replicas are pending termination...\ndeployment \"webapp\" successfully rolled out",
        "explanation": "rollout status watches replica sets ensuring readiness probes pass before terminating old pods.",
        "explanationFr": "rollout status surveille le remplacement des réplicas et valide les sondes de disponibilité (readiness probes)."
      }
    ]
  },
  {
    "id": "lab-lpic3-16",
    "title": "Pacemaker & Corosync High Availability Cluster Health Inspection",
    "titleFr": "Contrôle de santé d'un cluster Pacemaker & Corosync haute disponibilité",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.1",
    "category": "HA Clustering",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Inspect cluster quorum with corosync-cfgtool -s, check resource status with crm_mon -1, and verify pcs status.",
    "goalFr": "Vérifier le quorum Corosync avec corosync-cfgtool -s et inspecter l'état des ressources avec crm_mon -1.",
    "context": "A 2-node HA cluster manages database failover. You must audit cluster quorum, messaging rings, and active resources.",
    "contextFr": "Un cluster 2 nœuds gère le basculement d'une base de données. Vous devez auditer le quorum et les ressources.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Verify Corosync communication ring health with corosync-cfgtool",
        "titleFr": "Vérifier l'anneau de communication Corosync avec corosync-cfgtool",
        "instruction": "Execute corosync-cfgtool -s to verify messaging link status.",
        "instructionFr": "Exécutez corosync-cfgtool -s pour valider l'anneau de communication réseau.",
        "hint": "corosync-cfgtool -s",
        "hintFr": "corosync-cfgtool -s",
        "expectedCommands": [
          "corosync-cfgtool -s",
          "sudo corosync-cfgtool -s"
        ],
        "simulatedOutput": "Printing ring status.\nLocal node ID 1\nRING ID 0\n\tid\t= 192.168.10.1\n\tstatus\t= ring 0 active with no faults",
        "explanation": "corosync-cfgtool queries the Kronosnet/Totem communication engine to verify heartbeat ring continuity.",
        "explanationFr": "corosync-cfgtool valide l'intégrité de l'anneau de heartbeat du protocole Totem entre les nœuds."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query one-shot cluster status with crm_mon -1",
        "titleFr": "Afficher l'état du cluster Pacemaker avec crm_mon -1",
        "instruction": "Run crm_mon -1 to output node membership and resource allocation snapshot.",
        "instructionFr": "Lancez crm_mon -1 pour afficher un cliché instantané des nœuds et des ressources.",
        "hint": "crm_mon -1",
        "hintFr": "crm_mon -1",
        "expectedCommands": [
          "crm_mon -1",
          "sudo crm_mon -1",
          "pcs status",
          "sudo pcs status"
        ],
        "simulatedOutput": "Cluster Summary:\n  * Stack: corosync\n  * Current DC: node1 (version 2.1.6-1) - partition with quorum\n  * Last updated: Wed Sep 16 15:02:11 2026\n  * 2 nodes configured\n  * 2 resource instances configured\n\nNode List:\n  * Online: [ node1 node2 ]\n\nFull List of Resources:\n  * VirtualIP\t(ocf::heartbeat:IPaddr2):\tStarted node1\n  * DatabaseService\t(systemd:mariadb):\tStarted node1",
        "explanation": "crm_mon -1 communicates with Pacemaker cib/crmd daemons, reporting the Designated Coordinator (DC) and active resource nodes.",
        "explanationFr": "crm_mon -1 affiche l'état global : nœud coordinateur (DC), quorum et nœuds hébergeant les ressources."
      }
    ]
  },
  {
    "id": "lab-lpic3-17",
    "title": "Pacemaker Virtual IP Resource & Colocation Constraints",
    "titleFr": "Ressource IP Virtuelle Pacemaker & Contraintes de colocalisation",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.3",
    "category": "HA Clustering",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Create a VirtualIP resource using pcs, enforce colocation constraint with database service, and verify active constraints.",
    "goalFr": "Créer une ressource IP Virtuelle avec pcs, forcer la colocalisation avec la base de données et vérifier les contraintes.",
    "context": "The virtual service IP 192.168.1.200 must strictly reside on the exact same cluster node as the database daemon.",
    "contextFr": "L'adresse IP virtuelle 192.168.1.200 doit obligatoirement résider sur le même nœud que le service de base de données.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Create VirtualIP resource with OCF IPaddr2 resource agent",
        "titleFr": "Créer la ressource VirtualIP avec l'agent OCF IPaddr2",
        "instruction": "Execute pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s.",
        "instructionFr": "Exécutez pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s.",
        "hint": "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
        "hintFr": "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
        "expectedCommands": [
          "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
          "sudo pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
          "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24"
        ],
        "simulatedOutput": "[OK] Resource 'VirtualIP' created and registered in cluster CIB.",
        "explanation": "OCF (Open Cluster Framework) agents provide robust start, stop, and recurrent health monitoring operations.",
        "explanationFr": "Les agents OCF standardisent les opérations de démarrage, d'arrêt et de surveillance périodique."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Add strict colocation constraint between DatabaseService and VirtualIP",
        "titleFr": "Ajouter une contrainte de colocalisation stricte entre DatabaseService et VirtualIP",
        "instruction": "Execute pcs constraint colocation add DatabaseService with VirtualIP INFINITY.",
        "instructionFr": "Exécutez pcs constraint colocation add DatabaseService with VirtualIP INFINITY.",
        "hint": "pcs constraint colocation add DatabaseService with VirtualIP INFINITY",
        "hintFr": "pcs constraint colocation add DatabaseService with VirtualIP INFINITY",
        "expectedCommands": [
          "pcs constraint colocation add DatabaseService with VirtualIP INFINITY",
          "sudo pcs constraint colocation add DatabaseService with VirtualIP INFINITY"
        ],
        "simulatedOutput": "[OK] Colocation constraint added with score INFINITY.",
        "explanation": "Score INFINITY mandates that DatabaseService can only run on the node currently hosting VirtualIP.",
        "explanationFr": "Le score INFINITY impose au gestionnaire de placer la ressource sur le même nœud physique."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Display all configured cluster constraints with pcs constraint show",
        "titleFr": "Afficher les contraintes du cluster avec pcs constraint show",
        "instruction": "Run pcs constraint show to verify active ordering and colocation rules.",
        "instructionFr": "Lancez pcs constraint show pour vérifier les règles actives.",
        "hint": "pcs constraint show",
        "hintFr": "pcs constraint show",
        "expectedCommands": [
          "pcs constraint show",
          "sudo pcs constraint show",
          "pcs constraint"
        ],
        "simulatedOutput": "Location Constraints:\nOrdering Constraints:\nColocation Constraints:\n  DatabaseService with VirtualIP (score:INFINITY)",
        "explanation": "pcs constraint show parses the CIB XML to list location, ordering, and colocation rules governing scheduler placement.",
        "explanationFr": "pcs constraint show liste les règles gouvernant le placement et l'ordre de démarrage des services."
      }
    ]
  },
  {
    "id": "lab-lpic3-18",
    "title": "DRBD 9 Replicated Block Storage Synchronization & Promotion",
    "titleFr": "Synchronisation & Promotion du stockage répliqué DRBD 9",
    "certification": "lpic-3",
    "topicNumber": 362,
    "objectiveId": "362.1",
    "category": "Replicated Storage",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Check DRBD resource replication state with drbdadm status, promote resource r0 to Primary, and inspect /proc/drbd.",
    "goalFr": "Consulter l'état de réplication DRBD avec drbdadm status, promouvoir r0 en Primaire et inspecter /proc/drbd.",
    "context": "A shared storage block device is synchronized over 10GbE network using DRBD 9. You must verify synchronous replication (Protocol C).",
    "contextFr": "Un périphérique bloc est répliqué sur le réseau avec DRBD 9. Vous devez vérifier la synchronisation et promouvoir le nœud.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Inspect replication status for DRBD resource r0",
        "titleFr": "Consulter l'état de réplication de la ressource DRBD r0",
        "instruction": "Execute drbdadm status r0.",
        "instructionFr": "Exécutez drbdadm status r0.",
        "hint": "drbdadm status r0",
        "hintFr": "drbdadm status r0",
        "expectedCommands": [
          "drbdadm status r0",
          "sudo drbdadm status r0",
          "drbdadm status"
        ],
        "simulatedOutput": "r0 role:Secondary\n  disk:UpToDate\n  node2 role:Secondary\n    peer-disk:UpToDate",
        "explanation": "drbdadm status shows local and peer roles (Primary/Secondary) and block synchronization flags (UpToDate).",
        "explanationFr": "drbdadm status expose les rôles de chaque nœud et certifie la cohérence des blocs (UpToDate)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Promote local node to Primary role for resource r0",
        "titleFr": "Promouvoir le nœud local au rôle Primaire pour r0",
        "instruction": "Run drbdadm primary r0.",
        "instructionFr": "Lancez drbdadm primary r0 pour autoriser le montage en lecture-écriture.",
        "hint": "drbdadm primary r0",
        "hintFr": "drbdadm primary r0",
        "expectedCommands": [
          "drbdadm primary r0",
          "sudo drbdadm primary r0"
        ],
        "simulatedOutput": "[OK] Resource 'r0' promoted to Primary role on local node.",
        "explanation": "In single-primary mode, only the Primary node can open the /dev/drbdX block device for read/write mounting.",
        "explanationFr": "Le passage en rôle Primaire autorise l'accès en lecture/écriture au disque bloc /dev/drbd0."
      }
    ]
  },
  {
    "id": "lab-lpic3-19",
    "title": "Ceph Distributed Storage Cluster Health & OSD Pool Management",
    "titleFr": "Cluster de stockage distribué Ceph & Gestion des pools OSD",
    "certification": "lpic-3",
    "topicNumber": 363,
    "objectiveId": "363.1",
    "category": "Distributed Storage",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Query Ceph cluster health with ceph health detail, list OSD status with ceph osd status, and inspect pool capacity with ceph df.",
    "goalFr": "Consulter l'état de santé Ceph avec ceph health detail, vérifier les OSD avec ceph osd status et afficher la capacité avec ceph df.",
    "context": "An enterprise Ceph cluster provides RADOS block devices (RBD). You must inspect cluster placement groups and daemon availability.",
    "contextFr": "Un cluster Ceph héberge les volumes de virtualisation. Vous devez vérifier l'état des OSD et des groupes de placement (PG).",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Query detailed cluster health with ceph health detail",
        "titleFr": "Consulter l'état de santé détaillé du cluster Ceph",
        "instruction": "Execute ceph health detail.",
        "instructionFr": "Exécutez ceph health detail pour vérifier les alertes du cluster.",
        "hint": "ceph health detail",
        "hintFr": "ceph health detail",
        "expectedCommands": [
          "ceph health detail",
          "sudo ceph health detail",
          "ceph status",
          "ceph -s"
        ],
        "simulatedOutput": "HEALTH_OK",
        "explanation": "ceph health detail contacts Ceph Monitors (MONs) to verify placement groups (PGs), OSD heartbeats, and crush rules.",
        "explanationFr": "ceph health detail contacte les MONs pour certifier que tous les PGs sont 'active+clean'."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect OSD daemon operational states with ceph osd status",
        "titleFr": "Vérifier le statut des démons OSD avec ceph osd status",
        "instruction": "Run ceph osd status to view OSDs, weights, and latency.",
        "instructionFr": "Lancez ceph osd status pour auditer les disques de stockage OSD.",
        "hint": "ceph osd status",
        "hintFr": "ceph osd status",
        "expectedCommands": [
          "ceph osd status",
          "sudo ceph osd status",
          "ceph osd tree"
        ],
        "simulatedOutput": "+----+---------------+-------+-------+--------+---------+--------+---------+-----------+\n| id |     host      |  used | avail | wr ops | wr data | rd ops | rd data |   state   |\n+----+---------------+-------+-------+--------+---------+--------+---------+-----------+\n| 0  | ceph-node01   | 45.2G |  954G |    12  |   412k  |    42  |  1.2M   | exists,up |\n| 1  | ceph-node02   | 45.1G |  954G |    12  |   412k  |    38  |  1.1M   | exists,up |\n| 2  | ceph-node03   | 45.3G |  954G |    12  |   412k  |    40  |  1.1M   | exists,up |\n+----+---------------+-------+-------+--------+---------+--------+---------+-----------+",
        "explanation": "ceph osd status displays which storage daemons are 'up' (running) and 'in' (participating in CRUSH map placement).",
        "explanationFr": "ceph osd status confirme que tous les disques sont 'up' et intégrés dans la carte de distribution CRUSH."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect storage pool utilization with ceph df",
        "titleFr": "Inspecter l'occupation des pools de stockage avec ceph df",
        "instruction": "Execute ceph df to display raw and pool-level capacity.",
        "instructionFr": "Exécutez ceph df pour afficher l'espace disque disponible et alloué.",
        "hint": "ceph df",
        "hintFr": "ceph df",
        "expectedCommands": [
          "ceph df",
          "sudo ceph df"
        ],
        "simulatedOutput": "RAW STORAGE:\n    CLASS     SIZE        AVAIL       USED        RAW USED     %RAW USED\n    hdd       2.8 TiB     2.7 TiB     135 GiB      135 GiB          4.70\n    TOTAL     2.8 TiB     2.7 TiB     135 GiB      135 GiB          4.70\n\nPOOLS:\n    POOL       ID     STORED      OBJECTS     USED        %USED     MAX AVAIL\n    rbd_data    1     45 GiB       11520      135 GiB      1.57       880 GiB",
        "explanation": "ceph df calculates total raw bytes vs usable pool space factoring in 3x replication factor overhead.",
        "explanationFr": "ceph df décompte l'espace brut et utile en intégrant le facteur de réplication triple (3x)."
      }
    ]
  },
  {
    "id": "lab-lpic3-20",
    "title": "HAProxy High Availability Load Balancer & Socket Runtime Control",
    "titleFr": "Répartiteur de charge HAProxy & Contrôle dynamique par socket UNIX",
    "certification": "lpic-3",
    "topicNumber": 364,
    "objectiveId": "364.1",
    "category": "Load Balancing",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Test HAProxy configuration syntax with haproxy -c, interact with stats socket using socat, and disable an upstream server for maintenance.",
    "goalFr": "Tester la configuration HAProxy avec haproxy -c, interroger le socket d'administration avec socat et drainer un serveur pour maintenance.",
    "context": "Backend server srv2 must be taken down for OS upgrades. You must use the HAProxy runtime socket to drain traffic without restarting HAProxy.",
    "contextFr": "Le serveur srv2 doit subir une maintenance. Vous devez drainer son trafic via le socket d'administration sans coupure.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Validate HAProxy configuration file syntax",
        "titleFr": "Valider la syntaxe du fichier de configuration HAProxy",
        "instruction": "Run haproxy -c -f /etc/haproxy/haproxy.cfg to test syntax.",
        "instructionFr": "Lancez haproxy -c -f /etc/haproxy/haproxy.cfg pour valider le fichier.",
        "hint": "haproxy -c -f /etc/haproxy/haproxy.cfg",
        "hintFr": "haproxy -c -f /etc/haproxy/haproxy.cfg",
        "expectedCommands": [
          "haproxy -c -f /etc/haproxy/haproxy.cfg",
          "sudo haproxy -c -f /etc/haproxy/haproxy.cfg"
        ],
        "simulatedOutput": "Configuration file is valid",
        "explanation": "haproxy -c parses frontends, backends, health checks, and ACL rules to ensure zero syntax errors before reload.",
        "explanationFr": "haproxy -c teste la cohérence des frontends, backends et directives ACL."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query backend server health statistics over UNIX stats socket with socat",
        "titleFr": "Consulter les statistiques des backends via le socket UNIX avec socat",
        "instruction": "Pipe 'show stat' into socat targeting the UNIX socket /var/run/haproxy.sock.",
        "instructionFr": "Envoyez 'show stat' dans le socket UNIX /var/run/haproxy.sock à l'aide de socat.",
        "hint": "echo \"show stat\" | socat stdio /var/run/haproxy.sock",
        "hintFr": "echo \"show stat\" | socat stdio /var/run/haproxy.sock",
        "expectedCommands": [
          "echo \"show stat\" | socat stdio /var/run/haproxy.sock",
          "echo 'show stat' | socat stdio /var/run/haproxy.sock",
          "echo \"show stat\" | sudo socat stdio /var/run/haproxy.sock",
          "echo 'show stat' | sudo socat stdio /var/run/haproxy.sock"
        ],
        "simulatedOutput": "# pxname,svname,qcur,qmax,scur,smax,slim,stot,bin,bout,dreq,dresp,ereq,econ,eresp,wretr,wredis,status\nweb-backend,srv1,0,0,12,84,1000,4820,1029481,8192041,0,0,0,0,0,0,0,UP\nweb-backend,srv2,0,0,14,80,1000,4791,1018290,8120914,0,0,0,0,0,0,0,UP",
        "explanation": "The HAProxy stats socket enables non-blocking runtime queries without needing HTTP dashboard overhead.",
        "explanationFr": "Le socket d'administration HAProxy permet de piloter le répartiteur en direct sans redémarrage."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Drain and disable backend server srv2 for maintenance",
        "titleFr": "Mettre en maintenance le serveur srv2 via le socket d'administration",
        "instruction": "Send 'disable server web-backend/srv2' to the socket using socat.",
        "instructionFr": "Envoyez 'disable server web-backend/srv2' dans le socket avec socat.",
        "hint": "echo \"disable server web-backend/srv2\" | socat stdio /var/run/haproxy.sock",
        "hintFr": "echo \"disable server web-backend/srv2\" | socat stdio /var/run/haproxy.sock",
        "expectedCommands": [
          "echo \"disable server web-backend/srv2\" | socat stdio /var/run/haproxy.sock",
          "echo 'disable server web-backend/srv2' | socat stdio /var/run/haproxy.sock",
          "echo \"disable server web-backend/srv2\" | sudo socat stdio /var/run/haproxy.sock",
          "echo 'disable server web-backend/srv2' | sudo socat stdio /var/run/haproxy.sock"
        ],
        "simulatedOutput": "[OK] Server web-backend/srv2 state changed to MAINT (draining active sessions; no new traffic routed).",
        "explanation": "Disabling a server via the runtime socket marks it in MAINT mode immediately, allowing active sessions to finish cleanly.",
        "explanationFr": "Le basculement en mode MAINT draine les sessions en cours sans interrompre brutalement les clients connectés."
      }
    ]
  }
];

export const guidedLabScenarios: GuidedLabScenario[] = [
  ...guidedMiniLabsLpic1,
  ...guidedMiniLabsLpic2,
  ...guidedMiniLabsLpic3,
];
