import { Flashcard } from '../types';
import { topic209Part1 } from './topic209/part1';
import { topic209Part2 } from './topic209/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 202 - Topic 209: File Sharing
 * 
 * Sub-objectives:
 * - 209.1: SAMBA Server Configuration (Cards 2901-2960) [60 Cards] (Weight 5)
 * - 209.2: NFS Server Configuration (Cards 2961-3000) [40 Cards] (Weight 3)
 * Total: 100 Interactive Flashcards (Total Weight 8/11)
 */
export const topic209Flashcards: Flashcard[] = [
  ...topic209Part1,
  ...topic209Part2,
];
