import { simulatedLabScenarios } from '../services/virtualFs/labScenarios';
import { guidedLabScenarios } from '../data/guidedMiniLabsData';
import { LAB_MAP_STAGES, getExplicitlyMappedLabIds } from '../data/labMapStages';
import { allLearningPaths } from '../data/learningPaths/index';
import { thematicLearningPaths } from '../data/thematicLearningPathsData';
import { lpicTopicsData } from '../data/lpicObjectivesData';

export interface CurriculumWarning {
  labId: string;
  source: 'lab_map' | 'learning_path' | 'certification_objective' | 'catalog';
  message: string;
  messageFr: string;
  details?: string;
}

export interface CurriculumValidationResult {
  timestamp: string;
  isValid: boolean;
  totalSimulatedLabs: number;
  totalGuidedMiniLabs: number;
  totalLearningPaths: number;
  totalObjectivesChecked: number;
  
  // Specific cross-checks
  unmappedInLabMap: string[];
  unreferencedInLearningPaths: string[];
  missingObjectiveMapping: string[];
  unknownInLabMap: string[];
  
  // Formatted warnings
  warnings: CurriculumWarning[];
  summaryFr: string;
  summaryEn: string;
  flowAscii: string;
}

/**
 * Extracts all lab identifiers referenced across all learning paths.
 */
export function getAllReferencedLabIdsInLearningPaths(): Set<string> {
  const referenced = new Set<string>();

  // 1. Structured modular paths
  for (const path of allLearningPaths) {
    if (path.modules && Array.isArray(path.modules)) {
      for (const mod of path.modules) {
        if (mod.lab?.id) {
          referenced.add(mod.lab.id);
        }
        if (mod.id) {
          referenced.add(mod.id);
        }
      }
    }
    if (path.steps && Array.isArray(path.steps)) {
      for (const step of path.steps) {
        if (step.lab?.id) {
          referenced.add(step.lab.id);
        }
      }
    }
    if (path.finalEvaluation?.capstoneLab?.id) {
      referenced.add(path.finalEvaluation.capstoneLab.id);
    }
  }

  // 2. Thematic paths
  for (const thematic of thematicLearningPaths) {
    if (thematic.steps && Array.isArray(thematic.steps)) {
      for (const step of thematic.steps) {
        referenced.add(step.id);
      }
    }
  }

  return referenced;
}

/**
 * Extracts all valid LPIC objective IDs across all topics.
 */
export function getAllValidObjectiveIds(): Set<string> {
  const ids = new Set<string>();
  for (const topic of lpicTopicsData) {
    for (const obj of topic.objectives) {
      ids.add(obj.id);
    }
  }
  return ids;
}

/**
 * Runs the comprehensive 4-way curriculum validation check.
 * 
 * Pipeline:
 * Tous les lab IDs
 *         ↓
 * comparaison
 *         ↓
 * Lab Map
 *         ↓
 * Learning Paths
 *         ↓
 * Certification objectives
 */
export function validateCurriculumConsistency(): CurriculumValidationResult {
  const warnings: CurriculumWarning[] = [];

  // Catalog
  const catalogScenarioIds = new Set(simulatedLabScenarios.map((s) => s.id));
  const mappedLabMapIds = new Set(getExplicitlyMappedLabIds());
  const learningPathLabIds = getAllReferencedLabIdsInLearningPaths();
  const validObjectiveIds = getAllValidObjectiveIds();

  // 1. Check Lab Map coverage: every simulated lab must be in Lab Map
  const unmappedInLabMap: string[] = [];
  for (const scenario of simulatedLabScenarios) {
    if (!mappedLabMapIds.has(scenario.id)) {
      unmappedInLabMap.push(scenario.id);
      warnings.push({
        labId: scenario.id,
        source: 'lab_map',
        message: `⚠ Lab ${scenario.id}\n  → non référencé dans une Lab Map`,
        messageFr: `⚠ Lab ${scenario.id}\n  → non référencé dans une Lab Map`,
        details: `Titre: "${scenario.titleFr || scenario.title}" (Catégorie: ${scenario.category})`,
      });
    }
  }

  // 1b. Check reverse: any unknown ID in Lab Map
  const unknownInLabMap: string[] = [];
  for (const id of mappedLabMapIds) {
    if (!catalogScenarioIds.has(id)) {
      unknownInLabMap.push(id);
      warnings.push({
        labId: id,
        source: 'catalog',
        message: `⚠ Lab ${id}\n  → présent dans la Lab Map mais introuvable dans labScenarios.ts`,
        messageFr: `⚠ Lab ${id}\n  → présent dans la Lab Map mais introuvable dans labScenarios.ts`,
      });
    }
  }

  // 2. Check Learning Paths coverage: every simulated lab must be linked to a path module
  const unreferencedInLearningPaths: string[] = [];
  for (const scenario of simulatedLabScenarios) {
    if (!learningPathLabIds.has(scenario.id)) {
      unreferencedInLearningPaths.push(scenario.id);
      warnings.push({
        labId: scenario.id,
        source: 'learning_path',
        message: `⚠ Lab ${scenario.id}\n  → non référencé dans un Learning Path`,
        messageFr: `⚠ Lab ${scenario.id}\n  → non référencé dans un Learning Path`,
        details: `Objectif associé: ${scenario.linkedObjectiveId || 'aucun'}`,
      });
    }
  }

  // 3. Check Certification Objectives: every simulated lab must have a valid LPI objective mapping
  const missingObjectiveMapping: string[] = [];
  for (const scenario of simulatedLabScenarios) {
    if (!scenario.linkedObjectiveId || !validObjectiveIds.has(scenario.linkedObjectiveId)) {
      missingObjectiveMapping.push(scenario.id);
      warnings.push({
        labId: scenario.id,
        source: 'certification_objective',
        message: `⚠ Lab ${scenario.id}\n  → objectif de certification non associé ou introuvable (${scenario.linkedObjectiveId || 'vide'})`,
        messageFr: `⚠ Lab ${scenario.id}\n  → objectif de certification non associé ou introuvable (${scenario.linkedObjectiveId || 'vide'})`,
      });
    }
  }

  const isValid = warnings.length === 0;

  const flowAscii = [
    'Tous les lab IDs (14 VirtualFS labs, 60 mini-labs)',
    '        ↓',
    'comparaison',
    '        ↓',
    `Lab Map (${mappedLabMapIds.size} scénarios mappés)`,
    '        ↓',
    `Learning Paths (${learningPathLabIds.size} modules/labs)`,
    '        ↓',
    `Certification objectives (${validObjectiveIds.size} objectifs LPI)`,
  ].join('\n');

  const summaryFr = isValid
    ? 'Toutes les sources de données du curriculum sont 100% cohérentes et synchronisées.'
    : `${warnings.length} avertissement(s) de cohérence détecté(s) dans le curriculum.`;

  const summaryEn = isValid
    ? 'All curriculum data sources are 100% consistent and cross-referenced.'
    : `${warnings.length} curriculum consistency warning(s) detected.`;

  return {
    timestamp: new Date().toISOString(),
    isValid,
    totalSimulatedLabs: simulatedLabScenarios.length,
    totalGuidedMiniLabs: guidedLabScenarios.length,
    totalLearningPaths: allLearningPaths.length + thematicLearningPaths.length,
    totalObjectivesChecked: validObjectiveIds.size,
    unmappedInLabMap,
    unreferencedInLearningPaths,
    missingObjectiveMapping,
    unknownInLabMap,
    warnings,
    summaryFr,
    summaryEn,
    flowAscii,
  };
}

/**
 * Formats a terminal-friendly report for CLI/Build execution.
 */
export function formatCurriculumReport(result: CurriculumValidationResult): string {
  const lines: string[] = [];
  lines.push('================================================================================');
  lines.push('  LPI CURRICULUM & LAB CONSISTENCY VALIDATION REPORT');
  lines.push('================================================================================');
  lines.push(result.flowAscii);
  lines.push('--------------------------------------------------------------------------------');
  lines.push(`Catalog: ${result.totalSimulatedLabs} simulated labs, ${result.totalGuidedMiniLabs} guided mini-labs`);
  lines.push(`Learning Paths: ${result.totalLearningPaths} paths checked`);
  lines.push(`Certification Objectives: ${result.totalObjectivesChecked} LPI objectives checked`);
  lines.push('--------------------------------------------------------------------------------');

  if (result.isValid) {
    lines.push('✔ SUCCÈS : Tous les labs sont parfaitement synchronisés dans la Lab Map,');
    lines.push('  les Learning Paths et les objectifs de certification LPI.');
  } else {
    lines.push(`Avertissements détectés (${result.warnings.length}) :`);
    lines.push('');
    for (const w of result.warnings) {
      lines.push(w.message);
      if (w.details) {
        lines.push(`  → ${w.details}`);
      }
      lines.push('');
    }
  }

  lines.push('================================================================================');
  return lines.join('\n');
}
