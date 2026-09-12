import { SequencingChallenge } from '../types';
import { lpic1Sequencing101 } from './lpic1Sequencing101';
import { lpic1Sequencing102 } from './lpic1Sequencing102';

export { lpic1Sequencing101, lpic1Sequencing102 };

export const lpic1SequencingChallenges: SequencingChallenge[] = [
  ...lpic1Sequencing101,
  ...lpic1Sequencing102
];
