import { exec } from 'child_process';
import { dockerReq } from './dockerService';

export interface DockerHealthStatus {
  status: 'running' | 'paused' | 'stopped';
  error?: string;
}

export async function checkDockerStatus(): Promise<DockerHealthStatus> {
  try {
    const res = await dockerReq('GET', '/_ping');
    if (res.status === 200 || res.body === 'OK') {
      return { status: 'running' };
    }
  } catch {}

  return new Promise((resolve) => {
    exec('docker ps --format {{.ID}}', { timeout: 2000 }, (err, _stdout, stderr) => {
      const combined = `${err?.message || ''} ${stderr || ''}`.toLowerCase();
      if (combined.includes('paused')) {
        return resolve({ status: 'paused', error: 'Docker Desktop is paused' });
      }
      if (err) {
        const isTimeout = combined.includes('timeout') || err.killed;
        const status = isTimeout ? 'paused' : 'stopped';
        const msg = isTimeout ? 'Docker daemon connection timed out' : (err.message || 'Docker daemon unreachable');
        return resolve({ status, error: msg });
      }
      return resolve({ status: 'running' });
    });
  });
}
