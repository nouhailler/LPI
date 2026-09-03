import { Flashcard } from '../types';
import { topic205Part1 } from './topic205/part1';
import { topic205Part2 } from './topic205/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 201 - Topic 205: Network Configuration
 * 
 * Sub-objectives:
 * - 205.1: Basic Networking Configuration (Cards 2501-2535) [35 Cards] (Weight 3)
 * - 205.2: Advanced Network Configuration and Troubleshooting (Cards 2536-2570) [35 Cards] (Weight 4)
 * - 205.3: Troubleshooting Network Issues (Cards 2571-2600) [30 Cards] (Weight 4)
 * Total: 100 Interactive Flashcards
 */
export const topic205Flashcards: Flashcard[] = [
  ...topic205Part1,
  ...topic205Part2,
];
