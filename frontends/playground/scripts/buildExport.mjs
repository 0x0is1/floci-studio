import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(import.meta.dirname, '..');
const patchScript = path.join(root, 'scripts', 'patchDynamicParams.mjs');

spawnSync(process.execPath, [patchScript, 'false'], { stdio: 'inherit' });

const result = spawnSync('bunx', ['next', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, BUILD_MODE: 'export' },
  shell: process.platform === 'win32',
});

spawnSync(process.execPath, [patchScript, 'true'], { stdio: 'inherit' });

process.exit(result.status ?? 1);
