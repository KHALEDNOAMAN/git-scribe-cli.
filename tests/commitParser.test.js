import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommit, groupCommitsByType } from '../src/commitParser.js';

test('Conventional Commit Parser Suite', async (t) => {
  await t.test('parses simple feature commit', () => {
    const res = parseCommit('feat: add user authentication', 'abc123456');
    assert.equal(res.type, 'feat');
    assert.equal(res.scope, null);
    assert.equal(res.subject, 'add user authentication');
    assert.equal(res.isBreaking, false);
    assert.equal(res.hash, 'abc1234');
  });

  await t.test('parses scoped bug fix with breaking change indicator (!)', () => {
    const res = parseCommit('fix(api)!: drop deprecated v1 endpoints', 'def789012');
    assert.equal(res.type, 'fix');
    assert.equal(res.scope, 'api');
    assert.equal(res.isBreaking, true);
    assert.equal(res.subject, 'drop deprecated v1 endpoints');
  });

  await t.test('detects BREAKING CHANGE footer in commit body', () => {
    const message = 'refactor: restructure database config\n\nBREAKING CHANGE: DB_URL is now DATABASE_URL';
    const res = parseCommit(message);
    assert.equal(res.type, 'refactor');
    assert.equal(res.isBreaking, true);
  });

  await t.test('handles non-conventional commits gracefully', () => {
    const res = parseCommit('hotfix for production crash');
    assert.equal(res.type, 'other');
    assert.equal(res.subject, 'hotfix for production crash');
  });

  await t.test('groups commits into categorised buckets', () => {
    const commits = [
      parseCommit('feat: add dark mode'),
      parseCommit('fix: solve memory leak'),
      parseCommit('feat!: redesign navigation'),
      parseCommit('docs: update installation instructions')
    ];

    const groups = groupCommitsByType(commits);
    assert.equal(groups.feat.length, 2);
    assert.equal(groups.fix.length, 1);
    assert.equal(groups.breaking.length, 1);
    assert.equal(groups.docs.length, 1);
  });
});
