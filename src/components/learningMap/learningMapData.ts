import { practiceExamsRegistry } from '../../data/practiceExamsData';
import { allLpicTopicsData } from '../../data/lpicObjectivesData';

export interface LearningMapNodeData {
  id: string; // 'exam-010', 'exam-101', 'exam-102', 'exam-201', 'exam-202', 'exam-300', 'exam-303', 'exam-305', 'exam-306'
  code: string; // '010-160', '101-500', etc.
  tierId: 'essentials' | 'lpic-1' | 'lpic-2' | 'lpic-3';
  tierLabel: string;
  tierBadgeColor: string;
  accentColor: string;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  description: string;
  descriptionFr: string;
  topicsLabel: string;
  topicsLabelFr: string;
  
  // 6 Primary Display Metrics
  progressionPct: number; // 0-100
  masteredObjectivesCount: number;
  totalObjectivesCount: number;
  
  questionsCount: number; // Practice questions count
  flashcardsCount: number; // Flashcards available
  labsCount: number; // Labs & troubleshooting scenarios
  
  examDetails: {
    officialCode: string;
    durationMinutes: number;
    totalOfficialQuestions: number;
    passingScore: string; // "500 / 800 (70%)"
  };
  
  readinessPct: number; // 0-100 calculated score
  readinessStatus: 'not_started' | 'needs_work' | 'on_track' | 'ready';
  readinessLabel: string;
  readinessLabelFr: string;
  
  // Navigation & Linking Targets
  defaultTopicId: string;
  flashcardTopicKey: string;
  prerequisites: string;
  prerequisitesFr: string;
  isUnlocked: boolean;
}

export interface NodeMetricsSummary {
  totalObjectives: number;
  masteredObjectives: number;
  progressionPct: number;
  readinessPct: number;
  readinessStatus: 'not_started' | 'needs_work' | 'on_track' | 'ready';
}

// Helper to compute node metrics based on localStorage states
export function computeNodeMetrics(
  examId: string,
  masteredObjectiveIds: string[],
  essentialsPassed: boolean
): NodeMetricsSummary {
  // 1. Objectives calculation
  const topics = allLpicTopicsData.filter((top) => top.examId === examId);
  const allObjs = topics.flatMap((top) => top.objectives);
  const totalObjectives = allObjs.length > 0 ? allObjs.length : (examId === 'exam-010' ? 18 : 25);
  const masteredObjectives = allObjs.length > 0 
    ? allObjs.filter((obj) => masteredObjectiveIds.includes(obj.id)).length
    : 0;

  let progressionPct = totalObjectives > 0 ? Math.round((masteredObjectives / totalObjectives) * 100) : 0;
  
  // Special case for Linux Essentials
  if (examId === 'exam-010' && essentialsPassed) {
    progressionPct = Math.max(progressionPct, 100);
  }

  // 2. Questions & practice session history
  let practiceBonus = 0;
  try {
    const statsRaw = localStorage.getItem('lpic_practice_history');
    if (statsRaw) {
      const history = JSON.parse(statsRaw);
      const examAttempts = Array.isArray(history) ? history.filter((h: any) => h.examId === examId) : [];
      if (examAttempts.length > 0) {
        const bestScore = Math.max(...examAttempts.map((h: any) => h.scorePct || 0));
        practiceBonus = Math.round(bestScore * 0.35); // 35% weight
      }
    }
  } catch {}

  // 3. Labs completed bonus
  let labsBonus = 0;
  try {
    const labsRaw = localStorage.getItem('lpic_completed_labs');
    if (labsRaw) {
      const completedLabs = JSON.parse(labsRaw);
      if (Array.isArray(completedLabs)) {
        const relevantLabs = completedLabs.filter((id: string) => id.includes(examId.replace('exam-', '')));
        labsBonus = Math.min(20, relevantLabs.length * 5); // up to 20%
      }
    }
  } catch {}

  // Calculate composite readiness (0 - 100%)
  const objWeightContribution = Math.round(progressionPct * 0.45); // 45%
  let compositeReadiness = Math.min(100, objWeightContribution + practiceBonus + labsBonus);
  
  if (examId === 'exam-010' && essentialsPassed) {
    compositeReadiness = 100;
  }

  let readinessStatus: 'not_started' | 'needs_work' | 'on_track' | 'ready' = 'not_started';
  if (compositeReadiness >= 80) {
    readinessStatus = 'ready';
  } else if (compositeReadiness >= 50) {
    readinessStatus = 'on_track';
  } else if (compositeReadiness > 0) {
    readinessStatus = 'needs_work';
  }

  return {
    totalObjectives,
    masteredObjectives,
    progressionPct,
    readinessPct: compositeReadiness,
    readinessStatus,
  };
}

export function getLearningMapNodes(
  masteredObjectiveIds: string[],
  essentialsPassed: boolean
): Record<string, LearningMapNodeData> {
  const nodeDefs: Record<string, Omit<LearningMapNodeData, 'progressionPct' | 'masteredObjectivesCount' | 'totalObjectivesCount' | 'readinessPct' | 'readinessStatus' | 'readinessLabel' | 'readinessLabelFr' | 'isUnlocked'>> = {
    'exam-010': {
      id: 'exam-010',
      code: '010-160',
      tierId: 'essentials',
      tierLabel: 'Linux Essentials',
      tierBadgeColor: '#0061a4',
      accentColor: '#0061a4',
      title: 'Linux Essentials',
      titleFr: 'Linux Essentials',
      subtitle: 'Fundamentals of Linux systems & Open Source philosophy',
      subtitleFr: 'Fondamentaux Linux et culture Open Source',
      description: 'Validates fundamental understanding of Linux OS, command line syntax, file permissions, and open-source licensing.',
      descriptionFr: 'Valide la compréhension fondamentale du système Linux, la syntaxe de la ligne de commande, les droits et la philosophie open source.',
      topicsLabel: 'Topics 1-5 (Community, CLI, Permissions)',
      topicsLabelFr: 'Thèmes 1 à 5 (Communauté, CLI, Droits)',
      questionsCount: 40,
      flashcardsCount: 45,
      labsCount: 6,
      examDetails: {
        officialCode: '010-160',
        durationMinutes: 60,
        totalOfficialQuestions: 40,
        passingScore: '500 / 800 (65%)',
      },
      defaultTopicId: 'topic-101',
      flashcardTopicKey: 'srs-daily',
      prerequisites: 'None (Recommended start)',
      prerequisitesFr: 'Aucun (Porte d\'entrée recommandée)',
    },
    'exam-101': {
      id: 'exam-101',
      code: '101-500',
      tierId: 'lpic-1',
      tierLabel: 'LPIC-1 Administrator',
      tierBadgeColor: '#785a00',
      accentColor: '#785a00',
      title: 'LPIC-1 Exam 101',
      titleFr: 'LPIC-1 : Examen 101',
      subtitle: 'System Architecture, Packages, Commands, Filesystem & Devices',
      subtitleFr: 'Architecture système, Paquets, Commandes, FHS & Périphériques',
      description: 'Covers hardware settings, boot process (BIOS/UEFI, Systemd), Debian/RPM packages, GNU utilities, partitions, and filesystems.',
      descriptionFr: 'Couvre la configuration matérielle, le démarrage (BIOS/UEFI, Systemd), paquets Debian/RPM, utilitaires GNU, partitions et FHS.',
      topicsLabel: 'Topics 101-104 (Weight 60)',
      topicsLabelFr: 'Thèmes 101 à 104 (Poids 60)',
      questionsCount: 60,
      flashcardsCount: 75,
      labsCount: 16,
      examDetails: {
        officialCode: '101-500',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-101',
      flashcardTopicKey: 'topic-101',
      prerequisites: 'Linux Essentials or equivalent experience',
      prerequisitesFr: 'Linux Essentials ou pratique équivalente',
    },
    'exam-102': {
      id: 'exam-102',
      code: '102-500',
      tierId: 'lpic-1',
      tierLabel: 'LPIC-1 Administrator',
      tierBadgeColor: '#785a00',
      accentColor: '#ffc20e',
      title: 'LPIC-1 Exam 102',
      titleFr: 'LPIC-1 : Examen 102',
      subtitle: 'Shells, Scripting, Admin Tasks, Networking & Security',
      subtitleFr: 'Shells, Scripts Bash, Administration, Réseau & Sécurité',
      description: 'Covers bash scripts, SQL queries, user accounts, cron/systemd timers, networking fundamentals, and host security.',
      descriptionFr: 'Couvre les scripts bash, requêtes SQL, comptes utilisateurs, cron/systemd timers, bases réseau et sécurité du système.',
      topicsLabel: 'Topics 105-110 (Weight 60)',
      topicsLabelFr: 'Thèmes 105 à 110 (Poids 60)',
      questionsCount: 60,
      flashcardsCount: 80,
      labsCount: 14,
      examDetails: {
        officialCode: '102-500',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-105',
      flashcardTopicKey: 'topic-105',
      prerequisites: 'Pass Exam 101 (Both needed for LPIC-1)',
      prerequisitesFr: 'Passer l\'examen 101 (101 + 102 requis)',
    },
    'exam-201': {
      id: 'exam-201',
      code: '201-450',
      tierId: 'lpic-2',
      tierLabel: 'LPIC-2 Engineer',
      tierBadgeColor: '#0061a4',
      accentColor: '#0061a4',
      title: 'LPIC-2 Exam 201',
      titleFr: 'LPIC-2 : Examen 201',
      subtitle: 'Capacity Planning, Kernel, Startup, Filesystems & Advanced Storage',
      subtitleFr: 'Planification de capacité, Noyau, Démarrage, Fichiers & RAID/LVM',
      description: 'Validates resource monitoring, kernel compilation, custom init/systemd configurations, advanced RAID, LVM, and device management.',
      descriptionFr: 'Valide la surveillance de capacité, compilation noyau, démarrage avancé, gestion de RAID logiciel, LVM et périphériques.',
      topicsLabel: 'Topics 200-206 (Weight 60)',
      topicsLabelFr: 'Thèmes 200 à 206 (Poids 60)',
      questionsCount: 45,
      flashcardsCount: 65,
      labsCount: 12,
      examDetails: {
        officialCode: '201-450',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-201',
      flashcardTopicKey: 'topic-201',
      prerequisites: 'Active LPIC-1 Certification',
      prerequisitesFr: 'Certification LPIC-1 active obligatoire',
    },
    'exam-202': {
      id: 'exam-202',
      code: '202-450',
      tierId: 'lpic-2',
      tierLabel: 'LPIC-2 Engineer',
      tierBadgeColor: '#0061a4',
      accentColor: '#00838f',
      title: 'LPIC-2 Exam 202',
      titleFr: 'LPIC-2 : Examen 202',
      subtitle: 'Network Services, Web, Mail, File Sharing, Clients & Security',
      subtitleFr: 'DNS BIND, Serveurs Web, Mail, Samba/NFS & Sécurité Réseau',
      description: 'Covers DNS BIND servers, Apache/Nginx web servers, Samba/NFS file sharing, Postfix/Dovecot email, and firewall/OpenVPN setup.',
      descriptionFr: 'Couvre l\'administration de DNS BIND, Apache/Nginx, partages Samba/NFS, serveurs de messagerie et sécurisation réseau/VPN.',
      topicsLabel: 'Topics 207-212 (Weight 60)',
      topicsLabelFr: 'Thèmes 207 à 212 (Poids 60)',
      questionsCount: 45,
      flashcardsCount: 60,
      labsCount: 12,
      examDetails: {
        officialCode: '202-450',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-207',
      flashcardTopicKey: 'topic-207',
      prerequisites: 'Pass Exam 201 (Both needed for LPIC-2)',
      prerequisitesFr: 'Passer l\'examen 201 (201 + 202 requis)',
    },
    'exam-300': {
      id: 'exam-300',
      code: '300-300',
      tierId: 'lpic-3',
      tierLabel: 'LPIC-3 Mixed Environments',
      tierBadgeColor: '#0284c7',
      accentColor: '#0284c7',
      title: 'LPIC-3 Exam 300',
      titleFr: 'LPIC-3 : Examen 300',
      subtitle: 'Mixed Environments (Samba 4 AD DC, OpenLDAP, Kerberos)',
      subtitleFr: 'Environnements mixtes (Samba 4 AD DC, OpenLDAP, Kerberos)',
      description: 'Master enterprise integration: Samba as Active Directory Domain Controller, Winbind, OpenLDAP replication, and Kerberos auth.',
      descriptionFr: 'Maîtrise de l\'intégration hétérogène : Samba en contrôleur de domaine AD, Winbind, annuaires OpenLDAP et Kerberos.',
      topicsLabel: 'Topics 301-306 (Samba, LDAP, PAM)',
      topicsLabelFr: 'Thèmes 301 à 306 (Samba, LDAP, PAM)',
      questionsCount: 30,
      flashcardsCount: 40,
      labsCount: 6,
      examDetails: {
        officialCode: '300-300',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-300',
      flashcardTopicKey: 'topic-300',
      prerequisites: 'Active LPIC-2 Certification',
      prerequisitesFr: 'Certification LPIC-2 active requise',
    },
    'exam-303': {
      id: 'exam-303',
      code: '303-300',
      tierId: 'lpic-3',
      tierLabel: 'LPIC-3 Security',
      tierBadgeColor: '#b45309',
      accentColor: '#b45309',
      title: 'LPIC-3 Exam 303',
      titleFr: 'LPIC-3 : Examen 303',
      subtitle: 'Enterprise Security (Cryptography, Access Control, Hardening)',
      subtitleFr: 'Sécurité Entreprise (Cryptographie, SELinux, Durcissement)',
      description: 'Covers PKI/OpenSSL certificates, SELinux/AppArmor mandatory access control, network intrusion detection, and host hardening.',
      descriptionFr: 'Couvre l\'infrastructure PKI/OpenSSL, contrôle d\'accès obligatoire SELinux/AppArmor, détection d\'intrusion et durcissement système.',
      topicsLabel: 'Topics 325-328 (PKI, SELinux, Hardening)',
      topicsLabelFr: 'Thèmes 325 à 328 (PKI, SELinux, Durcissement)',
      questionsCount: 35,
      flashcardsCount: 45,
      labsCount: 8,
      examDetails: {
        officialCode: '303-300',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-303',
      flashcardTopicKey: 'topic-303',
      prerequisites: 'Active LPIC-2 Certification',
      prerequisitesFr: 'Certification LPIC-2 active requise',
    },
    'exam-305': {
      id: 'exam-305',
      code: '305-300',
      tierId: 'lpic-3',
      tierLabel: 'LPIC-3 Virtualization',
      tierBadgeColor: '#059669',
      accentColor: '#059669',
      title: 'LPIC-3 Exam 305',
      titleFr: 'LPIC-3 : Examen 305',
      subtitle: 'Virtualization & Containerization (QEMU/KVM, LXC, Docker)',
      subtitleFr: 'Virtualisation & Conteneurs (QEMU/KVM, LXC, Docker)',
      description: 'Covers hardware-assisted virtualization (KVM, Libvirt, QEMU), container engines (LXC, Docker, Podman), and cloud deployments.',
      descriptionFr: 'Couvre la virtualisation matérielle (KVM, Libvirt, QEMU), l\'orchestration de conteneurs (LXC, Docker, Podman) et déploiements cloud.',
      topicsLabel: 'Topics 351-353 (KVM, LXC, Docker)',
      topicsLabelFr: 'Thèmes 351 à 353 (KVM, LXC, Docker)',
      questionsCount: 35,
      flashcardsCount: 45,
      labsCount: 8,
      examDetails: {
        officialCode: '305-300',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-305',
      flashcardTopicKey: 'topic-305',
      prerequisites: 'Active LPIC-2 Certification',
      prerequisitesFr: 'Certification LPIC-2 active requise',
    },
    'exam-306': {
      id: 'exam-306',
      code: '306-300',
      tierId: 'lpic-3',
      tierLabel: 'LPIC-3 High Availability',
      tierBadgeColor: '#7c3aed',
      accentColor: '#7c3aed',
      title: 'LPIC-3 Exam 306',
      titleFr: 'LPIC-3 : Examen 306',
      subtitle: 'High Availability & Storage Clusters (Pacemaker, Corosync, Ceph)',
      subtitleFr: 'Haute Disponibilité & Stockage Cluster (Pacemaker, Ceph, DRBD)',
      description: 'Covers multi-node clustering with Pacemaker and Corosync, DRBD block-level replication, shared cluster filesystems, and Ceph.',
      descriptionFr: 'Couvre le clustering Pacemaker/Corosync, la réplication de blocs DRBD, les systèmes de fichiers partagés et le stockage distribué Ceph.',
      topicsLabel: 'Topics 361-364 (Pacemaker, Corosync, Ceph)',
      topicsLabelFr: 'Thèmes 361 à 364 (Pacemaker, Corosync, Ceph)',
      questionsCount: 30,
      flashcardsCount: 40,
      labsCount: 7,
      examDetails: {
        officialCode: '306-300',
        durationMinutes: 90,
        totalOfficialQuestions: 60,
        passingScore: '500 / 800 (70%)',
      },
      defaultTopicId: 'topic-306',
      flashcardTopicKey: 'topic-306',
      prerequisites: 'Active LPIC-2 Certification',
      prerequisitesFr: 'Certification LPIC-2 active requise',
    },
  };

  const results: Record<string, LearningMapNodeData> = {};

  // Compute unlock conditions:
  // LPIC-1 101 is unlocked by default
  // LPIC-1 102 is unlocked by default
  // LPIC-2 requires LPIC-1 (both 101 & 102 completed or progress > 0)
  // LPIC-3 requires LPIC-2
  const lpic1Progression = (
    computeNodeMetrics('exam-101', masteredObjectiveIds, essentialsPassed).progressionPct +
    computeNodeMetrics('exam-102', masteredObjectiveIds, essentialsPassed).progressionPct
  ) / 2;

  const lpic2Progression = (
    computeNodeMetrics('exam-201', masteredObjectiveIds, essentialsPassed).progressionPct +
    computeNodeMetrics('exam-202', masteredObjectiveIds, essentialsPassed).progressionPct
  ) / 2;

  for (const [id, def] of Object.entries(nodeDefs)) {
    const metrics = computeNodeMetrics(id, masteredObjectiveIds, essentialsPassed);

    let isUnlocked = true;
    if (def.tierId === 'lpic-2') {
      isUnlocked = lpic1Progression >= 20; // Unlocks as user starts LPIC-1 or has experience
    } else if (def.tierId === 'lpic-3') {
      isUnlocked = lpic2Progression >= 20;
    }

    const readinessLabels = {
      not_started: { en: 'Not Started', fr: 'Non démarré' },
      needs_work: { en: 'Needs Work', fr: 'À consolider' },
      on_track: { en: 'On Track', fr: 'En bonne voie' },
      ready: { en: 'Exam Ready', fr: 'Prêt pour l\'examen' },
    };

    results[id] = {
      ...def,
      progressionPct: metrics.progressionPct,
      masteredObjectivesCount: metrics.masteredObjectives,
      totalObjectivesCount: metrics.totalObjectives,
      readinessPct: metrics.readinessPct,
      readinessStatus: metrics.readinessStatus,
      readinessLabel: readinessLabels[metrics.readinessStatus].en,
      readinessLabelFr: readinessLabels[metrics.readinessStatus].fr,
      isUnlocked,
    };
  }

  return results;
}
