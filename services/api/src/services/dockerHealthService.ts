import { exec } from 'child_process';

export interface DockerHealthStatus {
  status: 'running' | 'paused' | 'stopped';
  error?: string;
}

export function checkDockerStatus(): Promise<DockerHealthStatus> {
  return new Promise((resolve) => {
    exec('docker ps --format {{.ID}}', { timeout: 2000 }, (err, _stdout, stderr) => {
      const combined = `${err?.message || ''} ${stderr || ''}`.toLowerCase();
      if (combined.includes('paused')) {
        return resolve({ status: 'paused', error: 'Docker Desktop is manually paused' });
      }
      if (err) {
        return resolve({ status: 'stopped', error: err.message || 'Docker daemon unreachable' });
      }
      return resolve({ status: 'running' });
    });
  });
}

