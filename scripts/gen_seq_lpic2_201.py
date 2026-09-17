# -*- coding: utf-8 -*-
challenges_201 = [
  # Topic 200: Capacity Planning (2)
  {
    "id": "seq-201-1",
    "title": "Establishing a Systematic Performance Baseline (sar / sysstat)",
    "titleFr": "Chaîne d'établissement d'une baseline de performance avec sysstat / sar",
    "certification": "lpic-2",
    "topicNumber": 200,
    "objectiveId": "200.1",
    "category": "Capacity Planning",
    "description": "Ordonnez les étapes méthodologiques pour capturer, archiver et analyser l'empreinte de charge nominale d'un serveur Linux en production.",
    "descriptionFr": "Ordonnez les étapes méthodologiques pour capturer, archiver et analyser l'empreinte de charge nominale d'un serveur Linux en production.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Activation du service de collecte sysstat",
        "labelFr": "1. Activation du service de collecte sysstat",
        "detail": "Activer et démarrer sysstat.service et sysstat-collect.timer pour échantillonner toutes les 10 minutes",
        "detailFr": "Activer et démarrer sysstat.service et sysstat-collect.timer pour échantillonner toutes les 10 minutes"
      },
      {
        "id": "s2",
        "label": "2. Collecte et archivage des compteurs bruts saXX",
        "labelFr": "2. Collecte et archivage des compteurs bruts saXX",
        "detail": "Laisser tourner la collecte sur une période représentative (ex: 7 à 14 jours) dans /var/log/sysstat/saDD",
        "detailFr": "Laisser tourner la collecte sur une période représentative (ex: 7 à 14 jours) dans /var/log/sysstat/saDD"
      },
      {
        "id": "s3",
        "label": "3. Extraction ciblée des métriques CPU, RAM et I/O",
        "labelFr": "3. Extraction ciblée des métriques CPU, RAM et I/O",
        "detail": "Exécuter sar -u (CPU), sar -r (mémoire) et sar -b (I/O disque) pour extraire les plages horaires de pic",
        "detailFr": "Exécuter sar -u (CPU), sar -r (mémoire) et sar -b (I/O disque) pour extraire les plages horaires de pic"
      },
      {
        "id": "s4",
        "label": "4. Calcul des percentiles 95th et corrélation de charge",
        "labelFr": "4. Calcul des percentiles 95th et corrélation de charge",
        "detail": "Agréger les indicateurs pour dégager les seuils de charge normaux hors anomalies transitoires",
        "detailFr": "Agréger les indicateurs pour dégager les seuils de charge normaux hors anomalies transitoires"
      },
      {
        "id": "s5",
        "label": "5. Définition des seuils d'alerte et projection de capacité",
        "labelFr": "5. Définition des seuils d'alerte et projection de capacité",
        "detail": "Configurer les sondes de supervision sur la base des percentiles réels mesurés",
        "detailFr": "Configurer les sondes de supervision sur la base des percentiles réels mesurés"
      }
    ],
    "explanation": "La création d'une baseline exige : 1) activer la collecte continue (sysstat), 2) accumuler des données sur un cycle d'activité représentatif, 3) extraire les métriques clés avec sar, 4) calculer les médianes et percentiles significatifs, 5) projeter l'évolution et calibrer les alertes.",
    "explanationFr": "La création d'une baseline exige : 1) activer la collecte continue (sysstat), 2) accumuler des données sur un cycle d'activité représentatif, 3) extraire les métriques clés avec sar, 4) calculer les médianes et percentiles significatifs, 5) projeter l'évolution et calibrer les alertes."
  },
  {
    "id": "seq-201-2",
    "title": "Systematic Storage I/O Bottleneck Investigation",
    "titleFr": "Protocole d'investigation méthodique d'un goulot d'étranglement I/O disque",
    "certification": "lpic-2",
    "topicNumber": 200,
    "objectiveId": "200.1",
    "category": "Capacity Planning",
    "description": "Placez dans l'ordre rigoureux les outils et étapes d'investigation pour identifier la cause exacte d'une dégradation I/O sur un serveur de bases de données.",
    "descriptionFr": "Placez dans l'ordre rigoureux les outils et étapes d'investigation pour identifier la cause exacte d'une dégradation I/O sur un serveur de bases de données.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Détection globale avec vmstat 1",
        "labelFr": "1. Détection globale avec vmstat 1",
        "detail": "Vérifier la colonne wa (I/O wait) et les transferts bi/bo (blocks in / blocks out)",
        "detailFr": "Vérifier la colonne wa (I/O wait) et les transferts bi/bo (blocks in / blocks out)"
      },
      {
        "id": "s2",
        "label": "2. Identification du périphérique physique saturé avec iostat -xz 1",
        "labelFr": "2. Identification du périphérique physique saturé avec iostat -xz 1",
        "detail": "Isoler le disque montrant %util proche de 100% ou un temps de service await anormalement élevé",
        "detailFr": "Isoler le disque montrant %util proche de 100% ou un temps de service await anormalement élevé"
      },
      {
        "id": "s3",
        "label": "3. Repérage des processus responsables avec iotop -oPa",
        "labelFr": "3. Repérage des processus responsables avec iotop -oPa",
        "detail": "Lister en temps réel les PIDs consommant le plus de bande passante disque en lecture et écriture",
        "detailFr": "Lister en temps réel les PIDs consommant le plus de bande passante disque en lecture et écriture"
      },
      {
        "id": "s4",
        "label": "4. Traçage des appels systèmes I/O du processus coupable (pidstat / strace)",
        "labelFr": "4. Traçage des appels systèmes I/O du processus coupable (pidstat / strace)",
        "detail": "Observer les appels write(), sync(), fdatasync() et identifier les fichiers accédés via lsof -p <PID>",
        "detailFr": "Observer les appels write(), sync(), fdatasync() et identifier les fichiers accédés via lsof -p <PID>"
      },
      {
        "id": "s5",
        "label": "5. Ajustement de l'ordonnanceur I/O ou optimisation applicative",
        "labelFr": "5. Ajustement de l'ordonnanceur I/O ou optimisation applicative",
        "detail": "Modifier l'ordonnanceur de bloc (bfq, mq-deadline, kyber) ou régler la stratégie d'écriture dirty memory",
        "detailFr": "Modifier l'ordonnanceur de bloc (bfq, mq-deadline, kyber) ou régler la stratégie d'écriture dirty memory"
      }
    ],
    "explanation": "L'entonnoir d'investigation I/O va du général au particulier : vmstat (vue d'ensemble wa/bi/bo) -> iostat (disque physique %util/await) -> iotop (processus consommateur) -> strace/lsof (fichiers et appels système) -> remédiation.",
    "explanationFr": "L'entonnoir d'investigation I/O va du général au particulier : vmstat (vue d'ensemble wa/bi/bo) -> iostat (disque physique %util/await) -> iotop (processus consommateur) -> strace/lsof (fichiers et appels système) -> remédiation."
  },

  # Topic 201: Linux Kernel (4)
  {
    "id": "seq-201-3",
    "title": "Building and Installing a Custom Linux Kernel from Source",
    "titleFr": "Compilation et installation d'un noyau Linux personnalisé depuis les sources",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.1",
    "category": "The Linux Kernel",
    "description": "Ordonnez les étapes standard de compilation et d'installation d'un nouveau noyau Linux officiel à partir de l'arborescence des sources dans /usr/src/linux.",
    "descriptionFr": "Ordonnez les étapes standard de compilation et d'installation d'un nouveau noyau Linux officiel à partir de l'arborescence des sources dans /usr/src/linux.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Préparation des sources et copie du .config existant",
        "labelFr": "1. Préparation des sources et copie du .config existant",
        "detail": "Décompresser les sources officielles et copier /boot/config-$(uname -r) vers .config",
        "detailFr": "Décompresser les sources officielles et copier /boot/config-$(uname -r) vers .config"
      },
      {
        "id": "s2",
        "label": "2. Personnalisation des options du noyau (make menuconfig)",
        "labelFr": "2. Personnalisation des options du noyau (make menuconfig)",
        "detail": "Ajuster les pilotes et options modulaires ou intégrés dans l'interface ncurses",
        "detailFr": "Ajuster les pilotes et options modulaires ou intégrés dans l'interface ncurses"
      },
      {
        "id": "s3",
        "label": "3. Compilation de l'image noyau et des modules (make -j$(nproc))",
        "labelFr": "3. Compilation de l'image noyau et des modules (make -j$(nproc))",
        "detail": "Compiler vmlinux/bzImage et tous les modules objets .ko en parallèle",
        "detailFr": "Compiler vmlinux/bzImage et tous les modules objets .ko en parallèle"
      },
      {
        "id": "s4",
        "label": "4. Installation des modules dans /lib/modules/ (make modules_install)",
        "labelFr": "4. Installation des modules dans /lib/modules/ (make modules_install)",
        "detail": "Copier les fichiers .ko dans /lib/modules/<version> et mettre à jour modules.dep",
        "detailFr": "Copier les fichiers .ko dans /lib/modules/<version> et mettre à jour modules.dep"
      },
      {
        "id": "s5",
        "label": "5. Installation du noyau et régénération du chargeur (make install)",
        "labelFr": "5. Installation du noyau et régénération du chargeur (make install)",
        "detail": "Copier vmlinuz et System.map dans /boot, générer l'initramfs et actualiser grub.cfg",
        "detailFr": "Copier vmlinuz et System.map dans /boot, générer l'initramfs et actualiser grub.cfg"
      }
    ],
    "explanation": "La séquence officielle de compilation du noyau Linux est : .config (base) -> make menuconfig -> make (compilation de bzImage & modules) -> make modules_install (placement dans /lib/modules/) -> make install (placement dans /boot et mise à jour de GRUB).",
    "explanationFr": "La séquence officielle de compilation du noyau Linux est : .config (base) -> make menuconfig -> make (compilation de bzImage & modules) -> make modules_install (placement dans /lib/modules/) -> make install (placement dans /boot et mise à jour de GRUB)."
  },
  {
    "id": "seq-201-4",
    "title": "Applying an Official Kernel Patch Safely",
    "titleFr": "Application sécurisée d'un correctif (patch) sur les sources du noyau",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.1",
    "category": "The Linux Kernel",
    "description": "Ordonnez la démarche professionnelle pour tester à blanc puis appliquer un patch différentiel sur l'arborescence des sources du noyau.",
    "descriptionFr": "Ordonnez la démarche professionnelle pour tester à blanc puis appliquer un patch différentiel sur l'arborescence des sources du noyau.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Positionnement à la racine des sources du noyau",
        "labelFr": "1. Positionnement à la racine des sources du noyau",
        "detail": "Se placer impérativement dans le répertoire racine du noyau : cd /usr/src/linux",
        "detailFr": "Se placer impérativement dans le répertoire racine du noyau : cd /usr/src/linux"
      },
      {
        "id": "s2",
        "label": "2. Test à blanc de l'application du patch (--dry-run)",
        "labelFr": "2. Test à blanc de l'application du patch (--dry-run)",
        "detail": "Vérifier la compatibilité sans modifier aucun fichier : patch -p1 --dry-run < /tmp/patch-x.y.z",
        "detailFr": "Vérifier la compatibilité sans modifier aucun fichier : patch -p1 --dry-run < /tmp/patch-x.y.z"
      },
      {
        "id": "s3",
        "label": "3. Application réelle du patch sur le code source",
        "labelFr": "3. Application réelle du patch sur le code source",
        "detail": "Injecter les modifications différentielles : patch -p1 < /tmp/patch-x.y.z",
        "detailFr": "Injecter les modifications différentielles : patch -p1 < /tmp/patch-x.y.z"
      },
      {
        "id": "s4",
        "label": "4. Recherche et traitement d'éventuels fichiers rejetés (.rej)",
        "labelFr": "4. Recherche et traitement d'éventuels fichiers rejetés (.rej)",
        "detail": "Vérifier avec find . -name '*.rej' qu'aucun bloc de code (hunk) n'a échoué",
        "detailFr": "Vérifier avec find . -name '*.rej' qu'aucun bloc de code (hunk) n'a échoué"
      },
      {
        "id": "s5",
        "label": "5. Nettoyage des sauvegardes temporaires (.orig)",
        "labelFr": "5. Nettoyage des sauvegardes temporaires (.orig)",
        "detail": "Supprimer les fichiers .orig créés lors du patching avant de lancer la recompilation",
        "detailFr": "Supprimer les fichiers .orig créés lors du patching avant de lancer la recompilation"
      }
    ],
    "explanation": "L'application d'un patch nécessite de se positionner à la racine du code source, d'exécuter un test à blanc (--dry-run) pour déceler tout conflit, d'appliquer le patch (-p1), puis de contrôler l'absence de rejets (.rej) avant recompilation.",
    "explanationFr": "L'application d'un patch nécessite de se positionner à la racine du code source, d'exécuter un test à blanc (--dry-run) pour déceler tout conflit, d'appliquer le patch (-p1), puis de contrôler l'absence de rejets (.rej) avant recompilation."
  },
  {
    "id": "seq-201-5",
    "title": "Building and Registering an Out-of-Tree Module with DKMS",
    "titleFr": "Intégration et enregistrement d'un pilote externe avec DKMS",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.2",
    "category": "The Linux Kernel",
    "description": "Ordonnez les étapes pour configurer Dynamic Kernel Module Support (DKMS) afin qu'un pilote tiers soit recompilé automatiquement lors des mises à jour du noyau.",
    "descriptionFr": "Ordonnez les étapes pour configurer Dynamic Kernel Module Support (DKMS) afin qu'un pilote tiers soit recompilé automatiquement lors des mises à jour du noyau.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Copie des sources dans /usr/src/<module>-<version>/",
        "labelFr": "1. Copie des sources dans /usr/src/<module>-<version>/",
        "detail": "Déposer les sources du pilote dans le répertoire normalisé avec son numéro de version",
        "detailFr": "Déposer les sources du pilote dans le répertoire normalisé avec son numéro de version"
      },
      {
        "id": "s2",
        "label": "2. Rédaction du fichier descriptif dkms.conf",
        "labelFr": "2. Rédaction du fichier descriptif dkms.conf",
        "detail": "Définir PACKAGE_NAME, PACKAGE_VERSION, CLEAN, MAKE[0] et DEST_MODULE_LOCATION",
        "detailFr": "Définir PACKAGE_NAME, PACKAGE_VERSION, CLEAN, MAKE[0] et DEST_MODULE_LOCATION"
      },
      {
        "id": "s3",
        "label": "3. Enregistrement de l'arbre source (dkms add)",
        "labelFr": "3. Enregistrement de l'arbre source (dkms add)",
        "detail": "Déclarer le module auprès de l'inventaire DKMS : dkms add -m <mod> -v <ver>",
        "detailFr": "Déclarer le module auprès de l'inventaire DKMS : dkms add -m <mod> -v <ver>"
      },
      {
        "id": "s4",
        "label": "4. Compilation du binaire pour le noyau actif (dkms build)",
        "labelFr": "4. Compilation du binaire pour le noyau actif (dkms build)",
        "detail": "Lancer la compilation automatique contre les kernel-headers en cours : dkms build -m <mod> -v <ver>",
        "detailFr": "Lancer la compilation automatique contre les kernel-headers en cours : dkms build -m <mod> -v <ver>"
      },
      {
        "id": "s5",
        "label": "5. Installation et vérification de chargement (dkms install & modprobe)",
        "labelFr": "5. Installation et vérification de chargement (dkms install & modprobe)",
        "detail": "Déployer le module dans /lib/modules/$(uname -r)/updates/dkms/ et le charger avec modprobe",
        "detailFr": "Déployer le module dans /lib/modules/$(uname -r)/updates/dkms/ et le charger avec modprobe"
      }
    ],
    "explanation": "Le cycle de vie DKMS respecte l'ordre rigoureux : sources dans /usr/src + dkms.conf -> dkms add -> dkms build -> dkms install. Dès lors, toute mise à jour du noyau déclenchera le build automatique via les hooks du gestionnaire de paquets.",
    "explanationFr": "Le cycle de vie DKMS respecte l'ordre rigoureux : sources dans /usr/src + dkms.conf -> dkms add -> dkms build -> dkms install. Dès lors, toute mise à jour du noyau déclenchera le build automatique via les hooks du gestionnaire de paquets."
  },
  {
    "id": "seq-201-6",
    "title": "Kernel Runtime Parameter Tuning and Persistence with sysctl",
    "titleFr": "Ajustement à chaud et persistance d'un paramètre noyau sysctl",
    "certification": "lpic-2",
    "topicNumber": 201,
    "objectiveId": "201.2",
    "category": "The Linux Kernel",
    "description": "Placez les actions dans l'ordre pour tester dynamiquement un paramètre de réseau ou de mémoire virtuelle avant de le rendre permanent.",
    "descriptionFr": "Placez les actions dans l'ordre pour tester dynamiquement un paramètre de réseau ou de mémoire virtuelle avant de le rendre permanent.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Consultation de la valeur courante dans /proc/sys/",
        "labelFr": "1. Consultation de la valeur courante dans /proc/sys/",
        "detail": "Lire la valeur actuelle via sysctl net.ipv4.ip_forward ou cat /proc/sys/net/ipv4/ip_forward",
        "detailFr": "Lire la valeur actuelle via sysctl net.ipv4.ip_forward ou cat /proc/sys/net/ipv4/ip_forward"
      },
      {
        "id": "s2",
        "label": "2. Modification immédiate en mémoire vive (sysctl -w)",
        "labelFr": "2. Modification immédiate en mémoire vive (sysctl -w)",
        "detail": "Appliquer la valeur à chaud sans redémarrage : sysctl -w net.ipv4.ip_forward=1",
        "detailFr": "Appliquer la valeur à chaud sans redémarrage : sysctl -w net.ipv4.ip_forward=1"
      },
      {
        "id": "s3",
        "label": "3. Validation du comportement sous charge ou test fonctionnel",
        "labelFr": "3. Validation du comportement sous charge ou test fonctionnel",
        "detail": "Tester le routage ou le comportement mémoire pour confirmer l'absence d'effet indésirable",
        "detailFr": "Tester le routage ou le comportement mémoire pour confirmer l'absence d'effet indésirable"
      },
      {
        "id": "s4",
        "label": "4. Rédaction d'un fichier dédié dans /etc/sysctl.d/",
        "labelFr": "4. Rédaction d'un fichier dédié dans /etc/sysctl.d/",
        "detail": "Créer /etc/sysctl.d/99-routing.conf avec la directive net.ipv4.ip_forward = 1",
        "detailFr": "Créer /etc/sysctl.d/99-routing.conf avec la directive net.ipv4.ip_forward = 1"
      },
      {
        "id": "s5",
        "label": "5. Rechargement global et test de persistance (sysctl --system)",
        "labelFr": "5. Rechargement global et test de persistance (sysctl --system)",
        "detail": "Vérifier la prise en compte de la configuration persistante par systemd-sysctl ou sysctl --system",
        "detailFr": "Vérifier la prise en compte de la configuration persistante par systemd-sysctl ou sysctl --system"
      }
    ],
    "explanation": "La bonne pratique sysctl consiste à : vérifier la valeur courante -> tester à chaud avec sysctl -w -> valider l'impact -> pérenniser dans /etc/sysctl.d/*.conf -> recharger avec sysctl --system.",
    "explanationFr": "La bonne pratique sysctl consiste à : vérifier la valeur courante -> tester à chaud avec sysctl -w -> valider l'impact -> pérenniser dans /etc/sysctl.d/*.conf -> recharger avec sysctl --system."
  },

  # Topic 202: System Startup (3)
  {
    "id": "seq-201-7",
    "title": "Creating and Deploying a Custom Initramfs with Dracut",
    "titleFr": "Génération et déploiement d'un Initramfs personnalisé avec Dracut",
    "certification": "lpic-2",
    "topicNumber": 202,
    "objectiveId": "202.1",
    "category": "System Startup",
    "description": "Ordonnez la démarche pour ajouter des pilotes de stockage critiques dans l'image de démarrage initramfs avec l'outil Dracut.",
    "descriptionFr": "Ordonnez la démarche pour ajouter des pilotes de stockage critiques dans l'image de démarrage initramfs avec l'outil Dracut.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition des modules requis dans /etc/dracut.conf.d/",
        "labelFr": "1. Définition des modules requis dans /etc/dracut.conf.d/",
        "detail": "Créer un fichier de configuration contenant add_drivers+=' nvme megaraid_sas '",
        "detailFr": "Créer un fichier de configuration contenant add_drivers+=' nvme megaraid_sas '"
      },
      {
        "id": "s2",
        "label": "2. Sauvegarde de sécurité de l'initramfs actif",
        "labelFr": "2. Sauvegarde de sécurité de l'initramfs actif",
        "detail": "Copier /boot/initramfs-$(uname -r).img vers un nom de secours (.img.bak)",
        "detailFr": "Copier /boot/initramfs-$(uname -r).img vers un nom de secours (.img.bak)"
      },
      {
        "id": "s3",
        "label": "3. Génération forcée de la nouvelle image (dracut -f)",
        "labelFr": "3. Génération forcée de la nouvelle image (dracut -f)",
        "detail": "Compiler l'archive cpio compressée pour le noyau actif : dracut -f /boot/initramfs-$(uname -r).img $(uname -r)",
        "detailFr": "Compiler l'archive cpio compressée pour le noyau actif : dracut -f /boot/initramfs-$(uname -r).img $(uname -r)"
      },
      {
        "id": "s4",
        "label": "4. Contrôle du contenu de l'archive avec lsinitrd",
        "labelFr": "4. Contrôle du contenu de l'archive avec lsinitrd",
        "detail": "Vérifier la présence effective des modules .ko dans l'image via lsinitrd | grep megaraid",
        "detailFr": "Vérifier la présence effective des modules .ko dans l'image via lsinitrd | grep megaraid"
      },
      {
        "id": "s5",
        "label": "5. Mise à jour du menu de démarrage et test de reboot",
        "labelFr": "5. Mise à jour du menu de démarrage et test de reboot",
        "detail": "Synchroniser grub.cfg si nécessaire et valider le boot sans Kernel Panic",
        "detailFr": "Synchroniser grub.cfg si nécessaire et valider le boot sans Kernel Panic"
      }
    ],
    "explanation": "La régénération d'initramfs avec Dracut demande de : configurer les modules nécessaires dans dracut.conf.d -> sauvegarder l'ancienne image -> compiler avec dracut -f -> vérifier l'arborescence avec lsinitrd -> redémarrer.",
    "explanationFr": "La régénération d'initramfs avec Dracut demande de : configurer les modules nécessaires dans dracut.conf.d -> sauvegarder l'ancienne image -> compiler avec dracut -f -> vérifier l'arborescence avec lsinitrd -> redémarrer."
  },
  {
    "id": "seq-201-8",
    "title": "Writing and Testing a Custom Udev Device Rule",
    "titleFr": "Création, test et activation d'une règle Udev personnalisée",
    "certification": "lpic-2",
    "topicNumber": 202,
    "objectiveId": "202.2",
    "category": "System Startup",
    "description": "Ordonnez les étapes pour assigner un lien symbolique persistant et des droits spécifiques à un périphérique USB via udev.",
    "descriptionFr": "Ordonnez les étapes pour assigner un lien symbolique persistant et des droits spécifiques à un périphérique USB via udev.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Extraction des attributs matériels avec udevadm info",
        "labelFr": "1. Extraction des attributs matériels avec udevadm info",
        "detail": "Exécuter udevadm info -a -p $(udevadm info -q path -n /dev/sdb) pour relever idVendor et idProduct",
        "detailFr": "Exécuter udevadm info -a -p $(udevadm info -q path -n /dev/sdb) pour relever idVendor et idProduct"
      },
      {
        "id": "s2",
        "label": "2. Rédaction de la règle dans /etc/udev/rules.d/",
        "labelFr": "2. Rédaction de la règle dans /etc/udev/rules.d/",
        "detail": "Créer 99-usb-backup.rules avec ATTRS{idVendor}==\"...\", SYMLINK+=\"backup_disk\", MODE=\"0660\"",
        "detailFr": "Créer 99-usb-backup.rules avec ATTRS{idVendor}==\"...\", SYMLINK+=\"backup_disk\", MODE=\"0660\""
      },
      {
        "id": "s3",
        "label": "3. Rechargement des règles en mémoire (udevadm control)",
        "labelFr": "3. Rechargement des règles en mémoire (udevadm control)",
        "detail": "Notifier le démon udev des modifications : udevadm control --reload-rules",
        "detailFr": "Notifier le démon udev des modifications : udevadm control --reload-rules"
      },
      {
        "id": "s4",
        "label": "4. Déclenchement synthétique des événements udev (udevadm trigger)",
        "labelFr": "4. Déclenchement synthétique des événements udev (udevadm trigger)",
        "detail": "Simuler le branchement pour appliquer la règle sans débrancher physiquement le disque",
        "detailFr": "Simuler le branchement pour appliquer la règle sans débrancher physiquement le disque"
      },
      {
        "id": "s5",
        "label": "5. Vérification de la création du lien symbolique dans /dev",
        "labelFr": "5. Vérification de la création du lien symbolique dans /dev",
        "detail": "Vérifier la présence et les permissions du symlink avec ls -l /dev/backup_disk",
        "detailFr": "Vérifier la présence et les permissions du symlink avec ls -l /dev/backup_disk"
      }
    ],
    "explanation": "La séquence udev respecte : 1) relever les attributs matériels via udevadm info -a, 2) écrire la règle dans /etc/udev/rules.d/, 3) recharger avec udevadm control --reload-rules, 4) déclencher avec udevadm trigger, 5) vérifier le symlink résultant dans /dev.",
    "explanationFr": "La séquence udev respecte : 1) relever les attributs matériels via udevadm info -a, 2) écrire la règle dans /etc/udev/rules.d/, 3) recharger avec udevadm control --reload-rules, 4) déclencher avec udevadm trigger, 5) vérifier le symlink résultant dans /dev."
  },
  {
    "id": "seq-201-9",
    "title": "Systemd Target Switching and Custom Default Target Configuration",
    "titleFr": "Bascule de cible Systemd et configuration de la cible par défaut",
    "certification": "lpic-2",
    "topicNumber": 202,
    "objectiveId": "202.1",
    "category": "System Startup",
    "description": "Ordonnez la séquence pour passer un serveur de mode graphique à mode multi-utilisateur sans serveur X, et pérenniser ce choix.",
    "descriptionFr": "Ordonnez la séquence pour passer un serveur de mode graphique à mode multi-utilisateur sans serveur X, et pérenniser ce choix.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Identification de la cible courante (systemctl get-default)",
        "labelFr": "1. Identification de la cible courante (systemctl get-default)",
        "detail": "Vérifier vers quelle target pointe /etc/systemd/system/default.target (ex: graphical.target)",
        "detailFr": "Vérifier vers quelle target pointe /etc/systemd/system/default.target (ex: graphical.target)"
      },
      {
        "id": "s2",
        "label": "2. Définition permanente de la nouvelle cible par défaut",
        "labelFr": "2. Définition permanente de la nouvelle cible par défaut",
        "detail": "Créer le lien symbolique pérenne : systemctl set-default multi-user.target",
        "detailFr": "Créer le lien symbolique pérenne : systemctl set-default multi-user.target"
      },
      {
        "id": "s3",
        "label": "3. Bascule immédiate à chaud en isolant la cible",
        "labelFr": "3. Bascule immédiate à chaud en isolant la cible",
        "detail": "Arrêter les services graphiques et basculer sans rebooter : systemctl isolate multi-user.target",
        "detailFr": "Arrêter les services graphiques et basculer sans rebooter : systemctl isolate multi-user.target"
      },
      {
        "id": "s4",
        "label": "4. Contrôle des unités actives dans la nouvelle cible",
        "labelFr": "4. Contrôle des unités actives dans la nouvelle cible",
        "detail": "Vérifier l'état avec systemctl list-units --type=target et systemctl is-active display-manager",
        "detailFr": "Vérifier l'état avec systemctl list-units --type=target et systemctl is-active display-manager"
      }
    ],
    "explanation": "Pour modifier la cible Systemd : get-default (état des lieux) -> set-default (création du lien symbolique /etc/systemd/system/default.target) -> isolate (bascule en direct de la machine dans le nouvel état) -> vérification des services.",
    "explanationFr": "Pour modifier la cible Systemd : get-default (état des lieux) -> set-default (création du lien symbolique /etc/systemd/system/default.target) -> isolate (bascule en direct de la machine dans le nouvel état) -> vérification des services."
  },

  # Topic 203: Filesystem and Devices (4)
  {
    "id": "seq-201-10",
    "title": "Software RAID 5 Array Creation and Persistence with mdadm",
    "titleFr": "Création et persistance d'une grappe RAID 5 logicielle avec mdadm",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.1",
    "category": "Filesystem and Devices",
    "description": "Ordonnez les étapes pour initialiser 3 disques en RAID 5 (/dev/md0), formater, monter et pérenniser la configuration.",
    "descriptionFr": "Ordonnez les étapes pour initialiser 3 disques en RAID 5 (/dev/md0), formater, monter et pérenniser la configuration.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création des partitions avec type Linux RAID (fd00)",
        "labelFr": "1. Création des partitions avec type Linux RAID (fd00)",
        "detail": "Partitionner /dev/sdb, /dev/sdc, /dev/sdd avec fdisk/gdisk en affectant le type Linux RAID autodetect",
        "detailFr": "Partitionner /dev/sdb, /dev/sdc, /dev/sdd avec fdisk/gdisk en affectant le type Linux RAID autodetect"
      },
      {
        "id": "s2",
        "label": "2. Création de la matrice RAID 5 avec mdadm",
        "labelFr": "2. Création de la matrice RAID 5 avec mdadm",
        "detail": "Exécuter mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1",
        "detailFr": "Exécuter mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1"
      },
      {
        "id": "s3",
        "label": "3. Surveillance de la synchronisation initiale dans /proc/mdstat",
        "labelFr": "3. Surveillance de la synchronisation initiale dans /proc/mdstat",
        "detail": "Surveiller la construction de la parité et attendre l'état [UUU] avec cat /proc/mdstat",
        "detailFr": "Surveiller la construction de la parité et attendre l'état [UUU] avec cat /proc/mdstat"
      },
      {
        "id": "s4",
        "label": "4. Enregistrement de la configuration dans mdadm.conf",
        "labelFr": "4. Enregistrement de la configuration dans mdadm.conf",
        "detail": "Sauvegarder l'UUID du RAID : mdadm --detail --scan >> /etc/mdadm/mdadm.conf",
        "detailFr": "Sauvegarder l'UUID du RAID : mdadm --detail --scan >> /etc/mdadm/mdadm.conf"
      },
      {
        "id": "s5",
        "label": "5. Formatage, montage et déclaration dans /etc/fstab",
        "labelFr": "5. Formatage, montage et déclaration dans /etc/fstab",
        "detail": "Formater via mkfs.ext4 /dev/md0 et déclarer le point de montage dans /etc/fstab",
        "detailFr": "Formater via mkfs.ext4 /dev/md0 et déclarer le point de montage dans /etc/fstab"
      }
    ],
    "explanation": "L'installation d'un RAID 5 logiciel impose : 1) partitions marquées RAID, 2) création via mdadm --create, 3) vérification de la synchro dans /proc/mdstat, 4) scan dans mdadm.conf pour assemblage au boot, 5) formatage et montage fstab.",
    "explanationFr": "L'installation d'un RAID 5 logiciel impose : 1) partitions marquées RAID, 2) création via mdadm --create, 3) vérification de la synchro dans /proc/mdstat, 4) scan dans mdadm.conf pour assemblage au boot, 5) formatage et montage fstab."
  },
  {
    "id": "seq-201-11",
    "title": "Replacing a Failed Hard Drive in a Software RAID Array",
    "titleFr": "Remplacement à chaud d'un disque défaillant dans un volume RAID mdadm",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.1",
    "category": "Filesystem and Devices",
    "description": "Ordonnez les étapes d'intervention d'urgence pour remplacer un disque en panne dans une grappe RAID 1 ou 5 sans interruption de service.",
    "descriptionFr": "Ordonnez les étapes d'intervention d'urgence pour remplacer un disque en panne dans une grappe RAID 1 ou 5 sans interruption de service.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Marquage explicite du composant défectueux en panne (--fail)",
        "labelFr": "1. Marquage explicite du composant défectueux en panne (--fail)",
        "detail": "Isoler la partition défaillante : mdadm --manage /dev/md0 --fail /dev/sdc1",
        "detailFr": "Isoler la partition défaillante : mdadm --manage /dev/md0 --fail /dev/sdc1"
      },
      {
        "id": "s2",
        "label": "2. Retrait logique du disque de la grappe (--remove)",
        "labelFr": "2. Retrait logique du disque de la grappe (--remove)",
        "detail": "Détacher le membre hors-service : mdadm --manage /dev/md0 --remove /dev/sdc1",
        "detailFr": "Détacher le membre hors-service : mdadm --manage /dev/md0 --remove /dev/sdc1"
      },
      {
        "id": "s3",
        "label": "3. Remplacement matériel et clonage de la table de partitions",
        "labelFr": "3. Remplacement matériel et clonage de la table de partitions",
        "detail": "Remplacer physiquement le disque puis dupliquer la géométrie : sfdisk -d /dev/sdb | sfdisk /dev/sdc",
        "detailFr": "Remplacer physiquement le disque puis dupliquer la géométrie : sfdisk -d /dev/sdb | sfdisk /dev/sdc"
      },
      {
        "id": "s4",
        "label": "4. Insertion de la nouvelle partition dans la grappe (--add)",
        "labelFr": "4. Insertion de la nouvelle partition dans la grappe (--add)",
        "detail": "Intégrer le nouveau support de remplacement : mdadm --manage /dev/md0 --add /dev/sdc1",
        "detailFr": "Intégrer le nouveau support de remplacement : mdadm --manage /dev/md0 --add /dev/sdc1"
      },
      {
        "id": "s5",
        "label": "5. Suivi de la reconstruction (resync) dans /proc/mdstat",
        "labelFr": "5. Suivi de la reconstruction (resync) dans /proc/mdstat",
        "detail": "Observer la progression du recovery jusqu'à ce que la grappe redevienne clean",
        "detailFr": "Observer la progression du recovery jusqu'à ce que la grappe redevienne clean"
      }
    ],
    "explanation": "La procédure de remplacement de disque RAID mdadm est immuable : 1) fail (marquer en panne), 2) remove (retirer de la matrice), 3) clonage partitionnement sur nouveau disque, 4) add (réinsérer dans la matrice), 5) monitoring du resync.",
    "explanationFr": "La procédure de remplacement de disque RAID mdadm est immuable : 1) fail (marquer en panne), 2) remove (retirer de la matrice), 3) clonage partitionnement sur nouveau disque, 4) add (réinsérer dans la matrice), 5) monitoring du resync."
  },
  {
    "id": "seq-201-12",
    "title": "Configuring LUKS / dm-crypt Block Device Encryption with Persistence",
    "titleFr": "Chiffrement d'un volume de stockage avec LUKS / dm-crypt et persistance",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.3",
    "category": "Filesystem and Devices",
    "description": "Placez les étapes pour chiffrer une partition /dev/sdb1, créer le conteneur déchiffré, formater et rendre le déverrouillage automatique au boot.",
    "descriptionFr": "Placez les étapes pour chiffrer une partition /dev/sdb1, créer le conteneur déchiffré, formater et rendre le déverrouillage automatique au boot.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Formatage du conteneur chiffré (cryptsetup luksFormat)",
        "labelFr": "1. Formatage du conteneur chiffré (cryptsetup luksFormat)",
        "detail": "Initialiser l'en-tête LUKS et définir la phrase de passe : cryptsetup luksFormat /dev/sdb1",
        "detailFr": "Initialiser l'en-tête LUKS et définir la phrase de passe : cryptsetup luksFormat /dev/sdb1"
      },
      {
        "id": "s2",
        "label": "2. Ouverture et mappage du périphérique virtuel (cryptsetup luksOpen)",
        "labelFr": "2. Ouverture et mappage du périphérique virtuel (cryptsetup luksOpen)",
        "detail": "Déchiffrer vers /dev/mapper/secure_data : cryptsetup luksOpen /dev/sdb1 secure_data",
        "detailFr": "Déchiffrer vers /dev/mapper/secure_data : cryptsetup luksOpen /dev/sdb1 secure_data"
      },
      {
        "id": "s3",
        "label": "3. Création du système de fichiers sur le mapper virtuel",
        "labelFr": "3. Création du système de fichiers sur le mapper virtuel",
        "detail": "Formater le volume logique déchiffré : mkfs.ext4 /dev/mapper/secure_data",
        "detailFr": "Formater le volume logique déchiffré : mkfs.ext4 /dev/mapper/secure_data"
      },
      {
        "id": "s4",
        "label": "4. Déclaration du mapping dans /etc/crypttab",
        "labelFr": "4. Déclaration du mapping dans /etc/crypttab",
        "detail": "Ajouter la ligne secure_data UUID=<uuid_sdb1> /root/keyfile.bin luks dans /etc/crypttab",
        "detailFr": "Ajouter la ligne secure_data UUID=<uuid_sdb1> /root/keyfile.bin luks dans /etc/crypttab"
      },
      {
        "id": "s5",
        "label": "5. Déclaration du montage dans /etc/fstab",
        "labelFr": "5. Déclaration du montage dans /etc/fstab",
        "detail": "Ajouter /dev/mapper/secure_data /mnt/secure ext4 defaults 0 2 dans /etc/fstab",
        "detailFr": "Ajouter /dev/mapper/secure_data /mnt/secure ext4 defaults 0 2 dans /etc/fstab"
      }
    ],
    "explanation": "Pour LUKS : 1) luksFormat (création de l'en-tête), 2) luksOpen (mappage dans /dev/mapper/), 3) mkfs sur le mapping, 4) déclaration dans /etc/crypttab, 5) déclaration du point de montage dans /etc/fstab.",
    "explanationFr": "Pour LUKS : 1) luksFormat (création de l'en-tête), 2) luksOpen (mappage dans /dev/mapper/), 3) mkfs sur le mapping, 4) déclaration dans /etc/crypttab, 5) déclaration du point de montage dans /etc/fstab."
  },
  {
    "id": "seq-201-13",
    "title": "Configuring On-Demand AutoFS Automounting for Remote Shares",
    "titleFr": "Configuration du montage automatique à la demande avec AutoFS",
    "certification": "lpic-2",
    "topicNumber": 203,
    "objectiveId": "203.2",
    "category": "Filesystem and Devices",
    "description": "Ordonnez la démarche pour configurer le démon automount d'AutoFS afin de monter automatiquement un partage NFS lors de son accès.",
    "descriptionFr": "Ordonnez la démarche pour configurer le démon automount d'AutoFS afin de monter automatiquement un partage NFS lors de son accès.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Installation du paquet autofs et vérification du support noyau",
        "labelFr": "1. Installation du paquet autofs et vérification du support noyau",
        "detail": "Installer autofs et vérifier que le module noyau autofs4 est disponible",
        "detailFr": "Installer autofs et vérifier que le module noyau autofs4 est disponible"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du point de montage maître dans /etc/auto.master",
        "labelFr": "2. Déclaration du point de montage maître dans /etc/auto.master",
        "detail": "Associer le répertoire parent au fichier map dédié : /mnt/shares /etc/auto.shares --timeout=60",
        "detailFr": "Associer le répertoire parent au fichier map dédié : /mnt/shares /etc/auto.shares --timeout=60"
      },
      {
        "id": "s3",
        "label": "3. Définition des sous-répertoires et cibles dans le fichier map dédié",
        "labelFr": "3. Définition des sous-répertoires et cibles dans le fichier map dédié",
        "detail": "Ajouter dans /etc/auto.shares : backup -fstype=nfs,rw,soft nas.corp.lan:/srv/backup",
        "detailFr": "Ajouter dans /etc/auto.shares : backup -fstype=nfs,rw,soft nas.corp.lan:/srv/backup"
      },
      {
        "id": "s4",
        "label": "4. Démarrage et activation du service autofs",
        "labelFr": "4. Démarrage et activation du service autofs",
        "detail": "Démarrer le démon : systemctl enable --now autofs.service",
        "detailFr": "Démarrer le démon : systemctl enable --now autofs.service"
      },
      {
        "id": "s5",
        "label": "5. Test du montage transparent par accès répertoire",
        "labelFr": "5. Test du montage transparent par accès répertoire",
        "detail": "Exécuter ls /mnt/shares/backup et observer le montage automatique instantané via df -h",
        "detailFr": "Exécuter ls /mnt/shares/backup et observer le montage automatique instantané via df -h"
      }
    ],
    "explanation": "AutoFS se configure par : master map (/etc/auto.master) -> direct ou indirect map (/etc/auto.*) -> démarrage du service autofs -> test de déclenchement à l'accès répertoire.",
    "explanationFr": "AutoFS se configure par : master map (/etc/auto.master) -> direct ou indirect map (/etc/auto.*) -> démarrage du service autofs -> test de déclenchement à l'accès répertoire."
  },

  # Topic 204: Advanced Storage Management (3)
  {
    "id": "seq-201-14",
    "title": "Online LVM Logical Volume and XFS Filesystem Extension",
    "titleFr": "Extension en ligne d'un volume logique LVM et de son système XFS",
    "certification": "lpic-2",
    "topicNumber": 204,
    "objectiveId": "204.1",
    "category": "Advanced Storage Management",
    "description": "Ordonnez les commandes pour intégrer un nouveau disque physique dans un Volume Group, étendre le volume logique et agrandir le système XFS en production.",
    "descriptionFr": "Ordonnez les commandes pour intégrer un nouveau disque physique dans un Volume Group, étendre le volume logique et agrandir le système XFS en production.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Initialisation du nouveau disque physique (pvcreate /dev/sdc)",
        "labelFr": "1. Initialisation du nouveau disque physique (pvcreate /dev/sdc)",
        "detail": "Écrire les en-têtes LVM sur le nouveau disque physique disponible",
        "detailFr": "Écrire les en-têtes LVM sur le nouveau disque physique disponible"
      },
      {
        "id": "s2",
        "label": "2. Agrandissement du groupe de volumes existant (vgextend)",
        "labelFr": "2. Agrandissement du groupe de volumes existant (vgextend)",
        "detail": "Ajouter l'espace physique au groupe : vgextend data_vg /dev/sdc",
        "detailFr": "Ajouter l'espace physique au groupe : vgextend data_vg /dev/sdc"
      },
      {
        "id": "s3",
        "label": "3. Extension de la capacité du volume logique (lvextend)",
        "labelFr": "3. Extension de la capacité du volume logique (lvextend)",
        "detail": "Agrandir le volume logique cible : lvextend -L +50G /dev/data_vg/app_lv",
        "detailFr": "Agrandir le volume logique cible : lvextend -L +50G /dev/data_vg/app_lv"
      },
      {
        "id": "s4",
        "label": "4. Extension en ligne du système de fichiers XFS (xfs_growfs)",
        "labelFr": "4. Extension en ligne du système de fichiers XFS (xfs_growfs)",
        "detail": "Agrandir le FS monté en passant son point de montage : xfs_growfs /var/app",
        "detailFr": "Agrandir le FS monté en passant son point de montage : xfs_growfs /var/app"
      },
      {
        "id": "s5",
        "label": "5. Validation de la nouvelle capacité disponible (df -h)",
        "labelFr": "5. Validation de la nouvelle capacité disponible (df -h)",
        "detail": "Vérifier que l'espace supplémentaire de 50 Go est immédiatement exploitable",
        "detailFr": "Vérifier que l'espace supplémentaire de 50 Go est immédiatement exploitable"
      }
    ],
    "explanation": "L'extension LVM + XFS suit l'ordre : pvcreate (nouveau disque) -> vgextend (agrandir le VG) -> lvextend (agrandir le LV) -> xfs_growfs (agrandir le FS monté, note : XFS ne supporte pas la réduction) -> df -h.",
    "explanationFr": "L'extension LVM + XFS suit l'ordre : pvcreate (nouveau disque) -> vgextend (agrandir le VG) -> lvextend (agrandir le LV) -> xfs_growfs (agrandir le FS monté, note : XFS ne supporte pas la réduction) -> df -h."
  },
  {
    "id": "seq-201-15",
    "title": "LVM Snapshot Creation and Consistent Backup Workflow",
    "titleFr": "Création d'un Snapshot LVM et exécution d'une sauvegarde cohérente",
    "certification": "lpic-2",
    "topicNumber": 204,
    "objectiveId": "204.1",
    "category": "Advanced Storage Management",
    "description": "Ordonnez le cycle de vie complet d'un cliché instantané LVM (snapshot) pour sauvegarder une base de données sans temps d'arrêt.",
    "descriptionFr": "Ordonnez le cycle de vie complet d'un cliché instantané LVM (snapshot) pour sauvegarder une base de données sans temps d'arrêt.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Gel temporaire des écritures applicatives (Flush / Lock)",
        "labelFr": "1. Gel temporaire des écritures applicatives (Flush / Lock)",
        "detail": "Exécuter FLUSH TABLES WITH READ LOCK ou geler le système de fichiers avec fsfreeze -f",
        "detailFr": "Exécuter FLUSH TABLES WITH READ LOCK ou geler le système de fichiers avec fsfreeze -f"
      },
      {
        "id": "s2",
        "label": "2. Création du volume snapshot LVM (lvcreate -s)",
        "labelFr": "2. Création du volume snapshot LVM (lvcreate -s)",
        "detail": "Instancier le snapshot Copy-On-Write : lvcreate -s -n db_snap -L 10G /dev/vg0/db_lv",
        "detailFr": "Instancier le snapshot Copy-On-Write : lvcreate -s -n db_snap -L 10G /dev/vg0/db_lv"
      },
      {
        "id": "s3",
        "label": "3. Déblocage immédiat des écritures sur la base principale (Unlock)",
        "labelFr": "3. Déblocage immédiat des écritures sur la base principale (Unlock)",
        "detail": "Relâcher le verrou applicatif ou dégeler le FS avec fsfreeze -u (durée du gel < 1 seconde)",
        "detailFr": "Relâcher le verrou applicatif ou dégeler le FS avec fsfreeze -u (durée du gel < 1 seconde)"
      },
      {
        "id": "s4",
        "label": "4. Montage du snapshot en lecture seule et copie des données",
        "labelFr": "4. Montage du snapshot en lecture seule et copie des données",
        "detail": "Monter /dev/vg0/db_snap sur /mnt/backup (option nouuid si XFS) et archiver avec tar/rsync",
        "detailFr": "Monter /dev/vg0/db_snap sur /mnt/backup (option nouuid si XFS) et archiver avec tar/rsync"
      },
      {
        "id": "s5",
        "label": "5. Démontage et suppression du snapshot (lvremove)",
        "labelFr": "5. Démontage et suppression du snapshot (lvremove)",
        "detail": "Démonter /mnt/backup et détruire le snapshot pour libérer l'espace COW : lvremove -y /dev/vg0/db_snap",
        "detailFr": "Démonter /mnt/backup et détruire le snapshot pour libérer l'espace COW : lvremove -y /dev/vg0/db_snap"
      }
    ],
    "explanation": "Le workflow du snapshot LVM : 1) gel bref des I/O, 2) création du snapshot (lvcreate -s), 3) dégel immédiat de la prod, 4) montage et extraction de la sauvegarde depuis le snapshot, 5) démontage et lvremove du snapshot pour ne pas saturer l'espace COW.",
    "explanationFr": "Le workflow du snapshot LVM : 1) gel bref des I/O, 2) création du snapshot (lvcreate -s), 3) dégel immédiat de la prod, 4) montage et extraction de la sauvegarde depuis le snapshot, 5) démontage et lvremove du snapshot pour ne pas saturer l'espace COW."
  },
  {
    "id": "seq-201-16",
    "title": "Configuring an iSCSI Initiator Client to Connect to a Target",
    "titleFr": "Configuration d'un client initiateur iSCSI et connexion à une cible",
    "certification": "lpic-2",
    "topicNumber": 204,
    "objectiveId": "204.2",
    "category": "Advanced Storage Management",
    "description": "Placez les commandes d'administration dans l'ordre pour connecter un serveur Linux à une baie SAN iSCSI distante.",
    "descriptionFr": "Placez les commandes d'administration dans l'ordre pour connecter un serveur Linux à une baie SAN iSCSI distante.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition de l'IQN dans /etc/iscsi/initiatorname.iscsi",
        "labelFr": "1. Définition de l'IQN dans /etc/iscsi/initiatorname.iscsi",
        "detail": "Déclarer l'identifiant client unique : InitiatorName=iqn.2026-09.lan.corp:srv-app01",
        "detailFr": "Déclarer l'identifiant client unique : InitiatorName=iqn.2026-09.lan.corp:srv-app01"
      },
      {
        "id": "s2",
        "label": "2. Démarrage du démon iSCSI (iscsid)",
        "labelFr": "2. Démarrage du démon iSCSI (iscsid)",
        "detail": "Activer le service d'arrière-plan de gestion des sessions : systemctl start iscsid",
        "detailFr": "Activer le service d'arrière-plan de gestion des sessions : systemctl start iscsid"
      },
      {
        "id": "s3",
        "label": "3. Découverte des cibles exposées par le portail (iscsiadm discovery)",
        "labelFr": "3. Découverte des cibles exposées par le portail (iscsiadm discovery)",
        "detail": "Interroger la baie SAN : iscsiadm -m discovery -t st -p 192.168.10.50",
        "detailFr": "Interroger la baie SAN : iscsiadm -m discovery -t st -p 192.168.10.50"
      },
      {
        "id": "s4",
        "label": "4. Authentification et ouverture de session sur le Target (iscsiadm login)",
        "labelFr": "4. Authentification et ouverture de session sur le Target (iscsiadm login)",
        "detail": "Établir la session TCP/SCSI : iscsiadm -m node -T iqn.target -p 192.168.10.50 -l",
        "detailFr": "Établir la session TCP/SCSI : iscsiadm -m node -T iqn.target -p 192.168.10.50 -l"
      },
      {
        "id": "s5",
        "label": "5. Détection du nouveau périphérique de bloc SCSI local",
        "labelFr": "5. Détection du nouveau périphérique de bloc SCSI local",
        "detail": "Vérifier la création du nouveau disque (ex: /dev/sdd) via dmesg ou lsblk --scsi",
        "detailFr": "Vérifier la création du nouveau disque (ex: /dev/sdd) via dmesg ou lsblk --scsi"
      }
    ],
    "explanation": "La connexion d'un client iSCSI requiert : 1) configurer l'IQN client dans initiatorname.iscsi, 2) démarrer iscsid, 3) découvrir les cibles avec iscsiadm -m discovery, 4) se connecter avec iscsiadm -m node -l, 5) exploiter le disque SCSI apparu dans le noyau.",
    "explanationFr": "La connexion d'un client iSCSI requiert : 1) configurer l'IQN client dans initiatorname.iscsi, 2) démarrer iscsid, 3) découvrir les cibles avec iscsiadm -m discovery, 4) se connecter avec iscsiadm -m node -l, 5) exploiter le disque SCSI apparu dans le noyau."
  },

  # Topic 205: Network Configuration (2)
  {
    "id": "seq-201-17",
    "title": "Configuring LACP Network Interface Bonding (802.3ad) with iproute2",
    "titleFr": "Agrégation de liens réseau (Bonding LACP / 802.3ad) avec iproute2",
    "certification": "lpic-2",
    "topicNumber": 205,
    "objectiveId": "205.1",
    "category": "Network Configuration",
    "description": "Ordonnez les étapes pour agréger eth1 et eth2 sous une interface virtuelle bond0 en mode haute disponibilité et répartition LACP.",
    "descriptionFr": "Ordonnez les étapes pour agréger eth1 et eth2 sous une interface virtuelle bond0 en mode haute disponibilité et répartition LACP.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Chargement du module noyau bonding avec paramètres miimon",
        "labelFr": "1. Chargement du module noyau bonding avec paramètres miimon",
        "detail": "Charger le pilote : modprobe bonding mode=802.3ad miimon=100",
        "detailFr": "Charger le pilote : modprobe bonding mode=802.3ad miimon=100"
      },
      {
        "id": "s2",
        "label": "2. Création de l'interface maîtresse virtuelle bond0",
        "labelFr": "2. Création de l'interface maîtresse virtuelle bond0",
        "detail": "Créer le lien : ip link add name bond0 type bond mode 802.3ad miimon 100",
        "detailFr": "Créer le lien : ip link add name bond0 type bond mode 802.3ad miimon 100"
      },
      {
        "id": "s3",
        "label": "3. Extinction et asservissement des interfaces physiques esclaves",
        "labelFr": "3. Extinction et asservissement des interfaces physiques esclaves",
        "detail": "Désactiver les cartes puis les rattacher au master : ip link set eth1 down && ip link set eth1 master bond0",
        "detailFr": "Désactiver les cartes puis les rattacher au master : ip link set eth1 down && ip link set eth1 master bond0"
      },
      {
        "id": "s4",
        "label": "4. Attribution de l'adresse IP et activation du lien bond0",
        "labelFr": "4. Attribution de l'adresse IP et activation du lien bond0",
        "detail": "Affecter l'IP au lien agrégé : ip addr add 192.168.1.10/24 dev bond0 && ip link set bond0 up",
        "detailFr": "Affecter l'IP au lien agrégé : ip addr add 192.168.1.10/24 dev bond0 && ip link set bond0 up"
      },
      {
        "id": "s5",
        "label": "5. Vérification du statut LACP et de l'état des partenaires",
        "labelFr": "5. Vérification du statut LACP et de l'état des partenaires",
        "detail": "Consulter /proc/net/bonding/bond0 pour vérifier l'état du switch et des interfaces esclaves",
        "detailFr": "Consulter /proc/net/bonding/bond0 pour vérifier l'état du switch et des interfaces esclaves"
      }
    ],
    "explanation": "L'agrégation bonding requiert : 1) module bonding, 2) création du lien maître bond0, 3) rattachement des cartes esclaves (master bond0), 4) affectation de l'IP sur bond0 (et jamais sur les esclaves), 5) contrôle dans /proc/net/bonding/bond0.",
    "explanationFr": "L'agrégation bonding requiert : 1) module bonding, 2) création du lien maître bond0, 3) rattachement des cartes esclaves (master bond0), 4) affectation de l'IP sur bond0 (et jamais sur les esclaves), 5) contrôle dans /proc/net/bonding/bond0."
  },
  {
    "id": "seq-201-18",
    "title": "Implementing Policy Routing (Multi-Homed Source-Based Routing)",
    "titleFr": "Mise en place d'un routage conditionnel par la source (Policy Routing)",
    "certification": "lpic-2",
    "topicNumber": 205,
    "objectiveId": "205.2",
    "category": "Network Configuration",
    "description": "Ordonnez les étapes pour diriger le trafic sortant issu de l'adresse IP d'un second FAI vers sa propre passerelle dédiée.",
    "descriptionFr": "Ordonnez les étapes pour diriger le trafic sortant issu de l'adresse IP d'un second FAI vers sa propre passerelle dédiée.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déclaration du nom de la table personnalisée dans /etc/iproute2/rt_tables",
        "labelFr": "1. Déclaration du nom de la table personnalisée dans /etc/iproute2/rt_tables",
        "detail": "Ajouter l'identifiant et l'alias : echo '200 isp2' >> /etc/iproute2/rt_tables",
        "detailFr": "Ajouter l'identifiant et l'alias : echo '200 isp2' >> /etc/iproute2/rt_tables"
      },
      {
        "id": "s2",
        "label": "2. Définition de la passerelle par défaut dans la table dédiée isp2",
        "labelFr": "2. Définition de la passerelle par défaut dans la table dédiée isp2",
        "detail": "Renseigner la route de sortie FAI 2 : ip route add default via 10.0.2.1 dev eth1 table isp2",
        "detailFr": "Renseigner la route de sortie FAI 2 : ip route add default via 10.0.2.1 dev eth1 table isp2"
      },
      {
        "id": "s3",
        "label": "3. Création de la règle de routage conditionnel par la source (ip rule)",
        "labelFr": "3. Création de la règle de routage conditionnel par la source (ip rule)",
        "detail": "Aiguiller le trafic émis par l'IP2 : ip rule add from 10.0.2.100/32 table isp2",
        "detailFr": "Aiguiller le trafic émis par l'IP2 : ip rule add from 10.0.2.100/32 table isp2"
      },
      {
        "id": "s4",
        "label": "4. Vidage et synchronisation du cache de routage du noyau",
        "labelFr": "4. Vidage et synchronisation du cache de routage du noyau",
        "detail": "Purger le cache pour application immédiate : ip route flush cache",
        "detailFr": "Purger le cache pour application immédiate : ip route flush cache"
      },
      {
        "id": "s5",
        "label": "5. Test de la décision de routage pour une IP source donnée",
        "labelFr": "5. Test de la décision de routage pour une IP source donnée",
        "detail": "Vérifier la sélection de table : ip route get 8.8.8.8 from 10.0.2.100",
        "detailFr": "Vérifier la sélection de table : ip route get 8.8.8.8 from 10.0.2.100"
      }
    ],
    "explanation": "Le Policy Routing s'ordonne ainsi : 1) déclarer la table dans /etc/iproute2/rt_tables, 2) peupler la route par défaut dans cette table (ip route add ... table isp2), 3) créer la règle d'aiguillage (ip rule add from ... table isp2), 4) purger le cache, 5) tester avec ip route get.",
    "explanationFr": "Le Policy Routing s'ordonne ainsi : 1) déclarer la table dans /etc/iproute2/rt_tables, 2) peupler la route par défaut dans cette table (ip route add ... table isp2), 3) créer la règle d'aiguillage (ip rule add from ... table isp2), 4) purger le cache, 5) tester avec ip route get."
  },

  # Topic 206: System Maintenance (2)
  {
    "id": "seq-201-19",
    "title": "Compiling and Installing Software from Source Tarball",
    "titleFr": "Chaîne standard de compilation et installation depuis les archives sources",
    "certification": "lpic-2",
    "topicNumber": 206,
    "objectiveId": "206.1",
    "category": "System Maintenance",
    "description": "Placez les étapes du standard GNU autotools pour préparer, configurer, compiler et installer proprement un logiciel dans /usr/local.",
    "descriptionFr": "Placez les étapes du standard GNU autotools pour préparer, configurer, compiler et installer proprement un logiciel dans /usr/local.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Extraction de l'archive tarball compressée",
        "labelFr": "1. Extraction de l'archive tarball compressée",
        "detail": "Décompresser les sources : tar -xvf package-1.0.tar.gz && cd package-1.0",
        "detailFr": "Décompresser les sources : tar -xvf package-1.0.tar.gz && cd package-1.0"
      },
      {
        "id": "s2",
        "label": "2. Détection de l'environnement et options de compilation (./configure)",
        "labelFr": "2. Détection de l'environnement et options de compilation (./configure)",
        "detail": "Contrôler les bibliothèques et définir le préfixe : ./configure --prefix=/usr/local",
        "detailFr": "Contrôler les bibliothèques et définir le préfixe : ./configure --prefix=/usr/local"
      },
      {
        "id": "s3",
        "label": "3. Compilation du code source en binaires exécutables (make)",
        "labelFr": "3. Compilation du code source en binaires exécutables (make)",
        "detail": "Construire les exécutables et bibliothèques partagées définis dans le Makefile",
        "detailFr": "Construire les exécutables et bibliothèques partagées définis dans le Makefile"
      },
      {
        "id": "s4",
        "label": "4. Exécution de la suite de tests de validation (make test / check)",
        "labelFr": "4. Exécution de la suite de tests de validation (make test / check)",
        "detail": "Vérifier la validité des binaires produits avant déploiement sur le système",
        "detailFr": "Vérifier la validité des binaires produits avant déploiement sur le système"
      },
      {
        "id": "s5",
        "label": "5. Copie des binaires dans les répertoires système (sudo make install)",
        "labelFr": "5. Copie des binaires dans les répertoires système (sudo make install)",
        "detail": "Installer les fichiers dans /usr/local/bin, /usr/local/lib et les pages de man",
        "detailFr": "Installer les fichiers dans /usr/local/bin, /usr/local/lib et les pages de man"
      }
    ],
    "explanation": "La chaîne canonique GNU Autotools est : tar xvf -> ./configure (génération du Makefile) -> make (compilation) -> make test/check (validation) -> make install (copie dans l'arborescence système).",
    "explanationFr": "La chaîne canonique GNU Autotools est : tar xvf -> ./configure (génération du Makefile) -> make (compilation) -> make test/check (validation) -> make install (copie dans l'arborescence système)."
  },
  {
    "id": "seq-201-20",
    "title": "Incremental Backup with Hard Links Strategy using rsync",
    "titleFr": "Stratégie de sauvegarde incrémentale à liens durs avec rsync",
    "certification": "lpic-2",
    "topicNumber": 206,
    "objectiveId": "206.2",
    "category": "System Maintenance",
    "description": "Ordonnez les étapes d'un script de rotation de sauvegardes quotidiennes utilisant l'option --link-dest pour économiser l'espace disque.",
    "descriptionFr": "Ordonnez les étapes d'un script de rotation de sauvegardes quotidiennes utilisant l'option --link-dest pour économiser l'espace disque.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Identification et pointage vers la dernière sauvegarde valide (latest)",
        "labelFr": "1. Identification et pointage vers la dernière sauvegarde valide (latest)",
        "detail": "Identifier le répertoire de la veille qui servira de référence pour les liens durs",
        "detailFr": "Identifier le répertoire de la veille qui servira de référence pour les liens durs"
      },
      {
        "id": "s2",
        "label": "2. Exécution de rsync avec l'option --link-dest vers le dossier temporaire",
        "labelFr": "2. Exécution de rsync avec l'option --link-dest vers le dossier temporaire",
        "detail": "Lancer : rsync -av --delete --link-dest=/backup/latest /data/ /backup/incomplete/",
        "detailFr": "Lancer : rsync -av --delete --link-dest=/backup/latest /data/ /backup/incomplete/"
      },
      {
        "id": "s3",
        "label": "3. Renommage atomique du dossier temporaire avec la date du jour",
        "labelFr": "3. Renommage atomique du dossier temporaire avec la date du jour",
        "detail": "Une fois rsync terminé avec succès : mv /backup/incomplete /backup/2026-09-15",
        "detailFr": "Une fois rsync terminé avec succès : mv /backup/incomplete /backup/2026-09-15"
      },
      {
        "id": "s4",
        "label": "4. Mise à jour du lien symbolique de référence latest",
        "labelFr": "4. Mise à jour du lien symbolique de référence latest",
        "detail": "Pointer sur la sauvegarde du jour : ln -snf /backup/2026-09-15 /backup/latest",
        "detailFr": "Pointer sur la sauvegarde du jour : ln -snf /backup/2026-09-15 /backup/latest"
      },
      {
        "id": "s5",
        "label": "5. Purge des clichés de sauvegarde expirés au-delà de la rétention",
        "labelFr": "5. Purge des clichés de sauvegarde expirés au-delà de la rétention",
        "detail": "Supprimer les répertoires plus anciens que 30 jours via find /backup/ -maxdepth 1 -mtime +30 -exec rm -rf {} +",
        "detailFr": "Supprimer les répertoires plus anciens que 30 jours via find /backup/ -maxdepth 1 -mtime +30 -exec rm -rf {} +"
      }
    ],
    "explanation": "La sauvegarde incrémentale à liens durs avec rsync suit l'enchaînement : cibler la référence 'latest' -> synchroniser avec --link-dest vers un dossier de transit -> renommer à la date du jour en cas de code retour 0 -> mettre à jour le symlink 'latest' -> purger les archives hors rétention.",
    "explanationFr": "La sauvegarde incrémentale à liens durs avec rsync suit l'enchaînement : cibler la référence 'latest' -> synchroniser avec --link-dest vers un dossier de transit -> renommer à la date du jour en cas de code retour 0 -> mettre à jour le symlink 'latest' -> purger les archives hors rétention."
  }
]
