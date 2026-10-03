#!/usr/bin/env node

import { runCli } from '../src/cli.js';

runCli().then(code => {
  process.exit(code || 0);
}).catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
