import { TroubleshootingChallenge } from '../types';
import { lpic3Troubleshoot300 } from './lpic3Troubleshoot300';
import { lpic3Troubleshoot303 } from './lpic3Troubleshoot303';
import { lpic3Troubleshoot305 } from './lpic3Troubleshoot305';
import { lpic3Troubleshoot306 } from './lpic3Troubleshoot306';

/**
 * 100 DÉFIS DE DÉPANNAGE EXCLUSIFS POUR LA CERTIFICATION LPIC-3 UNIQUEMENT
 * 
 * Répartition détaillée par examen de spécialité LPIC-3 :
 * - Examen 300 : Environnements Mixtes & Samba / OpenLDAP (Topics 301-306) : 25 défis
 * - Examen 303 : Sécurité Avancée & Durcissement Linux (Topics 325-328) : 25 défis
 * - Examen 305 : Virtualisation & Conteneurisation (Topics 351-353) : 25 défis
 * - Examen 306 : Haute Disponibilité & Clusters de Stockage (Topics 361-364) : 25 défis
 * 
 * Total : 100 défis de dépannage de niveau Entreprise / Architecte réservés strictement à LPIC-3.
 */
export const lpic3TroubleshootingChallenges: TroubleshootingChallenge[] = [
  ...lpic3Troubleshoot300,
  ...lpic3Troubleshoot303,
  ...lpic3Troubleshoot305,
  ...lpic3Troubleshoot306,
];

export {
  lpic3Troubleshoot300,
  lpic3Troubleshoot303,
  lpic3Troubleshoot305,
  lpic3Troubleshoot306,
};
