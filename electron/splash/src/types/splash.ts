export type StepStatus =
  | 'pending'
  | 'checking'
  | 'installing'
  | 'ready'
  | 'warning'
  | 'error';

export interface CheckStep {
  id: string;
  label: string;
  status: StepStatus;
  detail: string;
  error?: string;
}

export interface ElectronAPI {
  startChecks: () => Promise<boolean>;
  launchStudio: () => Promise<boolean>;
  restartChecks: () => Promise<boolean>;
  onCheckProgress: (callback: (step: CheckStep) => void) => void;
  offCheckProgress: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const INITIAL_STEPS: Record<string, CheckStep> = {
  bun: { id: 'bun', label: 'Bun Runtime', status: 'pending', detail: 'Waiting' },
  docker_cli: { id: 'docker_cli', label: 'Docker CLI', status: 'pending', detail: 'Waiting' },
  docker_run: { id: 'docker_run', label: 'Docker Engine', status: 'pending', detail: 'Waiting' },
  modules: { id: 'modules', label: 'Dependencies', status: 'pending', detail: 'Waiting' },
  network: { id: 'network', label: 'Network Mode', status: 'pending', detail: 'Checking' },
  backend: { id: 'backend', label: 'Backend Services', status: 'pending', detail: 'Waiting' },
  frontend: { id: 'frontend', label: 'Studio Frontend', status: 'pending', detail: 'Waiting' },
};


