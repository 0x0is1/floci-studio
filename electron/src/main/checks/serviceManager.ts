import { spawn, exec, type ChildProcess } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';
import { promisify } from 'util';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';
import { checkBackendHealth, checkFrontendHealth, waitForHealthy } from '@/main/checks/healthChecker';
import type { CheckResult } from '@/main/types';

const execAsync = promisify(exec);
let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

export async function startBackendServices(): Promise<CheckResult> {
  const currentHealth = await checkBackendHealth();
  if (currentHealth.ok) return currentHealth;

  const root = getRepoRoot();
  const composePath = path.join(root, 'services', 'docker-compose.yml');
  try {
    await execAsync(`docker compose -f "${composePath}" up -d`);
  } catch {
    const apiDir = path.join(root, 'services', 'api');
    backendProcess = spawn('bun', ['src/index.ts'], { cwd: apiDir, shell: true });
  }
  return waitForHealthy(checkBackendHealth, 15, 600);
}

export async function startFrontendProduction(): Promise<CheckResult> {
  const currentHealth = await checkFrontendHealth();
  if (currentHealth.ok) return currentHealth;

  const root = getRepoRoot();
  const playgroundDir = path.join(root, 'frontends', 'playground');
  const buildId = path.join(playgroundDir, '.next', 'BUILD_ID');
  if (!existsSync(buildId)) {
    try {
      await execAsync('bun run build', { cwd: playgroundDir });
    } catch {
      await execAsync('npm run build', { cwd: playgroundDir });
    }
  }

  frontendProcess = spawn('bun', ['run', 'start', '-p', '3000'], { cwd: playgroundDir, shell: true });
  return waitForHealthy(checkFrontendHealth, 15, 600);
}

export function cleanupProcesses(): void {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
  if (frontendProcess) {
    frontendProcess.kill();
    frontendProcess = null;
  }
}
