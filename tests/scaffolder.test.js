import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { scaffoldRepoConventions } from '../src/scaffolder.js';

test('Scaffolder Suite', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scribe-scaffold-'));

  t.after(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  await t.test('creates .editorconfig, .gitattributes, and pull_request_template.md', async () => {
    const created = await scaffoldRepoConventions(tmpDir);
    assert.equal(created.length, 3);
    assert.ok(existsSync(path.join(tmpDir, '.editorconfig')));
    assert.ok(existsSync(path.join(tmpDir, '.gitattributes')));
    assert.ok(existsSync(path.join(tmpDir, '.github', 'pull_request_template.md')));
  });

  await t.test('does not overwrite existing files on second run', async () => {
    const createdAgain = await scaffoldRepoConventions(tmpDir);
    assert.equal(createdAgain.length, 0);
  });
});
