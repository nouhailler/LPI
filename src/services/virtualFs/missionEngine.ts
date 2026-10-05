import { LinuxMission, MissionDiagnosticStep } from '../../data/linuxMissionsData';

export interface InvestigationTimelineItem {
  id: string;
  timestamp: string;
  command: string;
  category: 'status' | 'logs' | 'network' | 'config' | 'action' | 'verify' | 'misc';
  categoryLabelFr: string;
  matchedStepId?: string;
  matchedStepNameFr?: string;
  pedagogicalNoteFr: string;
  scoreDelta: number;
}

export interface MissionMethodologyReport {
  missionId: string;
  totalSteps: number;
  completedStepsCount: number;
  completedStepIds: string[];
  rawScore: number;
  finalScore: number; // 0 to 100
  ratingTitleFr: string;
  ratingBadgeColor: string;
  hasCheckedLogs: boolean;
  hasCheckedSockets: boolean;
  hasCheckedStatus: boolean;
  hasVerifiedProbe: boolean;
  blindRestartDeduction: number;
  timeline: InvestigationTimelineItem[];
  debriefingFr: string[];
}

export class MissionInvestigationTracker {
  private mission: LinuxMission;
  private timeline: InvestigationTimelineItem[] = [];
  private completedStepIds: Set<string> = new Set();
  private blindRestartCount: number = 0;
  private totalCommandsCount: number = 0;

  constructor(mission: LinuxMission) {
    this.mission = mission;
  }

  /**
   * Observe a newly executed command
   */
  public observeCommand(command: string, exitCode: number, output: string): InvestigationTimelineItem {
    const trimmed = command.trim();
    this.totalCommandsCount++;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // 1. Check if command matches any expected diagnostic step
    let matchedStep: MissionDiagnosticStep | undefined;
    for (const step of this.mission.diagnosticSteps) {
      if (step.matchedCommandPatterns.some((pattern) => pattern.test(trimmed))) {
        matchedStep = step;
        break;
      }
    }

    // 2. Detect blind restart (restarting before checking logs or sockets)
    let scoreDelta = 0;
    let pedagogicalNoteFr = '';
    const isRestartAttempt = /^systemctl\s+(start|restart)/.test(trimmed);
    const hasInspectedCause =
      this.completedStepIds.has('step_logs') ||
      this.completedStepIds.has('step_sockets') ||
      this.completedStepIds.has('step_disk') ||
      this.completedStepIds.has('step_ip_route');

    if (isRestartAttempt && !hasInspectedCause && !this.completedStepIds.has('step_remediate') && !this.completedStepIds.has('step_purge')) {
      this.blindRestartCount++;
      scoreDelta = this.mission.penalties.blindRestart;
      pedagogicalNoteFr = '⚠️ Relance aveugle sans diagnostic préalable des logs ou des ports. En production, cela peut aggraver l\'incident.';
    }

    if (matchedStep) {
      const isNewStep = !this.completedStepIds.has(matchedStep.id);
      if (isNewStep) {
        this.completedStepIds.add(matchedStep.id);
        scoreDelta += matchedStep.points;
        pedagogicalNoteFr = `✓ ${matchedStep.descriptionFr}`;
      } else {
        pedagogicalNoteFr = `Ré-exécution de l'étape : ${matchedStep.nameFr}`;
      }
    } else if (!pedagogicalNoteFr) {
      // General feedback based on command category
      if (trimmed.startsWith('ls') || trimmed.startsWith('cd') || trimmed.startsWith('pwd')) {
        pedagogicalNoteFr = 'Exploration du système de fichiers.';
      } else if (trimmed.startsWith('cat') || trimmed.startsWith('tail') || trimmed.startsWith('head')) {
        pedagogicalNoteFr = 'Consultation de fichier.';
      } else if (trimmed.startsWith('help') || trimmed.startsWith('man')) {
        pedagogicalNoteFr = 'Consultation de la documentation.';
      } else {
        pedagogicalNoteFr = exitCode === 0 ? 'Commande exécutée avec succès.' : 'Commande renvoyant un code d\'erreur.';
      }
    }

    const timelineItem: InvestigationTimelineItem = {
      id: `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      command: trimmed,
      category: matchedStep ? matchedStep.category : 'misc',
      categoryLabelFr: matchedStep ? matchedStep.categoryLabelFr : 'Terminal',
      matchedStepId: matchedStep?.id,
      matchedStepNameFr: matchedStep?.nameFr,
      pedagogicalNoteFr,
      scoreDelta
    };

    this.timeline.push(timelineItem);
    return timelineItem;
  }

  /**
   * Generates the real-time methodology analysis report
   */
  public generateReport(): MissionMethodologyReport {
    const totalPossiblePoints = this.mission.diagnosticSteps.reduce((acc, s) => acc + s.points, 0) || 100;
    let earnedPoints = 0;

    for (const stepId of this.completedStepIds) {
      const s = this.mission.diagnosticSteps.find((step) => step.id === stepId);
      if (s) earnedPoints += s.points;
    }

    // Apply penalties
    const blindDeduction = this.blindRestartCount * Math.abs(this.mission.penalties.blindRestart);
    const computedScore = Math.max(0, Math.min(100, Math.round((earnedPoints / totalPossiblePoints) * 100) - blindDeduction));

    // Rating appraisal
    let ratingTitleFr = 'Démarche Exemplaire (Senior Sysadmin)';
    let ratingBadgeColor = '#28A745';

    if (computedScore < 45) {
      ratingTitleFr = 'Démarche Hasardeuse & Désordonnée';
      ratingBadgeColor = '#DC3545';
    } else if (computedScore < 70) {
      ratingTitleFr = 'Démarche Débrouillarde mais Tâtonnante';
      ratingBadgeColor = '#FD7E14';
    } else if (computedScore < 88) {
      ratingTitleFr = 'Démarche Méthodique & Professionnelle';
      ratingBadgeColor = '#007BFF';
    }

    // Specific debriefing points
    const debriefingFr: string[] = [];
    const hasCheckedStatus = this.completedStepIds.has('step_status');
    const hasCheckedLogs = this.completedStepIds.has('step_logs') || this.completedStepIds.has('step_check_error_log');
    const hasCheckedSockets = this.completedStepIds.has('step_sockets') || this.completedStepIds.has('step_ip_route') || this.completedStepIds.has('step_disk');
    const hasVerifiedProbe = this.completedStepIds.has('step_verify') || this.completedStepIds.has('step_verify_db') || this.completedStepIds.has('step_ping_success') || this.completedStepIds.has('step_verify_200');

    if (hasCheckedStatus) {
      debriefingFr.push('✓ Constat d\'état initial rigoureux avant toute intervention intrusive.');
    } else {
      debriefingFr.push('⚠️ Absence de vérification d\'état formelle (systemctl status) en ouverture d\'incident.');
    }

    if (hasCheckedLogs) {
      debriefingFr.push('✓ Analyse approfondie des journaux (journalctl / logs) pour identifier la cause racine exacte.');
    } else {
      debriefingFr.push('⚠️ Les journaux d\'erreurs n\'ont pas été pleinement exploités.');
    }

    if (hasCheckedSockets) {
      debriefingFr.push('✓ Audit fin des sockets et de la configuration avant remédiation.');
    }

    if (this.blindRestartCount > 0) {
      debriefingFr.push(`❌ ${this.blindRestartCount} tentative(s) de redémarrage aveugle avant analyse causale.`);
    }

    if (hasVerifiedProbe) {
      debriefingFr.push('✓ Validation finale par sonde fonctionnelle (curl / ping / status).');
    }

    return {
      missionId: this.mission.id,
      totalSteps: this.mission.diagnosticSteps.length,
      completedStepsCount: this.completedStepIds.size,
      completedStepIds: Array.from(this.completedStepIds),
      rawScore: earnedPoints,
      finalScore: computedScore,
      ratingTitleFr,
      ratingBadgeColor,
      hasCheckedLogs,
      hasCheckedSockets,
      hasCheckedStatus,
      hasVerifiedProbe,
      blindRestartDeduction: blindDeduction,
      timeline: [...this.timeline],
      debriefingFr
    };
  }

  public reset(): void {
    this.timeline = [];
    this.completedStepIds.clear();
    this.blindRestartCount = 0;
    this.totalCommandsCount = 0;
  }
}
