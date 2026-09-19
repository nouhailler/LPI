import { IncidentScenario } from '../types';
import { lpic1IncidentScenarios } from './incidentScenarios/scenariosLpic1';
import { lpic2IncidentScenarios } from './incidentScenarios/scenariosLpic2';
import { lpic3IncidentScenarios } from './incidentScenarios/scenariosLpic3';

/**
 * 🚨 INCIDENT RESPONSE - SUITE DE 15 SCÉNARIOS DE DÉPANNAGE RÉALISTES
 * Conçus pour entraîner le raisonnement d'administration système :
 * 
 * 🔹 LPIC-1 (8 Scénarios : Démarrage, Disques, Inodes, Ports, SSH, Routage, GRUB/Kernel Panic, DNS, OOM Killer)
 * 🔸 LPIC-2 (4 Scénarios : Grappe RAID-1 mdadm, LVM Snapshot overflow, Workers PHP-FPM, Montage NFS Stale)
 * 🛡️ LPIC-3 (3 Scénarios : Sécurité SELinux AVC, Chaîne TLS/SSL & Expiration, Durcissement Fail2ban/iptables)
 */

export const incidentScenarios: IncidentScenario[] = [
  ...lpic1IncidentScenarios,
  ...lpic2IncidentScenarios,
  ...lpic3IncidentScenarios
];

export { lpic1IncidentScenarios, lpic2IncidentScenarios, lpic3IncidentScenarios };

export const getIncidentScenariosCount = () => incidentScenarios.length;
