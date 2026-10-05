import { SimulatedLabScenario } from '../services/virtualFs/types';

export interface StageGroup {
  id: string;
  stageNumber: number;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  scenarioIds: string[];
}

/**
 * Canonical Stage definitions for the Linux Lab Roadmap Visual Map.
 * Every scenario in simulatedLabScenarios should be cleanly organized here.
 */
export const LAB_MAP_STAGES: StageGroup[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Core Essentials & File Permissions',
    titleFr: 'Niveau 1 : Fondamentaux & Permissions Fichiers',
    description: 'Master file rights, redirection streams, and symbolic links.',
    descriptionFr: 'Maîtriser les droits d\'accès, flux de redirection et liens symboliques.',
    scenarioIds: ['lab-chmod-backup', 'lab-grep-auth', 'lab-symlink-creation'],
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Systems Administration & Backups',
    titleFr: 'Niveau 2 : Administration Système & Sauvegardes',
    description: 'Recursive ownership, tar gzip archives, and directory cleanup.',
    descriptionFr: 'Propriété récursive, archives tar compressées et nettoyage.',
    scenarioIds: ['lab-chown-ownership', 'lab-tar-archive', 'lab-find-and-clean'],
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Processes, Services & Text Processing',
    titleFr: 'Niveau 3 : Processus, Services & Pipelines Textuels',
    description: 'Signal handling, systemd service management, and stream filters (sed & awk).',
    descriptionFr: 'Gestion des signaux, supervision systemd et traitement de flux (sed & awk).',
    scenarioIds: [
      'lab-kill-process',
      'lab-systemd-service',
      'lab-text-filter-pipeline',
      'lab-text-filter-sed-awk',
    ],
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: Security Hardening, Networking & Storage',
    titleFr: 'Niveau 4 : Durcissement, Réseau & Disques',
    description: 'Protect sensitive files, test network routes, and mount storage devices (/etc/fstab).',
    descriptionFr: 'Sécuriser /etc/shadow, diagnostiquer le réseau et monter des disques (/etc/fstab).',
    scenarioIds: [
      'lab-security-shadow',
      'lab-network-ping-diag',
      'lab-network-db-conn',
      'lab-storage-mount-disk',
      'lab-fstab-mount-umount',
    ],
  },
];

/**
 * Returns all scenario IDs explicitly declared in the static Lab Map stages.
 */
export function getExplicitlyMappedLabIds(): string[] {
  return LAB_MAP_STAGES.flatMap((stage) => stage.scenarioIds);
}

/**
 * Dynamically resolves full lab map stages, ensuring that even if new scenarios
 * are added to the catalog without an explicit stage declaration, they are NEVER
 * absent from the visual progression (dynamic fallback safeguard).
 */
export function resolveFullLabMapStages(catalogScenarios: SimulatedLabScenario[]): {
  stages: StageGroup[];
  hasUnmappedScenarios: boolean;
  unmappedScenarioIds: string[];
} {
  const explicitlyMappedIds = new Set(getExplicitlyMappedLabIds());
  const unmapped = catalogScenarios.filter((s) => !explicitlyMappedIds.has(s.id));

  if (unmapped.length === 0) {
    return {
      stages: LAB_MAP_STAGES,
      hasUnmappedScenarios: false,
      unmappedScenarioIds: [],
    };
  }

  // Generate an automated overflow stage so that visual coverage is always 100%
  const nextStageNum = LAB_MAP_STAGES.length + 1;
  const fallbackStage: StageGroup = {
    id: `stage-${nextStageNum}-dynamic`,
    stageNumber: nextStageNum,
    title: `Stage ${nextStageNum}: Dynamic Labs & Extensions`,
    titleFr: `Niveau ${nextStageNum} : Ateliers & Scénarios Complémentaires`,
    description: 'Automated stage grouping scenarios pending static curriculum placement.',
    descriptionFr: 'Scénarios pratiques automatiquement intégrés en attente de classement définitif.',
    scenarioIds: unmapped.map((s) => s.id),
  };

  return {
    stages: [...LAB_MAP_STAGES, fallbackStage],
    hasUnmappedScenarios: true,
    unmappedScenarioIds: unmapped.map((s) => s.id),
  };
}
