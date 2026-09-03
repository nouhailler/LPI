import { Flashcard } from '../types';
import { topic203Part1 } from './topic203/part1';
import { topic203Part2 } from './topic203/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 201 - Topic 203: Filesystem and Devices
 * 
 * Sub-objectives:
 * - 203.1: Operating the Linux Filesystem (Cards 2301-2340) [40 Cards] (Weight 3)
 * - 203.2: Maintaining a Linux Filesystem (Cards 2341-2375) [35 Cards] (Weight 3)
 * - 203.3: Creating and Configuring Filesystem Options (Cards 2376-2400) [25 Cards] (Weight 2)
 * Total: 100 Interactive Flashcards
 */

export const topic203Flashcards: Flashcard[] = [
  ...topic203Part1,
  ...topic203Part2,
];
