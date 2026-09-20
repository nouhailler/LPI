import { allLearningPaths } from './index';

const STORAGE_PREFIX = 'learning_path_progress_';

export function getPathProgress(pathId: string): string[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${pathId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read learning path progress', e);
  }
  return [];
}

export function savePathProgress(pathId: string, completedStepIds: string[]): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${pathId}`, JSON.stringify(completedStepIds));
    window.dispatchEvent(
      new CustomEvent('learning_path_updated', {
        detail: { pathId, completedStepIds },
      })
    );
  } catch (e) {
    console.error('Failed to save learning path progress', e);
  }
}

export function togglePathStep(pathId: string, stepId: string): string[] {
  const current = getPathProgress(pathId);
  const next = current.includes(stepId)
    ? current.filter((id) => id !== stepId)
    : [...current, stepId];
  savePathProgress(pathId, next);
  return next;
}

export function resetPathProgress(pathId: string): void {
  savePathProgress(pathId, []);
}

export function markAllPathSteps(pathId: string): string[] {
  const path = allLearningPaths.find((p) => p.id === pathId);
  if (!path) return [];
  const allIds = path.modules.map((m) => m.id);
  savePathProgress(pathId, allIds);
  return allIds;
}
