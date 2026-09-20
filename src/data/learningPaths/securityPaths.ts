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
   SÉCURITÉ LINUX (3 PARCOURS)
   ========================================================================== */

const secCoreModules: PathModule[] = [
  createModule({
    id: 'sec-1-least-priv',
    number: 1,
    title: 'Principle of Least Privilege & Account Hygiene',
    titleFr: 'Principe du Moindre Privilège & Hygiène des Comptes',
    conceptTag: 'Least Privilege',
    conceptTagFr: 'Moindre Privilège',
    shortDesc: 'Password policies, expiring inactive accounts, disabling shell access for service daemons (/sbin/nologin), and sudo lockdown.',
    shortDescFr: 'Politique de mots de passe, expiration des comptes inactifs, désactivation du shell (/sbin/nologin) et sudo.',
    linkedLpiObjective: '107.1',
    explainTopic: 'security',
    glossaryTerms: ['passwd', 'chage', 'usermod', 'visudo', 'faillock'],
    theory: {
      summary: 'The principle of least privilege ensures users and applications possess only the minimal set of rights required to perform their function. Service accounts must never possess interactive login shells.',
      summaryFr: 'Le principe du moindre privilège garantit qu\'utilisateurs et démons ne possèdent que les droits strictement nécessaires. Les comptes de services ne doivent jamais avoir de shell de connexion.',
      whyItMatters: 'If a web application is compromised, an unprivileged daemon account prevents the attacker from gaining interactive shell access or reading other users\' files.',
      whyItMattersFr: 'Si une application web est compromise, un compte de service restreint empêche l\'attaquant d\'obtenir un shell ou d\'accéder aux données d\'autres utilisateurs.',
      commands: ['chage -l username', 'usermod -s /sbin/nologin svc_app', 'passwd -l baduser', 'visudo'],
      codeSnippet: {
        label: 'Locking Down a Daemon Service User',
        labelFr: 'Verrouillage d\'un compte utilisateur de service',
        code: 'useradd -r -s /usr/sbin/nologin -d /var/empty -M -c "Nginx Worker Daemon" nginx_service\npasswd -l nginx_service',
        explanation: 'Creates a system account (-r) without home directory (-M), shell set to nologin, and locks its password hash.',
        explanationFr: 'Crée un compte système sans dossier personnel, avec shell nologin et mot de passe verrouillé.',
      },
      prodTrap: 'Leaving an administrative test user with a blank or weak password in `/etc/shadow` creates an immediate backdoor.',
      prodTrapFr: 'Laisser un compte de test ou temporaire avec un mot de passe faible dans `/etc/shadow` ouvre une porte dérobée immédiate.',
    },
    flashcards: [
      {
        id: 'fc-sec-1',
        question: 'Which shell executable is assigned to daemon accounts to prevent any interactive login attempts?',
        questionFr: 'Quel shell est assigné aux comptes applicatifs pour bloquer toute connexion interactive ?',
        answer: '/usr/sbin/nologin (or /bin/false)',
        answerFr: '/usr/sbin/nologin (ou /bin/false)',
        examTip: '/sbin/nologin displays a friendly rejection message; /bin/false exits immediately with code 1.',
        examTipFr: '/sbin/nologin affiche un message de rejet; /bin/false quitte immédiatement.',
      }
    ],
    question: {
      id: 'q-sec-1',
      question: 'Which command displays the password expiration and account aging policy for user `developer`?',
      questionFr: 'Quelle commande affiche la politique d\'expiration et de validité du mot de passe pour l\'utilisateur `developer` ?',
      options: ['chage -l developer', 'passwd -e developer', 'shadow -l developer', 'usermod -v developer'],
      optionsFr: ['chage -l developer', 'passwd -e developer', 'shadow -l developer', 'usermod -v developer'],
      correctIndex: 0,
      explanation: '`chage -l` lists account aging details: last password change, expiration date, inactive warning period, and min/max password age.',
      explanationFr: '`chage -l` détaille la date du dernier changement, l\'expiration et les délais d\'inactivité.',
      commandSnippet: 'sudo chage -l developer',
    },
    lab: {
      id: 'lab-sec-1',
      title: 'Enforcing Password Expiration with chage',
      titleFr: 'Application d\'une politique d\'expiration de mot de passe',
      goal: 'Configure maximum password age to 90 days with 7-day warning period for user operator.',
      goalFr: 'Configurer l\'âge maximal du mot de passe à 90 jours avec alerte 7 jours avant expiration.',
      context: 'You are applying corporate security compliance rules.',
      contextFr: 'Vous appliquez les règles de conformité de sécurité de l\'entreprise.',
      steps: [
        {
          stepNumber: 1,
          title: 'Set max age and warning with chage',
          titleFr: 'Définir la durée max et l\'avertissement avec chage',
          instruction: 'Execute chage setting max days to 90 and warning to 7.',
          instructionFr: 'Exécutez chage avec -M 90 et -W 7 sur l\'utilisateur operator.',
          hint: 'chage -M 90 -W 7 operator',
          hintFr: 'chage -M 90 -W 7 operator',
          expectedCommands: ['chage -M 90 -W 7 operator', 'sudo chage -M 90 -W 7 operator'],
          simulatedOutput: '',
          explanation: 'Updates `/etc/shadow` fields to enforce 90-day password cycling.',
          explanationFr: 'Met à jour `/etc/shadow` pour imposer le renouvellement tous les 90 jours.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-sec-1',
      title: 'Account Locked Out by faillock / pam_tally2',
      titleFr: 'Compte bloqué après plusieurs tentatives infructueuses',
      symptom: 'A user with correct password cannot log in: "Account locked due to 5 failed logins".',
      symptomFr: 'Un utilisateur avec le bon mot de passe ne peut plus se connecter : "Account locked".',
      investigationCommands: ['faillock --user developer'],
      diagnosticOutput: 'developer:\nWhen                Type  Source  Valid\n2025-09-20 10:15:02 TTY   /dev/tty1 V\n2025-09-20 10:15:08 TTY   /dev/tty1 V',
      rootCause: 'PAM module `pam_faillock` locked the account following repeated incorrect password attempts.',
      rootCauseFr: 'Le module PAM `pam_faillock` a verrouillé le compte suite à des saisies erronées répétées.',
      solutionCommand: 'sudo faillock --user developer --reset',
      solutionExplanation: 'Run `faillock --user <username> --reset` to clear the failed authentication counter.',
      solutionExplanationFr: 'Exécutez `faillock --user <nom> --reset` pour remettre à zéro le compteur de tentatives.',
    }
  })
];

export const securityLearningPaths: LearningPath[] = [
  // 1. Sécurité Linux
  {
    id: 'sec-fundamentals',
    category: 'security',
    emoji: '🔐',
    title: 'Linux Security Foundations',
    titleFr: 'Sécurité Linux',
    subtitle: 'Utilisateurs → Permissions → sudo → SSH → Logs → Mises à jour → Moindre privilège.',
    subtitleFr: 'Utilisateurs → Permissions → sudo → SSH → Logs → Mises à jour → Moindre privilège.',
    description: 'The definitive foundation in Linux defensive security: strict user access controls, file permission audits, sudo restriction, SSH key governance, authentication log inspection, automated patching, and least-privilege architectures.',
    descriptionFr: 'Le socle indispensable de la sécurité défensive Linux : contrôle strict des comptes, audit des permissions, délégations sudo minimales, accès SSH par clés, analyse des logs d\'authentification et patchs de sécurité.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 18,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    themeColor: 'emerald',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    accentHex: '#059669',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    objectives: [
      'Enforce password aging and lock service accounts with `/sbin/nologin`',
      'Audit world-writable and rogue SUID files across filesystems',
      'Configure sudo with granular command authorizations without shell escapes',
      'Deploy SSH key-only authentication and disable root login',
      'Monitor `/var/log/auth.log` or secure journald for brute force attempts'
    ],
    objectivesFr: [
      'Appliquer l\'expiration des mots de passe et désactiver les shells de service',
      'Auditer les fichiers en écriture universelle et les binaires SUID non autorisés',
      'Configurer des règles sudo restreintes sans échappement de shell',
      'Bannir l\'accès root et les mots de passe SSH au profit des clés ED25519',
      'Surveiller `/var/log/auth.log` pour détecter les attaques par force brute'
    ],
    prerequisites: ['Linux System Administration foundations'],
    prerequisitesFr: ['Bases solides de l\'administration Linux'],
    modules: secCoreModules,
    steps: secCoreModules,
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Access Control & Sudo',
      titleFr: 'Évaluation intermédiaire : Contrôle d\'Accès & Sudo',
      description: 'Validate understanding of password aging, service shells, and sudo restrictions.',
      descriptionFr: 'Valider la gestion des comptes, des shells et des droits sudo.',
      passingScorePct: 75,
      questions: [secCoreModules[0].question]
    },
    finalEvaluation: {
      title: 'Security Foundations Capstone: Node Lockdown & Audit',
      titleFr: 'Projet final : Verrouillage & Audit d\'un Nœud Linux',
      scenario: 'Audit a newly provisioned server: lock inactive accounts, audit and strip unauthorized SUID binaries, restrict sudoers configuration, enforce SSH ED25519 keys, and setup log alerting for auth failures.',
      scenarioFr: 'Auditer un serveur nouvellement livré : verrouiller les comptes inactifs, supprimer les bits SUID injustifiés, restreindre sudoers, imposer les clés SSH ED25519 et configurer des alertes sur les échecs d\'authentification.',
      deliverables: [
        'All service accounts verified with shell set to `/usr/sbin/nologin`',
        'Zero world-writable files in system directories',
        'SSH configured with `PasswordAuthentication no` and `PermitRootLogin no`'
      ],
      deliverablesFr: [
        'Tous les comptes de service vérifiés avec shell nologin',
        'Zéro fichier en écriture universelle dans les répertoires système',
        'SSH configuré sans mot de passe et sans accès direct en root'
      ],
      validationCriteria: [
        'Attempted password login over SSH is rejected immediately',
        'visudo validates sudoers drop-in files without warnings'
      ],
      validationCriteriaFr: [
        'Toute tentative de connexion par mot de passe SSH est rejetée',
        'Les règles sudoers sont validées par `visudo -c`'
      ]
    },
    capstone: {
      title: 'Security Foundations Capstone: Node Lockdown & Audit',
      titleFr: 'Projet final : Verrouillage & Audit d\'un Nœud Linux',
      scenario: 'Audit a newly provisioned server: lock inactive accounts, audit and strip unauthorized SUID binaries, restrict sudoers configuration, enforce SSH ED25519 keys, and setup log alerting for auth failures.',
      scenarioFr: 'Auditer un serveur nouvellement livré : verrouiller les comptes inactifs, supprimer les bits SUID injustifiés, restreindre sudoers, imposer les clés SSH ED25519 et configurer des alertes sur les échecs d\'authentification.',
      deliverables: [
        'All service accounts verified with shell set to `/usr/sbin/nologin`',
        'Zero world-writable files in system directories',
        'SSH configured with `PasswordAuthentication no` and `PermitRootLogin no`'
      ],
      deliverablesFr: [
        'Tous les comptes de service vérifiés avec shell nologin',
        'Zéro fichier en écriture universelle dans les répertoires système',
        'SSH configuré sans mot de passe et sans accès direct en root'
      ],
      validationCriteria: [
        'Attempted password login over SSH is rejected immediately',
        'visudo validates sudoers drop-in files without warnings'
      ],
      validationCriteriaFr: [
        'Toute tentative de connexion par mot de passe SSH est rejetée',
        'Les règles sudoers sont validées par `visudo -c`'
      ]
    },
    badgeEarned: {
      title: 'Linux Defensive Security Certified',
      titleFr: 'Certifié Sécurité Défensive Linux',
      icon: '🔐'
    }
  },

  // 2. Hardening Linux
  {
    id: 'sec-hardening',
    category: 'security',
    emoji: '🛡️',
    title: 'Linux System Hardening & Compliance',
    titleFr: 'Hardening Linux',
    subtitle: 'SSH durci → Firewall & Ports fermés → Services inutiles → Permissions sensibles → Audit (Lynis) → Journalisation.',
    subtitleFr: 'SSH durci → Firewall & Ports fermés → Services inutiles → Permissions sensibles → Audit (Lynis) → Journalisation.',
    description: 'Enterprise CIS-benchmark server hardening: SSH crypto suites, closing unused ports with nftables/ufw, masking unneeded systemd units, filesystem mount hardening (nodev, nosuid, noexec), auditd rule deployment, and Lynis security auditing.',
    descriptionFr: 'Durcissement industriel selon les standards CIS : cryptographie SSH moderne, fermeture des ports, masquage des services inutiles, durcissement des montages (nodev, nosuid, noexec), auditd et audits automatisés avec Lynis.',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedHours: 22,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
    themeColor: 'amber',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    accentHex: '#d97706',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    objectives: [
      'Harden `/etc/ssh/sshd_config` with modern Ciphers, KexAlgorithms, and MACs',
      'Close unnecessary listening sockets and mask dormant systemd services',
      'Enforce filesystem mount flags (`nodev`, `nosuid`, `noexec`) on `/tmp` and `/var/tmp`',
      'Deploy kernel audit framework rules (`auditd`) tracking file modifications',
      'Run Lynis security scans and remediate compliance findings'
    ],
    objectivesFr: [
      'Durcir sshd avec des suites cryptographiques modernes (Kex, MACs, Ciphers)',
      'Fermer les ports inutiles et masquer les services dormants',
      'Appliquer les options de montage sécurisées (nodev, nosuid, noexec) sur `/tmp`',
      'Déployer des règles de surveillance auditd sur les fichiers sensibles',
      'Exécuter des audits Lynis et corriger les vulnérabilités détectées'
    ],
    prerequisites: ['Linux Security Foundations'],
    prerequisitesFr: ['Bases de la sécurité Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: SSH Ciphers & Mount Hardening',
      titleFr: 'Évaluation intermédiaire : SSH Ciphers & Montages durcis',
      description: 'Test modern crypto parameters and mount security options.',
      descriptionFr: 'Tester les paramètres cryptographiques et les options de montage.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Hardening Capstone: Lynis CIS Compliance 85+ Benchmark',
      titleFr: 'Projet final : Atteindre un score Lynis 85+ selon le benchmark CIS',
      scenario: 'Execute a full hardening procedure on a standard Linux node: configure modern crypto for SSH, isolate `/tmp` with secure flags, deploy auditd rules for `/etc/passwd` and `/etc/shadow`, configure fail2ban, and pass a Lynis compliance scan with score > 85.',
      scenarioFr: 'Appliquer une procédure complète de durcissement sur un serveur : cryptographie SSH moderne, isolation de `/tmp`, règles auditd sur `/etc/shadow`, fail2ban et obtention d\'un score Lynis supérieur à 85.',
      deliverables: [
        'Lynis compliance audit report showing score >= 85',
        'Active auditd rules logging `/etc/passwd` and `/etc/shadow` changes',
        'Fail2ban service active and monitoring SSH attempts'
      ],
      deliverablesFr: [
        'Rapport d\'audit Lynis avec score de conformité supérieur ou égal à 85',
        'Règles auditd actives surveillant les modifications sur `/etc/shadow`',
        'Service fail2ban actif protégeant le port SSH'
      ],
      validationCriteria: [
        'Zero high-severity warnings in Lynis scan',
        'SSH daemon passes ssh-audit without legacy crypto findings'
      ],
      validationCriteriaFr: [
        'Aucun avertissement de sévérité haute dans le rapport Lynis',
        'Validation par ssh-audit sans algorithmes dépréciés'
      ]
    },
    capstone: {
      title: 'Hardening Capstone: Lynis CIS Compliance 85+ Benchmark',
      titleFr: 'Projet final : Atteindre un score Lynis 85+ selon le benchmark CIS',
      scenario: 'Execute a full hardening procedure on a standard Linux node: configure modern crypto for SSH, isolate `/tmp` with secure flags, deploy auditd rules for `/etc/passwd` and `/etc/shadow`, configure fail2ban, and pass a Lynis compliance scan with score > 85.',
      scenarioFr: 'Appliquer une procédure complète de durcissement sur un serveur : cryptographie SSH moderne, isolation de `/tmp`, règles auditd sur `/etc/shadow`, fail2ban et obtention d\'un score Lynis supérieur à 85.',
      deliverables: [
        'Lynis compliance audit report showing score >= 85',
        'Active auditd rules logging `/etc/passwd` and `/etc/shadow` changes',
        'Fail2ban service active and monitoring SSH attempts'
      ],
      deliverablesFr: [
        'Rapport d\'audit Lynis avec score de conformité supérieur ou égal à 85',
        'Règles auditd actives surveillant les modifications sur `/etc/shadow`',
        'Service fail2ban actif protégeant le port SSH'
      ],
      validationCriteria: [
        'Zero high-severity warnings in Lynis scan',
        'SSH daemon passes ssh-audit without legacy crypto findings'
      ],
      validationCriteriaFr: [
        'Aucun avertissement de sévérité haute dans le rapport Lynis',
        'Validation par ssh-audit sans algorithmes dépréciés'
      ]
    },
    badgeEarned: {
      title: 'Linux Hardening & Compliance Architect',
      titleFr: 'Architecte Hardening & Conformité Linux',
      icon: '🛡️'
    }
  },

  // 3. Sécurité et dépannage
  {
    id: 'sec-incident',
    category: 'security',
    emoji: '🚨',
    title: 'Security Incident Response & Forensic Triage',
    titleFr: 'Sécurité et dépannage',
    subtitle: 'Détection anomalie → Analyse des logs → Processus suspects → Connexions actives → Remédiation.',
    subtitleFr: 'Détection anomalie → Analyse des logs → Processus suspects → Connexions actives → Remédiation.',
    description: 'Hands-on incident response: detecting anomalies, analyzing authentication and audit logs, hunting hidden rogue processes / cryptominers, tracking suspicious network connections (ss, lsof), and containing compromises.',
    descriptionFr: 'Réponse à incident sur le terrain : détection d\'anomalies, analyse forensique des logs, traque de processus cachés et mineurs de cryptomonnaie, inspection des connexions suspectes (ss, lsof) et remédiation.',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedHours: 20,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-300',
    themeColor: 'rose',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    accentHex: '#e11d48',
    bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
    objectives: [
      'Perform forensic analysis on authentication logs (`/var/log/auth.log`)',
      'Identify and isolate malicious hidden processes and cryptominers',
      'Correlate open network sockets with running binaries via `ss` and `lsof`',
      'Eradicate persistence mechanisms (malicious cron jobs, systemd timers, authorized_keys)'
    ],
    objectivesFr: [
      'Réaliser l\'analyse forensique des logs d\'authentification (`/var/log/auth.log`)',
      'Identifier et isoler les processus malveillants cachés',
      'Corréler les sockets réseau ouverts avec les binaires correspondants via `ss` et `lsof`',
      'Éradiquer les mécanismes de persistance (crontabs masquées, clés SSH pirates)'
    ],
    prerequisites: ['Linux Security Foundations & Hardening'],
    prerequisitesFr: ['Bases solides en sécurité et processus Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Triage Commands & Sockets',
      titleFr: 'Évaluation intermédiaire : Commandes de Triage & Sockets',
      description: 'Test correlation of PIDs with network sockets and open files.',
      descriptionFr: 'Tester la corrélation entre sockets réseau et processus.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Incident Response Capstone: Live Compromise Eradication',
      titleFr: 'Projet final : Traque & Éradication d\'une intrusion en direct',
      scenario: 'A server alert flags 100% CPU usage and outbound connections to an unknown external IP. Triage the system: isolate the malicious miner process, identify how it was launched, remove its persistence mechanisms, and restore safe operations.',
      scenarioFr: 'Une alerte remonte un CPU à 100% et des connexions vers une IP suspecte. Diagnostiquer : isoler le processus pirate, identifier son vecteur d\'entrée, supprimer ses persistances (cron, authorized_keys) et rétablir le service.',
      deliverables: [
        'Identification of malicious process PID, binary path, and parent process',
        'Removal of malicious cron job in `/var/spool/cron/crontabs`',
        'Sanitized `~/.ssh/authorized_keys` file'
      ],
      deliverablesFr: [
        'Identification du PID, du binaire pirate et de son processus parent',
        'Suppression de la tâche cron malveillante',
        'Nettoyage des clés SSH non autorisées dans `authorized_keys`'
      ],
      validationCriteria: [
        'CPU utilization returns to baseline < 5%',
        'No rogue outbound connections observed in `ss -tupn`'
      ],
      validationCriteriaFr: [
        'Utilisation CPU revenue à la normale (< 5%)',
        'Aucune connexion sortante anormale observée'
      ]
    },
    capstone: {
      title: 'Incident Response Capstone: Live Compromise Eradication',
      titleFr: 'Projet final : Traque & Éradication d\'une intrusion en direct',
      scenario: 'A server alert flags 100% CPU usage and outbound connections to an unknown external IP. Triage the system: isolate the malicious miner process, identify how it was launched, remove its persistence mechanisms, and restore safe operations.',
      scenarioFr: 'Une alerte remonte un CPU à 100% et des connexions vers une IP suspecte. Diagnostiquer : isoler le processus pirate, identifier son vecteur d\'entrée, supprimer ses persistances (cron, authorized_keys) et rétablir le service.',
      deliverables: [
        'Identification of malicious process PID, binary path, and parent process',
        'Removal of malicious cron job in `/var/spool/cron/crontabs`',
        'Sanitized `~/.ssh/authorized_keys` file'
      ],
      deliverablesFr: [
        'Identification du PID, du binaire pirate et de son processus parent',
        'Suppression de la tâche cron malveillante',
        'Nettoyage des clés SSH non autorisées dans `authorized_keys`'
      ],
      validationCriteria: [
        'CPU utilization returns to baseline < 5%',
        'No rogue outbound connections observed in `ss -tupn`'
      ],
      validationCriteriaFr: [
        'Utilisation CPU revenue à la normale (< 5%)',
        'Aucune connexion sortante anormale observée'
      ]
    },
    badgeEarned: {
      title: 'Linux Incident Response Specialist',
      titleFr: 'Spécialiste Réponse à Incident Linux',
      icon: '🚨'
    }
  }
];
