import { exec } from 'child_process';
import dns from 'dns';
import { promisify } from 'util';
import type { CheckResult } from '@/main/types';

const execAsync = promisify(exec);

export async function checkDockerInstalled(): Promise<CheckResult> {
  try {
    const { stdout } = await execAsync('docker --version');
    return { ok: true, version: stdout.trim(), detail: stdout.trim() };
  } catch {
    return { ok: false, detail: 'Docker CLI not found on system PATH', error: 'Docker is not installed' };
  }
}

export async function checkDockerRunning(): Promise<CheckResult> {
  try {
    await execAsync('docker ps');
    return { ok: true, detail: 'Docker daemon active and responding' };
  } catch {
    return { ok: false, detail: 'Docker daemon is not running', error: 'Please start Docker Desktop' };
  }
}

export async function checkInternetConnection(): Promise<CheckResult> {
  return new Promise((resolve) => {
    dns.lookup('github.com', (err) => {
      if (err) {
        resolve({ ok: false, detail: 'Operating in Local Offline Mode', error: 'No internet connection' });
      } else {
        resolve({ ok: true, detail: 'Internet connected' });
      }
    });
  });
}
