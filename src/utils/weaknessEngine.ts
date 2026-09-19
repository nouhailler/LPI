import {
  WeaknessDomainId,
  WeaknessDomainStats,
  WeaknessEngineReport,
  WeaknessSubtopicMetric,
  WeaknessQuestionDetail,
  PracticeQuestion
} from '../types';

export const WEAKNESS_STORAGE_KEY = 'lpi_weakness_engine_data_v2';
export const WEAKNESS_EVENTS_KEY = 'lpi_weakness_events_v2';

/**
 * Jeu de données initial conforme aux besoins de l'élève LPIC :
 * 🔥 Mes faiblesses
 * - Networking: 41% (12 erreurs : 7 DNS, 3 Routing, 2 IPv6)
 * - Shell scripting: 48% (9 erreurs : 4 Boucles/tests, 3 sed/awk, 2 Quoting)
 * - Security: 53% (7 erreurs : 3 SELinux, 2 SUID/SGID, 2 SSH)
 * - Filesystems: 67% (4 erreurs : 2 fstab, 1 Inodes, 1 LVM)
 * - Commands: 82% (2 erreurs : 1 xargs/find, 1 redirection)
 */
export const INITIAL_WEAKNESS_REPORT: WeaknessEngineReport = {
  overallHealthPct: 58,
  totalErrors: 34,
  totalLuckyGuesses: 10,
  totalSkipped: 11,
  totalFailedLabs: 4,
  untestedTopicsCount: 3,
  lastUpdated: new Date().toISOString(),
  domains: [
    // 1. NETWORKING (41%)
    {
      id: 'networking',
      name: 'Networking Fundamentals',
      nameFr: 'Réseau & Protocoles (Networking)',
      masteryPct: 41,
      totalErrors: 12,
      luckyGuessesCount: 3,
      skippedCount: 4,
      failedLabsCount: 2,
      untestedSubtopicsCount: 1,
      timeSpentAvgSeconds: 114, // Hésitation très prononcée (> 90s)
      status: 'critical',
      whyWeakExplanation:
        'Networking is your primary critical bottleneck (41% mastery). You frequently struggle with client-side DNS lookup delegation (/etc/resolv.conf and systemd-resolved 127.0.0.53), default route gateways via "ip route", and IPv6 CIDR prefix masking.',
      whyWeakExplanationFr:
        'Le réseau est votre principal point critique (41% de maîtrise). Vous trébuchez fréquemment sur la délégation de résolution DNS (/etc/resolv.conf et systemd-resolved 127.0.0.53), les passerelles par défaut via "ip route", et la notation des préfixes IPv6.',
      subtopics: [
        {
          id: 'dns',
          name: 'DNS Resolution & Name Services',
          nameFr: 'Résolution DNS & Stub Resolver',
          errorsCount: 7,
          luckyGuessesCount: 2,
          skippedCount: 2,
          descriptionFr: 'systemd-resolved, stub 127.0.0.53, /etc/resolv.conf, dig vs nslookup, /etc/nsswitch.conf'
        },
        {
          id: 'routing',
          name: 'Routing Tables & Gateways',
          nameFr: 'Tables de Routage & Passerelles',
          errorsCount: 3,
          luckyGuessesCount: 1,
          skippedCount: 1,
          descriptionFr: 'ip route add default via, tables de routage du noyau, ping passerelle'
        },
        {
          id: 'ipv6',
          name: 'IPv6 Addressing & Autoconfig',
          nameFr: 'Adressage & Masques IPv6',
          errorsCount: 2,
          luckyGuessesCount: 0,
          skippedCount: 1,
          descriptionFr: 'Adresses link-local fe80::/10, compression de zéros, SLAAC'
        }
      ],
      commonPitfalls: [
        'Confusing local stub resolver (127.0.0.53) with public DNS upstream servers.',
        'Using deprecated "route add" syntax instead of standard "ip route add default via <IP> dev <IF>".',
        'Forgetting that IPv6 link-local addresses (fe80::) require an explicit interface scope (%eth0).'
      ],
      commonPitfallsFr: [
        'Confondre le stub resolver local (127.0.0.53) avec les résolveurs récursifs externes.',
        'Utiliser la syntaxe obsolète "route add" au lieu du standard moderne "ip route add default via <IP> dev <IF>".',
        'Oublier que les adresses IPv6 link-local (fe80::) exigent la spécification de l\'interface (%eth0).'
      ],
      recommendedAction:
        'Focus on DNS client troubleshooting (Incident 07), practice "ip route" manipulation and review IPv6 address types.',
      recommendedActionFr:
        'Concentrez-vous sur le dépannage client DNS (Scénario d\'incident 07), manipulez "ip route" et révisez les préfixes IPv6.',
      targetObjectiveIds: ['109.1', '109.2', '109.3', '109.4'],
      sampleMistakes: [
        {
          id: 'net-q1',
          question: 'Which file configures the local DNS nameserver stub resolver in modern systemd-based Linux?',
          questionFr: 'Quel fichier ou adresse est utilisé par systemd-resolved pour le stub resolver DNS local ?',
          category: 'Networking',
          subtopic: 'DNS',
          correctAnswer: '127.0.0.53 in /etc/resolv.conf (pointing to /run/systemd/resolve/stub-resolv.conf)',
          explanation: 'systemd-resolved listens on local loopback 127.0.0.53:53 and caches lookups.',
          explanationFr: 'systemd-resolved écoute sur la boucle locale 127.0.0.53:53 et met en cache les requêtes.',
          mistakeReasonFr: 'Vous aviez sélectionné /etc/hosts au lieu de l\'adresse stub 127.0.0.53.'
        },
        {
          id: 'net-q2',
          question: 'What is the modern iproute2 command to define 192.168.1.1 as the default gateway on eth0?',
          questionFr: 'Quelle commande iproute2 moderne définit 192.168.1.1 comme passerelle par défaut sur eth0 ?',
          category: 'Networking',
          subtopic: 'Routing',
          correctAnswer: 'ip route add default via 192.168.1.1 dev eth0',
          explanation: 'The modern command is "ip route add default via <IP> dev <IF>", replacing legacy "route add default gw".',
          explanationFr: 'La commande standard est "ip route add default via <IP> dev <IF>", remplaçant "route add default gw".',
          mistakeReasonFr: 'Temps passé > 110s, confusion avec la syntaxe ifconfig/route.'
        },
        {
          id: 'net-q3',
          question: 'What scope do IPv6 addresses starting with fe80:: belong to?',
          questionFr: 'À quelle portée appartiennent les adresses IPv6 débutant par fe80:: ?',
          category: 'Networking',
          subtopic: 'IPv6',
          correctAnswer: 'Link-Local Unicast (fe80::/10)',
          explanation: 'fe80::/10 is link-local, non-routable beyond the local broadcast segment.',
          explanationFr: 'fe80::/10 correspond aux adresses lien-local, non routables au-delà du commutateur local.',
          mistakeReasonFr: 'Question sautée lors de la dernière session d\'examen 102.'
        }
      ]
    },

    // 2. SHELL SCRIPTING (48%)
    {
      id: 'scripting',
      name: 'Shells & Shell Scripting',
      nameFr: 'Scripts Shell & Automatisation',
      masteryPct: 48,
      totalErrors: 9,
      luckyGuessesCount: 4,
      skippedCount: 3,
      failedLabsCount: 1,
      untestedSubtopicsCount: 1,
      timeSpentAvgSeconds: 98,
      status: 'critical',
      whyWeakExplanation:
        'Shell scripting requires solid grasp of syntax edge-cases (48% mastery). Main vulnerabilities are compound conditionals in Bash ([[ vs [), regex grouping in sed/awk, and double vs single quote expansion.',
      whyWeakExplanationFr:
        'Les scripts Bash présentent des pièges de syntaxe récurrents (48% de maîtrise). Vous perdez des points sur les tests conditionnels ([[ vs [), le groupement regex dans sed/awk et l\'échappement des variables entre quotes.',
      subtopics: [
        {
          id: 'loops_conditions',
          name: 'Loops & Test Conditionals',
          nameFr: 'Boucles & Tests ([[ vs [)',
          errorsCount: 4,
          luckyGuessesCount: 2,
          skippedCount: 1,
          descriptionFr: 'Syntaxe test, [ vs [[, conditions -eq vs ==, opérateurs -z et -n'
        },
        {
          id: 'sed_awk',
          name: 'Stream Editing (sed & awk)',
          nameFr: 'Édition de flux sed & awk',
          errorsCount: 3,
          luckyGuessesCount: 1,
          skippedCount: 1,
          descriptionFr: 'sed -E s/regex/remp/g, awk -F":" {print $1, $3}, filtres de texte'
        },
        {
          id: 'quoting',
          name: 'Quoting & Variable Expansion',
          nameFr: 'Expansion de variables & Quotes',
          errorsCount: 2,
          luckyGuessesCount: 1,
          skippedCount: 1,
          descriptionFr: '"$VAR" (expansion) vs \'$VAR\' (littéral), backticks vs $(), heredocs'
        }
      ],
      commonPitfalls: [
        'Using "==" inside single brackets "[" where only "=" is POSIX compliant, or using -eq for strings.',
        'Forgetting that single quotes (\'...\') suppress ALL variable expansions, including $PATH or $USER.',
        'Missing the -i flag or using unescaped delimiters in sed expressions.'
      ],
      commonPitfallsFr: [
        'Utiliser "==" dans de simples crochets "[" alors que seul "=" est POSIX, ou utiliser -eq pour comparer des chaînes.',
        'Oublier que les guillemets simples (\'...\') désactivent TOUTES les expansions de variables ($VAR).',
        'Oublier l\'option -i ou mal gérer les séparateurs / dans les remplacements sed.'
      ],
      recommendedAction:
        'Complete the Troubleshooting challenges on Bash syntax and practice the Fill-In-The-Blank regex exercises.',
      recommendedActionFr:
        'Faites les ateliers Troubleshooting sur la syntaxe Bash et révisez les exercices Fill-in-the-blank sur sed/awk.',
      targetObjectiveIds: ['105.1', '105.2'],
      sampleMistakes: [
        {
          id: 'scr-q1',
          question: 'Which test checks if the variable $LOGFILE is non-empty?',
          questionFr: 'Quel test conditionnel vérifie si la variable $LOGFILE n\'est PAS vide ?',
          category: 'Shell Scripting',
          subtopic: 'Loops & Conditions',
          correctAnswer: '[ -n "$LOGFILE" ]',
          explanation: '-n checks string length is nonzero, whereas -z checks string is zero-length.',
          explanationFr: '-n vérifie que la chaîne n\'est pas vide (longueur non nulle), tandis que -z vérifie si elle est vide.',
          mistakeReasonFr: 'Confusion entre -n (non-vide) et -z (zéro longueur).'
        },
        {
          id: 'scr-q2',
          question: 'How to print the 1st and 3rd colon-separated columns from /etc/passwd using awk?',
          questionFr: 'Comment afficher la 1ère et la 3ème colonne de /etc/passwd séparées par des deux-points avec awk ?',
          category: 'Shell Scripting',
          subtopic: 'sed & awk',
          correctAnswer: 'awk -F: \'{print $1, $3}\' /etc/passwd',
          explanation: '-F: specifies the colon field separator and $1, $3 represent columns.',
          explanationFr: '-F: définit le délimiteur deux-points et $1, $3 ciblent les colonnes 1 et 3.',
          mistakeReasonFr: 'Sélection d\'une réponse avec cut -d sans -f.'
        }
      ]
    },

    // 3. SECURITY (53%)
    {
      id: 'security',
      name: 'Security & Hardening',
      nameFr: 'Sécurité & Durcissement Système',
      masteryPct: 53,
      totalErrors: 7,
      luckyGuessesCount: 2,
      skippedCount: 2,
      failedLabsCount: 1,
      untestedSubtopicsCount: 0,
      timeSpentAvgSeconds: 88,
      status: 'moderate',
      whyWeakExplanation:
        'Security posture is fragile (53% mastery). You frequently trip over SELinux contexts, SUID/SGID bit arithmetic, and SSH key authentication permissions.',
      whyWeakExplanationFr:
        'La posture sécurité est fragile (53% de maîtrise). Vous trébuchez sur les contextes SELinux (AVC denials), l\'arithmétique octale des bits SUID/SGID et les permissions strictes des clés SSH.',
      subtopics: [
        {
          id: 'selinux',
          name: 'SELinux Contexts & AVC',
          nameFr: 'Contextes SELinux & Audits AVC',
          errorsCount: 3,
          luckyGuessesCount: 1,
          skippedCount: 1,
          descriptionFr: 'restorecon, chcon, audit.log, ls -Z, semanage fcontext'
        },
        {
          id: 'suid_sgid',
          name: 'Special Permissions (SUID/SGID/Sticky)',
          nameFr: 'Permissions Spéciales SUID/SGID/Sticky',
          errorsCount: 2,
          luckyGuessesCount: 1,
          skippedCount: 0,
          descriptionFr: 'chmod 4755, chmod 2775, chmod 1777, find -perm -4000'
        },
        {
          id: 'ssh_hardening',
          name: 'SSH Keys & Config Hardening',
          nameFr: 'Clés SSH & Durcissement sshd',
          errorsCount: 2,
          luckyGuessesCount: 0,
          skippedCount: 1,
          descriptionFr: 'chmod 700 ~/.ssh, chmod 600 authorized_keys, PermitRootLogin'
        }
      ],
      commonPitfalls: [
        'Moving a file into /var/www with "mv" preserves its old source SELinux context instead of inheriting httpd_sys_content_t.',
        'Setting overly loose permissions on ~/.ssh or authorized_keys (sshd refuses keys if group/others have write access).',
        'Confusing SUID (runs as owner, 4000) with SGID (runs as group/inherits group, 2000).'
      ],
      commonPitfallsFr: [
        'Déplacer un fichier avec "mv" conserve l\'ancien contexte SELinux au lieu d\'hériter du type cible httpd_sys_content_t.',
        'Laisser des permissions trop permissives sur ~/.ssh (sshd rejette les clés si le groupe ou others a le droit d\'écriture).',
        'Confondre SUID (exécution sous l\'identité du propriétaire, 4000) et SGID (héritage du groupe sur les dossiers, 2000).'
      ],
      recommendedAction:
        'Review Incident 13 (SELinux AVC Denial) and practice octal chmod permissions for SUID/SGID.',
      recommendedActionFr:
        'Révisez le scénario d\'incident 13 (SELinux) et entraînez-vous sur les calculs octaux SUID/SGID.',
      targetObjectiveIds: ['110.1', '110.2', '110.3'],
      sampleMistakes: [
        {
          id: 'sec-q1',
          question: 'What is the required permission on the ~/.ssh directory for OpenSSH to accept key-based login?',
          questionFr: 'Quelles sont les permissions requises sur le dossier ~/.ssh pour qu\'OpenSSH accepte l\'authentification ?',
          category: 'Security',
          subtopic: 'SSH Hardening',
          correctAnswer: 'chmod 700 ~/.ssh (drwx------)',
          explanation: 'OpenSSH StrictModes requires the .ssh folder to be owned by user and not writable by group/others.',
          explanationFr: 'StrictModes exige que ~/.ssh appartienne à l\'utilisateur et ne soit pas accessible aux autres.',
          mistakeReasonFr: 'Vous aviez choisi chmod 755.'
        }
      ]
    },

    // 4. FILESYSTEMS (67%)
    {
      id: 'filesystems',
      name: 'Filesystems & Storage',
      nameFr: 'Systèmes de Fichiers & Montages',
      masteryPct: 67,
      totalErrors: 4,
      luckyGuessesCount: 1,
      skippedCount: 1,
      failedLabsCount: 0,
      untestedSubtopicsCount: 0,
      timeSpentAvgSeconds: 65,
      status: 'review',
      whyWeakExplanation:
        'Filesystems is in reasonable shape (67% mastery), but minor slip-ups persist regarding /etc/fstab options, inode exhaustion, and LVM logical volume extension.',
      whyWeakExplanationFr:
        'Le domaine du stockage est en bonne voie (67% de maîtrise), mais des erreurs persistent sur les options /etc/fstab, la saturation d\'inodes (df -i) et les extensions de volumes LVM.',
      subtopics: [
        {
          id: 'fstab_mounts',
          name: 'Fstab Syntax & UUID Mounting',
          nameFr: 'Syntaxe /etc/fstab & Montages UUID',
          errorsCount: 2,
          luckyGuessesCount: 1,
          skippedCount: 0,
          descriptionFr: 'Options defaults, nofail, noatime, passno fsck'
        },
        {
          id: 'inodes_quotas',
          name: 'Inode Exhaustion & Diagnostics',
          nameFr: 'Saturation d\'Inodes & Quotas',
          errorsCount: 1,
          luckyGuessesCount: 0,
          skippedCount: 1,
          descriptionFr: 'df -i vs df -h, millions de fichiers de 0 octet'
        },
        {
          id: 'lvm_storage',
          name: 'LVM (PV, VG, LV) Expansion',
          nameFr: 'Gestion LVM & Redimensionnement',
          errorsCount: 1,
          luckyGuessesCount: 0,
          skippedCount: 0,
          descriptionFr: 'lvextend -r -L +10G, pvcreate, vgdisplay'
        }
      ],
      commonPitfalls: [
        'Typo in the 6th field of /etc/fstab (fsck pass number) causing boot freeze into emergency mode.',
        'Checking only "df -h" when disk writes fail, without checking "df -i" for 100% inode exhaustion.'
      ],
      commonPitfallsFr: [
        'Erreur de frappe dans le 6ème champ de /etc/fstab (ordre de vérification fsck), bloquant le boot en emergency mode.',
        'Ne vérifier que "df -h" lors d\'un échec d\'écriture, sans penser à "df -i" pour la saturation des inodes.'
      ],
      recommendedAction:
        'Review fstab fields order (Device, Mountpoint, Type, Options, Dump, Pass) and test lvextend.',
      recommendedActionFr:
        'Révisez l\'ordre des 6 champs de /etc/fstab et l\'option -r (resizefs) de lvextend.',
      targetObjectiveIds: ['104.1', '104.2', '104.3'],
      sampleMistakes: [
        {
          id: 'fs-q1',
          question: 'What command displays filesystem inode utilization instead of block space?',
          questionFr: 'Quelle commande affiche l\'utilisation des inodes du système de fichiers ?',
          category: 'Filesystems',
          subtopic: 'Inodes',
          correctAnswer: 'df -i',
          explanation: 'df -i shows total, used, and free inode counts.',
          explanationFr: 'df -i affiche les métriques d\'inodes consommés et libres.',
          mistakeReasonFr: 'Confusion avec du -i ou ls -i.'
        }
      ]
    },

    // 5. COMMANDS (82%)
    {
      id: 'commands',
      name: 'GNU & Unix Commands',
      nameFr: 'Commandes GNU/Unix & Filtres',
      masteryPct: 82,
      totalErrors: 2,
      luckyGuessesCount: 0,
      skippedCount: 1,
      failedLabsCount: 0,
      untestedSubtopicsCount: 0,
      timeSpentAvgSeconds: 42,
      status: 'solid',
      whyWeakExplanation:
        'Strong mastery (82%). Only edge-cases around find -exec {} + vs xargs, and standard stream redirections (2>&1).',
      whyWeakExplanationFr:
        'Solide maîtrise (82%). Seuls des détails pointus sur find -exec {} + vs xargs et les redirections 2>&1 subsistent.',
      subtopics: [
        {
          id: 'redirections',
          name: 'I/O Redirections & Pipes',
          nameFr: 'Redirections E/S (2>&1, pipes)',
          errorsCount: 1,
          luckyGuessesCount: 0,
          skippedCount: 0,
          descriptionFr: 'command > file 2>&1 vs &>, tee -a'
        },
        {
          id: 'find_xargs',
          name: 'Advanced Find & Xargs',
          nameFr: 'Recherche Avancée find & xargs',
          errorsCount: 1,
          luckyGuessesCount: 0,
          skippedCount: 1,
          descriptionFr: 'find -name "*.log" -exec rm -f {} +, xargs -0'
        }
      ],
      commonPitfalls: [
        'Placing "2>&1" BEFORE the target file redirection (e.g. "cmd 2>&1 > file") which sends stderr to old stdout.'
      ],
      commonPitfallsFr: [
        'Placer "2>&1" AVANT la redirection de fichier (ex: "cmd 2>&1 > file"), ce qui envoie stderr vers l\'ancien terminal.'
      ],
      recommendedAction: 'Maintain periodic flashcard reviews to retain command flags.',
      recommendedActionFr: 'Maintenez de simples révisions espacées périodiques pour conserver vos automatismes.',
      targetObjectiveIds: ['103.1', '103.2', '103.3', '103.4'],
      sampleMistakes: []
    }
  ]
};

/**
 * Charge le rapport des faiblesses depuis localStorage ou initialise le modèle par défaut
 */
export function getWeaknessReport(): WeaknessEngineReport {
  try {
    const raw = localStorage.getItem(WEAKNESS_STORAGE_KEY);
    if (raw) {
      const parsed: WeaknessEngineReport = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.domains) && parsed.domains.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading weakness report from localStorage:', e);
  }

  // Initialisation par défaut
  saveWeaknessReport(INITIAL_WEAKNESS_REPORT);
  return INITIAL_WEAKNESS_REPORT;
}

/**
 * Enregistre le rapport des faiblesses dans localStorage
 */
export function saveWeaknessReport(report: WeaknessEngineReport): void {
  try {
    report.lastUpdated = new Date().toISOString();
    localStorage.setItem(WEAKNESS_STORAGE_KEY, JSON.stringify(report));
    window.dispatchEvent(new CustomEvent('weakness_report_updated', { detail: report }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save weakness report:', e);
  }
}

/**
 * Enregistre une interaction d'examen ou d'exercice dans le Weakness Engine
 */
export function recordQuestionInteraction(params: {
  questionId: string | number;
  questionText: string;
  category: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  wasFlagged?: boolean;
  wasSkipped?: boolean;
  correctAnswer?: string;
  explanation?: string;
}): void {
  const report = getWeaknessReport();
  const domainId = mapCategoryToDomainId(params.category);
  const domain = report.domains.find((d) => d.id === domainId);

  if (!domain) return;

  const isLuckyGuess = params.isCorrect && (params.wasFlagged || params.timeSpentSeconds > 90);

  if (!params.isCorrect) {
    domain.totalErrors += 1;
    report.totalErrors += 1;
    // Baisse légère de maîtrise
    domain.masteryPct = Math.max(10, domain.masteryPct - 3);

    // Ajouter ou incrémenter le sous-sujet
    const subtopic = guessSubtopic(params.questionText, domainId);
    const existingSub = domain.subtopics.find((s) => s.id === subtopic);
    if (existingSub) {
      existingSub.errorsCount += 1;
    } else {
      domain.subtopics.push({
        id: subtopic,
        name: subtopic.toUpperCase(),
        nameFr: subtopic.toUpperCase(),
        errorsCount: 1
      });
    }

    // Ajouter à l'échantillon d'erreurs
    domain.sampleMistakes = [
      {
        id: params.questionId,
        question: params.questionText,
        category: params.category,
        subtopic,
        correctAnswer: params.correctAnswer || 'Correct answer',
        explanation: params.explanation || 'Review LPIC objective guidelines'
      },
      ...domain.sampleMistakes.filter((m) => m.id !== params.questionId)
    ].slice(0, 5);
  } else if (isLuckyGuess) {
    domain.luckyGuessesCount += 1;
    report.totalLuckyGuesses += 1;
    // Pas de gain de maîtrise si c'est de la chance
  } else {
    // Réussite méritée et rapide : amélioration du score de maîtrise
    domain.masteryPct = Math.min(100, domain.masteryPct + 2);
    if (domain.totalErrors > 0) {
      domain.totalErrors = Math.max(0, domain.totalErrors - 1);
    }
  }

  if (params.wasSkipped) {
    domain.skippedCount += 1;
    report.totalSkipped += 1;
  }

  // Recalcul de l'état général
  updateDomainStatus(domain);
  recomputeReportSummary(report);
  saveWeaknessReport(report);
}

/**
 * Question d'entraînement ciblé générée par le Weakness Engine
 */
export interface WeaknessTrainingQuestion {
  id: string;
  domainId: WeaknessDomainId;
  domainNameFr: string;
  subtopicId: string;
  subtopicNameFr: string;
  isRetestOfPastMistake: boolean;
  question: string;
  questionFr: string;
  options: string[];
  optionsFr?: string[];
  correctIndex: number;
  explanation: string;
  explanationFr: string;
  commandTip?: string;
  examTipFr?: string;
}

/**
 * Banque de questions ciblées pour s'entraîner spécifiquement sur ses faiblesses
 */
export const WEAKNESS_TARGETED_QUESTIONS: WeaknessTrainingQuestion[] = [
  // --- NETWORKING (DNS, Routing, IPv6) ---
  {
    id: 'wk-net-dns-1',
    domainId: 'networking',
    domainNameFr: 'Réseau (DNS)',
    subtopicId: 'dns',
    subtopicNameFr: 'Résolution DNS & systemd-resolved',
    isRetestOfPastMistake: true,
    question: 'In a modern Linux server running systemd-resolved, what IP address does /etc/resolv.conf point to for local stub resolution?',
    questionFr: 'Sur un serveur Linux moderne exécutant systemd-resolved, vers quelle adresse IP le fichier /etc/resolv.conf pointe-t-il pour le stub resolver local ?',
    options: [
      '127.0.0.1',
      '127.0.0.53',
      '192.168.1.1',
      '0.0.0.0'
    ],
    correctIndex: 1,
    explanation: 'systemd-resolved binds to the loopback stub address 127.0.0.53 on port 53 to manage DNS caching and split-DNS configurations.',
    explanationFr: 'systemd-resolved écoute sur l\'adresse de boucle locale 127.0.0.53 sur le port 53 pour gérer le cache et la résolution split-DNS.',
    commandTip: 'cat /etc/resolv.conf | grep nameserver',
    examTipFr: 'Piège LPIC-1 classique : 127.0.0.1 est localhost classique, 127.0.0.53 est le résolveur stub systemd dédié.'
  },
  {
    id: 'wk-net-dns-2',
    domainId: 'networking',
    domainNameFr: 'Réseau (DNS)',
    subtopicId: 'dns',
    subtopicNameFr: 'Outils de diagnostic DNS (dig)',
    isRetestOfPastMistake: false,
    question: 'Which dig command tests DNS query resolution directly against a specific external DNS server (1.1.1.1) for domain example.org?',
    questionFr: 'Quelle commande dig interroge directement un résolveur DNS externe spécifique (1.1.1.1) pour résoudre example.org ?',
    options: [
      'dig -server 1.1.1.1 example.org',
      'dig @1.1.1.1 example.org',
      'dig -H 1.1.1.1 example.org',
      'dig lookup example.org --via 1.1.1.1'
    ],
    correctIndex: 1,
    explanation: 'The @server syntax in dig instructs it to query that specific server instead of the local /etc/resolv.conf nameservers.',
    explanationFr: 'La syntaxe @serveur avec dig permet de forcer la requête vers ce serveur DNS précis, sans passer par le résolveur local.',
    commandTip: 'dig @1.1.1.1 example.org +short',
    examTipFr: 'Indispensable pour différencier une panne DNS locale d\'un problème de liaison Internet globale.'
  },
  {
    id: 'wk-net-routing-1',
    domainId: 'networking',
    domainNameFr: 'Réseau (Routing)',
    subtopicId: 'routing',
    subtopicNameFr: 'Routage & Passerelle par défaut',
    isRetestOfPastMistake: true,
    question: 'What is the correct modern iproute2 command to set 10.0.0.1 as the default gateway on interface eth0?',
    questionFr: 'Quelle commande iproute2 moderne définit 10.0.0.1 comme passerelle par défaut sur eth0 ?',
    options: [
      'route add default gw 10.0.0.1 eth0',
      'ip route add default via 10.0.0.1 dev eth0',
      'ifconfig eth0 gateway 10.0.0.1',
      'netstat -r add default 10.0.0.1'
    ],
    correctIndex: 1,
    explanation: '"ip route add default via <IP> dev <IF>" is the modern iproute2 syntax tested in LPIC-1/LPIC-2.',
    explanationFr: '"ip route add default via <IP> dev <IF>" est la syntaxe iproute2 officielle LPIC-1 qui remplace l\'ancien outil route.',
    commandTip: 'ip route show',
    examTipFr: 'N\'utilisez plus "route add default gw" qui fait partie du paquet net-tools déprécié.'
  },
  {
    id: 'wk-net-ipv6-1',
    domainId: 'networking',
    domainNameFr: 'Réseau (IPv6)',
    subtopicId: 'ipv6',
    subtopicNameFr: 'Adresses IPv6 Link-Local',
    isRetestOfPastMistake: true,
    question: 'Which address prefix is reserved for IPv6 Link-Local unicast addresses?',
    questionFr: 'Quel préfixe d\'adresse est réservé aux adresses IPv6 unicast de type Lien-Local (Link-Local) ?',
    options: [
      '2001::/16',
      'fe80::/10',
      'fc00::/7',
      'ff00::/8'
    ],
    correctIndex: 1,
    explanation: 'fe80::/10 is reserved for link-local unicast addresses, automatically generated on every enabled interface.',
    explanationFr: 'fe80::/10 est le préfixe réservé aux adresses lien-local, créées automatiquement sur chaque interface active.',
    commandTip: 'ip -6 addr show dev eth0',
    examTipFr: 'fe80:: = Link-Local ; fc00::/7 = Unique Local (ULA) ; ff00::/8 = Multicast ; 2000::/3 = Global Unicast.'
  },

  // --- SHELL SCRIPTING (Tests, sed/awk, Quoting) ---
  {
    id: 'wk-scr-cond-1',
    domainId: 'scripting',
    domainNameFr: 'Scripts (Conditions)',
    subtopicId: 'loops_conditions',
    subtopicNameFr: 'Tests conditionnels Bash',
    isRetestOfPastMistake: true,
    question: 'Which test condition verifies that the file /tmp/deploy.lock does NOT exist?',
    questionFr: 'Quel test conditionnel Bash vérifie que le fichier /tmp/deploy.lock n\'existe PAS ?',
    options: [
      '[ ! -f /tmp/deploy.lock ]',
      '[ -e /tmp/deploy.lock != 0 ]',
      '[ -empty /tmp/deploy.lock ]',
      'test --missing /tmp/deploy.lock'
    ],
    correctIndex: 0,
    explanation: '-f tests for regular file existence, and ! negates the condition. [ ! -f /tmp/deploy.lock ] evaluates to true when missing.',
    explanationFr: '-f teste l\'existence d\'un fichier régulier, et l\'opérateur ! inverse le résultat. [ ! -f /tmp/deploy.lock ] est vrai s\'il n\'existe pas.',
    commandTip: 'if [ ! -f /tmp/deploy.lock ]; then echo "Ready"; fi',
    examTipFr: 'Attention à toujours laisser un espace entre les crochets et les arguments : [ ! -f ... ].'
  },
  {
    id: 'wk-scr-sed-1',
    domainId: 'scripting',
    domainNameFr: 'Scripts (sed/awk)',
    subtopicId: 'sed_awk',
    subtopicNameFr: 'Substitution avec sed',
    isRetestOfPastMistake: true,
    question: 'Which sed command replaces all occurrences of "http://" with "https://" in-place in file config.ini?',
    questionFr: 'Quelle commande sed remplace TOUTES les occurrences de "http://" par "https://" directement dans le fichier config.ini ?',
    options: [
      'sed -i \'s|http://|https://|g\' config.ini',
      'sed -r \'replace http:// with https://\' config.ini',
      'sed \'s/http:\/\//https:\/\//\' config.ini > /dev/null',
      'sed -f \'http://=https://\' config.ini'
    ],
    correctIndex: 0,
    explanation: 'sed -i performs in-place replacement. Using a custom delimiter like "|" avoids escaping the slashes in "http://".',
    explanationFr: 'sed -i modifie le fichier sur place. L\'utilisation du séparateur alternatif "|" évite d\'échapper tous les slashes.',
    commandTip: 'sed -i.bak \'s|http://|https://|g\' config.ini',
    examTipFr: 'Le modificateur "g" en fin de règle est indispensable pour remplacer TOUTES les occurrences de chaque ligne.'
  },
  {
    id: 'wk-scr-quote-1',
    domainId: 'scripting',
    domainNameFr: 'Scripts (Quoting)',
    subtopicId: 'quoting',
    subtopicNameFr: 'Guillemets simples vs doubles',
    isRetestOfPastMistake: false,
    question: 'If USER="alice", what does echo \'$USER will run the task\' output?',
    questionFr: 'Si USER="alice", qu\'affiche la commande : echo \'$USER will run the task\' ?',
    options: [
      'alice will run the task',
      '$USER will run the task',
      'will run the task',
      'Syntax error'
    ],
    correctIndex: 1,
    explanation: 'Single quotes (\'...\') preserve the literal value of all characters; no parameter expansion occurs.',
    explanationFr: 'Les guillemets simples (\'...\') désactivent toute expansion : la chaîne est affichée mot pour mot avec "$USER".',
    commandTip: 'echo \'$USER\' vs echo "$USER"',
    examTipFr: 'Retenez : single quotes = littéral absolu ; double quotes = expansion des variables et sous-commandes $().'
  },

  // --- SECURITY (SELinux, SUID, SSH) ---
  {
    id: 'wk-sec-sel-1',
    domainId: 'security',
    domainNameFr: 'Sécurité (SELinux)',
    subtopicId: 'selinux',
    subtopicNameFr: 'Contextes SELinux & restorecon',
    isRetestOfPastMistake: true,
    question: 'After copying website files into /var/www/html, web visitors receive 403 Forbidden under SELinux Enforcing. What command restores default SELinux security contexts recursively?',
    questionFr: 'Après avoir copié des fichiers dans /var/www/html, les visiteurs ont une erreur 403 Forbidden sous SELinux. Quelle commande rétablit les contextes de sécurité par défaut ?',
    options: [
      'chmod -R 777 /var/www/html',
      'restorecon -Rv /var/www/html',
      'setenforce 0 --permanent',
      'chown -R root:root /var/www/html'
    ],
    correctIndex: 1,
    explanation: 'restorecon -Rv restores default SELinux contexts defined in the system policy (typically httpd_sys_content_t for /var/www/html).',
    explanationFr: 'restorecon -Rv réapplique les contextes de sécurité SELinux spécifiés dans la politique (httpd_sys_content_t).',
    commandTip: 'ls -laZ /var/www/html',
    examTipFr: 'Ne jamais désactiver SELinux (setenforce 0) comme solution pérenne en examen LPIC !'
  },
  {
    id: 'wk-sec-suid-1',
    domainId: 'security',
    domainNameFr: 'Sécurité (SUID/SGID)',
    subtopicId: 'suid_sgid',
    subtopicNameFr: 'Permissions spéciales SUID',
    isRetestOfPastMistake: true,
    question: 'What octal chmod notation applies rwxr-xr-x permissions along with the SUID bit on an executable binary?',
    questionFr: 'Quelle notation octale chmod applique les droits rwxr-xr-x avec le bit SUID sur un binaire exécutable ?',
    options: [
      'chmod 1755 /usr/local/bin/myapp',
      'chmod 2755 /usr/local/bin/myapp',
      'chmod 4755 /usr/local/bin/myapp',
      'chmod 7755 /usr/local/bin/myapp'
    ],
    correctIndex: 2,
    explanation: 'SUID = 4000, SGID = 2000, Sticky Bit = 1000. Combined with 755 (rwxr-xr-x), the mode is 4755 (rwsr-xr-x).',
    explanationFr: 'SUID = 4000, SGID = 2000, Sticky = 1000. Ajouté à 755, on obtient 4755, affiché rwsr-xr-x.',
    commandTip: 'chmod 4755 /path/to/binary',
    examTipFr: 'SUID = 4, SGID = 2, Sticky = 1. Retenez cette suite par cœur pour l\'examen 101 et 102.'
  },

  // --- FILESYSTEMS (fstab, Inodes) ---
  {
    id: 'wk-fs-fst-1',
    domainId: 'filesystems',
    domainNameFr: 'Stockage (fstab)',
    subtopicId: 'fstab_mounts',
    subtopicNameFr: 'Syntaxe des options /etc/fstab',
    isRetestOfPastMistake: true,
    question: 'What mount option in /etc/fstab prevents the system from halting into emergency mode during boot if a secondary data partition is missing?',
    questionFr: 'Quelle option de montage dans /etc/fstab empêche le système de se figer en emergency mode au boot si un disque secondaire est absent ?',
    options: [
      'noatime',
      'nofail',
      'ro',
      'nodev'
    ],
    correctIndex: 1,
    explanation: 'The "nofail" option tells systemd/mount not to fail the boot target if the device does not exist or fails to mount.',
    explanationFr: 'L\'option "nofail" indique à systemd de continuer le démarrage même si le périphérique n\'est pas disponible.',
    commandTip: 'UUID=... /mnt/data ext4 defaults,nofail 0 2',
    examTipFr: 'Sans "nofail", un disque externe ou iSCSI absent bloque tout le serveur au démarrage.'
  },
  {
    id: 'wk-fs-ino-1',
    domainId: 'filesystems',
    domainNameFr: 'Stockage (Inodes)',
    subtopicId: 'inodes_quotas',
    subtopicNameFr: 'Saturation d\'inodes (df -i)',
    isRetestOfPastMistake: true,
    question: 'A web application fails with "No space left on device", but "df -h" shows 65% disk space available. What is the most likely cause?',
    questionFr: 'Une application échoue avec "No space left on device", pourtant "df -h" indique 65% d\'espace disque libre. Quelle est la cause la plus probable ?',
    options: [
      'The CPU load is too high to accept file buffers',
      'The filesystem has exhausted all available inodes (df -i at 100%)',
      'The swap partition has leaked memory to disk',
      'The ext4 journaling log is disabled'
    ],
    correctIndex: 1,
    explanation: 'Filesystems have a fixed number of inodes. If millions of small 0-byte files (like session files) are created, inodes hit 100% while block space remains plenty.',
    explanationFr: 'Chaque fichier requiert un inode. Des millions de petits fichiers (sessions, spool) saturent les inodes (df -i 100%) même s\'il reste des gigaoctets de stockage libre.',
    commandTip: 'df -i /var',
    examTipFr: 'Toujours exécuter "df -i" conjointement avec "df -h" lors d\'un diagnostic d\'E/S.'
  }
];

/**
 * Génère une session d'entraînement ciblée sur les faiblesses
 */
export function generateWeaknessTrainingSession(targetDomainId?: WeaknessDomainId): WeaknessTrainingQuestion[] {
  if (targetDomainId) {
    const domainQuestions = WEAKNESS_TARGETED_QUESTIONS.filter((q) => q.domainId === targetDomainId);
    if (domainQuestions.length > 0) {
      return [...domainQuestions].sort(() => Math.random() - 0.5);
    }
  }

  // Si pas de domaine ciblé, prioriser les domaines les plus faibles (mastery < 70%)
  const report = getWeaknessReport();
  const sortedDomains = [...report.domains].sort((a, b) => a.masteryPct - b.masteryPct);
  const weakestDomainIds = sortedDomains.slice(0, 3).map((d) => d.id);

  const matched = WEAKNESS_TARGETED_QUESTIONS.filter((q) => weakestDomainIds.includes(q.domainId));
  const other = WEAKNESS_TARGETED_QUESTIONS.filter((q) => !weakestDomainIds.includes(q.domainId));

  // Combiner en mettant les points faibles en tête
  return [...matched, ...other].slice(0, 8);
}

/**
 * Applique le résultat d'un entraînement sur une question :
 * Fait progresser la maîtrise et met à jour le rapport en temps réel
 */
export function applyWeaknessTrainingResult(
  domainId: WeaknessDomainId,
  subtopicId: string,
  isCorrect: boolean,
  wasConfident: boolean
): { newMastery: number; improvement: number } {
  const report = getWeaknessReport();
  const domain = report.domains.find((d) => d.id === domainId);

  if (!domain) {
    return { newMastery: 50, improvement: 0 };
  }

  const oldMastery = domain.masteryPct;
  let improvement = 0;

  if (isCorrect) {
    if (wasConfident) {
      // Progrès rapide : +5%
      improvement = 5;
      domain.masteryPct = Math.min(100, domain.masteryPct + improvement);
      domain.totalErrors = Math.max(0, domain.totalErrors - 1);
      if (domain.luckyGuessesCount > 0) {
        domain.luckyGuessesCount -= 1;
      }
    } else {
      // Progrès modéré : +2% (bonne réponse mais hésitation)
      improvement = 2;
      domain.masteryPct = Math.min(100, domain.masteryPct + improvement);
    }

    // Réduire le compteur du sous-sujet
    const sub = domain.subtopics.find((s) => s.id === subtopicId);
    if (sub && sub.errorsCount > 0) {
      sub.errorsCount -= 1;
    }
  } else {
    // Mauvaise réponse lors de l'entraînement ciblé
    improvement = -2;
    domain.masteryPct = Math.max(10, domain.masteryPct + improvement);
    domain.totalErrors += 1;
  }

  updateDomainStatus(domain);
  recomputeReportSummary(report);
  saveWeaknessReport(report);

  return {
    newMastery: domain.masteryPct,
    improvement
  };
}

/**
 * Réinitialise les faiblesses aux données par défaut
 */
export function resetWeaknessData(): WeaknessEngineReport {
  saveWeaknessReport(INITIAL_WEAKNESS_REPORT);
  return INITIAL_WEAKNESS_REPORT;
}

// ----------------------------------------------------
// Fonctions utilitaires internes
// ----------------------------------------------------

function mapCategoryToDomainId(category: string): WeaknessDomainId {
  const c = category.toLowerCase();
  if (c.includes('network') || c.includes('dns') || c.includes('ip') || c.includes('route')) {
    return 'networking';
  }
  if (c.includes('script') || c.includes('shell') || c.includes('bash') || c.includes('sed') || c.includes('awk')) {
    return 'scripting';
  }
  if (c.includes('secur') || c.includes('selinux') || c.includes('ssh') || c.includes('perm') || c.includes('suid')) {
    return 'security';
  }
  if (c.includes('file') || c.includes('fstab') || c.includes('lvm') || c.includes('disk') || c.includes('storage')) {
    return 'filesystems';
  }
  if (c.includes('command') || c.includes('gnu') || c.includes('find') || c.includes('grep')) {
    return 'commands';
  }
  if (c.includes('boot') || c.includes('grub') || c.includes('systemd') || c.includes('kernel')) {
    return 'boot';
  }
  return 'networking';
}

function guessSubtopic(questionText: string, domainId: WeaknessDomainId): string {
  const q = questionText.toLowerCase();
  if (domainId === 'networking') {
    if (q.includes('dns') || q.includes('resolv') || q.includes('dig') || q.includes('host') || q.includes('nameserver')) return 'dns';
    if (q.includes('route') || q.includes('gateway') || q.includes('passerelle') || q.includes('ip route')) return 'routing';
    if (q.includes('ipv6') || q.includes('fe80') || q.includes('prefix') || q.includes('slaac')) return 'ipv6';
    return 'dns';
  }
  if (domainId === 'scripting') {
    if (q.includes('sed') || q.includes('awk') || q.includes('regex')) return 'sed_awk';
    if (q.includes('quote') || q.includes('expansion') || q.includes('$')) return 'quoting';
    return 'loops_conditions';
  }
  if (domainId === 'security') {
    if (q.includes('selinux') || q.includes('restorecon') || q.includes('avc')) return 'selinux';
    if (q.includes('suid') || q.includes('sgid') || q.includes('sticky')) return 'suid_sgid';
    return 'ssh_hardening';
  }
  if (domainId === 'filesystems') {
    if (q.includes('fstab') || q.includes('mount') || q.includes('uuid')) return 'fstab_mounts';
    if (q.includes('inode') || q.includes('df -i')) return 'inodes_quotas';
    return 'lvm_storage';
  }
  return 'general';
}

function updateDomainStatus(domain: WeaknessDomainStats): void {
  if (domain.masteryPct < 50) {
    domain.status = 'critical';
  } else if (domain.masteryPct < 70) {
    domain.status = 'moderate';
  } else if (domain.masteryPct < 85) {
    domain.status = 'review';
  } else {
    domain.status = 'solid';
  }
}

function recomputeReportSummary(report: WeaknessEngineReport): void {
  let totalMastery = 0;
  let totalErr = 0;
  let totalLucky = 0;
  let totalSkip = 0;

  report.domains.forEach((d) => {
    totalMastery += d.masteryPct;
    totalErr += d.totalErrors;
    totalLucky += d.luckyGuessesCount;
    totalSkip += d.skippedCount;
  });

  report.overallHealthPct = report.domains.length > 0 ? Math.round(totalMastery / report.domains.length) : 50;
  report.totalErrors = totalErr;
  report.totalLuckyGuesses = totalLucky;
  report.totalSkipped = totalSkip;
  report.lastUpdated = new Date().toISOString();
}
