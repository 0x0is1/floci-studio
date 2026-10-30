import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { CheckResult } from '@/main/types';

const execAsync = promisify(exec);

export function getRepoRoot(): string {
  let cur = path.resolve(__dirname);
  for (let i = 0; i < 5; i++) {
    if (existsSync(path.join(cur, 'frontends', 'playground')) && existsSync(path.join(cur, 'services', 'api'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return path.resolve(process.cwd());
}

export function checkNodeModulesExist(): { backend: boolean; frontend: boolean; allExist: boolean } {
  const root = getRepoRoot();
  const backend = existsSync(path.join(root, 'services', 'api', 'node_modules'));
  const frontend = existsSync(path.join(root, 'frontends', 'playground', 'node_modules'));
  return { backend, frontend, allExist: backend && frontend };
}

export async function installDependencies(onProgress?: (msg: string) => void): Promise<CheckResult> {
  const root = getRepoRoot();
  const { backend, frontend } = checkNodeModulesExist();
  try {
    if (!backend) {
      onProgress?.('Installing backend dependencies via npm...');
      const backendDir = path.join(root, 'services', 'api');
      await execAsync('npm install', { cwd: backendDir });
    }
    if (!frontend) {
      onProgress?.('Installing frontend dependencies via npm...');
      const frontendDir = path.join(root, 'frontends', 'playground');
      await execAsync('npm install', { cwd: frontendDir });
    }
    return { ok: true, detail: 'Dependencies verified and installed' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, detail: 'Failed installing dependencies', error: message };
  }
}
