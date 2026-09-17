# -*- coding: utf-8 -*-
"""
LPIC-2: 20 Guided Mini-Labs (10 for Exam 201, 10 for Exam 202)
"""

labs_lpic2 = [
  # --- EXAM 201 ---
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
        "expectedCommands": ["vmstat 1 3", "vmstat 1 4", "vmstat 1 5"],
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
        "expectedCommands": ["free -m", "free -h", "free -m -w"],
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
        "expectedCommands": ["modinfo overlay", "sudo modinfo overlay"],
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
        "expectedCommands": ["modprobe overlay", "sudo modprobe overlay"],
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
        "expectedCommands": ["cat /proc/mdstat", "head -n 20 /proc/mdstat"],
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
        "expectedCommands": ["pvs", "sudo pvs", "pvdisplay -s"],
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
        "expectedCommands": ["vgs datavg", "vgs", "sudo vgs", "sudo vgs datavg"],
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
        "expectedCommands": ["ip rule show", "ip rule", "sudo ip rule show"],
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

  # --- EXAM 202 ---
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
        "expectedCommands": ["named-checkconf", "sudo named-checkconf"],
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
        "expectedCommands": ["nginx -t", "sudo nginx -t"],
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
        "expectedCommands": ["exportfs -v", "sudo exportfs -v"],
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
        "expectedCommands": ["testparm -s", "testparm", "sudo testparm -s", "sudo testparm"],
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
        "expectedCommands": ["smbstatus", "sudo smbstatus", "smbstatus -b"],
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
        "expectedCommands": ["dovecot -n", "sudo dovecot -n"],
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
]
