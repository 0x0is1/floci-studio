import { exec, type ChildProcess } from 'child_process';
import path from 'path';
import { existsSync, cpSync, rmSync } from 'fs';
import { promisify } from 'util';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';
import { checkBackendHealth, checkFrontendHealth, waitForHealthy } from '@/main/checks/healthChecker';
import type { CheckResult } from '@/main/types';

const execAsync = promisify(exec);
let backendProcess: ChildProcess | null = null;

export async function startBackendServices(): Promise<CheckResult> {
  const currentHealth = await checkBackendHealth();
  if (currentHealth.ok) return currentHealth;

  const root = getRepoRoot();
  const composePath = path.join(root, 'services', 'docker-compose.yml');
  try {
    await execAsync(`docker compose -f "${composePath}" up -d`);
  } catch (err: any) {
    return { ok: false, detail: 'Failed to start Docker Compose services', error: err.message };
  }
  return waitForHealthy(checkBackendHealth, 20, 600);
}

export async function startFrontendProduction(): Promise<CheckResult> {
  const currentHealth = await checkFrontendHealth();
  if (currentHealth.ok) return currentHealth;

  const root = getRepoRoot();
  const playgroundDir = path.join(root, 'frontends', 'playground');
  try {
    await execAsync('bun run build', { cwd: playgroundDir });
  } catch {
    await execAsync('npm run build', { cwd: playgroundDir });
  }

  const outSrc = path.join(playgroundDir, 'out');
  const outDest = path.join(root, 'electron', 'studio', 'out');
  if (existsSync(outSrc)) {
    if (existsSync(outDest)) rmSync(outDest, { recursive: true, force: true });
    cpSync(outSrc, outDest, { recursive: true });
  }

  return checkFrontendHealth();
}

export function cleanupProcesses(): void {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}
