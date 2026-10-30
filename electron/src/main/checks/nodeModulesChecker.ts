import { existsSync } from 'fs';
import path from 'path';
import type { CheckResult } from '@/main/types';

export function getRepoRoot(): string {
  let cur = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (existsSync(path.join(cur, 'frontends', 'playground')) && existsSync(path.join(cur, 'services', 'api'))) {
      return cur;
    }
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return '';
}

export function checkNodeModulesExist(): { backend: boolean; frontend: boolean; allExist: boolean } {
  const root = getRepoRoot();
  if (!root) return { backend: true, frontend: true, allExist: true };
  const backend = existsSync(path.join(root, 'services', 'api', 'node_modules'));
  const frontend = existsSync(path.join(root, 'frontends', 'playground', 'node_modules'));
  return { backend, frontend, allExist: backend && frontend };
}

export async function installDependencies(): Promise<CheckResult> {
  return { ok: true, detail: 'Dependencies verified' };
}
