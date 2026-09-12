import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-2 : Examen 201 (Partie 2: Topics 204, 205, 206)
 * Topics couverts :
 * - Topic 204 : Advanced Storage Device Administration (RAID, iSCSI, LVM, Multipath)
 * - Topic 205 : Network Configuration (Policy routing, bonding, VLAN, MTU, troubleshooting)
 * - Topic 206 : System Maintenance (Compilation, shared libraries, rsync, tar, cron, cpio)
 */
export const lpic2Troubleshoot201_2: TroubleshootingChallenge[] = [
  {
    id: "tb-lpic2-201-26",
    title: "Échec d'ajout de disque de remplacement dans une grappe RAID mdadm",
    titleFr: "Échec d'ajout de disque de remplacement dans une grappe RAID mdadm",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.1",
    category: "Advanced Storage - Software RAID mdadm",
    scenario: "Après défaillance de /dev/sdb dans un miroir RAID 1 md0, l'administrateur insère un disque vierge /dev/sdc et lance mdadm --add /dev/md0 /dev/sdc1.",
    scenarioFr: "Après défaillance de /dev/sdb dans un miroir RAID 1 md0, l'administrateur insère un disque vierge /dev/sdc et lance mdadm --add /dev/md0 /dev/sdc1.",
    codeSnippet: `# mdadm --add /dev/md0 /dev/sdc1
mdadm: cannot open /dev/sdc1: No such file or directory

# fdisk -l /dev/sdc
Disk /dev/sdc: 2 TiB, 2199023255552 bytes, 4294967296 sectors
Disklabel type: gpt
Device does not contain a recognized partition table.`,
    language: "bash",
    bugDescription: "Le nouveau disque /dev/sdc est totalement vierge et ne contient aucune table de partition. La partition /dev/sdc1 n'existe pas.",
    bugDescriptionFr: "Le nouveau disque /dev/sdc est totalement vierge et ne contient aucune table de partition. La partition /dev/sdc1 n'existe pas.",
    options: [
      {
        id: "opt-1",
        label: "Cloner la table de partitions depuis le disque sain (ex: sgdisk -R /dev/sdc /dev/sda && sgdisk -G /dev/sdc) avant d'ajouter la partition /dev/sdc1",
        labelFr: "Cloner la table de partitions depuis le disque sain (ex: sgdisk -R /dev/sdc /dev/sda && sgdisk -G /dev/sdc) avant d'ajouter la partition /dev/sdc1",
        isCorrect: true,
        explanation: "Pour qu'une partition puisse intégrer une grappe mdadm, elle doit d'abord être partitionnée avec une taille identique ou supérieure à la partition originale.",
        explanationFr: "Cloner la table de partitions du disque sain puis ajouter la partition au RAID."
      },
      {
        id: "opt-2",
        label: "Ajouter l'option --force à mdadm pour partitionner automatiquement le disque",
        labelFr: "Ajouter l'option --force à mdadm pour partitionner automatiquement le disque",
        isCorrect: false,
        explanation: "mdadm ne partitionne pas les disques physiques.",
        explanationFr: "mdadm ne partitionne pas les disques physiques."
      },
      {
        id: "opt-3",
        label: "Formater /dev/sdc en ext4 avant de l'ajouter",
        labelFr: "Formater /dev/sdc en ext4 avant de l'ajouter",
        isCorrect: false,
        explanation: "Le système de fichiers est porté par /dev/md0, pas par les membres sous-jacents.",
        explanationFr: "Le système de fichiers est porté par /dev/md0, pas par les membres sous-jacents."
      },
      {
        id: "opt-4",
        label: "Recréer la grappe de zéro avec mdadm --create",
        labelFr: "Recréer la grappe de zéro avec mdadm --create",
        isCorrect: false,
        explanation: "Cela détruirait les données du disque sain restant.",
        explanationFr: "Cela détruirait les données du disque sain restant."
      }
    ],
    correctedSnippet: `# Dupliquer le partitionnement GPT du disque sain sda vers sdc :
sgdisk -R /dev/sdc /dev/sda
# Générer un nouveau GUID unique pour le disque :
sgdisk -G /dev/sdc
# Ajouter la partition au RAID :
mdadm --add /dev/md0 /dev/sdc1`,
    fixExplanation: "Cloner la table de partition avec sgdisk (ou sfdisk pour MBR) et intégrer la nouvelle partition au RAID.",
    fixExplanationFr: "Cloner la table de partition avec sgdisk (ou sfdisk pour MBR) et intégrer la nouvelle partition au RAID."
  },
  {
    id: "tb-lpic2-201-27",
    title: "Grappe RAID mdadm non assemblée au redémarrage (UUID inconnu)",
    titleFr: "Grappe RAID mdadm non assemblée au redémarrage (UUID inconnu)",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.1",
    category: "Advanced Storage - Software RAID Configuration",
    scenario: "Une grappe RAID 5 créée avec succès sous le nom /dev/md0 n'est plus assemblée après le redémarrage et devient /dev/md127 inactif.",
    scenarioFr: "Une grappe RAID 5 créée avec succès sous le nom /dev/md0 n'est plus assemblée après le redémarrage et devient /dev/md127 inactif.",
    codeSnippet: `# cat /proc/mdstat
Personalities : [raid6] [raid5] [raid4] 
md127 : inactive sdc1[2](S) sdb1[1](S) sda1[0](S)
      5860533168 blocks super 1.2

# cat /etc/mdadm/mdadm.conf
# Pas d'entrée ARRAY définie`,
    language: "bash",
    bugDescription: "Le fichier /etc/mdadm/mdadm.conf ne contient pas la définition de la grappe ARRAY /dev/md0 avec son UUID, et l'image initramfs n'a pas été mise à jour.",
    bugDescriptionFr: "Le fichier /etc/mdadm/mdadm.conf ne contient pas la définition de la grappe ARRAY /dev/md0 avec son UUID, et l'image initramfs n'a pas été mise à jour.",
    options: [
      {
        id: "opt-1",
        label: "Sauvegarder la configuration de la grappe dans /etc/mdadm/mdadm.conf avec 'mdadm --detail --scan >> /etc/mdadm/mdadm.conf' et régénérer l'initramfs",
        labelFr: "Sauvegarder la configuration de la grappe dans /etc/mdadm/mdadm.conf avec 'mdadm --detail --scan >> /etc/mdadm/mdadm.conf' et régénérer l'initramfs",
        isCorrect: true,
        explanation: "Sans définition dans mdadm.conf et l'initramfs, le noyau assemble temporairement les membres sous un identifiant par défaut /dev/md127.",
        explanationFr: "Ajouter l'ARRAY dans mdadm.conf et mettre à jour l'initramfs."
      },
      {
        id: "opt-2",
        label: "Changer le type RAID de RAID5 à RAID0",
        labelFr: "Changer le type RAID de RAID5 à RAID0",
        isCorrect: false,
        explanation: "Le niveau de redondance n'est pas responsable du défaut de configuration au boot.",
        explanationFr: "Le niveau de redondance n'est pas responsable du défaut de configuration au boot."
      },
      {
        id: "opt-3",
        label: "Supprimer mdadm et utiliser uniquement Btrfs",
        labelFr: "Supprimer mdadm et utiliser uniquement Btrfs",
        isCorrect: false,
        explanation: "Inapproprié pour résoudre un incident mdadm.",
        explanationFr: "Inapproprié pour résoudre un incident mdadm."
      },
      {
        id: "opt-4",
        label: "Formater /dev/md127",
        labelFr: "Formater /dev/md127",
        isCorrect: false,
        explanation: "Cela écraserait irrémédiablement les données.",
        explanationFr: "Cela écraserait irrémédiablement les données."
      }
    ],
    correctedSnippet: `# mdadm --detail --scan >> /etc/mdadm/mdadm.conf
# update-initramfs -u`,
    fixExplanation: "Enregistrer la grappe avec 'mdadm --detail --scan' dans mdadm.conf et mettre à jour l'initramfs.",
    fixExplanationFr: "Enregistrer la grappe avec 'mdadm --detail --scan' dans mdadm.conf et mettre à jour l'initramfs."
  },
  {
    id: "tb-lpic2-201-28",
    title: "Échec de connexion iSCSI : Rejet d'authentification CHAP",
    titleFr: "Échec de connexion iSCSI : Rejet d'authentification CHAP",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.2",
    category: "Advanced Storage - iSCSI Initiator",
    scenario: "L'administrateur LPIC-2 tente de se connecter à une cible iSCSI distante via iscsiadm. La commande échoue avec 'authorization failure'.",
    scenarioFr: "L'administrateur LPIC-2 tente de se connecter à une cible iSCSI distante via iscsiadm. La commande échoue avec 'authorization failure'.",
    codeSnippet: `# iscsiadm -m node -T iqn.2026-09.com.example:storage.lun0 -p 192.168.1.100 -l
Logging in to [iface: default, target: iqn.2026-09.com.example:storage.lun0, portal: 192.168.1.100,3260]
iscsiadm: initiator reported error (24 - authorization failure)

# grep -E "authmethod|username" /etc/iscsi/iscsid.conf
node.session.auth.authmethod = None`,
    language: "config",
    bugDescription: "La cible iSCSI requiert une authentification CHAP, mais le fichier client /etc/iscsi/iscsid.conf a la méthode d'authentification réglée sur 'None' au lieu de 'CHAP'.",
    bugDescriptionFr: "La cible iSCSI requiert une authentification CHAP, mais le fichier client /etc/iscsi/iscsid.conf a la méthode d'authentification réglée sur 'None' au lieu de 'CHAP'.",
    options: [
      {
        id: "opt-1",
        label: "Configurer 'node.session.auth.authmethod = CHAP' ainsi que le nom d'utilisateur et mot de passe CHAP dans /etc/iscsi/iscsid.conf",
        labelFr: "Configurer 'node.session.auth.authmethod = CHAP' ainsi que le nom d'utilisateur et mot de passe CHAP dans /etc/iscsi/iscsid.conf",
        isCorrect: true,
        explanation: "L'erreur 24 (authorization failure) indique que le target rejette l'initiateur car les identifiants CHAP sont absents ou incorrects.",
        explanationFr: "Activer la méthode CHAP et renseigner les identifiants dans /etc/iscsi/iscsid.conf."
      },
      {
        id: "opt-2",
        label: "Changer le port iSCSI en 8080",
        labelFr: "Changer le port iSCSI en 8080",
        isCorrect: false,
        explanation: "Le port standard iSCSI est 3260.",
        explanationFr: "Le port standard iSCSI est 3260."
      },
      {
        id: "opt-3",
        label: "Désactiver le pare-feu du serveur local",
        labelFr: "Désactiver le pare-feu du serveur local",
        isCorrect: false,
        explanation: "La connexion TCP a abouti, c'est une erreur d'autorisation de niveau protocolaire.",
        explanationFr: "La connexion TCP a abouti, c'est une erreur d'autorisation de niveau protocolaire."
      },
      {
        id: "opt-4",
        label: "Remplacer IQN par une adresse MAC",
        labelFr: "Remplacer IQN par une adresse MAC",
        isCorrect: false,
        explanation: "Les cibles iSCSI sont identifiées par des chaînes normalisées IQN.",
        explanationFr: "Les cibles iSCSI sont identifiées par des chaînes normalisées IQN."
      }
    ],
    correctedSnippet: `# /etc/iscsi/iscsid.conf
node.session.auth.authmethod = CHAP
node.session.auth.username = lpic_user
node.session.auth.password = SecretLpicPassword123

# systemctl restart iscsid
# iscsiadm -m node -T iqn.2026-09.com.example:storage.lun0 -p 192.168.1.100 -l`,
    fixExplanation: "Régler authmethod = CHAP et définir les identifiants dans iscsid.conf.",
    fixExplanationFr: "Régler authmethod = CHAP et définir les identifiants dans iscsid.conf."
  },
  {
    id: "tb-lpic2-201-29",
    title: "Espace disque non disponible après agrandissement de volume logique LVM",
    titleFr: "Espace disque non disponible après agrandissement de volume logique LVM",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.3",
    category: "Advanced Storage - LVM Management",
    scenario: "L'administrateur exécute 'lvextend -L +50G /dev/vg0/data' avec succès. Pourtant, les utilisateurs ne voient aucun espace supplémentaire avec 'df -h'.",
    scenarioFr: "L'administrateur exécute 'lvextend -L +50G /dev/vg0/data' avec succès. Pourtant, les utilisateurs ne voient aucun espace supplémentaire avec 'df -h'.",
    codeSnippet: `# lvextend -L +50G /dev/vg0/data
Logical volume vg0/data successfully resized from 100.00 GiB to 150.00 GiB.

# df -h /data
Filesystem            Size  Used Avail Use% Mounted on
/dev/mapper/vg0-data  100G   95G  5.0G  95% /data`,
    language: "bash",
    bugDescription: "Le volume logique LVM a bien été agrandi au niveau des blocs, mais le système de fichiers sous-jacent (ex: ext4 ou XFS) n'a pas été redimensionné.",
    bugDescriptionFr: "Le volume logique LVM a bien été agrandi au niveau des blocs, mais le système de fichiers sous-jacent (ex: ext4 ou XFS) n'a pas été redimensionné.",
    options: [
      {
        id: "opt-1",
        label: "Redimensionner le système de fichiers à chaud avec 'resize2fs /dev/vg0/data' (pour ext4) ou 'xfs_growfs /data' (pour XFS), ou utiliser l'option '-r' de lvextend",
        labelFr: "Redimensionner le système de fichiers à chaud avec 'resize2fs /dev/vg0/data' (pour ext4) ou 'xfs_growfs /data' (pour XFS), ou utiliser l'option '-r' de lvextend",
        isCorrect: true,
        explanation: "lvextend agrandit le contenant LVM. L'option -r (--resizefs) ou resize2fs/xfs_growfs est nécessaire pour adapter le système de fichiers.",
        explanationFr: "Redimensionner le système de fichiers avec resize2fs ou xfs_growfs."
      },
      {
        id: "opt-2",
        label: "Démonter le volume et le reformater complètement avec mkfs",
        labelFr: "Démonter le volume et le reformater complètement avec mkfs",
        isCorrect: false,
        explanation: "Le formatage détruirait toutes les données existantes.",
        explanationFr: "Le formatage détruirait toutes les données existantes."
      },
      {
        id: "opt-3",
        label: "Réduire le volume de 50G avec lvreduce",
        labelFr: "Réduire le volume de 50G avec lvreduce",
        isCorrect: false,
        explanation: "Cela risquerait de tronquer le système de fichiers et corrompre les données.",
        explanationFr: "Cela risquerait de tronquer le système de fichiers et corrompre les données."
      },
      {
        id: "opt-4",
        label: "Changer le type LVM en raid0",
        labelFr: "Changer le type LVM en raid0",
        isCorrect: false,
        explanation: "Le type de volume n'étend pas le système de fichiers.",
        explanationFr: "Le type de volume n'étend pas le système de fichiers."
      }
    ],
    correctedSnippet: `# Pour un filesystem ext4 :
resize2fs /dev/mapper/vg0-data
# Ou pour un filesystem XFS :
xfs_growfs /data
# (À l'avenir, utiliser : lvextend -r -L +50G /dev/vg0/data)`,
    fixExplanation: "Exécuter resize2fs ou xfs_growfs pour agrandir le système de fichiers dans le volume logique.",
    fixExplanationFr: "Exécuter resize2fs ou xfs_growfs pour agrandir le système de fichiers dans le volume logique."
  },
  {
    id: "tb-lpic2-201-30",
    title: "Disque physique rejeté par pvcreate (Filtre lvm.conf actif)",
    titleFr: "Disque physique rejeté par pvcreate (Filtre lvm.conf actif)",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.3",
    category: "Advanced Storage - LVM Physical Volumes",
    scenario: "L'administrateur tente d'initialiser un nouveau disque SAN /dev/sdd avec pvcreate, mais la commande signale que le disque est exclu.",
    scenarioFr: "L'administrateur tente d'initialiser un nouveau disque SAN /dev/sdd avec pvcreate, mais la commande signale que le disque est exclu.",
    codeSnippet: `# pvcreate /dev/sdd
  Device /dev/sdd excluded by a filter.

# grep "filter =" /etc/lvm/lvm.conf
    filter = [ "a|^/dev/sda.*|", "r|.*|" ]`,
    language: "config",
    bugDescription: "Le fichier /etc/lvm/lvm.conf contient une expression régulière dans 'filter' n'autorisant que /dev/sda et rejetant tout le reste ('r|.*|').",
    bugDescriptionFr: "Le fichier /etc/lvm/lvm.conf contient une expression régulière dans 'filter' n'autorisant que /dev/sda et rejetant tout le reste ('r|.*|').",
    options: [
      {
        id: "opt-1",
        label: "Mettre à jour la directive 'filter' dans /etc/lvm/lvm.conf pour accepter le périphérique /dev/sdd (ex: \"a|^/dev/sd[ad].*|\")",
        labelFr: "Mettre à jour la directive 'filter' dans /etc/lvm/lvm.conf pour accepter le périphérique /dev/sdd (ex: \"a|^/dev/sd[ad].*|\")",
        isCorrect: true,
        explanation: "LVM utilise des filtres 'accept' (a) et 'reject' (r). Tout périphérique rejeté par la regex ne peut pas être initialisé par pvcreate.",
        explanationFr: "Ajuster la directive filter dans /etc/lvm/lvm.conf pour autoriser le disque."
      },
      {
        id: "opt-2",
        label: "Exécuter 'dd if=/dev/zero of=/dev/sdd bs=1M count=100' pour effacer le firmware",
        labelFr: "Exécuter 'dd if=/dev/zero of=/dev/sdd bs=1M count=100' pour effacer le firmware",
        isCorrect: false,
        explanation: "Le problème est purement dans la configuration lvm.conf.",
        explanationFr: "Le problème est purement dans la configuration lvm.conf."
      },
      {
        id: "opt-3",
        label: "Créer un système de fichiers XFS sur /dev/sdd",
        labelFr: "Créer un système de fichiers XFS sur /dev/sdd",
        isCorrect: false,
        explanation: "pvcreate est requis avant de créer des VG et LV.",
        explanationFr: "pvcreate est requis avant de créer des VG et LV."
      },
      {
        id: "opt-4",
        label: "Changer le câble SAS reliant le serveur à la baie",
        labelFr: "Changer le câble SAS reliant le serveur à la baie",
        isCorrect: false,
        explanation: "Le périphérique est bien détecté par le noyau dans /dev.",
        explanationFr: "Le périphérique est bien détecté par le noyau dans /dev."
      }
    ],
    correctedSnippet: `# Dans /etc/lvm/lvm.conf :
filter = [ "a|^/dev/sd[ad].*|", "r|.*|" ]

# Puis relancer :
pvcreate /dev/sdd`,
    fixExplanation: "Autoriser /dev/sdd dans l'expression régulière du paramètre filter de /etc/lvm/lvm.conf.",
    fixExplanationFr: "Autoriser /dev/sdd dans l'expression régulière du paramètre filter de /etc/lvm/lvm.conf."
  },
  {
    id: "tb-lpic2-201-31",
    title: "Invalidation d'un instantané LVM (Snapshot 100% full)",
    titleFr: "Invalidation d'un instantané LVM (Snapshot 100% full)",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.3",
    category: "Advanced Storage - LVM Snapshots",
    scenario: "Pendant une opération de sauvegarde nocturne, la lecture d'un instantané LVM échoue subitement avec 'Input/output error'.",
    scenarioFr: "Pendant une opération de sauvegarde nocturne, la lecture d'un instantané LVM échoue subitement avec 'Input/output error'.",
    codeSnippet: `# lvs /dev/vg0/snap_data
  LV        VG  Attr       LSize  Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  snap_data vg0 swi-I-s--- 10.00g      data   100.00                                 

# dmesg | tail -n 2
[14210.12] device-mapper: snapshots: Invaliding snapshot: out of space.
[14210.13] Buffer I/O error on dev dm-5, logical block 10240`,
    language: "bash",
    bugDescription: "L'espace Copy-On-Write alloué au snapshot (10 Go) a été entièrement saturé (100.00%). Dans LVM classique, un snapshot qui déborde devient invalide (attribut 'I') et inutilisable.",
    bugDescriptionFr: "L'espace Copy-On-Write alloué au snapshot (10 Go) a été entièrement saturé (100.00%). Dans LVM classique, un snapshot qui déborde devient invalide (attribut 'I') et inutilisable.",
    options: [
      {
        id: "opt-1",
        label: "L'instantané est corrompu/invalidé car l'espace alloué (Data% = 100%) a débordé ; il doit être détruit (lvremove), recréé avec une taille supérieure ou étendu automatiquement via dmeventd",
        labelFr: "L'instantané est corrompu/invalidé car l'espace alloué (Data% = 100%) a débordé ; il doit être détruit (lvremove), recréé avec une taille supérieure ou étendu automatiquement via dmeventd",
        isCorrect: true,
        explanation: "Un snapshot LVM conventionnel qui atteint 100% est irrémédiablement désactivé (swi-I). On peut configurer snapshot_autoextend_threshold dans lvm.conf pour éviter cela.",
        explanationFr: "Supprimer le snapshot invalidé et dimensionner plus largement ou activer l'autoextend."
      },
      {
        id: "opt-2",
        label: "Le disque dur sous-jacent est physiquement débranché",
        labelFr: "Le disque dur sous-jacent est physiquement débranché",
        isCorrect: false,
        explanation: "Le message dmesg 'Invaliding snapshot: out of space' confirme l'épuisement de l'espace COW.",
        explanationFr: "Le message dmesg confirme l'épuisement de l'espace COW."
      },
      {
        id: "opt-3",
        label: "Exécuter 'e2fsck /dev/vg0/snap_data' réparera le snapshot",
        labelFr: "Exécuter 'e2fsck /dev/vg0/snap_data' réparera le snapshot",
        isCorrect: false,
        explanation: "Le volume dm est invalidé au niveau bloc, aucune écriture ou réparation n'est acceptée.",
        explanationFr: "Le volume dm est invalidé au niveau bloc, aucune écriture ou réparation n'est acceptée."
      },
      {
        id: "opt-4",
        label: "Redémarrer le serveur restaure automatiquement le snapshot",
        labelFr: "Redémarrer le serveur restaure automatiquement le snapshot",
        isCorrect: false,
        explanation: "L'invalidation d'un snapshot LVM est permanente.",
        explanationFr: "L'invalidation d'un snapshot LVM est permanente."
      }
    ],
    correctedSnippet: `# Supprimer le snapshot invalidé :
lvremove -f /dev/vg0/snap_data
# Recréer le snapshot avec un dimensionnement suffisant :
lvcreate -L 30G -s -n snap_data /dev/vg0/data
# Activer le redimensionnement automatique dans /etc/lvm/lvm.conf :
# snapshot_autoextend_threshold = 70
# snapshot_autoextend_percent = 20`,
    fixExplanation: "Supprimer le snapshot invalidé et configurer l'extension automatique dans lvm.conf.",
    fixExplanationFr: "Supprimer le snapshot invalidé et configurer l'extension automatique dans lvm.conf."
  },
  {
    id: "tb-lpic2-201-32",
    title: "Chemins SAN dégradés dans Device-Mapper Multipath",
    titleFr: "Chemins SAN dégradés dans Device-Mapper Multipath",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.2",
    category: "Advanced Storage - Multipath I/O",
    scenario: "L'administrateur LPIC-2 vérifie la haute disponibilité des liaisons SAN Fibre Channel vers la baie de stockage.",
    scenarioFr: "L'administrateur LPIC-2 vérifie la haute disponibilité des liaisons SAN Fibre Channel vers la baie de stockage.",
    codeSnippet: `# multipath -ll
mpatha (36005076380810db70000000000000123) dm-2 IBM,2145
size=500G features='1 queue_if_no_path' hwhandler='1 alua' wp=rw
\`-+- policy='service-time 0' prio=50 status=active
  |- 1:0:0:1 sda 8:0   active ready running
  \`- 2:0:0:1 sdb 8:16  failed faulty running`,
    language: "bash",
    bugDescription: "Le second chemin Fibre Channel (périphérique sdb via le HBA 2:0:0:1) est dans l'état 'failed faulty', indiquant une rupture sur la seconde fabrique SAN (switch, câble ou port HBA défaillant).",
    bugDescriptionFr: "Le second chemin Fibre Channel (périphérique sdb via le HBA 2:0:0:1) est dans l'état 'failed faulty', indiquant une rupture sur la seconde fabrique SAN (switch, câble ou port HBA défaillant).",
    options: [
      {
        id: "opt-1",
        label: "Le chemin physique sdb est en échec ('failed faulty') ; la redondance multipath est perdue sur ce lien et le matériel SAN ou la connectivité du port HBA 2 doit être vérifié",
        labelFr: "Le chemin physique sdb est en échec ('failed faulty') ; la redondance multipath est perdue sur ce lien et le matériel SAN ou la connectivité du port HBA 2 doit être vérifié",
        isCorrect: true,
        explanation: "multipathd maintient l'accès via sda, mais la tolérance aux pannes est compromise tant que sdb reste en défaut.",
        explanationFr: "Diagnostiquer la rupture physique sur le second chemin Fibre Channel."
      },
      {
        id: "opt-2",
        label: "Le disque mpatha doit être immédiatement formaté en NTFS",
        labelFr: "Le disque mpatha doit être immédiatement formaté en NTFS",
        isCorrect: false,
        explanation: "Inapproprié pour résoudre un problème de lien FC.",
        explanationFr: "Inapproprié pour résoudre un problème de lien FC."
      },
      {
        id: "opt-3",
        label: "Le démon multipathd doit être désinstallé",
        labelFr: "Le démon multipathd doit être désinstallé",
        isCorrect: false,
        explanation: "Multipathd est indispensable pour assurer le basculement automatique de chemin.",
        explanationFr: "Multipathd est indispensable pour assurer le basculement automatique de chemin."
      },
      {
        id: "opt-4",
        label: "La taille du disque de 500G dépasse la limite du noyau Linux",
        labelFr: "La taille du disque de 500G dépasse la limite du noyau Linux",
        isCorrect: false,
        explanation: "Linux gère sans problème des disques de plusieurs dizaines de téraoctets.",
        explanationFr: "Linux gère sans problème des disques de plusieurs dizaines de téraoctets."
      }
    ],
    correctedSnippet: `# Inspecter les erreurs SCSI dans les logs noyau :
dmesg | grep -E "sda|sdb|rport"
# Vérifier la liaison optique du port HBA :
cat /sys/class/fc_host/host2/port_state
# Après résolution physique, réanalyser les chemins :
multipath -r`,
    fixExplanation: "Inspecter la liaison optique/port HBA et réanalyser la topologie multipath avec 'multipath -r'.",
    fixExplanationFr: "Inspecter la liaison optique/port HBA et réanalyser la topologie multipath avec 'multipath -r'."
  },
  {
    id: "tb-lpic2-201-33",
    title: "Routage asymétrique sur serveur multi-hébergé (Dual-Homed Server)",
    titleFr: "Routage asymétrique sur serveur multi-hébergé (Dual-Homed Server)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.1",
    category: "Network Configuration - Advanced Routing (Policy Routing)",
    scenario: "Un serveur dispose de deux interfaces eth0 (LAN 192.168.1.10) et eth1 (DMZ 10.0.0.10). Les clients internet joignent l'IP 10.0.0.10 mais les paquets de réponse ne reviennent jamais.",
    scenarioFr: "Un serveur dispose de deux interfaces eth0 (LAN 192.168.1.10) et eth1 (DMZ 10.0.0.10). Les clients internet joignent l'IP 10.0.0.10 mais les paquets de réponse ne reviennent jamais.",
    codeSnippet: `# ip route show
default via 192.168.1.1 dev eth0 
10.0.0.0/24 dev eth1 proto kernel scope link src 10.0.0.10 
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10`,
    language: "bash",
    bugDescription: "La table de routage principale n'a qu'une seule passerelle par défaut via eth0 (192.168.1.1). Les réponses aux requêtes arrivant sur eth1 sortent par eth0, provoquant un routage asymétrique bloqué par les pare-feux des opérateurs.",
    bugDescriptionFr: "La table de routage principale n'a qu'une seule passerelle par défaut via eth0 (192.168.1.1). Les réponses aux requêtes arrivant sur eth1 sortent par eth0, provoquant un routage asymétrique bloqué par les pare-feux des opérateurs.",
    options: [
      {
        id: "opt-1",
        label: "Mettre en place du routage par politique (Policy Routing) avec 'ip rule' et une table de routage dédiée pour renvoyer le trafic issu de 10.0.0.10 via la passerelle de eth1",
        labelFr: "Mettre en place du routage par politique (Policy Routing) avec 'ip rule' et une table de routage dédiée pour renvoyer le trafic issu de 10.0.0.10 via la passerelle de eth1",
        isCorrect: true,
        explanation: "Sur les serveurs multi-hébergés, le routage basé sur l'adresse source (ip rule add from 10.0.0.10 table dmz) garantit que les paquets sortent par l'interface d'arrivée.",
        explanationFr: "Configurer une table de routage dédiée et une règle ip rule."
      },
      {
        id: "opt-2",
        label: "Ajouter une deuxième passerelle par défaut standard avec 'ip route add default via 10.0.0.1'",
        labelFr: "Ajouter une deuxième passerelle par défaut standard avec 'ip route add default via 10.0.0.1'",
        isCorrect: false,
        explanation: "Deux passerelles par défaut dans la table 'main' sans métrique provoquent des conflits ou du multipath aléatoire.",
        explanationFr: "Deux passerelles par défaut dans la table 'main' sans métrique provoquent des conflits."
      },
      {
        id: "opt-3",
        label: "Désactiver l'interface eth0",
        labelFr: "Désactiver l'interface eth0",
        isCorrect: false,
        explanation: "Cela couperait l'accès au réseau LAN local.",
        explanationFr: "Cela couperait l'accès au réseau LAN local."
      },
      {
        id: "opt-4",
        label: "Changer le MTU de eth1 à 9000",
        labelFr: "Changer le MTU de eth1 à 9000",
        isCorrect: false,
        explanation: "Le problème est une question de table de routage, pas de taille de paquet.",
        explanationFr: "Le problème est une question de table de routage, pas de taille de paquet."
      }
    ],
    correctedSnippet: `# Créer une table personnalisée dans /etc/iproute2/rt_tables (ex: 200 dmz) :
echo "200 dmz" >> /etc/iproute2/rt_tables
# Définir la passerelle de la DMZ dans cette table :
ip route add default via 10.0.0.1 dev eth1 table dmz
# Règle : tout paquet émis avec la source 10.0.0.10 utilise la table dmz :
ip rule add from 10.0.0.10 lookup dmz`,
    fixExplanation: "Utiliser ip rule et une table de routage secondaire pour forcer la sortie par eth1.",
    fixExplanationFr: "Utiliser ip rule et une table de routage secondaire pour forcer la sortie par eth1."
  },
  {
    id: "tb-lpic2-201-34",
    title: "Agrégation de liens LACP (Mode 4 802.3ad) non opérationnelle",
    titleFr: "Agrégation de liens LACP (Mode 4 802.3ad) non opérationnelle",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.2",
    category: "Network Configuration - Bonding and Teaming",
    scenario: "Une interface d'agrégation bond0 configurée en mode 4 (802.3ad LACP) ne transmet aucun trafic. L'administrateur inspecte /proc/net/bonding/bond0.",
    scenarioFr: "Une interface d'agrégation bond0 configurée en mode 4 (802.3ad LACP) ne transmet aucun trafic. L'administrateur inspecte /proc/net/bonding/bond0.",
    codeSnippet: `# cat /proc/net/bonding/bond0
Bonding Mode: IEEE 802.3ad Dynamic link aggregation
Transmit Hash Policy: layer2 (0)
MII Status: up
MII Polling Interval (ms): 100
802.3ad info
LACP rate: slow
Partner Key: 0
Partner Mac Address: 00:00:00:00:00:00`,
    language: "bash",
    bugDescription: "La ligne 'Partner Mac Address: 00:00:00:00:00:00' démontre que le commutateur réseau (switch) n'envoie aucune trame LACP. Les ports du switch ne sont pas configurés en agrégation LACP active (Channel-group mode active).",
    bugDescriptionFr: "La ligne 'Partner Mac Address: 00:00:00:00:00:00' démontre que le commutateur réseau (switch) n'envoie aucune trame LACP. Les ports du switch ne sont pas configurés en agrégation LACP active (Channel-group mode active).",
    options: [
      {
        id: "opt-1",
        label: "Le commutateur réseau en face ne dialogue pas en LACP (Partner MAC est 00:00:00:00:00:00) ; les ports du switch doivent être configurés en mode LACP actif",
        labelFr: "Le commutateur réseau en face ne dialogue pas en LACP (Partner MAC est 00:00:00:00:00:00) ; les ports du switch doivent être configurés en mode LACP actif",
        isCorrect: true,
        explanation: "Le mode 802.3ad nécessite une négociation bilatérale active. Si le partenaire envoie des zéros, le port-channel du switch n'est pas activé en LACP.",
        explanationFr: "Activer le protocole LACP sur les ports du commutateur réseau."
      },
      {
        id: "opt-2",
        label: "Le module bonding Linux doit être remplacé par openvswitch",
        labelFr: "Le module bonding Linux doit être remplacé par openvswitch",
        isCorrect: false,
        explanation: "Le module bonding supporte nativement le standard IEEE 802.3ad.",
        explanationFr: "Le module bonding supporte nativement le standard IEEE 802.3ad."
      },
      {
        id: "opt-3",
        label: "Le temps de scrutation MII Polling Interval (100 ms) est trop rapide",
        labelFr: "Le temps de scrutation MII Polling Interval (100 ms) est trop rapide",
        isCorrect: false,
        explanation: "100 ms est la recommandation standard de production.",
        explanationFr: "100 ms est la recommandation standard de production."
      },
      {
        id: "opt-4",
        label: "Le mode 4 ne fonctionne qu'avec des câbles coaxiaux",
        labelFr: "Le mode 4 ne fonctionne qu'avec des câbles coaxiaux",
        isCorrect: false,
        explanation: "Totalement erroné.",
        explanationFr: "Totalement erroné."
      }
    ],
    correctedSnippet: `# Sur le commutateur réseau (ex: Cisco) :
# interface range GigabitEthernet0/1 - 2
#  channel-group 1 mode active
#
# Vérification côté Linux une fois négocié :
cat /proc/net/bonding/bond0 | grep "Partner Mac Address"
# Doit afficher l'adresse MAC du commutateur physique.`,
    fixExplanation: "Activer le protocole LACP en mode actif sur les ports du switch réseau.",
    fixExplanationFr: "Activer le protocole LACP en mode actif sur les ports du switch réseau."
  },
  {
    id: "tb-lpic2-201-35",
    title: "Sous-interface VLAN 802.1Q inactive (Interface parente éteinte)",
    titleFr: "Sous-interface VLAN 802.1Q inactive (Interface parente éteinte)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.2",
    category: "Network Configuration - VLAN 802.1Q",
    scenario: "L'administrateur LPIC-2 a créé la sous-interface eth0.100 pour le VLAN 100. Pourtant, la sous-interface reste en état NO-CARRIER et ne peut émettre aucun paquet.",
    scenarioFr: "L'administrateur LPIC-2 a créé la sous-interface eth0.100 pour le VLAN 100. Pourtant, la sous-interface reste en état NO-CARRIER et ne peut émettre aucun paquet.",
    codeSnippet: `# ip link show
2: eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc mq state DOWN mode DEFAULT group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
3: eth0.100@eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state LOWERLAYERDOWN mode DEFAULT group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff`,
    language: "bash",
    bugDescription: "L'interface parente sous-jacente eth0 est à l'état DOWN ('state DOWN'). Une sous-interface VLAN virtuelle ne peut pas établir sa couche basse (LOWERLAYERDOWN) tant que l'interface physique est éteinte.",
    bugDescriptionFr: "L'interface parente sous-jacente eth0 est à l'état DOWN ('state DOWN'). Une sous-interface VLAN virtuelle ne peut pas établir sa couche basse (LOWERLAYERDOWN) tant que l'interface physique est éteinte.",
    options: [
      {
        id: "opt-1",
        label: "L'interface physique parente eth0 est DOWN ; il faut l'activer avec 'ip link set eth0 up' pour que le VLAN eth0.100 fonctionne",
        labelFr: "L'interface physique parente eth0 est DOWN ; il faut l'activer avec 'ip link set eth0 up' pour que le VLAN eth0.100 fonctionne",
        isCorrect: true,
        explanation: "Les sous-interfaces 802.1Q dépendent de l'état UP de leur périphérique parent pour transmettre les trames étiquetées.",
        explanationFr: "Activer l'interface physique parente avec ip link set eth0 up."
      },
      {
        id: "opt-2",
        label: "L'ID de VLAN 100 est invalide (doit être supérieur à 4096)",
        labelFr: "L'ID de VLAN 100 est invalide (doit être supérieur à 4096)",
        isCorrect: false,
        explanation: "Les VLANs 802.1Q sont compris entre 1 et 4094.",
        explanationFr: "Les VLANs 802.1Q sont compris entre 1 et 4094."
      },
      {
        id: "opt-3",
        label: "Il faut réinstaller le pilote de la carte mère",
        labelFr: "Il faut réinstaller le pilote de la carte mère",
        isCorrect: false,
        explanation: "L'interface est reconnue, simplement administrativement éteinte.",
        explanationFr: "L'interface est reconnue, simplement administrativement éteinte."
      },
      {
        id: "opt-4",
        label: "Le séparateur dans le nom de sous-interface doit obligatoirement être un tiret",
        labelFr: "Le séparateur dans le nom de sous-interface doit obligatoirement être un tiret",
        isCorrect: false,
        explanation: "eth0.100 avec un point est la convention Linux standard.",
        explanationFr: "eth0.100 avec un point est la convention Linux standard."
      }
    ],
    correctedSnippet: `# Activer l'interface parente :
ip link set eth0 up
# Vérifier que eth0.100 passe en UP :
ip link show eth0.100`,
    fixExplanation: "Activer l'interface physique parente avec 'ip link set eth0 up'.",
    fixExplanationFr: "Activer l'interface physique parente avec 'ip link set eth0 up'."
  },
  {
    id: "tb-lpic2-201-36",
    title: "Perte de paquets intermittente sur stockage SAN due à un MTU hétérogène (Jumbo Frames)",
    titleFr: "Perte de paquets intermittente sur stockage SAN due à un MTU hétérogène (Jumbo Frames)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.2",
    category: "Network Configuration - MTU & Jumbo Frames",
    scenario: "Sur un réseau iSCSI/NFS, les transferts volumineux se bloquent systématiquement alors que les pings courts (64 octets) fonctionnent parfaitement.",
    scenarioFr: "Sur un réseau iSCSI/NFS, les transferts volumineux se bloquent systématiquement alors que les pings courts (64 octets) fonctionnent parfaitement.",
    codeSnippet: `# ping -c 2 192.168.10.50
2 packets transmitted, 2 received, 0% packet loss

# ping -M do -s 8972 192.168.10.50
PING 192.168.10.50 (192.168.10.50) 8972(9000) bytes of data.
From 192.168.10.10 icmp_seq=1 Frag needed and DF set (mtu = 1500)`,
    language: "bash",
    bugDescription: "Un équipement intermédiaire (ou la carte réseau) a un MTU de 1500 alors que les serveurs ont un MTU de 9000. Les paquets Jumbo Frame avec le bit Don't Fragment (DF) sont rejetés.",
    bugDescriptionFr: "Un équipement intermédiaire (ou la carte réseau) a un MTU de 1500 alors que les serveurs ont un MTU de 9000. Les paquets Jumbo Frame avec le bit Don't Fragment (DF) sont rejetés.",
    options: [
      {
        id: "opt-1",
        label: "Incohérence de MTU de bout en bout : un switch ou une interface a conservé un MTU standard de 1500, provoquant le rejet des Jumbo Frames (9000 octets)",
        labelFr: "Incohérence de MTU de bout en bout : un switch ou une interface a conservé un MTU standard de 1500, provoquant le rejet des Jumbo Frames (9000 octets)",
        isCorrect: true,
        explanation: "Les Jumbo Frames exigent que l'intégralité des hôtes, cartes réseau et commutateurs de la chaîne soient configurés en MTU 9000.",
        explanationFr: "Uniformiser le MTU à 9000 sur toute la chaîne ou revenir au standard 1500."
      },
      {
        id: "opt-2",
        label: "La commande ping ne supporte pas l'option -s",
        labelFr: "La commande ping ne supporte pas l'option -s",
        isCorrect: false,
        explanation: "-s spécifie la taille de la charge utile ICMP.",
        explanationFr: "-s spécifie la taille de la charge utile ICMP."
      },
      {
        id: "opt-3",
        label: "Le protocole ICMP a été désactivé par le noyau",
        labelFr: "Le protocole ICMP a été désactivé par le noyau",
        isCorrect: false,
        explanation: "Le message d'erreur 'Frag needed and DF set' provient justement du protocole ICMP (Type 3 Code 4).",
        explanationFr: "Le message d'erreur provient d'ICMP Type 3 Code 4."
      },
      {
        id: "opt-4",
        label: "L'adresse IP de destination est en conflit ARP",
        labelFr: "L'adresse IP de destination est en conflit ARP",
        isCorrect: false,
        explanation: "Les petits paquets passent sans encombre.",
        explanationFr: "Les petits paquets passent sans encombre."
      }
    ],
    correctedSnippet: `# Vérifier et configurer le MTU de l'interface réseau :
ip link set dev eth1 mtu 9000
# S'assurer que tous les switches physiques du VLAN de stockage supportent et ont le MTU fixé à 9000.`,
    fixExplanation: "Harmoniser la valeur du MTU à 9000 sur tous les commutateurs et interfaces du réseau de stockage.",
    fixExplanationFr: "Harmoniser la valeur du MTU à 9000 sur tous les commutateurs et interfaces du réseau de stockage."
  },
  {
    id: "tb-lpic2-201-37",
    title: "Résolution DNS défaillante (Boucle locale systemd-resolved 127.0.0.53)",
    titleFr: "Résolution DNS défaillante (Boucle locale systemd-resolved 127.0.0.53)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.3",
    category: "Network Troubleshooting - DNS Configuration",
    scenario: "La commande 'dig @8.8.8.8 example.com' répond instantanément, mais 'ping example.com' et 'curl' échouent avec 'Temporary failure in name resolution'.",
    scenarioFr: "La commande 'dig @8.8.8.8 example.com' répond instantanément, mais 'ping example.com' et 'curl' échouent avec 'Temporary failure in name resolution'.",
    codeSnippet: `# cat /etc/resolv.conf
nameserver 127.0.0.53
options edns0 trust-ad

# systemctl status systemd-resolved
Active: inactive (dead)`,
    language: "bash",
    bugDescription: "Le fichier /etc/resolv.conf pointe sur le stub resolver local 127.0.0.53, mais le service systemd-resolved est arrêté, rendant toute résolution système impossible.",
    bugDescriptionFr: "Le fichier /etc/resolv.conf pointe sur le stub resolver local 127.0.0.53, mais le service systemd-resolved est arrêté, rendant toute résolution système impossible.",
    options: [
      {
        id: "opt-1",
        label: "Le résolveur local systemd-resolved est inactif alors que /etc/resolv.conf pointe sur 127.0.0.53 ; il faut démarrer le service ou corriger resolv.conf",
        labelFr: "Le résolveur local systemd-resolved est inactif alors que /etc/resolv.conf pointe sur 127.0.0.53 ; il faut démarrer le service ou corriger resolv.conf",
        isCorrect: true,
        explanation: "dig interrogeait directement 8.8.8.8 en contournant /etc/resolv.conf, alors que la libc utilise resolv.conf (127.0.0.53).",
        explanationFr: "Démarrer systemd-resolved ou renseigner des serveurs DNS valides dans /etc/resolv.conf."
      },
      {
        id: "opt-2",
        label: "Supprimer la commande ping qui n'utilise pas le protocole DNS",
        labelFr: "Supprimer la commande ping qui n'utilise pas le protocole DNS",
        isCorrect: false,
        explanation: "ping utilise la résolution de nom standard getaddrinfo.",
        explanationFr: "ping utilise la résolution de nom standard getaddrinfo."
      },
      {
        id: "opt-3",
        label: "Bloquer le port 53 en sortie dans iptables",
        labelFr: "Bloquer le port 53 en sortie dans iptables",
        isCorrect: false,
        explanation: "Cela aggraverait le problème.",
        explanationFr: "Cela aggraverait le problème."
      },
      {
        id: "opt-4",
        label: "Changer le nom d'hôte de la machine en localhost",
        labelFr: "Changer le nom d'hôte de la machine en localhost",
        isCorrect: false,
        explanation: "Le hostname n'influe pas sur la disponibilité du service résolveur.",
        explanationFr: "Le hostname n'influe pas sur la disponibilité du service résolveur."
      }
    ],
    correctedSnippet: `# Démarrer et activer systemd-resolved :
systemctl enable --now systemd-resolved
# Ou renseigner un DNS directement dans /etc/resolv.conf :
# nameserver 1.1.1.1`,
    fixExplanation: "Démarrer le service systemd-resolved ou configurer un serveur DNS public/interne dans /etc/resolv.conf.",
    fixExplanationFr: "Démarrer le service systemd-resolved ou configurer un serveur DNS public/interne dans /etc/resolv.conf."
  },
  {
    id: "tb-lpic2-201-38",
    title: "Connexion SSH bloquée après échange de bannières (Trou noir MTU / PMTUD)",
    titleFr: "Connexion SSH bloquée après échange de bannières (Trou noir MTU / PMTUD)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.3",
    category: "Network Troubleshooting - MTU & PMTUD Blackhole",
    scenario: "Une connexion SSH vers un serveur distant démarre, affiche la bannière d'accueil, puis se fige indéfiniment lors de commandes générant beaucoup de texte (ex: ls -lR /etc).",
    scenarioFr: "Une connexion SSH vers un serveur distant démarre, affiche la bannière d'accueil, puis se fige indéfiniment lors de commandes générant beaucoup de texte (ex: ls -lR /etc).",
    codeSnippet: `# ssh -vvv user@remote.example.com
debug1: SSH2_MSG_KEXINIT sent
debug1: SSH2_MSG_KEXINIT received
...
debug1: Entering interactive session.
# ls -la /etc/
(Blocage complet du terminal)`,
    language: "bash",
    bugDescription: "Un routeur sur le chemin internet a un MTU inférieur (ex: tunnel PPPoE/VPN à 1492 ou 1400) et bloque les messages ICMP 'Fragmentation Needed' (PMTUD Blackhole). Les gros paquets TCP sont détruits.",
    bugDescriptionFr: "Un routeur sur le chemin internet a un MTU inférieur (ex: tunnel PPPoE/VPN à 1492 ou 1400) et bloque les messages ICMP 'Fragmentation Needed' (PMTUD Blackhole). Les gros paquets TCP sont détruits.",
    options: [
      {
        id: "opt-1",
        label: "Trou noir PMTUD : les paquets TCP volumineux sont rejetés ; appliquer le serrage MSS (TCPMSS clamping) avec iptables pour forcer une taille de segment compatible",
        labelFr: "Trou noir PMTUD : les paquets TCP volumineux sont rejetés ; appliquer le serrage MSS (TCPMSS clamping) avec iptables pour forcer une taille de segment compatible",
        isCorrect: true,
        explanation: "La règle iptables -t mangle -A POSTROUTING -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu adapte le MSS lors du handshake.",
        explanationFr: "Appliquer le serrage TCPMSS via iptables ou réduire le MTU local."
      },
      {
        id: "opt-2",
        label: "Désinstaller OpenSSH et installer telnetd",
        labelFr: "Désinstaller OpenSSH et installer telnetd",
        isCorrect: false,
        explanation: "Telnet transmet les identifiants en clair et n'est pas sécurisé.",
        explanationFr: "Telnet transmet les identifiants en clair et n'est pas sécurisé."
      },
      {
        id: "opt-3",
        label: "Le disque distant est plein en écriture",
        labelFr: "Le disque distant est plein en écriture",
        isCorrect: false,
        explanation: "ls ne fait qu'émettre des lectures vers le client.",
        explanationFr: "ls ne fait qu'émettre des lectures vers le client."
      },
      {
        id: "opt-4",
        label: "L'algorithme de chiffrement RSA est obsolète",
        labelFr: "L'algorithme de chiffrement RSA est obsolète",
        isCorrect: false,
        explanation: "La négociation SSH initiale a abouti avec succès.",
        explanationFr: "La négociation SSH initiale a abouti avec succès."
      }
    ],
    correctedSnippet: `# Corriger temporairement le MTU de la carte :
ip link set dev eth0 mtu 1400
# Ou appliquer la règle iptables TCPMSS sur la passerelle :
iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu`,
    fixExplanation: "Réduire le MTU ou utiliser le serrage TCPMSS dans iptables pour éviter les blocages de paquets volumineux.",
    fixExplanationFr: "Réduire le MTU ou utiliser le serrage TCPMSS dans iptables pour éviter les blocages de paquets volumineux."
  },
  {
    id: "tb-lpic2-201-39",
    title: "Échec de ./configure : 'C compiler cannot create executables'",
    titleFr: "Échec de ./configure : 'C compiler cannot create executables'",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.1",
    category: "System Maintenance - Source Compilation",
    scenario: "Lors de la compilation d'un logiciel depuis les sources, le script configure s'arrête avec une erreur critique.",
    scenarioFr: "Lors de la compilation d'un logiciel depuis les sources, le script configure s'arrête avec une erreur critique.",
    codeSnippet: `# ./configure
checking for gcc... gcc
checking whether the C compiler works... no
configure: error: in \`/root/src/customapp-2.0':
configure: error: C compiler cannot create executables
See \`config.log' for more details.`,
    language: "bash",
    bugDescription: "Le compilateur gcc est installé mais les bibliothèques C de base et outils d'édition de liens (libc-dev / glibc-devel) sont absents du système.",
    bugDescriptionFr: "Le compilateur gcc est installé mais les bibliothèques C de base et outils d'édition de liens (libc-dev / glibc-devel) sont absents du système.",
    options: [
      {
        id: "opt-1",
        label: "Installer le méta-paquet d'outils de compilation (build-essential sous Debian/Ubuntu ou gcc, glibc-devel sous RHEL/CentOS)",
        labelFr: "Installer le méta-paquet d'outils de compilation (build-essential sous Debian/Ubuntu ou gcc, glibc-devel sous RHEL/CentOS)",
        isCorrect: true,
        explanation: "gcc nécessite les en-têtes et bibliothèques standard de la libc (libc-dev) ainsi que l'éditeur de liens ld (binutils) pour générer un exécutable binaire valide.",
        explanationFr: "Installer build-essential ou glibc-devel."
      },
      {
        id: "opt-2",
        label: "Supprimer le fichier configure et lancer directement 'make'",
        labelFr: "Supprimer le fichier configure et lancer directement 'make'",
        isCorrect: false,
        explanation: "make a besoin du Makefile produit par configure.",
        explanationFr: "make a besoin du Makefile produit par configure."
      },
      {
        id: "opt-3",
        label: "Remplacer gcc par python",
        labelFr: "Remplacer gcc par python",
        isCorrect: false,
        explanation: "Python est un interpréteur, pas un compilateur C natif.",
        explanationFr: "Python est un interpréteur, pas un compilateur C natif."
      },
      {
        id: "opt-4",
        label: "Exécuter ./configure avec les privilèges de l'utilisateur nobody",
        labelFr: "Exécuter ./configure avec les privilèges de l'utilisateur nobody",
        isCorrect: false,
        explanation: "Cela ne fournit pas les bibliothèques manquantes.",
        explanationFr: "Cela ne fournit pas les bibliothèques manquantes."
      }
    ],
    correctedSnippet: `# Sous Debian/Ubuntu :
apt-get install build-essential
# Sous RHEL/CentOS :
dnf groupinstall "Development Tools"
# Relancer la configuration :
./configure`,
    fixExplanation: "Installer le groupe de paquets de développement pour fournir libc-dev et binutils.",
    fixExplanationFr: "Installer le groupe de paquets de développement pour fournir libc-dev et binutils."
  },
  {
    id: "tb-lpic2-201-40",
    title: "Bibliothèque partagée introuvable (error while loading shared libraries)",
    titleFr: "Bibliothèque partagée introuvable (error while loading shared libraries)",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.1",
    category: "System Maintenance - Shared Libraries",
    scenario: "Après avoir installé une bibliothèque personnalisée dans /usr/local/lib, l'exécution du binaire échoue immédiatement.",
    scenarioFr: "Après avoir installé une bibliothèque personnalisée dans /usr/local/lib, l'exécution du binaire échoue immédiatement.",
    codeSnippet: `# /opt/mytool/bin/mytool
/opt/mytool/bin/mytool: error while loading shared libraries: libcustom.so.2: cannot open shared object file: No such file or directory

# ls -l /usr/local/lib/libcustom.so.2
-rwxr-xr-x 1 root root 841200 Sep 04 14:00 /usr/local/lib/libcustom.so.2`,
    language: "bash",
    bugDescription: "L'éditeur de liens dynamique ld.so ne connaît pas le nouveau fichier car le cache /etc/ld.so.cache n'a pas été mis à jour via la commande 'ldconfig'.",
    bugDescriptionFr: "L'éditeur de liens dynamique ld.so ne connaît pas le nouveau fichier car le cache /etc/ld.so.cache n'a pas été mis à jour via la commande 'ldconfig'.",
    options: [
      {
        id: "opt-1",
        label: "Vérifier que /usr/local/lib est référencé dans /etc/ld.so.conf (ou /etc/ld.so.conf.d/) et exécuter la commande 'ldconfig' pour reconstruire le cache des bibliothèques",
        labelFr: "Vérifier que /usr/local/lib est référencé dans /etc/ld.so.conf (ou /etc/ld.so.conf.d/) et exécuter la commande 'ldconfig' pour reconstruire le cache des bibliothèques",
        isCorrect: true,
        explanation: "Le chargeur dynamique Linux utilise /etc/ld.so.cache pour résoudre rapidement les dépendances de bibliothèques. Toute nouvelle bibliothèque nécessite ldconfig.",
        explanationFr: "Mettre à jour le cache de l'éditeur de liens avec la commande ldconfig."
      },
      {
        id: "opt-2",
        label: "Renommer libcustom.so.2 en libcustom.a",
        labelFr: "Renommer libcustom.so.2 en libcustom.a",
        isCorrect: false,
        explanation: ".a est une archive statique, le programme réclame une bibliothèque partagée dynamique .so.",
        explanationFr: "Le programme requiert une bibliothèque partagée .so."
      },
      {
        id: "opt-3",
        label: "Déplacer le binaire dans /tmp",
        labelFr: "Déplacer le binaire dans /tmp",
        isCorrect: false,
        explanation: "L'emplacement du binaire ne change rien à la recherche des librairies dynamiques.",
        explanationFr: "L'emplacement du binaire ne change rien à la recherche des librairies."
      },
      {
        id: "opt-4",
        label: "Supprimer la variable LD_LIBRARY_PATH du noyau",
        labelFr: "Supprimer la variable LD_LIBRARY_PATH du noyau",
        isCorrect: false,
        explanation: "LD_LIBRARY_PATH est une variable utilisateur en espace utilisateur, pas un paramètre noyau.",
        explanationFr: "LD_LIBRARY_PATH est une variable d'environnement."
      }
    ],
    correctedSnippet: `# Ajouter le chemin si nécessaire :
echo "/usr/local/lib" > /etc/ld.so.conf.d/usrlocal.conf
# Régénérer le cache de l'éditeur de liens dynamique :
ldconfig
# Vérifier la résolution des bibliothèques :
ldd /opt/mytool/bin/mytool`,
    fixExplanation: "Exécuter ldconfig pour mettre à jour le cache /etc/ld.so.cache.",
    fixExplanationFr: "Exécuter ldconfig pour mettre à jour le cache /etc/ld.so.cache."
  },
  {
    id: "tb-lpic2-201-41",
    title: "Sous-dossier involontaire créé lors d'une sauvegarde avec rsync",
    titleFr: "Sous-dossier involontaire créé lors d'une sauvegarde avec rsync",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.2",
    category: "System Maintenance - Rsync Backups",
    scenario: "L'administrateur veut synchroniser le contenu de /var/www/html/ vers /backup/html/. Après la sauvegarde, il découvre une arborescence /backup/html/html/.",
    scenarioFr: "L'administrateur veut synchroniser le contenu de /var/www/html/ vers /backup/html/. Après la sauvegarde, il découvre une arborescence /backup/html/html/.",
    codeSnippet: `# rsync -avz /var/www/html /backup/html/

# ls -d /backup/html/*
/backup/html/html`,
    language: "bash",
    bugDescription: "En omettant le slash final sur le répertoire source (/var/www/html sans slash), rsync copie le répertoire lui-même au lieu de son contenu.",
    bugDescriptionFr: "En omettant le slash final sur le répertoire source (/var/www/html sans slash), rsync copie le répertoire lui-même au lieu de son contenu.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter un slash terminal au chemin source : 'rsync -avz /var/www/html/ /backup/html/' pour copier le contenu plutôt que le dossier lui-même",
        labelFr: "Ajouter un slash terminal au chemin source : 'rsync -avz /var/www/html/ /backup/html/' pour copier le contenu plutôt que le dossier lui-même",
        isCorrect: true,
        explanation: "La sémantique de rsync distingue strictement source (copie le dossier source dans la destination) et source/ (copie le contenu du dossier source).",
        explanationFr: "Ajouter le slash terminal sur le répertoire source."
      },
      {
        id: "opt-2",
        label: "Remplacer l'option -a par -r",
        labelFr: "Remplacer l'option -a par -r",
        isCorrect: false,
        explanation: "-a inclut déjà -r en préservant en plus les droits, propriétaires et horodatages.",
        explanationFr: "-a inclut déjà -r."
      },
      {
        id: "opt-3",
        label: "Utiliser l'option --delete-before pour supprimer le nom du dossier",
        labelFr: "Utiliser l'option --delete-before pour supprimer le nom du dossier",
        isCorrect: false,
        explanation: "--delete gère la suppression des fichiers orphelins sur la cible, pas le nesting.",
        explanationFr: "--delete gère la suppression des fichiers orphelins."
      },
      {
        id: "opt-4",
        label: "rsync ne peut synchroniser que vers des serveurs distants via SSH",
        labelFr: "rsync ne peut synchroniser que vers des serveurs distants via SSH",
        isCorrect: false,
        explanation: "rsync fonctionne parfaitement entre répertoires locaux.",
        explanationFr: "rsync fonctionne parfaitement entre répertoires locaux."
      }
    ],
    correctedSnippet: `# Utiliser un slash terminal sur le dossier source :
rsync -avz /var/www/html/ /backup/html/`,
    fixExplanation: "Ajouter un slash terminal '/' à la fin du répertoire source.",
    fixExplanationFr: "Ajouter un slash terminal '/' à la fin du répertoire source."
  },
  {
    id: "tb-lpic2-201-42",
    title: "Échec de sauvegarde tar bloqué par une socket Unix ou un pipe nommé",
    titleFr: "Échec de sauvegarde tar bloqué par une socket Unix ou un pipe nommé",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.2",
    category: "System Maintenance - Tar Archive Management",
    scenario: "Une tâche de sauvegarde tar globale de /var échoue avec une erreur sur une socket MySQL/PHP-FPM.",
    scenarioFr: "Une tâche de sauvegarde tar globale de /var échoue avec une erreur sur une socket MySQL/PHP-FPM.",
    codeSnippet: `# tar -czf /backup/var.tar.gz /var
tar: /var/run/mysqld/mysqld.sock: socket ignored
tar: /var/run/php/php8.2-fpm.sock: socket ignored
tar: Exiting with failure status due to previous errors`,
    language: "bash",
    bugDescription: "Les sockets UNIX et les pipes nommés ne contiennent pas de données persistantes et génèrent des avertissements sous tar. Il faut exclure les sockets avec --exclude-backups ou --warning=no-file-ignored.",
    bugDescriptionFr: "Les sockets UNIX et les pipes nommés ne contiennent pas de données persistantes et génèrent des avertissements sous tar. Il faut exclure les sockets avec --exclude-backups ou --warning=no-file-ignored.",
    options: [
      {
        id: "opt-1",
        label: "Exclure le répertoire temporaire /var/run (ou utiliser l'option --exclude=\"*.sock\") pour ne pas archiver les fichiers de communication inter-processus",
        labelFr: "Exclure le répertoire temporaire /var/run (ou utiliser l'option --exclude=\"*.sock\") pour ne pas archiver les fichiers de communication inter-processus",
        isCorrect: true,
        explanation: "Les sockets UNIX dans /run ou /var/run sont des IPC temporaires volatiles n'ayant aucun sens à être sauvegardées.",
        explanationFr: "Exclure les sockets et répertoires /run."
      },
      {
        id: "opt-2",
        label: "Remplacer l'algorithme gzip (-z) par bzip2 (-j)",
        labelFr: "Remplacer l'algorithme gzip (-z) par bzip2 (-j)",
        isCorrect: false,
        explanation: "Le compresseur ne résout pas la nature du fichier socket.",
        explanationFr: "Le compresseur ne résout pas la nature du fichier socket."
      },
      {
        id: "opt-3",
        label: "Stopper définitivement MySQL pour toujours",
        labelFr: "Stopper définitivement MySQL pour toujours",
        isCorrect: false,
        explanation: "Inacceptable en environnement de production.",
        explanationFr: "Inacceptable en environnement de production."
      },
      {
        id: "opt-4",
        label: "Ajouter l'option -M pour multi-volume",
        labelFr: "Ajouter l'option -M pour multi-volume",
        isCorrect: false,
        explanation: "-M est réservé aux archives découpées sur bandes magnétiques.",
        explanationFr: "-M est réservé aux archives découpées sur bandes magnétiques."
      }
    ],
    correctedSnippet: `# Exclure les répertoires d'exécution volatiles et les sockets :
tar --exclude='/var/run' --exclude='*.sock' -czf /backup/var.tar.gz /var`,
    fixExplanation: "Exclure les sockets et répertoires temporaires lors de l'archivage tar.",
    fixExplanationFr: "Exclure les sockets et répertoires temporaires lors de l'archivage tar."
  },
  {
    id: "tb-lpic2-201-43",
    title: "Script d'automatisation échouant en tâche planifiée Cron ($PATH restreint)",
    titleFr: "Script d'automatisation échouant en tâche planifiée Cron ($PATH restreint)",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.3",
    category: "System Maintenance - Cron Automation",
    scenario: "Un script de maintenance s'exécute parfaitement lorsqu'il est lancé manuellement par root dans le terminal, mais échoue avec 'command not found' lorsqu'il est appelé par cron.",
    scenarioFr: "Un script de maintenance s'exécute parfaitement lorsqu'il est lancé manuellement par root dans le terminal, mais échoue avec 'command not found' lorsqu'il est appelé par cron.",
    codeSnippet: `# /etc/cron.d/maintenance
0 2 * * * root /usr/local/bin/cleanup.sh

# /usr/local/bin/cleanup.sh
#!/bin/bash
vgscan
fstrim -a
rclone sync /data remote:backup`,
    language: "cron",
    bugDescription: "L'environnement d'exécution de cron ne charge pas les profils shell (.bashrc / .profile) et possède un $PATH minimaliste (souvent /usr/bin:/bin). Les commandes dans /sbin, /usr/sbin ou /usr/local/bin échouent.",
    bugDescriptionFr: "L'environnement d'exécution de cron ne charge pas les profils shell (.bashrc / .profile) et possède un $PATH minimaliste (souvent /usr/bin:/bin). Les commandes dans /sbin, /usr/sbin ou /usr/local/bin échouent.",
    options: [
      {
        id: "opt-1",
        label: "Définir explicitement la variable PATH dans le script (ou utiliser les chemins absolus pour chaque binaire : /sbin/vgscan, /sbin/fstrim, etc.)",
        labelFr: "Définir explicitement la variable PATH dans le script (ou utiliser les chemins absolus pour chaque binaire : /sbin/vgscan, /sbin/fstrim, etc.)",
        isCorrect: true,
        explanation: "Cron exécute les scripts dans un sous-shell non interactif dépourvu de l'environnement standard de l'administrateur.",
        explanationFr: "Définir PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin dans le script ou le fichier cron."
      },
      {
        id: "opt-2",
        label: "Remplacer #!/bin/bash par #!/bin/csh",
        labelFr: "Remplacer #!/bin/bash par #!/bin/csh",
        isCorrect: false,
        explanation: "Changer de shell n'injecte pas les variables d'environnement manquantes de cron.",
        explanationFr: "Changer de shell n'injecte pas les variables d'environnement manquantes de cron."
      },
      {
        id: "opt-3",
        label: "Donner les permissions 777 au script",
        labelFr: "Donner les permissions 777 au script",
        isCorrect: false,
        explanation: "Le script s'exécute déjà sous root.",
        explanationFr: "Le script s'exécute déjà sous root."
      },
      {
        id: "opt-4",
        label: "Redémarrer le démon cron après chaque modification de script",
        labelFr: "Redémarrer le démon cron après chaque modification de script",
        isCorrect: false,
        explanation: "Cron détecte automatiquement les modifications de fichiers de spool.",
        explanationFr: "Cron détecte automatiquement les modifications de fichiers de spool."
      }
    ],
    correctedSnippet: `#!/bin/bash
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

/sbin/vgscan
/sbin/fstrim -a
/usr/local/bin/rclone sync /data remote:backup`,
    fixExplanation: "Spécifier un PATH complet et utiliser des chemins absolus dans les scripts cron.",
    fixExplanationFr: "Spécifier un PATH complet et utiliser des chemins absolus dans les scripts cron."
  },
  {
    id: "tb-lpic2-201-44",
    title: "Échec de vgreduce --removemissing : Volumes logiques toujours alloués",
    titleFr: "Échec de vgreduce --removemissing : Volumes logiques toujours alloués",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.3",
    category: "Advanced Storage - LVM Recovery",
    scenario: "Après la perte définitive d'un disque /dev/sdc membre du Volume Group vg0, l'administrateur tente de retirer le PV manquant avec vgreduce --removemissing vg0.",
    scenarioFr: "Après la perte définitive d'un disque /dev/sdc membre du Volume Group vg0, l'administrateur tente de retirer le PV manquant avec vgreduce --removemissing vg0.",
    codeSnippet: `# vgreduce --removemissing vg0
WARNING: Device for PV [unknown] has size 104857600 sectors, but extent count is 0.
Volume group "vg0" still has active LVs on missing PVs:
  data_lv: Extents on missing PVs
Cannot remove missing PV from "vg0" without --force.`,
    language: "bash",
    bugDescription: "LVM protège l'intégrité des données : il refuse de détacher un PV manquant si des volumes logiques non redondants y ont des blocs alloués, sauf si l'option --force est expressément fournie pour sacrifier ces LVs partiels.",
    bugDescriptionFr: "LVM protège l'intégrité des données : il refuse de détacher un PV manquant si des volumes logiques non redondants y ont des blocs alloués, sauf si l'option --force est expressément fournie pour sacrifier ces LVs partiels.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter l'option '--force' à vgreduce pour détruire les volumes logiques tronqués ou restaurer le LV depuis une sauvegarde",
        labelFr: "Ajouter l'option '--force' à vgreduce pour détruire les volumes logiques tronqués ou restaurer le LV depuis une sauvegarde",
        isCorrect: true,
        explanation: "vgreduce --removemissing --force retire le PV fantôme en supprimant obligatoirement les volumes logiques incomplets résidant dessus.",
        explanationFr: "Utiliser l'option --force pour purger les PVs manquants hébergeant des LVs orphelins."
      },
      {
        id: "opt-2",
        label: "Créer un fichier vide nommé /dev/sdc avec touch",
        labelFr: "Créer un fichier vide nommé /dev/sdc avec touch",
        isCorrect: false,
        explanation: "Un fichier régulier vide ne remplace pas un périphérique bloc LVM.",
        explanationFr: "Un fichier régulier vide ne remplace pas un périphérique bloc LVM."
      },
      {
        id: "opt-3",
        label: "Supprimer le répertoire /etc/lvm/",
        labelFr: "Supprimer le répertoire /etc/lvm/",
        isCorrect: false,
        explanation: "Cela détruirait toute la configuration LVM.",
        explanationFr: "Cela détruirait toute la configuration LVM."
      },
      {
        id: "opt-4",
        label: "Formater la mémoire RAM",
        labelFr: "Formater la mémoire RAM",
        isCorrect: false,
        explanation: "Absurde.",
        explanationFr: "Absurde."
      }
    ],
    correctedSnippet: `# Si le LV n'est plus récupérable, forcer le retrait :
vgreduce --removemissing --force vg0`,
    fixExplanation: "Employer 'vgreduce --removemissing --force' pour purger le groupe de volumes.",
    fixExplanationFr: "Employer 'vgreduce --removemissing --force' pour purger le groupe de volumes."
  },
  {
    id: "tb-lpic2-201-45",
    title: "Passerelle NAT iptables inopérante (ip_forward désactivé)",
    titleFr: "Passerelle NAT iptables inopérante (ip_forward désactivé)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.1",
    category: "Network Configuration - NAT & Packet Forwarding",
    scenario: "L'administrateur configure une règle de masquage NAT avec iptables sur une passerelle Linux. Pourtant, aucun client du réseau local ne peut joindre internet.",
    scenarioFr: "L'administrateur configure une règle de masquage NAT avec iptables sur une passerelle Linux. Pourtant, aucun client du réseau local ne peut joindre internet.",
    codeSnippet: `# iptables -t nat -L POSTROUTING -n -v
Chain POSTROUTING (policy ACCEPT 10 packets, 600 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 MASQUERADE  all  --  *      eth0    192.168.1.0/24       0.0.0.0/0           

# cat /proc/sys/net/ipv4/ip_forward
0`,
    language: "bash",
    bugDescription: "Le routage des paquets entre interfaces au niveau du noyau Linux est désactivé (/proc/sys/net/ipv4/ip_forward = 0). Le noyau jette silencieusement les paquets non destinés à sa propre IP locale.",
    bugDescriptionFr: "Le routage des paquets entre interfaces au niveau du noyau Linux est désactivé (/proc/sys/net/ipv4/ip_forward = 0). Le noyau jette silencieusement les paquets non destinés à sa propre IP locale.",
    options: [
      {
        id: "opt-1",
        label: "Activer le transfert de paquets IPv4 au niveau du noyau avec 'sysctl -w net.ipv4.ip_forward=1' et le pérenniser dans sysctl.conf",
        labelFr: "Activer le transfert de paquets IPv4 au niveau du noyau avec 'sysctl -w net.ipv4.ip_forward=1' et le pérenniser dans sysctl.conf",
        isCorrect: true,
        explanation: "Une passerelle NAT ne peut pas fonctionner sans l'activation de net.ipv4.ip_forward.",
        explanationFr: "Activer net.ipv4.ip_forward=1 dans sysctl."
      },
      {
        id: "opt-2",
        label: "Remplacer MASQUERADE par SNAT sans spécifier d'adresse IP",
        labelFr: "Remplacer MASQUERADE par SNAT sans spécifier d'adresse IP",
        isCorrect: false,
        explanation: "SNAT exige impérativement une adresse IP cible (--to-source).",
        explanationFr: "SNAT exige impérativement une adresse IP cible."
      },
      {
        id: "opt-3",
        label: "Désactiver le protocole TCP dans le pare-feu",
        labelFr: "Désactiver le protocole TCP dans le pare-feu",
        isCorrect: false,
        explanation: "Cela couperait les flux web et applicatifs.",
        explanationFr: "Cela couperait les flux web et applicatifs."
      },
      {
        id: "opt-4",
        label: "Ajouter l'option -j DROP dans la table POSTROUTING",
        labelFr: "Ajouter l'option -j DROP dans la table POSTROUTING",
        isCorrect: false,
        explanation: "DROP rejetterait tous les paquets sortants.",
        explanationFr: "DROP rejetterait tous les paquets sortants."
      }
    ],
    correctedSnippet: `# Activer le routage immédiat :
sysctl -w net.ipv4.ip_forward=1
# Rendre permanent :
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.d/99-nat.conf`,
    fixExplanation: "Activer le transfert de paquets avec 'sysctl -w net.ipv4.ip_forward=1'.",
    fixExplanationFr: "Activer le transfert de paquets avec 'sysctl -w net.ipv4.ip_forward=1'."
  },
  {
    id: "tb-lpic2-201-46",
    title: "Échec d'authentification SSH non-interactive dans un script rsync (Host key verification failed)",
    titleFr: "Échec d'authentification SSH non-interactive dans un script rsync (Host key verification failed)",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.2",
    category: "System Maintenance - Rsync over SSH",
    scenario: "Une tâche cron nocturne synchronise des sauvegardes vers un nouveau serveur distant. Le journal d'erreur indique 'Host key verification failed'.",
    scenarioFr: "Une tâche cron nocturne synchronise des sauvegardes vers un nouveau serveur distant. Le journal d'erreur indique 'Host key verification failed'.",
    codeSnippet: `# rsync -avz -e ssh /backup/ user@backup.example.com:/remote/backup/
Host key verification failed.
rsync: connection unexpectedly closed (0 bytes received so far) [sender]
rsync error: error in rsync protocol data stream (code 12) at io.c(231) [sender=3.2.7]`,
    language: "bash",
    bugDescription: "La clé d'hôte SSH du serveur distant n'a jamais été enregistrée dans le fichier ~/.ssh/known_hosts de l'utilisateur exécutant la commande non-interactive.",
    bugDescriptionFr: "La clé d'hôte SSH du serveur distant n'a jamais été enregistrée dans le fichier ~/.ssh/known_hosts de l'utilisateur exécutant la commande non-interactive.",
    options: [
      {
        id: "opt-1",
        label: "Effectuer une première connexion SSH manuelle pour valider l'empreinte de clé, ou utiliser 'ssh-keyscan backup.example.com >> ~/.ssh/known_hosts'",
        labelFr: "Effectuer une première connexion SSH manuelle pour valider l'empreinte de clé, ou utiliser 'ssh-keyscan backup.example.com >> ~/.ssh/known_hosts'",
        isCorrect: true,
        explanation: "SSH refuse d'établir une connexion non-interactive si l'empreinte du serveur distant n'est pas présente dans known_hosts.",
        explanationFr: "Ajouter l'empreinte du serveur dans known_hosts avec ssh-keyscan."
      },
      {
        id: "opt-2",
        label: "Désactiver le chiffrement AES dans le client SSH",
        labelFr: "Désactiver le chiffrement AES dans le client SSH",
        isCorrect: false,
        explanation: "Le chiffrement n'a aucun lien avec la vérification d'hôte.",
        explanationFr: "Le chiffrement n'a aucun lien avec la vérification d'hôte."
      },
      {
        id: "opt-3",
        label: "Remplacer l'utilisateur user par root sur la cible",
        labelFr: "Remplacer l'utilisateur user par root sur la cible",
        isCorrect: false,
        explanation: "La vérification de clé d'hôte s'applique à tous les utilisateurs.",
        explanationFr: "La vérification de clé d'hôte s'applique à tous les utilisateurs."
      },
      {
        id: "opt-4",
        label: "Supprimer le binaire ssh du serveur",
        labelFr: "Supprimer le binaire ssh du serveur",
        isCorrect: false,
        explanation: "Absurde.",
        explanationFr: "Absurde."
      }
    ],
    correctedSnippet: `# Ajouter la clé d'hôte au trousseau known_hosts :
ssh-keyscan backup.example.com >> ~/.ssh/known_hosts
# Relancer la sauvegarde :
rsync -avz -e ssh /backup/ user@backup.example.com:/remote/backup/`,
    fixExplanation: "Ajouter la clé publique du serveur dans ~/.ssh/known_hosts via ssh-keyscan.",
    fixExplanationFr: "Ajouter la clé publique du serveur dans ~/.ssh/known_hosts via ssh-keyscan."
  },
  {
    id: "tb-lpic2-201-47",
    title: "Paquets SYN reçus sans SYN-ACK émis (Filtrage INPUT ou service non lié)",
    titleFr: "Paquets SYN reçus sans SYN-ACK émis (Filtrage INPUT ou service non lié)",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.3",
    category: "Network Troubleshooting - Packet Capture Diagnosis",
    scenario: "Les clients n'arrivent pas à joindre le service HTTP. Une capture tcpdump sur eth0 montre l'arrivée répétée de paquets [S] (SYN), mais le serveur ne répond jamais par un [S.] (SYN-ACK).",
    scenarioFr: "Les clients n'arrivent pas à joindre le service HTTP. Une capture tcpdump sur eth0 montre l'arrivée répétée de paquets [S] (SYN), mais le serveur ne répond jamais par un [S.] (SYN-ACK).",
    codeSnippet: `# tcpdump -nn -i eth0 port 80
14:10:01.120 IP 192.168.1.50.54321 > 192.168.1.10.80: Flags [S], seq 1000
14:10:02.122 IP 192.168.1.50.54321 > 192.168.1.10.80: Flags [S], seq 1000

# ss -tulpn | grep :80
# Aucun résultat`,
    language: "bash",
    bugDescription: "Aucun service web (Apache/Nginx) n'écoute sur le port 80, ou le pare-feu local jette les paquets en chaîne INPUT.",
    bugDescriptionFr: "Aucun service web (Apache/Nginx) n'écoute sur le port 80, ou le pare-feu local jette les paquets en chaîne INPUT.",
    options: [
      {
        id: "opt-1",
        label: "Le service de serveur web n'est pas démarré ou n'écoute pas sur le port 80 (ss ne retourne aucun processus à l'écoute)",
        labelFr: "Le service de serveur web n'est pas démarré ou n'écoute pas sur le port 80 (ss ne retourne aucun processus à l'écoute)",
        isCorrect: true,
        explanation: "Si tcpdump voit passer les SYN mais qu'aucune socket n'est ouverte sur le port, le système ignore ou rejette les connexions.",
        explanationFr: "Démarrer le serveur web ou ouvrir le port dans le pare-feu."
      },
      {
        id: "opt-2",
        label: "L'adresse MAC de la passerelle est erronée",
        labelFr: "L'adresse MAC de la passerelle est erronée",
        isCorrect: false,
        explanation: "Les paquets SYN parviennent bien sur l'interface eth0.",
        explanationFr: "Les paquets SYN parviennent bien sur l'interface eth0."
      },
      {
        id: "opt-3",
        label: "La commande tcpdump consomme 100% de la bande passante",
        labelFr: "La commande tcpdump consomme 100% de la bande passante",
        isCorrect: false,
        explanation: "tcpdump capture passivement les paquets sans bloquer le trafic.",
        explanationFr: "tcpdump capture passivement les paquets sans bloquer le trafic."
      },
      {
        id: "opt-4",
        label: "Le port 80 est réservé au protocole FTP",
        labelFr: "Le port 80 est réservé au protocole FTP",
        isCorrect: false,
        explanation: "Le port 80 est le port HTTP standard.",
        explanationFr: "Le port 80 est le port HTTP standard."
      }
    ],
    correctedSnippet: `# Démarrer le serveur web :
systemctl start nginx
# Vérifier l'écoute sur le port 80 :
ss -tulpn | grep :80`,
    fixExplanation: "Démarrer le démon web pour ouvrir la socket sur le port 80.",
    fixExplanationFr: "Démarrer le démon web pour ouvrir la socket sur le port 80."
  },
  {
    id: "tb-lpic2-201-48",
    title: "Sous-allocation d'extents LVM (PE Size) limitant la taille d'un LV",
    titleFr: "Sous-allocation d'extents LVM (PE Size) limitant la taille d'un LV",
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: "204.3",
    category: "Advanced Storage - LVM Physical Extents",
    scenario: "Sur un ancien Volume Group LVM créé avec une taille d'extent de 1 Mo, la création d'un volume de 70 To échoue.",
    scenarioFr: "Sur un ancien Volume Group LVM créé avec une taille d'extent de 1 Mo, la création d'un volume de 70 To échoue.",
    codeSnippet: `# vgdisplay vg_old | grep "PE Size"
  PE Size               1.00 MiB

# lvcreate -L 70T -n lv_huge vg_old
  Maximum extents per logical volume exceeded (65536 extents limit on legacy LVM1 metadata).`,
    language: "bash",
    bugDescription: "Les métadonnées LVM de première génération ou certains formats limitent les LVs à 65536 extents. Avec une taille de PE de 1 Mo, la taille maximale est restreinte.",
    bugDescriptionFr: "Les métadonnées LVM de première génération ou certains formats limitent les LVs à 65536 extents. Avec une taille de PE de 1 Mo, la taille maximale est restreinte.",
    options: [
      {
        id: "opt-1",
        label: "Reconfigurer le volume group avec des Physical Extents (PE) de plus grande dimension (ex: 64M) ou migrer les métadonnées vers LVM2 moderne",
        labelFr: "Reconfigurer le volume group avec des Physical Extents (PE) de plus grande dimension (ex: 64M) ou migrer les métadonnées vers LVM2 moderne",
        isCorrect: true,
        explanation: "vgcreate -s permet de choisir la taille des PE (ex: 4M, 16M, 64M) pour les très grands volumes.",
        explanationFr: "Ajuster la taille des Physical Extents avec l'option -s de vgcreate."
      },
      {
        id: "opt-2",
        label: "Formater les disques en FAT16",
        labelFr: "Formater les disques en FAT16",
        isCorrect: false,
        explanation: "FAT16 est limité à 2 Go.",
        explanationFr: "FAT16 est limité à 2 Go."
      },
      {
        id: "opt-3",
        label: "Utiliser fdisk plutôt que LVM",
        labelFr: "Utiliser fdisk plutôt que LVM",
        isCorrect: false,
        explanation: "fdisk MBR est limité à 2 To.",
        explanationFr: "fdisk MBR est limité à 2 To."
      },
      {
        id: "opt-4",
        label: "Augmenter la RAM physique",
        labelFr: "Augmenter la RAM physique",
        isCorrect: false,
        explanation: "La limite d'extents est une structure de métadonnées de stockage.",
        explanationFr: "La limite d'extents est une structure de métadonnées de stockage."
      }
    ],
    correctedSnippet: `# Créer un VG moderne avec extents de 64 Mo :
vgcreate -s 64M vg_storage /dev/sdb
# Créer le volume logique :
lvcreate -l 100%FREE -n lv_huge vg_storage`,
    fixExplanation: "Utiliser une taille de PE appropriée avec vgcreate -s.",
    fixExplanationFr: "Utiliser une taille de PE appropriée avec vgcreate -s."
  },
  {
    id: "tb-lpic2-201-49",
    title: "Restauration incrémentale cpio incomplète : Option -d manquante",
    titleFr: "Restauration incrémentale cpio incomplète : Option -d manquante",
    certification: 'lpic-2',
    topicNumber: 206,
    objectiveId: "206.2",
    category: "System Maintenance - CPIO Restoration",
    scenario: "L'administrateur restaure une archive cpio dans un nouveau répertoire. Des centaines de fichiers ne sont pas extraits avec le message 'cannot create directory'.",
    scenarioFr: "L'administrateur restaure une archive cpio dans un nouveau répertoire. Des centaines de fichiers ne sont pas extraits avec le message 'cannot create directory'.",
    codeSnippet: `# cpio -id < /backup/archive.cpio
cpio: etc/nginx/conf.d/default.conf: Cannot create directory: No such file or directory
cpio: var/log/apache2/access.log: Cannot create directory: No such file or directory`,
    language: "bash",
    bugDescription: "Par défaut, cpio ne crée pas les répertoires parents manquants lors de l'extraction. L'option -d (--make-directories) est indispensable.",
    bugDescriptionFr: "Par défaut, cpio ne crée pas les répertoires parents manquants lors de l'extraction. L'option -d (--make-directories) est indispensable.",
    options: [
      {
        id: "opt-1",
        label: "L'option '-d' (--make-directories) doit être passée à cpio pour créer automatiquement l'arborescence des dossiers parents manquants",
        labelFr: "L'option '-d' (--make-directories) doit être passée à cpio pour créer automatiquement l'arborescence des dossiers parents manquants",
        isCorrect: true,
        explanation: "En mode extraction (-i), cpio -id crée automatiquement les sous-répertoires si nécessaire.",
        explanationFr: "Ajouter l'option -d à la commande cpio d'extraction."
      },
      {
        id: "opt-2",
        label: "L'archive doit être convertie en zip",
        labelFr: "L'archive doit être convertie en zip",
        isCorrect: false,
        explanation: "cpio est un outil standard autonome.",
        explanationFr: "cpio est un outil standard autonome."
      },
      {
        id: "opt-3",
        label: "Il faut exécuter cpio depuis le compte nobody",
        labelFr: "Il faut exécuter cpio depuis le compte nobody",
        isCorrect: false,
        explanation: "Cela réduirait encore plus les droits d'écriture.",
        explanationFr: "Cela réduirait encore plus les droits d'écriture."
      },
      {
        id: "opt-4",
        label: "L'option -o doit être utilisée pour restaurer",
        labelFr: "L'option -o doit être utilisée pour restaurer",
        isCorrect: false,
        explanation: "-o correspond à la création d'archive (output), alors que -i correspond à l'extraction (input).",
        explanationFr: "-o sert à créer une archive, pas à extraire."
      }
    ],
    correctedSnippet: `# Extraire avec création des répertoires (-d) et préservation des dates (-m) :
cpio -idm < /backup/archive.cpio`,
    fixExplanation: "Ajouter le drapeau '-d' pour que cpio crée les sous-dossiers nécessaires.",
    fixExplanationFr: "Ajouter le drapeau '-d' pour que cpio crée les sous-dossiers nécessaires."
  },
  {
    id: "tb-lpic2-201-50",
    title: "Conflit d'adresse IP statique détecté via arping",
    titleFr: "Conflit d'adresse IP statique détecté via arping",
    certification: 'lpic-2',
    topicNumber: 205,
    objectiveId: "205.3",
    category: "Network Troubleshooting - IP Conflict Detection",
    scenario: "Un serveur fraîchement configuré avec l'IP 192.168.1.50 subit des déconnexions réseau aléatoires. L'administrateur LPIC-2 soupçonne une adresse IP en double.",
    scenarioFr: "Un serveur fraîchement configuré avec l'IP 192.168.1.50 subit des déconnexions réseau aléatoires. L'administrateur LPIC-2 soupçonne une adresse IP en double.",
    codeSnippet: `# arping -I eth0 -c 3 192.168.1.50
ARPING 192.168.1.50 from 192.168.1.50 eth0
Unicast reply from 192.168.1.50 [52:54:00:aa:bb:cc]  0.812ms
Unicast reply from 192.168.1.50 [b8:27:eb:11:22:33]  1.420ms
Sent 3 probes (1 broadcast(s))
Received 2 response(s)`,
    language: "bash",
    bugDescription: "Deux adresses MAC différentes (52:54:00:aa:bb:cc et b8:27:eb:11:22:33) répondent à la requête ARP pour 192.168.1.50, confirmant un conflit d'adresses IP sur le segment Ethernet.",
    bugDescriptionFr: "Deux adresses MAC différentes (52:54:00:aa:bb:cc et b8:27:eb:11:22:33) répondent à la requête ARP pour 192.168.1.50, confirmant un conflit d'adresses IP sur le segment Ethernet.",
    options: [
      {
        id: "opt-1",
        label: "Conflit d'adresse IP critique : deux équipements distincts possèdent la même IP 192.168.1.50, comme le prouvent les deux réponses MAC reçues par arping",
        labelFr: "Conflit d'adresse IP critique : deux équipements distincts possèdent la même IP 192.168.1.50, comme le prouvent les deux réponses MAC reçues par arping",
        isCorrect: true,
        explanation: "Si plusieurs adresses MAC répondent pour une même IP lors d'un arping, un autre équipement utilise déjà cette IP sur le réseau local.",
        explanationFr: "Identifier l'autre hôte via son adresse MAC et changer l'adresse IP en doublon."
      },
      {
        id: "opt-2",
        label: "La carte réseau est en train d'exécuter un bonding LACP",
        labelFr: "La carte réseau est en train d'exécuter un bonding LACP",
        isCorrect: false,
        explanation: "Les réponses proviennent de constructeurs différents (QEMU/KVM vs Raspberry Pi).",
        explanationFr: "Les réponses proviennent de constructeurs différents."
      },
      {
        id: "opt-3",
        label: "Le protocole ARP a été remplacé par DHCPv6",
        labelFr: "Le protocole ARP a été remplacé par DHCPv6",
        isCorrect: false,
        explanation: "ARP est un protocole IPv4 fondamental.",
        explanationFr: "ARP est un protocole IPv4 fondamental."
      },
      {
        id: "opt-4",
        label: "Le câble Ethernet est trop long",
        labelFr: "Le câble Ethernet est trop long",
        isCorrect: false,
        explanation: "La longueur du câble n'invente pas des adresses MAC de réponse.",
        explanationFr: "La longueur du câble n'invente pas des adresses MAC de réponse."
      }
    ],
    correctedSnippet: `# Relever la MAC coupable (ex: b8:27:eb:11:22:33) :
# Isoler le port sur le commutateur et attribuer une nouvelle IP libre au serveur :
ip addr del 192.168.1.50/24 dev eth0
ip addr add 192.168.1.51/24 dev eth0`,
    fixExplanation: "Localiser la machine en conflit et assigner une IP statique libre.",
    fixExplanationFr: "Localiser la machine en conflit et assigner une IP statique libre."
  }
];
