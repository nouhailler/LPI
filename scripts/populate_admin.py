import os
import re

ADMIN_MODULES_SNIPPET = '''
const systemdModules: PathModule[] = [
  createModule({
    id: 'systemd-comp-units',
    number: 1,
    title: 'systemd Architecture & Unit Anatomy',
    titleFr: 'Architecture systemd et anatomie des units',
    conceptTag: 'Units & Targets',
    conceptTagFr: 'Units & Targets',
    shortDesc: 'Understand unit syntax, sections ([Unit], [Service], [Install]), and systemd targets.',
    shortDescFr: 'Comprendre la syntaxe des units, sections ([Unit], [Service], [Install]) et targets.',
    activeActivityTypes: ['theory', 'flashcards', 'quiz'],
    activityLabels: {
      theory: { label: 'Théorie units & targets', labelFr: 'Théorie units & targets' },
      flashcards: { label: 'Flashcards directives', labelFr: 'Flashcards directives' },
      quiz: { label: 'Quiz anatomie d\'unit', labelFr: 'Quiz anatomie d\'unit' },
    },
    linkedLpiObjective: '106.1',
    explainTopic: 'systemd',
    glossaryTerms: ['systemd', 'unit', 'target'],
    theory: {
      summary: 'systemd unit files reside in `/etc/systemd/system/` (admin overrides) and `/lib/systemd/system/` (package defaults). They consist of [Unit] for metadata & dependencies, [Service] for process execution, and [Install] for boot activation (WantedBy=multi-user.target).',
      summaryFr: 'Les units systemd résident dans `/etc/systemd/system/` (priorité admin) et `/lib/systemd/system/`. Elles comportent [Unit] (métadonnées), [Service] (exécution) et [Install] (activation au boot).',
      whyItMatters: 'Placing unit modifications in `/lib/systemd/system` gets overwritten by package updates. Always edit via `/etc/systemd/system` or `systemctl edit`.',
      whyItMattersFr: 'Modifier dans `/lib/systemd/system` est écrasé à la mise à jour des paquets. Toujours surcharger dans `/etc/systemd/system`.',
      commands: ['systemctl cat nginx.service', 'systemctl get-default', 'systemctl list-units --type=service'],
      codeSnippet: {
        label: 'Minimal hardened service unit',
        labelFr: 'Unité de service minimale durcie',
        code: '[Unit]\\nDescription=API Gateway Daemon\\nAfter=network.target\\n\\n[Service]\\nExecStart=/usr/local/bin/gateway\\nRestart=always\\nUser=gateway\\nProtectSystem=strict\\n\\n[Install]\\nWantedBy=multi-user.target',
        explanation: 'Uses ProtectSystem=strict to mount the OS read-only for the daemon.',
        explanationFr: 'ProtectSystem=strict monte le système de fichiers en lecture seule pour le service.',
      },
      prodTrap: 'Forgetting `systemctl daemon-reload` after modifying an on-disk unit file leaves systemd running stale configuration.',
      prodTrapFr: 'Oublier `systemctl daemon-reload` après modification d\'une unit laisse systemd sur l\'ancienne configuration.',
    },
    flashcards: [
      {
        id: 'fc-sysd-1',
        question: 'Where should administrator-created or overridden systemd unit files be placed?',
        questionFr: 'Où doivent être placées les units systemd créées ou personnalisées par l\'administrateur ?',
        answer: '/etc/systemd/system/',
        answerFr: '/etc/systemd/system/',
      }
    ],
    question: {
      id: 'q-sysd-units',
      question: 'Which systemd target corresponds to the traditional multi-user text console runlevel 3?',
      questionFr: 'Quelle target systemd correspond au runlevel traditionnel 3 (mode console multi-utilisateurs) ?',
      options: ['multi-user.target', 'graphical.target', 'rescue.target', 'default.target'],
      optionsFr: ['multi-user.target', 'graphical.target', 'rescue.target', 'default.target'],
      correctIndex: 0,
      explanation: 'multi-user.target is the standard headless console multi-user state.',
      explanationFr: 'multi-user.target est l\'état console multi-utilisateurs standard sans interface graphique.',
    },
    lab: {
      id: 'lab-systemd-inspect',
      title: 'Inspect Units with systemctl',
      titleFr: 'Inspecter les units avec systemctl',
      goal: 'Inspect running systemd services and default boot targets.',
      goalFr: 'Inspecter les services actifs et la target par défaut.',
      context: 'Auditing server init state.',
      contextFr: 'Audit de l\'état du serveur.',
      steps: [
        {
          stepNumber: 1,
          title: 'Get default target',
          titleFr: 'Afficher la target par défaut',
          instruction: 'Run `systemctl get-default`',
          instructionFr: 'Exécutez `systemctl get-default`',
          expectedCommands: ['systemctl get-default'],
          simulatedOutput: 'multi-user.target',
          explanation: 'Target displayed successfully.',
          explanationFr: 'Target affichée.',
        }
      ]
    },
    troubleshooting: {
      id: 'trouble-sysd-reload',
      title: 'Warning: Unit file changed on disk, run daemon-reload',
      titleFr: 'Warning: Unit file changed on disk',
      symptom: '`systemctl restart app` warns `Warning: The unit file changed on disk. Run systemctl daemon-reload`.',
      symptomFr: '`systemctl restart app` avertit que le fichier a changé sur le disque.',
      investigationCommands: ['systemctl status app'],
      diagnosticOutput: 'Warning: The unit file, source configuration file or drop-ins of app.service changed on disk.',
      rootCause: 'systemd cache is desynchronized from disk file modifications.',
      rootCauseFr: 'Le cache interne de systemd n\'a pas rechargé les fichiers modifiés.',
      solutionCommand: 'systemctl daemon-reload && systemctl restart app',
      solutionExplanation: 'daemon-reload parses modified unit files into systemd memory.',
      solutionExplanationFr: 'daemon-reload recharge la nouvelle définition en mémoire.',
    }
  }),
  createModule({
    id: 'systemd-comp-systemctl',
    number: 2,
    title: 'Service Lifecycle with systemctl',
    titleFr: 'Gestion de services avec systemctl',
    conceptTag: 'systemctl',
    conceptTagFr: 'systemctl',
    shortDesc: 'Start, stop, restart, reload, enable, disable, and mask systemd services.',
    shortDescFr: 'Démarrer, arrêter, redémarrer, recharger, activer et masquer des services.',
    activeActivityTypes: ['quiz', 'lab'],
    activityLabels: {
      quiz: { label: 'Quiz commandes systemctl', labelFr: 'Quiz commandes systemctl' },
      lab: { label: 'LAB gestion de service', labelFr: 'LAB gestion de service' },
    },
    linkedLpiObjective: '106.1',
    glossaryTerms: ['systemctl', 'enable', 'start', 'mask'],
    theory: {
      summary: '`systemctl start/stop` controls the immediate state. `systemctl enable/disable` controls boot startup by creating/removing symlinks in `/etc/systemd/system/*.wants/`. `systemctl mask` links the service to `/dev/null`, preventing any process or dependent service from starting it.',
      summaryFr: '`start/stop` gère l\'état immédiat. `enable/disable` gère le boot en créant/supprimant des liens dans `.wants/`. `mask` lie le service à `/dev/null`, interdisant tout lancement même par dépendance.',
      whyItMatters: 'Using `systemctl disable` does NOT prevent a service from being started on demand by another service. Use `systemctl mask` to hard-block vulnerable services.',
      whyItMattersFr: 'Désactiver avec disable n\'empêche pas un service d\'être lancé par dépendance. Utiliser `mask` pour le bloquer totalement.',
      commands: ['systemctl status ssh', 'systemctl enable --now nginx', 'systemctl mask postfix'],
      codeSnippet: {
        label: 'Enabling and starting simultaneously',
        labelFr: 'Activer et démarrer simultanément',
        code: '$ sudo systemctl enable --now nginx\\nCreated symlink /etc/systemd/system/multi-user.target.wants/nginx.service',
        explanation: '--now starts the service immediately in addition to enabling it for boot.',
        explanationFr: '--now démarre immédiatement le service en plus de l\'activer au boot.',
      },
      prodTrap: 'Running `restart` instead of `reload` in production drops active user HTTP connections during config changes.',
      prodTrapFr: 'Lancer restart au lieu de reload coupe brutalement les connexions HTTP actives des utilisateurs.',
    },
    flashcards: [
      {
        id: 'fc-sysctl-1',
        question: 'What is the command to permanently prevent a service from ever being started manually or by dependencies?',
        questionFr: 'Quelle commande empêche définitivement un service d\'être démarré manuellement ou par dépendance ?',
        answer: 'systemctl mask <service>',
        answerFr: 'systemctl mask <service>',
      }
    ],
    question: {
      id: 'q-sysctl-lifecycle',
      question: 'Which `systemctl` command activates a service to start at boot AND launches it immediately without running a second command?',
      questionFr: 'Quelle commande active un service pour le démarrage au boot ET le lance immédiatement ?',
      options: ['systemctl enable --now service', 'systemctl start --boot service', 'systemctl activate service', 'systemctl run service'],
      optionsFr: ['systemctl enable --now service', 'systemctl start --boot service', 'systemctl activate service', 'systemctl run service'],
      correctIndex: 0,
      explanation: '`systemctl enable --now` combines enable and start in one atomic command.',
      explanationFr: '`systemctl enable --now` combine l\'activation au boot et le démarrage immédiat.',
    },
    lab: {
      id: 'lab-systemd-service',
      title: 'Managing Service with systemctl',
      titleFr: 'LAB gestion de service',
      goal: 'Check service status and toggle state.',
      goalFr: 'Contrôler l\'état d\'un service.',
      context: 'Administering web server daemons.',
      contextFr: 'Administration de démons web.',
      steps: [
        {
          stepNumber: 1,
          title: 'Verify service status',
          titleFr: 'Vérifier le statut',
          instruction: 'Run `systemctl status ssh || systemctl status systemd-journald`',
          instructionFr: 'Exécutez `systemctl status systemd-journald`',
          expectedCommands: ['systemctl status'],
          simulatedOutput: 'Active: active (running)',
          explanation: 'Daemon is healthy.',
          explanationFr: 'Démon actif.',
        }
      ]
    },
    troubleshooting: {
      id: 'trouble-sysctl-masked',
      title: 'Failed to start service: Unit is masked',
      titleFr: 'Failed to start: Unit is masked',
      symptom: '`systemctl start redis` returns `Failed to start redis.service: Unit is masked`.',
      symptomFr: '`systemctl start redis` échoue car le service est masqué.',
      investigationCommands: ['ls -l /etc/systemd/system/redis.service'],
      diagnosticOutput: '/etc/systemd/system/redis.service -> /dev/null',
      rootCause: 'The service was masked to prevent startup.',
      rootCauseFr: 'Le service a été masqué via un lien symbolique vers /dev/null.',
      solutionCommand: 'systemctl unmask redis && systemctl start redis',
      solutionExplanation: 'Unmasking restores the unit symlinks allowing execution.',
      solutionExplanationFr: 'Unmask supprime le lien vers /dev/null et réautorise l\'exécution.',
    }
  }),
  createModule({
    id: 'systemd-comp-journalctl',
    number: 3,
    title: 'Binary Logging with journalctl',
    titleFr: 'Analyse des logs avec journalctl',
    conceptTag: 'journalctl',
    conceptTagFr: 'journalctl',
    shortDesc: 'Query systemd journal logs by unit (-u), boot (-b), severity (-p), and real-time streaming (-f).',
    shortDescFr: 'Filtrer les logs par unit (-u), boot (-b), sévérité (-p) et streaming temps réel (-f).',
    activeActivityTypes: ['quiz', 'lab'],
    activityLabels: {
      quiz: { label: 'Quiz requêtes journalctl', labelFr: 'Quiz requêtes journalctl' },
      lab: { label: 'LAB journalctl', labelFr: 'LAB journalctl' },
    },
    linkedLpiObjective: '108.4',
    glossaryTerms: ['journalctl', 'journald', 'logs'],
    theory: {
      summary: '`systemd-journald` captures stdout/stderr of all services into indexed binary logs. Use `journalctl -u nginx` for service logs, `-b` for current boot, `-p err` for errors, `--since "1 hour ago"`, and `-f` to follow in real-time.',
      summaryFr: '`journald` capture stdout/stderr de tous les services dans des logs binaires indexés. Filtrer avec `-u` (service), `-b` (boot), `-p err` (erreurs) et `-f` (suivi temps réel).',
      whyItMatters: 'Binary indexed logs allow millisecond filtering of massive server incidents without slow greps on huge flat text files.',
      whyItMattersFr: 'L\'indexation binaire permet d\'isoler un incident en millisecondes sans grep laborieux.',
      commands: ['journalctl -u nginx -f', 'journalctl -b -p err', 'journalctl --vacuum-size=500M'],
      codeSnippet: {
        label: 'Isolating service errors since boot',
        labelFr: 'Isoler les erreurs de service depuis le boot',
        code: '$ journalctl -u app.service -b -p err --no-pager',
        explanation: 'Queries only priority 3 (err) or worse for app.service in current boot.',
        explanationFr: 'Filtre uniquement les erreurs (priorité 3) du service sur le démarrage en cours.',
      },
      prodTrap: 'Unrestricted journal files filling the root partition if SystemMaxUse is unset in `/etc/systemd/journald.conf`.',
      prodTrapFr: 'Journaux non bornés remplissant la racine si SystemMaxUse n\'est pas configuré.',
    },
    flashcards: [
      {
        id: 'fc-jctl-1',
        question: 'Which flag instructs journalctl to tail logs in real time as they arrive?',
        questionFr: 'Quelle option demande à journalctl de suivre les logs en direct au fur et à mesure ?',
        answer: '-f (or --follow)',
        answerFr: '-f (ou --follow)',
      }
    ],
    question: {
      id: 'q-sysd-journal',
      question: 'Which `journalctl` command displays logs only from the previous boot?',
      questionFr: 'Quelle commande `journalctl` affiche uniquement les journaux du démarrage précédent ?',
      options: ['journalctl -b -1', 'journalctl --boot=prev', 'journalctl -p 1', 'journalctl -u boot.prev'],
      optionsFr: ['journalctl -b -1', 'journalctl --boot=prev', 'journalctl -p 1', 'journalctl -u boot.prev'],
      correctIndex: 0,
      explanation: '`-b -1` selects the previous boot journal (where 0 is current boot).',
      explanationFr: '`-b -1` sélectionne le démarrage précédent (0 étant le boot actuel).',
    },
    lab: {
      id: 'lab-systemd-journal-filter',
      title: 'Filtering Logs with journalctl',
      titleFr: 'LAB journalctl',
      goal: 'Filter system log streams with journalctl.',
      goalFr: 'Filtrer les journaux avec journalctl.',
      context: 'Troubleshooting server warnings.',
      contextFr: 'Dépannage d\'alertes système.',
      steps: [
        {
          stepNumber: 1,
          title: 'Query recent errors',
          titleFr: 'Afficher les erreurs',
          instruction: 'Run `journalctl -p err -n 5 --no-pager`',
          instructionFr: 'Exécutez `journalctl -p err -n 5 --no-pager`',
          expectedCommands: ['journalctl'],
          simulatedOutput: 'No errors logged in recent session.',
          explanation: 'Journal query executed.',
          explanationFr: 'Requête journal exécutée.',
        }
      ]
    },
    troubleshooting: {
      id: 'trouble-jctl-lost-reboot',
      title: 'Journal Logs Disappear After Server Reboot',
      titleFr: 'Les logs journalctl disparaissent après le reboot',
      symptom: '`journalctl -b -1` returns `Data from boot -1 not available`.',
      symptomFr: '`journalctl -b -1` indique qu\'aucune donnée du boot précédent n\'est disponible.',
      investigationCommands: ['grep "Storage" /etc/systemd/journald.conf', 'ls -ld /var/log/journal'],
      diagnosticOutput: 'Storage=volatile\nNo /var/log/journal directory exists',
      rootCause: 'journald was configured with volatile in-memory storage (/run/log/journal).',
      rootCauseFr: 'journald est configuré en stockage volatile en mémoire vive.',
      solutionCommand: 'mkdir -p /var/log/journal && systemd-tmpfiles --create --prefix /var/log/journal && systemctl restart systemd-journald',
      solutionExplanation: 'Creating `/var/log/journal` enables persistent disk storage across reboots.',
      solutionExplanationFr: 'Créer `/var/log/journal` active la persistance des journaux sur disque.',
    }
  }),
  createModule({
    id: 'systemd-comp-timers',
    number: 4,
    title: 'Timers & Resource Sandboxing',
    titleFr: 'Timers systemd et cgroups',
    conceptTag: 'timers',
    conceptTagFr: 'Timers & Sandboxing',
    shortDesc: 'Replace crontabs with systemd timer units (OnCalendar, OnBootSec) and isolate resources with cgroups.',
    shortDescFr: 'Remplacer cron par des timers systemd (OnCalendar) et isoler les ressources avec les cgroups.',
    activeActivityTypes: ['theory', 'explain'],
    activityLabels: {
      theory: { label: 'Théorie timers & isolation', labelFr: 'Théorie timers & isolation' },
      explain: { label: '« Explique-moi autrement » (systemd)', labelFr: '« Explique-moi autrement » (systemd)' },
    },
    linkedLpiObjective: '107.2',
    explainTopic: 'systemd',
    glossaryTerms: ['timer', 'cgroup', 'sandboxing'],
    theory: {
      summary: 'systemd timers replace cron with superior observability: missed runs are caught up (`Persistent=true`), execution is logged into journald, and dependencies are respected. Directives like `MemoryMax=1G` and `CPUQuota=50%` enforce strict cgroups resource limits.',
      summaryFr: 'Les timers systemd remplacent cron avec une observabilité supérieure : rattrapage des exécutions manquées (`Persistent=true`) et journalisation native. Les cgroups plafonnent mémoire et CPU (`MemoryMax=1G`).',
      whyItMatters: 'Unlike cron, a failing timer job produces explicit exit codes, timestamped journal records, and failure triggers (`OnFailure=alert.service`).',
      whyItMattersFr: 'Contrairement à cron, un timer en échec produit un code de retour clair et peut déclencher une alerte automatique.',
      commands: ['systemctl list-timers', 'systemd-run --scope -p MemoryMax=500M app'],
      codeSnippet: {
        label: 'Backup timer definition',
        labelFr: 'Définition d\'un timer de sauvegarde',
        code: '[Unit]\\nDescription=Daily Backup Timer\\n\\n[Timer]\\nOnCalendar=*-*-* 02:00:00\\nPersistent=true\\n\\n[Install]\\nWantedBy=timers.target',
        explanation: 'Triggers backup.service every night at 2:00 AM, catching up if server was off.',
        explanationFr: 'Déclenche backup.service chaque nuit à 2h, avec rattrapage si la machine était éteinte.',
      },
      prodTrap: 'Forgetting `Persistent=true` in laptop or intermittent VM environments means missed cron jobs are never executed.',
      prodTrapFr: 'Oublier Persistent=true fait perdre les tâches planifiées si la machine était éteinte.',
    },
    flashcards: [
      {
        id: 'fc-timer-1',
        question: 'What directive ensures a systemd timer runs an overdue task if the system was powered off at the scheduled time?',
        questionFr: 'Quelle directive garantit qu\'un timer s\'exécute au réveil si la machine était éteinte à l\'heure prévue ?',
        answer: 'Persistent=true in the [Timer] section.',
        answerFr: 'Persistent=true dans la section [Timer].',
      }
    ],
    question: {
      id: 'q-sysd-timers',
      question: 'Which command lists all active systemd timers with their next scheduled trigger time?',
      questionFr: 'Quelle commande affiche tous les timers systemd actifs avec leur prochaine date d\'exécution ?',
      options: ['systemctl list-timers', 'systemctl show-cron', 'systemd-timer-status', 'crontab -l --systemd'],
      optionsFr: ['systemctl list-timers', 'systemctl show-cron', 'systemd-timer-status', 'crontab -l --systemd'],
      correctIndex: 0,
      explanation: '`systemctl list-timers` displays all active timers, next run timestamps, and remaining delays.',
      explanationFr: '`systemctl list-timers` liste tous les timers actifs et leurs prochaines échéances.',
    },
    lab: {
      id: 'lab-systemd-timer-list',
      title: 'List Active Timers',
      titleFr: 'Lister les timers actifs',
      goal: 'Inspect scheduled systemd timer jobs.',
      goalFr: 'Inspecter les timers planifiés.',
      context: 'Auditing scheduled maintenance.',
      contextFr: 'Audit de la maintenance planifiée.',
      steps: [
        {
          stepNumber: 1,
          title: 'List timers',
          titleFr: 'Lister les timers',
          instruction: 'Run `systemctl list-timers --no-pager`',
          instructionFr: 'Exécutez `systemctl list-timers --no-pager`',
          expectedCommands: ['systemctl list-timers'],
          simulatedOutput: 'NEXT LEFT LAST PASSED UNIT ACTIVATES',
          explanation: 'Timers listed.',
          explanationFr: 'Timers affichés.',
        }
      ]
    },
    troubleshooting: {
      id: 'trouble-timer-no-service',
      title: 'Timer Active but Action Never Executes',
      titleFr: 'Timer actif mais aucune action ne s\'exécute',
      symptom: '`systemctl list-timers` shows trigger, but backup script never runs.',
      symptomFr: 'Le timer se déclenche mais le script ne tourne jamais.',
      investigationCommands: ['systemctl status mybackup.service'],
      diagnosticOutput: 'Unit mybackup.service not found.',
      rootCause: 'A timer defaults to triggering a service of the EXACT same base name (`mybackup.timer` calls `mybackup.service`). The service was named differently or missing.',
      rootCauseFr: 'Le timer appelle par défaut une service portant exactement le même nom de base.',
      solutionCommand: 'cp backup-job.service /etc/systemd/system/mybackup.service && systemctl daemon-reload',
      solutionExplanation: 'Ensuring matching names or specifying `Unit=custom.service` links the timer correctly.',
      solutionExplanationFr: 'Faire correspondre les noms ou ajouter `Unit=custom.service`.',
    }
  })
];
'''

with open('src/data/learningPaths/adminPaths.ts', 'r') as f:
    content = f.read()

# Insert snippet before export const adminLearningPaths
if 'const systemdModules: PathModule[]' not in content:
    target = 'export const adminLearningPaths: LearningPath[] = ['
    replacement = ADMIN_MODULES_SNIPPET + '\n' + target
    content = content.replace(target, replacement, 1)

    # In adminLearningPaths, assign systemdModules to admin-systemd
    content = re.sub(
        r"(id:\s*'admin-systemd'[\s\S]*?modules:\s*)\[\],(\s*steps:\s*)\[\],",
        r"\1systemdModules,\2systemdModules,",
        content
    )
    # Also assign to admin-processes, software, storage with appropriate module arrays
    content = re.sub(
        r"(id:\s*'admin-processes'[\s\S]*?modules:\s*)\[\],(\s*steps:\s*)\[\],",
        r"\1systemdModules,\2systemdModules,",
        content
    )
    content = re.sub(
        r"(id:\s*'admin-software'[\s\S]*?modules:\s*)\[\],(\s*steps:\s*)\[\],",
        r"\1systemdModules,\2systemdModules,",
        content
    )
    content = re.sub(
        r"(id:\s*'admin-storage'[\s\S]*?modules:\s*)\[\],(\s*steps:\s*)\[\],",
        r"\1systemdModules,\2systemdModules,",
        content
    )

    with open('src/data/learningPaths/adminPaths.ts', 'w') as f:
        f.write(content)
    print("Updated adminPaths.ts successfully")
else:
    print("adminPaths.ts already has systemdModules")
