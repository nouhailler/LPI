import { LearningPath, LearningPathCategoryId } from './types';
import { fundamentalsLearningPaths } from './fundamentalsPaths';
import { adminLearningPaths } from './adminPaths';
import { networkingLearningPaths } from './networkingPaths';
import { securityLearningPaths } from './securityPaths';
import { practicalLearningPaths } from './practicalPaths';

export * from './types';
export * from './fundamentalsPaths';
export * from './adminPaths';
export * from './networkingPaths';
export * from './securityPaths';
export * from './practicalPaths';

export const allLearningPaths: LearningPath[] = [
  ...fundamentalsLearningPaths,
  ...adminLearningPaths,
  ...networkingLearningPaths,
  ...securityLearningPaths,
  ...practicalLearningPaths,
];

export function getLearningPathById(id: string): LearningPath | undefined {
  return allLearningPaths.find((path) => path.id === id);
}

export function getPathsByCategory(category: LearningPathCategoryId): LearningPath[] {
  return allLearningPaths.filter((path) => path.category === category);
}

export const learningPathCategories: {
  id: LearningPathCategoryId;
  name: string;
  nameFr: string;
  emoji: string;
  description: string;
  descriptionFr: string;
}[] = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    nameFr: 'Parcours fondamentaux',
    emoji: '🐧',
    description: 'Essential foundations: from terminal first steps to shell scripting and filesystem permissions.',
    descriptionFr: 'Le socle indispensable : du premier terminal aux scripts Bash et aux permissions de fichiers.',
  },
  {
    id: 'admin',
    name: 'System Administration',
    nameFr: 'Administration système',
    emoji: '⚙️',
    description: 'Day-to-day enterprise system engineering: services, systemd, processes, packages, and storage.',
    descriptionFr: 'L\'ingénierie système quotidienne : services, systemd, processus, paquets et stockage.',
  },
  {
    id: 'networking',
    name: 'Linux Networking',
    nameFr: 'Réseau Linux',
    emoji: '🌐',
    description: 'Routing, VLANs, network services (SSH, DNS, Nginx), and production server setup.',
    descriptionFr: 'Routage, VLANs, services réseau (SSH, DNS, Nginx) et installation de serveurs de production.',
  },
  {
    id: 'security',
    name: 'Security & Hardening',
    nameFr: 'Sécurité & Hardening',
    emoji: '🔐',
    description: 'Defensive administration: least privilege, CIS benchmark hardening, and live incident triage.',
    descriptionFr: 'Administration défensive : moindre privilège, durcissement CIS et réponse à incident en direct.',
  },
  {
    id: 'practical',
    name: 'Practical & DevOps',
    nameFr: 'Parcours pratiques & DevOps',
    emoji: '🛠️',
    description: 'Incident resolution drill, DevOps delivery, automation with cron/timers, and developer tooling.',
    descriptionFr: 'Dépannage d\'urgence, pratiques DevOps, automatisation (cron/timers) et boîte à outils développeur.',
  },
];
