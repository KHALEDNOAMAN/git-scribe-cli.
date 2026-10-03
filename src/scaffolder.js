import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';

export async function scaffoldRepoConventions(dir = process.cwd()) {
  const created = [];

  // 1. .editorconfig
  const editorConfigPath = path.join(dir, '.editorconfig');
  if (!existsSync(editorConfigPath)) {
    const editorConfigContent = `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
`;
    await fs.writeFile(editorConfigPath, editorConfigContent, 'utf-8');
    created.push('.editorconfig');
  }

  // 2. .gitattributes
  const gitattributesPath = path.join(dir, '.gitattributes');
  if (!existsSync(gitattributesPath)) {
    const gitattributesContent = `* text=auto eol=lf
*.png binary
*.jpg binary
*.ico binary
`;
    await fs.writeFile(gitattributesPath, gitattributesContent, 'utf-8');
    created.push('.gitattributes');
  }

  // 3. PR Template
  const prTemplateDir = path.join(dir, '.github');
  const prTemplatePath = path.join(prTemplateDir, 'pull_request_template.md');
  if (!existsSync(prTemplatePath)) {
    await fs.mkdir(prTemplateDir, { recursive: true });
    const prTemplateContent = `## Description
Provide a brief summary of the changes proposed in this pull request.

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] 🚀 New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that alters existing behavior)
- [ ] 📚 Documentation update

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have added tests that prove my fix is effective or feature works
- [ ] All new and existing automated tests passed
`;
    await fs.writeFile(prTemplatePath, prTemplateContent, 'utf-8');
    created.push('.github/pull_request_template.md');
  }

  return created;
}
