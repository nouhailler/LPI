import { Flashcard } from '../types';
import { topic208Part1 } from './topic208/part1';
import { topic208Part2 } from './topic208/part2';

/**
 * 100 Comprehensive Interactive Flashcards for LPI LPIC-2 Exam 202 - Topic 208: Web Services
 * 
 * Sub-objectives:
 * - 208.1: Basic Apache Configuration (Cards 2801-2830) [30 Cards] (Weight 4)
 * - 208.2: Apache Configuration for HTTPS (Cards 2831-2855) [25 Cards] (Weight 3)
 * - 208.3: Implementing Squid as a Caching Proxy (Cards 2856-2875) [20 Cards] (Weight 2)
 * - 208.4: Implementing Nginx as a Web Server and Reverse Proxy (Cards 2876-2900) [25 Cards] (Weight 3)
 * Total: 100 Interactive Flashcards (Total Weight 12)
 */
export const topic208Flashcards: Flashcard[] = [
  ...topic208Part1,
  ...topic208Part2,
];
