/**
 * Conventional Commits Parser
 * Parses conventional commit messages: <type>[optional scope]: <description>
 * Follows Conventional Commits 1.0.0 specification.
 */

const COMMIT_REGEX = /^([a-zA-Z]+)(?:\(([a-zA-Z0-9_\-\.]+)\))?(!)?:\s*(.+)$/;

export function parseCommit(rawMessage, hash = '', author = '', date = '') {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return null;
  }

  const lines = rawMessage.trim().split(/\r?\n/);
  const header = lines[0].trim();
  const match = header.match(COMMIT_REGEX);

  let type = 'other';
  let scope = null;
  let isBreaking = false;
  let subject = header;

  if (match) {
    type = match[1].toLowerCase();
    scope = match[2] || null;
    isBreaking = Boolean(match[3]);
    subject = match[4].trim();
  }

  // Check for BREAKING CHANGE in body/footer
  const bodyLines = lines.slice(1);
  const breakingFooter = bodyLines.some(l => l.startsWith('BREAKING CHANGE:') || l.startsWith('BREAKING-CHANGE:'));
  if (breakingFooter) {
    isBreaking = true;
  }

  return {
    hash: hash ? hash.slice(0, 7) : '',
    type,
    scope,
    subject,
    isBreaking,
    body: bodyLines.join('\n').trim(),
    author,
    date
  };
}

export function groupCommitsByType(commits) {
  const groups = {
    breaking: [],
    feat: [],
    fix: [],
    perf: [],
    refactor: [],
    docs: [],
    test: [],
    chore: [],
    other: []
  };

  for (const c of commits) {
    if (!c) continue;
    if (c.isBreaking) {
      groups.breaking.push(c);
    }
    if (groups[c.type]) {
      groups[c.type].push(c);
    } else {
      groups.other.push(c);
    }
  }

  return groups;
}
