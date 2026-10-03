import { groupCommitsByType } from './commitParser.js';

const SECTION_HEADERS = {
  breaking: '💥 Breaking Changes',
  feat: '🚀 Features & Enhancements',
  fix: '🐛 Bug Fixes',
  perf: '⚡ Performance Improvements',
  refactor: '♻️ Refactoring',
  docs: '📚 Documentation',
  test: '🧪 Tests & QA',
  chore: '🔧 Maintenance & Tooling',
  other: '📦 Other Changes'
};

export function generateChangelog(commits, options = {}) {
  const { version = 'Unreleased', date = new Date().toISOString().slice(0, 10), repoUrl = '' } = options;
  const groups = groupCommitsByType(commits);

  const sections = [];
  sections.push(`## [${version}] - ${date}\n`);

  // Breaking changes first
  if (groups.breaking.length > 0) {
    sections.push(`### ${SECTION_HEADERS.breaking}\n`);
    for (const c of groups.breaking) {
      const scopeText = c.scope ? `**${c.scope}:** ` : '';
      const hashLink = c.hash && repoUrl ? ` ([${c.hash}](${repoUrl}/commit/${c.hash}))` : c.hash ? ` (${c.hash})` : '';
      sections.push(`- ⚠️ ${scopeText}${c.subject}${hashLink}`);
    }
    sections.push('');
  }

  // Iterate other categories
  for (const [key, label] of Object.entries(SECTION_HEADERS)) {
    if (key === 'breaking') continue;
    const list = groups[key];
    if (list && list.length > 0) {
      sections.push(`### ${label}\n`);
      for (const c of list) {
        const scopeText = c.scope ? `**${c.scope}:** ` : '';
        const hashLink = c.hash && repoUrl ? ` ([${c.hash}](${repoUrl}/commit/${c.hash}))` : c.hash ? ` (${c.hash})` : '';
        sections.push(`- ${scopeText}${c.subject}${hashLink}`);
      }
      sections.push('');
    }
  }

  return sections.join('\n');
}
