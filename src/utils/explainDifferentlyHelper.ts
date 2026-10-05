import { PedagogicalMode } from '../data/pedagogicalExplanations';

export type TransversalTutorMode =
  | 'simple'
  | 'analogie'
  | 'beginner'
  | 'exemple'
  | 'example'
  | 'expert'
  | 'trap'
  | 'quiz';

export const OPEN_EXPLAIN_DIFFERENTLY_EVENT = 'open-explain-differently';

export interface OpenExplainDifferentlyDetail {
  topic: string;
  mode?: PedagogicalMode;
  context?: string;
}

/**
 * Universal transversal dispatcher to launch "Explique-moi autrement"
 * from ANY component in the app (Glossaire, Flashcard, Mauvaise réponse, Lab échoué).
 */
export function openExplainDifferently(
  topic: string,
  mode: TransversalTutorMode = 'simple',
  context?: string
): void {
  // Normalize alias modes:
  // - analogie / beginner -> 'beginner'
  // - exemple / example -> 'example'
  // - expert / trap -> 'trap'
  // - simple -> 'simple'
  // - quiz -> 'quiz'
  let normalizedMode: PedagogicalMode = 'simple';
  if (mode === 'analogie' || mode === 'beginner') {
    normalizedMode = 'beginner';
  } else if (mode === 'expert' || mode === 'trap') {
    normalizedMode = 'trap';
  } else if (mode === 'exemple' || mode === 'example') {
    normalizedMode = 'example';
  } else if (mode === 'quiz') {
    normalizedMode = 'quiz';
  }

  const detail: OpenExplainDifferentlyDetail = {
    topic: topic.trim(),
    mode: normalizedMode,
    context: context?.trim(),
  };

  window.dispatchEvent(
    new CustomEvent(OPEN_EXPLAIN_DIFFERENTLY_EVENT, { detail })
  );
}

/**
 * Map a lab ID, command, or failure reason to its optimal pedagogical topic ID
 */
export function mapLabToPedagogicalTopic(labIdOrCommand: string, failureReason?: string): string {
  const combined = `${labIdOrCommand} ${failureReason || ''}`.toLowerCase();
  if (combined.includes('chmod') || combined.includes('permission') || combined.includes('octal') || combined.includes('755') || combined.includes('644')) {
    return 'chmod-octal';
  }
  if (combined.includes('umask') || combined.includes('masque')) {
    return 'umask';
  }
  if (combined.includes('chown') || combined.includes('chgrp') || combined.includes('ownership')) {
    return 'chown-chgrp';
  }
  if (combined.includes('link') || combined.includes('symlink') || combined.includes('ln ') || combined.includes('inode')) {
    return 'hard-vs-soft-links';
  }
  if (combined.includes('suid') || combined.includes('sgid') || combined.includes('sticky') || combined.includes('shadow')) {
    return 'suid-sgid-sticky';
  }
  if (combined.includes('systemd') || combined.includes('systemctl') || combined.includes('service') || combined.includes('journalctl')) {
    return 'systemd-systemctl';
  }
  if (
    combined.includes('ping') ||
    combined.includes('curl') ||
    combined.includes('db01') ||
    combined.includes('port') ||
    combined.includes('5432') ||
    combined.includes('connection refused') ||
    combined.includes('db-conn')
  ) {
    return 'network-ping-curl';
  }
  if (combined.includes('route') || combined.includes('gateway') || combined.includes('ip-route') || combined.includes('passerelle')) {
    return 'ip-route';
  }
  if (combined.includes('mount') || combined.includes('fstab') || combined.includes('storage') || combined.includes('disk') || combined.includes('fsck')) {
    return 'fstab-mount';
  }
  if (combined.includes('find') || combined.includes('locate') || combined.includes('which')) {
    return 'find-command';
  }
  if (combined.includes('tar') || combined.includes('archive') || combined.includes('gzip') || combined.includes('bzip2') || combined.includes('xz')) {
    return 'tar-compression';
  }
  if (combined.includes('kill') || combined.includes('signal') || combined.includes('sigterm') || combined.includes('sigkill') || combined.includes('process') || combined.includes('ps ')) {
    return 'kill-signals';
  }
  if (combined.includes('sed') || combined.includes('awk')) {
    return 'sed-awk';
  }
  if (combined.includes('grep') || combined.includes('regex') || combined.includes('egrep')) {
    return 'grep-regex';
  }
  return labIdOrCommand.split(' ')[0] || 'umask';
}

/**
 * Map a question (quiz, practice exam, failed question) to its best pedagogical topic
 */
export function mapQuestionToPedagogicalTopic(q: {
  question?: string;
  category?: string;
  commandSnippet?: string;
  explanation?: string;
}): string {
  const text = `${q.commandSnippet || ''} ${q.question || ''} ${q.category || ''} ${q.explanation || ''}`.toLowerCase();
  
  if (text.includes('umask')) return 'umask';
  if (text.includes('chmod') || text.includes('permission') || text.includes('octal') || text.includes('rwxr')) return 'chmod-octal';
  if (text.includes('chown') || text.includes('chgrp')) return 'chown-chgrp';
  if (text.includes('hard link') || text.includes('soft link') || text.includes('symlink') || text.includes('ln -s') || text.includes('inode')) return 'hard-vs-soft-links';
  if (text.includes('suid') || text.includes('sgid') || text.includes('sticky bit') || text.includes('/etc/shadow')) return 'suid-sgid-sticky';
  if (text.includes('systemctl') || text.includes('systemd') || text.includes('target') || text.includes('daemon') || text.includes('journalctl')) return 'systemd-systemctl';
  if (text.includes('ping') || text.includes('curl') || text.includes('port') || text.includes('nc ') || text.includes('socket') || text.includes('telnet')) return 'network-ping-curl';
  if (text.includes('route') || text.includes('gateway') || text.includes('ip route') || text.includes('default via')) return 'ip-route';
  if (text.includes('fstab') || text.includes('mount') || text.includes('uuid=') || text.includes('fsck')) return 'fstab-mount';
  if (text.includes('find') || text.includes('locate') || text.includes('-exec') || text.includes('-mtime')) return 'find-command';
  if (text.includes('tar ') || text.includes('tar.gz') || text.includes('gzip') || text.includes('bzip2') || text.includes('archive')) return 'tar-compression';
  if (text.includes('kill') || text.includes('signal') || text.includes('sigterm') || text.includes('sigkill') || text.includes('sigkill (9)') || text.includes('killall')) return 'kill-signals';
  if (text.includes('sed') || text.includes('awk')) return 'sed-awk';
  if (text.includes('grep') || text.includes('egrep') || text.includes('regex')) return 'grep-regex';
  
  if (q.commandSnippet) {
    return q.commandSnippet.trim().split(' ')[0] || 'Linux Concept';
  }
  return q.category || 'umask';
}

/**
 * Map a flashcard to its best pedagogical topic
 */
export function mapFlashcardToPedagogicalTopic(card: {
  command?: string;
  question?: string;
  definition?: string;
  category?: string;
}): string {
  if (card.command) {
    const cmd = card.command.trim().split(' ')[0].toLowerCase();
    if (cmd === 'umask') return 'umask';
    if (cmd === 'chmod') return 'chmod-octal';
    if (cmd === 'chown' || cmd === 'chgrp') return 'chown-chgrp';
    if (cmd === 'ln') return 'hard-vs-soft-links';
    if (cmd === 'systemctl' || cmd === 'systemd' || cmd === 'journalctl') return 'systemd-systemctl';
    if (cmd === 'ping' || cmd === 'curl' || cmd === 'nc' || cmd === 'telnet') return 'network-ping-curl';
    if (cmd === 'ip' || cmd === 'route') return 'ip-route';
    if (cmd === 'mount' || cmd === 'umount' || cmd === 'fsck') return 'fstab-mount';
    if (cmd === 'find') return 'find-command';
    if (cmd === 'tar' || cmd === 'gzip' || cmd === 'bzip2') return 'tar-compression';
    if (cmd === 'kill' || cmd === 'killall' || cmd === 'pkill') return 'kill-signals';
    if (cmd === 'sed' || cmd === 'awk') return 'sed-awk';
    if (cmd === 'grep') return 'grep-regex';
    return card.command.trim();
  }
  return mapQuestionToPedagogicalTopic({
    question: card.question,
    category: card.category,
    explanation: card.definition,
  });
}
