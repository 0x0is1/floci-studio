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

