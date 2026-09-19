import { IncidentScenario } from '../../types';

export const lpic2IncidentScenarios: IncidentScenario[] = [
  // =========================================================================
  // INCIDENT 09 : ALERTE STOCKAGE - DÉGRADATION DE GRAPPE RAID-1 (MDADM)
  // =========================================================================
  {
    id: 'incident-09-mdadm-raid-degraded',
    title: 'Storage Alert: Software RAID-1 Array /dev/md0 Degraded [U_]',
    titleFr: 'Alerte Stockage : Grappe RAID-1 /dev/md0 Dégradée [U_] (Disque Défaillant)',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: '204.1',
    category: 'storage',
    context:
      'Nagios and monitoring systems fired a critical alert: "/dev/md0 state degraded". The production database is still reading/writing but with increased latency and zero redundancy remaining.',
    contextFr:
      'La supervision Nagios/Zabbix a émis une alerte critique : "/dev/md0 state degraded". La base de données de production tourne toujours mais avec une latence accrue et sans aucune redondance matérielle.',
    symptoms: [
      'Monitoring alert: CRITICAL - /dev/md0 degraded [1/2 drives active]',
      'Disk activity LED on drive bay 2 is amber / blinking error',
      'I/O wait increased from 2% to 18% during peak hours',
      'Kernel ring buffer warns about SATA link reset and I/O error on sdb'
    ],
    symptomsFr: [
      'Alerte monitoring : CRITIQUE - /dev/md0 dégradé [1 seul disque actif sur 2]',
      'La LED du tiroir de disque n°2 est orange clignotante',
      'L\'I/O wait a grimpé de 2% à 18% lors des pics de charge',
      'Le tampon noyau dmesg signale des réinitialisations de lien SATA et erreurs I/O sur /dev/sdb'
    ],
    diagnosticCommands: [
      {
        command: 'cat /proc/mdstat',
        aliases: ['cat /proc/mdstat', 'grep md0 /proc/mdstat'],
        category: 'storage',
        isKeyEvidence: true,
        output: `Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10] 
md0 : active raid1 sda1[0] sdb1[2](F)
      976630464 blocks super 1.2 [2/1] [U_]
      bitmap: 8/8 pages [32KB], 65536KB chunk

unused devices: <none>`,
        analysis:
          'Crucial observation: /dev/md0 is in [U_] state (degraded). Drive sdb1 is marked (F) for Faulty! Only sda1 remains active. The system is one disk failure away from total data loss.',
        analysisFr:
          'Observation cruciale : /dev/md0 est dans l\'état [U_] (dégradé). Le disque sdb1 est marqué (F) pour Faulty ! Seul sda1 reste actif. Une panne supplémentaire sur sda provoquerait une perte totale de données.'
      },
      {
        command: 'mdadm --detail /dev/md0',
        aliases: ['mdadm -D /dev/md0', 'mdadm --detail'],
        category: 'storage',
        isKeyEvidence: true,
        output: `/dev/md0:
           Version : 1.2
     Creation Time : Tue Jan 14 09:12:04 2025
        Raid Level : raid1
        Array Size : 976630464 (931.39 GiB 1000.07 GB)
     Used Dev Size : 976630464 (931.39 GiB 1000.07 GB)
      Raid Devices : 2
     Total Devices : 2
       Persistence : Superblock is persistent

     Update Time : Fri Sep 18 13:14:22 2026
           State : clean, degraded 
  Active Devices : 1
 Working Devices : 1
  Failed Devices : 1
   Spare Devices : 0

Consistency Policy : resync

            Name : prod-db-node1:0  (local to host prod-db-node1)
            UUID : 4f8a19bc:98d1a3c0:a12b0e91:ee45cd12
          Events : 48102

    Number   Major   Minor   RaidDevice State
       0       8        1        0      active sync   /dev/sda1
       -       0        0        1      removed
       2       8       17        -      faulty   /dev/sdb1`,
        analysis:
          'State confirms "clean, degraded". Slot 1 is "removed" and device /dev/sdb1 is "faulty". Before inserting the replacement drive, sdb1 must be formally removed from the array configuration.',
        analysisFr:
          'L\'état confirme "clean, degraded". Le slot 1 est "removed" et /dev/sdb1 est "faulty". Avant d\'insérer le disque de remplacement, sdb1 doit être formellement retiré de la grappe logicielle via mdadm.'
      },
      {
        command: 'smartctl -H /dev/sdb',
        aliases: ['smartctl -a /dev/sdb', 'smartctl -H /dev/sdb'],
        category: 'storage',
        output: `smartctl 7.3 2022-02-28 r5338 [x86_64-linux-6.1.0-21-amd64] (local build)
=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: FAILED!
Drive failure expected in less than 24 hours. SAVE ALL DATA.
Failed Attributes:
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  5 Reallocated_Sector_Ct   0x0033   001   001   036    Pre-fail  ALWAYS   FAILING_NOW 4096
197 Current_Pending_Sector  0x0012   014   014   000    Old_age   ALWAYS   -           820`,
        analysis:
          'SMART hardware test result is FAILED! 4096 reallocated sectors and 820 pending unreadable sectors. The physical hardware has suffered magnetic media breakdown. Hot-swap replacement required.',
        analysisFr:
          'Le test matériel SMART indique FAILED ! 4096 secteurs réalloués et 820 secteurs défectueux en attente. Le disque physique a subi une dégradation irrémédiable. Remplacement physique obligatoire.'
      },
      {
        command: 'dmesg | grep -E "sd[ab]|ata|blk"',
        aliases: ['dmesg | grep sdb', 'dmesg -T | grep ata'],
        category: 'logs',
        output: `[ 8491.120] ata2.00: exception Emask 0x0 SAct 0x0 SErr 0x0 action 0x6 frozen
[ 8491.121] ata2.00: failed command: READ FPDMA QUEUED
[ 8491.123] ata2.00: status: { DRDY ERR }
[ 8491.124] ata2.00: error: { UNC }
[ 8491.140] sd 1:0:0:0: [sdb] tag#12 FAILED Result: hostbyte=DID_OK driverbyte=DRIVER_OK cmd_status=CHECK_CONDITION
[ 8491.141] I/O error, dev sdb, sector 1840291 op 0x0:(READ) flags 0x80700 phys_seg 1 prio class 2
[ 8491.143] md/raid1:md0: Disk failure on sdb1, disabling device.
[ 8491.144] md/raid1:md0: Operation continuing on 1 devices.`,
        analysis:
          'The Linux kernel detected unrecoverable read errors (UNC) on SATA port 2 (sdb), kicked sdb1 out of md0, and continued operating in degraded single-disk mode on sda.',
        analysisFr:
          'Le noyau Linux a détecté des erreurs de lecture irrécupérables (UNC) sur le port SATA 2 (sdb), a expulsé sdb1 de md0 et continue de fonctionner en mode dégradé sur le seul disque sda.'
      },
      {
        command: 'sfdisk -d /dev/sda',
        aliases: ['fdisk -l /dev/sda', 'parted /dev/sda print'],
        category: 'storage',
        output: `label: gpt
label-id: 9B2C4F71-12D3-4A56-B789-0C1D2E3F4A5B
device: /dev/sda
unit: sectors
first-lba: 2048
last-lba: 1953525134
sector-size: 512

/dev/sda1 : start=        2048, size=  1953521664, type=A19D880F-05FC-4D3B-A006-743F0F84911E, name="Linux RAID"`,
        analysis:
          'Dumping the GPT partition table of healthy disk /dev/sda. When the new /dev/sdb is connected, we will clone this partition table using "sfdisk -d /dev/sda | sfdisk /dev/sdb" before adding sdb1 to the array.',
        analysisFr:
          'Export de la table de partitionnement GPT du disque sain /dev/sda. Dès que le nouveau /dev/sdb sera branché, on clonera cette table avec "sfdisk -d /dev/sda | sfdisk /dev/sdb" avant d\'ajouter sdb1 à la grappe.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Vérifier l\'état actuel de la grappe logicielle',
        titleFr: 'Vérifier l\'état actuel de la grappe logicielle',
        hint: 'Examinez "/proc/mdstat" et "mdadm --detail /dev/md0" pour identifier quel sous-périphérique est en panne et quel est l\'état de redondance.',
        hintFr: 'Examinez "/proc/mdstat" et "mdadm --detail /dev/md0" pour identifier quel sous-périphérique est en panne et quel est l\'état de redondance.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Procédure de retrait du disque défaillant',
        titleFr: 'Procédure de retrait du disque défaillant',
        hint: 'Un disque en panne ne peut pas être remplacé tant qu\'il n\'a pas été retiré de la grappe avec la commande "mdadm /dev/md0 --remove /dev/sdb1".',
        hintFr: 'Un disque en panne ne peut pas être remplacé tant qu\'il n\'a pas été retiré de la grappe avec la commande "mdadm /dev/md0 --remove /dev/sdb1".',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Clonage des partitions et réintégration dans le RAID',
        titleFr: 'Clonage des partitions et réintégration dans le RAID',
        hint: 'Après insertion du nouveau disque /dev/sdb, clonez la table de partitionnement de /dev/sda avec "sfdisk -d /dev/sda | sfdisk /dev/sdb", puis ajoutez la partition avec "mdadm /dev/md0 --add /dev/sdb1". La resynchronisation démarrera immédiatement.',
        hintFr: 'Après insertion du nouveau disque /dev/sdb, clonez la table de partitionnement de /dev/sda avec "sfdisk -d /dev/sda | sfdisk /dev/sdb", puis ajoutez la partition avec "mdadm /dev/md0 --add /dev/sdb1". La resynchronisation démarrera immédiatement.',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Diagnostic de l\'état RAID',
        titleFr: '1. Diagnostic de l\'état RAID',
        question: 'D\'après /proc/mdstat et smartctl, quelle est la cause exacte de l\'alerte de dégradation ?',
        questionFr: 'D\'après /proc/mdstat et smartctl, quelle est la cause exacte de l\'alerte de dégradation ?',
        options: [
          {
            id: 'opt-91a',
            text: 'Le disque physique /dev/sdb a subi une panne matérielle (secteurs défectueux) et a été marqué faulty par le noyau, laissant md0 en mode dégradé sans miroir.',
            textFr: 'Le disque physique /dev/sdb a subi une panne matérielle (secteurs défectueux) et a été marqué faulty par le noyau, laissant md0 en mode dégradé sans miroir.',
            isCorrect: true,
            feedback: 'Exact ! /dev/sdb a échoué aux tests SMART et sdb1 est marqué [U_] dans /proc/mdstat.'
          },
          {
            id: 'opt-91b',
            text: 'Le système de fichiers ext4 sur /dev/md0 est corrompu et a forcé le démontage du RAID.',
            textFr: 'Le système de fichiers ext4 sur /dev/md0 est corrompu et a forcé le démontage du RAID.',
            isCorrect: false,
            feedback: 'Faux : /dev/md0 est toujours actif et monté, c\'est la redondance RAID-1 qui est amputée.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Action d\'éviction du disque défectueux',
        titleFr: '2. Action d\'éviction du disque défectueux',
        question: 'Quelle commande mdadm permet de détacher proprement la partition défectueuse de la grappe avant échange physique ?',
        questionFr: 'Quelle commande mdadm permet de détacher proprement la partition défectueuse de la grappe avant échange physique ?',
        options: [
          {
            id: 'opt-92a',
            text: 'mdadm /dev/md0 --remove /dev/sdb1',
            textFr: 'mdadm /dev/md0 --remove /dev/sdb1',
            isCorrect: true,
            feedback: 'Correct ! Cela supprime la référence au membre défaillant de la grappe active.'
          },
          {
            id: 'opt-92b',
            text: 'mdadm --stop /dev/md0',
            textFr: 'mdadm --stop /dev/md0',
            isCorrect: false,
            feedback: 'Dangereux ! Cela arrêterait complètement la grappe RAID et couperait la base de données en production.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Procédure de reconstruction',
        titleFr: '3. Procédure de reconstruction',
        question: 'Une fois le disque neuf branché et partitionné à l\'identique, comment lancer la reconstruction du miroir ?',
        questionFr: 'Une fois le disque neuf branché et partitionné à l\'identique, comment lancer la reconstruction du miroir ?',
        options: [
          {
            id: 'opt-93a',
            text: 'mdadm /dev/md0 --add /dev/sdb1 (suivi de la surveillance du recovery via /proc/mdstat).',
            textFr: 'mdadm /dev/md0 --add /dev/sdb1 (suivi de la surveillance du recovery via /proc/mdstat).',
            isCorrect: true,
            feedback: 'Exactement ! Le sous-système RAID démarre immédiatement la copie miroir de sda1 vers sdb1.'
          },
          {
            id: 'opt-93b',
            text: 'mkfs.ext4 /dev/sdb1 && mount /dev/sdb1 /mnt',
            textFr: 'mkfs.ext4 /dev/sdb1 && mount /dev/sdb1 /mnt',
            isCorrect: false,
            feedback: 'Non, le disque doit intégrer la grappe mdadm, pas être formaté indépendamment.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Le disque secondaire /dev/sdb d\'une grappe RAID-1 a subi des erreurs de lecture matérielles massives. Le sous-système mdadm l\'a automatiquement évincé pour protéger l\'intégrité des I/O, maintenant le serveur en fonctionnement dégradé.',
      timeline: [
        'T0: Erreurs SATA UNC sur /dev/sdb rapportées dans dmesg.',
        'T+30s: mdadm marque sdb1 comme faulty et passe la grappe en [U_].',
        'T+5m: Détection via Nagios, diagnostic SMART confirmant le besoin de remplacement.',
        'T+20m: Éviction via mdadm --remove, remplacement du disque, clonage des partitions sfdisk et réintégration mdadm --add.'
      ],
      sysadminKeyTakeaways: [
        'Surveiller proactivement les compteurs SMART Reallocated_Sector_Ct avant la panne totale.',
        'Configurer un démon mdmonitor (mdadm --monitor) avec alerte e-mail pour être prévenu immédiatement.',
        'Vérifier que GRUB est installé sur les deux disques (grub-install /dev/sda ET grub-install /dev/sdb) afin que la machine puisse démarrer si sda venait à lâcher.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 10 : LVM - DÉBORDEMENT DE SNAPSHOT ET VOLUME LOGIQUE SUSPENDU
  // =========================================================================
  {
    id: 'incident-10-lvm-snapshot-overflow',
    title: 'LVM Outage: Logical Volume /dev/vg_data/lv_app Suspended (Snapshot 100% Full)',
    titleFr: 'Panne LVM : Volume logique /dev/vg_data/lv_app Suspendu (Snapshot Saturé à 100%)',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: '204.2',
    category: 'storage',
    context:
      'The application backend has completely frozen. Database queries hang, and any write operation to /var/lib/docker or /data locks up indefinitely. Processes entering the filesystem enter Uninterruptible Sleep (state D).',
    contextFr:
      'Le backend applicatif est totalement gelé. Les requêtes en écriture sur /data bloquent indéfiniment. Les processus qui tentent d\'écrire passent en veille ininterruptible (état D) et les commandes df -h ne répondent plus.',
    symptoms: [
      'All writes to /data hang; disk queue length maxes out',
      'Commands like "df -h" or "ls /data" hang waiting for kernel I/O',
      'Load average rises rapidly (blocked tasks in D state)',
      'Syslog warns: "device-mapper: snapshots: Invalid snapshot"'
    ],
    symptomsFr: [
      'Toutes les écritures dans /data se figent ; la file d\'attente disque explose',
      'Les commandes "df -h" ou "ls /data" bloquent indéfiniment en attente d\'I/O',
      'Le load average s\'envole (processus bloqués en état D)',
      'Syslog signale : "device-mapper: snapshots: Invalid snapshot"'
    ],
    diagnosticCommands: [
      {
        command: 'lvs -a',
        aliases: ['lvs', 'lvdisplay'],
        category: 'storage',
        isKeyEvidence: true,
        output: `  LV                  VG      Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  lv_app              vg_data owi-aos--- 100.00g              100.00                                   
  [lv_app_backup_snap] vg_data swi-I-s---  10.00g      lv_app 100.00                                   
  lv_root             vg_sys  -wi-ao----  40.00g`,
        analysis:
          'CRITICAL FINDING! Notice the attributes of [lv_app_backup_snap]: "swi-I-s---". The capital "I" signifies INVALID! Data% is exactly 100.00%. Because this CoW (Copy-on-Write) snapshot exceeded its allocated 10GB, device-mapper invalidated it and dropped origin writes to protect snapshot semantics.',
        analysisFr:
          'DÉCOUVERTE CRITIQUE ! Regardez les attributs de [lv_app_backup_snap] : "swi-I-s---". Le "I" majuscule signifie INVALID ! Data% est à 100.00%. Le snapshot CoW a saturé ses 10 Go alloués, ce qui a invalidé le snapshot et suspendu les écritures sur le volume d\'origine.'
      },
      {
        command: 'vgs',
        aliases: ['vgdisplay vg_data', 'vgs vg_data'],
        category: 'storage',
        output: `  VG      #PV #LV #SN Attr   VSize   VFree  
  vg_data   2   2   1 wz--n- 500.00g 390.00g
  vg_sys    1   1   0 wz--n-  50.00g  10.00g`,
        analysis:
          'Volume Group vg_data has plenty of free space: 390.00 GiB VFree! The problem is not physical storage shortage, but a statically allocated 10GB snapshot that wasn\'t extended or monitored.',
        analysisFr:
          'Le groupe de volumes vg_data dispose de beaucoup d\'espace libre : 390 Go VFree ! Le problème ne vient pas d\'un manque d\'espace physique global, mais d\'un snapshot alloué à seulement 10 Go qui n\'a pas été étendu automatiquement.'
      },
      {
        command: 'dmesg -T | tail -n 15',
        aliases: ['dmesg | tail', 'journalctl -k -n 15'],
        category: 'logs',
        isKeyEvidence: true,
        output: `[Fri Sep 18 13:02:11 2026] device-mapper: snapshots: Invalid snapshot lv_app_backup_snap
[Fri Sep 18 13:02:11 2026] Buffer I/O error on dev dm-3, logical block 1310720, lost async page write
[Fri Sep 18 13:02:14 2026] device-mapper: suspended write on origin lv_app
[Fri Sep 18 13:02:19 2026] INFO: task mysqld:2841 blocked for more than 120 seconds.
[Fri Sep 18 13:02:19 2026]       Not tainted 6.1.0-21-amd64 #1
[Fri Sep 18 13:02:19 2026] "echo 0 > /proc/sys/kernel/hung_task_timeout_secs" disables this message.`,
        analysis:
          'The kernel log explicitly states: "Invalid snapshot lv_app_backup_snap" and "suspended write on origin lv_app". The database mysqld is blocked in hung task state.',
        analysisFr:
          'Le journal noyau indique clairement : "Invalid snapshot lv_app_backup_snap" et "suspended write on origin lv_app". Le processus MySQL est bloqué en hung task timeout.'
      },
      {
        command: 'grep -E "snapshot_autoextend" /etc/lvm/lvm.conf',
        aliases: ['cat /etc/lvm/lvm.conf | grep autoextend'],
        category: 'storage',
        output: `    # Configuration option activation/snapshot_autoextend_threshold.
    snapshot_autoextend_threshold = 100
    # Configuration option activation/snapshot_autoextend_percent.
    snapshot_autoextend_percent = 20`,
        analysis:
          'Notice snapshot_autoextend_threshold is set to 100 (disabled)! If set to 75 or 80 with dmeventd running, LVM would have automatically enlarged the snapshot before it reached 100%.',
        analysisFr:
          'Remarquez que snapshot_autoextend_threshold est à 100 (désactivé) ! Si ce paramètre était réglé à 75 ou 80 avec le démon dmeventd actif, LVM aurait automatiquement agrandi le snapshot avant qu\'il n\'atteigne 100%.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Observer les volumes LVM et leurs attributs',
        titleFr: 'Observer les volumes LVM et leurs attributs',
        hint: 'Exécutez "lvs -a" pour inspecter les snapshots associés à vg_data. Regardez la colonne Data% et le statut de validité.',
        hintFr: 'Exécutez "lvs -a" pour inspecter les snapshots associés à vg_data. Regardez la colonne Data% et le statut de validité.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Comprendre l\'état Invalid Snapshot (swi-I-s---)',
        titleFr: 'Comprendre l\'état Invalid Snapshot (swi-I-s---)',
        hint: 'Un snapshot LVM traditionnel en CoW qui atteint 100% devient définitivement invalide (attribut "I"). Il ne peut plus être agrandi après coup et bloque le volume d\'origine.',
        hintFr: 'Un snapshot LVM traditionnel en CoW qui atteint 100% devient définitivement invalide (attribut "I"). Il ne peut plus être agrandi après coup et bloque le volume d\'origine.',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Suppression d\'urgence du snapshot invalide',
        titleFr: 'Suppression d\'urgence du snapshot invalide',
        hint: 'Pour libérer immédiatement le volume d\'origine suspendu, supprimez le snapshot mort avec "lvremove -f /dev/vg_data/lv_app_backup_snap". Le volume lv_app reprendra instantanément ses I/O.',
        hintFr: 'Pour libérer immédiatement le volume d\'origine suspendu, supprimez le snapshot mort avec "lvremove -f /dev/vg_data/lv_app_backup_snap". Le volume lv_app reprendra instantanément ses I/O.',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause du gel des I/O système',
        titleFr: '1. Cause du gel des I/O système',
        question: 'Pourquoi le volume d\'origine lv_app s\'est-il retrouvé suspendu ?',
        questionFr: 'Pourquoi le volume d\'origine lv_app s\'est-il retrouvé suspendu ?',
        options: [
          {
            id: 'opt-101a',
            text: 'Le snapshot LVM associé a dépassé ses 10 Go alloués (Data% 100.00%), devenant Invalide ("I") et bloquant le device-mapper d\'origine.',
            textFr: 'Le snapshot LVM associé a dépassé ses 10 Go alloués (Data% 100.00%), devenant Invalide ("I") et bloquant le device-mapper d\'origine.',
            isCorrect: true,
            feedback: 'Exact ! Un snapshot CoW plein à 100% corrompt le suivi des blocs et gèle le volume source.'
          },
          {
            id: 'opt-101b',
            text: 'Le groupe de volumes vg_data ne contient plus aucun Physical Extent libre.',
            textFr: 'Le groupe de volumes vg_data ne contient plus aucun Physical Extent libre.',
            isCorrect: false,
            feedback: 'Faux : vgs montre qu\'il reste 390 Go libres dans vg_data.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Remédiation immédiate',
        titleFr: '2. Remédiation immédiate',
        question: 'Quelle commande permet de débloquer immédiatement les écritures applicatives sur lv_app ?',
        questionFr: 'Quelle commande permet de débloquer immédiatement les écritures applicatives sur lv_app ?',
        options: [
          {
            id: 'opt-102a',
            text: 'lvremove -f /dev/vg_data/lv_app_backup_snap',
            textFr: 'lvremove -f /dev/vg_data/lv_app_backup_snap',
            isCorrect: true,
            feedback: 'Parfait ! Dès que le snapshot corrompu est détruit, le noyau réactive immédiatement le volume d\'origine.'
          },
          {
            id: 'opt-102b',
            text: 'reboot -f',
            textFr: 'reboot -f',
            isCorrect: false,
            feedback: 'Un reboot forcé risque de corrompre la base de données et ne règle pas le snapshot plein au démarrage.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Protection pérenne contre la saturation',
        titleFr: '3. Protection pérenne contre la saturation',
        question: 'Quelle mesure d\'ingénierie prévient ce type d\'incident lors des sauvegardes automatisées ?',
        questionFr: 'Quelle mesure d\'ingénierie prévient ce type d\'incident lors des sauvegardes automatisées ?',
        options: [
          {
            id: 'opt-103a',
            text: 'Activer snapshot_autoextend_threshold = 75 dans /etc/lvm/lvm.conf avec le service dmeventd activé, ou utiliser des thin pools.',
            textFr: 'Activer snapshot_autoextend_threshold = 75 dans /etc/lvm/lvm.conf avec le service dmeventd activé, ou utiliser des thin pools.',
            isCorrect: true,
            feedback: 'Exactement ! dmeventd agrandit le snapshot dès qu\'il dépasse 75% tant qu\'il y a de l\'espace dans le VG.'
          },
          {
            id: 'opt-103b',
            text: 'Créer les snapshots directement sur la partition swap.',
            textFr: 'Créer les snapshots directement sur la partition swap.',
            isCorrect: false,
            feedback: 'Absurde : le swap n\'est pas un volume LVM de stockage.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Un snapshot créé avant une opération de maintenance n\'a pas été détruit à la fin du backup. Une grosse mise à jour a généré plus de 10 Go de modifications sur le volume racine, saturant la table de blocs différentiels du snapshot et figeant le volume applicatif.',
      timeline: [
        'T0: Création du snapshot de sauvegarde de 10 Go lv_app_backup_snap.',
        'T+4h: Import d\'un batch massif de données générant 12 Go de blocs modifiés.',
        'T+4h12m: Atteinte des 100% sur le snapshot, marquage INVALID par device-mapper.',
        'T+4h15m: Gel complet des écritures sur /data et blocage des threads MySQL.',
        'T+4h22m: Diagnostic lvs et destruction du snapshot via lvremove.'
      ],
      sysadminKeyTakeaways: [
        'Les snapshots LVM ne sont JAMAIS des sauvegardes permanentes : ils doivent être supprimés dès que la copie externe est achevée.',
        'Toujours activer dmeventd et configurer snapshot_autoextend_threshold = 70 dans lvm.conf.',
        'Privilégier le Thin Provisioning (LVM Thin Pools) pour des snapshots plus performants avec détection d\'espace centralisée.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 11 : WEB & SERVICES - SATURATION DU POOL DE PROCESSUS PHP-FPM
  // =========================================================================
  {
    id: 'incident-11-web-worker-exhaustion',
    title: 'Web Outage: HTTP 504 Gateway Timeout (PHP-FPM Worker Pool Starvation)',
    titleFr: 'Panne Web : HTTP 504 Gateway Timeout (Saturation des Processus PHP-FPM)',
    severity: 'HIGH',
    timeLimitMinutes: 15,
    certification: 'lpic-2',
    topicNumber: 208,
    objectiveId: '208.1',
    category: 'process',
    context:
      'The production web platform is returning HTTP 504 Gateway Timeout to all visitors during a flash sale. Nginx reverse proxy is running fine, but backend script execution has grounded to a halt.',
    contextFr:
      'La plateforme web de commerce en ligne renvoie des erreurs HTTP 504 Gateway Timeout à tous les clients pendant une vente flash. Le serveur Nginx tourne mais les requêtes dynamiques ne répondent plus.',
    symptoms: [
      'Browsers receive HTTP 504 Gateway Timeout after 60s delay',
      'Nginx error.log reports: upstream timed out (110: Connection timed out)',
      'Static assets (CSS, images) serve instantly with HTTP 200',
      'System RAM and CPU still have 70% unused capacity'
    ],
    symptomsFr: [
      'Les navigateurs reçoivent une erreur HTTP 504 après 60 secondes d\'attente',
      'Le log Nginx indique : upstream timed out (110: Connection timed out)',
      'Les fichiers statiques (.css, images) sont délivrés instantanément (HTTP 200)',
      'La RAM et le CPU du serveur ont encore 70% de capacité libre disponible'
    ],
    diagnosticCommands: [
      {
        command: 'tail -n 20 /var/log/nginx/error.log',
        aliases: ['tail /var/log/nginx/error.log', 'cat /var/log/nginx/error.log'],
        category: 'logs',
        output: `2026/09/18 13:10:02 [error] 1104#1104: *4819 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 198.51.100.22, server: shop.example.com, request: "GET /checkout HTTP/2.0", upstream: "fastcgi://unix:/run/php/php8.2-fpm.sock:"
2026/09/18 13:10:05 [error] 1104#1104: *4820 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 198.51.100.35, server: shop.example.com, request: "POST /api/cart HTTP/2.0", upstream: "fastcgi://unix:/run/php/php8.2-fpm.sock:"`,
        analysis:
          'Nginx is communicating with PHP-FPM over unix socket /run/php/php8.2-fpm.sock, but the FastCGI backend takes longer than the 60s fastcgi_read_timeout to reply.',
        analysisFr:
          'Nginx communique bien avec PHP-FPM via le socket /run/php/php8.2-fpm.sock, mais le backend FastCGI met plus de 60s à répondre (timeout).'
      },
      {
        command: 'journalctl -u php8.2-fpm --no-pager -n 15',
        aliases: ['systemctl status php8.2-fpm', 'journalctl -u php8.2-fpm'],
        category: 'logs',
        isKeyEvidence: true,
        output: `Sep 18 13:08:14 web-node1 php-fpm8.2[1412]: [WARNING] [pool www] server reached pm.max_children setting (10), consider raising it
Sep 18 13:08:29 web-node1 php-fpm8.2[1412]: [WARNING] [pool www] server reached pm.max_children setting (10), consider raising it
Sep 18 13:08:44 web-node1 php-fpm8.2[1412]: [WARNING] [pool www] server reached pm.max_children setting (10), consider raising it`,
        analysis:
          'SMOKING GUN! PHP-FPM explicitly logs: "server reached pm.max_children setting (10), consider raising it". All 10 worker processes are busy; any incoming HTTP request sits in the listen backlog until Nginx times out!',
        analysisFr:
          'PREUVE FORMELLE ! Le log PHP-FPM affiche à répétition : "server reached pm.max_children setting (10), consider raising it". Les 10 workers sont saturés ; toutes les nouvelles requêtes s\'empilent et expirent côté Nginx !'
      },
      {
        command: 'free -m',
        aliases: ['free -h', 'cat /proc/meminfo'],
        category: 'storage',
        output: `               total        used        free      shared  buff/cache   available
Mem:           32140        4820       21840         320        5480       26800
Swap:           4096           0        4096`,
        analysis:
          'The server has 32 GB of RAM with 26.8 GB available! A worker limit of only 10 children is an absurdly low default for a 32GB server. Each PHP worker uses ~60MB, meaning the server could easily support 100-200 workers.',
        analysisFr:
          'Le serveur dispose de 32 Go de RAM avec 26,8 Go disponibles ! Une limite de seulement 10 workers est un réglage par défaut minuscule pour une telle machine. Chaque worker PHP occupant environ 60 Mo, la machine peut facilement gérer 100 à 200 workers.'
      },
      {
        command: 'grep -E "^pm" /etc/php/8.2/fpm/pool.d/www.conf',
        aliases: ['cat /etc/php/8.2/fpm/pool.d/www.conf | grep pm'],
        category: 'process',
        isKeyEvidence: true,
        output: `pm = dynamic
pm.max_children = 10
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
pm.max_requests = 500`,
        analysis:
          'Configuration file /etc/php/8.2/fpm/pool.d/www.conf restricts pm.max_children to 10. Raising this to 60 or 80 and restarting PHP-FPM will resolve the bottleneck.',
        analysisFr:
          'Le fichier de pool /etc/php/8.2/fpm/pool.d/www.conf bride pm.max_children à 10. Augmenter cette valeur à 60 ou 80 et recharger PHP-FPM résoudra immédiatement l\'engorgement.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Vérifier la communication amont dans Nginx',
        titleFr: 'Vérifier la communication amont dans Nginx',
        hint: 'Le message "upstream timed out" dans error.log signifie que le serveur mandataire attend le backend FastCGI. Vérifiez les logs spécifiques de php-fpm via journalctl.',
        hintFr: 'Le message "upstream timed out" dans error.log signifie que le serveur mandataire attend le backend FastCGI. Vérifiez les logs spécifiques de php-fpm via journalctl.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Avertissement pm.max_children',
        titleFr: 'Avertissement pm.max_children',
        hint: 'Dans journalctl -u php8.2-fpm, PHP signale que sa limite de processus enfants (pm.max_children) est atteinte.',
        hintFr: 'Dans journalctl -u php8.2-fpm, PHP signale que sa limite de processus enfants (pm.max_children) est atteinte.',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Dimensionner et recharger le pool',
        titleFr: 'Dimensionner et recharger le pool',
        hint: 'Modifiez "pm.max_children = 60" dans /etc/php/8.2/fpm/pool.d/www.conf puis exécutez "systemctl reload php8.2-fpm".',
        hintFr: 'Modifiez "pm.max_children = 60" dans /etc/php/8.2/fpm/pool.d/www.conf puis exécutez "systemctl reload php8.2-fpm".',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause du blocage HTTP 504',
        titleFr: '1. Cause du blocage HTTP 504',
        question: 'Quelle est la cause fondamentale de l\'erreur 504 Gateway Timeout ?',
        questionFr: 'Quelle est la cause fondamentale de l\'erreur 504 Gateway Timeout ?',
        options: [
          {
            id: 'opt-111a',
            text: 'Le pool PHP-FPM est limité à 10 workers (pm.max_children = 10) ; lors du pic de trafic, toutes les requêtes sont bloquées en file d\'attente jusqu\'à expiration.',
            textFr: 'Le pool PHP-FPM est limité à 10 workers (pm.max_children = 10) ; lors du pic de trafic, toutes les requêtes sont bloquées en file d\'attente jusqu\'à expiration.',
            isCorrect: true,
            feedback: 'Exact ! Les 10 workers traitaient des requêtes, rejetant ou retardant tout le reste.'
          },
          {
            id: 'opt-111b',
            text: 'Nginx n\'a plus de descripteurs de fichiers disponibles (ulimit nofile).',
            textFr: 'Nginx n\'a plus de descripteurs de fichiers disponibles (ulimit nofile).',
            isCorrect: false,
            feedback: 'Faux : les fichiers statiques sont délivrés sans aucune erreur.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Ajustement de la configuration',
        titleFr: '2. Ajustement de la configuration',
        question: 'Quelle modification de configuration résout l\'asphyxie des requêtes sans saturer la RAM ?',
        questionFr: 'Quelle modification de configuration résout l\'asphyxie des requêtes sans saturer la RAM ?',
        options: [
          {
            id: 'opt-112a',
            text: 'Augmenter pm.max_children à 60 dans www.conf et exécuter "systemctl reload php8.2-fpm".',
            textFr: 'Augmenter pm.max_children à 60 dans www.conf et exécuter "systemctl reload php8.2-fpm".',
            isCorrect: true,
            feedback: 'Parfait ! 60 workers consomment ~3.6 Go sur les 26 Go disponibles, absorbant le trafic.'
          },
          {
            id: 'opt-112b',
            text: 'Passer fastcgi_read_timeout à 3600s dans nginx.conf.',
            textFr: 'Passer fastcgi_read_timeout à 3600s dans nginx.conf.',
            isCorrect: false,
            feedback: 'Non, cela forcerait les utilisateurs à attendre 1 heure au lieu de traiter leurs requêtes.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Optimisation et monitoring',
        titleFr: '3. Optimisation et monitoring',
        question: 'Comment surveiller l\'utilisation réelle des workers PHP-FPM en production ?',
        questionFr: 'Comment surveiller l\'utilisation réelle des workers PHP-FPM en production ?',
        options: [
          {
            id: 'opt-113a',
            text: 'Activer la page "pm.status_path = /status" dans le pool PHP-FPM et collecter les métriques active/idle processes via Prometheus.',
            textFr: 'Activer la page "pm.status_path = /status" dans le pool PHP-FPM et collecter les métriques active/idle processes via Prometheus.',
            isCorrect: true,
            feedback: 'Très bonne pratique LPIC-2 ! La page /status donne en direct le nombre d\'enfants actifs et la taille du listen queue.'
          },
          {
            id: 'opt-113b',
            text: 'Désactiver le cache OPcache.',
            textFr: 'Désactiver le cache OPcache.',
            isCorrect: false,
            feedback: 'Au contraire, désactiver OPcache quadruplerait la charge CPU et la latence de parsing.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Le serveur applicatif web a subi une dégradation suite à la limitation de pm.max_children à sa valeur par défaut (10). Lors du pic promotionnel, la capacité maximale de traitement dynamique a été dépassée, causant des timeouts HTTP 504.',
      timeline: [
        'T0: Début de la campagne d\'e-mailing et afflux de 400 requêtes/sec.',
        'T+2m: Saturation des 10 workers PHP-FPM, premier avertissement journalctl.',
        'T+3m: Alertes HTTP 504 reçues par l\'astreinte technique.',
        'T+8m: Augmentation de pm.max_children à 60 et reload sans interruption du service.'
      ],
      sysadminKeyTakeaways: [
        'Ne jamais laisser les paramètres de pool PHP-FPM aux valeurs par défaut de distribution sur un serveur de production.',
        'Calcul empirique : max_children = (RAM_dédiée - RAM_OS) / Conso_moyenne_worker_PHP.',
        'Surveiller la directive listen.backlog et les timeouts FastCGI côté Nginx.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 12 : STOCKAGE RÉSEAU - MONTAGE NFS FIGÉ (STALE FILE HANDLE)
  // =========================================================================
  {
    id: 'incident-12-nfs-stale-handle',
    title: 'NFS Outage: "ls /mnt/nas" and "df" Hang Indefinitely (Stale File Handle / Hard Mount)',
    titleFr: 'Panne NFS : Blocage des commandes "ls" et "df" (Stale File Handle & Montage Dur)',
    severity: 'HIGH',
    timeLimitMinutes: 15,
    certification: 'lpic-2',
    topicNumber: 209,
    objectiveId: '209.1',
    category: 'storage',
    context:
      'Backup scripts and administration commands like "df -h" or tab-completion in bash have locked up completely. A reboot of the remote storage filer occurred earlier, and client mountpoints have become unresponsive.',
    contextFr:
      'Les scripts de sauvegarde et les commandes de base comme "df -h" ou l\'auto-complétion bash sont totalement gelées. Le serveur de stockage NAS distant a redémarré plus tôt et les points de montage clients ne répondent plus.',
    symptoms: [
      'Running "df -h" hangs without printing anything and cannot be cancelled with Ctrl+C',
      'Applications writing to /mnt/nas hang in uninterruptible sleep (state D)',
      'Direct directory access yields "Stale file handle" or indefinite silence',
      'umount /mnt/nas fails with "target is busy"'
    ],
    symptomsFr: [
      'La commande "df -h" se fige sans rien afficher et ne peut pas être interrompue par Ctrl+C',
      'Les applications écrivant dans /mnt/nas passent en veille ininterruptible (état D)',
      'L\'accès au dossier renvoie "Stale file handle" ou bloque indéfiniment',
      'umount /mnt/nas échoue avec le message "target is busy"'
    ],
    diagnosticCommands: [
      {
        command: 'nfsstat -m',
        aliases: ['cat /proc/mounts | grep nfs', 'mount -t nfs4'],
        category: 'storage',
        isKeyEvidence: true,
        output: `/mnt/nas from 192.168.10.200:/srv/exports/backup
 Flags: rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=192.168.10.45,local_lock=none,addr=192.168.10.200`,
        analysis:
          'Notice the mount option: "hard". With hard mounts, the client kernel will retry RPC requests forever without ever returning an error to the calling process. If the server file handle changes after reboot, calling processes lock up permanently.',
        analysisFr:
          'Remarquez l\'option de montage : "hard". Avec un montage hard, le noyau client réessaie les requêtes RPC indéfiniment sans jamais renvoyer d\'erreur aux programmes. Tout accès bloque de façon ininterrompue.'
      },
      {
        command: 'dmesg -T | grep -i nfs',
        aliases: ['journalctl -k | grep -i nfs', 'dmesg | grep nfs'],
        category: 'logs',
        isKeyEvidence: true,
        output: `[Fri Sep 18 12:45:01 2026] nfs: server 192.168.10.200 not responding, still trying
[Fri Sep 18 12:46:12 2026] nfs: server 192.168.10.200 OK
[Fri Sep 18 12:46:13 2026] NFS: Stale file handle on /mnt/nas/backups/node1 (fh: 0x4a129f...)
[Fri Sep 18 12:46:13 2026] NFS: server 192.168.10.200 not responding, still trying`,
        analysis:
          'The kernel log tells the full story: The NFS server 192.168.10.200 rebooted. The filesystem export on the filer was recreated with different inode mappings, producing "Stale file handle".',
        analysisFr:
          'Le journal noyau confirme la panne : le serveur NFS a redémarré. Le système de fichiers exporté par le NAS a changé d\'inodes, générant l\'erreur fatale "Stale file handle".'
      },
      {
        command: 'showmount -e 192.168.10.200',
        aliases: ['rpcinfo -p 192.168.10.200'],
        category: 'network',
        output: `Export list for 192.168.10.200:
/srv/exports/backup 192.168.10.0/24`,
        analysis:
          'The remote NFS server is back online and actively advertising the export to the 192.168.10.0/24 subnet. The local client mount just needs a clean lazy remount.',
        analysisFr:
          'Le serveur NFS distant est bien revenu en ligne et publie l\'export pour le sous-réseau. Le client local a simplement besoin d\'un démontage forcé/lazy pour réinitialiser la session.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Comprendre pourquoi df -h bloque',
        titleFr: 'Comprendre pourquoi df -h bloque',
        hint: '"df" interroge statfs() sur tous les points de montage actifs. Dès qu\'un point de montage NFS "hard" ne répond pas, df reste bloqué en attente noyau.',
        hintFr: '"df" interroge statfs() sur tous les points de montage actifs. Dès qu\'un point de montage NFS "hard" ne répond pas, df reste bloqué en attente noyau.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Démontage d\'urgence d\'un point de montage busy',
        titleFr: 'Démontage d\'urgence d\'un point de montage busy',
        hint: 'Un umount classique échoue si des processus ont des fichiers ouverts. Utilisez les options lazy et force : "umount -l -f /mnt/nas".',
        hintFr: 'Un umount classique échoue si des processus ont des fichiers ouverts. Utilisez les options lazy et force : "umount -l -f /mnt/nas".',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Remontage avec des options résilientes',
        titleFr: 'Remontage avec des options résilientes',
        hint: 'Remontez avec "mount -t nfs4 -o rw,intr,soft,timeo=50,retrans=3 192.168.10.200:/srv/exports/backup /mnt/nas". L\'option "intr" permet l\'interruption et "soft" évite le gel infini.',
        hintFr: 'Remontez avec "mount -t nfs4 -o rw,intr,soft,timeo=50,retrans=3 192.168.10.200:/srv/exports/backup /mnt/nas". L\'option "intr" permet l\'interruption et "soft" évite le gel infini.',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Diagnostic du Stale File Handle',
        titleFr: '1. Diagnostic du Stale File Handle',
        question: 'Pourquoi les commandes du système client gèlent-elles sur /mnt/nas ?',
        questionFr: 'Pourquoi les commandes du système client gèlent-elles sur /mnt/nas ?',
        options: [
          {
            id: 'opt-121a',
            text: 'Le montage NFS utilise l\'option "hard" sans timeout interruptible ; suite au redémarrage du NAS, les descripteurs de fichiers (handles) sont devenus caducs (stale), bloquant les appels noyau.',
            textFr: 'Le montage NFS utilise l\'option "hard" sans timeout interruptible ; suite au redémarrage du NAS, les descripteurs de fichiers (handles) sont devenus caducs (stale), bloquant les appels noyau.',
            isCorrect: true,
            feedback: 'Exact ! Un montage "hard" fige les processus en attente indéfinie de réponse RPC.'
          },
          {
            id: 'opt-121b',
            text: 'Le port TCP 2049 est bloqué par le pare-feu local iptables.',
            textFr: 'Le port TCP 2049 est bloqué par le pare-feu local iptables.',
            isCorrect: false,
            feedback: 'Faux : showmount et les logs confirment que le serveur répond aux requêtes réseau.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Action de démontage d\'urgence',
        titleFr: '2. Action de démontage d\'urgence',
        question: 'Quelle commande permet de détacher le montage fantôme sans redémarrer le serveur client ?',
        questionFr: 'Quelle commande permet de détacher le montage fantôme sans redémarrer le serveur client ?',
        options: [
          {
            id: 'opt-122a',
            text: 'umount -l -f /mnt/nas (démontage paresseux/lazy pour détacher immédiatement la hiérarchie).',
            textFr: 'umount -l -f /mnt/nas (démontage paresseux/lazy pour détacher immédiatement la hiérarchie).',
            isCorrect: true,
            feedback: 'Parfait ! L\'option -l (lazy) isole le point de montage sans attendre la fermeture des descripteurs.'
          },
          {
            id: 'opt-122b',
            text: 'killall -9 nfsd',
            textFr: 'killall -9 nfsd',
            isCorrect: false,
            feedback: 'Non, nfsd tourne sur le serveur NFS distant, pas sur le client.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Options de montage durables',
        titleFr: '3. Options de montage durables',
        question: 'Quelle configuration dans /etc/fstab fiabilise les partages NFS pour éviter le gel de df ?',
        questionFr: 'Quelle configuration dans /etc/fstab fiabilise les partages NFS pour éviter le gel de df ?',
        options: [
          {
            id: 'opt-123a',
            text: 'Ajouter les options "intr,soft,timeo=100,retrans=3,_netdev" dans /etc/fstab ou utiliser un autofs avec timeout d\'inactivité.',
            textFr: 'Ajouter les options "intr,soft,timeo=100,retrans=3,_netdev" dans /etc/fstab ou utiliser un autofs avec timeout d\'inactivité.',
            isCorrect: true,
            feedback: 'Exactement ! _netdev attend le réseau et soft/intr autorise l\'abandon en cas de perte de session.'
          },
          {
            id: 'opt-123b',
            text: 'Désactiver NFSv4 pour repasser en NFSv2 en protocole UDP.',
            textFr: 'Désactiver NFSv4 pour repasser en NFSv2 en protocole UDP.',
            isCorrect: false,
            feedback: 'Régression grave : NFSv2 et UDP sont obsolètes, insécurisés et instables.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Le redémarrage non annoncé d\'une baie de stockage NAS a invalidé les sessions NFS actives. Sur les serveurs clients configurés en montage hard sans interruption, toutes les commandes interrogeant les systèmes de fichiers (df, find, backups) se sont figées.',
      timeline: [
        'T0: Redémarrage du NAS de stockage 192.168.10.200.',
        'T+1m: Remontée de l\'erreur Stale File Handle dans le dmesg du client.',
        'T+5m: Gel des scripts de sauvegarde de nuit et saturation des alertes de monitoring.',
        'T+10m: Exécution de umount -l -f /mnt/nas et remontage propre.'
      ],
      sysadminKeyTakeaways: [
        'Ne jamais utiliser de montage NFS "hard" sans l\'option "intr" sur des machines de production.',
        'Pour les répertoires non critiques, privilégier automount (autofs) pour ne monter les volumes qu\'au moment où un processus y accède.',
        'Toujours spécifier l\'option "_netdev" dans fstab pour garantir que le réseau est prêt avant tout montage.'
      ]
    }
  }
];
