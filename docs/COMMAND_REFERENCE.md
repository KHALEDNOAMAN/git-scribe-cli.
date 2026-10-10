# git-scribe-cli - Command Reference

## Overview
A CLI tool for automating Git workflows and documentation.

## Commands
| Command | Description |
|---------|-------------|
| git-scribe init | Initialize in a project |
| git-scribe log | Generate formatted changelog |
| git-scribe stats | Repository statistics |
| git-scribe report | Full project report |

## Installation
```bash
npm install -g git-scribe-cli
```

## Usage Examples
```bash
# Generate changelog from commits
git-scribe log --since="2024-01-01" --format=markdown

# Get repo statistics
git-scribe stats --contributors --languages

# Full project report
git-scribe report --output report.md
```

## Configuration
Create `.git-scribe.yml` in your project root for custom settings.