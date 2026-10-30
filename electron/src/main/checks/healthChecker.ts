import http from 'http';
import type { CheckResult } from '@/main/types';

export function pingUrl(url: string, timeoutMs = 2500): Promise<boolean> {
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
  const healthy = await pingUrl('http://localhost:4501/health');
  if (healthy) return { ok: true, detail: 'Backend API healthy on port 4501' };
  const fallback = await pingUrl('http://localhost:4501/api/projects');
  if (fallback) return { ok: true, detail: 'Backend API ready on port 4501' };
  return { ok: false, detail: 'Backend service unreachable', error: 'Port 4501 not responding' };
}

export async function checkFrontendHealth(): Promise<CheckResult> {
  const healthy = await pingUrl('http://localhost:3000');
  if (healthy) return { ok: true, detail: 'Studio frontend healthy on port 3000' };
  return { ok: false, detail: 'Frontend service unreachable', error: 'Port 3000 not responding' };
}

export async function waitForHealthy(
  checkFn: () => Promise<CheckResult>,
  maxAttempts = 30,
  delayMs = 1000
): Promise<CheckResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await checkFn();
    if (res.ok) return res;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return { ok: false, detail: 'Service health check timed out', error: 'Timeout after 30 attempts' };
}
