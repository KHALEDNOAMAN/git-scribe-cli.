import { execSync } from 'node:child_process';
import { parseCommit } from './commitParser.js';

export function isInsideGitRepo(cwd = process.cwd()) {
  try {
    const res = execSync('git rev-parse --is-inside-work-tree', { cwd, stdio: 'pipe' }).toString().trim();
    return res === 'true';
  } catch {
    return false;
  }
}

export function getGitCommits(options = {}) {
  const { cwd = process.cwd(), maxCount = 50 } = options;
  if (!isInsideGitRepo(cwd)) {
    return [];
  }

  try {
    // Delimiter for parsing hash, author, date, and full message
    const delimiter = '---GS_DELIMITER---';
    const format = `%H%x1f%an%x1f%ad%x1f%B${delimiter}`;
    const output = execSync(`git log -n ${maxCount} --pretty=format:"${format}"`, {
      cwd,
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    const rawCommits = output.split(delimiter).filter(c => c.trim().length > 0);
    const parsed = [];

    for (const raw of rawCommits) {
      const parts = raw.trim().split('\x1f');
      if (parts.length >= 4) {
        const [hash, author, date, message] = parts;
        const commit = parseCommit(message, hash, author, date);
        if (commit) parsed.push(commit);
      }
    }

    return parsed;
  } catch (err) {
    return [];
  }
}

export function getGitStatus(cwd = process.cwd()) {
  if (!isInsideGitRepo(cwd)) {
    return { isGit: false, clean: false, uncommittedCount: 0 };
  }

  try {
    const status = execSync('git status --porcelain', { cwd, stdio: 'pipe', encoding: 'utf-8' });
    const lines = status.split(/\r?\n/).filter(l => l.trim().length > 0);
    return {
      isGit: true,
      clean: lines.length === 0,
      uncommittedCount: lines.length
    };
  } catch {
    return { isGit: true, clean: false, uncommittedCount: 0 };
  }
}

export function getRemoteUrl(cwd = process.cwd()) {
  if (!isInsideGitRepo(cwd)) return '';
  try {
    const remotes = execSync('git remote -v', { cwd, stdio: 'pipe', encoding: 'utf-8' });
    const m = remotes.match(/origin\s+([^\s]+)\s+\(push\)/);
    if (m) {
      let url = m[1];
      if (url.startsWith('git@github.com:')) {
        url = 'https://github.com/' + url.slice('git@github.com:'.length).replace(/\.git$/, '');
      }
      return url.replace(/\.git$/, '');
    }
  } catch {
    // No remote
  }
  return '';
}
