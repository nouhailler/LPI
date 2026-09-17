import { SequencingChallenge } from '../types';
import { lpic2Sequencing201 } from './lpic2Sequencing201';
import { lpic2Sequencing202 } from './lpic2Sequencing202';

export { lpic2Sequencing201, lpic2Sequencing202 };

export const lpic2SequencingChallenges: SequencingChallenge[] = [
  ...lpic2Sequencing201,
  ...lpic2Sequencing202
];
