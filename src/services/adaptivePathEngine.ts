import { LearningPath, PathModule } from '../data/learningPaths/types';
import { getCompletedLabIds, markLabCompleted } from './virtualFs/labProgress';
import { loadSRSRecords } from '../utils/srsEngine';

export type CompetencyActivityType =
  | 'theory'
  | 'flashcards'
  | 'quiz'
  | 'lab'
  | 'explain'
  | 'troubleshoot';

export type ProofSource =
  | 'direct'
  | 'virtual_lab'
  | 'srs_flashcard'
  | 'practice_exam'
  | 'incident_response'
  | 'explain_differently';

export interface ActivityProof {
  activityType: CompetencyActivityType;
  completed: boolean;
  completedAt?: string;
  source: ProofSource;
  score?: number;
  proofLabel: string;
  proofLabelFr: string;
}

export interface CompetencyMastery {
  moduleId: string;
  title: string;
  titleFr: string;
  conceptTag: string;
  conceptTagFr: string;
  activities: Record<CompetencyActivityType, ActivityProof>;
  completedActivitiesCount: number;
  totalActivitiesCount: number;
  masteryPct: number;
  isMastered: boolean; // 100% or >= 80% with lab & quiz
  recommendedNextActivity?: {
    type: CompetencyActivityType;
    label: string;
    labelFr: string;
  };
}

export interface PathEvaluationProof {
  midTermScore?: number;
  midTermPassed: boolean;
  finalQuizScore?: number;
  finalQuizPassed: boolean;
  finalLabPassed: boolean;
  finalTroubleshootingPassed: boolean;
  isAllEvaluationsPassed: boolean;
}

export interface PathAdaptiveMastery {
  pathId: string;
  competencies: Record<string, CompetencyMastery>;
  masteredCompetenciesCount: number;
  totalCompetenciesCount: number;
  totalActivitiesCompleted: number;
  totalActivitiesCount: number;
  overallMasteryPct: number;
  isPathMastered: boolean;
  evaluation: PathEvaluationProof;
  recommendedCompetency?: CompetencyMastery;
}

const STORAGE_ACTIVITY_PREFIX = 'lpi_adaptive_activity_proofs_';
const STORAGE_EVAL_PREFIX = 'lpi_adaptive_eval_';
const EXPLAINED_TOPICS_KEY = 'lpi_explained_topics';
const RESOLVED_INCIDENTS_KEY = 'lpi_resolved_incidents';
const MASTERED_OBJECTIVES_KEY = 'lpic_mastered_objectives';
const EXECUTED_COMMANDS_KEY = 'lpi_executed_commands';
const MASTERED_QUIZ_TOPICS_KEY = 'lpi_mastered_quiz_topics';

/* ==========================================================================
   External Cross-Module State Accessors & Mutators
   ========================================================================== */

export function getExecutedCommands(): string[] {
  try {
    const raw = localStorage.getItem(EXECUTED_COMMANDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordExecutedCommand(command: string): void {
  try {
    if (!command) return;
    const baseCmd = command.trim().split(/\s+/)[0].toLowerCase();
    if (!baseCmd) return;
    const current = getExecutedCommands();
    if (!current.includes(baseCmd)) {
      const updated = [...current, baseCmd];
      localStorage.setItem(EXECUTED_COMMANDS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lpi_command_executed', { detail: { command: baseCmd } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
}

export function getMasteredQuizTopics(): string[] {
  try {
    const raw = localStorage.getItem(MASTERED_QUIZ_TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markQuizTopicMastered(topic: string): void {
  try {
    if (!topic) return;
    const clean = topic.toLowerCase().trim();
    const current = getMasteredQuizTopics();
    if (!current.includes(clean)) {
      const updated = [...current, clean];
      localStorage.setItem(MASTERED_QUIZ_TOPICS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lpi_quiz_topic_mastered', { detail: { topic: clean } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
}

/* ==========================================================================
   External Cross-Module State Accessors & Mutators
   ========================================================================== */

export function getExplainedTopics(): string[] {
  try {
    const raw = localStorage.getItem(EXPLAINED_TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markTopicExplained(topic: string): void {
  try {
    if (!topic) return;
    const current = getExplainedTopics();
    if (!current.includes(topic.toLowerCase())) {
      const updated = [...current, topic.toLowerCase()];
      localStorage.setItem(EXPLAINED_TOPICS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lpi_topic_explained', { detail: { topic } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
}

export function getResolvedIncidents(): string[] {
  try {
    const raw = localStorage.getItem(RESOLVED_INCIDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markIncidentResolved(incidentId: string): void {
  try {
    if (!incidentId) return;
    const current = getResolvedIncidents();
    if (!current.includes(incidentId)) {
      const updated = [...current, incidentId];
      localStorage.setItem(RESOLVED_INCIDENTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lpi_incident_resolved', { detail: { incidentId } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
}

export function getMasteredObjectives(): string[] {
  try {
    const raw = localStorage.getItem(MASTERED_OBJECTIVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markObjectiveMastered(objectiveId: string): void {
  try {
    if (!objectiveId) return;
    const current = getMasteredObjectives();
    if (!current.includes(objectiveId)) {
      const updated = [...current, objectiveId];
      localStorage.setItem(MASTERED_OBJECTIVES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lpi_objective_mastered', { detail: { objectiveId } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch {}
}

/* ==========================================================================
   Activity Proofs Storage
   ========================================================================== */

export function getSavedActivityProofs(pathId: string): Record<string, ActivityProof> {
  try {
    const raw = localStorage.getItem(`${STORAGE_ACTIVITY_PREFIX}${pathId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveActivityProof(pathId: string, proofKey: string, proof: ActivityProof): void {
  try {
    const current = getSavedActivityProofs(pathId);
    current[proofKey] = proof;
    localStorage.setItem(`${STORAGE_ACTIVITY_PREFIX}${pathId}`, JSON.stringify(current));
    window.dispatchEvent(
      new CustomEvent('adaptive_path_updated', {
        detail: { pathId, proofKey, proof },
      })
    );
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save adaptive activity proof', e);
  }
}

export function getSavedEvaluation(pathId: string): Partial<PathEvaluationProof> {
  try {
    const raw = localStorage.getItem(`${STORAGE_EVAL_PREFIX}${pathId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEvaluation(pathId: string, evalData: Partial<PathEvaluationProof>): void {
  try {
    const current = getSavedEvaluation(pathId);
    const updated = { ...current, ...evalData };
    localStorage.setItem(`${STORAGE_EVAL_PREFIX}${pathId}`, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('adaptive_path_updated', {
        detail: { pathId, evaluation: updated },
      })
    );
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save path evaluation', e);
  }
}

/* ==========================================================================
   Master Cross-Module Synthesis & Adaptive Resolution
   ========================================================================== */

/**
 * Resolves whether an activity within a module has a valid Proof of Mastery.
 * Combines direct path records with real-time cross-module achievements:
 * - Labs from Virtual Terminal (labProgress)
 * - Flashcards from Spaced Repetition System (srsEngine & starred cards)
 * - Practice questions from Practice Exams (mastered objectives & exam history)
 * - Pedagogical insights from Explain Differently
 * - Incident investigations from Incident Response
 */
export function resolveActivityProof(
  pathId: string,
  mod: PathModule,
  activityType: CompetencyActivityType,
  savedProofs: Record<string, ActivityProof>,
  externalState: {
    completedLabIds: string[];
    srsRecords: Record<string, any>;
    starredCards: number[];
    masteredCards: number[];
    masteredObjectives: string[];
    explainedTopics: string[];
    resolvedIncidents: string[];
    executedCommands: string[];
    masteredQuizTopics: string[];
  }
): ActivityProof {
  const proofKey = `${mod.id}::${activityType}`;
  const directProof = savedProofs[proofKey];

  if (directProof && directProof.completed) {
    return directProof;
  }

  // Auto-detect cross-module mastery proofs
  switch (activityType) {
    case 'lab': {
      const labId = mod.lab?.id || '';
      const isLabDone =
        externalState.completedLabIds.includes(labId) ||
        externalState.completedLabIds.some(
          (id) =>
            id.toLowerCase().includes(mod.id.toLowerCase()) ||
            (mod.linkedLpiObjective && id.includes(mod.linkedLpiObjective)) ||
            (mod.id.toLowerCase().includes('chmod') && id.includes('chmod')) ||
            (mod.id.toLowerCase().includes('chown') && id.includes('chown'))
        );

      if (isLabDone) {
        return {
          activityType: 'lab',
          completed: true,
          completedAt: new Date().toISOString(),
          source: 'virtual_lab',
          proofLabel: 'Completed via Interactive Virtual Terminal Lab',
          proofLabelFr: 'Validé via le Terminal Lab interactif',
        };
      }

      // Check if relevant terminal command was executed by the user
      const matchingCmd = externalState.executedCommands.find((cmd) => {
        if (mod.id.toLowerCase().includes(cmd)) return true;
        if (mod.commands && mod.commands.some((c) => c.trim().toLowerCase().startsWith(cmd))) return true;
        if (mod.conceptTag && mod.conceptTag.toLowerCase().includes(cmd)) return true;
        return false;
      });

      if (matchingCmd) {
        return {
          activityType: 'lab',
          completed: true,
          completedAt: new Date().toISOString(),
          source: 'virtual_lab',
          proofLabel: `Command '${matchingCmd}' executed & validated in Terminal`,
          proofLabelFr: `Commande « ${matchingCmd} » validée dans le Terminal`,
        };
      }
      break;
    }

    case 'quiz': {
      const hasObjective = mod.linkedLpiObjective && externalState.masteredObjectives.includes(mod.linkedLpiObjective);
      const matchingQuizTopic = externalState.masteredQuizTopics.find((t) => {
        if (mod.id.toLowerCase().includes(t)) return true;
        if (mod.conceptTag.toLowerCase().includes(t)) return true;
        if (mod.glossaryTerms && mod.glossaryTerms.some((g) => g.toLowerCase() === t)) return true;
        return false;
      });

      if (hasObjective || matchingQuizTopic) {
        return {
          activityType: 'quiz',
          completed: true,
          completedAt: new Date().toISOString(),
          source: 'practice_exam',
          proofLabel: hasObjective
            ? `Objective ${mod.linkedLpiObjective} mastered in Exam Practice`
            : `Concept '${matchingQuizTopic}' validated in Practice Exam`,
          proofLabelFr: hasObjective
            ? `Objectif LPI ${mod.linkedLpiObjective} validé via les QCM d'examen`
            : `Concept « ${matchingQuizTopic} » validé via les QCM`,
        };
      }
      break;
    }

    case 'flashcards': {
      // Check if flashcards for this concept are mastered in SRS
      const cardIds = mod.flashcards ? mod.flashcards.map((f) => f.id) : [];
      const isSrsMastered =
        cardIds.some((cid) => {
          const record = externalState.srsRecords[cid];
          return record && (record.repetitions >= 1 || record.interval >= 1);
        }) ||
        (mod.linkedLpiObjective === '104.5' && externalState.masteredCards.some((id) => id >= 459 && id <= 474));

      if (isSrsMastered) {
        return {
          activityType: 'flashcards',
          completed: true,
          completedAt: new Date().toISOString(),
          source: 'srs_flashcard',
          proofLabel: 'Mastered in Spaced Repetition Deck (SRS)',
          proofLabelFr: 'Mémorisé dans le moteur de répétition espacée (SRS)',
        };
      }
      break;
    }

    case 'explain': {
      if (mod.explainTopic && externalState.explainedTopics.includes(mod.explainTopic.toLowerCase())) {
        return {
          activityType: 'explain',
          completed: true,
          completedAt: new Date().toISOString(),
          source: 'explain_differently',
          proofLabel: `Explored 5 pedagogical angles for '${mod.explainTopic}'`,
          proofLabelFr: `Exploré sous 5 angles (« Explique-moi autrement : ${mod.explainTopic} »)`,
        };
      }
      break;
    }

    case 'troubleshoot': {
      const incidentId = mod.troubleshooting?.id || '';
      const isIncidentDone =
        externalState.resolvedIncidents.includes(incidentId) ||
        externalState.resolvedIncidents.some((id) => id.includes(mod.id));

      if (isIncidentDone) {
        return {
          activityType: 'troubleshoot',
          completed: true,
          completedAt: new Date().toISOString(),
          source: 'incident_response',
          proofLabel: 'Incident resolved in Production Incident Center',
          proofLabelFr: 'Incident résolu dans le centre de dépannage',
        };
      }
      break;
    }

    case 'theory':
      // Theory has no auto-complete from another module unless explicitly read
      break;
  }

  // Default pending proof
  return {
    activityType,
    completed: false,
    source: 'direct',
    proofLabel: 'Activity not yet verified',
    proofLabelFr: 'Activité non encore validée',
  };
}

/**
 * Calculates adaptive mastery for a full Learning Path.
 * Every module is evaluated as a structured Competency with individual Activity Proofs.
 */
export function calculatePathAdaptiveMastery(path: LearningPath): PathAdaptiveMastery {
  const savedProofs = getSavedActivityProofs(path.id);
  const savedEval = getSavedEvaluation(path.id);

  // Snapshot external module states
  let srsRecords: Record<string, any> = {};
  try {
    srsRecords = loadSRSRecords();
  } catch {}

  let starredCards: number[] = [];
  try {
    starredCards = JSON.parse(localStorage.getItem('lpic1_starred_cards') || '[]');
  } catch {}

  let masteredCards: number[] = [];
  try {
    masteredCards = JSON.parse(localStorage.getItem('lpic1_mastered_cards') || '[]');
  } catch {}

  const externalState = {
    completedLabIds: getCompletedLabIds(),
    srsRecords,
    starredCards,
    masteredCards,
    masteredObjectives: getMasteredObjectives(),
    explainedTopics: getExplainedTopics(),
    resolvedIncidents: getResolvedIncidents(),
    executedCommands: getExecutedCommands(),
    masteredQuizTopics: getMasteredQuizTopics(),
  };

  const competencies: Record<string, CompetencyMastery> = {};
  let totalActivitiesCount = 0;
  let totalActivitiesCompleted = 0;
  let masteredCompetenciesCount = 0;
  let firstUnmasteredComp: CompetencyMastery | undefined = undefined;

  for (const mod of path.modules) {
    const activityProofs: Record<CompetencyActivityType, ActivityProof> = {} as any;
    let compCompleted = 0;
    let nextRecommended: { type: CompetencyActivityType; label: string; labelFr: string } | undefined = undefined;

    // Use tailored activities if specified on module, otherwise default pedagogical sequence
    const effectiveTypes: CompetencyActivityType[] =
      mod.activeActivityTypes && mod.activeActivityTypes.length > 0
        ? mod.activeActivityTypes
        : [
            'theory',
            ...(mod.explainTopic ? (['explain'] as CompetencyActivityType[]) : []),
            'flashcards',
            'quiz',
            'lab',
            'troubleshoot',
          ];

    const defaultLabels: Record<CompetencyActivityType, { label: string; labelFr: string }> = {
      theory: { label: 'Study Core Concept & Syntax', labelFr: 'Comprendre la théorie & syntaxe' },
      explain: { label: 'Explore with "Explain Differently"', labelFr: 'Explorer « Explique-moi autrement »' },
      flashcards: { label: 'Memorize with Flashcards / SRS', labelFr: 'Réviser les Flashcards / SRS' },
      quiz: { label: 'Validate with Practice Quiz', labelFr: 'Réussir le QCM d\'évaluation' },
      lab: { label: 'Hands-on Terminal Lab', labelFr: 'Exécuter le LAB dans le Terminal' },
      troubleshoot: { label: 'Production Incident Diagnosis', labelFr: 'Résoudre la panne de production' },
    };

    const pedagogicalOrder = effectiveTypes.map((t) => {
      const custom = mod.activityLabels?.[t];
      return {
        type: t,
        label: custom?.label || defaultLabels[t]?.label || t,
        labelFr: custom?.labelFr || defaultLabels[t]?.labelFr || t,
      };
    });

    for (const item of pedagogicalOrder) {
      const proof = resolveActivityProof(path.id, mod, item.type, savedProofs, externalState);
      activityProofs[item.type] = proof;
      if (proof.completed) {
        compCompleted++;
      } else if (!nextRecommended) {
        nextRecommended = item;
      }
    }

    const compTotal = pedagogicalOrder.length;
    const masteryPct = compTotal > 0 ? Math.round((compCompleted / compTotal) * 100) : 0;
    // Mastered if all active activities are completed
    const isMastered = compCompleted === compTotal && compTotal > 0;

    if (isMastered) {
      masteredCompetenciesCount++;
    }

    const compMastery: CompetencyMastery = {
      moduleId: mod.id,
      title: mod.title,
      titleFr: mod.titleFr,
      conceptTag: mod.conceptTag,
      conceptTagFr: mod.conceptTagFr,
      activities: activityProofs,
      completedActivitiesCount: compCompleted,
      totalActivitiesCount: compTotal,
      masteryPct,
      isMastered,
      recommendedNextActivity: nextRecommended,
    };

    competencies[mod.id] = compMastery;
    totalActivitiesCompleted += compCompleted;
    totalActivitiesCount += compTotal;

    if (!isMastered && !firstUnmasteredComp) {
      firstUnmasteredComp = compMastery;
    }
  }

  // Evaluation status with cross-module proof support
  const midTermPassed = Boolean(savedEval.midTermPassed);
  const finalQuizPassed = Boolean(savedEval.finalQuizPassed) || (externalState.masteredObjectives.length >= 2);
  const finalLabPassed = Boolean(savedEval.finalLabPassed) || (externalState.completedLabIds.length >= 2);
  const finalTroubleshootingPassed = Boolean(savedEval.finalTroubleshootingPassed) || (externalState.resolvedIncidents.length >= 1);

  const evaluation: PathEvaluationProof = {
    midTermScore: savedEval.midTermScore,
    midTermPassed: midTermPassed || finalQuizPassed,
    finalQuizScore: savedEval.finalQuizScore,
    finalQuizPassed,
    finalLabPassed,
    finalTroubleshootingPassed,
    isAllEvaluationsPassed: (finalQuizPassed || midTermPassed) && finalLabPassed && finalTroubleshootingPassed,
  };

  const totalComps = path.modules.length;
  const compMasteryPct = totalComps > 0 ? (masteredCompetenciesCount / totalComps) * 80 : 0;
  const evalBonus = evaluation.isAllEvaluationsPassed ? 20 : (midTermPassed ? 10 : 0);
  const overallMasteryPct = Math.min(100, Math.round(compMasteryPct + evalBonus));

  const isPathMastered =
    masteredCompetenciesCount === totalComps && evaluation.isAllEvaluationsPassed;

  return {
    pathId: path.id,
    competencies,
    masteredCompetenciesCount,
    totalCompetenciesCount: totalComps,
    totalActivitiesCompleted,
    totalActivitiesCount,
    overallMasteryPct,
    isPathMastered,
    evaluation,
    recommendedCompetency: firstUnmasteredComp,
  };
}

/* ==========================================================================
   Bidirectional Action Handlers
   ========================================================================== */

/**
 * Validates an activity and updates both the learning path proofs AND
 * the corresponding platform module (Virtual Lab, Mastered Objectives, SRS, etc.)
 */
export function completeAdaptiveActivity(
  path: LearningPath,
  mod: PathModule,
  activityType: CompetencyActivityType,
  score?: number
): ActivityProof {
  const proofKey = `${mod.id}::${activityType}`;

  let proofLabel = 'Validated directly in Learning Path';
  let proofLabelFr = 'Validé directement dans le parcours';

  switch (activityType) {
    case 'lab':
      markLabCompleted(mod.lab.id);
      proofLabel = 'Validated via Hands-on Lab';
      proofLabelFr = 'Lab pratique validé avec succès';
      break;

    case 'quiz':
      if (mod.linkedLpiObjective) {
        markObjectiveMastered(mod.linkedLpiObjective);
      }
      proofLabel = `Quiz validated (Score: ${score ?? 100}%)`;
      proofLabelFr = `QCM validé avec succès (Score : ${score ?? 100}%)`;
      break;

    case 'explain':
      if (mod.explainTopic) {
        markTopicExplained(mod.explainTopic);
      }
      proofLabel = 'Pedagogical Exploration Completed';
      proofLabelFr = 'Exploration pédagogique complétée';
      break;

    case 'troubleshoot':
      markIncidentResolved(mod.troubleshooting.id);
      proofLabel = 'Production incident diagnosis solved';
      proofLabelFr = 'Diagnostic de panne résolu avec succès';
      break;

    case 'theory':
      proofLabel = 'Core concept & syntax studied';
      proofLabelFr = 'Concept théorique et syntaxe validés';
      break;

    case 'flashcards':
      proofLabel = 'Flashcards reviewed & committed';
      proofLabelFr = 'Fiches mémorisées dans le deck de révision';
      break;
  }

  const proof: ActivityProof = {
    activityType,
    completed: true,
    completedAt: new Date().toISOString(),
    source: 'direct',
    score,
    proofLabel,
    proofLabelFr,
  };

  saveActivityProof(path.id, proofKey, proof);

  // Maintain backward compatibility with legacy storage:
  // If all essential activities of module are done, add to legacy step list
  const currentSaved = getSavedActivityProofs(path.id);
  const hasTheory = currentSaved[`${mod.id}::theory`]?.completed || activityType === 'theory';
  const hasQuiz = currentSaved[`${mod.id}::quiz`]?.completed || activityType === 'quiz';
  const hasLab = currentSaved[`${mod.id}::lab`]?.completed || activityType === 'lab';

  if (hasTheory && hasQuiz && hasLab) {
    try {
      const legacyKey = `learning_path_progress_${path.id}`;
      const existing: string[] = JSON.parse(localStorage.getItem(legacyKey) || '[]');
      if (!existing.includes(mod.id)) {
        existing.push(mod.id);
        localStorage.setItem(legacyKey, JSON.stringify(existing));
        window.dispatchEvent(
          new CustomEvent('learning_path_updated', {
            detail: { pathId: path.id, completedStepIds: existing },
          })
        );
      }
    } catch {}
  }

  return proof;
}

/**
 * Resets all adaptive proofs for a path
 */
export function resetPathAdaptiveMastery(pathId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_ACTIVITY_PREFIX}${pathId}`);
    localStorage.removeItem(`${STORAGE_EVAL_PREFIX}${pathId}`);
    localStorage.removeItem(`learning_path_progress_${pathId}`);
    window.dispatchEvent(
      new CustomEvent('adaptive_path_updated', {
        detail: { pathId, reset: true },
      })
    );
    window.dispatchEvent(new Event('storage'));
  } catch {}
}
