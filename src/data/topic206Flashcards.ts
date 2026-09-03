import { Flashcard } from '../types';
import { topic206Part1 } from './topic206/part1';
import { topic206Part2 } from './topic206/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 201 - Topic 206: System Maintenance
 * 
 * Sub-objectives:
 * - 206.1: Make and Install Programs from Source (Cards 2601-2635) [35 Cards] (Weight 2)
 * - 206.2: Backup Operations (Cards 2636-2675) [40 Cards] (Weight 3)
 * - 206.3: Notify Users on System-Related Issues (Cards 2676-2700) [25 Cards] (Weight 1)
 * Total: 100 Interactive Flashcards
 */
export const topic206Flashcards: Flashcard[] = [
  ...topic206Part1,
  ...topic206Part2,
];
