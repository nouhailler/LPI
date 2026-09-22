/**
 * Text filtering utilities for the LPI Virtual Terminal:
 * sed, awk, cut, sort, uniq, wc
 */

import { VirtualFs } from './VirtualFs';
import { CommandExecutionResult } from './types';

interface FileOrStdinReader {
  (path: string): string | null;
}

/**
 * wc — word, line, character, or byte count
 */
export function executeWc(
  args: string[],
  stdinText: string,
  readFile: FileOrStdinReader
): CommandExecutionResult {
  let countLines = false;
  let countWords = false;
  let countBytes = false;
  let countChars = false;
  const files: string[] = [];

  for (const a of args) {
    if (a.startsWith('-') && a.length > 1) {
      if (a.includes('l')) countLines = true;
      if (a.includes('w')) countWords = true;
      if (a.includes('c')) countBytes = true;
      if (a.includes('m')) countChars = true;
    } else {
      files.push(a);
    }
  }

  // Default: lines, words, bytes
  if (!countLines && !countWords && !countBytes && !countChars) {
    countLines = true;
    countWords = true;
    countBytes = true;
  }

  const processText = (text: string) => {
    const lines = text === '' ? 0 : text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const bytes = new TextEncoder().encode(text).length;
    const chars = text.length;
    return { lines, words, bytes, chars };
  };

  const formatCounts = (c: { lines: number; words: number; bytes: number; chars: number }, label?: string) => {
    const parts: string[] = [];
    if (countLines) parts.push(String(c.lines).padStart(4));
    if (countWords) parts.push(String(c.words).padStart(4));
    if (countBytes) parts.push(String(c.bytes).padStart(5));
    else if (countChars) parts.push(String(c.chars).padStart(5));
    if (label) parts.push(label);
    return parts.join(' ');
  };

  if (files.length === 0) {
    const counts = processText(stdinText);
    return { output: formatCounts(counts), exitCode: 0 };
  }

  const results: string[] = [];
  let totalLines = 0;
  let totalWords = 0;
  let totalBytes = 0;
  let totalChars = 0;

  for (const f of files) {
    const content = readFile(f);
    if (content === null) {
      return { output: `wc: ${f}: No such file or directory`, exitCode: 1 };
    }
    const counts = processText(content);
    totalLines += counts.lines;
    totalWords += counts.words;
    totalBytes += counts.bytes;
    totalChars += counts.chars;
    results.push(formatCounts(counts, f));
  }

  if (files.length > 1) {
    results.push(formatCounts({ lines: totalLines, words: totalWords, bytes: totalBytes, chars: totalChars }, 'total'));
  }

  return { output: results.join('\n'), exitCode: 0 };
}

/**
 * cut — remove sections from each line of files
 */
export function executeCut(
  args: string[],
  stdinText: string,
  readFile: FileOrStdinReader
): CommandExecutionResult {
  let delimiter = '\t';
  let fieldsSpec: string | null = null;
  let charsSpec: string | null = null;
  const files: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-d' && i + 1 < args.length) {
      delimiter = args[i + 1];
      i++;
    } else if (a.startsWith('-d')) {
      delimiter = a.slice(2);
    } else if (a === '-f' && i + 1 < args.length) {
      fieldsSpec = args[i + 1];
      i++;
    } else if (a.startsWith('-f')) {
      fieldsSpec = a.slice(2);
    } else if (a === '-c' && i + 1 < args.length) {
      charsSpec = args[i + 1];
      i++;
    } else if (a.startsWith('-c')) {
      charsSpec = a.slice(2);
    } else if (!a.startsWith('-')) {
      files.push(a);
    }
  }

  if (!fieldsSpec && !charsSpec) {
    return { output: 'cut: you must specify a list of bytes, characters, or fields (-f or -c)', exitCode: 1 };
  }

  // Parse indices (e.g. "1", "1,3", "2-4", "-3", "2-")
  const parseRange = (spec: string): ((idx: number) => boolean) => {
    const parts = spec.split(',');
    const matchers: ((idx: number) => boolean)[] = [];

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = startStr ? parseInt(startStr, 10) : 1;
        const end = endStr ? parseInt(endStr, 10) : Infinity;
        matchers.push((idx) => idx >= start && idx <= end);
      } else {
        const exact = parseInt(part, 10);
        matchers.push((idx) => idx === exact);
      }
    }

    return (idx: number) => matchers.some((m) => m(idx));
  };

  const processLines = (rawText: string): string => {
    const lines = rawText.split('\n');
    const outLines: string[] = [];

    if (fieldsSpec) {
      const matchField = parseRange(fieldsSpec);
      for (const line of lines) {
        if (!line.includes(delimiter)) {
          outLines.push(line);
          continue;
        }
        const tokens = line.split(delimiter);
        const selected = tokens.filter((_, idx) => matchField(idx + 1));
        outLines.push(selected.join(delimiter));
      }
    } else if (charsSpec) {
      const matchChar = parseRange(charsSpec);
      for (const line of lines) {
        let res = '';
        for (let j = 0; j < line.length; j++) {
          if (matchChar(j + 1)) {
            res += line[j];
          }
        }
        outLines.push(res);
      }
    }

    return outLines.join('\n');
  };

  if (files.length === 0) {
    return { output: processLines(stdinText), exitCode: 0 };
  }

  let fullOut = '';
  for (const f of files) {
    const content = readFile(f);
    if (content === null) {
      return { output: `cut: ${f}: No such file or directory`, exitCode: 1 };
    }
    const processed = processLines(content);
    fullOut += (fullOut ? '\n' : '') + processed;
  }

  return { output: fullOut, exitCode: 0 };
}

/**
 * sort — sort lines of text files
 */
export function executeSort(
  args: string[],
  stdinText: string,
  readFile: FileOrStdinReader
): CommandExecutionResult {
  let reverse = false;
  let numeric = false;
  let unique = false;
  let keyPos: number | null = null;
  let delimiter: string | null = null;
  const files: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('-') && a.length > 1) {
      if (a.includes('r')) reverse = true;
      if (a.includes('n')) numeric = true;
      if (a.includes('u')) unique = true;
      if (a === '-k' && i + 1 < args.length) {
        keyPos = parseInt(args[i + 1], 10) || null;
        i++;
      } else if (a.startsWith('-k')) {
        keyPos = parseInt(a.slice(2), 10) || null;
      } else if (a === '-t' && i + 1 < args.length) {
        delimiter = args[i + 1];
        i++;
      } else if (a.startsWith('-t')) {
        delimiter = a.slice(2);
      }
    } else {
      files.push(a);
    }
  }

  let textToSort = '';
  if (files.length === 0) {
    textToSort = stdinText;
  } else {
    for (const f of files) {
      const content = readFile(f);
      if (content === null) {
        return { output: `sort: cannot read: ${f}: No such file or directory`, exitCode: 2 };
      }
      textToSort += (textToSort ? '\n' : '') + content.trimEnd();
    }
  }

  let lines = textToSort.split('\n').filter((l, idx, arr) => !(l === '' && idx === arr.length - 1));

  lines.sort((a, b) => {
    let valA = a;
    let valB = b;

    if (keyPos !== null) {
      const splitA = delimiter ? a.split(delimiter) : a.trim().split(/\s+/);
      const splitB = delimiter ? b.split(delimiter) : b.trim().split(/\s+/);
      valA = splitA[keyPos - 1] ?? '';
      valB = splitB[keyPos - 1] ?? '';
    }

    if (numeric) {
      const numA = parseFloat(valA) || 0;
      const numB = parseFloat(valB) || 0;
      return numA - numB;
    }

    return valA.localeCompare(valB);
  });

  if (reverse) {
    lines.reverse();
  }

  if (unique) {
    lines = Array.from(new Set(lines));
  }

  return { output: lines.join('\n'), exitCode: 0 };
}

/**
 * uniq — report or omit repeated lines
 */
export function executeUniq(
  args: string[],
  stdinText: string,
  readFile: FileOrStdinReader
): CommandExecutionResult {
  let count = false;
  let repeatedOnly = false;
  let uniqueOnly = false;
  let ignoreCase = false;
  const files: string[] = [];

  for (const a of args) {
    if (a.startsWith('-') && a.length > 1) {
      if (a.includes('c')) count = true;
      if (a.includes('d')) repeatedOnly = true;
      if (a.includes('u')) uniqueOnly = true;
      if (a.includes('i')) ignoreCase = true;
    } else {
      files.push(a);
    }
  }

  let text = stdinText;
  if (files.length > 0) {
    const content = readFile(files[0]);
    if (content === null) {
      return { output: `uniq: ${files[0]}: No such file or directory`, exitCode: 1 };
    }
    text = content;
  }

  const lines = text.split('\n').filter((l, idx, arr) => !(l === '' && idx === arr.length - 1));
  const groups: { line: string; count: number }[] = [];

  for (const line of lines) {
    const last = groups[groups.length - 1];
    const match = last && (ignoreCase ? last.line.toLowerCase() === line.toLowerCase() : last.line === line);
    if (match) {
      last.count++;
    } else {
      groups.push({ line, count: 1 });
    }
  }

  const outLines: string[] = [];
  for (const g of groups) {
    if (repeatedOnly && g.count === 1) continue;
    if (uniqueOnly && g.count > 1) continue;

    if (count) {
      outLines.push(`${String(g.count).padStart(7)} ${g.line}`);
    } else {
      outLines.push(g.line);
    }
  }

  return { output: outLines.join('\n'), exitCode: 0 };
}

/**
 * sed — stream editor for filtering and transforming text
 */
export function executeSed(
  args: string[],
  stdinText: string,
  readFile: FileOrStdinReader,
  fs: VirtualFs,
  cwd: string,
  user: string
): CommandExecutionResult {
  let suppressAutoPrint = false;
  let inPlace = false;
  let script = '';
  const files: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-n') {
      suppressAutoPrint = true;
    } else if (a === '-i') {
      inPlace = true;
    } else if (a === '-e' && i + 1 < args.length) {
      script = args[i + 1];
      i++;
    } else if (!script) {
      // First non-option is script
      script = a;
    } else {
      files.push(a);
    }
  }

  if (!script) {
    return { output: 'sed: no input script specified', exitCode: 1 };
  }

  // Strip wrapping single/double quotes if preserved
  if ((script.startsWith("'") && script.endsWith("'")) || (script.startsWith('"') && script.endsWith('"'))) {
    script = script.slice(1, -1);
  }

  const applyScriptToText = (text: string): string => {
    let lines = text.split('\n');
    const outLines: string[] = [];

    // Parse sed commands:
    // 1. s/pattern/replacement/flags  (or s:pattern:replacement:flags or s#...#...#)
    const substMatch = script.match(/^s([\/#:!|])(.*?)\1(.*?)\1([a-zA-Z0-9]*)$/);
    // 2. Line address delete: e.g. "1d", "1,3d", "/pattern/d"
    const deleteMatch = script.match(/^(\d+|\/.*?\/)(?:,(\d+|\/.*?\/))?d$/);
    // 3. Line address print: e.g. "2p", "2,4p", "/pattern/p"
    const printMatch = script.match(/^(\d+|\/.*?\/)(?:,(\d+|\/.*?\/))?p$/);

    if (substMatch) {
      const pattern = substMatch[2];
      const replacement = substMatch[3];
      const flags = substMatch[4] || '';
      const isGlobal = flags.includes('g');
      const isIgnoreCase = flags.includes('i');
      const printOnSubst = flags.includes('p');

      const re = new RegExp(pattern, `${isGlobal ? 'g' : ''}${isIgnoreCase ? 'i' : ''}`);

      for (const line of lines) {
        const hasMatch = re.test(line);
        re.lastIndex = 0; // Reset state for global regex
        const replaced = line.replace(re, replacement);

        if (suppressAutoPrint) {
          if (hasMatch && printOnSubst) {
            outLines.push(replaced);
          }
        } else {
          outLines.push(replaced);
        }
      }
    } else if (deleteMatch) {
      const startArg = deleteMatch[1];
      const endArg = deleteMatch[2];

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        let shouldDelete = false;

        if (!endArg) {
          if (/^\d+$/.test(startArg)) {
            shouldDelete = lineNum === parseInt(startArg, 10);
          } else {
            const pat = startArg.slice(1, -1);
            shouldDelete = new RegExp(pat).test(line);
          }
        } else {
          const startNum = parseInt(startArg, 10);
          const endNum = parseInt(endArg, 10);
          shouldDelete = lineNum >= startNum && lineNum <= endNum;
        }

        if (!shouldDelete) {
          outLines.push(line);
        }
      });
    } else if (printMatch) {
      const startArg = printMatch[1];
      const endArg = printMatch[2];

      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        let shouldPrint = false;

        if (!endArg) {
          if (/^\d+$/.test(startArg)) {
            shouldPrint = lineNum === parseInt(startArg, 10);
          } else {
            const pat = startArg.slice(1, -1);
            shouldPrint = new RegExp(pat).test(line);
          }
        } else {
          const startNum = parseInt(startArg, 10);
          const endNum = parseInt(endArg, 10);
          shouldPrint = lineNum >= startNum && lineNum <= endNum;
        }

        if (shouldPrint) {
          outLines.push(line);
        } else if (!suppressAutoPrint) {
          outLines.push(line);
        }
      });
    } else {
      // Fallback simple replacement search if no delimiter matched
      return text;
    }

    return outLines.join('\n');
  };

  if (files.length === 0) {
    return { output: applyScriptToText(stdinText), exitCode: 0 };
  }

  let combined = '';
  for (const f of files) {
    const content = readFile(f);
    if (content === null) {
      return { output: `sed: can't read ${f}: No such file or directory`, exitCode: 2 };
    }

    const transformed = applyScriptToText(content);
    if (inPlace) {
      fs.writeFile(f, transformed, false, cwd, user, user);
    } else {
      combined += (combined ? '\n' : '') + transformed;
    }
  }

  return { output: combined, exitCode: 0 };
}

/**
 * awk — pattern scanning and text processing language
 */
export function executeAwk(
  args: string[],
  stdinText: string,
  readFile: FileOrStdinReader
): CommandExecutionResult {
  let fieldSep = /\s+/;
  let customSep: string | null = null;
  let script = '';
  const files: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-F' && i + 1 < args.length) {
      customSep = args[i + 1];
      i++;
    } else if (a.startsWith('-F')) {
      customSep = a.slice(2);
    } else if (!script) {
      script = a;
    } else {
      files.push(a);
    }
  }

  if (!script) {
    return { output: 'awk: no program text specified', exitCode: 1 };
  }

  if ((script.startsWith("'") && script.endsWith("'")) || (script.startsWith('"') && script.endsWith('"'))) {
    script = script.slice(1, -1);
  }

  if (customSep) {
    fieldSep = new RegExp(customSep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  }

  let rawText = stdinText;
  if (files.length > 0) {
    let aggregated = '';
    for (const f of files) {
      const c = readFile(f);
      if (c === null) {
        return { output: `awk: fatal: cannot open file '${f}' for reading: No such file`, exitCode: 2 };
      }
      aggregated += (aggregated ? '\n' : '') + c.trimEnd();
    }
    rawText = aggregated;
  }

  const lines = rawText.split('\n');
  const outLines: string[] = [];

  // Parse pattern filter if present before { ... } e.g. /pattern/ { print $1 }
  let filterPattern: RegExp | null = null;
  let actionBody = script.trim();

  const patternActionMatch = script.match(/^\/(.*?)\/\s*\{(.*)\}$/);
  if (patternActionMatch) {
    filterPattern = new RegExp(patternActionMatch[1]);
    actionBody = `{${patternActionMatch[2]}}`;
  }

  // Extract print arguments: e.g. {print $1, $3} or {print $0} or {print "User:" $1}
  const printMatch = actionBody.match(/\{(?:\s*print\s*(.*?))?\s*\}/);

  for (let nr = 0; nr < lines.length; nr++) {
    const line = lines[nr];
    if (line === '' && nr === lines.length - 1) continue;

    if (filterPattern && !filterPattern.test(line)) {
      continue;
    }

    // Line split by field separator
    const fields = line.split(fieldSep);
    const nf = fields.length;

    if (!printMatch) {
      // Default AWK action is print whole line
      outLines.push(line);
      continue;
    }

    const printExpr = printMatch[1]?.trim();
    if (!printExpr || printExpr === '$0') {
      outLines.push(line);
      continue;
    }

    // Evaluate print expressions separated by comma (comma inserts OFS = space)
    const items = printExpr.split(',').map((it) => it.trim());
    const renderedParts: string[] = [];

    for (const item of items) {
      if (item === '$0') {
        renderedParts.push(line);
      } else if (item === 'NR') {
        renderedParts.push(String(nr + 1));
      } else if (item === 'NF') {
        renderedParts.push(String(nf));
      } else if (/^\$(\d+)$/.test(item)) {
        const colIndex = parseInt(item.slice(1), 10);
        renderedParts.push(fields[colIndex - 1] ?? '');
      } else if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
        renderedParts.push(item.slice(1, -1));
      } else {
        // Evaluate simple field token or literal
        renderedParts.push(item);
      }
    }

    outLines.push(renderedParts.join(' '));
  }

  return { output: outLines.join('\n'), exitCode: 0 };
}
