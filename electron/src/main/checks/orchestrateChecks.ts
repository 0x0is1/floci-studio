import { checkDockerInstalled, checkDockerRunning, checkBunInstalled, checkInternetConnection } from '@/main/checks/systemChecker';
import { checkNodeModulesExist, installDependencies } from '@/main/checks/nodeModulesChecker';
import { startBackendServices, startFrontendProduction } from '@/main/checks/serviceManager';
import type { CheckStep } from '@/main/types';

export type StepUpdateFn = (step: CheckStep) => void;

export async function runFullPreflight(onUpdate: StepUpdateFn): Promise<boolean> {
  onUpdate({ id: 'bun', label: 'Bun Runtime', status: 'checking', detail: 'Verifying Bun installation...' });
  const bunRes = await checkBunInstalled();
  onUpdate({ id: 'bun', label: 'Bun Runtime', status: bunRes.ok ? 'ready' : 'error', detail: bunRes.detail, error: bunRes.error });
  if (!bunRes.ok) return false;

  onUpdate({ id: 'docker_cli', label: 'Docker CLI', status: 'checking', detail: 'Checking Docker CLI...' });
  const docCli = await checkDockerInstalled();
  onUpdate({ id: 'docker_cli', label: 'Docker CLI', status: docCli.ok ? 'ready' : 'error', detail: docCli.detail, error: docCli.error });
  if (!docCli.ok) return false;

  onUpdate({ id: 'docker_run', label: 'Docker Daemon', status: 'checking', detail: 'Verifying Docker engine...' });
  const docRun = await checkDockerRunning();
  onUpdate({ id: 'docker_run', label: 'Docker Daemon', status: docRun.ok ? 'ready' : 'error', detail: docRun.detail, error: docRun.error });
  if (!docRun.ok) return false;

  onUpdate({ id: 'modules', label: 'Dependencies', status: 'checking', detail: 'Checking node_modules...' });
  const { allExist } = checkNodeModulesExist();
  if (!allExist) {
    onUpdate({ id: 'modules', label: 'Dependencies', status: 'installing', detail: 'Installing dependencies...' });
    const instRes = await installDependencies();
    onUpdate({ id: 'modules', label: 'Dependencies', status: instRes.ok ? 'ready' : 'error', detail: instRes.detail, error: instRes.error });
    if (!instRes.ok) return false;
  } else {
    onUpdate({ id: 'modules', label: 'Dependencies', status: 'ready', detail: 'Dependencies present' });
  }

  const netRes = await checkInternetConnection();
  onUpdate({ id: 'network', label: 'Network Mode', status: netRes.ok ? 'ready' : 'warning', detail: netRes.detail });

  onUpdate({ id: 'backend', label: 'Backend Services', status: 'checking', detail: 'Starting Floci cloud services...' });
  const backRes = await startBackendServices();
  onUpdate({ id: 'backend', label: 'Backend Services', status: backRes.ok ? 'ready' : 'error', detail: backRes.detail, error: backRes.error });
  if (!backRes.ok) return false;

  onUpdate({ id: 'frontend', label: 'Studio Frontend', status: 'checking', detail: 'Verifying compiled Studio UI...' });
  const frontRes = await startFrontendProduction();
  onUpdate({ id: 'frontend', label: 'Studio Frontend', status: frontRes.ok ? 'ready' : 'error', detail: frontRes.detail, error: frontRes.error });
  return frontRes.ok;
}

