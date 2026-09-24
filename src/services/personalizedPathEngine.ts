import {
  CertificationGoal,
  DailyTrainingItem,
  DayStepSummary,
  PersonalizedPathConfig,
  PersonalizedLearningPathState,
  DiagnosticResult,
  LPICObjective,
} from '../types';
import { allLpicTopicsData } from '../data/lpicObjectivesData';
import { simulatedLabScenarios } from '../services/virtualFs/labScenarios';
import { allPracticeQuestions } from '../data/practiceExamsData';
import { flashcardsData } from '../data/lpiData';
import { getStoredDiagnosticResult } from '../data/diagnosticExamData';
import { getCompletedLabIds } from '../services/virtualFs/labProgress';

export const PERSONALIZED_PATH_STORAGE_KEY = 'lpic_personalized_path_config';
export const PERSONALIZED_PATH_COMPLETIONS_KEY = 'lpic_personalized_path_completed_tasks';

export interface CertificationGoalOption {
  id: CertificationGoal;
  name: string;
  nameFr: string;
  category: 'Linux Essentials' | 'LPIC-1' | 'LPIC-2' | 'LPIC-3';
  examId: string;
  examCode: string;
  description: string;
  descriptionFr: string;
  totalObjectivesCount: number;
}

export const CERTIFICATION_GOALS: CertificationGoalOption[] = [
  {
    id: 'lpic-1-101',
    name: 'LPIC-1: Exam 101',
    nameFr: 'LPIC-1 : Examen 101 (Architecture, GNU, Filesystems)',
    category: 'LPIC-1',
    examId: 'exam-101',
    examCode: '101-500',
    description: 'Hardware, system boot, GRUB2, systemd, package management, Unix CLI commands, filesystems, and FHS.',
    descriptionFr: 'Matériel, boot, GRUB2, cibles systemd, paquets (dpkg/rpm), commandes GNU/Unix et systèmes de fichiers.',
    totalObjectivesCount: 30,
  },
  {
    id: 'lpic-1-102',
    name: 'LPIC-1: Exam 102',
    nameFr: 'LPIC-1 : Examen 102 (Shell, Réseau, Sécurité)',
    category: 'LPIC-1',
    examId: 'exam-102',
    examCode: '102-500',
    description: 'Shell scripting, SQL data management, user interfaces, administrative tasks, networking, and security.',
    descriptionFr: 'Scripts Bash, requêtes SQL, interfaces graphiques, tâches d\'administration, réseau et sécurité système.',
    totalObjectivesCount: 30,
  },
  {
    id: 'lpic-1',
    name: 'LPIC-1: Full Certification (101 + 102)',
    nameFr: 'LPIC-1 : Cursus complet (Examens 101 & 102)',
    category: 'LPIC-1',
    examId: 'exam-101',
    examCode: '101-500 & 102-500',
    description: 'Complete Linux Administrator certification covering all 60 official syllabus objectives across both exams.',
    descriptionFr: 'Certification complète Administrateur Linux validant les 60 objectifs officiels des deux examens.',
    totalObjectivesCount: 60,
  },
  {
    id: 'lpic-2-201',
    name: 'LPIC-2: Exam 201',
    nameFr: 'LPIC-2 : Examen 201 (Kernel, Stockage, Réseau Avancé)',
    category: 'LPIC-2',
    examId: 'exam-201',
    examCode: '201-450',
    description: 'Capacity planning, Linux kernel compilation & patching, system startup, storage & file systems (RAID/LVM), and network configuration.',
    descriptionFr: 'Planification de capacité, noyau Linux, amorçage système, stockage avancé RAID/LVM et routage réseau.',
    totalObjectivesCount: 22,
  },
  {
    id: 'lpic-2-202',
    name: 'LPIC-2: Exam 202',
    nameFr: 'LPIC-2 : Examen 202 (Services Réseau, Sécurité, Mail)',
    category: 'LPIC-2',
    examId: 'exam-202',
    examCode: '202-450',
    description: 'Web servers (Apache/Nginx), Samba & NFS, DNS (BIND9), DHCP, email (Postfix/Dovecot), OpenVPN, and system security.',
    descriptionFr: 'Serveurs Web (Apache/Nginx), partages Samba & NFS, DNS BIND, DHCP, messagerie électronique et pare-feu.',
    totalObjectivesCount: 24,
  },
  {
    id: 'lpic-2',
    name: 'LPIC-2: Full Certification (201 + 202)',
    nameFr: 'LPIC-2 : Cursus complet Ingénieur Linux',
    category: 'LPIC-2',
    examId: 'exam-201',
    examCode: '201-450 & 202-450',
    description: 'Full Linux Engineer certification combining system core expertise and mission-critical network services.',
    descriptionFr: 'Certification Ingénieur Linux complète réunissant l\'expertise système bas niveau et les services réseau de production.',
    totalObjectivesCount: 46,
  },
  {
    id: 'lpic-3-305',
    name: 'LPIC-3: 305 Virtualization & Containers',
    nameFr: 'LPIC-3 305 : Virtualisation & Conteneurs (Docker, KVM, LXC)',
    category: 'LPIC-3',
    examId: 'exam-305',
    examCode: '305-300',
    description: 'Enterprise full virtualization with QEMU/KVM, container engines (Docker/Podman/LXC), and cloud virtualization.',
    descriptionFr: 'Virtualisation d\'entreprise avec QEMU/KVM, conteneurs Docker/Podman/LXC et déploiements cloud.',
    totalObjectivesCount: 20,
  },
  {
    id: 'lpic-3-303',
    name: 'LPIC-3: 303 Enterprise Security',
    nameFr: 'LPIC-3 303 : Sécurité Entreprise & Durcissement (SELinux, PKI)',
    category: 'LPIC-3',
    examId: 'exam-303',
    examCode: '303-300',
    description: 'Enterprise cryptography, PKI, digital certificates, Mandatory Access Control (SELinux/AppArmor), network hardening, and audit.',
    descriptionFr: 'Cryptographie d\'entreprise, autorité PKI, contrôle d\'accès obligatoire (SELinux/AppArmor) et audit de sécurité.',
    totalObjectivesCount: 20,
  },
  {
    id: 'lpic-3-306',
    name: 'LPIC-3: 306 High Availability & Storage',
    nameFr: 'LPIC-3 306 : Haute Disponibilité & Clusters (Pacemaker, Ceph)',
    category: 'LPIC-3',
    examId: 'exam-306',
    examCode: '306-300',
    description: 'High availability clustering (Pacemaker/Corosync), replicated block devices (DRBD), and distributed storage clusters (Ceph).',
    descriptionFr: 'Clusters haute disponibilité (Pacemaker/Corosync), réplication DRBD et systèmes de fichiers distribués Ceph.',
    totalObjectivesCount: 18,
  },
  {
    id: 'lpic-3-300',
    name: 'LPIC-3: 300 Mixed Environment & Samba',
    nameFr: 'LPIC-3 300 : Environnements Mixtes & Samba AD',
    category: 'LPIC-3',
    examId: 'exam-300',
    examCode: '300-100',
    description: 'OpenLDAP directories, Samba as Active Directory Domain Controller, Kerberos authentication, and unified Linux-Windows domains.',
    descriptionFr: 'Annuaires OpenLDAP, Samba comme contrôleur de domaine Active Directory, Kerberos et interopérabilité Windows.',
    totalObjectivesCount: 18,
  },
  {
    id: 'essentials',
    name: 'Linux Essentials Certificate',
    nameFr: 'Certificat Linux Essentials (010-160)',
    category: 'Linux Essentials',
    examId: 'exam-010',
    examCode: '010-160',
    description: 'Foundations of Linux, open-source culture, basic command line navigation, and introductory security concepts.',
    descriptionFr: 'Fondations de Linux, culture de l\'Open Source, ligne de commande fondamentale et sécurité d\'initiation.',
    totalObjectivesCount: 18,
  },
];

// Helper to compute default target date (e.g. 45 days from today)
export function getDefaultTargetDate(daysAhead = 45): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// Retrieve saved config or provide high quality smart default
export function getStoredPersonalizedPathConfig(): PersonalizedPathConfig {
  try {
    const raw = localStorage.getItem(PERSONALIZED_PATH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.goal) {
        return parsed;
      }
    }
  } catch {}

  const diag = getStoredDiagnosticResult();
  const defaultOption = CERTIFICATION_GOALS[0]; // LPIC-1 101

  return {
    goal: 'lpic-1-101',
    goalTitle: defaultOption.name,
    goalTitleFr: defaultOption.nameFr,
    targetExamId: 'exam-101',
    dailyMinutes: 30,
    targetDate: getDefaultTargetDate(45),
    initialDiagnosticScore: diag ? diag.percentage : 60,
    hasTakenDiagnostic: !!diag,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function savePersonalizedPathConfig(config: PersonalizedPathConfig): void {
  try {
    localStorage.setItem(
      PERSONALIZED_PATH_STORAGE_KEY,
      JSON.stringify({
        ...config,
        updatedAt: new Date().toISOString(),
      })
    );
    // Also sync the global active cert target
    if (config.goal.startsWith('lpic-1')) {
      localStorage.setItem('lpi_current_target', 'LPIC-1');
    } else if (config.goal.startsWith('lpic-2')) {
      localStorage.setItem('lpi_current_target', 'LPIC-2');
    } else if (config.goal === 'lpic-3-305') {
      localStorage.setItem('lpi_current_target', 'LPIC-3 (305)');
    } else if (config.goal === 'lpic-3-303') {
      localStorage.setItem('lpi_current_target', 'LPIC-3 (303)');
    } else if (config.goal === 'lpic-3-306') {
      localStorage.setItem('lpi_current_target', 'LPIC-3 (306)');
    } else if (config.goal === 'lpic-3-300') {
      localStorage.setItem('lpi_current_target', 'LPIC-3 (300)');
    } else if (config.goal === 'essentials') {
      localStorage.setItem('lpi_current_target', 'Linux Essentials');
    }

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('lpic_path_updated', { detail: config }));
  } catch (e) {
    console.error('Failed to save personalized path config', e);
  }
}

// Track completion of daily tasks
export function getCompletedTaskIds(): string[] {
  try {
    const raw = localStorage.getItem(PERSONALIZED_PATH_COMPLETIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function toggleTaskCompleted(taskId: string): string[] {
  const current = getCompletedTaskIds();
  const next = current.includes(taskId)
    ? current.filter((id) => id !== taskId)
    : [...current, taskId];
  try {
    localStorage.setItem(PERSONALIZED_PATH_COMPLETIONS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('lpic_task_completed', { detail: { taskId, all: next } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error(e);
  }
  return next;
}

// Helper to find best lab matching an objective
function findMatchingLabForObjective(objectiveId: string): string | undefined {
  const lab = simulatedLabScenarios.find((s) => {
    // Check if goal or solution mentions objective keywords
    if (objectiveId === '101.1' && s.id.includes('chmod')) return true;
    if (objectiveId === '101.2' && s.category === 'processes') return true;
    if (objectiveId === '103.1' && s.id.includes('filter')) return true;
    if (objectiveId === '103.2' && s.id.includes('filter')) return true;
    if (objectiveId === '104.1' && s.id.includes('fstab')) return true;
    if (objectiveId === '104.3' && s.id.includes('fstab')) return true;
    if (objectiveId === '109.1' && s.category === 'network') return true;
    if (objectiveId === '109.2' && s.category === 'network') return true;
    if (objectiveId.startsWith('104') && s.category === 'storage') return true;
    if (objectiveId.startsWith('110') && (s.category === 'security' || s.category === 'permissions')) return true;
    return false;
  });
  return lab ? lab.id : simulatedLabScenarios[0]?.id;
}

// Main syllabus sequencing & personalized path state calculator
export function calculatePersonalizedLearningPath(
  config: PersonalizedPathConfig,
  masteredObjectiveIds: string[],
  diagnosticResult: DiagnosticResult | null,
  completedTaskIds: string[]
): PersonalizedLearningPathState {
  // 1. Identify all objectives for this goal
  let candidateTopics = allLpicTopicsData;

  if (config.goal === 'lpic-1-101') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-101');
  } else if (config.goal === 'lpic-1-102') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-102');
  } else if (config.goal === 'lpic-1') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-101' || t.examId === 'exam-102');
  } else if (config.goal === 'lpic-2-201') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-201');
  } else if (config.goal === 'lpic-2-202') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-202');
  } else if (config.goal === 'lpic-2') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-201' || t.examId === 'exam-202');
  } else if (config.goal === 'lpic-3-305') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-305');
  } else if (config.goal === 'lpic-3-303') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-303');
  } else if (config.goal === 'lpic-3-306') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-306');
  } else if (config.goal === 'lpic-3-300') {
    candidateTopics = allLpicTopicsData.filter((t) => t.examId === 'exam-300');
  } else if (config.goal === 'essentials') {
    // Linux Essentials objectives
    candidateTopics = allLpicTopicsData.filter((t) => (t.examId as string) === 'exam-010' || t.id.includes('topic-101') || t.id.includes('topic-103'));
  }

  const allRelevantObjectives: (LPICObjective & { parentTopicNumber: number; parentTopicId: string; examId?: string })[] = [];
  candidateTopics.forEach((t) => {
    t.objectives.forEach((obj) => {
      allRelevantObjectives.push({
        ...obj,
        parentTopicNumber: t.topicNumber || 101,
        parentTopicId: t.id,
        examId: t.examId,
      });
    });
  });

  const totalObjectivesCount = Math.max(allRelevantObjectives.length, 1);
  const masteredRelevantCount = allRelevantObjectives.filter((o) =>
    masteredObjectiveIds.includes(o.id)
  ).length;

  // 2. Prioritize objectives based on:
  // - If not mastered
  // - If in Diagnostic top priorities (boost priority)
  // - Objective official weight (higher weight first)
  const prioritizedObjectives = [...allRelevantObjectives].sort((a, b) => {
    const aMastered = masteredObjectiveIds.includes(a.id);
    const bMastered = masteredObjectiveIds.includes(b.id);
    if (aMastered !== bMastered) return aMastered ? 1 : -1;

    // Check diagnostic priority domain
    let aPrioBonus = 0;
    let bPrioBonus = 0;
    if (diagnosticResult?.topPriorities) {
      const aRank = diagnosticResult.topPriorities.findIndex(
        (p) => p.associatedTopicNumber === a.parentTopicNumber
      );
      if (aRank !== -1) aPrioBonus = (3 - aRank) * 10;

      const bRank = diagnosticResult.topPriorities.findIndex(
        (p) => p.associatedTopicNumber === b.parentTopicNumber
      );
      if (bRank !== -1) bPrioBonus = (3 - bRank) * 10;
    }

    const aScore = a.weight + aPrioBonus;
    const bScore = b.weight + bPrioBonus;
    return bScore - aScore;
  });

  // Calculate days remaining to target date
  const targetDateObj = new Date(config.targetDate);
  const nowObj = new Date();
  const diffTime = targetDateObj.getTime() - nowObj.getTime();
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calculate composite progress %:
  // Combination of:
  // - Objectives mastered (45%)
  // - Initial diagnostic baseline (25%)
  // - Labs and training completed (20%)
  // - Completed path tasks (10%)
  const objPct = (masteredRelevantCount / totalObjectivesCount) * 100;
  const initialBase = config.hasTakenDiagnostic ? config.initialDiagnosticScore * 0.25 : 15;
  const completedLabs = getCompletedLabIds().length;
  const labsContribution = Math.min(20, (completedLabs / Math.max(1, simulatedLabScenarios.length)) * 20);
  const tasksContribution = Math.min(10, completedTaskIds.length * 2);

  const rawEstimatedProgress = Math.round(objPct * 0.45 + initialBase + labsContribution + tasksContribution);
  const estimatedProgressPct = Math.min(100, Math.max(0, rawEstimatedProgress));

  // 3. Determine current active objective for TODAY
  // The first unmastered objective (or first objective if all mastered)
  const currentObjective = prioritizedObjectives.find((o) => !masteredObjectiveIds.includes(o.id)) || prioritizedObjectives[0];

  const objId = currentObjective?.id || '101.2';
  const objTitle = currentObjective?.title || 'BIOS/UEFI & Boot Sequence';
  const objWeight = currentObjective?.weight || 3;
  const topicNum = currentObjective?.parentTopicNumber || 101;
  const topicId = currentObjective?.parentTopicId || 'topic-101';
  const examId = currentObjective?.examId || 'exam-101';

  // Count available flashcards for this topic or overall
  const topicFlashcards = flashcardsData.filter(
    (c) => c.topicNumber === topicNum || c.id.toString().includes(topicNum.toString())
  );
  const cardCount = topicFlashcards.length > 0 ? Math.min(12, topicFlashcards.length) : 12;

  // Count available targeted questions
  const topicQuestions = allPracticeQuestions.filter(
    (q) => q.examId === examId || q.category.includes(topicNum.toString())
  );
  const questionCount = topicQuestions.length > 0 ? Math.min(10, topicQuestions.length) : 10;

  const matchingLabId = findMatchingLabForObjective(objId);

  // Today's 4 core quad-tasks matching user's requested blueprint:
  // 📚 1. Réviser l'objectif
  // 🧠 2. Flashcards
  // 💻 3. Mini-lab pratique
  // 📝 4. Questions ciblées
  const todayTasks: DailyTrainingItem[] = [
    {
      id: `task-concept-${objId}`,
      type: 'concept',
      title: `Réviser ${objId} — ${objTitle}`,
      titleFr: `Réviser ${objId} — ${objTitle}`,
      subtitle: `Syllabus officiel • Poids LPI: ${objWeight}`,
      subtitleFr: `Syllabus officiel • Poids LPI : ${objWeight}`,
      targetObjectiveId: objId,
      targetTopicNumber: topicNum,
      estimatedMinutes: Math.round(config.dailyMinutes * 0.3),
      completed: completedTaskIds.includes(`task-concept-${objId}`),
      navTarget: 'learning',
      navPayload: { topicId },
    },
    {
      id: `task-flashcards-${objId}`,
      type: 'flashcards',
      title: `${cardCount} flashcards ciblées`,
      titleFr: `${cardCount} flashcards ciblées`,
      subtitle: `Ancrage SRS & commandes clés du Topic ${topicNum}`,
      subtitleFr: `Ancrage SRS & commandes clés du Topic ${topicNum}`,
      targetObjectiveId: objId,
      targetTopicNumber: topicNum,
      estimatedMinutes: Math.round(config.dailyMinutes * 0.25),
      count: cardCount,
      completed: completedTaskIds.includes(`task-flashcards-${objId}`),
      navTarget: 'flashcards',
      navPayload: { topicId },
    },
    {
      id: `task-lab-${objId}`,
      type: 'lab',
      title: `1 mini-lab pratique en terminal`,
      titleFr: `1 mini-lab pratique en terminal`,
      subtitle: 'Environnement virtuel avec validation en temps réel',
      subtitleFr: 'Environnement virtuel avec validation en temps réel',
      targetObjectiveId: objId,
      targetTopicNumber: topicNum,
      estimatedMinutes: Math.round(config.dailyMinutes * 0.25),
      count: 1,
      completed: completedTaskIds.includes(`task-lab-${objId}`),
      navTarget: 'training',
      navPayload: { scenarioId: matchingLabId },
    },
    {
      id: `task-questions-${objId}`,
      type: 'questions',
      title: `${questionCount} questions d'entraînement ciblées`,
      titleFr: `${questionCount} questions d'entraînement ciblées`,
      subtitle: `Quiz de validation de niveau pour l'objectif ${objId}`,
      subtitleFr: `Quiz de validation de niveau pour l'objectif ${objId}`,
      targetObjectiveId: objId,
      targetTopicNumber: topicNum,
      estimatedMinutes: Math.round(config.dailyMinutes * 0.2),
      count: questionCount,
      completed: completedTaskIds.includes(`task-questions-${objId}`),
      navTarget: 'practice',
      navPayload: { examId },
    },
  ];

  const allTodayDone = todayTasks.every((t) => t.completed);

  // 4. Generate upcoming days preview (next 4 days)
  const upcomingDays: DayStepSummary[] = [];
  const futureCandidates = prioritizedObjectives.filter((o) => o.id !== objId);

  for (let i = 0; i < Math.min(4, futureCandidates.length); i++) {
    const futureObj = futureCandidates[i];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (i + 1));
    const dateStr = futureDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    upcomingDays.push({
      date: dateStr,
      dayNumber: i + 2,
      objectiveId: futureObj.id,
      objectiveTitle: futureObj.title,
      isCurrentDay: false,
      isCompleted: masteredObjectiveIds.includes(futureObj.id),
      items: [
        {
          id: `future-concept-${futureObj.id}`,
          type: 'concept',
          title: `Objectif ${futureObj.id}`,
          titleFr: `Objectif ${futureObj.id}`,
          subtitle: futureObj.title,
          subtitleFr: futureObj.title,
          targetObjectiveId: futureObj.id,
          targetTopicNumber: futureObj.parentTopicNumber,
          estimatedMinutes: 10,
          completed: false,
          navTarget: 'learning',
        },
        {
          id: `future-quiz-${futureObj.id}`,
          type: 'questions',
          title: `Quiz ciblé (${futureObj.id})`,
          titleFr: `Quiz ciblé (${futureObj.id})`,
          subtitle: `Poids: ${futureObj.weight}`,
          subtitleFr: `Poids : ${futureObj.weight}`,
          targetObjectiveId: futureObj.id,
          targetTopicNumber: futureObj.parentTopicNumber,
          estimatedMinutes: 15,
          count: 10,
          completed: false,
          navTarget: 'practice',
        },
      ],
    });
  }

  // 5. Readiness status
  let readinessStatus: 'not_started' | 'needs_work' | 'on_track' | 'ready' = 'not_started';
  if (estimatedProgressPct >= 80) readinessStatus = 'ready';
  else if (estimatedProgressPct >= 50) readinessStatus = 'on_track';
  else if (estimatedProgressPct > 15) readinessStatus = 'needs_work';

  return {
    config,
    estimatedProgressPct,
    masteredObjectivesCount: masteredRelevantCount,
    totalObjectivesCount,
    daysRemaining,
    todayPlan: {
      objectiveId: objId,
      objectiveTitle: objTitle,
      objectiveWeight: objWeight,
      tasks: todayTasks,
      allDone: allTodayDone,
    },
    upcomingDays,
    recommendedExamDate: config.targetDate,
    readinessStatus,
  };
}
