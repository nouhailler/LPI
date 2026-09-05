import { Flashcard } from '../types';
import { topic210Part1 } from './topic210/part1';
import { topic210Part2 } from './topic210/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 202 - Topic 210: Network Client Management
 * 
 * Sub-objectives:
 * - 210.1: DHCP Configuration (Cards 3001-3030) [30 Cards] (Weight 2)
 * - 210.2: PAM Authentication (Cards 3031-3070) [40 Cards] (Weight 3)
 * - 210.3: LDAP Client Usage (Cards 3071-3100) [30 Cards] (Weight 2)
 * Total: 100 Interactive Flashcards (Total Weight 7)
 */
export const topic210Flashcards: Flashcard[] = [
  ...topic210Part1,
  ...topic210Part2,
];
