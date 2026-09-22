export const LAB_COMPLETION_STORAGE_KEY = 'lpi_virtual_labs_completed';
export const LAB_COMPLETION_EVENT = 'lpi_virtual_lab_completed';

/**
 * Get all completed simulated lab scenario IDs from localStorage
 */
export function getCompletedLabIds(): string[] {
  try {
    const raw = localStorage.getItem(LAB_COMPLETION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse completed lab IDs from storage', e);
    return [];
  }
}

/**
 * Check if a specific lab is completed
 */
export function isLabCompleted(labId: string): boolean {
  const completed = getCompletedLabIds();
  return completed.includes(labId);
}

/**
 * Mark a lab scenario as completed and trigger event
 */
export function markLabCompleted(labId: string): void {
  try {
    const current = getCompletedLabIds();
    if (!current.includes(labId)) {
      const updated = [...current, labId];
      localStorage.setItem(LAB_COMPLETION_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent(LAB_COMPLETION_EVENT, {
          detail: { labId, completed: true, allCompleted: updated },
        })
      );
    }
  } catch (e) {
    console.error('Failed to save completed lab', e);
  }
}

/**
 * Unmark a lab scenario (set back to pending)
 */
export function unmarkLabCompleted(labId: string): void {
  try {
    const current = getCompletedLabIds();
    const updated = current.filter((id) => id !== labId);
    localStorage.setItem(LAB_COMPLETION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(LAB_COMPLETION_EVENT, {
        detail: { labId, completed: false, allCompleted: updated },
      })
    );
  } catch (e) {
    console.error('Failed to unmark lab', e);
  }
}

/**
 * Toggle completion status for a lab scenario
 */
export function toggleLabCompleted(labId: string): boolean {
  if (isLabCompleted(labId)) {
    unmarkLabCompleted(labId);
    return false;
  } else {
    markLabCompleted(labId);
    return true;
  }
}

/**
 * Reset all completed lab scenarios
 */
export function resetAllLabCompletions(): void {
  try {
    localStorage.removeItem(LAB_COMPLETION_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(LAB_COMPLETION_EVENT, {
        detail: { labId: null, completed: false, allCompleted: [] },
      })
    );
  } catch (e) {
    console.error('Failed to reset lab completions', e);
  }
}
