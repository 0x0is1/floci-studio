import http from 'http';
import path from 'path';
import { existsSync } from 'fs';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';
import type { CheckResult } from '@/main/types';

export function pingUrl(url: string, timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const req = http.request(
        {
          hostname: parsed.hostname,
          port: parsed.port,
          path: parsed.pathname + parsed.search,
          method: 'GET',
          timeout: timeoutMs,
        },
        (res) => resolve(Boolean(res.statusCode && res.statusCode >= 200 && res.statusCode < 400))
      );
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

export async function checkBackendHealth(): Promise<CheckResult> {
  const healthy = await pingUrl('http://127.0.0.1:4501/api/health');
  if (healthy) return { ok: true, detail: 'Backend API healthy on port 4501' };
  const fallback = await pingUrl('http://127.0.0.1:4501/api/projects');
  if (fallback) return { ok: true, detail: 'Backend API ready on port 4501' };
  return { ok: false, detail: 'Backend unreachable', error: 'Port 4501 not responding' };
}

export async function checkFrontendHealth(): Promise<CheckResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { app } = require('electron');
    if (app && typeof app.getAppPath === 'function') {
      const packaged = path.join(app.getAppPath(), 'studio', 'out', 'index.html');
      if (existsSync(packaged)) return { ok: true, detail: 'Compiled Studio bundle verified' };
    }
  } catch {}

  const root = getRepoRoot();
  if (root) {
    const repoOut = path.join(root, 'frontends/playground/out/index.html');
    if (existsSync(repoOut)) return { ok: true, detail: 'Compiled Studio bundle verified' };
    const studioOut = path.join(root, 'electron/studio/out/index.html');
    if (existsSync(studioOut)) return { ok: true, detail: 'Compiled Studio bundle verified' };
  }

  const direct = path.resolve('studio/out/index.html');
  if (existsSync(direct)) return { ok: true, detail: 'Compiled Studio bundle verified' };

  return { ok: false, detail: 'Studio bundle missing', error: 'Static HTML build not found' };
}

export async function waitForHealthy(
  checkFn: () => Promise<CheckResult>,
  maxAttempts = 35,
  delayMs = 800,
  onProgress?: (detail: string) => void
): Promise<CheckResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await checkFn();
    if (res.ok) return res;
    onProgress?.(`Waiting for Floci API (${i + 1}/${maxAttempts})...`);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return checkFn();
}
