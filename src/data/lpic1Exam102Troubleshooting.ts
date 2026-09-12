import { TroubleshootingChallenge } from '../types';
import { lpic1Troubleshoot102_1 } from './lpic1Troubleshoot102_1';
import { lpic1Troubleshoot102_2 } from './lpic1Troubleshoot102_2';

/**
 * 50 Défis Dépannage EXCLUSIFS à la certification LPIC-1 (Examen 102)
 * Topics couverts :
 * - Topic 105 : Shells et scripts shell (105.1 Environnement shell, 105.2 Scripts shell)
 * - Topic 106 : Interfaces utilisateur et bureaux (106.1 X11, 106.2 Bureaux graphiques, 106.3 Accessibilité)
 * - Topic 107 : Tâches administratives (107.1 Utilisateurs et groupes, 107.2 Automatisation cron/at/timers, 107.3 Localisation et i18n)
 * - Topic 108 : Services système essentiels (108.1 Heure système/NTP, 108.2 Journalisation/Syslog/Journald, 108.3 MTA/Postfix, 108.4 Impression/CUPS)
 * - Topic 109 : Fondamentaux du réseau (109.1 Protocoles IPv4/IPv6, 109.2 Configuration persistante, 109.3 Dépannage réseau, 109.4 DNS client)
 * - Topic 110 : Sécurité (110.1 Administration sécurité, 110.2 Sécurité de l'hôte, 110.3 Chiffrement et SSH)
 */
export const lpic1Exam102Troubleshooting: TroubleshootingChallenge[] = [
  ...lpic1Troubleshoot102_1,
  ...lpic1Troubleshoot102_2
];
