import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getGitCommits, getRemoteUrl } from './git.js';
import { generateChangelog } from './changelogGenerator.js';
import { auditRepository } from './auditor.js';
import { scaffoldRepoConventions } from './scaffolder.js';

export async function runCli(args = process.argv.slice(2)) {
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    return 0;
  }

  if (command === 'changelog') {
    return handleChangelog(args.slice(1));
  }

  if (command === 'audit') {
    return handleAudit(args.slice(1));
  }

  if (command === 'init') {
    return handleInit(args.slice(1));
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  return 1;
}

function printHelp() {
  console.log(`
Git-Scribe CLI — Developer Workflow & Release Automation Tool

USAGE:
  git-scribe <command> [options]

COMMANDS:
  changelog    Generate release notes / CHANGELOG.md from Conventional Commits
  audit        Inspect repository hygiene, score best practices, and suggest fixes
  init         Scaffold standard conventions (.editorconfig, PR template)
  help         Display this help menu

OPTIONS for 'changelog':
  --version <v>   Target release version tag (default: "v1.0.0")
  --write         Write output directly into CHANGELOG.md (prepends to file)
  --dry-run       Print markdown changelog to standard output without saving
  --count <n>     Max number of commits to scan (default: 50)

OPTIONS for 'audit':
  --dir <path>    Path to repository root to audit (default: current directory)

EXAMPLES:
  git-scribe changelog --version v1.1.0 --write
  git-scribe audit
  git-scribe init
`);
}

async function handleChangelog(args) {
  let version = 'v1.0.0';
  let writeToFile = false;
  let count = 50;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--version' && args[i + 1]) {
      version = args[++i];
    } else if (args[i] === '--write') {
      writeToFile = true;
    } else if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[++i], 10) || 50;
    }
  }

  const commits = getGitCommits({ count });
  const repoUrl = getRemoteUrl();
  const markdown = generateChangelog(commits, { version, repoUrl });

  if (writeToFile) {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    let existing = '';
    try {
      existing = await fs.readFile(changelogPath, 'utf-8');
    } catch {
      // New file
    }
    const header = '# Changelog\n\nAll notable changes to this project are documented in this file.\n\n';
    const cleanExisting = existing.startsWith(header) ? existing.slice(header.length) : existing;
    const finalContent = `${header}${markdown}\n${cleanExisting}`;
    await fs.writeFile(changelogPath, finalContent.trim() + '\n', 'utf-8');
    console.log(`[SUCCESS] Updated ${changelogPath} with ${commits.length} commits.`);
  } else {
    console.log('\n--- Generated Changelog ---\n');
    console.log(markdown);
    console.log('---------------------------\n(Use --write to prepend into CHANGELOG.md)\n');
  }

  return 0;
}

function handleAudit(args) {
  let targetDir = process.cwd();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) {
      targetDir = path.resolve(args[++i]);
    }
  }

  console.log(`\nAuditing repository at: ${targetDir}\n`);
  const report = auditRepository(targetDir);

  for (const check of report.checks) {
    const icon = check.passed ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${icon} ${check.name.padEnd(28)} (+${check.points} pts) -> ${check.message}`);
  }

  console.log('\n' + '='.repeat(55));
  console.log(` OVERALL HEALTH SCORE: ${report.score}/100  (Grade: ${report.grade})`);
  console.log('='.repeat(55));

  if (report.recommendations.length > 0) {
    console.log('\nRecommended Improvements:');
    report.recommendations.forEach(r => console.log('  ' + r));
  } else {
    console.log('\n🌟 Exceptional repository hygiene! Production-ready.');
  }
  console.log('');

  return report.score >= 70 ? 0 : 1;
}

async function handleInit(args) {
  let targetDir = process.cwd();
  const created = await scaffoldRepoConventions(targetDir);
  if (created.length === 0) {
    console.log('All standard configuration files already exist. No files created.');
  } else {
    console.log(`[SUCCESS] Created ${created.length} repository template files:`);
    created.forEach(f => console.log(`  + ${f}`));
  }
  return 0;
}
