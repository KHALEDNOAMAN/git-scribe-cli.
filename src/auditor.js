import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { isInsideGitRepo, getGitStatus } from './git.js';

export function auditRepository(dir = process.cwd()) {
  const checks = [];

  // Check 1: Git Repository Initialized
  const isGit = isInsideGitRepo(dir);
  checks.push({
    name: 'Git Version Control',
    passed: isGit,
    points: 20,
    message: isGit ? 'Repository is version controlled with Git' : 'No .git directory found'
  });

  // Check 2: README.md presence & depth
  const readmeFiles = ['README.md', 'readme.md', 'README'];
  const readmeFound = readmeFiles.find(f => existsSync(path.join(dir, f)));
  let readmeScore = 0;
  let readmeMsg = 'Missing README.md';
  if (readmeFound) {
    const content = readFileSync(path.join(dir, readmeFound), 'utf-8');
    if (content.length > 500) {
      readmeScore = 20;
      readmeMsg = 'Comprehensive README.md present';
    } else {
      readmeScore = 10;
      readmeMsg = 'README.md exists but is minimal (<500 characters)';
    }
  }
  checks.push({
    name: 'Documentation (README)',
    passed: readmeScore > 0,
    points: readmeScore,
    maxPoints: 20,
    message: readmeMsg
  });

  // Check 3: LICENSE
  const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'];
  const licenseFound = licenseFiles.some(f => existsSync(path.join(dir, f)));
  checks.push({
    name: 'Open Source License',
    passed: licenseFound,
    points: licenseFound ? 20 : 0,
    maxPoints: 20,
    message: licenseFound ? 'License file detected' : 'Missing LICENSE file (recommended: MIT/Apache)'
  });

  // Check 4: .gitignore
  const gitignoreFound = existsSync(path.join(dir, '.gitignore'));
  checks.push({
    name: '.gitignore Configuration',
    passed: gitignoreFound,
    points: gitignoreFound ? 15 : 0,
    maxPoints: 15,
    message: gitignoreFound ? '.gitignore is properly configured' : 'Missing .gitignore file'
  });

  // Check 5: CI/CD Workflows
  const workflowsDir = path.join(dir, '.github', 'workflows');
  let hasWorkflows = false;
  if (existsSync(workflowsDir)) {
    try {
      const files = readdirSync(workflowsDir);
      hasWorkflows = files.some(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    } catch {
      hasWorkflows = false;
    }
  }
  checks.push({
    name: 'CI/CD Automation',
    passed: hasWorkflows,
    points: hasWorkflows ? 15 : 0,
    maxPoints: 15,
    message: hasWorkflows ? 'GitHub Actions CI/CD workflow found' : 'No .github/workflows detected'
  });

  // Check 6: Clean working directory
  const status = getGitStatus(dir);
  const isClean = status.isGit ? status.clean : false;
  checks.push({
    name: 'Working Tree Hygiene',
    passed: isClean,
    points: isClean ? 10 : 0,
    maxPoints: 10,
    message: isClean ? 'Working directory is clean (zero uncommitted changes)' : `${status.uncommittedCount} uncommitted changes pending`
  });

  // Compute total
  const totalPoints = checks.reduce((sum, c) => sum + (c.points || 0), 0);
  const maxPossible = 100;
  const scorePct = Math.round((totalPoints / maxPossible) * 100);

  let grade = 'F';
  if (scorePct >= 95) grade = 'A+';
  else if (scorePct >= 85) grade = 'A';
  else if (scorePct >= 70) grade = 'B';
  else if (scorePct >= 50) grade = 'C';

  const recommendations = checks.filter(c => !c.passed).map(c => `• ${c.name}: ${c.message}`);

  return {
    score: scorePct,
    grade,
    checks,
    recommendations
  };
}
