import { Flashcard } from '../types';
import { topic211Part1 } from './topic211/part1';
import { topic211Part2 } from './topic211/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 202 - Topic 211: E-Mail Services
 * 
 * Sub-objectives:
 * - 211.1: Using E-Mail Servers (Postfix/Sendmail) (Cards 3101-3150) [50 Cards] (Weight 4)
 * - 211.2: Managing E-Mail Delivery (Cards 3151-3175) [25 Cards] (Weight 2)
 * - 211.3: Managing Remote E-Mail Delivery (Cards 3176-3200) [25 Cards] (Weight 2)
 * Total: 100 Interactive Flashcards (Total Weight 8)
 */
export const topic211Flashcards: Flashcard[] = [
  ...topic211Part1,
  ...topic211Part2,
];
