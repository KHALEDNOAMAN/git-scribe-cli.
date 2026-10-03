# Git-Scribe CLI

[![CI Pipeline](https://github.com/USER/git-scribe-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/USER/git-scribe-cli/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> A modern developer automation CLI tool for automated release notes, Conventional Commits changelog generation, and comprehensive repository health audits.

---

## 🌟 Highlights & Features

- **📝 Automated Conventional Changelogs:** Inspects Git history, categorizes commits (`feat`, `fix`, `docs`, `perf`, `refactor`), detects breaking changes (`BREAKING CHANGE:` or `!`), and generates formatted Markdown.
- **🔍 Repository Hygiene Auditor:** Analyzes repository best practices (Git tracking, README quality, LICENSE, `.gitignore`, CI/CD workflows, working tree state) and scores project health from 0 to 100 with recommendations.
- **🛠️ Project Scaffolding:** Instantly scaffolds industry-standard `.editorconfig`, `.gitattributes`, and GitHub PR review templates with a single command.
- **⚡ Zero External Dependencies:** Built with pure modern Node.js standard libraries (`node:child_process`, `node:fs`, `node:test`).
- **🧪 Built-in Test Suite:** Full unit test coverage for commit parsing, changelog generation, auditor rules, and template scaffolding.

---

## 🏗️ Architecture

```
git-scribe-cli/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Matrix testing pipeline
├── bin/
│   └── git-scribe.js             # Executable CLI binary entry
├── src/
│   ├── index.js                  # Module exports
│   ├── cli.js                    # CLI argument router & handlers
│   ├── commitParser.js           # Conventional Commits 1.0.0 parser
│   ├── changelogGenerator.js     # Markdown release notes builder
│   ├── auditor.js                # Repository hygiene score evaluator
│   ├── scaffolder.js             # Configuration file template generator
│   └── git.js                    # Child process Git inspection wrapper
├── tests/
│   ├── commitParser.test.js      # Parser tests
│   ├── changelogGenerator.test.js# Markdown formatting tests
│   ├── auditor.test.js           # Audit engine tests
│   └── scaffolder.test.js        # File generation tests
├── .gitignore
├── LICENSE                       # MIT License
├── package.json
└── README.md
```

---

## 🚀 Quickstart & Usage

### 1. Run Directly with Node
```bash
# Display help and available commands
node bin/git-scribe.js --help

# Audit the current repository health & score
node bin/git-scribe.js audit

# Generate changelog preview from commit history
node bin/git-scribe.js changelog --version v1.0.0

# Write changelog directly into CHANGELOG.md
node bin/git-scribe.js changelog --version v1.0.0 --write

# Scaffold standard repo files (.editorconfig, PR template)
node bin/git-scribe.js init
```

### 2. Run Automated Test Suite
```bash
npm test
```

### 3. Link as Global CLI (Optional)
```bash
npm link
# You can now invoke 'git-scribe' from any terminal!
git-scribe audit
```

---

## 🚢 Publishing to GitHub

```bash
# 1. Initialize local repository (already prepared)
git init
git add .
git commit -m "feat: initial commit for git-scribe-cli"

# 2. Add remote repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/git-scribe-cli.git

# 3. Push to GitHub
git push -u origin main
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
