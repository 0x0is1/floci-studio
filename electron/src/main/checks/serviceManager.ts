import { exec, type ChildProcess } from 'child_process';
import path from 'path';
import { existsSync, cpSync, rmSync } from 'fs';
import { promisify } from 'util';
import { app } from 'electron';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';
import { checkBackendHealth, checkFrontendHealth, waitForHealthy } from '@/main/checks/healthChecker';
import type { CheckResult } from '@/main/types';

const execAsync = promisify(exec);
let backendProcess: ChildProcess | null = null;

export function getServicesDir(): string {
  if (app && app.isPackaged) {
    const userRuntime = path.join(app.getPath('userData'), 'floci-runtime');
    const targetCompose = path.join(userRuntime, 'docker-compose.yml');
    const bundled = path.join(app.getAppPath(), 'runtime-services');
    if (!existsSync(targetCompose) && existsSync(bundled)) {
      cpSync(bundled, userRuntime, { recursive: true });
    }
    return userRuntime;
  }

  const repo = getRepoRoot();
  if (repo) {
    const repoServices = path.join(repo, 'services');
    if (existsSync(path.join(repoServices, 'docker-compose.yml'))) return repoServices;
  }

  const fallback = app ? path.join(app.getPath('userData'), 'floci-runtime') : path.resolve('services');
  return fallback;
}

export async function startBackendServices(): Promise<CheckResult> {
  const currentHealth = await checkBackendHealth();
  if (currentHealth.ok) return currentHealth;

  const servicesDir = getServicesDir();
  const composePath = path.join(servicesDir, 'docker-compose.yml');
  if (!existsSync(composePath)) {
    return { ok: false, detail: 'Compose file not found', error: `Missing ${composePath}` };
  }

  try {
    await execAsync(`docker compose -f "${composePath}" up -d`, { cwd: servicesDir });
  } catch (err: any) {
    return { ok: false, detail: 'Failed to start Docker Compose services', error: err.message };
  }
  return waitForHealthy(checkBackendHealth, 25, 800);
}

export async function startFrontendProduction(): Promise<CheckResult> {
  const currentHealth = await checkFrontendHealth();
  if (currentHealth.ok) return currentHealth;
  if (app && app.isPackaged) {
    return { ok: false, detail: 'Studio bundle missing in package', error: 'Packaged studio/out/index.html not found' };
  }

  const root = getRepoRoot();
  if (!root) return currentHealth;
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
