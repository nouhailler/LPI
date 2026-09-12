import { TroubleshootingChallenge } from '../types';
import { lpic1Exam101Troubleshooting } from './lpic1Exam101Troubleshooting';
import { lpic1Exam102Troubleshooting } from './lpic1Exam102Troubleshooting';

/**
 * EXACTEMENT 100 DÉFIS DE DÉPANNAGE EXCLUSIFS POUR LA CERTIFICATION LPIC-1
 *
 * Découpage :
 * - 50 Défis Dépannage Examen 101 (Topics 101, 102, 103, 104)
 * - 50 Défis Dépannage Examen 102 (Topics 105, 106, 107, 108, 109, 110)
 *
 * Total = 100 défis de dépannage 100% conformes aux objectifs officiels LPIC-1 (v5.0)
 */
export const lpic1TroubleshootingChallenges: TroubleshootingChallenge[] = [
  ...lpic1Exam101Troubleshooting,
  ...lpic1Exam102Troubleshooting
];

export { lpic1Exam101Troubleshooting, lpic1Exam102Troubleshooting };
