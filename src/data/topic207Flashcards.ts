import { Flashcard } from '../types';
import { topic207Part1 } from './topic207/part1';
import { topic207Part2 } from './topic207/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 202 - Topic 207: Domain Name Server (DNS)
 * 
 * Sub-objectives:
 * - 207.1: Basic DNS Server Configuration (Cards 2701-2735) [35 Cards] (Weight 4)
 * - 207.2: Create and Maintain DNS Zones (Cards 2736-2770) [35 Cards] (Weight 4)
 * - 207.3: Securing a DNS Server (Cards 2771-2800) [30 Cards] (Weight 4)
 * Total: 100 Interactive Flashcards
 */

export const topic207Flashcards: Flashcard[] = [
  ...topic207Part1,
  ...topic207Part2,
];
