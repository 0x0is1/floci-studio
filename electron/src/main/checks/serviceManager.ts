import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';
import { checkBackendHealth, checkFrontendHealth, waitForHealthy } from '@/main/checks/healthChecker';
import type { CheckResult } from '@/main/types';

let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

export async function startBackendServices(): Promise<CheckResult> {
  const currentHealth = await checkBackendHealth();
  if (currentHealth.ok) return currentHealth;
  const root = getRepoRoot();
  const composePath = path.join(root, 'services', 'docker-compose.yml');
  try {
    spawn('docker', ['compose', '-f', composePath, 'up', '-d'], { shell: true, stdio: 'ignore' });
  } catch {
    const apiDir = path.join(root, 'services', 'api');
    backendProcess = spawn('bun', ['src/index.ts'], { cwd: apiDir, shell: true });
  }
  return waitForHealthy(checkBackendHealth, 25, 1000);
}

export async function startFrontendProduction(): Promise<CheckResult> {
  const currentHealth = await checkFrontendHealth();
  if (currentHealth.ok) return currentHealth;
  const root = getRepoRoot();
  const playgroundDir = path.join(root, 'frontends', 'playground');
  const dotNext = path.join(playgroundDir, '.next');
  if (!existsSync(dotNext)) {
    const buildProc = spawn('bun', ['run', 'build'], { cwd: playgroundDir, shell: true, stdio: 'inherit' });
    await new Promise((resolve) => buildProc.on('exit', resolve));
  }
  frontendProcess = spawn('bun', ['run', 'start', '-p', '3000'], { cwd: playgroundDir, shell: true });
  return waitForHealthy(checkFrontendHealth, 25, 1000);
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
