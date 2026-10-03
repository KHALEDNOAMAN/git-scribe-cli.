import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommit } from '../src/commitParser.js';
import { generateChangelog } from '../src/changelogGenerator.js';

test('Changelog Generator Suite', async (t) => {
  await t.test('generates formatted Markdown with sections and commit hashes', () => {
    const commits = [
      parseCommit('feat(auth): support OAuth2 tokens', '111122223333'),
      parseCommit('fix(cache): resolve cache invalidation bug', '444455556666'),
      parseCommit('feat(api)!: remove legacy XML responses', '777788889999')
    ];

    const changelog = generateChangelog(commits, {
      version: 'v2.0.0',
      date: '2026-10-03',
      repoUrl: 'https://github.com/org/repo'
    });

    assert.ok(changelog.includes('## [v2.0.0] - 2026-10-03'));
    assert.ok(changelog.includes('💥 Breaking Changes'));
    assert.ok(changelog.includes('🚀 Features & Enhancements'));
    assert.ok(changelog.includes('🐛 Bug Fixes'));
    assert.ok(changelog.includes('([1111222](https://github.com/org/repo/commit/1111222))'));
  });

  await t.test('handles empty commits list gracefully', () => {
    const changelog = generateChangelog([], { version: 'v1.0.0' });
    assert.ok(changelog.includes('## [v1.0.0]'));
  });
});
