import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { auditRepository } from '../src/auditor.js';

test('Auditor Suite', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scribe-audit-'));

  t.after(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  await t.test('detects missing files on fresh empty directory', () => {
    const report = auditRepository(tmpDir);
    assert.ok(report.score < 50);
    assert.equal(report.grade, 'F');
    assert.ok(report.recommendations.length > 0);
  });

  await t.test('awards points when standard files are added', async () => {
    await fs.writeFile(path.join(tmpDir, 'README.md'), '# Title\n' + 'A'.repeat(600));
    await fs.writeFile(path.join(tmpDir, 'LICENSE'), 'MIT License');
    await fs.writeFile(path.join(tmpDir, '.gitignore'), 'node_modules/\n');

    const report = auditRepository(tmpDir);
    assert.ok(report.score >= 50);
  });
});
