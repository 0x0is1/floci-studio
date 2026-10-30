import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { existsSync, rmSync, cpSync } from 'fs';
import { app } from 'electron';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';
import { copyDirectorySync } from '@/main/checks/copyDirHelper';
import { checkBackendHealth, checkFrontendHealth, waitForHealthy } from '@/main/checks/healthChecker';
import type { CheckResult } from '@/main/types';

let backendProcess: ChildProcess | null = null;

export function getServicesDir(): string {
  if (app && app.isPackaged) {
    const userRuntime = path.join(app.getPath('userData'), 'floci-runtime');
    const bundled = path.join(app.getAppPath(), 'runtime-services');
    if (existsSync(bundled)) copyDirectorySync(bundled, userRuntime);
    return userRuntime;
  }
  const repo = getRepoRoot();
  if (repo) {
    const repoServices = path.join(repo, 'services');
    if (existsSync(path.join(repoServices, 'docker-compose.yml'))) return repoServices;
  }
  return app ? path.join(app.getPath('userData'), 'floci-runtime') : path.resolve('services');
}

function runDockerCompose(
  composePath: string,
  cwd: string,
  onProgress?: (msg: string) => void
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    onProgress?.('Initializing Docker containers...');
    const proc = spawn('docker', ['compose', '-f', composePath, 'up', '-d', '--build'], { cwd, shell: true });
    let stderr = '';
    const parse = (data: Buffer | string) => {
      const text = data.toString();
      stderr += text;
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const clean = line.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').trim();
        if (clean) onProgress?.(clean.slice(0, 50));
      }
    };
    proc.stdout?.on('data', parse);
    proc.stderr?.on('data', parse);
    proc.on('error', (err) => resolve({ ok: false, error: err.message }));
    proc.on('close', (code) => {
      if (code === 0) resolve({ ok: true });
      else resolve({ ok: false, error: stderr.trim().split('\n').pop() || `Exit code ${code}` });
    });
  });
}

export async function startBackendServices(onProgress?: (msg: string) => void): Promise<CheckResult> {
  const currentHealth = await checkBackendHealth();
  if (currentHealth.ok) return currentHealth;

  const servicesDir = getServicesDir();
  const composePath = path.join(servicesDir, 'docker-compose.yml');
  if (!existsSync(composePath)) {
    return { ok: false, detail: 'Compose file not found', error: `Missing ${composePath}` };
  }

  const composeRes = await runDockerCompose(composePath, servicesDir, onProgress);
  if (!composeRes.ok) {
    return { ok: false, detail: 'Failed to start Docker Compose services', error: composeRes.error };
  }
  return waitForHealthy(checkBackendHealth, 40, 1000, onProgress);
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
