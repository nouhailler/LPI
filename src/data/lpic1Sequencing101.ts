import { SequencingChallenge } from '../types';

export const lpic1Sequencing101: SequencingChallenge[] = [
  {
    "id": "seq-lpic1-01",
    "title": "Séquence de démarrage BIOS hérité & MBR",
    "titleFr": "Séquence de démarrage BIOS hérité & MBR",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.2",
    "category": "Architecture Système",
    "description": "Ordonnez les étapes chronologiques du démarrage d'une machine Linux utilisant un micrologiciel BIOS traditionnel et une table de partitions MBR.",
    "descriptionFr": "Ordonnez les étapes chronologiques du démarrage d'une machine Linux utilisant un micrologiciel BIOS traditionnel et une table de partitions MBR.",
    "steps": [
      {
        "id": "s1",
        "label": "1. POST (Power-On Self-Test) du BIOS",
        "labelFr": "1. POST (Power-On Self-Test) du BIOS",
        "detail": "Vérification des composants matériels (CPU, RAM, bus) par le micrologiciel de la carte mère.",
        "detailFr": "Vérification des composants matériels (CPU, RAM, bus) par le micrologiciel de la carte mère."
      },
      {
        "id": "s2",
        "label": "2. Lecture du MBR (Master Boot Record)",
        "labelFr": "2. Lecture du MBR (Master Boot Record)",
        "detail": "Le BIOS charge en mémoire les premiers 512 octets du premier disque amorçable (GRUB Stage 1).",
        "detailFr": "Le BIOS charge en mémoire les premiers 512 octets du premier disque amorçable (GRUB Stage 1)."
      },
      {
        "id": "s3",
        "label": "3. Exécution de GRUB Stage 1.5 / Stage 2",
        "labelFr": "3. Exécution de GRUB Stage 1.5 / Stage 2",
        "detail": "Chargement des pilotes de systèmes de fichiers puis affichage du menu de sélection du noyau.",
        "detailFr": "Chargement des pilotes de systèmes de fichiers puis affichage du menu de sélection du noyau."
      },
      {
        "id": "s4",
        "label": "4. Chargement du Noyau (vmlinuz) et Initramfs",
        "labelFr": "4. Chargement du Noyau (vmlinuz) et Initramfs",
        "detail": "Le chargeur place le noyau compressé et l'image racine temporaire en RAM et passe la main.",
        "detailFr": "Le chargeur place le noyau compressé et l'image racine temporaire en RAM et passe la main."
      },
      {
        "id": "s5",
        "label": "5. Démarrage de l'Init (SysVinit / Systemd PID 1)",
        "labelFr": "5. Démarrage de l'Init (SysVinit / Systemd PID 1)",
        "detail": "Le noyau monte la vraie racine disque et exécute le premier processus de l'espace utilisateur.",
        "detailFr": "Le noyau monte la vraie racine disque et exécute le premier processus de l'espace utilisateur."
      }
    ],
    "explanation": "Sur une architecture BIOS/MBR, la séquence débute par le POST, suivi de la lecture du secteur MBR (512 octets contenant le Stage 1). Ce dernier active le Stage 1.5/2 qui comprend les pilotes de disques pour charger le noyau vmlinuz et l'initramfs, qui à leur tour initialisent le PID 1.",
    "explanationFr": "Sur une architecture BIOS/MBR, la séquence débute par le POST, suivi de la lecture du secteur MBR (512 octets contenant le Stage 1). Ce dernier active le Stage 1.5/2 qui comprend les pilotes de disques pour charger le noyau vmlinuz et l'initramfs, qui à leur tour initialisent le PID 1."
  },
  {
    "id": "seq-lpic1-02",
    "title": "Séquence de démarrage moderne UEFI & GPT",
    "titleFr": "Séquence de démarrage moderne UEFI & GPT",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.2",
    "category": "Architecture Système",
    "description": "Replacez dans l'ordre exact le processus d'amorçage moderne basé sur le micrologiciel UEFI et une partition système EFI.",
    "descriptionFr": "Replacez dans l'ordre exact le processus d'amorçage moderne basé sur le micrologiciel UEFI et une partition système EFI.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Initialisation UEFI et variables NVRAM",
        "labelFr": "1. Initialisation UEFI et variables NVRAM",
        "detail": "Le micrologiciel UEFI initialise le matériel et consulte les entrées de boot enregistrées en NVRAM.",
        "detailFr": "Le micrologiciel UEFI initialise le matériel et consulte les entrées de boot enregistrées en NVRAM."
      },
      {
        "id": "s2",
        "label": "2. Chargement de l'exécutable EFI depuis l'ESP",
        "labelFr": "2. Chargement de l'exécutable EFI depuis l'ESP",
        "detail": "Lecture du fichier binaire PE/COFF (ex: /boot/efi/EFI/debian/grubx64.efi) sur la partition FAT32 ESP.",
        "detailFr": "Lecture du fichier binaire PE/COFF (ex: /boot/efi/EFI/debian/grubx64.efi) sur la partition FAT32 ESP."
      },
      {
        "id": "s3",
        "label": "3. Menu GRUB2 et sélection du noyau",
        "labelFr": "3. Menu GRUB2 et sélection du noyau",
        "detail": "Parsing de grub.cfg, affichage graphique du menu et chargement en mémoire de vmlinuz et initramfs.",
        "detailFr": "Parsing de grub.cfg, affichage graphique du menu et chargement en mémoire de vmlinuz et initramfs."
      },
      {
        "id": "s4",
        "label": "4. Exécution de l'Initramfs et pivot_root",
        "labelFr": "4. Exécution de l'Initramfs et pivot_root",
        "detail": "Chargement des modules de stockage (NVMe, RAID, LVM) et pivotement vers la véritable racine sur disque.",
        "detailFr": "Chargement des modules de stockage (NVMe, RAID, LVM) et pivotement vers la véritable racine sur disque."
      },
      {
        "id": "s5",
        "label": "5. Lancement de Systemd et default.target",
        "labelFr": "5. Lancement de Systemd et default.target",
        "detail": "Initialisation du gestionnaire de système (PID 1) et activation concurrente des unités de services.",
        "detailFr": "Initialisation du gestionnaire de système (PID 1) et activation concurrente des unités de services."
      }
    ],
    "explanation": "Contrairement au BIOS, l'UEFI est capable de lire nativement une partition FAT32 (l'ESP). Il exécute directement grubx64.efi qui charge le noyau et l'initramfs, lequel configure le stockage nécessaire avant le pivot_root vers systemd.",
    "explanationFr": "Contrairement au BIOS, l'UEFI est capable de lire nativement une partition FAT32 (l'ESP). Il exécute directement grubx64.efi qui charge le noyau et l'initramfs, lequel configure le stockage nécessaire avant le pivot_root vers systemd."
  },
  {
    "id": "seq-lpic1-03",
    "title": "Arborescence d'amorçage Systemd (Targets)",
    "titleFr": "Arborescence d'amorçage Systemd (Targets)",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.3",
    "category": "Architecture Système",
    "description": "Ordonnez les cibles (targets) principales traversées par Systemd depuis la fin de l'initramfs jusqu'à l'écran de connexion graphique.",
    "descriptionFr": "Ordonnez les cibles (targets) principales traversées par Systemd depuis la fin de l'initramfs jusqu'à l'écran de connexion graphique.",
    "steps": [
      {
        "id": "s1",
        "label": "1. sysinit.target",
        "labelFr": "1. sysinit.target",
        "detail": "Montage des systèmes de fichiers critiques (/proc, /sys), activation du swap et chiffrement cryptsetup.",
        "detailFr": "Montage des systèmes de fichiers critiques (/proc, /sys), activation du swap et chiffrement cryptsetup."
      },
      {
        "id": "s2",
        "label": "2. basic.target",
        "labelFr": "2. basic.target",
        "detail": "Initialisation des sockets, timers, chemins udev et pilotes matériels de base.",
        "detailFr": "Initialisation des sockets, timers, chemins udev et pilotes matériels de base."
      },
      {
        "id": "s3",
        "label": "3. network.target / network-online.target",
        "labelFr": "3. network.target / network-online.target",
        "detail": "Configuration des interfaces réseaux et obtention de la connectivité IP.",
        "detailFr": "Configuration des interfaces réseaux et obtention de la connectivité IP."
      },
      {
        "id": "s4",
        "label": "4. multi-user.target",
        "labelFr": "4. multi-user.target",
        "detail": "Démarrage des démons serveurs (SSH, Cron, Rsyslog) et consoles texte virtuelles TTY.",
        "detailFr": "Démarrage des démons serveurs (SSH, Cron, Rsyslog) et consoles texte virtuelles TTY."
      },
      {
        "id": "s5",
        "label": "5. graphical.target",
        "labelFr": "5. graphical.target",
        "detail": "Lancement du gestionnaire d'affichage (Display Manager GDM/LightDM) et de l'interface bureau.",
        "detailFr": "Lancement du gestionnaire d'affichage (Display Manager GDM/LightDM) et de l'interface bureau."
      }
    ],
    "explanation": "La chaîne de dépendances Systemd est hiérarchique : sysinit.target prépare le système bas niveau, basic.target arme les composants d'infrastructure, multi-user.target lance les services système généraux, et graphical.target couronne le tout avec le serveur graphique.",
    "explanationFr": "La chaîne de dépendances Systemd est hiérarchique : sysinit.target prépare le système bas niveau, basic.target arme les composants d'infrastructure, multi-user.target lance les services système généraux, et graphical.target couronne le tout avec le serveur graphique."
  },
  {
    "id": "seq-lpic1-04",
    "title": "Traitement d'un événement matériel Udev (Hotplug)",
    "titleFr": "Traitement d'un événement matériel Udev (Hotplug)",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.1",
    "category": "Architecture Système",
    "description": "Lors du branchement à chaud d'un périphérique USB, dans quel ordre le noyau et le démon udev réagissent-ils pour créer le nœud de périphérique ?",
    "descriptionFr": "Lors du branchement à chaud d'un périphérique USB, dans quel ordre le noyau et le démon udev réagissent-ils pour créer le nœud de périphérique ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Détection matérielle par le pilote de bus du Noyau",
        "labelFr": "1. Détection matérielle par le pilote de bus du Noyau",
        "detail": "Le contrôleur xHCI détecte la variation électrique et le noyau alloue une structure interne.",
        "detailFr": "Le contrôleur xHCI détecte la variation électrique et le noyau alloue une structure interne."
      },
      {
        "id": "s2",
        "label": "2. Émission d'un uevent via socket Netlink",
        "labelFr": "2. Émission d'un uevent via socket Netlink",
        "detail": "Le sous-système noyau génère un message 'add' contenant les identifiants VID/PID et classes matérielles.",
        "detailFr": "Le sous-système noyau génère un message 'add' contenant les identifiants VID/PID et classes matérielles."
      },
      {
        "id": "s3",
        "label": "3. Réception et évaluation par systemd-udevd",
        "labelFr": "3. Réception et évaluation par systemd-udevd",
        "detail": "Le démon udev compare l'événement aux règles définies dans /etc/udev/rules.d/ et /lib/udev/rules.d/.",
        "detailFr": "Le démon udev compare l'événement aux règles définies dans /etc/udev/rules.d/ et /lib/udev/rules.d/."
      },
      {
        "id": "s4",
        "label": "4. Création du fichier spécial de périphérique dans /dev",
        "labelFr": "4. Création du fichier spécial de périphérique dans /dev",
        "detail": "Attribution du nom (ex: /dev/sdb1), création de liens symboliques persistants et assignation des permissions POSIX.",
        "detailFr": "Attribution du nom (ex: /dev/sdb1), création de liens symboliques persistants et assignation des permissions POSIX."
      },
      {
        "id": "s5",
        "label": "5. Exécution de scripts ou déclencheurs RUN",
        "labelFr": "5. Exécution de scripts ou déclencheurs RUN",
        "detail": "Lancement d'actions utilisateurs associées (montage automatique, notification de bureau).",
        "detailFr": "Lancement d'actions utilisateurs associées (montage automatique, notification de bureau)."
      }
    ],
    "explanation": "Le noyau détecte le composant et notifie l'espace utilisateur via un uevent sur une socket netlink. Le démon systemd-udevd reçoit cet événement, évalue ses règles ordonnées (*.rules), crée le nœud correspondant dans /dev (devtmpfs) et exécute les directives RUN.",
    "explanationFr": "Le noyau détecte le composant et notifie l'espace utilisateur via un uevent sur une socket netlink. Le démon systemd-udevd reçoit cet événement, évalue ses règles ordonnées (*.rules), crée le nœud correspondant dans /dev (devtmpfs) et exécute les directives RUN."
  },
  {
    "id": "seq-lpic1-05",
    "title": "Résolution et chargement d'un module de noyau Linux",
    "titleFr": "Résolution et chargement d'un module de noyau Linux",
    "certification": "lpic-1",
    "topicNumber": 101,
    "objectiveId": "101.1",
    "category": "Architecture Système",
    "description": "Ordonnez les étapes exécutées par la commande 'modprobe' pour insérer dynamiquement un module de périphérique et ses dépendances.",
    "descriptionFr": "Ordonnez les étapes exécutées par la commande 'modprobe' pour insérer dynamiquement un module de périphérique et ses dépendances.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Appel de 'modprobe <nom_module>'",
        "labelFr": "1. Appel de 'modprobe <nom_module>'",
        "detail": "L'administrateur ou udev demande l'insertion d'un module spécifique par son alias ou son nom.",
        "detailFr": "L'administrateur ou udev demande l'insertion d'un module spécifique par son alias ou son nom."
      },
      {
        "id": "s2",
        "label": "2. Consultation de modules.dep dans /lib/modules/$(uname -r)/",
        "labelFr": "2. Consultation de modules.dep dans /lib/modules/$(uname -r)/",
        "detail": "Lecture de la base de dépendances générée préalablement par depmod pour calculer l'arbre de prérequis.",
        "detailFr": "Lecture de la base de dépendances générée préalablement par depmod pour calculer l'arbre de prérequis."
      },
      {
        "id": "s3",
        "label": "3. Application des options et blacklist de /etc/modprobe.d/",
        "labelFr": "3. Application des options et blacklist de /etc/modprobe.d/",
        "detail": "Vérification des directives d'exclusion (blacklist) et des paramètres personnalisés d'initialisation.",
        "detailFr": "Vérification des directives d'exclusion (blacklist) et des paramètres personnalisés d'initialisation."
      },
      {
        "id": "s4",
        "label": "4. Chargement préalable des dépendances en mémoire",
        "labelFr": "4. Chargement préalable des dépendances en mémoire",
        "detail": "Insertion des modules parents indispensables via l'appel système init_module / finit_module.",
        "detailFr": "Insertion des modules parents indispensables via l'appel système init_module / finit_module."
      },
      {
        "id": "s5",
        "label": "5. Insertion finale du module cible et enregistrement dans /proc/modules",
        "labelFr": "5. Insertion finale du module cible et enregistrement dans /proc/modules",
        "detail": "Le module est désormais actif et consultable via la commande lsmod.",
        "detailFr": "Le module est désormais actif et consultable via la commande lsmod."
      }
    ],
    "explanation": "Contrairement à insmod qui requiert le chemin direct du fichier .ko et ne gère aucune dépendance, modprobe consulte modules.dep, applique les filtres de /etc/modprobe.d/, charge récursivement les dépendances requises, puis injecte le module final dans le noyau.",
    "explanationFr": "Contrairement à insmod qui requiert le chemin direct du fichier .ko et ne gère aucune dépendance, modprobe consulte modules.dep, applique les filtres de /etc/modprobe.d/, charge récursivement les dépendances requises, puis injecte le module final dans le noyau."
  },
  {
    "id": "seq-lpic1-06",
    "title": "Cycle de compilation d'un logiciel depuis les sources",
    "titleFr": "Cycle de compilation d'un logiciel depuis les sources",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.4",
    "category": "Gestion des Paquets & Logiciels",
    "description": "Ordonnez les commandes classiques de la méthode GNU Autotools pour compiler et installer un programme à partir d'une archive tarball.",
    "descriptionFr": "Ordonnez les commandes classiques de la méthode GNU Autotools pour compiler et installer un programme à partir d'une archive tarball.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Extraction de l'archive tar -xzf archive.tar.gz",
        "labelFr": "1. Extraction de l'archive tar -xzf archive.tar.gz",
        "detail": "Décompression des fichiers sources et entrée dans le répertoire créé.",
        "detailFr": "Décompression des fichiers sources et entrée dans le répertoire créé."
      },
      {
        "id": "s2",
        "label": "2. Exécution du script de configuration : ./configure",
        "labelFr": "2. Exécution du script de configuration : ./configure",
        "detail": "Vérification des dépendances, du compilateur C (gcc) et génération du fichier Makefile.",
        "detailFr": "Vérification des dépendances, du compilateur C (gcc) et génération du fichier Makefile."
      },
      {
        "id": "s3",
        "label": "3. Compilation du code source : make",
        "labelFr": "3. Compilation du code source : make",
        "detail": "Appel du compilateur pour transformer le code source en binaires exécutables et bibliothèques d'objets.",
        "detailFr": "Appel du compilateur pour transformer le code source en binaires exécutables et bibliothèques d'objets."
      },
      {
        "id": "s4",
        "label": "4. Installation des binaires : make install (en root)",
        "labelFr": "4. Installation des binaires : make install (en root)",
        "detail": "Copie des binaires dans /usr/local/bin, des manuels dans /usr/local/share/man et des bibliothèques.",
        "detailFr": "Copie des binaires dans /usr/local/bin, des manuels dans /usr/local/share/man et des bibliothèques."
      },
      {
        "id": "s5",
        "label": "5. Mise à jour du cache des bibliothèques : ldconfig",
        "labelFr": "5. Mise à jour du cache des bibliothèques : ldconfig",
        "detail": "Actualisation de /etc/ld.so.cache pour permettre au système de charger immédiatement les nouvelles bibliothèques.",
        "detailFr": "Actualisation de /etc/ld.so.cache pour permettre au système de charger immédiatement les nouvelles bibliothèques."
      }
    ],
    "explanation": "Le triptyque universel GNU Autotools est : extraction de l'archive -> ./configure (génère Makefile) -> make (compile) -> make install (installe les fichiers cibles) -> ldconfig (rafraîchit le cache des bibliothèques partagées).",
    "explanationFr": "Le triptyque universel GNU Autotools est : extraction de l'archive -> ./configure (génère Makefile) -> make (compile) -> make install (installe les fichiers cibles) -> ldconfig (rafraîchit le cache des bibliothèques partagées)."
  },
  {
    "id": "seq-lpic1-07",
    "title": "Ordre de résolution du linker dynamique ld.so",
    "titleFr": "Ordre de résolution du linker dynamique ld.so",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.3",
    "category": "Gestion des Paquets & Logiciels",
    "description": "Lors de l'exécution d'un binaire lié dynamiquement, dans quel ordre de priorité le chargeur ld.so recherche-t-il les bibliothèques partagées (.so) ?",
    "descriptionFr": "Lors de l'exécution d'un binaire lié dynamiquement, dans quel ordre de priorité le chargeur ld.so recherche-t-il les bibliothèques partagées (.so) ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. DT_RPATH encodé dans le binaire (si RUNPATH est absent)",
        "labelFr": "1. DT_RPATH encodé dans le binaire (si RUNPATH est absent)",
        "detail": "Chemins codés en dur dans les en-têtes ELF lors de la compilation avec l'option -Wl,-rpath.",
        "detailFr": "Chemins codés en dur dans les en-têtes ELF lors de la compilation avec l'option -Wl,-rpath."
      },
      {
        "id": "s2",
        "label": "2. Variable d'environnement LD_LIBRARY_PATH",
        "labelFr": "2. Variable d'environnement LD_LIBRARY_PATH",
        "detail": "Liste de répertoires séparés par des deux-points définie par l'utilisateur (ignorée si SUID/SGID).",
        "detailFr": "Liste de répertoires séparés par des deux-points définie par l'utilisateur (ignorée si SUID/SGID)."
      },
      {
        "id": "s3",
        "label": "3. DT_RUNPATH encodé dans le binaire",
        "labelFr": "3. DT_RUNPATH encodé dans le binaire",
        "detail": "Chemins alternatifs de l'en-tête ELF prioritaires par rapport au cache système standard.",
        "detailFr": "Chemins alternatifs de l'en-tête ELF prioritaires par rapport au cache système standard."
      },
      {
        "id": "s4",
        "label": "4. Fichier binaire de cache /etc/ld.so.cache",
        "labelFr": "4. Fichier binaire de cache /etc/ld.so.cache",
        "detail": "Cache compilé à partir des répertoires déclarés dans /etc/ld.so.conf et /etc/ld.so.conf.d/*.",
        "detailFr": "Cache compilé à partir des répertoires déclarés dans /etc/ld.so.conf et /etc/ld.so.conf.d/*."
      },
      {
        "id": "s5",
        "label": "5. Répertoires système par défaut : /lib et /usr/lib",
        "labelFr": "5. Répertoires système par défaut : /lib et /usr/lib",
        "detail": "Emplacements standards finaux utilisés en dernier recours par le système d'exploitation.",
        "detailFr": "Emplacements standards finaux utilisés en dernier recours par le système d'exploitation."
      }
    ],
    "explanation": "L'ordre strict suivi par ld.so est : RPATH (si RUNPATH n'existe pas) -> LD_LIBRARY_PATH -> RUNPATH -> /etc/ld.so.cache (généré par ldconfig) -> /lib et /usr/lib (ou répertoires 64-bit /lib64, /usr/lib64).",
    "explanationFr": "L'ordre strict suivi par ld.so est : RPATH (si RUNPATH n'existe pas) -> LD_LIBRARY_PATH -> RUNPATH -> /etc/ld.so.cache (généré par ldconfig) -> /lib et /usr/lib (ou répertoires 64-bit /lib64, /usr/lib64)."
  },
  {
    "id": "seq-lpic1-08",
    "title": "Création, formatage et montage persistant d'une partition",
    "titleFr": "Création, formatage et montage persistant d'une partition",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.1",
    "category": "Gestion des Paquets & Logiciels",
    "description": "Ordonnez les étapes d'administration système pour mettre en service un nouveau disque /dev/sdb et le monter de manière permanente.",
    "descriptionFr": "Ordonnez les étapes d'administration système pour mettre en service un nouveau disque /dev/sdb et le monter de manière permanente.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Découpage de la partition avec fdisk ou gdisk",
        "labelFr": "1. Découpage de la partition avec fdisk ou gdisk",
        "detail": "Création d'une partition primaire ou GPT sur /dev/sdb et écriture de la table de partitions.",
        "detailFr": "Création d'une partition primaire ou GPT sur /dev/sdb et écriture de la table de partitions."
      },
      {
        "id": "s2",
        "label": "2. Actualisation de la table par le noyau : partprobe /dev/sdb",
        "labelFr": "2. Actualisation de la table par le noyau : partprobe /dev/sdb",
        "detail": "Demande au noyau de relire la table de partitions sans nécessiter de redémarrage de la machine.",
        "detailFr": "Demande au noyau de relire la table de partitions sans nécessiter de redémarrage de la machine."
      },
      {
        "id": "s3",
        "label": "3. Création du système de fichiers : mkfs.ext4 /dev/sdb1",
        "labelFr": "3. Création du système de fichiers : mkfs.ext4 /dev/sdb1",
        "detail": "Formatage de la partition avec initialisation des superblocs, groupes de blocs et tables d'inodes.",
        "detailFr": "Formatage de la partition avec initialisation des superblocs, groupes de blocs et tables d'inodes."
      },
      {
        "id": "s4",
        "label": "4. Identification de l'UUID de la partition : blkid /dev/sdb1",
        "labelFr": "4. Identification de l'UUID de la partition : blkid /dev/sdb1",
        "detail": "Récupération de l'identifiant unique universel pour garantir un montage robuste et indépendant des noms de disques.",
        "detailFr": "Récupération de l'identifiant unique universel pour garantir un montage robuste et indépendant des noms de disques."
      },
      {
        "id": "s5",
        "label": "5. Inscription dans /etc/fstab et test mount -a",
        "labelFr": "5. Inscription dans /etc/fstab et test mount -a",
        "detail": "Ajout de la ligne UUID=... /data ext4 defaults 0 2 et exécution de 'mount -a' pour valider sans reboot.",
        "detailFr": "Ajout de la ligne UUID=... /data ext4 defaults 0 2 et exécution de 'mount -a' pour valider sans reboot."
      }
    ],
    "explanation": "La procédure rigoureuse exige : partitionnement (fdisk/gdisk) -> notification noyau (partprobe) -> formatage (mkfs) -> extraction de l'UUID (blkid) -> déclaration dans /etc/fstab avec vérification immédiate via 'mount -a'.",
    "explanationFr": "La procédure rigoureuse exige : partitionnement (fdisk/gdisk) -> notification noyau (partprobe) -> formatage (mkfs) -> extraction de l'UUID (blkid) -> déclaration dans /etc/fstab avec vérification immédiate via 'mount -a'."
  },
  {
    "id": "seq-lpic1-09",
    "title": "Création et activation d'un espace de Swap",
    "titleFr": "Création et activation d'un espace de Swap",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.1",
    "category": "Gestion des Paquets & Logiciels",
    "description": "Ordonnez les opérations nécessaires pour créer une nouvelle partition de mémoire virtuelle Swap et la rendre active au boot.",
    "descriptionFr": "Ordonnez les opérations nécessaires pour créer une nouvelle partition de mémoire virtuelle Swap et la rendre active au boot.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création de la partition et assignation du type 82 (MBR) ou 8200 (GPT)",
        "labelFr": "1. Création de la partition et assignation du type 82 (MBR) ou 8200 (GPT)",
        "detail": "Définition du type spécifique 'Linux swap' avec fdisk ou gdisk sur /dev/sdb2.",
        "detailFr": "Définition du type spécifique 'Linux swap' avec fdisk ou gdisk sur /dev/sdb2."
      },
      {
        "id": "s2",
        "label": "2. Initialisation de la signature Swap : mkswap /dev/sdb2",
        "labelFr": "2. Initialisation de la signature Swap : mkswap /dev/sdb2",
        "detail": "Écriture des structures d'en-tête de swap et génération de l'UUID de swap.",
        "detailFr": "Écriture des structures d'en-tête de swap et génération de l'UUID de swap."
      },
      {
        "id": "s3",
        "label": "3. Ajout de l'entrée dans /etc/fstab",
        "labelFr": "3. Ajout de l'entrée dans /etc/fstab",
        "detail": "Ajout de la ligne 'UUID=... none swap sw 0 0' pour la persistance aux redémarrages.",
        "detailFr": "Ajout de la ligne 'UUID=... none swap sw 0 0' pour la persistance aux redémarrages."
      },
      {
        "id": "s4",
        "label": "4. Activation immédiate du swap : swapon -a",
        "labelFr": "4. Activation immédiate du swap : swapon -a",
        "detail": "Le noyau active tous les espaces swap déclarés dans /etc/fstab.",
        "detailFr": "Le noyau active tous les espaces swap déclarés dans /etc/fstab."
      },
      {
        "id": "s5",
        "label": "5. Vérification de l'espace alloué avec swapon --show ou free -h",
        "labelFr": "5. Vérification de l'espace alloué avec swapon --show ou free -h",
        "detail": "Contrôle de la taille effective et de la priorité d'utilisation de la partition swap.",
        "detailFr": "Contrôle de la taille effective et de la priorité d'utilisation de la partition swap."
      }
    ],
    "explanation": "L'espace swap nécessite de typer la partition (type 82 ou 8200), de formater sa structure spécifique avec mkswap, de la déclarer dans /etc/fstab, puis de l'activer via 'swapon -a' avant de contrôler avec 'free -m' ou 'swapon --show'.",
    "explanationFr": "L'espace swap nécessite de typer la partition (type 82 ou 8200), de formater sa structure spécifique avec mkswap, de la déclarer dans /etc/fstab, puis de l'activer via 'swapon -a' avant de contrôler avec 'free -m' ou 'swapon --show'."
  },
  {
    "id": "seq-lpic1-10",
    "title": "Cycle de vie de l'installation d'un paquet binaire (RPM / DEB)",
    "titleFr": "Cycle de vie de l'installation d'un paquet binaire (RPM / DEB)",
    "certification": "lpic-1",
    "topicNumber": 102,
    "objectiveId": "102.5",
    "category": "Gestion des Paquets & Logiciels",
    "description": "Dans quel ordre le gestionnaire de bas niveau (rpm ou dpkg) exécute-t-il les scripts internes lors de l'installation d'un paquet logiciel ?",
    "descriptionFr": "Dans quel ordre le gestionnaire de bas niveau (rpm ou dpkg) exécute-t-il les scripts internes lors de l'installation d'un paquet logiciel ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Contrôle des prérequis et dépendances logicielles",
        "labelFr": "1. Contrôle des prérequis et dépendances logicielles",
        "detail": "Vérification des versions d'architecture et de la présence des paquets requis dans la base locale.",
        "detailFr": "Vérification des versions d'architecture et de la présence des paquets requis dans la base locale."
      },
      {
        "id": "s2",
        "label": "2. Exécution du script de pré-installation (%pre ou preinst)",
        "labelFr": "2. Exécution du script de pré-installation (%pre ou preinst)",
        "detail": "Création des comptes de service, arrêt éventuel des démons en cours d'exécution.",
        "detailFr": "Création des comptes de service, arrêt éventuel des démons en cours d'exécution."
      },
      {
        "id": "s3",
        "label": "3. Extraction et écriture des fichiers sur le système",
        "labelFr": "3. Extraction et écriture des fichiers sur le système",
        "detail": "Décompression des fichiers de l'archive et copie dans l'arborescence (/usr, /etc, /var).",
        "detailFr": "Décompression des fichiers de l'archive et copie dans l'arborescence (/usr, /etc, /var)."
      },
      {
        "id": "s4",
        "label": "4. Exécution du script de post-installation (%post ou postinst)",
        "labelFr": "4. Exécution du script de post-installation (%post ou postinst)",
        "detail": "Lancement du service (systemctl), génération de clés cryptographiques ou mise à jour de caches.",
        "detailFr": "Lancement du service (systemctl), génération de clés cryptographiques ou mise à jour de caches."
      },
      {
        "id": "s5",
        "label": "5. Mise à jour de la base de métadonnées (/var/lib/rpm ou /var/lib/dpkg/status)",
        "labelFr": "5. Mise à jour de la base de métadonnées (/var/lib/rpm ou /var/lib/dpkg/status)",
        "detail": "Enregistrement du paquet, des sommes de contrôle md5/sha256 et des chemins de tous les fichiers installés.",
        "detailFr": "Enregistrement du paquet, des sommes de contrôle md5/sha256 et des chemins de tous les fichiers installés."
      }
    ],
    "explanation": "Les gestionnaires de paquets RPM et DPKG respectent une machine à états stricte : validation des dépendances -> exécution du scriptlet de pré-installation -> extraction des fichiers sur disque -> exécution du scriptlet de post-installation -> écriture des métadonnées dans la base locale.",
    "explanationFr": "Les gestionnaires de paquets RPM et DPKG respectent une machine à états stricte : validation des dépendances -> exécution du scriptlet de pré-installation -> extraction des fichiers sur disque -> exécution du scriptlet de post-installation -> écriture des métadonnées dans la base locale."
  },
  {
    "id": "seq-lpic1-11",
    "title": "Pipeline de traitement statistique de logs d'accès",
    "titleFr": "Pipeline de traitement statistique de logs d'accès",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.2",
    "category": "Commandes GNU & Unix",
    "description": "Ordonnez les commandes élémentaires d'un tube Unix (pipe) pour extraire le Top 10 des adresses IP les plus actives à partir d'un fichier de log.",
    "descriptionFr": "Ordonnez les commandes élémentaires d'un tube Unix (pipe) pour extraire le Top 10 des adresses IP les plus actives à partir d'un fichier de log.",
    "steps": [
      {
        "id": "s1",
        "label": "1. cut -d ' ' -f 1 access.log (ou awk '{print $1}')",
        "labelFr": "1. cut -d ' ' -f 1 access.log (ou awk '{print $1}')",
        "detail": "Extraction de la première colonne correspondant à l'adresse IP cliente pour chaque ligne de log.",
        "detailFr": "Extraction de la première colonne correspondant à l'adresse IP cliente pour chaque ligne de log."
      },
      {
        "id": "s2",
        "label": "2. sort",
        "labelFr": "2. sort",
        "detail": "Tri alphabétique obligatoire afin de regrouper les adresses IP identiques sur des lignes consécutives.",
        "detailFr": "Tri alphabétique obligatoire afin de regrouper les adresses IP identiques sur des lignes consécutives."
      },
      {
        "id": "s3",
        "label": "3. uniq -c",
        "labelFr": "3. uniq -c",
        "detail": "Suppression des doublons consécutifs et préfixage par le nombre d'occurrences de chaque IP.",
        "detailFr": "Suppression des doublons consécutifs et préfixage par le nombre d'occurrences de chaque IP."
      },
      {
        "id": "s4",
        "label": "4. sort -rn",
        "labelFr": "4. sort -rn",
        "detail": "Tri numérique inverse (-n pour numérique, -r pour décroissant) basé sur le décompte obtenu.",
        "detailFr": "Tri numérique inverse (-n pour numérique, -r pour décroissant) basé sur le décompte obtenu."
      },
      {
        "id": "s5",
        "label": "5. head -n 10",
        "labelFr": "5. head -n 10",
        "detail": "Sélection des dix premières lignes représentant les 10 plus gros consommateurs de requêtes.",
        "detailFr": "Sélection des dix premières lignes représentant les 10 plus gros consommateurs de requêtes."
      }
    ],
    "explanation": "La commande 'uniq' ne compare que les lignes adjacentes, ce qui rend le premier 'sort' indispensable. Ensuite, 'uniq -c' compte les occurrences, 'sort -rn' trie numériquement du plus grand au plus petit, et 'head -n 10' ne conserve que le top 10.",
    "explanationFr": "La commande 'uniq' ne compare que les lignes adjacentes, ce qui rend le premier 'sort' indispensable. Ensuite, 'uniq -c' compte les occurrences, 'sort -rn' trie numériquement du plus grand au plus petit, et 'head -n 10' ne conserve que le top 10."
  },
  {
    "id": "seq-lpic1-12",
    "title": "Cycle de vie et transitions d'état d'un processus Linux",
    "titleFr": "Cycle de vie et transitions d'état d'un processus Linux",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.5",
    "category": "Commandes GNU & Unix",
    "description": "Ordonnez les étapes du cycle de vie d'un processus, de sa création par un processus parent jusqu'à sa libération définitive de la table des processus.",
    "descriptionFr": "Ordonnez les étapes du cycle de vie d'un processus, de sa création par un processus parent jusqu'à sa libération définitive de la table des processus.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Clonage du processus parent : appel système fork()",
        "labelFr": "1. Clonage du processus parent : appel système fork()",
        "detail": "Duplication de l'espace mémoire du parent et attribution d'un nouveau PID unique à l'enfant.",
        "detailFr": "Duplication de l'espace mémoire du parent et attribution d'un nouveau PID unique à l'enfant."
      },
      {
        "id": "s2",
        "label": "2. Remplacement du code exécutable : appel système execve()",
        "labelFr": "2. Remplacement du code exécutable : appel système execve()",
        "detail": "Chargement en mémoire de la nouvelle image binaire du programme à exécuter.",
        "detailFr": "Chargement en mémoire de la nouvelle image binaire du programme à exécuter."
      },
      {
        "id": "s3",
        "label": "3. État d'exécution (Running 'R') ou d'attente interruptible (Sleeping 'S')",
        "labelFr": "3. État d'exécution (Running 'R') ou d'attente interruptible (Sleeping 'S')",
        "detail": "Consommation de tranches de temps CPU par l'ordonnanceur ou attente d'une entrée/sortie disque ou réseau.",
        "detailFr": "Consommation de tranches de temps CPU par l'ordonnanceur ou attente d'une entrée/sortie disque ou réseau."
      },
      {
        "id": "s4",
        "label": "4. Terminaison et état Zombie ('Z') via exit()",
        "labelFr": "4. Terminaison et état Zombie ('Z') via exit()",
        "detail": "Libération des ressources mémoire mais conservation du code de retour et du PID dans la table.",
        "detailFr": "Libération des ressources mémoire mais conservation du code de retour et du PID dans la table."
      },
      {
        "id": "s5",
        "label": "5. Récupération du code de retour par le parent via wait() / waitpid()",
        "labelFr": "5. Récupération du code de retour par le parent via wait() / waitpid()",
        "detail": "Lecture du statut de sortie et suppression définitive de l'entrée du processus de la table du noyau.",
        "detailFr": "Lecture du statut de sortie et suppression définitive de l'entrée du processus de la table du noyau."
      }
    ],
    "explanation": "Sous Linux, tout processus est créé par fork() puis remplacé par execve(). Durant sa vie, il alterne entre Running (R) et Sleeping (S/D). À sa mort (exit), il devient Zombie (Z) jusqu'à ce que son père lise son statut de sortie via wait(), ce qui efface son entrée de la table des processus.",
    "explanationFr": "Sous Linux, tout processus est créé par fork() puis remplacé par execve(). Durant sa vie, il alterne entre Running (R) et Sleeping (S/D). À sa mort (exit), il devient Zombie (Z) jusqu'à ce que son père lise son statut de sortie via wait(), ce qui efface son entrée de la table des processus."
  },
  {
    "id": "seq-lpic1-13",
    "title": "Procédure d'arrêt gradué et diagnostic d'un processus",
    "titleFr": "Procédure d'arrêt gradué et diagnostic d'un processus",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.5",
    "category": "Commandes GNU & Unix",
    "description": "Ordonnez les étapes recommandées par l'examen LPIC-1 pour gérer et arrêter proprement un processus récalcitrant sans risquer de corrompre des données.",
    "descriptionFr": "Ordonnez les étapes recommandées par l'examen LPIC-1 pour gérer et arrêter proprement un processus récalcitrant sans risquer de corrompre des données.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Identification du PID et de l'usage CPU avec ps aux ou top",
        "labelFr": "1. Identification du PID et de l'usage CPU avec ps aux ou top",
        "detail": "Repérage du numéro de PID, de l'état du processus et des ressources consommées.",
        "detailFr": "Repérage du numéro de PID, de l'état du processus et des ressources consommées."
      },
      {
        "id": "s2",
        "label": "2. Envoi d'un signal de terminaison gracieuse : kill -15 <PID> (SIGTERM)",
        "labelFr": "2. Envoi d'un signal de terminaison gracieuse : kill -15 <PID> (SIGTERM)",
        "detail": "Permet au programme de fermer ses fichiers ouverts, ses connexions réseau et de vider ses tampons.",
        "detailFr": "Permet au programme de fermer ses fichiers ouverts, ses connexions réseau et de vider ses tampons."
      },
      {
        "id": "s3",
        "label": "3. Surveillance de la terminaison pendant quelques secondes (pgrep)",
        "labelFr": "3. Surveillance de la terminaison pendant quelques secondes (pgrep)",
        "detail": "Vérification si le processus répond au signal SIGTERM et quitte la mémoire normalement.",
        "detailFr": "Vérification si le processus répond au signal SIGTERM et quitte la mémoire normalement."
      },
      {
        "id": "s4",
        "label": "4. Envoi d'un signal d'interruption prioritaire : kill -2 <PID> (SIGINT)",
        "labelFr": "4. Envoi d'un signal d'interruption prioritaire : kill -2 <PID> (SIGINT)",
        "detail": "Équivalent logiciel d'un Ctrl+C pour forcer l'interruption de la boucle de traitement.",
        "detailFr": "Équivalent logiciel d'un Ctrl+C pour forcer l'interruption de la boucle de traitement."
      },
      {
        "id": "s5",
        "label": "5. Envoi ultime du signal non interceptable : kill -9 <PID> (SIGKILL)",
        "labelFr": "5. Envoi ultime du signal non interceptable : kill -9 <PID> (SIGKILL)",
        "detail": "Le noyau détruit immédiatement le processus sans lui laisser la possibilité de nettoyer ses ressources.",
        "detailFr": "Le noyau détruit immédiatement le processus sans lui laisser la possibilité de nettoyer ses ressources."
      }
    ],
    "explanation": "La bonne pratique d'administration Linux interdit de lancer directement un kill -9 (SIGKILL). On commence toujours par SIGTERM (15) pour laisser le processus enregistrer ses données. En cas de blocage persistant seulement, on recourt à SIGINT (2) puis au SIGKILL (9) non interceptable.",
    "explanationFr": "La bonne pratique d'administration Linux interdit de lancer directement un kill -9 (SIGKILL). On commence toujours par SIGTERM (15) pour laisser le processus enregistrer ses données. En cas de blocage persistant seulement, on recourt à SIGINT (2) puis au SIGKILL (9) non interceptable."
  },
  {
    "id": "seq-lpic1-14",
    "title": "Cycle d'exécution interne de l'éditeur de flux sed",
    "titleFr": "Cycle d'exécution interne de l'éditeur de flux sed",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.2",
    "category": "Commandes GNU & Unix",
    "description": "Ordonnez le cycle de traitement exécuté par l'éditeur de flux 'sed' pour chaque ligne lue depuis le flux d'entrée standard.",
    "descriptionFr": "Ordonnez le cycle de traitement exécuté par l'éditeur de flux 'sed' pour chaque ligne lue depuis le flux d'entrée standard.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Lecture d'une ligne d'entrée et retrait du saut de ligne final",
        "labelFr": "1. Lecture d'une ligne d'entrée et retrait du saut de ligne final",
        "detail": "La ligne courante est extraite du flux stdin ou du fichier source.",
        "detailFr": "La ligne courante est extraite du flux stdin ou du fichier source."
      },
      {
        "id": "s2",
        "label": "2. Chargement de la ligne dans le 'Pattern Space' (espace de travail)",
        "labelFr": "2. Chargement de la ligne dans le 'Pattern Space' (espace de travail)",
        "detail": "Le tampon principal est initialisé avec le texte de la ligne pour recevoir les modifications.",
        "detailFr": "Le tampon principal est initialisé avec le texte de la ligne pour recevoir les modifications."
      },
      {
        "id": "s3",
        "label": "3. Application séquentielle des commandes de script (ex: s/ancien/nouveau/)",
        "labelFr": "3. Application séquentielle des commandes de script (ex: s/ancien/nouveau/)",
        "detail": "Évaluation des filtres d'adresses et exécution des substitutions dans le Pattern Space.",
        "detailFr": "Évaluation des filtres d'adresses et exécution des substitutions dans le Pattern Space."
      },
      {
        "id": "s4",
        "label": "4. Écriture du contenu du Pattern Space sur la sortie standard",
        "labelFr": "4. Écriture du contenu du Pattern Space sur la sortie standard",
        "detail": "Sauf si l'option -n (mode silencieux) est spécifiée, la ligne transformée est affichée avec un saut de ligne.",
        "detailFr": "Sauf si l'option -n (mode silencieux) est spécifiée, la ligne transformée est affichée avec un saut de ligne."
      },
      {
        "id": "s5",
        "label": "5. Vidage du Pattern Space et passage à la ligne suivante",
        "labelFr": "5. Vidage du Pattern Space et passage à la ligne suivante",
        "detail": "Réinitialisation du tampon de travail avant de recommencer le cycle jusqu'à la fin de fichier (EOF).",
        "detailFr": "Réinitialisation du tampon de travail avant de recommencer le cycle jusqu'à la fin de fichier (EOF)."
      }
    ],
    "explanation": "Le moteur sed fonctionne en boucle ligne par ligne : lecture d'une ligne -> placement dans le Pattern Space -> exécution des commandes sed sur ce tampon -> impression sur stdout (sauf si -n) -> purge du Pattern Space et itération suivante.",
    "explanationFr": "Le moteur sed fonctionne en boucle ligne par ligne : lecture d'une ligne -> placement dans le Pattern Space -> exécution des commandes sed sur ce tampon -> impression sur stdout (sauf si -n) -> purge du Pattern Space et itération suivante."
  },
  {
    "id": "seq-lpic1-15",
    "title": "Recherche avancée et archivage incrémental",
    "titleFr": "Recherche avancée et archivage incrémental",
    "certification": "lpic-1",
    "topicNumber": 103,
    "objectiveId": "103.3",
    "category": "Commandes GNU & Unix",
    "description": "Ordonnez les étapes pour rechercher les fichiers modifiés dans les dernières 24 heures, les sauvegarder dans une archive compressée et vérifier l'intégrité de l'archive.",
    "descriptionFr": "Ordonnez les étapes pour rechercher les fichiers modifiés dans les dernières 24 heures, les sauvegarder dans une archive compressée et vérifier l'intégrité de l'archive.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Identification des fichiers modifiés avec 'find /var/www -mtime -1 -type f'",
        "labelFr": "1. Identification des fichiers modifiés avec 'find /var/www -mtime -1 -type f'",
        "detail": "Filtrage des fichiers réguliers dont la date de modification est strictement inférieure à 24 heures.",
        "detailFr": "Filtrage des fichiers réguliers dont la date de modification est strictement inférieure à 24 heures."
      },
      {
        "id": "s2",
        "label": "2. Sauvegarde de la liste dans un fichier temporaire : list.txt",
        "labelFr": "2. Sauvegarde de la liste dans un fichier temporaire : list.txt",
        "detail": "Redirection des chemins absolus afin d'éviter les dépassements d'arguments (ARG_MAX).",
        "detailFr": "Redirection des chemins absolus afin d'éviter les dépassements d'arguments (ARG_MAX)."
      },
      {
        "id": "s3",
        "label": "3. Création de l'archive compressée : tar -czf backup.tar.gz -T list.txt",
        "labelFr": "3. Création de l'archive compressée : tar -czf backup.tar.gz -T list.txt",
        "detail": "Archivage tar et compression gzip en utilisant l'option -T pour lire la liste des fichiers cibles.",
        "detailFr": "Archivage tar et compression gzip en utilisant l'option -T pour lire la liste des fichiers cibles."
      },
      {
        "id": "s4",
        "label": "4. Vérification de la table des matières sans extraction : tar -tzf backup.tar.gz",
        "labelFr": "4. Vérification de la table des matières sans extraction : tar -tzf backup.tar.gz",
        "detail": "Lecture du flux gzip et vérification de la présence des fichiers et de la validité de l'archive.",
        "detailFr": "Lecture du flux gzip et vérification de la présence des fichiers et de la validité de l'archive."
      },
      {
        "id": "s5",
        "label": "5. Nettoyage du fichier temporaire de liste : rm -f list.txt",
        "labelFr": "5. Nettoyage du fichier temporaire de liste : rm -f list.txt",
        "detail": "Suppression des fichiers temporaires pour maintenir l'intégrité de l'environnement d'administration.",
        "detailFr": "Suppression des fichiers temporaires pour maintenir l'intégrité de l'environnement d'administration."
      }
    ],
    "explanation": "Cette séquence classique d'administration utilise find pour repérer les cibles (-mtime -1), enregistre la liste (-T), crée l'archive avec tar (-c pour create, -z pour gzip, -f pour file), puis contrôle avec tar -t (list) avant nettoyage.",
    "explanationFr": "Cette séquence classique d'administration utilise find pour repérer les cibles (-mtime -1), enregistre la liste (-T), crée l'archive avec tar (-c pour create, -z pour gzip, -f pour file), puis contrôle avec tar -t (list) avant nettoyage."
  },
  {
    "id": "seq-lpic1-16",
    "title": "Passes de vérification et réparation d'un système de fichiers avec fsck",
    "titleFr": "Passes de vérification et réparation d'un système de fichiers avec fsck",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.2",
    "category": "Périphériques & Systèmes de Fichiers",
    "description": "Ordonnez les 5 passes successives exécutées par e2fsck pour contrôler et réparer un système de fichiers Ext3/Ext4.",
    "descriptionFr": "Ordonnez les 5 passes successives exécutées par e2fsck pour contrôler et réparer un système de fichiers Ext3/Ext4.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Démontage obligatoire du système de fichiers (umount /dev/sdb1)",
        "labelFr": "1. Démontage obligatoire du système de fichiers (umount /dev/sdb1)",
        "detail": "fsck ne doit JAMAIS être exécuté sur un système de fichiers monté en écriture sous peine de corruption majeure.",
        "detailFr": "fsck ne doit JAMAIS être exécuté sur un système de fichiers monté en écriture sous peine de corruption majeure."
      },
      {
        "id": "s2",
        "label": "2. Pass 1 : Vérification des inodes, des blocs et des tailles",
        "labelFr": "2. Pass 1 : Vérification des inodes, des blocs et des tailles",
        "detail": "Examen de la validité de chaque inode, des allocations de blocs défectueux et des compteurs de blocs.",
        "detailFr": "Examen de la validité de chaque inode, des allocations de blocs défectueux et des compteurs de blocs."
      },
      {
        "id": "s3",
        "label": "3. Pass 2 : Vérification de la structure des répertoires",
        "labelFr": "3. Pass 2 : Vérification de la structure des répertoires",
        "detail": "Contrôle des entrées de répertoire (noms de fichiers, formatage, entrées '.' et '..').",
        "detailFr": "Contrôle des entrées de répertoire (noms de fichiers, formatage, entrées '.' et '..')."
      },
      {
        "id": "s4",
        "label": "4. Pass 3 & 4 : Connectivité des répertoires et compteurs de liens",
        "labelFr": "4. Pass 3 & 4 : Connectivité des répertoires et compteurs de liens",
        "detail": "Vérification des répertoires orphelins et validation du nombre de liens physiques (hard links) de chaque fichier.",
        "detailFr": "Vérification des répertoires orphelins et validation du nombre de liens physiques (hard links) de chaque fichier."
      },
      {
        "id": "s5",
        "label": "5. Pass 5 : Vérification des informations de résumé de groupe et lost+found",
        "labelFr": "5. Pass 5 : Vérification des informations de résumé de groupe et lost+found",
        "detail": "Contrôle des bitmaps de blocs et d'inodes libres, et rattachement des orphelins dans le dossier lost+found/.",
        "detailFr": "Contrôle des bitmaps de blocs et d'inodes libres, et rattachement des orphelins dans le dossier lost+found/."
      }
    ],
    "explanation": "e2fsck procède rigoureusement selon 5 passes standards après démontage : Pass 1 (Inodes & blocs) -> Pass 2 (Structure répertoires) -> Pass 3 (Connectivité arborescence) -> Pass 4 (Compteurs de liens hardlink) -> Pass 5 (Bitmaps de groupes et dossiers lost+found).",
    "explanationFr": "e2fsck procède rigoureusement selon 5 passes standards après démontage : Pass 1 (Inodes & blocs) -> Pass 2 (Structure répertoires) -> Pass 3 (Connectivité arborescence) -> Pass 4 (Compteurs de liens hardlink) -> Pass 5 (Bitmaps de groupes et dossiers lost+found)."
  },
  {
    "id": "seq-lpic1-17",
    "title": "Mise en place de quotas disque utilisateur sur ext4",
    "titleFr": "Mise en place de quotas disque utilisateur sur ext4",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.4",
    "category": "Périphériques & Systèmes de Fichiers",
    "description": "Ordonnez les étapes nécessaires pour activer et assigner des limites d'espace disque (soft/hard limits) à un utilisateur sous Linux.",
    "descriptionFr": "Ordonnez les étapes nécessaires pour activer et assigner des limites d'espace disque (soft/hard limits) à un utilisateur sous Linux.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Ajout de l'option de montage 'usrquota' dans /etc/fstab",
        "labelFr": "1. Ajout de l'option de montage 'usrquota' dans /etc/fstab",
        "detail": "Déclaration des options quota (ex: defaults,usrquota) pour le point de montage /home.",
        "detailFr": "Déclaration des options quota (ex: defaults,usrquota) pour le point de montage /home."
      },
      {
        "id": "s2",
        "label": "2. Remontage de la partition : mount -o remount /home",
        "labelFr": "2. Remontage de la partition : mount -o remount /home",
        "detail": "Prise en compte des nouvelles options de montage sans interrompre l'accès utilisateur.",
        "detailFr": "Prise en compte des nouvelles options de montage sans interrompre l'accès utilisateur."
      },
      {
        "id": "s3",
        "label": "3. Création et initialisation des bases : quotacheck -cum /home",
        "labelFr": "3. Création et initialisation des bases : quotacheck -cum /home",
        "detail": "Génération des fichiers binaires aquota.user à la racine du système de fichiers monté.",
        "detailFr": "Génération des fichiers binaires aquota.user à la racine du système de fichiers monté."
      },
      {
        "id": "s4",
        "label": "4. Définition des limites : edquota -u <username>",
        "labelFr": "4. Définition des limites : edquota -u <username>",
        "detail": "Saisie dans l'éditeur des limites souple (soft) et stricte (hard) en blocs de données et en inodes.",
        "detailFr": "Saisie dans l'éditeur des limites souple (soft) et stricte (hard) en blocs de données et en inodes."
      },
      {
        "id": "s5",
        "label": "5. Activation de la surveillance : quotaon -v /home",
        "labelFr": "5. Activation de la surveillance : quotaon -v /home",
        "detail": "Ordre au noyau d'enforcer activement les limites fixées lors des opérations d'écriture.",
        "detailFr": "Ordre au noyau d'enforcer activement les limites fixées lors des opérations d'écriture."
      }
    ],
    "explanation": "La chaîne d'activation des quotas disque respecte l'ordre : déclaration dans /etc/fstab (usrquota) -> remontage (mount -o remount) -> indexation et création du fichier aquota (quotacheck) -> configuration des quotas (edquota) -> mise en service active (quotaon).",
    "explanationFr": "La chaîne d'activation des quotas disque respecte l'ordre : déclaration dans /etc/fstab (usrquota) -> remontage (mount -o remount) -> indexation et création du fichier aquota (quotacheck) -> configuration des quotas (edquota) -> mise en service active (quotaon)."
  },
  {
    "id": "seq-lpic1-18",
    "title": "Algorithme d'évaluation des permissions d'accès POSIX",
    "titleFr": "Algorithme d'évaluation des permissions d'accès POSIX",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.5",
    "category": "Périphériques & Systèmes de Fichiers",
    "description": "Lorsqu'un utilisateur tente d'accéder à un fichier (lecture/écriture/exécution), dans quel ordre exact le noyau évalue-t-il les permissions traditionnelles (rwx) ?",
    "descriptionFr": "Lorsqu'un utilisateur tente d'accéder à un fichier (lecture/écriture/exécution), dans quel ordre exact le noyau évalue-t-il les permissions traditionnelles (rwx) ?",
    "steps": [
      {
        "id": "s1",
        "label": "1. Vérification du compte super-utilisateur (UID == 0)",
        "labelFr": "1. Vérification du compte super-utilisateur (UID == 0)",
        "detail": "L'utilisateur root contourne les restrictions de lecture/écriture (l'exécution requiert au moins un bit 'x').",
        "detailFr": "L'utilisateur root contourne les restrictions de lecture/écriture (l'exécution requiert au moins un bit 'x')."
      },
      {
        "id": "s2",
        "label": "2. Comparaison avec l'UID propriétaire du fichier (User)",
        "labelFr": "2. Comparaison avec l'UID propriétaire du fichier (User)",
        "detail": "Si l'UID du processus correspond à l'UID propriétaire, SEULES les permissions 'User' s'appliquent immédiatement (arrêt de l'évaluation).",
        "detailFr": "Si l'UID du processus correspond à l'UID propriétaire, SEULES les permissions 'User' s'appliquent immédiatement (arrêt de l'évaluation)."
      },
      {
        "id": "s3",
        "label": "3. Comparaison avec les GID du groupe propriétaire (Group)",
        "labelFr": "3. Comparaison avec les GID du groupe propriétaire (Group)",
        "detail": "Si l'utilisateur n'est pas le propriétaire mais appartient au groupe (principal ou secondaire), SEULES les permissions 'Group' s'appliquent.",
        "detailFr": "Si l'utilisateur n'est pas le propriétaire mais appartient au groupe (principal ou secondaire), SEULES les permissions 'Group' s'appliquent."
      },
      {
        "id": "s4",
        "label": "4. Application des permissions des autres utilisateurs (Others)",
        "labelFr": "4. Application des permissions des autres utilisateurs (Others)",
        "detail": "Si l'utilisateur n'est ni propriétaire ni membre du groupe, les permissions de la classe 'Others' décident de l'accès.",
        "detailFr": "Si l'utilisateur n'est ni propriétaire ni membre du groupe, les permissions de la classe 'Others' décident de l'accès."
      },
      {
        "id": "s5",
        "label": "5. Octroi de l'accès ou émission de l'erreur EACCES 'Permission denied'",
        "labelFr": "5. Octroi de l'accès ou émission de l'erreur EACCES 'Permission denied'",
        "detail": "Le noyau valide l'appel système ou renvoie le code d'erreur de refus au processus appelant.",
        "detailFr": "Le noyau valide l'appel système ou renvoie le code d'erreur de refus au processus appelant."
      }
    ],
    "explanation": "Règle d'or LPIC-1 : L'évaluation POSIX est exclusive. Dès qu'une correspondance est trouvée (UID propriétaire d'abord, puis GID de groupe), le noyau applique UNIQUEMENT cette classe et s'arrête. Si le propriétaire a '---' et Others a 'rwx', le propriétaire est rejeté !",
    "explanationFr": "Règle d'or LPIC-1 : L'évaluation POSIX est exclusive. Dès qu'une correspondance est trouvée (UID propriétaire d'abord, puis GID de groupe), le noyau applique UNIQUEMENT cette classe et s'arrête. Si le propriétaire a '---' et Others a 'rwx', le propriétaire est rejeté !"
  },
  {
    "id": "seq-lpic1-19",
    "title": "Résolution des répertoires du standard FHS (Filesystem Hierarchy Standard)",
    "titleFr": "Résolution des répertoires du standard FHS (Filesystem Hierarchy Standard)",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.7",
    "category": "Périphériques & Systèmes de Fichiers",
    "description": "Ordonnez les répertoires standards du FHS du plus statique et précoce au démarrage (/boot, /etc) jusqu'aux données dynamiques et temporaires (/var, /tmp).",
    "descriptionFr": "Ordonnez les répertoires standards du FHS du plus statique et précoce au démarrage (/boot, /etc) jusqu'aux données dynamiques et temporaires (/var, /tmp).",
    "steps": [
      {
        "id": "s1",
        "label": "1. /boot : Fichiers statiques indispensables au démarrage",
        "labelFr": "1. /boot : Fichiers statiques indispensables au démarrage",
        "detail": "Contient le noyau vmlinuz, l'initramfs, le chargeur GRUB et System.map nécessaires avant le montage de la racine.",
        "detailFr": "Contrôle les binaires de boot avant l'initialisation de l'espace utilisateur."
      },
      {
        "id": "s2",
        "label": "2. /etc : Fichiers de configuration statiques de l'hôte",
        "labelFr": "2. /etc : Fichiers de configuration statiques de l'hôte",
        "detail": "Fichiers de configuration texte locaux spécifiques à la machine (/etc/fstab, /etc/passwd).",
        "detailFr": "Fichiers de configuration texte locaux spécifiques à la machine (/etc/fstab, /etc/passwd)."
      },
      {
        "id": "s3",
        "label": "3. /usr : Données utilisateurs et binaires partagés en lecture seule",
        "labelFr": "3. /usr : Données utilisateurs et binaires partagés en lecture seule",
        "detail": "Architecture logicielle principale (/usr/bin, /usr/lib, /usr/share) partageable entre plusieurs machines.",
        "detailFr": "Architecture logicielle principale (/usr/bin, /usr/lib, /usr/share) partageable entre plusieurs machines."
      },
      {
        "id": "s4",
        "label": "4. /var : Données variables et états du système",
        "labelFr": "4. /var : Données variables et états du système",
        "detail": "Fichiers de journaux (/var/log), files d'attente spool (/var/spool/mail, cron) et bases de données.",
        "detailFr": "Fichiers de journaux (/var/log), files d'attente spool (/var/spool/mail, cron) et bases de données."
      },
      {
        "id": "s5",
        "label": "5. /tmp : Fichiers temporaires éphémères",
        "labelFr": "5. /tmp : Fichiers temporaires éphémères",
        "detail": "Zone accessible en écriture à tous les utilisateurs (avec Sticky Bit 't') vidée à chaque redémarrage.",
        "detailFr": "Zone accessible en écriture à tous les utilisateurs (avec Sticky Bit 't') vidée à chaque redémarrage."
      }
    ],
    "explanation": "Le standard FHS catégorise les données selon deux axes : Statiques vs Variables, et Partageables vs Non-partageables. /boot et /etc sont statiques et critiques au boot, /usr est statique partageable, /var est variable, et /tmp est transitoire.",
    "explanationFr": "Le standard FHS catégorise les données selon deux axes : Statiques vs Variables, et Partageables vs Non-partageables. /boot et /etc sont statiques et critiques au boot, /usr est statique partageable, /var est variable, et /tmp est transitoire."
  },
  {
    "id": "seq-lpic1-20",
    "title": "Création et comportement des Liens Durs vs Liens Symboliques",
    "titleFr": "Création et comportement des Liens Durs vs Liens Symboliques",
    "certification": "lpic-1",
    "topicNumber": 104,
    "objectiveId": "104.6",
    "category": "Périphériques & Systèmes de Fichiers",
    "description": "Ordonnez la séquence d'expérimentation démontrant la différence fondamentale entre un lien dur (hard link) et un lien symbolique (symlink).",
    "descriptionFr": "Ordonnez la séquence d'expérimentation démontrant la différence fondamentale entre un lien dur (hard link) et un lien symbolique (symlink).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création du fichier source : echo 'hello' > original.txt",
        "labelFr": "1. Création du fichier source : echo 'hello' > original.txt",
        "detail": "Allocation d'un nouvel inode et d'un compteur de liens initialisé à 1.",
        "detailFr": "Allocation d'un nouvel inode et d'un compteur de liens initialisé à 1."
      },
      {
        "id": "s2",
        "label": "2. Création du lien dur : ln original.txt hardlink.txt",
        "labelFr": "2. Création du lien dur : ln original.txt hardlink.txt",
        "detail": "Création d'une nouvelle entrée de répertoire pointant vers le MÊME numéro d'inode (compteur = 2).",
        "detailFr": "Création d'une nouvelle entrée de répertoire pointant vers le MÊME numéro d'inode (compteur = 2)."
      },
      {
        "id": "s3",
        "label": "3. Création du lien symbolique : ln -s original.txt symlink.txt",
        "labelFr": "3. Création du lien symbolique : ln -s original.txt symlink.txt",
        "detail": "Création d'un NOUVEL inode contenant simplement le chemin textuel vers la cible.",
        "detailFr": "Création d'un NOUVEL inode contenant simplement le chemin textuel vers la cible."
      },
      {
        "id": "s4",
        "label": "4. Suppression du fichier source : rm original.txt",
        "labelFr": "4. Suppression du fichier source : rm original.txt",
        "detail": "Le nom original.txt est effacé, décrémentant le compteur d'inodes de 2 à 1.",
        "detailFr": "Le nom original.txt est effacé, décrémentant le compteur d'inodes de 2 à 1."
      },
      {
        "id": "s5",
        "label": "5. Constat : hardlink.txt reste lisible, symlink.txt devient orphelin (cassé)",
        "labelFr": "5. Constat : hardlink.txt reste lisible, symlink.txt devient orphelin (cassé)",
        "detail": "Les données du lien dur subsistent car inode > 0, tandis que le lien symbolique pointe vers un chemin inexistant.",
        "detailFr": "Les données du lien dur subsistent car inode > 0, tandis que le lien symbolique pointe vers un chemin inexistant."
      }
    ],
    "explanation": "Un lien dur partage le même inode que la source (sur le même système de fichiers) et conserve les données tant que le compteur de liens est >= 1. Le lien symbolique (-s) n'est qu'un pointeur textuel qui devient 'cassé' (dangling) si la cible est supprimée.",
    "explanationFr": "Un lien dur partage le même inode que la source (sur le même système de fichiers) et conserve les données tant que le compteur de liens est >= 1. Le lien symbolique (-s) n'est qu'un pointeur textuel qui devient 'cassé' (dangling) si la cible est supprimée."
  }
];
