import {
  FillInTheBlankChallenge,
  TroubleshootingChallenge,
  SequencingChallenge,
  MatchingGame,
  GuidedLabScenario,
} from '../types';
import { lpic1Exam101Challenges } from './lpic1Exam101Challenges';
import { lpic1Exam102Challenges } from './lpic1Exam102Challenges';
import { lpic2Exam201Challenges } from './lpic2Exam201Challenges';
import { lpic2Exam202Challenges } from './lpic2Exam202Challenges';
import { lpic3Exam303SecurityChallenges } from './lpic3Exam303SecurityChallenges';
import { lpic3EnterpriseCloudChallenges } from './lpic3EnterpriseCloudChallenges';
import {
  lpic1TroubleshootingChallenges,
  lpic1Exam101Troubleshooting,
  lpic1Exam102Troubleshooting
} from './lpic1TroubleshootingChallenges';
import {
  lpic2TroubleshootingChallenges,
  lpic2Exam201Troubleshooting,
  lpic2Exam202Troubleshooting,
  lpic2Troubleshoot201_1,
  lpic2Troubleshoot201_2,
  lpic2Troubleshoot202_1,
  lpic2Troubleshoot202_2,
} from './lpic2TroubleshootingChallenges';
import {
  lpic3TroubleshootingChallenges,
  lpic3Troubleshoot300,
  lpic3Troubleshoot303,
  lpic3Troubleshoot305,
  lpic3Troubleshoot306
} from './lpic3TroubleshootingChallenges';
import {
  lpic1SequencingChallenges,
  lpic1Sequencing101,
  lpic1Sequencing102
} from './lpic1SequencingChallenges';
import {
  lpic2SequencingChallenges,
  lpic2Sequencing201,
  lpic2Sequencing202
} from './lpic2SequencingChallenges';
import {
  lpic3SequencingChallenges,
  lpic3Sequencing300,
  lpic3Sequencing303,
  lpic3Sequencing305,
  lpic3Sequencing306
} from './lpic3SequencingChallenges';
export {
  lpic3SequencingChallenges,
  lpic3Sequencing300,
  lpic3Sequencing303,
  lpic3Sequencing305,
  lpic3Sequencing306
};

// =========================================================================
// 1. MODULE « SAISIE EXACTE » (100 Défis LPIC-3, 100 Défis LPIC-2, 100 Défis LPIC-1)
// =========================================================================

export const lpic1Challenges: FillInTheBlankChallenge[] = [
  ...lpic1Exam101Challenges,
  ...lpic1Exam102Challenges,
];

export const lpic2Challenges: FillInTheBlankChallenge[] = [
  ...lpic2Exam201Challenges,
  ...lpic2Exam202Challenges,
];

export const lpic3Challenges: FillInTheBlankChallenge[] = [
  ...lpic3Exam303SecurityChallenges,
  ...lpic3EnterpriseCloudChallenges,
];

export const fillInTheBlankChallenges: FillInTheBlankChallenge[] = [
  ...lpic3Challenges,
  ...lpic2Challenges,
  ...lpic1Challenges,
];

// =========================================================================
// 2. MODULE « DÉFIS DE DÉPANNAGE » (100 LPIC-3 + 100 LPIC-2 + 100 LPIC-1)
// =========================================================================

/**
 * Défis de Dépannage pour les certifications LPIC :
 * - 100 Défis de Dépannage EXCLUSIFS pour la certification LPIC-3 (Examens 300, 303, 305, 306)
 * - 100 Défis de Dépannage EXCLUSIFS pour la certification LPIC-2 (Examens 201 et 202)
 * - 100 Défis de Dépannage EXCLUSIFS pour la certification LPIC-1 (Examens 101 et 102)
 */
export const troubleshootingChallenges: TroubleshootingChallenge[] = [
  ...lpic3TroubleshootingChallenges,
  ...lpic2TroubleshootingChallenges,
  ...lpic1TroubleshootingChallenges
];

export {
  lpic1TroubleshootingChallenges,
  lpic1Exam101Troubleshooting,
  lpic1Exam102Troubleshooting,
  lpic2TroubleshootingChallenges,
  lpic2Exam201Troubleshooting,
  lpic2Exam202Troubleshooting,
  lpic2Troubleshoot201_1,
  lpic2Troubleshoot201_2,
  lpic2Troubleshoot202_1,
  lpic2Troubleshoot202_2,
  lpic3TroubleshootingChallenges,
  lpic3Troubleshoot300,
  lpic3Troubleshoot303,
  lpic3Troubleshoot305,
  lpic3Troubleshoot306
};

// =========================================================================
// 3. MODULE « EXERCICES D'ORDONNANCEMENT » (Timeline & Boot Order)
// =========================================================================

export const sequencingChallenges: SequencingChallenge[] = [
  ...lpic1SequencingChallenges,
  ...lpic2SequencingChallenges,
  ...lpic3SequencingChallenges
];

export {
  lpic1SequencingChallenges,
  lpic1Sequencing101,
  lpic1Sequencing102,
  lpic2SequencingChallenges,
  lpic2Sequencing201,
  lpic2Sequencing202
};

// =========================================================================
// 4. MODULE « ATELIERS D'APPARIEMENT » (Matching Games - 60 Ateliers)
// =========================================================================

import {
  matchingGames,
  matchingGamesLpic1,
  matchingGamesLpic2,
  matchingGamesLpic3,
} from './matchingGames';

export {
  matchingGames,
  matchingGamesLpic1,
  matchingGamesLpic2,
  matchingGamesLpic3,
};

// =========================================================================
// 5. MODULE « SCÉNARIOS PRATIQUES GUIDÉS » (Mini-Labs Pas à Pas - 60 Labs)
// =========================================================================

import {
  guidedLabScenarios,
  guidedMiniLabsLpic1,
  guidedMiniLabsLpic2,
  guidedMiniLabsLpic3,
} from './guidedMiniLabsData';

export {
  guidedLabScenarios,
  guidedMiniLabsLpic1,
  guidedMiniLabsLpic2,
  guidedMiniLabsLpic3,
};

