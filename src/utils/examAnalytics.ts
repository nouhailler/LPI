import { PracticeQuestion } from '../types';
import { PracticeExamInfo, practiceExamsRegistry } from '../data/practiceExamsData';

export interface ExamDomainScore {
  domainId: string;
  domainName: string;
  shortName: string;
  weight: number;
  totalQuestions: number;
  correctCount: number;
  unansweredCount: number;
  flaggedCount: number;
  percentage: number;
  status: 'mastered' | 'solid' | 'needs_work' | 'critical';
}

export interface ExamRiskFactor {
  id: string;
  severity: 'critical' | 'warning' | 'advisory';
  title: string;
  evidence: string;
  impact: string;
  recommendation: string;
  domainName?: string;
}

export interface ExamSessionAnalytics {
  examId: string;
  examCode: string;
  examTitle: string;
  scorePct: number;
  weightedScorePct: number;
  estimatedLpiScore: number; // 200 - 800 scale (pass is 500)
  passed: boolean;
  passThresholdPct: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  flaggedCount: number;
  flaggedErrorsCount: number;
  questionsToReviewCount: number;
  totalDurationSeconds: number;
  averageTimePerQuestionSeconds: number;
  rushedErrorsCount: number; // questions answered in < 15s with wrong answer
  stalledQuestionsCount: number; // questions taking > 90s
  domainScores: ExamDomainScore[];
  riskFactors: ExamRiskFactor[];
  actionPlan: {
    priority: number;
    title: string;
    description: string;
    badge: string;
  }[];
}

/**
 * Shuffles an array with Fisher-Yates algorithm
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles questions and optionally their options while tracking the correct index
 */
export function shuffleExamQuestions(questions: PracticeQuestion[], shuffleOptions = false): PracticeQuestion[] {
  const shuffledQuestions = shuffleArray(questions);
  if (!shuffleOptions) return shuffledQuestions;

  return shuffledQuestions.map((q) => {
    const originalOptions = q.options;
    const correctText = originalOptions[q.correctIndex];
    const shuffledOpts = shuffleArray(originalOptions);
    const newCorrectIndex = shuffledOpts.indexOf(correctText);

    return {
      ...q,
      options: shuffledOpts,
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : q.correctIndex,
    };
  });
}

/**
 * Maps a question to its corresponding exam topic/domain
 */
export function matchQuestionToTopic(
  question: PracticeQuestion,
  examInfo: PracticeExamInfo
): { id: string; name: string; nameFr: string; shortName: string; weight: number } {
  const cat = (question.category || '').toLowerCase();
  const qText = (question.question || '').toLowerCase();

  // Try matching with examInfo.topics
  for (const topic of examInfo.topics) {
    const topicIdNum = topic.id.replace('topic-', '');
    if (
      cat.includes(topicIdNum) ||
      cat.includes(topic.name.toLowerCase()) ||
      cat.includes(topic.nameFr.toLowerCase())
    ) {
      const shortName = deriveShortName(topic.name, topic.nameFr);
      return { ...topic, shortName };
    }
  }

  // Keyword heuristic fallbacks
  if (cat.includes('architecture') || cat.includes('boot') || cat.includes('matériel') || cat.includes('systemd') || cat.includes('101')) {
    const found = examInfo.topics.find((t) => t.id.includes('101')) || examInfo.topics[0];
    return { ...found, shortName: 'Architecture' };
  }
  if (cat.includes('paquet') || cat.includes('package') || cat.includes('install') || cat.includes('dpkg') || cat.includes('rpm') || cat.includes('102')) {
    const found = examInfo.topics.find((t) => t.id.includes('102')) || examInfo.topics[1] || examInfo.topics[0];
    return { ...found, shortName: 'Installation & Paquets' };
  }
  if (cat.includes('command') || cat.includes('gnu') || cat.includes('texte') || cat.includes('regex') || cat.includes('103')) {
    const found = examInfo.topics.find((t) => t.id.includes('103')) || examInfo.topics[2] || examInfo.topics[0];
    return { ...found, shortName: 'Commands' };
  }
  if (cat.includes('filesystem') || cat.includes('fhs') || cat.includes('fichier') || cat.includes('stockage') || cat.includes('disque') || cat.includes('104')) {
    const found = examInfo.topics.find((t) => t.id.includes('104')) || examInfo.topics[3] || examInfo.topics[0];
    return { ...found, shortName: 'Filesystem' };
  }
  if (cat.includes('shell') || cat.includes('script') || cat.includes('bash') || cat.includes('105')) {
    const found = examInfo.topics.find((t) => t.id.includes('105')) || examInfo.topics[0];
    return { ...found, shortName: 'Shell & Scripting' };
  }
  if (cat.includes('admin') || cat.includes('tâche') || cat.includes('cron') || cat.includes('user') || cat.includes('107')) {
    const found = examInfo.topics.find((t) => t.id.includes('107')) || examInfo.topics[1] || examInfo.topics[0];
    return { ...found, shortName: 'Administration' };
  }
  if (cat.includes('service') || cat.includes('syslog') || cat.includes('journal') || cat.includes('108')) {
    const found = examInfo.topics.find((t) => t.id.includes('108')) || examInfo.topics[2] || examInfo.topics[0];
    return { ...found, shortName: 'Services système' };
  }
  if (cat.includes('réseau') || cat.includes('network') || cat.includes('ip') || cat.includes('routing') || cat.includes('109') || cat.includes('205') || cat.includes('210')) {
    const found = examInfo.topics.find((t) => t.id.includes('109') || t.id.includes('205') || t.id.includes('210')) || examInfo.topics[0];
    return { ...found, shortName: 'Networking' };
  }
  if (cat.includes('sécurité') || cat.includes('security') || cat.includes('firewall') || cat.includes('ssh') || cat.includes('110') || cat.includes('212') || cat.includes('303')) {
    const found = examInfo.topics.find((t) => t.id.includes('110') || t.id.includes('212') || t.id.includes('303')) || examInfo.topics[0];
    return { ...found, shortName: 'Security' };
  }

  // Fallback to first topic in registry for this exam
  const defaultTopic = examInfo.topics[0] || {
    id: 'general',
    name: 'General Objectives',
    nameFr: 'Objectifs généraux',
    weight: 10,
  };
  return { ...defaultTopic, shortName: deriveShortName(defaultTopic.name, defaultTopic.nameFr) };
}

function deriveShortName(nameEn: string, nameFr: string): string {
  const combined = `${nameEn} ${nameFr}`.toLowerCase();
  if (combined.includes('architecture')) return 'Architecture';
  if (combined.includes('package') || combined.includes('paquet')) return 'Installation & Paquets';
  if (combined.includes('command')) return 'Commands';
  if (combined.includes('filesystem') || combined.includes('système de fichier') || combined.includes('stockage')) return 'Filesystem';
  if (combined.includes('network') || combined.includes('réseau')) return 'Networking';
  if (combined.includes('security') || combined.includes('sécurité')) return 'Security';
  if (combined.includes('shell') || combined.includes('script')) return 'Shell & Scripting';
  if (combined.includes('storage') || combined.includes('lvm') || combined.includes('raid')) return 'Storage & LVM';
  if (combined.includes('kernel') || combined.includes('noyau')) return 'Kernel';
  if (combined.includes('dns') || combined.includes('bind')) return 'DNS (BIND)';
  if (combined.includes('web') || combined.includes('apache') || combined.includes('nginx')) return 'Web Services';
  if (combined.includes('container') || combined.includes('docker')) return 'Containers';
  if (combined.includes('virtualization') || combined.includes('kvm')) return 'Virtualization';
  if (combined.includes('cluster') || combined.includes('ha') || combined.includes('haute disponibilité')) return 'HA Clusters';
  if (combined.includes('ldap') || combined.includes('samba') || combined.includes('directory')) return 'Directory & Samba';

  // Fallback: trim title
  const clean = nameFr.replace(/^Thème \d+\s*:\s*/i, '').replace(/^Topic \d+\s*:\s*/i, '');
  return clean.length > 22 ? clean.substring(0, 20) + '…' : clean;
}

/**
 * Calculates complete post-exam analytics based STRICTLY on actual session metrics
 */
export function computeExamSessionAnalytics(params: {
  examId: string;
  questions: PracticeQuestion[];
  userAnswers: Record<number, number>;
  flaggedQuestions: Record<number, boolean>;
  questionTimes: Record<number, number>; // questionId -> seconds spent
  totalTimeElapsedSeconds: number;
  isFrench: boolean;
}): ExamSessionAnalytics {
  const {
    examId,
    questions,
    userAnswers,
    flaggedQuestions,
    questionTimes,
    totalTimeElapsedSeconds,
    isFrench,
  } = params;

  const examInfo: PracticeExamInfo =
    practiceExamsRegistry.find((e) => e.id === examId) || practiceExamsRegistry[1];

  const totalQuestions = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let flaggedCount = 0;
  let flaggedErrorsCount = 0;
  let rushedErrorsCount = 0;
  let stalledQuestionsCount = 0;

  // Domain aggregations
  const domainMap = new Map<
    string,
    {
      id: string;
      name: string;
      shortName: string;
      weight: number;
      total: number;
      correct: number;
      unanswered: number;
      flagged: number;
    }
  >();

  // Initialize all official topics for this exam
  examInfo.topics.forEach((t) => {
    const shortName = deriveShortName(t.name, t.nameFr);
    domainMap.set(t.id, {
      id: t.id,
      name: isFrench ? t.nameFr : t.name,
      shortName,
      weight: t.weight,
      total: 0,
      correct: 0,
      unanswered: 0,
      flagged: 0,
    });
  });

  questions.forEach((q) => {
    const isAnswered = userAnswers[q.id] !== undefined;
    const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
    const isFlagged = !!flaggedQuestions[q.id];
    const timeSpent = questionTimes[q.id] || 0;

    if (isFlagged) flaggedCount++;

    if (!isAnswered) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
      if (isFlagged) flaggedErrorsCount++;
      if (timeSpent < 15) rushedErrorsCount++;
    }

    if (timeSpent > 90) {
      stalledQuestionsCount++;
    }

    // Match topic
    const topic = matchQuestionToTopic(q, examInfo);
    let entry = domainMap.get(topic.id);
    if (!entry) {
      entry = {
        id: topic.id,
        name: isFrench ? topic.nameFr : topic.name,
        shortName: topic.shortName,
        weight: topic.weight,
        total: 0,
        correct: 0,
        unanswered: 0,
        flagged: 0,
      };
      domainMap.set(topic.id, entry);
    }

    entry.total++;
    if (isCorrect) entry.correct++;
    if (!isAnswered) entry.unanswered++;
    if (isFlagged) entry.flagged++;
  });

  // Calculate raw score
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Calculate domain scores & weighted composite score
  const domainScores: ExamDomainScore[] = [];
  let weightedNumerator = 0;
  let weightedDenominator = 0;

  domainMap.forEach((entry) => {
    if (entry.total > 0) {
      const percentage = Math.round((entry.correct / entry.total) * 100);
      let status: ExamDomainScore['status'] = 'mastered';
      if (percentage < 55) status = 'critical';
      else if (percentage < 70) status = 'needs_work';
      else if (percentage < 85) status = 'solid';

      domainScores.push({
        domainId: entry.id,
        domainName: entry.name,
        shortName: entry.shortName,
        weight: entry.weight,
        totalQuestions: entry.total,
        correctCount: entry.correct,
        unansweredCount: entry.unanswered,
        flaggedCount: entry.flagged,
        percentage,
        status,
      });

      weightedNumerator += percentage * entry.weight;
      weightedDenominator += entry.weight;
    }
  });

  const weightedScorePct =
    weightedDenominator > 0 ? Math.round(weightedNumerator / weightedDenominator) : scorePct;

  // LPI uses a scaled score range from 200 to 800 points, passing is 500
  // 500 corresponds to approx ~ 65-70%
  const estimatedLpiScore = Math.min(
    800,
    Math.max(200, Math.round(200 + (weightedScorePct / 100) * 600))
  );

  const passed = scorePct >= examInfo.passScorePct;

  // Timing metrics
  const recordedTimes = Object.values(questionTimes);
  const sumTimes = recordedTimes.reduce((acc, t) => acc + t, 0);
  const effectiveTotalDuration = Math.max(totalTimeElapsedSeconds, sumTimes);
  const averageTimePerQuestionSeconds =
    totalQuestions > 0 ? Math.round(effectiveTotalDuration / totalQuestions) : 0;

  // Questions to review = incorrect + unanswered + flagged
  const questionsToReviewCount = incorrectCount + unansweredCount;

  // Generate session-grounded risk factors
  const riskFactors = generateSessionRiskFactors({
    scorePct,
    weightedScorePct,
    unansweredCount,
    rushedErrorsCount,
    stalledQuestionsCount,
    flaggedCount,
    flaggedErrorsCount,
    domainScores,
    isFrench,
    averageTimePerQuestionSeconds,
    passThresholdPct: examInfo.passScorePct,
    totalQuestions,
  });

  // Action plan
  const actionPlan = generateSessionActionPlan({
    domainScores,
    unansweredCount,
    rushedErrorsCount,
    stalledQuestionsCount,
    flaggedErrorsCount,
    isFrench,
  });

  return {
    examId,
    examCode: examInfo.code,
    examTitle: isFrench ? examInfo.titleFr : examInfo.title,
    scorePct,
    weightedScorePct,
    estimatedLpiScore,
    passed,
    passThresholdPct: examInfo.passScorePct,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    flaggedCount,
    flaggedErrorsCount,
    questionsToReviewCount,
    totalDurationSeconds: effectiveTotalDuration,
    averageTimePerQuestionSeconds,
    rushedErrorsCount,
    stalledQuestionsCount,
    domainScores,
    riskFactors,
    actionPlan,
  };
}

/**
 * Generates the "Ce qui risque de te pénaliser à l'examen" risk factors
 * STRICTLY based on session metrics without claiming official prediction.
 */
function generateSessionRiskFactors(params: {
  scorePct: number;
  weightedScorePct: number;
  unansweredCount: number;
  rushedErrorsCount: number;
  stalledQuestionsCount: number;
  flaggedCount: number;
  flaggedErrorsCount: number;
  domainScores: ExamDomainScore[];
  isFrench: boolean;
  averageTimePerQuestionSeconds: number;
  passThresholdPct: number;
  totalQuestions: number;
}): ExamRiskFactor[] {
  const {
    scorePct,
    unansweredCount,
    rushedErrorsCount,
    stalledQuestionsCount,
    flaggedCount,
    flaggedErrorsCount,
    domainScores,
    isFrench,
    averageTimePerQuestionSeconds,
    passThresholdPct,
    totalQuestions,
  } = params;

  const risks: ExamRiskFactor[] = [];

  // 1. Heavy weight domain vulnerability
  const heavyWeightDomains = [...domainScores].sort((a, b) => b.weight - a.weight);
  const criticalHeavyDomain = heavyWeightDomains.find((d) => d.percentage < 65 && d.weight >= 10);
  const weakestDomain = [...domainScores].sort((a, b) => a.percentage - b.percentage)[0];

  if (criticalHeavyDomain) {
    const lostPoints = criticalHeavyDomain.totalQuestions - criticalHeavyDomain.correctCount;
    risks.push({
      id: 'heavy-domain-leak',
      severity: 'critical',
      domainName: criticalHeavyDomain.shortName,
      title: isFrench
        ? `Faiblesse critique sur un domaine à fort coefficient (${criticalHeavyDomain.shortName})`
        : `Critical vulnerability in high-weight domain (${criticalHeavyDomain.shortName})`,
      evidence: isFrench
        ? `Score de ${criticalHeavyDomain.percentage}% (${criticalHeavyDomain.correctCount}/${criticalHeavyDomain.totalQuestions} réussies). Ce domaine pèse un coefficient officiel de ${criticalHeavyDomain.weight} points.`
        : `Score of ${criticalHeavyDomain.percentage}% (${criticalHeavyDomain.correctCount}/${criticalHeavyDomain.totalQuestions} correct). This domain carries an official LPI weight of ${criticalHeavyDomain.weight}.`,
      impact: isFrench
        ? `Ce domaine concentre à lui seul ${lostPoints} erreur(s). Dans le barème LPI, les thèmes à fort coefficient pèsent lourdement dans le total : une chute sur ce bloc ne peut être compensée par les thèmes mineurs.`
        : `This topic alone accounts for ${lostPoints} errors. In the LPI scoring matrix, high-weight domains dictate overall success; minor topics cannot offset a failure here.`,
      recommendation: isFrench
        ? `Focalisez vos 3 prochaines sessions exclusivement sur les objectifs de ${criticalHeavyDomain.shortName} avec pratique terminal.`
        : `Focus your next 3 revision sessions specifically on ${criticalHeavyDomain.shortName} objectives with hands-on CLI practice.`,
    });
  } else if (weakestDomain && weakestDomain.percentage < 70) {
    risks.push({
      id: 'weakest-domain',
      severity: weakestDomain.percentage < 50 ? 'critical' : 'warning',
      domainName: weakestDomain.shortName,
      title: isFrench
        ? `Taux de réussite insuffisant sur "${weakestDomain.shortName}" (${weakestDomain.percentage}%)`
        : `Sub-par accuracy on "${weakestDomain.shortName}" (${weakestDomain.percentage}%)`,
      evidence: isFrench
        ? `${weakestDomain.correctCount}/${weakestDomain.totalQuestions} questions validées sur ce thème.`
        : `${weakestDomain.correctCount}/${weakestDomain.totalQuestions} questions validated on this domain.`,
      impact: isFrench
        ? `Sous le seuil d'admissibilité fixé à ${passThresholdPct}%. Tout déficit marqué sur ce domaine fragilise directement la moyenne.`
        : `Below the passing threshold of ${passThresholdPct}%. Any pronounced gap here jeopardizes your passing margin.`,
      recommendation: isFrench
        ? `Consultez les fiches de cours et la synthèse des commandes de ce domaine avant de relancer un test.`
        : `Review the study notes and command summary for this domain before re-attempting a full exam.`,
    });
  }

  // 2. Unanswered / Skipped questions (Zero-point penalty rule)
  if (unansweredCount > 0) {
    risks.push({
      id: 'unanswered-questions',
      severity: 'critical',
      title: isFrench
        ? `${unansweredCount} question(s) laissée(s) sans réponse (Perte sèche de points)`
        : `${unansweredCount} unanswered question(s) (Pure point loss)`,
      evidence: isFrench
        ? `${unansweredCount} question(s) sur ${totalQuestions} n'ont reçu aucun choix.`
        : `${unansweredCount} of ${totalQuestions} questions were left completely blank.`,
      impact: isFrench
        ? `Règle d'or de l'examen LPI : il n'y a AUCUNE pénalité ni point négatif pour une mauvaise réponse. Laisser une case vide équivaut à offrir 0 point. Répondre par élimination offre au minimum 25% à 50% de chance de gain.`
        : `Golden rule of LPI exams: there is ZERO penalty or negative point deduction for wrong answers. Leaving a question blank guarantees 0 points. Guessing after eliminating obvious distractors gives a 25% to 50% win chance.`,
      recommendation: isFrench
        ? `En conditions réelles, marquez la question d'un drapeau 🚩, posez votre meilleure hypothèse, et revenez-y s'il reste du temps. Ne laissez JAMAIS une question vide.`
        : `Under real test conditions, flag 🚩 the question, select your best tentative guess, and revisit later if time permits. NEVER submit a blank question.`,
    });
  }

  // 3. Flagging & Hesitations
  if (flaggedCount >= 3) {
    const errorRateOnFlagged =
      flaggedCount > 0 ? Math.round((flaggedErrorsCount / flaggedCount) * 100) : 0;
    if (errorRateOnFlagged >= 50) {
      risks.push({
        id: 'flag-hesitation-trap',
        severity: 'warning',
        title: isFrench
          ? `Hésitations pénalisantes sur les questions marquées 🚩 (${errorRateOnFlagged}% d'erreurs)`
          : `Penalizing hesitation on flagged 🚩 questions (${errorRateOnFlagged}% error rate)`,
        evidence: isFrench
          ? `Sur ${flaggedCount} questions signalées pour révision, ${flaggedErrorsCount} ont abouti à un mauvais choix.`
          : `Out of ${flaggedCount} questions flagged for review, ${flaggedErrorsCount} resulted in an incorrect choice.`,
        impact: isFrench
          ? `Le doute initial s'est avéré fondé, traduisant une hésitation entre deux options proches ou une méconnaissance de la syntaxe exacte.`
          : `Initial doubts were justified, indicating confusion between two close options or an uncertain command syntax.`,
        recommendation: isFrench
          ? `Ne changez votre premier choix que si vous avez une certitude factuelle (ex: relecture attentive d'une option négative "NOT" ou "ne doit PAS"). Pratiquez les commandes au terminal pour ancrer les automatismes.`
          : `Do not second-guess your instinct unless you spot a concrete misreading (such as a negative constraint "NOT"). Cement muscle memory in the CLI.`,
      });
    }
  }

  // 4. Rushed Errors (< 15 seconds)
  if (rushedErrorsCount >= 2) {
    risks.push({
      id: 'rushed-answers',
      severity: 'warning',
      title: isFrench
        ? `Précipitation détectée (${rushedErrorsCount} questions ratées en moins de 15 sec)`
        : `Rushing detected (${rushedErrorsCount} questions missed in under 15 sec)`,
      evidence: isFrench
        ? `Des erreurs sont survenues sur des questions traitées très rapidement (< 15 secondes d'analyse).`
        : `Mistakes occurred on questions reviewed in under 15 seconds.`,
      impact: isFrench
        ? `Les QCM LPI comportent fréquemment des pièges subtils (ex: confusion entre majuscule et minuscule '-r' vs '-R', chemin relatif vs absolu, ou question formulée sous forme de négation).`
        : `LPI questions frequently contain subtle distractors (e.g. lowercase vs uppercase flags '-r' vs '-R', relative vs absolute paths, or inverted conditions).`,
      recommendation: isFrench
        ? `Prenez au minimum 30 secondes pour chaque énoncé : identifiez le mot-clé exact de la question et lisez l'intégralité des 4 options avant de valider.`
        : `Take at least 30 seconds per item: identify key qualifying words and read all 4 options thoroughly before confirming.`,
    });
  }

  // 5. Time Bottlenecks (> 90 seconds on single questions)
  if (stalledQuestionsCount >= 3) {
    risks.push({
      id: 'time-bottleneck',
      severity: 'warning',
      title: isFrench
        ? `Blocage prolongé sur ${stalledQuestionsCount} question(s) (> 90 secondes)`
        : `Prolonged blockage on ${stalledQuestionsCount} question(s) (> 90 seconds)`,
      evidence: isFrench
        ? `Plus de 1 min 30 s passée sur certaines questions au détriment du rythme global.`
        : `More than 90 seconds spent wrestling with individual questions.`,
      impact: isFrench
        ? `Sur une épreuve officielle de 60 questions en 90 minutes (1 min 30 par question en moyenne), rester bloqué fait courir le risque d'arriver à court de temps sur les dernières questions simples.`
        : `On an official exam of 60 questions in 90 minutes (1m30s average budget), getting stuck creates acute time pressure at the tail end of the exam.`,
      recommendation: isFrench
        ? `Appliquez la méthode du cadencement : si la réponse n'est pas claire après 45 secondes, marquez la question (🚩), choisissez la réponse la plus probable, et avancez.`
        : `Enforce a strict pacing limit: if unresolved after 45 seconds, flag the question (🚩), pick your best tentative answer, and move forward immediately.`,
    });
  }

  // 6. Cadence evaluation
  if (averageTimePerQuestionSeconds < 25 && scorePct < 80) {
    risks.push({
      id: 'excessive-pace',
      severity: 'advisory',
      title: isFrench
        ? `Cadence globale trop rapide (${averageTimePerQuestionSeconds} sec/question)`
        : `Overall pace too fast (${averageTimePerQuestionSeconds} sec/question)`,
      evidence: isFrench
        ? `Vous avez utilisé beaucoup moins que le temps alloué alors que la note laisse des marges de progression.`
        : `You consumed significantly less time than allocated while scores indicate missed opportunities.`,
      impact: isFrench
        ? `Survoler trop vite les questions empêche de détecter les pièges syntaxiques typiques de LPI.`
        : `Skimming questions quickly prevents spotting characteristic LPI syntax traps.`,
      recommendation: isFrench
        ? `Ralentissez votre cadence moyenne vers 40-50 secondes par question pour sécuriser la relecture.`
        : `Slow your average tempo towards 40-50 seconds per question to ensure disciplined verification.`,
    });
  } else if (averageTimePerQuestionSeconds > 80) {
    risks.push({
      id: 'slow-pace',
      severity: 'advisory',
      title: isFrench
        ? `Cadence lente (${averageTimePerQuestionSeconds} sec/question)`
        : `Slow pacing (${averageTimePerQuestionSeconds} sec/question)`,
      evidence: isFrench
        ? `Rythme supérieur à la moyenne recommandée (45 à 60 sec).`
        : `Tempo exceeds recommended average budget (45 to 60 sec).`,
      impact: isFrench
        ? `Risque de tension temporelle si l'épreuve officielle comporte des scénarios longs ou des questions de rédaction de commande.`
        : `Risk of time squeeze if official items feature long practical scenarios or typed command fill-ins.`,
      recommendation: isFrench
        ? `Faites des sessions en mode chronomètre strict pour acquérir des réflexes spontanés.`
        : `Practice with strict countdown timers to develop immediate recall reflexes.`,
    });
  }

  // If no major risks, add positive hygiene advice
  if (risks.length === 0) {
    risks.push({
      id: 'exam-hygiene',
      severity: 'advisory',
      title: isFrench
        ? `Bonne régularité générale : maintenir la vigilance sur les détails de syntaxe`
        : `Solid overall consistency: maintain focus on strict command syntax`,
      evidence: isFrench
        ? `Aucune anomalie temporelle ni effondrement de domaine constaté lors de cette session.`
        : `No temporal anomalies or critical domain collapses detected during this session.`,
      impact: isFrench
        ? `La réussite à l'examen officiel se joue souvent sur quelques questions pièges portant sur des chemins de fichiers spécifiques ou des arguments obligatoires.`
        : `Official LPI exam success often hinges on a few edge-case questions regarding exact config paths or mandatory flags.`,
      recommendation: isFrench
        ? `Consolidez vos acquis en révisant les pages man des utilitaires fondamentaux.`
        : `Consolidate your mastery by reviewing man pages for core utility flags.`,
    });
  }

  return risks;
}

/**
 * Builds a prioritized action plan based on session performance
 */
function generateSessionActionPlan(params: {
  domainScores: ExamDomainScore[];
  unansweredCount: number;
  rushedErrorsCount: number;
  stalledQuestionsCount: number;
  flaggedErrorsCount: number;
  isFrench: boolean;
}): ExamSessionAnalytics['actionPlan'] {
  const { domainScores, unansweredCount, rushedErrorsCount, isFrench } = params;
  const sorted = [...domainScores].sort((a, b) => a.percentage - b.percentage);
  const weakest = sorted[0];
  const secondWeakest = sorted[1];

  const plan: ExamSessionAnalytics['actionPlan'] = [];

  // Action 1: Weakest domain
  if (weakest) {
    plan.push({
      priority: 1,
      badge: isFrench ? 'Priorité thématique' : 'Top Domain Priority',
      title: isFrench ? `Revoir le domaine "${weakest.shortName}"` : `Review "${weakest.shortName}"`,
      description: isFrench
        ? `Ciblez les concepts et commandes clés de ce domaine (${weakest.percentage}% de réussite). Pratiquez au terminal pour lever toute incertitude.`
        : `Target key concepts and commands in this topic (${weakest.percentage}% accuracy). Practice in the terminal to solidify confidence.`,
    });
  }

  // Action 2: Pacing / Answering strategy
  if (unansweredCount > 0) {
    plan.push({
      priority: 2,
      badge: isFrench ? 'Stratégie épreuve' : 'Exam Strategy',
      title: isFrench ? 'Adopter la règle "Zéro question vide"' : 'Enforce "Zero Blank Questions"',
      description: isFrench
        ? `Au LPI, aucune mauvaise réponse n'enlève de points. Ne quittez jamais une question sans cocher votre meilleure supposition.`
        : `In LPI, incorrect answers never subtract points. Always eliminate unlikely options and select your best guess.`,
    });
  } else if (rushedErrorsCount >= 2) {
    plan.push({
      priority: 2,
      badge: isFrench ? 'Contrôle cadence' : 'Pacing Discipline',
      title: isFrench ? 'Ralentir la lecture des énoncés' : 'Pace question reading',
      description: isFrench
        ? `Prenez 10 secondes supplémentaires par question pour vérifier les négations ("NOT") et les options majuscules/minuscules.`
        : `Spend an extra 10 seconds per question checking for inverted conditions and case-sensitive flags.`,
    });
  } else if (secondWeakest && secondWeakest.percentage < 75) {
    plan.push({
      priority: 2,
      badge: isFrench ? 'Deuxième axe' : 'Secondary Focus',
      title: isFrench ? `Consolider "${secondWeakest.shortName}"` : `Consolidate "${secondWeakest.shortName}"`,
      description: isFrench
        ? `Deuxième domaine à renforcer avec un score de ${secondWeakest.percentage}%.`
        : `Secondary topic requiring reinforcement with a score of ${secondWeakest.percentage}%.`,
    });
  } else {
    plan.push({
      priority: 2,
      badge: isFrench ? 'Gestion du temps' : 'Time Management',
      title: isFrench ? 'Stabiliser la cadence à 45s / question' : 'Maintain steady 45s / question pace',
      description: isFrench
        ? `Gardez ce rythme régulier pour conserver 15 à 20 minutes de relecture en fin d'épreuve.`
        : `Maintain this steady tempo to preserve 15-20 minutes for final review at the end of the test.`,
    });
  }

  // Action 3: Review flagged / errors
  plan.push({
    priority: 3,
    badge: isFrench ? 'Révision ciblée' : 'Targeted Review',
    title: isFrench ? 'Étudier la liste des questions à revoir' : 'Study the review question list',
    description: isFrench
      ? `Parcourez les explications détaillées ci-dessous pour chaque question manquée afin de comprendre la logique de l'examen.`
      : `Examine the detailed explanations below for each missed question to internalize LPI rationale.`,
  });

  return plan;
}
