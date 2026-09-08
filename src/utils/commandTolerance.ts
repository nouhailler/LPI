/**
 * Intelligent tolerant command and syntax validator for LPI direct fill-in-the-blank inputs.
 */

// Helper to calculate Levenshtein distance for near-miss hints
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const n = a.length;
  const m = b.length;

  if (n === 0) return m;
  if (m === 0) return n;

  for (let i = 0; i <= n; i++) matrix[i] = [i];
  for (let j = 0; j <= m; j++) matrix[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[n][m];
}

/**
 * Normalizes a command string:
 * - Removes leading shell prompts ($ , # , > )
 * - Trims whitespace
 * - Collapses multiple spaces into single space
 * - Removes trailing punctuation (like trailing semicolons)
 */
export function normalizeCommand(input: string, caseSensitive: boolean = false): string {
  let cleaned = input.trim();
  // Strip common prompt symbols at start
  cleaned = cleaned.replace(/^(\$|#|>)\s*/, '');
  // Trim quotes if wrapped completely in quotes
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Remove optional trailing semicolon
  cleaned = cleaned.replace(/;$/, '').trim();

  if (!caseSensitive) {
    cleaned = cleaned.toLowerCase();
  }
  return cleaned;
}

/**
 * Tokenizes flags in a command to allow permutations like:
 * "tar -xvf archive.tar" vs "tar -vxf archive.tar" vs "tar -x -v -f archive.tar"
 */
function extractFlagsAndArgs(cmd: string): { base: string; flags: Set<string>; rest: string[] } {
  const parts = cmd.split(' ');
  const base = parts[0] || '';
  const flags = new Set<string>();
  const rest: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('--')) {
      flags.add(part);
    } else if (part.startsWith('-') && part.length > 1 && !/^[0-9]+$/.test(part.slice(1))) {
      // Split combined short flags like -xvf into -x, -v, -f
      for (const char of part.slice(1)) {
        flags.add(`-${char}`);
      }
    } else {
      rest.push(part);
    }
  }

  return { base, flags, rest };
}

export interface ToleranceValidationResult {
  isCorrect: boolean;
  isNearMiss: boolean;
  normalizedUser: string;
  matchedAnswer?: string;
  feedbackMessage?: string;
}

export function validateCommandTolerance(
  userInput: string,
  expectedAnswers: string[],
  caseSensitive: boolean = false
): ToleranceValidationResult {
  if (!userInput || userInput.trim() === '') {
    return {
      isCorrect: false,
      isNearMiss: false,
      normalizedUser: '',
      feedbackMessage: 'Veuillez entrer une réponse.',
    };
  }

  const normalizedUser = normalizeCommand(userInput, caseSensitive);

  // 1. Direct exact or normalized match
  for (const exp of expectedAnswers) {
    const normExp = normalizeCommand(exp, caseSensitive);
    if (normalizedUser === normExp) {
      return {
        isCorrect: true,
        isNearMiss: false,
        normalizedUser,
        matchedAnswer: exp,
        feedbackMessage: 'Excellente réponse ! Syntaxe exacte.',
      };
    }
  }

  // 2. Tolerance for optional 'sudo ' or path prefix (/bin/, /sbin/, /usr/bin/)
  const userWithoutSudo = normalizedUser.replace(/^sudo\s+/, '');
  for (const exp of expectedAnswers) {
    const normExp = normalizeCommand(exp, caseSensitive);
    const expWithoutSudo = normExp.replace(/^sudo\s+/, '');

    if (userWithoutSudo === expWithoutSudo) {
      return {
        isCorrect: true,
        isNearMiss: false,
        normalizedUser,
        matchedAnswer: exp,
        feedbackMessage: 'Correct ! (Commande validée avec ou sans sudo).',
      };
    }

    // Path tolerance: /usr/bin/crontab vs crontab
    const stripPath = (c: string) => c.replace(/^(\/(usr\/)?(s?bin)\/)/, '');
    if (stripPath(userWithoutSudo) === stripPath(expWithoutSudo)) {
      return {
        isCorrect: true,
        isNearMiss: false,
        normalizedUser,
        matchedAnswer: exp,
        feedbackMessage: 'Correct ! Chemin absolu ou relatif accepté.',
      };
    }
  }

  // 3. Flags permutation tolerance (e.g. tar -czf vs tar -zcf, ls -la vs ls -al)
  const userParsed = extractFlagsAndArgs(normalizedUser);
  for (const exp of expectedAnswers) {
    const normExp = normalizeCommand(exp, caseSensitive);
    const expParsed = extractFlagsAndArgs(normExp);

    if (
      userParsed.base === expParsed.base &&
      userParsed.rest.join(' ') === expParsed.rest.join(' ') &&
      userParsed.flags.size === expParsed.flags.size
    ) {
      const allFlagsMatch = [...expParsed.flags].every((f) => userParsed.flags.has(f));
      if (allFlagsMatch) {
        return {
          isCorrect: true,
          isNearMiss: false,
          normalizedUser,
          matchedAnswer: exp,
          feedbackMessage: 'Correct ! Ordre des options équivalent reconnu.',
        };
      }
    }
  }

  // 4. Near miss / typo detection (Levenshtein distance <= 2 for short, <= 3 for longer commands)
  for (const exp of expectedAnswers) {
    const normExp = normalizeCommand(exp, caseSensitive);
    const dist = getLevenshteinDistance(normalizedUser, normExp);
    const threshold = normExp.length <= 6 ? 1 : normExp.length <= 15 ? 2 : 3;

    if (dist > 0 && dist <= threshold) {
      return {
        isCorrect: false,
        isNearMiss: true,
        normalizedUser,
        feedbackMessage: `Presque ! Vous avez une légère faute de frappe ou une lettre manquante (${dist} diff).`,
      };
    }
  }

  return {
    isCorrect: false,
    isNearMiss: false,
    normalizedUser,
    feedbackMessage: 'Réponse incorrecte. Vérifiez les options, le nom de la commande ou du fichier.',
  };
}
