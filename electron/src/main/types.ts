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
  actionRequired?: boolean;
}

export interface SystemCheckState {
  isChecking: boolean;
  isComplete: boolean;
  hasErrors: boolean;
  steps: Record<string, CheckStep>;
  offlineMode: boolean;
}

export interface CheckResult {
  ok: boolean;
  version?: string;
  detail: string;
  error?: string;
}
