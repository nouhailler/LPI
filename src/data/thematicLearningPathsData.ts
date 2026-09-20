export interface ThematicPathStep {
  id: string;
  number: number;
  title: string;
  titleFr: string;
  conceptTag: string;
  conceptTagFr: string;
  shortDesc: string;
  shortDescFr: string;
  whyItMatters: string;
  whyItMattersFr: string;
  commands: string[];
  codeSnippet?: {
    label: string;
    labelFr: string;
    code: string;
    explanation: string;
    explanationFr: string;
  };
  prodTrap: string;
  prodTrapFr: string;
  checklist: string[];
  checklistFr: string[];
  explainTopic: string;
  trainingTabAction?: 'training' | 'glossary' | 'practice';
}

export interface ThematicCapstoneProject {
  title: string;
  titleFr: string;
  scenario: string;
  scenarioFr: string;
  deliverables: string[];
  deliverablesFr: string[];
  validationCriteria: string[];
  validationCriteriaFr: string[];
}

export interface ThematicPath {
  id: 'admin' | 'bash' | 'networking';
  badgeColor: string;
  themeColor: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentHex: string;
  emoji: string;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  description: string;
  descriptionFr: string;
  targetAudience: string;
  targetAudienceFr: string;
  difficulty: string;
  difficultyFr: string;
  estimatedHours: number;
  steps: ThematicPathStep[];
  capstone: ThematicCapstoneProject;
  badgeEarned: {
    title: string;
    titleFr: string;
    icon: string;
  };
}

export const thematicLearningPaths: ThematicPath[] = [
  {
    id: 'admin',
    emoji: '🔵',
    badgeColor: 'bg-[#0061a4]/15 text-[#0061a4] border-[#0061a4]/30',
    themeColor: 'blue',
    bgGradient: 'from-[#0061a4]/10 via-[#0061a4]/5 to-transparent',
    borderColor: 'border-[#0061a4]/30',
    textColor: 'text-[#0061a4]',
    accentHex: '#0061a4',
    title: 'Become a Linux Administrator',
    titleFr: 'Devenir administrateur Linux',
    subtitle: 'From zero shell experience to production-grade Linux sysadmin autonomy',
    subtitleFr: 'De la ligne de commande initiale à la gestion autonome de serveurs en production',
    description:
      'A practical, career-focused learning path structured for real-world server operations: command-line mastery, filesystems, users, permissions, process lifecycle, systemd, and baseline security.',
    descriptionFr:
      'Un parcours professionnalisant conçu pour le terrain : maîtrise du terminal, FHS & disques, comptes & sudo, droits octaux, gestion des processus, services systemd et sécurisation de base.',
    targetAudience: 'Junior SysAdmins, DevOps Engineers, Cloud Practitioners, Developers wanting server autonomy',
    targetAudienceFr: 'Futurs SysAdmins, ingénieurs DevOps, praticiens Cloud et développeurs souhaitant être autonomes sur serveur',
    difficulty: 'Beginner to Intermediate',
    difficultyFr: 'Débutant à Intermédiaire',
    estimatedHours: 25,
    badgeEarned: {
      title: 'Certified Production Linux Sysadmin Ready',
      titleFr: 'Prêt pour l\'Administration Système Linux en Production',
      icon: '🛡️',
    },
    capstone: {
      title: 'Deploy & Harden a Multi-User Web Stack',
      titleFr: 'Déploiement et durcissement d\'une pile applicative multi-utilisateurs',
      scenario:
        'Provision a secure Linux instance: create an isolated service user with restricted shell, configure dedicated mount points and strict umask, set up a systemd unit with auto-restart, and verify firewall and SSH key policies.',
      scenarioFr:
        'Configurer un serveur Linux sécurisé : créer un utilisateur applicatif isolé sans shell interactif, configurer un point de montage avec umask strict, créer un service systemd avec redémarrage automatique et verrouiller SSH et le pare-feu.',
      deliverables: [
        'Isolated service user without login privileges',
        'Custom systemd service with security sandboxing (ProtectSystem, NoNewPrivileges)',
        'Storage directory with SGID and restrictive group permissions',
        'Audit log verification via journalctl',
      ],
      deliverablesFr: [
        'Utilisateur de service isolé sans droits de connexion interactive',
        'Service systemd personnalisé avec durcissement (ProtectSystem, NoNewPrivileges)',
        'Répertoire partagé avec SGID et permissions de groupe restrictives',
        'Vérification des journaux d\'audit avec journalctl',
      ],
      validationCriteria: [
        'Service runs under dedicated user without root privileges',
        'Newly generated files automatically inherit group ownership',
        'Service restarts automatically on failure',
      ],
      validationCriteriaFr: [
        'Le service tourne sous son utilisateur dédié sans droits root',
        'Les nouveaux fichiers héritent automatiquement du groupe grâce au SGID',
        'Le service redémarre automatiquement en cas de crash',
      ],
    },
    steps: [
      {
        id: 'admin-cli',
        number: 1,
        title: 'Linux CLI & Terminal Navigation',
        titleFr: 'Linux CLI & Navigation Shell',
        conceptTag: 'Core Terminal',
        conceptTagFr: 'Terminal Fondamental',
        shortDesc: 'Master shell prompt navigation, paths, file operations, and man page documentation.',
        shortDescFr: 'Maîtriser le prompt, les chemins relatifs/absolus, la navigation et les pages de manuel.',
        whyItMatters:
          'In production, 99% of cloud instances and servers run headless without a GUI. Terminal confidence is non-negotiable.',
        whyItMattersFr:
          'En production, 99% des serveurs et VM cloud tournent sans interface graphique. L\'aisance en ligne de commande est le socle absolu.',
        commands: ['ls -la', 'cd', 'pwd', 'mkdir -p', 'cp -r', 'mv', 'rm -i', 'man', 'which'],
        codeSnippet: {
          label: 'Safe navigation and recursive directory tree creation',
          labelFr: 'Création d\'arborescence propre et navigation sécurisée',
          code: 'mkdir -p /opt/app/{config,data,logs}\ncd /opt/app && pwd\nls -la --color=auto',
          explanation: 'Creates parent directories if missing and inspects directory layout with hidden files.',
          explanationFr: 'Crée les sous-dossiers nécessaires en une seule passe et liste le contenu avec les métadonnées.',
        },
        prodTrap:
          'Never run "rm -rf /path/*" with unquoted variables (e.g. $DIR/* where DIR is empty becomes "rm -rf /*").',
        prodTrapFr:
          'Ne jamais exécuter "rm -rf $DIR/*" sans vérifier que la variable $DIR est définie et non vide, sous peine de supprimer la racine !',
        checklist: [
          'Understand relative vs absolute paths',
          'Use Tab auto-completion and reverse history search (Ctrl+R)',
          'Read man pages and use man -k / apropos',
        ],
        checklistFr: [
          'Distinguer chemins relatifs et absolus',
          'Utiliser la complétion automatique Tab et la recherche d\'historique (Ctrl+R)',
          'Lire et naviguer efficacement dans les pages man',
        ],
        explainTopic: 'bash',
        trainingTabAction: 'training',
      },
      {
        id: 'admin-filesystem',
        number: 2,
        title: 'Filesystem Hierarchy & Storage (FHS)',
        titleFr: 'Arborescence FHS, Points de montage & Disques',
        conceptTag: 'FHS & Storage',
        conceptTagFr: 'FHS & Stockage',
        shortDesc: 'Understand the standard Linux directory tree (/etc, /var, /usr, /home) and disk inspection.',
        shortDescFr: 'Comprendre l\'arborescence standard FHS (/etc, /var, /usr, /home), les inodes et l\'espace disque.',
        whyItMatters:
          'Knowing where configuration files, persistent logs, and shared binaries live prevents catastrophic system misconfiguration and full-disk outages.',
        whyItMattersFr:
          'Savoir où logent les fichiers de configuration (/etc) et les journaux (/var/log) évite les pannes de disque plein qui paralysent les services.',
        commands: ['df -h', 'du -sh *', 'lsblk', 'fdisk -l', 'mount', 'umount', 'find', 'tune2fs'],
        codeSnippet: {
          label: 'Investigate which directory consumes the most disk space',
          labelFr: 'Identifier le répertoire qui sature la partition',
          code: 'df -hT /var\ndu -ah /var/log | sort -hr | head -n 10',
          explanation: 'Displays filesystem usage with human-readable units and isolates the top 10 largest log files.',
          explanationFr: 'Affiche l\'état de la partition et trie les 10 plus gros fichiers journaux par taille décroissante.',
        },
        prodTrap:
          'A disk can be reported "full" (No space left on device) even if df -h shows free gigabytes, if all inodes are exhausted (check with df -i).',
        prodTrapFr:
          'Un disque peut afficher "No space left on device" alors qu\'il reste des gigas libres si la table d\'inodes est saturée (vérifier avec df -i).',
        checklist: [
          'Memorize standard FHS paths: /etc, /var/log, /proc, /sys, /tmp',
          'Inspect partition usage with df -h and df -i',
          'Locate large files with find / -size +100M',
        ],
        checklistFr: [
          'Mémoriser le rôle de /etc, /var/log, /proc, /sys et /tmp',
          'Inspecter l\'espace et les inodes avec df -h et df -i',
          'Repérer les gros fichiers avec find / -size +100M',
        ],
        explainTopic: 'fhs',
        trainingTabAction: 'training',
      },
      {
        id: 'admin-users',
        number: 3,
        title: 'Users, Groups & Privilege Management (sudo)',
        titleFr: 'Gestion des Utilisateurs, Groupes & Privilèges (sudo)',
        conceptTag: 'User & Auth',
        conceptTagFr: 'Utilisateurs & sudo',
        shortDesc: 'Create system users, manage secondary groups, configure password policies and /etc/sudoers.',
        shortDescFr: 'Créer des utilisateurs, gérer les groupes secondaires, les fichiers /etc/passwd et /etc/sudoers.',
        whyItMatters:
          'Operating solely as root in production is a critical vulnerability. Proper privilege delegation with sudo enforces auditability and the principle of least privilege.',
        whyItMattersFr:
          'Travailler en root permanent est une faille majeure. La délégation de privilèges via sudo garantit la traçabilité et le moindre privilège.',
        commands: ['useradd -m -s', 'usermod -aG', 'userdel -r', 'groupadd', 'passwd', 'visudo', 'id', 'whoami'],
        codeSnippet: {
          label: 'Create an operations user with dedicated group and sudo access',
          labelFr: 'Créer un utilisateur ops avec groupe et délégation sudo',
          code: 'useradd -m -s /bin/bash -G wheel,adm devops\npasswd devops\nvisudo  # Always use visudo to validate syntax!',
          explanation: 'Creates a user with home directory, default shell, and adds them to administrative groups.',
          explanationFr: 'Crée le compte utilisateur avec son répertoire personnel et l\'ajoute aux groupes administratifs.',
        },
        prodTrap:
          'Never edit /etc/sudoers directly with nano or vim! Always use "visudo" to prevent locking yourself out due to a syntax typo.',
        prodTrapFr:
          'Ne jamais éditer /etc/sudoers directement ! Toujours utiliser "visudo", qui valide la syntaxe avant d\'enregistrer et évite de perdre l\'accès sudo.',
        checklist: [
          'Understand /etc/passwd, /etc/shadow, and /etc/group formats',
          'Add users to groups non-destructively using usermod -aG',
          'Configure passwordless sudo for specific automated commands via /etc/sudoers.d/',
        ],
        checklistFr: [
          'Comprendre la structure de /etc/passwd, /etc/shadow et /etc/group',
          'Ajouter un groupe sans écraser les existants avec usermod -aG',
          'Créer un fichier de délégation propre dans /etc/sudoers.d/',
        ],
        explainTopic: 'sudo',
        trainingTabAction: 'glossary',
      },
      {
        id: 'admin-permissions',
        number: 4,
        title: 'File Permissions & Special Bits (chmod, chown, umask)',
        titleFr: 'Permissions Fichiers & Bits Spéciaux (chmod, umask, SUID)',
        conceptTag: 'Security & Access',
        conceptTagFr: 'Droits d\'accès',
        shortDesc: 'Master rwx octal and symbolic modes, umask default calculations, SUID, SGID, and Sticky bits.',
        shortDescFr: 'Maîtriser les droits rwx en octal et symbolique, le calcul de umask, le SUID, SGID et Sticky bit.',
        whyItMatters:
          'Incorrect permissions either expose sensitive customer data or cause services to crash with "Permission denied" errors.',
        whyItMattersFr:
          'Une mauvaise permission expose des secrets ou empêche les démons de démarrer (erreur "Permission Denied").',
        commands: ['chmod 755', 'chmod u+x', 'chown user:group', 'chgrp', 'umask', 'chmod +s', 'chmod +t'],
        codeSnippet: {
          label: 'Set up a team shared collaborative folder with SGID inheritance',
          labelFr: 'Configurer un dossier partagé d\'équipe avec héritage SGID',
          code: 'mkdir /srv/team_docs\nchown root:developers /srv/team_docs\nchmod 2770 /srv/team_docs  # 2 = SGID bit\numask 0027',
          explanation: 'The SGID bit ensures all new files created inside /srv/team_docs automatically belong to the "developers" group.',
          explanationFr: 'Le bit SGID force tous les nouveaux fichiers à hériter du groupe "developers", facilitant le travail collaboratif.',
        },
        prodTrap:
          'Do NOT give "chmod 777" to fix permission errors! It opens world-writable execution and violates compliance standards.',
        prodTrapFr:
          'Ne JAMAIS appliquer "chmod -R 777" pour contourner un problème de droits : c\'est une faille critique de sécurité.',
        checklist: [
          'Calculate octal modes (4=r, 2=w, 1=x) in your head',
          'Explain why files get 666 - umask and directories get 777 - umask',
          'Recognize SUID (4xxx), SGID (2xxx), and Sticky bit (1xxx on /tmp)',
        ],
        checklistFr: [
          'Calculer les modes octaux instantanément (r=4, w=2, x=1)',
          'Comprendre le calcul du umask sur fichiers (base 666) et dossiers (base 777)',
          'Identifier le rôle du SUID (4xxx), SGID (2xxx) et Sticky bit (1xxx sur /tmp)',
        ],
        explainTopic: 'umask',
        trainingTabAction: 'training',
      },
      {
        id: 'admin-processes',
        number: 5,
        title: 'Process Management, Signals & Resource Monitoring',
        titleFr: 'Gestion des Processus, Signaux & Surveillance Système',
        conceptTag: 'Process Lifecycle',
        conceptTagFr: 'Cycle de vie processus',
        shortDesc: 'Inspect running tasks, monitor CPU and RAM load, send POSIX signals, and adjust execution priority.',
        shortDescFr: 'Surveiller les processus, inspecter la RAM/CPU, envoyer des signaux POSIX et gérer la priorité (nice).',
        whyItMatters:
          'When a server freezes, a sysadmin must immediately identify rogue memory-hogging processes and terminate them cleanly.',
        whyItMattersFr:
          'En cas de ralentissement ou pic de charge, l\'administrateur doit cibler les processus consommateurs et les arrêter proprement.',
        commands: ['ps aux', 'top / htop', 'pgrep', 'pkill', 'kill -15', 'kill -9', 'nice', 'renice', 'free -m', 'uptime'],
        codeSnippet: {
          label: 'Find and gracefully terminate runaway worker processes',
          labelFr: 'Repérer et stopper proprement un processus bloqué',
          code: 'ps aux | grep [n]ginx\npkill -15 -u www-data nginx  # SIGTERM: graceful shutdown\n# If unresponsive after 10s:\npkill -9 -u www-data nginx   # SIGKILL: forceful kill',
          explanation: 'Always attempt SIGTERM (15) first so database connections and file descriptors close cleanly.',
          explanationFr: 'Toujours tenter SIGTERM (15) en premier afin de laisser le temps au programme de libérer ses verrous et fichiers.',
        },
        prodTrap:
          'Relying immediately on "kill -9" (SIGKILL) can corrupt database files and leave orphaned child processes or open socket locks.',
        prodTrapFr:
          'Utiliser d\'emblée "kill -9" peut corrompre des bases de données et laisser des verrous orphelins : réservez-le en dernier recours.',
        checklist: [
          'Differentiate SIGTERM (15), SIGKILL (9), and SIGHUP (1)',
          'Interpret 1, 5, 15 minute Load Average from uptime',
          'Understand Zombie (Z) vs Defunct process states',
        ],
        checklistFr: [
          'Distinguer SIGTERM (15), SIGKILL (9) et SIGHUP (1)',
          'Interpréter le Load Average sur 1, 5 et 15 minutes',
          'Identifier l\'état des processus Zombie (Z) et comprendre leur gestion',
        ],
        explainTopic: 'kill',
        trainingTabAction: 'training',
      },
      {
        id: 'admin-systemd',
        number: 6,
        title: 'systemd Services, Targets & Journal Logs',
        titleFr: 'Services systemd, Cibles (Targets) & Journaux journalctl',
        conceptTag: 'Init & Services',
        conceptTagFr: 'Init & Services',
        shortDesc: 'Control daemons, enable on boot, write unit files, switch targets, and filter systemd journal logs.',
        shortDescFr: 'Piloter les démons, activer au démarrage, écrire un fichier unit et filtrer les logs avec journalctl.',
        whyItMatters:
          'systemd is the standard init system for modern enterprise Linux (RHEL, Debian, Ubuntu, Rocky, Alma). Modern services rely entirely on it.',
        whyItMattersFr:
          'systemd est le système d\'init universel sur les distributions modernes. La quasi-totalité des services de production en dépendent.',
        commands: [
          'systemctl start/stop/restart',
          'systemctl enable --now',
          'systemctl status',
          'systemctl daemon-reload',
          'journalctl -u service -f',
          'journalctl -xe',
          'systemctl get-default',
        ],
        codeSnippet: {
          label: 'Create and enable a production custom Node.js systemd service',
          labelFr: 'Créer et activer un service systemd personnalisé',
          code: `# /etc/systemd/system/myapp.service\n[Unit]\nDescription=My Production App\nAfter=network.target\n\n[Service]\nUser=appuser\nExecStart=/usr/bin/node /opt/myapp/server.js\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\n\n# Commands:\nsystemctl daemon-reload && systemctl enable --now myapp`,
          explanation: 'Defines restart policies, execution privileges, and targets multi-user mode on boot.',
          explanationFr: 'Définit l\'utilisateur d\'exécution, la politique de redémarrage et l\'intégration au démarrage du système.',
        },
        prodTrap:
          'Forgetting to run "systemctl daemon-reload" after modifying a .service file means systemd continues running the cached old definition.',
        prodTrapFr:
          'Oublier d\'exécuter "systemctl daemon-reload" après avoir modifié un fichier .service laisse systemd exécuter l\'ancienne version en cache.',
        checklist: [
          'Know the difference between "start" (now) and "enable" (on boot)',
          'Follow live service logs with journalctl -u <name> -f -n 50',
          'Understand multi-user.target (CLI) vs graphical.target (GUI)',
        ],
        checklistFr: [
          'Distinguer "start" (lancement immédiat) et "enable" (activation au boot)',
          'Suivre les logs d\'un service en temps réel avec journalctl -u <nom> -f',
          'Comprendre les cibles multi-user.target (console) et graphical.target (GUI)',
        ],
        explainTopic: 'systemctl',
        trainingTabAction: 'training',
      },
      {
        id: 'admin-networking',
        number: 7,
        title: 'Core Server Networking & Connectivity',
        titleFr: 'Réseau Serveur Fondamental & Connectivité',
        conceptTag: 'Network Basics',
        conceptTagFr: 'Réseau Serveur',
        shortDesc: 'Configure IP addresses, view open ports, inspect routing tables, and test remote reachability.',
        shortDescFr: 'Inspecter les interfaces IP, visualiser les ports en écoute, les routes et tester la connectivité.',
        whyItMatters:
          'A server that cannot communicate over the network or has unknown open ports is either useless or compromised.',
        whyItMattersFr:
          'Un serveur incapable de joindre sa passerelle ou laissant des ports non sécurisés ouverts est une cible facile.',
        commands: ['ip addr show', 'ip route', 'ss -tulpn', 'ping -c 4', 'curl -Iv', 'dig', 'traceroute'],
        codeSnippet: {
          label: 'Inspect all open listening TCP/UDP ports and owning processes',
          labelFr: 'Vérifier tous les ports en écoute et leurs processus',
          code: 'ip addr show eth0\nss -tulpn | grep LISTEN\ncurl -Iv http://127.0.0.1:8080',
          explanation: 'ss -tulpn lists TCP/UDP listening sockets with numerical port numbers and process IDs.',
          explanationFr: 'ss -tulpn affiche immédiatement quels démons écoutent sur quelles interfaces et avec quel PID.',
        },
        prodTrap:
          'Deprecated tools like ifconfig and netstat are not installed by default on modern servers; always use the "ip" and "ss" suites.',
        prodTrapFr:
          'ifconfig et netstat sont obsolètes et souvent absents par défaut : adoptez impérativement "ip" et "ss".',
        checklist: [
          'Identify interface IP addresses and CIDR subnet masks',
          'Inspect default gateway with ip route show',
          'Verify socket state (LISTEN, ESTABLISHED, TIME_WAIT) with ss',
        ],
        checklistFr: [
          'Identifier l\'IP et le masque CIDR de chaque interface',
          'Vérifier la passerelle par défaut avec ip route show',
          'Inspecter l\'état des sockets (LISTEN, ESTABLISHED) avec ss',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'glossary',
      },
      {
        id: 'admin-security',
        number: 8,
        title: 'Server Hardening & Baseline Security',
        titleFr: 'Durcissement Système & Sécurité Essentielle',
        conceptTag: 'Hardening',
        conceptTagFr: 'Sécurité & Hardening',
        shortDesc: 'Lock down SSH, enforce key authentication, configure basic firewall rules, and audit failed logins.',
        shortDescFr: 'Verrouiller SSH, imposer les clés privées/publiques, configurer le pare-feu et auditer les accès.',
        whyItMatters:
          'Any public internet-facing Linux server is attacked within minutes of provisioning. Baseline hardening is mandatory.',
        whyItMattersFr:
          'Tout serveur exposé sur Internet subit des scans et attaques par force brute dans les minutes qui suivent. Le durcissement est obligatoire.',
        commands: ['ssh-keygen', 'ssh-copy-id', 'ufw enable', 'ufw allow', 'fail2ban-client', 'last', 'lastb'],
        codeSnippet: {
          label: 'Harden SSH daemon configuration (/etc/ssh/sshd_config)',
          labelFr: 'Durcir la configuration du serveur SSH',
          code: `# /etc/ssh/sshd_config.d/99-hardened.conf\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\nX11Forwarding no\n\n# Reload safely without disconnecting your current session:\nsystemctl reload sshd`,
          explanation: 'Disables root login and password authentication, forcing cryptographically secure SSH keys.',
          explanationFr: 'Interdit le mot de passe et le compte root direct, rendant les attaques par dictionnaire inefficaces.',
        },
        prodTrap:
          'Always keep your current active SSH session open in one terminal while reloading sshd or firewall rules to prevent locking yourself out!',
        prodTrapFr:
          'Gardez toujours votre session SSH active dans un terminal quand vous rechargez la configuration pour éviter de vous retrouver enfermé dehors !',
        checklist: [
          'Generate strong SSH ED25519 keypairs (ssh-keygen -t ed25519)',
          'Disable PermitRootLogin and PasswordAuthentication',
          'Enable UFW or firewalld allowing only ports 22, 80, 443',
        ],
        checklistFr: [
          'Générer des paires de clés SSH ED25519 modernes',
          'Désactiver la connexion mot de passe et le root direct dans sshd_config',
          'Activer le pare-feu UFW en n\'autorisant que les flux nécessaires',
        ],
        explainTopic: 'ssh',
        trainingTabAction: 'training',
      },
    ],
  },
  {
    id: 'bash',
    emoji: '🟢',
    badgeColor: 'bg-[#047857]/15 text-[#047857] border-[#047857]/30',
    themeColor: 'green',
    bgGradient: 'from-[#047857]/10 via-[#047857]/5 to-transparent',
    borderColor: 'border-[#047857]/30',
    textColor: 'text-[#047857]',
    accentHex: '#047857',
    title: 'Master Bash Scripting & Automation',
    titleFr: 'Maîtriser Bash & l\'Automatisation',
    subtitle: 'From simple command one-liners to robust, production-grade automation scripts',
    subtitleFr: 'Des one-liners élémentaires aux scripts d\'automatisation robustes pour la production',
    description:
      'Learn how to automate system tasks, parse log files, write maintainable scripts with variables, conditionals, loops, functions, pipelines, regex, and rigorous error handling.',
    descriptionFr:
      'Apprenez à automatiser les tâches d\'administration, filtrer des flux de logs, manipuler variables, conditions, boucles, fonctions, tubes Unix, expressions régulières et gestion stricte des erreurs.',
    targetAudience: 'System Administrators, SREs, DevOps Engineers, Developers building CI/CD pipelines',
    targetAudienceFr: 'Administrateurs système, ingénieurs SRE & DevOps, développeurs automatisant des pipelines CI/CD',
    difficulty: 'Beginner to Advanced',
    difficultyFr: 'Débutant à Avancé',
    estimatedHours: 20,
    badgeEarned: {
      title: 'Certified Production Bash Automation Engineer',
      titleFr: 'Expert en Scripting & Automatisation Bash',
      icon: '⚡',
    },
    capstone: {
      title: 'Automated Backup & Health Audit Pipeline',
      titleFr: 'Pipeline d\'audit système & de sauvegarde incrémentale automatisée',
      scenario:
        'Write a bulletproof shell script that audits server disk/RAM metrics, creates an encrypted compressed archive of critical directories, rotates backups older than 7 days, and logs results with strict error trapping.',
      scenarioFr:
        'Concevoir un script shell robuste qui audite les métriques disques/RAM, compresse et chiffre les répertoires critiques, purge les sauvegardes de plus de 7 jours et consigne tout dans un journal d\'audit avec gestion des erreurs.',
      deliverables: [
        'POSIX/Bash script with shebang #!/usr/bin/env bash and "set -euo pipefail"',
        'Command-line argument handling via getopts (-d directory, -k keep_days)',
        'Log rotation and cleanup using find -mtime +7 -delete',
        'Signal trapping (trap "cleanup" EXIT) for temporary working directories',
      ],
      deliverablesFr: [
        'Script Bash avec shebang #!/usr/bin/env bash et "set -euo pipefail"',
        'Gestion des options en ligne de commande avec getopts (-d dossier, -k jours)',
        'Nettoyage automatique des anciennes archives avec find -mtime +7',
        'Nettoyage propre des fichiers temporaires via trap EXIT',
      ],
      validationCriteria: [
        'Script exits immediately on unhandled command failure or unset variable',
        'Generates human-readable timestamps and return status codes',
        'Works reliably without user intervention via cron or systemd timer',
      ],
      validationCriteriaFr: [
        'Le script s\'arrête immédiatement en cas d\'erreur ou variable indéfinie',
        'Génère des horodatages lisibles et des codes de retour standardisés',
        'S\'exécute de façon autonome via crontab ou un timer systemd',
      ],
    },
    steps: [
      {
        id: 'bash-variables',
        number: 1,
        title: 'Variables, Scope & Special Parameters',
        titleFr: 'Variables, Portée & Paramètres Spéciaux',
        conceptTag: 'Syntax & Scope',
        conceptTagFr: 'Variables & Paramètres',
        shortDesc: 'Assign variables, understand quotation rules, export environment variables, and use $?, $#, $1.',
        shortDescFr: 'Affecter des variables, comprendre les guillemets, l\'export d\'environnement et maîtriser $?, $#, $1.',
        whyItMatters:
          'Quotation mistakes and unset variables cause silent failures and destructive unintended commands in production scripts.',
        whyItMattersFr:
          'L\'oubli de guillemets ("$VAR") ou de variables indéfinies est la cause n°1 de bugs silencieux et de suppressions accidentelles.',
        commands: ['VAR="value"', 'export VAR', 'echo "$VAR"', 'echo $?', 'echo $#', 'echo "$@"', 'read -p'],
        codeSnippet: {
          label: 'Safe variable definition with fallback defaults',
          labelFr: 'Déclaration sécurisée avec valeur de repli par défaut',
          code: '#!/usr/bin/env bash\nBACKUP_DIR="${1:-/tmp/backups}"\nTIMESTAMP="$(date +%Y%m%d_%H%M%S)"\necho "Writing backup to: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"',
          explanation: 'Uses ${1:-default} syntax to provide a default value if argument $1 was not supplied.',
          explanationFr: 'Utilise la syntaxe ${1:-valeur} pour garantir une valeur de secours si l\'argument $1 est omis.',
        },
        prodTrap:
          'Never put spaces around the "=" sign in variable assignments (VAR = "foo" attempts to execute command "VAR"!).',
        prodTrapFr:
          'Ne JAMAIS mettre d\'espace autour du signe "=" (écrire VAR = "val" tente d\'exécuter une commande nommée VAR !).',
        checklist: [
          'Quote variables: "$VAR" preserves spaces while $VAR splits into arguments',
          'Use $? to check exit status (0 = success, non-zero = error)',
          'Distinguish "$@" (preserves words) from "$*" (joins everything)',
        ],
        checklistFr: [
          'Toujours entourer les variables de guillemets : "$VAR"',
          'Vérifier le code de sortie avec $? (0 = succès, >0 = erreur)',
          'Comprendre la différence entre "$@" (maintient les mots) et "$*"',
        ],
        explainTopic: 'bash',
        trainingTabAction: 'glossary',
      },
      {
        id: 'bash-conditions',
        number: 2,
        title: 'Conditionals & Tests (if, [[ ... ]], case)',
        titleFr: 'Conditions & Tests (if, [[ ... ]], case)',
        conceptTag: 'Logic & Flow',
        conceptTagFr: 'Conditions & Tests',
        shortDesc: 'Compare strings, numbers, test file existence (-f, -d, -x), and write readable case statements.',
        shortDescFr: 'Comparer chaînes et nombres, tester l\'existence de fichiers (-f, -d, -x) et utiliser case.',
        whyItMatters:
          'Robust scripts must verify preconditions (does the file exist? is the user root?) before executing modifications.',
        whyItMattersFr:
          'Un bon script vérifie toujours les prérequis (le fichier existe-t-il ? l\'utilisateur est-il root ?) avant d\'agir.',
        commands: ['if [[ ... ]]; then', 'elif', 'else', 'fi', 'case ... in', '-f (file)', '-d (dir)', '-z (empty)'],
        codeSnippet: {
          label: 'Precondition check: verify root privileges and file existence',
          labelFr: 'Vérification des prérequis de privilèges et de fichiers',
          code: 'if [[ $EUID -ne 0 ]]; then\n  echo "Error: This script must be run as root." >&2\n  exit 1\nfi\n\nif [[ ! -f "/etc/nginx/nginx.conf" ]]; then\n  echo "Config missing!" >&2\n  exit 2\nfi',
          explanation: 'Checks root privileges via $EUID and ensures the configuration file exists before proceeding.',
          explanationFr: 'Vérifie l\'ID effectif de l\'utilisateur ($EUID == 0 pour root) et la présence du fichier cible.',
        },
        prodTrap:
          'In single brackets [ ], string comparison with < or > can accidentally trigger shell redirection! Prefer modern double brackets [[ ]].',
        prodTrapFr:
          'Dans les simples crochets [ ], les opérateurs < ou > provoquent des redirections sauvages ! Utilisez toujours les doubles crochets [[ ]].',
        checklist: [
          'Use modern [[ ... ]] in Bash for safer regex matching and logical && / ||',
          'Use -eq, -ne, -lt for numbers, but ==, != for strings',
          'Use case statements for clean multi-branch argument menus',
        ],
        checklistFr: [
          'Privilégier [[ ... ]] pour bénéficier des opérateurs logiques && et ||',
          'Utiliser -eq, -ne pour les nombres et ==, != pour le texte',
          'Utiliser case ... esac pour traiter proprement les options en menu',
        ],
        explainTopic: 'bash',
        trainingTabAction: 'glossary',
      },
      {
        id: 'bash-loops',
        number: 3,
        title: 'Loops (for, while, until) & Iteration',
        titleFr: 'Boucles d\'Itération (for, while, until)',
        conceptTag: 'Iteration',
        conceptTagFr: 'Boucles & Itération',
        shortDesc: 'Iterate over lists, files, C-style ranges, and read input streams line by line with while IFS= read -r.',
        shortDescFr: 'Itérer sur des listes de serveurs, des fichiers et lire des flux ligne par ligne avec while read.',
        whyItMatters:
          'Automation is fundamentally about batch processing: doing a task 1,000 times cleanly without human fatigue.',
        whyItMattersFr:
          'L\'automatisation consiste à répéter une tâche sur 500 fichiers ou serveurs sans la moindre erreur humaine.',
        commands: ['for x in ...; do', 'while [ ... ]; do', 'done', 'break', 'continue', 'while IFS= read -r line'],
        codeSnippet: {
          label: 'Safely read a file line by line without stripping whitespace',
          labelFr: 'Lire un fichier ligne par ligne sans tronquer les espaces',
          code: 'while IFS= read -r host; do\n  [[ -z "$host" || "$host" =~ ^# ]] && continue\n  echo "Checking connectivity to $host..."\n  ping -c 1 -W 2 "$host" >/dev/null 2>&1 && echo "  -> ONLINE" || echo "  -> OFFLINE"\ndone < "/etc/hosts.list"',
          explanation: 'IFS= prevents trimming leading/trailing spaces, and -r prevents backslash escaping.',
          explanationFr: 'IFS= évite de rogner les espaces et -r empêche l\'interprétation des antislashs.',
        },
        prodTrap:
          'Do NOT parse file lines with "for line in $(cat file.txt)"! It splits lines on spaces, breaking filenames with spaces.',
        prodTrapFr:
          'Ne JAMAIS faire "for line in $(cat file.txt)" : le shell découpe chaque mot à chaque espace, corrompant les lignes.',
        checklist: [
          'Use while IFS= read -r line to parse text streams safely',
          'Iterate over globs safely: for file in /path/*.log; do ...',
          'Understand break and continue loop control flow',
        ],
        checklistFr: [
          'Utiliser while IFS= read -r pour parcourir des fichiers',
          'Itérer directement sur des globs : for f in *.log; do ...',
          'Maîtriser break pour quitter et continue pour passer au tour suivant',
        ],
        explainTopic: 'bash',
        trainingTabAction: 'training',
      },
      {
        id: 'bash-functions',
        number: 4,
        title: 'Functions & Code Modularity',
        titleFr: 'Fonctions & Modularité du Code',
        conceptTag: 'Modular Code',
        conceptTagFr: 'Fonctions & Modularité',
        shortDesc: 'Structure reusable components, use "local" variables, pass arguments, and return exit codes.',
        shortDescFr: 'Structurer des composants réutilisables, déclarer des variables locales et gérer les codes de retour.',
        whyItMatters:
          'Monolithic 1,000-line spaghetti scripts cannot be tested or maintained. Functions provide clean architecture and reusability.',
        whyItMattersFr:
          'Les scripts monolithiques spaghetti sont ingérables en entreprise. Les fonctions apportent clarté, testabilité et réutilisation.',
        commands: ['my_func() { ... }', 'local var=...', 'return 0', '$1, $2', 'result=$(my_func)'],
        codeSnippet: {
          label: 'Structured logging function with timestamp and error level',
          labelFr: 'Fonction de journalisation horodatée avec niveau de sévérité',
          code: `log() {\n  local level="$1"\n  shift\n  local msg="$*"\n  echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $msg"\n}\n\nlog "INFO" "Starting deployment on server..."\nlog "WARN" "Disk usage over 80%"`,
          explanation: 'Declares local variables to avoid polluting global state, and uses shift to capture the remaining message.',
          explanationFr: 'Utilise "local" pour ne pas écraser les variables globales et "shift" pour récupérer le reste du texte.',
        },
        prodTrap:
          'Forgetting the "local" keyword inside a function makes every variable global, causing catastrophic side-effects in other loops.',
        prodTrapFr:
          'Oublier le mot-clé "local" transforme chaque variable en variable globale, écrasant les compteurs des autres boucles.',
        checklist: [
          'Always declare variables inside functions with "local"',
          'Use "return" for exit status (0-255), not for returning text strings',
          'Capture text output using command substitution: output="$(my_function)"',
        ],
        checklistFr: [
          'Toujours déclarer les variables internes avec le mot-clé "local"',
          'Utiliser "return" pour un statut (0-255) et echo pour renvoyer du texte',
          'Capturer le résultat texte avec $(ma_fonction)',
        ],
        explainTopic: 'bash',
        trainingTabAction: 'glossary',
      },
      {
        id: 'bash-pipes',
        number: 5,
        title: 'I/O Redirections & Pipelines (stdin, stdout, stderr, tee)',
        titleFr: 'Redirections d\'E/S & Tubes (stdin, stdout, stderr, tee)',
        conceptTag: 'Pipes & Redirections',
        conceptTagFr: 'Redirections & Pipes',
        shortDesc: 'Master standard streams (0, 1, 2), redirect output (>, >>, 2>&1), use pipes (|), and tee.',
        shortDescFr: 'Maîtriser les flux standards (0, 1, 2), rediriger la sortie (>, 2>&1), chaîner avec | et dupliquer avec tee.',
        whyItMatters:
          'The Unix philosophy centers on chaining small tools together. Mastering stream redirection lets you log, filter, and alert in real time.',
        whyItMattersFr:
          'La puissance d\'Unix réside dans l\'assemblage de petits outils reliés par des flux. La redirection permet de consigner et filtrer en direct.',
        commands: ['> file', '>> file', '2>&1', '&> file', 'command | command', 'tee -a', '<<EOF (heredoc)'],
        codeSnippet: {
          label: 'Redirect stdout to log and stderr to both console and error file',
          labelFr: 'Séparer flux de données et flux d\'erreurs proprement',
          code: '# Run command, tee output to terminal AND append to log file:\n./run_backup.sh 2>&1 | tee -a /var/log/backup.log\n\n# Discard error output cleanly:\nfind / -name "*.conf" 2>/dev/null',
          explanation: '2>&1 merges standard error into standard output, enabling tee to record all output simultaneously.',
          explanationFr: '2>&1 fusionne l\'erreur standard dans la sortie standard pour que tee enregistre l\'ensemble.',
        },
        prodTrap:
          'Order matters! "command > file 2>&1" correctly redirects both to file, but "command 2>&1 > file" sends stderr to the terminal and only stdout to file!',
        prodTrapFr:
          'L\'ordre est crucial ! "> file 2>&1" redirige tout dans le fichier, alors que "2>&1 > file" envoie les erreurs au terminal !',
        checklist: [
          'Know stream file descriptors: 0=stdin, 1=stdout, 2=stderr',
          'Discard unwanted warnings with 2>/dev/null',
          'Use Here-Documents (cat <<EOF > file) to generate configuration files dynamically',
        ],
        checklistFr: [
          'Mémoriser les descripteurs : 0=stdin, 1=stdout, 2=stderr',
          'Supprimer les avertissements inutiles avec 2>/dev/null',
          'Utiliser les Here-Documents (<<EOF) pour générer des fichiers de conf',
        ],
        explainTopic: 'pipes',
        trainingTabAction: 'training',
      },
      {
        id: 'bash-text',
        number: 6,
        title: 'Text Processing Utilities (grep, awk, sed, cut, sort, uniq)',
        titleFr: 'Traitement de Texte Unix (grep, awk, sed, cut, sort, uniq)',
        conceptTag: 'Text Parsing',
        conceptTagFr: 'Traitement de texte',
        shortDesc: 'Extract columns with cut/awk, replace patterns with sed, and filter log files with grep.',
        shortDescFr: 'Extraire des colonnes avec cut/awk, substituer avec sed et filtrer les logs avec grep, sort et uniq.',
        whyItMatters:
          'Linux configuration and logs are 100% plain text. Being fast with awk and sed turns multi-hour log triage into a 5-second one-liner.',
        whyItMattersFr:
          'Sous Linux, tout est texte. Savoir combiner grep, awk et sed transforme une analyse de logs de 3 heures en une commande de 5 secondes.',
        commands: ['grep -E / -v', 'awk \'{print $1, $4}\'', 'sed -i \'s/old/new/g\'', 'cut -d: -f1', 'sort -n', 'uniq -c', 'wc -l'],
        codeSnippet: {
          label: 'Find top 5 offending IP addresses attacking Nginx from access log',
          labelFr: 'Extraire le top 5 des adresses IP générant des requêtes',
          code: 'awk \'{print $1}\' /var/log/nginx/access.log \\\n  | sort \\\n  | uniq -c \\\n  | sort -nr \\\n  | head -n 5',
          explanation: 'Extracts the IP from column 1, aggregates frequencies, sorts descending, and outputs the top 5.',
          explanationFr: 'Extrait l\'IP en colonne 1, compte les occurrences, trie par ordre décroissant et affiche le top 5.',
        },
        prodTrap:
          'Always test "sed \'s/foo/bar/g\' file" before adding "-i" (in-place modification), otherwise you risk overwriting your live configuration file with broken text.',
        prodTrapFr:
          'Toujours tester sed sans "-i" avant d\'appliquer la modification directe en place pour éviter d\'écraser un fichier vital.',
        checklist: [
          'Use awk for column extraction ($1, $NF, NF, NR)',
          'Use sed for search & replace: sed \'s/search/replace/g\'',
          'Combine sort | uniq -c to build frequency distribution counters',
        ],
        checklistFr: [
          'Extraire facilement des colonnes avec awk \'{print $1, $NF}\'',
          'Substituer des motifs avec sed \'s/ancien/nouveau/g\'',
          'Calculer des fréquences d\'apparition avec sort | uniq -c',
        ],
        explainTopic: 'grep',
        trainingTabAction: 'glossary',
      },
      {
        id: 'bash-regex',
        number: 7,
        title: 'Regular Expressions (Regex) in Linux Tools',
        titleFr: 'Expressions Régulières (Regex) avec grep, sed & awk',
        conceptTag: 'Pattern Matching',
        conceptTagFr: 'Regex & Motifs',
        shortDesc: 'Use anchors (^, $), character classes, quantifiers (*, +, ?), and capturing groups.',
        shortDescFr: 'Maîtriser les ancres (^, $), classes de caractères, quantificateurs (+, *, ?) et groupes de capture.',
        whyItMatters:
          'Exact string searches fail when searching dynamic server patterns (IP addresses, timestamps, UUIDs, error codes). Regex makes searches resilient.',
        whyItMattersFr:
          'Rechercher une chaîne exacte échoue face à des formats dynamiques (adresses IP, UUIDs, horodatages). La regex est indispensable.',
        commands: ['grep -E "^[0-9]+"', 'grep -v "^#"', 'sed -E \'s/(pattern)/\\1/\'', 'egrep', 'awk \'/pattern/\''],
        codeSnippet: {
          label: 'Filter configuration files stripping both comments and empty lines',
          labelFr: 'Afficher un fichier de configuration sans commentaires ni lignes vides',
          code: 'grep -Ev "^[[:space:]]*(#|;|$)" /etc/samba/smb.conf\n\n# Validate an IPv4 address pattern:\ngrep -E "^([0-9]{1,3}\\.){3}[0-9]{1,3}$" /tmp/ip.txt',
          explanation: 'Removes all lines that start with spaces followed by #, ;, or line end ($), leaving only active directives.',
          explanationFr: 'Élimine d\'un coup toutes les lignes commentées ou blanches, ne laissant que la configuration active.',
        },
        prodTrap:
          'Standard basic grep (BRE) requires escaping parentheses \\( \\) and plus \\+, while extended grep (ERE: grep -E) supports them unescaped.',
        prodTrapFr:
          'En regex basique (BRE), les parenthèses doivent être échappées \\( \\). Utilisez toujours "grep -E" (ERE) pour une syntaxe standard.',
        checklist: [
          'Anchors: ^ = start of line, $ = end of line',
          'Character sets: [a-zA-Z0-9], [^0-9] (negation)',
          'Quantifiers: * (0 or more), + (1 or more), ? (0 or 1), {n,m}',
        ],
        checklistFr: [
          'Ancres : ^ pour début de ligne, $ pour fin de ligne',
          'Classes : [a-z0-9] et négation [^0-9]',
          'Quantificateurs : * (0+), + (1+), ? (0 ou 1)',
        ],
        explainTopic: 'grep',
        trainingTabAction: 'glossary',
      },
      {
        id: 'bash-advanced',
        number: 8,
        title: 'Production-Grade Scripting & Error Trapping (set -euo pipefail)',
        titleFr: 'Scripts Avancés de Production (set -euo pipefail, trap, getopts)',
        conceptTag: 'Production Hardening',
        conceptTagFr: 'Robustesse & Production',
        shortDesc: 'Enforce strict mode, parse flags with getopts, trap EXIT/signals to clean temp files, and write idempotently.',
        shortDescFr: 'Activer le mode strict, parser les arguments avec getopts, nettoyer avec trap et concevoir des scripts idempotents.',
        whyItMatters:
          'A prototype script that ignores errors will silently corrupt files when running as a headless background cron job. Production scripts must fail safely.',
        whyItMattersFr:
          'Un script qui continue malgré une erreur peut détruire des données silencieusement en tâche de fond. Le mode strict est la règle d\'or.',
        commands: ['set -euo pipefail', 'trap "cleanup" EXIT', 'getopts "f:h" opt', 'mktemp -d', 'exec > >(logger)'],
        codeSnippet: {
          label: 'The battle-tested production Bash script template',
          labelFr: 'Le template de script Bash de production standard',
          code: `#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\nTMP_DIR="$(mktemp -d)"\ncleanup() {\n  rm -rf "$TMP_DIR"\n  echo "[INFO] Temporary resources cleaned up."\n}\ntrap cleanup EXIT INT TERM\n\n# Your production logic here:`,
          explanation: 'Ensures immediate script exit on command error (-e), unset variable (-u), or pipeline failure (pipefail), and cleans temp files automatically.',
          explanationFr: 'Garantit l\'arrêt immédiat sur erreur (-e), variable non définie (-u) ou échec de pipe, et nettoie automatiquement les fichiers temporaires.',
        },
        prodTrap:
          'Without "set -o pipefail", if the first command in a pipeline fails (e.g. "broken_command | tee log.txt"), $? still reports 0 because tee succeeded!',
        prodTrapFr:
          'Sans "pipefail", si la première commande d\'un tube échoue mais que la dernière réussit, Bash renvoie 0 (succès trompeur) !',
        checklist: [
          'Always start scripts with "set -euo pipefail"',
          'Use trap cleanup EXIT to guarantee temporary directory deletion',
          'Use getopts to parse standard flags like -v, -f <file>, -h',
        ],
        checklistFr: [
          'Toujours débuter un script sérieux par "set -euo pipefail"',
          'Utiliser trap pour supprimer à coup sûr les répertoires temporaires',
          'Gérer les options en ligne de commande avec la boucle getopts',
        ],
        explainTopic: 'bash',
        trainingTabAction: 'training',
      },
    ],
  },
  {
    id: 'networking',
    emoji: '🟠',
    badgeColor: 'bg-[#b45309]/15 text-[#b45309] border-[#b45309]/30',
    themeColor: 'amber',
    bgGradient: 'from-[#b45309]/10 via-[#b45309]/5 to-transparent',
    borderColor: 'border-[#b45309]/30',
    textColor: 'text-[#b45309]',
    accentHex: '#b45309',
    title: 'Master Linux Networking',
    titleFr: 'Maîtriser Linux Networking',
    subtitle: 'From IP addressing and packet routing to SSH tunneling and production network troubleshooting',
    subtitleFr: 'De l\'adressage IP et du routage au tunneling SSH et au dépannage d\'infrastructure réseau',
    description:
      'A deep, hands-on path covering IPv4/IPv6 fundamentals, static & dynamic routing, DNS resolution mechanics, port triage, SSH bastions, firewalls (iptables/ufw), and OSI layer network diagnostics.',
    descriptionFr:
      'Un parcours approfondi sur l\'infrastructure réseau Linux : adressage IP/CIDR, tables de routage, résolution DNS, triage des ports, tunnels SSH, pare-feu et méthodologie de diagnostic de panne.',
    targetAudience: 'Network Engineers, Cloud Admins, DevOps Engineers, Backend Architects managing Linux microservices',
    targetAudienceFr: 'Ingénieurs réseau, administrateurs Cloud, DevOps et architectes manipulant des serveurs et conteneurs Linux',
    difficulty: 'Intermediate to Advanced',
    difficultyFr: 'Intermédiaire à Avancé',
    estimatedHours: 22,
    badgeEarned: {
      title: 'Certified Linux Network & Infrastructure Architect',
      titleFr: 'Architecte Réseau & Infrastructure Linux Certifié',
      icon: '🌐',
    },
    capstone: {
      title: 'Diagnose Multi-Tier Network Outage & Configure DMZ Bastion',
      titleFr: 'Diagnostiquer une panne réseau multi-niveaux et sécuriser un bastion DMZ',
      scenario:
        'Triage a simulated outage on an enterprise Linux server: resolve broken DNS resolution, configure static route forwarding, set up an encrypted SSH bastion proxy with port forwarding, and restrict firewall ingress traffic.',
      scenarioFr:
        'Résoudre une panne réseau complète sur un serveur Linux : corriger la résolution DNS défaillante, configurer une route statique, déployer un proxy bastion SSH avec rebond et restreindre le trafic entrant via le pare-feu.',
      deliverables: [
        'Diagnosis report isolating root cause (DNS vs Default Gateway vs Port block)',
        'Static IP and persistent default gateway configuration',
        'Secure SSH bastion config with key-only auth and disabled agent forwarding',
        'Minimalist firewall rule set permitting only essential traffic and rejecting invalid packets',
      ],
      deliverablesFr: [
        'Rapport de diagnostic isolant la cause racine (DNS vs Passerelle vs Pare-feu)',
        'Configuration IP statique et route par défaut persistante',
        'Bastion SSH sécurisé avec rebond (ProxyJump) et clés privées',
        'Jeu de règles pare-feu minimaliste rejetant tout trafic non sollicité',
      ],
      validationCriteria: [
        'Server successfully resolves external FQDNs and internal microservices',
        'No administrative ports exposed directly to the public internet',
        'Packet capture (tcpdump) confirms proper TCP handshakes without packet loss',
      ],
      validationCriteriaFr: [
        'Le serveur résout les noms de domaine internes et externes',
        'Aucun port d\'administration critique n\'est exposé publiquement',
        'La capture de paquets (tcpdump) confirme des poignées de main TCP saines',
      ],
    },
    steps: [
      {
        id: 'net-ip',
        number: 1,
        title: 'IP Addressing, Subnetting & Interfaces (ip addr, CIDR)',
        titleFr: 'Adressage IP, Sous-réseaux (CIDR) & Interfaces',
        conceptTag: 'Addressing & Subnets',
        conceptTagFr: 'Adressage IP & CIDR',
        shortDesc: 'Understand IPv4/IPv6, CIDR prefixes (/24, /16), private IP ranges (RFC 1918), and inspect link status.',
        shortDescFr: 'Comprendre l\'adressage IPv4/IPv6, les masques CIDR (/24, /16), les plages privées et piloter les interfaces.',
        whyItMatters:
          'Every server interaction starts with an IP address. Misunderstanding subnet boundaries leads to routing blackholes and IP conflicts.',
        whyItMattersFr:
          'Toute communication réseau repose sur l\'IP. Une mauvaise compréhension des masques CIDR engendre des conflits d\'adresses et des pertes de paquets.',
        commands: ['ip addr show', 'ip -br a', 'ip link set dev eth0 up/down', 'ethtool eth0', 'ip -6 addr'],
        codeSnippet: {
          label: 'Inspect interface link status and assign a temporary secondary IP',
          labelFr: 'Vérifier l\'interface et affecter une IP secondaire',
          code: '# Compact link and IP overview:\nip -br a\n\n# Add secondary IP for testing:\nip addr add 192.168.10.50/24 dev eth0\nip addr show dev eth0',
          explanation: 'ip -br provides clean tabular output showing interface UP/DOWN state and assigned IPv4/IPv6 addresses.',
          explanationFr: 'ip -br offre une vue synthétique des cartes réseau actives et de leurs adresses IP attribuées.',
        },
        prodTrap:
          'Changes made directly with "ip addr add" are in-memory only and will be wiped upon reboot unless written to Netplan / NetworkManager / ifcfg!',
        prodTrapFr:
          'Les commandes "ip addr add" sont volatiles et disparaissent au redémarrage si elles ne sont pas enregistrées dans Netplan ou NetworkManager !',
        checklist: [
          'Differentiate public vs private IPs (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)',
          'Calculate usable hosts in a /24 (254 hosts) vs /28 (14 hosts)',
          'Inspect physical link speed and duplex with ethtool',
        ],
        checklistFr: [
          'Identifier les plages privées RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)',
          'Calculer le nombre d\'hôtes utiles (/24 = 254 hôtes, /28 = 14 hôtes)',
          'Vérifier le lien physique (Speed, Duplex) avec ethtool',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'glossary',
      },
      {
        id: 'net-routing',
        number: 2,
        title: 'Routing & Packet Forwarding (ip route, default gateway)',
        titleFr: 'Routage & Tables de Routage (ip route, passerelle par défaut)',
        conceptTag: 'Routing & Gateway',
        conceptTagFr: 'Routage & Passerelle',
        shortDesc: 'Inspect routing tables, configure default gateways, add static routes, and enable IP forwarding.',
        shortDescFr: 'Inspecter les routes, configurer la passerelle par défaut, ajouter des routes statiques et activer le forwarding.',
        whyItMatters:
          'Without a valid default gateway, a server can only speak to machines on its immediate local subnet. Routing directs all outbound internet traffic.',
        whyItMattersFr:
          'Sans passerelle par défaut, le serveur est incapable de communiquer en dehors de son sous-réseau local.',
        commands: ['ip route show', 'ip route add', 'ip route del', 'sysctl net.ipv4.ip_forward', 'traceroute -n'],
        codeSnippet: {
          label: 'Add a static route for a private enterprise VPC subnet',
          labelFr: 'Ajouter une route statique vers un sous-réseau privé d\'entreprise',
          code: '# Inspect current routing table:\nip route show\n\n# Route 10.50.0.0/16 through internal gateway router:\nip route add 10.50.0.0/16 via 192.168.1.254 dev eth0',
          explanation: 'Tells the Linux kernel that any traffic destined for 10.50.x.x must be forwarded through gateway 192.168.1.254.',
          explanationFr: 'Indique au noyau Linux d\'acheminer les paquets vers 10.50.0.0/16 via le routeur passerelle 192.168.1.254.',
        },
        prodTrap:
          'If a multi-homed server has TWO default gateways on different NICs, packets may enter via eth0 and exit via eth1, causing firewall drops due to asymmetric routing!',
        prodTrapFr:
          'Si un serveur a deux cartes avec deux passerelles par défaut, le routage asymétrique risque de faire bloquer les paquets par les pare-feux !',
        checklist: [
          'Verify default gateway: default via <IP> dev <NIC>',
          'Understand Linux router packet forwarding (/proc/sys/net/ipv4/ip_forward)',
          'Diagnose routing hops using traceroute or mtr',
        ],
        checklistFr: [
          'Vérifier la route par défaut avec "ip route show"',
          'Comprendre le forwarding de paquets pour les VM passerelles',
          'Diagnostiquer les sauts de routage avec traceroute ou mtr',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'training',
      },
      {
        id: 'net-dns',
        number: 3,
        title: 'DNS Resolution Mechanics (/etc/resolv.conf, systemd-resolved, dig)',
        titleFr: 'Mécanismes de Résolution DNS (/etc/resolv.conf, dig, systemd-resolved)',
        conceptTag: 'DNS & Names',
        conceptTagFr: 'Résolution DNS',
        shortDesc: 'Understand the resolution pipeline, query DNS records (A, CNAME, MX) with dig, and manage systemd-resolved.',
        shortDescFr: 'Comprendre la chaîne de résolution, interroger les enregistrements (A, CNAME, MX) avec dig et configurer les résolveurs.',
        whyItMatters:
          '"It\'s always DNS!" A huge portion of reported network outages are simply failing DNS name lookups.',
        whyItMattersFr:
          '« C\'est toujours le DNS ! » Une immense majorité des pannes réseau perçues provient simplement d\'un problème de résolution de nom.',
        commands: ['dig +short', 'dig @8.8.8.8 domain A', 'resolvectl status', 'nslookup', 'host', 'cat /etc/resolv.conf', 'cat /etc/hosts'],
        codeSnippet: {
          label: 'Perform deep DNS triage isolating root cause',
          labelFr: 'Effectuer un diagnostic DNS complet en isolant le résolveur',
          code: '# Test system default resolver:\ndig example.com +noall +answer\n\n# Bypass local resolver and test Google DNS directly:\ndig @8.8.8.8 example.com +short\n\n# Inspect systemd-resolved configuration:\nresolvectl status',
          explanation: 'Bypassing the local resolver verifies whether the network connection works and isolates local resolver failure.',
          explanationFr: 'Interroger directement un DNS public externe permet de savoir si la panne vient du résolveur local ou de la connectivité générale.',
        },
        prodTrap:
          'Editing /etc/resolv.conf directly on modern Ubuntu/Debian will be overwritten on reboot or DHCP renewal because it is managed by systemd-resolved!',
        prodTrapFr:
          'Modifier directement /etc/resolv.conf sur les distributions modernes est écrasé au redémarrage car le fichier est géré par systemd-resolved.',
        checklist: [
          'Understand the priority order in /etc/nsswitch.conf (hosts: files dns)',
          'Query specific record types: dig domain MX / AAAA / TXT',
          'Flush local DNS cache with resolvectl flush-caches',
        ],
        checklistFr: [
          'Comprendre l\'ordre de priorité défini dans /etc/nsswitch.conf (files avant dns)',
          'Interroger des types précis d\'enregistrements (A, AAAA, MX, CNAME, TXT)',
          'Vider le cache DNS local avec resolvectl flush-caches',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'glossary',
      },
      {
        id: 'net-ports',
        number: 4,
        title: 'Ports, Sockets & Transport Layer (TCP vs UDP, ss, netstat)',
        titleFr: 'Ports, Sockets & Protocoles de Transport (TCP vs UDP, ss, nc)',
        conceptTag: 'Sockets & Ports',
        conceptTagFr: 'Ports & Sockets',
        shortDesc: 'Differentiate TCP (connection-oriented) and UDP (stateless), inspect listening ports with ss, and probe with netcat.',
        shortDescFr: 'Différencier TCP (avec connexion) et UDP, inspecter les ports en écoute avec ss et tester avec netcat.',
        whyItMatters:
          'When an application fails to connect, you must immediately determine: Is the service listening on 0.0.0.0 or 127.0.0.1? Is the port blocked?',
        whyItMattersFr:
          'Quand une application ne répond pas, il faut savoir immédiatement : le démon écoute-t-il sur 127.0.0.1 (local seul) ou 0.0.0.0 (toutes interfaces) ?',
        commands: ['ss -tulpn', 'ss -s', 'nc -zv host port', 'lsof -i :80', 'curl -v telnet://host:port'],
        codeSnippet: {
          label: 'Test if a remote TCP port is open without installing nmap',
          labelFr: 'Tester si un port TCP distant est ouvert avec netcat',
          code: '# Test port 443 with 3-second timeout:\nnc -z -v -w 3 database.internal 5432\n\n# Or using pure Bash virtual device file:\ntimeout 3 bash -c "cat < /dev/tcp/database.internal/5432" && echo "OPEN" || echo "CLOSED"',
          explanation: 'Netcat or the built-in /dev/tcp device test the full TCP 3-way handshake quickly without full protocol overhead.',
          explanationFr: 'Netcat et le pseudo-périphérique /dev/tcp de Bash testent le handshake TCP sans nécessiter d\'outils lourds.',
        },
        prodTrap:
          'Binding a service to "127.0.0.1:8080" makes it accessible ONLY from localhost! To accept remote connections, it must bind to "0.0.0.0:8080" or the specific NIC IP.',
        prodTrapFr:
          'Lier un service à "127.0.0.1" le rend invisible de l\'extérieur ! Pour accepter les connexions distantes, il doit écouter sur 0.0.0.0.',
        checklist: [
          'Inspect all listening TCP and UDP sockets with ss -tulpn',
          'Understand common ports: 22 (SSH), 53 (DNS), 80/443 (HTTP/S), 3306 (MySQL), 5432 (Postgres)',
          'Check socket state statistics with ss -s',
        ],
        checklistFr: [
          'Inspecter tous les sockets en écoute avec ss -tulpn',
          'Mémoriser les ports standards : 22 (SSH), 53 (DNS), 80/443 (Web), 3306/5432 (BDD)',
          'Comprendre les états TCP (LISTEN, ESTABLISHED, TIME_WAIT)',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'training',
      },
      {
        id: 'net-ssh',
        number: 5,
        title: 'SSH Architecture, Keys, Bastions & Tunnels (ssh, sshd, config)',
        titleFr: 'Architecture SSH, Clés, Tunnels & Bastions (~/.ssh/config)',
        conceptTag: 'SSH & Tunnels',
        conceptTagFr: 'SSH & Tunneling',
        shortDesc: 'Configure SSH client configs, jump hosts (bastions), local (-L) & remote (-R) port forwarding, and keys.',
        shortDescFr: 'Maîtriser ~/.ssh/config, les rebonds par bastion (ProxyJump), les clés ED25519 et le tunneling de ports.',
        whyItMatters:
          'SSH is the universal secure administrative transport. Tunnels allow accessing private databases behind firewalls without VPNs.',
        whyItMattersFr:
          'SSH est le protocole d\'administration universel. Les tunnels permettent d\'accéder à des bases de données privées sans monter de VPN lourd.',
        commands: ['ssh-keygen -t ed25519', 'ssh -J bastion target', 'ssh -L 8080:localhost:80', 'ssh -R', '~/.ssh/config'],
        codeSnippet: {
          label: 'Local port forwarding tunnel to access private database securely',
          labelFr: 'Tunnel de redirection de port local pour joindre une BDD privée',
          code: '# Forward local port 5432 through remote bastion to private database:\nssh -N -L 5432:db-internal.vpc:5432 user@bastion.example.com\n\n# Now connect your local GUI client to localhost:5432!',
          explanation: 'Encrypts all traffic through the SSH connection to the bastion, which forwards packets to the internal database.',
          explanationFr: 'Chiffre tout le trafic à travers la session SSH vers le bastion, qui relaie les paquets vers la base privée en toute sécurité.',
        },
        prodTrap:
          'Permissions on ~/.ssh must be 700 and ~/.ssh/id_* private keys must be 600. SSH will reject connections with "Permissions are too open" if keys are world-readable.',
        prodTrapFr:
          'Les clés privées ~/.ssh/id_* doivent obligatoirement avoir les droits 600 et ~/.ssh 700, sous peine de refus catégorique par le client SSH.',
        checklist: [
          'Create elegant shortcuts in ~/.ssh/config with Host, HostName, User, IdentityFile',
          'Use ProxyJump to transparently traverse jumpbox / bastion servers',
          'Understand Local Port Forwarding (-L) vs Remote Port Forwarding (-R)',
        ],
        checklistFr: [
          'Structurer son fichier ~/.ssh/config pour se connecter en 1 mot clé',
          'Utiliser ProxyJump pour traverser les bastions de façon transparente',
          'Distinguer le tunnel local (-L local:remote:port) et le tunnel inverse (-R)',
        ],
        explainTopic: 'ssh',
        trainingTabAction: 'glossary',
      },
      {
        id: 'net-firewall',
        number: 6,
        title: 'Linux Firewalls & Packet Filtering (ufw, iptables, nftables)',
        titleFr: 'Pare-feu Linux & Filtrage de Paquets (ufw, iptables, nftables)',
        conceptTag: 'Firewall & Filtering',
        conceptTagFr: 'Pare-feu & Filtrage',
        shortDesc: 'Understand the three default chains (INPUT, OUTPUT, FORWARD), configure UFW rules, and NAT masquerading.',
        shortDescFr: 'Comprendre les chaînes INPUT/OUTPUT/FORWARD, configurer UFW et les règles de translation NAT.',
        whyItMatters:
          'A firewall is the outermost defense line. It guarantees that only explicitly permitted services receive incoming traffic.',
        whyItMattersFr:
          'Le pare-feu est la première ligne de défense : il garantit que seuls les services explicitement autorisés reçoivent du trafic.',
        commands: ['ufw status verbose', 'ufw allow 22/tcp', 'ufw default deny incoming', 'iptables -L -n -v', 'nft list ruleset'],
        codeSnippet: {
          label: 'Configure a clean, secure default-deny firewall policy with UFW',
          labelFr: 'Politique pare-feu sécurisée par défaut avec UFW',
          code: '# Default deny incoming, allow outgoing:\nufw default deny incoming\nufw default allow outgoing\n\n# Allow SSH and Web:\nufw allow 22/tcp comment "SSH Admin"\nufw allow 80/tcp comment "HTTP"\nufw allow 443/tcp comment "HTTPS"\n\n# Enable firewall:\nufw enable',
          explanation: 'Blocks all incoming connection attempts by default while permitting necessary web and administrative traffic.',
          explanationFr: 'Refuse par défaut toute connexion entrante non sollicitée et n\'ouvre que les ports indispensables.',
        },
        prodTrap:
          'Docker bypasses UFW by default! It injects iptables NAT rules that expose container ports directly to the internet unless configured specifically.',
        prodTrapFr:
          'Docker court-circuite UFW par défaut en injectant ses propres règles iptables, exposant des conteneurs à votre insu si non configuré !',
        checklist: [
          'Understand the three packet traversal chains: INPUT, OUTPUT, FORWARD',
          'Know how stateful connection tracking works (ESTABLISHED, RELATED)',
          'Check active rules with iptables -L -n -v or nft list ruleset',
        ],
        checklistFr: [
          'Comprendre les chaînes fondamentales : INPUT, OUTPUT, FORWARD',
          'Comprendre le suivi d\'état (ESTABLISHED, RELATED)',
          'Vérifier les règles actives avec iptables -L -n -v ou ufw status verbose',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'training',
      },
      {
        id: 'net-troubleshooting',
        number: 7,
        title: 'Methodical Network Troubleshooting & Packet Capture',
        titleFr: 'Dépannage Réseau Méthodique & Capture de Paquets (tcpdump, mtr)',
        conceptTag: 'Network Diagnostics',
        conceptTagFr: 'Diagnostic Réseau',
        shortDesc: 'Apply systematic Layer 1-7 troubleshooting, capture packets with tcpdump, and diagnose latency with mtr.',
        shortDescFr: 'Appliquer une méthode de triage par couches OSI (1 à 7), capturer des trames avec tcpdump et isoler la latence avec mtr.',
        whyItMatters:
          'When production is down and the CEO asks why, guessing wastes time. A systematic network engineer diagnoses the exact layer within 2 minutes.',
        whyItMattersFr:
          'En pleine panne de production, deviner au hasard fait perdre un temps précieux. Une méthode de diagnostic par couche isole la cause en 2 minutes.',
        commands: ['ping', 'traceroute / mtr', 'tcpdump -i eth0 -nn', 'curl -Iv', 'ss -s', 'dmesg | grep -i eth'],
        codeSnippet: {
          label: 'Capture live HTTP/DNS traffic with tcpdump to diagnose drops',
          labelFr: 'Capturer le trafic en direct pour repérer les rejets de paquets',
          code: '# Capture DNS queries in real-time:\ntcpdump -i any -nn port 53\n\n# Capture TCP SYN flags (connection attempts) on port 80/443:\ntcpdump -i eth0 -nn "tcp[tcpflags] & (tcp-syn) != 0 and port 443"',
          explanation: 'Captures and displays timestamps, IP addresses, and TCP flag states without performing reverse DNS resolution.',
          explanationFr: 'Capture les trames brutes sur l\'interface sans ralentissement de résolution DNS (-nn) pour observer les négociations TCP.',
        },
        prodTrap:
          'Ping (ICMP) success does not mean HTTP works! Many firewalls permit ICMP while dropping TCP port 80/443, or vice-versa.',
        prodTrapFr:
          'Ce n\'est pas parce que ping répond que le service fonctionne ! De nombreux pare-feux autorisent ICMP mais bloquent le port applicatif.',
        checklist: [
          'Execute the 5-step triage: Link (ethtool) -> IP (ip a) -> Route (ip r) -> DNS (dig) -> Port (nc/curl)',
          'Diagnose packet loss vs latency using interactive mtr',
          'Read tcpdump output (SYN, ACK, FIN, RST)',
        ],
        checklistFr: [
          'Exécuter le triage en 5 étapes : Lien -> IP -> Passerelle -> DNS -> Port applicatif',
          'Distinguer perte de paquets et latence avec mtr',
          'Interpréter les indicateurs tcpdump (SYN, ACK, RST)',
        ],
        explainTopic: 'networking',
        trainingTabAction: 'training',
      },
    ],
  },
];

// Helper functions for user progress persistence in localStorage
const STORAGE_PREFIX = 'thematic_path_progress_';

export function getThematicPathProgress(pathId: string): string[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${pathId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read thematic path progress', e);
  }
  return [];
}

export function saveThematicPathProgress(pathId: string, completedStepIds: string[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${pathId}`, JSON.stringify(completedStepIds));
    window.dispatchEvent(new CustomEvent('thematic_path_updated', { detail: { pathId, completedStepIds } }));
  } catch (e) {
    console.error('Failed to save thematic path progress', e);
  }
}

export function toggleThematicPathStep(pathId: string, stepId: string): string[] {
  const current = getThematicPathProgress(pathId);
  const next = current.includes(stepId) ? current.filter((id) => id !== stepId) : [...current, stepId];
  saveThematicPathProgress(pathId, next);
  return next;
}

export function resetThematicPathProgress(pathId: string): void {
  saveThematicPathProgress(pathId, []);
}

export function markAllThematicPathSteps(pathId: string): string[] {
  const path = thematicLearningPaths.find((p) => p.id === pathId);
  if (!path) return [];
  const allIds = path.steps.map((s) => s.id);
  saveThematicPathProgress(pathId, allIds);
  return allIds;
}
