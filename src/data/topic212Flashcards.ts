import { Flashcard } from '../types';
import { topic212Part1 } from './topic212/part1';
import { topic212Part2 } from './topic212/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 202 - Topic 212: System Security
 * 
 * Sub-objectives:
 * - 212.1: Configuring a Router (Firewalling & NAT) (Cards 3201-3235) [35 Cards] (Weight 3)
 * - 212.2: Managing Network Security (Cards 3236-3275) [40 Cards] (Weight 4)
 * - 212.3: OpenVPN & IPsec (Cards 3276-3300) [25 Cards] (Weight 3)
 * Total: 100 Interactive Flashcards (Total Weight 10)
 */
export const topic212Flashcards: Flashcard[] = [
  ...topic212Part1,
  ...topic212Part2,
];
