import { LearningPath, PathModule } from './types';

function createModule(data: Omit<PathModule, 'whyItMatters' | 'whyItMattersFr' | 'commands' | 'codeSnippet' | 'prodTrap' | 'prodTrapFr' | 'checklist' | 'checklistFr'> & {
  checklist?: string[];
  checklistFr?: string[];
}): PathModule {
  return {
    ...data,
    whyItMatters: data.theory.whyItMatters,
    whyItMattersFr: data.theory.whyItMattersFr,
    commands: data.theory.commands,
    codeSnippet: data.theory.codeSnippet,
    prodTrap: data.theory.prodTrap,
    prodTrapFr: data.theory.prodTrapFr,
    checklist: data.checklist || [
      'Understand core concept and syntax',
      'Execute practice commands in terminal',
      'Complete hands-on lab step',
      'Review production troubleshooting scenario'
    ],
    checklistFr: data.checklistFr || [
      'Comprendre le concept théorique et la syntaxe',
      'Exécuter les commandes clés dans le terminal',
      'Valider l\'étape du lab pratique',
      'Analyser le piège de production et le dépannage'
    ],
  };
}

/* ==========================================================================
   ADMINISTRATION SYSTÈME (5 PARCOURS)
   ========================================================================== */

const sysadminModules: PathModule[] = [
  createModule({
    id: 'adm-1-install',
    number: 1,
    title: 'Installation & Boot Initialization',
    titleFr: 'Installation et Initialisation du Démarrage',
    conceptTag: 'System Initialization',
    conceptTagFr: 'Initialisation Système',
    shortDesc: 'GRUB bootloader, UEFI/BIOS firmware, kernel initrd, and boot parameters.',
    shortDescFr: 'Chargeur GRUB, micrologiciel UEFI/BIOS, initrd du noyau et paramètres de démarrage.',
    linkedLpiObjective: '101.2',
    explainTopic: 'systemd',
    glossaryTerms: ['grub-install', 'update-grub', 'dmesg', 'journalctl'],
    theory: {
      summary: 'The Linux boot process progresses from UEFI/BIOS firmware to the GRUB bootloader, which loads the Linux kernel and initial RAM filesystem (initramfs/initrd), handing over control to systemd (PID 1).',
      summaryFr: 'Le démarrage passe par l\'UEFI/BIOS, puis le chargeur GRUB qui charge le noyau et l\'initramfs, avant de donner la main à systemd (PID 1).',
      whyItMatters: 'Recovering unbootable servers after kernel updates or broken storage configurations requires understanding the bootloader and initrd layers.',
      whyItMattersFr: 'Dépanner une machine incapable de démarrer suite à une mise à jour du noyau exige la maîtrise de GRUB et de l\'initramfs.',
      commands: ['dmesg | head -n 30', 'journalctl -b', 'cat /proc/cmdline', 'update-grub', 'lsinitramfs /boot/initrd.img-$(uname -r) | head'],
      codeSnippet: {
        label: 'Checking Kernel Boot Parameters',
        labelFr: 'Vérification des arguments de démarrage noyau',
        code: 'cat /proc/cmdline\njournalctl -k -b 0 --priority=err',
        explanation: 'Displays the exact flags passed by GRUB to the active kernel and filters errors during kernel init.',
        explanationFr: 'Affiche les arguments passés par GRUB au noyau et filtre les erreurs survenues lors de l\'initialisation.',
      },
      prodTrap: 'Editing `/boot/grub/grub.cfg` directly will be overwritten on the next kernel upgrade. Always edit `/etc/default/grub` and run `update-grub`.',
      prodTrapFr: 'Modifier directement `/boot/grub/grub.cfg` sera écrasé au prochain paquet noyau. Modifiez `/etc/default/grub` puis lancez `update-grub`.',
    },
    flashcards: [
      {
        id: 'fc-adm-1',
        question: 'Which file is the primary configuration file to edit before regenerating GRUB configuration?',
        questionFr: 'Quel fichier de configuration principal doit-on éditer avant de régénérer la configuration GRUB ?',
        answer: '/etc/default/grub',
        answerFr: '/etc/default/grub',
        examTip: 'Run `update-grub` (Debian/Ubuntu) or `grub2-mkconfig -o /boot/grub2/grub.cfg` (RHEL) after editing.',
        examTipFr: 'Exécutez `update-grub` (Debian) ou `grub2-mkconfig` (RHEL) après modification.',
      }
    ],
    question: {
      id: 'q-adm-1',
      question: 'Which kernel command line parameter boots a Linux system directly into root single-user rescue mode?',
      questionFr: 'Quel paramètre passé au noyau permet de démarrer directement en mode de dépannage mono-utilisateur (rescue) ?',
      options: ['single (or systemd.unit=rescue.target)', 'init=/bin/reboot', 'safe-mode', 'noservices'],
      optionsFr: ['single (ou systemd.unit=rescue.target)', 'init=/bin/reboot', 'safe-mode', 'noservices'],
      correctIndex: 0,
      explanation: 'Appending `single` or `systemd.unit=rescue.target` to the linux line in GRUB starts a minimal root rescue shell.',
      explanationFr: 'Ajouter `single` ou `systemd.unit=rescue.target` à la ligne du noyau dans GRUB démarre un shell de secours en root.',
      commandSnippet: 'linux /vmlinuz root=/dev/sda1 ro single',
    },
    lab: {
      id: 'lab-adm-1',
      title: 'Kernel Log Inspection with dmesg',
      titleFr: 'Inspection des messages noyau avec dmesg',
      goal: 'Filter kernel ring buffer for hardware warnings or memory allocation issues.',
      goalFr: 'Filtrer le buffer noyau pour détecter les anomalies matérielles ou mémoire.',
      context: 'A virtual machine rebooted unexpectedly and you need to investigate.',
      contextFr: 'Une machine virtuelle a redémarré de manière inattendue.',
      steps: [
        {
          stepNumber: 1,
          title: 'Display kernel messages with human-readable timestamps',
          titleFr: 'Afficher les logs noyau avec horodatage lisible',
          instruction: 'Execute dmesg with human readable timestamps and error level filter.',
          instructionFr: 'Lancez dmesg avec horodatage lisible et filtre sur les erreurs.',
          hint: 'dmesg -T --level=err,warn',
          hintFr: 'dmesg -T --level=err,warn',
          expectedCommands: ['dmesg -T --level=err,warn', 'dmesg -T', 'dmesg -l err,warn'],
          simulatedOutput: '[Sat Sep 20 04:15:02 2025] ACPI Warning: SystemIO conflict\n[Sat Sep 20 04:15:05 2025] e1000e 0000:00:1f.6: Link is Up 1000 Mbps Full Duplex',
          explanation: '`-T` converts boot seconds to human readable dates.',
          explanationFr: '`-T` convertit les secondes depuis le boot en dates lisibles.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-adm-1',
      title: 'GRUB Rescue Prompt After Disk Cloning',
      titleFr: 'Invite grub rescue> après clonage de disque',
      symptom: 'The machine fails to boot and drops to `grub rescue> error: no such partition`.',
      symptomFr: 'La machine ne démarre pas et bloque sur `grub rescue> error: no such partition`.',
      investigationCommands: ['ls', 'set'],
      diagnosticOutput: 'prefix=(hd0,msdos1)/boot/grub\nroot=hd0,msdos1',
      rootCause: 'The filesystem UUID changed or the partition numbering shifted, so GRUB cannot locate `/boot/grub`.',
      rootCauseFr: 'L\'UUID de la partition racine a changé ou la numérotation a bougé : GRUB ne trouve plus `/boot/grub`.',
      solutionCommand: 'insmod normal && normal',
      solutionExplanation: 'Set root and prefix to the valid partition, insmod normal, boot into system, and reinstall GRUB with `grub-install /dev/sda`.',
      solutionExplanationFr: 'Pointez root et prefix vers la bonne partition, chargez normal, puis réinstallez GRUB avec `grub-install`.',
    }
  }),
  createModule({
    id: 'adm-2-services',
    number: 2,
    title: 'Service Orchestration with systemd',
    titleFr: 'Gestion des Services avec systemd',
    conceptTag: 'systemd & Services',
    conceptTagFr: 'systemd & Services',
    shortDesc: 'Manage services (start, stop, enable, disable), unit files, dependencies, and journald.',
    shortDescFr: 'Gérer les services (start, stop, enable), fichiers units, dépendances et logs journald.',
    linkedLpiObjective: '101.3',
    explainTopic: 'systemd',
    glossaryTerms: ['systemctl', 'journalctl', 'systemd-analyze', 'daemon-reload'],
    theory: {
      summary: 'systemd is the standard init system and service manager on modern Linux. It manages Units (`.service`, `.target`, `.timer`, `.socket`, `.mount`). `systemctl` manages state, and `journalctl` handles centralized binary logging.',
      summaryFr: 'systemd est le gestionnaire de système et de services standard. Il gère les unités (`.service`, `.target`, `.timer`, etc.). `systemctl` pilote l\'état et `journalctl` gère les journaux binaires.',
      whyItMatters: 'Every production workload runs as a systemd service or container managed by systemd. Fast diagnostics depend on mastering systemctl and journalctl.',
      whyItMattersFr: 'Tout service de production tourne sous forme d\'unité systemd. Le diagnostic rapide repose sur la maîtrise de systemctl et journalctl.',
      commands: ['systemctl status nginx', 'systemctl enable --now nginx', 'systemctl restart nginx', 'systemctl daemon-reload', 'journalctl -u nginx -f --no-pager'],
      codeSnippet: {
        label: 'Production Custom Service Unit File',
        labelFr: 'Fichier unit de service de production (/etc/systemd/system/myapp.service)',
        code: '[Unit]\nDescription=Production Node API Service\nAfter=network.target postgresql.service\n\n[Service]\nType=simple\nUser=www-data\nWorkingDirectory=/var/www/myapp\nExecStart=/usr/bin/node server.js\nRestart=always\nRestartSec=5s\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target',
        explanation: 'Specifies start ordering (After), unprivileged user execution, automatic restart on failure, and target attachment.',
        explanationFr: 'Définit l\'ordonnancement (After), l\'exécution sous utilisateur non privilégié, le redémarrage automatique et la cible voulue.',
      },
      prodTrap: 'Forgetting `systemctl daemon-reload` after modifying a `.service` file causes systemd to continue running the cached old unit definition.',
      prodTrapFr: 'Oublier `systemctl daemon-reload` après avoir édité un `.service` force systemd à exécuter l\'ancienne version en cache.',
    },
    flashcards: [
      {
        id: 'fc-adm-2',
        question: 'What is the difference between `systemctl start` and `systemctl enable`?',
        questionFr: 'Quelle est la différence entre `systemctl start` et `systemctl enable` ?',
        answer: 'start launches the service immediately in the current session; enable creates symlinks to launch the service automatically at boot.',
        answerFr: 'start lance le service immédiatement; enable crée les liens symboliques pour le lancer automatiquement au démarrage.',
        examTip: 'Use `systemctl enable --now <service>` to both enable at boot and start immediately in one command.',
        examTipFr: 'Utilisez `systemctl enable --now <service>` pour activer au boot et démarrer immédiatement.',
      }
    ],
    question: {
      id: 'q-adm-2',
      question: 'Which command must be run immediately after creating or modifying a custom unit file in `/etc/systemd/system/`?',
      questionFr: 'Quelle commande doit obligatoirement être exécutée après avoir créé ou modifié un fichier unit dans `/etc/systemd/system/` ?',
      options: ['systemctl daemon-reload', 'systemctl refresh-all', 'systemd-reload', 'service reload-units'],
      optionsFr: ['systemctl daemon-reload', 'systemctl refresh-all', 'systemd-reload', 'service reload-units'],
      correctIndex: 0,
      explanation: '`systemctl daemon-reload` causes systemd to reload all generators, recreate unit dependency trees, and read changed unit files.',
      explanationFr: '`systemctl daemon-reload` force systemd à recharger tous les générateurs et relire les fichiers units modifiés.',
      commandSnippet: 'sudo systemctl daemon-reload',
    },
    lab: {
      id: 'lab-adm-2',
      title: 'Troubleshooting a Failing Service with journalctl',
      titleFr: 'Dépannage d\'un service en échec avec journalctl',
      goal: 'Inspect why a database service failed to start and isolate the error line.',
      goalFr: 'Inspecter les causes d\'échec de démarrage d\'un service et isoler l\'erreur.',
      context: 'PostgreSQL failed to restart after a configuration update.',
      contextFr: 'PostgreSQL a échoué à redémarrer après modification de sa configuration.',
      steps: [
        {
          stepNumber: 1,
          title: 'Check service logs with journalctl',
          titleFr: 'Vérifier les logs du service avec journalctl',
          instruction: 'View the last 20 log entries for postgresql without paging.',
          instructionFr: 'Affichez les 20 dernières lignes de logs pour postgresql sans pagination.',
          hint: 'journalctl -u postgresql -n 20 --no-pager',
          hintFr: 'journalctl -u postgresql -n 20 --no-pager',
          expectedCommands: ['journalctl -u postgresql -n 20 --no-pager', 'journalctl -u postgresql -e'],
          simulatedOutput: 'Sep 20 09:12:01 srv postgresql[3810]: FATAL:  syntax error in /etc/postgresql/15/main/postgresql.conf line 84: invalid port value "5432abc"\nSep 20 09:12:01 srv systemd[1]: postgresql.service: Main process exited, code=exited, status=1/FAILURE',
          explanation: 'Journal logs pinpoint line 84 of postgresql.conf as containing an invalid port string.',
          explanationFr: 'Les logs journalctl pointent exactement la ligne 84 du fichier de conf avec un port invalide.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-adm-2',
      title: 'Service in Failed State with Start Limit Hit',
      titleFr: 'Service en état Failed avec limite de redémarrages atteinte',
      symptom: '`systemctl start myapp` fails with: "Job failed. See "systemctl status myapp.service" and "journalctl -xeu myapp.service" for details."',
      symptomFr: '`systemctl start myapp` échoue avec "Job failed". status indique "start-limit-hit".',
      investigationCommands: ['systemctl status myapp.service', 'systemctl reset-failed myapp.service'],
      diagnosticOutput: 'Active: failed (Result: start-limit-hit) since Sat 2025-09-20 09:14:22 UTC\nTriggered burst limit (5 restarts in 10s)',
      rootCause: 'The service crashed multiple times rapidly, triggering systemd rate limiting (StartLimitBurst).',
      rootCauseFr: 'Le service a crashé en boucle, déclenchant la protection anti-emballement de systemd (StartLimitBurst).',
      solutionCommand: 'systemctl reset-failed myapp.service && systemctl restart myapp.service',
      solutionExplanation: 'Fix the application underlying bug first, clear systemd failed execution counters with `systemctl reset-failed`, then restart.',
      solutionExplanationFr: 'Corrigez le bug applicatif, réinitialisez les compteurs avec `systemctl reset-failed`, puis relancez le service.',
    }
  }),
  createModule({
    id: 'adm-3-software',
    number: 3,
    title: 'Software & Package Management (APT/DPKG)',
    titleFr: 'Gestion des Paquets & Dépôts (APT & DPKG)',
    conceptTag: 'Packaging & Updates',
    conceptTagFr: 'Gestion des Logiciels',
    shortDesc: 'APT, DPKG, software repositories (/etc/apt/sources.list), dependencies, security updates.',
    shortDescFr: 'APT, DPKG, dépôts logiciels (/etc/apt/sources.list), dépendances et correctifs de sécurité.',
    linkedLpiObjective: '102.4',
    explainTopic: 'security',
    glossaryTerms: ['apt', 'apt-get', 'dpkg', 'apt-cache', 'sources.list'],
    theory: {
      summary: 'Debian-based distributions use DPKG for low-level package operations (`.deb` files) and APT for high-level repository index fetching, dependency resolution, and upgrade workflows.',
      summaryFr: 'Les systèmes Debian utilisent DPKG pour les manipulations bas niveau de fichiers `.deb`, et APT pour la résolution automatique des dépendances et les dépôts distants.',
      whyItMatters: 'Keeping packages up to date with automated security patches is the first defense line against known CVE exploits.',
      whyItMattersFr: 'Maintenir les paquets à jour et installer les correctifs de sécurité est le rempart numéro un contre les vulnérabilités CVE.',
      commands: ['apt update', 'apt upgrade -y', 'apt search nginx', 'dpkg -i package.deb', 'dpkg -l | grep curl', 'dpkg -S /usr/bin/git'],
      codeSnippet: {
        label: 'Adding an Official Verified Repository with GPG Key',
        labelFr: 'Ajout d\'un dépôt sécurisé avec clé GPG vérifiée',
        code: 'curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg\necho "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list\napt update',
        explanation: 'Stores GPG armor key in `/etc/apt/keyrings` and restricts repository trust strictly to its signed-by key.',
        explanationFr: 'Stocke la clé GPG dans `/etc/apt/keyrings` et restreint la confiance du dépôt à sa clé officielle.',
      },
      prodTrap: 'Never use `apt-key add` on modern systems (deprecated security hole). Use dedicated `/etc/apt/keyrings/` files with `signed-by`.',
      prodTrapFr: 'N\'utilisez plus `apt-key add` (déprécié et dangereux). Utilisez `/etc/apt/keyrings/` avec l\'option `signed-by`.',
    },
    flashcards: [
      {
        id: 'fc-adm-3',
        question: 'Which DPKG command displays the package that installed a specific file on the filesystem?',
        questionFr: 'Quelle commande DPKG identifie le paquet responsable de la présence d\'un fichier sur le système ?',
        answer: 'dpkg -S /path/to/file (or dpkg --search)',
        answerFr: 'dpkg -S /chemin/vers/fichier (ou dpkg --search)',
        examTip: 'dpkg -L lists files installed by a package; dpkg -S finds which package installed a file.',
        examTipFr: 'dpkg -L liste les fichiers d\'un paquet; dpkg -S trouve le paquet propriétaire d\'un fichier.',
      }
    ],
    question: {
      id: 'q-adm-3',
      question: 'Which command updates local APT package index metadata from remote repositories without downloading or upgrading packages?',
      questionFr: 'Quelle commande rafraîchit les métadonnées des index de paquets sans installer ni mettre à jour les logiciels ?',
      options: ['apt update', 'apt upgrade', 'apt dist-upgrade', 'apt-cache refresh'],
      optionsFr: ['apt update', 'apt upgrade', 'apt dist-upgrade', 'apt-cache refresh'],
      correctIndex: 0,
      explanation: '`apt update` downloads latest package index lists from `/etc/apt/sources.list`. `apt upgrade` installs actual new packages.',
      explanationFr: '`apt update` télécharge la liste des paquets disponibles. `apt upgrade` télécharge et installe les nouvelles versions.',
      commandSnippet: 'sudo apt update',
    },
    lab: {
      id: 'lab-adm-3',
      title: 'Identifying File Ownership with dpkg',
      titleFr: 'Identification du paquet propriétaire d\'un binaire',
      goal: 'Find which installed package provided `/bin/tar`.',
      goalFr: 'Déterminer quel paquet a installé le binaire `/bin/tar`.',
      context: 'You are auditing binaries on a hardened server.',
      contextFr: 'Vous auditez les binaires installés sur un serveur durci.',
      steps: [
        {
          stepNumber: 1,
          title: 'Query package database with dpkg -S',
          titleFr: 'Interroger la base dpkg avec -S',
          instruction: 'Run dpkg -S targeting /bin/tar.',
          instructionFr: 'Exécutez dpkg -S sur /bin/tar.',
          hint: 'dpkg -S /bin/tar',
          hintFr: 'dpkg -S /bin/tar',
          expectedCommands: ['dpkg -S /bin/tar', 'dpkg -S /usr/bin/tar'],
          simulatedOutput: 'tar: /bin/tar',
          explanation: 'Identifies package `tar` as the source of `/bin/tar`.',
          explanationFr: 'Confirme que le paquet `tar` a installé ce binaire.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-adm-3',
      title: 'APT Lock Error (Could not get lock /var/lib/dpkg/lock-frontend)',
      titleFr: 'Erreur de verrou APT (Could not get lock)',
      symptom: '`apt install` returns `E: Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)`.',
      symptomFr: '`apt install` retourne une erreur de lock sur `/var/lib/dpkg/lock-frontend`.',
      investigationCommands: ['ps aux | grep -i apt', 'lsof /var/lib/dpkg/lock-frontend'],
      diagnosticOutput: 'root 1240 0.2 1.1 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown',
      rootCause: 'An automated background process (unattended-upgrades) is actively performing system updates.',
      rootCauseFr: 'Un processus d\'arrière-plan (unattended-upgrades) est en train d\'effectuer les mises à jour automatiques.',
      solutionCommand: 'wait for process to complete, or systemctl stop unattended-upgrades',
      solutionExplanation: 'Do not forcefully delete the lock file while apt is running as it will corrupt the dpkg database. Wait for the process to finish or inspect its PID.',
      solutionExplanationFr: 'Ne supprimez jamais le fichier lock pendant que le processus tourne sous peine de corrompre la base dpkg.',
    }
  }),
  createModule({
    id: 'adm-4-storage-lvm',
    number: 4,
    title: 'Advanced Storage & LVM Management',
    titleFr: 'Stockage Avancé & Gestion LVM',
    conceptTag: 'Storage & LVM',
    conceptTagFr: 'Stockage & LVM',
    shortDesc: 'Physical Volumes (PV), Volume Groups (VG), Logical Volumes (LV), dynamic expansion, and RAID.',
    shortDescFr: 'Volumes physiques (PV), groupes de volumes (VG), volumes logiques (LV), extension à chaud et RAID.',
    linkedLpiObjective: '204.1',
    explainTopic: 'lvm',
    glossaryTerms: ['pvcreate', 'vgcreate', 'lvcreate', 'lvextend', 'resize2fs', 'xfs_growfs', 'mdadm'],
    theory: {
      summary: 'Logical Volume Manager (LVM) abstracts physical storage drives. Physical Volumes (PV) are pooled into Volume Groups (VG), from which flexible Logical Volumes (LV) are allocated and dynamically resized without downtime.',
      summaryFr: 'LVM virtualise le stockage physique. Les volumes physiques (PV) sont rassemblés en Volume Groups (VG), au sein desquels on découpe des volumes logiques (LV) extensibles à chaud.',
      whyItMatters: 'Fixed partitions force downtime when a disk fills up. LVM allows on-the-fly partition expansion in production without unmounting.',
      whyItMattersFr: 'Les partitions fixes exigent des arrêts de service quand le disque est plein. LVM permet d\'agrandir les partitions à chaud en production.',
      commands: ['pvs', 'vgs', 'lvs', 'pvcreate /dev/sdb', 'vgextend vg_data /dev/sdb', 'lvextend -r -L +20G /dev/vg_data/lv_app'],
      codeSnippet: {
        label: 'Growing an LVM Volume and Filesystem On-the-Fly',
        labelFr: 'Extension à chaud d\'un volume LVM et de son filesystem',
        code: '# Add 50GB to logical volume and resize filesystem in one operation (-r)\nlvextend -r -L +50G /dev/mapper/vg_prod-lv_data\n# Verify new size\ndf -h /data',
        explanation: '`-r` (or `--resizefs`) automatically invokes resize2fs (ext4) or xfs_growfs (xfs) matching the filesystem.',
        explanationFr: 'L\'option `-r` appelle automatiquement l\'utilitaire d\'extension du système de fichiers correspondant.',
      },
      prodTrap: 'XFS filesystems can only be grown, NEVER shrunk. Ext4 can be shrunk, but shrinking requires unmounting the filesystem.',
      prodTrapFr: 'Un filesystem XFS peut être agrandi, mais JAMAIS réduit. Ext4 peut être réduit mais nécessite un démontage hors ligne.',
    },
    flashcards: [
      {
        id: 'fc-adm-4',
        question: 'What is the correct 3-step hierarchy of LVM components from hardware to filesystem?',
        questionFr: 'Quelle est la hiérarchie en 3 niveaux de LVM du matériel jusqu\'au système de fichiers ?',
        answer: 'Physical Volumes (PV) -> Volume Group (VG) -> Logical Volume (LV)',
        answerFr: 'Physical Volumes (PV) -> Volume Group (VG) -> Logical Volume (LV)',
        examTip: 'pvcreate initializes drives -> vgcreate pools them -> lvcreate carves partitions.',
        examTipFr: 'pvcreate prépare le disque -> vgcreate crée le pool -> lvcreate découpe le volume.',
      }
    ],
    question: {
      id: 'q-adm-4',
      question: 'Which `lvextend` flag automatically resizes the underlying ext4/xfs filesystem along with the logical volume?',
      questionFr: 'Quelle option de `lvextend` redimensionne automatiquement le système de fichiers (ext4/xfs) en même temps que le volume ?',
      options: ['-r (or --resizefs)', '-f (force)', '-a (auto)', '-s (sync)'],
      optionsFr: ['-r (ou --resizefs)', '-f (force)', '-a (auto)', '-s (sync)'],
      correctIndex: 0,
      explanation: 'Using `lvextend -r` eliminates the need to manually run `resize2fs` or `xfs_growfs` after expanding the logical volume.',
      explanationFr: '`lvextend -r` évite d\'avoir à exécuter manuellement `resize2fs` ou `xfs_growfs` après l\'agrandissement du LV.',
      commandSnippet: 'sudo lvextend -r -l +100%FREE /dev/vg0/lv_root',
    },
    lab: {
      id: 'lab-adm-4',
      title: 'Inspecting LVM Volume Group Free Extents',
      titleFr: 'Inspection de l\'espace libre dans un Volume Group LVM',
      goal: 'Check remaining physical extents in Volume Group vg_system.',
      goalFr: 'Vérifier les extensions physiques restantes dans le Volume Group vg_system.',
      context: 'You need to allocate storage for a new Docker volume.',
      contextFr: 'Vous devez allouer du stockage pour un nouveau volume Docker.',
      steps: [
        {
          stepNumber: 1,
          title: 'Display volume group details',
          titleFr: 'Afficher les détails du volume group',
          instruction: 'Run vgs with volume group name.',
          instructionFr: 'Lancez vgs sur vg_system.',
          hint: 'vgs vg_system',
          hintFr: 'vgs vg_system',
          expectedCommands: ['vgs vg_system', 'vgs', 'vgdisplay vg_system'],
          simulatedOutput: '  VG        #PV #LV #SN Attr   VSize   VFree \n  vg_system   1   2   0 wz--n- <99.00g 45.00g',
          explanation: 'Displays 45GB free available for logical volume expansion.',
          explanationFr: 'Confirme qu\'il reste 45 Go d\'espace libre disponible.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-adm-4',
      title: 'df Shows 100% Full Despite lvextend',
      titleFr: 'df affiche 100% plein malgré un lvextend réussi',
      symptom: '`lvextend -L +20G /dev/vg0/data` succeeded, but `df -h /data` still shows 100% full with old size.',
      symptomFr: '`lvextend` a réussi, mais `df -h` affiche toujours l\'ancienne taille saturée à 100%.',
      investigationCommands: ['lvs /dev/vg0/data', 'df -hT /data'],
      diagnosticOutput: 'LV data vg0 -wi-ao---- 60.00g (LVM shows 60G, df shows 40G ext4)',
      rootCause: 'The LVM container was expanded, but the filesystem layer inside it was not resized.',
      rootCauseFr: 'Le conteneur LVM a été agrandi mais le système de fichiers n\'a pas été étendu.',
      solutionCommand: 'resize2fs /dev/vg0/data  # (or xfs_growfs /data if XFS)',
      solutionExplanation: 'Run `resize2fs` for ext4 or `xfs_growfs` for XFS to expand filesystem blocks into the new volume space.',
      solutionExplanationFr: 'Lancez `resize2fs` (ext4) ou `xfs_growfs` (xFS) pour occuper l\'espace nouvellement alloué.',
    }
  }),
  createModule({
    id: 'adm-5-supervision',
    number: 5,
    title: 'Logs, Backups & System Supervision',
    titleFr: 'Logs, Sauvegardes & Supervision Système',
    conceptTag: 'Observability & Backups',
    conceptTagFr: 'Observabilité & Sauvegardes',
    shortDesc: 'Logrotate, rsyslog, journald persistence, tar/rsync incremental backups, and system health metrics.',
    shortDescFr: 'Logrotate, rsyslog, persistance journald, sauvegardes rsync et métriques de santé système.',
    linkedLpiObjective: '108.2',
    explainTopic: 'troubleshooting',
    glossaryTerms: ['logrotate', 'rsync', 'tar', 'cron', 'vmstat', 'iostat'],
    theory: {
      summary: 'Observability requires structured logging and automated log rotation (`/etc/logrotate.d/`). Disasters are mitigated through automated off-site backups using `rsync` over SSH, and performance monitoring with `vmstat`, `iostat`, and systemd timers.',
      summaryFr: 'L\'observabilité s\'appuie sur la journalisation et la rotation automatique des logs (`logrotate`). La résilience dépend des sauvegardes déportées avec `rsync` et de la surveillance proactive.',
      whyItMatters: 'An unrotated log will eventually fill disk storage and crash databases. Backups without restore tests are worthless.',
      whyItMattersFr: 'Un log sans rotation finit inévitablement par saturer le disque. Une sauvegarde non testée n\'offre aucune garantie de restauration.',
      commands: ['logrotate -d /etc/logrotate.conf', 'rsync -avz --delete /var/www/ backup@remote:/backup/www/', 'vmstat 1 5', 'iostat -xz 1 3'],
      codeSnippet: {
        label: 'Production Incremental Sync with rsync',
        labelFr: 'Synchronisation incrémentielle de production avec rsync',
        code: 'rsync -avz --numeric-ids --delete --exclude="*.cache" \\\n  -e "ssh -i /root/.ssh/backup_key -p 2222" \\\n  /var/www/ backupuser@backup.corp.internal:/srv/backups/web-node-01/',
        explanation: 'Synchronizes preserving permissions and ownership without re-transferring unchanged files.',
        explanationFr: 'Synchronise en préservant droits et propriétaires sans transférer les fichiers inchangés.',
      },
      prodTrap: 'Running `rsync --delete` with a typo on the source or destination path will immediately wipe valid production directories.',
      prodTrapFr: 'Lancer `rsync --delete` avec une erreur de chemin efface immédiatement les données du dossier cible.',
    },
    flashcards: [
      {
        id: 'fc-adm-5',
        question: 'Which tool manages the automatic rotation, compression, and removal of growing log files in Linux?',
        questionFr: 'Quel utilitaire gère la rotation automatique, la compression et la purge des fichiers de logs sous Linux ?',
        answer: 'logrotate (/etc/logrotate.conf and /etc/logrotate.d/)',
        answerFr: 'logrotate (/etc/logrotate.conf et /etc/logrotate.d/)',
        examTip: 'logrotate is triggered daily by a systemd timer or cron job.',
        examTipFr: 'logrotate est exécuté quotidiennement par un timer systemd ou une tâche cron.',
      }
    ],
    question: {
      id: 'q-adm-5',
      question: 'Which `rsync` flags are included in the standard `-a` (archive) preset?',
      questionFr: 'Quelles fonctionnalités sont regroupées dans l\'option standard `-a` (archive) de rsync ?',
      options: [
        'Recursive, preserve symlinks, permissions, modification times, owner, and group (-rlptgoD)',
        'Compress and delete destination files',
        'Dry run mode only',
        'Checksum verification on all files'
      ],
      optionsFr: [
        'Récursivité, préservation des liens symboliques, droits, dates, propriétaire et groupe (-rlptgoD)',
        'Compression et suppression automatique',
        'Mode simulation uniquement',
        'Vérification par somme de contrôle systématique'
      ],
      correctIndex: 0,
      explanation: '`-a` stands for archive and combines recursion, symlinks, permissions, timestamps, owner, group, and device files.',
      explanationFr: '`-a` active le mode archive : récursivité, liens symboliques, permissions, horodatages, propriétaire et groupe.',
      commandSnippet: 'rsync -av /etc/ /opt/backup/etc/',
    },
    lab: {
      id: 'lab-adm-5',
      title: 'Testing Logrotate Rules with Dry-Run',
      titleFr: 'Test des règles logrotate en mode simulation',
      goal: 'Validate nginx log rotation rules without modifying disk files.',
      goalFr: 'Valider la configuration de rotation des logs nginx sans altérer les fichiers.',
      context: 'You just deployed custom logrotate rules for an API daemon.',
      contextFr: 'Vous venez de déployer une règle de rotation pour une API.',
      steps: [
        {
          stepNumber: 1,
          title: 'Execute logrotate debug mode',
          titleFr: 'Lancer logrotate en mode debug',
          instruction: 'Run logrotate with debug flag on nginx config.',
          instructionFr: 'Lancez logrotate avec l\'option -d sur la configuration nginx.',
          hint: 'logrotate -d /etc/logrotate.d/nginx',
          hintFr: 'logrotate -d /etc/logrotate.d/nginx',
          expectedCommands: ['logrotate -d /etc/logrotate.d/nginx', 'sudo logrotate -d /etc/logrotate.d/nginx'],
          simulatedOutput: 'reading config file /etc/logrotate.d/nginx\nAllocating hash table for state file, size 64 entries\nHandling 1 logs\nrotating pattern: /var/log/nginx/*.log  after 1 days (14 rotations)\nlog does not need rotating (log size is below threshold)',
          explanation: '`-d` (debug/dry-run) evaluates syntax and explains what actions would be taken without modifying any files.',
          explanationFr: '`-d` simule la rotation, valide la syntaxe et affiche les actions prévues sans toucher aux fichiers.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-adm-5',
      title: 'Log File Keeps Growing After Manual rm',
      titleFr: 'Le disque reste plein après avoir supprimé un log avec rm',
      symptom: 'An administrator deleted a 40GB log file with `rm /var/log/app.log`, but `df -h` still reports the disk as 100% full.',
      symptomFr: 'Un admin a supprimé un log de 40 Go avec `rm`, mais `df -h` affiche toujours la partition pleine à 100%.',
      investigationCommands: ['lsof +L1', 'lsof /var/log/app.log'],
      diagnosticOutput: 'node  2840  appuser  3w  REG  8,1  42949672960  0  /var/log/app.log (deleted)',
      rootCause: 'In Linux, unlinking a file with `rm` does not free disk blocks if a running process still holds an open file descriptor to it.',
      rootCauseFr: 'Sous Linux, `rm` supprime l\'entrée de répertoire mais les blocs restent alloués tant qu\'un processus actif garde le fichier ouvert.',
      solutionCommand: ': > "/proc/2840/fd/3"  # or systemctl reload/restart the service',
      solutionExplanation: 'Truncate the file descriptor to 0 bytes with `: > /proc/<PID>/fd/<FD>` or reload/restart the daemon to release the file handle.',
      solutionExplanationFr: 'Tronquez le descripteur à zéro via `/proc/<PID>/fd/<FD>` ou redémarrez le service concerné.',
    }
  })
];

export const adminLearningPaths: LearningPath[] = [
  // 1. Administrateur Linux
  {
    id: 'admin-sysadmin',
    category: 'admin',
    emoji: '⚙️',
    title: 'Linux System Administrator',
    titleFr: 'Administrateur Linux',
    subtitle: 'Installation → utilisateurs → packages → services → logs → sauvegardes → supervision.',
    subtitleFr: 'Installation → utilisateurs → packages → services → logs → sauvegardes → supervision.',
    description: 'The core professional system administration track: system initialization, package governance, service orchestration with systemd, advanced storage with LVM, backup resilience, and observability.',
    descriptionFr: 'Le parcours de référence de l\'administrateur système : initialisation, gestion des paquets, orchestration systemd, stockage LVM, sauvegardes résilientes et observabilité.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 24,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    themeColor: 'slate',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-800',
    accentHex: '#475569',
    bgGradient: 'from-slate-500/10 via-slate-500/5 to-transparent',
    objectives: [
      'Understand Linux boot initialization from BIOS/UEFI to systemd',
      'Deploy and maintain services using custom systemd unit files',
      'Manage APT and DPKG repositories, updates, and package dependencies',
      'Configure dynamically scalable storage using LVM and dynamic resize',
      'Build automated backup workflows with rsync and manage log rotation'
    ],
    objectivesFr: [
      'Maîtriser la chaîne de démarrage du BIOS/UEFI jusqu\'à systemd',
      'Créer et administrer des services via des fichiers units systemd',
      'Gérer les paquets, dépôts sécurisés et mises à jour APT/DPKG',
      'Administrer du stockage extensible à chaud avec LVM',
      'Automatiser les sauvegardes rsync et la rotation des logs'
    ],
    prerequisites: ['Linux for Beginners or equivalent foundational understanding'],
    prerequisitesFr: ['Parcours Fondamentaux validé ou bases solides de Linux'],
    modules: sysadminModules,
    steps: sysadminModules,
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Boot, Services & Packages',
      titleFr: 'Évaluation intermédiaire : Boot, Services & Paquets',
      description: 'Validate your grasp of boot parameters, unit files, and package management.',
      descriptionFr: 'Valider la maîtrise du démarrage, des unités systemd et d\'APT.',
      passingScorePct: 75,
      questions: [
        sysadminModules[0].question,
        sysadminModules[1].question,
        sysadminModules[2].question,
      ]
    },
    finalEvaluation: {
      title: 'SysAdmin Capstone: Full Server Hardening & Service Provisioning',
      titleFr: 'Projet final Administrateur : Déploiement & Durcissement de Service',
      scenario: 'Deploy an enterprise API server: provision a dedicated LVM partition for application logs, create a secure systemd unit running as an unprivileged user with auto-restart, configure weekly rsync backups, and setup log rotation.',
      scenarioFr: 'Déployer un serveur applicatif : allouer une partition LVM dédiée aux logs, concevoir une unité systemd sécurisée avec redémarrage automatique, configurer une sauvegarde rsync et mettre en place la rotation des logs.',
      deliverables: [
        'Dedicated LVM volume mounted persistently on `/var/log/app`',
        'Custom systemd service `/etc/systemd/system/app.service` verified with daemon-reload',
        'Logrotate policy in `/etc/logrotate.d/app` tested with `-d`',
        'Incremental rsync backup script with lock protection'
      ],
      deliverablesFr: [
        'Volume LVM dédié monté sur `/var/log/app` dans `/etc/fstab`',
        'Service systemd `/etc/systemd/system/app.service` validé',
        'Règle logrotate dans `/etc/logrotate.d/app` testée avec `-d`',
        'Script de sauvegarde incrémentielle rsync avec verrou'
      ],
      validationCriteria: [
        'Zero root execution for application workers',
        'Filesystem expands dynamically without unmounting'
      ],
      validationCriteriaFr: [
        'Aucun processus applicatif tournant sous root',
        'Extension de stockage validée à chaud sans coupure'
      ]
    },
    capstone: {
      title: 'SysAdmin Capstone: Full Server Hardening & Service Provisioning',
      titleFr: 'Projet final Administrateur : Déploiement & Durcissement de Service',
      scenario: 'Deploy an enterprise API server: provision a dedicated LVM partition for application logs, create a secure systemd unit running as an unprivileged user with auto-restart, configure weekly rsync backups, and setup log rotation.',
      scenarioFr: 'Déployer un serveur applicatif : allouer une partition LVM dédiée aux logs, concevoir une unité systemd sécurisée avec redémarrage automatique, configurer une sauvegarde rsync et mettre en place la rotation des logs.',
      deliverables: [
        'Dedicated LVM volume mounted persistently on `/var/log/app`',
        'Custom systemd service `/etc/systemd/system/app.service` verified with daemon-reload',
        'Logrotate policy in `/etc/logrotate.d/app` tested with `-d`',
        'Incremental rsync backup script with lock protection'
      ],
      deliverablesFr: [
        'Volume LVM dédié monté sur `/var/log/app` dans `/etc/fstab`',
        'Service systemd `/etc/systemd/system/app.service` validé',
        'Règle logrotate dans `/etc/logrotate.d/app` testée avec `-d`',
        'Script de sauvegarde incrémentielle rsync avec verrou'
      ],
      validationCriteria: [
        'Zero root execution for application workers',
        'Filesystem expands dynamically without unmounting'
      ],
      validationCriteriaFr: [
        'Aucun processus applicatif tournant sous root',
        'Extension de stockage validée à chaud sans coupure'
      ]
    },
    badgeEarned: {
      title: 'Certified Linux System Administrator',
      titleFr: 'Administrateur Système Linux Certifié',
      icon: '⚙️'
    }
  },

  // 2. Services Linux avec systemd
  {
    id: 'admin-systemd',
    category: 'admin',
    emoji: '🚦',
    title: 'Linux Services with systemd',
    titleFr: 'Services Linux avec systemd',
    subtitle: 'Units → services → targets → systemctl → démarrage → dépendances → logs.',
    subtitleFr: 'Units → services → targets → systemctl → démarrage → dépendances → logs.',
    description: 'Master the engine running modern Linux: unit anatomy, targets and isolation, dependency graph resolution (Wants, Requires, After), timers replacing cron, sandboxing directives, and binary journaling with journalctl.',
    descriptionFr: 'Maîtrisez le moteur des distributions modernes : anatomie des units, targets, graphe de dépendances (Requires, After), timers remplaçant cron, directives de sandboxing et journalisation binaire journald.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 16,
    badgeColor: 'bg-red-50 text-red-700 border-red-300',
    themeColor: 'red',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    accentHex: '#dc2626',
    bgGradient: 'from-red-500/10 via-red-500/5 to-transparent',
    objectives: [
      'Write hardened service units with ProtectSystem and PrivateTmp',
      'Manage system runlevels through targets (multi-user, graphical, rescue)',
      'Replace brittle crontabs with robust systemd timer units',
      'Query, filter, and inspect journald binary logs with boots and timestamps'
    ],
    objectivesFr: [
      'Rédiger des unités de service durcies avec ProtectSystem et PrivateTmp',
      'Gérer les runlevels via les targets (multi-user, graphical, rescue)',
      'Remplacer les crontabs par des timers systemd fiables',
      'Filtrer et auditer les logs binaires journald par bot, service et sévérité'
    ],
    prerequisites: ['Linux command line fundamentals'],
    prerequisitesFr: ['Bases de la ligne de commande Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Unit Directives & Dependencies',
      titleFr: 'Évaluation intermédiaire : Directives Unit & Dépendances',
      description: 'Test your understanding of After, Requires, Wants, and service types.',
      descriptionFr: 'Vérifier la maîtrise des dépendances Requires, Wants et After.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'systemd Specialist Challenge: Microservice Daemonization & Timer',
      titleFr: 'Projet final systemd : Daemonisation sécurisée et Timer de maintenance',
      scenario: 'Take a standalone background worker script, convert it into a hardened systemd daemon with process isolation directives, and build an accompanying timer unit running every 6 hours.',
      scenarioFr: 'Prendre un script applicatif, le convertir en service systemd durci avec isolation de processus, et créer un timer associé s\'exécutant toutes les 6 heures.',
      deliverables: [
        'Service unit configured with `Restart=always` and `User=`',
        'Timer unit active and visible in `systemctl list-timers`'
      ],
      deliverablesFr: [
        'Fichier service avec `Restart=always` et compte non root',
        'Fichier timer actif visible dans `systemctl list-timers`'
      ],
      validationCriteria: [
        'Journald output logs properly tagged with identifier',
        'Timer triggers predictably without overlapping runs'
      ],
      validationCriteriaFr: [
        'Logs journald proprement balisés',
        'Exécution du timer sans chevauchement'
      ]
    },
    capstone: {
      title: 'systemd Specialist Challenge: Microservice Daemonization & Timer',
      titleFr: 'Projet final systemd : Daemonisation sécurisée et Timer de maintenance',
      scenario: 'Take a standalone background worker script, convert it into a hardened systemd daemon with process isolation directives, and build an accompanying timer unit running every 6 hours.',
      scenarioFr: 'Prendre un script applicatif, le convertir en service systemd durci avec isolation de processus, et créer un timer associé s\'exécutant toutes les 6 heures.',
      deliverables: [
        'Service unit configured with `Restart=always` and `User=`',
        'Timer unit active and visible in `systemctl list-timers`'
      ],
      deliverablesFr: [
        'Fichier service avec `Restart=always` et compte non root',
        'Fichier timer actif visible dans `systemctl list-timers`'
      ],
      validationCriteria: [
        'Journald output logs properly tagged with identifier',
        'Timer triggers predictably without overlapping runs'
      ],
      validationCriteriaFr: [
        'Logs journald proprement balisés',
        'Exécution du timer sans chevauchement'
      ]
    },
    badgeEarned: {
      title: 'systemd Service Architect',
      titleFr: 'Architecte de Services systemd',
      icon: '🚦'
    }
  },

  // 3. Processus et performances
  {
    id: 'admin-processes',
    category: 'admin',
    emoji: '📊',
    title: 'Processes, Memory & Performance Tuning',
    titleFr: 'Processus et performances',
    subtitle: 'ps → top → nice → kill → mémoire → CPU → charge système.',
    subtitleFr: 'ps → top → nice → kill → mémoire → CPU → charge système.',
    description: 'Understand what is happening under the hood: process states, CPU scheduling priority (nice/renice), memory architectures (VIRT, RES, swap, OOM killer), signals, and system load analysis.',
    descriptionFr: 'Comprenez ce qui se passe sous le capot : états de processus, priorités d\'ordonnancement CPU (nice, renice), architecture mémoire (VIRT, RES, swap, tueur OOM), signaux et calcul de la charge système (load average).',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 16,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-300',
    themeColor: 'purple',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    accentHex: '#9333ea',
    bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    objectives: [
      'Interpret load average across 1, 5, and 15 minute windows',
      'Distinguish Virtual Memory (VSZ) vs Resident Memory (RSS)',
      'Adjust process execution priority with nice (-20 to +19) and renice',
      'Diagnose and prevent Linux Out-of-Memory (OOM) killer incidents'
    ],
    objectivesFr: [
      'Interpréter le load average sur 1, 5 et 15 minutes',
      'Distinguer mémoire virtuelle (VSZ) et mémoire résidente réelle (RSS)',
      'Ajuster la priorité d\'ordonnancement avec nice (-20 à +19) et renice',
      'Diagnostiquer et prévenir les déclenchements du tueur OOM (Out Of Memory)'
    ],
    prerequisites: ['Basic CLI command usage'],
    prerequisitesFr: ['Utilisation courante du terminal Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Process States & Signals',
      titleFr: 'Évaluation intermédiaire : États Processus & Signaux',
      description: 'Test process states (R, S, D, Z, T) and signal handling.',
      descriptionFr: 'Tester la compréhension des états de processus et signaux POSIX.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Performance Triage Challenge: CPU & Memory Bottleneck',
      titleFr: 'Projet final : Résolution d\'un goulot d\'étranglement CPU et Mémoire',
      scenario: 'A server alert triggers with load average 8.5 on a 2-core machine. Diagnose whether the bottleneck is CPU-bound, disk I/O wait, or memory paging, isolate the culprit, and lower its nice priority.',
      scenarioFr: 'Une alerte se déclenche avec un load average de 8,5 sur une machine 2 cœurs. Diagnostiquer si le goulot vient du CPU, de l\'I/O disque ou du swap, isoler le processus coupable et rétrograder sa priorité nice.',
      deliverables: [
        'Root cause analysis identifying whether issue is user CPU or wait I/O',
        'Reniced process priority to +10 without stopping application'
      ],
      deliverablesFr: [
        'Rapport identifiant la cause (CPU pur vs attente I/O disque)',
        'Priorité nice ajustée à +10 à chaud sans coupure de service'
      ],
      validationCriteria: [
        'Load average returns below threshold without killing valid sessions'
      ],
      validationCriteriaFr: [
        'Retour du load average sous le seuil normal sans tuer les sessions utiles'
      ]
    },
    capstone: {
      title: 'Performance Triage Challenge: CPU & Memory Bottleneck',
      titleFr: 'Projet final : Résolution d\'un goulot d\'étranglement CPU et Mémoire',
      scenario: 'A server alert triggers with load average 8.5 on a 2-core machine. Diagnose whether the bottleneck is CPU-bound, disk I/O wait, or memory paging, isolate the culprit, and lower its nice priority.',
      scenarioFr: 'Une alerte se déclenche avec un load average de 8,5 sur une machine 2 cœurs. Diagnostiquer si le goulot vient du CPU, de l\'I/O disque ou du swap, isoler le processus coupable et rétrograder sa priorité nice.',
      deliverables: [
        'Root cause analysis identifying whether issue is user CPU or wait I/O',
        'Reniced process priority to +10 without stopping application'
      ],
      deliverablesFr: [
        'Rapport identifiant la cause (CPU pur vs attente I/O disque)',
        'Priorité nice ajustée à +10 à chaud sans coupure de service'
      ],
      validationCriteria: [
        'Load average returns below threshold without killing valid sessions'
      ],
      validationCriteriaFr: [
        'Retour du load average sous le seuil normal sans tuer les sessions utiles'
      ]
    },
    badgeEarned: {
      title: 'Linux Performance & Kernel Tuning Expert',
      titleFr: 'Expert Performances et Noyau Linux',
      icon: '📊'
    }
  },

  // 4. Gestion des logiciels
  {
    id: 'admin-software',
    category: 'admin',
    emoji: '📦',
    title: 'Software Packaging & Governance',
    titleFr: 'Gestion des logiciels',
    subtitle: 'APT → DPKG → dépôts → dépendances → mises à jour → compilation.',
    subtitleFr: 'APT → DPKG → dépôts → dépendances → mises à jour → compilation.',
    description: 'Enterprise package management: local repositories, pinning, compiling from source (tarball, make, configure), managing shared libraries with ldconfig, and unattended security patching.',
    descriptionFr: 'Gestion logicielle d\'entreprise : dépôts locaux, épinglage (pinning), compilation de sources (configure, make), gestion des bibliothèques partagées (ldconfig) et correctifs automatiques.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 15,
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-300',
    themeColor: 'cyan',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-700',
    accentHex: '#0891b2',
    bgGradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    objectives: [
      'Manage APT sources, priority pinning in `/etc/apt/preferences`',
      'Inspect and resolve broken library dependencies with ldd and ldconfig',
      'Compile and install software from upstream tarball source code'
    ],
    objectivesFr: [
      'Gérer les sources APT et le pinning de versions dans `/etc/apt/preferences`',
      'Diagnostiquer les bibliothèques partagées manquantes avec ldd et ldconfig',
      'Compiler et installer un logiciel depuis ses sources tarball'
    ],
    prerequisites: ['Basic CLI command usage'],
    prerequisitesFr: ['Utilisation courante du terminal Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Repositories & DPKG',
      titleFr: 'Évaluation intermédiaire : Dépôts & DPKG',
      description: 'Test repository signing, package pinning, and query flags.',
      descriptionFr: 'Tester la signature des dépôts et les requêtes DPKG.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Software Governance Challenge: Source Compilation & Pinning',
      titleFr: 'Projet final : Compilation sur mesure & Épinglage de version',
      scenario: 'A legacy project requires a custom compiled utility with specific compile-time flags. Compile it, configure its shared libraries in `/etc/ld.so.conf.d/`, and create an APT pin preventing automatic overwrite.',
      scenarioFr: 'Un projet exige un utilitaire compilé sur mesure. Le compiler, enregistrer ses bibliothèques dans `/etc/ld.so.conf.d/` et configurer un pin APT empêchant son écrasement par les dépôts.',
      deliverables: [
        'Compiled binary in `/usr/local/bin`',
        'APT pin configuration in `/etc/apt/preferences.d/custom-pin`'
      ],
      deliverablesFr: [
        'Binaire opérationnel dans `/usr/local/bin`',
        'Configuration d\'épinglage dans `/etc/apt/preferences.d/custom-pin`'
      ],
      validationCriteria: [
        'ldd confirms all dynamic dependencies resolve',
        'apt upgrade does not replace the custom package'
      ],
      validationCriteriaFr: [
        'ldd confirme la résolution de toutes les dépendances dynamiques',
        'apt upgrade ne remplace pas le binaire sur mesure'
      ]
    },
    capstone: {
      title: 'Software Governance Challenge: Source Compilation & Pinning',
      titleFr: 'Projet final : Compilation sur mesure & Épinglage de version',
      scenario: 'A legacy project requires a custom compiled utility with specific compile-time flags. Compile it, configure its shared libraries in `/etc/ld.so.conf.d/`, and create an APT pin preventing automatic overwrite.',
      scenarioFr: 'Un projet exige un utilitaire compilé sur mesure. Le compiler, enregistrer ses bibliothèques dans `/etc/ld.so.conf.d/` et configurer un pin APT empêchant son écrasement par les dépôts.',
      deliverables: [
        'Compiled binary in `/usr/local/bin`',
        'APT pin configuration in `/etc/apt/preferences.d/custom-pin`'
      ],
      deliverablesFr: [
        'Binaire opérationnel dans `/usr/local/bin`',
        'Configuration d\'épinglage dans `/etc/apt/preferences.d/custom-pin`'
      ],
      validationCriteria: [
        'ldd confirms all dynamic dependencies resolve',
        'apt upgrade does not replace the custom package'
      ],
      validationCriteriaFr: [
        'ldd confirme la résolution de toutes les dépendances dynamiques',
        'apt upgrade ne remplace pas le binaire sur mesure'
      ]
    },
    badgeEarned: {
      title: 'Linux Software Packaging Specialist',
      titleFr: 'Spécialiste Paquets & Logiciels Linux',
      icon: '📦'
    }
  },

  // 5. Stockage Linux
  {
    id: 'admin-storage',
    category: 'admin',
    emoji: '💾',
    title: 'Linux Enterprise Storage',
    titleFr: 'Stockage Linux',
    subtitle: 'Partitions → Filesystems → mount → LVM → RAID → Quotas → Sauvegardes.',
    subtitleFr: 'Partitions → Filesystems → mount → LVM → RAID → Quotas → Sauvegardes.',
    description: 'Comprehensive storage architecture: MBR vs GPT, ext4 and XFS internals, software RAID with mdadm (RAID 0, 1, 5, 10), LVM snapshots for zero-downtime backups, and user quotas.',
    descriptionFr: 'Architecture de stockage complète : MBR vs GPT, systèmes ext4 et XFS, RAID logiciel avec mdadm (RAID 0, 1, 5, 10), snapshots LVM pour sauvegardes à chaud et quotas utilisateurs.',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedHours: 20,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
    themeColor: 'amber',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    accentHex: '#d97706',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    objectives: [
      'Assemble software RAID arrays with mdadm and handle drive failures',
      'Create and restore LVM thin snapshots for consistent database backups',
      'Optimize filesystem mount parameters with noatime, nodiratime, and commit',
      'Audit and troubleshoot corrupted superblocks with fsck and xfs_repair'
    ],
    objectivesFr: [
      'Construire des grappes RAID logiciel avec mdadm et gérer les pannes de disque',
      'Créer et restaurer des snapshots LVM pour sauvegarder des bases de données',
      'Optimiser les options de montage (noatime, nodiratime, commit)',
      'Réparer des systèmes de fichiers corrompus avec fsck et xfs_repair'
    ],
    prerequisites: ['Linux Filesystem Architecture or strong storage basics'],
    prerequisitesFr: ['Bases solides sur le système de fichiers Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: RAID & Mounts',
      titleFr: 'Évaluation intermédiaire : RAID & Montages',
      description: 'Test RAID levels (0, 1, 5, 10) and persistent fstab entries.',
      descriptionFr: 'Tester les niveaux RAID et la résilience fstab.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Storage Architect Capstone: Resilient RAID Array with LVM',
      titleFr: 'Projet final Stockage : Grappe RAID résiliente avec LVM',
      scenario: 'Configure a RAID-1 mirrored array using two virtual drives with mdadm, initialize the RAID device as an LVM physical volume, create a snapshot for backup, and simulate a drive failure and replacement.',
      scenarioFr: 'Monter un miroir RAID-1 avec mdadm sur deux disques, l\'intégrer dans LVM comme volume physique, réaliser un snapshot de sauvegarde, puis simuler la panne et le remplacement d\'un disque.',
      deliverables: [
        'Active mdadm RAID array `/dev/md0` saved in `/etc/mdadm/mdadm.conf`',
        'LVM snapshot created and mounted read-only for verification'
      ],
      deliverablesFr: [
        'Grappe RAID `/dev/md0` active et enregistrée dans `/etc/mdadm/mdadm.conf`',
        'Snapshot LVM créé et monté en lecture seule pour vérification'
      ],
      validationCriteria: [
        'RAID array rebuilds successfully after disk swap',
        'Data remains available continuously during simulated drive failure'
      ],
      validationCriteriaFr: [
        'Reconstruction du RAID réussie après remplacement du disque',
        'Disponibilité continue des données pendant la panne simulée'
      ]
    },
    capstone: {
      title: 'Storage Architect Capstone: Resilient RAID Array with LVM',
      titleFr: 'Projet final Stockage : Grappe RAID résiliente avec LVM',
      scenario: 'Configure a RAID-1 mirrored array using two virtual drives with mdadm, initialize the RAID device as an LVM physical volume, create a snapshot for backup, and simulate a drive failure and replacement.',
      scenarioFr: 'Monter un miroir RAID-1 avec mdadm sur deux disques, l\'intégrer dans LVM comme volume physique, réaliser un snapshot de sauvegarde, puis simuler la panne et le remplacement d\'un disque.',
      deliverables: [
        'Active mdadm RAID array `/dev/md0` saved in `/etc/mdadm/mdadm.conf`',
        'LVM snapshot created and mounted read-only for verification'
      ],
      deliverablesFr: [
        'Grappe RAID `/dev/md0` active et enregistrée dans `/etc/mdadm/mdadm.conf`',
        'Snapshot LVM créé et monté en lecture seule pour vérification'
      ],
      validationCriteria: [
        'RAID array rebuilds successfully after disk swap',
        'Data remains available continuously during simulated drive failure'
      ],
      validationCriteriaFr: [
        'Reconstruction du RAID réussie après remplacement du disque',
        'Disponibilité continue des données pendant la panne simulée'
      ]
    },
    badgeEarned: {
      title: 'Linux Enterprise Storage Architect',
      titleFr: 'Architecte Stockage d\'Entreprise Linux',
      icon: '💾'
    }
  }
];
