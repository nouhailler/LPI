import { TroubleshootingChallenge } from '../types';
import { lpic1Troubleshoot101_1 } from './lpic1Troubleshoot101_1';
import { lpic1Troubleshoot101_2 } from './lpic1Troubleshoot101_2';

/**
 * 50 Défis Dépannage EXCLUSIFS à la certification LPIC-1 (Examen 101)
 * Topics couverts :
 * - Topic 101 : Architecture système (Hardware, Boot, Runlevels/Targets)
 * - Topic 102 : Installation de Linux et gestion des paquets (Layout, GRUB, Shared Libs, Debian/RPM)
 * - Topic 103 : Commandes GNU et Unix (Pipes, Streams, Sed, Awk, Tar, Processus, Regex, Vi)
 * - Topic 104 : Périphériques, systèmes de fichiers Linux, FHS (Partitions, Mount, Quotas, Permissions, Inodes)
 */
export const lpic1Exam101Troubleshooting: TroubleshootingChallenge[] = [
  ...lpic1Troubleshoot101_1,
  ...lpic1Troubleshoot101_2
];
