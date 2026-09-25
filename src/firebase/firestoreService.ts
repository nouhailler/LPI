import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { UserStats } from '../types';

export interface CloudUserProgress {
  userId: string;
  masteredObjectives: string[];
  starredCardIds: number[];
  completedLabIds: string[];
  srsRecordsJson: string;
  diagnosticResultJson: string;
  weaknessReportJson: string;
  updatedAt: string;
}

export interface CloudExamSession {
  id: string;
  userId: string;
  examId: string;
  examCode?: string;
  examName?: string;
  score: number;
  correctCount?: number;
  totalQuestions?: number;
  passed: boolean;
  date?: string;
  createdAt: string;
}

/**
 * Saves or updates user profile in Firestore
 */
export async function syncUserProfileToCloud(user: User, stats?: Partial<UserStats>): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userDocRef);

    const profileData: Record<string, any> = {
      uid: user.uid,
      email: user.email || 'user@lpiprep.local',
      displayName: (user.displayName || 'Linux Engineer').slice(0, 100),
      photoURL: user.photoURL ? user.photoURL.slice(0, 1024) : '',
      currentTarget: (stats?.currentTarget || 'LPIC-1').slice(0, 50),
      streakDays: typeof stats?.streakDays === 'number' ? stats.streakDays : 1,
      questionsDoneToday: typeof stats?.questionsDoneToday === 'number' ? stats.questionsDoneToday : 0,
      dailyGoal: typeof stats?.dailyGoal === 'number' ? stats.dailyGoal : 20,
      systemArchitectureProgress: typeof stats?.systemArchitectureProgress === 'number' ? stats.systemArchitectureProgress : 0,
      linuxInstallationProgress: typeof stats?.linuxInstallationProgress === 'number' ? stats.linuxInstallationProgress : 0,
      pathCompletionPct: typeof stats?.pathCompletionPct === 'number' ? stats.pathCompletionPct : 0,
      updatedAt: new Date().toISOString(),
    };

    if (!existingSnap.exists()) {
      profileData.createdAt = new Date().toISOString();
    }

    await setDoc(userDocRef, profileData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Persists all local learning milestones and SRS decks to Firestore
 */
export async function syncLocalProgressToCloud(userId: string): Promise<void> {
  const path = `users/${userId}/progress/current`;
  try {
    let masteredObjectives: string[] = [];
    try {
      const saved = localStorage.getItem('lpic_mastered_objectives');
      if (saved) masteredObjectives = JSON.parse(saved);
    } catch {}

    let starredCardIds: number[] = [];
    try {
      const saved = localStorage.getItem('lpic1_starred_cards');
      if (saved) starredCardIds = JSON.parse(saved);
    } catch {}

    let completedLabIds: string[] = [];
    try {
      const saved = localStorage.getItem('lpic_completed_labs');
      if (saved) completedLabIds = JSON.parse(saved);
    } catch {}

    const srsRecordsJson = (localStorage.getItem('lpic_srs_records') || '{}').slice(0, 100000);
    const diagnosticResultJson = (localStorage.getItem('lpi_diagnostic_result') || '').slice(0, 50000);
    const weaknessReportJson = (localStorage.getItem('lpic_weakness_report') || '').slice(0, 50000);

    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    await setDoc(progressRef, {
      userId,
      masteredObjectives: masteredObjectives.slice(0, 500),
      starredCardIds: starredCardIds.slice(0, 1000),
      completedLabIds: completedLabIds.slice(0, 500),
      srsRecordsJson,
      diagnosticResultJson,
      weaknessReportJson,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Restores cloud progress into localStorage when logging in
 */
export async function loadCloudProgress(userId: string): Promise<{ userStats?: Partial<UserStats>; restored: boolean }> {
  const profilePath = `users/${userId}`;
  const progressPath = `users/${userId}/progress/current`;
  try {
    const profileRef = doc(db, 'users', userId);
    const progressRef = doc(db, 'users', userId, 'progress', 'current');

    const [profileSnap, progressSnap] = await Promise.all([
      getDoc(profileRef),
      getDoc(progressRef),
    ]);

    let userStats: Partial<UserStats> | undefined = undefined;
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      userStats = {
        currentTarget: data.currentTarget || 'LPIC-1',
        streakDays: data.streakDays || 1,
        questionsDoneToday: data.questionsDoneToday || 0,
        dailyGoal: data.dailyGoal || 20,
        systemArchitectureProgress: data.systemArchitectureProgress || 0,
        linuxInstallationProgress: data.linuxInstallationProgress || 0,
        pathCompletionPct: data.pathCompletionPct || 0,
      };
    }

    if (progressSnap.exists()) {
      const data = progressSnap.data();
      if (data.masteredObjectives && Array.isArray(data.masteredObjectives)) {
        localStorage.setItem('lpic_mastered_objectives', JSON.stringify(data.masteredObjectives));
      }
      if (data.starredCardIds && Array.isArray(data.starredCardIds)) {
        localStorage.setItem('lpic1_starred_cards', JSON.stringify(data.starredCardIds));
      }
      if (data.completedLabIds && Array.isArray(data.completedLabIds)) {
        localStorage.setItem('lpic_completed_labs', JSON.stringify(data.completedLabIds));
      }
      if (data.srsRecordsJson && typeof data.srsRecordsJson === 'string') {
        localStorage.setItem('lpic_srs_records', data.srsRecordsJson);
      }
      if (data.diagnosticResultJson && typeof data.diagnosticResultJson === 'string' && data.diagnosticResultJson.length > 0) {
        localStorage.setItem('lpi_diagnostic_result', data.diagnosticResultJson);
      }
      if (data.weaknessReportJson && typeof data.weaknessReportJson === 'string' && data.weaknessReportJson.length > 0) {
        localStorage.setItem('lpic_weakness_report', data.weaknessReportJson);
      }

      // Notify reactive components of the state hydration
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('srs_updated'));
      window.dispatchEvent(new CustomEvent('lpi_path_updated'));
    }

    // Also load recent exam sessions
    await loadCloudExamHistory(userId);

    return { userStats, restored: profileSnap.exists() || progressSnap.exists() };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${profilePath} or ${progressPath}`);
  }
}

/**
 * Saves an exam session to Firestore subcollection
 */
export async function saveExamSessionToCloud(userId: string, session: any): Promise<void> {
  const sessionId = (session.id || `session-${Date.now()}`).replace(/[^a-zA-Z0-9_\-]/g, '_');
  const path = `users/${userId}/examHistory/${sessionId}`;
  try {
    const sessionRef = doc(db, 'users', userId, 'examHistory', sessionId);
    const sessionData: CloudExamSession = {
      id: sessionId,
      userId,
      examId: String(session.examId || 'exam-101').slice(0, 64),
      examCode: session.examCode ? String(session.examCode).slice(0, 64) : undefined,
      examName: session.examName ? String(session.examName).slice(0, 100) : undefined,
      score: Number(session.score) || 0,
      correctCount: typeof session.correctCount === 'number' ? session.correctCount : 0,
      totalQuestions: typeof session.totalQuestions === 'number' ? session.totalQuestions : 0,
      passed: Boolean(session.passed),
      date: session.date ? String(session.date).slice(0, 64) : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await setDoc(sessionRef, sessionData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Loads exam history from Firestore and merges with localStorage
 */
export async function loadCloudExamHistory(userId: string): Promise<void> {
  const path = `users/${userId}/examHistory`;
  try {
    const colRef = collection(db, 'users', userId, 'examHistory');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const sessions = snapshot.docs.map((d) => d.data());
      // Sort by date descending
      sessions.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
      localStorage.setItem('lpi_exam_history', JSON.stringify(sessions.slice(0, 20)));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
