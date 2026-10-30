import { checkDockerInstalled, checkDockerRunning, checkInternetConnection } from '@/main/checks/systemChecker';
import { startBackendServices, startFrontendProduction } from '@/main/checks/serviceManager';
import type { CheckStep } from '@/main/types';

export type StepUpdateFn = (step: CheckStep) => void;

export async function runFullPreflight(onUpdate: StepUpdateFn): Promise<boolean> {
  try {
    onUpdate({ id: 'docker_cli', label: 'Docker CLI', status: 'checking', detail: 'Checking Docker CLI...' });
    const docCli = await checkDockerInstalled();
    onUpdate({ id: 'docker_cli', label: 'Docker CLI', status: docCli.ok ? 'ready' : 'error', detail: docCli.detail, error: docCli.error });
    if (!docCli.ok) return false;

    onUpdate({ id: 'docker_run', label: 'Docker Daemon', status: 'checking', detail: 'Verifying Docker engine...' });
    const docRun = await checkDockerRunning();
    onUpdate({ id: 'docker_run', label: 'Docker Engine', status: docRun.ok ? 'ready' : 'error', detail: docRun.detail, error: docRun.error });
    if (!docRun.ok) return false;

    const netRes = await checkInternetConnection();
    onUpdate({ id: 'network', label: 'Network Mode', status: netRes.ok ? 'ready' : 'warning', detail: netRes.detail });

    onUpdate({ id: 'backend', label: 'Floci Cloud Services', status: 'checking', detail: 'Starting Floci cloud services...' });
    const backRes = await startBackendServices((detail) => {
      onUpdate({ id: 'backend', label: 'Floci Cloud Services', status: 'checking', detail });
    });
    onUpdate({ id: 'backend', label: 'Floci Cloud Services', status: backRes.ok ? 'ready' : 'error', detail: backRes.detail, error: backRes.error });
    if (!backRes.ok) return false;

    onUpdate({ id: 'frontend', label: 'Studio Frontend', status: 'checking', detail: 'Verifying compiled Studio UI...' });
    const frontRes = await startFrontendProduction();
    onUpdate({ id: 'frontend', label: 'Studio Frontend', status: frontRes.ok ? 'ready' : 'error', detail: frontRes.detail, error: frontRes.error });
    return frontRes.ok;
  } catch (err: any) {
    onUpdate({
      id: 'backend',
      label: 'Floci Cloud Services',
      status: 'error',
      detail: 'Unexpected startup failure',
      error: err?.message || String(err),
    });
    return false;
  }
}
