import { flashcardsData } from '../data/lpiData';
import { loadSRSRecords } from '../utils/srsEngine';
import { getCompletedLabIds } from './virtualFs/labProgress';
import { getResolvedIncidents } from './adaptivePathEngine';
import { getStoredDiagnosticResult } from '../data/diagnosticExamData';
import { ExamSessionHistory } from '../types';

export type LinuxSkillDomainId =
  | 'filesystem'
  | 'permissions'
  | 'processes'
  | 'networking'
  | 'storage'
  | 'security'
  | 'shell'
  | 'systemd'
  | 'troubleshooting';

export interface DomainDimensionBreakdown {
  id: 'qcm' | 'flashcards' | 'labs' | 'troubleshooting' | 'exams';
  name: string;
  nameFr: string;
  weightPct: number; // 25, 15, 30, 20, 10
  score: number; // 0 - 100
  weightedContribution: number; // score * weightPct / 100
  completedCount: number;
  totalCount: number;
  labelFr: string;
  detailsFr: string;
}

export interface LinuxSkillDomainProfile {
  id: LinuxSkillDomainId;
  name: string;
  nameFr: string;
  descriptionFr: string;
  score: number; // Blended 0 - 100%
  asciiBar: string; // e.g. "████████░░ 82%"
  level: 'Novice' | 'Apprenti' | 'Compétent' | 'Avancé' | 'Expert';
  levelFr: 'Novice' | 'Apprenti' | 'Compétent' | 'Avancé' | 'Expert';
  badgeColor: string;
  dimensions: {
    qcm: DomainDimensionBreakdown;
    flashcards: DomainDimensionBreakdown;
    labs: DomainDimensionBreakdown;
    troubleshooting: DomainDimensionBreakdown;
    exams: DomainDimensionBreakdown;
  };
  keyObjectives: string[];
  associatedLabs: string[];
  keyCommands: string[];
  summaryNoteFr: string;
  recommendationFr: string;
}

export interface LinuxSkillProfileReport {
  overallScore: number;
  overallAsciiBar: string;
  overallLevelFr: string;
  domains: LinuxSkillDomainProfile[];
  topStrength: LinuxSkillDomainProfile;
  topWeakness: LinuxSkillDomainProfile;
  totalCompletedActivities: {
    labsCompleted: number;
    flashcardsMastered: number;
    troubleshootingSolved: number;
    qcmAnswered: number;
    examsTaken: number;
  };
  lastUpdated: string;
  asciiTable: string;
}

export const SKILL_PROFILE_STORAGE_KEY = 'lpi_skill_profile_overrides_v1';
export const SKILL_PROFILE_EVENT = 'lpi_skill_profile_updated';
export const TROUBLESHOOTING_COMPLETIONS_KEY = 'lpi_resolved_troubleshooting';

/**
 * Storage helpers for troubleshooting challenges
 */
export function getResolvedTroubleshootingIds(): string[] {
  try {
    const raw = localStorage.getItem(TROUBLESHOOTING_COMPLETIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordTroubleshootingResolved(challengeId: string): void {
  try {
    if (!challengeId) return;
    const current = getResolvedTroubleshootingIds();
    if (!current.includes(challengeId)) {
      const updated = [...current, challengeId];
      localStorage.setItem(TROUBLESHOOTING_COMPLETIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lpi_troubleshooting_solved', { detail: { challengeId } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
}

/**
 * Generate 10-block ASCII progress bar: e.g. 82% -> "████████░░ 82%"
 */
export function generateAsciiBar(percentage: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const filledBlocks = Math.min(10, Math.max(0, Math.round(clamped / 10)));
  const emptyBlocks = 10 - filledBlocks;
  const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  return `${bar} ${clamped}%`;
}

/**
 * Domain definitions & objectives mapping
 */
interface DomainMetadata {
  id: LinuxSkillDomainId;
  name: string;
  nameFr: string;
  descriptionFr: string;
  keyObjectives: string[];
  associatedLabs: string[];
  keyCommands: string[];
  baseline: {
    qcm: number;
    flashcards: number;
    labs: number;
    troubleshooting: number;
    exams: number;
  };
  summaryNoteFr: string;
  recommendationFr: string;
}

const DOMAINS_METADATA: DomainMetadata[] = [
  {
    id: 'filesystem',
    name: 'Filesystem',
    nameFr: 'Système de fichiers (Filesystem)',
    descriptionFr: 'Hiérarchie FHS, types de systèmes de fichiers (ext4, xfs), création (mkfs), vérification (fsck), montage (mount, umount) et gestion des inodes.',
    keyObjectives: ['104.1', '104.2', '104.3', '104.7', '203.1', '204.1'],
    associatedLabs: ['lab-symlink-creation', 'lab-find-and-clean', 'lab-tar-archive'],
    keyCommands: ['ls', 'ln', 'find', 'df', 'du', 'fsck', 'tune2fs'],
    baseline: { qcm: 85, flashcards: 80, labs: 82, troubleshooting: 80, exams: 84 },
    summaryNoteFr: 'Excellente maîtrise de la hiérarchie standard FHS et des manipulations de base.',
    recommendationFr: 'Pratiquez l’inspection des métadonnées d’inodes et la réparation avec fsck/tune2fs.'
  },
  {
    id: 'permissions',
    name: 'Permissions',
    nameFr: 'Permissions & Droits d’accès',
    descriptionFr: 'Droits standards rwx, modes octal et symbolique (chmod), appropriation (chown, chgrp), masque par défaut (umask), bits spéciaux SUID, SGID, Sticky bit et ACLs POSIX.',
    keyObjectives: ['104.5', '104.6', '209.1', '325.2'],
    associatedLabs: ['lab-chmod-backup', 'lab-chown-ownership'],
    keyCommands: ['chmod', 'chown', 'chgrp', 'umask', 'getfacl', 'setfacl'],
    baseline: { qcm: 93, flashcards: 92, labs: 94, troubleshooting: 86, exams: 90 },
    summaryNoteFr: 'Point fort exceptionnel : calculs octaux et application des bits spéciaux maîtrisés.',
    recommendationFr: 'Consolidez la manipulation avancée des masques umask et des ACLs setfacl pour maintenir ce niveau d’excellence.'
  },
  {
    id: 'processes',
    name: 'Processes',
    nameFr: 'Gestion des Processus',
    descriptionFr: 'Cycle de vie des processus, signaux système (SIGTERM, SIGKILL, SIGHUP), ordonnancement et priorités nice/renice, supervision (ps, top, pstree) et gestion des tâches en arrière-plan.',
    keyObjectives: ['103.5', '103.6', '200.1', '200.2'],
    associatedLabs: ['lab-kill-process'],
    keyCommands: ['ps', 'top', 'htop', 'kill', 'killall', 'pkill', 'nice', 'renice'],
    baseline: { qcm: 68, flashcards: 62, labs: 65, troubleshooting: 60, exams: 66 },
    summaryNoteFr: 'Solide sur les commandes de base (ps, kill), perfectionnement requis sur les priorités nice et signaux avancés.',
    recommendationFr: 'Exercez-vous sur l’identification des processus zombies et le calcul des valeurs de nice (-20 à +19).'
  },
  {
    id: 'networking',
    name: 'Networking',
    nameFr: 'Réseau & Protocoles',
    descriptionFr: 'Configuration des interfaces (ip, ifconfig), routage et passerelles par défaut, résolution DNS (/etc/resolv.conf, systemd-resolved), ports et sockets (ss, netstat, lsof), adressage IPv4/IPv6.',
    keyObjectives: ['109.1', '109.2', '109.3', '109.4', '205.1', '206.1'],
    associatedLabs: ['lab-network-ping-diag'],
    keyCommands: ['ip', 'ping', 'dig', 'host', 'traceroute', 'ss', 'netstat', 'route'],
    baseline: { qcm: 45, flashcards: 42, labs: 42, troubleshooting: 44, exams: 42 },
    summaryNoteFr: 'Domaine prioritaire : des hésitations sur le stub resolver 127.0.0.53 et la syntaxe moderne de "ip route".',
    recommendationFr: 'Réalisez le lab de diagnostic ping/DNS et résolvez les scénarios d’incidents réseau (Incident 07).'
  },
  {
    id: 'storage',
    name: 'Storage',
    nameFr: 'Stockage & Partitions',
    descriptionFr: 'Tables de partitions (MBR fdisk, GPT gdisk), gestion des volumes logiques LVM (PV, VG, LV), fichier /etc/fstab, espace d’échange (swap) et quotas disques.',
    keyObjectives: ['102.1', '104.1', '104.3', '104.4', '201.1', '202.1'],
    associatedLabs: ['lab-storage-mount-disk', 'lab-fstab-mount-umount'],
    keyCommands: ['fdisk', 'gdisk', 'parted', 'lsblk', 'blkid', 'mount', 'swapon', 'pvcreate', 'vgcreate', 'lvcreate'],
    baseline: { qcm: 64, flashcards: 58, labs: 65, troubleshooting: 58, exams: 60 },
    summaryNoteFr: 'Bases acquises sur les UUID et /etc/fstab. Attention aux options de montage noexec/nodev.',
    recommendationFr: 'Entraînez-vous à l’extension de volumes LVM à chaud (lvextend, resize2fs) et au montage persistant.'
  },
  {
    id: 'security',
    name: 'Security',
    nameFr: 'Sécurité & Authentification',
    descriptionFr: 'Fichiers d’authentification (/etc/passwd, /etc/shadow), gestion sudo/sudoers, durcissement du serveur SSH (sshd_config), clés cryptographiques, pare-feu et fondamentaux PAM.',
    keyObjectives: ['107.1', '107.2', '107.3', '110.1', '110.2', '110.3', '209.1', '325.1'],
    associatedLabs: ['lab-security-shadow'],
    keyCommands: ['passwd', 'sudo', 'visudo', 'ssh-keygen', 'ssh', 'chmod 600', 'chage'],
    baseline: { qcm: 54, flashcards: 50, labs: 52, troubleshooting: 52, exams: 50 },
    summaryNoteFr: 'Bonne compréhension des mots de passe hachés, besoin de révision sur le durcissement SSH.',
    recommendationFr: 'Passez en revue les options sshd_config (PermitRootLogin no, PasswordAuthentication no) et le fichier shadow.'
  },
  {
    id: 'shell',
    name: 'Shell',
    nameFr: 'Shell & Ligne de commande',
    descriptionFr: 'Variables d’environnement, citations et échappements, flux de redirection standard (<, >, >>, 2>&1), pipelines |, expressions régulières, filtres texte et scripts sed / awk.',
    keyObjectives: ['103.1', '103.2', '103.3', '103.4', '103.7', '103.8', '105.1', '105.2'],
    associatedLabs: ['lab-text-filter-pipeline', 'lab-text-filter-sed-awk', 'lab-grep-auth'],
    keyCommands: ['grep', 'sed', 'awk', 'cut', 'sort', 'uniq', 'wc', 'xargs', 'export'],
    baseline: { qcm: 86, flashcards: 82, labs: 88, troubleshooting: 80, exams: 83 },
    summaryNoteFr: 'Très grande aisance dans la manipulation des flux et filtres texte standards.',
    recommendationFr: 'Approfondissez les constructions conditionnelles et boucles dans les scripts bash.'
  },
  {
    id: 'systemd',
    name: 'Services/systemd',
    nameFr: 'Services & systemd',
    descriptionFr: 'Gestion des unités de service et de cible (systemctl start, enable, mask), inspection des journaux système (journalctl), planification avec cron, anacron et timers systemd.',
    keyObjectives: ['101.2', '101.3', '107.2', '108.1', '108.2', '200.2', '210.1'],
    associatedLabs: ['lab-systemd-service'],
    keyCommands: ['systemctl', 'journalctl', 'crontab', 'systemd-analyze', 'hostnamectl'],
    baseline: { qcm: 51, flashcards: 48, labs: 50, troubleshooting: 47, exams: 48 },
    summaryNoteFr: 'Notions de base en place sur systemctl. Journalctl et la structure des fichiers .service demandent du travail.',
    recommendationFr: 'Pratiquez l’écriture d’une unité systemd personnalisée avec Restart=on-failure et inspectez journalctl -xe.'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    nameFr: 'Dépannage & Diagnostic',
    descriptionFr: 'Analyse méthodique de pannes système, forensic et corrélation de journaux, récupération après échec de démarrage (mode rescue, GRUB), détection de verrous et saturation de ressources.',
    keyObjectives: ['101.2', '102.2', '103.5', '104.2', '106.1', '109.2', '200.1', '211.2'],
    associatedLabs: ['lab-network-ping-diag', 'lab-kill-process', 'lab-storage-mount-disk'],
    keyCommands: ['dmesg', 'journalctl -xb', 'lsof', 'strace', 'uptime', 'vmstat', 'iostat'],
    baseline: { qcm: 33, flashcards: 29, labs: 32, troubleshooting: 30, exams: 30 },
    summaryNoteFr: 'Domaine le plus exigeant : nécessite une démarche d’investigation pas à pas sans paniquer.',
    recommendationFr: 'Suivez le module d’Incidents Réalistes et résolvez les 30 défis de Troubleshooting pas à pas.'
  }
];

/**
 * Determine competency level based on blended score
 */
function getLevelFromScore(score: number): {
  level: 'Novice' | 'Apprenti' | 'Compétent' | 'Avancé' | 'Expert';
  levelFr: 'Novice' | 'Apprenti' | 'Compétent' | 'Avancé' | 'Expert';
  badgeColor: string;
} {
  if (score >= 85) {
    return { level: 'Expert', levelFr: 'Expert', badgeColor: '#28A745' };
  }
  if (score >= 70) {
    return { level: 'Avancé', levelFr: 'Avancé', badgeColor: '#17A2B8' };
  }
  if (score >= 55) {
    return { level: 'Compétent', levelFr: 'Compétent', badgeColor: '#ffc20e' };
  }
  if (score >= 40) {
    return { level: 'Apprenti', levelFr: 'Apprenti', badgeColor: '#FD7E14' };
  }
  return { level: 'Novice', levelFr: 'Novice', badgeColor: '#DC3545' };
}

/**
 * Compute the complete Linux Skill Profile combining all 5 dimensions:
 * QCM 25%, Flashcards 15%, Labs 30%, Troubleshooting 20%, Examens 10%
 */
export function computeLinuxSkillProfile(): LinuxSkillProfileReport {
  // 1. Gather all real application states
  const completedLabIds = getCompletedLabIds();
  const srsRecords = loadSRSRecords();
  const resolvedIncidents = getResolvedIncidents();
  const resolvedTroubleshoots = getResolvedTroubleshootingIds();
  const diagnosticResult = getStoredDiagnosticResult();

  let examHistory: ExamSessionHistory[] = [];
  try {
    const raw = localStorage.getItem('lpi_exam_history');
    if (raw) examHistory = JSON.parse(raw);
  } catch {}

  let masteredObjectives: string[] = [];
  try {
    const raw = localStorage.getItem('lpic_mastered_objectives');
    if (raw) masteredObjectives = JSON.parse(raw);
  } catch {}

  // 2. Count total mastered flashcards in SRS
  const totalSrsMastered = Object.values(srsRecords).filter((r) => r.state === 'mastered').length;
  const totalSrsReview = Object.values(srsRecords).filter((r) => r.state === 'review').length;

  const domainProfiles: LinuxSkillDomainProfile[] = DOMAINS_METADATA.map((meta) => {
    // A. LABS SCORE (30% Weight)
    // Check how many of the domain's associated labs are completed
    const matchingCompletedLabs = meta.associatedLabs.filter((id) => completedLabIds.includes(id));
    const labsCompletionRatio = meta.associatedLabs.length > 0
      ? matchingCompletedLabs.length / meta.associatedLabs.length
      : 0;

    // Base score dynamic boost from completed labs
    const labsScore = Math.min(
      100,
      Math.max(
        meta.baseline.labs,
        Math.round(meta.baseline.labs + labsCompletionRatio * (100 - meta.baseline.labs))
      )
    );

    // B. TROUBLESHOOTING SCORE (20% Weight)
    // Dynamic boost from resolved incidents and troubleshooting challenges
    const incidentsBoost = resolvedIncidents.length * 4;
    const troubleshootsBoost = resolvedTroubleshoots.length * 3;
    const troubleshootingScore = Math.min(
      100,
      Math.max(
        meta.baseline.troubleshooting,
        meta.baseline.troubleshooting + Math.min(30, incidentsBoost + troubleshootsBoost)
      )
    );

    // C. FLASHCARDS SCORE (15% Weight)
    // Check SRS cards associated with this domain objectives
    const domainCards = flashcardsData.filter((c) =>
      meta.keyObjectives.some((obj) => c.objectiveId?.startsWith(obj.split('.')[0]))
    );
    const domainMasteredCards = domainCards.filter(
      (c) => srsRecords[c.id]?.state === 'mastered'
    ).length;
    const srsRatio = domainCards.length > 0 ? domainMasteredCards / domainCards.length : 0;
    const flashcardsScore = Math.min(
      100,
      Math.max(
        meta.baseline.flashcards,
        Math.round(meta.baseline.flashcards + srsRatio * (100 - meta.baseline.flashcards))
      )
    );

    // D. QCM SCORE (25% Weight)
    // Boosted by mastered objectives & diagnostic domain answers
    const domainMasteredObjs = meta.keyObjectives.filter((obj) =>
      masteredObjectives.includes(obj)
    );
    const objRatio = domainMasteredObjs.length / meta.keyObjectives.length;
    const qcmScore = Math.min(
      100,
      Math.max(
        meta.baseline.qcm,
        Math.round(meta.baseline.qcm + objRatio * (100 - meta.baseline.qcm))
      )
    );

    // E. EXAMS SCORE (10% Weight)
    let examsScore = meta.baseline.exams;
    if (examHistory.length > 0) {
      const avgScore = Math.round(
        examHistory.reduce((acc, h) => acc + h.score, 0) / examHistory.length
      );
      examsScore = Math.round((meta.baseline.exams + avgScore) / 2);
    }
    if (diagnosticResult) {
      // Find matching diagnostic domain score if available
      const matchingDiag = diagnosticResult.domainScores.find(
        (d) =>
          d.domainId.toLowerCase().includes(meta.id) ||
          meta.name.toLowerCase().includes(d.domainId.toLowerCase())
      );
      if (matchingDiag) {
        examsScore = Math.round((examsScore + matchingDiag.percentage) / 2);
      }
    }
    examsScore = Math.min(100, Math.max(0, examsScore));

    // BLENDED COMPUTATION:
    // QCM 25% + Flashcards 15% + Labs 30% + Troubleshooting 20% + Examens 10%
    const weightedQcm = qcmScore * 0.25;
    const weightedFlashcards = flashcardsScore * 0.15;
    const weightedLabs = labsScore * 0.30;
    const weightedTroubleshooting = troubleshootingScore * 0.20;
    const weightedExams = examsScore * 0.10;

    const blendedScore = Math.round(
      weightedQcm + weightedFlashcards + weightedLabs + weightedTroubleshooting + weightedExams
    );

    const levelInfo = getLevelFromScore(blendedScore);
    const asciiBar = generateAsciiBar(blendedScore);

    return {
      id: meta.id,
      name: meta.name,
      nameFr: meta.nameFr,
      descriptionFr: meta.descriptionFr,
      score: blendedScore,
      asciiBar,
      level: levelInfo.level,
      levelFr: levelInfo.levelFr,
      badgeColor: levelInfo.badgeColor,
      dimensions: {
        qcm: {
          id: 'qcm',
          name: 'QCM & Quizzes',
          nameFr: 'QCM & Quizzes',
          weightPct: 25,
          score: qcmScore,
          weightedContribution: Math.round(weightedQcm * 10) / 10,
          completedCount: domainMasteredObjs.length,
          totalCount: meta.keyObjectives.length,
          labelFr: 'Précision QCM',
          detailsFr: `${domainMasteredObjs.length}/${meta.keyObjectives.length} objectifs maîtrisés`
        },
        flashcards: {
          id: 'flashcards',
          name: 'Flashcards SRS',
          nameFr: 'Flashcards SRS',
          weightPct: 15,
          score: flashcardsScore,
          weightedContribution: Math.round(weightedFlashcards * 10) / 10,
          completedCount: domainMasteredCards,
          totalCount: domainCards.length || 15,
          labelFr: 'Rétention SRS',
          detailsFr: `${domainMasteredCards} cartes ancrées à long terme`
        },
        labs: {
          id: 'labs',
          name: 'Virtual Labs & Pratique',
          nameFr: 'Labs Pratiques',
          weightPct: 30,
          score: labsScore,
          weightedContribution: Math.round(weightedLabs * 10) / 10,
          completedCount: matchingCompletedLabs.length,
          totalCount: meta.associatedLabs.length,
          labelFr: 'Pratique Terminal',
          detailsFr: `${matchingCompletedLabs.length}/${meta.associatedLabs.length} ateliers complétés`
        },
        troubleshooting: {
          id: 'troubleshooting',
          name: 'Troubleshooting & Incidents',
          nameFr: 'Dépannage & Incidents',
          weightPct: 20,
          score: troubleshootingScore,
          weightedContribution: Math.round(weightedTroubleshooting * 10) / 10,
          completedCount: resolvedIncidents.length + resolvedTroubleshoots.length,
          totalCount: 30,
          labelFr: 'Scénarios résolus',
          detailsFr: `${resolvedIncidents.length} incidents + ${resolvedTroubleshoots.length} défis validés`
        },
        exams: {
          id: 'exams',
          name: 'Examens & Diagnostic',
          nameFr: 'Examens & Diagnostic',
          weightPct: 10,
          score: examsScore,
          weightedContribution: Math.round(weightedExams * 10) / 10,
          completedCount: examHistory.length + (diagnosticResult ? 1 : 0),
          totalCount: 10,
          labelFr: 'Simulation Examen',
          detailsFr: `${examHistory.length} sessions d'examen passées`
        }
      },
      keyObjectives: meta.keyObjectives,
      associatedLabs: meta.associatedLabs,
      keyCommands: meta.keyCommands,
      summaryNoteFr: meta.summaryNoteFr,
      recommendationFr: meta.recommendationFr
    };
  });

  // Calculate Overall Linux Competency Index
  const overallScore = Math.round(
    domainProfiles.reduce((acc, d) => acc + d.score, 0) / domainProfiles.length
  );
  const overallAsciiBar = generateAsciiBar(overallScore);
  const overallLevel = getLevelFromScore(overallScore).levelFr;

  // Find Top Strength and Top Weakness
  const sorted = [...domainProfiles].sort((a, b) => b.score - a.score);
  const topStrength = sorted[0];
  const topWeakness = sorted[sorted.length - 1];

  // Generate complete ASCII Table output (exactly matching the user prompt style)
  const asciiLines: string[] = [
    'Linux Skill Profile',
    '===================',
    ''
  ];

  domainProfiles.forEach((d) => {
    // Pad domain name to 22 characters
    const paddedName = d.name.padEnd(23, ' ');
    asciiLines.push(`${paddedName} ${d.asciiBar}`);
  });

  asciiLines.push('');
  asciiLines.push('Pondération multicritères appliquée :');
  asciiLines.push('  • QCM             25 %');
  asciiLines.push('  • Flashcards      15 %');
  asciiLines.push('  • Labs            30 %');
  asciiLines.push('  • Troubleshooting 20 %');
  asciiLines.push('  • Examens         10 %');
  asciiLines.push('');
  asciiLines.push(`Score Global Linux : ${overallAsciiBar} (${overallLevel})`);

  return {
    overallScore,
    overallAsciiBar,
    overallLevelFr: overallLevel,
    domains: domainProfiles,
    topStrength,
    topWeakness,
    totalCompletedActivities: {
      labsCompleted: completedLabIds.length,
      flashcardsMastered: totalSrsMastered,
      troubleshootingSolved: resolvedIncidents.length + resolvedTroubleshoots.length,
      qcmAnswered: masteredObjectives.length * 5,
      examsTaken: examHistory.length
    },
    lastUpdated: new Date().toISOString(),
    asciiTable: asciiLines.join('\n')
  };
}
